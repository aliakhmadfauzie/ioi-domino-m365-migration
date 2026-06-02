/**
 * Route Loading Wrapper
 * 
 * Wraps page content and shows a loading screen until the data layer is ready.
 * This prevents the "data model is currently being updated" error by ensuring
 * the SDK is fully initialized before rendering any data-dependent content.
 * 
 * Enhanced with:
 * - Longer initial wait times to allow system to stabilize
 * - Branded loading experience with progress indicators
 * - Exponential backoff with extended retry logic
 * - Graceful error handling with helpful messages
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, RefreshCw, Building2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ensureInitialized, getIsInitialized } from '@/lib/app-init';

interface RouteLoadingWrapperProps {
  children: React.ReactNode;
  message?: string;
  /** Minimum time to show loading (prevents flash) - increased for stability */
  minLoadingTimeMs?: number;
  /** Initial delay before checking data - gives system time to stabilize */
  initialDelayMs?: number;
}

type LoadingState = 'initializing' | 'loading' | 'ready' | 'error';

const LOADING_MESSAGES = [
  'Connecting to services...',
  'Loading your workspace...',
  'Preparing data layer...',
  'Almost ready...',
];

export function RouteLoadingWrapper({
  children,
  message = 'Preparing your workspace...',
  minLoadingTimeMs = 800, // Reduced from 5000 for better responsiveness
  initialDelayMs = 200, // Reduced from 3000 - the global app-init already handles stabilization
}: RouteLoadingWrapperProps) {
  const [state, setState] = useState<LoadingState>(() => 
    getIsInitialized() ? 'ready' : 'initializing'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentMessage, setCurrentMessage] = useState(message);
  const [retryCount, setRetryCount] = useState(0);
  const loadingStartTime = useRef(Date.now());
  const messageIndex = useRef(0);

  // Rotate through loading messages for longer waits
  useEffect(() => {
    if (state !== 'initializing' && state !== 'loading') return;

    const interval = setInterval(() => {
      messageIndex.current = (messageIndex.current + 1) % LOADING_MESSAGES.length;
      setCurrentMessage(LOADING_MESSAGES[messageIndex.current]);
    }, 2500);

    return () => clearInterval(interval);
  }, [state]);

  const initializeData = useCallback(async () => {
    setState('initializing');
    setErrorMessage(null);
    loadingStartTime.current = Date.now();
    
    // Initial delay to let the system stabilize
    await new Promise((resolve) => setTimeout(resolve, initialDelayMs));
    
    setState('loading');
    
    // Extended retry configuration for "data model being updated" errors
    const maxRetries = 8; // Increased from 5
    const baseDelay = 2500; // Increased from 2000ms
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Wait for SDK initialization
        await ensureInitialized();
        
        // Ensure minimum loading time to prevent flash
        const elapsed = Date.now() - loadingStartTime.current;
        const remaining = minLoadingTimeMs - elapsed;
        if (remaining > 0) {
          await new Promise((resolve) => setTimeout(resolve, remaining));
        }
        
        // Additional stabilization delay after init
        await new Promise((resolve) => setTimeout(resolve, 300));
        
        setState('ready');
        return; // Success - exit the retry loop
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Failed to load data';
        
        // Check if it's a transient/recoverable error
        const isTransientError = 
          msg.includes('being updated') || 
          msg.includes('data model') ||
          msg.includes('Timed out') ||
          msg.includes('retrieveMultipleRecords') ||
          msg.includes('In Memory Data');
        
        if (isTransientError && attempt < maxRetries) {
          // Wait with exponential backoff before retrying
          const delay = baseDelay * Math.pow(1.5, attempt - 1);
          console.log(`[RouteLoading] Data layer initializing, retrying in ${Math.round(delay)}ms (attempt ${attempt}/${maxRetries})`);
          setRetryCount(attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        
        // Either not a transient error or we've exhausted retries
        if (isTransientError) {
          setErrorMessage('The system is still starting up. This may take a moment.');
        } else {
          setErrorMessage(msg);
        }
        setState('error');
        return;
      }
    }
  }, [initialDelayMs, minLoadingTimeMs]);

  useEffect(() => {
    // If already initialized, we're good
    if (getIsInitialized()) {
      setState('ready');
      return;
    }
    
    initializeData();
  }, [initializeData]);

  const handleRetry = () => {
    setRetryCount(0);
    initializeData();
  };

  return (
    <AnimatePresence mode="wait">
      {(state === 'initializing' || state === 'loading') && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center min-h-[60vh] gap-6"
        >
          {/* Logo with pulsing effect */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.1, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-2xl bg-primary"
              style={{ transform: 'scale(1.5)' }}
            />
            <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-[#003366] to-blue-800 flex items-center justify-center shadow-lg">
              <Building2 className="h-7 w-7 text-white" />
            </div>
          </motion.div>

          {/* Spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="h-8 w-8 text-[#003366]" />
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <p className="text-base font-medium text-foreground mb-1">
              {currentMessage}
            </p>
            <p className="text-sm text-muted-foreground">
              Please wait while we set things up
            </p>
            {retryCount > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Reconnecting... (attempt {retryCount})
              </p>
            )}
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 192 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="h-1 bg-muted rounded-full overflow-hidden"
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#003366] to-transparent"
            />
          </motion.div>
        </motion.div>
      )}

      {state === 'error' && (
        <motion.div
          key="error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
        >
          <div className="h-14 w-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <div className="text-center max-w-md">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Unable to Load
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {errorMessage || 'Something went wrong while loading the page.'}
            </p>
            <Button onClick={handleRetry} className="gap-2 bg-[#003366] hover:bg-[#003366]/90">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </motion.div>
      )}

      {state === 'ready' && (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Higher-order component version for wrapping entire page components
 */
export function withRouteLoading<P extends object>(
  Component: React.ComponentType<P>,
  message?: string
) {
  return function WrappedComponent(props: P) {
    return (
      <RouteLoadingWrapper message={message}>
        <Component {...props} />
      </RouteLoadingWrapper>
    );
  };
}