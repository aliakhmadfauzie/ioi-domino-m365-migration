/**
 * SharePoint-Connected Admin Hooks
 * 
 * These hooks replace the localStorage-based admin config hooks with
 * real SharePoint persistence using TanStack Query.
 * 
 * Connected to:
 * - ConfigGlobalUserRoleAssignments (SharePoint) - User role assignments
 * - WorkflowAuditLog (SharePoint) - Audit log entries
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { AdminUserRoleService, AdminAuditLogService } from '@/services/admin-sharepoint-service';
import type {
  UserRoleAssignment,
  AuditLogEntry,
  EntityType,
  ActionType,
} from '@/types/admin-config';
import { useUser } from './use-user';

// =============================================================================
// QUERY KEYS
// =============================================================================

export const adminQueryKeys = {
  userRoles: ['admin', 'user-roles'] as const,
  auditLog: ['admin', 'audit-log'] as const,
};

// =============================================================================
// USER ROLE ASSIGNMENTS HOOK (SharePoint Connected)
// =============================================================================

export function useUserRoleAssignmentsSharePoint() {
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  // Fetch all user role assignments from SharePoint
  const { data: assignments = [], isLoading, error, refetch } = useQuery({
    queryKey: adminQueryKeys.userRoles,
    queryFn: () => AdminUserRoleService.getAll(),
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (assignment: Omit<UserRoleAssignment, 'id' | 'modifiedDate' | 'createdBy' | 'title'>) =>
      AdminUserRoleService.create(assignment),
    onSuccess: async (newAssignment) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.userRoles });
      // Log to audit
      if (user) {
        await AdminAuditLogService.logAdminAction(
          'ROLE',
          newAssignment.id,
          'CREATE',
          `Assigned ${newAssignment.roleKey} role to ${newAssignment.userPrincipalName}`,
          { name: user.fullName || 'Unknown', email: user.userPrincipalName || '' },
          undefined,
          newAssignment
        );
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.auditLog });
      }
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<UserRoleAssignment> }) =>
      AdminUserRoleService.update(id, updates),
    onSuccess: async (updatedAssignment, { id }) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.userRoles });
      if (user) {
        await AdminAuditLogService.logAdminAction(
          'ROLE',
          id,
          'UPDATE',
          `Updated role assignment for ${updatedAssignment.userPrincipalName}`,
          { name: user.fullName || 'Unknown', email: user.userPrincipalName || '' }
        );
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.auditLog });
      }
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => AdminUserRoleService.delete(id),
    onSuccess: async (_data, id) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.userRoles });
      if (user) {
        await AdminAuditLogService.logAdminAction(
          'ROLE',
          id,
          'DELETE',
          `Deleted role assignment`,
          { name: user.fullName || 'Unknown', email: user.userPrincipalName || '' }
        );
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.auditLog });
      }
    },
  });

  // Toggle active mutation
  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => AdminUserRoleService.toggleActive(id),
    onSuccess: async (updatedAssignment, id) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.userRoles });
      if (user) {
        await AdminAuditLogService.logAdminAction(
          'ROLE',
          id,
          updatedAssignment.isActive ? 'ACTIVATE' : 'DEACTIVATE',
          `${updatedAssignment.isActive ? 'Activated' : 'Deactivated'} role for ${updatedAssignment.userPrincipalName}`,
          { name: user.fullName || 'Unknown', email: user.userPrincipalName || '' }
        );
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.auditLog });
      }
    },
  });

  // Convenient wrapper functions
  const createAssignment = useCallback(
    (assignment: Omit<UserRoleAssignment, 'id' | 'modifiedDate' | 'createdBy' | 'title'>) =>
      createMutation.mutateAsync(assignment),
    [createMutation]
  );

  const updateAssignment = useCallback(
    (id: string, updates: Partial<UserRoleAssignment>) =>
      updateMutation.mutateAsync({ id, updates }),
    [updateMutation]
  );

  const deleteAssignment = useCallback(
    (id: string) => deleteMutation.mutateAsync(id),
    [deleteMutation]
  );

  const toggleAssignmentActive = useCallback(
    (id: string) => toggleActiveMutation.mutateAsync(id),
    [toggleActiveMutation]
  );

  return {
    assignments,
    isLoading,
    error,
    refetch,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    toggleAssignmentActive,
    // Expose mutation states for loading indicators
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isToggling: toggleActiveMutation.isPending,
  };
}

// =============================================================================
// AUDIT LOG HOOK (SharePoint Connected)
// =============================================================================

export function useAuditLogSharePoint(options?: { limit?: number }) {
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  // Fetch audit log from SharePoint
  const { data: auditLog = [], isLoading, error, refetch } = useQuery({
    queryKey: [...adminQueryKeys.auditLog, options],
    queryFn: () => AdminAuditLogService.getAll(options),
    staleTime: 10000, // Refresh more frequently for audit log
  });

  // Add entry mutation
  const addEntryMutation = useMutation({
    mutationFn: (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'changedBy' | 'changedByEmail'>) =>
      AdminAuditLogService.create(entry, {
        name: user?.fullName || 'Unknown',
        email: user?.userPrincipalName || '',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.auditLog });
    },
  });

  const addEntry = useCallback(
    (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'changedBy' | 'changedByEmail'>) =>
      addEntryMutation.mutateAsync(entry),
    [addEntryMutation]
  );

  const logAction = useCallback(
    (
      entityType: EntityType,
      entityId: string,
      action: ActionType,
      description: string,
      beforeData?: unknown,
      afterData?: unknown
    ) =>
      AdminAuditLogService.logAdminAction(
        entityType,
        entityId,
        action,
        description,
        { name: user?.fullName || 'Unknown', email: user?.userPrincipalName || '' },
        beforeData,
        afterData
      ),
    [user]
  );

  return {
    auditLog,
    isLoading,
    error,
    refetch,
    addEntry,
    logAction,
    isAdding: addEntryMutation.isPending,
  };
}

// =============================================================================
// COMBINED ADMIN CONFIG HOOK
// =============================================================================

/**
 * Combined hook that provides access to all SharePoint-connected admin data
 */
export function useAdminConfigSharePoint() {
  const userRoles = useUserRoleAssignmentsSharePoint();
  const auditLog = useAuditLogSharePoint();

  return {
    userRoles,
    auditLog,
    // Connection status indicator
    isConnected: !userRoles.error && !auditLog.error,
    isLoading: userRoles.isLoading || auditLog.isLoading,
  };
}

// Export data source indicator
export const ADMIN_USER_ROLES_DATA_SOURCE = 'SharePoint' as const;
export const ADMIN_AUDIT_LOG_DATA_SOURCE = 'SharePoint' as const;