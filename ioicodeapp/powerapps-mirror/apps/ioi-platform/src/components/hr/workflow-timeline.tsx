/**
 * Shared WorkflowTimeline component.
 * Renders ordered workflow stages with colored dots.
 *
 * Usage:
 *   const STAGES = [
 *     { key: 'Submitted', label: 'Submitted' },
 *     { key: 'HODApproval', label: 'HOD Review' },
 *     { key: 'Completed', label: 'Completed' },
 *   ];
 *   <WorkflowTimeline stages={STAGES} currentKey={record.CurrentAction} />
 */

import { statusDotColor } from './status-badge';

export interface TimelineStage {
  key: string;
  label: string;
}

interface WorkflowTimelineProps {
  stages: TimelineStage[];
  currentKey: string | undefined;
  className?: string;
}

export function WorkflowTimeline({ stages, currentKey, className = '' }: WorkflowTimelineProps) {
  const currentIdx = stages.findIndex((s) => s.key === currentKey);

  return (
    <div className={`space-y-0 ${className}`}>
      {stages.map((stage, idx) => {
        const isPast = currentIdx >= idx;
        const isCurrent = currentIdx === idx;
        const dotColor = isPast
          ? isCurrent
            ? 'bg-amber-500 ring-2 ring-amber-200'
            : statusDotColor(stage.key)
          : 'bg-slate-200';

        return (
          <div key={stage.key} className="flex items-start gap-3 pb-4 last:pb-0">
            <div className={`mt-1 h-4 w-4 rounded-full shrink-0 ${dotColor}`} />
            <div>
              <p className={`text-sm font-medium ${isPast ? 'text-foreground' : 'text-muted-foreground'}`}>
                {stage.label}
              </p>
              {isCurrent && <p className="text-xs text-amber-600 mt-0.5">Current stage</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
