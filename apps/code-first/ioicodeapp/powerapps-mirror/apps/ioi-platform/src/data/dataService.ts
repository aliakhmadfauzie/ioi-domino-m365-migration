/**
 * Unified data service.
 *
 * Routes every read/write to the correct client based on the active DataMode:
 *   Real   → sharePointClient (Power Apps connector)
 *   Mock   → mockDataClient   (in-memory fixtures)
 *   Hybrid → sharePointClient for real sources, mockDataClient for mock-only sources
 *
 * Consumers import from here, never from the individual clients directly.
 */
import { useMockData } from './dataMode';
import { spReadMany, spReadOne, spCreate, spUpdate } from './sharePointClient';
import { mockDataClient } from './mockDataClient';
import type { DataResult, ReadParams, WriteParams } from './dataTypes';
import type { FieldWriteMapping } from '@/debug/debugTypes';
import type { DataMode } from '@/debug/debugTypes';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isMock(screenDataMode?: DataMode): boolean {
  return useMockData(screenDataMode);
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function readMany<T = Record<string, unknown>>(
  params: ReadParams,
  screenDataMode?: DataMode
): Promise<DataResult<T[]>> {
  return isMock(screenDataMode)
    ? mockDataClient.readMany<T>(params)
    : spReadMany<T>(params);
}

export async function readOne<T = Record<string, unknown>>(
  params: ReadParams & { id: string },
  screenDataMode?: DataMode
): Promise<DataResult<T>> {
  return isMock(screenDataMode)
    ? mockDataClient.readOne<T>(params)
    : spReadOne<T>(params);
}

// ─── Write ────────────────────────────────────────────────────────────────────

export async function createRecord<T = Record<string, unknown>>(
  params: WriteParams & {
    payload: Record<string, unknown>;
    fieldMappings: FieldWriteMapping[];
    targetListDisplayName: string;
  },
  screenDataMode?: DataMode
): Promise<DataResult<T>> {
  return isMock(screenDataMode)
    ? mockDataClient.create<T>(params)
    : spCreate<T>(params);
}

export async function updateRecord<T = Record<string, unknown>>(
  params: WriteParams & {
    id: string;
    changedFields: Record<string, unknown>;
    fieldMappings: FieldWriteMapping[];
    targetListDisplayName: string;
  },
  screenDataMode?: DataMode
): Promise<DataResult<T>> {
  return isMock(screenDataMode)
    ? mockDataClient.update<T>(params)
    : spUpdate<T>(params);
}
