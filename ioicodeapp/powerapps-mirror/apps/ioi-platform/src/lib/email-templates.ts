// Email templates for approval notifications
// Simplified version without InMemory model dependencies

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
 * Generate approval notification email content
 */
export function generateApprovalEmail(data: ApprovalEmailData): { subject: string; body: string } {
  const actionText = data.action === 'approved' ? 'Approved' : 
                     data.action === 'rejected' ? 'Rejected' : 'Returned';
  
  return {
    subject: `[IOI Platform] ${data.formCode} - ${data.submissionTitle} - ${actionText}`,
    body: `
Dear ${data.recipientName},

Your submission "${data.submissionTitle}" (${data.formCode}) has been ${data.action} by ${data.approverName}.

${data.comments ? `Comments: ${data.comments}\n` : ''}

Please log in to the IOI Enterprise Platform to view the details.

Best regards,
IOI Enterprise Platform
    `.trim(),
  };
}

/**
 * Generate pending approval notification email content
 */
export function generatePendingApprovalEmail(data: PendingApprovalEmailData): { subject: string; body: string } {
  return {
    subject: `[IOI Platform] Action Required: ${data.formCode} - ${data.submissionTitle}`,
    body: `
Dear ${data.approverName},

A new submission requires your approval:

Title: ${data.submissionTitle}
Form: ${data.formCode}
Submitted by: ${data.submitterName}
Approval Level: ${data.currentLevel} of ${data.requiredLevels}

Please log in to the IOI Enterprise Platform to review and take action.

Best regards,
IOI Enterprise Platform
    `.trim(),
  };
}