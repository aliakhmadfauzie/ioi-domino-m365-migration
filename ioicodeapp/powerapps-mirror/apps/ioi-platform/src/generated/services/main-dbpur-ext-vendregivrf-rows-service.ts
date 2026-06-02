import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBPURExtVENDREGIVRFRows } from '../models/main-dbpur-ext-vendregivrf-rows-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DS = 'MainDBPURExtVENDREGIVRFRows';

export class MainDBPURExtVENDREGIVRFRowsService {
  static async create(r: Omit<MainDBPURExtVENDREGIVRFRows, 'id'>): Promise<MainDBPURExtVENDREGIVRFRows> {
    const result = await getClient().createRecordAsync(DS, r);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVENDREGIVRFRows;
  }

  static async update(id: string, f: Partial<Omit<MainDBPURExtVENDREGIVRFRows, 'id'>>): Promise<MainDBPURExtVENDREGIVRFRows> {
    const result = await getClient().updateRecordAsync(DS, id, f);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVENDREGIVRFRows;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DS, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<MainDBPURExtVENDREGIVRFRows> {
    const result = await getClient().retrieveRecordAsync(DS, id);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVENDREGIVRFRows;
  }

  static async getAll(o?: IOperationOptions): Promise<MainDBPURExtVENDREGIVRFRows[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DS, o);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVENDREGIVRFRows[];
  }
}
