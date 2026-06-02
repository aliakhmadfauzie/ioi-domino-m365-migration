import { getClient } from '../../../app-gen-sdk/data';
import type { PRFWorkTasks } from '../models/prf-work-tasks-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'PRFWorkTasks';

type Raw = Record<string, unknown>;

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
      .replace(/\btitle\b/gi, 'Title')
      .replace(/\bid\b/gi, 'ID');
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

function normalize(r: Raw): PRFWorkTasks {
  const parent = r.parentRecord ?? r.ParentID;
  const parentLookup = parentObject(parent);
  return {
    id: num(r.id) ?? num(r.ID) ?? 0,
    title: str(r.title) ?? str(r.Title) ?? '',
    parentFormCode: str(r.parentFormCode) ?? str(r.ParentFormCode) ?? '',
    parentRecord: (r.parentRecord as PRFWorkTasks['parentRecord']) ?? {
      id: num(r['ParentID#Id'] ?? parentLookup?.Id ?? parentLookup?.id) ?? 0,
      title: str(parentLookup?.Value ?? parentLookup?.Title ?? parentLookup?.title ?? r.ParentID) ?? '',
    },
    taskNo: str(r.taskNo) ?? str(r.Task_No),
    taskDescription: str(r.taskDescription) ?? str(r.Task_Description),
    taskAssignedTo: str(r.taskAssignedTo) ?? str(r.Task_AssignedTo),
    taskDueDate: str(r.taskDueDate) ?? str(r.Task_DueDate),
    taskStatus: str(r.taskStatus) ?? str(r.Task_Status),
    taskStartDate: str(r.taskStartDate) ?? str(r.Task_StartDate),
    taskCompletedDate: str(r.taskCompletedDate) ?? str(r.Task_CompletedDate),
    taskRemarks: str(r.taskRemarks) ?? str(r.Task_Remarks),
  };
}

function denormalize(record: Partial<Omit<PRFWorkTasks, 'id'>>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...record };
  if (record.title !== undefined) out.Title = record.title;
  if (record.parentFormCode !== undefined) out.ParentFormCode = record.parentFormCode;
  if (record.parentRecord !== undefined) {
    out.ParentID = { Id: record.parentRecord.id, Value: record.parentRecord.title };
  }
  delete out.title;
  delete out.parentFormCode;
  delete out.parentRecord;
  return out;
}

export class PRFWorkTasksService {
  static async create(record: Omit<PRFWorkTasks, 'id'>): Promise<PRFWorkTasks> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, denormalize(record));
    if (!result.success) throw result.error;
    return normalize(result.data as Raw);
  }

  static async update(id: string, changedFields: Partial<Omit<PRFWorkTasks, 'id'>>): Promise<PRFWorkTasks> {
    const result = await getClient().updateRecordAsync(DATA_SOURCE_NAME, id, denormalize(changedFields));
    if (!result.success) throw result.error;
    return normalize(result.data as Raw);
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<PRFWorkTasks> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return normalize(result.data as Raw);
  }

  static async getAll(options?: IOperationOptions): Promise<PRFWorkTasks[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DATA_SOURCE_NAME, translateOptions(options));
    if (!result.success) throw result.error;
    return (result.data as Raw[]).map(normalize);
  }
}
