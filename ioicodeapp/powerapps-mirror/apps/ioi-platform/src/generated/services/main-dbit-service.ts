import { getClient } from '../../../app-gen-sdk/data';
import {
  MainDBITEnvironmenttagKeyToLabel,
  MainDBITSiteKeyToLabel,
  type MainDBIT,
} from '../models/main-dbit-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';
import { normalizeStatusSlug } from '../../lib/status-slugs';

const DATA_SOURCE_NAME = 'maindb_it';

type RawMainDBIT = Partial<MainDBIT> & Record<string, unknown>;

const STRUCTURED_FIELD_MAP = [
  ['rSUserName', 'RS_UserName', 'string'],
  ['rSDesignation', 'RS_Designation', 'string'],
  ['rSCompany', 'RS_Company', 'string'],
  ['rSDepartment', 'RS_Department', 'string'],
  ['rSLocation', 'RS_Location', 'string'],
  ['rSResetType', 'RS_ResetType', 'string'],
  ['rSReasonForReset', 'RS_ReasonForReset', 'string'],
  ['rSBankTokenSerial', 'RS_BankTokenSerial', 'string'],
  ['rSExecutiveDirectorEmail', 'RS_ExecutiveDirectorEmail', 'string'],
  ['rSSAPClient', 'RS_SAPClient', 'string'],
  ['rSIEPClientName', 'RS_IEPClientName', 'string'],
  ['sFARCompany', 'SFAR_Company', 'string'],
  ['sFARDepartment', 'SFAR_Department', 'string'],
  ['sFARExtension', 'SFAR_Extension', 'string'],
  ['sFARFolderType', 'SFAR_FolderType', 'string'],
  ['sFARServerName', 'SFAR_ServerName', 'string'],
  ['sFARRequestType', 'SFAR_RequestType', 'string'],
  ['sFARHODEmail', 'SFAR_HODEmail', 'string'],
  ['sFAROwner', 'SFAR_Owner', 'string'],
  ['sFARAccessTo', 'SFAR_AccessTo', 'string'],
  ['sFARAccessToName', 'SFAR_AccessToName', 'string'],
  ['sFARPurpose', 'SFAR_Purpose', 'string'],
  ['sFARJustification', 'SFAR_Justification', 'string'],
  ['uRRequestType', 'UR_RequestType', 'string'],
  ['uREmployeeNumber', 'UR_EmployeeNumber', 'string'],
  ['uRDesignation', 'UR_Designation', 'string'],
  ['uRCompany', 'UR_Company', 'string'],
  ['uRDivision', 'UR_Division', 'string'],
  ['uRExtension', 'UR_Extension', 'string'],
  ['uREmailAddress', 'UR_EmailAddress', 'string'],
  ['uRBankName', 'UR_BankName', 'string'],
  ['uRBankUserEmail', 'UR_BankUserEmail', 'string'],
  ['uRPlant', 'UR_Plant', 'string'],
  ['pRFSAPClient', 'PRF_SAPClient', 'string'],
  ['pRFSAPModule', 'PRF_SAPModule', 'string'],
  ['pRFDepartment', 'PRF_Department', 'string'],
  ['pRFPriority', 'PRF_Priority', 'string'],
  ['pRFDeadline', 'PRF_Deadline', 'string'],
  ['pRFPhoneExt', 'PRF_PhoneExt', 'string'],
  ['pRFCCEmails', 'PRF_CCEmails', 'string'],
  ['pRFObjective', 'PRF_Objective', 'string'],
  ['pRFJustification', 'PRF_Justification', 'string'],
  ['pRFCurrentProcess', 'PRF_CurrentProcess', 'string'],
  ['pRFExpectedOutcome', 'PRF_ExpectedOutcome', 'string'],
  ['hIPONumber', 'HI_PONumber', 'string'],
  ['hIWarrantyExpiry', 'HI_WarrantyExpiry', 'string'],
  ['hICondition', 'HI_Condition', 'string'],
  ['hISpecifications', 'HI_Specifications', 'string'],
  ['hIPurchasePrice', 'HI_PurchasePrice', 'number'],
] as const;

// Translate model camelCase names → SP column names in OData filter/orderBy
const FIELD_MAP: Record<string, string> = {
  currentstatus: 'CurrentStatus',
  formcode: 'FormCode',
  requestoremail: 'Requestor_Email',
  requestorname: 'Requestor_Name',
  currentaction: 'CurrentAction',
  approvedbyemail: 'ApprovedBy_Email',
  approvedbyname: 'ApprovedBy_Name',
  submitteddate: 'SubmittedDate',
  workflowstage: 'WorkflowStage',
  islocked: 'IsLocked',
  remarks: 'Remarks',
  hodapproverremarks: 'HODApproverRemarks',
  htmlemailtemplate: 'HTMLEMAILTEMPLATE',
  title: 'Title',
  id: 'ID',
};

for (const [modelField, sourceField] of STRUCTURED_FIELD_MAP) {
  FIELD_MAP[modelField.toLowerCase()] = sourceField;
}

function translateOptions(options?: IOperationOptions): IOperationOptions | undefined {
  if (!options) return undefined;
  const translated = { ...options };
  const keys = Object.keys(FIELD_MAP).join('|');
  const pattern = new RegExp(`\\b(${keys})\\b`, 'gi');
  if (translated.filter) {
    translated.filter = translated.filter.replace(
      pattern,
      (m) => FIELD_MAP[m.toLowerCase()] ?? m
    );
  }
  if (translated.orderBy) {
    const arr = Array.isArray(translated.orderBy) ? translated.orderBy : [translated.orderBy];
    translated.orderBy = arr.map((s) =>
      s.replace(pattern, (m) => FIELD_MAP[m.toLowerCase()] ?? m)
    );
  }
  return translated;
}

function str(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return undefined;
  return String(value);
}

function num(value: unknown): number | undefined {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

function bool(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value;
  if (value === null || value === undefined) return undefined;
  if (value === 'true' || value === 1) return true;
  if (value === 'false' || value === 0) return false;
  return undefined;
}

// Extract trailing integer from an enum key string: 'CurrentstatusKey30' -> 30
function keyId(key: string): number {
  const m = key.match(/(\d+)$/);
  return m ? parseInt(m[1], 10) : 0;
}

function choiceValue(value: string): { Value: string; Id?: number } {
  return { Value: value };
}

// SP choice columns read back as e.g. { Value: 'PendingIT', Id: 30 } or directly as key string
function choiceKey(prefix: string, record: RawMainDBIT, rawField: string, idField: string): string | undefined {
  const direct = record[rawField];
  if (typeof direct === 'string' && direct.startsWith(prefix)) return direct;
  const obj = record[rawField] as Record<string, unknown> | undefined;
  const id = obj?.Id ?? obj?.id ?? record[idField];
  if (id !== undefined) return `${prefix}${id}`;
  return undefined;
}

function normalize(record: RawMainDBIT): MainDBIT {
  const siteKeyVal = choiceKey('SiteKey', record, 'siteKey', 'Site#Id')
    ?? choiceKey('SiteKey', record, 'Site', 'Site#Id');
  const envKey = choiceKey('EnvironmenttagKey', record, 'environmenttagKey', 'EnvironmentTag#Id')
    ?? choiceKey('EnvironmenttagKey', record, 'EnvironmentTag', 'EnvironmentTag#Id');

  const normalized: MainDBIT = {
    ...record,
    id: record.id ?? num(record.ID ?? record.ItemInternalId) ?? 0,
    title: record.title ?? str(record.Title) ?? '',
    // Migration bridge: legacy keys, label text, or slugs all normalize to slugs
    currentStatus: normalizeStatusSlug(record.currentStatus ?? str(record.CurrentStatus) ?? ''),
    environmenttagKey: envKey as MainDBIT['environmenttagKey'],
    formcode: record.formcode ?? str(record.FormCode) ?? '',
    formTypeKey: (record.formTypeKey ?? record.FormTypeKey) as MainDBIT['formTypeKey'],
    hODApproverRemarks: record.hODApproverRemarks ?? str(record.HODApproverRemarks),
    hTMLEMAILTEMPLATE: record.hTMLEMAILTEMPLATE ?? str(record.HTMLEMAILTEMPLATE),
    islocked: record.islocked ?? bool(record.IsLocked),
    remarks: record.remarks ?? str(record.Remarks),
    requestoremail: record.requestoremail ?? str(record['Requestor_Email']),
    requestorName: record.requestorName ?? str(record.Requestor_Name),
    currentAction: record.currentAction ?? str(record.CurrentAction),
    approvedByEmail: record.approvedByEmail ?? str(record.ApprovedBy_Email),
    approvedByName: record.approvedByName ?? str(record.ApprovedBy_Name),
    siteKey: siteKeyVal as MainDBIT['siteKey'],
    submitteddate: record.submitteddate ?? str(record.SubmittedDate),
    workflowstage: record.workflowstage ?? num(record.WorkflowStage),
  };

  for (const [modelField, sourceField, valueType] of STRUCTURED_FIELD_MAP) {
    const existing = normalized[modelField as keyof MainDBIT];
    const rawValue = record[sourceField];
    if (existing === undefined && rawValue !== undefined) {
      (normalized as unknown as Record<string, unknown>)[modelField] = valueType === 'number' ? num(rawValue) : str(rawValue);
    }
  }

  return normalized;
}

function denormalize(record: Partial<Omit<MainDBIT, 'id'>>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (record.title !== undefined) out.Title = record.title;
  if (record.formcode !== undefined) out.FormCode = record.formcode;

  if (record.currentStatus !== undefined) {
    out.CurrentStatus = record.currentStatus;
  }

  // The Power Apps SharePoint connector exposes "#Id" for reads, but writes choices through the object Value.
  if (record.siteKey !== undefined) {
    out.Site = choiceValue(MainDBITSiteKeyToLabel[record.siteKey]);
  }
  if (record.environmenttagKey !== undefined) {
    out.EnvironmentTag = choiceValue(MainDBITEnvironmenttagKeyToLabel[record.environmenttagKey]);
  }
  if (record.hODApproverRemarks !== undefined) out.HODApproverRemarks = record.hODApproverRemarks;
  if (record.hTMLEMAILTEMPLATE !== undefined) out.HTMLEMAILTEMPLATE = record.hTMLEMAILTEMPLATE;
  if (record.islocked !== undefined) out.IsLocked = record.islocked;
  if (record.remarks !== undefined) out.Remarks = record.remarks;
  if (record.requestoremail !== undefined) out['Requestor_Email'] = record.requestoremail;
  if (record.requestorName !== undefined) out.Requestor_Name = record.requestorName;
  if (record.currentAction !== undefined) out.CurrentAction = record.currentAction;
  if (record.approvedByEmail !== undefined) out.ApprovedBy_Email = record.approvedByEmail;
  if (record.approvedByName !== undefined) out.ApprovedBy_Name = record.approvedByName;
  if (record.submitteddate !== undefined) out.SubmittedDate = record.submitteddate;
  if (record.workflowstage !== undefined) out.WorkflowStage = record.workflowstage;
  if (record.company !== undefined) out.Company = record.company;
  if (record.subject !== undefined) out.Subject = record.subject;
  if (record.nIRFullName !== undefined) out.NIR_FullName = record.nIRFullName;
  if (record.nIRDepartment !== undefined) out.NIR_Department = record.nIRDepartment;
  if (record.nIRRequestType !== undefined) out.NIR_RequestType = record.nIRRequestType;
  if (record.nIRHODApprovalStatus !== undefined) out.NIR_HODApprovalStatus = record.nIRHODApprovalStatus;
  if (record.nIRHODApprovedBy !== undefined) out.NIR_HODApprovedBy = record.nIRHODApprovedBy;
  if (record.nIRHODApprovedDate !== undefined) out.NIR_HODApprovedDate = record.nIRHODApprovedDate;
  if (record.nIRNotesAdminStatus !== undefined) out.NIR_NotesAdminStatus = record.nIRNotesAdminStatus;
  if (record.nIRNotesAdminBy !== undefined) out.NIR_NotesAdminBy = record.nIRNotesAdminBy;
  if (record.nIRNotesAdminDate !== undefined) out.NIR_NotesAdminDate = record.nIRNotesAdminDate;
  if (record.nIRITHardwareStatus !== undefined) out.NIR_ITHardwareStatus = record.nIRITHardwareStatus;
  if (record.nIRITHardwareBy !== undefined) out.NIR_ITHardwareBy = record.nIRITHardwareBy;
  if (record.nIREmployeeNumber !== undefined) out.NIR_EmployeeNumber = record.nIREmployeeNumber;
  if (record.nIRDesignation !== undefined) out.NIR_Designation = record.nIRDesignation;
  if (record.nIRPhoneExtension !== undefined) out.NIR_PhoneExtension = record.nIRPhoneExtension;
  if (record.nIRExistingEmailAddress !== undefined) out.NIR_ExistingEmailAddress = record.nIRExistingEmailAddress;
  if (record.nIREmployeeType !== undefined) out.NIR_EmployeeType = record.nIREmployeeType;
  if (record.hITagNo !== undefined) out.HI_TagNo = record.hITagNo;
  if (record.hIAssetNo !== undefined) out.HI_AssetNo = record.hIAssetNo;
  if (record.hIType !== undefined) out.HI_Type = record.hIType;
  if (record.hIComputerName !== undefined) out.HI_ComputerName = record.hIComputerName;
  if (record.hICompany !== undefined) out.HI_Company = record.hICompany;
  if (record.hIUsedByEmail !== undefined) out['HI_UsedBy_Email'] = record.hIUsedByEmail;
  if (record.hILocation !== undefined) out.HI_Location = record.hILocation;
  if (record.hIDepartment !== undefined) out.HI_Department = record.hIDepartment;
  if (record.hISerialNo !== undefined) out.HI_SerialNo = record.hISerialNo;
  if (record.hIPurchaseDate !== undefined) out.HI_PurchaseDate = record.hIPurchaseDate;
  if (record.hIVendor !== undefined) out.HI_Vendor = record.hIVendor;
  if (record.hIStatus !== undefined) out.HI_Status = record.hIStatus;
  if (record.hIYear !== undefined) out.HI_Year = record.hIYear;
  if (record.hIMonth !== undefined) out.HI_Month = record.hIMonth;
  if (record.pRFRequestNo !== undefined) out.PRF_RequestNo = record.pRFRequestNo;
  if (record.pRFRequestType !== undefined) out.PRF_RequestType = record.pRFRequestType;
  if (record.pRFIsSAP !== undefined) out.PRF_IsSAP = record.pRFIsSAP;
  if (record.pRFDeptManagerEmail !== undefined) out['PRF_DeptManager_Email'] = record.pRFDeptManagerEmail;
  if (record.pRFITApprovedEmail !== undefined) out['PRF_ITApproved_Email'] = record.pRFITApprovedEmail;
  if (record.pRFITApprovedDate !== undefined) out.PRF_ITApprovedDate = record.pRFITApprovedDate;
  if (record.rSTargetUserEmail !== undefined) out['RS_TargetUser_Email'] = record.rSTargetUserEmail;
  if (record.rSRequestType !== undefined) out.RS_RequestType = record.rSRequestType;
  if (record.rSNeedsEDApproval !== undefined) out.RS_NeedsEDApproval = record.rSNeedsEDApproval;
  if (record.rSITProcessedBy !== undefined) out.RS_ITProcessedBy = record.rSITProcessedBy;
  if (record.rSITProcessedDate !== undefined) out.RS_ITProcessedDate = record.rSITProcessedDate;
  if (record.rSEDApprovedBy !== undefined) out.RS_EDApprovedBy = record.rSEDApprovedBy;
  if (record.rSEDApprovedDate !== undefined) out.RS_EDApprovedDate = record.rSEDApprovedDate;
  if (record.sFARFolderPath !== undefined) out.SFAR_FolderPath = record.sFARFolderPath;
  if (record.sFARAccessLevel !== undefined) out.SFAR_AccessLevel = record.sFARAccessLevel;
  if (record.sFARReviewedBy !== undefined) out.SFAR_ReviewedBy = record.sFARReviewedBy;
  if (record.sFARReviewedDate !== undefined) out.SFAR_ReviewedDate = record.sFARReviewedDate;
  if (record.uRUserFullName !== undefined) out.UR_UserFullName = record.uRUserFullName;
  if (record.uRUserDepartment !== undefined) out.UR_UserDepartment = record.uRUserDepartment;
  if (record.uRSystemAccess !== undefined) out.UR_SystemAccess = record.uRSystemAccess;
  if (record.uRITAdminBy !== undefined) out.UR_ITAdminBy = record.uRITAdminBy;
  if (record.uRITAdminDate !== undefined) out.UR_ITAdminDate = record.uRITAdminDate;
  for (const [modelField, sourceField, valueType] of STRUCTURED_FIELD_MAP) {
    const value = (record as Record<string, unknown>)[modelField];
    if (value !== undefined) {
      // Apply type-safe conversion: number fields should receive numeric values,
      // not formatted strings (e.g., "1,234.56" would fail SP validation)
      out[sourceField] = valueType === 'number' ? num(value) : value;
    }
  }
  return out;
}

export class MainDBITService {
  static async create(record: Omit<MainDBIT, 'id'>): Promise<MainDBIT> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, denormalize(record));
    if (!result.success) throw result.error;
    return normalize(result.data as RawMainDBIT);
  }

  static async update(
    id: string,
    changedFields: Partial<Omit<MainDBIT, 'id'>>
  ): Promise<MainDBIT> {
    const result = await getClient().updateRecordAsync(
      DATA_SOURCE_NAME,
      id,
      denormalize(changedFields)
    );
    if (!result.success) throw result.error;
    return normalize(result.data as RawMainDBIT);
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  /**
   * Delete a parent record and cascade to all child extension records.
   * Searches known extension lists for records linked via parentRecord lookup.
   *
   * @param id Parent record ID
   * @param childServices Optional list of child service classes with a delete method
   *   e.g., [MainDBITExtAccessService, MainDBITExtSupportService, MainDBITExtSAPService]
   *
   * @example
   * await MainDBITService.deleteWithCascade('123', [
   *   MainDBITExtAccessService,
   *   MainDBITExtSupportService,
   * ]);
   */
  static async deleteWithCascade(
    id: string,
    childServices?: { delete: (id: string) => Promise<void>; getAll: (options?: IOperationOptions) => Promise<{ id: number }[]> }[]
  ): Promise<void> {
    if (childServices) {
      for (const service of childServices) {
        try {
          const children = await service.getAll({ filter: `parentRecord/id eq ${id}` });
          for (const child of children) {
            await service.delete(String(child.id));
          }
        } catch (err) {
          console.warn(`[Cascade] Failed to delete children for parent ${id}:`, err);
          // Continue — delete parent even if some children fail
        }
      }
    }
    // Delete parent record
    await MainDBITService.delete(id);
  }

  static async get(id: string): Promise<MainDBIT> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return normalize(result.data as RawMainDBIT);
  }

  static async getAll(options?: IOperationOptions): Promise<MainDBIT[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(
      DATA_SOURCE_NAME,
      translateOptions(options)
    );
    if (!result.success) throw result.error;
    return (result.data as RawMainDBIT[]).map(normalize);
  }
}
