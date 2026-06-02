import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import {
  approvalRulesAtom,
  workflowDefinitionsAtom,
  formRegistryAtom,
  userRoleAssignmentsAtom,
  systemSettingsAtom,
  auditLogAtom,
  adminActiveTabAtom,
  adminStatsAtom,
  getApprovalRulesForFormAtom,
  activeWorkflowsAtom,
  activeFormsAtom,
} from '@/store/admin-config-store';
import type {
  ApprovalRoutingRule,
  WorkflowDefinition,
  FormRegistryEntry,
  UserRoleAssignment,
  SystemSetting,
  AuditLogEntry,
  EntityType,
  ActionType,
} from '@/types/admin-config';
import { useUser } from './use-user';

const generateId = () => crypto.randomUUID();
const now = () => new Date().toISOString();

// ========== AUDIT LOG HOOK ==========

export function useAuditLog() {
  const [auditLog, setAuditLog] = useAtom(auditLogAtom);
  const { data: user } = useUser();

  const addEntry = useCallback((entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'changedBy' | 'changedByEmail'>) => {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: generateId(),
      timestamp: now(),
      changedBy: user?.fullName || 'Unknown',
      changedByEmail: user?.userPrincipalName || 'unknown@ioi.com',
    };
    setAuditLog(prev => [newEntry, ...prev]);
    return newEntry;
  }, [setAuditLog, user]);

  return { auditLog, addEntry };
}

// ========== APPROVAL ROUTING HOOK ==========

export function useApprovalRouting() {
  const [rules, setRules] = useAtom(approvalRulesAtom);
  const { addEntry } = useAuditLog();
  const { data: user } = useUser();

  const createRule = useCallback((rule: Omit<ApprovalRoutingRule, 'id' | 'modifiedDate' | 'createdBy'>) => {
    const newRule: ApprovalRoutingRule = {
      ...rule,
      id: generateId(),
      createdBy: user?.userPrincipalName,
      modifiedBy: user?.userPrincipalName,
      modifiedDate: now(),
    };
    setRules(prev => [...prev, newRule]);
    addEntry({
      title: `Created routing rule: ${newRule.title}`,
      entityType: 'ROUTING',
      entityId: newRule.id,
      action: 'CREATE',
      afterJson: JSON.stringify(newRule),
      changeDescription: `Created new approval routing rule for ${rule.formCode} (${rule.departmentCode})`,
    });
    return newRule;
  }, [setRules, addEntry, user]);

  const updateRule = useCallback((id: string, updates: Partial<ApprovalRoutingRule>) => {
    let oldRule: ApprovalRoutingRule | undefined;
    setRules(prev => prev.map(r => {
      if (r.id === id) {
        oldRule = r;
        return { ...r, ...updates, modifiedBy: user?.userPrincipalName, modifiedDate: now() };
      }
      return r;
    }));
    if (oldRule) {
      addEntry({
        title: `Updated routing rule: ${oldRule.title}`,
        entityType: 'ROUTING',
        entityId: id,
        action: 'UPDATE',
        beforeJson: JSON.stringify(oldRule),
        afterJson: JSON.stringify({ ...oldRule, ...updates }),
        changeDescription: `Updated approval routing rule`,
      });
    }
  }, [setRules, addEntry, user]);

  const deleteRule = useCallback((id: string) => {
    let deletedRule: ApprovalRoutingRule | undefined;
    setRules(prev => {
      deletedRule = prev.find(r => r.id === id);
      return prev.filter(r => r.id !== id);
    });
    if (deletedRule) {
      addEntry({
        title: `Deleted routing rule: ${deletedRule.title}`,
        entityType: 'ROUTING',
        entityId: id,
        action: 'DELETE',
        beforeJson: JSON.stringify(deletedRule),
        changeDescription: `Deleted approval routing rule for ${deletedRule.formCode}`,
      });
    }
  }, [setRules, addEntry]);

  const toggleRuleActive = useCallback((id: string) => {
    let rule: ApprovalRoutingRule | undefined;
    setRules(prev => prev.map(r => {
      if (r.id === id) {
        rule = r;
        return { ...r, isActive: !r.isActive, modifiedBy: user?.userPrincipalName, modifiedDate: now() };
      }
      return r;
    }));
    if (rule) {
      addEntry({
        title: `${rule.isActive ? 'Deactivated' : 'Activated'} routing rule: ${rule.title}`,
        entityType: 'ROUTING',
        entityId: id,
        action: rule.isActive ? 'DEACTIVATE' : 'ACTIVATE',
        changeDescription: `${rule.isActive ? 'Deactivated' : 'Activated'} routing rule for ${rule.formCode}`,
      });
    }
  }, [setRules, addEntry, user]);

  const getRulesForForm = useAtomValue(getApprovalRulesForFormAtom);

  return { rules, createRule, updateRule, deleteRule, toggleRuleActive, getRulesForForm };
}

// ========== WORKFLOW DEFINITIONS HOOK ==========

export function useWorkflowDefinitions() {
  const [workflows, setWorkflows] = useAtom(workflowDefinitionsAtom);
  const activeWorkflows = useAtomValue(activeWorkflowsAtom);
  const { addEntry } = useAuditLog();
  const { data: user } = useUser();

  const createWorkflow = useCallback((workflow: Omit<WorkflowDefinition, 'id' | 'modifiedDate' | 'createdBy' | 'version'>) => {
    const newWorkflow: WorkflowDefinition = {
      ...workflow,
      id: generateId(),
      version: 1,
      createdBy: user?.userPrincipalName,
      modifiedBy: user?.userPrincipalName,
      modifiedDate: now(),
    };
    setWorkflows(prev => [...prev, newWorkflow]);
    addEntry({
      title: `Created workflow: ${newWorkflow.title}`,
      entityType: 'WORKFLOW',
      entityId: newWorkflow.id,
      action: 'CREATE',
      afterJson: JSON.stringify(newWorkflow),
      changeDescription: `Created new workflow definition: ${workflow.workflowCode}`,
    });
    return newWorkflow;
  }, [setWorkflows, addEntry, user]);

  const updateWorkflow = useCallback((id: string, updates: Partial<WorkflowDefinition>) => {
    let oldWorkflow: WorkflowDefinition | undefined;
    setWorkflows(prev => prev.map(w => {
      if (w.id === id) {
        oldWorkflow = w;
        return { ...w, ...updates, version: w.version + 1, modifiedBy: user?.userPrincipalName, modifiedDate: now() };
      }
      return w;
    }));
    if (oldWorkflow) {
      addEntry({
        title: `Updated workflow: ${oldWorkflow.title}`,
        entityType: 'WORKFLOW',
        entityId: id,
        action: 'UPDATE',
        beforeJson: JSON.stringify(oldWorkflow),
        afterJson: JSON.stringify({ ...oldWorkflow, ...updates }),
        changeDescription: `Updated workflow definition (v${oldWorkflow.version} -> v${oldWorkflow.version + 1})`,
      });
    }
  }, [setWorkflows, addEntry, user]);

  const deleteWorkflow = useCallback((id: string) => {
    let deleted: WorkflowDefinition | undefined;
    setWorkflows(prev => {
      deleted = prev.find(w => w.id === id);
      return prev.filter(w => w.id !== id);
    });
    if (deleted) {
      addEntry({
        title: `Deleted workflow: ${deleted.title}`,
        entityType: 'WORKFLOW',
        entityId: id,
        action: 'DELETE',
        beforeJson: JSON.stringify(deleted),
        changeDescription: `Deleted workflow definition: ${deleted.workflowCode}`,
      });
    }
  }, [setWorkflows, addEntry]);

  return { workflows, activeWorkflows, createWorkflow, updateWorkflow, deleteWorkflow };
}

// ========== FORM REGISTRY HOOK ==========

export function useFormRegistry() {
  const [forms, setForms] = useAtom(formRegistryAtom);
  const activeForms = useAtomValue(activeFormsAtom);
  const { addEntry } = useAuditLog();
  const { data: user } = useUser();

  const createForm = useCallback((form: Omit<FormRegistryEntry, 'id' | 'modifiedDate' | 'createdBy'>) => {
    const newForm: FormRegistryEntry = {
      ...form,
      id: generateId(),
      createdBy: user?.userPrincipalName,
      modifiedBy: user?.userPrincipalName,
      modifiedDate: now(),
    };
    setForms(prev => [...prev, newForm]);
    addEntry({
      title: `Created form: ${newForm.title}`,
      entityType: 'FORM',
      entityId: newForm.id,
      action: 'CREATE',
      afterJson: JSON.stringify(newForm),
      changeDescription: `Created new form registry entry: ${form.formCode}`,
    });
    return newForm;
  }, [setForms, addEntry, user]);

  const updateForm = useCallback((id: string, updates: Partial<FormRegistryEntry>) => {
    let oldForm: FormRegistryEntry | undefined;
    setForms(prev => prev.map(f => {
      if (f.id === id) {
        oldForm = f;
        return { ...f, ...updates, modifiedBy: user?.userPrincipalName, modifiedDate: now() };
      }
      return f;
    }));
    if (oldForm) {
      addEntry({
        title: `Updated form: ${oldForm.title}`,
        entityType: 'FORM',
        entityId: id,
        action: 'UPDATE',
        beforeJson: JSON.stringify(oldForm),
        afterJson: JSON.stringify({ ...oldForm, ...updates }),
        changeDescription: `Updated form registry entry`,
      });
    }
  }, [setForms, addEntry, user]);

  const deleteForm = useCallback((id: string) => {
    let deleted: FormRegistryEntry | undefined;
    setForms(prev => {
      deleted = prev.find(f => f.id === id);
      return prev.filter(f => f.id !== id);
    });
    if (deleted) {
      addEntry({
        title: `Deleted form: ${deleted.title}`,
        entityType: 'FORM',
        entityId: id,
        action: 'DELETE',
        beforeJson: JSON.stringify(deleted),
        changeDescription: `Deleted form registry entry: ${deleted.formCode}`,
      });
    }
  }, [setForms, addEntry]);

  const toggleFormActive = useCallback((id: string) => {
    let form: FormRegistryEntry | undefined;
    setForms(prev => prev.map(f => {
      if (f.id === id) {
        form = f;
        return { ...f, isActive: !f.isActive, modifiedBy: user?.userPrincipalName, modifiedDate: now() };
      }
      return f;
    }));
    if (form) {
      addEntry({
        title: `${form.isActive ? 'Deactivated' : 'Activated'} form: ${form.title}`,
        entityType: 'FORM',
        entityId: id,
        action: form.isActive ? 'DEACTIVATE' : 'ACTIVATE',
        changeDescription: `${form.isActive ? 'Deactivated' : 'Activated'} form: ${form.formCode}`,
      });
    }
  }, [setForms, addEntry, user]);

  return { forms, activeForms, createForm, updateForm, deleteForm, toggleFormActive };
}

// ========== USER ROLE ASSIGNMENTS HOOK ==========

export function useUserRoleAssignments() {
  const [assignments, setAssignments] = useAtom(userRoleAssignmentsAtom);
  const { addEntry } = useAuditLog();
  const { data: user } = useUser();

  const createAssignment = useCallback((assignment: Omit<UserRoleAssignment, 'id' | 'modifiedDate' | 'createdBy' | 'title'>) => {
    const newAssignment: UserRoleAssignment = {
      ...assignment,
      id: generateId(),
      title: `${assignment.userPrincipalName}|${assignment.roleKey}`,
      createdBy: user?.userPrincipalName,
      modifiedBy: user?.userPrincipalName,
      modifiedDate: now(),
    };
    setAssignments(prev => [...prev, newAssignment]);
    addEntry({
      title: `Created role assignment: ${newAssignment.title}`,
      entityType: 'ROLE',
      entityId: newAssignment.id,
      action: 'CREATE',
      afterJson: JSON.stringify(newAssignment),
      changeDescription: `Assigned ${assignment.roleKey} role to ${assignment.userPrincipalName}`,
    });
    return newAssignment;
  }, [setAssignments, addEntry, user]);

  const updateAssignment = useCallback((id: string, updates: Partial<UserRoleAssignment>) => {
    let old: UserRoleAssignment | undefined;
    setAssignments(prev => prev.map(a => {
      if (a.id === id) {
        old = a;
        return { ...a, ...updates, modifiedBy: user?.userPrincipalName, modifiedDate: now() };
      }
      return a;
    }));
    if (old) {
      addEntry({
        title: `Updated role assignment: ${old.title}`,
        entityType: 'ROLE',
        entityId: id,
        action: 'UPDATE',
        beforeJson: JSON.stringify(old),
        afterJson: JSON.stringify({ ...old, ...updates }),
        changeDescription: `Updated role assignment for ${old.userPrincipalName}`,
      });
    }
  }, [setAssignments, addEntry, user]);

  const deleteAssignment = useCallback((id: string) => {
    let deleted: UserRoleAssignment | undefined;
    setAssignments(prev => {
      deleted = prev.find(a => a.id === id);
      return prev.filter(a => a.id !== id);
    });
    if (deleted) {
      addEntry({
        title: `Deleted role assignment: ${deleted.title}`,
        entityType: 'ROLE',
        entityId: id,
        action: 'DELETE',
        beforeJson: JSON.stringify(deleted),
        changeDescription: `Removed ${deleted.roleKey} role from ${deleted.userPrincipalName}`,
      });
    }
  }, [setAssignments, addEntry]);

  const toggleAssignmentActive = useCallback((id: string) => {
    let assignment: UserRoleAssignment | undefined;
    setAssignments(prev => prev.map(a => {
      if (a.id === id) {
        assignment = a;
        return { ...a, isActive: !a.isActive, modifiedBy: user?.userPrincipalName, modifiedDate: now() };
      }
      return a;
    }));
    if (assignment) {
      addEntry({
        title: `${assignment.isActive ? 'Deactivated' : 'Activated'} role: ${assignment.title}`,
        entityType: 'ROLE',
        entityId: id,
        action: assignment.isActive ? 'DEACTIVATE' : 'ACTIVATE',
        changeDescription: `${assignment.isActive ? 'Deactivated' : 'Activated'} ${assignment.roleKey} role for ${assignment.userPrincipalName}`,
      });
    }
  }, [setAssignments, addEntry, user]);

  return { assignments, createAssignment, updateAssignment, deleteAssignment, toggleAssignmentActive };
}

// ========== SYSTEM SETTINGS HOOK ==========

export function useSystemSettings() {
  const [settings, setSettings] = useAtom(systemSettingsAtom);
  const { addEntry } = useAuditLog();
  const { data: user } = useUser();

  const updateSetting = useCallback((id: string, newValue: string) => {
    let oldSetting: SystemSetting | undefined;
    setSettings(prev => prev.map(s => {
      if (s.id === id) {
        oldSetting = s;
        return { ...s, settingValue: newValue, modifiedBy: user?.userPrincipalName, modifiedDate: now() };
      }
      return s;
    }));
    if (oldSetting) {
      addEntry({
        title: `Updated setting: ${oldSetting.title}`,
        entityType: 'SETTING',
        entityId: id,
        action: 'UPDATE',
        beforeJson: JSON.stringify({ value: oldSetting.settingValue }),
        afterJson: JSON.stringify({ value: newValue }),
        changeDescription: `Changed ${oldSetting.settingKey} from "${oldSetting.settingValue}" to "${newValue}"`,
      });
    }
  }, [setSettings, addEntry, user]);

  const getSettingValue = useCallback((key: string) => {
    const setting = settings.find(s => s.settingKey === key);
    return setting?.settingValue;
  }, [settings]);

  const getSettingAsNumber = useCallback((key: string, defaultValue: number = 0) => {
    const value = getSettingValue(key);
    return value ? parseInt(value, 10) : defaultValue;
  }, [getSettingValue]);

  const getSettingAsBoolean = useCallback((key: string, defaultValue: boolean = false) => {
    const value = getSettingValue(key);
    return value ? value === 'true' : defaultValue;
  }, [getSettingValue]);

  return { settings, updateSetting, getSettingValue, getSettingAsNumber, getSettingAsBoolean };
}

// ========== ADMIN STATS HOOK ==========

export function useAdminStats() {
  return useAtomValue(adminStatsAtom);
}

// ========== ADMIN TAB HOOK ==========

export function useAdminActiveTab() {
  return useAtom(adminActiveTabAtom);
}