/**
 * Edit Request Email Notification Hooks
 * 
 * Provides email notifications for the edit request workflow:
 * - Request submitted → notify IT approver
 * - Request approved → notify requestor
 * - Request rejected → notify requestor
 */

import { useMutation } from '@tanstack/react-query';
import { useSendEmail } from '@/hooks/use-send-email';
import { format, formatDistanceToNow } from 'date-fns';

// ============================================================================
// EDIT REQUEST SUBMITTED - Notify IT Approver
// ============================================================================

export interface EditRequestSubmittedEmailParams {
  submissionId: string;
  submissionTitle: string;
  formCode: string;
  requestorEmail: string;
  requestorName: string;
  approverEmail: string;
  approverName: string;
  editReason: string;
  fieldsRequested?: string[];
}

export function useSendEditRequestSubmittedEmail() {
  const sendEmailMutation = useSendEmail();

  return useMutation({
    mutationFn: async (params: EditRequestSubmittedEmailParams) => {
      const fieldsSection = params.fieldsRequested?.length
        ? `<p><strong>Fields Requested:</strong> ${params.fieldsRequested.join(', ')}</p>`
        : '';

      const subject = `[Action Required] Edit Request for ${params.submissionTitle}`;
      const body = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%); padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">✏️ Edit Request Submitted</h1>
          </div>
          
          <div style="background: #ffffff; padding: 24px; border: 1px solid #E0E0E0; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="color: #1C1C1C; margin-bottom: 16px;">Hello ${params.approverName},</p>
            
            <p style="color: #5C5C5C;">A user has requested permission to edit a submitted form. Please review and approve or reject the request.</p>
            
            <div style="background: #F5F5F5; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #5C5C5C; width: 140px;">Submission:</td>
                  <td style="padding: 8px 0; color: #1C1C1C; font-weight: 600;">${params.submissionTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #5C5C5C;">Form Code:</td>
                  <td style="padding: 8px 0; color: #1C1C1C;">${params.formCode}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #5C5C5C;">Requested By:</td>
                  <td style="padding: 8px 0; color: #1C1C1C;">${params.requestorName} (${params.requestorEmail})</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #5C5C5C;">Requested At:</td>
                  <td style="padding: 8px 0; color: #1C1C1C;">${format(new Date(), 'PPpp')}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #FFF3E0; border-left: 4px solid #E65100; padding: 16px; border-radius: 4px; margin: 20px 0;">
              <p style="color: #E65100; font-weight: 600; margin: 0 0 8px 0;">Reason for Edit:</p>
              <p style="color: #5C5C5C; margin: 0; font-style: italic;">&quot;${params.editReason}&quot;</p>
            </div>
            
            ${fieldsSection}
            
            <div style="text-align: center; margin-top: 24px;">
              <p style="color: #5C5C5C; margin-bottom: 16px;">Please log in to the IOI Platform to review this request.</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #E0E0E0; margin: 24px 0;" />
            
            <p style="color: #9E9E9E; font-size: 12px; text-align: center;">
              This is an automated notification from IOI Acidchem Enterprise Platform.
            </p>
          </div>
        </div>
      `;

      const result = await sendEmailMutation.mutateAsync({
        to: params.approverEmail,
        subject,
        body,
        importance: 'High',
        isHtml: true,
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to send email');
      }
      
      return result;
    },
  });
}

// ============================================================================
// EDIT REQUEST APPROVED - Notify Requestor
// ============================================================================

export interface EditRequestApprovedEmailParams {
  submissionId: string;
  submissionTitle: string;
  formCode: string;
  requestorEmail: string;
  requestorName: string;
  approverEmail: string;
  approverName: string;
  approverComments?: string;
  editWindowExpires: Date;
}

export function useSendEditRequestApprovedEmail() {
  const sendEmailMutation = useSendEmail();

  return useMutation({
    mutationFn: async (params: EditRequestApprovedEmailParams) => {
      const commentsSection = params.approverComments
        ? `
            <div style="background: #E8F5E9; border-left: 4px solid #1B5E20; padding: 16px; border-radius: 4px; margin: 20px 0;">
              <p style="color: #1B5E20; font-weight: 600; margin: 0 0 8px 0;">Approver Comments:</p>
              <p style="color: #5C5C5C; margin: 0; font-style: italic;">&quot;${params.approverComments}&quot;</p>
            </div>
          `
        : '';

      const timeRemaining = formatDistanceToNow(params.editWindowExpires);

      const subject = `✅ Edit Request Approved - ${params.submissionTitle}`;
      const body = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%); padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">✅ Edit Request Approved</h1>
          </div>
          
          <div style="background: #ffffff; padding: 24px; border: 1px solid #E0E0E0; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="color: #1C1C1C; margin-bottom: 16px;">Hello ${params.requestorName},</p>
            
            <p style="color: #5C5C5C;">Great news! Your edit request has been <strong style="color: #1B5E20;">approved</strong>. You can now edit your submission.</p>
            
            <div style="background: #F5F5F5; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #5C5C5C; width: 140px;">Submission:</td>
                  <td style="padding: 8px 0; color: #1C1C1C; font-weight: 600;">${params.submissionTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #5C5C5C;">Form Code:</td>
                  <td style="padding: 8px 0; color: #1C1C1C;">${params.formCode}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #5C5C5C;">Approved By:</td>
                  <td style="padding: 8px 0; color: #1C1C1C;">${params.approverName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #5C5C5C;">Approved At:</td>
                  <td style="padding: 8px 0; color: #1C1C1C;">${format(new Date(), 'PPpp')}</td>
                </tr>
              </table>
            </div>
            
            ${commentsSection}
            
            <div style="background: #FFF3E0; border: 2px solid #E65100; padding: 16px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="color: #E65100; font-weight: 600; margin: 0 0 4px 0;">⏰ Edit Window</p>
              <p style="color: #1C1C1C; font-size: 18px; font-weight: 700; margin: 0;">${timeRemaining} remaining</p>
              <p style="color: #5C5C5C; font-size: 12px; margin: 8px 0 0 0;">Expires: ${format(params.editWindowExpires, 'PPpp')}</p>
            </div>
            
            <div style="text-align: center; margin-top: 24px;">
              <p style="color: #5C5C5C;">Log in to the IOI Platform to make your edits before the window expires.</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #E0E0E0; margin: 24px 0;" />
            
            <p style="color: #9E9E9E; font-size: 12px; text-align: center;">
              This is an automated notification from IOI Acidchem Enterprise Platform.
            </p>
          </div>
        </div>
      `;

      const result = await sendEmailMutation.mutateAsync({
        to: params.requestorEmail,
        subject,
        body,
        importance: 'Normal',
        isHtml: true,
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to send email');
      }
      
      return result;
    },
  });
}

// ============================================================================
// EDIT REQUEST REJECTED - Notify Requestor
// ============================================================================

export interface EditRequestRejectedEmailParams {
  submissionId: string;
  submissionTitle: string;
  formCode: string;
  requestorEmail: string;
  requestorName: string;
  approverEmail: string;
  approverName: string;
  rejectionReason: string;
}

export function useSendEditRequestRejectedEmail() {
  const sendEmailMutation = useSendEmail();

  return useMutation({
    mutationFn: async (params: EditRequestRejectedEmailParams) => {
      const subject = `❌ Edit Request Declined - ${params.submissionTitle}`;
      const body = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #B71C1C 0%, #C62828 100%); padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">❌ Edit Request Declined</h1>
          </div>
          
          <div style="background: #ffffff; padding: 24px; border: 1px solid #E0E0E0; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="color: #1C1C1C; margin-bottom: 16px;">Hello ${params.requestorName},</p>
            
            <p style="color: #5C5C5C;">Unfortunately, your edit request has been <strong style="color: #B71C1C;">declined</strong>. The submission remains locked.</p>
            
            <div style="background: #F5F5F5; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #5C5C5C; width: 140px;">Submission:</td>
                  <td style="padding: 8px 0; color: #1C1C1C; font-weight: 600;">${params.submissionTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #5C5C5C;">Form Code:</td>
                  <td style="padding: 8px 0; color: #1C1C1C;">${params.formCode}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #5C5C5C;">Reviewed By:</td>
                  <td style="padding: 8px 0; color: #1C1C1C;">${params.approverName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #5C5C5C;">Reviewed At:</td>
                  <td style="padding: 8px 0; color: #1C1C1C;">${format(new Date(), 'PPpp')}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #FFEBEE; border-left: 4px solid #B71C1C; padding: 16px; border-radius: 4px; margin: 20px 0;">
              <p style="color: #B71C1C; font-weight: 600; margin: 0 0 8px 0;">Reason for Rejection:</p>
              <p style="color: #5C5C5C; margin: 0; font-style: italic;">&quot;${params.rejectionReason}&quot;</p>
            </div>
            
            <div style="text-align: center; margin-top: 24px;">
              <p style="color: #5C5C5C;">If you have questions about this decision, please contact the approver directly.</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #E0E0E0; margin: 24px 0;" />
            
            <p style="color: #9E9E9E; font-size: 12px; text-align: center;">
              This is an automated notification from IOI Acidchem Enterprise Platform.
            </p>
          </div>
        </div>
      `;

      const result = await sendEmailMutation.mutateAsync({
        to: params.requestorEmail,
        subject,
        body,
        importance: 'Normal',
        isHtml: true,
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to send email');
      }
      
      return result;
    },
  });
}