import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBPURExtRSPOVALICHEC } from '../models/main-dbpur-ext-rspovalicheck-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DS = 'MainDBPURExtRSPOVALICHEC';

export class MainDBPURExtRSPOVALICHECService {
  static async create(r: Omit<MainDBPURExtRSPOVALICHEC, 'id'>): Promise<MainDBPURExtRSPOVALICHEC> {
    const result = await getClient().createRecordAsync(DS, r);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtRSPOVALICHEC;
  }

  static async update(id: string, f: Partial<Omit<MainDBPURExtRSPOVALICHEC, 'id'>>): Promise<MainDBPURExtRSPOVALICHEC> {
    const result = await getClient().updateRecordAsync(DS, id, f);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtRSPOVALICHEC;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DS, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<MainDBPURExtRSPOVALICHEC> {
    const result = await getClient().retrieveRecordAsync(DS, id);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtRSPOVALICHEC;
  }

  static async getAll(o?: IOperationOptions): Promise<MainDBPURExtRSPOVALICHEC[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DS, o);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtRSPOVALICHEC[];
  }
}
