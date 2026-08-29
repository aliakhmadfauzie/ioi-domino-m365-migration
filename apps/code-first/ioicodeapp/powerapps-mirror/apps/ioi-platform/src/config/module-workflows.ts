/**
 * Module Workflow Configurations
 *
 * Maps Domino state machines from IT_Routing_Rules_Documentation.md
 * to the existing useWorkflowEngine infrastructure.
 *
 * Each module defines:
 *  - stages: Ordered list of workflow stages
 *  - transitions: Valid state-to-state transitions
 *  - terminalStates: States that end the workflow
 *  - emailRouting: Notification rules per transition
 *  - actors: Which role/group performs each action
 */

import type { WorkflowStage } from '@/hooks/use-workflow-engine';

// =============================================================================
// TYPES
// =============================================================================

export interface StageTransition {
  from: string;
  to: string;
  action: string;
  actorRole: string;       // Role/group that can perform this action
  requiresComment: boolean;
  validateFields?: string[];
  emailSubject?: string;
}

export interface EmailRoute {
  to: string[];      // Field references that resolve to email addresses
  cc?: string[];
  bcc?: string[];
}

export interface StageEmailRouting {
  [transitionName: string]: EmailRoute;
}

export interface ModuleWorkflowConfig {
  code: string;                       // FormCode
  name: string;                       // Display name
  stateField: string;                 // Domino state field (CurrentAction, CA, txtHDocStatus, etc.)
  initialStageKey: string;            // Starting state
  terminalStageKeys: string[];        // Terminal/completed states
  stages: WorkflowStage[];
  transitions: StageTransition[];
  emailRouting?: StageEmailRouting;
  reminderConfig?: {
    stageKey: string;
    scheduleDays: number;
    sendToField: string;
    ccField?: string;
  }[];
}

// =============================================================================
// EAF — External Access Form / VPN & Citrix
// =============================================================================

export const EAF_WORKFLOW: ModuleWorkflowConfig = {
  code: 'EAF',
  name: 'External Access Form (VPN & Citrix)',
  stateField: 'CurrentAction',
  initialStageKey: 'Request',
  terminalStageKeys: ['Closed', 'Rejected1', 'Rejected2', 'Denied'],

  stages: [
    { key: 'Request', name: 'Draft', order: 0, actor: 'Requestor', approverRole: 'Approver', escalationDays: 0, isActive: true },
    { key: 'Submitted', name: 'Pending HOD', order: 1, actor: 'Dept Head', approverRole: 'HoD', escalationDays: 3, isActive: true, description: 'Awaiting department head approval' },
    { key: 'Acceptance1', name: 'Pending COO/ED', order: 2, actor: 'COO/ED', approverRole: 'Manager', escalationDays: 3, isActive: true, description: 'Awaiting COO or Executive Director approval', isConditional: true },
    { key: 'Acceptance2', name: 'Pending IT Manager', order: 3, actor: 'IT Manager', approverRole: 'Manager', escalationDays: 3, isActive: true, description: 'Awaiting IT Manager approval' },
    { key: 'Done', name: 'Pending IT Staff', order: 4, actor: 'IT Staff', approverRole: 'Approver', escalationDays: 3, isActive: true, description: 'Awaiting IT provisioning' },
    { key: 'Closed', name: 'Completed', order: 5, actor: 'System', approverRole: 'Approver', escalationDays: 0, isActive: false, description: 'Access provisioned and closed' },
  ],

  transitions: [
    { from: 'Request', to: 'Submitted', action: 'send_approval', actorRole: 'Requestor', requiresComment: false, validateFields: ['Application', 'TargetUser', 'Justification'] },
    { from: 'Submitted', to: 'Acceptance1', action: 'hod_approve', actorRole: 'DeptHead', requiresComment: false },
    { from: 'Submitted', to: 'Rejected1', action: 'hod_reject', actorRole: 'DeptHead', requiresComment: true },
    { from: 'Acceptance1', to: 'Acceptance2', action: 'coo_approve', actorRole: 'COO', requiresComment: false },
    { from: 'Acceptance1', to: 'Rejected2', action: 'coo_reject', actorRole: 'COO', requiresComment: true },
    { from: 'Acceptance2', to: 'Done', action: 'itmgr_accept', actorRole: 'ITManager', requiresComment: false },
    { from: 'Acceptance2', to: 'Rejected', action: 'itmgr_deny', actorRole: 'ITManager', requiresComment: true },
    { from: 'Done', to: 'Closed', action: 'it_complete', actorRole: 'ITStaff', requiresComment: false, validateFields: ['ITConfigStatus'] },
    { from: 'Done', to: 'Denied', action: 'it_reject', actorRole: 'ITStaff', requiresComment: true },
  ],

  emailRouting: {
    send_approval: { to: ['depthead'], cc: ['CC', 'IsMgr'] },
    hod_approve: { to: ['HApp'] },
    hod_reject: { to: ['requestor'] },
    coo_approve: { to: ['IsMgr'] },
    coo_reject: { to: ['SendTo'] },
    itmgr_accept: { to: ['ITPIC'] },
    it_complete: { to: ['requestor'], cc: ['depthead', 'ITPIC2'], bcc: ['IsMgr'] },
    it_reject: { to: ['requestor'] },
  },

  reminderConfig: [
    { stageKey: 'Submitted', scheduleDays: 3, sendToField: 'depthead', ccField: 'requestor' },
    { stageKey: 'Acceptance1', scheduleDays: 3, sendToField: 'HApp', ccField: 'requestor' },
    { stageKey: 'Acceptance2', scheduleDays: 3, sendToField: 'IsMgr', ccField: 'requestor' },
    { stageKey: 'Done', scheduleDays: 3, sendToField: 'ITPIC', ccField: 'requestor' },
  ],
};

// =============================================================================
// ITSSR — IT Support & Service Request
// =============================================================================

export const ITSSR_WORKFLOW: ModuleWorkflowConfig = {
  code: 'ITSSR',
  name: 'IT Support & Service Request',
  stateField: 'CA',
  initialStageKey: 'Request',
  terminalStageKeys: ['Accepted', 'Denied'],

  stages: [
    { key: 'Request', name: 'Draft', order: 0, actor: 'Requestor', approverRole: 'Approver', escalationDays: 0, isActive: true },
    { key: 'Submitted', name: 'Pending IT', order: 1, actor: 'IT Team', approverRole: 'Approver', escalationDays: 2, isActive: true, description: 'Awaiting IT action' },
    { key: 'Notified', name: 'Pending Acceptance', order: 2, actor: 'Requestor', approverRole: 'Approver', escalationDays: 3, isActive: true, description: 'Awaiting requestor acceptance of resolution' },
    { key: 'Accepted', name: 'Completed', order: 3, actor: 'System', approverRole: 'Approver', escalationDays: 0, isActive: false, description: 'Resolution accepted, ticket closed' },
  ],

  transitions: [
    { from: 'Request', to: 'Submitted', action: 'submit', actorRole: 'Requestor', requiresComment: false, validateFields: ['Type', 'ProblemDesc'] },
    { from: 'Submitted', to: 'Notified', action: 'complete', actorRole: 'ITTeam', requiresComment: false, validateFields: ['Solution', 'StartDate'] },
    { from: 'Submitted', to: 'Submitted', action: 'pending', actorRole: 'ITTeam', requiresComment: true, emailSubject: 'ITSSR - Pending: CaseNo' },
    { from: 'Submitted', to: 'Denied', action: 'reject', actorRole: 'ITTeam', requiresComment: true },
    { from: 'Notified', to: 'Accepted', action: 'accept', actorRole: 'Requestor', requiresComment: false, validateFields: ['SatisfactionRating'] },
    { from: 'Notified', to: 'Submitted', action: 'reject_acceptance', actorRole: 'Requestor', requiresComment: true },
  ],
};

// =============================================================================
// NIR — Notes ID Request
// =============================================================================

export const NIR_WORKFLOW: ModuleWorkflowConfig = {
  code: 'NIR',
  name: 'Notes ID Request',
  stateField: 'CA',
  initialStageKey: 'Request',
  terminalStageKeys: ['ISGHODRejected', 'Completed', 'HODRejected'],

  stages: [
    { key: 'Request', name: 'Draft', order: 0, actor: 'Requestor', approverRole: 'Approver', escalationDays: 0, isActive: true },
    { key: 'Submitted', name: 'Pending ISG HOD', order: 1, actor: 'ISG HOD', approverRole: 'HoD', escalationDays: 3, isActive: true, description: 'Awaiting ISG HOD approval' },
    { key: 'ISGHODApproved', name: 'Pending PIC/IT', order: 2, actor: 'PIC', approverRole: 'Approver', escalationDays: 2, isActive: true, description: 'IT processing in progress' },
    { key: 'Done', name: 'Pending HWG Config', order: 3, actor: 'HWG', approverRole: 'Approver', escalationDays: 2, isActive: true, description: 'Awaiting hardware group configuration', isConditional: true },
    { key: 'Completed', name: 'Done', order: 4, actor: 'System', approverRole: 'Approver', escalationDays: 0, isActive: false, description: 'ID created and configured' },
  ],

  transitions: [
    { from: 'Request', to: 'Submitted', action: 'send_to_isg', actorRole: 'Requestor', requiresComment: false, validateFields: ['EmailType', 'Company', 'Department', 'Designation'] },
    { from: 'Submitted', to: 'ISGHODApproved', action: 'hod_approve', actorRole: 'ISGHOD', requiresComment: false },
    { from: 'Submitted', to: 'ISGHODRejected', action: 'hod_reject', actorRole: 'ISGHOD', requiresComment: true },
    { from: 'ISGHODApproved', to: 'Done', action: 'pic_complete', actorRole: 'PIC', requiresComment: false, validateFields: ['PICTask'] },
    { from: 'Done', to: 'Completed', action: 'hwg_complete', actorRole: 'HWG', requiresComment: false },
    { from: 'Done', to: 'HODRejected', action: 'admin_reset', actorRole: 'Admin', requiresComment: true },
  ],

  reminderConfig: [
    { stageKey: 'Submitted', scheduleDays: 3, sendToField: 'HOD', ccField: 'requestor' },
    { stageKey: 'Done', scheduleDays: 3, sendToField: 'HWG', ccField: 'requestor' },
  ],
};

// =============================================================================
// RS — Reset Password / Unlock ID
// =============================================================================

export const RS_WORKFLOW: ModuleWorkflowConfig = {
  code: 'RS',
  name: 'Reset Password / Unlock ID',
  stateField: 'CurrentAction',
  initialStageKey: 'Request',
  terminalStageKeys: ['Completed', 'Rejected'],

  stages: [
    { key: 'Request', name: 'Draft', order: 0, actor: 'Requestor', approverRole: 'Approver', escalationDays: 0, isActive: true, description: 'Initial request' },
    { key: 'Submitted', name: 'Pending IT', order: 1, actor: 'IT Staff', approverRole: 'Approver', escalationDays: 1, isActive: true, description: 'Awaiting IT processing' },
    { key: 'Completed', name: 'Reset Done', order: 2, actor: 'System', approverRole: 'Approver', escalationDays: 0, isActive: false, description: 'Password reset completed' },
    // ED Approval: conditional stage for BANK type — after IT marks Reset Done, ED must confirm
    { key: 'EDApproval', name: 'Pending ED Confirmation', order: 3, actor: 'Executive Director', approverRole: 'Approver', escalationDays: 2, isActive: true, description: 'ED confirmation required for BANK type resets', isConditional: true },
  ],

  transitions: [
    { from: 'Request', to: 'Submitted', action: 'send_request', actorRole: 'Requestor', requiresComment: false },
    // Non-BANK: IT completes directly to terminal Completed
    { from: 'Submitted', to: 'Completed', action: 'reset_done', actorRole: 'ITStaff', requiresComment: false },
    // BANK: IT completes to EDApproval stage (ED must sign off)
    { from: 'Submitted', to: 'EDApproval', action: 'reset_done_bank', actorRole: 'ITStaff', requiresComment: false },
    { from: 'Submitted', to: 'Rejected', action: 'reject', actorRole: 'ITStaff', requiresComment: true },
    // ED confirms (BANK only)
    { from: 'EDApproval', to: 'Completed', action: 'ed_confirm', actorRole: 'ExecutiveDirector', requiresComment: false },
    { from: 'EDApproval', to: 'Rejected', action: 'ed_reject', actorRole: 'ExecutiveDirector', requiresComment: true },
  ],

  emailRouting: {
    send_request:    { to: ['rSAssignedPICEmail'] },                    // → IT PIC (resolved & stored at form submission)
    reset_done:      { to: ['rSTargetUserEmail'], cc: ['rSAssignedPICEmail'] },  // → requestor + IT PIC (non-BANK)
    reset_done_bank: { to: ['rSExecutiveDirectorEmail', 'rSAssignedPICEmail'] }, // → ED + IT PIC (BANK)
    reject:          { to: ['rSTargetUserEmail'], cc: ['rSAssignedPICEmail'] },  // → requestor + IT PIC
    ed_confirm:      { to: ['rSTargetUserEmail'] },                     // → requestor (ED done)
    ed_reject:       { to: ['rSTargetUserEmail'] },                     // → requestor (ED rejected)
  },

  reminderConfig: [
    { stageKey: 'Submitted', scheduleDays: 1, sendToField: 'rSAssignedPICEmail', ccField: 'rSTargetUserEmail' },
    { stageKey: 'EDApproval', scheduleDays: 2, sendToField: 'rSExecutiveDirectorEmail', ccField: 'rSTargetUserEmail' },
  ],
};

// =============================================================================
// PRF — Program Request Form
// =============================================================================

export const PRF_WORKFLOW: ModuleWorkflowConfig = {
  code: 'PRF',
  name: 'Program Request Form',
  stateField: 'CurrentAction',
  initialStageKey: 'Request',
  terminalStageKeys: ['Rejected', 'Closed'],

  stages: [
    { key: 'Request', name: 'Draft', order: 0, actor: 'Requestor', approverRole: 'Approver', escalationDays: 0, isActive: true },
    { key: 'Submitted', name: 'Pending Dept Head', order: 1, actor: 'Dept Manager', approverRole: 'HoD', escalationDays: 3, isActive: true, description: 'Awaiting department head approval' },
    { key: 'Acceptance1', name: 'Pending IT Task Assign', order: 2, actor: 'IT Manager', approverRole: 'Manager', escalationDays: 3, isActive: true, description: 'IT task assignment' },
    { key: 'Acceptance', name: 'Pending Functional Spec', order: 3, actor: 'IT Staff', approverRole: 'Approver', escalationDays: 5, isActive: true, description: 'Functional spec submission (SAP only)', isConditional: true },
    { key: 'Submitted_SAP', name: 'Pending IT Mgr II', order: 4, actor: 'IT Manager', approverRole: 'Manager', escalationDays: 3, isActive: true, description: 'IT Manager II assignment (SAP only)', isConditional: true },
    { key: 'Acceptance2', name: 'Pending IT Completion', order: 5, actor: 'IT Staff', approverRole: 'Approver', escalationDays: 5, isActive: true, description: 'IT development completion' },
    { key: 'Completed-SAP', name: 'Pending ISG Notification', order: 6, actor: 'IT Staff', approverRole: 'Approver', escalationDays: 3, isActive: true, description: 'Final ISG notification (SAP only)', isConditional: true },
    { key: 'Closed', name: 'Pending Acceptance', order: 7, actor: 'Requestor', approverRole: 'Approver', escalationDays: 5, isActive: true, description: 'Awaiting requestor acceptance' },
  ],

  transitions: [
    { from: 'Request', to: 'Submitted', action: 'send_approval', actorRole: 'Requestor', requiresComment: false, validateFields: ['deptmanager', 'system', 'type', 'site', 'Objective'] },
    { from: 'Submitted', to: 'Acceptance1', action: 'depthead_approve', actorRole: 'DeptManager', requiresComment: false },
    { from: 'Submitted', to: 'Rejected', action: 'depthead_reject', actorRole: 'DeptManager', requiresComment: true },
    { from: 'Acceptance1', to: 'Acceptance2', action: 'tasks_assign', actorRole: 'ITManager', requiresComment: false, validateFields: ['isg', 'status2'] },
    { from: 'Acceptance1', to: 'Acceptance', action: 'tasks_assign_sap', actorRole: 'ITManager', requiresComment: false },
    { from: 'Acceptance', to: 'Submitted_SAP', action: 'submit_func_spec', actorRole: 'ITStaff', requiresComment: false },
    { from: 'Submitted_SAP', to: 'Acceptance3', action: 'tasks_assign_ii', actorRole: 'ITManager', requiresComment: false },
    { from: 'Acceptance2', to: 'Closed', action: 'notify_requestor', actorRole: 'ITStaff', requiresComment: false },
    { from: 'Acceptance3', to: 'Completed-SAP', action: 'notify_requestor_sap', actorRole: 'ITStaff', requiresComment: false },
    { from: 'Completed-SAP', to: 'Closed', action: 'notify_requestor_sap_final', actorRole: 'ITStaff', requiresComment: false },
    { from: 'Closed', to: 'Closed', action: 'accepted_by_requestor', actorRole: 'Requestor', requiresComment: false, validateFields: ['Rating'] },
  ],

  reminderConfig: [
    { stageKey: 'Submitted', scheduleDays: 3, sendToField: 'deptmanager', ccField: 'NotesOwner' },
    { stageKey: 'Acceptance1', scheduleDays: 3, sendToField: 'isg' },
    { stageKey: 'Acceptance2', scheduleDays: 5, sendToField: 'isg' },
    { stageKey: 'Closed', scheduleDays: 5, sendToField: 'NotesOwner', ccField: 'deptmanager' },
  ],
};

// =============================================================================
// SFAR — Share Folder Access Requisition
// =============================================================================

export const SFAR_WORKFLOW: ModuleWorkflowConfig = {
  code: 'SFAR',
  name: 'Share Folder Access Requisition',
  stateField: 'CA',
  initialStageKey: 'Request',
  terminalStageKeys: ['DONE', 'DENY', 'Denied', 'OwnerRejected', 'HODRejected'],

  stages: [
    { key: 'Request', name: 'Draft', order: 0, actor: 'Requestor', approverRole: 'Approver', escalationDays: 0, isActive: true },
    { key: 'Submitted', name: 'Pending Owner/HOD', order: 1, actor: 'Owner/HOD', approverRole: 'HoD', escalationDays: 3, isActive: true, description: 'Awaiting folder owner or HOD approval' },
    { key: 'OwnerApproved', name: 'Pending HOD', order: 2, actor: 'HOD', approverRole: 'HoD', escalationDays: 3, isActive: true, description: 'Awaiting HOD approval' },
    { key: 'HODApproved', name: 'Pending IT', order: 3, actor: 'IT Staff', approverRole: 'Approver', escalationDays: 3, isActive: true, description: 'IT access provisioning' },
    { key: 'DONE', name: 'Completed', order: 4, actor: 'System', approverRole: 'Approver', escalationDays: 0, isActive: false, description: 'Access granted' },
  ],

  transitions: [
    { from: 'Request', to: 'Submitted', action: 'submit', actorRole: 'Requestor', requiresComment: false },
    { from: 'Submitted', to: 'OwnerApproved', action: 'owner_approve', actorRole: 'Owner', requiresComment: false },
    { from: 'Submitted', to: 'OwnerRejected', action: 'owner_reject', actorRole: 'Owner', requiresComment: true },
    { from: 'OwnerApproved', to: 'HODApproved', action: 'hod_approve', actorRole: 'HOD', requiresComment: false },
    { from: 'OwnerApproved', to: 'HODRejected', action: 'hod_reject', actorRole: 'HOD', requiresComment: true },
    { from: 'HODApproved', to: 'DONE', action: 'isg_done', actorRole: 'ITStaff', requiresComment: false },
    { from: 'HODApproved', to: 'DENY', action: 'isg_deny', actorRole: 'ITStaff', requiresComment: true },
  ],

  reminderConfig: [
    { stageKey: 'Submitted', scheduleDays: 3, sendToField: 'Owner', ccField: 'DocAuthor' },
    { stageKey: 'OwnerApproved', scheduleDays: 3, sendToField: 'HOD', ccField: 'DocAuthor' },
    { stageKey: 'HODApproved', scheduleDays: 3, sendToField: 'PIC', ccField: 'DocAuthor' },
  ],
};

// =============================================================================
// UR — User Registration
// =============================================================================

export const UR_WORKFLOW: ModuleWorkflowConfig = {
  code: 'UR',
  name: 'User Registration',
  stateField: 'CurrentAction',
  initialStageKey: 'Request',
  terminalStageKeys: ['Completed', 'Rejected'],

  stages: [
    { key: 'Request', name: 'Draft', order: 0, actor: 'Requestor', approverRole: 'Approver', escalationDays: 0, isActive: true },
    { key: 'Submitted', name: 'Pending IT Admin', order: 1, actor: 'IT Admin', approverRole: 'Approver', escalationDays: 2, isActive: true, description: 'IT account creation' },
    { key: 'Completed', name: 'Done', order: 2, actor: 'System', approverRole: 'Approver', escalationDays: 0, isActive: false },
  ],

  transitions: [
    { from: 'Request', to: 'Submitted', action: 'submit', actorRole: 'Requestor', requiresComment: false },
    { from: 'Submitted', to: 'Completed', action: 'it_complete', actorRole: 'ITAdmin', requiresComment: false },
    { from: 'Submitted', to: 'Rejected', action: 'reject', actorRole: 'ITAdmin', requiresComment: true },
  ],
};

// =============================================================================
// SAPDR — SAP Disaster Recovery (JHR + PNG)
// =============================================================================

export const SAPDR_WORKFLOW: ModuleWorkflowConfig = {
  code: 'SAPDR',
  name: 'SAP Disaster Recovery Plan',
  stateField: 'CurrentAction',
  initialStageKey: 'Request',
  terminalStageKeys: ['Closed'],

  stages: [
    { key: 'Request', name: 'Draft', order: 0, actor: 'Requestor', approverRole: 'Approver', escalationDays: 0, isActive: true },
    { key: 'Submitted', name: 'Pending IT Reply', order: 1, actor: 'IT Team', approverRole: 'Approver', escalationDays: 3, isActive: true, description: 'Awaiting IT response' },
    { key: 'Responded', name: 'Pending Acceptance', order: 2, actor: 'Requestor', approverRole: 'Approver', escalationDays: 3, isActive: true, description: 'User acceptance of IT response' },
    { key: 'Accepted', name: 'Pending Implementation', order: 3, actor: 'IT Team', approverRole: 'Approver', escalationDays: 5, isActive: true, description: 'Follow-up implementation tracking', isConditional: true },
    { key: 'Closed', name: 'Completed', order: 4, actor: 'System', approverRole: 'Approver', escalationDays: 0, isActive: false },
  ],

  transitions: [
    { from: 'Request', to: 'Submitted', action: 'submit', actorRole: 'Requestor', requiresComment: false, validateFields: ['Plant', 'Dept', 'Recipient'] },
    { from: 'Submitted', to: 'Responded', action: 'reply', actorRole: 'ITTeam', requiresComment: false, validateFields: ['COP', 'Pa', 'Whom'] },
    { from: 'Responded', to: 'Accepted', action: 'accept', actorRole: 'Requestor', requiresComment: false },
    { from: 'Responded', to: 'Submitted', action: 'reject', actorRole: 'Requestor', requiresComment: true },
    { from: 'Accepted', to: 'Closed', action: 'send_implementation', actorRole: 'ITTeam', requiresComment: false },
  ],

  reminderConfig: [
    { stageKey: 'Submitted', scheduleDays: 3, sendToField: 'Recipient1', ccField: 'CC1' },
    { stageKey: 'Responded', scheduleDays: 3, sendToField: 'Requestor1', ccField: 'CC' },
  ],
};

// =============================================================================
// SAPTR — SAP Transport Request
// =============================================================================

export const SAPTR_WORKFLOW: ModuleWorkflowConfig = {
  code: 'SAPTR',
  name: 'SAP Transport Request',
  stateField: 'CurrentAction',
  initialStageKey: 'Request',
  terminalStageKeys: ['Transported', 'TransportedIEP', 'Rejected', 'Withdrawn'],

  stages: [
    { key: 'Request', name: 'Draft', order: 0, actor: 'Requestor', approverRole: 'Approver', escalationDays: 0, isActive: true },
    { key: 'Submitted', name: 'Pending Approval', order: 1, actor: 'First Approver', approverRole: 'HoD', escalationDays: 3, isActive: true, description: 'Awaiting first approval' },
    { key: 'Approved', name: 'Pending Transport (IEQ)', order: 2, actor: 'Transporter', approverRole: 'Approver', escalationDays: 2, isActive: true, description: 'IEQ transport in progress' },
    { key: 'Transported', name: 'Pending IEP Approval', order: 3, actor: 'First Approver', approverRole: 'HoD', escalationDays: 3, isActive: true, description: 'Awaiting IEP approval (dual path only)', isConditional: true },
    { key: 'ApprovedIEP', name: 'Pending Transport (IEP)', order: 4, actor: 'Transporter', approverRole: 'Approver', escalationDays: 2, isActive: true, description: 'IEP transport in progress', isConditional: true },
    { key: 'TransportedIEP', name: 'Completed', order: 5, actor: 'System', approverRole: 'Approver', escalationDays: 0, isActive: false },
  ],

  transitions: [
    { from: 'Request', to: 'Submitted', action: 'send_approval', actorRole: 'Requestor', requiresComment: false },
    { from: 'Submitted', to: 'Approved', action: 'approve', actorRole: 'FirstApprover', requiresComment: false },
    { from: 'Submitted', to: 'Rejected', action: 'reject', actorRole: 'FirstApprover', requiresComment: true },
    { from: 'Approved', to: 'Transported', action: 'transport_done', actorRole: 'Transporter', requiresComment: false },
    { from: 'Approved', to: 'FailedIEQ', action: 'transport_failed', actorRole: 'Transporter', requiresComment: true },
    { from: 'Transported', to: 'SubmittedIEP', action: 'send_iep_approval', actorRole: 'Requestor', requiresComment: false },
    { from: 'SubmittedIEP', to: 'ApprovedIEP', action: 'approve_iep', actorRole: 'FirstApprover', requiresComment: false },
    { from: 'ApprovedIEP', to: 'TransportedIEP', action: 'transport_done_iep', actorRole: 'Transporter', requiresComment: false },
    { from: 'Any', to: 'Withdrawn', action: 'withdraw', actorRole: 'Admin', requiresComment: true },
  ],
};

// =============================================================================
// SAPAMR — SAP Authorisation Matrix Review
// =============================================================================
//
// Domino: AuthMatrixReview.nsf
// States: Request → Submitted → Verified → Approved / Rejected / Withdrawn
//
// Email routing:
//   send_verification → to TBV (verifier)
//   verified          → to TBA (BPO approver)
//   bpo_approve       → to requestor
//   bpo_reject        → to requestor
//   withdraw          → to WTDMail

// NOTE: SAPAMR currently stores form data as JSON in `remarks`. For email routing
// to function, the form submission should populate discrete columns:
//   - sAPAMRTBVEmail    (To Be Verified By — email address)
//   - sAPAMRTBAEmail    (BPO/HOD Approver — email address)
// These will be added when the form is updated to use submitTransform.

export const SAPAMR_WORKFLOW: ModuleWorkflowConfig = {
  code: 'SAPAMR',
  name: 'SAP Authorisation Matrix Review',
  stateField: 'CurrentAction',
  initialStageKey: 'Request',
  terminalStageKeys: ['Approved', 'Rejected', 'Withdrawn'],

  stages: [
    { key: 'Request', name: 'Draft', order: 0, actor: 'Requestor', approverRole: 'Approver', escalationDays: 0, isActive: true, description: 'Initial request' },
    { key: 'Submitted', name: 'Pending Verification', order: 1, actor: 'Key User', approverRole: 'Approver', escalationDays: 3, isActive: true, description: 'Awaiting TBV (Key User) verification' },
    { key: 'Verified', name: 'Pending BPO Approval', order: 2, actor: 'BPO/HOD', approverRole: 'HoD', escalationDays: 3, isActive: true, description: 'Awaiting BPO/HOD approval' },
    // Conditional sub-step: FI modules have TBV_1-5 per-slot verifiers (CA stays Submitted)
    { key: 'Approved', name: 'Approved', order: 3, actor: 'System', approverRole: 'Approver', escalationDays: 0, isActive: false, description: 'Approved — terminal' },
  ],

  transitions: [
    { from: 'Request', to: 'Submitted', action: 'send_verification', actorRole: 'Requestor', requiresComment: false, validateFields: ['Module', 'Plant', 'AuthType'] },
    { from: 'Submitted', to: 'Verified', action: 'verified', actorRole: 'KeyUser', requiresComment: false },
    { from: 'Submitted', to: 'Rejected', action: 'reject', actorRole: 'KeyUser', requiresComment: true },
    { from: 'Verified', to: 'Approved', action: 'bpo_approve', actorRole: 'BPO', requiresComment: false },
    { from: 'Verified', to: 'Rejected', action: 'bpo_reject', actorRole: 'BPO', requiresComment: true },
    // Withdraw from any active state
    { from: 'Any', to: 'Withdrawn', action: 'withdraw', actorRole: 'Requestor', requiresComment: true },
  ],

  emailRouting: {
    send_verification: { to: ['sAPAMRTBVEmail'] },                             // → TBV verifier
    verified:          { to: ['sAPAMRTBAEmail'] },                             // → TBA (BPO/HOD)
    bpo_approve:       { to: ['requestoremail'] },                              // → requestor
    bpo_reject:        { to: ['requestoremail'] },                              // → requestor
    withdraw:          { to: ['sAPAMRTBAEmail'], cc: ['requestoremail'] },      // → TBA + requestor
  },

  reminderConfig: [
    { stageKey: 'Submitted', scheduleDays: 3, sendToField: 'sAPAMRTBVEmail', ccField: 'requestoremail' },
    { stageKey: 'Verified', scheduleDays: 3, sendToField: 'sAPAMRTBAEmail', ccField: 'requestoremail' },
  ],
};

// =============================================================================
// SAPCR — SAP & WB Change Request
// =============================================================================
//
// Domino: SAPChgRequestForm.nsf
// States: Request → Submitted → BPOApp → PMApp → SubmittedDetails → PMAppImp → AppFinal
//         (plus BPORej / PMRej / SubmittedApp as terminals)
//
// Actor fields (from Domino):
//   AEditor1 = DocAuthor (Request state)
//   nmAppBy  = BPO group   (Submitted state)
//   AEditor2 = AxonPM:ACMPM (BPOApp state)
//   AEditor3 = nmAssgTo     (PMApp state — developer)
//   AEditor5 = PM           (SubmittedDetails — PMAppImp states)
//   KhooTC   = hardcoded PD (PMAppImp state)
//
// Email routing:
//   submit             → nmAppBy (BPO)
//   bpo_accept         → AxonPM:ACMPM (PM)
//   bpo_reject         → requestor
//   pm_accept          → nmAssgTo (developer)
//   pm_reject          → requestor
//   dev_submit         → AEditor5 (PM)
//   pm_impact_approve  → KhooTC (Project Director)
//   pd_approve         → requestor

export const SAPCR_WORKFLOW: ModuleWorkflowConfig = {
  code: 'SAPCR',
  name: 'SAP & WB Change Request',
  stateField: 'CurrentAction',
  initialStageKey: 'Request',
  terminalStageKeys: ['BPORej', 'PMRej', 'AppFinal', 'SubmittedApp'],

  stages: [
    { key: 'Request', name: 'Draft', order: 0, actor: 'Requestor', approverRole: 'Approver', escalationDays: 0, isActive: true, description: 'Initial request' },
    { key: 'Submitted', name: 'Pending BPO Approval', order: 1, actor: 'BPO', approverRole: 'HoD', escalationDays: 3, isActive: true, description: 'Awaiting BPO approval' },
    { key: 'BPOApp', name: 'Pending PM Approval', order: 2, actor: 'Project Manager', approverRole: 'Manager', escalationDays: 3, isActive: true, description: 'Awaiting PM approval for investigation' },
    { key: 'PMApp', name: 'Pending Developer Investigation', order: 3, actor: 'Developer', approverRole: 'Approver', escalationDays: 5, isActive: true, description: 'Developer investigates and submits for impact analysis' },
    { key: 'SubmittedDetails', name: 'Pending PM Impact Analysis', order: 4, actor: 'Project Manager', approverRole: 'Manager', escalationDays: 3, isActive: true, description: 'PM impact analysis' },
    { key: 'PMAppImp', name: 'Pending Project Director Approval', order: 5, actor: 'Executive Director', approverRole: 'ExecutiveDirector' as 'Manager' | 'Approver' | 'HoD', escalationDays: 3, isActive: true, description: 'Awaiting Project Director final sign-off' },
    { key: 'AppFinal', name: 'Approved — Completed', order: 6, actor: 'System', approverRole: 'Approver', escalationDays: 0, isActive: false, description: 'Change request completed' },
  ],

  transitions: [
    { from: 'Request', to: 'Submitted', action: 'submit', actorRole: 'Requestor', requiresComment: false, validateFields: ['Division', 'System', 'ChangeDescription'] },
    { from: 'Submitted', to: 'BPOApp', action: 'bpo_accept', actorRole: 'BPO', requiresComment: false },
    { from: 'Submitted', to: 'BPORej', action: 'bpo_reject', actorRole: 'BPO', requiresComment: true },
    { from: 'BPOApp', to: 'PMApp', action: 'pm_accept', actorRole: 'ProjectManager', requiresComment: false },
    { from: 'BPOApp', to: 'PMRej', action: 'pm_reject', actorRole: 'ProjectManager', requiresComment: true },
    { from: 'PMApp', to: 'SubmittedDetails', action: 'dev_submit', actorRole: 'Developer', requiresComment: false, validateFields: ['TechnicalSpecification', 'TestPlan', 'RollbackPlan'] },
    { from: 'SubmittedDetails', to: 'PMAppImp', action: 'pm_impact_approve', actorRole: 'ProjectManager', requiresComment: false },
    // Hidden 'Send for Approval' button — same role as PM impact
    { from: 'SubmittedDetails', to: 'SubmittedApp', action: 'pm_send_resolved', actorRole: 'ProjectManager', requiresComment: true },
    { from: 'PMAppImp', to: 'AppFinal', action: 'pd_approve', actorRole: 'ExecutiveDirector', requiresComment: false },
  ],

  emailRouting: {
    submit:            { to: ['sAPCRBPOEmail'] },                                   // → BPO
    bpo_accept:        { to: ['sAPCRPMEmail'] },                                    // → PM
    bpo_reject:        { to: ['requestoremail'] },                                  // → requestor
    pm_accept:         { to: ['sAPCRDeveloperEmail'] },                             // → developer
    pm_reject:         { to: ['requestoremail'] },                                  // → requestor
    dev_submit:        { to: ['sAPCRPMEmail'] },                                    // → PM (impact analysis)
    pm_impact_approve: { to: ['sAPCRDirectorEmail'] },                              // → Project Director
    pd_approve:        { to: ['requestoremail'] },                                  // → requestor
    pm_send_resolved:  { to: ['requestoremail'] },                                  // → requestor (resolved)
  },

  reminderConfig: [
    { stageKey: 'Submitted', scheduleDays: 2, sendToField: 'sAPCRBPOEmail', ccField: 'requestoremail' },
    { stageKey: 'BPOApp', scheduleDays: 3, sendToField: 'sAPCRPMEmail', ccField: 'requestoremail' },
    { stageKey: 'PMApp', scheduleDays: 5, sendToField: 'sAPCRDeveloperEmail', ccField: 'requestoremail' },
    { stageKey: 'SubmittedDetails', scheduleDays: 3, sendToField: 'sAPCRPMEmail', ccField: 'requestoremail' },
    { stageKey: 'PMAppImp', scheduleDays: 3, sendToField: 'sAPCRDirectorEmail', ccField: 'requestoremail' },
  ],
};

// =============================================================================
// MODULE WORKFLOW REGISTRY
// =============================================================================

export const MODULE_WORKFLOWS: Record<string, ModuleWorkflowConfig> = {
  EAF: EAF_WORKFLOW,
  ITSSR: ITSSR_WORKFLOW,
  NIR: NIR_WORKFLOW,
  RS: RS_WORKFLOW,
  PRF: PRF_WORKFLOW,
  SFAR: SFAR_WORKFLOW,
  UR: UR_WORKFLOW,
  SAPAMR: SAPAMR_WORKFLOW,
  SAPCR: SAPCR_WORKFLOW,
  SAPDR: SAPDR_WORKFLOW,
  SAPTR: SAPTR_WORKFLOW,
};

/**
 * Get the workflow config for a given form code.
 */
export function getModuleWorkflow(formCode: string): ModuleWorkflowConfig | undefined {
  return MODULE_WORKFLOWS[formCode];
}

/**
 * Get a valid transition for a given current state and action.
 */
export function getTransition(
  workflow: ModuleWorkflowConfig,
  fromState: string,
  action: string
): StageTransition | undefined {
  return workflow.transitions.find(
    (t) => t.from === fromState && t.action === action
  );
}

/**
 * Get the next stage after performing a transition.
 */
export function getNextStageKey(
  workflow: ModuleWorkflowConfig,
  transition: StageTransition
): string {
  return transition.to;
}

/**
 * Check if a state is terminal.
 */
export function isTerminalState(workflow: ModuleWorkflowConfig, stateKey: string): boolean {
  return workflow.terminalStageKeys.includes(stateKey);
}
