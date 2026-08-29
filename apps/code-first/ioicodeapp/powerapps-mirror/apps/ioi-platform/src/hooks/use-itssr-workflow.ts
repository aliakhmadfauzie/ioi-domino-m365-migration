/**
 * useITSSRWorkflow - Workflow State Management Hook
 * 
 * Manages the CurrentAction (CA) state machine for ITSSR forms.
 * Controls form mode, section visibility, and available actions based on workflow state.
 */

import { useMemo, useCallback } from 'react';
import {
  type ITSSRCurrentAction,
  type ITSSRWorkflowState,
  ITSSR_WORKFLOW_STATES,
  isValidCurrentAction,
} from '@/types/m2-itssr-workflow';

// =============================================================================
// TYPES
// =============================================================================

export interface UseITSSRWorkflowOptions {
  /** Current workflow state (CurrentAction/CA) */
  currentAction: ITSSRCurrentAction;
  /** Current user's role */
  userRole: 'requestor' | 'it_staff' | 'it_admin';
  /** Current user's ID */
  userId: string;
  /** Requestor's user ID (for permission checks) */
  requestorId?: string;
  /** Assigned IT staff ID (for permission checks) */
  assignedToId?: string;
  /** List of editor IDs with section edit access */
  editorIds?: string[];
}

export interface ITSSRWorkflowResult {
  /** Current workflow state configuration */
  state: ITSSRWorkflowState;
  
  // Form Mode Flags
  /** Whether the form is in read-only mode */
  isReadOnly: boolean;
  /** Whether the requestor section can be edited */
  canEditRequestorSection: boolean;
  /** Whether the IT section can be edited */
  canEditITSection: boolean;
  /** Whether the acceptance section can be edited */
  canEditAcceptanceSection: boolean;
  
  // Section Visibility
  /** Whether to show the IT Section */
  showITSection: boolean;
  /** Whether to show the Acceptance Section */
  showAcceptanceSection: boolean;
  /** Whether to show the PENDING badge on IT Section */
  showPendingBadge: boolean;
  
  // Button Visibility
  /** Whether to show the Submit button */
  showSubmitButton: boolean;
  /** Whether to show the Save Draft button */
  showSaveDraftButton: boolean;
  /** Whether to show the Assign button */
  showAssignButton: boolean;
  /** Whether to show the Start Work button */
  showStartWorkButton: boolean;
  /** Whether to show the Resolve button */
  showResolveButton: boolean;
  /** Whether to show the Accept button */
  showAcceptButton: boolean;
  /** Whether to show the Reject button */
  showRejectButton: boolean;
  /** Whether to show the Complete/Close button */
  showCompleteButton: boolean;
  /** Whether to show the Cancel button */
  showCancelButton: boolean;
  /** Whether to show the Reopen button */
  showReopenButton: boolean;
  
  // Transition Functions
  /** Available state transitions from current state */
  availableTransitions: ITSSRCurrentAction[];
  /** Check if a transition is valid */
  canTransitionTo: (action: ITSSRCurrentAction) => boolean;
  /** Get the workflow state for a given action */
  getStateConfig: (action: ITSSRCurrentAction) => ITSSRWorkflowState | undefined;
}

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

export function useITSSRWorkflow(options: UseITSSRWorkflowOptions): ITSSRWorkflowResult {
  const {
    currentAction,
    userRole,
    userId,
    requestorId,
    assignedToId,
    editorIds = [],
  } = options;

  // Get current state configuration
  const state = useMemo(() => {
    if (!isValidCurrentAction(currentAction)) {
      return ITSSR_WORKFLOW_STATES.New;
    }
    return ITSSR_WORKFLOW_STATES[currentAction];
  }, [currentAction]);

  // Permission checks
  const isRequestor = userId === requestorId;
  const isAssignedIT = userId === assignedToId;
  const isEditor = editorIds.includes(userId);
  const isITStaff = userRole === 'it_staff' || userRole === 'it_admin';
  const isITAdmin = userRole === 'it_admin';

  // Form mode flags
  const isReadOnly = useMemo(() => {
    // Completed and Cancelled states are always read-only
    if (currentAction === 'Completed' || currentAction === 'Cancelled') {
      return true;
    }
    // Check if user has any edit permissions
    const canEditRequestor = state.canRequestorEdit && isRequestor;
    const canEditIT = state.canITEdit && (isITStaff || isAssignedIT || isEditor);
    const canAccept = state.canAccept && isRequestor;
    
    return !canEditRequestor && !canEditIT && !canAccept;
  }, [currentAction, state, isRequestor, isITStaff, isAssignedIT, isEditor]);

  const canEditRequestorSection = useMemo(() => {
    return state.canRequestorEdit && (isRequestor || isITAdmin);
  }, [state.canRequestorEdit, isRequestor, isITAdmin]);

  const canEditITSection = useMemo(() => {
    return state.canITEdit && (isITStaff || isAssignedIT || isEditor);
  }, [state.canITEdit, isITStaff, isAssignedIT, isEditor]);

  const canEditAcceptanceSection = useMemo(() => {
    return state.canAccept && isRequestor;
  }, [state.canAccept, isRequestor]);

  // Section visibility
  const showPendingBadge = currentAction === 'Pending' || currentAction === 'Assigned';

  // Button visibility based on state and permissions
  const showSubmitButton = currentAction === 'New' && (isRequestor || isITAdmin);
  const showSaveDraftButton = currentAction === 'New' && (isRequestor || isITAdmin);
  const showAssignButton = currentAction === 'Pending' && isITStaff;
  const showStartWorkButton = currentAction === 'Assigned' && (isAssignedIT || isITAdmin);
  const showResolveButton = currentAction === 'InProgress' && (isAssignedIT || isITAdmin);
  const showAcceptButton = currentAction === 'Resolved' && isRequestor;
  const showRejectButton = currentAction === 'Resolved' && isRequestor;
  const showCompleteButton = currentAction === 'Accepted' && isITStaff;
  const showCancelButton = ['New', 'Pending', 'Assigned', 'InProgress'].includes(currentAction) && (isRequestor || isITAdmin);
  const showReopenButton = currentAction === 'Rejected' && (isAssignedIT || isITAdmin);

  // Transition functions
  const canTransitionTo = useCallback((action: ITSSRCurrentAction): boolean => {
    return state.availableTransitions.includes(action);
  }, [state.availableTransitions]);

  const getStateConfig = useCallback((action: ITSSRCurrentAction): ITSSRWorkflowState | undefined => {
    if (!isValidCurrentAction(action)) {
      return undefined;
    }
    return ITSSR_WORKFLOW_STATES[action];
  }, []);

  return {
    state,
    
    // Form Mode Flags
    isReadOnly,
    canEditRequestorSection,
    canEditITSection,
    canEditAcceptanceSection,
    
    // Section Visibility
    showITSection: state.showITSection,
    showAcceptanceSection: state.showAcceptanceSection,
    showPendingBadge,
    
    // Button Visibility
    showSubmitButton,
    showSaveDraftButton,
    showAssignButton,
    showStartWorkButton,
    showResolveButton,
    showAcceptButton,
    showRejectButton,
    showCompleteButton,
    showCancelButton,
    showReopenButton,
    
    // Transition Functions
    availableTransitions: state.availableTransitions,
    canTransitionTo,
    getStateConfig,
  };
}

// =============================================================================
// WORKFLOW TRANSITION HELPERS
// =============================================================================

/**
 * Get the next logical state for a given action
 */
export function getNextWorkflowState(
  currentAction: ITSSRCurrentAction,
  transitionAction: 'submit' | 'assign' | 'start' | 'resolve' | 'accept' | 'reject' | 'complete' | 'cancel' | 'reopen'
): ITSSRCurrentAction | null {
  const transitions: Record<string, Partial<Record<typeof transitionAction, ITSSRCurrentAction>>> = {
    New: { submit: 'Pending', cancel: 'Cancelled' },
    Pending: { assign: 'Assigned', cancel: 'Cancelled' },
    Assigned: { start: 'InProgress', cancel: 'Cancelled' },
    InProgress: { resolve: 'Resolved', cancel: 'Cancelled' },
    Resolved: { accept: 'Accepted', reject: 'Rejected', reopen: 'InProgress' },
    Accepted: { complete: 'Completed' },
    Rejected: { reopen: 'InProgress', cancel: 'Cancelled' },
    Completed: {},
    Cancelled: {},
  };

  return transitions[currentAction]?.[transitionAction] ?? null;
}

/**
 * Validate if a state transition is allowed
 */
export function isValidTransition(
  fromAction: ITSSRCurrentAction,
  toAction: ITSSRCurrentAction
): boolean {
  const state = ITSSR_WORKFLOW_STATES[fromAction];
  return state?.availableTransitions.includes(toAction) ?? false;
}

/**
 * Get human-readable description for a state transition
 */
export function getTransitionDescription(
  fromAction: ITSSRCurrentAction,
  toAction: ITSSRCurrentAction
): string {
  const descriptions: Record<string, Record<string, string>> = {
    New: {
      Pending: 'Submit request for IT review',
      Cancelled: 'Cancel the request',
    },
    Pending: {
      Assigned: 'Assign to IT team member',
      Cancelled: 'Cancel the request',
    },
    Assigned: {
      InProgress: 'Start working on the request',
      Pending: 'Return to pending queue',
      Cancelled: 'Cancel the request',
    },
    InProgress: {
      Resolved: 'Mark as resolved and notify requestor',
      Pending: 'Return to pending queue',
      Cancelled: 'Cancel the request',
    },
    Resolved: {
      Accepted: 'Accept the solution',
      Rejected: 'Reject the solution and request rework',
      InProgress: 'Reopen for additional work',
    },
    Accepted: {
      Completed: 'Close the case',
    },
    Rejected: {
      InProgress: 'Reopen for rework',
      Cancelled: 'Cancel the request',
    },
  };

  return descriptions[fromAction]?.[toAction] ?? 'Transition state';
}