import { getClient } from '../../../app-gen-sdk/data';
import type { MainDB_HR_Ext_Cafeteria } from '../models/main-dbhr-ext-cafeteria-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'MainDB_HR_Ext_Cafeteria';

export class MainDB_HR_Ext_CafeteriaService {
  static async create(record: Omit<MainDB_HR_Ext_Cafeteria, 'id'>): Promise<MainDB_HR_Ext_Cafeteria> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, record);
    if (!result.success) throw result.error;
    return result.data as MainDB_HR_Ext_Cafeteria;
  }

  static async update(
    id: string,
    changedFields: Partial<Omit<MainDB_HR_Ext_Cafeteria, 'id'>>
  ): Promise<MainDB_HR_Ext_Cafeteria> {
    const result = await getClient().updateRecordAsync(DATA_SOURCE_NAME, id, changedFields);
    if (!result.success) throw result.error;
    return result.data as MainDB_HR_Ext_Cafeteria;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<MainDB_HR_Ext_Cafeteria> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return result.data as MainDB_HR_Ext_Cafeteria;
  }

  static async getAll(options?: IOperationOptions): Promise<MainDB_HR_Ext_Cafeteria[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DATA_SOURCE_NAME, options);
    if (!result.success) throw result.error;
    return result.data as MainDB_HR_Ext_Cafeteria[];
  }
}
