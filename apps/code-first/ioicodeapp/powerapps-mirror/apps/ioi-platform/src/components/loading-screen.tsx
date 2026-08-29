import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface LoadingScreenProps {
  /** Main loading message */
  message?: string;
  /** Secondary description text */
  description?: string;
  /** Loading variant */
  variant?: 'full' | 'inline' | 'card';
  /** Show progress percentage */
  showProgress?: boolean;
  /** Minimum time to display (prevents flash) */
  minDisplayTime?: number;
  /** Custom className */
  className?: string;
}

const loadingStages = [
  'Initializing services...',
  'Loading configuration...',
  'Connecting to data sources...',
  'Preparing workspace...',
  'Almost ready...',
];

export function LoadingScreen({
  message = 'Loading',
  description,
  variant = 'full',
  showProgress = true,
  minDisplayTime = 500,
  className,
}: LoadingScreenProps) {
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Progress simulation with stages
  useEffect(() => {
    // Start progress after minimum display time hint
    const startDelay = Math.min(minDisplayTime / 4, 200);
    
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          // Slow down as we approach 95%
          const increment = prev < 30 ? 8 : prev < 60 ? 5 : prev < 80 ? 3 : 1;
          const newProgress = Math.min(prev + increment, 95);
          
          // Update stage based on progress
          const newStageIndex = Math.min(
            Math.floor((newProgress / 100) * loadingStages.length),
            loadingStages.length - 1
          );
          if (newStageIndex !== stageIndex) {
            setStageIndex(newStageIndex);
          }
          
          return newProgress;
        });
      }, 300);

      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(timer);
  }, [minDisplayTime, stageIndex]);

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-3 py-8', className)}>
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm text-muted-foreground">
          {message}{dots}
        </span>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn(
        'flex flex-col items-center justify-center p-8 rounded-xl border border-border bg-card',
        className
      )}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="h-12 w-12 animate-spin rounded-full border-3 border-primary/20" />
            <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">{message}</p>
            {description && (
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Full screen variant
  return (
    <div className={cn(
      'fixed inset-0 z-50 flex items-center justify-center bg-background',
      className
    )}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 h-full w-full rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 h-full w-full rounded-full bg-gradient-to-tl from-emerald-500/5 to-transparent blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const }}
        className="relative z-10 flex flex-col items-center gap-6 px-4"
      >
        {/* Logo/Brand */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            {/* Outer ring */}
            <motion.div
              className="h-16 w-16 rounded-full border-4 border-primary/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            {/* Inner spinning ring */}
            <motion.div
              className="absolute inset-0 h-16 w-16 rounded-full border-4 border-primary border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            />
            {/* Center dot */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="h-4 w-4 rounded-full bg-primary" />
            </motion.div>
          </div>
        </motion.div>

        {/* Text content */}
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-semibold text-foreground tracking-tight"
          >
            {message}
          </motion.h2>
          {description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-sm text-muted-foreground max-w-xs"
            >
              {description}
            </motion.p>
          )}
        </div>

        {/* Progress section */}
        {showProgress && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-64 flex flex-col gap-3"
          >
            {/* Progress bar */}
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="absolute inset-y-0 left-0 bg-primary rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-80, 256] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            {/* Stage text */}
            <motion.p
              key={stageIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-muted-foreground text-center"
            >
              {loadingStages[stageIndex]}
            </motion.p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

/**
 * PageLoadingWrapper - Wraps page content with loading state
 * Use this in individual pages to show loading while data fetches
 */
interface PageLoadingWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingMessage?: string;
  /** Minimum loading time to prevent flash */
  minLoadingTime?: number;
  className?: string;
}

export function PageLoadingWrapper({
  isLoading,
  children,
  loadingMessage = 'Loading content',
  minLoadingTime = 300,
  className,
}: PageLoadingWrapperProps) {
  const [showLoading, setShowLoading] = useState(isLoading);
  const [loadingStartTime] = useState(() => Date.now());

  useEffect(() => {
    if (!isLoading) {
      const elapsed = Date.now() - loadingStartTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsed);
      
      if (remainingTime > 0) {
        const timer = setTimeout(() => setShowLoading(false), remainingTime);
        return () => clearTimeout(timer);
      }
      setShowLoading(false);
    } else {
      setShowLoading(true);
    }
  }, [isLoading, loadingStartTime, minLoadingTime]);

  if (showLoading) {
    return (
      <div className={cn('flex-1 flex items-center justify-center py-20', className)}>
        <LoadingScreen
          variant="card"
          message={loadingMessage}
          showProgress={false}
        />
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * DataLoadingState - Simple inline loading for data fetching
 */
export function DataLoadingState({ message = 'Loading data' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20" />
          <div className="absolute inset-0 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

/**
 * SkeletonCard - Animated skeleton placeholder for cards
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-6 animate-pulse',
        className
      )}
      aria-hidden="true"
    >
      <div className="space-y-4">
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
        <div className="h-20 w-full rounded bg-muted" />
      </div>
    </div>
  );
}

/**
 * SkeletonTable - Animated skeleton placeholder for tables
 */
export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden animate-pulse" aria-hidden="true">
      {/* Header */}
      <div className="border-b border-border bg-muted/30 px-6 py-4">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-4 flex-1 rounded bg-muted" />
          ))}
        </div>
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="border-b border-border last:border-0 px-6 py-4">
          <div className="flex gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-4 flex-1 rounded bg-muted"
                style={{ opacity: 1 - (rowIndex * 0.1) }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}