import { getClient } from '../../../app-gen-sdk/data'; import type { MainDBENG } from '../models/main-dbeng-model'; import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';
const DS = 'MainDBENG';
export class MainDBENGService {
  static async create(r: Omit<MainDBENG,'id'>): Promise<MainDBENG> { const result = await getClient().createRecordAsync(DS, r); if (!result.success) throw result.error; return result.data as MainDBENG; }
  static async update(id: string, f: Partial<Omit<MainDBENG,'id'>>): Promise<MainDBENG> { const result = await getClient().updateRecordAsync(DS, id, f); if (!result.success) throw result.error; return result.data as MainDBENG; }
  static async delete(id: string): Promise<void> { const result = await getClient().deleteRecordAsync(DS, id); if (!result.success) throw result.error; }
  static async get(id: string): Promise<MainDBENG> { const result = await getClient().retrieveRecordAsync(DS, id); if (!result.success) throw result.error; return result.data as MainDBENG; }
  static async getAll(o?: IOperationOptions): Promise<MainDBENG[]> { const result = await getClient().retrieveMultipleRecordsAsync(DS, o); if (!result.success) throw result.error; return result.data as MainDBENG[]; }
}
