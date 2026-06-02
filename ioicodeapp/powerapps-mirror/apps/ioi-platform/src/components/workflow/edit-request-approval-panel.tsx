import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow, addHours } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Edit3,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  ChevronRight,
  MessageSquare,
  Mail,
} from 'lucide-react';
import {
  useApproveEditRequest,
  useRejectEditRequest,
  getEditRequestFromRemarks,
} from '@/hooks/use-edit-request';
import {
  useSendEditRequestApprovedEmail,
  useSendEditRequestRejectedEmail,
} from '@/hooks/use-edit-request-emails';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { toast } from 'sonner';

interface EditRequestApprovalPanelProps {
  submissions: MainDBIT[];
  approverEmail: string;
  approverName?: string;
  onViewSubmission?: (submissionId: string) => void;
}

export function EditRequestApprovalPanel({
  submissions,
  approverEmail,
  approverName,
  onViewSubmission,
}: EditRequestApprovalPanelProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<MainDBIT | null>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [approverComments, setApproverComments] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const approveMutation = useApproveEditRequest();
  const rejectMutation = useRejectEditRequest();
  const sendApprovedEmailMutation = useSendEditRequestApprovedEmail();
  const sendRejectedEmailMutation = useSendEditRequestRejectedEmail();

  const handleApprove = () => {
    if (!selectedSubmission) return;

    const editRequest = getEditRequestFromRemarks(selectedSubmission.remarks);
    const editWindowExpires = addHours(new Date(), 72);

    approveMutation.mutate(
      {
        submission: selectedSubmission,
        approverEmail,
        approverComments: approverComments.trim() || undefined,
      },
      {
        onSuccess: () => {
          // Send approval email to requestor
          if (editRequest?.requestedBy) {
            sendApprovedEmailMutation.mutate({
              submissionId: String(selectedSubmission.id),
              submissionTitle: selectedSubmission.title || `Submission #${selectedSubmission.id}`,
              formCode: selectedSubmission.formcode,
              requestorEmail: editRequest.requestedBy,
              requestorName: editRequest.requestedBy.split('@')[0],
              approverEmail,
              approverName: approverName || approverEmail.split('@')[0],
              approverComments: approverComments.trim() || undefined,
              editWindowExpires,
            }, {
              onSuccess: () => {
                toast.success('Edit approved and requestor notified via email');
              },
              onError: () => {
                toast.warning('Edit approved but email notification failed');
              },
            });
          }
          
          setShowApproveDialog(false);
          setSelectedSubmission(null);
          setApproverComments('');
        },
      }
    );
  };

  const handleReject = () => {
    if (!selectedSubmission || !rejectionReason.trim()) return;

    const editRequest = getEditRequestFromRemarks(selectedSubmission.remarks);

    rejectMutation.mutate(
      {
        submission: selectedSubmission,
        approverEmail,
        rejectionReason,
      },
      {
        onSuccess: () => {
          // Send rejection email to requestor
          if (editRequest?.requestedBy) {
            sendRejectedEmailMutation.mutate({
              submissionId: String(selectedSubmission.id),
              submissionTitle: selectedSubmission.title || `Submission #${selectedSubmission.id}`,
              formCode: selectedSubmission.formcode,
              requestorEmail: editRequest.requestedBy,
              requestorName: editRequest.requestedBy.split('@')[0],
              approverEmail,
              approverName: approverName || approverEmail.split('@')[0],
              rejectionReason,
            }, {
              onSuccess: () => {
                toast.success('Edit rejected and requestor notified via email');
              },
              onError: () => {
                toast.warning('Edit rejected but email notification failed');
              },
            });
          }
          
          setShowRejectDialog(false);
          setSelectedSubmission(null);
          setRejectionReason('');
        },
      }
    );
  };

  if (submissions.length === 0) {
    return (
      <Empty className="py-12">
        <EmptyHeader>
          <div className="h-16 w-16 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-4">
            <Edit3 className="h-8 w-8 text-[#1B5E20]" />
          </div>
          <EmptyTitle>No Edit Requests</EmptyTitle>
          <EmptyDescription>
            There are no pending edit requests to review.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {submissions.map((submission: MainDBIT, index: number) => {
            const editRequest = getEditRequestFromRemarks(submission.remarks);
            if (!editRequest) return null;

            return (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="border-[#D0D0D0] shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="h-12 w-12 rounded-xl bg-[#FFF3E0] flex items-center justify-center flex-shrink-0">
                        <Edit3 className="h-6 w-6 text-[#7B3E00]" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-[#1C1C1C] truncate">
                              {submission.title || `Submission #${submission.id}`}
                            </h4>
                            <p className="text-sm text-[#5C5C5C] flex items-center gap-1">
                              <User className="h-3.5 w-3.5" />
                              {editRequest.requestedBy}
                            </p>
                          </div>
                          <Badge className="bg-[#FFF3E0] text-[#7B3E00] border-0">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDistanceToNow(new Date(editRequest.requestedAt), { addSuffix: true })}
                          </Badge>
                        </div>

                        {/* Edit reason */}
                        <div className="mt-3 p-3 bg-[#F5F5F5] rounded-lg">
                          <p className="text-xs text-[#5C5C5C] mb-1 flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            Reason for edit
                          </p>
                          <p className="text-sm text-[#1C1C1C]">
                            "{editRequest.editReason}"
                          </p>
                        </div>

                        {/* Fields requested */}
                        {editRequest.fieldsRequested && editRequest.fieldsRequested.length > 0 && (
                          <div className="mt-2 flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-[#5C5C5C]">Fields:</span>
                            {editRequest.fieldsRequested.map((field: string) => (
                              <Badge key={field} className="bg-secondary text-secondary-foreground text-xs">
                                {field}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="mt-4 flex items-center gap-2">
                          <Button
                            size="sm"
                            className="bg-[#1B5E20] hover:bg-[#166534] text-white"
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setShowApproveDialog(true);
                            }}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-destructive text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setShowRejectDialog(true);
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          {onViewSubmission && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="ml-auto text-[#1B5E20]"
                              onClick={() => onViewSubmission(String(submission.id))}
                            >
                              View Details
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#166534]">
              <CheckCircle2 className="h-5 w-5" />
              Approve Edit Request
            </DialogTitle>
            <DialogDescription>
              This will unlock the submission for editing. The user will have 72 hours to make changes.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium text-[#1C1C1C] mb-2 block">
              Comments for requestor (optional)
            </label>
            <Textarea
              placeholder="Add any notes for the requestor..."
              value={approverComments}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setApproverComments(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowApproveDialog(false);
                setApproverComments('');
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#1B5E20] hover:bg-[#166534] text-white"
              disabled={approveMutation.isPending}
              onClick={handleApprove}
            >
              {approveMutation.isPending ? 'Approving...' : 'Approve Edit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Reject Edit Request
            </DialogTitle>
            <DialogDescription>
              The submission will remain locked. Please provide a reason for rejection.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium text-[#1C1C1C] mb-2 block">
              Rejection reason <span className="text-destructive">*</span>
            </label>
            <Textarea
              placeholder="Explain why this edit request is being rejected..."
              value={rejectionReason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!rejectionReason.trim() || rejectMutation.isPending}
              onClick={handleReject}
            >
              {rejectMutation.isPending ? 'Rejecting...' : 'Reject Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}