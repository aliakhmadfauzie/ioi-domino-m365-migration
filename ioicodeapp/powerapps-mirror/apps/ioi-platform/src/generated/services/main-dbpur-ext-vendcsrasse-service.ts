import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBPURExtVENDCSRASSE } from '../models/main-dbpur-ext-vendcsrasse-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DS = 'MainDBPURExtVENDCSRASSE';

export class MainDBPURExtVENDCSRASSEService {
  static async create(r: Omit<MainDBPURExtVENDCSRASSE, 'id'>): Promise<MainDBPURExtVENDCSRASSE> {
    const result = await getClient().createRecordAsync(DS, r);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVENDCSRASSE;
  }

  static async update(id: string, f: Partial<Omit<MainDBPURExtVENDCSRASSE, 'id'>>): Promise<MainDBPURExtVENDCSRASSE> {
    const result = await getClient().updateRecordAsync(DS, id, f);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVENDCSRASSE;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DS, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<MainDBPURExtVENDCSRASSE> {
    const result = await getClient().retrieveRecordAsync(DS, id);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVENDCSRASSE;
  }

  static async getAll(o?: IOperationOptions): Promise<MainDBPURExtVENDCSRASSE[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DS, o);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVENDCSRASSE[];
  }
}
