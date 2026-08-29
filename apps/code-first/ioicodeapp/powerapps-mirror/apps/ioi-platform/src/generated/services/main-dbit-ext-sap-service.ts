import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBITExtSAP } from '../models/main-dbit-ext-sap-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'maindb_it_ext_sap';

type Raw = Record<string, unknown>;

function str(v: unknown): string | undefined {
  if (typeof v === 'string') return v;
  if (v === null || v === undefined) return undefined;
  return String(v);
}

function num(v: unknown): number | undefined {
  if (typeof v === 'number') return v;
  if (typeof v === 'string' && v.trim()) {
    const n = Number(v);
    return Number.isNaN(n) ? undefined : n;
  }
  return undefined;
}

function parentObject(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' ? value as Record<string, unknown> : undefined;
}

function translateOptions(options?: IOperationOptions): IOperationOptions | undefined {
  if (!options) return undefined;
  const translated = { ...options };
  if (translated.filter) {
    translated.filter = translated.filter
      .replace(/\bparentRecord\/(?:id|ID)\b/gi, 'ParentID/Id')
      .replace(/\bparentRecord\b/gi, 'ParentID')
      .replace(/\bparentFormCode\b/gi, 'ParentFormCode')
      .replace(/\bparentSite\b/gi, 'ParentSite')
      .replace(/\btitle\b/gi, 'Title')
      .replace(/\bid\b/gi, 'ID');
  }
  return translated;
}

function normalize(record: Raw): MainDBITExtSAP {
  const parent = record.parentRecord ?? record.ParentID;
  const parentLookup = parentObject(parent);
  return {
    ...record,
    id: num(record.id) ?? num(record.ID) ?? 0,
    title: str(record.title) ?? str(record.Title) ?? '',
    parentFormCode: str(record.parentFormCode) ?? str(record.ParentFormCode) ?? '',
    parentRecord: (record.parentRecord as MainDBITExtSAP['parentRecord']) ?? {
      id: num(record['ParentID#Id'] ?? parentLookup?.Id ?? parentLookup?.id) ?? 0,
      title: str(parentLookup?.Value ?? parentLookup?.Title ?? parentLookup?.title ?? record.ParentID) ?? '',
    },
    parentSite: str(record.parentSite) ?? str(record.ParentSite),
  } as MainDBITExtSAP;
}

function denormalize(record: Partial<Omit<MainDBITExtSAP, 'id'>>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...record };
  if (record.title !== undefined) out.Title = record.title;
  if (record.parentFormCode !== undefined) out.ParentFormCode = record.parentFormCode;
  if (record.parentSite !== undefined) out.ParentSite = record.parentSite;
  if (record.parentRecord !== undefined) {
    out.ParentID = { Id: record.parentRecord.id, Value: record.parentRecord.title };
  }
  delete out.title;
  delete out.parentFormCode;
  delete out.parentSite;
  delete out.parentRecord;
  return out;
}

export class MainDBITExtSAPService {
  static async create(record: Omit<MainDBITExtSAP, 'id'>): Promise<MainDBITExtSAP> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, denormalize(record));
    if (!result.success) throw result.error;
    return normalize(result.data as Raw);
  }

  static async update(
    id: string,
    changedFields: Partial<Omit<MainDBITExtSAP, 'id'>>
  ): Promise<MainDBITExtSAP> {
    const result = await getClient().updateRecordAsync(DATA_SOURCE_NAME, id, denormalize(changedFields));
    if (!result.success) throw result.error;
    return normalize(result.data as Raw);
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<MainDBITExtSAP> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return normalize(result.data as Raw);
  }

  static async getAll(options?: IOperationOptions): Promise<MainDBITExtSAP[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DATA_SOURCE_NAME, translateOptions(options));
    if (!result.success) throw result.error;
    return (result.data as Raw[]).map(normalize);
  }
}
