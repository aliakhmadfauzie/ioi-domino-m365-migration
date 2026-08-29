import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBPUR } from '../models/main-dbpur-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DS = 'MainDBPUR';

export class MainDBPURService {
  static async create(r: Omit<MainDBPUR, 'id'>): Promise<MainDBPUR> {
    const result = await getClient().createRecordAsync(DS, r);
    if (!result.success) throw result.error;
    return result.data as MainDBPUR;
  }

  static async update(id: string, f: Partial<Omit<MainDBPUR, 'id'>>): Promise<MainDBPUR> {
    const result = await getClient().updateRecordAsync(DS, id, f);
    if (!result.success) throw result.error;
    return result.data as MainDBPUR;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DS, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<MainDBPUR> {
    const result = await getClient().retrieveRecordAsync(DS, id);
    if (!result.success) throw result.error;
    return result.data as MainDBPUR;
  }

  static async getAll(o?: IOperationOptions): Promise<MainDBPUR[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DS, o);
    if (!result.success) throw result.error;
    return result.data as MainDBPUR[];
  }
}
