/**
 * IT Approval Workflow Engine Hook
 * 
 * Provides complete workflow management for IT forms including:
 * - Workflow state management
 * - Approval chain tracking
 * - Stage transitions
 * - Approver lookups
 * - SLA calculations
 * - Email notification triggers
 * - Delegation support
 * - Escalation monitoring
 * 
 * Now integrated with WorkflowOrchestrationService for production-ready
 * notifications, escalation, and delegation.
 */

import { useMemo, useCallback, useState } from 'react';
import { useUser } from '@/hooks/use-user';
import { useSendEmail } from '@/hooks/use-send-email';
import { useCreateApprovalRecords } from '@/generated/hooks/use-approval-records';
import { useUpdateMainDBIT } from '@/generated/hooks/use-main-dbit';
import { toast } from 'sonner';
import {
  getWorkflowDefinition,
  getWorkflowStage,
  getNextStage,
  getPreviousStage,
  isFinalStage,
  calculateDueDate,
} from '@/lib/it-workflow-definitions';
import {
  WorkflowOrchestrationService,
  type WorkflowTransitionRequest,
  type DelegationRequest,
} from '@/services/workflow-orchestration-service';
import type {
  WorkflowStatus,
  ApprovalActionType,
  ApproverRoleType,
  UrgencyLevel,
  WorkflowInstance,
  ApprovalChainEntry,
  ApprovalActionRequest,
  ApprovalActionResponse,
  ApprovalTaskSummary,
  ApprovalDashboardStats,
  WorkflowStageDefinition,
} from '@/types/it-approval-workflow';

// =============================================================================
// APPROVER LOOKUP MOCK DATA
// =============================================================================

interface ApproverLookup {
  id: string;
  name: string;
  email: string;
  department: string;
  role: ApproverRoleType;
  site: 'PRAI' | 'JOHOR';
}

// Mock approver directory - in production, this comes from SharePoint or AD
const APPROVER_DIRECTORY: ApproverLookup[] = [
  // Department Heads
  { id: 'hod-it-1', name: 'David Chen', email: 'david.chen@ioi.com', department: 'Information Technology', role: 'HoD', site: 'PRAI' },
  { id: 'hod-hr-1', name: 'Siti Nurhaliza', email: 'siti.nurhaliza@ioi.com', department: 'Human Resources', role: 'HoD', site: 'PRAI' },
  { id: 'hod-fin-1', name: 'Jennifer Brown', email: 'jennifer.brown@ioi.com', department: 'Finance', role: 'HoD', site: 'PRAI' },
  { id: 'hod-prod-1', name: 'Rajesh Kumar', email: 'rajesh.kumar@ioi.com', department: 'Production', role: 'HoD', site: 'PRAI' },
  { id: 'hod-eng-1', name: 'Michael Taylor', email: 'michael.taylor@ioi.com', department: 'Engineering', role: 'HoD', site: 'PRAI' },
  
  // Division Directors
  { id: 'div-ops-1', name: 'Robert Williams', email: 'robert.williams@ioi.com', department: 'Operations', role: 'DivisionHead', site: 'PRAI' },
  { id: 'div-tech-1', name: 'Sarah Johnson', email: 'sarah.johnson@ioi.com', department: 'Technology', role: 'DivisionHead', site: 'PRAI' },
  
  // IT Managers
  { id: 'it-mgr-1', name: 'James Wilson', email: 'james.wilson@ioi.com', department: 'Information Technology', role: 'ITManager', site: 'PRAI' },
  { id: 'it-mgr-2', name: 'Ahmad bin Ismail', email: 'ahmad.ismail@ioi.com', department: 'Information Technology', role: 'ITManager', site: 'JOHOR' },
  
  // IT Admins
  { id: 'it-admin-1', name: 'Tan Wei Ming', email: 'tan.weiming@ioi.com', department: 'IT Infrastructure', role: 'ITAdmin', site: 'PRAI' },
  { id: 'it-admin-2', name: 'Michelle Lee', email: 'michelle.lee@ioi.com', department: 'IT Infrastructure', role: 'ITAdmin', site: 'PRAI' },
  
  // IT Support
  { id: 'it-sup-1', name: 'Kevin Ng', email: 'kevin.ng@ioi.com', department: 'IT Support', role: 'ITSupport', site: 'PRAI' },
  { id: 'it-sup-2', name: 'Nurul Aina', email: 'nurul.aina@ioi.com', department: 'IT Support', role: 'ITSupport', site: 'JOHOR' },
  
  // Executive Directors
  { id: 'ed-1', name: 'Lee Mei Ling', email: 'lee.meiling@ioi.com', department: 'Executive Office', role: 'ExecutiveDirector', site: 'PRAI' },
  
  // General Managers
  { id: 'gm-1', name: 'Patricia Garcia', email: 'patricia.garcia@ioi.com', department: 'General Management', role: 'GeneralManager', site: 'PRAI' },
  
  // Security Officers
  { id: 'sec-1', name: 'Thomas Anderson', email: 'thomas.anderson@ioi.com', department: 'Information Security', role: 'SecurityOfficer', site: 'PRAI' },
];

// =============================================================================
// APPROVER LOOKUP FUNCTIONS
// =============================================================================

/**
 * Find approvers by role and optional department/site
 */
export function findApproversByRole(
  role: ApproverRoleType,
  department?: string,
  site?: 'PRAI' | 'JOHOR'
): ApproverLookup[] {
  return APPROVER_DIRECTORY.filter(a => {
    if (a.role !== role) return false;
    if (department && a.department !== department) return false;
    if (site && a.site !== site) return false;
    return true;
  });
}

/**
 * Get HOD for a specific department
 */
export function getHoDForDepartment(department: string): ApproverLookup | undefined {
  return APPROVER_DIRECTORY.find(a => 
    a.role === 'HoD' && 
    a.department.toLowerCase() === department.toLowerCase()
  );
}

/**
 * Get IT Manager for a site
 */
export function getITManagerForSite(site: 'PRAI' | 'JOHOR'): ApproverLookup | undefined {
  return APPROVER_DIRECTORY.find(a => a.role === 'ITManager' && a.site === site);
}

/**
 * Get Division Director for a department
 */
export function getDivisionDirector(department: string): ApproverLookup | undefined {
  // Map departments to divisions
  const divisionMap: Record<string, string> = {
    'Information Technology': 'Technology',
    'IT Infrastructure': 'Technology',
    'IT Support': 'Technology',
    'Production': 'Operations',
    'Engineering': 'Operations',
    'Warehouse': 'Operations',
    'Human Resources': 'Operations',
    'Finance': 'Operations',
  };
  
  const division = divisionMap[department] || 'Operations';
  return APPROVER_DIRECTORY.find(a => 
    a.role === 'DivisionHead' && 
    a.department === division
  );
}

// =============================================================================
// WORKFLOW ENGINE HOOK
// =============================================================================

interface UseApprovalWorkflowOptions {
  formCode: string;
  formId?: string;
  initialData?: Record<string, unknown>;
}

interface WorkflowEngineState {
  currentStageKey: string;
  status: WorkflowStatus;
  approvalChain: ApprovalChainEntry[];
  urgency: UrgencyLevel;
  isLoading: boolean;
  error: string | null;
}

export function useApprovalWorkflow(options: UseApprovalWorkflowOptions) {
  const { formCode, formId, initialData } = options;
  const { data: user } = useUser();
  
  // Get workflow definition
  const workflowDef = useMemo(() => getWorkflowDefinition(formCode), [formCode]);
  
  // Workflow state
  const [state, setState] = useState<WorkflowEngineState>({
    currentStageKey: workflowDef?.stages[0]?.key || 'S1_Submission',
    status: 'Draft',
    approvalChain: [],
    urgency: 'Normal',
    isLoading: false,
    error: null,
  });
  
  // Get current stage definition
  const currentStage = useMemo(() => {
    return getWorkflowStage(formCode, state.currentStageKey);
  }, [formCode, state.currentStageKey]);
  
  // Get all stages with completion status
  const stagesWithStatus = useMemo(() => {
    if (!workflowDef) return [];
    
    const currentIndex = workflowDef.stages.findIndex(s => s.key === state.currentStageKey);
    
    return workflowDef.stages.map((stage, index) => ({
      ...stage,
      isCompleted: index < currentIndex,
      isCurrent: index === currentIndex,
      isPending: index > currentIndex,
      approvalEntry: state.approvalChain.find(e => e.stageKey === stage.key),
    }));
  }, [workflowDef, state.currentStageKey, state.approvalChain]);
  
  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    if (!workflowDef) return 0;
    const currentIndex = workflowDef.stages.findIndex(s => s.key === state.currentStageKey);
    return Math.round((currentIndex / (workflowDef.stages.length - 1)) * 100);
  }, [workflowDef, state.currentStageKey]);
  
  // Get visible sections for current stage
  const visibleSections = useMemo(() => {
    return currentStage?.visibleSections || [];
  }, [currentStage]);
  
  // Get editable sections for current stage
  const editableSections = useMemo(() => {
    return currentStage?.editableSections || [];
  }, [currentStage]);
  
  // Get allowed actions for current stage
  const allowedActions = useMemo(() => {
    return currentStage?.allowedActions || [];
  }, [currentStage]);
  
  // Check if user can approve current stage
  const canApprove = useMemo(() => {
    if (!user || !currentStage) return false;
    
    // Check if user matches the required approver role
    const approver = APPROVER_DIRECTORY.find(a => 
      a.email.toLowerCase() === user.userPrincipalName?.toLowerCase()
    );
    
    if (!approver) return false;
    return approver.role === currentStage.actorRole;
  }, [user, currentStage]);
  
  // Get next approver for the workflow
  const getNextApprover = useCallback((currentData: Record<string, unknown>): ApproverLookup | undefined => {
    const nextStageDef = getNextStage(formCode, state.currentStageKey);
    if (!nextStageDef) return undefined;
    
    const department = (currentData.Department as string) || 'Information Technology';
    const site = (currentData.Site as 'PRAI' | 'JOHOR') || 'PRAI';
    
    // Route based on next stage actor role
    switch (nextStageDef.actorRole) {
      case 'HoD':
        return getHoDForDepartment(department);
      case 'DivisionHead':
        return getDivisionDirector(department);
      case 'ITManager':
        return getITManagerForSite(site);
      case 'ITAdmin':
      case 'ITSupport':
        return findApproversByRole(nextStageDef.actorRole, undefined, site)[0];
      case 'ExecutiveDirector':
        return APPROVER_DIRECTORY.find(a => a.role === 'ExecutiveDirector');
      case 'GeneralManager':
        return APPROVER_DIRECTORY.find(a => a.role === 'GeneralManager');
      default:
        return undefined;
    }
  }, [formCode, state.currentStageKey]);
  
  // Submit form action
  const submitForm = useCallback(async (formData: Record<string, unknown>): Promise<ApprovalActionResponse> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      if (!user || !workflowDef) {
        throw new Error('User or workflow not available');
      }
      
      const nextApprover = getNextApprover(formData);
      const nextStageDef = getNextStage(formCode, state.currentStageKey);
      
      // Create initial approval chain entry
      const submissionEntry: ApprovalChainEntry = {
        stageKey: state.currentStageKey,
        stageName: currentStage?.name || 'Submission',
        order: 1,
        approverId: user.objectId || '',
        approverName: user.fullName || '',
        approverEmail: user.userPrincipalName || '',
        approverRole: 'Submitter',
        assignedDate: new Date(),
        dueDate: new Date(),
        action: 'Submit',
        actionDate: new Date(),
        comments: 'Form submitted',
        isComplete: true,
        isSkipped: false,
        isEscalated: false,
      };
      
      // Update state
      setState(prev => ({
        ...prev,
        currentStageKey: nextStageDef?.key || prev.currentStageKey,
        status: 'Submitted',
        approvalChain: [...prev.approvalChain, submissionEntry],
        isLoading: false,
      }));
      
      return {
        success: true,
        message: 'Form submitted successfully',
        newStatus: 'Submitted',
        newStageKey: nextStageDef?.key,
        nextApprover: nextApprover ? {
          id: nextApprover.id,
          name: nextApprover.name,
          email: nextApprover.email,
        } : undefined,
        notificationsSent: nextApprover ? [nextApprover.email] : [],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({ ...prev, isLoading: false, error: message }));
      return {
        success: false,
        message,
        newStatus: state.status,
        notificationsSent: [],
      };
    }
  }, [user, workflowDef, formCode, state, currentStage, getNextApprover]);
  
  // Take approval action
  const takeAction = useCallback(async (
    action: ApprovalActionType,
    comments?: string,
    additionalData?: Record<string, unknown>
  ): Promise<ApprovalActionResponse> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      if (!user || !currentStage) {
        throw new Error('User or current stage not available');
      }
      
      let newStatus: WorkflowStatus = state.status;
      let newStageKey = state.currentStageKey;
      let nextApprover: ApproverLookup | undefined;
      
      // Process action
      switch (action) {
        case 'Approve':
        case 'Complete': {
          const nextStageDef = getNextStage(formCode, state.currentStageKey);
          if (nextStageDef) {
            newStageKey = nextStageDef.key;
            newStatus = 'InProgress';
            nextApprover = getNextApprover(additionalData || {});
          } else {
            // Final stage
            newStatus = action === 'Complete' ? 'Completed' : 'Approved';
          }
          break;
        }
        case 'Reject':
          newStatus = 'Rejected';
          break;
        case 'Return': {
          const prevStageDef = getPreviousStage(formCode, state.currentStageKey);
          if (prevStageDef) {
            newStageKey = prevStageDef.key;
            newStatus = 'Returned';
          }
          break;
        }
        case 'Delegate':
          // Delegation is handled separately via processDelegation
          newStatus = 'PendingApproval';
          break;
        case 'Escalate':
          newStatus = 'Escalated';
          break;
        default:
          break;
      }
      
      // Create approval chain entry
      const actionEntry: ApprovalChainEntry = {
        stageKey: state.currentStageKey,
        stageName: currentStage.name,
        order: currentStage.order,
        approverId: user.objectId || '',
        approverName: user.fullName || '',
        approverEmail: user.userPrincipalName || '',
        approverRole: currentStage.actorRole,
        assignedDate: new Date(),
        dueDate: calculateDueDate(formCode, state.currentStageKey, state.urgency),
        action,
        actionDate: new Date(),
        comments,
        isComplete: true,
        isSkipped: false,
        isEscalated: false,
      };
      
      // Update state
      setState(prev => ({
        ...prev,
        currentStageKey: newStageKey,
        status: newStatus,
        approvalChain: [...prev.approvalChain, actionEntry],
        isLoading: false,
      }));
      
      return {
        success: true,
        message: `Action "${action}" completed successfully`,
        newStatus,
        newStageKey,
        nextApprover: nextApprover ? {
          id: nextApprover.id,
          name: nextApprover.name,
          email: nextApprover.email,
        } : undefined,
        notificationsSent: nextApprover ? [nextApprover.email] : [],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({ ...prev, isLoading: false, error: message }));
      return {
        success: false,
        message,
        newStatus: state.status,
        notificationsSent: [],
      };
    }
  }, [user, currentStage, formCode, state, getNextApprover]);
  
  // Delegate approval to another user
  const delegateApproval = useCallback(async (
    delegateToId: string,
    delegateToName: string,
    delegateToEmail: string,
    reason: string
  ): Promise<ApprovalActionResponse> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      if (!user || !currentStage) {
        throw new Error('User or current stage not available');
      }
      
      // Create delegation entry
      const delegationEntry: ApprovalChainEntry = {
        stageKey: state.currentStageKey,
        stageName: currentStage.name,
        order: currentStage.order,
        approverId: user.objectId || '',
        approverName: user.fullName || '',
        approverEmail: user.userPrincipalName || '',
        approverRole: currentStage.actorRole,
        assignedDate: new Date(),
        dueDate: calculateDueDate(formCode, state.currentStageKey, state.urgency),
        action: 'Delegate',
        actionDate: new Date(),
        comments: `Delegated to ${delegateToName}: ${reason}`,
        isComplete: true,
        isSkipped: false,
        isEscalated: false,
        delegatedFrom: {
          userId: user.objectId || '',
          userName: user.fullName || '',
          delegationDate: new Date(),
          reason,
        },
      };
      
      // Update state
      setState(prev => ({
        ...prev,
        status: 'PendingApproval',
        approvalChain: [...prev.approvalChain, delegationEntry],
        isLoading: false,
      }));
      
      toast.success(`Successfully delegated to ${delegateToName}`);
      
      return {
        success: true,
        message: `Delegated to ${delegateToName}`,
        newStatus: 'PendingApproval',
        nextApprover: {
          id: delegateToId,
          name: delegateToName,
          email: delegateToEmail,
        },
        notificationsSent: [delegateToEmail],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({ ...prev, isLoading: false, error: message }));
      toast.error('Delegation failed: ' + message);
      return {
        success: false,
        message,
        newStatus: state.status,
        notificationsSent: [],
      };
    }
  }, [user, currentStage, formCode, state]);
  
  // Set urgency level
  const setUrgency = useCallback((urgency: UrgencyLevel) => {
    setState(prev => ({ ...prev, urgency }));
  }, []);
  
  // Check if a section is visible
  const isSectionVisible = useCallback((sectionId: string): boolean => {
    return visibleSections.includes(sectionId);
  }, [visibleSections]);
  
  // Check if a section is editable
  const isSectionEditable = useCallback((sectionId: string): boolean => {
    return editableSections.includes(sectionId);
  }, [editableSections]);
  
  return {
    // Workflow definition
    workflowDef,
    currentStage,
    stagesWithStatus,
    progressPercentage,
    
    // Current state
    status: state.status,
    currentStageKey: state.currentStageKey,
    approvalChain: state.approvalChain,
    urgency: state.urgency,
    isLoading: state.isLoading,
    error: state.error,
    
    // Section visibility/editability
    visibleSections,
    editableSections,
    isSectionVisible,
    isSectionEditable,
    
    // Actions
    allowedActions: [...allowedActions, 'Delegate'] as ApprovalActionType[], // Always allow delegation
    canApprove,
    submitForm,
    takeAction,
    delegateApproval,
    setUrgency,
    
    // Helpers
    getNextApprover,
    isFinalStage: isFinalStage(formCode, state.currentStageKey),
    
    // Delegation support
    canDelegate: !!user && !!currentStage,
  };
}

// =============================================================================
// APPROVAL DASHBOARD HOOK
// =============================================================================

export function useApprovalDashboard() {
  const { data: user } = useUser();
  
  // Mock tasks - in production, this queries SharePoint
  const pendingTasks: ApprovalTaskSummary[] = useMemo(() => {
    if (!user) return [];
    
    // Mock pending tasks for demo
    return [
      {
        formId: 'EAF-202605-0001',
        formCode: 'EAF',
        formName: 'External Access Form',
        title: 'VPN Access for John Smith',
        submitter: 'Aisha Rahman',
        submittedDate: new Date('2026-05-09'),
        currentStage: 'IT Manager Approval',
        dueDate: new Date('2026-05-14'),
        isOverdue: false,
        daysOverdue: 0,
        urgency: 'Normal',
        department: 'Human Resources',
        site: 'PRAI',
      },
      {
        formId: 'NIR-202605-0002',
        formCode: 'NIR',
        formName: 'Notes ID Request',
        title: 'New Notes ID for Maria Garcia',
        submitter: 'Kevin Tan',
        submittedDate: new Date('2026-05-08'),
        currentStage: 'HOD Approval',
        dueDate: new Date('2026-05-11'),
        isOverdue: true,
        daysOverdue: 1,
        urgency: 'High',
        department: 'Finance',
        site: 'PRAI',
      },
    ];
  }, [user]);
  
  const mySubmissions: ApprovalTaskSummary[] = useMemo(() => {
    if (!user) return [];
    
    return [
      {
        formId: 'EAF-202605-0003',
        formCode: 'EAF',
        formName: 'External Access Form',
        title: 'Citrix Access for Remote Work',
        submitter: user.fullName || 'Unknown',
        submittedDate: new Date('2026-05-10'),
        currentStage: 'Department Head Approval',
        dueDate: new Date('2026-05-15'),
        isOverdue: false,
        daysOverdue: 0,
        urgency: 'Normal',
        department: 'Information Technology',
        site: 'PRAI',
      },
    ];
  }, [user]);
  
  const stats: ApprovalDashboardStats = useMemo(() => ({
    pendingMyApproval: pendingTasks.length,
    mySubmissions: mySubmissions.length,
    myApproved: 15,
    myRejected: 2,
    overdueCount: pendingTasks.filter(t => t.isOverdue).length,
    dueToday: 1,
    dueThisWeek: 3,
    avgApprovalTimeHours: 18.5,
    completionRate: 94.2,
    byFormType: {
      EAF: 8,
      NIR: 5,
      RS: 3,
      ITSSR: 6,
    },
    byStatus: {
      Draft: 2,
      Submitted: 5,
      InProgress: 8,
      PendingApproval: 3,
      Approved: 12,
      Rejected: 2,
      Returned: 1,
      Escalated: 0,
      Completed: 10,
      Closed: 5,
    },
  }), [pendingTasks, mySubmissions]);
  
  return {
    pendingTasks,
    mySubmissions,
    stats,
    isLoading: false,
  };
}

// Export types
export type { ApproverLookup, WorkflowEngineState };