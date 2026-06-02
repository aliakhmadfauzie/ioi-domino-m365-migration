import { getClient } from '../../../app-gen-sdk/data';
import {
  MainDBPRDDepartmentKeyToLabel,
  MainDBPRDSiteKeyToLabel,
  MainDBPRDStatusKeyToLabel,
  type MainDBPRD,
  type MainDBPRDDepartmentKey,
  type MainDBPRDSiteKey,
  type MainDBPRDStatusKey,
} from '../models/main-dbprd-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'MainDBPRD';

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

function toSharePoint(record: Partial<Omit<MainDBPRD, 'id'>>): SharePointRecord {
  const out: SharePointRecord = {};
  setIfDefined(out, 'Title', record.title);
  setIfDefined(out, 'AppName', record.appName);
  setIfDefined(out, 'ApproverRemarks', record.approverRemarks);
  setIfDefined(out, 'AttachmentLinks', record.attachmentLinks);
  setIfDefined(out, 'BusinessArea', record.businessArea);
  setIfDefined(out, 'CorrectiveActionSummary', record.correctiveActionSummary);
  setIfDefined(out, 'CurrentApprover_DisplayName', record.currentApproverDisplayName);
  setIfDefined(out, 'CurrentApprover_Email', record.currentApproverEmail);
  setIfDefined(out, 'CurrentApproverGroup', record.currentApproverGroup);
  setIfDefined(out, 'CurrentStage', record.currentStage);
  setIfDefined(out, 'Department', labelFromKey(MainDBPRDDepartmentKeyToLabel, record.departmentKey));
  setIfDefined(out, 'Description', record.description);
  setIfDefined(out, 'DocumentNo', record.documentNo);
  setIfDefined(out, 'DocumentType', record.documentType);
  setIfDefined(out, 'DueDate', record.dueDate);
  setIfDefined(out, 'EffectiveDate', record.effectiveDate);
  setIfDefined(out, 'FinalStatus', record.finalStatus);
  setIfDefined(out, 'FormCode', record.formCode);
  setIfDefined(out, 'FormID', record.formReferenceID);
  setIfDefined(out, 'FormVersion', record.formVersion);
  setIfDefined(out, 'InspectedBy', record.inspectedBy);
  setIfDefined(out, 'InspectionDate', record.inspectionDate);
  setIfDefined(out, 'InspectionRemarks', record.inspectionRemarks);
  setIfDefined(out, 'InspectionTime', record.inspectionTime);
  setIfDefined(out, 'LastImmediateProduct', record.lastImmediateProduct);
  setIfDefined(out, 'Priority', record.priority);
  setIfDefined(out, 'ProductCode', record.productCode);
  setIfDefined(out, 'ProductionBatch', record.productionBatchNumber);
  setIfDefined(out, 'ProductToLoad', record.productToLoad);
  setIfDefined(out, 'QCApprovalBy', record.qCApprovalBy);
  setIfDefined(out, 'QCApprovalDate', record.qCApprovalDate);
  setIfDefined(out, 'QCApprovalStatus', record.qCApprovalStatus);
  setIfDefined(out, 'QuantityMT', record.quantityMT);
  setIfDefined(out, 'ReasonForChange', record.reasonForChange);
  setIfDefined(out, 'RecipientHODEmail', record.recipientHODEmail);
  setIfDefined(out, 'RequestedBy', record.requestedBy);
  setIfDefined(out, 'Requestor_DisplayName', record.requestorDisplayName);
  setIfDefined(out, 'Requestor_Email', record.requestorEmail);
  setIfDefined(out, 'RequestTitle', record.requestTitle);
  setIfDefined(out, 'RequiresCOOApproval', record.requiresCOOApproval);
  setIfDefined(out, 'ResponseDueDate', record.responseDueDate);
  setIfDefined(out, 'ResponseExtendedDueDate', record.responseExtendedDueDate);
  setIfDefined(out, 'RevisionNo', record.revisionNo);
  setIfDefined(out, 'RootCauseSummary', record.rootCauseSummary);
  setIfDefined(out, 'ShiftInfo', record.shiftInformation);
  setIfDefined(out, 'EntitySite', labelFromKey(MainDBPRDSiteKeyToLabel, record.siteKey));
  setIfDefined(out, 'Status', labelFromKey(MainDBPRDStatusKeyToLabel, record.statusKey));
  setIfDefined(out, 'SubmittedOn', record.submittedOn);
  setIfDefined(out, 'SystemCode', record.systemCode);
  setIfDefined(out, 'TankNo', record.tankNo);
  setIfDefined(out, 'TargetDate', record.targetDate);
  setIfDefined(out, 'UrgencyReason', record.urgencyReason);
  return out;
}

function fromSharePoint(raw: unknown): MainDBPRD {
  const record = raw as SharePointRecord;
  return {
    ...(record as unknown as MainDBPRD),
    id: Number(record.id ?? record.ID ?? 0),
    title: String(record.title ?? record.Title ?? ''),
    appName: valueOfChoice(record.appName ?? record.AppName),
    approverRemarks: valueOfChoice(record.approverRemarks ?? record.ApproverRemarks),
    attachmentLinks: valueOfChoice(record.attachmentLinks ?? record.AttachmentLinks),
    businessArea: valueOfChoice(record.businessArea ?? record.BusinessArea),
    currentStage: valueOfChoice(record.currentStage ?? record.CurrentStage),
    departmentKey: (keyFromLabel(MainDBPRDDepartmentKeyToLabel, record.departmentKey ?? record.Department) ?? 'DepartmentKey10') as MainDBPRDDepartmentKey,
    description: valueOfChoice(record.description ?? record.Description),
    documentNo: valueOfChoice(record.documentNo ?? record.DocumentNo),
    documentType: valueOfChoice(record.documentType ?? record.DocumentType),
    dueDate: valueOfChoice(record.dueDate ?? record.DueDate),
    effectiveDate: valueOfChoice(record.effectiveDate ?? record.EffectiveDate),
    finalStatus: valueOfChoice(record.finalStatus ?? record.FinalStatus),
    formCode: String(record.formCode ?? record.FormCode ?? ''),
    formReferenceID: String(record.formReferenceID ?? record.FormID ?? record.Title ?? ''),
    inspectedBy: valueOfChoice(record.inspectedBy ?? record.InspectedBy),
    inspectionDate: valueOfChoice(record.inspectionDate ?? record.InspectionDate),
    inspectionRemarks: valueOfChoice(record.inspectionRemarks ?? record.InspectionRemarks),
    productCode: valueOfChoice(record.productCode ?? record.ProductCode),
    productionBatchNumber: valueOfChoice(record.productionBatchNumber ?? record.ProductionBatch),
    productionDate: valueOfChoice(record.productionDate ?? record.ProductionDate),
    quantityMT: valueOfChoice(record.quantityMT ?? record.QuantityMT),
    reasonForChange: valueOfChoice(record.reasonForChange ?? record.ReasonForChange),
    requestedBy: valueOfChoice(record.requestedBy ?? record.RequestedBy),
    requestorDisplayName: valueOfChoice(record.requestorDisplayName ?? record.Requestor_DisplayName),
    requestorEmail: valueOfChoice(record.requestorEmail ?? record.Requestor_Email),
    requestTitle: valueOfChoice(record.requestTitle ?? record.RequestTitle),
    shiftInformation: valueOfChoice(record.shiftInformation ?? record.ShiftInfo),
    siteKey: keyFromLabel(MainDBPRDSiteKeyToLabel, record.siteKey ?? record.EntitySite) as MainDBPRDSiteKey | undefined,
    statusKey: (keyFromLabel(MainDBPRDStatusKeyToLabel, record.statusKey ?? record.Status) ?? 'StatusKey1') as MainDBPRDStatusKey,
    submittedOn: valueOfChoice(record.submittedOn ?? record.SubmittedOn),
    systemCode: valueOfChoice(record.systemCode ?? record.SystemCode),
    targetDate: valueOfChoice(record.targetDate ?? record.TargetDate),
    workflowAction: valueOfChoice(record.workflowAction ?? record.WorkflowAction),
  };
}

export class MainDBPRDService {
  static async create(record: Omit<MainDBPRD, 'id'>): Promise<MainDBPRD> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, toSharePoint(record));
    if (!result.success) throw result.error;
    return fromSharePoint(result.data);
  }

  static async update(
    id: string,
    changedFields: Partial<Omit<MainDBPRD, 'id'>>
  ): Promise<MainDBPRD> {
    const result = await getClient().updateRecordAsync(DATA_SOURCE_NAME, id, toSharePoint(changedFields));
    if (!result.success) throw result.error;
    return fromSharePoint(result.data);
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<MainDBPRD> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return fromSharePoint(result.data);
  }

  static async getAll(options?: IOperationOptions): Promise<MainDBPRD[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DATA_SOURCE_NAME, options);
    if (!result.success) throw result.error;
    return (result.data as unknown[]).map(fromSharePoint);
  }
}
