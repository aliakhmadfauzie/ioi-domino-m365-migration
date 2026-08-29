import { getClient } from '../../../app-gen-sdk/data'; import type { MainDBMKT } from '../models/main-dbmkt-model'; import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';
const DS = 'MainDBMKT';
export class MainDBMKTService {
  static async create(r: Omit<MainDBMKT,'id'>): Promise<MainDBMKT> { const result = await getClient().createRecordAsync(DS, r); if (!result.success) throw result.error; return result.data as MainDBMKT; }
  static async update(id: string, f: Partial<Omit<MainDBMKT,'id'>>): Promise<MainDBMKT> { const result = await getClient().updateRecordAsync(DS, id, f); if (!result.success) throw result.error; return result.data as MainDBMKT; }
  static async delete(id: string): Promise<void> { const result = await getClient().deleteRecordAsync(DS, id); if (!result.success) throw result.error; }
  static async get(id: string): Promise<MainDBMKT> { const result = await getClient().retrieveRecordAsync(DS, id); if (!result.success) throw result.error; return result.data as MainDBMKT; }
  static async getAll(o?: IOperationOptions): Promise<MainDBMKT[]> { const result = await getClient().retrieveMultipleRecordsAsync(DS, o); if (!result.success) throw result.error; return result.data as MainDBMKT[]; }
}
