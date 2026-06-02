/**
 * IT Department Approval Workflow Types
 * 
 * Comprehensive type definitions for multi-stage approval workflows
 * covering all IT forms (M1-M6 modules).
 * 
 * Workflow Features:
 * - Multi-stage conditional routing
 * - Role-based approver assignment
 * - Escalation rules with SLA tracking
 * - Site-specific routing (Prai/Johor)
 * - Form-specific workflow definitions
 */

import type { PersonOrGroup } from '@/services/sharepoint-submission-service';

// =============================================================================
// CORE WORKFLOW TYPES
// =============================================================================

/**
 * Workflow status representing the current state of a request
 */
export type WorkflowStatus =
  | 'Draft'           // Not yet submitted
  | 'Submitted'       // Submitted, pending first approval
  | 'InProgress'      // In middle of approval chain
  | 'PendingApproval' // Waiting for specific approver
  | 'Approved'        // Fully approved
  | 'Rejected'        // Rejected at any stage
  | 'Returned'        // Returned for revision
  | 'Escalated'       // SLA breached, escalated to higher authority
  | 'Completed'       // Final completion (e.g., IT provisioning done)
  | 'Closed';         // Archived/closed

/**
 * Approval action taken by an approver
 */
export type ApprovalActionType =
  | 'Submit'          // Initial submission
  | 'Approve'         // Approve and advance
  | 'Reject'          // Reject request
  | 'Return'          // Return to previous stage
  | 'Escalate'        // Escalate to higher authority
  | 'Delegate'        // Delegate to another approver
  | 'Complete'        // Mark task as complete (IT provisioning)
  | 'Rework'          // Send back for rework
  | 'Cancel'          // Cancel request
  | 'Edit'            // Edit request
  | 'Close'           // Close request
  | 'Confirm'         // Confirm action (e.g. confirm IT completion)
  | 'RequestClose'    // Request closure
  | 'Extend';         // Extend access/period

/**
 * Approver role types used in the approval matrix
 */
export type ApproverRoleType =
  | 'Submitter'       // Original requestor
  | 'Approver'        // Generic first-level approver
  | 'HoD'             // Head of Department
  | 'DivisionHead'    // Division Director/Head
  | 'ITManager'       // IT Manager
  | 'ITAdmin'         // IT Administrator
  | 'ITSupport'       // IT Support Staff
  | 'ExecutiveDirector' // Executive Director
  | 'GeneralManager'  // General Manager
  | 'SystemOwner'     // System/Application Owner
  | 'SecurityOfficer' // Security/Compliance Officer
  | 'HRManager'       // HR Manager (for employee-related forms)
  | 'FinanceManager'  // Finance Manager (for cost-related forms)
  | 'System';         // System-generated stages

/**
 * Site codes for multi-site organization
 */
export type SiteCode = 'PRAI' | 'JOHOR' | 'ALL';

/**
 * Urgency levels affecting SLA
 */
export type UrgencyLevel = 'Low' | 'Normal' | 'High' | 'Critical';

// =============================================================================
// WORKFLOW STAGE DEFINITION
// =============================================================================

/**
 * Complete workflow stage definition
 */
export interface WorkflowStageDefinition {
  /** Unique stage identifier */
  key: string;
  
  /** Stage order (1-based) */
  order: number;
  
  /** Human-readable stage name */
  name: string;
  
  /** Stage description */
  description: string;
  
  /** Actor role for this stage */
  actorRole: ApproverRoleType;
  
  /** Actor display name */
  actorLabel: string;
  
  /** SLA in business days */
  slaDays: number;
  
  /** Escalation target role if SLA breached */
  escalationRole?: ApproverRoleType;
  
  /** Is this stage conditional? */
  isConditional?: boolean;
  
  /** Condition field name */
  conditionField?: string;
  
  /** Condition values that activate this stage */
  conditionValues?: string[];
  
  /** Can this stage be skipped? */
  canSkip?: boolean;
  
  /** Skip conditions */
  skipConditions?: {
    field: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'isEmpty' | 'isNotEmpty';
    value?: string;
  }[];
  
  /** Required fields to complete this stage */
  requiredFields?: string[];
  
  /** Allowed actions at this stage */
  allowedActions: ApprovalActionType[];
  
  /** Form section IDs visible at this stage */
  visibleSections: string[];
  
  /** Form section IDs editable at this stage */
  editableSections: string[];
  
  /** Email template for notifications */
  notificationTemplate?: string;
  
  /** Reminder settings */
  reminderSettings?: {
    daysBeforeDue: number[];
    emailTemplate: string;
  };
}

/**
 * Complete workflow definition for a form
 */
export interface WorkflowDefinition {
  /** Form code (e.g., 'EAF', 'NIR') */
  formCode: string;
  
  /** Workflow name */
  name: string;
  
  /** Workflow description */
  description: string;
  
  /** Module code (M1-M6) */
  moduleCode: string;
  
  /** SharePoint list name */
  listName: string;
  
  /** Site scope */
  siteScope: SiteCode;
  
  /** Workflow stages in order */
  stages: WorkflowStageDefinition[];
  
  /** Default urgency */
  defaultUrgency: UrgencyLevel;
  
  /** Urgency-based SLA multipliers */
  urgencySLAMultiplier: Record<UrgencyLevel, number>;
  
  /** Form-specific routing rules */
  routingRules?: RoutingRule[];
  
  /** Parallel approval settings */
  parallelApproval?: {
    enabled: boolean;
    stages: string[]; // Stage keys that can run in parallel
    requiredApprovals: number; // Number of approvals needed to proceed
  };
}

// =============================================================================
// ROUTING RULES
// =============================================================================

/**
 * Routing rule for dynamic approver assignment
 */
export interface RoutingRule {
  /** Rule identifier */
  id: string;
  
  /** Rule name */
  name: string;
  
  /** Rule priority (lower = higher priority) */
  priority: number;
  
  /** Conditions that activate this rule */
  conditions: RoutingCondition[];
  
  /** Condition operator (AND/OR) */
  conditionOperator: 'AND' | 'OR';
  
  /** Target stage key */
  targetStage: string;
  
  /** Approver selection method */
  approverSelection: ApproverSelection;
}

/**
 * Routing condition for rule evaluation
 */
export interface RoutingCondition {
  field: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';
  value?: string | number | boolean;
}

/**
 * Approver selection configuration
 */
export interface ApproverSelection {
  type: 'static' | 'dynamic' | 'lookup' | 'hierarchy';
  
  /** For static: specific user ID */
  userId?: string;
  
  /** For dynamic: field containing user reference */
  userField?: string;
  
  /** For lookup: lookup list and field */
  lookupConfig?: {
    listName: string;
    filterField: string;
    filterValue: string;
    userField: string;
  };
  
  /** For hierarchy: role to look up in org chart */
  hierarchyRole?: ApproverRoleType;
  
  /** Fallback approver if primary not found */
  fallbackUserId?: string;
}

// =============================================================================
// APPROVAL INSTANCE TYPES
// =============================================================================

/**
 * Approval chain entry for a specific request
 */
export interface ApprovalChainEntry {
  /** Stage key */
  stageKey: string;
  
  /** Stage name */
  stageName: string;
  
  /** Stage order */
  order: number;
  
  /** Assigned approver ID */
  approverId: string;
  
  /** Assigned approver name */
  approverName: string;
  
  /** Assigned approver email */
  approverEmail: string;
  
  /** Approver role */
  approverRole: ApproverRoleType;
  
  /** Assignment date */
  assignedDate: Date;
  
  /** Due date (based on SLA) */
  dueDate: Date;
  
  /** Action taken */
  action?: ApprovalActionType;
  
  /** Action date */
  actionDate?: Date;
  
  /** Comments */
  comments?: string;
  
  /** Is this stage complete? */
  isComplete: boolean;
  
  /** Is this stage skipped? */
  isSkipped: boolean;
  
  /** Skip reason */
  skipReason?: string;
  
  /** Is escalated? */
  isEscalated: boolean;
  
  /** Escalated to (if escalated) */
  escalatedTo?: string;
  
  /** Escalation date */
  escalationDate?: Date;
  
  /** Delegate info */
  delegatedFrom?: {
    userId: string;
    userName: string;
    delegationDate: Date;
    reason: string;
  };
}

/**
 * Complete workflow instance for a request
 */
export interface WorkflowInstance {
  /** Request/form ID */
  formId: string;
  
  /** Form code */
  formCode: string;
  
  /** Request title/reference number */
  title: string;
  
  /** Current workflow status */
  status: WorkflowStatus;
  
  /** Current stage key */
  currentStageKey: string;
  
  /** Current stage number */
  currentStageNumber: number;
  
  /** Total stages */
  totalStages: number;
  
  /** Submitter info */
  submitter: {
    id: string;
    name: string;
    email: string;
    department: string;
  };
  
  /** Submission date */
  submittedDate: Date;
  
  /** Last modified date */
  lastModifiedDate: Date;
  
  /** Current assigned approver */
  currentApprover?: {
    id: string;
    name: string;
    email: string;
    role: ApproverRoleType;
  };
  
  /** Current stage due date */
  currentDueDate?: Date;
  
  /** Is overdue? */
  isOverdue: boolean;
  
  /** Days overdue */
  daysOverdue: number;
  
  /** Urgency level */
  urgency: UrgencyLevel;
  
  /** Approval chain history */
  approvalChain: ApprovalChainEntry[];
  
  /** Next approvers (for preview) */
  nextApprovers?: {
    stageKey: string;
    stageName: string;
    approverName: string;
    approverRole: ApproverRoleType;
  }[];
  
  /** Completion info (for IT provisioning forms) */
  completionInfo?: {
    completedBy: string;
    completedDate: Date;
    remarks: string;
  };
}

// =============================================================================
// APPROVAL ACTION REQUEST/RESPONSE
// =============================================================================

/**
 * Request payload for taking an approval action
 */
export interface ApprovalActionRequest {
  /** Form ID */
  formId: string;
  
  /** Form code */
  formCode: string;
  
  /** Current stage key */
  stageKey: string;
  
  /** Action to take */
  action: ApprovalActionType;
  
  /** Approver ID */
  approverId: string;
  
  /** Comments */
  comments?: string;
  
  /** Next approver (for specific stages) */
  nextApproverId?: string;
  
  /** Delegate target (for delegation) */
  delegateToId?: string;
  
  /** Delegate reason */
  delegateReason?: string;
  
  /** Attachments */
  attachments?: string[];
  
  /** Additional form data to update */
  formData?: Record<string, unknown>;
}

/**
 * Response from approval action
 */
export interface ApprovalActionResponse {
  success: boolean;
  message: string;
  newStatus: WorkflowStatus;
  newStageKey?: string;
  nextApprover?: {
    id: string;
    name: string;
    email: string;
  };
  notificationsSent: string[];
}

// =============================================================================
// DASHBOARD TYPES
// =============================================================================

/**
 * Task summary for approval dashboards
 */
export interface ApprovalTaskSummary {
  formId: string;
  formCode: string;
  formName: string;
  title: string;
  submitter: string;
  submittedDate: Date;
  currentStage: string;
  dueDate: Date;
  isOverdue: boolean;
  daysOverdue: number;
  urgency: UrgencyLevel;
  department: string;
  site: SiteCode;
}

/**
 * Dashboard statistics
 */
export interface ApprovalDashboardStats {
  /** Tasks pending my approval */
  pendingMyApproval: number;
  
  /** My submitted requests */
  mySubmissions: number;
  
  /** My approved requests */
  myApproved: number;
  
  /** My rejected requests */
  myRejected: number;
  
  /** Overdue tasks */
  overdueCount: number;
  
  /** Tasks due today */
  dueToday: number;
  
  /** Tasks due this week */
  dueThisWeek: number;
  
  /** Average approval time (hours) */
  avgApprovalTimeHours: number;
  
  /** Completion rate (%) */
  completionRate: number;
  
  /** By form type breakdown */
  byFormType: Record<string, number>;
  
  /** By status breakdown */
  byStatus: Record<WorkflowStatus, number>;
}

// =============================================================================
// NOTIFICATION TYPES
// =============================================================================

/**
 * Email notification template data
 */
export interface NotificationData {
  recipientEmail: string;
  recipientName: string;
  formTitle: string;
  formCode: string;
  formId: string;
  currentStage: string;
  action: ApprovalActionType;
  actorName: string;
  comments?: string;
  dueDate?: Date;
  formUrl: string;
  ccRecipients?: string[];
}

/**
 * Notification types
 */
export type NotificationType =
  | 'SubmissionReceived'
  | 'ApprovalRequired'
  | 'Approved'
  | 'Rejected'
  | 'Returned'
  | 'Escalated'
  | 'Delegated'
  | 'Completed'
  | 'Reminder'
  | 'Overdue';

// =============================================================================
// EXPORT APPROVAL RECORDS INTERFACE FOR SHAREPOINT
// =============================================================================

/**
 * SharePoint ApprovalRecords list item structure
 */
export interface ApprovalRecordItem {
  Id?: number;
  Title?: string;
  
  // Form reference
  FormId: string;
  FormCode: string;
  FormTitle: string;
  
  // Stage info
  StageKey: string;
  StageName: string;
  StageNumber: number;
  
  // Approver info
  ApproverId: string;
  ApproverName: string;
  ApproverEmail: string;
  ApproverRole: ApproverRoleType;
  
  // Assignment info
  AssignedDate: string;
  DueDate: string;
  
  // Action info
  ActionKey: 'Pending' | 'Approved' | 'Rejected' | 'Returned' | 'Escalated' | 'Delegated' | 'Completed';
  ActionDate?: string;
  Comments?: string;
  
  // Status flags
  IsComplete: boolean;
  IsSkipped: boolean;
  IsEscalated: boolean;
  
  // Escalation
  EscalatedToId?: string;
  EscalatedToName?: string;
  EscalationDate?: string;
  
  // Delegation
  DelegatedFromId?: string;
  DelegatedFromName?: string;
  DelegationDate?: string;
  DelegationReason?: string;
  
  // Metadata
  Site: SiteCode;
  Department: string;
  Urgency: UrgencyLevel;
  Created?: string;
  Modified?: string;
}