import { getClient } from '../../../app-gen-sdk/data';
import type { ITSAPSOFTestEvidence } from '../models/it-sapsof-test-evidence-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'ITSAPSOFTestEvidence';

type Raw = Record<string, unknown>;

const FIELD_MAP: Record<string, string> = {
  id: 'ID',
  title: 'Title',
  parentformcode: 'ParentFormCode',
  parentrecord: 'ParentID',
  evidencetestno: 'Evidence_TestNo',
  evidencedescription: 'Evidence_Description',
  evidenceexpectedresult: 'Evidence_ExpectedResult',
  evidenceactualresult: 'Evidence_ActualResult',
  evidencestatus: 'Evidence_Status',
  evidencetestedby: 'Evidence_TestedBy',
  evidencetesteddate: 'Evidence_TestedDate',
  evidenceremarks: 'Evidence_Remarks',
};

function translateOptions(options?: IOperationOptions): IOperationOptions | undefined {
  if (!options) return undefined;
  const translated = { ...options };
  const pattern = new RegExp(`\\b(${Object.keys(FIELD_MAP).join('|')})\\b`, 'gi');
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

function normalize(r: Raw): ITSAPSOFTestEvidence {
  const parent = r.parentRecord ?? r.ParentID;
  const parentObject = parent && typeof parent === 'object' ? parent as Record<string, unknown> : undefined;
  return {
    id: num(r.id) ?? num(r.ID) ?? 0,
    title: str(r.title) ?? str(r.Title) ?? '',
    parentFormCode: str(r.parentFormCode) ?? str(r.ParentFormCode) ?? '',
    parentRecord: (r.parentRecord as ITSAPSOFTestEvidence['parentRecord']) ?? {
      id: num(r['ParentID#Id'] ?? parentObject?.Id ?? parentObject?.id) ?? 0,
      title: str(parentObject?.Value ?? parentObject?.Title ?? parentObject?.title ?? r.ParentID) ?? '',
    },
    evidenceTestNo: str(r.evidenceTestNo) ?? str(r.Evidence_TestNo),
    evidenceDescription: str(r.evidenceDescription) ?? str(r.Evidence_Description),
    evidenceExpectedResult: str(r.evidenceExpectedResult) ?? str(r.Evidence_ExpectedResult),
    evidenceActualResult: str(r.evidenceActualResult) ?? str(r.Evidence_ActualResult),
    evidenceStatus: str(r.evidenceStatus) ?? str(r.Evidence_Status),
    evidenceTestedBy: str(r.evidenceTestedBy) ?? str(r.Evidence_TestedBy),
    evidenceTestedDate: str(r.evidenceTestedDate) ?? str(r.Evidence_TestedDate),
    evidenceRemarks: str(r.evidenceRemarks) ?? str(r.Evidence_Remarks),
  };
}

function denormalize(record: Partial<Omit<ITSAPSOFTestEvidence, 'id'>>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (record.title !== undefined) out.Title = record.title;
  if (record.parentFormCode !== undefined) out.ParentFormCode = record.parentFormCode;
  if (record.parentRecord !== undefined) {
    out.ParentID = { Id: record.parentRecord.id, Value: record.parentRecord.title };
  }
  if (record.evidenceTestNo !== undefined) out.Evidence_TestNo = record.evidenceTestNo;
  if (record.evidenceDescription !== undefined) out.Evidence_Description = record.evidenceDescription;
  if (record.evidenceExpectedResult !== undefined) out.Evidence_ExpectedResult = record.evidenceExpectedResult;
  if (record.evidenceActualResult !== undefined) out.Evidence_ActualResult = record.evidenceActualResult;
  if (record.evidenceStatus !== undefined) out.Evidence_Status = record.evidenceStatus;
  if (record.evidenceTestedBy !== undefined) out.Evidence_TestedBy = record.evidenceTestedBy;
  if (record.evidenceTestedDate !== undefined) out.Evidence_TestedDate = record.evidenceTestedDate;
  if (record.evidenceRemarks !== undefined) out.Evidence_Remarks = record.evidenceRemarks;
  return out;
}

export class ITSAPSOFTestEvidenceService {
  static async create(record: Omit<ITSAPSOFTestEvidence, 'id'>): Promise<ITSAPSOFTestEvidence> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, denormalize(record));
    if (!result.success) throw result.error;
    return normalize(result.data as Raw);
  }

  static async update(id: string, changedFields: Partial<Omit<ITSAPSOFTestEvidence, 'id'>>): Promise<ITSAPSOFTestEvidence> {
    const result = await getClient().updateRecordAsync(DATA_SOURCE_NAME, id, denormalize(changedFields));
    if (!result.success) throw result.error;
    return normalize(result.data as Raw);
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<ITSAPSOFTestEvidence> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return normalize(result.data as Raw);
  }

  static async getAll(options?: IOperationOptions): Promise<ITSAPSOFTestEvidence[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DATA_SOURCE_NAME, translateOptions(options));
    if (!result.success) throw result.error;
    return (result.data as Raw[]).map(normalize);
  }
}
