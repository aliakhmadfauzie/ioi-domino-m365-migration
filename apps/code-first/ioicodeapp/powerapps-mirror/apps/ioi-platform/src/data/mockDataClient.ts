/**
 * Mock data client.
 *
 * Used when DataMode === Mock (localhost dev or ?dataMode=Mock).
 * Stores per-source fixture data registered by form modules.
 *
 * Usage in a form module:
 *   mockDataClient.register('maindb_it', itMrfMockRecords);
 */
import { logReadEvent, logWriteEvent } from '@/debug/debugLogger';
import type { DataResult, ReadParams, WriteParams } from './dataTypes';
import type { FieldWriteMapping } from '@/debug/debugTypes';

type MockRecord = Record<string, unknown> & { id?: string | number };

const registry = new Map<string, MockRecord[]>();

export const mockDataClient = {
  /**
   * Register fixture data for a source key.
   * Call this at module load time in each form's metadata file.
   */
  register(sourceKey: string, records: MockRecord[]): void {
    registry.set(sourceKey, records);
  },

  async readMany<T = MockRecord>(params: ReadParams): Promise<DataResult<T[]>> {
    const start = performance.now();
    const records = (registry.get(params.sourceKey) ?? []) as T[];
    const durationMs = Math.round(performance.now() - start);

    logReadEvent({
      screenId: params.screenId,
      sourceKey: params.sourceKey,
      listName: `[MOCK] ${params.sourceKey}`,
      recordCount: records.length,
      durationMs,
      success: true,
      userId: params.userId,
    });

    return { success: true, data: records, durationMs };
  },

  async readOne<T = MockRecord>(
    params: ReadParams & { id: string }
  ): Promise<DataResult<T>> {
    const start = performance.now();
    const records = registry.get(params.sourceKey) ?? [];
    const found = records.find((r) => String(r.id) === params.id) as T | undefined;
    const durationMs = Math.round(performance.now() - start);

    if (!found) {
      return { success: false, error: `[MOCK] Record ${params.id} not found in ${params.sourceKey}`, durationMs };
    }
    return { success: true, data: found, durationMs };
  },

  async create<T = MockRecord>(
    params: WriteParams & {
      payload: MockRecord;
      fieldMappings: FieldWriteMapping[];
      targetListDisplayName: string;
    }
  ): Promise<DataResult<T>> {
    const start = performance.now();
    const records = registry.get(params.sourceKey) ?? [];
    const newId = Date.now();
    const newRecord = { id: newId, ...params.payload };
    registry.set(params.sourceKey, [...records, newRecord]);
    const durationMs = Math.round(performance.now() - start);

    logWriteEvent({
      screenId: params.screenId,
      actionKey: params.actionKey,
      userId: params.userId,
      detail: {
        operation: 'Create [MOCK]',
        targetList: params.targetListDisplayName,
        fieldPreview: params.fieldMappings.map((m) => ({
          appControlName: m.appControlName,
          appColumnName: m.appColumnName,
          spColumnName: m.spColumnName,
          valuePreview: '(mock)',
          dataType: m.spFieldType,
          mappingStatus: 'OK' as const,
        })),
        recordId: newId,
        success: true,
      },
    });

    return { success: true, data: newRecord as T, durationMs };
  },

  async update<T = MockRecord>(
    params: WriteParams & {
      id: string;
      changedFields: Partial<MockRecord>;
      fieldMappings: FieldWriteMapping[];
      targetListDisplayName: string;
    }
  ): Promise<DataResult<T>> {
    const start = performance.now();
    const records = registry.get(params.sourceKey) ?? [];
    const idx = records.findIndex((r) => String(r.id) === params.id);
    const durationMs = Math.round(performance.now() - start);

    if (idx === -1) {
      return { success: false, error: `[MOCK] Record ${params.id} not found`, durationMs };
    }
    records[idx] = { ...records[idx], ...params.changedFields };
    registry.set(params.sourceKey, records);

    logWriteEvent({
      screenId: params.screenId,
      actionKey: params.actionKey,
      userId: params.userId,
      detail: {
        operation: 'Update [MOCK]',
        targetList: params.targetListDisplayName,
        fieldPreview: params.fieldMappings.map((m) => ({
          appControlName: m.appControlName,
          appColumnName: m.appColumnName,
          spColumnName: m.spColumnName,
          valuePreview: '(mock)',
          dataType: m.spFieldType,
          mappingStatus: 'OK' as const,
        })),
        recordId: params.id,
        success: true,
      },
    });

    return { success: true, data: records[idx] as T, durationMs };
  },
};
