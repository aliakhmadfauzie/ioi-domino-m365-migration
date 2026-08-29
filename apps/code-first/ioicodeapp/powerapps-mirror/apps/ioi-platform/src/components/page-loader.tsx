import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStep {
  message: string;
  duration: number;
}

interface PageLoaderProps {
  children: ReactNode;
  isDataReady?: boolean;
  minLoadTime?: number;
  className?: string;
  title?: string;
  steps?: LoadingStep[];
}

const defaultSteps: LoadingStep[] = [
  { message: 'Establishing secure connection...', duration: 1200 },
  { message: 'Authenticating user session...', duration: 1000 },
  { message: 'Connecting to SharePoint...', duration: 1500 },
  { message: 'Initializing Office 365 services...', duration: 1500 },
  { message: 'Loading organization directory...', duration: 1200 },
  { message: 'Fetching configuration data...', duration: 1000 },
  { message: 'Preparing form templates...', duration: 800 },
  { message: 'Loading approver workflows...', duration: 800 },
  { message: 'Finalizing setup...', duration: 600 },
];

export function PageLoader({
  children,
  isDataReady = true,
  minLoadTime = 6000, // Increased to 6 seconds minimum
  className,
  title = 'Loading',
  steps = defaultSteps,
}: PageLoaderProps) {
  const [isPageReady, setIsPageReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(steps[0]?.message || 'Initializing...');

  useEffect(() => {
    let isMounted = true;

    const runLoadingSequence = async () => {
      const startTime = Date.now();

      // Run through loading steps
      for (let i = 0; i < steps.length; i++) {
        if (!isMounted) return;
        setLoadingMessage(steps[i].message);
        setLoadingProgress(((i + 1) / steps.length) * 90); // Max 90% during steps
        await new Promise((resolve) => setTimeout(resolve, steps[i].duration));
      }

      // Wait for data to be ready
      const maxWait = 15000;
      const pollInterval = 200;

      while (!isDataReady && Date.now() - startTime < maxWait) {
        if (!isMounted) return;
        setLoadingMessage('Loading data...');
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
      }

      // Ensure minimum load time has passed
      const elapsed = Date.now() - startTime;
      if (elapsed < minLoadTime) {
        setLoadingMessage('Finalizing...');
        setLoadingProgress(95);
        await new Promise((resolve) => setTimeout(resolve, minLoadTime - elapsed));
      }

      if (isMounted) {
        setLoadingProgress(100);
        setLoadingMessage('Ready!');
        await new Promise((resolve) => setTimeout(resolve, 300));
        setIsPageReady(true);
      }
    };

    runLoadingSequence();

    return () => {
      isMounted = false;
    };
  }, [isDataReady, minLoadTime, steps]);

  return (
    <div className={cn('relative min-h-screen', className)}>
      <AnimatePresence mode="wait">
        {!isPageReady ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background"
          >
            <div className="flex flex-col items-center gap-6">
              {/* Logo */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' as const }}
                className="flex items-center gap-3"
              >
                <div className="relative h-16 w-16">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#007934] to-[#005a28]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">IOI</span>
                  </div>
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-xl font-semibold text-foreground"
              >
                {title}
              </motion.h2>

              {/* Progress bar */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="h-2 overflow-hidden rounded-full bg-muted"
              >
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#007934] to-[#00a847]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' as const }}
                />
              </motion.div>

              {/* Loading message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{loadingMessage}</span>
              </motion.div>

              {/* Progress percentage */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs text-muted-foreground"
              >
                {Math.round(loadingProgress)}%
              </motion.span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' as const }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple loading skeleton for inline use
export function InlineLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center py-12', className)}>
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#007934]" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}