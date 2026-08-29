/**
 * Data Ready Guard
 * 
 * Wraps page content and ensures the data layer is fully initialized
 * BEFORE allowing any data queries to execute. This prevents the
 * "data model is currently being updated" error.
 * 
 * Usage:
 * 1. Wrap your page component with DataReadyGuard
 * 2. Your data fetching hooks will only run after the guard confirms readiness
 */

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ensureInitialized, getIsInitialized } from '@/lib/app-init';

interface DataReadyGuardProps {
  children: ReactNode;
  /** Custom loading message */
  loadingMessage?: string;
  /** Minimum loading time to prevent flash (ms) */
  minLoadingTime?: number;
  /** Maximum time to wait before showing error (ms) */
  timeout?: number;
}

type GuardState = 'checking' | 'ready' | 'error' | 'timeout';

// Function to check if data layer is ready with retry
async function checkDataLayerReady(maxAttempts = 5, delayMs = 2000): Promise<boolean> {
  // If already initialized, return immediately
  if (getIsInitialized()) {
    console.log('[DataReadyGuard] Already initialized');
    return true;
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Try to ensure SDK is initialized - this will throw if data model is being updated
      await ensureInitialized();
      console.log(`[DataReadyGuard] Data layer ready after ${attempt} attempt(s)`);
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.log(`[DataReadyGuard] Attempt ${attempt}/${maxAttempts}: ${message}`);
      
      // If it's a "being updated" error, retry
      if (message.includes('being updated') || message.includes('data model')) {
        if (attempt < maxAttempts) {
          // Exponential backoff
          const waitTime = delayMs * Math.pow(1.3, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
      } else {
        // For other errors, fail immediately
        throw error;
      }
    }
  }
  
  return false;
}

export function DataReadyGuard({
  children,
  loadingMessage = 'Preparing your workspace...',
  minLoadingTime = 400,
  timeout = 30000,
}: DataReadyGuardProps) {
  const [state, setState] = useState<GuardState>('checking');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [startTime] = useState(() => Date.now());

  const checkReady = useCallback(async () => {
    setState('checking');
    setErrorMessage(null);

    try {
      // Set up timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('timeout')), timeout);
      });

      // Race between data check and timeout
      const result = await Promise.race([
        checkDataLayerReady(),
        timeoutPromise,
      ]);

      if (result) {
        // Ensure minimum loading time for smooth UX
        const elapsed = Date.now() - startTime;
        if (elapsed < minLoadingTime) {
          await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsed));
        }
        setState('ready');
      } else {
        setErrorMessage('Unable to connect to data services. Please try again.');
        setState('error');
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'timeout') {
        setState('timeout');
      } else {
        const msg = error instanceof Error ? error.message : 'Failed to initialize';
        setErrorMessage(msg);
        setState('error');
      }
    }
  }, [timeout, minLoadingTime, startTime]);

  useEffect(() => {
    checkReady();
  }, [checkReady]);

  const handleRetry = () => {
    checkReady();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <AnimatePresence mode="wait">
      {state === 'checking' && (
        <motion.div
          key="checking"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center justify-center min-h-[60vh] gap-5"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="h-12 w-12 text-[#003366]" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ease: [0.2, 0, 0, 1] as const }}
            className="text-center"
          >
            <p className="text-body-md text-foreground font-medium">{loadingMessage}</p>
            <p className="text-meta text-muted-foreground mt-1">This may take a few seconds...</p>
          </motion.div>
        </motion.div>
      )}

      {(state === 'error' || state === 'timeout') && (
        <motion.div
          key="error"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center min-h-[60vh] p-6"
        >
          <Card className="max-w-md w-full border-destructive/20 bg-destructive/5">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-section-heading text-foreground mb-2">
                {state === 'timeout' ? 'Connection Timeout' : 'Unable to Load Data'}
              </h3>
              <p className="text-body-sm text-muted-foreground mb-6">
                {state === 'timeout'
                  ? 'The system is taking longer than expected. Please refresh the page.'
                  : errorMessage || 'Something went wrong while loading. Please try again.'}
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button variant="outline" onClick={handleRetry} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </Button>
                <Button onClick={handleRefresh} className="gap-2 bg-[#003366] hover:bg-[#002244]">
                  Refresh Page
                </Button>
              </div>
            </CardContent>
          </Card>
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

export default DataReadyGuard;

// Higher-order component for wrapping page components
export function withDataGuard<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<DataReadyGuardProps, 'children'>
) {
  return function DataGuardedComponent(props: P) {
    return (
      <DataReadyGuard {...options}>
        <Component {...props} />
      </DataReadyGuard>
    );
  };
}