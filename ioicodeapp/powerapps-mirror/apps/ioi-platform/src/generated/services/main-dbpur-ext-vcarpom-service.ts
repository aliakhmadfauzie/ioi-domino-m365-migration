import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBPURExtVCARPOM } from '../models/main-dbpur-ext-vcarpom-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DS = 'MainDBPURExtVCARPOM';

export class MainDBPURExtVCARPOMService {
  static async create(r: Omit<MainDBPURExtVCARPOM, 'id'>): Promise<MainDBPURExtVCARPOM> {
    const result = await getClient().createRecordAsync(DS, r);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVCARPOM;
  }

  static async update(id: string, f: Partial<Omit<MainDBPURExtVCARPOM, 'id'>>): Promise<MainDBPURExtVCARPOM> {
    const result = await getClient().updateRecordAsync(DS, id, f);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVCARPOM;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DS, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<MainDBPURExtVCARPOM> {
    const result = await getClient().retrieveRecordAsync(DS, id);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVCARPOM;
  }

  static async getAll(o?: IOperationOptions): Promise<MainDBPURExtVCARPOM[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DS, o);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtVCARPOM[];
  }
}
