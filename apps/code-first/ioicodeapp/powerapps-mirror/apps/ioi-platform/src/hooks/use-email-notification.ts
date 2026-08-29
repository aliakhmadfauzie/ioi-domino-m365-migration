import { useMutation } from '@tanstack/react-query';
import { ensureInitialized } from '@/lib/app-init';

// Stub types and service since Office365 services are not yet generated
interface ClientSendHtmlMessage {
  To: string;
  Subject: string;
  Body: string;
  Cc?: string;
  Importance?: string;
}

// Stub service for Office365 Outlook - will be replaced with actual generated service
const Office365OutlookService = {
  SendEmailV2: async (_message: ClientSendHtmlMessage): Promise<{ success: boolean; error?: { message: string } }> => {
    console.log('[Office365OutlookService] Stub: Would send email to', _message.To);
    // In production, this would call the actual Office365 connector
    return { success: true };
  }
};

export interface EmailNotificationParams {
  to: string;
  cc?: string;
  subject: string;
  body: string;
  formCode?: string;
  requestItemId?: number;
  notifyType?: 'Submission' | 'Approval' | 'Rejection' | 'Reminder';
}

export interface SendNotificationResult {
  success: boolean;
  notificationId?: number;
  error?: string;
}

/**
 * Hook to send email notifications via Office 365 Outlook connector
 */
export function useEmailNotification() {
  const mutation = useMutation<SendNotificationResult, Error, EmailNotificationParams>({
    mutationFn: async (params: EmailNotificationParams): Promise<SendNotificationResult> => {
      console.log('[EmailNotification] Sending email to:', params.to);
      console.log('[EmailNotification] Subject:', params.subject);
      
      try {
        // Initialize SDK before service call
        await ensureInitialized();
        
        // Send email via Office 365 Outlook
        const emailMessage: ClientSendHtmlMessage = {
          To: params.to,
          Subject: params.subject,
          Body: params.body,
          Cc: params.cc,
          Importance: 'High',
        };

        const result = await Office365OutlookService.SendEmailV2(emailMessage);
        
        if (result.success) {
          console.log('[EmailNotification] Email sent successfully');
          return { success: true };
        } else {
          const errorMsg = result.error?.message || 'Failed to send email';
          console.error('[EmailNotification] Email send failed:', errorMsg);
          return { success: false, error: errorMsg };
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to send email';
        console.error('[EmailNotification] Exception during email send:', error);
        return { success: false, error: errorMessage };
      }
    },
  });

  return {
    sendNotification: mutation.mutateAsync,
    isSending: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * Generate email body for form submission notification
 */
export function generateSubmissionEmailBody(params: {
  ticketId: string;
  formName: string;
  formCode: string;
  submittedBy: string;
  submittedByEmail: string;
  submittedDate: string;
  approverName: string;
  approverRole: 'Approver' | 'HoD' | 'Manager';
  priority?: string;
  justification?: string;
}): string {
  const { ticketId, formName, formCode, submittedBy, submittedByEmail, submittedDate, approverName, approverRole, priority, justification } = params;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%); padding: 30px; border-radius: 12px 12px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 24px;">New ${formName} Request</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Ticket: ${ticketId}</p>
    </div>
    
    <div style="background: #ffffff; padding: 30px; border: 1px solid #E0E0E0; border-top: none;">
      <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">Dear ${approverName},</p>
      
      <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
        A new <strong>${formName}</strong> (${formCode}) request has been submitted and requires your review as <strong>${approverRole}</strong>.
      </p>
      
      <div style="background: #F5F5F5; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #757575; font-size: 13px; width: 140px;">Ticket ID:</td>
            <td style="padding: 8px 0; color: #1B5E20; font-size: 14px; font-weight: 600; font-family: monospace;">${ticketId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #757575; font-size: 13px;">Form Type:</td>
            <td style="padding: 8px 0; color: #1C1C1C; font-size: 14px;">${formName} (${formCode})</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #757575; font-size: 13px;">Submitted By:</td>
            <td style="padding: 8px 0; color: #1C1C1C; font-size: 14px;">${submittedBy}<br/><span style="color: #757575; font-size: 12px;">${submittedByEmail}</span></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #757575; font-size: 13px;">Date:</td>
            <td style="padding: 8px 0; color: #1C1C1C; font-size: 14px;">${submittedDate}</td>
          </tr>
          ${priority ? `
          <tr>
            <td style="padding: 8px 0; color: #757575; font-size: 13px;">Priority:</td>
            <td style="padding: 8px 0;">
              <span style="background: ${priority === 'High' ? '#FFEBEE' : priority === 'Normal' ? '#E3F2FD' : '#F5F5F5'}; 
                           color: ${priority === 'High' ? '#C62828' : priority === 'Normal' ? '#1565C2' : '#616161'}; 
                           padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500;">${priority}</span>
            </td>
          </tr>` : ''}
        </table>
      </div>
      
      ${justification ? `
      <div style="background: #E8F5E9; border-left: 4px solid #1B5E20; padding: 16px 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
        <p style="color: #1B5E20; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Justification</p>
        <p style="color: #333; font-size: 14px; margin: 0; line-height: 1.5;">${justification}</p>
      </div>` : ''}
      
      <p style="color: #757575; font-size: 13px; margin: 20px 0 0 0; padding-top: 20px; border-top: 1px solid #E0E0E0;">
        Please log in to the IOI IT Platform to review and take action on this request.
      </p>
    </div>
    
    <div style="background: #FAFAFA; padding: 16px 30px; border: 1px solid #E0E0E0; border-top: none; border-radius: 0 0 12px 12px; text-align: center;">
      <p style="color: #9E9E9E; font-size: 12px; margin: 0;">This is an automated notification from IOI Acidchem Enterprise Platform</p>
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Generate status update email body
 */
export function generateStatusUpdateEmailBody(params: {
  ticketId: string;
  formName: string;
  action: 'Approved' | 'Rejected' | 'Returned';
  actionBy: string;
  actionByRole: string;
  recipientName: string;
  comments?: string;
  nextStep?: string;
}): string {
  const { ticketId, formName, action, actionBy, actionByRole, recipientName, comments, nextStep } = params;
  
  const actionColors = {
    Approved: { bg: '#E8F5E9', header: '#1B5E20', text: '#2E7D32' },
    Rejected: { bg: '#FFEBEE', header: '#C62828', text: '#D32F2F' },
    Returned: { bg: '#FFF3E0', header: '#E65100', text: '#F57C00' },
  };
  
  const colors = actionColors[action];

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: ${colors.bg}; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: ${colors.header}; margin: 0; font-size: 24px;">Request ${action}</h1>
      <p style="color: ${colors.text}; margin: 8px 0 0 0; font-size: 14px;">Ticket: ${ticketId}</p>
    </div>
    
    <div style="background: #ffffff; padding: 30px; border: 1px solid #E0E0E0; border-top: none;">
      <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">Dear ${recipientName},</p>
      
      <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
        Your <strong>${formName}</strong> request (${ticketId}) has been <strong style="color: ${colors.text};">${action.toLowerCase()}</strong> by ${actionBy} (${actionByRole}).
      </p>
      
      ${comments ? `
      <div style="background: #F5F5F5; border-left: 4px solid ${colors.header}; padding: 16px 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
        <p style="color: #757575; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;">Comments</p>
        <p style="color: #333; font-size: 14px; margin: 0; line-height: 1.5;">${comments}</p>
      </div>` : ''}
      
      ${nextStep ? `
      <div style="background: #E3F2FD; padding: 16px 20px; border-radius: 8px; margin: 20px 0;">
        <p style="color: #1565C2; font-size: 14px; margin: 0;"><strong>Next Step:</strong> ${nextStep}</p>
      </div>` : ''}
    </div>
    
    <div style="background: #FAFAFA; padding: 16px 30px; border: 1px solid #E0E0E0; border-top: none; border-radius: 0 0 12px 12px; text-align: center;">
      <p style="color: #9E9E9E; font-size: 12px; margin: 0;">This is an automated notification from IOI Acidchem Enterprise Platform</p>
    </div>
  </div>
</body>
</html>
`;
}