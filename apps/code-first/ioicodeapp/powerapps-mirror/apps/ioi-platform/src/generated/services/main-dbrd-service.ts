import { getClient } from '../../../app-gen-sdk/data'; import type { MainDBRD } from '../models/main-dbrd-model'; import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';
const DS = 'MainDBRD';
export class MainDBRDService {
  static async create(r: Omit<MainDBRD,'id'>): Promise<MainDBRD> { const result = await getClient().createRecordAsync(DS, r); if (!result.success) throw result.error; return result.data as MainDBRD; }
  static async update(id: string, f: Partial<Omit<MainDBRD,'id'>>): Promise<MainDBRD> { const result = await getClient().updateRecordAsync(DS, id, f); if (!result.success) throw result.error; return result.data as MainDBRD; }
  static async delete(id: string): Promise<void> { const result = await getClient().deleteRecordAsync(DS, id); if (!result.success) throw result.error; }
  static async get(id: string): Promise<MainDBRD> { const result = await getClient().retrieveRecordAsync(DS, id); if (!result.success) throw result.error; return result.data as MainDBRD; }
  static async getAll(o?: IOperationOptions): Promise<MainDBRD[]> { const result = await getClient().retrieveMultipleRecordsAsync(DS, o); if (!result.success) throw result.error; return result.data as MainDBRD[]; }
}
