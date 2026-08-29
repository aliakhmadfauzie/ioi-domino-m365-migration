import { atom } from "jotai";
import type {
  ApprovalRoutingRule,
  WorkflowDefinition,
  FormRegistryEntry,
  UserRoleAssignment,
  SystemSetting,
  AuditLogEntry,
} from "@/types/admin-config";

export const approvalRulesAtom = atom<ApprovalRoutingRule[]>([]);
export const workflowDefinitionsAtom = atom<WorkflowDefinition[]>([]);
export const formRegistryAtom = atom<FormRegistryEntry[]>([]);
export const userRoleAssignmentsAtom = atom<UserRoleAssignment[]>([]);
export const systemSettingsAtom = atom<SystemSetting[]>([]);
export const auditLogAtom = atom<AuditLogEntry[]>([]);

export const adminActiveTabAtom = atom<string>("overview");

export interface AdminStats {
  totalUsers: number;
  totalForms: number;
  activeForms: number;
  totalWorkflows: number;
  activeWorkflows: number;
  totalRules: number;
  activeRules: number;
  totalApprovalRules: number;
  activeApprovalRules: number;
  totalRoleAssignments: number;
  activeRoleAssignments: number;
  pendingApprovals: number;
}

export const adminStatsAtom = atom<AdminStats>({
  totalUsers: 0,
  totalForms: 0,
  activeForms: 0,
  totalWorkflows: 0,
  activeWorkflows: 0,
  totalRules: 0,
  activeRules: 0,
  totalApprovalRules: 0,
  activeApprovalRules: 0,
  totalRoleAssignments: 0,
  activeRoleAssignments: 0,
  pendingApprovals: 0,
});

export const getApprovalRulesForFormAtom = atom(
  (get) => (formCode: string) =>
    get(approvalRulesAtom).filter((r) => r.formCode === formCode && r.isActive)
);

export const activeWorkflowsAtom = atom<WorkflowDefinition[]>(
  (get) => get(workflowDefinitionsAtom).filter((w) => w.isActive)
);

export const activeFormsAtom = atom<FormRegistryEntry[]>(
  (get) => get(formRegistryAtom).filter((f) => f.isActive)
);
