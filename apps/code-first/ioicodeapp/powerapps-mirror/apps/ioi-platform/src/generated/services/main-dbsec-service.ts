import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBSEC } from '../models/main-dbsec-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';
const DS = 'MainDBSEC';
export class MainDBSECService {
  static async create(r: Omit<MainDBSEC,'id'>): Promise<MainDBSEC> {
    const result = await getClient().createRecordAsync(DS, r);
    if (!result.success) throw result.error; return result.data as MainDBSEC;
  }
  static async update(id: string, f: Partial<Omit<MainDBSEC,'id'>>): Promise<MainDBSEC> {
    const result = await getClient().updateRecordAsync(DS, id, f);
    if (!result.success) throw result.error; return result.data as MainDBSEC;
  }
  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DS, id);
    if (!result.success) throw result.error;
  }
  static async get(id: string): Promise<MainDBSEC> {
    const result = await getClient().retrieveRecordAsync(DS, id);
    if (!result.success) throw result.error; return result.data as MainDBSEC;
  }
  static async getAll(o?: IOperationOptions): Promise<MainDBSEC[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DS, o);
    if (!result.success) throw result.error; return result.data as MainDBSEC[];
  }
}
