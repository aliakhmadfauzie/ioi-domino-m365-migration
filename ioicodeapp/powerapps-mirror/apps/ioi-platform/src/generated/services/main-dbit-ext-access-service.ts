import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBITExtAccess } from '../models/main-dbit-ext-access-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'maindb_it_ext_access';

type RawExtAccess = Record<string, unknown>;

const EXT_ACCESS_FIELD_MAP: Record<string, string> = {
  parentformcode: 'ParentFormCode',
  parentrecord: 'ParentID',
  parentsite: 'ParentSite',
  title: 'Title',
  id: 'ID',
  // EAF fields
  eafapplication: 'EAF_Application',
  eaftargetuseremail: 'EAF_TargetUser_Email',
  eafsystemname: 'EAF_SystemName',
  eafjustification: 'EAF_Justification',
  eafdeptheademail: 'EAF_DeptHead_Email',
  eafdeptheadstatus: 'EAF_DeptHeadStatus',
  eafdeptheaddate: 'EAF_DeptHeadDate_dt',
  eafdeptheadcomment: 'EAF_DeptHeadComment',
  eafddappapprovedby: 'EAF_DDAppApprovedBy',
  eafddappstatus: 'EAF_DDAppStatus',
  eafddappdate: 'EAF_DDAppDate_dt',
  eafddappcomment: 'EAF_DDAppComment',
  eafitmanagerapprovedby: 'EAF_ITManagerApprovedBy',
  eafitmanagerstatus: 'EAF_ITManagerStatus',
  eafitmanagerdate: 'EAF_ITManagerDate_dt',
  eafitmanagercomment: 'EAF_ITManagerComment',
  eafitcompletedby: 'EAF_ITCompletedBy',
  eafitcompleteddate: 'EAF_ITCompletedDate_dt',
  eafitcompletionstatus: 'EAF_ITCompletionStatus',
  eafispcn: 'EAF_IsPCN',
  eafreminderto: 'EAF_ReminderTo',
  eafcc: 'EAF_CC',
  eafitcomment: 'EAF_ITComment',
  eafattachment: 'EAF_Attachment',
  eafitconfigremarks: 'EAF_ITConfigRemarks',
  eafitconfigstatus: 'EAF_ITConfigStatus',
  eafclientid: 'EAF_ClientID',
  eafusergroup: 'EAF_UserGroup',
  eafhigherapproveremail: 'EAF_HigherApprover_Email',
  // NIR fields
  nirfullname: 'NIR_FullName',
  nirdepartment: 'NIR_Department',
  nirrequesttype: 'NIR_RequestType',
  nirhodapprovalstatus: 'NIR_HODApprovalStatus',
  nirhodapprovedby: 'NIR_HODApprovedBy',
  nirhodapproveddate: 'NIR_HODApprovedDate_dt',
  nirnotesadminstatus: 'NIR_NotesAdminStatus',
  nirnotesadminby: 'NIR_NotesAdminBy',
  nirnotesadmindate: 'NIR_NotesAdmin_Date',
  nirithardwarestatus: 'NIR_ITHardware_Status',
  nirithardwareby: 'NIR_ITHardware_By',
  niremailtype: 'NIR_EmailType',
  nirremark: 'NIR_Remark',
  nirhodcomment: 'NIR_HOD_Comment',
  nirpicremark: 'NIR_PIC_Remark',
  niraccname: 'NIR_Acc_Name',
  niraccdate: 'NIR_Acc_Date',
  niracccomment: 'NIR_Acc_Comment',
  // RS fields (in ExtAccess)
  rsedapprovedby: 'RS_EDApprovedBy',
  rsedapproveddate: 'RS_EDApprovedDate_dt',
  rsitprocessedby: 'RS_ITProcessedBy',
  rsitprocesseddate: 'RS_ITProcessedDate_dt',
  rsneedsedapproval: 'RS_NeedsEDApproval',
  rsrequesttype: 'RS_RequestType',
  rstargetuseremail: 'RS_TargetUser_Email',
  // SFAR fields (in ExtAccess)
  sfaraccesslevel: 'SFAR_AccessLevel',
  sfarfolderpath: 'SFAR_FolderPath',
  sfarreviewedby: 'SFAR_ReviewedBy',
  sfarrevieweddate: 'SFAR_ReviewedDate_dt',
  // UR fields
  uritadminby: 'UR_ITAdminBy',
  uritadmindate: 'UR_ITAdminDate_dt',
  ursystemaccess: 'UR_SystemAccess',
  uruserdepartment: 'UR_UserDepartment',
  uruserfullname: 'UR_UserFullName',
  // PRF workflow fields
  prfstatus1: 'PRF_Status1',
  prfstatus2: 'PRF_Status2',
  prfstatus3: 'PRF_Status3',
  prfstatus4: 'PRF_Status4',
  prffinalstatus: 'PRF_FinalStatus',
  prfstatusisg: 'PRF_StatusISG',
  prfdateapp1: 'PRF_DateApp1',
  prfdateapp2: 'PRF_DateApp2',
  prfdateapp2_1: 'PRF_DateApp2_1',
  prfdateapp3: 'PRF_DateApp3',
  prfdateapp4: 'PRF_DateApp4',
  prfdatesent: 'PRF_DateSent',
  prfdateisg: 'PRF_DateISG',
  prfdepthead: 'PRF_DeptHead',
  prfisg: 'PRF_ISG',
  prfismgr2: 'PRF_Ismgr2',
  prfismgr: 'PRF_Ismgr',
  prfappbyisg: 'PRF_AppByISG',
  prfappbysap: 'PRF_AppBySAP',
  prfbyisstaff: 'PRF_ByISStaff',
  prfnotifiedby: 'PRF_NotifiedBy',
  prfabap: 'PRF_ABAP',
  prffuncownersap: 'PRF_FuncOwnerSAP',
  prfattachedby: 'PRF_AttachedBy',
  prfcomments1: 'PRF_Comments1',
  prfcomment1: 'PRF_Comment1',
  prfcommentsisg: 'PRF_CommentsISG',
  prfitreason: 'PRF_ITReason',
  prfrating: 'PRF_Rating',
  prfrfc: 'PRF_RFC',
};

const EXT_ACCESS_CANONICAL_FIELDS: Record<string, keyof MainDBITExtAccess> = {
  parentformcode: 'parentFormCode',
  parentrecord: 'parentRecord',
  parentsite: 'parentSite',
  rsneedsedapproval: 'rSNeedsEDApproval',
  rsrequesttype: 'rSRequestType',
  rstargetuseremail: 'rSTargetUserEmail',
  sfaraccesslevel: 'sFARAccessLevel',
  sfarfolderpath: 'sFARFolderPath',
  sfarreviewedby: 'sFARReviewedBy',
  sfarrevieweddate: 'sFARReviewedDate',
  uritadminby: 'uRITAdminBy',
  uritadmindate: 'uRITAdminDate',
  ursystemaccess: 'uRSystemAccess',
  uruserdepartment: 'uRUserDepartment',
  uruserfullname: 'uRUserFullName',
  prfstatus1: 'pRFStatus1',
  prfstatus2: 'pRFStatus2',
  prfstatus3: 'pRFStatus3',
  prfstatus4: 'pRFStatus4',
  prffinalstatus: 'pRFFinalStatus',
  prfstatusisg: 'pRFStatusISG',
  prfdateapp1: 'pRFDateApp1',
  prfdateapp2: 'pRFDateApp2',
  prfdateapp2_1: 'pRFDateApp2_1',
  prfdateapp3: 'pRFDateApp3',
  prfdateapp4: 'pRFDateApp4',
  prfdatesent: 'pRFDateSent',
  prfdateisg: 'pRFDateISG',
  prfdepthead: 'pRFDeptHead',
  prfisg: 'pRFISG',
  prfismgr2: 'pRFIsmgr2',
  prfismgr: 'pRFIsmgr',
  prfappbyisg: 'pRFAppByISG',
  prfappbysap: 'pRFAppBySAP',
  prfbyisstaff: 'pRFByISStaff',
  prfnotifiedby: 'pRFNotifiedBy',
  prfabap: 'pRFABAP',
  prffuncownersap: 'pRFFuncOwnerSAP',
  prfattachedby: 'pRFAttachedBy',
  prfcomments1: 'pRFComments1',
  prfcomment1: 'pRFComment1',
  prfcommentsisg: 'pRFCommentsISG',
  prfitreason: 'pRFITReason',
  prfrating: 'pRFRating',
  prfrfc: 'pRFRFC',
};

function translateOptions(options?: IOperationOptions): IOperationOptions | undefined {
  if (!options) return undefined;
  const translated = { ...options };
  const keys = Object.keys(EXT_ACCESS_FIELD_MAP).join('|');
  const pattern = new RegExp(`\\b(${keys})\\b`, 'gi');
  if (translated.filter) {
    translated.filter = translated.filter.replace(
      pattern,
      (m) => EXT_ACCESS_FIELD_MAP[m.toLowerCase()] ?? m
    );
  }
  if (translated.orderBy) {
    const arr = Array.isArray(translated.orderBy) ? translated.orderBy : [translated.orderBy];
    translated.orderBy = arr.map((s) =>
      s.replace(pattern, (m) => EXT_ACCESS_FIELD_MAP[m.toLowerCase()] ?? m)
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
    const n = Number(value);
    return Number.isNaN(n) ? undefined : n;
  }
  return undefined;
}

function normalizeExtAccess(record: RawExtAccess): MainDBITExtAccess {
  const normalized: Record<string, unknown> = {
    ...record,
    id: num(record.id) ?? num(record.ID) ?? 0,
    title: str(record.title) ?? str(record.Title) ?? '',
    parentFormCode: str(record.parentFormCode) ?? str(record.ParentFormCode) ?? '',
    parentRecord: (record.parentRecord as MainDBITExtAccess['parentRecord']) ?? {
      id:
        num(record['ParentID#Id']) ??
        num((record.ParentID as { Id?: unknown; id?: unknown } | undefined)?.Id) ??
        num((record.ParentID as { Id?: unknown; id?: unknown } | undefined)?.id) ??
        0,
      title:
        str((record.ParentID as { Value?: unknown; Title?: unknown; title?: unknown } | undefined)?.Value) ??
        str((record.ParentID as { Value?: unknown; Title?: unknown; title?: unknown } | undefined)?.Title) ??
        str((record.ParentID as { Value?: unknown; Title?: unknown; title?: unknown } | undefined)?.title) ??
        str(record.ParentID) ??
        '',
    },
    parentSite: str(record.parentSite) ?? str(record.ParentSite),
  };

  for (const [modelField, sourceField] of Object.entries(EXT_ACCESS_FIELD_MAP)) {
    if (['id', 'title', 'parentformcode', 'parentrecord', 'parentsite'].includes(modelField)) continue;
    const canonicalField = EXT_ACCESS_CANONICAL_FIELDS[modelField] ?? modelField;
    const existingKey = Object.keys(normalized).find((key) => key.toLowerCase() === canonicalField.toLowerCase());
    if (existingKey && normalized[existingKey] !== undefined) continue;
    if (record[sourceField] !== undefined) {
      normalized[canonicalField] = modelField === 'prfrating'
        ? num(record[sourceField])
        : str(record[sourceField]);
    }
  }

  return normalized as unknown as MainDBITExtAccess;
}

function denormalizeExtAccess(record: Partial<Omit<MainDBITExtAccess, 'id'>>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [modelField, value] of Object.entries(record)) {
    if (value === undefined) continue;
    if (modelField === 'parentRecord') {
      const parent = value as MainDBITExtAccess['parentRecord'];
      out.ParentID = { Id: parent.id, Value: parent.title };
      continue;
    }
    const sourceField = EXT_ACCESS_FIELD_MAP[modelField.toLowerCase()];
    if (sourceField) {
      out[sourceField] = value;
    } else {
      out[modelField] = value;
    }
  }
  return out;
}

export class MainDBITExtAccessService {
  static async create(record: Omit<MainDBITExtAccess, 'id'>): Promise<MainDBITExtAccess> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, denormalizeExtAccess(record));
    if (!result.success) throw result.error;
    return normalizeExtAccess(result.data as RawExtAccess);
  }

  static async update(
    id: string,
    changedFields: Partial<Omit<MainDBITExtAccess, 'id'>>
  ): Promise<MainDBITExtAccess> {
    const result = await getClient().updateRecordAsync(
      DATA_SOURCE_NAME,
      id,
      denormalizeExtAccess(changedFields)
    );
    if (!result.success) throw result.error;
    return normalizeExtAccess(result.data as RawExtAccess);
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<MainDBITExtAccess> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return normalizeExtAccess(result.data as RawExtAccess);
  }

  static async getAll(options?: IOperationOptions): Promise<MainDBITExtAccess[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(
      DATA_SOURCE_NAME,
      translateOptions(options)
    );
    if (!result.success) throw result.error;
    return (result.data as RawExtAccess[]).map(normalizeExtAccess);
  }
}
