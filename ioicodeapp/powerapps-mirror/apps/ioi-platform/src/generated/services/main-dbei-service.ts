import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBEI } from '../models/main-dbei-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';
const DS = 'MainDBEI';
export class MainDBEIService {
  static async create(r: Omit<MainDBEI,'id'>): Promise<MainDBEI> {
    const result = await getClient().createRecordAsync(DS, r);
    if (!result.success) throw result.error; return result.data as MainDBEI;
  }
  static async update(id: string, f: Partial<Omit<MainDBEI,'id'>>): Promise<MainDBEI> {
    const result = await getClient().updateRecordAsync(DS, id, f);
    if (!result.success) throw result.error; return result.data as MainDBEI;
  }
  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DS, id);
    if (!result.success) throw result.error;
  }
  static async get(id: string): Promise<MainDBEI> {
    const result = await getClient().retrieveRecordAsync(DS, id);
    if (!result.success) throw result.error; return result.data as MainDBEI;
  }
  static async getAll(o?: IOperationOptions): Promise<MainDBEI[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DS, o);
    if (!result.success) throw result.error; return result.data as MainDBEI[];
  }
}
