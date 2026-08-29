/**
 * Workflow Orchestration Service
 * 
 * Production-ready service that coordinates:
 * - Workflow state transitions
 * - Automatic notifications on state changes
 * - Escalation detection and handling
 * - Delegation flow management
 * - Live approver resolution via Graph API
 * 
 * This is the central coordination point for all workflow operations.
 */

import { v4 as uuidv4 } from 'uuid';
import type { ApprovalRecords } from '@/generated/models/approval-records-model';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import type { ApproverInfo } from '@/hooks/use-approver-matrix';
import type { 
  WorkflowStatus, 
  ApprovalActionType, 
  ApproverRoleType, 
  UrgencyLevel,
  WorkflowInstance,
  ApprovalChainEntry,
} from '@/types/it-approval-workflow';

// =============================================================================
// TYPES
// =============================================================================

export interface WorkflowTransitionRequest {
  formId: string;
  formCode: string;
  action: ApprovalActionType;
  actorId: string;
  actorName: string;
  actorEmail: string;
  actorRole: ApproverRoleType;
  comments?: string;
  delegateToId?: string;
  delegateToName?: string;
  delegateToEmail?: string;
  nextApproverId?: string;
  attachments?: string[];
}

export interface WorkflowTransitionResult {
  success: boolean;
  message: string;
  newStatus: WorkflowStatus;
  newStageKey?: string;
  newStageNumber?: number;
  approvalRecordId?: string;
  notificationsSent: string[];
  escalated?: boolean;
  delegated?: boolean;
  error?: string;
}

export interface EscalationCheckResult {
  formId: string;
  formCode: string;
  ticketId: string;
  currentStage: string;
  currentApprover?: {
    id: string;
    name: string;
    email: string;
  };
  dueDate: Date;
  daysOverdue: number;
  hoursOverdue: number;
  escalationTarget?: {
    id: string;
    name: string;
    email: string;
    role: ApproverRoleType;
  };
  needsEscalation: boolean;
  escalationLevel: 'warning' | 'overdue' | 'critical';
}

export interface DelegationRequest {
  formId: string;
  formCode: string;
  currentApproverId: string;
  currentApproverName: string;
  delegateToId: string;
  delegateToName: string;
  delegateToEmail: string;
  reason: string;
  expiryDate?: Date;
}

export interface DelegationResult {
  success: boolean;
  delegationId: string;
  message: string;
  notificationsSent: string[];
}

// Email notification types
export interface WorkflowNotification {
  type: 'submission' | 'approval_required' | 'approved' | 'rejected' | 'returned' | 'delegated' | 'escalated' | 'sla_warning' | 'completed';
  to: string[];
  cc?: string[];
  ticketId: string;
  formCode: string;
  formTitle: string;
  actorName?: string;
  recipientName?: string;
  currentStage?: string;
  comments?: string;
  dueDate?: Date;
  portalUrl?: string;
  importance: 'Low' | 'Normal' | 'High';
}

// =============================================================================
// CONSTANTS
// =============================================================================

const PORTAL_URL = 'https://apps.powerapps.com/ioi-it-portal';

// Escalation thresholds (in hours)
const ESCALATION_THRESHOLDS = {
  warning: 24,      // Send warning at 24 hours
  overdue: 48,      // Mark as overdue at 48 hours  
  critical: 72,     // Escalate to next level at 72 hours
  autoEscalate: 120, // Auto-escalate to management at 5 days
};

// SLA multipliers by urgency
const URGENCY_SLA_MULTIPLIER: Record<UrgencyLevel, number> = {
  Low: 1.5,
  Normal: 1.0,
  High: 0.5,
  Critical: 0.25,
};

// =============================================================================
// NOTIFICATION TEMPLATES
// =============================================================================

function buildNotificationEmail(notification: WorkflowNotification): { subject: string; body: string } {
  const typeConfig: Record<WorkflowNotification['type'], { title: string; color: string; icon: string }> = {
    submission: { title: 'Request Submitted', color: '#1752A8', icon: '📝' },
    approval_required: { title: 'Action Required', color: '#7B3E00', icon: '⚠️' },
    approved: { title: 'Request Approved', color: '#166534', icon: '✅' },
    rejected: { title: 'Request Rejected', color: '#9B2F23', icon: '❌' },
    returned: { title: 'Request Returned', color: '#7B3E00', icon: '↩️' },
    delegated: { title: 'Request Delegated', color: '#1752A8', icon: '👤' },
    escalated: { title: 'Request Escalated', color: '#9B2F23', icon: '🔺' },
    sla_warning: { title: 'SLA Warning', color: '#7B3E00', icon: '⏰' },
    completed: { title: 'Request Completed', color: '#166534', icon: '🎉' },
  };

  const config = typeConfig[notification.type];
  
  const subject = `[IOI IT] ${config.icon} ${notification.ticketId} - ${config.title}`;
  
  const body = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F5F5F5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F5F5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: ${config.color}; padding: 24px 32px; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 20px; font-weight: 600;">
                ${config.icon} ${config.title}
              </h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">
                IOI IT Portal - ${notification.formCode}
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              ${notification.recipientName ? `
              <p style="margin: 0 0 16px 0; color: #1C1C1C; font-size: 15px; line-height: 1.6;">
                Dear <strong>${notification.recipientName}</strong>,
              </p>
              ` : ''}
              
              <!-- Ticket Badge -->
              <div style="background-color: #E8F5E9; border: 1px solid ${config.color}; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="color: #5C5C5C; font-size: 12px; text-transform: uppercase;">Reference Number</td>
                  </tr>
                  <tr>
                    <td style="color: ${config.color}; font-size: 20px; font-weight: 700;">${notification.ticketId}</td>
                  </tr>
                </table>
              </div>
              
              <!-- Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #E0E0E0; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
                <tr style="background-color: #FAFAFA;">
                  <td colspan="2" style="padding: 12px; font-weight: 600; color: #1C1C1C; border-bottom: 1px solid #E0E0E0;">Details</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; border-bottom: 1px solid #E0E0E0; color: #5C5C5C; font-size: 13px; width: 140px;">Form Type</td>
                  <td style="padding: 8px 12px; border-bottom: 1px solid #E0E0E0; color: #1C1C1C; font-size: 13px;">${notification.formTitle || notification.formCode}</td>
                </tr>
                ${notification.currentStage ? `
                <tr>
                  <td style="padding: 8px 12px; border-bottom: 1px solid #E0E0E0; color: #5C5C5C; font-size: 13px;">Current Stage</td>
                  <td style="padding: 8px 12px; border-bottom: 1px solid #E0E0E0; color: #1C1C1C; font-size: 13px;">${notification.currentStage}</td>
                </tr>
                ` : ''}
                ${notification.actorName ? `
                <tr>
                  <td style="padding: 8px 12px; border-bottom: 1px solid #E0E0E0; color: #5C5C5C; font-size: 13px;">Actioned By</td>
                  <td style="padding: 8px 12px; border-bottom: 1px solid #E0E0E0; color: #1C1C1C; font-size: 13px;">${notification.actorName}</td>
                </tr>
                ` : ''}
                ${notification.dueDate ? `
                <tr>
                  <td style="padding: 8px 12px; color: #5C5C5C; font-size: 13px;">Due Date</td>
                  <td style="padding: 8px 12px; color: ${config.color}; font-size: 13px; font-weight: 600;">${notification.dueDate.toLocaleString()}</td>
                </tr>
                ` : ''}
              </table>
              
              ${notification.comments ? `
              <div style="background-color: #F5F5F5; border-left: 4px solid ${config.color}; padding: 16px; margin-bottom: 24px; border-radius: 0 8px 8px 0;">
                <p style="margin: 0 0 4px 0; font-weight: 600; color: #1C1C1C; font-size: 13px;">Comments</p>
                <p style="margin: 0; color: #5C5C5C; font-size: 14px; line-height: 1.5;">${notification.comments}</p>
              </div>
              ` : ''}
              
              <!-- CTA Button -->
              <div style="text-align: center;">
                <a href="${notification.portalUrl || PORTAL_URL}" 
                   style="display: inline-block; padding: 12px 32px; background-color: ${config.color}; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
                  View Request
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #FAFAFA; border-radius: 0 0 12px 12px; border-top: 1px solid #E0E0E0;">
              <p style="margin: 0; color: #5C5C5C; font-size: 12px; line-height: 1.5;">
                This is an automated notification from the IOI IT Portal. Please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
  
  return { subject, body };
}

// =============================================================================
// WORKFLOW ORCHESTRATION SERVICE
// =============================================================================

export class WorkflowOrchestrationService {
  
  // ---------------------------------------------------------------------------
  // STATE TRANSITIONS
  // ---------------------------------------------------------------------------
  
  /**
   * Process a workflow action and trigger all side effects
   */
  static async processAction(
    request: WorkflowTransitionRequest,
    submission: MainDBIT,
    currentApprovalRecord?: ApprovalRecords,
    createApprovalRecord?: (data: Partial<ApprovalRecords>) => Promise<ApprovalRecords>,
    updateSubmission?: (id: string, data: Partial<MainDBIT>) => Promise<MainDBIT>,
    sendEmail?: (to: string, subject: string, body: string, importance?: string) => Promise<void>
  ): Promise<WorkflowTransitionResult> {
    const notificationsSent: string[] = [];
    
    try {
      // Determine new status and stage based on action
      const { newStatus, newStageKey, newStageNumber } = this.calculateNextState(
        request.action,
        submission.workflowstage || 1,
        submission.currentStatus
      );
      
      // Create approval record
      const approvalRecord: Partial<ApprovalRecords> = {
        stagename: this.getStageNameFromNumber(request.formCode, newStageNumber || 1),
        formid: request.formId,
        formcode: request.formCode,
        actionbyid: request.actorId,
        actionbyname: request.actorName,
        actiondate: new Date().toISOString(),
        actionKey: this.mapActionToActionKey(request.action),
        stagenumber: newStageNumber || (submission.workflowstage || 1),
        comments: request.comments,
        nextstage: newStageKey,
      };
      
      // Handle delegation
      if (request.action === 'Delegate' && request.delegateToId) {
        approvalRecord.comments = `Delegated to ${request.delegateToName}: ${request.comments || ''}`;
      }
      
      // Create approval record if function provided
      let recordId: string | undefined;
      if (createApprovalRecord) {
        const created = await createApprovalRecord(approvalRecord);
        recordId = String(created.id);
      }
      
      // Update submission status if function provided
      if (updateSubmission) {
        await updateSubmission(request.formId, {
          currentStatus: this.mapStatusToKey(newStatus),
          workflowstage: newStageNumber,
        });
      }
      
      // Send notifications
      if (sendEmail) {
        const notifications = this.buildNotificationsForAction(
          request,
          submission,
          newStatus
        );
        
        for (const notification of notifications) {
          const { subject, body } = buildNotificationEmail(notification);
          for (const recipient of notification.to) {
            try {
              await sendEmail(recipient, subject, body, notification.importance);
              notificationsSent.push(recipient);
            } catch (emailError) {
              console.error(`Failed to send email to ${recipient}:`, emailError);
            }
          }
        }
      }
      
      return {
        success: true,
        message: `Action "${request.action}" completed successfully`,
        newStatus,
        newStageKey,
        newStageNumber,
        approvalRecordId: recordId,
        notificationsSent,
        delegated: request.action === 'Delegate',
      };
      
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        newStatus: 'Draft',
        notificationsSent,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  /**
   * Calculate next state based on action
   */
  private static calculateNextState(
    action: ApprovalActionType,
    currentStage: number,
    currentStatus: string
  ): { newStatus: WorkflowStatus; newStageKey?: string; newStageNumber?: number } {
    switch (action) {
      case 'Submit':
        return { 
          newStatus: 'Submitted', 
          newStageNumber: 1,
          newStageKey: 'S1_Submission' 
        };
        
      case 'Approve':
        const nextStage = currentStage + 1;
        const isFinal = nextStage > 4; // Assuming 4 stages max
        return {
          newStatus: isFinal ? 'Approved' : 'InProgress',
          newStageNumber: isFinal ? currentStage : nextStage,
          newStageKey: isFinal ? 'Completed' : `S${nextStage}_Approval`,
        };
        
      case 'Reject':
        return { 
          newStatus: 'Rejected',
          newStageNumber: currentStage,
        };
        
      case 'Return':
        const prevStage = Math.max(1, currentStage - 1);
        return {
          newStatus: 'Returned',
          newStageNumber: prevStage,
          newStageKey: `S${prevStage}_Revision`,
        };
        
      case 'Delegate':
        return {
          newStatus: 'PendingApproval',
          newStageNumber: currentStage,
        };
        
      case 'Escalate':
        return {
          newStatus: 'Escalated',
          newStageNumber: currentStage,
        };
        
      case 'Complete':
        return {
          newStatus: 'Completed',
          newStageNumber: currentStage,
          newStageKey: 'Completed',
        };
        
      default:
        return {
          newStatus: 'InProgress',
          newStageNumber: currentStage,
        };
    }
  }
  
  // ---------------------------------------------------------------------------
  // ESCALATION ENGINE
  // ---------------------------------------------------------------------------
  
  /**
   * Check all pending submissions for escalation needs
   */
  static checkEscalations(
    pendingSubmissions: MainDBIT[],
    approvalRecords: ApprovalRecords[],
    approvers: ApproverInfo[]
  ): EscalationCheckResult[] {
    const results: EscalationCheckResult[] = [];
    const now = new Date();
    
    for (const submission of pendingSubmissions) {
      // Skip if not in a pending state
      if (!this.isPendingStatus(submission.currentStatus)) {
        continue;
      }
      
      // Find the latest pending approval record
      const latestRecord = approvalRecords
        .filter((r: ApprovalRecords) => r.formid === String(submission.id) && r.actionKey === 'ActionKey3')
        .sort((a: ApprovalRecords, b: ApprovalRecords) => {
          const dateA = a.actiondate ? new Date(a.actiondate).getTime() : 0;
          const dateB = b.actiondate ? new Date(b.actiondate).getTime() : 0;
          return dateB - dateA;
        })[0];
      
      if (!latestRecord) continue;
      
      // Calculate time since assignment
      const assignedDate = latestRecord.actiondate 
        ? new Date(latestRecord.actiondate) 
        : new Date(submission.submitteddate || now);
      
      const hoursElapsed = (now.getTime() - assignedDate.getTime()) / (1000 * 60 * 60);
      const daysElapsed = hoursElapsed / 24;
      
      // Determine escalation level
      let escalationLevel: EscalationCheckResult['escalationLevel'] = 'warning';
      let needsEscalation = false;
      
      if (hoursElapsed >= ESCALATION_THRESHOLDS.critical) {
        escalationLevel = 'critical';
        needsEscalation = true;
      } else if (hoursElapsed >= ESCALATION_THRESHOLDS.overdue) {
        escalationLevel = 'overdue';
        needsEscalation = true;
      } else if (hoursElapsed >= ESCALATION_THRESHOLDS.warning) {
        escalationLevel = 'warning';
      }
      
      // Find escalation target
      const currentApprover = approvers.find((a: ApproverInfo) => 
        a.email.toLowerCase() === latestRecord.actionbyid?.toLowerCase() ||
        a.id === latestRecord.actionbyid
      );
      
      const escalationTarget = this.findEscalationTarget(
        currentApprover?.role || 'Approver',
        approvers
      );
      
      // Calculate due date based on SLA
      const slaDays = 3; // Default 3 days SLA
      const dueDate = new Date(assignedDate);
      dueDate.setDate(dueDate.getDate() + slaDays);
      
      const daysOverdue = Math.max(0, Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
      const hoursOverdue = Math.max(0, Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60)));
      
      results.push({
        formId: String(submission.id),
        formCode: submission.formcode,
        ticketId: submission.title,
        currentStage: latestRecord.stagename,
        currentApprover: currentApprover ? {
          id: currentApprover.id,
          name: currentApprover.name,
          email: currentApprover.email,
        } : undefined,
        dueDate,
        daysOverdue,
        hoursOverdue,
        escalationTarget: escalationTarget ? {
          id: escalationTarget.id,
          name: escalationTarget.name,
          email: escalationTarget.email,
          role: escalationTarget.role as ApproverRoleType,
        } : undefined,
        needsEscalation,
        escalationLevel,
      });
    }
    
    return results;
  }
  
  /**
   * Find the appropriate escalation target based on current approver role
   */
  private static findEscalationTarget(
    currentRole: ApproverRoleType | string,
    approvers: ApproverInfo[]
  ): ApproverInfo | undefined {
    const escalationPath: Record<string, ApproverInfo['role'][]> = {
      'Approver': ['HoD', 'Manager'],
      'HoD': ['Manager', 'ExecutiveDirector'],
      'Manager': ['ExecutiveDirector'],
      'ITAdmin': ['Manager', 'ExecutiveDirector'],
      'ITSupport': ['ITAdmin', 'Manager'],
    };
    
    const targetRoles = escalationPath[currentRole] || ['Manager'];
    
    for (const role of targetRoles) {
      const target = approvers.find((a: ApproverInfo) => a.role === role && a.isActive !== false);
      if (target) return target;
    }
    
    return undefined;
  }
  
  /**
   * Process escalation for a single item
   */
  static async processEscalation(
    escalation: EscalationCheckResult,
    createApprovalRecord?: (data: Partial<ApprovalRecords>) => Promise<ApprovalRecords>,
    updateSubmission?: (id: string, data: Partial<MainDBIT>) => Promise<MainDBIT>,
    sendEmail?: (to: string, subject: string, body: string, importance?: string) => Promise<void>
  ): Promise<{ success: boolean; notificationsSent: string[] }> {
    const notificationsSent: string[] = [];
    
    try {
      // Create escalation record
      if (createApprovalRecord && escalation.escalationTarget) {
        await createApprovalRecord({
          stagename: escalation.currentStage,
          formid: escalation.formId,
          formcode: escalation.formCode,
          actionbyid: 'SYSTEM',
          actionbyname: 'System Auto-Escalation',
          actiondate: new Date().toISOString(),
          actionKey: 'ActionKey3',
          comments: `Auto-escalated to ${escalation.escalationTarget.name} after ${escalation.daysOverdue} days overdue`,
        });
      }
      
      // Update submission status
      if (updateSubmission) {
        await updateSubmission(escalation.formId, {
          currentStatus: 'CurrentstatusKey5', // Escalated
        });
      }
      
      // Send notifications
      if (sendEmail && escalation.escalationTarget) {
        const notification: WorkflowNotification = {
          type: 'escalated',
          to: [escalation.escalationTarget.email],
          cc: escalation.currentApprover ? [escalation.currentApprover.email] : undefined,
          ticketId: escalation.ticketId,
          formCode: escalation.formCode,
          formTitle: `${escalation.formCode} Request`,
          recipientName: escalation.escalationTarget.name,
          currentStage: escalation.currentStage,
          comments: `This request has been escalated after being overdue for ${escalation.daysOverdue} days.`,
          importance: 'High',
        };
        
        const { subject, body } = buildNotificationEmail(notification);
        await sendEmail(escalation.escalationTarget.email, subject, body, 'High');
        notificationsSent.push(escalation.escalationTarget.email);
      }
      
      return { success: true, notificationsSent };
      
    } catch (error) {
      console.error('Escalation processing failed:', error);
      return { success: false, notificationsSent };
    }
  }
  
  // ---------------------------------------------------------------------------
  // DELEGATION
  // ---------------------------------------------------------------------------
  
  /**
   * Process delegation request
   */
  static async processDelegation(
    request: DelegationRequest,
    submission: MainDBIT,
    createApprovalRecord?: (data: Partial<ApprovalRecords>) => Promise<ApprovalRecords>,
    sendEmail?: (to: string, subject: string, body: string, importance?: string) => Promise<void>
  ): Promise<DelegationResult> {
    const delegationId = uuidv4();
    const notificationsSent: string[] = [];
    
    try {
      // Create delegation record
      if (createApprovalRecord) {
        await createApprovalRecord({
          stagename: `Delegated from ${request.currentApproverName}`,
          formid: request.formId,
          formcode: request.formCode,
          actionbyid: request.currentApproverId,
          actionbyname: request.currentApproverName,
          actiondate: new Date().toISOString(),
          actionKey: 'ActionKey3',
          comments: `Delegated to ${request.delegateToName}: ${request.reason}`,
        });
        
        // Create pending record for delegate
        await createApprovalRecord({
          stagename: submission.title,
          formid: request.formId,
          formcode: request.formCode,
          actionbyid: request.delegateToId,
          actionbyname: request.delegateToName,
          actiondate: new Date().toISOString(),
          actionKey: 'ActionKey3',
          comments: `Delegated from ${request.currentApproverName}`,
        });
      }
      
      // Send notifications
      if (sendEmail) {
        // Notify delegate
        const delegateNotification: WorkflowNotification = {
          type: 'delegated',
          to: [request.delegateToEmail],
          ticketId: submission.title,
          formCode: request.formCode,
          formTitle: `${request.formCode} Request`,
          actorName: request.currentApproverName,
          recipientName: request.delegateToName,
          comments: request.reason,
          importance: 'High',
        };
        
        const { subject, body } = buildNotificationEmail(delegateNotification);
        await sendEmail(request.delegateToEmail, subject, body, 'High');
        notificationsSent.push(request.delegateToEmail);
        
        // Notify submitter
        if (submission.requestoremail) {
          const submitterNotification: WorkflowNotification = {
            type: 'delegated',
            to: [submission.requestoremail],
            ticketId: submission.title,
            formCode: request.formCode,
            formTitle: `${request.formCode} Request`,
            actorName: request.currentApproverName,
            comments: `Your request has been delegated to ${request.delegateToName} for review.`,
            importance: 'Normal',
          };
          
          const submitterEmail = buildNotificationEmail(submitterNotification);
          await sendEmail(submission.requestoremail, submitterEmail.subject, submitterEmail.body, 'Normal');
          notificationsSent.push(submission.requestoremail);
        }
      }
      
      return {
        success: true,
        delegationId,
        message: `Successfully delegated to ${request.delegateToName}`,
        notificationsSent,
      };
      
    } catch (error) {
      return {
        success: false,
        delegationId,
        message: error instanceof Error ? error.message : 'Delegation failed',
        notificationsSent,
      };
    }
  }
  
  // ---------------------------------------------------------------------------
  // NOTIFICATION BUILDING
  // ---------------------------------------------------------------------------
  
  /**
   * Build all notifications needed for a workflow action
   */
  private static buildNotificationsForAction(
    request: WorkflowTransitionRequest,
    submission: MainDBIT,
    newStatus: WorkflowStatus
  ): WorkflowNotification[] {
    const notifications: WorkflowNotification[] = [];
    const ticketId = submission.title;
    const formCode = request.formCode;
    const submitterEmail = submission.requestoremail;
    
    switch (request.action) {
      case 'Submit':
        // Confirmation to submitter
        if (submitterEmail) {
          notifications.push({
            type: 'submission',
            to: [submitterEmail],
            ticketId,
            formCode,
            formTitle: `${formCode} Request`,
            importance: 'Normal',
          });
        }
        break;
        
      case 'Approve':
        // Notification to submitter
        if (submitterEmail) {
          notifications.push({
            type: newStatus === 'Approved' ? 'approved' : 'approval_required',
            to: [submitterEmail],
            ticketId,
            formCode,
            formTitle: `${formCode} Request`,
            actorName: request.actorName,
            comments: request.comments,
            importance: 'Normal',
          });
        }
        break;
        
      case 'Reject':
        if (submitterEmail) {
          notifications.push({
            type: 'rejected',
            to: [submitterEmail],
            ticketId,
            formCode,
            formTitle: `${formCode} Request`,
            actorName: request.actorName,
            comments: request.comments,
            importance: 'High',
          });
        }
        break;
        
      case 'Return':
        if (submitterEmail) {
          notifications.push({
            type: 'returned',
            to: [submitterEmail],
            ticketId,
            formCode,
            formTitle: `${formCode} Request`,
            actorName: request.actorName,
            comments: request.comments,
            importance: 'High',
          });
        }
        break;
        
      case 'Complete':
        if (submitterEmail) {
          notifications.push({
            type: 'completed',
            to: [submitterEmail],
            ticketId,
            formCode,
            formTitle: `${formCode} Request`,
            actorName: request.actorName,
            comments: request.comments,
            importance: 'Normal',
          });
        }
        break;
    }
    
    return notifications;
  }
  
  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------
  
  private static isPendingStatus(statusKey: string): boolean {
    return ['CurrentstatusKey1', 'CurrentstatusKey2'].includes(statusKey);
  }
  
  private static mapActionToActionKey(
    action: ApprovalActionType
  ): 'ActionKey0' | 'ActionKey1' | 'ActionKey2' | 'ActionKey3' | 'ActionKey4' {
    switch (action) {
      case 'Approve': return 'ActionKey0';
      case 'Reject': return 'ActionKey1';
      case 'Return': return 'ActionKey2';
      case 'Complete': return 'ActionKey4';
      default: return 'ActionKey3';
    }
  }
  
  private static mapStatusToKey(status: WorkflowStatus): 'CurrentstatusKey0' | 'CurrentstatusKey1' | 'CurrentstatusKey2' | 'CurrentstatusKey3' | 'CurrentstatusKey4' | 'CurrentstatusKey5' | 'CurrentstatusKey6' | 'CurrentstatusKey7' {
    const mapping: Record<WorkflowStatus, 'CurrentstatusKey0' | 'CurrentstatusKey1' | 'CurrentstatusKey2' | 'CurrentstatusKey3' | 'CurrentstatusKey4' | 'CurrentstatusKey5' | 'CurrentstatusKey6' | 'CurrentstatusKey7'> = {
      'Draft': 'CurrentstatusKey0',
      'Submitted': 'CurrentstatusKey1',
      'InProgress': 'CurrentstatusKey2',
      'PendingApproval': 'CurrentstatusKey2',
      'Approved': 'CurrentstatusKey3',
      'Rejected': 'CurrentstatusKey4',
      'Returned': 'CurrentstatusKey5',
      'Escalated': 'CurrentstatusKey5',
      'Completed': 'CurrentstatusKey7',
      'Closed': 'CurrentstatusKey6',
    };
    return mapping[status] || 'CurrentstatusKey0';
  }
  
  private static getStageNameFromNumber(formCode: string, stageNumber: number): string {
    const stageNames: Record<string, string[]> = {
      'EAF': ['Submission', 'Dept Head', 'Division Director', 'IT Manager', 'IT Provisioning'],
      'NIR': ['Request', 'HOD Approval', 'Notes Admin', 'IT Hardware'],
      'RS': ['Submission', 'IT Processing', 'ED Approval', 'Closed'],
      'ITSSR': ['Submission', 'Triage', 'Resolution', 'Acceptance', 'Closure'],
    };
    
    const stages = stageNames[formCode] || ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4'];
    return stages[stageNumber - 1] || `Stage ${stageNumber}`;
  }
}

// =============================================================================
// REACT HOOKS
// =============================================================================

import { useCallback, useMemo } from 'react';
import { useMainDBITList, useUpdateMainDBIT } from '@/generated/hooks/use-main-dbit';
import { useApprovalRecordsList, useCreateApprovalRecords } from '@/generated/hooks/use-approval-records';
import { useFormApprovers } from '@/hooks/use-approver-matrix';
import { useSendEmail } from '@/hooks/use-send-email';

/**
 * Hook for workflow orchestration operations
 */
export function useWorkflowOrchestration(formCode?: string) {
  const { data: submissions = [] } = useMainDBITList();
  const { data: approvals = [] } = useApprovalRecordsList();
  const { allApprovers } = useFormApprovers(formCode);
  const createApproval = useCreateApprovalRecords();
  const updateSubmission = useUpdateMainDBIT();
  const sendEmail = useSendEmail();
  
  // Filter pending submissions
  const pendingSubmissions = useMemo(() => {
    return (submissions as MainDBIT[]).filter((s: MainDBIT) => 
      s.currentStatus === 'CurrentstatusKey1' || s.currentStatus === 'CurrentstatusKey2'
    );
  }, [submissions]);
  
  // Check escalations
  const escalations = useMemo(() => {
    return WorkflowOrchestrationService.checkEscalations(
      pendingSubmissions,
      approvals as ApprovalRecords[],
      allApprovers
    );
  }, [pendingSubmissions, approvals, allApprovers]);
  
  // Process workflow action
  const processAction = useCallback(async (
    request: WorkflowTransitionRequest,
    submission: MainDBIT
  ) => {
    return WorkflowOrchestrationService.processAction(
      request,
      submission,
      undefined,
      async (data) => {
        const result = await createApproval.mutateAsync(data as Parameters<typeof createApproval.mutateAsync>[0]);
        return result as unknown as ApprovalRecords;
      },
      async (id, data) => {
        const result = await updateSubmission.mutateAsync({ id, changedFields: data });
        return result as unknown as MainDBIT;
      },
      async (to, subject, body, importance) => {
        await sendEmail.mutateAsync({ to, subject, body, importance: importance as 'Low' | 'Normal' | 'High' });
      }
    );
  }, [createApproval, updateSubmission, sendEmail]);
  
  // Process delegation
  const processDelegation = useCallback(async (
    request: DelegationRequest,
    submission: MainDBIT
  ) => {
    return WorkflowOrchestrationService.processDelegation(
      request,
      submission,
      async (data) => {
        const result = await createApproval.mutateAsync(data as Parameters<typeof createApproval.mutateAsync>[0]);
        return result as unknown as ApprovalRecords;
      },
      async (to, subject, body, importance) => {
        await sendEmail.mutateAsync({ to, subject, body, importance: importance as 'Low' | 'Normal' | 'High' });
      }
    );
  }, [createApproval, sendEmail]);
  
  // Process single escalation
  const processEscalation = useCallback(async (escalation: EscalationCheckResult) => {
    return WorkflowOrchestrationService.processEscalation(
      escalation,
      async (data) => {
        const result = await createApproval.mutateAsync(data as Parameters<typeof createApproval.mutateAsync>[0]);
        return result as unknown as ApprovalRecords;
      },
      async (id, data) => {
        const result = await updateSubmission.mutateAsync({ id, changedFields: data });
        return result as unknown as MainDBIT;
      },
      async (to, subject, body, importance) => {
        await sendEmail.mutateAsync({ to, subject, body, importance: importance as 'Low' | 'Normal' | 'High' });
      }
    );
  }, [createApproval, updateSubmission, sendEmail]);
  
  return {
    pendingSubmissions,
    escalations,
    overdueCount: escalations.filter((e: EscalationCheckResult) => e.needsEscalation).length,
    warningCount: escalations.filter((e: EscalationCheckResult) => e.escalationLevel === 'warning').length,
    processAction,
    processDelegation,
    processEscalation,
    isProcessing: createApproval.isPending || updateSubmission.isPending || sendEmail.isPending,
  };
}

/**
 * Hook specifically for escalation monitoring
 */
export function useEscalationMonitor() {
  const { escalations, processEscalation, isProcessing } = useWorkflowOrchestration();
  
  const criticalEscalations = useMemo(() => 
    escalations.filter((e: EscalationCheckResult) => e.escalationLevel === 'critical'),
    [escalations]
  );
  
  const overdueEscalations = useMemo(() => 
    escalations.filter((e: EscalationCheckResult) => e.escalationLevel === 'overdue'),
    [escalations]
  );
  
  const warningEscalations = useMemo(() => 
    escalations.filter((e: EscalationCheckResult) => e.escalationLevel === 'warning'),
    [escalations]
  );
  
  const processAllCritical = useCallback(async () => {
    const results = [];
    for (const escalation of criticalEscalations) {
      const result = await processEscalation(escalation);
      results.push(result);
    }
    return results;
  }, [criticalEscalations, processEscalation]);
  
  return {
    escalations,
    criticalEscalations,
    overdueEscalations,
    warningEscalations,
    totalCount: escalations.length,
    criticalCount: criticalEscalations.length,
    overdueCount: overdueEscalations.length,
    warningCount: warningEscalations.length,
    processEscalation,
    processAllCritical,
    isProcessing,
  };
}