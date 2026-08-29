import { getClient } from '../../../app-gen-sdk/data';
import type { ITM1SFARServers } from '../models/itm1sfar-servers-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'ITM1SFARServers';

export class ITM1SFARServersService {
  static async create(record: Omit<ITM1SFARServers, 'id'>): Promise<ITM1SFARServers> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, record);
    if (!result.success) throw result.error;
    return result.data as ITM1SFARServers;
  }

  static async update(
    id: string,
    changedFields: Partial<Omit<ITM1SFARServers, 'id'>>
  ): Promise<ITM1SFARServers> {
    const result = await getClient().updateRecordAsync(DATA_SOURCE_NAME, id, changedFields);
    if (!result.success) throw result.error;
    return result.data as ITM1SFARServers;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<ITM1SFARServers> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return result.data as ITM1SFARServers;
  }

  static async getAll(options?: IOperationOptions): Promise<ITM1SFARServers[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DATA_SOURCE_NAME, options);
    if (!result.success) throw result.error;
    return result.data as ITM1SFARServers[];
  }
}