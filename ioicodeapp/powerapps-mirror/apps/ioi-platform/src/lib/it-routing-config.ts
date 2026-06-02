/**
 * IT Department Routing Configuration
 * 
 * Based on the IT_Routing_Configuration Excel document:
 * - IT Roles: IT_ADMIN, IT_MANAGER, IS_ADMIN, IT_HOD
 * - Forms: VPNACCESS, ITEVT, SRVACCESS, DATAREST, SAPCA
 * - Workflow Patterns: MultiStageApproval, CRUDRegistry, SequentialApproval, SimpleApproval
 * - Notification Rules: OnFormCreate, OnApproval, OnRejection
 * - Escalation Rules: 3-day pending → IT HOD escalation, 2+ rejections → IS_ADMIN override
 */

// IT Department Roles
export const ITRoles = {
  IT_ADMIN: {
    id: 'IT_ADMIN',
    name: 'IT Administrator',
    description: 'Creates and manages IT forms/records',
    canApprove: false,
    canReject: false,
    canOverride: false,
    canEscalate: false,
  },
  IT_MANAGER: {
    id: 'IT_MANAGER',
    name: 'IT Manager',
    description: 'Reviews and approves IT Department requests',
    canApprove: true,
    canReject: true,
    canOverride: false,
    canEscalate: false,
  },
  IS_ADMIN: {
    id: 'IS_ADMIN',
    name: 'IS Administrator',
    description: 'System-level access and override capabilities',
    canApprove: true,
    canReject: true,
    canOverride: true,
    canEscalate: false,
  },IT_SUPPORT: {
    id: 'IT_SUPPORT',
    name: 'IT Support',
    description: 'Provides technical support and assistance',
    canApprove: false,
    canReject: false,
    canOverride: true,
    canEscalate: false,
  },
  IT_HOD: {
    id: 'IT_HOD',
    name: 'Head of IT Department',
    description: 'Final authority on IT policy and access decisions',
    canApprove: true,
    canReject: true,
    canOverride: false,
    canEscalate: true,
  },
} as const;

export type ITRoleId = keyof typeof ITRoles;
export type ITRole = (typeof ITRoles)[ITRoleId];

// Workflow Patterns
export type WorkflowPattern = 'MultiStageApproval' | 'CRUDRegistry' | 'SequentialApproval' | 'SimpleApproval';

// Status Types for all workflows
export type ITWorkflowStatus = 
  | 'Draft'
  | 'Submitted'
  | 'Active'
  | 'Approved'
  | 'Request'
  | 'ConfigAccess-Done'
  | 'Reject - Closed'
  | 'Submitted-Closure'
  | 'Completed'
  | 'PendingHOD'
  | 'PendingDivHead'
  | 'PendingITManager'
  | 'PendingIT'
  | 'PendingITConfig'
  | 'PendingITAction'
  | 'PendingBASIS'
  | 'PendingClose'
  | 'PendingCompletion'
  | 'Closed'
  | 'Rejected'
  | 'Withdrawn';

// Actor Types
export type ITWorkflowActor = 
  | 'Requestor'
  | 'DocAuthor'
  | 'Editor1'
  | 'Editor1a'
  | 'Editor2'
  | 'Editor3'
  | 'Editor4'
  | 'ITAPP'
  | 'Transporter'
  | 'ITPIC'
  | 'HoD'
  | 'DivisionHead'
  | 'IT_SUPPORT'
  | 'IT_ADMIN'
  | 'IT_MANAGER'
  | 'IS_ADMIN'
  | 'IT_HOD'
  | 'Backup_Administrator'
  | 'BASIS_TeamMember'
  | 'System';

// Workflow Stage Definition
export interface ITWorkflowStage {
  stageId: number;
  stageName: string;
  status: ITWorkflowStatus;
  description: string;
  actor: ITWorkflowActor;
  nextStage?: ITWorkflowStatus;
  slaHours?: number;
  requiredFields?: string[];
  lockedFields?: string[];
  commentRequired?: boolean;
}

// Form Routing Configuration
export interface ITFormRouting {
  formCode: string;
  formName: string;
  pattern: WorkflowPattern;
  stages: ITWorkflowStage[];
  moduleCode: string;
  moduleName: string;
}

// Notification Rule Types
export type NotificationTrigger = 'OnFormCreate' | 'OnApproval' | 'OnRejection' | 'OnStageChange' | 'OnEscalation';

export interface NotificationRule {
  trigger: NotificationTrigger;
  recipients: {
    type: 'Role' | 'Field' | 'Static';
    value: string; // Role ID, field name, or static email
  }[];
  template?: string;
}

// Escalation Rule Types
export interface EscalationRule {
  condition: string;
  action: string;
  notifyRecipients: string[];
  thresholdDays?: number;
  thresholdCount?: number;
}

// Validation Rule Types
export interface ValidationRule {
  category: string;
  ruleName: string;
  requiredFields?: string[];
  condition?: string;
  errorMessage?: string;
  lockFields?: string[];
  editableBy?: ITRoleId[];
}

// Complete IT Routing Configuration
export interface ITRoutingConfiguration {
  version: string;
  lastUpdated: string;
  roles: typeof ITRoles;
  forms: ITFormRouting[];
  notificationRules: NotificationRule[];
  escalationRules: EscalationRule[];
  validationRules: ValidationRule[];
}

// Form Routings from Excel Configuration
export const ITFormRoutings: ITFormRouting[] = [
  // VPNACCESS - VPN Access Request / External Access Form
  {
    formCode: 'VPNACCESS',
    formName: 'VPN Access Request / External Access Form',
    pattern: 'MultiStageApproval',
    moduleCode: 'M1',
    moduleName: 'User & Access Management',
    stages: [
      {
        stageId: 1,
        stageName: 'Draft',
        status: 'Draft',
        description: 'Form created by Requestor',
        actor: 'Requestor',
        nextStage: 'PendingHOD',
      },
      {
        stageId: 2,
        stageName: 'HOD Review',
        status: 'PendingHOD',
        description: 'Head of Department approves request',
        actor: 'HoD',
        nextStage: 'PendingDivHead',
        slaHours: 24,
        commentRequired: true,
      },
      {
        stageId: 3,
        stageName: 'Division Head Review',
        status: 'PendingDivHead',
        description: 'Division Head approves request',
        actor: 'DivisionHead',
        nextStage: 'PendingITManager',
        slaHours: 24,
        commentRequired: true,
      },
      {
        stageId: 4,
        stageName: 'IT Manager Review',
        status: 'PendingITManager',
        description: 'IT Manager approves access level',
        actor: 'IT_MANAGER',
        nextStage: 'PendingIT',
        slaHours: 24,
        commentRequired: true,
      },
      {
        stageId: 5,
        stageName: 'IT Implementation',
        status: 'PendingIT',
        description: 'IT staff implements access configuration',
        actor: 'IT_ADMIN',
        nextStage: 'PendingITConfig',
        slaHours: 48,
      },
      {
        stageId: 6,
        stageName: 'IT Configuration',
        status: 'PendingITConfig',
        description: 'IT Admin completes configuration setup',
        actor: 'IT_ADMIN',
        nextStage: 'Closed',
        slaHours: 24,
      },
      {
        stageId: 7,
        stageName: 'Closed',
        status: 'Closed',
        description: 'Access provisioned successfully',
        actor: 'System',
      },
    ],
  },
  // ITEVT - IT Event Log
  {
    formCode: 'ITEVT',
    formName: 'IT Event Log',
    pattern: 'CRUDRegistry',
    moduleCode: 'M2',
    moduleName: 'IT Support Services',
    stages: [
      {
        stageId: 1,
        stageName: 'Active',
        status: 'Active',
        description: 'IT Event logged and active',
        actor: 'IT_ADMIN',
        nextStage: 'PendingITAction',
      },
      {
        stageId: 2,
        stageName: 'IT Action',
        status: 'PendingITAction',
        description: 'IT Administrator processes event',
        actor: 'IT_ADMIN',
        nextStage: 'Closed',
        slaHours: 72,
      },
      {
        stageId: 3,
        stageName: 'Closed',
        status: 'Closed',
        description: 'Event resolved and closed',
        actor: 'System',
      },
    ],
  },
  // SRVACCESS - Server Records
  {
    formCode: 'SRVACCESS',
    formName: 'Server Records',
    pattern: 'CRUDRegistry',
    moduleCode: 'M3',
    moduleName: 'Hardware & Infrastructure',
    stages: [
      {
        stageId: 1,
        stageName: 'Active',
        status: 'Active',
        description: 'Server record maintained by IT',
        actor: 'IT_ADMIN',
        nextStage: 'PendingITAction',
      },
      {
        stageId: 2,
        stageName: 'IT Action',
        status: 'PendingITAction',
        description: 'IT Administrator processes request',
        actor: 'IT_ADMIN',
        nextStage: 'Closed',
        slaHours: 48,
      },
      {
        stageId: 3,
        stageName: 'Closed',
        status: 'Closed',
        description: 'Server record closed',
        actor: 'System',
      },
    ],
  },
  // DATAREST - Data Restoration Request
  {
    formCode: 'DATAREST',
    formName: 'Data Restoration Request',
    pattern: 'SimpleApproval',
    moduleCode: 'M2',
    moduleName: 'IT Support Services',
    stages: [
      {
        stageId: 1,
        stageName: 'Submitted',
        status: 'Submitted',
        description: 'Backup/Restore request submitted by user',
        actor: 'Requestor',
        nextStage: 'PendingITAction',
      },
      {
        stageId: 2,
        stageName: 'IT Action',
        status: 'PendingITAction',
        description: 'Backup Administrator processes request',
        actor: 'Backup_Administrator',
        nextStage: 'Closed',
        slaHours: 48,
      },
      {
        stageId: 3,
        stageName: 'Closed',
        status: 'Closed',
        description: 'Data restoration complete',
        actor: 'System',
      },
    ],
  },
  // SAPCA - SAP Config Access
  {
    formCode: 'SAPCA',
    formName: 'SAP Config Access',
    pattern: 'SequentialApproval',
    moduleCode: 'M4',
    moduleName: 'SAP Operations',
    stages: [
      {
        stageId: 1,
        stageName: 'Request Draft',
        status: 'Request',
        description: 'IT Functional requests SAP config access',
        actor: 'Editor1',
        nextStage: 'Submitted',
      },
      {
        stageId: 2,
        stageName: 'Pending IT Approval',
        status: 'Submitted',
        description: 'ITAPP approves, rejects, or requestor withdraws',
        actor: 'ITAPP',
        nextStage: 'Approved',
        slaHours: 24,
        commentRequired: true,
      },
      {
        stageId: 3,
        stageName: 'Pending BASIS Reply',
        status: 'Approved',
        description: 'BASIS opens access or rejects the request',
        actor: 'Transporter',
        nextStage: 'ConfigAccess-Done',
        slaHours: 48,
        commentRequired: true,
      },
      {
        stageId: 4,
        stageName: 'Pending Requestor Closure Request',
        status: 'ConfigAccess-Done',
        description: 'Requestor or IT PIC submits request for closure',
        actor: 'Editor3',
        nextStage: 'Submitted-Closure',
        slaHours: 24,
      },
      {
        stageId: 5,
        stageName: 'Pending BASIS Confirmation',
        status: 'Submitted-Closure',
        description: 'BASIS confirms config access closure',
        actor: 'Editor4',
        nextStage: 'Completed',
        slaHours: 24,
      },
      {
        stageId: 6,
        stageName: 'Completed',
        status: 'Completed',
        description: 'Config access closed',
        actor: 'System',
      },
    ],
  },
];

// Notification Rules from Excel Configuration
export const ITNotificationRules: NotificationRule[] = [
  {
    trigger: 'OnFormCreate',
    recipients: [
      { type: 'Field', value: 'CC' },
      { type: 'Static', value: 'ISG_Recipients' },
    ],
  },
  {
    trigger: 'OnApproval',
    recipients: [
      { type: 'Field', value: 'Requestor' },
      { type: 'Role', value: 'IT_ADMIN' },
    ],
  },
  {
    trigger: 'OnRejection',
    recipients: [
      { type: 'Field', value: 'Requestor' },
      { type: 'Role', value: 'IT_MANAGER' },
    ],
  },
];

// Escalation Rules from Excel Configuration
export const ITEscalationRules: EscalationRule[] = [
  {
    condition: 'Request pending approval for > 3 days',
    action: 'Auto-escalate to IT HOD',
    notifyRecipients: ['All approvers in chain', 'IT_Manager'],
    thresholdDays: 3,
  },
  {
    condition: 'IT approval rejected 2+ times',
    action: 'Escalate to IS_ADMIN for override review',
    notifyRecipients: ['Requestor', 'IT_Manager', 'IS_ADMIN'],
    thresholdCount: 2,
  },
  {
    condition: 'User withdrawal during review',
    action: 'Notify current approver',
    notifyRecipients: ['Current approver', 'IT_Manager'],
  },
];

// Validation Rules from Excel Configuration
export const ITValidationRules: ValidationRule[] = [
  {
    category: 'MultiStageApproval_Draft',
    ruleName: 'RequiredFields',
    requiredFields: ['requestorEmail', 'justification', 'accessType'],
    errorMessage: 'Please fill in all required fields',
  },
  {
    category: 'MultiStageApproval_Draft',
    ruleName: 'SelfAccessValidation',
    condition: 'requestorEmail !== accessFor',
    errorMessage: 'User cannot request access for themselves',
  },
  {
    category: 'MultiStageApproval_Draft',
    ruleName: 'JustificationValidation',
    condition: 'justification.length >= 20',
    errorMessage: 'Provide detailed business justification',
  },
  {
    category: 'MultiStageApproval_HODReview',
    ruleName: 'ApproverField',
    requiredFields: ['REQ_DeptHead'],
    errorMessage: 'Approver comment is required',
  },
  {
    category: 'MultiStageApproval_HODReview',
    ruleName: 'LockFields',
    lockFields: ['requestorEmail', 'justification', 'accessType'],
  },
  {
    category: 'CRUDRegistry_Active',
    ruleName: 'EditableBy',
    editableBy: ['IT_ADMIN', 'IS_ADMIN'],
  },
  {
    category: 'CRUDRegistry_Active',
    ruleName: 'LockFieldsAfterSubmit',
    lockFields: ['createdDate', 'createdBy'],
  },
];

// Complete Configuration Export
export const ITRoutingConfig: ITRoutingConfiguration = {
  version: '1.0',
  lastUpdated: '2026-05-21',
  roles: ITRoles,
  forms: ITFormRoutings,
  notificationRules: ITNotificationRules,
  escalationRules: ITEscalationRules,
  validationRules: ITValidationRules,
};

// Helper function to get form routing by code
export function getFormRoutingByCode(formCode: string): ITFormRouting | undefined {
  return ITFormRoutings.find(
    (form) => form.formCode.toUpperCase() === formCode.toUpperCase()
  );
}

// Helper function to get forms by module
export function getFormsByModule(moduleCode: string): ITFormRouting[] {
  return ITFormRoutings.filter(
    (form) => form.moduleCode.toUpperCase() === moduleCode.toUpperCase()
  );
}

// Helper function to get current stage for a status
export function getCurrentStage(
  formCode: string,
  status: ITWorkflowStatus
): ITWorkflowStage | undefined {
  const routing = getFormRoutingByCode(formCode);
  if (!routing) return undefined;
  return routing.stages.find((stage) => stage.status === status);
}

// Helper function to get next stage
export function getNextStage(
  formCode: string,
  currentStatus: ITWorkflowStatus
): ITWorkflowStage | undefined {
  const currentStage = getCurrentStage(formCode, currentStatus);
  if (!currentStage?.nextStage) return undefined;
  return getCurrentStage(formCode, currentStage.nextStage);
}

// Helper to map ITWorkflowStatus to MainDBIT currentstatusKey
export function mapStatusToKey(status: ITWorkflowStatus): string {
  const statusMap: Record<ITWorkflowStatus, string> = {
    'Draft': 'CurrentstatusKey0',
    'Submitted': 'CurrentstatusKey1',
    'Active': 'CurrentstatusKey1',
    'Approved': 'CurrentstatusKey3',
    'Request': 'CurrentstatusKey3',
    'ConfigAccess-Done': 'CurrentstatusKey19',
    'Reject - Closed': 'CurrentstatusKey4',
    'Submitted-Closure': 'CurrentstatusKey20',
    'Completed': 'CurrentstatusKey2',
    'PendingHOD': 'CurrentstatusKey2',
    'PendingDivHead': 'CurrentstatusKey2',
    'PendingITManager': 'CurrentstatusKey2',
    'PendingIT': 'CurrentstatusKey2',
    'PendingITConfig': 'CurrentstatusKey2',
    'PendingITAction': 'CurrentstatusKey2',
    'PendingBASIS': 'CurrentstatusKey2',
    'PendingClose': 'CurrentstatusKey2',
    'PendingCompletion': 'CurrentstatusKey2',
    'Closed': 'CurrentstatusKey2',
    'Rejected': 'CurrentstatusKey4',
    'Withdrawn': 'CurrentstatusKey6',
  };
  return statusMap[status] || 'CurrentstatusKey0';
}

// Helper to map MainDBIT currentstatusKey to ITWorkflowStatus
export function mapKeyToStatus(statusKey: string, workflowStage?: string): ITWorkflowStatus {
  // If workflowStage is provided, use it directly
  if (workflowStage) {
    const validStatuses: ITWorkflowStatus[] = [
      'Draft', 'Submitted', 'Active', 'PendingHOD', 'PendingDivHead',
      'PendingITManager', 'PendingIT', 'PendingITConfig', 'PendingITAction',
      'PendingBASIS', 'PendingClose', 'PendingCompletion', 'Closed', 'Rejected', 'Withdrawn',
      'Approved', 'Request', 'ConfigAccess-Done', 'Reject - Closed', 'Submitted-Closure', 'Completed'
    ];
    if (validStatuses.includes(workflowStage as ITWorkflowStatus)) {
      return workflowStage as ITWorkflowStatus;
    }
  }
  
  // Fall back to generic status key mapping
  const keyMap: Record<string, ITWorkflowStatus> = {
    'CurrentstatusKey0': 'Draft',
    'CurrentstatusKey1': 'Submitted',
    'CurrentstatusKey2': 'PendingHOD', // Generic pending - actual stage from workflowStage
    'CurrentstatusKey3': 'Closed', // Approved maps to close in this context
    'CurrentstatusKey4': 'Rejected',
    'CurrentstatusKey5': 'Draft', // Revision requested
    'CurrentstatusKey6': 'Withdrawn',
    'CurrentstatusKey7': 'Closed',
  };
  return keyMap[statusKey] || 'Draft';
}

export default ITRoutingConfig;
