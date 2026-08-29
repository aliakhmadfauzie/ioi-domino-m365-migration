// Email templates for approval notifications
// Simplified version without InMemory model dependencies

import { buildIoiDeepLink } from '@/hooks/use-app-params';

const APP_BASE_URL = 'https://apps.powerapps.com/play/e/Default-c6f6218b-5ff2-48b5-9114-f89da23caadb/a/26fddd33-46a8-43ae-a1f2-e90fa3b003bf';

export interface ApprovalEmailData {
  submissionTitle: string;
  submissionId: string;
  formCode: string;
  action: 'approved' | 'rejected' | 'returned';
  approverName: string;
  comments?: string;
  recipientName: string;
  recipientEmail: string;
}

export interface PendingApprovalEmailData {
  submissionTitle: string;
  submissionId: string;
  formCode: string;
  submitterName: string;
  approverName: string;
  approverEmail: string;
  currentLevel: number;
  requiredLevels: number;
}

/**
 * Build a deep link to a specific submission in the Power Apps app.
 * Power Automate flows call this pattern to generate email links.
 */
export function getSubmissionDeepLink(
  formCode: string,
  itemId: number | string,
  action: 'view' | 'edit' | 'approve' = 'view'
): string {
  return buildIoiDeepLink({
    formCode: formCode.toUpperCase(),
    itemId: Number(itemId),
    action,
  });
}

/**
 * Generate approval notification email content with deep link
 */
export function generateApprovalEmail(data: ApprovalEmailData): { subject: string; body: string } {
  const actionText = data.action === 'approved' ? 'Approved' :
                     data.action === 'rejected' ? 'Rejected' : 'Returned';
  const deepLink = getSubmissionDeepLink(data.formCode, data.submissionId, 'view');

  return {
    subject: `[IOI Platform] ${data.formCode} - ${data.submissionTitle} - ${actionText}`,
    body: `
Dear ${data.recipientName},

Your submission "${data.submissionTitle}" (${data.formCode}) has been ${data.action} by ${data.approverName}.

${data.comments ? `Comments: ${data.comments}\n` : ''}

🔗 View your submission: ${deepLink}

Best regards,
IOI Enterprise Platform
    `.trim(),
  };
}

/**
 * Generate pending approval notification email content with deep link
 */
export function generatePendingApprovalEmail(data: PendingApprovalEmailData): { subject: string; body: string } {
  const deepLink = getSubmissionDeepLink(data.formCode, data.submissionId, 'approve');

  return {
    subject: `[IOI Platform] Action Required: ${data.formCode} - ${data.submissionTitle}`,
    body: `
Dear ${data.approverName},

A new submission requires your approval:

Title: ${data.submissionTitle}
Form: ${data.formCode}
Submitted by: ${data.submitterName}
Approval Level: ${data.currentLevel} of ${data.requiredLevels}

🔗 Review and approve: ${deepLink}

Best regards,
IOI Enterprise Platform
    `.trim(),
  };
}
