--- FILE: apps/ioi-platform/src/generated/hooks/index.ts ---
export * from './use-approval-history-str';
export * from './use-ops-log-hr';
export * from './use-qaaction-items';
export * from './use-main-dbstr';
export * from './use-main-dbhr';
export * from './use-main-dbqa';
export * from './use-assignments-str';
export * from './use-attachment-index-hr';
export * from './use-attachment-index-str';
export * from './use-hrappraisal-records';
export * from './use-main-dbfin';
export * from './use-line-items-str';
export * from './use-main-dbprd';
export * from './use-workflow-audit-log';
export * from './use-main-dbshe';
export * from './use-qasub-action-items';
export * from './use-issue-and-bug-tracker';
export * from './use-qahaccpreview-record';
export * from './use-config-employee-directory';
export * from './use-main-dbit';
export * from './use-itforms';
export * from './use-main-dbitext-support';
export * from './use-main-dbitext-sap';
export * from './use-user-roles-it';
export * from './use-approval-history-qa';
export * from './use-hrhealth-register';
export * from './use-approval-records';
export * from './use-approval-history-hr';
export * from './use-config-companies';
export * from './use-config-departments';
export * from './use-itrouting-matrix';
export * from './use-user-roles';
export * from './use-app-settings';
export * from './use-config-notes-admin-routing';
export * from './use-audit-logs';
export * from './use-audit-log-hr';
export * from './use-config-global-user-role-assignments';
export * from './use-approval-history-she';
export * from './use-main-dbitext-assets';
export * from './use-hrrouting-matrix';
export * from './use-route-permissions';
export * from './use-itm1rsbanks';
export * from './use-main-dbitext-access';
export * from './use-policies';
export * from './use-user-profiles';
export * from './use-hrinterview-pipeline';
export * from './use-itm1rssapclient';
export * from './use-config-approver-matrix';
export * from './use-itm1rssystems-list';
export * from './use-itm1sfarservers';
export * from './use-lookup-targetb1de9795563e48c399a31430234dc6e2';

export const HAS_IN_MEMORY_TABLES = false as const;
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-app-settings.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppSettingsService } from "../services/app-settings-service";
import type { AppSettings } from "../models/app-settings-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all AppSettings records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, categoryKey, dataTypeKey, description, isEditable, settingKey, settingValue
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useAppSettingsList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["appSettings-list", options],
    queryFn: () => AppSettingsService.getAll(options),
  });
}

/**
 * Retrieve a single AppSettings record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useAppSettings(id: string) {
  return useQuery({
    queryKey: ["appSettings", id],
    queryFn: () => AppSettingsService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new AppSettings record.
 * @remarks Form validation: use CreateAppSettingsSchema with zodResolver for type-safe create forms
 */
export function useCreateAppSettings() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<AppSettings, "id">) => AppSettingsService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["appSettings-list"] });
    },
  });
}

/**
 * Update an existing AppSettings record.
 * @remarks Form validation: use UpdateAppSettingsSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateAppSettings() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<AppSettings, "id">>;
    }) => AppSettingsService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["appSettings-list"] });
      client.invalidateQueries({ queryKey: ["appSettings", variables.id] });
    },
  });
}

/**
 * Delete a AppSettings record by its unique identifier.
 */
export function useDeleteAppSettings() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AppSettingsService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["appSettings-list"] });
      client.invalidateQueries({ queryKey: ["appSettings", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const AppSettings_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { AppSettingsSchema, CreateAppSettingsSchema, UpdateAppSettingsSchema } from "../validators/app-settings-validator";
export type { AppSettingsInput, CreateAppSettingsInput, UpdateAppSettingsInput } from "../validators/app-settings-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-approval-history-hr.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApprovalHistoryHRService } from "../services/approval-history-hr-service";
import type { ApprovalHistoryHR } from "../models/approval-history-hr-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ApprovalHistoryHR records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, actionbyemail, actionbyname, actioncode, actioncomment, actionon, appname, fromstate, historyid, parentid, recordid, siteKey, tostate
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useApprovalHistoryHRList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["approvalHistoryHR-list", options],
    queryFn: () => ApprovalHistoryHRService.getAll(options),
  });
}

/**
 * Retrieve a single ApprovalHistoryHR record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useApprovalHistoryHR(id: string) {
  return useQuery({
    queryKey: ["approvalHistoryHR", id],
    queryFn: () => ApprovalHistoryHRService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ApprovalHistoryHR record.
 * @remarks Form validation: use CreateApprovalHistoryHRSchema with zodResolver for type-safe create forms
 */
export function useCreateApprovalHistoryHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ApprovalHistoryHR, "id">) => ApprovalHistoryHRService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["approvalHistoryHR-list"] });
    },
  });
}

/**
 * Update an existing ApprovalHistoryHR record.
 * @remarks Form validation: use UpdateApprovalHistoryHRSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateApprovalHistoryHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ApprovalHistoryHR, "id">>;
    }) => ApprovalHistoryHRService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["approvalHistoryHR-list"] });
      client.invalidateQueries({ queryKey: ["approvalHistoryHR", variables.id] });
    },
  });
}

/**
 * Delete a ApprovalHistoryHR record by its unique identifier.
 */
export function useDeleteApprovalHistoryHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ApprovalHistoryHRService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["approvalHistoryHR-list"] });
      client.invalidateQueries({ queryKey: ["approvalHistoryHR", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ApprovalHistoryHR_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ApprovalHistoryHRSchema, CreateApprovalHistoryHRSchema, UpdateApprovalHistoryHRSchema } from "../validators/approval-history-hr-validator";
export type { ApprovalHistoryHRInput, CreateApprovalHistoryHRInput, UpdateApprovalHistoryHRInput } from "../validators/approval-history-hr-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-approval-history-qa.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApprovalHistoryQAService } from "../services/approval-history-qa-service";
import type { ApprovalHistoryQA } from "../models/approval-history-qa-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ApprovalHistoryQA records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, actionByEmail, actionByName, actionCode, actionComment, actionOn, appName, fromState, historyID, parentID, recordID, siteKey, toState
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useApprovalHistoryQAList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["approvalHistoryQA-list", options],
    queryFn: () => ApprovalHistoryQAService.getAll(options),
  });
}

/**
 * Retrieve a single ApprovalHistoryQA record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useApprovalHistoryQA(id: string) {
  return useQuery({
    queryKey: ["approvalHistoryQA", id],
    queryFn: () => ApprovalHistoryQAService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ApprovalHistoryQA record.
 * @remarks Form validation: use CreateApprovalHistoryQASchema with zodResolver for type-safe create forms
 */
export function useCreateApprovalHistoryQA() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ApprovalHistoryQA, "id">) => ApprovalHistoryQAService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["approvalHistoryQA-list"] });
    },
  });
}

/**
 * Update an existing ApprovalHistoryQA record.
 * @remarks Form validation: use UpdateApprovalHistoryQASchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateApprovalHistoryQA() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ApprovalHistoryQA, "id">>;
    }) => ApprovalHistoryQAService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["approvalHistoryQA-list"] });
      client.invalidateQueries({ queryKey: ["approvalHistoryQA", variables.id] });
    },
  });
}

/**
 * Delete a ApprovalHistoryQA record by its unique identifier.
 */
export function useDeleteApprovalHistoryQA() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ApprovalHistoryQAService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["approvalHistoryQA-list"] });
      client.invalidateQueries({ queryKey: ["approvalHistoryQA", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ApprovalHistoryQA_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ApprovalHistoryQASchema, CreateApprovalHistoryQASchema, UpdateApprovalHistoryQASchema } from "../validators/approval-history-qa-validator";
export type { ApprovalHistoryQAInput, CreateApprovalHistoryQAInput, UpdateApprovalHistoryQAInput } from "../validators/approval-history-qa-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-approval-history-she.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApprovalHistorySHEService } from "../services/approval-history-she-service";
import type { ApprovalHistorySHE } from "../models/approval-history-she-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ApprovalHistorySHE records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, actionByEmail, actionCode, actionComment, actionOn, appName, fromState, historyID, parentID, recordID, toState
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useApprovalHistorySHEList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["approvalHistorySHE-list", options],
    queryFn: () => ApprovalHistorySHEService.getAll(options),
  });
}

/**
 * Retrieve a single ApprovalHistorySHE record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useApprovalHistorySHE(id: string) {
  return useQuery({
    queryKey: ["approvalHistorySHE", id],
    queryFn: () => ApprovalHistorySHEService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ApprovalHistorySHE record.
 * @remarks Form validation: use CreateApprovalHistorySHESchema with zodResolver for type-safe create forms
 */
export function useCreateApprovalHistorySHE() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ApprovalHistorySHE, "id">) => ApprovalHistorySHEService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["approvalHistorySHE-list"] });
    },
  });
}

/**
 * Update an existing ApprovalHistorySHE record.
 * @remarks Form validation: use UpdateApprovalHistorySHESchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateApprovalHistorySHE() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ApprovalHistorySHE, "id">>;
    }) => ApprovalHistorySHEService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["approvalHistorySHE-list"] });
      client.invalidateQueries({ queryKey: ["approvalHistorySHE", variables.id] });
    },
  });
}

/**
 * Delete a ApprovalHistorySHE record by its unique identifier.
 */
export function useDeleteApprovalHistorySHE() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ApprovalHistorySHEService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["approvalHistorySHE-list"] });
      client.invalidateQueries({ queryKey: ["approvalHistorySHE", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ApprovalHistorySHE_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ApprovalHistorySHESchema, CreateApprovalHistorySHESchema, UpdateApprovalHistorySHESchema } from "../validators/approval-history-she-validator";
export type { ApprovalHistorySHEInput, CreateApprovalHistorySHEInput, UpdateApprovalHistorySHEInput } from "../validators/approval-history-she-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-approval-history-str.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApprovalHistorySTRService } from "../services/approval-history-str-service";
import type { ApprovalHistorySTR } from "../models/approval-history-str-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ApprovalHistorySTR records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, actionByEmail, actionByName, actionCode, actionComment, actionOn, appName, fromState, historyID, parentID, recordID, siteKey, toState
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useApprovalHistorySTRList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["approvalHistorySTR-list", options],
    queryFn: () => ApprovalHistorySTRService.getAll(options),
  });
}

/**
 * Retrieve a single ApprovalHistorySTR record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useApprovalHistorySTR(id: string) {
  return useQuery({
    queryKey: ["approvalHistorySTR", id],
    queryFn: () => ApprovalHistorySTRService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ApprovalHistorySTR record.
 * @remarks Form validation: use CreateApprovalHistorySTRSchema with zodResolver for type-safe create forms
 */
export function useCreateApprovalHistorySTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ApprovalHistorySTR, "id">) => ApprovalHistorySTRService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["approvalHistorySTR-list"] });
    },
  });
}

/**
 * Update an existing ApprovalHistorySTR record.
 * @remarks Form validation: use UpdateApprovalHistorySTRSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateApprovalHistorySTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ApprovalHistorySTR, "id">>;
    }) => ApprovalHistorySTRService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["approvalHistorySTR-list"] });
      client.invalidateQueries({ queryKey: ["approvalHistorySTR", variables.id] });
    },
  });
}

/**
 * Delete a ApprovalHistorySTR record by its unique identifier.
 */
export function useDeleteApprovalHistorySTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ApprovalHistorySTRService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["approvalHistorySTR-list"] });
      client.invalidateQueries({ queryKey: ["approvalHistorySTR", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ApprovalHistorySTR_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ApprovalHistorySTRSchema, CreateApprovalHistorySTRSchema, UpdateApprovalHistorySTRSchema } from "../validators/approval-history-str-validator";
export type { ApprovalHistorySTRInput, CreateApprovalHistorySTRInput, UpdateApprovalHistorySTRInput } from "../validators/approval-history-str-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-approval-records.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApprovalRecordsService } from "../services/approval-records-service";
import type { ApprovalRecords } from "../models/approval-records-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ApprovalRecords records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, stagename, actionbyid, actionbyname, actiondate, actionKey, comments, formcode, formid, nextstage, stagenumber
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useApprovalRecordsList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["approvalRecords-list", options],
    queryFn: () => ApprovalRecordsService.getAll(options),
  });
}

/**
 * Retrieve a single ApprovalRecords record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useApprovalRecords(id: string) {
  return useQuery({
    queryKey: ["approvalRecords", id],
    queryFn: () => ApprovalRecordsService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ApprovalRecords record.
 * @remarks Form validation: use CreateApprovalRecordsSchema with zodResolver for type-safe create forms
 */
export function useCreateApprovalRecords() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ApprovalRecords, "id">) => ApprovalRecordsService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["approvalRecords-list"] });
    },
  });
}

/**
 * Update an existing ApprovalRecords record.
 * @remarks Form validation: use UpdateApprovalRecordsSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateApprovalRecords() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ApprovalRecords, "id">>;
    }) => ApprovalRecordsService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["approvalRecords-list"] });
      client.invalidateQueries({ queryKey: ["approvalRecords", variables.id] });
    },
  });
}

/**
 * Delete a ApprovalRecords record by its unique identifier.
 */
export function useDeleteApprovalRecords() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ApprovalRecordsService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["approvalRecords-list"] });
      client.invalidateQueries({ queryKey: ["approvalRecords", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ApprovalRecords_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ApprovalRecordsSchema, CreateApprovalRecordsSchema, UpdateApprovalRecordsSchema } from "../validators/approval-records-validator";
export type { ApprovalRecordsInput, CreateApprovalRecordsInput, UpdateApprovalRecordsInput } from "../validators/approval-records-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-assignments-str.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AssignmentsSTRService } from "../services/assignments-str-service";
import type { AssignmentsSTR } from "../models/assignments-str-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all AssignmentsSTR records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appName, assignedOn, assignedRole, assignedToEmail, assignmentID, completedOn, completionStatus, dueDate, escalationLevel, nextReminderDate, recordID, remarks, reminderDate, siteKey, taskType
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useAssignmentsSTRList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["assignmentsSTR-list", options],
    queryFn: () => AssignmentsSTRService.getAll(options),
  });
}

/**
 * Retrieve a single AssignmentsSTR record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useAssignmentsSTR(id: string) {
  return useQuery({
    queryKey: ["assignmentsSTR", id],
    queryFn: () => AssignmentsSTRService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new AssignmentsSTR record.
 * @remarks Form validation: use CreateAssignmentsSTRSchema with zodResolver for type-safe create forms
 */
export function useCreateAssignmentsSTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<AssignmentsSTR, "id">) => AssignmentsSTRService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["assignmentsSTR-list"] });
    },
  });
}

/**
 * Update an existing AssignmentsSTR record.
 * @remarks Form validation: use UpdateAssignmentsSTRSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateAssignmentsSTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<AssignmentsSTR, "id">>;
    }) => AssignmentsSTRService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["assignmentsSTR-list"] });
      client.invalidateQueries({ queryKey: ["assignmentsSTR", variables.id] });
    },
  });
}

/**
 * Delete a AssignmentsSTR record by its unique identifier.
 */
export function useDeleteAssignmentsSTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AssignmentsSTRService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["assignmentsSTR-list"] });
      client.invalidateQueries({ queryKey: ["assignmentsSTR", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const AssignmentsSTR_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { AssignmentsSTRSchema, CreateAssignmentsSTRSchema, UpdateAssignmentsSTRSchema } from "../validators/assignments-str-validator";
export type { AssignmentsSTRInput, CreateAssignmentsSTRInput, UpdateAssignmentsSTRInput } from "../validators/assignments-str-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-attachment-index-hr.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AttachmentIndexHRService } from "../services/attachment-index-hr-service";
import type { AttachmentIndexHR } from "../models/attachment-index-hr-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all AttachmentIndexHR records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appName, attachmentID, fileName, fileURL, recordID, siteKey, uploadedBy, uploadedOn
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useAttachmentIndexHRList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["attachmentIndexHR-list", options],
    queryFn: () => AttachmentIndexHRService.getAll(options),
  });
}

/**
 * Retrieve a single AttachmentIndexHR record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useAttachmentIndexHR(id: string) {
  return useQuery({
    queryKey: ["attachmentIndexHR", id],
    queryFn: () => AttachmentIndexHRService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new AttachmentIndexHR record.
 * @remarks Form validation: use CreateAttachmentIndexHRSchema with zodResolver for type-safe create forms
 */
export function useCreateAttachmentIndexHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<AttachmentIndexHR, "id">) => AttachmentIndexHRService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["attachmentIndexHR-list"] });
    },
  });
}

/**
 * Update an existing AttachmentIndexHR record.
 * @remarks Form validation: use UpdateAttachmentIndexHRSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateAttachmentIndexHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<AttachmentIndexHR, "id">>;
    }) => AttachmentIndexHRService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["attachmentIndexHR-list"] });
      client.invalidateQueries({ queryKey: ["attachmentIndexHR", variables.id] });
    },
  });
}

/**
 * Delete a AttachmentIndexHR record by its unique identifier.
 */
export function useDeleteAttachmentIndexHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AttachmentIndexHRService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["attachmentIndexHR-list"] });
      client.invalidateQueries({ queryKey: ["attachmentIndexHR", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const AttachmentIndexHR_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { AttachmentIndexHRSchema, CreateAttachmentIndexHRSchema, UpdateAttachmentIndexHRSchema } from "../validators/attachment-index-hr-validator";
export type { AttachmentIndexHRInput, CreateAttachmentIndexHRInput, UpdateAttachmentIndexHRInput } from "../validators/attachment-index-hr-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-attachment-index-str.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AttachmentIndexSTRService } from "../services/attachment-index-str-service";
import type { AttachmentIndexSTR } from "../models/attachment-index-str-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all AttachmentIndexSTR records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appName, attachmentCategory, attachmentID, fileHash, fileName, fileSizeKB, fileUrl, isMandatory, recordID, site1Key, siteKey, uploadedBy, uploadedOn
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useAttachmentIndexSTRList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["attachmentIndexSTR-list", options],
    queryFn: () => AttachmentIndexSTRService.getAll(options),
  });
}

/**
 * Retrieve a single AttachmentIndexSTR record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useAttachmentIndexSTR(id: string) {
  return useQuery({
    queryKey: ["attachmentIndexSTR", id],
    queryFn: () => AttachmentIndexSTRService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new AttachmentIndexSTR record.
 * @remarks Form validation: use CreateAttachmentIndexSTRSchema with zodResolver for type-safe create forms
 */
export function useCreateAttachmentIndexSTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<AttachmentIndexSTR, "id">) => AttachmentIndexSTRService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["attachmentIndexSTR-list"] });
    },
  });
}

/**
 * Update an existing AttachmentIndexSTR record.
 * @remarks Form validation: use UpdateAttachmentIndexSTRSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateAttachmentIndexSTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<AttachmentIndexSTR, "id">>;
    }) => AttachmentIndexSTRService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["attachmentIndexSTR-list"] });
      client.invalidateQueries({ queryKey: ["attachmentIndexSTR", variables.id] });
    },
  });
}

/**
 * Delete a AttachmentIndexSTR record by its unique identifier.
 */
export function useDeleteAttachmentIndexSTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AttachmentIndexSTRService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["attachmentIndexSTR-list"] });
      client.invalidateQueries({ queryKey: ["attachmentIndexSTR", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const AttachmentIndexSTR_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { AttachmentIndexSTRSchema, CreateAttachmentIndexSTRSchema, UpdateAttachmentIndexSTRSchema } from "../validators/attachment-index-str-validator";
export type { AttachmentIndexSTRInput, CreateAttachmentIndexSTRInput, UpdateAttachmentIndexSTRInput } from "../validators/attachment-index-str-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-audit-log-hr.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuditLogHRService } from "../services/audit-log-hr-service";
import type { AuditLogHR } from "../models/audit-log-hr-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all AuditLogHR records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appName, changedBy, changedOnUTC, correlationId, fieldName, itemID, listName, newValue, oldValue, siteKey
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useAuditLogHRList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["auditLogHR-list", options],
    queryFn: () => AuditLogHRService.getAll(options),
  });
}

/**
 * Retrieve a single AuditLogHR record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useAuditLogHR(id: string) {
  return useQuery({
    queryKey: ["auditLogHR", id],
    queryFn: () => AuditLogHRService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new AuditLogHR record.
 * @remarks Form validation: use CreateAuditLogHRSchema with zodResolver for type-safe create forms
 */
export function useCreateAuditLogHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<AuditLogHR, "id">) => AuditLogHRService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["auditLogHR-list"] });
    },
  });
}

/**
 * Update an existing AuditLogHR record.
 * @remarks Form validation: use UpdateAuditLogHRSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateAuditLogHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<AuditLogHR, "id">>;
    }) => AuditLogHRService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["auditLogHR-list"] });
      client.invalidateQueries({ queryKey: ["auditLogHR", variables.id] });
    },
  });
}

/**
 * Delete a AuditLogHR record by its unique identifier.
 */
export function useDeleteAuditLogHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AuditLogHRService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["auditLogHR-list"] });
      client.invalidateQueries({ queryKey: ["auditLogHR", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const AuditLogHR_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { AuditLogHRSchema, CreateAuditLogHRSchema, UpdateAuditLogHRSchema } from "../validators/audit-log-hr-validator";
export type { AuditLogHRInput, CreateAuditLogHRInput, UpdateAuditLogHRInput } from "../validators/audit-log-hr-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-audit-logs.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuditLogsService } from "../services/audit-logs-service";
import type { AuditLogs } from "../models/audit-logs-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all AuditLogs records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, actionKey, departmentKey, details, iPAddress, resourceID, resourceType, timestamp, userID
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useAuditLogsList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["auditLogs-list", options],
    queryFn: () => AuditLogsService.getAll(options),
  });
}

/**
 * Retrieve a single AuditLogs record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useAuditLogs(id: string) {
  return useQuery({
    queryKey: ["auditLogs", id],
    queryFn: () => AuditLogsService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new AuditLogs record.
 * @remarks Form validation: use CreateAuditLogsSchema with zodResolver for type-safe create forms
 */
export function useCreateAuditLogs() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<AuditLogs, "id">) => AuditLogsService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["auditLogs-list"] });
    },
  });
}

/**
 * Update an existing AuditLogs record.
 * @remarks Form validation: use UpdateAuditLogsSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateAuditLogs() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<AuditLogs, "id">>;
    }) => AuditLogsService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["auditLogs-list"] });
      client.invalidateQueries({ queryKey: ["auditLogs", variables.id] });
    },
  });
}

/**
 * Delete a AuditLogs record by its unique identifier.
 */
export function useDeleteAuditLogs() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AuditLogsService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["auditLogs-list"] });
      client.invalidateQueries({ queryKey: ["auditLogs", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const AuditLogs_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { AuditLogsSchema, CreateAuditLogsSchema, UpdateAuditLogsSchema } from "../validators/audit-logs-validator";
export type { AuditLogsInput, CreateAuditLogsInput, UpdateAuditLogsInput } from "../validators/audit-logs-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-config-approver-matrix.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfigApproverMatrixService } from "../services/config-approver-matrix-service";
import type { ConfigApproverMatrix } from "../models/config-approver-matrix-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ConfigApproverMatrix records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, category, configKey, configValue, description
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useConfigApproverMatrixList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["configApproverMatrix-list", options],
    queryFn: () => ConfigApproverMatrixService.getAll(options),
  });
}

/**
 * Retrieve a single ConfigApproverMatrix record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useConfigApproverMatrix(id: string) {
  return useQuery({
    queryKey: ["configApproverMatrix", id],
    queryFn: () => ConfigApproverMatrixService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ConfigApproverMatrix record.
 * @remarks Form validation: use CreateConfigApproverMatrixSchema with zodResolver for type-safe create forms
 */
export function useCreateConfigApproverMatrix() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ConfigApproverMatrix, "id">) => ConfigApproverMatrixService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["configApproverMatrix-list"] });
    },
  });
}

/**
 * Update an existing ConfigApproverMatrix record.
 * @remarks Form validation: use UpdateConfigApproverMatrixSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateConfigApproverMatrix() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ConfigApproverMatrix, "id">>;
    }) => ConfigApproverMatrixService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["configApproverMatrix-list"] });
      client.invalidateQueries({ queryKey: ["configApproverMatrix", variables.id] });
    },
  });
}

/**
 * Delete a ConfigApproverMatrix record by its unique identifier.
 */
export function useDeleteConfigApproverMatrix() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ConfigApproverMatrixService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["configApproverMatrix-list"] });
      client.invalidateQueries({ queryKey: ["configApproverMatrix", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ConfigApproverMatrix_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ConfigApproverMatrixSchema, CreateConfigApproverMatrixSchema, UpdateConfigApproverMatrixSchema } from "../validators/config-approver-matrix-validator";
export type { ConfigApproverMatrixInput, CreateConfigApproverMatrixInput, UpdateConfigApproverMatrixInput } from "../validators/config-approver-matrix-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-config-companies.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfigCompaniesService } from "../services/config-companies-service";
import type { ConfigCompanies } from "../models/config-companies-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ConfigCompanies records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, category, configKey, configValue, description
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useConfigCompaniesList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["configCompanies-list", options],
    queryFn: () => ConfigCompaniesService.getAll(options),
  });
}

/**
 * Retrieve a single ConfigCompanies record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useConfigCompanies(id: string) {
  return useQuery({
    queryKey: ["configCompanies", id],
    queryFn: () => ConfigCompaniesService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ConfigCompanies record.
 * @remarks Form validation: use CreateConfigCompaniesSchema with zodResolver for type-safe create forms
 */
export function useCreateConfigCompanies() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ConfigCompanies, "id">) => ConfigCompaniesService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["configCompanies-list"] });
    },
  });
}

/**
 * Update an existing ConfigCompanies record.
 * @remarks Form validation: use UpdateConfigCompaniesSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateConfigCompanies() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ConfigCompanies, "id">>;
    }) => ConfigCompaniesService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["configCompanies-list"] });
      client.invalidateQueries({ queryKey: ["configCompanies", variables.id] });
    },
  });
}

/**
 * Delete a ConfigCompanies record by its unique identifier.
 */
export function useDeleteConfigCompanies() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ConfigCompaniesService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["configCompanies-list"] });
      client.invalidateQueries({ queryKey: ["configCompanies", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ConfigCompanies_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ConfigCompaniesSchema, CreateConfigCompaniesSchema, UpdateConfigCompaniesSchema } from "../validators/config-companies-validator";
export type { ConfigCompaniesInput, CreateConfigCompaniesInput, UpdateConfigCompaniesInput } from "../validators/config-companies-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-config-departments.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfigDepartmentsService } from "../services/config-departments-service";
import type { ConfigDepartments } from "../models/config-departments-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ConfigDepartments records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, category, configKey, configValue, description
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useConfigDepartmentsList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["configDepartments-list", options],
    queryFn: () => ConfigDepartmentsService.getAll(options),
  });
}

/**
 * Retrieve a single ConfigDepartments record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useConfigDepartments(id: string) {
  return useQuery({
    queryKey: ["configDepartments", id],
    queryFn: () => ConfigDepartmentsService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ConfigDepartments record.
 * @remarks Form validation: use CreateConfigDepartmentsSchema with zodResolver for type-safe create forms
 */
export function useCreateConfigDepartments() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ConfigDepartments, "id">) => ConfigDepartmentsService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["configDepartments-list"] });
    },
  });
}

/**
 * Update an existing ConfigDepartments record.
 * @remarks Form validation: use UpdateConfigDepartmentsSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateConfigDepartments() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ConfigDepartments, "id">>;
    }) => ConfigDepartmentsService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["configDepartments-list"] });
      client.invalidateQueries({ queryKey: ["configDepartments", variables.id] });
    },
  });
}

/**
 * Delete a ConfigDepartments record by its unique identifier.
 */
export function useDeleteConfigDepartments() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ConfigDepartmentsService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["configDepartments-list"] });
      client.invalidateQueries({ queryKey: ["configDepartments", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ConfigDepartments_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ConfigDepartmentsSchema, CreateConfigDepartmentsSchema, UpdateConfigDepartmentsSchema } from "../validators/config-departments-validator";
export type { ConfigDepartmentsInput, CreateConfigDepartmentsInput, UpdateConfigDepartmentsInput } from "../validators/config-departments-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-config-employee-directory.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfigEmployeeDirectoryService } from "../services/config-employee-directory-service";
import type { ConfigEmployeeDirectory } from "../models/config-employee-directory-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ConfigEmployeeDirectory records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, category, configKey, configValue, description
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useConfigEmployeeDirectoryList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["configEmployeeDirectory-list", options],
    queryFn: () => ConfigEmployeeDirectoryService.getAll(options),
  });
}

/**
 * Retrieve a single ConfigEmployeeDirectory record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useConfigEmployeeDirectory(id: string) {
  return useQuery({
    queryKey: ["configEmployeeDirectory", id],
    queryFn: () => ConfigEmployeeDirectoryService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ConfigEmployeeDirectory record.
 * @remarks Form validation: use CreateConfigEmployeeDirectorySchema with zodResolver for type-safe create forms
 */
export function useCreateConfigEmployeeDirectory() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ConfigEmployeeDirectory, "id">) => ConfigEmployeeDirectoryService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["configEmployeeDirectory-list"] });
    },
  });
}

/**
 * Update an existing ConfigEmployeeDirectory record.
 * @remarks Form validation: use UpdateConfigEmployeeDirectorySchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateConfigEmployeeDirectory() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ConfigEmployeeDirectory, "id">>;
    }) => ConfigEmployeeDirectoryService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["configEmployeeDirectory-list"] });
      client.invalidateQueries({ queryKey: ["configEmployeeDirectory", variables.id] });
    },
  });
}

/**
 * Delete a ConfigEmployeeDirectory record by its unique identifier.
 */
export function useDeleteConfigEmployeeDirectory() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ConfigEmployeeDirectoryService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["configEmployeeDirectory-list"] });
      client.invalidateQueries({ queryKey: ["configEmployeeDirectory", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ConfigEmployeeDirectory_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ConfigEmployeeDirectorySchema, CreateConfigEmployeeDirectorySchema, UpdateConfigEmployeeDirectorySchema } from "../validators/config-employee-directory-validator";
export type { ConfigEmployeeDirectoryInput, CreateConfigEmployeeDirectoryInput, UpdateConfigEmployeeDirectoryInput } from "../validators/config-employee-directory-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-config-global-user-role-assignments.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfigGlobalUserRoleAssignmentsService } from "../services/config-global-user-role-assignments-service";
import type { ConfigGlobalUserRoleAssignments } from "../models/config-global-user-role-assignments-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ConfigGlobalUserRoleAssignments records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, assignmentScopeKey, departmentScope, isActive, moduleScope, notes, roleKey, userPrincipalName
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useConfigGlobalUserRoleAssignmentsList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["configGlobalUserRoleAssignments-list", options],
    queryFn: () => ConfigGlobalUserRoleAssignmentsService.getAll(options),
  });
}

/**
 * Retrieve a single ConfigGlobalUserRoleAssignments record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useConfigGlobalUserRoleAssignments(id: string) {
  return useQuery({
    queryKey: ["configGlobalUserRoleAssignments", id],
    queryFn: () => ConfigGlobalUserRoleAssignmentsService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ConfigGlobalUserRoleAssignments record.
 * @remarks Form validation: use CreateConfigGlobalUserRoleAssignmentsSchema with zodResolver for type-safe create forms
 */
export function useCreateConfigGlobalUserRoleAssignments() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ConfigGlobalUserRoleAssignments, "id">) => ConfigGlobalUserRoleAssignmentsService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["configGlobalUserRoleAssignments-list"] });
    },
  });
}

/**
 * Update an existing ConfigGlobalUserRoleAssignments record.
 * @remarks Form validation: use UpdateConfigGlobalUserRoleAssignmentsSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateConfigGlobalUserRoleAssignments() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ConfigGlobalUserRoleAssignments, "id">>;
    }) => ConfigGlobalUserRoleAssignmentsService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["configGlobalUserRoleAssignments-list"] });
      client.invalidateQueries({ queryKey: ["configGlobalUserRoleAssignments", variables.id] });
    },
  });
}

/**
 * Delete a ConfigGlobalUserRoleAssignments record by its unique identifier.
 */
export function useDeleteConfigGlobalUserRoleAssignments() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ConfigGlobalUserRoleAssignmentsService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["configGlobalUserRoleAssignments-list"] });
      client.invalidateQueries({ queryKey: ["configGlobalUserRoleAssignments", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ConfigGlobalUserRoleAssignments_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ConfigGlobalUserRoleAssignmentsSchema, CreateConfigGlobalUserRoleAssignmentsSchema, UpdateConfigGlobalUserRoleAssignmentsSchema } from "../validators/config-global-user-role-assignments-validator";
export type { ConfigGlobalUserRoleAssignmentsInput, CreateConfigGlobalUserRoleAssignmentsInput, UpdateConfigGlobalUserRoleAssignmentsInput } from "../validators/config-global-user-role-assignments-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-config-notes-admin-routing.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfigNotesAdminRoutingService } from "../services/config-notes-admin-routing-service";
import type { ConfigNotesAdminRouting } from "../models/config-notes-admin-routing-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ConfigNotesAdminRouting records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, category, configKey, configValue, description
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useConfigNotesAdminRoutingList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["configNotesAdminRouting-list", options],
    queryFn: () => ConfigNotesAdminRoutingService.getAll(options),
  });
}

/**
 * Retrieve a single ConfigNotesAdminRouting record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useConfigNotesAdminRouting(id: string) {
  return useQuery({
    queryKey: ["configNotesAdminRouting", id],
    queryFn: () => ConfigNotesAdminRoutingService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ConfigNotesAdminRouting record.
 * @remarks Form validation: use CreateConfigNotesAdminRoutingSchema with zodResolver for type-safe create forms
 */
export function useCreateConfigNotesAdminRouting() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ConfigNotesAdminRouting, "id">) => ConfigNotesAdminRoutingService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["configNotesAdminRouting-list"] });
    },
  });
}

/**
 * Update an existing ConfigNotesAdminRouting record.
 * @remarks Form validation: use UpdateConfigNotesAdminRoutingSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateConfigNotesAdminRouting() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ConfigNotesAdminRouting, "id">>;
    }) => ConfigNotesAdminRoutingService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["configNotesAdminRouting-list"] });
      client.invalidateQueries({ queryKey: ["configNotesAdminRouting", variables.id] });
    },
  });
}

/**
 * Delete a ConfigNotesAdminRouting record by its unique identifier.
 */
export function useDeleteConfigNotesAdminRouting() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ConfigNotesAdminRoutingService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["configNotesAdminRouting-list"] });
      client.invalidateQueries({ queryKey: ["configNotesAdminRouting", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ConfigNotesAdminRouting_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ConfigNotesAdminRoutingSchema, CreateConfigNotesAdminRoutingSchema, UpdateConfigNotesAdminRoutingSchema } from "../validators/config-notes-admin-routing-validator";
export type { ConfigNotesAdminRoutingInput, CreateConfigNotesAdminRoutingInput, UpdateConfigNotesAdminRoutingInput } from "../validators/config-notes-admin-routing-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-hrappraisal-records.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HRAppraisalRecordsService } from "../services/hr-appraisal-records-service";
import type { HRAppraisalRecords } from "../models/hr-appraisal-records-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all HRAppraisalRecords records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appraisalNo, cycleYear, employeeNo, rating, reviewerEmail, statusKey
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useHRAppraisalRecordsList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["hRAppraisalRecords-list", options],
    queryFn: () => HRAppraisalRecordsService.getAll(options),
  });
}

/**
 * Retrieve a single HRAppraisalRecords record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useHRAppraisalRecords(id: string) {
  return useQuery({
    queryKey: ["hRAppraisalRecords", id],
    queryFn: () => HRAppraisalRecordsService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new HRAppraisalRecords record.
 * @remarks Form validation: use CreateHRAppraisalRecordsSchema with zodResolver for type-safe create forms
 */
export function useCreateHRAppraisalRecords() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<HRAppraisalRecords, "id">) => HRAppraisalRecordsService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["hRAppraisalRecords-list"] });
    },
  });
}

/**
 * Update an existing HRAppraisalRecords record.
 * @remarks Form validation: use UpdateHRAppraisalRecordsSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateHRAppraisalRecords() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<HRAppraisalRecords, "id">>;
    }) => HRAppraisalRecordsService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["hRAppraisalRecords-list"] });
      client.invalidateQueries({ queryKey: ["hRAppraisalRecords", variables.id] });
    },
  });
}

/**
 * Delete a HRAppraisalRecords record by its unique identifier.
 */
export function useDeleteHRAppraisalRecords() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => HRAppraisalRecordsService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["hRAppraisalRecords-list"] });
      client.invalidateQueries({ queryKey: ["hRAppraisalRecords", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const HRAppraisalRecords_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { HRAppraisalRecordsSchema, CreateHRAppraisalRecordsSchema, UpdateHRAppraisalRecordsSchema } from "../validators/hrappraisal-records-validator";
export type { HRAppraisalRecordsInput, CreateHRAppraisalRecordsInput, UpdateHRAppraisalRecordsInput } from "../validators/hrappraisal-records-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-hrhealth-register.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HRHealthRegisterService } from "../services/hr-health-register-service";
import type { HRHealthRegister } from "../models/hr-health-register-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all HRHealthRegister records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, employeeNo, healthItem, recordNo, result, site1Key, siteKey, statusKey
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useHRHealthRegisterList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["hRHealthRegister-list", options],
    queryFn: () => HRHealthRegisterService.getAll(options),
  });
}

/**
 * Retrieve a single HRHealthRegister record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useHRHealthRegister(id: string) {
  return useQuery({
    queryKey: ["hRHealthRegister", id],
    queryFn: () => HRHealthRegisterService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new HRHealthRegister record.
 * @remarks Form validation: use CreateHRHealthRegisterSchema with zodResolver for type-safe create forms
 */
export function useCreateHRHealthRegister() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<HRHealthRegister, "id">) => HRHealthRegisterService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["hRHealthRegister-list"] });
    },
  });
}

/**
 * Update an existing HRHealthRegister record.
 * @remarks Form validation: use UpdateHRHealthRegisterSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateHRHealthRegister() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<HRHealthRegister, "id">>;
    }) => HRHealthRegisterService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["hRHealthRegister-list"] });
      client.invalidateQueries({ queryKey: ["hRHealthRegister", variables.id] });
    },
  });
}

/**
 * Delete a HRHealthRegister record by its unique identifier.
 */
export function useDeleteHRHealthRegister() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => HRHealthRegisterService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["hRHealthRegister-list"] });
      client.invalidateQueries({ queryKey: ["hRHealthRegister", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const HRHealthRegister_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { HRHealthRegisterSchema, CreateHRHealthRegisterSchema, UpdateHRHealthRegisterSchema } from "../validators/hrhealth-register-validator";
export type { HRHealthRegisterInput, CreateHRHealthRegisterInput, UpdateHRHealthRegisterInput } from "../validators/hrhealth-register-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-hrinterview-pipeline.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HRInterviewPipelineService } from "../services/hr-interview-pipeline-service";
import type { HRInterviewPipeline } from "../models/hr-interview-pipeline-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all HRInterviewPipeline records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, candidateName, ownerEmail, pipelineNo, position, site1Key, siteKey, stage
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useHRInterviewPipelineList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["hRInterviewPipeline-list", options],
    queryFn: () => HRInterviewPipelineService.getAll(options),
  });
}

/**
 * Retrieve a single HRInterviewPipeline record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useHRInterviewPipeline(id: string) {
  return useQuery({
    queryKey: ["hRInterviewPipeline", id],
    queryFn: () => HRInterviewPipelineService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new HRInterviewPipeline record.
 * @remarks Form validation: use CreateHRInterviewPipelineSchema with zodResolver for type-safe create forms
 */
export function useCreateHRInterviewPipeline() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<HRInterviewPipeline, "id">) => HRInterviewPipelineService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["hRInterviewPipeline-list"] });
    },
  });
}

/**
 * Update an existing HRInterviewPipeline record.
 * @remarks Form validation: use UpdateHRInterviewPipelineSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateHRInterviewPipeline() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<HRInterviewPipeline, "id">>;
    }) => HRInterviewPipelineService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["hRInterviewPipeline-list"] });
      client.invalidateQueries({ queryKey: ["hRInterviewPipeline", variables.id] });
    },
  });
}

/**
 * Delete a HRInterviewPipeline record by its unique identifier.
 */
export function useDeleteHRInterviewPipeline() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => HRInterviewPipelineService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["hRInterviewPipeline-list"] });
      client.invalidateQueries({ queryKey: ["hRInterviewPipeline", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const HRInterviewPipeline_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { HRInterviewPipelineSchema, CreateHRInterviewPipelineSchema, UpdateHRInterviewPipelineSchema } from "../validators/hrinterview-pipeline-validator";
export type { HRInterviewPipelineInput, CreateHRInterviewPipelineInput, UpdateHRInterviewPipelineInput } from "../validators/hrinterview-pipeline-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-hrrouting-matrix.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HRRoutingMatrixService } from "../services/hr-routing-matrix-service";
import type { HRRoutingMatrix } from "../models/hr-routing-matrix-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all HRRoutingMatrix records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appCode, approverTypeKey, approverValue, backupApproverEmail, department, formName, isActive, site1Key, siteKey, stageKey, stageNo
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useHRRoutingMatrixList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["hRRoutingMatrix-list", options],
    queryFn: () => HRRoutingMatrixService.getAll(options),
  });
}

/**
 * Retrieve a single HRRoutingMatrix record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useHRRoutingMatrix(id: string) {
  return useQuery({
    queryKey: ["hRRoutingMatrix", id],
    queryFn: () => HRRoutingMatrixService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new HRRoutingMatrix record.
 * @remarks Form validation: use CreateHRRoutingMatrixSchema with zodResolver for type-safe create forms
 */
export function useCreateHRRoutingMatrix() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<HRRoutingMatrix, "id">) => HRRoutingMatrixService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["hRRoutingMatrix-list"] });
    },
  });
}

/**
 * Update an existing HRRoutingMatrix record.
 * @remarks Form validation: use UpdateHRRoutingMatrixSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateHRRoutingMatrix() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<HRRoutingMatrix, "id">>;
    }) => HRRoutingMatrixService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["hRRoutingMatrix-list"] });
      client.invalidateQueries({ queryKey: ["hRRoutingMatrix", variables.id] });
    },
  });
}

/**
 * Delete a HRRoutingMatrix record by its unique identifier.
 */
export function useDeleteHRRoutingMatrix() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => HRRoutingMatrixService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["hRRoutingMatrix-list"] });
      client.invalidateQueries({ queryKey: ["hRRoutingMatrix", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const HRRoutingMatrix_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { HRRoutingMatrixSchema, CreateHRRoutingMatrixSchema, UpdateHRRoutingMatrixSchema } from "../validators/hrrouting-matrix-validator";
export type { HRRoutingMatrixInput, CreateHRRoutingMatrixInput, UpdateHRRoutingMatrixInput } from "../validators/hrrouting-matrix-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-issue-and-bug-tracker.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IssueAndBugTrackerService } from "../services/issue-and-bug-tracker-service";
import type { IssueAndBugTracker } from "../models/issue-and-bug-tracker-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all IssueAndBugTracker records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, comment, department, formCode, issueDescription, priorityKey, statusKey
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useIssueAndBugTrackerList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["issueAndBugTracker-list", options],
    queryFn: () => IssueAndBugTrackerService.getAll(options),
  });
}

/**
 * Retrieve a single IssueAndBugTracker record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useIssueAndBugTracker(id: string) {
  return useQuery({
    queryKey: ["issueAndBugTracker", id],
    queryFn: () => IssueAndBugTrackerService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new IssueAndBugTracker record.
 * @remarks Form validation: use CreateIssueAndBugTrackerSchema with zodResolver for type-safe create forms
 */
export function useCreateIssueAndBugTracker() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<IssueAndBugTracker, "id">) => IssueAndBugTrackerService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["issueAndBugTracker-list"] });
    },
  });
}

/**
 * Update an existing IssueAndBugTracker record.
 * @remarks Form validation: use UpdateIssueAndBugTrackerSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateIssueAndBugTracker() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<IssueAndBugTracker, "id">>;
    }) => IssueAndBugTrackerService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["issueAndBugTracker-list"] });
      client.invalidateQueries({ queryKey: ["issueAndBugTracker", variables.id] });
    },
  });
}

/**
 * Delete a IssueAndBugTracker record by its unique identifier.
 */
export function useDeleteIssueAndBugTracker() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => IssueAndBugTrackerService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["issueAndBugTracker-list"] });
      client.invalidateQueries({ queryKey: ["issueAndBugTracker", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const IssueAndBugTracker_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { IssueAndBugTrackerSchema, CreateIssueAndBugTrackerSchema, UpdateIssueAndBugTrackerSchema } from "../validators/issue-and-bug-tracker-validator";
export type { IssueAndBugTrackerInput, CreateIssueAndBugTrackerInput, UpdateIssueAndBugTrackerInput } from "../validators/issue-and-bug-tracker-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-itforms.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ITFormsService } from "../services/it-forms-service";
import type { ITForms } from "../models/it-forms-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ITForms records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, applicantName, comments, createdDate, currentAction, currentStage, department, designation, environmentTagKey, formCode, justification, modifiedDate, siteKey, statusKey, submittedByID, submittedByName, submittedDate
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useITFormsList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["iTForms-list", options],
    queryFn: () => ITFormsService.getAll(options),
  });
}

/**
 * Retrieve a single ITForms record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useITForms(id: string) {
  return useQuery({
    queryKey: ["iTForms", id],
    queryFn: () => ITFormsService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ITForms record.
 * @remarks Form validation: use CreateITFormsSchema with zodResolver for type-safe create forms
 */
export function useCreateITForms() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ITForms, "id">) => ITFormsService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["iTForms-list"] });
    },
  });
}

/**
 * Update an existing ITForms record.
 * @remarks Form validation: use UpdateITFormsSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateITForms() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ITForms, "id">>;
    }) => ITFormsService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["iTForms-list"] });
      client.invalidateQueries({ queryKey: ["iTForms", variables.id] });
    },
  });
}

/**
 * Delete a ITForms record by its unique identifier.
 */
export function useDeleteITForms() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ITFormsService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["iTForms-list"] });
      client.invalidateQueries({ queryKey: ["iTForms", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ITForms_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ITFormsSchema, CreateITFormsSchema, UpdateITFormsSchema } from "../validators/itforms-validator";
export type { ITFormsInput, CreateITFormsInput, UpdateITFormsInput } from "../validators/itforms-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-itm1rsbanks.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ITM1RSBanksService } from "../services/itm1rs-banks-service";
import type { ITM1RSBanks } from "../models/itm1rs-banks-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ITM1RSBanks records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useITM1RSBanksList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["iTM1RSBanks-list", options],
    queryFn: () => ITM1RSBanksService.getAll(options),
  });
}

/**
 * Retrieve a single ITM1RSBanks record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useITM1RSBanks(id: string) {
  return useQuery({
    queryKey: ["iTM1RSBanks", id],
    queryFn: () => ITM1RSBanksService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ITM1RSBanks record.
 * @remarks Form validation: use CreateITM1RSBanksSchema with zodResolver for type-safe create forms
 */
export function useCreateITM1RSBanks() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ITM1RSBanks, "id">) => ITM1RSBanksService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["iTM1RSBanks-list"] });
    },
  });
}

/**
 * Update an existing ITM1RSBanks record.
 * @remarks Form validation: use UpdateITM1RSBanksSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateITM1RSBanks() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ITM1RSBanks, "id">>;
    }) => ITM1RSBanksService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["iTM1RSBanks-list"] });
      client.invalidateQueries({ queryKey: ["iTM1RSBanks", variables.id] });
    },
  });
}

/**
 * Delete a ITM1RSBanks record by its unique identifier.
 */
export function useDeleteITM1RSBanks() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ITM1RSBanksService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["iTM1RSBanks-list"] });
      client.invalidateQueries({ queryKey: ["iTM1RSBanks", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ITM1RSBanks_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ITM1RSBanksSchema, CreateITM1RSBanksSchema, UpdateITM1RSBanksSchema } from "../validators/itm1rsbanks-validator";
export type { ITM1RSBanksInput, CreateITM1RSBanksInput, UpdateITM1RSBanksInput } from "../validators/itm1rsbanks-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-itm1rssapclient.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ITM1RSSAPClientService } from "../services/itm1rssap-client-service";
import type { ITM1RSSAPClient } from "../models/itm1rssap-client-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ITM1RSSAPClient records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useITM1RSSAPClientList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["iTM1RSSAPClient-list", options],
    queryFn: () => ITM1RSSAPClientService.getAll(options),
  });
}

/**
 * Retrieve a single ITM1RSSAPClient record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useITM1RSSAPClient(id: string) {
  return useQuery({
    queryKey: ["iTM1RSSAPClient", id],
    queryFn: () => ITM1RSSAPClientService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ITM1RSSAPClient record.
 * @remarks Form validation: use CreateITM1RSSAPClientSchema with zodResolver for type-safe create forms
 */
export function useCreateITM1RSSAPClient() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ITM1RSSAPClient, "id">) => ITM1RSSAPClientService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["iTM1RSSAPClient-list"] });
    },
  });
}

/**
 * Update an existing ITM1RSSAPClient record.
 * @remarks Form validation: use UpdateITM1RSSAPClientSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateITM1RSSAPClient() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ITM1RSSAPClient, "id">>;
    }) => ITM1RSSAPClientService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["iTM1RSSAPClient-list"] });
      client.invalidateQueries({ queryKey: ["iTM1RSSAPClient", variables.id] });
    },
  });
}

/**
 * Delete a ITM1RSSAPClient record by its unique identifier.
 */
export function useDeleteITM1RSSAPClient() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ITM1RSSAPClientService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["iTM1RSSAPClient-list"] });
      client.invalidateQueries({ queryKey: ["iTM1RSSAPClient", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ITM1RSSAPClient_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ITM1RSSAPClientSchema, CreateITM1RSSAPClientSchema, UpdateITM1RSSAPClientSchema } from "../validators/itm1rssapclient-validator";
export type { ITM1RSSAPClientInput, CreateITM1RSSAPClientInput, UpdateITM1RSSAPClientInput } from "../validators/itm1rssapclient-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-itm1rssystems-list.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ITM1RSSystemsListService } from "../services/itm1rs-systems-list-service";
import type { ITM1RSSystemsList } from "../models/itm1rs-systems-list-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ITM1RSSystemsList records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useITM1RSSystemsListList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["iTM1RSSystemsList-list", options],
    queryFn: () => ITM1RSSystemsListService.getAll(options),
  });
}

/**
 * Retrieve a single ITM1RSSystemsList record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useITM1RSSystemsList(id: string) {
  return useQuery({
    queryKey: ["iTM1RSSystemsList", id],
    queryFn: () => ITM1RSSystemsListService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ITM1RSSystemsList record.
 * @remarks Form validation: use CreateITM1RSSystemsListSchema with zodResolver for type-safe create forms
 */
export function useCreateITM1RSSystemsList() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ITM1RSSystemsList, "id">) => ITM1RSSystemsListService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["iTM1RSSystemsList-list"] });
    },
  });
}

/**
 * Update an existing ITM1RSSystemsList record.
 * @remarks Form validation: use UpdateITM1RSSystemsListSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateITM1RSSystemsList() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ITM1RSSystemsList, "id">>;
    }) => ITM1RSSystemsListService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["iTM1RSSystemsList-list"] });
      client.invalidateQueries({ queryKey: ["iTM1RSSystemsList", variables.id] });
    },
  });
}

/**
 * Delete a ITM1RSSystemsList record by its unique identifier.
 */
export function useDeleteITM1RSSystemsList() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ITM1RSSystemsListService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["iTM1RSSystemsList-list"] });
      client.invalidateQueries({ queryKey: ["iTM1RSSystemsList", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ITM1RSSystemsList_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ITM1RSSystemsListSchema, CreateITM1RSSystemsListSchema, UpdateITM1RSSystemsListSchema } from "../validators/itm1rssystems-list-validator";
export type { ITM1RSSystemsListInput, CreateITM1RSSystemsListInput, UpdateITM1RSSystemsListInput } from "../validators/itm1rssystems-list-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-itm1sfarservers.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ITM1SFARServersService } from "../services/itm1sfar-servers-service";
import type { ITM1SFARServers } from "../models/itm1sfar-servers-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ITM1SFARServers records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useITM1SFARServersList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["iTM1SFARServers-list", options],
    queryFn: () => ITM1SFARServersService.getAll(options),
  });
}

/**
 * Retrieve a single ITM1SFARServers record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useITM1SFARServers(id: string) {
  return useQuery({
    queryKey: ["iTM1SFARServers", id],
    queryFn: () => ITM1SFARServersService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ITM1SFARServers record.
 * @remarks Form validation: use CreateITM1SFARServersSchema with zodResolver for type-safe create forms
 */
export function useCreateITM1SFARServers() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ITM1SFARServers, "id">) => ITM1SFARServersService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["iTM1SFARServers-list"] });
    },
  });
}

/**
 * Update an existing ITM1SFARServers record.
 * @remarks Form validation: use UpdateITM1SFARServersSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateITM1SFARServers() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ITM1SFARServers, "id">>;
    }) => ITM1SFARServersService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["iTM1SFARServers-list"] });
      client.invalidateQueries({ queryKey: ["iTM1SFARServers", variables.id] });
    },
  });
}

/**
 * Delete a ITM1SFARServers record by its unique identifier.
 */
export function useDeleteITM1SFARServers() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ITM1SFARServersService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["iTM1SFARServers-list"] });
      client.invalidateQueries({ queryKey: ["iTM1SFARServers", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ITM1SFARServers_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ITM1SFARServersSchema, CreateITM1SFARServersSchema, UpdateITM1SFARServersSchema } from "../validators/itm1sfarservers-validator";
export type { ITM1SFARServersInput, CreateITM1SFARServersInput, UpdateITM1SFARServersInput } from "../validators/itm1sfarservers-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-itrouting-matrix.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ITRoutingMatrixService } from "../services/it-routing-matrix-service";
import type { ITRoutingMatrix } from "../models/it-routing-matrix-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ITRoutingMatrix records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, approverRole, approverSPGroup, escalationDays, formName, isActive, siteScopeKey, stageKey, stageLabel
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useITRoutingMatrixList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["iTRoutingMatrix-list", options],
    queryFn: () => ITRoutingMatrixService.getAll(options),
  });
}

/**
 * Retrieve a single ITRoutingMatrix record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useITRoutingMatrix(id: string) {
  return useQuery({
    queryKey: ["iTRoutingMatrix", id],
    queryFn: () => ITRoutingMatrixService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ITRoutingMatrix record.
 * @remarks Form validation: use CreateITRoutingMatrixSchema with zodResolver for type-safe create forms
 */
export function useCreateITRoutingMatrix() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ITRoutingMatrix, "id">) => ITRoutingMatrixService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["iTRoutingMatrix-list"] });
    },
  });
}

/**
 * Update an existing ITRoutingMatrix record.
 * @remarks Form validation: use UpdateITRoutingMatrixSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateITRoutingMatrix() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ITRoutingMatrix, "id">>;
    }) => ITRoutingMatrixService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["iTRoutingMatrix-list"] });
      client.invalidateQueries({ queryKey: ["iTRoutingMatrix", variables.id] });
    },
  });
}

/**
 * Delete a ITRoutingMatrix record by its unique identifier.
 */
export function useDeleteITRoutingMatrix() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ITRoutingMatrixService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["iTRoutingMatrix-list"] });
      client.invalidateQueries({ queryKey: ["iTRoutingMatrix", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ITRoutingMatrix_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ITRoutingMatrixSchema, CreateITRoutingMatrixSchema, UpdateITRoutingMatrixSchema } from "../validators/itrouting-matrix-validator";
export type { ITRoutingMatrixInput, CreateITRoutingMatrixInput, UpdateITRoutingMatrixInput } from "../validators/itrouting-matrix-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-line-items-str.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LineItemsSTRService } from "../services/line-items-str-service";
import type { LineItemsSTR } from "../models/line-items-str-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all LineItemsSTR records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appName, headerID, itemDescription, lineItemID, quantity, remarks, siteKey, totalCost, unitCost
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useLineItemsSTRList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["lineItemsSTR-list", options],
    queryFn: () => LineItemsSTRService.getAll(options),
  });
}

/**
 * Retrieve a single LineItemsSTR record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useLineItemsSTR(id: string) {
  return useQuery({
    queryKey: ["lineItemsSTR", id],
    queryFn: () => LineItemsSTRService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new LineItemsSTR record.
 * @remarks Form validation: use CreateLineItemsSTRSchema with zodResolver for type-safe create forms
 */
export function useCreateLineItemsSTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<LineItemsSTR, "id">) => LineItemsSTRService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["lineItemsSTR-list"] });
    },
  });
}

/**
 * Update an existing LineItemsSTR record.
 * @remarks Form validation: use UpdateLineItemsSTRSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateLineItemsSTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<LineItemsSTR, "id">>;
    }) => LineItemsSTRService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["lineItemsSTR-list"] });
      client.invalidateQueries({ queryKey: ["lineItemsSTR", variables.id] });
    },
  });
}

/**
 * Delete a LineItemsSTR record by its unique identifier.
 */
export function useDeleteLineItemsSTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => LineItemsSTRService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["lineItemsSTR-list"] });
      client.invalidateQueries({ queryKey: ["lineItemsSTR", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const LineItemsSTR_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { LineItemsSTRSchema, CreateLineItemsSTRSchema, UpdateLineItemsSTRSchema } from "../validators/line-items-str-validator";
export type { LineItemsSTRInput, CreateLineItemsSTRInput, UpdateLineItemsSTRInput } from "../validators/line-items-str-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-lookup-targetb1de9795563e48c399a31430234dc6e2.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LookupTargetb1de9795563e48c399a31430234dc6e2Service } from "../services/lookup-targetb1de9795563e48c399a31430234dc6e2-service";
import type { LookupTargetb1de9795563e48c399a31430234dc6e2 } from "../models/lookup-targetb1de9795563e48c399a31430234dc6e2-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all LookupTargetb1de9795563e48c399a31430234dc6e2 records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, approvedByEmail, approvedByName, approvedDate, comments, company, currentAction, currentApproverEmail, currentStatusKey, department, eAFApplication, eAFDDAppApprovedBy, eAFDDAppComment, eAFDDAppDate, eAFDDAppStatus, eAFDeptHeadComment, eAFDeptHeadDate, eAFDeptHeadEmail, eAFDeptHeadStatus, eAFIsPCN, eAFITCompletedBy, eAFITCompletedDate, eAFITCompletionStatus, eAFITManagerApprovedBy, eAFITManagerComment, eAFITManagerDate, eAFITManagerStatus, eAFJustification, eAFReminderTo, eAFSystemName, eAFTargetUserEmail, environmentTagKey, finalStatus, formCode, hIAssetNo, hICompany, hIComputerName, hIDepartment, hILastAuditedDate, hILocation, hIMachineID, hIMonth, hIOfficeVersion, hIPurchaseDate, hISerialNo, hIStatus, hITagNo, hIType, hIUsedByEmail, hIVendor, hIWindowsVersion, hIYear, iAL1DowntimeDuration, iAL1RebootDate, iAL1RebootedBy, iAL1RebootReason, iAL1ServerName, iAL2AccessDate, iAL2AccessReason, iAL2AttendedByPIC, iAL2ServerRoom, iAL2TimeIn, iAL2VisitorCompany, iAL2VisitorName, iAL3EventDescription, iAL3EventEndDate, iAL3EventStartDate, iAL3EventType, iAL3PreparedBy, iAL4CorrectiveActions, iAL4DateFrom, iAL4DateTo, iAL4Overview, iAL4PerformedBy, iAL4RecordType, iAL4RootCause, iAL4ServerName, iAL5BackupAdminBy, iAL5BackupMediaDate, iAL5BackupMediaName, iAL5PerformedDate, iAL5RequestedFiles, iAL5RestorationStatus, iAL5RestorePath, iNO, iOIPArchivedDate, iOIPEffectiveDate, iOIPPolicyNo, iOIPPolicyTitle, iOIPRevisionHistoryJSON, isLocked, iTDR2AssignedTo, iTDR2ClosedDate, iTDR2DueDate, iTDR2TaskDescription, iTDR2TaskStatus, iTDRActivityType, iTDRCategory, iTDRDateFrom, iTDRDateTo, iTDRParticipants, iTDRVenue, iTIAudienceGroups, iTIBroadcastType, iTIPublishedDate, iTP2AuthorEmail, iTP2DistributionGroup, iTP2ManualNo, iTP2ManualTitle, iTP2Version, iTPArchivedDate, iTPDocumentNo, iTPDocumentTitle, iTPOwnerEmail, iTPPublishedDate, iTSCChecklistYear, iTSCReviewedBy, iTSCReviewedDate, iTSCServerName, iTSSRAssignedToEmail, iTSSRCaseNo, iTSSRDateAccepted, iTSSRDateResolved, iTSSRDateStarted, iTSSRProblemCategory, iTSSRProblemDescription, iTSSRReportedByEmail, iTSSRSatisfactionRating, iTSSRServiceType, iTSSRSolution, iTSSRSupportMethod, nIRDepartment, nIRFullName, nIRHODApprovalStatus, nIRHODApprovedBy, nIRHODApprovedDate, nIRITHardwareBy, nIRITHardwareStatus, nIRNotesAdminBy, nIRNotesAdminDate, nIRNotesAdminStatus, nIRRequestType, pRFDeptManagerEmail, pRFIsSAP, pRFITApprovedDate, pRFITApprovedEmail, pRFRequestNo, pRFRequestType, remarks, requestorEmail, requestorName, rSEDApprovedBy, rSEDApprovedDate, rSITProcessedBy, rSITProcessedDate, rSNeedsEDApproval, rSRequestType, rSTargetUserEmail, sAPClient, sAPModule, sAPPlant, sAPRemarks, sAPReviewedBy, sAPReviewedDate, sAPSOFCurrentStage, sAPSOFFinalDecision, sAPSOFIsBPORequired, sAPSOFITSubmittedDate, sAPTRNumber, sFARAccessLevel, sFARFolderPath, sFARReviewedBy, sFARReviewedDate, siteKey, status, subject, submittedByEmail, submittedByName, submittedDate, uRITAdminBy, uRITAdminDate, uRSystemAccess, uRUserDepartment, uRUserFullName, workflowAuditJSON, workflowStage
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useLookupTargetb1de9795563e48c399a31430234dc6e2List(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["lookupTargetb1de9795563e48c399a31430234dc6e2-list", options],
    queryFn: () => LookupTargetb1de9795563e48c399a31430234dc6e2Service.getAll(options),
  });
}

/**
 * Retrieve a single LookupTargetb1de9795563e48c399a31430234dc6e2 record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useLookupTargetb1de9795563e48c399a31430234dc6e2(id: string) {
  return useQuery({
    queryKey: ["lookupTargetb1de9795563e48c399a31430234dc6e2", id],
    queryFn: () => LookupTargetb1de9795563e48c399a31430234dc6e2Service.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new LookupTargetb1de9795563e48c399a31430234dc6e2 record.
 * @remarks Form validation: use CreateLookupTargetb1de9795563e48c399a31430234dc6e2Schema with zodResolver for type-safe create forms
 */
export function useCreateLookupTargetb1de9795563e48c399a31430234dc6e2() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<LookupTargetb1de9795563e48c399a31430234dc6e2, "id">) => LookupTargetb1de9795563e48c399a31430234dc6e2Service.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["lookupTargetb1de9795563e48c399a31430234dc6e2-list"] });
    },
  });
}

/**
 * Update an existing LookupTargetb1de9795563e48c399a31430234dc6e2 record.
 * @remarks Form validation: use UpdateLookupTargetb1de9795563e48c399a31430234dc6e2Schema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateLookupTargetb1de9795563e48c399a31430234dc6e2() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<LookupTargetb1de9795563e48c399a31430234dc6e2, "id">>;
    }) => LookupTargetb1de9795563e48c399a31430234dc6e2Service.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["lookupTargetb1de9795563e48c399a31430234dc6e2-list"] });
      client.invalidateQueries({ queryKey: ["lookupTargetb1de9795563e48c399a31430234dc6e2", variables.id] });
    },
  });
}

/**
 * Delete a LookupTargetb1de9795563e48c399a31430234dc6e2 record by its unique identifier.
 */
export function useDeleteLookupTargetb1de9795563e48c399a31430234dc6e2() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => LookupTargetb1de9795563e48c399a31430234dc6e2Service.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["lookupTargetb1de9795563e48c399a31430234dc6e2-list"] });
      client.invalidateQueries({ queryKey: ["lookupTargetb1de9795563e48c399a31430234dc6e2", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const LookupTargetb1de9795563e48c399a31430234dc6e2_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { LookupTargetb1de9795563e48c399a31430234dc6e2Schema, CreateLookupTargetb1de9795563e48c399a31430234dc6e2Schema, UpdateLookupTargetb1de9795563e48c399a31430234dc6e2Schema } from "../validators/lookup-targetb1de9795563e48c399a31430234dc6e2-validator";
export type { LookupTargetb1de9795563e48c399a31430234dc6e2Input, CreateLookupTargetb1de9795563e48c399a31430234dc6e2Input, UpdateLookupTargetb1de9795563e48c399a31430234dc6e2Input } from "../validators/lookup-targetb1de9795563e48c399a31430234dc6e2-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-main-dbfin.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBFINService } from "../services/main-dbfin-service";
import type { MainDBFIN } from "../models/main-dbfin-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all MainDBFIN records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, amount, appName, approverRemarks, attachmentLinks, businessArea, companyKey, contractAmount, correctiveActionSummary, currentApproverDisplayName, currentApproverEmail, currentApproverGroup, currentStage, departmentKey, description, documentNo, documentType, dueDate, effectiveDate, finalStatus, formCode, formVersion, inspectedBy, inspectionDate, inspectionRemarks, inspectionTime, iRRPercent, lastImmediateProduct, module2Key, paybackPeriod, priority, problemDesc, productToLoad, qCApprovalBy, qCApprovalDate, qCApprovalStatus, quantityMT, reasonForChange, recipientHODEmail, requestedBy, requestorDisplayName, requestorEmail, requestTitle, requiresCOOApproval, responseDueDate, responseExtendedDueDate, revisionNo, rootCauseSummary, section, siteKey, statusKey, statusRequest, submittedOn, systemCode, tankNo, targetDate, urgencyReason, workflowAction
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useMainDBFINList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBFIN-list", options],
    queryFn: () => MainDBFINService.getAll(options),
  });
}

/**
 * Retrieve a single MainDBFIN record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useMainDBFIN(id: string) {
  return useQuery({
    queryKey: ["mainDBFIN", id],
    queryFn: () => MainDBFINService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new MainDBFIN record.
 * @remarks Form validation: use CreateMainDBFINSchema with zodResolver for type-safe create forms
 */
export function useCreateMainDBFIN() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBFIN, "id">) => MainDBFINService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBFIN-list"] });
    },
  });
}

/**
 * Update an existing MainDBFIN record.
 * @remarks Form validation: use UpdateMainDBFINSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateMainDBFIN() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<MainDBFIN, "id">>;
    }) => MainDBFINService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["mainDBFIN-list"] });
      client.invalidateQueries({ queryKey: ["mainDBFIN", variables.id] });
    },
  });
}

/**
 * Delete a MainDBFIN record by its unique identifier.
 */
export function useDeleteMainDBFIN() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBFINService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["mainDBFIN-list"] });
      client.invalidateQueries({ queryKey: ["mainDBFIN", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const MainDBFIN_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { MainDBFINSchema, CreateMainDBFINSchema, UpdateMainDBFINSchema } from "../validators/main-dbfin-validator";
export type { MainDBFINInput, CreateMainDBFINInput, UpdateMainDBFINInput } from "../validators/main-dbfin-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-main-dbhr.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBHRService } from "../services/main-dbhr-service";
import type { MainDBHR } from "../models/main-dbhr-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all MainDBHR records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appliedPosition, appname, approverremarks, attachmentlinks, backupPIC, businessarea, candidateName, caseStatusKey, company, correctiveactionsummary, currentapproverdisplayname, currentapproveremail, currentapprovergroup, currentstage, department, dept, description, details, division, documentno, documenttype, duedate, effectivedate, empAge, employeedepartment, employeeid, employeename, empName, empNo, ephrcompany, ephrdept, ephrfollowup, ephrfullname, ephrgender, ephrhp, ephric, ephrmedhist, ephrvision, ephrvisual, esfage, esfcategory, esfdatesubmitted, esfhr, esfit, esfservers, esfservice, esfsuggestion, exitCategoryKey, exitTypeKey, finalstatus, formcode, formType, formversion, fwwpdcomemo, fwwpdcompany, fwwpddepartment, fwwpdempno, fwwpdhostel, fwwpdname, fwwpdpassportnonew, fwwpdreason, fwwpdremark, hODEmail, inDate, iNO, inspectedby, inspectiondate, inspectionremarks, inspectiontime, jobdesignation, lastimmediateproduct, lastWorkingDay, linkedJDRefKey, linkedSRRefKey, module2Key, moduleKey, nationality, phoneExtension, pIC, pICEmail, pICPosition, priority, problemDesc, producttoload, profileDetails, qcapprovalby, qcapprovaldate, qcapprovalstatus, quantitymt, reasonforchange, reasonForLeaving, recipienthodemail, remarks, requestedby, requestordisplayname, requestoremail, requesttitle, requesttypeKey, requirescooapproval, responseduedate, responseextendedduedate, revisionno, rootcausesummary, section, siteKey, statusKey, submittedon, systemcode, systemNameKey, tankno, targetdate, urgencyreason, vacancyTitle, workerID, workerName, workflowaction
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useMainDBHRList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBHR-list", options],
    queryFn: () => MainDBHRService.getAll(options),
  });
}

/**
 * Retrieve a single MainDBHR record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useMainDBHR(id: string) {
  return useQuery({
    queryKey: ["mainDBHR", id],
    queryFn: () => MainDBHRService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new MainDBHR record.
 * @remarks Form validation: use CreateMainDBHRSchema with zodResolver for type-safe create forms
 */
export function useCreateMainDBHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBHR, "id">) => MainDBHRService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBHR-list"] });
    },
  });
}

/**
 * Update an existing MainDBHR record.
 * @remarks Form validation: use UpdateMainDBHRSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateMainDBHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<MainDBHR, "id">>;
    }) => MainDBHRService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["mainDBHR-list"] });
      client.invalidateQueries({ queryKey: ["mainDBHR", variables.id] });
    },
  });
}

/**
 * Delete a MainDBHR record by its unique identifier.
 */
export function useDeleteMainDBHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBHRService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["mainDBHR-list"] });
      client.invalidateQueries({ queryKey: ["mainDBHR", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const MainDBHR_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { MainDBHRSchema, CreateMainDBHRSchema, UpdateMainDBHRSchema } from "../validators/main-dbhr-validator";
export type { MainDBHRInput, CreateMainDBHRInput, UpdateMainDBHRInput } from "../validators/main-dbhr-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-main-dbit.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBITService } from "../services/main-dbit-service";
import type { MainDBIT } from "../models/main-dbit-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all MainDBIT records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, currentstatusKey, environmenttagKey, formcode, formTypeKey, hODApproverRemarks, hTMLEMAILTEMPLATE, islocked, remarks, requestoremail, siteKey, submitteddate, workflowstage
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useMainDBITList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBIT-list", options],
    queryFn: () => MainDBITService.getAll(options),
  });
}

/**
 * Retrieve a single MainDBIT record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useMainDBIT(id: string) {
  return useQuery({
    queryKey: ["mainDBIT", id],
    queryFn: () => MainDBITService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new MainDBIT record.
 * @remarks Form validation: use CreateMainDBITSchema with zodResolver for type-safe create forms
 */
export function useCreateMainDBIT() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBIT, "id">) => MainDBITService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBIT-list"] });
    },
  });
}

/**
 * Update an existing MainDBIT record.
 * @remarks Form validation: use UpdateMainDBITSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateMainDBIT() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<MainDBIT, "id">>;
    }) => MainDBITService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["mainDBIT-list"] });
      client.invalidateQueries({ queryKey: ["mainDBIT", variables.id] });
    },
  });
}

/**
 * Delete a MainDBIT record by its unique identifier.
 */
export function useDeleteMainDBIT() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBITService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["mainDBIT-list"] });
      client.invalidateQueries({ queryKey: ["mainDBIT", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const MainDBIT_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { MainDBITSchema, CreateMainDBITSchema, UpdateMainDBITSchema } from "../validators/main-dbit-validator";
export type { MainDBITInput, CreateMainDBITInput, UpdateMainDBITInput } from "../validators/main-dbit-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-main-dbitext-access.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBITExtAccessService } from "../services/main-dbit-ext-access-service";
import type { MainDBITExtAccess } from "../models/main-dbit-ext-access-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all MainDBITExtAccess records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, eAFApplication, eAFDDAppApprovedBy, eAFDDAppComment, eAFDDAppDate, eAFDDAppStatus, eAFDeptHeadComment, eAFDeptHeadDate, eAFDeptHeadEmail, eAFDeptHeadStatus, eAFIsPCN, eAFITCompletedBy, eAFITCompletedDate, eAFITCompletionStatus, eAFITManagerApprovedBy, eAFITManagerComment, eAFITManagerDate, eAFITManagerStatus, eAFJustification, eAFReminderTo, eAFSystemName, eAFTargetUserEmail, nIRDepartment, nIRFullName, nIRHODApprovalStatus, nIRHODApprovedBy, nIRHODApprovedDate, nIRITHardwareBy, nIRITHardwareStatus, nIRNotesAdminBy, nIRNotesAdminDate, nIRNotesAdminStatus, nIRRequestType, parentFormCode, parentSite, rSEDApprovedBy, rSEDApprovedDate, rSITProcessedBy, rSITProcessedDate, rSNeedsEDApproval, rSRequestType, rSTargetUserEmail, sFARAccessLevel, sFARFolderPath, sFARReviewedBy, sFARReviewedDate, uRITAdminBy, uRITAdminDate, uRSystemAccess, uRUserDepartment, uRUserFullName
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useMainDBITExtAccessList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBITExtAccess-list", options],
    queryFn: () => MainDBITExtAccessService.getAll(options),
  });
}

/**
 * Retrieve a single MainDBITExtAccess record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useMainDBITExtAccess(id: string) {
  return useQuery({
    queryKey: ["mainDBITExtAccess", id],
    queryFn: () => MainDBITExtAccessService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new MainDBITExtAccess record.
 * @remarks Form validation: use CreateMainDBITExtAccessSchema with zodResolver for type-safe create forms
 */
export function useCreateMainDBITExtAccess() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBITExtAccess, "id">) => MainDBITExtAccessService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBITExtAccess-list"] });
    },
  });
}

/**
 * Update an existing MainDBITExtAccess record.
 * @remarks Form validation: use UpdateMainDBITExtAccessSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateMainDBITExtAccess() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<MainDBITExtAccess, "id">>;
    }) => MainDBITExtAccessService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["mainDBITExtAccess-list"] });
      client.invalidateQueries({ queryKey: ["mainDBITExtAccess", variables.id] });
    },
  });
}

/**
 * Delete a MainDBITExtAccess record by its unique identifier.
 */
export function useDeleteMainDBITExtAccess() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBITExtAccessService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["mainDBITExtAccess-list"] });
      client.invalidateQueries({ queryKey: ["mainDBITExtAccess", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const MainDBITExtAccess_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { MainDBITExtAccessSchema, CreateMainDBITExtAccessSchema, UpdateMainDBITExtAccessSchema } from "../validators/main-dbitext-access-validator";
export type { MainDBITExtAccessInput, CreateMainDBITExtAccessInput, UpdateMainDBITExtAccessInput } from "../validators/main-dbitext-access-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-main-dbitext-assets.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBITExtAssetsService } from "../services/main-dbit-ext-assets-service";
import type { MainDBITExtAssets } from "../models/main-dbit-ext-assets-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all MainDBITExtAssets records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, hIAssetNo, hICompany, hIComputerName, hIDepartment, hILastAuditedDate, hILocation, hIMachineID, hIMonth, hIOfficeVersion, hIPurchaseDate, hISerialNo, hIStatus, hITagNo, hIType, hIUsedByEmail, hIVendor, hIWindowsVersion, hIYear, iTSCChecklistYear, iTSCReviewedBy, iTSCReviewedDate, iTSCServerName, parentFormCode, parentSite
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useMainDBITExtAssetsList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBITExtAssets-list", options],
    queryFn: () => MainDBITExtAssetsService.getAll(options),
  });
}

/**
 * Retrieve a single MainDBITExtAssets record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useMainDBITExtAssets(id: string) {
  return useQuery({
    queryKey: ["mainDBITExtAssets", id],
    queryFn: () => MainDBITExtAssetsService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new MainDBITExtAssets record.
 * @remarks Form validation: use CreateMainDBITExtAssetsSchema with zodResolver for type-safe create forms
 */
export function useCreateMainDBITExtAssets() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBITExtAssets, "id">) => MainDBITExtAssetsService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBITExtAssets-list"] });
    },
  });
}

/**
 * Update an existing MainDBITExtAssets record.
 * @remarks Form validation: use UpdateMainDBITExtAssetsSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateMainDBITExtAssets() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<MainDBITExtAssets, "id">>;
    }) => MainDBITExtAssetsService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["mainDBITExtAssets-list"] });
      client.invalidateQueries({ queryKey: ["mainDBITExtAssets", variables.id] });
    },
  });
}

/**
 * Delete a MainDBITExtAssets record by its unique identifier.
 */
export function useDeleteMainDBITExtAssets() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBITExtAssetsService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["mainDBITExtAssets-list"] });
      client.invalidateQueries({ queryKey: ["mainDBITExtAssets", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const MainDBITExtAssets_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { MainDBITExtAssetsSchema, CreateMainDBITExtAssetsSchema, UpdateMainDBITExtAssetsSchema } from "../validators/main-dbitext-assets-validator";
export type { MainDBITExtAssetsInput, CreateMainDBITExtAssetsInput, UpdateMainDBITExtAssetsInput } from "../validators/main-dbitext-assets-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-main-dbitext-sap.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBITExtSAPService } from "../services/main-dbit-ext-sap-service";
import type { MainDBITExtSAP } from "../models/main-dbit-ext-sap-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all MainDBITExtSAP records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, parentFormCode, parentSite, pRFDeptManagerEmail, pRFIsSAP, pRFITApprovedDate, pRFITApprovedEmail, pRFRequestNo, pRFRequestType, sAPClient, sAPModule, sAPPlant, sAPRemarks, sAPReviewedBy, sAPReviewedDate, sAPSOFCurrentStage, sAPSOFFinalDecision, sAPSOFIsBPORequired, sAPSOFITSubmittedDate, sAPTRNumber
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useMainDBITExtSAPList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBITExtSAP-list", options],
    queryFn: () => MainDBITExtSAPService.getAll(options),
  });
}

/**
 * Retrieve a single MainDBITExtSAP record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useMainDBITExtSAP(id: string) {
  return useQuery({
    queryKey: ["mainDBITExtSAP", id],
    queryFn: () => MainDBITExtSAPService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new MainDBITExtSAP record.
 * @remarks Form validation: use CreateMainDBITExtSAPSchema with zodResolver for type-safe create forms
 */
export function useCreateMainDBITExtSAP() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBITExtSAP, "id">) => MainDBITExtSAPService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBITExtSAP-list"] });
    },
  });
}

/**
 * Update an existing MainDBITExtSAP record.
 * @remarks Form validation: use UpdateMainDBITExtSAPSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateMainDBITExtSAP() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<MainDBITExtSAP, "id">>;
    }) => MainDBITExtSAPService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["mainDBITExtSAP-list"] });
      client.invalidateQueries({ queryKey: ["mainDBITExtSAP", variables.id] });
    },
  });
}

/**
 * Delete a MainDBITExtSAP record by its unique identifier.
 */
export function useDeleteMainDBITExtSAP() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBITExtSAPService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["mainDBITExtSAP-list"] });
      client.invalidateQueries({ queryKey: ["mainDBITExtSAP", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const MainDBITExtSAP_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { MainDBITExtSAPSchema, CreateMainDBITExtSAPSchema, UpdateMainDBITExtSAPSchema } from "../validators/main-dbitext-sap-validator";
export type { MainDBITExtSAPInput, CreateMainDBITExtSAPInput, UpdateMainDBITExtSAPInput } from "../validators/main-dbitext-sap-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-main-dbitext-support.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBITExtSupportService } from "../services/main-dbit-ext-support-service";
import type { MainDBITExtSupport } from "../models/main-dbit-ext-support-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all MainDBITExtSupport records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, iTDR2AssignedTo, iTDR2ClosedDate, iTDR2DueDate, iTDR2TaskDescription, iTDR2TaskStatus, iTDRActivityType, iTDRCategory, iTDRDateFrom, iTDRDateTo, iTDRParticipants, iTDRVenue, iTSSRAssignedToEmail, iTSSRCaseNo, iTSSRDateAccepted, iTSSRDateResolved, iTSSRDateStarted, iTSSRProblemCategory, iTSSRProblemDescription, iTSSRReportedByEmail, iTSSRSatisfactionRating, iTSSRServiceType, iTSSRSolution, iTSSRSupportMethod, parentFormCode, parentSite
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useMainDBITExtSupportList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBITExtSupport-list", options],
    queryFn: () => MainDBITExtSupportService.getAll(options),
  });
}

/**
 * Retrieve a single MainDBITExtSupport record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useMainDBITExtSupport(id: string) {
  return useQuery({
    queryKey: ["mainDBITExtSupport", id],
    queryFn: () => MainDBITExtSupportService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new MainDBITExtSupport record.
 * @remarks Form validation: use CreateMainDBITExtSupportSchema with zodResolver for type-safe create forms
 */
export function useCreateMainDBITExtSupport() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBITExtSupport, "id">) => MainDBITExtSupportService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBITExtSupport-list"] });
    },
  });
}

/**
 * Update an existing MainDBITExtSupport record.
 * @remarks Form validation: use UpdateMainDBITExtSupportSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateMainDBITExtSupport() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<MainDBITExtSupport, "id">>;
    }) => MainDBITExtSupportService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["mainDBITExtSupport-list"] });
      client.invalidateQueries({ queryKey: ["mainDBITExtSupport", variables.id] });
    },
  });
}

/**
 * Delete a MainDBITExtSupport record by its unique identifier.
 */
export function useDeleteMainDBITExtSupport() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBITExtSupportService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["mainDBITExtSupport-list"] });
      client.invalidateQueries({ queryKey: ["mainDBITExtSupport", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const MainDBITExtSupport_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { MainDBITExtSupportSchema, CreateMainDBITExtSupportSchema, UpdateMainDBITExtSupportSchema } from "../validators/main-dbitext-support-validator";
export type { MainDBITExtSupportInput, CreateMainDBITExtSupportInput, UpdateMainDBITExtSupportInput } from "../validators/main-dbitext-support-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-main-dbprd.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBPRDService } from "../services/main-dbprd-service";
import type { MainDBPRD } from "../models/main-dbprd-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all MainDBPRD records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appName, approverRemarks, attachmentLinks, businessArea, correctiveActionSummary, currentApproverDisplayName, currentApproverEmail, currentApproverGroup, currentStage, departmentKey, description, documentNo, documentType, dueDate, effectiveDate, finalStatus, formCode, formReferenceID, formVersion, inspectedBy, inspectionDate, inspectionRemarks, inspectionTime, lastImmediateProduct, priority, productCode, productionBatchNumber, productionDate, productToLoad, qCApprovalBy, qCApprovalDate, qCApprovalStatus, quantityMT, reasonForChange, recipientHODEmail, requestedBy, requestorDisplayName, requestorEmail, requestTitle, requiresCOOApproval, responseDueDate, responseExtendedDueDate, revisionNo, rootCauseSummary, shiftInformation, siteKey, statusKey, submittedOn, systemCode, tankNo, targetDate, urgencyReason, workflowAction
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useMainDBPRDList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBPRD-list", options],
    queryFn: () => MainDBPRDService.getAll(options),
  });
}

/**
 * Retrieve a single MainDBPRD record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useMainDBPRD(id: string) {
  return useQuery({
    queryKey: ["mainDBPRD", id],
    queryFn: () => MainDBPRDService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new MainDBPRD record.
 * @remarks Form validation: use CreateMainDBPRDSchema with zodResolver for type-safe create forms
 */
export function useCreateMainDBPRD() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBPRD, "id">) => MainDBPRDService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBPRD-list"] });
    },
  });
}

/**
 * Update an existing MainDBPRD record.
 * @remarks Form validation: use UpdateMainDBPRDSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateMainDBPRD() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<MainDBPRD, "id">>;
    }) => MainDBPRDService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["mainDBPRD-list"] });
      client.invalidateQueries({ queryKey: ["mainDBPRD", variables.id] });
    },
  });
}

/**
 * Delete a MainDBPRD record by its unique identifier.
 */
export function useDeleteMainDBPRD() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBPRDService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["mainDBPRD-list"] });
      client.invalidateQueries({ queryKey: ["mainDBPRD", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const MainDBPRD_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { MainDBPRDSchema, CreateMainDBPRDSchema, UpdateMainDBPRDSchema } from "../validators/main-dbprd-validator";
export type { MainDBPRDInput, CreateMainDBPRDInput, UpdateMainDBPRDInput } from "../validators/main-dbprd-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-main-dbqa.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBQAService } from "../services/main-dbqa-service";
import type { MainDBQA } from "../models/main-dbqa-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all MainDBQA records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appName, attachmentLinks, changeControlNumber, currentApproverEmail, currentStage, departmentKey, dueDate, finalStatus, formCode, formReferenceID, formTypeKey, formVersion, iMSRefNo, iMSRelated, incidentIssueType, plannedEndDate, plannedStartDate, priorityKey, requestorEmail, requestTitle, rootCause, severityLevelKey, siteKey, statusKey, submittedDate, targetDate, targetResolutionDate, workflowAction
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useMainDBQAList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBQA-list", options],
    queryFn: () => MainDBQAService.getAll(options),
  });
}

/**
 * Retrieve a single MainDBQA record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useMainDBQA(id: string) {
  return useQuery({
    queryKey: ["mainDBQA", id],
    queryFn: () => MainDBQAService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new MainDBQA record.
 * @remarks Form validation: use CreateMainDBQASchema with zodResolver for type-safe create forms
 */
export function useCreateMainDBQA() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBQA, "id">) => MainDBQAService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBQA-list"] });
    },
  });
}

/**
 * Update an existing MainDBQA record.
 * @remarks Form validation: use UpdateMainDBQASchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateMainDBQA() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<MainDBQA, "id">>;
    }) => MainDBQAService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["mainDBQA-list"] });
      client.invalidateQueries({ queryKey: ["mainDBQA", variables.id] });
    },
  });
}

/**
 * Delete a MainDBQA record by its unique identifier.
 */
export function useDeleteMainDBQA() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBQAService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["mainDBQA-list"] });
      client.invalidateQueries({ queryKey: ["mainDBQA", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const MainDBQA_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { MainDBQASchema, CreateMainDBQASchema, UpdateMainDBQASchema } from "../validators/main-dbqa-validator";
export type { MainDBQAInput, CreateMainDBQAInput, UpdateMainDBQAInput } from "../validators/main-dbqa-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-main-dbshe.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBSHEService } from "../services/main-dbshe-service";
import type { MainDBSHE } from "../models/main-dbshe-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all MainDBSHE records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appName, attachmentLinks, currentApproverEmail, currentStage, departmentKey, dueDate, finalStatus, formCode, formVersion, iMSRefNo, iMSRelated, priorityKey, requestorEmail, requestTitle, siteKey, statusKey, submittedDate, targetDate, workflowAction
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useMainDBSHEList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBSHE-list", options],
    queryFn: () => MainDBSHEService.getAll(options),
  });
}

/**
 * Retrieve a single MainDBSHE record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useMainDBSHE(id: string) {
  return useQuery({
    queryKey: ["mainDBSHE", id],
    queryFn: () => MainDBSHEService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new MainDBSHE record.
 * @remarks Form validation: use CreateMainDBSHESchema with zodResolver for type-safe create forms
 */
export function useCreateMainDBSHE() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBSHE, "id">) => MainDBSHEService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBSHE-list"] });
    },
  });
}

/**
 * Update an existing MainDBSHE record.
 * @remarks Form validation: use UpdateMainDBSHESchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateMainDBSHE() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<MainDBSHE, "id">>;
    }) => MainDBSHEService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["mainDBSHE-list"] });
      client.invalidateQueries({ queryKey: ["mainDBSHE", variables.id] });
    },
  });
}

/**
 * Delete a MainDBSHE record by its unique identifier.
 */
export function useDeleteMainDBSHE() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBSHEService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["mainDBSHE-list"] });
      client.invalidateQueries({ queryKey: ["mainDBSHE", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const MainDBSHE_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { MainDBSHESchema, CreateMainDBSHESchema, UpdateMainDBSHESchema } from "../validators/main-dbshe-validator";
export type { MainDBSHEInput, CreateMainDBSHEInput, UpdateMainDBSHEInput } from "../validators/main-dbshe-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-main-dbstr.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBSTRService } from "../services/main-dbstr-service";
import type { MainDBSTR } from "../models/main-dbstr-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all MainDBSTR records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appName, approverRemarks, attachmentLinks, businessArea, correctiveActionSummary, currentApproverDisplayName, currentApproverEmail, currentApproverGroup, currentStage, departmentKey, description, documentNo, documentType, dueDate, effectiveDate, finalStatus, formCode, formVersion, inspectedBy, inspectionDate, inspectionRemarks, inspectionTime, lastImmediateProduct, priority, productToLoad, qCApprovalBy, qCApprovalDate, qCApprovalStatus, quantityMT, reasonForChange, recipientHODEmail, requestedBy, requestorDisplayName, requestorEmail, requestTitle, requiresCOOApproval, responseDueDate, responseExtendedDueDate, revisionNo, rootCauseSummary, siteKey, statusKey, submittedOn, systemCode, tankNo, targetDate, urgencyReason, workflowAction
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useMainDBSTRList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBSTR-list", options],
    queryFn: () => MainDBSTRService.getAll(options),
  });
}

/**
 * Retrieve a single MainDBSTR record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useMainDBSTR(id: string) {
  return useQuery({
    queryKey: ["mainDBSTR", id],
    queryFn: () => MainDBSTRService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new MainDBSTR record.
 * @remarks Form validation: use CreateMainDBSTRSchema with zodResolver for type-safe create forms
 */
export function useCreateMainDBSTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBSTR, "id">) => MainDBSTRService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBSTR-list"] });
    },
  });
}

/**
 * Update an existing MainDBSTR record.
 * @remarks Form validation: use UpdateMainDBSTRSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateMainDBSTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<MainDBSTR, "id">>;
    }) => MainDBSTRService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["mainDBSTR-list"] });
      client.invalidateQueries({ queryKey: ["mainDBSTR", variables.id] });
    },
  });
}

/**
 * Delete a MainDBSTR record by its unique identifier.
 */
export function useDeleteMainDBSTR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBSTRService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["mainDBSTR-list"] });
      client.invalidateQueries({ queryKey: ["mainDBSTR", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const MainDBSTR_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { MainDBSTRSchema, CreateMainDBSTRSchema, UpdateMainDBSTRSchema } from "../validators/main-dbstr-validator";
export type { MainDBSTRInput, CreateMainDBSTRInput, UpdateMainDBSTRInput } from "../validators/main-dbstr-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-ops-log-hr.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OpsLogHRService } from "../services/ops-log-hr-service";
import type { OpsLogHR } from "../models/ops-log-hr-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all OpsLogHR records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appName, flowError, payloadSummary, runID, siteKey, timestamp, userUPN
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useOpsLogHRList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["opsLogHR-list", options],
    queryFn: () => OpsLogHRService.getAll(options),
  });
}

/**
 * Retrieve a single OpsLogHR record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useOpsLogHR(id: string) {
  return useQuery({
    queryKey: ["opsLogHR", id],
    queryFn: () => OpsLogHRService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new OpsLogHR record.
 * @remarks Form validation: use CreateOpsLogHRSchema with zodResolver for type-safe create forms
 */
export function useCreateOpsLogHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<OpsLogHR, "id">) => OpsLogHRService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["opsLogHR-list"] });
    },
  });
}

/**
 * Update an existing OpsLogHR record.
 * @remarks Form validation: use UpdateOpsLogHRSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateOpsLogHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<OpsLogHR, "id">>;
    }) => OpsLogHRService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["opsLogHR-list"] });
      client.invalidateQueries({ queryKey: ["opsLogHR", variables.id] });
    },
  });
}

/**
 * Delete a OpsLogHR record by its unique identifier.
 */
export function useDeleteOpsLogHR() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => OpsLogHRService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["opsLogHR-list"] });
      client.invalidateQueries({ queryKey: ["opsLogHR", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const OpsLogHR_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { OpsLogHRSchema, CreateOpsLogHRSchema, UpdateOpsLogHRSchema } from "../validators/ops-log-hr-validator";
export type { OpsLogHRInput, CreateOpsLogHRInput, UpdateOpsLogHRInput } from "../validators/ops-log-hr-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-policies.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PoliciesService } from "../services/policies-service";
import type { Policies } from "../models/policies-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all Policies records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, approvedByID, approvedDate, comments, currentActionKey, dateIssued, documentAuthorID, environmentTagKey, formCode, policyNumber, policyOwnerID, revisionNumber, statusKey, subject, submittedByID, submittedDate
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function usePoliciesList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["policies-list", options],
    queryFn: () => PoliciesService.getAll(options),
  });
}

/**
 * Retrieve a single Policies record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function usePolicies(id: string) {
  return useQuery({
    queryKey: ["policies", id],
    queryFn: () => PoliciesService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new Policies record.
 * @remarks Form validation: use CreatePoliciesSchema with zodResolver for type-safe create forms
 */
export function useCreatePolicies() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Policies, "id">) => PoliciesService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["policies-list"] });
    },
  });
}

/**
 * Update an existing Policies record.
 * @remarks Form validation: use UpdatePoliciesSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdatePolicies() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<Policies, "id">>;
    }) => PoliciesService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["policies-list"] });
      client.invalidateQueries({ queryKey: ["policies", variables.id] });
    },
  });
}

/**
 * Delete a Policies record by its unique identifier.
 */
export function useDeletePolicies() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => PoliciesService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["policies-list"] });
      client.invalidateQueries({ queryKey: ["policies", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const Policies_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { PoliciesSchema, CreatePoliciesSchema, UpdatePoliciesSchema } from "../validators/policies-validator";
export type { PoliciesInput, CreatePoliciesInput, UpdatePoliciesInput } from "../validators/policies-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-qaaction-items.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QAActionItemsService } from "../services/qa-action-items-service";
import type { QAActionItems } from "../models/qa-action-items-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all QAActionItems records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, actionItem, actionRowID, actionTypeKey, dueDate, owner, statusKey
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useQAActionItemsList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["qAActionItems-list", options],
    queryFn: () => QAActionItemsService.getAll(options),
  });
}

/**
 * Retrieve a single QAActionItems record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useQAActionItems(id: string) {
  return useQuery({
    queryKey: ["qAActionItems", id],
    queryFn: () => QAActionItemsService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new QAActionItems record.
 * @remarks Form validation: use CreateQAActionItemsSchema with zodResolver for type-safe create forms
 */
export function useCreateQAActionItems() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<QAActionItems, "id">) => QAActionItemsService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["qAActionItems-list"] });
    },
  });
}

/**
 * Update an existing QAActionItems record.
 * @remarks Form validation: use UpdateQAActionItemsSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateQAActionItems() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<QAActionItems, "id">>;
    }) => QAActionItemsService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["qAActionItems-list"] });
      client.invalidateQueries({ queryKey: ["qAActionItems", variables.id] });
    },
  });
}

/**
 * Delete a QAActionItems record by its unique identifier.
 */
export function useDeleteQAActionItems() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => QAActionItemsService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["qAActionItems-list"] });
      client.invalidateQueries({ queryKey: ["qAActionItems", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const QAActionItems_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { QAActionItemsSchema, CreateQAActionItemsSchema, UpdateQAActionItemsSchema } from "../validators/qaaction-items-validator";
export type { QAActionItemsInput, CreateQAActionItemsInput, UpdateQAActionItemsInput } from "../validators/qaaction-items-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-qahaccpreview-record.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QAHACCPReviewRecordService } from "../services/qahaccp-review-record-service";
import type { QAHACCPReviewRecord } from "../models/qahaccp-review-record-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all QAHACCPReviewRecord records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, designation, parentHACCPID, reviewDate, reviewerName, reviewNo
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useQAHACCPReviewRecordList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["qAHACCPReviewRecord-list", options],
    queryFn: () => QAHACCPReviewRecordService.getAll(options),
  });
}

/**
 * Retrieve a single QAHACCPReviewRecord record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useQAHACCPReviewRecord(id: string) {
  return useQuery({
    queryKey: ["qAHACCPReviewRecord", id],
    queryFn: () => QAHACCPReviewRecordService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new QAHACCPReviewRecord record.
 * @remarks Form validation: use CreateQAHACCPReviewRecordSchema with zodResolver for type-safe create forms
 */
export function useCreateQAHACCPReviewRecord() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<QAHACCPReviewRecord, "id">) => QAHACCPReviewRecordService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["qAHACCPReviewRecord-list"] });
    },
  });
}

/**
 * Update an existing QAHACCPReviewRecord record.
 * @remarks Form validation: use UpdateQAHACCPReviewRecordSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateQAHACCPReviewRecord() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<QAHACCPReviewRecord, "id">>;
    }) => QAHACCPReviewRecordService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["qAHACCPReviewRecord-list"] });
      client.invalidateQueries({ queryKey: ["qAHACCPReviewRecord", variables.id] });
    },
  });
}

/**
 * Delete a QAHACCPReviewRecord record by its unique identifier.
 */
export function useDeleteQAHACCPReviewRecord() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => QAHACCPReviewRecordService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["qAHACCPReviewRecord-list"] });
      client.invalidateQueries({ queryKey: ["qAHACCPReviewRecord", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const QAHACCPReviewRecord_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { QAHACCPReviewRecordSchema, CreateQAHACCPReviewRecordSchema, UpdateQAHACCPReviewRecordSchema } from "../validators/qahaccpreview-record-validator";
export type { QAHACCPReviewRecordInput, CreateQAHACCPReviewRecordInput, UpdateQAHACCPReviewRecordInput } from "../validators/qahaccpreview-record-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-qasub-action-items.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QASubActionItemsService } from "../services/qa-sub-action-items-service";
import type { QASubActionItems } from "../models/qa-sub-action-items-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all QASubActionItems records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, subActionRowNo, subTaskDescription, verificationStatusKey, verifiedBy, verifiedDate
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useQASubActionItemsList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["qASubActionItems-list", options],
    queryFn: () => QASubActionItemsService.getAll(options),
  });
}

/**
 * Retrieve a single QASubActionItems record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useQASubActionItems(id: string) {
  return useQuery({
    queryKey: ["qASubActionItems", id],
    queryFn: () => QASubActionItemsService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new QASubActionItems record.
 * @remarks Form validation: use CreateQASubActionItemsSchema with zodResolver for type-safe create forms
 */
export function useCreateQASubActionItems() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<QASubActionItems, "id">) => QASubActionItemsService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["qASubActionItems-list"] });
    },
  });
}

/**
 * Update an existing QASubActionItems record.
 * @remarks Form validation: use UpdateQASubActionItemsSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateQASubActionItems() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<QASubActionItems, "id">>;
    }) => QASubActionItemsService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["qASubActionItems-list"] });
      client.invalidateQueries({ queryKey: ["qASubActionItems", variables.id] });
    },
  });
}

/**
 * Delete a QASubActionItems record by its unique identifier.
 */
export function useDeleteQASubActionItems() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => QASubActionItemsService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["qASubActionItems-list"] });
      client.invalidateQueries({ queryKey: ["qASubActionItems", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const QASubActionItems_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { QASubActionItemsSchema, CreateQASubActionItemsSchema, UpdateQASubActionItemsSchema } from "../validators/qasub-action-items-validator";
export type { QASubActionItemsInput, CreateQASubActionItemsInput, UpdateQASubActionItemsInput } from "../validators/qasub-action-items-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-route-permissions.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RoutePermissionsService } from "../services/route-permissions-service";
import type { RoutePermissions } from "../models/route-permissions-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all RoutePermissions records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, allowedRolesKeys, departmentKey, isPublic, redirectPath, requiresAuth, routeName, routePath
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useRoutePermissionsList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["routePermissions-list", options],
    queryFn: () => RoutePermissionsService.getAll(options),
  });
}

/**
 * Retrieve a single RoutePermissions record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useRoutePermissions(id: string) {
  return useQuery({
    queryKey: ["routePermissions", id],
    queryFn: () => RoutePermissionsService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new RoutePermissions record.
 * @remarks Form validation: use CreateRoutePermissionsSchema with zodResolver for type-safe create forms
 */
export function useCreateRoutePermissions() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<RoutePermissions, "id">) => RoutePermissionsService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["routePermissions-list"] });
    },
  });
}

/**
 * Update an existing RoutePermissions record.
 * @remarks Form validation: use UpdateRoutePermissionsSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateRoutePermissions() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<RoutePermissions, "id">>;
    }) => RoutePermissionsService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["routePermissions-list"] });
      client.invalidateQueries({ queryKey: ["routePermissions", variables.id] });
    },
  });
}

/**
 * Delete a RoutePermissions record by its unique identifier.
 */
export function useDeleteRoutePermissions() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => RoutePermissionsService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["routePermissions-list"] });
      client.invalidateQueries({ queryKey: ["routePermissions", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const RoutePermissions_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { RoutePermissionsSchema, CreateRoutePermissionsSchema, UpdateRoutePermissionsSchema } from "../validators/route-permissions-validator";
export type { RoutePermissionsInput, CreateRoutePermissionsInput, UpdateRoutePermissionsInput } from "../validators/route-permissions-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-user-profiles.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserProfilesService } from "../services/user-profiles-service";
import type { UserProfiles } from "../models/user-profiles-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all UserProfiles records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, departmentKey, displayName, email, employeeID, isActive, phone, profilePhotoURL, siteKey, userID
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useUserProfilesList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["userProfiles-list", options],
    queryFn: () => UserProfilesService.getAll(options),
  });
}

/**
 * Retrieve a single UserProfiles record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useUserProfiles(id: string) {
  return useQuery({
    queryKey: ["userProfiles", id],
    queryFn: () => UserProfilesService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new UserProfiles record.
 * @remarks Form validation: use CreateUserProfilesSchema with zodResolver for type-safe create forms
 */
export function useCreateUserProfiles() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<UserProfiles, "id">) => UserProfilesService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["userProfiles-list"] });
    },
  });
}

/**
 * Update an existing UserProfiles record.
 * @remarks Form validation: use UpdateUserProfilesSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateUserProfiles() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<UserProfiles, "id">>;
    }) => UserProfilesService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["userProfiles-list"] });
      client.invalidateQueries({ queryKey: ["userProfiles", variables.id] });
    },
  });
}

/**
 * Delete a UserProfiles record by its unique identifier.
 */
export function useDeleteUserProfiles() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => UserProfilesService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["userProfiles-list"] });
      client.invalidateQueries({ queryKey: ["userProfiles", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const UserProfiles_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { UserProfilesSchema, CreateUserProfilesSchema, UpdateUserProfilesSchema } from "../validators/user-profiles-validator";
export type { UserProfilesInput, CreateUserProfilesInput, UpdateUserProfilesInput } from "../validators/user-profiles-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-user-roles-it.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserRolesITService } from "../services/user-roles-it-service";
import type { UserRolesIT } from "../models/user-roles-it-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all UserRolesIT records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, appName, department, effectiveFrom, effectiveTo, entitySiteKey, isActive, roleCodeKey, roleDisplay, securityRole, siteKey, userDisplayName, userEmail
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useUserRolesITList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["userRolesIT-list", options],
    queryFn: () => UserRolesITService.getAll(options),
  });
}

/**
 * Retrieve a single UserRolesIT record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useUserRolesIT(id: string) {
  return useQuery({
    queryKey: ["userRolesIT", id],
    queryFn: () => UserRolesITService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new UserRolesIT record.
 * @remarks Form validation: use CreateUserRolesITSchema with zodResolver for type-safe create forms
 */
export function useCreateUserRolesIT() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<UserRolesIT, "id">) => UserRolesITService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["userRolesIT-list"] });
    },
  });
}

/**
 * Update an existing UserRolesIT record.
 * @remarks Form validation: use UpdateUserRolesITSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateUserRolesIT() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<UserRolesIT, "id">>;
    }) => UserRolesITService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["userRolesIT-list"] });
      client.invalidateQueries({ queryKey: ["userRolesIT", variables.id] });
    },
  });
}

/**
 * Delete a UserRolesIT record by its unique identifier.
 */
export function useDeleteUserRolesIT() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => UserRolesITService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["userRolesIT-list"] });
      client.invalidateQueries({ queryKey: ["userRolesIT", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const UserRolesIT_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { UserRolesITSchema, CreateUserRolesITSchema, UpdateUserRolesITSchema } from "../validators/user-roles-it-validator";
export type { UserRolesITInput, CreateUserRolesITInput, UpdateUserRolesITInput } from "../validators/user-roles-it-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-user-roles.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserRolesService } from "../services/user-roles-service";
import type { UserRoles } from "../models/user-roles-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all UserRoles records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, canAdmin, canApprove, departmentKey, effectiveDate, email, expiryDate, moduleAccessKeys, roleKey, userID
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useUserRolesList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["userRoles-list", options],
    queryFn: () => UserRolesService.getAll(options),
  });
}

/**
 * Retrieve a single UserRoles record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useUserRoles(id: string) {
  return useQuery({
    queryKey: ["userRoles", id],
    queryFn: () => UserRolesService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new UserRoles record.
 * @remarks Form validation: use CreateUserRolesSchema with zodResolver for type-safe create forms
 */
export function useCreateUserRoles() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<UserRoles, "id">) => UserRolesService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["userRoles-list"] });
    },
  });
}

/**
 * Update an existing UserRoles record.
 * @remarks Form validation: use UpdateUserRolesSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateUserRoles() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<UserRoles, "id">>;
    }) => UserRolesService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["userRoles-list"] });
      client.invalidateQueries({ queryKey: ["userRoles", variables.id] });
    },
  });
}

/**
 * Delete a UserRoles record by its unique identifier.
 */
export function useDeleteUserRoles() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => UserRolesService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["userRoles-list"] });
      client.invalidateQueries({ queryKey: ["userRoles", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const UserRoles_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { UserRolesSchema, CreateUserRolesSchema, UpdateUserRolesSchema } from "../validators/user-roles-validator";
export type { UserRolesInput, CreateUserRolesInput, UpdateUserRolesInput } from "../validators/user-roles-validator";
--- END FILE ---

--- FILE: apps/ioi-platform/src/generated/hooks/use-workflow-audit-log.ts ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WorkflowAuditLogService } from "../services/workflow-audit-log-service";
import type { WorkflowAuditLog } from "../models/workflow-audit-log-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all WorkflowAuditLog records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, actionTaken, actorEmail, actorName, comment, formCode, newStatus, oldStatus, requestItemID, siteTag, timestamp
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useWorkflowAuditLogList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["workflowAuditLog-list", options],
    queryFn: () => WorkflowAuditLogService.getAll(options),
  });
}

/**
 * Retrieve a single WorkflowAuditLog record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useWorkflowAuditLog(id: string) {
  return useQuery({
    queryKey: ["workflowAuditLog", id],
    queryFn: () => WorkflowAuditLogService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new WorkflowAuditLog record.
 * @remarks Form validation: use CreateWorkflowAuditLogSchema with zodResolver for type-safe create forms
 */
export function useCreateWorkflowAuditLog() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<WorkflowAuditLog, "id">) => WorkflowAuditLogService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["workflowAuditLog-list"] });
    },
  });
}

/**
 * Update an existing WorkflowAuditLog record.
 * @remarks Form validation: use UpdateWorkflowAuditLogSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateWorkflowAuditLog() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<WorkflowAuditLog, "id">>;
    }) => WorkflowAuditLogService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["workflowAuditLog-list"] });
      client.invalidateQueries({ queryKey: ["workflowAuditLog", variables.id] });
    },
  });
}

/**
 * Delete a WorkflowAuditLog record by its unique identifier.
 */
export function useDeleteWorkflowAuditLog() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => WorkflowAuditLogService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["workflowAuditLog-list"] });
      client.invalidateQueries({ queryKey: ["workflowAuditLog", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const WorkflowAuditLog_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { WorkflowAuditLogSchema, CreateWorkflowAuditLogSchema, UpdateWorkflowAuditLogSchema } from "../validators/workflow-audit-log-validator";
export type { WorkflowAuditLogInput, CreateWorkflowAuditLogInput, UpdateWorkflowAuditLogInput } from "../validators/workflow-audit-log-validator";
--- END FILE ---

