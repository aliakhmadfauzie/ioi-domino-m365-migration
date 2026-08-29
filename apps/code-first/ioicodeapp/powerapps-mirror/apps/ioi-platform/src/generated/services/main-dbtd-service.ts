import { getClient } from '../../../app-gen-sdk/data'; import type { MainDBTD } from '../models/main-dbtd-model'; import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';
const DS = 'MainDBTD';
export class MainDBTDService {
  static async create(r: Omit<MainDBTD,'id'>): Promise<MainDBTD> { const result = await getClient().createRecordAsync(DS, r); if (!result.success) throw result.error; return result.data as MainDBTD; }
  static async update(id: string, f: Partial<Omit<MainDBTD,'id'>>): Promise<MainDBTD> { const result = await getClient().updateRecordAsync(DS, id, f); if (!result.success) throw result.error; return result.data as MainDBTD; }
  static async delete(id: string): Promise<void> { const result = await getClient().deleteRecordAsync(DS, id); if (!result.success) throw result.error; }
  static async get(id: string): Promise<MainDBTD> { const result = await getClient().retrieveRecordAsync(DS, id); if (!result.success) throw result.error; return result.data as MainDBTD; }
  static async getAll(o?: IOperationOptions): Promise<MainDBTD[]> { const result = await getClient().retrieveMultipleRecordsAsync(DS, o); if (!result.success) throw result.error; return result.data as MainDBTD[]; }
}
