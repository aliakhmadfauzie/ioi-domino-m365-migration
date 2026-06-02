/**
 * Integrated Workflow Hook
 * 
 * Combines workflow engine with notifications and live approver resolution.
 * This is the main hook for components to use for workflow operations.
 */

import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useWorkflowEngine, type WorkflowStage, type WorkflowInstance, type ApprovalAction } from '@/hooks/use-workflow-engine';
import { useWorkflowNotifications, type WorkflowNotificationConfig } from '@/hooks/use-workflow-notifications';
import { useLiveApprovers, type LiveApproverDetails } from '@/hooks/use-live-approvers';
import type { ApproverRoleType } from '@/types/it-approval-workflow';

export interface IntegratedWorkflowConfig {
  formCode: string;
  formId?: string;
  formTitle?: string;
  submitterEmail?: string;
  submitterName?: string;
  siteScope?: string;
}

export interface ApprovalActionWithNotify extends ApprovalAction {
  /** Skip sending notifications */
  skipNotification?: boolean;
  /** Delegate target (for delegation action) */
  delegateTo?: {
    email: string;
    name: string;
  };
  /** Delegation reason */
  delegateReason?: string;
}

interface UseIntegratedWorkflowResult {
  /** Workflow stages */
  stages: WorkflowStage[];
  /** Current workflow instance */
  workflowInstance: WorkflowInstance | null;
  /** Available approvers with live resolution */
  availableApprovers: LiveApproverDetails[];
  /** Suggested approvers per stage */
  suggestedApprovers: {
    stage: WorkflowStage;
    approvers: { approverId: string; approverName: string; approverEmail: string; role: ApproverRoleType }[];
  }[];
  /** Initialize workflow with notifications */
  initializeWorkflow: (params: {
    formId: string;
    formTitle: string;
    submitterName: string;
    submitterEmail: string;
    selectedApprovers: {
      approverId: string;
      approverName: string;
      approverEmail: string;
      role: ApproverRoleType;
    }[];
  }) => Promise<void>;
  /** Process approval action with notifications */
  processApprovalAction: (action: ApprovalActionWithNotify) => Promise<void>;
  /** Delegate approval to another user */
  delegateApproval: (delegateTo: { email: string; name: string }, reason: string) => Promise<void>;
  /** Check and handle escalation */
  checkAndEscalate: () => Promise<boolean>;
  /** Get current approver details */
  getCurrentApprover: () => LiveApproverDetails | undefined;
  /** Get next approvers for current stage */
  getNextApprovers: () => LiveApproverDetails[];
  /** Loading state */
  isLoading: boolean;
  /** Processing state */
  isProcessing: boolean;
  /** Error state */
  error: Error | null;
}

/**
 * Integrated workflow hook that combines engine, notifications, and live approvers
 */
export function useIntegratedWorkflow(config: IntegratedWorkflowConfig): UseIntegratedWorkflowResult {
  const { formCode, formId, formTitle, submitterEmail, submitterName, siteScope } = config;

  // Core workflow engine
  const {
    stages,
    workflowInstance,
    suggestedApprovers: rawSuggestedApprovers,
    initializeWorkflow: baseInitialize,
    processApprovalAction: baseProcess,
    checkEscalation,
    isLoading: engineLoading,
    isProcessing,
    error: engineError,
  } = useWorkflowEngine({ formCode, formId, siteScope });

  // Notifications
  const {
    notifySubmission,
    notifyApproval,
    notifyRejection,
    notifyReturn,
    notifyEscalation,
    notifyDelegation,
  } = useWorkflowNotifications();

  // Live approvers
  const {
    approvers: liveApprovers,
    getApproverByEmail,
    getApproversForStage,
    isLoading: approversLoading,
  } = useLiveApprovers(formCode);

  // Map suggested approvers to the expected format with proper typing
  const suggestedApprovers = useMemo(() => {
    const roleMapping: Record<string, ApproverRoleType> = {
      'Approver': 'Approver',
      'HoD': 'HoD',
      'Manager': 'ITManager',
      'ITAdmin': 'ITAdmin',
      'SecurityOfficer': 'SecurityOfficer',
      'ExecutiveDirector': 'ExecutiveDirector',
    };

    return rawSuggestedApprovers.map((suggestion) => ({
      stage: suggestion.stage,
      approvers: suggestion.approvers.map((a) => ({
        approverId: a.id,
        approverName: a.name,
        approverEmail: a.email,
        role: roleMapping[a.role] || ('Approver' as ApproverRoleType),
      })),
    }));
  }, [rawSuggestedApprovers]);

  // Build notification config
  const buildNotificationConfig = useCallback((): WorkflowNotificationConfig | null => {
    if (!formId || !formTitle) return null;

    const currentStage = stages.find((s: WorkflowStage) => s.key === workflowInstance?.currentStageKey);
    const currentApprover = workflowInstance?.assignedApproverEmail
      ? getApproverByEmail(workflowInstance.assignedApproverEmail)
      : undefined;

    const roleMapping: Record<string, ApproverRoleType> = {
      'Approver': 'Approver',
      'HoD': 'HoD',
      'Manager': 'ITManager',
      'ITAdmin': 'ITAdmin',
      'SecurityOfficer': 'SecurityOfficer',
      'ExecutiveDirector': 'ExecutiveDirector',
    };

    return {
      formcode: formCode,
      formId,
      formTitle,
      submitter: {
        email: submitterEmail || '',
        name: submitterName || 'Submitter',
      },
      currentStage: {
        key: currentStage?.key || 'stage_1',
        name: currentStage?.name || 'Initial',
        order: currentStage?.order || 1,
      },
      currentApprover: currentApprover ? {
        id: currentApprover.id,
        email: currentApprover.email,
        name: currentApprover.name,
        role: (currentApprover.role && roleMapping[currentApprover.role]) || 'Approver',
      } : undefined,
      site: siteScope,
    };
  }, [formCode, formId, formTitle, submitterEmail, submitterName, siteScope, stages, workflowInstance, getApproverByEmail]);

  // Initialize workflow with notifications
  const initializeWorkflow = useCallback(async (params: {
    formId: string;
    formTitle: string;
    submitterName: string;
    submitterEmail: string;
    selectedApprovers: {
      approverId: string;
      approverName: string;
      approverEmail: string;
      role: ApproverRoleType;
    }[];
  }) => {
    const roleMapping: Record<ApproverRoleType, 'Approver' | 'HoD' | 'Manager'> = {
      'Submitter': 'Approver',
      'Approver': 'Approver',
      'HoD': 'HoD',
      'DivisionHead': 'HoD',
      'ITManager': 'Manager',
      'ITAdmin': 'Approver',
      'ITSupport': 'Approver',
      'ExecutiveDirector': 'Manager',
      'GeneralManager': 'Manager',
      'SystemOwner': 'Approver',
      'SecurityOfficer': 'Approver',
      'HRManager': 'Manager',
      'FinanceManager': 'Manager',
      'System': 'Approver',
    };
    // Initialize the base workflow
    await baseInitialize({
      formId: params.formId,
      submitterName: params.submitterName,
      submitterEmail: params.submitterEmail,
      selectedApprovers: params.selectedApprovers.map((a) => ({
        ...a,
        role: roleMapping[a.role] || 'Approver',
      })),
    });

    // Send submission notifications
    const firstApprover = params.selectedApprovers[0];
    const notificationConfig: WorkflowNotificationConfig = {
      formcode: formCode,
      formId: params.formId,
      formTitle: params.formTitle,
      submitter: {
        email: params.submitterEmail,
        name: params.submitterName,
      },
      currentStage: {
        key: 'stage_1',
        name: stages[0]?.name || 'Initial Approval',
        order: 1,
      },
      currentApprover: firstApprover ? {
        id: firstApprover.approverId,
        email: firstApprover.approverEmail,
        name: firstApprover.approverName,
        role: firstApprover.role,
      } : undefined,
      site: siteScope,
    };

    await notifySubmission(notificationConfig);
    toast.success('Request submitted and notifications sent');
  }, [baseInitialize, formCode, stages, siteScope, notifySubmission]);

  // Process approval action with notifications
  const processApprovalAction = useCallback(async (action: ApprovalActionWithNotify) => {
    // Process the action
    await baseProcess(action);

    // Send notifications unless skipped
    if (!action.skipNotification) {
      const notificationConfig = buildNotificationConfig();
      if (notificationConfig) {
        switch (action.action) {
          case 'approve':
            await notifyApproval(notificationConfig, action.comments);
            toast.success('Approved and notifications sent');
            break;
          case 'reject':
            await notifyRejection(notificationConfig, action.comments || 'Rejected');
            toast.info('Rejected and submitter notified');
            break;
          case 'return':
            await notifyReturn(notificationConfig, action.comments || 'Please revise');
            toast.info('Returned for revision');
            break;
          case 'escalate': {
            const currentStageIndex = stages.findIndex((s: WorkflowStage) => s.key === workflowInstance?.currentStageKey);
            const escalationApprovers = getApproversForStage(formCode, `stage_${currentStageIndex + 2}`);
            if (escalationApprovers.length > 0) {
              const escalateTo = escalationApprovers[0];
              await notifyEscalation(notificationConfig, {
                email: escalateTo.email,
                name: escalateTo.name,
              });
            }
            toast.warning('Escalated to higher authority');
            break;
          }
        }
      }
    }
  }, [baseProcess, buildNotificationConfig, notifyApproval, notifyRejection, notifyReturn, notifyEscalation, stages, workflowInstance, getApproversForStage, formCode]);

  // Delegate approval
  const delegateApproval = useCallback(async (
    delegateTo: { email: string; name: string },
    reason: string
  ) => {
    const notificationConfig = buildNotificationConfig();
    if (!notificationConfig) {
      throw new Error('Cannot delegate without active workflow');
    }

    await notifyDelegation(notificationConfig, delegateTo, reason);
    toast.success(`Delegated to ${delegateTo.name}`);
  }, [buildNotificationConfig, notifyDelegation]);

  // Check and handle escalation
  const checkAndEscalate = useCallback(async (): Promise<boolean> => {
    const escalationInfo = await checkEscalation();
    
    if (escalationInfo?.needsEscalation) {
      const notificationConfig = buildNotificationConfig();
      if (notificationConfig) {
        const currentStageIndex = stages.findIndex((s: WorkflowStage) => s.key === workflowInstance?.currentStageKey);
        const escalationApprovers = getApproversForStage(formCode, `stage_${currentStageIndex + 2}`);
        
        if (escalationApprovers.length > 0) {
          const escalateTo = escalationApprovers[0];
          await notifyEscalation(notificationConfig, {
            email: escalateTo.email,
            name: escalateTo.name,
          });
          return true;
        }
      }
    }
    return false;
  }, [checkEscalation, buildNotificationConfig, stages, workflowInstance, getApproversForStage, formCode, notifyEscalation]);

  // Get current approver with live details
  const getCurrentApprover = useCallback((): LiveApproverDetails | undefined => {
    if (!workflowInstance?.assignedApproverEmail) return undefined;
    return getApproverByEmail(workflowInstance.assignedApproverEmail);
  }, [workflowInstance, getApproverByEmail]);

  // Get next stage approvers
  const getNextApprovers = useCallback((): LiveApproverDetails[] => {
    if (!workflowInstance) return [];
    const currentStageIndex = stages.findIndex((s: WorkflowStage) => s.key === workflowInstance.currentStageKey);
    const nextStage = stages[currentStageIndex + 1];
    if (!nextStage) return [];
    return getApproversForStage(formCode, nextStage.key, siteScope);
  }, [workflowInstance, stages, formCode, siteScope, getApproversForStage]);

  return {
    stages,
    workflowInstance,
    availableApprovers: liveApprovers,
    suggestedApprovers,
    initializeWorkflow,
    processApprovalAction,
    delegateApproval,
    checkAndEscalate,
    getCurrentApprover,
    getNextApprovers,
    isLoading: engineLoading || approversLoading,
    isProcessing,
    error: engineError,
  };
}
