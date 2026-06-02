import type { getDefaultStore } from 'jotai';
import { v4 as uuidv4 } from 'uuid';
import { DebugEventType } from './debugTypes';
import type { DebugEvent, WriteEventDetail, LastWriteResult } from './debugTypes';
import {
  appendDebugEventAtom,
  setLastWriteResultAtom,
  debugEnabledAtom,
} from './debugStore';

type JotaiStore = ReturnType<typeof getDefaultStore>;

// Shared jotai store instance — set by useDebugInit via setDebugLoggerStore()
let _store: JotaiStore | null = null;

export function setDebugLoggerStore(store: JotaiStore): void {
  _store = store;
}

function getStore(): JotaiStore | null {
  return _store;
}

function isEnabled(): boolean {
  const store = getStore();
  if (!store) return false;
  return store.get(debugEnabledAtom);
}

// ─── Value masking ────────────────────────────────────────────────────────────

/** Returns a safe preview string — never exposes the full value */
export function maskValue(value: unknown): string {
  if (value === null || value === undefined) return '(null)';
  const s = String(value);
  if (s.length === 0) return '(empty)';
  if (s.length <= 3) return '***';
  return s.slice(0, 2) + '…' + s.slice(-1);
}

// ─── Append helper ────────────────────────────────────────────────────────────

function push(event: DebugEvent): void {
  const store = getStore();
  if (!store) return;
  store.set(appendDebugEventAtom, event);
}

// ─── Public loggers ───────────────────────────────────────────────────────────

export function logNavigation(params: {
  screenId: string;
  routePath: string;
  userId?: string;
}): void {
  if (!isEnabled()) return;
  push({
    id: uuidv4(),
    type: DebugEventType.Navigation,
    timestamp: new Date().toISOString(),
    screenId: params.screenId,
    userId: params.userId,
    summary: `Navigated → ${params.routePath}`,
    details: { routePath: params.routePath },
    success: true,
  });
}

export function logReadEvent(params: {
  screenId: string;
  sourceKey: string;
  listName: string;
  recordCount: number;
  durationMs: number;
  success: boolean;
  errorMessage?: string;
  userId?: string;
}): void {
  if (!isEnabled()) return;
  push({
    id: uuidv4(),
    type: DebugEventType.Read,
    timestamp: new Date().toISOString(),
    screenId: params.screenId,
    sourceKey: params.sourceKey,
    userId: params.userId,
    summary: params.success
      ? `Read ${params.recordCount} record(s) from "${params.listName}" (${params.durationMs}ms)`
      : `Read FAILED from "${params.listName}": ${params.errorMessage ?? 'unknown error'}`,
    details: { listName: params.listName, recordCount: params.recordCount },
    success: params.success,
    errorMessage: params.errorMessage,
    durationMs: params.durationMs,
  });
}

export function logWriteEvent(params: {
  screenId: string;
  actionKey: string;
  detail: WriteEventDetail;
  userId?: string;
}): void {
  if (!isEnabled()) return;
  const { detail } = params;

  push({
    id: uuidv4(),
    type: DebugEventType.Write,
    timestamp: new Date().toISOString(),
    screenId: params.screenId,
    actionKey: params.actionKey,
    userId: params.userId,
    summary: detail.success
      ? `${detail.operation} OK on "${detail.targetList}" — ID: ${detail.recordId ?? 'new'}`
      : `${detail.operation} FAILED on "${detail.targetList}": ${detail.errorMessage ?? 'unknown error'}`,
    // Only store field names + status, never full values
    details: {
      fieldPreview: detail.fieldPreview.map((f) => ({
        appControlName: f.appControlName,
        appColumnName: f.appColumnName,
        spColumnName: f.spColumnName,
        valuePreview: f.valuePreview,
        dataType: f.dataType,
        mappingStatus: f.mappingStatus,
      })),
    },
    success: detail.success,
    errorMessage: detail.errorMessage,
    recordId: detail.recordId,
  });

  // Update the per-action last-write result
  const store = getStore();
  if (!store) return;
  const result: LastWriteResult = {
    success: detail.success,
    errorMessage: detail.errorMessage,
    recordId: detail.recordId,
    timestamp: new Date().toISOString(),
  };
  store.set(setLastWriteResultAtom, { actionKey: params.actionKey, result });
}

export function logSchemaCheck(params: {
  screenId: string;
  sourceKey: string;
  issueCount: number;
}): void {
  if (!isEnabled()) return;
  push({
    id: uuidv4(),
    type: DebugEventType.SchemaCheck,
    timestamp: new Date().toISOString(),
    screenId: params.screenId,
    sourceKey: params.sourceKey,
    summary: params.issueCount === 0
      ? `Schema OK for source "${params.sourceKey}"`
      : `Schema issues (${params.issueCount}) found for "${params.sourceKey}"`,
    success: params.issueCount === 0,
  });
}

export function logError(params: {
  screenId?: string;
  sourceKey?: string;
  actionKey?: string;
  error: Error | string;
  context?: string;
  userId?: string;
}): void {
  if (!isEnabled()) return;
  const message = params.error instanceof Error ? params.error.message : params.error;
  push({
    id: uuidv4(),
    type: DebugEventType.Error,
    timestamp: new Date().toISOString(),
    screenId: params.screenId,
    sourceKey: params.sourceKey,
    actionKey: params.actionKey,
    userId: params.userId,
    summary: `Error: ${message}`,
    details: params.context ? { context: params.context } : undefined,
    errorMessage: message,
    success: false,
  });
}
