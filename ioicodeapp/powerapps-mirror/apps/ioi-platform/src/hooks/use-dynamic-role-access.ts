/**
 * Dynamic Role Access Hook
 * 
 * Production-ready role management using SharePoint ConfigGlobalUserRoleAssignments table.
 * Replaces hardcoded workflow routing with real-time role lookups.
 * 
 * Role Types:
 * - ADMIN: Full system access, can manage users and configurations
 * - APPROVER: Can approve/reject submissions across assigned modules/departments
 * - MANAGER: Can approve within their department scope
 * - INITIATOR: Can create and submit forms (default for all users)
 */

import { useMemo } from 'react';
import { useUser } from './use-user';
import { isSuperAdminEmail } from './use-auto-role';
import { useConfigGlobalUserRoleAssignmentsList } from '@/generated/hooks/use-config-global-user-role-assignments';
import type { ConfigGlobalUserRoleAssignments } from '@/generated/models/config-global-user-role-assignments-model';

// Role keys as stored in SharePoint
export type RoleKey = 'ADMIN' | 'APPROVER' | 'MANAGER' | 'INITIATOR';

// Assignment scope types
export type AssignmentScope = 'GLOBAL' | 'DEPARTMENT' | 'MODULE';

export interface UserRoleInfo {
  // User info
  userEmail: string;
  userName: string | null;
  
  // Role flags
  isAdmin: boolean;
  isApprover: boolean;
  isManager: boolean;
  canApprove: boolean; // true if user has ADMIN, APPROVER, or MANAGER role
  canInitiate: boolean; // true for all authenticated users
  
  // Role assignments
  roles: RoleKey[];
  assignments: ConfigGlobalUserRoleAssignments[];
  
  // Scope-based access
  approverDepartments: string[]; // Departments user can approve for
  approverModules: string[]; // Modules user can approve for
  hasGlobalApprovalAccess: boolean; // Can approve across all departments/modules
  
  // Loading state
  isLoading: boolean;
  error: string | null;
}

export interface UseDynamicRoleAccessOptions {
  /** Specific module to check access for (e.g., 'IT', 'HR') */
  moduleScope?: string;
  /** Specific department to check access for */
  departmentScope?: string;
}

/**
 * Hook to get the current user's role assignments from SharePoint.
 * Returns real-time role information based on ConfigGlobalUserRoleAssignments table.
 */
export function useDynamicRoleAccess(options?: UseDynamicRoleAccessOptions): UserRoleInfo {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: roleAssignments = [], isLoading: assignmentsLoading, error } = useConfigGlobalUserRoleAssignmentsList();
  const allAssignments = useMemo(
    () => roleAssignments.filter((assignment: ConfigGlobalUserRoleAssignments) => assignment.isActive !== false),
    [roleAssignments]
  );
  
  const userEmail = user?.userPrincipalName?.toLowerCase() || '';
  const userName = user?.fullName || null;
  const hasSuperAdminOverride = !!userEmail && isSuperAdminEmail(userEmail);
  const isLoading = userLoading || assignmentsLoading;
  
  // If no role assignments exist in the system at all, grant admin access to current user
  // This allows initial setup when the ConfigGlobalUserRoleAssignments table is empty
  const isFirstUserSetup = !assignmentsLoading && allAssignments.length === 0 && !!userEmail;
  
  // Get all active role assignments for the current user
  const userAssignments = useMemo(() => {
    if (!userEmail || !allAssignments.length) return [];
    
    return allAssignments.filter((assignment: ConfigGlobalUserRoleAssignments) => {
      // Match by email (case-insensitive)
      const assignedEmail = assignment.userPrincipalName?.toLowerCase() || '';
      return assignedEmail === userEmail && assignment.isActive !== false;
    });
  }, [allAssignments, userEmail]);
  
  // Extract unique roles from assignments
  const roles = useMemo(() => {
    const roleSet = new Set<RoleKey>();
    userAssignments.forEach((assignment: ConfigGlobalUserRoleAssignments) => {
      if (assignment.roleKey) {
        roleSet.add(assignment.roleKey.toUpperCase() as RoleKey);
      }
    });
    return Array.from(roleSet);
  }, [userAssignments]);
  
  // Compute role flags
  // If first user setup (no assignments exist), grant full access
  const isAdmin = hasSuperAdminOverride || isFirstUserSetup || roles.includes('ADMIN');
  const isApprover = hasSuperAdminOverride || isFirstUserSetup || roles.includes('APPROVER');
  const isManager = hasSuperAdminOverride || isFirstUserSetup || roles.includes('MANAGER');
  const canApprove = isAdmin || isApprover || isManager;
  const canInitiate = !!userEmail; // All authenticated users can initiate
  
  // Get departments user can approve for
  const approverDepartments = useMemo(() => {
    if (isAdmin) return []; // Admin has global access, no need to list departments
    
    const departments = new Set<string>();
    userAssignments
      .filter((a: ConfigGlobalUserRoleAssignments) => 
        a.roleKey?.toUpperCase() === 'APPROVER' || 
        a.roleKey?.toUpperCase() === 'MANAGER'
      )
      .forEach((a: ConfigGlobalUserRoleAssignments) => {
        if (a.departmentScope) {
          departments.add(a.departmentScope);
        }
      });
    return Array.from(departments);
  }, [userAssignments, isAdmin]);
  
  // Get modules user can approve for
  const approverModules = useMemo(() => {
    if (isAdmin) return []; // Admin has global access
    
    const modules = new Set<string>();
    userAssignments
      .filter((a: ConfigGlobalUserRoleAssignments) => 
        a.roleKey?.toUpperCase() === 'APPROVER' || 
        a.roleKey?.toUpperCase() === 'MANAGER'
      )
      .forEach((a: ConfigGlobalUserRoleAssignments) => {
        if (a.moduleScope) {
          modules.add(a.moduleScope);
        }
      });
    return Array.from(modules);
  }, [userAssignments, isAdmin]);
  
  // Check if user has global approval access
  // Check if user has global approval access
  const hasGlobalApprovalAccess = useMemo(() => {
    if (hasSuperAdminOverride || isAdmin || isFirstUserSetup) return true;
    
    return userAssignments.some((a: ConfigGlobalUserRoleAssignments) => {
      const hasApproverRole = a.roleKey?.toUpperCase() === 'APPROVER' || a.roleKey?.toUpperCase() === 'MANAGER';
      const isGlobalScope = a.assignmentScopeKey === 'AssignmentScopeKey0'; // GLOBAL
      return hasApproverRole && isGlobalScope;
    });
  }, [userAssignments, hasSuperAdminOverride, isAdmin, isFirstUserSetup]);
  
  // Apply optional scope filters
  const scopedCanApprove = useMemo(() => {
    if (!canApprove) return false;
    if (hasGlobalApprovalAccess) return true;
    
    // Check module scope
    if (options?.moduleScope) {
      if (!approverModules.includes(options.moduleScope) && approverModules.length > 0) {
        return false;
      }
    }
    
    // Check department scope
    if (options?.departmentScope) {
      if (!approverDepartments.includes(options.departmentScope) && approverDepartments.length > 0) {
        return false;
      }
    }
    
    return true;
  }, [canApprove, hasGlobalApprovalAccess, options, approverModules, approverDepartments]);
  
  return {
    userEmail,
    userName,
    isAdmin,
    isApprover,
    isManager,
    canApprove: scopedCanApprove,
    canInitiate,
    roles,
    assignments: userAssignments,
    approverDepartments,
    approverModules,
    hasGlobalApprovalAccess,
    isLoading,
    error: error ? 'Failed to load role assignments' : null,
  };
}

/**
 * Check if a specific email has approval permissions.
 * Useful for checking other users' permissions (e.g., for assignment validation).
 */
export function useCanEmailApprove(email: string | undefined, moduleScope?: string): {
  canApprove: boolean;
  isLoading: boolean;
} {
  const { data: roleAssignments = [], isLoading } = useConfigGlobalUserRoleAssignmentsList();
  const allAssignments = useMemo(
    () => roleAssignments.filter((assignment: ConfigGlobalUserRoleAssignments) => assignment.isActive !== false),
    [roleAssignments]
  );
  
  const canApprove = useMemo(() => {
    if (!email || !allAssignments.length) return false;
    
    const normalizedEmail = email.toLowerCase();
    
    return allAssignments.some((assignment: ConfigGlobalUserRoleAssignments) => {
      const assignedEmail = assignment.userPrincipalName?.toLowerCase() || '';
      if (assignedEmail !== normalizedEmail) return false;
      if (assignment.isActive === false) return false;
      
      const roleKey = assignment.roleKey?.toUpperCase();
      const hasApproverRole = roleKey === 'ADMIN' || roleKey === 'APPROVER' || roleKey === 'MANAGER';
      
      if (!hasApproverRole) return false;
      
      // Check module scope if specified
      if (moduleScope) {
        const isGlobal = assignment.assignmentScopeKey === 'AssignmentScopeKey0';
        const matchesModule = assignment.moduleScope === moduleScope;
        return isGlobal || matchesModule;
      }
      
      return true;
    });
  }, [allAssignments, email, moduleScope]);
  
  return { canApprove, isLoading };
}

/**
 * Get all users with approval permissions for a specific module/department.
 * Useful for populating approver dropdowns.
 */
export function useApproverList(moduleScope?: string, departmentScope?: string): {
  approvers: Array<{ email: string; name: string; roleKey: string; scope: string }>;
  isLoading: boolean;
} {
  const { data: roleAssignments = [], isLoading } = useConfigGlobalUserRoleAssignmentsList();
  const allAssignments = useMemo(
    () => roleAssignments.filter((assignment: ConfigGlobalUserRoleAssignments) => assignment.isActive !== false),
    [roleAssignments]
  );
  
  const approvers = useMemo(() => {
    const approverMap = new Map<string, { email: string; name: string; roleKey: string; scope: string }>();
    
    allAssignments.forEach((assignment: ConfigGlobalUserRoleAssignments) => {
      if (assignment.isActive === false) return;
      
      const roleKey = assignment.roleKey?.toUpperCase() || '';
      const hasApproverRole = roleKey === 'ADMIN' || roleKey === 'APPROVER' || roleKey === 'MANAGER';
      
      if (!hasApproverRole) return;
      
      // Check scope filters
      const isGlobal = assignment.assignmentScopeKey === 'AssignmentScopeKey0';
      
      if (moduleScope && !isGlobal) {
        if (assignment.moduleScope !== moduleScope) return;
      }
      
      if (departmentScope && !isGlobal) {
        if (assignment.departmentScope !== departmentScope) return;
      }
      
      const email = assignment.userPrincipalName?.toLowerCase() || '';
      if (!email) return;
      
      // Use title as display name, fallback to email
      const name = assignment.title || email;
      const scope = isGlobal ? 'Global' : 
                    assignment.departmentScope || assignment.moduleScope || 'Specific';
      
      // Only add if not already present, or if this is a higher-level role
      if (!approverMap.has(email) || roleKey === 'ADMIN') {
        approverMap.set(email, { email, name, roleKey, scope });
      }
    });
    
    return Array.from(approverMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [allAssignments, moduleScope, departmentScope]);
  
  return { approvers, isLoading };
}

export default useDynamicRoleAccess;
