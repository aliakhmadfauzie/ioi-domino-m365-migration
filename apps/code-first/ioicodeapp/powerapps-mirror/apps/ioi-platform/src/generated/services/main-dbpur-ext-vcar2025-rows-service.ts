import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBPURExtVCAR2025Rows } from '../models/main-dbpur-ext-vcar2025-rows-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DS = 'MainDBPURExtVCAR2025Rows';

export class MainDBPURExtVCAR2025RowsService {
  static async create(r: Omit<MainDBPURExtVCAR2025Rows, 'id'>): Promise<MainDBPURExtVCAR2025Rows> {
    const result = await getClient().createRecordAsync(DS, r);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVCAR2025Rows;
  }

  static async update(id: string, f: Partial<Omit<MainDBPURExtVCAR2025Rows, 'id'>>): Promise<MainDBPURExtVCAR2025Rows> {
    const result = await getClient().updateRecordAsync(DS, id, f);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVCAR2025Rows;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DS, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<MainDBPURExtVCAR2025Rows> {
    const result = await getClient().retrieveRecordAsync(DS, id);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVCAR2025Rows;
  }

  static async getAll(o?: IOperationOptions): Promise<MainDBPURExtVCAR2025Rows[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DS, o);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVCAR2025Rows[];
  }
}
