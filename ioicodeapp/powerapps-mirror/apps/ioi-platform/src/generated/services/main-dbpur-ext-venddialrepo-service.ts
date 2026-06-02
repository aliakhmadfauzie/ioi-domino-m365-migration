import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBPURExtVENDDIALREPO } from '../models/main-dbpur-ext-venddialrepo-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DS = 'MainDBPURExtVENDDIALREPO';

export class MainDBPURExtVENDDIALREPOService {
  static async create(r: Omit<MainDBPURExtVENDDIALREPO, 'id'>): Promise<MainDBPURExtVENDDIALREPO> {
    const result = await getClient().createRecordAsync(DS, r);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVENDDIALREPO;
  }

  static async update(id: string, f: Partial<Omit<MainDBPURExtVENDDIALREPO, 'id'>>): Promise<MainDBPURExtVENDDIALREPO> {
    const result = await getClient().updateRecordAsync(DS, id, f);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVENDDIALREPO;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DS, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<MainDBPURExtVENDDIALREPO> {
    const result = await getClient().retrieveRecordAsync(DS, id);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVENDDIALREPO;
  }

  static async getAll(o?: IOperationOptions): Promise<MainDBPURExtVENDDIALREPO[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DS, o);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVENDDIALREPO[];
  }
}
