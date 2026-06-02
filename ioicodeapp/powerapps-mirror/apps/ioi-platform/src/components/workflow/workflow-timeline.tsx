import { motion } from 'motion/react';
import {
  Check,
  Clock,
  XCircle,
  RotateCcw,
  ArrowUp,
  FileText,
  Send,
  UserCheck,
  AlertTriangle,
  MessageSquare,
  Calendar,
  User,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, formatDistanceToNow, differenceInHours, differenceInDays } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface TimelineEvent {
  id: string;
  type: 'created' | 'submitted' | 'approved' | 'rejected' | 'returned' | 'escalated' | 'comment' | 'pending' | 'completed';
  title: string;
  description?: string;
  actor?: string;
  actorEmail?: string;
  actorRole?: string;
  timestamp: Date;
  stageName?: string;
  stageNumber?: number;
  totalStages?: number;
  comments?: string;
  metadata?: Record<string, string | number | boolean>;
  duration?: number; // Duration in hours from previous event
}

interface WorkflowTimelineProps {
  events: TimelineEvent[];
  currentStatus?: 'draft' | 'pending' | 'approved' | 'rejected' | 'returned' | 'escalated' | 'completed';
  className?: string;
  showDurations?: boolean;
  compact?: boolean;
}

const eventConfig = {
  created: {
    icon: FileText,
    color: 'bg-muted text-muted-foreground border-border',
    lineColor: 'bg-muted',
    label: 'Created',
  },
  submitted: {
    icon: Send,
    color: 'bg-secondary text-secondary-foreground border-secondary',
    lineColor: 'bg-secondary',
    label: 'Submitted',
  },
  pending: {
    icon: Clock,
    color: 'bg-accent text-accent-foreground border-accent',
    lineColor: 'bg-accent',
    label: 'Pending Review',
  },
  approved: {
    icon: Check,
    color: 'bg-primary/10 text-primary border-primary/20',
    lineColor: 'bg-primary/50',
    label: 'Approved',
  },
  rejected: {
    icon: XCircle,
    color: 'bg-destructive/10 text-destructive border-destructive/20',
    lineColor: 'bg-destructive/50',
    label: 'Rejected',
  },
  returned: {
    icon: RotateCcw,
    color: 'bg-accent text-accent-foreground border-accent',
    lineColor: 'bg-accent',
    label: 'Returned',
  },
  escalated: {
    icon: ArrowUp,
    color: 'bg-secondary text-secondary-foreground border-secondary',
    lineColor: 'bg-secondary',
    label: 'Escalated',
  },
  comment: {
    icon: MessageSquare,
    color: 'bg-secondary text-secondary-foreground border-secondary',
    lineColor: 'bg-secondary',
    label: 'Comment',
  },
  completed: {
    icon: UserCheck,
    color: 'bg-primary/10 text-primary border-primary/20',
    lineColor: 'bg-primary/50',
    label: 'Completed',
  },
};

function formatDuration(hours: number): string {
  if (hours < 1) {
    return 'Less than an hour';
  } else if (hours < 24) {
    return `${Math.round(hours)} hour${Math.round(hours) !== 1 ? 's' : ''}`;
  } else {
    const days = Math.round(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
}

function DurationBadge({ hours }: { hours: number }) {
  const isLong = hours > 48; // More than 2 days
  const isWarning = hours > 72; // More than 3 days
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full',
              isWarning ? 'bg-destructive/10 text-destructive' :
              isLong ? 'bg-accent text-accent-foreground' :
              'bg-muted text-muted-foreground'
            )}
          >
            <Clock className="h-3 w-3" />
            {formatDuration(hours)}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Time since previous action</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function WorkflowTimeline({
  events,
  currentStatus = 'pending',
  className,
  showDurations = true,
  compact = false,
}: WorkflowTimelineProps) {
  // Sort events by timestamp (newest first for display, but we'll reverse for timeline)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Calculate durations between events
  const eventsWithDurations = sortedEvents.map((event, index) => {
    if (index === 0) return { ...event, duration: 0 };
    const prevEvent = sortedEvents[index - 1];
    const duration = differenceInHours(
      new Date(event.timestamp),
      new Date(prevEvent.timestamp)
    );
    return { ...event, duration };
  });

  // Calculate total processing time
  const totalDays = sortedEvents.length >= 2
    ? differenceInDays(
        new Date(sortedEvents[sortedEvents.length - 1].timestamp),
        new Date(sortedEvents[0].timestamp)
      )
    : 0;

  const isComplete = currentStatus === 'approved' || currentStatus === 'completed';
  const isTerminal = currentStatus === 'rejected';

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Workflow Timeline
          </CardTitle>
          {totalDays > 0 && (
            <Badge variant="outline" className="text-xs">
              Total: {totalDays} day{totalDays !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        
        {/* Status Summary Bar */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={cn(
                'h-full rounded-full',
                isComplete ? 'bg-primary/50' :
                isTerminal ? 'bg-destructive' :
                'bg-secondary'
              )}
              initial={{ width: 0 }}
              animate={{ width: isComplete || isTerminal ? '100%' : `${Math.min(((eventsWithDurations.length - 1) / Math.max(eventsWithDurations.length, 3)) * 100, 90)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' as const }}
            />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {eventsWithDurations.length} event{eventsWithDurations.length !== 1 ? 's' : ''}
          </span>
        </div>
      </CardHeader>

      <CardContent className={cn('pt-4', compact ? 'pb-4' : 'pb-6')}>
        <div className="relative">
          {/* Timeline Events */}
          <div className="space-y-0">
            {eventsWithDurations.map((event, index) => {
              const config = eventConfig[event.type];
              const Icon = config.icon;
              const isFirst = index === 0;
              const isLast = index === eventsWithDurations.length - 1;
              const isPending = event.type === 'pending' && isLast;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' as const }}
                  className="relative"
                >
                  {/* Duration connector */}
                  {!isFirst && showDurations && event.duration !== undefined && event.duration > 0 && (
                    <div className="flex items-center gap-2 pl-[18px] py-2">
                      <div className={cn('w-0.5 h-full min-h-[24px]', config.lineColor)} />
                      <DurationBadge hours={event.duration} />
                    </div>
                  )}

                  {/* Event Row */}
                  <div className="flex items-start gap-4">
                    {/* Icon with connector line */}
                    <div className="relative flex flex-col items-center">
                      {/* Top connector line */}
                      {!isFirst && (!showDurations || !event.duration) && (
                        <div className={cn('absolute bottom-full w-0.5 h-6', config.lineColor)} />
                      )}
                      
                      {/* Icon */}
                      <motion.div
                        className={cn(
                          'relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2',
                          config.color,
                          isPending && 'animate-pulse'
                        )}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
                      >
                        <Icon className="h-4 w-4" />
                      </motion.div>

                      {/* Bottom connector line */}
                      {!isLast && (
                        <div className={cn('absolute top-full w-0.5 h-6', config.lineColor)} />
                      )}
                    </div>

                    {/* Content */}
                    <div className={cn('flex-1 pb-6', isLast && 'pb-0')}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          {/* Title and Stage Badge */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-semibold text-foreground">
                              {event.title}
                            </h4>
                            {event.stageName && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                {event.stageName}
                                {event.stageNumber && event.totalStages && (
                                  <span className="ml-1 text-muted-foreground">
                                    ({event.stageNumber}/{event.totalStages})
                                  </span>
                                )}
                              </Badge>
                            )}
                          </div>

                          {/* Actor Info */}
                          {event.actor && (
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <User className="h-3 w-3" />
                                <span>{event.actor}</span>
                                {event.actorRole && (
                                  <span className="text-muted-foreground/60">• {event.actorRole}</span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Actor Email */}
                          {event.actorEmail && (
                            <div className="text-[11px] text-muted-foreground/70 mt-0.5 ml-4">
                              {event.actorEmail}
                            </div>
                          )}
                        </div>

                        {/* Timestamp */}
                        <div className="text-right shrink-0">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{format(new Date(event.timestamp), 'PPpp')}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>

                      {/* Description */}
                      {event.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      )}

                      {/* Comments */}
                      {event.comments && (
                        <div className="mt-2 rounded-lg bg-muted/50 border px-3 py-2">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="h-3 w-3 mt-0.5 text-muted-foreground" />
                            <p className="text-xs text-foreground/80 italic">
                              "{event.comments}"
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Metadata */}
                      {event.metadata && Object.keys(event.metadata).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {Object.entries(event.metadata).map(([key, value]) => (
                            <div
                              key={key}
                              className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground"
                            >
                              <span className="font-medium">{key}:</span> {String(value)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pending Indicator */}
          {currentStatus === 'pending' && (
            <motion.div
              className="flex items-center gap-3 mt-4 pt-4 border-t border-dashed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="h-3 w-3 rounded-full bg-accent" />
                  <div className="absolute inset-0 h-3 w-3 rounded-full bg-accent animate-ping" />
                </div>
                <span className="text-sm text-muted-foreground">Awaiting next action...</span>
              </div>
            </motion.div>
          )}

          {/* Completion Indicator */}
          {isComplete && (
            <motion.div
              className="flex items-center gap-3 mt-4 pt-4 border-t"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2 text-primary">
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">Workflow Complete</span>
              </div>
            </motion.div>
          )}

          {/* Rejection Indicator */}
          {isTerminal && (
            <motion.div
              className="flex items-center gap-3 mt-4 pt-4 border-t"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Workflow Terminated</span>
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to convert approval history to timeline events
export function convertApprovalHistoryToTimeline(
  history: Array<{
    id?: string;
    stagename?: string;
    stageNumber?: number;
    totalStages?: number;
    actionbyname?: string;
    actionbyemail?: string;
    actionKey?: string;
    actiondate?: string;
    comments?: string;
  }>,
  submission?: {
    id?: string | number;
    title?: string;
    createdAt?: string;
    submitteddate?: string;
    applicantname?: string;
    applicantemail?: string;
  }
): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // Add creation event if we have submission data
  if (submission?.createdAt) {
    events.push({
      id: 'created',
      type: 'created',
      title: 'Request Created',
      description: `${submission.title || 'New request'} was created`,
      actor: submission.applicantname,
      actorEmail: submission.applicantemail,
      timestamp: new Date(submission.createdAt),
    });
  }

  // Add submission event
  if (submission?.submitteddate) {
    events.push({
      id: 'submitted',
      type: 'submitted',
      title: 'Submitted for Approval',
      description: 'Request submitted and workflow initiated',
      actor: submission.applicantname,
      actorEmail: submission.applicantemail,
      timestamp: new Date(submission.submitteddate),
    });
  }

  // Convert approval history records
  const actionMap: Record<string, TimelineEvent['type']> = {
    'ActionKey0': 'approved',
    'ActionKey1': 'rejected',
    'ActionKey2': 'returned',
    'ActionKey3': 'pending',
    'ActionKey4': 'approved',
  };

  history.forEach((record, index) => {
    const actionType = record.comments?.toLowerCase().includes('escalated')
      ? 'escalated'
      : actionMap[record.actionKey || ''] || 'pending';

    const titleMap: Record<string, string> = {
      approved: 'Approved',
      rejected: 'Rejected',
      returned: 'Returned for Revision',
      escalated: 'Escalated',
      pending: 'Pending Review',
    };

    events.push({
      id: record.id || `history-${index}`,
      type: actionType,
      title: titleMap[actionType] || 'Action Taken',
      stageName: record.stagename,
      stageNumber: record.stageNumber,
      totalStages: record.totalStages,
      actor: record.actionbyname,
      actorEmail: record.actionbyemail,
      timestamp: record.actiondate ? new Date(record.actiondate) : new Date(),
      comments: record.comments,
    });
  });

  return events.sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}