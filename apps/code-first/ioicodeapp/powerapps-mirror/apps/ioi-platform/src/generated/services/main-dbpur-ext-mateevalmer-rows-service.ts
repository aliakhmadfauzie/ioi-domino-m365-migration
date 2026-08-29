import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBPURExtMATEEVALMERRows } from '../models/main-dbpur-ext-mateevalmer-rows-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DS = 'MainDBPURExtMATEEVALMERRows';

export class MainDBPURExtMATEEVALMERRowsService {
  static async create(r: Omit<MainDBPURExtMATEEVALMERRows, 'id'>): Promise<MainDBPURExtMATEEVALMERRows> {
    const result = await getClient().createRecordAsync(DS, r);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtMATEEVALMERRows;
  }

  static async update(id: string, f: Partial<Omit<MainDBPURExtMATEEVALMERRows, 'id'>>): Promise<MainDBPURExtMATEEVALMERRows> {
    const result = await getClient().updateRecordAsync(DS, id, f);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtMATEEVALMERRows;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DS, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<MainDBPURExtMATEEVALMERRows> {
    const result = await getClient().retrieveRecordAsync(DS, id);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtMATEEVALMERRows;
  }

  static async getAll(o?: IOperationOptions): Promise<MainDBPURExtMATEEVALMERRows[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DS, o);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtMATEEVALMERRows[];
  }
}
