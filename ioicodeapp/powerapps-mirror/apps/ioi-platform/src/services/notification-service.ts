/**
 * Notification Service
 *
 * Handles email notifications for form submissions and approvals.
 * Uses Office 365 connector when available, otherwise logs to console.
 */

import { getITFormDetailPath } from '@/lib/it-form-routes';

// Local type definition to avoid circular dependency with deprecated sharepoint-submission-service
export interface SharePointSubmission {
  GUID: string;
  TicketId: string;
  FormCode: string;
  Title: string;
  CurrentAction: string;
  Priority?: string;
  SubmittedBy: {
    Email: string;
    DisplayName?: string;
  };
  SubmittedDate: string;
}

// =============================================================================
// TYPES
// =============================================================================

export interface EmailNotification {
  to: string[];
  cc?: string[];
  subject: string;
  body: string;
  importance?: 'Low' | 'Normal' | 'High';
}

export type NotificationAction =
  | 'Submitted'
  | 'Approved'
  | 'Rejected'
  | 'Returned'
  | 'Delegated'
  | 'Completed'
  | 'Escalated'
  | 'SLAWarning';

export interface NotificationResult {
  success: boolean;
  notificationId?: string;
  error?: string;
}

// =============================================================================
// EMAIL TEMPLATES
// =============================================================================

const IOI_LOGO_URL = 'https://www.ioigroup.com/Content/PGCIS/Images/IOI-logo.png';
const PORTAL_URL = 'https://apps.powerapps.com/ioi-it-portal';

function getSubmissionDetailUrl(submission: SharePointSubmission): string {
  return `${PORTAL_URL}${getITFormDetailPath(submission.FormCode, submission.GUID)}`;
}

function getEmailHeader(): string {
  return `
    <div style="background-color: #1B5E20; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-family: 'Segoe UI', sans-serif; font-size: 20px;">
        IOI IT Department
      </h1>
    </div>
  `;
}

function getEmailFooter(): string {
  return `
    <div style="background-color: #F5F5F5; padding: 16px; text-align: center; font-family: 'Segoe UI', sans-serif; font-size: 12px; color: #5C5C5C;">
      <p style="margin: 0;">This is an automated notification from the IOI IT Portal.</p>
      <p style="margin: 8px 0 0 0;">
        <a href="${PORTAL_URL}" style="color: #1B5E20; text-decoration: none;">Open IT Portal</a>
      </p>
    </div>
  `;
}

function getStatusBadge(status: string): string {
  const colors: Record<string, { bg: string; text: string }> = {
    Submitted: { bg: '#EAF0FB', text: '#1752A8' },
    Approved: { bg: '#E8F5E9', text: '#166534' },
    Rejected: { bg: '#FDEDEA', text: '#9B2F23' },
    Returned: { bg: '#FFF3E0', text: '#7B3E00' },
    Completed: { bg: '#E8F5E9', text: '#166534' },
    Pending: { bg: '#FFFDE7', text: '#5A4A00' },
    InProgress: { bg: '#FFF3E0', text: '#7B3E00' },
  };

  const style = colors[status] || colors.Pending;

  return `
    <span style="
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      background-color: ${style.bg};
      color: ${style.text};
      font-size: 12px;
      font-weight: 600;
    ">${status}</span>
  `;
}

function getPriorityBadge(priority: string): string {
  const colors: Record<string, string> = {
    Critical: '#9B2F23',
    High: '#7B3E00',
    Normal: '#424242',
    Low: '#5C5C5C',
  };

  return `
    <span style="
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      background-color: ${colors[priority] || colors.Normal};
      color: white;
      font-size: 12px;
      font-weight: 600;
    ">${priority}</span>
  `;
}

// =============================================================================
// NOTIFICATION TEMPLATES
// =============================================================================

function buildSubmissionConfirmationEmail(submission: SharePointSubmission): EmailNotification {
  const formData = JSON.parse(submission.FormData);

  const body = `
    ${getEmailHeader()}
    <div style="padding: 24px; font-family: 'Segoe UI', sans-serif;">
      <h2 style="color: #1C1C1C; font-size: 18px; margin: 0 0 16px 0;">
        Your Request Has Been Submitted
      </h2>

      <p style="color: #5C5C5C; font-size: 14px; margin: 0 0 24px 0;">
        Thank you for your submission. Your request is now being processed.
      </p>

      <div style="background-color: #FAFAFA; border: 1px solid #E0E0E0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5C5C5C;">Ticket ID</td>
            <td style="padding: 8px 0; font-size: 14px; color: #1B5E20; font-weight: 600;">${submission.TicketId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5C5C5C;">Form Type</td>
            <td style="padding: 8px 0; font-size: 14px; color: #1C1C1C;">${submission.FormCode}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5C5C5C;">Status</td>
            <td style="padding: 8px 0;">${getStatusBadge(submission.CurrentAction)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5C5C5C;">Priority</td>
            <td style="padding: 8px 0;">${getPriorityBadge(submission.Priority)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5C5C5C;">Category</td>
            <td style="padding: 8px 0; font-size: 14px; color: #1C1C1C;">${formData.category || 'General'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5C5C5C;">Submitted</td>
            <td style="padding: 8px 0; font-size: 14px; color: #1C1C1C;">${new Date(submission.SubmittedDate).toLocaleString()}</td>
          </tr>
          ${submission.DueDate ? `
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5C5C5C;">Expected Response</td>
            <td style="padding: 8px 0; font-size: 14px; color: #166534; font-weight: 500;">${new Date(submission.DueDate).toLocaleString()}</td>
          </tr>
          ` : ''}
        </table>
      </div>

      ${formData.description ? `
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 14px; color: #1C1C1C; margin: 0 0 8px 0;">Description</h3>
        <p style="font-size: 14px; color: #5C5C5C; margin: 0; padding: 12px; background-color: #F5F5F5; border-radius: 4px;">
          ${formData.description}
        </p>
      </div>
      ` : ''}

      <div style="text-align: center; margin-top: 24px;">
        <a href="${getSubmissionDetailUrl(submission)}"
           style="display: inline-block; padding: 12px 24px; background-color: #1B5E20; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
          View Request Details
        </a>
      </div>
    </div>
    ${getEmailFooter()}
  `;

  return {
    to: [submission.SubmittedBy.Email],
    subject: `[${submission.TicketId}] Request Submitted - ${submission.Title}`,
    body,
    importance: submission.Priority === 'Critical' ? 'High' : 'Normal',
  };
}

function buildApprovalNotificationEmail(
  submission: SharePointSubmission,
  action: NotificationAction,
  approverName: string,
  comments?: string
): EmailNotification {
  const actionLabels: Record<NotificationAction, { title: string; color: string }> = {
    Submitted: { title: 'Submitted', color: '#1752A8' },
    Approved: { title: 'Approved', color: '#166534' },
    Rejected: { title: 'Rejected', color: '#9B2F23' },
    Returned: { title: 'Returned for Revision', color: '#7B3E00' },
    Delegated: { title: 'Delegated', color: '#1752A8' },
    Completed: { title: 'Completed', color: '#166534' },
    Escalated: { title: 'Escalated', color: '#9B2F23' },
    SLAWarning: { title: 'SLA Warning', color: '#7B3E00' },
  };

  const actionInfo = actionLabels[action] || actionLabels.Submitted;

  const body = `
    ${getEmailHeader()}
    <div style="padding: 24px; font-family: 'Segoe UI', sans-serif;">
      <div style="border-left: 4px solid ${actionInfo.color}; padding-left: 16px; margin-bottom: 24px;">
        <h2 style="color: #1C1C1C; font-size: 18px; margin: 0 0 8px 0;">
          Request ${actionInfo.title}
        </h2>
        <p style="color: #5C5C5C; font-size: 14px; margin: 0;">
          ${approverName} has ${action.toLowerCase()} your request.
        </p>
      </div>

      <div style="background-color: #FAFAFA; border: 1px solid #E0E0E0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5C5C5C;">Ticket ID</td>
            <td style="padding: 8px 0; font-size: 14px; color: #1B5E20; font-weight: 600;">${submission.TicketId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5C5C5C;">Status</td>
            <td style="padding: 8px 0;">${getStatusBadge(submission.CurrentAction)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5C5C5C;">Actioned By</td>
            <td style="padding: 8px 0; font-size: 14px; color: #1C1C1C;">${approverName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5C5C5C;">Date</td>
            <td style="padding: 8px 0; font-size: 14px; color: #1C1C1C;">${new Date().toLocaleString()}</td>
          </tr>
        </table>
      </div>

      ${comments ? `
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 14px; color: #1C1C1C; margin: 0 0 8px 0;">Comments</h3>
        <p style="font-size: 14px; color: #5C5C5C; margin: 0; padding: 12px; background-color: #F5F5F5; border-radius: 4px; border-left: 4px solid ${actionInfo.color};">
          "${comments}"
        </p>
      </div>
      ` : ''}

      <div style="text-align: center; margin-top: 24px;">
        <a href="${getSubmissionDetailUrl(submission)}"
           style="display: inline-block; padding: 12px 24px; background-color: #1B5E20; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
          View Request Details
        </a>
      </div>
    </div>
    ${getEmailFooter()}
  `;

  return {
    to: [submission.SubmittedBy.Email],
    subject: `[${submission.TicketId}] ${actionInfo.title} - ${submission.Title}`,
    body,
    importance: action === 'Rejected' || action === 'Escalated' ? 'High' : 'Normal',
  };
}

// =============================================================================
// SERVICE CLASS
// =============================================================================

export class NotificationService {
  /**
   * Send email notification
   * @todo Replace console.log with Office365 connector when available
   */
  private static async sendEmail(notification: EmailNotification): Promise<NotificationResult> {
    try {
      // TODO: Replace with Office 365 connector
      // const result = await office365Service.sendMail({
      //   to: notification.to.join(';'),
      //   cc: notification.cc?.join(';'),
      //   subject: notification.subject,
      //   body: notification.body,
      //   isHtml: true,
      //   importance: notification.importance,
      // });

      console.log('[NotificationService] Email sent:');
      console.log(`  To: ${notification.to.join(', ')}`);
      console.log(`  Subject: ${notification.subject}`);
      console.log(`  Importance: ${notification.importance}`);

      return {
        success: true,
        notificationId: `NOTIF-${Date.now()}`,
      };
    } catch (error) {
      console.error('[NotificationService] Failed to send email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Send submission confirmation notification
   */
  static async sendSubmissionConfirmation(submission: SharePointSubmission): Promise<NotificationResult> {
    const email = buildSubmissionConfirmationEmail(submission);
    return this.sendEmail(email);
  }

  /**
   * Send approval action notification
   */
  static async sendApprovalNotification(
    submission: SharePointSubmission,
    action: NotificationAction,
    approverName: string,
    comments?: string
  ): Promise<NotificationResult> {
    const email = buildApprovalNotificationEmail(submission, action, approverName, comments);
    return this.sendEmail(email);
  }

  /**
   * Send SLA warning notification
   */
  static async sendSLAWarning(submission: SharePointSubmission): Promise<NotificationResult> {
    const email: EmailNotification = {
      to: [submission.SubmittedBy.Email],
      cc: submission.AssignedTo ? [submission.AssignedTo.Email] : undefined,
      subject: `[SLA WARNING] ${submission.TicketId} - Response Required`,
      body: `
        ${getEmailHeader()}
        <div style="padding: 24px; font-family: 'Segoe UI', sans-serif;">
          <div style="border-left: 4px solid #7B3E00; padding-left: 16px; margin-bottom: 24px;">
            <h2 style="color: #7B3E00; font-size: 18px; margin: 0 0 8px 0;">
              ⚠️ SLA Warning
            </h2>
            <p style="color: #5C5C5C; font-size: 14px; margin: 0;">
              Your request is approaching its SLA deadline.
            </p>
          </div>

          <div style="background-color: #FFF3E0; border: 1px solid #7B3E00; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0; color: #7B3E00; font-size: 14px;">
              <strong>Ticket:</strong> ${submission.TicketId}<br>
              <strong>Due:</strong> ${submission.DueDate ? new Date(submission.DueDate).toLocaleString() : 'N/A'}
            </p>
          </div>

          <div style="text-align: center;">
            <a href="${getSubmissionDetailUrl(submission)}"
               style="display: inline-block; padding: 12px 24px; background-color: #7B3E00; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
              View Request
            </a>
          </div>
        </div>
        ${getEmailFooter()}
      `,
      importance: 'High',
    };

    return this.sendEmail(email);
  }
}

// =============================================================================
// REACT HOOKS
// =============================================================================

import { useMutation } from '@tanstack/react-query';

export function useSendSubmissionConfirmation() {
  return useMutation({
    mutationFn: (submission: SharePointSubmission) =>
      NotificationService.sendSubmissionConfirmation(submission),
  });
}

export function useSendApprovalNotification() {
  return useMutation({
    mutationFn: ({
      submission,
      action,
      approverName,
      comments,
    }: {
      submission: SharePointSubmission;
      action: NotificationAction;
      approverName: string;
      comments?: string;
    }) => NotificationService.sendApprovalNotification(submission, action, approverName, comments),
  });
}
