import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBPURExtVENDQUALAPPRRows } from '../models/main-dbpur-ext-vendqualappr-rows-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DS = 'MainDBPURExtVENDQUALAPPRRows';

export class MainDBPURExtVENDQUALAPPRRowsService {
  static async create(r: Omit<MainDBPURExtVENDQUALAPPRRows, 'id'>): Promise<MainDBPURExtVENDQUALAPPRRows> {
    const result = await getClient().createRecordAsync(DS, r);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVENDQUALAPPRRows;
  }

  static async update(id: string, f: Partial<Omit<MainDBPURExtVENDQUALAPPRRows, 'id'>>): Promise<MainDBPURExtVENDQUALAPPRRows> {
    const result = await getClient().updateRecordAsync(DS, id, f);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVENDQUALAPPRRows;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DS, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<MainDBPURExtVENDQUALAPPRRows> {
    const result = await getClient().retrieveRecordAsync(DS, id);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVENDQUALAPPRRows;
  }

  static async getAll(o?: IOperationOptions): Promise<MainDBPURExtVENDQUALAPPRRows[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DS, o);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVENDQUALAPPRRows[];
  }
}
