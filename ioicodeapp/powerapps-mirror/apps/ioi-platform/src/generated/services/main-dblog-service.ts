import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBLOG } from '../models/main-dblog-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'MainDBLOG';

export class MainDBLOGService {
  static async create(record: Omit<MainDBLOG, 'id'>): Promise<MainDBLOG> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, record);
    if (!result.success) throw result.error;
    return result.data as MainDBLOG;
  }

  static async update(
    id: string,
    changedFields: Partial<Omit<MainDBLOG, 'id'>>
  ): Promise<MainDBLOG> {
    const result = await getClient().updateRecordAsync(DATA_SOURCE_NAME, id, changedFields);
    if (!result.success) throw result.error;
    return result.data as MainDBLOG;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<MainDBLOG> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return result.data as MainDBLOG;
  }

  static async getAll(options?: IOperationOptions): Promise<MainDBLOG[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DATA_SOURCE_NAME, options);
    if (!result.success) throw result.error;
    return result.data as MainDBLOG[];
  }
}
