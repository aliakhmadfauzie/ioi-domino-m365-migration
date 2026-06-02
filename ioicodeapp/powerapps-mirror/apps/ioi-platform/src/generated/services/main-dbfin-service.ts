import { getClient } from '../../../app-gen-sdk/data';
import {
  MainDBFINCompanyKeyToLabel,
  MainDBFINDepartmentKeyToLabel,
  MainDBFINModule2KeyToLabel,
  MainDBFINSiteKeyToLabel,
  MainDBFINStatusKeyToLabel,
  type MainDBFIN,
  type MainDBFINCompanyKey,
  type MainDBFINDepartmentKey,
  type MainDBFINModule2Key,
  type MainDBFINSiteKey,
  type MainDBFINStatusKey,
} from '../models/main-dbfin-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'MainDBFIN';

type SharePointRecord = Record<string, unknown>;

function valueOfChoice(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return valueOfChoice(record.Value ?? record.Label ?? record.Title);
  }
  return undefined;
}

function keyFromLabel<T extends string>(labels: Record<T, string>, value: unknown): T | undefined {
  const text = valueOfChoice(value);
  if (!text) return undefined;
  if (text in labels) return text as T;
  return (Object.entries(labels) as Array<[T, string]>).find(([, label]) => label === text)?.[0];
}

function labelFromKey<T extends string>(labels: Record<T, string>, value: T | undefined): string | undefined {
  if (!value) return undefined;
  return labels[value] ?? value;
}

function setIfDefined(out: SharePointRecord, field: string, value: unknown) {
  if (value !== undefined && value !== null && value !== '') out[field] = value;
}

function singleLineText(value: unknown, maxLength = 255): string | undefined {
  if (value === undefined || value === null) return undefined;
  const text = String(value)
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return undefined;
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function setSingleLineIfDefined(out: SharePointRecord, field: string, value: unknown) {
  setIfDefined(out, field, singleLineText(value));
}

function setMultilineIfDefined(out: SharePointRecord, field: string, value: unknown) {
  if (value === undefined || value === null) return;
  const text = String(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();
  setIfDefined(out, field, text);
}

function toSharePoint(record: Partial<Omit<MainDBFIN, 'id'>>): SharePointRecord {
  const out: SharePointRecord = {};
  setSingleLineIfDefined(out, 'Title', record.title);
  setIfDefined(out, 'Amount', record.amount);
  setSingleLineIfDefined(out, 'AppName', record.appName);
  setSingleLineIfDefined(out, 'ApproverRemarks', record.approverRemarks);
  setSingleLineIfDefined(out, 'AttachmentLinks', record.attachmentLinks);
  setSingleLineIfDefined(out, 'BusinessArea', record.businessArea);
  setIfDefined(out, 'Company', labelFromKey(MainDBFINCompanyKeyToLabel, record.companyKey));
  setIfDefined(out, 'ContractAmount', record.contractAmount);
  setSingleLineIfDefined(out, 'CorrectiveActionSummary', record.correctiveActionSummary);
  setSingleLineIfDefined(out, 'CurrentApprover_DisplayName', record.currentApproverDisplayName);
  setSingleLineIfDefined(out, 'CurrentApprover_Email', record.currentApproverEmail);
  setSingleLineIfDefined(out, 'CurrentApproverGroup', record.currentApproverGroup);
  setSingleLineIfDefined(out, 'CurrentStage', record.currentStage);
  setIfDefined(out, 'Department', labelFromKey(MainDBFINDepartmentKeyToLabel, record.departmentKey));
  setSingleLineIfDefined(out, 'Description', record.description);
  setSingleLineIfDefined(out, 'DocumentNo', record.documentNo);
  setSingleLineIfDefined(out, 'DocumentType', record.documentType);
  setSingleLineIfDefined(out, 'DueDate', record.dueDate);
  setSingleLineIfDefined(out, 'EffectiveDate', record.effectiveDate);
  setSingleLineIfDefined(out, 'FinalStatus', record.finalStatus);
  setSingleLineIfDefined(out, 'FormCode', record.formCode);
  setSingleLineIfDefined(out, 'FormVersion', record.formVersion);
  setSingleLineIfDefined(out, 'InspectedBy', record.inspectedBy);
  setSingleLineIfDefined(out, 'InspectionDate', record.inspectionDate);
  setSingleLineIfDefined(out, 'InspectionRemarks', record.inspectionRemarks);
  setSingleLineIfDefined(out, 'InspectionTime', record.inspectionTime);
  setSingleLineIfDefined(out, 'IRR_Percent', record.iRRPercent);
  setSingleLineIfDefined(out, 'LastImmediateProduct', record.lastImmediateProduct);
  setIfDefined(out, 'Module2', labelFromKey(MainDBFINModule2KeyToLabel, record.module2Key));
  setSingleLineIfDefined(out, 'PaybackPeriod', record.paybackPeriod);
  setSingleLineIfDefined(out, 'Priority', record.priority);
  setMultilineIfDefined(out, 'ProblemDesc', record.problemDesc);
  setSingleLineIfDefined(out, 'ProductToLoad', record.productToLoad);
  setSingleLineIfDefined(out, 'QCApprovalBy', record.qCApprovalBy);
  setSingleLineIfDefined(out, 'QCApprovalDate', record.qCApprovalDate);
  setSingleLineIfDefined(out, 'QCApprovalStatus', record.qCApprovalStatus);
  setSingleLineIfDefined(out, 'QuantityMT', record.quantityMT);
  setSingleLineIfDefined(out, 'ReasonForChange', record.reasonForChange);
  setSingleLineIfDefined(out, 'RecipientHODEmail', record.recipientHODEmail);
  setSingleLineIfDefined(out, 'RequestedBy', record.requestedBy);
  setSingleLineIfDefined(out, 'Requestor_DisplayName', record.requestorDisplayName);
  setSingleLineIfDefined(out, 'Requestor_Email', record.requestorEmail);
  setSingleLineIfDefined(out, 'RequestTitle', record.requestTitle);
  setSingleLineIfDefined(out, 'RequiresCOOApproval', record.requiresCOOApproval);
  setSingleLineIfDefined(out, 'ResponseDueDate', record.responseDueDate);
  setSingleLineIfDefined(out, 'ResponseExtendedDueDate', record.responseExtendedDueDate);
  setSingleLineIfDefined(out, 'RevisionNo', record.revisionNo);
  setSingleLineIfDefined(out, 'RootCauseSummary', record.rootCauseSummary);
  setSingleLineIfDefined(out, 'Section', record.section);
  setIfDefined(out, 'EntitySite', labelFromKey(MainDBFINSiteKeyToLabel, record.siteKey));
  setIfDefined(out, 'Status', labelFromKey(MainDBFINStatusKeyToLabel, record.statusKey));
  setSingleLineIfDefined(out, 'StatusRequest', record.statusRequest);
  setSingleLineIfDefined(out, 'SubmittedOn', record.submittedOn);
  setSingleLineIfDefined(out, 'SystemCode', record.systemCode);
  setSingleLineIfDefined(out, 'TankNo', record.tankNo);
  setSingleLineIfDefined(out, 'TargetDate', record.targetDate);
  setSingleLineIfDefined(out, 'UrgencyReason', record.urgencyReason);
  return out;
}

function fromSharePoint(raw: unknown): MainDBFIN {
  const record = raw as SharePointRecord;
  return {
    ...(record as unknown as MainDBFIN),
    id: Number(record.id ?? record.ID ?? 0),
    title: String(record.title ?? record.Title ?? ''),
    amount: Number(record.amount ?? record.Amount ?? undefined) || undefined,
    appName: valueOfChoice(record.appName ?? record.AppName),
    approverRemarks: valueOfChoice(record.approverRemarks ?? record.ApproverRemarks),
    attachmentLinks: valueOfChoice(record.attachmentLinks ?? record.AttachmentLinks),
    businessArea: valueOfChoice(record.businessArea ?? record.BusinessArea),
    companyKey: keyFromLabel(MainDBFINCompanyKeyToLabel, record.companyKey ?? record.Company) as MainDBFINCompanyKey | undefined,
    contractAmount: Number(record.contractAmount ?? record.ContractAmount ?? undefined) || undefined,
    currentStage: valueOfChoice(record.currentStage ?? record.CurrentStage),
    departmentKey: (keyFromLabel(MainDBFINDepartmentKeyToLabel, record.departmentKey ?? record.Department) ?? 'DepartmentKey03') as MainDBFINDepartmentKey,
    description: valueOfChoice(record.description ?? record.Description),
    documentNo: valueOfChoice(record.documentNo ?? record.DocumentNo),
    documentType: valueOfChoice(record.documentType ?? record.DocumentType),
    dueDate: valueOfChoice(record.dueDate ?? record.DueDate),
    effectiveDate: valueOfChoice(record.effectiveDate ?? record.EffectiveDate),
    finalStatus: valueOfChoice(record.finalStatus ?? record.FinalStatus),
    formCode: String(record.formCode ?? record.FormCode ?? ''),
    module2Key: keyFromLabel(MainDBFINModule2KeyToLabel, record.module2Key ?? record.Module2) as MainDBFINModule2Key | undefined,
    paybackPeriod: valueOfChoice(record.paybackPeriod ?? record.PaybackPeriod),
    problemDesc: valueOfChoice(record.problemDesc ?? record.ProblemDesc),
    reasonForChange: valueOfChoice(record.reasonForChange ?? record.ReasonForChange),
    recipientHODEmail: valueOfChoice(record.recipientHODEmail ?? record.RecipientHODEmail),
    requestedBy: valueOfChoice(record.requestedBy ?? record.RequestedBy),
    requestorDisplayName: valueOfChoice(record.requestorDisplayName ?? record.Requestor_DisplayName),
    requestorEmail: valueOfChoice(record.requestorEmail ?? record.Requestor_Email),
    requestTitle: valueOfChoice(record.requestTitle ?? record.RequestTitle),
    section: valueOfChoice(record.section ?? record.Section),
    siteKey: keyFromLabel(MainDBFINSiteKeyToLabel, record.siteKey ?? record.EntitySite) as MainDBFINSiteKey | undefined,
    statusKey: (keyFromLabel(MainDBFINStatusKeyToLabel, record.statusKey ?? record.Status) ?? 'StatusKey1') as MainDBFINStatusKey,
    statusRequest: valueOfChoice(record.statusRequest ?? record.StatusRequest),
    submittedOn: valueOfChoice(record.submittedOn ?? record.SubmittedOn),
    targetDate: valueOfChoice(record.targetDate ?? record.TargetDate),
    workflowAction: valueOfChoice(record.workflowAction ?? record.WorkflowAction),
  };
}

export class MainDBFINService {
  static async create(record: Omit<MainDBFIN, 'id'>): Promise<MainDBFIN> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, toSharePoint(record));
    if (!result.success) throw result.error;
    return fromSharePoint(result.data);
  }

  static async update(
    id: string,
    changedFields: Partial<Omit<MainDBFIN, 'id'>>
  ): Promise<MainDBFIN> {
    const result = await getClient().updateRecordAsync(DATA_SOURCE_NAME, id, toSharePoint(changedFields));
    if (!result.success) throw result.error;
    return fromSharePoint(result.data);
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<MainDBFIN> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return fromSharePoint(result.data);
  }

  static async getAll(options?: IOperationOptions): Promise<MainDBFIN[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DATA_SOURCE_NAME, options);
    if (!result.success) throw result.error;
    return (result.data as unknown[]).map(fromSharePoint);
  }
}
