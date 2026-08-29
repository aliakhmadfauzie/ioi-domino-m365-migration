import { getClient } from '../../../app-gen-sdk/data';
import {
  ApprovalRecordsActionKeyToLabel,
  type ApprovalRecords,
  type ApprovalRecordsActionKey,
} from '../models/approval-records-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'ApprovalRecords';

type RawApprovalRecords = Record<string, unknown>;

const FIELD_MAP: Record<string, string> = {
  id: 'ID',
  stagename: 'Title',
  actionbyid: 'ActionByID',
  actionbyname: 'ActionByName',
  actiondate: 'ActionDate',
  action: 'Action',
  actionkey: 'Action',
  comments: 'Comments',
  formcode: 'FormCode',
  formid: 'FormID',
  nextstage: 'NextStage',
  stagenumber: 'StageNumber',
};

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

function choiceVal(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'Value' in value) {
    return String((value as { Value?: string }).Value ?? '');
  }
  return undefined;
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

function actionKey(value: unknown): ApprovalRecordsActionKey | undefined {
  switch (choiceVal(value)?.trim().toLowerCase()) {
    case 'approved': return 'ActionKey0';
    case 'rejected': return 'ActionKey1';
    case 'returned': return 'ActionKey2';
    case 'submitted': return 'ActionKey3';
    case 'completed': return 'ActionKey4';
    default: return undefined;
  }
}

// SP column names → model camelCase
function normalizeApprovalRecords(record: RawApprovalRecords): ApprovalRecords {
  return {
    id: num(record.id) ?? num(record.ID) ?? 0,
    stagename: str(record.stagename) ?? str(record.Title) ?? '',
    formid: str(record.formid) ?? str(record.FormID) ?? '',
    formcode: str(record.formcode) ?? str(record.FormCode) ?? '',
    stagenumber: num(record.stagenumber) ?? num(record.StageNumber),
    actionbyid: str(record.actionbyid) ?? str(record.ActionByID),
    actionbyname: str(record.actionbyname) ?? str(record.ActionByName),
    actiondate: str(record.actiondate) ?? str(record.ActionDate),
    actionKey:
      (record.actionKey as ApprovalRecordsActionKey | undefined) ??
      actionKey(record.Action),
    comments: str(record.comments) ?? str(record.Comments),
    nextstage: str(record.nextstage) ?? str(record.NextStage),
  };
}

// Model camelCase → SP column names + resolve enum keys to string values
function denormalizeApprovalRecords(
  record: Partial<Omit<ApprovalRecords, 'id'>>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (record.stagename !== undefined) out.Title = record.stagename;
  if (record.formid !== undefined) out.FormID = record.formid;
  if (record.formcode !== undefined) out.FormCode = record.formcode;
  if (record.stagenumber !== undefined) out.StageNumber = record.stagenumber;
  if (record.actionbyid !== undefined) out.ActionByID = record.actionbyid;
  if (record.actionbyname !== undefined) out.ActionByName = record.actionbyname;
  if (record.actiondate !== undefined) out.ActionDate = record.actiondate;
  if (record.actionKey !== undefined)
    out.Action = { Value: ApprovalRecordsActionKeyToLabel[record.actionKey] };
  if (record.comments !== undefined) out.Comments = record.comments;
  if (record.nextstage !== undefined) out.NextStage = record.nextstage;
  return out;
}

export class ApprovalRecordsService {
  static async create(record: Omit<ApprovalRecords, 'id'>): Promise<ApprovalRecords> {
    const result = await getClient().createRecordAsync(
      DATA_SOURCE_NAME,
      denormalizeApprovalRecords(record)
    );
    if (!result.success) throw result.error;
    return normalizeApprovalRecords(result.data as RawApprovalRecords);
  }

  static async update(
    id: string,
    changedFields: Partial<Omit<ApprovalRecords, 'id'>>
  ): Promise<ApprovalRecords> {
    const result = await getClient().updateRecordAsync(
      DATA_SOURCE_NAME,
      id,
      denormalizeApprovalRecords(changedFields)
    );
    if (!result.success) throw result.error;
    return normalizeApprovalRecords(result.data as RawApprovalRecords);
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<ApprovalRecords> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return normalizeApprovalRecords(result.data as RawApprovalRecords);
  }

  static async getAll(options?: IOperationOptions): Promise<ApprovalRecords[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DATA_SOURCE_NAME, translateOptions(options));
    if (!result.success) throw result.error;
    return (result.data as RawApprovalRecords[]).map(normalizeApprovalRecords);
  }
}
