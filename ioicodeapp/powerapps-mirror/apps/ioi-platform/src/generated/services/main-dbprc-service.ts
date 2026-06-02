import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBPRC } from '../models/main-dbprc-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';
const DS = 'MainDBPRC';
export class MainDBPRCService {
  static async create(r: Omit<MainDBPRC,'id'>): Promise<MainDBPRC> {
    const result = await getClient().createRecordAsync(DS, r);
    if (!result.success) throw result.error; return result.data as MainDBPRC;
  }
  static async update(id: string, f: Partial<Omit<MainDBPRC,'id'>>): Promise<MainDBPRC> {
    const result = await getClient().updateRecordAsync(DS, id, f);
    if (!result.success) throw result.error; return result.data as MainDBPRC;
  }
  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DS, id);
    if (!result.success) throw result.error;
  }
  static async get(id: string): Promise<MainDBPRC> {
    const result = await getClient().retrieveRecordAsync(DS, id);
    if (!result.success) throw result.error; return result.data as MainDBPRC;
  }
  static async getAll(o?: IOperationOptions): Promise<MainDBPRC[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DS, o);
    if (!result.success) throw result.error; return result.data as MainDBPRC[];
  }
}
