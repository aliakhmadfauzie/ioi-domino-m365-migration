/**
 * IT Routing Engine Hook
 * 
 * Provides workflow state management for IT forms:
 * - Stage determination and transitions
 * - SLA monitoring and escalation checks
 * - Validation rule enforcement
 * - Actor resolution for current stage
 */

import { useMemo, useCallback } from 'react';
import {
  type ITWorkflowStatus,
  type ITWorkflowActor,
  type ITWorkflowStage,
  getFormRoutingByCode,
  getCurrentStage,
  getNextStage,
  mapStatusToKey,
  mapKeyToStatus,
  ITEscalationRules,
  ITValidationRules,
  type ValidationRule,
} from '@/lib/it-routing-config';
import {
  getWorkflow,
  getAvailableTransitions,
  validateTransition,
  isTerminalStatus,
  getStageProgress,
  type WorkflowTransition,
  type ITWorkflowDefinition,
} from '@/lib/it-routing-workflows';
import type { MainDBIT } from '@/generated/models/main-dbit-model';

// Engine State
export interface ITRoutingState {
  formcode: string;
  currentStatus: ITWorkflowStatus;
  currentStage: ITWorkflowStage | null;
  workflow: ITWorkflowDefinition | null;
  progress: number;
  isTerminal: boolean;
  availableActions: WorkflowTransition[];
  escalationState: EscalationState;
  validationErrors: string[];
}

// Escalation State
export interface EscalationState {
  isOverdue: boolean;
  daysOverdue: number;
  escalationRequired: boolean;
  escalationTarget: string | null;
  rejectionCount: number;
  canOverride: boolean;
}

// Action Result
export interface ActionResult {
  success: boolean;
  newStatus: ITWorkflowStatus | null;
  message: string;
  errors?: string[];
}

// Hook Options
export interface UseITRoutingEngineOptions {
  submission: MainDBIT | null;
  userEmail?: string;
  userRoles?: ITWorkflowActor[];
}

/**
 * Hook to manage IT workflow routing logic
 */
export function useITRoutingEngine(options: UseITRoutingEngineOptions) {
  const { submission, userEmail, userRoles = [] } = options;
  
  // Extract form code and current status
  const formCode = submission?.formcode || '';
  const statusKey = submission?.currentStatus || 'CurrentstatusKey0';
  const workflowStage = submission?.workflowstage !== undefined ? String(submission.workflowstage) : '';
  
  // Map to workflow status
  const currentStatus = useMemo(
    () => mapKeyToStatus(statusKey, workflowStage || undefined),
    [statusKey, workflowStage]
  );
  
  // Get workflow definition
  const workflow = useMemo(
    () => getWorkflow(formCode),
    [formCode]
  );
  
  // Get current stage details
  const currentStage = useMemo(
    () => getCurrentStage(formCode, currentStatus),
    [formCode, currentStatus]
  );
  
  // Calculate progress
  const progress = useMemo(
    () => getStageProgress(formCode, currentStatus),
    [formCode, currentStatus]
  );
  
  // Check if terminal status
  const isTerminal = useMemo(
    () => isTerminalStatus(formCode, currentStatus),
    [formCode, currentStatus]
  );
  
  // Determine user's actor role for this stage
  const currentUserRole = useMemo((): ITWorkflowActor | null => {
    if (!userEmail) return null;
    
    // Check if user is the requestor
    if (submission?.requestoremail?.toLowerCase() === userEmail.toLowerCase()) {
      return 'Requestor';
    }
    
    // Check role-based actors
    if (userRoles.includes('IT_ADMIN')) return 'IT_ADMIN';
    if (userRoles.includes('IT_MANAGER')) return 'IT_MANAGER';
    if (userRoles.includes('IS_ADMIN')) return 'IS_ADMIN';
    if (userRoles.includes('IT_HOD')) return 'IT_HOD';
    
    // Check stage-specific actors from remarks
    try {
      const remarks = submission?.remarks ? JSON.parse(submission.remarks) : {};
      const approvers = remarks.approvers || {};
      
      if (currentStatus === 'PendingHOD' && approvers.hod?.email?.toLowerCase() === userEmail.toLowerCase()) {
        return 'HoD';
      }
      if (currentStatus === 'PendingDivHead' && approvers.divisionHead?.email?.toLowerCase() === userEmail.toLowerCase()) {
        return 'DivisionHead';
      }
    } catch {
      // Ignore parse errors
    }
    
    return null;
  }, [userEmail, userRoles, submission, currentStatus]);
  
  // Get available transitions for current user
  const availableActions = useMemo(() => {
    if (!currentUserRole) return [];
    return getAvailableTransitions(formCode, currentStatus, currentUserRole);
  }, [formCode, currentStatus, currentUserRole]);
  
  // Calculate escalation state
  const escalationState = useMemo((): EscalationState => {
    const state: EscalationState = {
      isOverdue: false,
      daysOverdue: 0,
      escalationRequired: false,
      escalationTarget: null,
      rejectionCount: 0,
      canOverride: false,
    };
    
    if (!submission?.submitteddate || isTerminal) return state;
    
    // Calculate days since submission or last update
    const submittedDate = new Date(submission.submitteddate);
    const now = new Date();
    const daysSinceSubmission = Math.floor(
      (now.getTime() - submittedDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // Check SLA based on current stage
    if (currentStage?.slaHours) {
      const slaInDays = currentStage.slaHours / 24;
      if (daysSinceSubmission > slaInDays) {
        state.isOverdue = true;
        state.daysOverdue = Math.floor(daysSinceSubmission - slaInDays);
      }
    }
    
    // Check escalation rules
    // Rule 1: Pending > 3 days -> escalate to IT HOD
    if (daysSinceSubmission > 3 && !isTerminal) {
      state.escalationRequired = true;
      state.escalationTarget = 'IT_HOD';
    }
    
    // Rule 2: Count rejections from remarks
    try {
      const remarks = submission.remarks ? JSON.parse(submission.remarks) : {};
      state.rejectionCount = remarks.rejectionCount || 0;
      
      // 2+ rejections -> IS_ADMIN can override
      if (state.rejectionCount >= 2) {
        state.canOverride = true;
        state.escalationTarget = 'IS_ADMIN';
      }
    } catch {
      // Ignore parse errors
    }
    
    return state;
  }, [submission, currentStage, isTerminal]);
  
  // Get validation rules for current stage
  const getValidationRules = useCallback((): ValidationRule[] => {
    const category = `${workflow?.pattern}_${currentStatus}`.replace(/Pending/g, '');
    return ITValidationRules.filter((rule) => 
      rule.category.toLowerCase() === category.toLowerCase()
    );
  }, [workflow, currentStatus]);
  
  // Validate a transition
  const validateAction = useCallback(
    (toStatus: ITWorkflowStatus, comment?: string): ActionResult => {
      if (!currentUserRole) {
        return {
          success: false,
          newStatus: null,
          message: 'No valid role for this action',
          errors: ['User role not determined'],
        };
      }
      
      const validation = validateTransition(formCode, currentStatus, toStatus, currentUserRole);
      if (!validation.valid) {
        return {
          success: false,
          newStatus: null,
          message: validation.error || 'Validation failed',
          errors: [validation.error || 'Unknown validation error'],
        };
      }
      
      // Check if comment is required
      const transition = availableActions.find((a) => a.to === toStatus);
      if (transition?.requiresComment && !comment?.trim()) {
        return {
          success: false,
          newStatus: null,
          message: 'Comment is required for this action',
          errors: ['Comment required'],
        };
      }
      
      return {
        success: true,
        newStatus: toStatus,
        message: 'Action validated successfully',
      };
    },
    [formCode, currentStatus, currentUserRole, availableActions]
  );
  
  // Get the next stage
  const nextStage = useMemo(
    () => getNextStage(formCode, currentStatus),
    [formCode, currentStatus]
  );
  
  // Get form routing configuration
  const formRouting = useMemo(
    () => getFormRoutingByCode(formCode),
    [formCode]
  );
  
  // Build complete state
  const state: ITRoutingState = useMemo(
    () => ({
      formCode,
      formcode: formCode, // Add the missing property for ITRoutingState
      currentStatus,
      currentStage: currentStage || null,
      workflow: workflow || null,
      progress,
      isTerminal,
      availableActions,
      escalationState,
      validationErrors: [],
    }),
    [formCode, currentStatus, currentStage, workflow, progress, isTerminal, availableActions, escalationState]
  );
  
  return {
    // State
    state,
    formCode,
    currentStatus,
    currentStage,
    workflow,
    progress,
    isTerminal,
    currentUserRole,
    availableActions,
    escalationState,
    nextStage,
    formRouting,
    
    // Actions
    validateAction,
    getValidationRules,
    
    // Helpers
    mapStatusToKey,
    mapKeyToStatus,
    isTerminalStatus: (status: ITWorkflowStatus) => isTerminalStatus(formCode, status),
    getStageProgress: (status: ITWorkflowStatus) => getStageProgress(formCode, status),
  };
}

// Type exports
export type {
  ITWorkflowStatus,
  ITWorkflowActor,
  ITWorkflowStage,
  WorkflowTransition,
  ITWorkflowDefinition,
};

export default useITRoutingEngine;