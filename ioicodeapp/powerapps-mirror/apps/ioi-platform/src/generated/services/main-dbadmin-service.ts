import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBADMIN } from '../models/main-dbadmin-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';
const DS = 'MainDBADMIN';
export class MainDBADMINService {
  static async create(r: Omit<MainDBADMIN,'id'>): Promise<MainDBADMIN> {
    const result = await getClient().createRecordAsync(DS, r);
    if (!result.success) throw result.error; return result.data as MainDBADMIN;
  }
  static async update(id: string, f: Partial<Omit<MainDBADMIN,'id'>>): Promise<MainDBADMIN> {
    const result = await getClient().updateRecordAsync(DS, id, f);
    if (!result.success) throw result.error; return result.data as MainDBADMIN;
  }
  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DS, id);
    if (!result.success) throw result.error;
  }
  static async get(id: string): Promise<MainDBADMIN> {
    const result = await getClient().retrieveRecordAsync(DS, id);
    if (!result.success) throw result.error; return result.data as MainDBADMIN;
  }
  static async getAll(o?: IOperationOptions): Promise<MainDBADMIN[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DS, o);
    if (!result.success) throw result.error; return result.data as MainDBADMIN[];
  }
}
