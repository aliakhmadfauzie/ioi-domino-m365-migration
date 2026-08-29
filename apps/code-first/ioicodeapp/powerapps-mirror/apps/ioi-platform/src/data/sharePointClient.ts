/**
 * SharePoint Read/Write wrappers.
 *
 * Every call:
 *  1. Delegates to the app-gen-sdk getClient() (Power Apps connector)
 *  2. Times the operation
 *  3. Emits a debug log event (when debug mode is active)
 *
 * Import these wrappers everywhere instead of calling getClient() directly
 * so debug instrumentation stays in one place.
 */
import { getClient } from '../../app-gen-sdk/data';
import type { IOperationOptions } from '../../app-gen-sdk/data/common/types';
import { logReadEvent, logWriteEvent, logError, maskValue } from '@/debug/debugLogger';
import type { DataResult, ReadParams, WriteParams } from './dataTypes';
import type { FieldWriteMapping } from '@/debug/debugTypes';

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function spReadMany<T = Record<string, unknown>>(
  params: ReadParams
): Promise<DataResult<T[]>> {
  const client = getClient();
  const options: IOperationOptions = {
    filter: params.filter,
    orderBy: params.orderBy,
    top: params.top,
    select: params.select,
  };

  const start = performance.now();
  try {
    const result = await client.retrieveMultipleRecordsAsync(params.sourceKey, options);
    const durationMs = Math.round(performance.now() - start);

    if (!result.success) {
      const errorMessage = result.error?.message ?? 'Unknown error';
      logError({ screenId: params.screenId, sourceKey: params.sourceKey, error: errorMessage });
      logReadEvent({
        screenId: params.screenId,
        sourceKey: params.sourceKey,
        listName: params.sourceKey,
        recordCount: 0,
        durationMs,
        success: false,
        errorMessage,
        userId: params.userId,
      });
      return { success: false, error: errorMessage, durationMs };
    }

    const data = (result.data ?? []) as T[];
    logReadEvent({
      screenId: params.screenId,
      sourceKey: params.sourceKey,
      listName: params.sourceKey,
      recordCount: data.length,
      durationMs,
      success: true,
      userId: params.userId,
    });
    return { success: true, data, durationMs };
  } catch (err) {
    const durationMs = Math.round(performance.now() - start);
    const message = err instanceof Error ? err.message : String(err);
    logError({ screenId: params.screenId, sourceKey: params.sourceKey, error: message });
    return { success: false, error: message, durationMs };
  }
}

export async function spReadOne<T = Record<string, unknown>>(
  params: ReadParams & { id: string }
): Promise<DataResult<T>> {
  const client = getClient();
  const start = performance.now();
  try {
    const result = await client.retrieveRecordAsync(params.sourceKey, params.id);
    const durationMs = Math.round(performance.now() - start);

    if (!result.success) {
      const errorMessage = result.error?.message ?? 'Unknown error';
      logError({ screenId: params.screenId, sourceKey: params.sourceKey, error: errorMessage });
      return { success: false, error: errorMessage, durationMs };
    }

    return { success: true, data: result.data as T, durationMs };
  } catch (err) {
    const durationMs = Math.round(performance.now() - start);
    return { success: false, error: err instanceof Error ? err.message : String(err), durationMs };
  }
}

// ─── Write ────────────────────────────────────────────────────────────────────

/**
 * Build the safe field preview array used by logWriteEvent.
 * Never logs the real value — only a masked preview + type info.
 */
function buildFieldPreview(
  payload: Record<string, unknown>,
  fieldMappings: FieldWriteMapping[]
) {
  return fieldMappings.map((m) => {
    const rawValue = payload[m.spColumnName];
    const spField = fieldMappings.find((f) => f.spColumnName === m.spColumnName);
    const mappingStatus =
      m.appFieldType !== m.spFieldType ? 'TypeMismatch' : 'OK';

    return {
      appControlName: m.appControlName,
      appColumnName: m.appColumnName,
      spColumnName: m.spColumnName,
      valuePreview: maskValue(rawValue),
      dataType: m.spFieldType,
      mappingStatus: (rawValue === undefined ? 'Missing' : mappingStatus) as
        | 'OK'
        | 'TypeMismatch'
        | 'Missing'
        | 'Extra',
    };
  });
}

export async function spCreate<T = Record<string, unknown>>(
  params: WriteParams & {
    payload: Record<string, unknown>;
    fieldMappings: FieldWriteMapping[];
    targetListDisplayName: string;
  }
): Promise<DataResult<T>> {
  const client = getClient();
  const start = performance.now();
  try {
    const result = await client.createRecordAsync(params.sourceKey, params.payload);
    const durationMs = Math.round(performance.now() - start);
    const newId = (result.data as Record<string, unknown>)?.id as string | number | undefined;

    if (!result.success) {
      const errorMessage = result.error?.message ?? 'Create failed';
      logWriteEvent({
        screenId: params.screenId,
        actionKey: params.actionKey,
        userId: params.userId,
        detail: {
          operation: 'Create',
          targetList: params.targetListDisplayName,
          fieldPreview: buildFieldPreview(params.payload, params.fieldMappings),
          success: false,
          errorMessage,
        },
      });
      return { success: false, error: errorMessage, durationMs };
    }

    logWriteEvent({
      screenId: params.screenId,
      actionKey: params.actionKey,
      userId: params.userId,
      detail: {
        operation: 'Create',
        targetList: params.targetListDisplayName,
        fieldPreview: buildFieldPreview(params.payload, params.fieldMappings),
        recordId: newId,
        success: true,
      },
    });
    return { success: true, data: result.data as T, durationMs };
  } catch (err) {
    const durationMs = Math.round(performance.now() - start);
    const message = err instanceof Error ? err.message : String(err);
    logError({ screenId: params.screenId, actionKey: params.actionKey, error: message });
    logWriteEvent({
      screenId: params.screenId,
      actionKey: params.actionKey,
      userId: params.userId,
      detail: {
        operation: 'Create',
        targetList: params.targetListDisplayName,
        fieldPreview: buildFieldPreview(params.payload, params.fieldMappings),
        success: false,
        errorMessage: message,
      },
    });
    return { success: false, error: message, durationMs };
  }
}

export async function spUpdate<T = Record<string, unknown>>(
  params: WriteParams & {
    id: string;
    changedFields: Record<string, unknown>;
    fieldMappings: FieldWriteMapping[];
    targetListDisplayName: string;
  }
): Promise<DataResult<T>> {
  const client = getClient();
  const start = performance.now();
  try {
    const result = await client.updateRecordAsync(
      params.sourceKey,
      params.id,
      params.changedFields
    );
    const durationMs = Math.round(performance.now() - start);

    if (!result.success) {
      const errorMessage = result.error?.message ?? 'Update failed';
      logWriteEvent({
        screenId: params.screenId,
        actionKey: params.actionKey,
        userId: params.userId,
        detail: {
          operation: 'Update',
          targetList: params.targetListDisplayName,
          fieldPreview: buildFieldPreview(params.changedFields, params.fieldMappings),
          recordId: params.id,
          success: false,
          errorMessage,
        },
      });
      return { success: false, error: errorMessage, durationMs };
    }

    logWriteEvent({
      screenId: params.screenId,
      actionKey: params.actionKey,
      userId: params.userId,
      detail: {
        operation: 'Update',
        targetList: params.targetListDisplayName,
        fieldPreview: buildFieldPreview(params.changedFields, params.fieldMappings),
        recordId: params.id,
        success: true,
      },
    });
    return { success: true, data: result.data as T, durationMs };
  } catch (err) {
    const durationMs = Math.round(performance.now() - start);
    const message = err instanceof Error ? err.message : String(err);
    logError({ screenId: params.screenId, actionKey: params.actionKey, error: message });
    return { success: false, error: message, durationMs };
  }
}
