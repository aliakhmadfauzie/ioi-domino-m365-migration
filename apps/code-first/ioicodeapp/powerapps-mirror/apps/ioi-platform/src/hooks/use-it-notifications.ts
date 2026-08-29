/**
 * IT Notifications Service Hook
 * 
 * Handles notification triggers for IT workflow events:
 * - OnFormCreate: Notify CC and ISG recipients
 * - OnApproval: Notify requestor and next approver
 * - OnRejection: Notify requestor with rejection reason
 * - OnEscalation: Notify escalation chain
 */

import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import {
  type ITWorkflowStatus,
  type NotificationTrigger,
  ITNotificationRules,
} from '@/lib/it-routing-config';

// Notification Types
export interface ITNotification {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  recipients: string[];
  trigger: NotificationTrigger;
  timestamp: Date;
  formCode: string;
  submissionId: string;
}

// Notification Result
export interface NotificationResult {
  success: boolean;
  notifications: ITNotification[];
  errors?: string[];
}

// Hook Options
export interface UseITNotificationsOptions {
  submission: MainDBIT | null;
  formCode: string;
}

/**
 * Hook for IT workflow notifications
 */
export function useITNotifications(options: UseITNotificationsOptions) {
  const { submission, formCode } = options;
  
  // Extract recipients from submission remarks
  const extractRecipients = useCallback((recipientType: string, fieldName?: string): string[] => {
    if (!submission) return [];
    
    const recipients: string[] = [];
    
    try {
      const remarks = submission.remarks ? JSON.parse(submission.remarks) : {};
      
      if (recipientType === 'Field' && fieldName) {
        // Get from field
        if (fieldName === 'CC' && remarks.cc) {
          if (Array.isArray(remarks.cc)) {
            recipients.push(...remarks.cc.map((r: { email?: string }) => r.email).filter(Boolean));
          } else if (typeof remarks.cc === 'string') {
            recipients.push(remarks.cc);
          }
        }
        if (fieldName === 'Requestor' && submission.requestoremail) {
          recipients.push(submission.requestoremail);
        }
      }
      
      if (recipientType === 'Static' && fieldName === 'ISG_Recipients') {
        // Static ISG recipients - in production, this would come from config
        recipients.push('isg-team@ioigroup.com');
      }
      
      if (recipientType === 'Role' && fieldName) {
        // Role-based recipients - in production, resolve from user directory
        switch (fieldName) {
          case 'IT_ADMIN':
            recipients.push('it-admin@ioigroup.com');
            break;
          case 'IT_MANAGER':
            recipients.push('it-manager@ioigroup.com');
            break;
          case 'IS_ADMIN':
            recipients.push('is-admin@ioigroup.com');
            break;
          case 'IT_HOD':
            recipients.push('it-hod@ioigroup.com');
            break;
        }
      }
    } catch {
      // Ignore parse errors
    }
    
    return recipients;
  }, [submission]);
  
  // Get notification rules for a trigger
  const getRulesForTrigger = useCallback(
    (trigger: NotificationTrigger) => {
      return ITNotificationRules.filter((rule) => rule.trigger === trigger);
    },
    []
  );
  
  // Create notification for form creation
  const notifyOnFormCreate = useCallback((): NotificationResult => {
    if (!submission) {
      return { success: false, notifications: [], errors: ['No submission provided'] };
    }
    
    const rules = getRulesForTrigger('OnFormCreate');
    const notifications: ITNotification[] = [];
    
    for (const rule of rules) {
      const recipients: string[] = [];
      
      for (const recipient of rule.recipients) {
        recipients.push(...extractRecipients(recipient.type, recipient.value));
      }
      
      if (recipients.length > 0) {
        notifications.push({
          type: 'info',
          title: 'New IT Request Submitted',
          message: `A new ${formCode} request has been submitted and is pending review.`,
          recipients,
          trigger: 'OnFormCreate',
          timestamp: new Date(),
          formCode,
          submissionId: String(submission.id),
        });
      }
    }
    
    // Show toast
    if (notifications.length > 0) {
      toast.success('Notification sent', {
        description: `${notifications.length} notification(s) sent for new request`,
      });
    }
    
    return { success: true, notifications };
  }, [submission, formCode, getRulesForTrigger, extractRecipients]);
  
  // Create notification for approval
  const notifyOnApproval = useCallback(
    (approverName: string, newStatus: ITWorkflowStatus): NotificationResult => {
      if (!submission) {
        return { success: false, notifications: [], errors: ['No submission provided'] };
      }
      
      const rules = getRulesForTrigger('OnApproval');
      const notifications: ITNotification[] = [];
      
      for (const rule of rules) {
        const recipients: string[] = [];
        
        for (const recipient of rule.recipients) {
          recipients.push(...extractRecipients(recipient.type, recipient.value));
        }
        
        if (recipients.length > 0) {
          notifications.push({
            type: 'success',
            title: 'Request Approved',
            message: `Your ${formCode} request has been approved by ${approverName}. Status: ${newStatus}`,
            recipients,
            trigger: 'OnApproval',
            timestamp: new Date(),
            formCode,
            submissionId: String(submission.id),
          });
        }
      }
      
      // Show toast
      if (notifications.length > 0) {
        toast.success('Approval notification sent', {
          description: `Requestor has been notified of approval`,
        });
      }
      
      return { success: true, notifications };
    },
    [submission, formCode, getRulesForTrigger, extractRecipients]
  );
  
  // Create notification for rejection
  const notifyOnRejection = useCallback(
    (rejecterName: string, reason: string): NotificationResult => {
      if (!submission) {
        return { success: false, notifications: [], errors: ['No submission provided'] };
      }
      
      const rules = getRulesForTrigger('OnRejection');
      const notifications: ITNotification[] = [];
      
      for (const rule of rules) {
        const recipients: string[] = [];
        
        for (const recipient of rule.recipients) {
          recipients.push(...extractRecipients(recipient.type, recipient.value));
        }
        
        if (recipients.length > 0) {
          notifications.push({
            type: 'error',
            title: 'Request Rejected',
            message: `Your ${formCode} request has been rejected by ${rejecterName}. Reason: ${reason}`,
            recipients,
            trigger: 'OnRejection',
            timestamp: new Date(),
            formCode,
            submissionId: String(submission.id),
          });
        }
      }
      
      // Show toast
      if (notifications.length > 0) {
        toast.error('Rejection notification sent', {
          description: `Requestor has been notified of rejection`,
        });
      }
      
      return { success: true, notifications };
    },
    [submission, formCode, getRulesForTrigger, extractRecipients]
  );
  
  // Create notification for escalation
  const notifyOnEscalation = useCallback(
    (escalationTarget: string, reason: string): NotificationResult => {
      if (!submission) {
        return { success: false, notifications: [], errors: ['No submission provided'] };
      }
      
      const notifications: ITNotification[] = [];
      
      // Escalation notifications go to IT Manager and the escalation target
      const recipients = [
        submission.requestoremail || '',
        'it-manager@ioigroup.com',
        `${escalationTarget.toLowerCase().replace('_', '-')}@ioigroup.com`,
      ].filter(Boolean);
      
      notifications.push({
        type: 'warning',
        title: 'Request Escalated',
        message: `${formCode} request #${submission.id} has been escalated to ${escalationTarget}. Reason: ${reason}`,
        recipients,
        trigger: 'OnEscalation',
        timestamp: new Date(),
        formCode,
        submissionId: String(submission.id),
      });
      
      // Show toast
      toast.warning('Escalation notification sent', {
        description: `Request has been escalated to ${escalationTarget}`,
      });
      
      return { success: true, notifications };
    },
    [submission, formCode]
  );
  
  // Pending notifications count (mock - in production would check a queue)
  const pendingNotificationsCount = useMemo(() => {
    // This would be fetched from a notification queue in production
    return 0;
  }, []);
  
  return {
    // Notification actions
    notifyOnFormCreate,
    notifyOnApproval,
    notifyOnRejection,
    notifyOnEscalation,
    
    // Helpers
    getRulesForTrigger,
    extractRecipients,
    pendingNotificationsCount,
  };
}

export default useITNotifications;