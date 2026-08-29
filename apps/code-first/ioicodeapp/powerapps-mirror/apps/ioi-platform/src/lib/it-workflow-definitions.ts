/**
 * IT Department Workflow Definitions
 *
 * Stage `key` values map 1-to-1 to MainDB_IT.CurrentStatus SP choice labels.
 * `actorRole` values map to UserRolesIT.RoleCode labels (see it-roles.ts).
 */

import type {
  WorkflowDefinition,
  WorkflowStageDefinition,
  UrgencyLevel,
} from '@/types/it-approval-workflow';

// =============================================================================
// SHARED SLA MULTIPLIERS
// =============================================================================

const DEFAULT_SLA_MULTIPLIER: Record<UrgencyLevel, number> = {
  Low: 1.5,
  Normal: 1,
  High: 0.5,
  Critical: 0.25,
};

// =============================================================================
// STAGE FACTORY HELPERS
// =============================================================================

const mkDraft = (visible: string[], editable: string[]): WorkflowStageDefinition => ({
  key: 'Draft',
  order: 1,
  name: 'Draft',
  description: 'Request being prepared by initiator',
  actorRole: 'Submitter',
  actorLabel: 'Requestor',
  slaDays: 0,
  allowedActions: ['Submit', 'Edit'],
  visibleSections: visible,
  editableSections: editable,
});

const mkPendingHOD = (order: number, visible: string[]): WorkflowStageDefinition => ({
  key: 'PendingHOD',
  order,
  name: 'Pending HOD Approval',
  description: 'Awaiting Head of Department approval',
  actorRole: 'HoD',
  actorLabel: 'Head of Department',
  slaDays: 3,
  escalationRole: 'Approver',
  allowedActions: ['Approve', 'Reject', 'Return', 'Delegate'],
  visibleSections: visible,
  editableSections: ['hod-approval'],
  requiredFields: ['hodStatus', 'hodComment'],
  notificationTemplate: 'ApprovalRequired',
  reminderSettings: { daysBeforeDue: [2, 1], emailTemplate: 'Reminder' },
});

const mkPendingDivHead = (order: number, visible: string[]): WorkflowStageDefinition => ({
  key: 'PendingDivHead',
  order,
  name: 'Pending Division Head Approval',
  description: 'Awaiting Division Director approval',
  actorRole: 'DivisionHead',
  actorLabel: 'Division Director',
  slaDays: 5,
  escalationRole: 'ExecutiveDirector',
  allowedActions: ['Approve', 'Reject', 'Return', 'Delegate'],
  visibleSections: visible,
  editableSections: ['division-approval'],
  requiredFields: ['divisionStatus', 'divisionComment'],
  notificationTemplate: 'ApprovalRequired',
  reminderSettings: { daysBeforeDue: [3, 1], emailTemplate: 'Reminder' },
});

const mkPendingITManager = (order: number, visible: string[]): WorkflowStageDefinition => ({
  key: 'PendingITManager',
  order,
  name: 'Pending IT Manager Review',
  description: 'Awaiting IT Manager review and approval',
  actorRole: 'ITManager',
  actorLabel: 'IT Manager',
  slaDays: 3,
  escalationRole: 'ExecutiveDirector',
  allowedActions: ['Approve', 'Reject', 'Return', 'Delegate'],
  visibleSections: visible,
  editableSections: ['it-manager-section'],
  requiredFields: ['itManagerStatus'],
  notificationTemplate: 'ApprovalRequired',
  reminderSettings: { daysBeforeDue: [2, 1], emailTemplate: 'Reminder' },
});

const mkPendingIT = (order: number, visible: string[], editable: string[]): WorkflowStageDefinition => ({
  key: 'PendingIT',
  order,
  name: 'Pending IT Processing',
  description: 'IT team processing request',
  actorRole: 'ITAdmin',
  actorLabel: 'IT Administrator',
  slaDays: 5,
  allowedActions: ['Complete', 'Return'],
  visibleSections: visible,
  editableSections: editable,
  notificationTemplate: 'ApprovalRequired',
});

// =============================================================================
// M1 — USER & ACCESS MANAGEMENT WORKFLOWS
// =============================================================================

/**
 * EAF — External Access Form (VPN / Citrix)
 * Draft → PendingHOD → PendingDivHead → PendingITManager → PendingIT → Approved
 */
export const EAF_WORKFLOW: WorkflowDefinition = {
  formCode: 'EAF',
  name: 'External Access Request',
  description: 'VPN and Citrix remote access request',
  moduleCode: 'M1',
  listName: 'MainDB_IT',
  siteScope: 'PRAI',
  defaultUrgency: 'Normal',
  urgencySLAMultiplier: DEFAULT_SLA_MULTIPLIER,
  stages: [
    mkDraft(['requester-section', 'access-request-section'], ['requester-section', 'access-request-section']),
    mkPendingHOD(2, ['requester-section', 'access-request-section', 'hod-approval']),
    mkPendingDivHead(3, ['requester-section', 'access-request-section', 'hod-approval', 'division-approval']),
    mkPendingITManager(4, ['requester-section', 'access-request-section', 'hod-approval', 'division-approval', 'it-manager-section']),
    mkPendingIT(5,
      ['requester-section', 'access-request-section', 'hod-approval', 'division-approval', 'it-manager-section', 'it-provisioning'],
      ['it-provisioning'],
    ),
    {
      key: 'Approved',
      order: 6,
      name: 'Approved',
      description: 'Access provisioned and approved',
      actorRole: 'ITAdmin',
      actorLabel: 'IT Administrator',
      slaDays: 0,
      allowedActions: [],
      visibleSections: ['requester-section', 'access-request-section', 'hod-approval', 'division-approval', 'it-manager-section', 'it-provisioning'],
      editableSections: [],
    },
  ],
};

/**
 * NIR — Notes ID Request
 * Draft → PendingHOD → PendingNotesAdmin → PendingITHardware → Approved
 */
export const NIR_WORKFLOW: WorkflowDefinition = {
  formCode: 'NIR',
  name: 'Notes ID Request',
  description: 'HCL Notes / Lotus Notes user ID creation',
  moduleCode: 'M1',
  listName: 'MainDB_IT',
  siteScope: 'PRAI',
  defaultUrgency: 'Normal',
  urgencySLAMultiplier: DEFAULT_SLA_MULTIPLIER,
  stages: [
    mkDraft(['employee-info', 'notes-details'], ['employee-info', 'notes-details']),
    mkPendingHOD(2, ['employee-info', 'notes-details', 'hod-approval']),
    {
      key: 'PendingNotesAdmin',
      order: 3,
      name: 'Pending Notes Admin',
      description: 'Notes Administrator creates the Notes ID',
      actorRole: 'ITAdmin',
      actorLabel: 'Notes Administrator',
      slaDays: 3,
      allowedActions: ['Complete', 'Return'],
      visibleSections: ['employee-info', 'notes-details', 'hod-approval', 'notes-admin'],
      editableSections: ['notes-admin'],
      notificationTemplate: 'ApprovalRequired',
    },
    {
      key: 'PendingITHardware',
      order: 4,
      name: 'Pending IT Hardware Setup',
      description: 'IT Hardware team completes workstation setup and delivery',
      actorRole: 'ITAdmin',
      actorLabel: 'IT Hardware Team',
      slaDays: 5,
      allowedActions: ['Complete', 'Return'],
      visibleSections: ['employee-info', 'notes-details', 'hod-approval', 'notes-admin', 'hardware-setup'],
      editableSections: ['hardware-setup'],
      notificationTemplate: 'ApprovalRequired',
    },
    {
      key: 'Approved',
      order: 5,
      name: 'Approved',
      description: 'Notes ID and hardware setup completed',
      actorRole: 'ITAdmin',
      actorLabel: 'IT Administrator',
      slaDays: 0,
      allowedActions: [],
      visibleSections: ['employee-info', 'notes-details', 'hod-approval', 'notes-admin', 'hardware-setup'],
      editableSections: [],
    },
  ],
};

/**
 * RS — Reset Password / Unlock ID
 * Draft → PendingIT → (BANK: EDApproval) → Closed
 * Non-BANK: Draft → PendingIT → Closed directly
 * ED approval stage is conditional on application type = BANK
 */
export const RS_WORKFLOW: WorkflowDefinition = {
  formCode: 'RS',
  name: 'Password Reset / Unlock ID',
  description: 'Password reset or account unlock — direct IT processing; BANK type requires ED confirmation',
  moduleCode: 'M1',
  listName: 'MainDB_IT',
  siteScope: 'ALL',
  defaultUrgency: 'High',
  urgencySLAMultiplier: DEFAULT_SLA_MULTIPLIER,
  stages: [
    mkDraft(['user-info', 'reset-details', 'bank-system'], ['user-info', 'reset-details', 'bank-system']),
    mkPendingIT(2, ['user-info', 'reset-details', 'bank-system', 'it-processing'], ['it-processing']),
    {
      key: 'EDApproval',
      order: 3,
      name: 'Pending ED Confirmation',
      description: 'Executive Director confirmation required (BANK type resets)',
      actorRole: 'ExecutiveDirector',
      actorLabel: 'Executive Director',
      slaDays: 2,
      escalationRole: 'ITAdmin',
      isConditional: true,
      conditionField: 'rSRequestType',
      conditionValues: ['BANK'],
      allowedActions: ['Confirm', 'Reject'],
      visibleSections: ['user-info', 'reset-details', 'bank-system', 'it-processing', 'ed-approval'],
      editableSections: ['ed-approval'],
      requiredFields: ['edStatus', 'edComment'],
    },
    {
      key: 'Closed',
      order: 4,
      name: 'Closed',
      description: 'Reset completed and ticket closed',
      actorRole: 'ITAdmin',
      actorLabel: 'IT Administrator',
      slaDays: 0,
      allowedActions: [],
      visibleSections: ['user-info', 'reset-details', 'bank-system', 'it-processing', 'ed-approval'],
      editableSections: [],
    },
  ],
};

/**
 * SAPAMR — SAP Authorisation Matrix Review
 *
 * Domino: AuthMatrixReview.nsf
 * States: Request(Draft) → Submitted(Pending Verification) → Verified(Pending BPO Approval) → Approved/Rejected/Withdrawn
 * FI modules have TBV_1-5 per-slot sub-verifiers (CA stays Submitted).
 *
 * Site: PRAI (MainDB_IT)
 */
export const SAPAMR_WORKFLOW: WorkflowDefinition = {
  formCode: 'SAPAMR',
  name: 'SAP Authorisation Matrix Review',
  description: 'SAP authorisation matrix review — TBV verification followed by BPO/HOD approval',
  moduleCode: 'M4',
  listName: 'MainDB_IT',
  siteScope: 'PRAI',
  defaultUrgency: 'Normal',
  urgencySLAMultiplier: DEFAULT_SLA_MULTIPLIER,
  stages: [
    mkDraft(['initiation'], ['initiation']),
    {
      key: 'PendingVerification',
      order: 2,
      name: 'Pending Verification',
      description: 'TBV (Key User) verification in progress',
      actorRole: 'ITSupport',
      actorLabel: 'Key User (TBV)',
      slaDays: 3,
      escalationRole: 'ITManager',
      allowedActions: ['Approve', 'Reject'],
      visibleSections: ['initiation', 'verification'],
      editableSections: ['verification'],
      requiredFields: ['txtComment1'],
      notificationTemplate: 'ApprovalRequired',
      reminderSettings: { daysBeforeDue: [1], emailTemplate: 'Reminder' },
    },
    {
      key: 'PendingBPOApproval',
      order: 3,
      name: 'Pending BPO/HOD Approval',
      description: 'BPO or HOD final approval',
      actorRole: 'Approver',
      actorLabel: 'BPO/HOD',
      slaDays: 3,
      escalationRole: 'ExecutiveDirector',
      allowedActions: ['Approve', 'Reject'],
      visibleSections: ['initiation', 'verification', 'approval'],
      editableSections: ['approval'],
      requiredFields: ['txtComment2'],
      notificationTemplate: 'ApprovalRequired',
      reminderSettings: { daysBeforeDue: [1], emailTemplate: 'Reminder' },
    },
    {
      key: 'Closed',
      order: 4,
      name: 'Closed',
      description: 'Request completed (approved/rejected/withdrawn)',
      actorRole: 'System',
      actorLabel: 'System',
      slaDays: 0,
      allowedActions: [],
      visibleSections: ['initiation', 'verification', 'approval'],
      editableSections: [],
    },
  ],
};

/**
 * SFAR — Share Folder Access Requisition
 * Draft → PendingOwner → PendingIT → Approved
 */
export const SFAR_WORKFLOW: WorkflowDefinition = {
  formCode: 'SFAR',
  name: 'Share Folder Access Request',
  description: 'Request access to shared network folders',
  moduleCode: 'M1',
  listName: 'MainDB_IT',
  siteScope: 'PRAI',
  defaultUrgency: 'Normal',
  urgencySLAMultiplier: DEFAULT_SLA_MULTIPLIER,
  stages: [
    mkDraft(['requestor-section', 'folder-details', 'access-level'], ['requestor-section', 'folder-details', 'access-level']),
    {
      key: 'PendingOwner',
      order: 2,
      name: 'Pending Folder Owner Review',
      description: 'Folder owner reviews and approves the access request',
      actorRole: 'DivisionHead',
      actorLabel: 'Folder Owner',
      slaDays: 3,
      escalationRole: 'HoD',
      allowedActions: ['Approve', 'Reject', 'Return'],
      visibleSections: ['requestor-section', 'folder-details', 'access-level', 'owner-review'],
      editableSections: ['owner-review'],
      notificationTemplate: 'ApprovalRequired',
      reminderSettings: { daysBeforeDue: [2, 1], emailTemplate: 'Reminder' },
    },
    mkPendingIT(3, ['requestor-section', 'folder-details', 'access-level', 'owner-review', 'it-processing'], ['it-processing']),
    {
      key: 'Approved',
      order: 4,
      name: 'Approved',
      description: 'Folder access granted',
      actorRole: 'ITAdmin',
      actorLabel: 'IT Administrator',
      slaDays: 0,
      allowedActions: [],
      visibleSections: ['requestor-section', 'folder-details', 'access-level', 'owner-review', 'it-processing'],
      editableSections: [],
    },
  ],
};

/**
 * UR — User ID Requisition Form
 * Draft → PendingITManager → PendingIT → Approved
 */
export const UR_WORKFLOW: WorkflowDefinition = {
  formCode: 'UR',
  name: 'User ID Requisition',
  description: 'New user account provisioning across IT systems',
  moduleCode: 'M1',
  listName: 'MainDB_IT',
  siteScope: 'PRAI',
  defaultUrgency: 'Normal',
  urgencySLAMultiplier: DEFAULT_SLA_MULTIPLIER,
  stages: [
    mkDraft(
      ['requestor-section', 'access-card-section', 'bank-section', 'plant-section'],
      ['requestor-section', 'access-card-section', 'bank-section', 'plant-section'],
    ),
    mkPendingITManager(2, ['requestor-section', 'access-card-section', 'bank-section', 'plant-section', 'it-manager-section']),
    mkPendingIT(3,
      ['requestor-section', 'access-card-section', 'bank-section', 'plant-section', 'it-manager-section', 'account-creation'],
      ['account-creation'],
    ),
    {
      key: 'Approved',
      order: 4,
      name: 'Approved',
      description: 'User accounts created and provisioned',
      actorRole: 'ITAdmin',
      actorLabel: 'IT Administrator',
      slaDays: 0,
      allowedActions: [],
      visibleSections: ['requestor-section', 'access-card-section', 'bank-section', 'plant-section', 'it-manager-section', 'account-creation'],
      editableSections: [],
    },
  ],
};

// =============================================================================
// M2 — IT SUPPORT & SERVICE REQUESTS WORKFLOWS
// =============================================================================

/**
 * ITSSR — IT Support & Service Request
 * Draft → PendingITTaskAssign → PendingITPIC → Active → Closed
 */
export const ITSSR_WORKFLOW: WorkflowDefinition = {
  formCode: 'ITSSR',
  name: 'IT Support & Service Request',
  description: 'IT helpdesk ticket for hardware, software, network, SAP, and bank system issues',
  moduleCode: 'M2',
  listName: 'MainDB_IT',
  siteScope: 'ALL',
  defaultUrgency: 'Normal',
  urgencySLAMultiplier: DEFAULT_SLA_MULTIPLIER,
  stages: [
    mkDraft(
      ['requester-info', 'service-type-hardware', 'service-type-application', 'service-type-sap', 'service-type-bank'],
      ['requester-info', 'service-type-hardware', 'service-type-application', 'service-type-sap', 'service-type-bank'],
    ),
    {
      key: 'PendingITTaskAssign',
      order: 2,
      name: 'Pending IT Task Assignment',
      description: 'IT Manager assigns ticket to PIC',
      actorRole: 'ITManager',
      actorLabel: 'IT Manager',
      slaDays: 1,
      allowedActions: ['Delegate', 'Reject', 'Return'],
      visibleSections: ['requester-info', 'service-type-hardware', 'service-type-application', 'service-type-sap', 'service-type-bank', 'triage'],
      editableSections: ['triage'],
      notificationTemplate: 'ApprovalRequired',
      reminderSettings: { daysBeforeDue: [1], emailTemplate: 'Reminder' },
    },
    {
      key: 'PendingITPIC',
      order: 3,
      name: 'Pending IT PIC Action',
      description: 'Assigned PIC is working on the ticket',
      actorRole: 'ITAdmin',
      actorLabel: 'IT PIC',
      slaDays: 3,
      escalationRole: 'ITManager',
      allowedActions: ['Complete', 'Escalate', 'Return'],
      visibleSections: ['requester-info', 'service-type-hardware', 'service-type-application', 'service-type-sap', 'service-type-bank', 'triage', 'resolution'],
      editableSections: ['resolution'],
      notificationTemplate: 'ApprovalRequired',
      reminderSettings: { daysBeforeDue: [2, 1], emailTemplate: 'Reminder' },
    },
    {
      key: 'PendingReqAcceptance',
      order: 4,
      name: 'Pending Requestor Acceptance',
      description: 'Requestor confirms issue is resolved',
      actorRole: 'Submitter',
      actorLabel: 'Requestor',
      slaDays: 2,
      allowedActions: ['Approve', 'Reject'],
      visibleSections: ['requester-info', 'service-type-hardware', 'service-type-application', 'service-type-sap', 'service-type-bank', 'triage', 'resolution', 'acceptance'],
      editableSections: ['acceptance'],
      notificationTemplate: 'ApprovalRequired',
      reminderSettings: { daysBeforeDue: [1], emailTemplate: 'Reminder' },
    },
    {
      key: 'Closed',
      order: 5,
      name: 'Closed',
      description: 'Ticket closed after resolution accepted',
      actorRole: 'ITAdmin',
      actorLabel: 'IT Administrator',
      slaDays: 0,
      allowedActions: [],
      visibleSections: ['requester-info', 'service-type-hardware', 'service-type-application', 'service-type-sap', 'service-type-bank', 'triage', 'resolution', 'acceptance', 'closure'],
      editableSections: ['closure'],
    },
  ],
};

/**
 * IAL1 — Server Reboot Log
 * Draft → PendingITManager → Approved
 */
export const IAL1_WORKFLOW: WorkflowDefinition = {
  formCode: 'IAL1',
  name: 'Server Reboot Log',
  description: 'Server reboot activity log requiring IT Manager acknowledgement',
  moduleCode: 'M2',
  listName: 'MainDB_IT',
  siteScope: 'ALL',
  defaultUrgency: 'Normal',
  urgencySLAMultiplier: DEFAULT_SLA_MULTIPLIER,
  stages: [
    mkDraft(['server-info', 'reboot-details', 'verification'], ['server-info', 'reboot-details', 'verification']),
    mkPendingITManager(2, ['server-info', 'reboot-details', 'verification', 'it-manager-section']),
    {
      key: 'Approved',
      order: 3,
      name: 'Approved',
      description: 'Reboot log acknowledged',
      actorRole: 'ITManager',
      actorLabel: 'IT Manager',
      slaDays: 0,
      allowedActions: [],
      visibleSections: ['server-info', 'reboot-details', 'verification', 'it-manager-section'],
      editableSections: [],
    },
  ],
};

/**
 * IAL2 — Data Center Access Log
 * Draft → Active (visitor in DC) → Closed (visitor exited)
 */
export const IAL2_WORKFLOW: WorkflowDefinition = {
  formCode: 'IAL2',
  name: 'Data Center Access Log',
  description: 'Visitor entry and exit log for data center access',
  moduleCode: 'M2',
  listName: 'MainDB_IT',
  siteScope: 'ALL',
  defaultUrgency: 'Normal',
  urgencySLAMultiplier: DEFAULT_SLA_MULTIPLIER,
  stages: [
    mkDraft(['visitor-info', 'access-details'], ['visitor-info', 'access-details']),
    {
      key: 'Active',
      order: 2,
      name: 'Active — Visitor Inside',
      description: 'Visitor is currently in the data center',
      actorRole: 'ITAdmin',
      actorLabel: 'IT Administrator',
      slaDays: 0,
      allowedActions: ['Complete'],
      visibleSections: ['visitor-info', 'access-details', 'exit-time'],
      editableSections: ['exit-time'],
    },
    {
      key: 'Closed',
      order: 3,
      name: 'Closed',
      description: 'Visitor has exited data center',
      actorRole: 'ITAdmin',
      actorLabel: 'IT Administrator',
      slaDays: 0,
      allowedActions: [],
      visibleSections: ['visitor-info', 'access-details', 'exit-time'],
      editableSections: [],
    },
  ],
};

/**
 * IAL3 — IT Event Log
 * Draft → PendingITManager → Approved
 */
export const IAL3_WORKFLOW: WorkflowDefinition = {
  formCode: 'IAL3',
  name: 'IT Event Log',
  description: 'Incident, maintenance, or change event record',
  moduleCode: 'M2',
  listName: 'MainDB_IT',
  siteScope: 'ALL',
  defaultUrgency: 'Normal',
  urgencySLAMultiplier: DEFAULT_SLA_MULTIPLIER,
  stages: [
    mkDraft(['event-info', 'impact', 'resolution'], ['event-info', 'impact', 'resolution']),
    mkPendingITManager(2, ['event-info', 'impact', 'resolution', 'it-manager-section']),
    {
      key: 'Approved',
      order: 3,
      name: 'Approved',
      description: 'Event log acknowledged',
      actorRole: 'ITManager',
      actorLabel: 'IT Manager',
      slaDays: 0,
      allowedActions: [],
      visibleSections: ['event-info', 'impact', 'resolution', 'it-manager-section'],
      editableSections: [],
    },
  ],
};

/**
 * IAL4 — Server Records
 * Draft → Active  (ongoing CMDB-style record)
 */
export const IAL4_WORKFLOW: WorkflowDefinition = {
  formCode: 'IAL4',
  name: 'Server Records',
  description: 'Server inventory and configuration record',
  moduleCode: 'M2',
  listName: 'MainDB_IT',
  siteScope: 'ALL',
  defaultUrgency: 'Normal',
  urgencySLAMultiplier: DEFAULT_SLA_MULTIPLIER,
  stages: [
    mkDraft(['server-details', 'configuration'], ['server-details', 'configuration']),
    {
      key: 'Active',
      order: 2,
      name: 'Active',
      description: 'Server record is live and maintained',
      actorRole: 'ITAdmin',
      actorLabel: 'IT Administrator',
      slaDays: 0,
      allowedActions: ['Edit', 'Close'],
      visibleSections: ['server-details', 'configuration', 'maintenance'],
      editableSections: ['server-details', 'configuration', 'maintenance'],
    },
  ],
};

/**
 * IAL5 — Data Restoration Request
 * Draft → PendingITManager → PendingIT → Verified
 */
export const IAL5_WORKFLOW: WorkflowDefinition = {
  formCode: 'IAL5',
  name: 'Data Restoration Request',
  description: 'Request for data restoration from backup',
  moduleCode: 'M2',
  listName: 'MainDB_IT',
  siteScope: 'ALL',
  defaultUrgency: 'High',
  urgencySLAMultiplier: DEFAULT_SLA_MULTIPLIER,
  stages: [
    mkDraft(['requester-info', 'data-details', 'backup-source'], ['requester-info', 'data-details', 'backup-source']),
    mkPendingITManager(2, ['requester-info', 'data-details', 'backup-source', 'it-manager-section']),
    mkPendingIT(3, ['requester-info', 'data-details', 'backup-source', 'it-manager-section', 'it-processing'], ['it-processing']),
    {
      key: 'PendingReqAcceptance',
      order: 4,
      name: 'Pending Requestor Acceptance',
      description: 'Requestor verifies restored data is correct',
      actorRole: 'Submitter',
      actorLabel: 'Requestor',
      slaDays: 2,
      allowedActions: ['Approve', 'Reject'],
      visibleSections: ['requester-info', 'data-details', 'backup-source', 'it-manager-section', 'it-processing', 'acceptance'],
      editableSections: ['acceptance'],
      notificationTemplate: 'ApprovalRequired',
    },
    {
      key: 'Verified',
      order: 5,
      name: 'Verified',
      description: 'Data restoration verified and complete',
      actorRole: 'ITAdmin',
      actorLabel: 'IT Administrator',
      slaDays: 0,
      allowedActions: [],
      visibleSections: ['requester-info', 'data-details', 'backup-source', 'it-manager-section', 'it-processing', 'acceptance'],
      editableSections: [],
    },
  ],
};

/**
 * ITDR — IT Daily Report
 * Draft → PendingITManager → Approved
 */
export const ITDR_WORKFLOW: WorkflowDefinition = {
  formCode: 'ITDR',
  name: 'IT Daily Report',
  description: 'Daily IT operations activity report',
  moduleCode: 'M2',
  listName: 'MainDB_IT',
  siteScope: 'ALL',
  defaultUrgency: 'Normal',
  urgencySLAMultiplier: DEFAULT_SLA_MULTIPLIER,
  stages: [
    mkDraft(['date-shift', 'activities', 'issues'], ['date-shift', 'activities', 'issues']),
    mkPendingITManager(2, ['date-shift', 'activities', 'issues', 'it-manager-section']),
    {
      key: 'Approved',
      order: 3,
      name: 'Approved',
      description: 'Daily report acknowledged',
      actorRole: 'ITManager',
      actorLabel: 'IT Manager',
      slaDays: 0,
      allowedActions: [],
      visibleSections: ['date-shift', 'activities', 'issues', 'it-manager-section'],
      editableSections: [],
    },
  ],
};

/**
 * ITDR2 — Outstanding Tasks Register
 * Draft → Active (task in progress) → Closed (task completed)
 */
export const ITDR2_WORKFLOW: WorkflowDefinition = {
  formCode: 'ITDR2',
  name: 'Outstanding Tasks Register',
  description: 'Ongoing IT task tracking register',
  moduleCode: 'M2',
  listName: 'MainDB_IT',
  siteScope: 'ALL',
  defaultUrgency: 'Normal',
  urgencySLAMultiplier: DEFAULT_SLA_MULTIPLIER,
  stages: [
    mkDraft(['task-info', 'status', 'target-date'], ['task-info', 'status', 'target-date']),
    {
      key: 'Active',
      order: 2,
      name: 'Active',
      description: 'Task is in progress',
      actorRole: 'ITAdmin',
      actorLabel: 'IT Administrator',
      slaDays: 0,
      allowedActions: ['Complete', 'Edit'],
      visibleSections: ['task-info', 'status', 'target-date'],
      editableSections: ['status', 'target-date'],
    },
    {
      key: 'Closed',
      order: 3,
      name: 'Closed',
      description: 'Task completed and closed',
      actorRole: 'ITAdmin',
      actorLabel: 'IT Administrator',
      slaDays: 0,
      allowedActions: [],
      visibleSections: ['task-info', 'status', 'target-date'],
      editableSections: [],
    },
  ],
};

/**
 * PRF — Program Request Form
 * Draft → PendingHOD → PendingITManager → PendingIT → PendingReqAcceptance → Verified
 */
export const PRF_WORKFLOW: WorkflowDefinition = {
  formCode: 'PRF',
  name: 'Program Request Form',
  description: 'IT system or program development / enhancement request',
  moduleCode: 'M2',
  listName: 'MainDB_IT',
  siteScope: 'PRAI',
  defaultUrgency: 'Normal',
  urgencySLAMultiplier: DEFAULT_SLA_MULTIPLIER,
  stages: [
    mkDraft(['requester-info', 'program-details'], ['requester-info', 'program-details']),
    mkPendingHOD(2, ['requester-info', 'program-details', 'hod-approval']),
    mkPendingITManager(3, ['requester-info', 'program-details', 'hod-approval', 'it-manager-section']),
    {
      key: 'PendingIT',
      order: 4,
      name: 'Pending IT Development',
      description: 'IT team developing / implementing the program',
      actorRole: 'ITAdmin',
      actorLabel: 'IT Developer',
      slaDays: 14,
      escalationRole: 'ITManager',
      allowedActions: ['Complete', 'Return'],
      visibleSections: ['requester-info', 'program-details', 'hod-approval', 'it-manager-section', 'sap-review', 'development'],
      editableSections: ['development'],
      notificationTemplate: 'ApprovalRequired',
      reminderSettings: { daysBeforeDue: [7, 3, 1], emailTemplate: 'Reminder' },
    },
    {
      key: 'PendingReqAcceptance',
      order: 5,
      name: 'Pending User Validation',
      description: 'Requestor validates the delivered solution',
      actorRole: 'Submitter',
      actorLabel: 'Requestor',
      slaDays: 5,
      allowedActions: ['Approve', 'Reject'],
      visibleSections: ['requester-info', 'program-details', 'hod-approval', 'it-manager-section', 'development', 'validation'],
      editableSections: ['validation'],
      notificationTemplate: 'ApprovalRequired',
      reminderSettings: { daysBeforeDue: [3, 1], emailTemplate: 'Reminder' },
    },
    {
      key: 'Verified',
      order: 6,
      name: 'Verified',
      description: 'Program delivered and accepted by requestor',
      actorRole: 'ITAdmin',
      actorLabel: 'IT Developer',
      slaDays: 0,
      allowedActions: [],
      visibleSections: ['requester-info', 'program-details', 'hod-approval', 'it-manager-section', 'development', 'validation'],
      editableSections: [],
    },
  ],
};

/**
 * SAPCR — SAP & WB Change Request
 *
 * Domino: SAPChgRequestForm.nsf
 * States: Request → Submitted(BPO) → BPOApp(PM) → PMApp(Dev) → SubmittedDetails(PM) → PMAppImp(PD) → AppFinal
 *         BPORej / PMRej terminal; SubmittedApp (resolved) terminal
 *
 * Site: PRAI (MainDB_IT)
 */
export const SAPCR_WORKFLOW: WorkflowDefinition = {
  formCode: 'SAPCR',
  name: 'SAP & WB Change Request',
  description: 'SAP and Workbench change request — BPO → PM → Developer → PM Impact → Project Director',
  moduleCode: 'M4',
  listName: 'MainDB_IT',
  siteScope: 'PRAI',
  defaultUrgency: 'Normal',
  urgencySLAMultiplier: DEFAULT_SLA_MULTIPLIER,
  stages: [
    mkDraft(['initiation'], ['initiation']),
    {
      key: 'Submitted',
      order: 2,
      name: 'Pending BPO Approval',
      description: 'Awaiting BPO (Business Process Owner) approval',
      actorRole: 'Approver',
      actorLabel: 'BPO',
      slaDays: 3,
      escalationRole: 'ITManager',
      allowedActions: ['Approve', 'Reject'],
      visibleSections: ['initiation'],
      editableSections: ['bpo-approval'],
      requiredFields: ['bpoComment'],
      notificationTemplate: 'ApprovalRequired',
      reminderSettings: { daysBeforeDue: [2, 1], emailTemplate: 'Reminder' },
    },
    {
      key: 'BPOApp',
      order: 3,
      name: 'Pending PM Approval',
      description: 'Awaiting Project Manager approval for investigation',
      actorRole: 'HoD',
      actorLabel: 'Project Manager',
      slaDays: 3,
      escalationRole: 'ExecutiveDirector',
      allowedActions: ['Approve', 'Reject'],
      visibleSections: ['initiation', 'bpo-approval'],
      editableSections: ['pm-review'],
      requiredFields: ['pmComment'],
      notificationTemplate: 'ApprovalRequired',
      reminderSettings: { daysBeforeDue: [2, 1], emailTemplate: 'Reminder' },
    },
    {
      key: 'PMApp',
      order: 4,
      name: 'Pending Developer Investigation',
      description: 'Developer investigating and preparing resolution details',
      actorRole: 'ITSupport',
      actorLabel: 'Developer',
      slaDays: 5,
      escalationRole: 'ITManager',
      allowedActions: ['Complete', 'Return'],
      visibleSections: ['initiation', 'bpo-approval', 'pm-review', 'investigation'],
      editableSections: ['investigation'],
      notificationTemplate: 'ApprovalRequired',
      reminderSettings: { daysBeforeDue: [3, 1], emailTemplate: 'Reminder' },
    },
    {
      key: 'SubmittedDetails',
      order: 5,
      name: 'Pending PM Impact Analysis',
      description: 'PM reviewing developer resolution and performing impact analysis',
      actorRole: 'HoD',
      actorLabel: 'Project Manager',
      slaDays: 3,
      escalationRole: 'ExecutiveDirector',
      allowedActions: ['Approve', 'Reject'],
      visibleSections: ['initiation', 'bpo-approval', 'pm-review', 'investigation'],
      editableSections: ['impact-analysis'],
      requiredFields: ['impactComment'],
      notificationTemplate: 'ApprovalRequired',
      reminderSettings: { daysBeforeDue: [2, 1], emailTemplate: 'Reminder' },
    },
    {
      key: 'PMAppImp',
      order: 6,
      name: 'Pending Project Director Approval',
      description: 'Awaiting final approval from Project Director',
      actorRole: 'ExecutiveDirector',
      actorLabel: 'Project Director',
      slaDays: 3,
      escalationRole: 'System',
      allowedActions: ['Approve'],
      visibleSections: ['initiation', 'bpo-approval', 'pm-review', 'investigation', 'impact-analysis'],
      editableSections: ['director-approval'],
      requiredFields: ['directorComment'],
      notificationTemplate: 'ApprovalRequired',
      reminderSettings: { daysBeforeDue: [2, 1], emailTemplate: 'Reminder' },
    },
    {
      key: 'Closed',
      order: 7,
      name: 'Closed',
      description: 'Change request completed (approved/resolved/rejected)',
      actorRole: 'System',
      actorLabel: 'System',
      slaDays: 0,
      allowedActions: [],
      visibleSections: ['initiation', 'bpo-approval', 'pm-review', 'investigation', 'impact-analysis', 'director-approval'],
      editableSections: [],
    },
  ],
};

// =============================================================================
// WORKFLOW REGISTRY
// =============================================================================

export const WORKFLOW_REGISTRY: Record<string, WorkflowDefinition> = {
  // M1 — User & Access Management
  EAF:  EAF_WORKFLOW,
  NIR:  NIR_WORKFLOW,
  RS:   RS_WORKFLOW,
  SFAR: SFAR_WORKFLOW,
  UR:   UR_WORKFLOW,
  // M4 — SAP Management
  SAPAMR: SAPAMR_WORKFLOW,
  SAPCR:  SAPCR_WORKFLOW,
  // M2 — IT Support & Service Requests
  ITSSR: ITSSR_WORKFLOW,
  IAL1:  IAL1_WORKFLOW,
  IAL2:  IAL2_WORKFLOW,
  IAL3:  IAL3_WORKFLOW,
  IAL4:  IAL4_WORKFLOW,
  IAL5:  IAL5_WORKFLOW,
  ITDR:  ITDR_WORKFLOW,
  ITDR2: ITDR2_WORKFLOW,
  PRF:   PRF_WORKFLOW,
};

// =============================================================================
// LOOKUP HELPERS
// =============================================================================

export function getWorkflowDefinition(formCode: string): WorkflowDefinition | undefined {
  return WORKFLOW_REGISTRY[formCode];
}

export function getWorkflowsByModule(moduleCode: string): WorkflowDefinition[] {
  return Object.values(WORKFLOW_REGISTRY).filter((w) => w.moduleCode === moduleCode);
}

export function getWorkflowStage(formCode: string, stageKey: string): WorkflowStageDefinition | undefined {
  return getWorkflowDefinition(formCode)?.stages.find((s) => s.key === stageKey);
}

export function getNextStage(formCode: string, currentStageKey: string): WorkflowStageDefinition | undefined {
  const workflow = getWorkflowDefinition(formCode);
  if (!workflow) return undefined;
  const idx = workflow.stages.findIndex((s) => s.key === currentStageKey);
  if (idx === -1 || idx >= workflow.stages.length - 1) return undefined;
  return workflow.stages[idx + 1];
}

export function getPreviousStage(formCode: string, currentStageKey: string): WorkflowStageDefinition | undefined {
  const workflow = getWorkflowDefinition(formCode);
  if (!workflow) return undefined;
  const idx = workflow.stages.findIndex((s) => s.key === currentStageKey);
  if (idx <= 0) return undefined;
  return workflow.stages[idx - 1];
}

export function isFinalStage(formCode: string, stageKey: string): boolean {
  const workflow = getWorkflowDefinition(formCode);
  if (!workflow) return false;
  return workflow.stages[workflow.stages.length - 1]?.key === stageKey;
}

export function calculateDueDate(
  formCode: string,
  stageKey: string,
  urgency: UrgencyLevel,
  startDate: Date = new Date(),
): Date {
  const workflow = getWorkflowDefinition(formCode);
  const stage = workflow?.stages.find((s) => s.key === stageKey);
  if (!workflow || !stage) return startDate;

  const multiplier = workflow.urgencySLAMultiplier[urgency] ?? 1;
  const effectiveSLA = Math.max(1, Math.round(stage.slaDays * multiplier));

  const due = new Date(startDate);
  due.setDate(due.getDate() + effectiveSLA);
  return due;
}
