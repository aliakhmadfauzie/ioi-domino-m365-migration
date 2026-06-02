import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBPURExtVENDAUDIREPORows } from '../models/main-dbpur-ext-vendaudirepo-rows-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DS = 'MainDBPURExtVENDAUDIREPORows';

export class MainDBPURExtVENDAUDIREPORowsService {
  static async create(r: Omit<MainDBPURExtVENDAUDIREPORows, 'id'>): Promise<MainDBPURExtVENDAUDIREPORows> {
    const result = await getClient().createRecordAsync(DS, r);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVENDAUDIREPORows;
  }

  static async update(id: string, f: Partial<Omit<MainDBPURExtVENDAUDIREPORows, 'id'>>): Promise<MainDBPURExtVENDAUDIREPORows> {
    const result = await getClient().updateRecordAsync(DS, id, f);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVENDAUDIREPORows;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DS, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<MainDBPURExtVENDAUDIREPORows> {
    const result = await getClient().retrieveRecordAsync(DS, id);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVENDAUDIREPORows;
  }

  static async getAll(o?: IOperationOptions): Promise<MainDBPURExtVENDAUDIREPORows[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DS, o);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVENDAUDIREPORows[];
  }
}
