/**
 * useWorkflowRouting Hook
 * 
 * @deprecated Use useDynamicRoleAccess hook for production role-based access.
 * This hook now wraps the dynamic role system for backwards compatibility.
 */

import { useMemo } from 'react';
import { useUser } from './use-user';
import { useDynamicRoleAccess } from './use-dynamic-role-access';

export interface WorkflowUser {
  email: string;
  displayName: string;
  role: 'first-approver' | 'initiator-approver' | 'initiator';
  canInitiate: boolean;
  canApprove: boolean;
}

export interface UseWorkflowRoutingResult {
  /** Whether routing is enabled (always true in production) */
  isRoutingEnabled: boolean;
  /** Current user's workflow info */
  currentUser: WorkflowUser | undefined;
  /** Whether current user can approve submissions */
  canApprove: boolean;
  /** Whether current user can initiate/submit forms */
  canInitiate: boolean;
  /** The first approver - returns a placeholder in production (use SharePoint for real approvers) */
  firstApprover: WorkflowUser | undefined;
  /** Get the approver email for new submissions - returns empty in production */
  getApproverEmail: () => string;
  /** Get the approver name for new submissions - returns empty in production */
  getApproverName: () => string;
  /** Check if a specific email can approve - always returns false in production (use useDynamicRoleAccess) */
  checkCanApprove: (email: string) => boolean;
  /** Check if a specific email can initiate - always returns true */
  checkCanInitiate: (email: string) => boolean;
  /** Loading state */
  isLoading: boolean;
}

/**
 * @deprecated Use useDynamicRoleAccess hook instead.
 * This hook is maintained for backwards compatibility but now uses the dynamic role system.
 */
export function useWorkflowRouting(): UseWorkflowRoutingResult {
  const { data: user, isLoading: userLoading } = useUser();
  const { canApprove, isLoading: roleLoading, isAdmin, isApprover, isManager } = useDynamicRoleAccess();

  const currentUser = useMemo((): WorkflowUser | undefined => {
    if (!user?.userPrincipalName) return undefined;
    
    // Build a WorkflowUser based on dynamic role info
    let role: 'first-approver' | 'initiator-approver' | 'initiator' = 'initiator';
    if (isAdmin || isApprover) {
      role = 'first-approver';
    } else if (isManager) {
      role = 'initiator-approver';
    }
    
    return {
      email: user.userPrincipalName,
      displayName: user.fullName || user.userPrincipalName,
      role,
      canInitiate: true,
      canApprove,
    };
  }, [user?.userPrincipalName, user?.fullName, isAdmin, isApprover, isManager, canApprove]);

  return {
    isRoutingEnabled: true, // Always enabled in production
    currentUser,
    canApprove,
    canInitiate: true, // All authenticated users can initiate
    firstApprover: undefined, // No hardcoded first approver in production
    getApproverEmail: () => '', // Use SharePoint role assignments
    getApproverName: () => '', // Use SharePoint role assignments
    checkCanApprove: () => false, // Use useDynamicRoleAccess instead
    checkCanInitiate: () => true, // All users can initiate
    isLoading: userLoading || roleLoading,
  };
}

export default useWorkflowRouting;