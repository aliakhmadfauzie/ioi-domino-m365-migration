import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  Clock,
  AlertTriangle,
  XCircle,
  RotateCcw,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  User,
  Calendar,
  MessageSquare,
  Bell,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useWorkflowEngine, type WorkflowStage, type ApproverInfo, type ApprovalAction } from '@/hooks/use-workflow-engine';
import { useUser } from '@/hooks/use-user';
import { format, formatDistanceToNow } from 'date-fns';

interface ApprovalWorkflowPanelProps {
  formCode: string;
  formId: string;
  className?: string;
  onActionComplete?: (action: ApprovalAction) => void;
  readOnly?: boolean;
}

const statusConfig = {
  pending: { icon: Clock, color: 'bg-accent text-accent-foreground border-accent', label: 'Pending' },
  in_progress: { icon: Clock, color: 'bg-secondary text-secondary-foreground border-secondary', label: 'In Progress' },
  approved: { icon: Check, color: 'bg-primary/10 text-primary border-primary/20', label: 'Approved' },
  rejected: { icon: XCircle, color: 'bg-destructive/10 text-destructive border-destructive/20', label: 'Rejected' },
  returned: { icon: RotateCcw, color: 'bg-accent text-accent-foreground border-accent', label: 'Returned' },
  escalated: { icon: ArrowUp, color: 'bg-secondary text-secondary-foreground border-secondary', label: 'Escalated' },
};

const actionConfig = {
  approved: { icon: Check, color: 'text-primary', bg: 'bg-primary/5' },
  rejected: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/5' },
  returned: { icon: RotateCcw, color: 'text-accent-foreground', bg: 'bg-accent/50' },
  escalated: { icon: ArrowUp, color: 'text-secondary-foreground', bg: 'bg-secondary' },
  pending: { icon: Clock, color: 'text-accent-foreground', bg: 'bg-accent/50' },
};

export function ApprovalWorkflowPanel({
  formCode,
  formId,
  className,
  onActionComplete,
  readOnly = false,
}: ApprovalWorkflowPanelProps) {
  const {
    stages,
    workflowInstance,
    approvalHistory,
    suggestedApprovers,
    processApprovalAction,
    checkEscalation,
    isLoading,
    isProcessing,
  } = useWorkflowEngine({ formCode, formId });

  const { data: currentUser } = useUser();

  // Check if current user is the assigned approver
  const isCurrentApprover = useMemo(() => {
    if (!currentUser || !workflowInstance) return false;
    // Check if current user is the assigned approver for this workflow
    return workflowInstance.assignedApproverId === currentUser.objectId ||
           workflowInstance.assignedApproverEmail?.toLowerCase() === currentUser.userPrincipalName?.toLowerCase();
  }, [currentUser, workflowInstance]);

  const [showActionDialog, setShowActionDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'approve' | 'reject' | 'return' | 'escalate' | null>(null);
  const [comments, setComments] = useState('');
  const [nextApproverId, setNextApproverId] = useState<string>('');
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);
  const [escalationStatus, setEscalationStatus] = useState<{ needsEscalation: boolean; overdueDays: number } | null>(null);

  // Check for escalation on mount
  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkEscalation();
      setEscalationStatus(status);
    };
    checkStatus();
  }, [checkEscalation]);

  const handleAction = async () => {
    if (!selectedAction) return;

    try {
      const action: ApprovalAction = {
        action: selectedAction,
        comments,
        nextApproverId: nextApproverId || undefined,
      };

      await processApprovalAction(action);
      onActionComplete?.(action);
      setShowActionDialog(false);
      setSelectedAction(null);
      setComments('');
      setNextApproverId('');
    } catch (error) {
      console.error('Failed to process action:', error);
    }
  };

  const openActionDialog = (action: 'approve' | 'reject' | 'return' | 'escalate') => {
    setSelectedAction(action);
    setShowActionDialog(true);
  };

  if (isLoading) {
    return (
      <div className={cn('rounded-lg border bg-card p-6', className)}>
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  const currentStatus = workflowInstance?.status || 'pending';
  const StatusIcon = statusConfig[currentStatus].icon;

  // Get next stage approvers
  const currentStageIndex = stages.findIndex((s: WorkflowStage) => s.key === workflowInstance?.currentStageKey);
  const nextStage = stages[currentStageIndex + 1];
  const nextStageApprovers = nextStage
    ? suggestedApprovers.find((s: { stage: WorkflowStage; approvers: ApproverInfo[] }) => s.stage.key === nextStage.key)?.approvers || []
    : [];

  return (
    <div className={cn('rounded-lg border bg-card', className)}>
      {/* Header */}
      <div className="border-b bg-muted/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', statusConfig[currentStatus].color)}>
              <StatusIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Approval Workflow</h3>
              <p className="text-sm text-muted-foreground">
                Stage {workflowInstance?.currentStageNumber || 1} of {stages.length}
              </p>
            </div>
          </div>
          <Badge className={cn('border', statusConfig[currentStatus].color)}>
            {statusConfig[currentStatus].label}
          </Badge>
        </div>

        {/* Escalation Warning */}
        {escalationStatus?.needsEscalation && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3"
          >
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">Escalation Required</p>
              <p className="text-xs text-destructive">
                This request is {escalationStatus.overdueDays} day(s) overdue for approval
              </p>
            </div>
            {!readOnly && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => openActionDialog('escalate')}
              >
                <Zap className="mr-1 h-4 w-4" />
                Escalate Now
              </Button>
            )}
          </motion.div>
        )}
      </div>

      {/* Stage Progress */}
      <div className="px-6 py-4">
        <h4 className="mb-4 text-sm font-medium text-foreground">Approval Stages</h4>
        <div className="relative">
          {/* Connector Line */}
          <div className="absolute left-[18px] top-5 bottom-5 w-0.5 bg-border" />

          <div className="space-y-4">
            {stages.map((stage: WorkflowStage, index: number) => {
              const isCompleted = workflowInstance?.approvalChain.some(
                (a) => a.stageKey === stage.key && a.action === 'approved'
              );
              const isCurrent = stage.key === workflowInstance?.currentStageKey;
              const isPending = !isCompleted && !isCurrent;
              const chainEntry = workflowInstance?.approvalChain.find(
                (a) => a.stageKey === stage.key
              );

              return (
                <motion.div
                  key={stage.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start gap-4"
                >
                  {/* Status Icon */}
                  <div
                    className={cn(
                      'relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all',
                      isCompleted && 'border-primary bg-primary/10',
                      isCurrent && 'border-secondary bg-secondary',
                      isPending && 'border-muted bg-muted'
                    )}
                  >
                    {isCompleted && <Check className="h-4 w-4 text-primary" />}
                    {isCurrent && <Clock className="h-4 w-4 text-secondary-foreground" />}
                    {isPending && <span className="text-xs font-medium text-muted-foreground">{index + 1}</span>}
                  </div>

                  {/* Stage Info */}
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center gap-2">
                      <h5
                        className={cn(
                          'text-sm font-medium',
                          isCompleted && 'text-primary',
                          isCurrent && 'text-secondary-foreground',
                          isPending && 'text-muted-foreground'
                        )}
                      >
                        {stage.name}
                      </h5>
                      {stage.escalationDays && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                <Clock className="mr-1 h-3 w-3" />
                                {stage.escalationDays}d SLA
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              Escalates after {stage.escalationDays} days
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{stage.actor}</p>
                    
                    {/* Show approver if available */}
                    {chainEntry && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{chainEntry.approverName}</span>
                        </div>
                        {chainEntry.approverEmail && (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground/70 ml-5">{chainEntry.approverEmail}</span>
                          </div>
                        )}
                        {chainEntry.actionDate && (
                          <div className="flex items-center gap-2 text-xs">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {format(chainEntry.actionDate, 'MMM d, yyyy')}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Approval History */}
      <Collapsible open={isHistoryExpanded} onOpenChange={setIsHistoryExpanded}>
        <CollapsibleTrigger asChild>
          <button className="flex w-full items-center justify-between border-t px-6 py-3 text-sm font-medium text-foreground hover:bg-muted/50">
            <span className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Activity History ({approvalHistory.length})
            </span>
            {isHistoryExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t bg-muted/20 px-6 py-4">
            <AnimatePresence>
              {approvalHistory.length > 0 ? (
                <div className="space-y-3">
                  {approvalHistory.map((record, index: number) => {
                    const actionKey = record.actionKey || 'ActionKey3';
                    const actionMap: Record<string, 'approved' | 'rejected' | 'returned' | 'escalated' | 'pending'> = {
                      'ActionKey0': 'approved',
                      'ActionKey1': 'rejected',
                      'ActionKey2': 'returned',
                      'ActionKey3': 'pending',
                      'ActionKey4': 'approved',
                    };
                    const action = record.comments?.toLowerCase().includes('escalated')
                      ? 'escalated'
                      : actionMap[actionKey] || 'pending';
                    const config = actionConfig[action];
                    const ActionIcon = config.icon;

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn('rounded-lg border p-3', config.bg)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn('mt-0.5', config.color)}>
                            <ActionIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium truncate">
                                {record.stagename}
                              </span>
                              {record.actiondate && (
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {formatDistanceToNow(new Date(record.actiondate), { addSuffix: true })}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {record.actionbyname || 'System'}
                            </p>
                            {record.comments && (
                              <p className="mt-1 text-xs text-foreground/80">
                                {record.comments}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground py-4">
                  No activity yet
                </p>
              )}
            </AnimatePresence>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Action Buttons */}
      {!readOnly && workflowInstance?.status === 'pending' && isCurrentApprover && (
        <div className="border-t px-6 py-4">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => openActionDialog('approve')}
              className="bg-primary hover:bg-primary/90"
              disabled={isProcessing}
            >
              <Check className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button
              variant="outline"
              onClick={() => openActionDialog('return')}
              className="border-accent text-accent-foreground hover:bg-accent/50"
              disabled={isProcessing}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Return
            </Button>
            <Button
              variant="outline"
              onClick={() => openActionDialog('reject')}
              className="border-destructive/30 text-destructive hover:bg-destructive/5"
              disabled={isProcessing}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              variant="outline"
              onClick={() => openActionDialog('escalate')}
              className="border-secondary text-secondary-foreground hover:bg-secondary/50"
              disabled={isProcessing}
            >
              <ArrowUp className="mr-2 h-4 w-4" />
              Escalate
            </Button>
          </div>
        </div>
      )}

      {/* Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAction === 'approve' && <Check className="h-5 w-5 text-primary" />}
              {selectedAction === 'reject' && <XCircle className="h-5 w-5 text-destructive" />}
              {selectedAction === 'return' && <RotateCcw className="h-5 w-5 text-accent-foreground" />}
              {selectedAction === 'escalate' && <ArrowUp className="h-5 w-5 text-secondary-foreground" />}
              {selectedAction === 'approve' && 'Approve Request'}
              {selectedAction === 'reject' && 'Reject Request'}
              {selectedAction === 'return' && 'Return for Revision'}
              {selectedAction === 'escalate' && 'Escalate Request'}
            </DialogTitle>
            <DialogDescription>
              {selectedAction === 'approve' && 'Confirm approval and optionally select the next approver.'}
              {selectedAction === 'reject' && 'Please provide a reason for rejection.'}
              {selectedAction === 'return' && 'Explain what needs to be revised.'}
              {selectedAction === 'escalate' && 'This request will be escalated to a higher authority.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Next Approver Selection (for approve action) */}
            {selectedAction === 'approve' && nextStage && nextStageApprovers.length > 0 && (
              <div>
                <label className="text-sm font-medium text-foreground">Next Approver ({nextStage.name})</label>
                <Select value={nextApproverId} onValueChange={setNextApproverId}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select next approver" />
                  </SelectTrigger>
                  <SelectContent>
                    {nextStageApprovers.filter((a: ApproverInfo) => a.id).map((approver: ApproverInfo) => (
                      <SelectItem key={approver.id} value={approver.id}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{approver.name}</span>
                          <span className="text-muted-foreground">({approver.role})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Comments */}
            <div>
              <label className="text-sm font-medium text-foreground">
                Comments {(selectedAction === 'reject' || selectedAction === 'return') && <span className="text-destructive">*</span>}
              </label>
              <Textarea
                value={comments}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComments(e.target.value)}
                placeholder={`Enter your ${selectedAction === 'approve' ? 'approval comments (optional)' : 'comments'}...`}
                className="mt-1.5 min-h-[100px]"
              />
            </div>

            {/* Notification Preview */}
            <div className="rounded-lg border bg-muted/30 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Bell className="h-4 w-4" />
                Notification will be sent
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {selectedAction === 'approve' && nextStage
                  ? 'The next approver will be notified via email.'
                  : selectedAction === 'approve'
                    ? 'The submitter will be notified of full approval.'
                    : 'The submitter will be notified of this action.'}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={
                isProcessing ||
                ((selectedAction === 'reject' || selectedAction === 'return') && !comments.trim())
              }
              className={cn(
                selectedAction === 'approve' && 'bg-primary hover:bg-primary/90',
                selectedAction === 'reject' && 'bg-destructive hover:bg-destructive/90',
                selectedAction === 'return' && 'bg-accent hover:bg-accent/90 text-accent-foreground',
                selectedAction === 'escalate' && 'bg-secondary hover:bg-secondary/90 text-secondary-foreground'
              )}
            >
              {isProcessing ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  {selectedAction === 'approve' && 'Confirm Approval'}
                  {selectedAction === 'reject' && 'Confirm Rejection'}
                  {selectedAction === 'return' && 'Return Request'}
                  {selectedAction === 'escalate' && 'Escalate Now'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}