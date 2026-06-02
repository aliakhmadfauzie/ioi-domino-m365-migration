/**
 * Approval Actions Component
 * 
 * Provides workflow action buttons for approval pages:
 * - Approve / Complete
 * - Reject
 * - Return for revision
 * - Delegate to another approver
 * - Escalate (when overdue)
 * 
 * Integrates with the workflow orchestration service for
 * notifications and state management.
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Check,
  X,
  RotateCcw,
  UserPlus,
  Zap,
  MessageSquare,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { DelegationDialog } from '@/components/delegation-dialog';
import type { ApprovalActionType } from '@/types/it-approval-workflow';
import type { DelegationRequest } from '@/services/workflow-orchestration-service';
import type { MainDBIT } from '@/generated/models/main-dbit-model';

// =============================================================================
// TYPES
// =============================================================================

interface ApprovalActionsProps {
  submission: MainDBIT;
  currentApprover: {
    id: string;
    name: string;
    email: string;
  };
  allowedActions?: ApprovalActionType[];
  isOverdue?: boolean;
  onApprove: (comments?: string) => Promise<void>;
  onReject: (comments: string) => Promise<void>;
  onReturn: (comments: string) => Promise<void>;
  onDelegate: (request: DelegationRequest) => Promise<void>;
  onEscalate?: (comments: string) => Promise<void>;
  isProcessing?: boolean;
  className?: string;
}

type ActionDialogType = 'approve' | 'reject' | 'return' | 'escalate' | null;

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function ApprovalActions({
  submission,
  currentApprover,
  allowedActions = ['Approve', 'Reject', 'Return', 'Delegate'],
  isOverdue = false,
  onApprove,
  onReject,
  onReturn,
  onDelegate,
  onEscalate,
  isProcessing = false,
  className,
}: ApprovalActionsProps) {
  const [activeDialog, setActiveDialog] = useState<ActionDialogType>(null);
  const [delegationOpen, setDelegationOpen] = useState(false);
  const [comments, setComments] = useState('');
  const [localProcessing, setLocalProcessing] = useState(false);

  const isLoading = isProcessing || localProcessing;

  // Check if action is allowed
  const canApprove = allowedActions.includes('Approve') || allowedActions.includes('Complete');
  const canReject = allowedActions.includes('Reject');
  const canReturn = allowedActions.includes('Return');
  const canDelegate = allowedActions.includes('Delegate');
  const canEscalate = allowedActions.includes('Escalate') || isOverdue;

  // Handle approve action
  const handleApprove = async () => {
    setLocalProcessing(true);
    try {
      await onApprove(comments || undefined);
      toast.success('Request approved successfully');
      setActiveDialog(null);
      setComments('');
    } catch (error) {
      toast.error('Failed to approve request');
    } finally {
      setLocalProcessing(false);
    }
  };

  // Handle reject action
  const handleReject = async () => {
    if (!comments.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    setLocalProcessing(true);
    try {
      await onReject(comments);
      toast.success('Request rejected');
      setActiveDialog(null);
      setComments('');
    } catch (error) {
      toast.error('Failed to reject request');
    } finally {
      setLocalProcessing(false);
    }
  };

  // Handle return action
  const handleReturn = async () => {
    if (!comments.trim()) {
      toast.error('Please provide feedback for the revision');
      return;
    }
    setLocalProcessing(true);
    try {
      await onReturn(comments);
      toast.success('Request returned for revision');
      setActiveDialog(null);
      setComments('');
    } catch (error) {
      toast.error('Failed to return request');
    } finally {
      setLocalProcessing(false);
    }
  };

  // Handle escalate action
  const handleEscalate = async () => {
    if (!onEscalate) return;
    setLocalProcessing(true);
    try {
      await onEscalate(comments || 'Escalated due to SLA breach');
      toast.success('Request escalated successfully');
      setActiveDialog(null);
      setComments('');
    } catch (error) {
      toast.error('Failed to escalate request');
    } finally {
      setLocalProcessing(false);
    }
  };

  // Handle delegation
  const handleDelegate = async (request: DelegationRequest) => {
    setLocalProcessing(true);
    try {
      await onDelegate(request);
      toast.success(`Delegated to ${request.delegateToName}`);
      setDelegationOpen(false);
    } catch (error) {
      toast.error('Delegation failed');
    } finally {
      setLocalProcessing(false);
    }
  };

  // Close dialog and reset
  const closeDialog = () => {
    setActiveDialog(null);
    setComments('');
  };

  return (
    <>
      <div className={cn('flex flex-wrap items-center gap-2', className)}>
        {/* Approve Button */}
        {canApprove && (
          <Button
            onClick={() => setActiveDialog('approve')}
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Check className="h-4 w-4 mr-2" />
            Approve
          </Button>
        )}

        {/* Reject Button */}
        {canReject && (
          <Button
            variant="destructive"
            onClick={() => setActiveDialog('reject')}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Reject
          </Button>
        )}

        {/* Return Button */}
        {canReturn && (
          <Button
            variant="outline"
            onClick={() => setActiveDialog('return')}
            disabled={isLoading}
            className="border-amber-500 text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Return
          </Button>
        )}

        {/* Delegate Button */}
        {canDelegate && (
          <Button
            variant="outline"
            onClick={() => setDelegationOpen(true)}
            disabled={isLoading}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Delegate
          </Button>
        )}

        {/* Escalate Button (shown when overdue) */}
        {canEscalate && isOverdue && (
          <Button
            variant="outline"
            onClick={() => setActiveDialog('escalate')}
            disabled={isLoading}
            className="border-destructive text-destructive hover:bg-destructive/10"
          >
            <Zap className="h-4 w-4 mr-2" />
            Escalate
          </Button>
        )}
      </div>

      {/* Approve Dialog */}
      <Dialog open={activeDialog === 'approve'} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-emerald-600" />
              Approve Request
            </DialogTitle>
            <DialogDescription>
              You are about to approve <strong>{submission.title}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="approve-comments">Comments (Optional)</Label>
              <Textarea
                id="approve-comments"
                placeholder="Add any comments for the approval..."
                value={comments}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComments(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Processing...</>
              ) : (
                <><Check className="h-4 w-4 mr-2" />Confirm Approval</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <AlertDialog open={activeDialog === 'reject'} onOpenChange={(open) => !open && closeDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <X className="h-5 w-5 text-destructive" />
              Reject Request
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to reject <strong>{submission.title}</strong>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <p className="text-sm text-destructive">
                  Rejecting this request will notify the submitter and close the workflow.
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reject-comments">Reason for Rejection *</Label>
              <Textarea
                id="reject-comments"
                placeholder="Please explain why this request is being rejected..."
                value={comments}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComments(e.target.value)}
                rows={3}
                className="border-destructive/50 focus:border-destructive"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDialog} disabled={isLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={isLoading || !comments.trim()}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Processing...</>
              ) : (
                <><X className="h-4 w-4 mr-2" />Reject Request</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Return Dialog */}
      <Dialog open={activeDialog === 'return'} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-amber-600" />
              Return for Revision
            </DialogTitle>
            <DialogDescription>
              Return <strong>{submission.title}</strong> to the previous stage for corrections.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="return-comments">Feedback / Required Changes *</Label>
              <Textarea
                id="return-comments"
                placeholder="Describe what changes or corrections are needed..."
                value={comments}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComments(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleReturn}
              disabled={isLoading || !comments.trim()}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Processing...</>
              ) : (
                <><RotateCcw className="h-4 w-4 mr-2" />Return for Revision</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Escalate Dialog */}
      <Dialog open={activeDialog === 'escalate'} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-destructive" />
              Escalate Request
            </DialogTitle>
            <DialogDescription>
              Escalate <strong>{submission.title}</strong> to a higher authority.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <p className="text-sm text-destructive">
                  This request is overdue. Escalating will notify management and reassign the approval.
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="escalate-comments">Escalation Reason (Optional)</Label>
              <Textarea
                id="escalate-comments"
                placeholder="Add any additional context for the escalation..."
                value={comments}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComments(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleEscalate}
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Processing...</>
              ) : (
                <><Zap className="h-4 w-4 mr-2" />Escalate Now</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delegation Dialog */}
      <DelegationDialog
        open={delegationOpen}
        onOpenChange={setDelegationOpen}
        formId={String(submission.id)}
        formCode={submission.formcode}
        ticketId={submission.title}
        currentApprover={currentApprover}
        onDelegate={handleDelegate}
        isProcessing={isLoading}
      />
    </>
  );
}

export default ApprovalActions;