import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBPOM } from '../models/main-dbpom-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';
const DS = 'MainDBPOM';
export class MainDBPOMService {
  static async create(r: Omit<MainDBPOM,'id'>): Promise<MainDBPOM> {
    const result = await getClient().createRecordAsync(DS, r);
    if (!result.success) throw result.error; return result.data as MainDBPOM;
  }
  static async update(id: string, f: Partial<Omit<MainDBPOM,'id'>>): Promise<MainDBPOM> {
    const result = await getClient().updateRecordAsync(DS, id, f);
    if (!result.success) throw result.error; return result.data as MainDBPOM;
  }
  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DS, id);
    if (!result.success) throw result.error;
  }
  static async get(id: string): Promise<MainDBPOM> {
    const result = await getClient().retrieveRecordAsync(DS, id);
    if (!result.success) throw result.error; return result.data as MainDBPOM;
  }
  static async getAll(o?: IOperationOptions): Promise<MainDBPOM[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DS, o);
    if (!result.success) throw result.error; return result.data as MainDBPOM[];
  }
}
