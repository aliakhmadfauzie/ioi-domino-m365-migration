import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBITExtDocs } from '../models/main-dbit-ext-docs-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'maindb_it_ext_docs';

type Raw = Record<string, unknown>;

const FIELD_MAP: Record<string, string> = {
  id: 'ID',
  title: 'Title',
  parentformcode: 'ParentFormCode',
  parentsite: 'ParentSite',
};

function translateOptions(options?: IOperationOptions): IOperationOptions | undefined {
  if (!options) return undefined;
  const translated = { ...options };
  const pattern = /\b(parentformcode|parentsite|title|id)\b/gi;
  if (translated.filter) {
    translated.filter = translated.filter.replace(pattern, (m) => FIELD_MAP[m.toLowerCase()] ?? m);
  }
  if (translated.orderBy) {
    const arr = Array.isArray(translated.orderBy) ? translated.orderBy : [translated.orderBy];
    translated.orderBy = arr.map((s) => s.replace(pattern, (m) => FIELD_MAP[m.toLowerCase()] ?? m));
  }
  return translated;
}

function str(v: unknown): string | undefined {
  if (typeof v === 'string') return v;
  if (v === null || v === undefined) return undefined;
  return String(v);
}

function num(v: unknown): number | undefined {
  if (typeof v === 'number') return v;
  if (typeof v === 'string' && v.trim()) { const n = Number(v); return Number.isNaN(n) ? undefined : n; }
  return undefined;
}

function normalize(r: Raw): MainDBITExtDocs {
  const parent = r.parentRecord ?? r.ParentID;
  const parentObject = parent && typeof parent === 'object' ? parent as Record<string, unknown> : undefined;
  return {
    id: num(r.id) ?? num(r.ID) ?? 0,
    title: str(r.title) ?? str(r.Title) ?? '',
    parentFormCode: str(r.parentFormCode) ?? str(r.ParentFormCode) ?? '',
    parentRecord: (r.parentRecord as MainDBITExtDocs['parentRecord']) ?? {
      id: num(r['ParentID#Id'] ?? parentObject?.Id ?? parentObject?.id) ?? 0,
      title: str(parentObject?.Value ?? parentObject?.Title ?? parentObject?.title ?? r.ParentID) ?? '',
    },
    parentSite: str(r.parentSite) ?? str(r.ParentSite),
    // ITP
    iTPDocType: str(r.iTPDocType) ?? str(r.ITP_DocType),
    iTPDocTitle: str(r.iTPDocTitle) ?? str(r.ITP_DocTitle),
    iTPVersionNo: str(r.iTPVersionNo) ?? str(r.ITP_VersionNo),
    iTPDateLastUpdated: str(r.iTPDateLastUpdated) ?? str(r.ITP_DateLastUpdated),
    iTPRevisionNo: str(r.iTPRevisionNo) ?? str(r.ITP_RevisionNo),
    iTPApplicableTo: str(r.iTPApplicableTo) ?? str(r.ITP_ApplicableTo),
    iTPComments: str(r.iTPComments) ?? str(r.ITP_Comments),
    iTPAttachment: str(r.iTPAttachment) ?? str(r.ITP_Attachment),
    // ITP2
    iTP2TrainingType: str(r.iTP2TrainingType) ?? str(r.ITP2_TrainingType),
    iTP2Title: str(r.iTP2Title) ?? str(r.ITP2_Title),
    iTP2VersionNo: str(r.iTP2VersionNo) ?? str(r.ITP2_VersionNo),
    iTP2DateLastUpdated: str(r.iTP2DateLastUpdated) ?? str(r.ITP2_DateLastUpdated),
    iTP2RevisionNo: str(r.iTP2RevisionNo) ?? str(r.ITP2_RevisionNo),
    iTP2ApplicableTo: str(r.iTP2ApplicableTo) ?? str(r.ITP2_ApplicableTo),
    iTP2Comments: str(r.iTP2Comments) ?? str(r.ITP2_Comments),
    iTP2Attachment: str(r.iTP2Attachment) ?? str(r.ITP2_Attachment),
    // IOIP
    iOIPCategory: str(r.iOIPCategory) ?? str(r.IOIP_Category),
    iOIPTitle: str(r.iOIPTitle) ?? str(r.IOIP_Title),
    iOIPVersionNo: str(r.iOIPVersionNo) ?? str(r.IOIP_VersionNo),
    iOIPEffectiveDate: str(r.iOIPEffectiveDate) ?? str(r.IOIP_EffectiveDate),
    iOIPExpiryDate: str(r.iOIPExpiryDate) ?? str(r.IOIP_ExpiryDate),
    iOIPScope: str(r.iOIPScope) ?? str(r.IOIP_Scope),
    iOIPDescription: str(r.iOIPDescription) ?? str(r.IOIP_Description),
    iOIPObjective: str(r.iOIPObjective) ?? str(r.IOIP_Objective),
    // ITI
    iTIInfoType: str(r.iTIInfoType) ?? str(r.ITI_InfoType),
    iTISubject: str(r.iTISubject) ?? str(r.ITI_Subject),
    iTIRemarks: str(r.iTIRemarks) ?? str(r.ITI_Remarks),
    iTIAttachment: str(r.iTIAttachment) ?? str(r.ITI_Attachment),
  };
}

function denormalize(record: Partial<Omit<MainDBITExtDocs, 'id'>>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (record.title !== undefined) out.Title = record.title;
  if (record.parentFormCode !== undefined) out.ParentFormCode = record.parentFormCode;
  if (record.parentSite !== undefined) out.ParentSite = record.parentSite;
  if (record.parentRecord !== undefined) {
    out.ParentID = { Id: record.parentRecord.id, Value: record.parentRecord.title };
  }
  if (record.iTPDocType !== undefined) out.ITP_DocType = record.iTPDocType;
  if (record.iTPDocTitle !== undefined) out.ITP_DocTitle = record.iTPDocTitle;
  if (record.iTPVersionNo !== undefined) out.ITP_VersionNo = record.iTPVersionNo;
  if (record.iTPDateLastUpdated !== undefined) out.ITP_DateLastUpdated = record.iTPDateLastUpdated;
  if (record.iTPRevisionNo !== undefined) out.ITP_RevisionNo = record.iTPRevisionNo;
  if (record.iTPApplicableTo !== undefined) out.ITP_ApplicableTo = record.iTPApplicableTo;
  if (record.iTPComments !== undefined) out.ITP_Comments = record.iTPComments;
  if (record.iTPAttachment !== undefined) out.ITP_Attachment = record.iTPAttachment;
  if (record.iTP2TrainingType !== undefined) out.ITP2_TrainingType = record.iTP2TrainingType;
  if (record.iTP2Title !== undefined) out.ITP2_Title = record.iTP2Title;
  if (record.iTP2VersionNo !== undefined) out.ITP2_VersionNo = record.iTP2VersionNo;
  if (record.iTP2DateLastUpdated !== undefined) out.ITP2_DateLastUpdated = record.iTP2DateLastUpdated;
  if (record.iTP2RevisionNo !== undefined) out.ITP2_RevisionNo = record.iTP2RevisionNo;
  if (record.iTP2ApplicableTo !== undefined) out.ITP2_ApplicableTo = record.iTP2ApplicableTo;
  if (record.iTP2Comments !== undefined) out.ITP2_Comments = record.iTP2Comments;
  if (record.iTP2Attachment !== undefined) out.ITP2_Attachment = record.iTP2Attachment;
  if (record.iOIPCategory !== undefined) out.IOIP_Category = record.iOIPCategory;
  if (record.iOIPTitle !== undefined) out.IOIP_Title = record.iOIPTitle;
  if (record.iOIPVersionNo !== undefined) out.IOIP_VersionNo = record.iOIPVersionNo;
  if (record.iOIPEffectiveDate !== undefined) out.IOIP_EffectiveDate = record.iOIPEffectiveDate;
  if (record.iOIPExpiryDate !== undefined) out.IOIP_ExpiryDate = record.iOIPExpiryDate;
  if (record.iOIPScope !== undefined) out.IOIP_Scope = record.iOIPScope;
  if (record.iOIPDescription !== undefined) out.IOIP_Description = record.iOIPDescription;
  if (record.iOIPObjective !== undefined) out.IOIP_Objective = record.iOIPObjective;
  if (record.iTIInfoType !== undefined) out.ITI_InfoType = record.iTIInfoType;
  if (record.iTISubject !== undefined) out.ITI_Subject = record.iTISubject;
  if (record.iTIRemarks !== undefined) out.ITI_Remarks = record.iTIRemarks;
  if (record.iTIAttachment !== undefined) out.ITI_Attachment = record.iTIAttachment;
  return out;
}

export class MainDBITExtDocsService {
  static async create(record: Omit<MainDBITExtDocs, 'id'>): Promise<MainDBITExtDocs> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, denormalize(record));
    if (!result.success) throw result.error;
    return normalize(result.data as Raw);
  }

  static async update(id: string, changedFields: Partial<Omit<MainDBITExtDocs, 'id'>>): Promise<MainDBITExtDocs> {
    const result = await getClient().updateRecordAsync(DATA_SOURCE_NAME, id, denormalize(changedFields));
    if (!result.success) throw result.error;
    return normalize(result.data as Raw);
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<MainDBITExtDocs> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return normalize(result.data as Raw);
  }

  static async getAll(options?: IOperationOptions): Promise<MainDBITExtDocs[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DATA_SOURCE_NAME, translateOptions(options));
    if (!result.success) throw result.error;
    return (result.data as Raw[]).map(normalize);
  }
}
