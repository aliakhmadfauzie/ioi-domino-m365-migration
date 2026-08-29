import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBPURExtTENDRows } from '../models/main-dbpur-ext-tend-rows-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DS = 'MainDBPURExtTENDRows';

export class MainDBPURExtTENDRowsService {
  static async create(r: Omit<MainDBPURExtTENDRows, 'id'>): Promise<MainDBPURExtTENDRows> {
    const result = await getClient().createRecordAsync(DS, r);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtTENDRows;
  }

  static async update(id: string, f: Partial<Omit<MainDBPURExtTENDRows, 'id'>>): Promise<MainDBPURExtTENDRows> {
    const result = await getClient().updateRecordAsync(DS, id, f);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtTENDRows;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DS, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<MainDBPURExtTENDRows> {
    const result = await getClient().retrieveRecordAsync(DS, id);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtTENDRows;
  }

  static async getAll(o?: IOperationOptions): Promise<MainDBPURExtTENDRows[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DS, o);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtTENDRows[];
  }
}
