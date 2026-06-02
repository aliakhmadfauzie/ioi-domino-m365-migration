/**
 * App Initialization Utility
 * 
 * The SDK's app-gen-data-client.ts calls initialize() at module load time.
 * This creates a race condition: React components may try to access data before
 * initialization completes. We solve this by:
 * 1. Tracking initialization state with useSyncExternalStore (no async gaps)
 * 2. Testing ACTUAL data layer readiness before marking as initialized
 * 3. Polling until the data model config is no longer "being updated"
 * 
 * Enhanced with:
 * - Extended timeouts and longer delays to handle slow connections
 * - Better error detection for transient failures
 * - Initial stabilization period before checking data layer
 */

import { getContext } from '@microsoft/power-apps/app';
import { useSyncExternalStore } from 'react';

// Module-level state (synchronous, no async gaps)
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

// Configuration for initialization timing
const INIT_CONFIG = {
  // Initial stabilization delay before checking SDK (ms) - REDUCED for better startup speed
  initialStabilizationDelay: 1000,
  // Maximum attempts to check data layer readiness
  maxAttempts: 80,
  // Initial delay between attempts (ms)
  initialDelayMs: 400,
  // Maximum delay between attempts (ms)
  maxDelayMs: 3000,
  // Backoff multiplier
  backoffMultiplier: 1.25,
  // Minimum time to show loading screens
  minLoadingTimeMs: 1500,
  // Additional delay after connector test passes
  postConnectorDelay: 500,
};

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): boolean {
  return isInitialized;
}

function notifyListeners(): void {
  listeners.forEach((listener: () => void) => listener());
}

function isLocalDevHost(): boolean {
  if (typeof window === 'undefined') return false;
  return ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
}

/**
 * Delay helper
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if an error message indicates a transient/recoverable error
 */
function isTransientError(errorMessage: string): boolean {
  const transientPatterns = [
    'currently being updated',
    'not available',
    'not initialized',
    'configuration',
    'Timed out',
    'retrieveMultipleRecords',
    'In Memory Data',
    'data model',
    'Data Provi', // Partial match for 'Data Provider'
    'timeout',
    'network',
    'ECONNRESET',
    'ETIMEDOUT',
  ];
  
  const lowerMessage = errorMessage.toLowerCase();
  return transientPatterns.some((pattern) => 
    lowerMessage.includes(pattern.toLowerCase())
  );
}

/**
 * Wait for the SDK data layer to be fully ready.
 * Tests actual data layer readiness by attempting to get context
 * and checking for transient errors.
 */
async function waitForDataLayerReady(): Promise<void> {
  const { maxAttempts, initialDelayMs, maxDelayMs, backoffMultiplier } = INIT_CONFIG;
  let delayMs = initialDelayMs;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Test context availability
      const context = await getContext();
      if (!context) {
        throw new Error('Context not available');
      }
      
      // If we get here without error, the SDK is ready
      console.log(`[AppInit] SDK initialized after ${attempt} attempt(s)`);
      return;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (isTransientError(errorMessage) && attempt < maxAttempts) {
        console.log(`[AppInit] Data layer not ready (attempt ${attempt}/${maxAttempts}), retrying in ${Math.round(delayMs)}ms...`);
        await delay(delayMs);
        // Exponential backoff with cap
        delayMs = Math.min(Math.round(delayMs * backoffMultiplier), maxDelayMs);
        continue;
      }
      
      if (attempt === maxAttempts) {
        console.warn(`[AppInit] SDK initialization timed out after ${maxAttempts} attempts. Last error:`, errorMessage);
        // Still return - let queries handle their own retries
        return;
      }
    }
  }
}

/**
 * Safely initialize the app. Handles concurrent calls gracefully.
 */
async function safeInitialize(): Promise<void> {
  if (isLocalDevHost()) {
    console.log('[AppInit] Local development host detected; skipping Power Apps context wait.');
    return;
  }

  // Step 0: Initial stabilization delay
  // This gives the platform time to fully load before we start checking
  console.log(`[AppInit] Starting initialization (stabilization delay: ${INIT_CONFIG.initialStabilizationDelay}ms)...`);
  await delay(INIT_CONFIG.initialStabilizationDelay);
  
  // Step 2: Wait for data layer to be fully ready
  // This is the critical step - we poll until transient errors clear
  await waitForDataLayerReady();
  
  // Step 3: Final stabilization delay after init
  // Gives time for any pending operations to complete
  await delay(300);
}

/**
 * Initialize the app. Safe to call multiple times - coordinates all calls.
 */
export async function ensureInitialized(): Promise<void> {
  if (isInitialized) {
    return;
  }
  
  if (initializationPromise) {
    await initializationPromise;
    return;
  }
  
  initializationPromise = safeInitialize().then(() => {
    isInitialized = true;
    notifyListeners();
    console.log('[AppInit] App initialization complete');
  }).catch((error: unknown) => {
    console.error('[AppInit] App initialization failed:', error);
    // Still mark as initialized to unblock UI - queries will handle errors
    isInitialized = true;
    notifyListeners();
  });
  
  return initializationPromise;
}

/**
 * Check if initialization has completed (synchronous check).
 */
export function getIsInitialized(): boolean {
  return isInitialized;
}

/**
 * Hook to check if the app has been initialized.
 * Uses useSyncExternalStore for guaranteed synchronous reads.
 */
export function useIsAppInitialized(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
