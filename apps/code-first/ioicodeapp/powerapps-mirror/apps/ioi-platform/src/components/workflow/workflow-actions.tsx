import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  RotateCcw,
  Forward,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { WorkflowStage } from '@/lib/it-forms-config';

type WorkflowAction = 'advance' | 'approve' | 'reject' | 'return' | 'delegate';

interface WorkflowActionsProps {
  currentStage: WorkflowStage;
  nextStage: WorkflowStage | undefined;
  previousStage: WorkflowStage | undefined;
  isFirstStage: boolean;
  isLastStage: boolean;
  canAdvance: boolean;
  canApprove: boolean;
  isSubmitting: boolean;
  onAction: (action: WorkflowAction, comments?: string) => Promise<void>;
  className?: string;
}

export function WorkflowActions({
  currentStage,
  nextStage,
  previousStage,
  isFirstStage,
  isLastStage,
  canAdvance,
  canApprove,
  isSubmitting,
  onAction,
  className,
}: WorkflowActionsProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<WorkflowAction | null>(null);
  const [comments, setComments] = useState('');

  const actionConfig: Record<WorkflowAction, {
    title: string;
    description: string;
    buttonText: string;
    buttonClass: string;
    requiresComments: boolean;
  }> = {
    advance: {
      title: 'Advance to Next Stage',
      description: `Move this request to "${nextStage?.name || 'Next Stage'}" for ${nextStage?.actor || 'processing'}.`,
      buttonText: 'Advance',
      buttonClass: 'bg-[#1B5E20] hover:bg-[#2E7D32]',
      requiresComments: false,
    },
    approve: {
      title: 'Approve Request',
      description: 'This will mark the request as fully approved and complete.',
      buttonText: 'Approve',
      buttonClass: 'bg-[#166534] hover:bg-[#15803d]',
      requiresComments: false,
    },
    reject: {
      title: 'Reject Request',
      description: 'This will reject the request. Please provide a reason.',
      buttonText: 'Reject',
      buttonClass: 'bg-[#9B2F23] hover:bg-[#b91c1c]',
      requiresComments: true,
    },
    return: {
      title: 'Return for Revisions',
      description: 'Send back to the previous stage for corrections.',
      buttonText: 'Return',
      buttonClass: 'bg-[#7B3E00] hover:bg-[#92400e]',
      requiresComments: true,
    },
    delegate: {
      title: 'Delegate Approval',
      description: 'Transfer approval responsibility to another person.',
      buttonText: 'Delegate',
      buttonClass: 'bg-[#1752A8] hover:bg-[#1d4ed8]',
      requiresComments: true,
    },
  };

  const handleActionClick = (action: WorkflowAction) => {
    setPendingAction(action);
    setComments('');
    setShowConfirmDialog(true);
  };

  const handleConfirm = async () => {
    if (!pendingAction) return;
    await onAction(pendingAction, comments || undefined);
    setShowConfirmDialog(false);
    setPendingAction(null);
    setComments('');
  };

  const config = pendingAction ? actionConfig[pendingAction] : null;

  return (
    <>
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Current Stage Info */}
            <div>
              <p className="text-xs text-muted-foreground">Current Stage</p>
              <p className="text-sm font-semibold text-foreground">{currentStage.name}</p>
              <p className="text-xs text-[#5C5C5C]">Actor: {currentStage.actor}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Return Button */}
              {!isFirstStage && canApprove && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleActionClick('return')}
                  disabled={isSubmitting}
                  className="gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Return
                </Button>
              )}

              {/* Reject Button */}
              {canApprove && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleActionClick('reject')}
                  disabled={isSubmitting}
                  className="gap-1.5 border-[#9B2F23] text-[#9B2F23] hover:bg-[#FDEDEA]"
                >
                  <X className="h-3.5 w-3.5" />
                  Reject
                </Button>
              )}

              {/* Delegate Button */}
              {canApprove && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleActionClick('delegate')}
                  disabled={isSubmitting}
                  className="gap-1.5"
                >
                  <Forward className="h-3.5 w-3.5" />
                  Delegate
                </Button>
              )}

              {/* Advance/Approve Button */}
              {isLastStage ? (
                <Button
                  size="sm"
                  onClick={() => handleActionClick('approve')}
                  disabled={isSubmitting || !canApprove}
                  className="gap-1.5 bg-[#166534] hover:bg-[#15803d]"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  Approve
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handleActionClick('advance')}
                  disabled={isSubmitting || !canAdvance}
                  className="gap-1.5 bg-[#1B5E20] hover:bg-[#2E7D32]"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                  {nextStage?.name || 'Next Stage'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{config?.title}</DialogTitle>
            <DialogDescription>{config?.description}</DialogDescription>
          </DialogHeader>
          
          {config?.requiresComments && (
            <div className="space-y-2 py-4">
              <Label htmlFor="comments">
                Comments {config.requiresComments ? '*' : '(optional)'}
              </Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComments(e.target.value)}
                placeholder="Enter your comments..."
                rows={3}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isSubmitting || (config?.requiresComments && !comments.trim())}
              className={config?.buttonClass}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {config?.buttonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}