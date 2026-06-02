import { getClient } from '../../../app-gen-sdk/data';
import {
  MainDBMTNDepartmentKeyToLabel,
  MainDBMTNSiteKeyToLabel,
  type MainDBMTN,
  type MainDBMTNDepartmentKey,
  type MainDBMTNSiteKey,
} from '../models/main-dbmtn-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'MainDBMTN';

type SharePointRecord = Record<string, unknown>;

function text(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    const record = value as SharePointRecord;
    return text(record.Value ?? record.Label ?? record.Title);
  }
  return undefined;
}

function numberValue(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function keyFromLabel<T extends string>(labels: Record<T, string>, value: unknown): T | undefined {
  const raw = text(value);
  if (!raw) return undefined;
  if (raw in labels) return raw as T;
  return (Object.entries(labels) as Array<[T, string]>).find(([, label]) => label === raw)?.[0];
}

function labelFromKey<T extends string>(labels: Record<T, string>, value: T | undefined): string | undefined {
  return value ? labels[value] : undefined;
}

function setIfDefined(out: SharePointRecord, field: string, value: unknown) {
  if (value !== undefined && value !== null && value !== '') out[field] = value;
}

function toSharePoint(record: Partial<Omit<MainDBMTN, 'id'>>): SharePointRecord {
  const out: SharePointRecord = {};
  const departmentLabel = labelFromKey(MainDBMTNDepartmentKeyToLabel, record.departmentKey);
  const siteLabel = labelFromKey(MainDBMTNSiteKeyToLabel, record.siteKey);

  setIfDefined(out, 'Title', record.title);
  setIfDefined(out, 'FormCode', record.formCode);
  setIfDefined(out, 'CurrentStatus', record.currentStatus);
  setIfDefined(out, 'Status', record.currentStatus);
  setIfDefined(out, 'Department', departmentLabel ?? record.departmentKey);
  setIfDefined(out, 'EntitySite', siteLabel ?? record.siteKey);
  setIfDefined(out, 'SubmittedBy', record.submittedBy);
  setIfDefined(out, 'SubmittedDate', record.submittedDate);
  setIfDefined(out, 'SubmittedOn', record.submittedDate);
  setIfDefined(out, 'EquipmentID', record.equipmentID);
  setIfDefined(out, 'EquipmentName', record.equipmentName);
  setIfDefined(out, 'Location', record.location);
  setIfDefined(out, 'Supervisor', record.supervisor);
  setIfDefined(out, 'Remarks', record.remarks);
  setIfDefined(out, 'WorkflowStage', record.workflflowStage);

  setIfDefined(out, 'fAREquipmentID', record.fAREquipmentID);
  setIfDefined(out, 'fARFailureDate', record.fARFailureDate);
  setIfDefined(out, 'fARFailureMode', record.fARFailureMode);
  setIfDefined(out, 'fARSymptoms', record.fARSymptoms);
  setIfDefined(out, 'fARRootCause', record.fARRootCause);
  setIfDefined(out, 'fARImpact', record.fARImpact);
  setIfDefined(out, 'fARImpactDescription', record.fARImpactDescription);
  setIfDefined(out, 'fARCorrectiveAction', record.fARCorrectiveAction);
  setIfDefined(out, 'fARPreventiveAction', record.fARPreventiveAction);
  setIfDefined(out, 'fARDownTimeHours', record.fARDownTimeHours);
  setIfDefined(out, 'fARReportedBy', record.fARReportedBy);
  setIfDefined(out, 'fARApprovedBy', record.fARApprovedBy);
  setIfDefined(out, 'fARClosureDate', record.fARClosureDate);
  setIfDefined(out, 'fARCategory', record.fARCategory);

  setIfDefined(out, 'mPPlanNo', record.mPPlanNo);
  setIfDefined(out, 'mPEquipmentID', record.mPEquipmentID);
  setIfDefined(out, 'mPEquipmentName', record.mPEquipmentName);
  setIfDefined(out, 'mPIntervalType', record.mPIntervalType);
  setIfDefined(out, 'mPIntervalValue', record.mPIntervalValue);
  setIfDefined(out, 'mPLastDate', record.mPLastDate);
  setIfDefined(out, 'mPNextDueDate', record.mPNextDueDate);
  setIfDefined(out, 'mPWorkType', record.mPWorkType);
  setIfDefined(out, 'mPTaskDescription', record.mPTaskDescription);
  setIfDefined(out, 'mPAssignedTo', record.mPAssignedTo);
  setIfDefined(out, 'mPEstimatedHours', record.mPEstimatedHours);
  setIfDefined(out, 'mPStatus', record.mPStatus);

  setIfDefined(out, 'mECChangeNo', record.mECChangeNo);
  setIfDefined(out, 'mECDate', record.mECDate);
  setIfDefined(out, 'mECEquipmentID', record.mECEquipmentID);
  setIfDefined(out, 'mECChangeDescription', record.mECChangeDescription);
  setIfDefined(out, 'mECReason', record.mECReason);
  setIfDefined(out, 'mECRiskAssessment', record.mECRiskAssessment);
  setIfDefined(out, 'mECAuthorizedBy', record.mECAuthorizedBy);
  setIfDefined(out, 'mECCompletionDate', record.mECCompletionDate);
  setIfDefined(out, 'mECClosureNotes', record.mECClosureNotes);

  setIfDefined(out, 'ePIEquipmentID', record.ePIEquipmentID);
  setIfDefined(out, 'ePIEquipmentName', record.ePIEquipmentName);
  setIfDefined(out, 'ePIInspectionDate', record.ePIInspectionDate);
  setIfDefined(out, 'ePIInspector', record.ePIInspector);
  setIfDefined(out, 'ePIItem', record.ePIItem);
  setIfDefined(out, 'ePIResult', record.ePIResult);
  setIfDefined(out, 'ePIComment', record.ePIComment);
  setIfDefined(out, 'ePINextInspectionDate', record.ePINextInspectionDate);
  setIfDefined(out, 'ePIApprovedBy', record.ePIApprovedBy);

  setIfDefined(out, 'pMDocumentNo', record.pMDocumentNo);
  setIfDefined(out, 'pMTitle', record.pMTitle);
  setIfDefined(out, 'pMType', record.pMType);
  setIfDefined(out, 'pMEquipmentID', record.pMEquipmentID);
  setIfDefined(out, 'pMRevisionNo', record.pMRevisionNo);
  setIfDefined(out, 'pMEffectiveDate', record.pMEffectiveDate);
  setIfDefined(out, 'pMAttachment', record.pMAttachment);

  setIfDefined(out, 'enMSDocumentNo', record.enMSDocumentNo);
  setIfDefined(out, 'enMSTitle', record.enMSTitle);
  setIfDefined(out, 'enMSType', record.enMSType);
  setIfDefined(out, 'enMSEffectiveDate', record.enMSEffectiveDate);
  setIfDefined(out, 'enMSReviewDate', record.enMSReviewDate);
  setIfDefined(out, 'enMSRevisionNo', record.enMSRevisionNo);
  setIfDefined(out, 'enMSAttachment', record.enMSAttachment);

  setIfDefined(out, 'tpmMachineNo', record.tpmMachineNo);
  setIfDefined(out, 'tpmMachineName', record.tpmMachineName);
  setIfDefined(out, 'tpmDate', record.tpmDate);
  setIfDefined(out, 'tpmActivityType', record.tpmActivityType);
  setIfDefined(out, 'tpmFindings', record.tpmFindings);
  setIfDefined(out, 'tpmActionTaken', record.tpmActionTaken);
  setIfDefined(out, 'tpmDoneBy', record.tpmDoneBy);
  setIfDefined(out, 'tpmVerifiedBy', record.tpmVerifiedBy);
  setIfDefined(out, 'tpmOverallEquipmentEffectiveness', record.tpmOverallEquipmentEffectiveness);

  setIfDefined(out, 'eeParameter', record.eeParameter);
  setIfDefined(out, 'eeDate', record.eeDate);
  setIfDefined(out, 'eeValue', record.eeValue);
  setIfDefined(out, 'eeUnit', record.eeUnit);
  setIfDefined(out, 'eeTarget', record.eeTarget);
  setIfDefined(out, 'eeVariance', record.eeVariance);
  setIfDefined(out, 'eeRecordedBy', record.eeRecordedBy);
  setIfDefined(out, 'eeRemarks', record.eeRemarks);

  return out;
}

function fromSharePoint(raw: unknown): MainDBMTN {
  const record = raw as SharePointRecord;
  return {
    ...(record as unknown as MainDBMTN),
    id: Number(record.id ?? record.ID ?? 0),
    title: String(record.title ?? record.Title ?? ''),
    formCode: String(record.formCode ?? record.FormCode ?? ''),
    currentStatus: text(record.currentStatus ?? record.CurrentStatus ?? record.Status),
    departmentKey: keyFromLabel(MainDBMTNDepartmentKeyToLabel, record.departmentKey ?? record.Department) as MainDBMTNDepartmentKey | undefined,
    siteKey: keyFromLabel(MainDBMTNSiteKeyToLabel, record.siteKey ?? record.EntitySite) as MainDBMTNSiteKey | undefined,
    submittedBy: text(record.submittedBy ?? record.SubmittedBy),
    submittedDate: text(record.submittedDate ?? record.SubmittedDate ?? record.SubmittedOn),
    equipmentID: text(record.equipmentID ?? record.EquipmentID),
    equipmentName: text(record.equipmentName ?? record.EquipmentName),
    location: text(record.location ?? record.Location),
    supervisor: text(record.supervisor ?? record.Supervisor),
    remarks: text(record.remarks ?? record.Remarks),
    workflflowStage: numberValue(record.workflflowStage ?? record.WorkflowStage),
  };
}

export class MainDBMTNService {
  static async create(record: Omit<MainDBMTN, 'id'>): Promise<MainDBMTN> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, toSharePoint(record));
    if (!result.success) throw result.error;
    return fromSharePoint(result.data);
  }

  static async update(
    id: string,
    changedFields: Partial<Omit<MainDBMTN, 'id'>>
  ): Promise<MainDBMTN> {
    const result = await getClient().updateRecordAsync(DATA_SOURCE_NAME, id, toSharePoint(changedFields));
    if (!result.success) throw result.error;
    return fromSharePoint(result.data);
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<MainDBMTN> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return fromSharePoint(result.data);
  }

  static async getAll(options?: IOperationOptions): Promise<MainDBMTN[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DATA_SOURCE_NAME, options);
    if (!result.success) throw result.error;
    return (result.data as unknown[]).map(fromSharePoint);
  }
}
