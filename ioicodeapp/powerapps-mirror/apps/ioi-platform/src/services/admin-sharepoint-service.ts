/**
 * Admin SharePoint Service
 * 
 * Bridges admin configuration types with SharePoint-connected services.
 * Replaces localStorage-based persistence with real SharePoint lists.
 * 
 * SharePoint Lists Used:
 * - ConfigGlobalUserRoleAssignments (HR Portal) - User role assignments
 * - WorkflowAuditLog (IT Portal) - Audit log entries
 */

import { ensureInitialized } from '@/lib/app-init';
import { ConfigGlobalUserRoleAssignmentsService } from '@/generated/services/config-global-user-role-assignments-service';
import { WorkflowAuditLogService } from '@/generated/services/workflow-audit-log-service';
import type { ConfigGlobalUserRoleAssignments, ConfigGlobalUserRoleAssignmentsAssignmentScopeKey } from '@/generated/models/config-global-user-role-assignments-model';
import type { WorkflowAuditLog } from '@/generated/models/workflow-audit-log-model';
import type {
  UserRoleAssignment,
  AuditLogEntry,
  RoleKey,
  AssignmentScope,
  EntityType,
  ActionType,
} from '@/types/admin-config';

// =============================================================================
// TYPE MAPPING UTILITIES
// =============================================================================

// Map admin AssignmentScope to SharePoint key
const SCOPE_TO_KEY: Record<AssignmentScope, ConfigGlobalUserRoleAssignmentsAssignmentScopeKey> = {
  GLOBAL: 'AssignmentScopeKey0',
  DEPARTMENT: 'AssignmentScopeKey1',
  MODULE: 'AssignmentScopeKey2',
};

const KEY_TO_SCOPE: Record<ConfigGlobalUserRoleAssignmentsAssignmentScopeKey, AssignmentScope> = {
  AssignmentScopeKey0: 'GLOBAL',
  AssignmentScopeKey1: 'DEPARTMENT',
  AssignmentScopeKey2: 'MODULE',
};

// =============================================================================
// USER ROLE ASSIGNMENTS SERVICE
// =============================================================================

export class AdminUserRoleService {
  /**
   * Convert SharePoint model to admin type
   */
  private static toAdminType(sp: ConfigGlobalUserRoleAssignments): UserRoleAssignment {
    return {
      id: String(sp.id),
      title: sp.title,
      userPrincipalName: sp.userPrincipalName,
      userName: sp.title.split('|')[0] || sp.userPrincipalName.split('@')[0],
      roleKey: sp.roleKey as RoleKey,
      assignmentScope: sp.assignmentScopeKey ? KEY_TO_SCOPE[sp.assignmentScopeKey] : 'GLOBAL',
      departmentCodeScope: sp.departmentScope as UserRoleAssignment['departmentCodeScope'],
      moduleKeyScope: sp.moduleScope,
      isActive: sp.isActive ?? true,
      notes: sp.notes,
      modifiedDate: new Date().toISOString(),
    };
  }

  /**
   * Convert admin type to SharePoint model for create/update
   */
  private static toSharePointType(
    admin: Omit<UserRoleAssignment, 'id' | 'modifiedDate' | 'createdBy' | 'title'>
  ): Omit<ConfigGlobalUserRoleAssignments, 'id'> {
    return {
      title: `${admin.userName || admin.userPrincipalName.split('@')[0]}|${admin.roleKey}`,
      userPrincipalName: admin.userPrincipalName,
      roleKey: admin.roleKey,
      assignmentScopeKey: SCOPE_TO_KEY[admin.assignmentScope],
      departmentScope: admin.departmentCodeScope,
      moduleScope: admin.moduleKeyScope,
      isActive: admin.isActive,
      notes: admin.notes,
    };
  }

  /**
   * Get all user role assignments from SharePoint
   */
  static async getAll(): Promise<UserRoleAssignment[]> {
    try {
      await ensureInitialized();
      const records = await ConfigGlobalUserRoleAssignmentsService.getAll();
      return records.map(this.toAdminType);
    } catch (error) {
      console.error('[AdminUserRoleService] Failed to fetch roles from SharePoint:', error);
      return [];
    }
  }

  /**
   * Get a single user role assignment
   */
  static async get(id: string): Promise<UserRoleAssignment | null> {
    try {
      await ensureInitialized();
      const record = await ConfigGlobalUserRoleAssignmentsService.get(id);
      return this.toAdminType(record);
    } catch (error) {
      console.error('[AdminUserRoleService] Failed to fetch role:', error);
      return null;
    }
  }

  /**
   * Create a new user role assignment in SharePoint
   */
  static async create(
    assignment: Omit<UserRoleAssignment, 'id' | 'modifiedDate' | 'createdBy' | 'title'>
  ): Promise<UserRoleAssignment> {
    await ensureInitialized();
    const spData = this.toSharePointType(assignment);
    const created = await ConfigGlobalUserRoleAssignmentsService.create(spData);
    return this.toAdminType(created);
  }

  /**
   * Update an existing user role assignment in SharePoint
   */
  static async update(
    id: string,
    updates: Partial<Omit<UserRoleAssignment, 'id'>>
  ): Promise<UserRoleAssignment> {
    await ensureInitialized();
    const changedFields: Partial<Omit<ConfigGlobalUserRoleAssignments, 'id'>> = {};

    if (updates.userPrincipalName !== undefined) {
      changedFields.userPrincipalName = updates.userPrincipalName;
    }
    if (updates.roleKey !== undefined) {
      changedFields.roleKey = updates.roleKey;
    }
    if (updates.assignmentScope !== undefined) {
      changedFields.assignmentScopeKey = SCOPE_TO_KEY[updates.assignmentScope];
    }
    if (updates.departmentCodeScope !== undefined) {
      changedFields.departmentScope = updates.departmentCodeScope;
    }
    if (updates.moduleKeyScope !== undefined) {
      changedFields.moduleScope = updates.moduleKeyScope;
    }
    if (updates.isActive !== undefined) {
      changedFields.isActive = updates.isActive;
    }
    if (updates.notes !== undefined) {
      changedFields.notes = updates.notes;
    }
    // Update title if userName or roleKey changed
    if (updates.userName !== undefined || updates.roleKey !== undefined) {
      const current = await this.get(id);
      if (current) {
        changedFields.title = `${updates.userName || current.userName}|${updates.roleKey || current.roleKey}`;
      }
    }

    const updated = await ConfigGlobalUserRoleAssignmentsService.update(id, changedFields);
    return this.toAdminType(updated);
  }

  /**
   * Delete a user role assignment from SharePoint
   */
  static async delete(id: string): Promise<void> {
    await ensureInitialized();
    await ConfigGlobalUserRoleAssignmentsService.delete(id);
  }

  /**
   * Toggle active status
   */
  static async toggleActive(id: string): Promise<UserRoleAssignment> {
    const current = await this.get(id);
    if (!current) {
      throw new Error(`Role assignment not found: ${id}`);
    }
    return this.update(id, { isActive: !current.isActive });
  }
}

// =============================================================================
// AUDIT LOG SERVICE
// =============================================================================

export class AdminAuditLogService {
  /**
   * Convert SharePoint model to admin type
   */
  private static toAdminType(sp: WorkflowAuditLog): AuditLogEntry {
    return {
      id: String(sp.id),
      title: sp.title,
      entityType: (sp.formCode?.toUpperCase() as EntityType) || 'SETTING',
      entityId: String(sp.requestItemID || sp.id),
      action: (sp.actionTaken?.toUpperCase() as ActionType) || 'UPDATE',
      changedBy: sp.actorName || 'Unknown',
      changedByEmail: sp.actorEmail || '',
      timestamp: sp.timestamp || new Date().toISOString(),
      beforeJson: sp.oldStatus ? JSON.stringify({ status: sp.oldStatus }) : undefined,
      afterJson: sp.newStatus ? JSON.stringify({ status: sp.newStatus }) : undefined,
      changeDescription: sp.comment,
    };
  }

  /**
   * Convert admin type to SharePoint model for create
   */
  private static toSharePointType(
    admin: Omit<AuditLogEntry, 'id' | 'timestamp' | 'changedBy' | 'changedByEmail'>,
    user: { name: string; email: string }
  ): Omit<WorkflowAuditLog, 'id'> {
    return {
      title: admin.title,
      formCode: admin.entityType,
      requestItemID: parseInt(admin.entityId) || 0,
      actionTaken: admin.action,
      actorName: user.name,
      actorEmail: user.email,
      timestamp: new Date().toISOString(),
      oldStatus: admin.beforeJson ? JSON.parse(admin.beforeJson).status : undefined,
      newStatus: admin.afterJson ? JSON.parse(admin.afterJson).status : undefined,
      comment: admin.changeDescription,
      siteTag: 'ADMIN',
    };
  }

  /**
   * Get all audit log entries from SharePoint
   */
  static async getAll(options?: { limit?: number }): Promise<AuditLogEntry[]> {
    try {
      await ensureInitialized();
      const records = await WorkflowAuditLogService.getAll({
        orderBy: ['timestamp desc'],
      });
      return records.map(this.toAdminType);
    } catch (error) {
      console.error('[AdminAuditLogService] Failed to fetch audit log from SharePoint:', error);
      return [];
    }
  }

  /**
   * Create a new audit log entry in SharePoint
   */
  static async create(
    entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'changedBy' | 'changedByEmail'>,
    user: { name: string; email: string }
  ): Promise<AuditLogEntry> {
    await ensureInitialized();
    const spData = this.toSharePointType(entry, user);
    const created = await WorkflowAuditLogService.create(spData);
    return this.toAdminType(created);
  }

  /**
   * Add audit entry for admin configuration changes
   */
  static async logAdminAction(
    entityType: EntityType,
    entityId: string,
    action: ActionType,
    description: string,
    user: { name: string; email: string },
    beforeData?: unknown,
    afterData?: unknown
  ): Promise<AuditLogEntry> {
    return this.create(
      {
        title: `${action} ${entityType}: ${description}`,
        entityType,
        entityId,
        action,
        changeDescription: description,
        beforeJson: beforeData ? JSON.stringify(beforeData) : undefined,
        afterJson: afterData ? JSON.stringify(afterData) : undefined,
      },
      user
    );
  }
}

// =============================================================================
// COMBINED ADMIN SERVICE
// =============================================================================

export const AdminSharePointService = {
  userRoles: AdminUserRoleService,
  auditLog: AdminAuditLogService,
};