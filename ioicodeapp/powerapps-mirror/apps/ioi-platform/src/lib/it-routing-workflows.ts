/**
 * IT Routing Workflows - Detailed Workflow Definitions
 * 
 * Provides workflow state machines for each IT form type:
 * - VPNACCESS: MultiStageApproval with HOD → DivHead → IT Manager → IT Implementation
 * - ITEVT: CRUDRegistry pattern with Active → IT Action → Closed
 * - SRVACCESS: CRUDRegistry pattern for server records
 * - DATAREST: SimpleApproval with direct IT action
 * - SAPCA: SequentialApproval with BASIS team coordination
 */

import type { ITWorkflowStatus, ITWorkflowActor, ITWorkflowStage, WorkflowPattern } from './it-routing-config';

// Workflow Transition Definition
export interface WorkflowTransition {
  from: ITWorkflowStatus;
  to: ITWorkflowStatus;
  action: 'approve' | 'reject' | 'submit' | 'withdraw' | 'complete' | 'escalate' | 'reassign';
  allowedActors: ITWorkflowActor[];
  requiresComment: boolean;
  validationRules?: string[];
}

// Complete Workflow Definition
export interface ITWorkflowDefinition {
  formCode: string;
  pattern: WorkflowPattern;
  initialStatus: ITWorkflowStatus;
  terminalStatuses: ITWorkflowStatus[];
  stages: ITWorkflowStage[];
  transitions: WorkflowTransition[];
}

// VPNACCESS Workflow - MultiStageApproval
export const VPNAccessWorkflow: ITWorkflowDefinition = {
  formCode: 'VPNACCESS',
  pattern: 'MultiStageApproval',
  initialStatus: 'Draft',
  terminalStatuses: ['Closed', 'Rejected', 'Withdrawn'],
  stages: [
    {
      stageId: 1,
      stageName: 'Draft',
      status: 'Draft',
      description: 'Request initiated by requestor',
      actor: 'Requestor',
      nextStage: 'PendingHOD',
    },
    {
      stageId: 2,
      stageName: 'HOD Approval',
      status: 'PendingHOD',
      description: 'Awaiting Head of Department approval',
      actor: 'HoD',
      nextStage: 'PendingDivHead',
      slaHours: 24,
      commentRequired: true,
    },
    {
      stageId: 3,
      stageName: 'Division Head Approval',
      status: 'PendingDivHead',
      description: 'Awaiting Division Head approval',
      actor: 'DivisionHead',
      nextStage: 'PendingITManager',
      slaHours: 24,
      commentRequired: true,
    },
    {
      stageId: 4,
      stageName: 'IT Manager Approval',
      status: 'PendingITManager',
      description: 'Awaiting IT Manager technical review',
      actor: 'IT_MANAGER',
      nextStage: 'PendingIT',
      slaHours: 24,
      commentRequired: true,
    },
    {
      stageId: 5,
      stageName: 'IT Implementation',
      status: 'PendingIT',
      description: 'IT team implementing access',
      actor: 'IT_ADMIN',
      nextStage: 'PendingITConfig',
      slaHours: 48,
    },
    {
      stageId: 6,
      stageName: 'IT Configuration',
      status: 'PendingITConfig',
      description: 'Final configuration and verification',
      actor: 'IT_ADMIN',
      nextStage: 'Closed',
      slaHours: 24,
    },
    {
      stageId: 7,
      stageName: 'Completed',
      status: 'Closed',
      description: 'Access provisioned successfully',
      actor: 'System',
    },
  ],
  transitions: [
    // Draft → Submit
    {
      from: 'Draft',
      to: 'PendingHOD',
      action: 'submit',
      allowedActors: ['Requestor'],
      requiresComment: false,
      validationRules: ['RequiredFields', 'JustificationValidation'],
    },
    // HOD Review
    {
      from: 'PendingHOD',
      to: 'PendingDivHead',
      action: 'approve',
      allowedActors: ['HoD'],
      requiresComment: true,
    },
    {
      from: 'PendingHOD',
      to: 'Rejected',
      action: 'reject',
      allowedActors: ['HoD'],
      requiresComment: true,
    },
    // Division Head Review
    {
      from: 'PendingDivHead',
      to: 'PendingITManager',
      action: 'approve',
      allowedActors: ['DivisionHead'],
      requiresComment: true,
    },
    {
      from: 'PendingDivHead',
      to: 'Rejected',
      action: 'reject',
      allowedActors: ['DivisionHead'],
      requiresComment: true,
    },
    // IT Manager Review
    {
      from: 'PendingITManager',
      to: 'PendingIT',
      action: 'approve',
      allowedActors: ['IT_MANAGER'],
      requiresComment: true,
    },
    {
      from: 'PendingITManager',
      to: 'Rejected',
      action: 'reject',
      allowedActors: ['IT_MANAGER'],
      requiresComment: true,
    },
    // IT Implementation
    {
      from: 'PendingIT',
      to: 'PendingITConfig',
      action: 'complete',
      allowedActors: ['IT_ADMIN'],
      requiresComment: false,
    },
    // IT Configuration
    {
      from: 'PendingITConfig',
      to: 'Closed',
      action: 'complete',
      allowedActors: ['IT_ADMIN'],
      requiresComment: false,
    },
    // Withdrawal (can withdraw from any pending state)
    {
      from: 'PendingHOD',
      to: 'Withdrawn',
      action: 'withdraw',
      allowedActors: ['Requestor'],
      requiresComment: true,
    },
    {
      from: 'PendingDivHead',
      to: 'Withdrawn',
      action: 'withdraw',
      allowedActors: ['Requestor'],
      requiresComment: true,
    },
    {
      from: 'PendingITManager',
      to: 'Withdrawn',
      action: 'withdraw',
      allowedActors: ['Requestor'],
      requiresComment: true,
    },
  ],
};

// ITEVT Workflow - CRUDRegistry
export const ITEventWorkflow: ITWorkflowDefinition = {
  formCode: 'ITEVT',
  pattern: 'CRUDRegistry',
  initialStatus: 'Active',
  terminalStatuses: ['Closed'],
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
      description: 'IT Admin processing event',
      actor: 'IT_ADMIN',
      nextStage: 'Closed',
      slaHours: 72,
    },
    {
      stageId: 3,
      stageName: 'Closed',
      status: 'Closed',
      description: 'Event resolved',
      actor: 'System',
    },
  ],
  transitions: [
    {
      from: 'Active',
      to: 'PendingITAction',
      action: 'submit',
      allowedActors: ['IT_ADMIN', 'IS_ADMIN'],
      requiresComment: false,
    },
    {
      from: 'PendingITAction',
      to: 'Closed',
      action: 'complete',
      allowedActors: ['IT_ADMIN', 'IS_ADMIN'],
      requiresComment: false,
    },
  ],
};

// SRVACCESS Workflow - CRUDRegistry
export const ServerRecordsWorkflow: ITWorkflowDefinition = {
  formCode: 'SRVACCESS',
  pattern: 'CRUDRegistry',
  initialStatus: 'Active',
  terminalStatuses: ['Closed'],
  stages: [
    {
      stageId: 1,
      stageName: 'Active',
      status: 'Active',
      description: 'Server record active',
      actor: 'IT_ADMIN',
      nextStage: 'PendingITAction',
    },
    {
      stageId: 2,
      stageName: 'IT Action',
      status: 'PendingITAction',
      description: 'IT Admin processing request',
      actor: 'IT_ADMIN',
      nextStage: 'Closed',
      slaHours: 48,
    },
    {
      stageId: 3,
      stageName: 'Closed',
      status: 'Closed',
      description: 'Record closed',
      actor: 'System',
    },
  ],
  transitions: [
    {
      from: 'Active',
      to: 'PendingITAction',
      action: 'submit',
      allowedActors: ['IT_ADMIN', 'IS_ADMIN'],
      requiresComment: false,
    },
    {
      from: 'PendingITAction',
      to: 'Closed',
      action: 'complete',
      allowedActors: ['IT_ADMIN', 'IS_ADMIN'],
      requiresComment: false,
    },
  ],
};

// DATAREST Workflow - SimpleApproval
export const DataRestorationWorkflow: ITWorkflowDefinition = {
  formCode: 'DATAREST',
  pattern: 'SimpleApproval',
  initialStatus: 'Submitted',
  terminalStatuses: ['Closed', 'Rejected'],
  stages: [
    {
      stageId: 1,
      stageName: 'Submitted',
      status: 'Submitted',
      description: 'Restoration request submitted',
      actor: 'Requestor',
      nextStage: 'PendingITAction',
    },
    {
      stageId: 2,
      stageName: 'IT Action',
      status: 'PendingITAction',
      description: 'Backup Administrator processing',
      actor: 'Backup_Administrator',
      nextStage: 'Closed',
      slaHours: 48,
    },
    {
      stageId: 3,
      stageName: 'Completed',
      status: 'Closed',
      description: 'Data restoration complete',
      actor: 'System',
    },
  ],
  transitions: [
    {
      from: 'Submitted',
      to: 'PendingITAction',
      action: 'approve',
      allowedActors: ['Backup_Administrator', 'IT_ADMIN'],
      requiresComment: false,
    },
    {
      from: 'PendingITAction',
      to: 'Closed',
      action: 'complete',
      allowedActors: ['Backup_Administrator', 'IT_ADMIN'],
      requiresComment: false,
    },
    {
      from: 'Submitted',
      to: 'Rejected',
      action: 'reject',
      allowedActors: ['Backup_Administrator', 'IT_ADMIN'],
      requiresComment: true,
    },
  ],
};

// SAPCA Workflow - SequentialApproval
export const SAPConfigAccessWorkflow: ITWorkflowDefinition = {
  formCode: 'SAPCA',
  pattern: 'SequentialApproval',
  initialStatus: 'Request',
  terminalStatuses: ['Rejected', 'Reject - Closed', 'Withdrawn', 'Completed'],
  stages: [
    {
      stageId: 1,
      stageName: 'Request Draft',
      status: 'Request',
      description: 'Requestor prepares SAP config access request',
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
      description: 'BASIS opens config access or rejects the request',
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
      description: 'BASIS confirms closure',
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
  transitions: [
    {
      from: 'Request',
      to: 'Submitted',
      action: 'submit',
      allowedActors: ['Editor1', 'DocAuthor'],
      requiresComment: false,
    },
    {
      from: 'Submitted',
      to: 'Approved',
      action: 'approve',
      allowedActors: ['Editor1a', 'ITAPP'],
      requiresComment: true,
    },
    {
      from: 'Submitted',
      to: 'Rejected',
      action: 'reject',
      allowedActors: ['Editor1a', 'ITAPP'],
      requiresComment: true,
    },
    {
      from: 'Submitted',
      to: 'Withdrawn',
      action: 'withdraw',
      allowedActors: ['DocAuthor', 'Requestor'],
      requiresComment: true,
    },
    {
      from: 'Approved',
      to: 'ConfigAccess-Done',
      action: 'complete',
      allowedActors: ['Editor2', 'Transporter'],
      requiresComment: true,
      validationRules: ['ConfigStatus=Config Opened'],
    },
    {
      from: 'Approved',
      to: 'Reject - Closed',
      action: 'reject',
      allowedActors: ['Editor2', 'Transporter'],
      requiresComment: true,
      validationRules: ['ConfigStatus=Rejected'],
    },
    {
      from: 'ConfigAccess-Done',
      to: 'Submitted-Closure',
      action: 'submit',
      allowedActors: ['Editor3', 'DocAuthor', 'ITPIC'],
      requiresComment: false,
    },
    {
      from: 'Submitted-Closure',
      to: 'Completed',
      action: 'complete',
      allowedActors: ['Editor4', 'Transporter'],
      requiresComment: false,
    },
  ],
};

// Map of all workflows
export const ITWorkflows: Record<string, ITWorkflowDefinition> = {
  'VPNACCESS': VPNAccessWorkflow,
  'ITEVT': ITEventWorkflow,
  'SRVACCESS': ServerRecordsWorkflow,
  'DATAREST': DataRestorationWorkflow,
  'SAPCA': SAPConfigAccessWorkflow,
};

// Get workflow by form code
export function getWorkflow(formCode: string): ITWorkflowDefinition | undefined {
  return ITWorkflows[formCode.toUpperCase()];
}

// Get available transitions for current status
export function getAvailableTransitions(
  formCode: string,
  currentStatus: ITWorkflowStatus,
  currentActor: ITWorkflowActor
): WorkflowTransition[] {
  const workflow = getWorkflow(formCode);
  if (!workflow) return [];
  
  return workflow.transitions.filter(
    (t) => t.from === currentStatus && t.allowedActors.includes(currentActor)
  );
}

// Validate transition
export function validateTransition(
  formCode: string,
  fromStatus: ITWorkflowStatus,
  toStatus: ITWorkflowStatus,
  actor: ITWorkflowActor
): { valid: boolean; error?: string } {
  const workflow = getWorkflow(formCode);
  if (!workflow) {
    return { valid: false, error: 'Workflow not found' };
  }
  
  const transition = workflow.transitions.find(
    (t) => t.from === fromStatus && t.to === toStatus
  );
  
  if (!transition) {
    return { valid: false, error: 'Invalid transition' };
  }
  
  if (!transition.allowedActors.includes(actor)) {
    return { valid: false, error: 'Actor not authorized for this transition' };
  }
  
  return { valid: true };
}

// Check if status is terminal
export function isTerminalStatus(formCode: string, status: ITWorkflowStatus): boolean {
  const workflow = getWorkflow(formCode);
  if (!workflow) return false;
  return workflow.terminalStatuses.includes(status);
}

// Get stage progress percentage
export function getStageProgress(formCode: string, status: ITWorkflowStatus): number {
  const workflow = getWorkflow(formCode);
  if (!workflow) return 0;
  
  const currentStage = workflow.stages.find((s) => s.status === status);
  if (!currentStage) return 0;
  
  const totalStages = workflow.stages.length;
  return Math.round((currentStage.stageId / totalStages) * 100);
}

export default ITWorkflows;
