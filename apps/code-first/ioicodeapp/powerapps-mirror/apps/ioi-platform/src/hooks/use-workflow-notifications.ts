/**
 * Workflow Notification Hook
 * 
 * Integrates workflow state changes with the notification service.
 * Sends appropriate emails for each workflow action.
 * 
 * NOTE: This is a placeholder implementation. In production, this would
 * integrate with Office 365 Outlook connector or Power Automate flows.
 */

import { useCallback } from 'react';
import { toast } from 'sonner';
import type {
  ApprovalActionType,
  NotificationType,
  NotificationData,
  ApproverRoleType,
} from '@/types/it-approval-workflow';

export interface WorkflowNotificationConfig {
  /** Form code (e.g., 'EAF', 'NIR') */
  formcode: string;
  /** Form ID */
  formId: string;
  /** Form title/reference */
  formTitle: string;
  /** Submitter info */
  submitter: {
    email: string;
    name: string;
  };
  /** Current stage info */
  currentStage: {
    key: string;
    name: string;
    order: number;
  };
  /** Current approver info */
  currentApprover?: {
    id: string;
    email: string;
    name: string;
    role: ApproverRoleType;
  };
  /** Next approver info (if any) */
  nextApprover?: {
    id: string;
    email: string;
    name: string;
    role: ApproverRoleType;
  };
  /** Site info */
  site?: string;
  /** Urgency level */
  urgency?: 'Low' | 'Normal' | 'High' | 'Critical';
}

interface NotificationResult {
  success: boolean;
  notificationsSent: string[];
  errors: string[];
}

interface UseWorkflowNotificationsResult {
  /** Notify on submission */
  notifySubmission: (config: WorkflowNotificationConfig) => Promise<NotificationResult>;
  /** Notify on approval */
  notifyApproval: (config: WorkflowNotificationConfig, comments?: string) => Promise<NotificationResult>;
  /** Notify on rejection */
  notifyRejection: (config: WorkflowNotificationConfig, comments: string) => Promise<NotificationResult>;
  /** Notify on return for revision */
  notifyReturn: (config: WorkflowNotificationConfig, comments: string) => Promise<NotificationResult>;
  /** Notify on escalation */
  notifyEscalation: (config: WorkflowNotificationConfig, escalatedTo: { email: string; name: string }) => Promise<NotificationResult>;
  /** Notify on delegation */
  notifyDelegation: (config: WorkflowNotificationConfig, delegatedTo: { email: string; name: string }, reason: string) => Promise<NotificationResult>;
  /** Notify on completion */
  notifyCompletion: (config: WorkflowNotificationConfig) => Promise<NotificationResult>;
  /** Send reminder */
  sendReminder: (config: WorkflowNotificationConfig, daysOverdue: number) => Promise<NotificationResult>;
  /** Send notification based on workflow action */
  sendNotification: (action: ApprovalActionType, config: WorkflowNotificationConfig, comments?: string) => Promise<NotificationResult>;
  /** Is sending */
  isSending: boolean;
}

/**
 * Maps notification type to email subject
 */
function getNotificationSubject(type: NotificationType, formCode: string, formTitle: string): string {
  const subjects: Record<NotificationType, string> = {
    'SubmissionReceived': `[${formCode}] New Request Submitted: ${formTitle}`,
    'ApprovalRequired': `[${formCode}] Action Required: ${formTitle}`,
    'Approved': `[${formCode}] Request Approved: ${formTitle}`,
    'Rejected': `[${formCode}] Request Rejected: ${formTitle}`,
    'Returned': `[${formCode}] Request Returned for Revision: ${formTitle}`,
    'Escalated': `[URGENT] [${formCode}] Request Escalated: ${formTitle}`,
    'Delegated': `[${formCode}] Request Delegated to You: ${formTitle}`,
    'Completed': `[${formCode}] Request Completed: ${formTitle}`,
    'Reminder': `[REMINDER] [${formCode}] Action Required: ${formTitle}`,
    'Overdue': `[OVERDUE] [${formCode}] Immediate Action Required: ${formTitle}`,
  };
  return subjects[type];
}

/**
 * Build form URL for email links
 */
function buildFormUrl(formCode: string, formId: string): string {
  const baseUrl = window.location.origin;
  // Map form codes to routes
  const routeMap: Record<string, string> = {
    'EAF': '/forms/employee-application',
    'NIR': '/forms/new-it-request',
    'RS': '/forms/resignation',
    'SFAR': '/forms/shared-folder-access',
    'UR': '/forms/user-request',
    'ITSSR': '/forms/it-support',
    'IAL1': '/forms/it-access-level-1',
    'ITDR': '/forms/it-disposal',
  };
  const route = routeMap[formCode] || '/forms';
  return `${baseUrl}${route}/${formId}`;
}

/**
 * Queue notification for sending (placeholder implementation)
 */
async function queueEmailNotification(
  type: NotificationType,
  data: NotificationData,
  _ccRecipients?: string[]
): Promise<boolean> {
  try {
    // In production, this would call:
    // 1. Office 365 Outlook connector to send email
    // 2. Or queue to a Power Automate flow
    // 3. Or call a backend API endpoint
    
    console.log(`[Notification] Queuing ${type} email:`, {
      to: data.recipientEmail,
      subject: getNotificationSubject(type, data.formCode, data.formTitle),
      data,
    });

    // Show toast for development/demo
    const toastMessages: Record<NotificationType, string> = {
      'SubmissionReceived': `Submission confirmation sent to ${data.recipientName}`,
      'ApprovalRequired': `Approval request sent to ${data.recipientName}`,
      'Approved': `Approval notification sent to ${data.recipientName}`,
      'Rejected': `Rejection notification sent to ${data.recipientName}`,
      'Returned': `Return notification sent to ${data.recipientName}`,
      'Escalated': `Escalation notice sent to ${data.recipientName}`,
      'Delegated': `Delegation notice sent to ${data.recipientName}`,
      'Completed': `Completion notification sent to ${data.recipientName}`,
      'Reminder': `Reminder sent to ${data.recipientName}`,
      'Overdue': `Overdue alert sent to ${data.recipientName}`,
    };

    toast.info(toastMessages[type] || `Email sent to ${data.recipientName}`);
    return true;
  } catch (error) {
    console.error(`[Notification] Failed to send ${type} email:`, error);
    return false;
  }
}

/**
 * Hook for workflow notifications
 */
export function useWorkflowNotifications(): UseWorkflowNotificationsResult {
  
  const notifySubmission = useCallback(async (
    config: WorkflowNotificationConfig
  ): Promise<NotificationResult> => {
    const notificationsSent: string[] = [];
    const errors: string[] = [];
    const formUrl = buildFormUrl(config.formcode, config.formId);

    // Notify submitter of receipt
    const submitterResult = await queueEmailNotification('SubmissionReceived', {
      recipientEmail: config.submitter.email,
      recipientName: config.submitter.name,
      formTitle: config.formTitle,
      formCode: config.formcode,
      formId: config.formId,
      currentStage: config.currentStage.name,
      action: 'Submit',
      actorName: config.submitter.name,
      formUrl,
    });

    if (submitterResult) {
      notificationsSent.push(config.submitter.email);
    } else {
      errors.push(`Failed to notify submitter: ${config.submitter.email}`);
    }

    // Notify first approver
    if (config.currentApprover) {
      const approverResult = await queueEmailNotification('ApprovalRequired', {
        recipientEmail: config.currentApprover.email,
        recipientName: config.currentApprover.name,
        formTitle: config.formTitle,
        formCode: config.formcode,
        formId: config.formId,
        currentStage: config.currentStage.name,
        action: 'Submit',
        actorName: config.submitter.name,
        formUrl,
      });

      if (approverResult) {
        notificationsSent.push(config.currentApprover.email);
      } else {
        errors.push(`Failed to notify approver: ${config.currentApprover.email}`);
      }
    }

    return {
      success: errors.length === 0,
      notificationsSent,
      errors,
    };
  }, []);

  const notifyApproval = useCallback(async (
    config: WorkflowNotificationConfig,
    comments?: string
  ): Promise<NotificationResult> => {
    const notificationsSent: string[] = [];
    const errors: string[] = [];
    const formUrl = buildFormUrl(config.formcode, config.formId);

    // Notify submitter of approval
    const submitterResult = await queueEmailNotification('Approved', {
      recipientEmail: config.submitter.email,
      recipientName: config.submitter.name,
      formTitle: config.formTitle,
      formCode: config.formcode,
      formId: config.formId,
      currentStage: config.currentStage.name,
      action: 'Approve',
      actorName: config.currentApprover?.name || 'Approver',
      comments,
      formUrl,
    });

    if (submitterResult) {
      notificationsSent.push(config.submitter.email);
    } else {
      errors.push(`Failed to notify submitter: ${config.submitter.email}`);
    }

    // Notify next approver if there is one
    if (config.nextApprover) {
      const nextApproverResult = await queueEmailNotification('ApprovalRequired', {
        recipientEmail: config.nextApprover.email,
        recipientName: config.nextApprover.name,
        formTitle: config.formTitle,
        formCode: config.formcode ,
        formId: config.formId,
        currentStage: config.currentStage.name,
        action: 'Approve',
        actorName: config.currentApprover?.name || 'Previous Approver',
        formUrl,
      });

      if (nextApproverResult) {
        notificationsSent.push(config.nextApprover.email);
      } else {
        errors.push(`Failed to notify next approver: ${config.nextApprover.email}`);
      }
    }

    return {
      success: errors.length === 0,
      notificationsSent,
      errors,
    };
  }, []);

  const notifyRejection = useCallback(async (
    config: WorkflowNotificationConfig,
    comments: string
  ): Promise<NotificationResult> => {
    const notificationsSent: string[] = [];
    const errors: string[] = [];
    const formUrl = buildFormUrl(config.formcode, config.formId);

    const result = await queueEmailNotification('Rejected', {
      recipientEmail: config.submitter.email,
      recipientName: config.submitter.name,
      formTitle: config.formTitle,
      formCode: config.formcode,
      formId: config.formId,
      currentStage: config.currentStage.name,
      action: 'Reject',
      actorName: config.currentApprover?.name || 'Approver',
      comments,
      formUrl,
    });

    if (result) {
      notificationsSent.push(config.submitter.email);
    } else {
      errors.push(`Failed to notify submitter: ${config.submitter.email}`);
    }

    return { success: errors.length === 0, notificationsSent, errors };
  }, []);

  const notifyReturn = useCallback(async (
    config: WorkflowNotificationConfig,
    comments: string
  ): Promise<NotificationResult> => {
    const notificationsSent: string[] = [];
    const errors: string[] = [];
    const formUrl = buildFormUrl(config.formcode, config.formId);

    const result = await queueEmailNotification('Returned', {
      recipientEmail: config.submitter.email,
      recipientName: config.submitter.name,
      formTitle: config.formTitle,
      formCode: config.formcode,
      formId: config.formId,
      currentStage: config.currentStage.name,
      action: 'Return',
      actorName: config.currentApprover?.name || 'Approver',
      comments,
      formUrl,
    });

    if (result) {
      notificationsSent.push(config.submitter.email);
    } else {
      errors.push(`Failed to notify submitter: ${config.submitter.email}`);
    }

    return { success: errors.length === 0, notificationsSent, errors };
  }, []);

  const notifyEscalation = useCallback(async (
    config: WorkflowNotificationConfig,
    escalatedTo: { email: string; name: string }
  ): Promise<NotificationResult> => {
    const notificationsSent: string[] = [];
    const errors: string[] = [];
    const formUrl = buildFormUrl(config.formcode, config.formId);

    const result = await queueEmailNotification('Escalated', {
      recipientEmail: escalatedTo.email,
      recipientName: escalatedTo.name,
      formTitle: config.formTitle,
      formCode: config.formcode,
      formId: config.formId,
      currentStage: config.currentStage.name,
      action: 'Escalate',
      actorName: 'System',
      formUrl,
    });

    if (result) {
      notificationsSent.push(escalatedTo.email);
    } else {
      errors.push(`Failed to notify escalation target: ${escalatedTo.email}`);
    }

    return { success: errors.length === 0, notificationsSent, errors };
  }, []);

  const notifyDelegation = useCallback(async (
    config: WorkflowNotificationConfig,
    delegatedTo: { email: string; name: string },
    reason: string
  ): Promise<NotificationResult> => {
    const notificationsSent: string[] = [];
    const errors: string[] = [];
    const formUrl = buildFormUrl(config.formcode, config.formId);

    const result = await queueEmailNotification('Delegated', {
      recipientEmail: delegatedTo.email,
      recipientName: delegatedTo.name,
      formTitle: config.formTitle,
      formCode: config.formcode,
      formId: config.formId,
      currentStage: config.currentStage.name,
      action: 'Delegate',
      actorName: config.currentApprover?.name || 'Approver',
      comments: reason,
      formUrl,
    });

    if (result) {
      notificationsSent.push(delegatedTo.email);
    } else {
      errors.push(`Failed to notify delegate: ${delegatedTo.email}`);
    }

    return { success: errors.length === 0, notificationsSent, errors };
  }, []);

  const notifyCompletion = useCallback(async (
    config: WorkflowNotificationConfig
  ): Promise<NotificationResult> => {
    const notificationsSent: string[] = [];
    const errors: string[] = [];
    const formUrl = buildFormUrl(config.formcode, config.formId);

    const result = await queueEmailNotification('Completed', {
      recipientEmail: config.submitter.email,
      recipientName: config.submitter.name,
      formTitle: config.formTitle,
      formCode: config.formcode,
      formId: config.formId,
      currentStage: config.currentStage.name,
      action: 'Complete',
      actorName: 'System',
      formUrl,
    });

    if (result) {
      notificationsSent.push(config.submitter.email);
    } else {
      errors.push(`Failed to notify submitter: ${config.submitter.email}`);
    }

    return { success: errors.length === 0, notificationsSent, errors };
  }, []);

  const sendReminder = useCallback(async (
    config: WorkflowNotificationConfig,
    daysOverdue: number
  ): Promise<NotificationResult> => {
    const notificationsSent: string[] = [];
    const errors: string[] = [];
    const formUrl = buildFormUrl(config.formcode, config.formId);

    if (config.currentApprover) {
      const notificationType: NotificationType = daysOverdue > 0 ? 'Overdue' : 'Reminder';
      const result = await queueEmailNotification(notificationType, {
        recipientEmail: config.currentApprover.email,
        recipientName: config.currentApprover.name,
        formTitle: config.formTitle,
        formCode: config.formcode,
        formId: config.formId,
        currentStage: config.currentStage.name,
        action: 'Approve', // Using Approve as placeholder for reminder notification
        actorName: 'System',
        comments: `This request has been pending for ${daysOverdue} days`,
        formUrl,
      });

      if (result) {
        notificationsSent.push(config.currentApprover.email);
      } else {
        errors.push(`Failed to send reminder: ${config.currentApprover.email}`);
      }
    }

    return { success: errors.length === 0, notificationsSent, errors };
  }, []);

  const sendNotification = useCallback(async (
    action: ApprovalActionType,
    config: WorkflowNotificationConfig,
    comments?: string
  ): Promise<NotificationResult> => {
    switch (action) {
      case 'Submit':
        return notifySubmission(config);
      case 'Approve':
        return notifyApproval(config, comments);
      case 'Reject':
        return notifyRejection(config, comments || 'Rejected');
      case 'Return':
      case 'Rework':
        return notifyReturn(config, comments || 'Returned for revision');
      case 'Complete':
        return notifyCompletion(config);
      default:
        return { success: true, notificationsSent: [], errors: [] };
    }
  }, [notifySubmission, notifyApproval, notifyRejection, notifyReturn, notifyCompletion]);

  return {
    notifySubmission,
    notifyApproval,
    notifyRejection,
    notifyReturn,
    notifyEscalation,
    notifyDelegation,
    notifyCompletion,
    sendReminder,
    sendNotification,
    isSending: false,
  };
}

/**
 * Build notification config from a form submission
 */
export function buildNotificationConfigFromForm(
  formCode: string,
  formId: string,
  formTitle: string,
  submitterEmail: string,
  submitterName: string,
  stageName: string,
  stageOrder: number
): WorkflowNotificationConfig {
  return {
    formcode: formCode,
    formId,
    formTitle,
    submitter: {
      email: submitterEmail,
      name: submitterName,
    },
    currentStage: {
      key: stageName.toLowerCase().replace(/\s+/g, '-'),
      name: stageName,
      order: stageOrder,
    },
  };
}

export default useWorkflowNotifications;