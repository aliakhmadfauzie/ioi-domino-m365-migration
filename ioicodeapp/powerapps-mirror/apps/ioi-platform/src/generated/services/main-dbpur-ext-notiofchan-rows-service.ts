import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBPURExtNOTIOFCHANRows } from '../models/main-dbpur-ext-notiofchan-rows-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DS = 'MainDBPURExtNOTIOFCHANRows';

export class MainDBPURExtNOTIOFCHANRowsService {
  static async create(r: Omit<MainDBPURExtNOTIOFCHANRows, 'id'>): Promise<MainDBPURExtNOTIOFCHANRows> {
    const result = await getClient().createRecordAsync(DS, r);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtNOTIOFCHANRows;
  }

  static async update(id: string, f: Partial<Omit<MainDBPURExtNOTIOFCHANRows, 'id'>>): Promise<MainDBPURExtNOTIOFCHANRows> {
    const result = await getClient().updateRecordAsync(DS, id, f);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtNOTIOFCHANRows;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DS, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<MainDBPURExtNOTIOFCHANRows> {
    const result = await getClient().retrieveRecordAsync(DS, id);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtNOTIOFCHANRows;
  }

  static async getAll(o?: IOperationOptions): Promise<MainDBPURExtNOTIOFCHANRows[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DS, o);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtNOTIOFCHANRows[];
  }
}
