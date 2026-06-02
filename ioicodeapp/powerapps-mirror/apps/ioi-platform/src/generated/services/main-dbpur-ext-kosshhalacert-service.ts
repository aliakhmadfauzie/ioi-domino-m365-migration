import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBPURExtKOSHHALACERT } from '../models/main-dbpur-ext-kosshhalacert-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DS = 'MainDBPURExtKOSHHALACERT';

export class MainDBPURExtKOSHHALACERTService {
  static async create(r: Omit<MainDBPURExtKOSHHALACERT, 'id'>): Promise<MainDBPURExtKOSHHALACERT> {
    const result = await getClient().createRecordAsync(DS, r);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtKOSHHALACERT;
  }

  static async update(id: string, f: Partial<Omit<MainDBPURExtKOSHHALACERT, 'id'>>): Promise<MainDBPURExtKOSHHALACERT> {
    const result = await getClient().updateRecordAsync(DS, id, f);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtKOSHHALACERT;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DS, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<MainDBPURExtKOSHHALACERT> {
    const result = await getClient().retrieveRecordAsync(DS, id);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtKOSHHALACERT;
  }

  static async getAll(o?: IOperationOptions): Promise<MainDBPURExtKOSHHALACERT[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DS, o);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtKOSHHALACERT[];
  }
}
