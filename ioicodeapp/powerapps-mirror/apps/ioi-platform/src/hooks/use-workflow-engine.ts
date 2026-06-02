import { useMemo, useCallback } from 'react';
import { useApprovalRecordsList, useCreateApprovalRecords, useUpdateApprovalRecords } from '@/generated/hooks/use-approval-records';
import { useFormApprovers, useApprovalMatrix, useSiteRouting, useUserRolePermissions, type ApproverInfo } from '@/hooks/use-approver-matrix';
import type { ApprovalRecords } from '@/generated/models/approval-records-model';
import { getModuleWorkflow, type ModuleWorkflowConfig } from '@/config/module-workflows';

export interface WorkflowStage {
  key: string;
  name: string;
  order: number;
  actor: string;
  approverRole: 'Approver' | 'HoD' | 'Manager';
  approverGroupId?: string;
  escalationDays: number;
  isActive: boolean;
  siteScope?: string;
  description?: string;
  isConditional?: boolean;
}

export interface WorkflowInstance {
  formId: string;
  formCode: string;
  currentStageKey: string;
  currentStageNumber: number;
  status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'returned' | 'escalated';
  assignedApproverId?: string;
  assignedApproverName?: string;
  assignedApproverEmail?: string;
  escalationDueDate?: Date;
  isEscalated: boolean;
  approvalChain: {
    approverId: string;
    approverName: string;
    approverEmail: string;
    role: 'Approver' | 'HoD' | 'Manager';
    stageKey: string;
    stageName: string;
    action?: 'approved' | 'rejected' | 'returned' | 'escalated' | 'pending';
    actionDate?: Date;
    comments?: string;
  }[];
}

export interface ApprovalAction {
  action: 'approve' | 'reject' | 'return' | 'escalate';
  comments?: string;
  nextApproverId?: string;
  attachments?: string[];
}

interface UseWorkflowEngineOptions {
  formCode: string;
  formId?: string;
  siteScope?: string;
}

interface UseWorkflowEngineResult {
  stages: WorkflowStage[];
  workflowInstance: WorkflowInstance | null;
  approvalHistory: ApprovalRecords[];
  suggestedApprovers: {
    stage: WorkflowStage;
    approvers: ApproverInfo[];
  }[];
  initializeWorkflow: (params: {
    formId: string;
    submitterName: string;
    submitterEmail: string;
    selectedApprovers: {
      approverId: string;
      approverName: string;
      approverEmail: string;
      role: 'Approver' | 'HoD' | 'Manager';
    }[];
  }) => Promise<void>;
  processApprovalAction: (action: ApprovalAction) => Promise<void>;
  checkEscalation: () => Promise<{ needsEscalation: boolean; overdueDays: number } | null>;
  isLoading: boolean;
  isProcessing: boolean;
  error: Error | null;
}

// Default 3-stage workflow
const defaultStages: WorkflowStage[] = [
  {
    key: 'stage_1',
    name: 'Initial Approval',
    order: 1,
    actor: 'Approver',
    approverRole: 'Approver',
    escalationDays: 3,
    isActive: true,
    description: 'First-level review by assigned approver',
  },
  {
    key: 'stage_2',
    name: 'Head of Department Review',
    order: 2,
    actor: 'Head of Department',
    approverRole: 'HoD',
    escalationDays: 5,
    isActive: true,
    description: 'Department head approval',
  },
  {
    key: 'stage_3',
    name: 'Management Approval',
    order: 3,
    actor: 'Manager',
    approverRole: 'Manager',
    escalationDays: 7,
    isActive: true,
    description: 'Final management sign-off',
  },
];

export function useWorkflowEngine(options: UseWorkflowEngineOptions): UseWorkflowEngineResult {
  const { formCode, formId } = options;

  // Fetch approval records for this form instance
  const {
    data: approvalData,
    isLoading: isLoadingApprovals,
    error: approvalsError
  } = useApprovalRecordsList(
    formId ? { filter: `formid eq '${formId}'` } : undefined
  );

  // Get approvers from ConfigApproverMatrix
  const { approvers, hods, managers, isLoading: isLoadingApprovers } = useFormApprovers(formCode);

  // Mutations
  const createApprovalRecord = useCreateApprovalRecords();
  const updateApprovalRecord = useUpdateApprovalRecords();

  // Use form-specific workflow config if available, otherwise fall back to default stages
  const moduleWorkflow = useMemo(() => formCode ? getModuleWorkflow(formCode) : undefined, [formCode]);
  const stages: WorkflowStage[] = moduleWorkflow?.stages ?? defaultStages;

  // Parse approval history
  const approvalHistory = useMemo((): ApprovalRecords[] => {
    const rawData = approvalData as { value?: ApprovalRecords[] } | ApprovalRecords[] | undefined;
    const approvalList = Array.isArray(rawData) ? rawData : rawData?.value;

    return (approvalList || []).sort((a: ApprovalRecords, b: ApprovalRecords) => {
      const dateA = a.actiondate ? new Date(a.actiondate).getTime() : 0;
      const dateB = b.actiondate ? new Date(b.actiondate).getTime() : 0;
      return dateA - dateB;
    });
  }, [approvalData]);

  // Build current workflow instance
  const workflowInstance = useMemo((): WorkflowInstance | null => {
    if (!formId) return null;

    const latestAction = approvalHistory[approvalHistory.length - 1];

    const completedStageKeys = approvalHistory
      .filter((a: ApprovalRecords) => a.actionKey === 'ActionKey0')
      .map((a: ApprovalRecords) => {
        const stageNum = a.stagenumber || 1;
        return stages[stageNum - 1]?.key || `stage_${stageNum}`;
      });

    let currentStageIndex = 0;
    for (let i = 0; i < stages.length; i++) {
      if (!completedStageKeys.includes(stages[i].key)) {
        currentStageIndex = i;
        break;
      }
    }

    const isEscalated = approvalHistory.some(
      (a: ApprovalRecords) => a.comments?.toLowerCase().includes('escalated')
    );

    const currentStage = stages[currentStageIndex];
    const stageStartDate = latestAction?.actiondate
      ? new Date(latestAction.actiondate)
      : new Date();
    const escalationDueDate = new Date(stageStartDate);
    escalationDueDate.setDate(escalationDueDate.getDate() + (currentStage?.escalationDays || 3));

    const approvalChain = approvalHistory.map((record: ApprovalRecords) => {
      const stageNum = record.stagenumber || 1;
      const stage = stages[stageNum - 1];

      let action: 'approved' | 'rejected' | 'returned' | 'escalated' | 'pending' = 'pending';
      switch (record.actionKey) {
        case 'ActionKey0': action = 'approved'; break;
        case 'ActionKey1': action = 'rejected'; break;
        case 'ActionKey2': action = 'returned'; break;
        case 'ActionKey3': action = 'pending'; break;
        default: action = 'pending';
      }

      if (record.comments?.toLowerCase().includes('escalated')) {
        action = 'escalated';
      }

      return {
        approverId: record.actionbyid || '',
        approverName: record.actionbyname || 'Unknown',
        approverEmail: '',
        role: stage?.approverRole || 'Approver',
        stageKey: stage?.key || `stage_${stageNum}`,
        stageName: stage?.name || record.stagename,
        action,
        actionDate: record.actiondate ? new Date(record.actiondate) : undefined,
        comments: record.comments,
      };
    });

    let status: WorkflowInstance['status'] = 'pending';
    if (approvalHistory.some((a: ApprovalRecords) => a.actionKey === 'ActionKey1')) {
      status = 'rejected';
    } else if (approvalHistory.some((a: ApprovalRecords) => a.actionKey === 'ActionKey2')) {
      status = 'returned';
    } else if (isEscalated) {
      status = 'escalated';
    } else if (completedStageKeys.length >= stages.length) {
      status = 'approved';
    } else if (completedStageKeys.length > 0) {
      status = 'in_progress';
    }

    return {
      formId,
      formCode,
      currentStageKey: currentStage?.key || 'stage_1',
      currentStageNumber: currentStageIndex + 1,
      status,
      assignedApproverId: latestAction?.actionbyid,
      assignedApproverName: latestAction?.actionbyname,
      escalationDueDate,
      isEscalated,
      approvalChain,
    };
  }, [formId, formCode, stages, approvalHistory]);

  // Suggested approvers for each stage
  const suggestedApprovers = useMemo(() => {
    return stages.map((stage: WorkflowStage) => {
      let stageApprovers: ApproverInfo[] = [];

      switch (stage.approverRole) {
        case 'Approver':
          stageApprovers = approvers;
          break;
        case 'HoD':
          stageApprovers = hods;
          break;
        case 'Manager':
          stageApprovers = managers;
          break;
      }

      return {
        stage,
        approvers: stageApprovers,
      };
    });
  }, [stages, approvers, hods, managers]);

  // Initialize workflow for a new submission
  const initializeWorkflow = useCallback(async (params: {
    formId: string;
    submitterName: string;
    submitterEmail: string;
    selectedApprovers: {
      approverId: string;
      approverName: string;
      approverEmail: string;
      role: 'Approver' | 'HoD' | 'Manager';
    }[];
  }) => {
    const { formId: newFormId, submitterName, selectedApprovers } = params;

    // Create initial submission record
    await createApprovalRecord.mutateAsync({
      stagename: 'Submission',
      formid: newFormId,
      formcode: formCode,
      actionbyid: params.submitterEmail,
      actionbyname: submitterName,
      actiondate: new Date().toISOString(),
      actionKey: 'ActionKey3',
      stagenumber: 0,
      nextstage: stages[0]?.key || 'stage_1',
      comments: `Submitted by ${submitterName}. Approval chain: ${selectedApprovers.map(a => `${a.approverName} (${a.role})`).join(' → ')}`,
    });

    // Create first stage pending record
    const firstApprover = selectedApprovers.find(a => a.role === 'Approver') || selectedApprovers[0];
    if (firstApprover) {
      await createApprovalRecord.mutateAsync({
        stagename: stages[0]?.name || 'Initial Approval',
        formid: newFormId,
        formcode: formCode,
        actionbyid: firstApprover.approverId,
        actionbyname: firstApprover.approverName,
        actiondate: new Date().toISOString(),
        actionKey: 'ActionKey3',
        stagenumber: 1,
        nextstage: stages[1]?.key,
        comments: `Pending approval from ${firstApprover.approverName}`,
      });
    }
  }, [formCode, stages, createApprovalRecord]);

  // Process approval action
  const processApprovalAction = useCallback(async (action: ApprovalAction) => {
    if (!workflowInstance || !formId) {
      throw new Error('No active workflow instance');
    }

    const currentStageIndex = stages.findIndex(s => s.key === workflowInstance.currentStageKey);
    const currentStage = stages[currentStageIndex];
    const nextStage = stages[currentStageIndex + 1];

    let actionKey: 'ActionKey0' | 'ActionKey1' | 'ActionKey2' | 'ActionKey3' | 'ActionKey4';

    switch (action.action) {
      case 'approve':
        actionKey = 'ActionKey0';
        break;
      case 'reject':
        actionKey = 'ActionKey1';
        break;
      case 'return':
        actionKey = 'ActionKey2';
        break;
      case 'escalate':
        actionKey = 'ActionKey0';
        break;
      default:
        actionKey = 'ActionKey3';
    }

    // Create approval record for this action
    await createApprovalRecord.mutateAsync({
      stagename: currentStage?.name || 'Unknown Stage',
      formid: formId,
      formcode: formCode,
      actionbyid: workflowInstance.assignedApproverId,
      actionbyname: workflowInstance.assignedApproverName,
      actiondate: new Date().toISOString(),
      actionKey,
      stagenumber: workflowInstance.currentStageNumber,
      nextstage: action.action === 'approve' ? nextStage?.key : undefined,
      comments: action.action === 'escalate'
        ? `ESCALATED: ${action.comments || 'Escalated due to timeline'}`
        : action.comments,
    });

    // Create next stage pending record if approved and there's a next stage
    if (action.action === 'approve' && nextStage) {
      const nextApprovers = suggestedApprovers.find(s => s.stage.key === nextStage.key)?.approvers;
      const nextApprover = action.nextApproverId
        ? nextApprovers?.find(a => a.id === action.nextApproverId)
        : nextApprovers?.[0];

      if (nextApprover) {
        await createApprovalRecord.mutateAsync({
          stagename: nextStage.name,
          formid: formId,
          formcode: formCode,
          actionbyid: nextApprover.id,
          actionbyname: nextApprover.name,
          actiondate: new Date().toISOString(),
          actionKey: 'ActionKey3',
          stagenumber: currentStageIndex + 2,
          comments: `Pending approval from ${nextApprover.name}`,
        });
      }
    } else if (action.action === 'approve' && !nextStage) {
      // Final approval - mark as completed
      await createApprovalRecord.mutateAsync({
        stagename: 'Completed',
        formid: formId,
        formcode: formCode,
        actiondate: new Date().toISOString(),
        actionKey: 'ActionKey4',
        stagenumber: stages.length + 1,
        comments: 'All approvals completed',
      });
    }
  }, [formId, formCode, workflowInstance, stages, suggestedApprovers, createApprovalRecord]);

  // Check if current stage needs escalation
  const checkEscalation = useCallback(async () => {
    if (!workflowInstance) return null;

    const now = new Date();
    const dueDate = workflowInstance.escalationDueDate;

    if (!dueDate) return null;

    const overdueDays = Math.floor(
      (now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      needsEscalation: overdueDays > 0,
      overdueDays: Math.max(0, overdueDays),
    };
  }, [workflowInstance]);

  return {
    stages,
    workflowInstance,
    approvalHistory,
    suggestedApprovers,
    initializeWorkflow,
    processApprovalAction,
    checkEscalation,
    isLoading: isLoadingApprovals || isLoadingApprovers,
    isProcessing: createApprovalRecord.isPending || updateApprovalRecord.isPending,
    error: approvalsError as Error | null,
  };
}

// Export types for use in components
export type { ApproverInfo };
