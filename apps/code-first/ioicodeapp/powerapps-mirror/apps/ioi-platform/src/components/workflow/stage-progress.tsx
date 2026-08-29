import { motion } from 'motion/react';
import { Check, Circle, AlertCircle, SkipForward, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// =============================================================================
// TYPES
// =============================================================================

type StageStatus = 'completed' | 'active' | 'current' | 'pending' | 'skipped' | 'rejected';

interface LegacyWorkflowStage {
  key: string;
  name: string;
  order: number;
  actor: string;
  description: string;
  isConditional?: boolean;
}

interface NewStageInfo {
  key: string;
  name: string;
  status: StageStatus;
  assignee?: string;
  completedAt?: Date;
}

interface StageProgressProps {
  // New interface
  stages?: NewStageInfo[];
  currentStageIndex?: number;
  // Legacy interface
  legacyStages?: LegacyWorkflowStage[];
  currentStageKey?: string;
  completedStages?: string[];
  skippedStages?: string[];
  // Common
  className?: string;
  compact?: boolean;
}

// =============================================================================
// STATUS COLORS
// =============================================================================

const stageStatusColors = {
  completed: {
    bg: 'bg-primary/10',
    border: 'border-primary',
    text: 'text-primary',
    line: 'bg-primary/50',
  },
  active: {
    bg: 'bg-accent',
    border: 'border-accent-foreground',
    text: 'text-accent-foreground',
    line: 'bg-accent',
  },
  current: {
    bg: 'bg-accent',
    border: 'border-accent-foreground',
    text: 'text-accent-foreground',
    line: 'bg-accent',
  },
  pending: {
    bg: 'bg-muted',
    border: 'border-muted-foreground/30',
    text: 'text-muted-foreground',
    line: 'bg-muted',
  },
  skipped: {
    bg: 'bg-muted/50',
    border: 'border-muted-foreground/20',
    text: 'text-muted-foreground/60',
    line: 'bg-muted/50',
  },
  rejected: {
    bg: 'bg-destructive/10',
    border: 'border-destructive',
    text: 'text-destructive',
    line: 'bg-destructive/50',
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export function StageProgress({
  stages,
  currentStageIndex,
  legacyStages,
  currentStageKey,
  completedStages = [],
  skippedStages = [],
  className,
  compact = false,
}: StageProgressProps) {
  // Normalize stages to new format
  const normalizedStages: NewStageInfo[] = stages || (legacyStages?.map((s, idx) => ({
    key: s.key,
    name: s.name,
    status: completedStages.includes(s.key)
      ? 'completed' as StageStatus
      : skippedStages.includes(s.key)
        ? 'skipped' as StageStatus
        : s.key === currentStageKey
          ? 'active' as StageStatus
          : 'pending' as StageStatus,
    assignee: s.actor,
  })) || []);

  const effectiveCurrentIndex = currentStageIndex ?? 
    (currentStageKey ? normalizedStages.findIndex(s => s.key === currentStageKey) : 0);

  const progress = normalizedStages.length > 0
    ? ((effectiveCurrentIndex + 1) / normalizedStages.length) * 100
    : 0;

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' as const }}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          {effectiveCurrentIndex + 1} of {normalizedStages.length}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('', className)}>
      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className="h-1.5 bg-muted rounded-full">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' as const }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">
            Stage {effectiveCurrentIndex + 1} of {normalizedStages.length}
          </span>
          <span className="text-xs font-medium text-primary">
            {Math.round(progress)}% Complete
          </span>
        </div>
      </div>

      {/* Stage Steps */}
      <div className="relative">
        {/* Connector Line */}
        <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-muted" />

        <div className="space-y-4">
          {normalizedStages.map((stage, index) => {
            const status = stage.status;
            const colors = stageStatusColors[status];
            const isLast = index === normalizedStages.length - 1;

            return (
              <motion.div
                key={stage.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="relative flex items-start gap-4"
              >
                {/* Step Icon */}
                <div
                  className={cn(
                    'relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all',
                    colors.bg,
                    colors.border
                  )}
                >
                  {status === 'completed' && (
                    <Check className={cn('h-5 w-5', colors.text)} />
                  )}
                  {(status === 'active' || status === 'current') && (
                    <Clock className={cn('h-4 w-4', colors.text)} />
                  )}
                  {status === 'pending' && (
                    <span className={cn('text-sm font-semibold', colors.text)}>
                      {index + 1}
                    </span>
                  )}
                  {status === 'skipped' && (
                    <SkipForward className={cn('h-4 w-4', colors.text)} />
                  )}
                  {status === 'rejected' && (
                    <AlertCircle className={cn('h-4 w-4', colors.text)} />
                  )}
                </div>

                {/* Stage Info */}
                <div className="flex-1 pt-1.5">
                  <div className="flex items-center gap-2">
                    <h4 className={cn('text-sm font-semibold', colors.text)}>
                      {stage.name}
                    </h4>
                    {status === 'completed' && stage.completedAt && (
                      <span className="text-[10px] text-muted-foreground">
                        {format(stage.completedAt, 'MMM d, h:mm a')}
                      </span>
                    )}
                  </div>
                  {stage.assignee && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        {stage.assignee}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Re-export for backward compatibility
export { stageStatusColors };