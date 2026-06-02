import { useMemo } from 'react';
import { Check, XCircle, Clock, AlertCircle, ChevronRight, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { ApprovalRecords } from '@/generated/models/approval-records-model';

/* =============================================================================
 * ApprovalMatrix — compact horizontal table for approval data
 *
 * Converts the bloated vertical list of approvers into a dense, scannable
 * table. Shows: Role → Approver → Status badge → Decision date.
 * Completely hides future stages that have no data.
 * ============================================================================= */

interface ApprovalMatrixProps {
  records: ApprovalRecords[];
  className?: string;
}

/* ── Status badge resolver ─────────────────────────────────────────────── */

function resolveStageStatus(actionKey?: string | null) {
  if (!actionKey) {
    return {
      label: 'Pending',
      variant: 'outline' as const,
      className: 'text-amber-700 bg-amber-50 border-amber-200',
      icon: Clock,
    };
  }
  if (actionKey === 'ActionKey0' || actionKey === 'ActionKey4') {
    return {
      label: 'Approved',
      variant: 'default' as const,
      className: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      icon: Check,
    };
  }
  if (actionKey === 'ActionKey1') {
    return {
      label: 'Rejected',
      variant: 'destructive' as const,
      className: 'text-rose-700 bg-rose-50 border-rose-200',
      icon: XCircle,
    };
  }
  if (actionKey === 'ActionKey2') {
    return {
      label: 'Returned',
      variant: 'outline' as const,
      className: 'text-amber-700 bg-amber-50 border-amber-200',
      icon: AlertCircle,
    };
  }
  return {
    label: 'Completed',
    variant: 'outline' as const,
    className: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    icon: Check,
  };
}

/* ── Flow arrow between stages ─────────────────────────────────────────── */

function StageArrow({ isLast }: { isLast: boolean }) {
  if (isLast) return null;
  return (
    <div className="hidden lg:flex items-center justify-center px-1">
      <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
    </div>
  );
}

/* ── Main component ────────────────────────────────────────────────────── */

export function ApprovalMatrix({ records, className }: ApprovalMatrixProps) {
  // Only show records that have an actionKey (non-empty stages)
  const populatedRecords = useMemo(
    () => records.filter((r) => r.stagename || r.actionKey),
    [records],
  );

  if (populatedRecords.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-center">
        <div className="space-y-2">
          <Clock className="h-8 w-8 mx-auto text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground/60">No approval stages recorded yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-1', className)}>
      {/* ── Desktop: horizontal flow ── */}
      <div className="hidden lg:flex items-stretch gap-0 overflow-x-auto pb-2">
        {populatedRecords.map((record, idx) => {
          const status = resolveStageStatus(record.actionKey);
          const StatusIcon = status.icon;
          const isActive = !record.actionKey;

          return (
            <div key={record.id || idx} className="flex items-stretch">
              <div className={cn(
                'flex flex-col min-w-[160px] rounded-lg border p-3 transition-colors',
                isActive
                  ? 'border-amber-200 bg-amber-50/40 ring-1 ring-amber-200/50'
                  : 'border-border bg-card',
              )}>
                {/* Stage name */}
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-1">
                  {record.stagename || `Stage ${record.stagenumber || idx + 1}`}
                </span>
                {/* Approver name */}
                <div className="flex items-center gap-1.5 mb-1.5">
                  <User className="h-3 w-3 text-muted-foreground/50" />
                  <span className="text-xs font-medium text-foreground truncate">
                    {record.actionbyname || '—'}
                  </span>
                </div>
                {/* Status badge + date */}
                <div className="flex items-center gap-2 mt-auto">
                  <Badge variant={status.variant} className={cn('border text-[10px] px-1.5 py-0 font-semibold', status.className)}>
                    <StatusIcon className="h-3 w-3 mr-0.5" />
                    {status.label}
                  </Badge>
                  {record.actiondate && (
                    <span className="text-[10px] text-muted-foreground/50 whitespace-nowrap">
                      {format(new Date(record.actiondate), 'MMM d')}
                    </span>
                  )}
                </div>
              </div>
              <StageArrow isLast={idx === populatedRecords.length - 1} />
            </div>
          );
        })}
      </div>

      {/* ── Mobile/Tablet: vertical table ── */}
      <div className="lg:hidden divide-y divide-border">
        <div className="grid grid-cols-4 gap-2 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
          <span>Stage</span>
          <span>Approver</span>
          <span>Status</span>
          <span>Date</span>
        </div>
        {populatedRecords.map((record, idx) => {
          const status = resolveStageStatus(record.actionKey);
          const StatusIcon = status.icon;
          const isActive = !record.actionKey;

          return (
            <div
              key={record.id || idx}
              className={cn(
                'grid grid-cols-4 gap-2 px-3 py-2.5 items-center',
                isActive && 'bg-amber-50/30',
              )}
            >
              <span className="text-xs font-medium text-foreground truncate">
                {record.stagename || `Stage ${record.stagenumber || idx + 1}`}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {record.actionbyname || '—'}
              </span>
              <Badge variant={status.variant} className={cn('border text-[10px] px-1.5 py-0 w-fit font-semibold', status.className)}>
                <StatusIcon className="h-3 w-3 mr-0.5" />
                {status.label}
              </Badge>
              <span className="text-xs text-muted-foreground/60">
                {record.actiondate ? format(new Date(record.actiondate), 'MMM d') : '—'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
