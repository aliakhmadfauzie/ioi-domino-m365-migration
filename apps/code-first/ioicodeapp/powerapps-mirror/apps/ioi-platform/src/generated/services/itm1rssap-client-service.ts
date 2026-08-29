import { getClient } from '../../../app-gen-sdk/data';
import type { ITM1RSSAPClient } from '../models/itm1rssap-client-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'ITM1RSSAPClient';

export class ITM1RSSAPClientService {
  static async create(record: Omit<ITM1RSSAPClient, 'id'>): Promise<ITM1RSSAPClient> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, record);
    if (!result.success) throw result.error;
    return result.data as ITM1RSSAPClient;
  }

  static async update(
    id: string,
    changedFields: Partial<Omit<ITM1RSSAPClient, 'id'>>
  ): Promise<ITM1RSSAPClient> {
    const result = await getClient().updateRecordAsync(DATA_SOURCE_NAME, id, changedFields);
    if (!result.success) throw result.error;
    return result.data as ITM1RSSAPClient;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<ITM1RSSAPClient> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return result.data as ITM1RSSAPClient;
  }

  static async getAll(options?: IOperationOptions): Promise<ITM1RSSAPClient[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DATA_SOURCE_NAME, options);
    if (!result.success) throw result.error;
    return result.data as ITM1RSSAPClient[];
  }
}