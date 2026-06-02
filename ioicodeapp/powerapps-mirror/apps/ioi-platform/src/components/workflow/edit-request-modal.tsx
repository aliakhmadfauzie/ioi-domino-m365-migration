import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Edit3, AlertCircle, Clock, CheckCircle2, Mail } from 'lucide-react';
import { useRequestEdit } from '@/hooks/use-edit-request';
import { useSendEditRequestSubmittedEmail } from '@/hooks/use-edit-request-emails';
import { useLiveApprovers } from '@/hooks/use-live-approvers';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import { toast } from 'sonner';

interface EditRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: MainDBIT;
  userEmail: string;
  userName?: string;
}

const EDITABLE_FIELDS = [
  { id: 'title', label: 'Title/Subject' },
  { id: 'description', label: 'Description' },
  { id: 'site', label: 'Site Location' },
  { id: 'environment', label: 'Environment Tag' },
  { id: 'attachments', label: 'Attachments' },
  { id: 'priority', label: 'Priority Level' },
];

export function EditRequestModal({
  open,
  onOpenChange,
  submission,
  userEmail,
  userName,
}: EditRequestModalProps) {
  const [editReason, setEditReason] = useState('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  
  const requestEditMutation = useRequestEdit();
  const sendEmailMutation = useSendEditRequestSubmittedEmail();
  const { approvers } = useLiveApprovers(submission.formcode);
  
  // Get IT approvers to notify
  const itApprovers = approvers.filter((a) => 
    a.role === 'ITAdmin' || a.role === 'ITManager' || a.role === 'ITSupport'
  );

  const handleSubmit = () => {
    if (!editReason.trim()) return;

    requestEditMutation.mutate(
      {
        submission,
        editReason,
        requestedBy: userEmail,
        fieldsRequested: selectedFields.length > 0 ? selectedFields : undefined,
      },
      {
        onSuccess: () => {
          // Send email notifications to IT approvers
          const approverToNotify = itApprovers[0]; // Primary IT approver
          
          if (approverToNotify) {
            sendEmailMutation.mutate({
              submissionId: String(submission.id),
              submissionTitle: submission.title || `Submission #${submission.id}`,
              formCode: submission.formcode,
              requestorEmail: userEmail,
              requestorName: userName || userEmail.split('@')[0],
              approverEmail: approverToNotify.email,
              approverName: approverToNotify.name,
              editReason,
              fieldsRequested: selectedFields.length > 0 ? selectedFields : undefined,
            }, {
              onSuccess: () => {
                toast.success('Edit request submitted and approver notified via email');
              },
              onError: () => {
                toast.warning('Edit request submitted but email notification failed');
              },
            });
          }
          
          onOpenChange(false);
          setEditReason('');
          setSelectedFields([]);
        },
      }
    );
  };

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields((prev: string[]) =>
      prev.includes(fieldId)
        ? prev.filter((f: string) => f !== fieldId)
        : [...prev, fieldId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-[#E8F5E9] flex items-center justify-center">
              <Edit3 className="h-5 w-5 text-[#1B5E20]" />
            </div>
            <div>
              <span className="text-[#1C1C1C]">Request Edit Access</span>
              <p className="text-sm font-normal text-[#5C5C5C]">
                Submission #{submission.title || submission.id}
              </p>
            </div>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Request permission to edit this submission
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Info banner */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 bg-[#EAF0FB] rounded-xl border border-[#1752A8]/20"
          >
            <AlertCircle className="h-5 w-5 text-[#1752A8] mt-0.5" />
            <div className="text-sm text-[#1752A8]">
              <p className="font-medium mb-1">How this works</p>
              <ul className="space-y-1 text-[#1752A8]/80">
                <li className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  IT approver will review your request
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  If approved, you'll have 72 hours to make edits
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Reason for edit */}
          <div className="space-y-2">
            <Label htmlFor="edit-reason" className="text-sm font-medium text-[#1C1C1C]">
              Reason for Edit <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="edit-reason"
              placeholder="Explain why you need to edit this submission..."
              value={editReason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditReason(e.target.value)}
              className="min-h-[100px] resize-none border-[#D0D0D0] focus:border-[#1B5E20] focus:ring-[#1B5E20]"
            />
            <p className="text-xs text-[#5C5C5C]">
              Be specific about what needs to be changed and why.
            </p>
          </div>

          {/* Fields to edit (optional) */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-[#1C1C1C]">
              Fields to Edit <Badge className="ml-2 bg-secondary text-secondary-foreground">Optional</Badge>
            </Label>
            <p className="text-xs text-[#5C5C5C]">
              Select specific fields you need to edit, or leave empty to request full access.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {EDITABLE_FIELDS.map((field) => (
                <motion.div
                  key={field.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                    ${selectedFields.includes(field.id)
                      ? 'border-[#1B5E20] bg-[#E8F5E9]'
                      : 'border-[#D0D0D0] hover:border-[#1B5E20]/50 hover:bg-[#F5F5F5]'
                    }
                  `}
                  onClick={() => handleFieldToggle(field.id)}
                >
                  <Checkbox
                    checked={selectedFields.includes(field.id)}
                    onCheckedChange={() => handleFieldToggle(field.id)}
                    className="data-[state=checked]:bg-[#1B5E20] data-[state=checked]:border-[#1B5E20]"
                  />
                  <span className="text-sm text-[#1C1C1C]">{field.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setEditReason('');
              setSelectedFields([]);
            }}
            className="border-[#D0D0D0]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!editReason.trim() || requestEditMutation.isPending}
            className="bg-[#1B5E20] hover:bg-[#166534] text-white"
          >
            {requestEditMutation.isPending ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                />
                Submitting...
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4 mr-2" />
                Submit Request
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}