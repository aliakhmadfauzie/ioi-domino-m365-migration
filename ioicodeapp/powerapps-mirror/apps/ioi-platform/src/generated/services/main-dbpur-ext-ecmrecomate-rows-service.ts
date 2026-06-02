import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBPURExtECMRECOMATERows } from '../models/main-dbpur-ext-ecmrecomate-rows-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DS = 'MainDBPURExtECMRECOMATERows';

export class MainDBPURExtECMRECOMATERowsService {
  static async create(r: Omit<MainDBPURExtECMRECOMATERows, 'id'>): Promise<MainDBPURExtECMRECOMATERows> {
    const result = await getClient().createRecordAsync(DS, r);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtECMRECOMATERows;
  }

  static async update(id: string, f: Partial<Omit<MainDBPURExtECMRECOMATERows, 'id'>>): Promise<MainDBPURExtECMRECOMATERows> {
    const result = await getClient().updateRecordAsync(DS, id, f);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtECMRECOMATERows;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DS, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<MainDBPURExtECMRECOMATERows> {
    const result = await getClient().retrieveRecordAsync(DS, id);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtECMRECOMATERows;
  }

  static async getAll(o?: IOperationOptions): Promise<MainDBPURExtECMRECOMATERows[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DS, o);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtECMRECOMATERows[];
  }
}
