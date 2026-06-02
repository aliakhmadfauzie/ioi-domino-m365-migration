import { getClient } from '../../../app-gen-sdk/data';
import type { ITM1RSBanks } from '../models/itm1rs-banks-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'ITM1RSBanks';

export class ITM1RSBanksService {
  static async create(record: Omit<ITM1RSBanks, 'id'>): Promise<ITM1RSBanks> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, record);
    if (!result.success) throw result.error;
    return result.data as ITM1RSBanks;
  }

  static async update(
    id: string,
    changedFields: Partial<Omit<ITM1RSBanks, 'id'>>
  ): Promise<ITM1RSBanks> {
    const result = await getClient().updateRecordAsync(DATA_SOURCE_NAME, id, changedFields);
    if (!result.success) throw result.error;
    return result.data as ITM1RSBanks;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<ITM1RSBanks> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return result.data as ITM1RSBanks;
  }

  static async getAll(options?: IOperationOptions): Promise<ITM1RSBanks[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DATA_SOURCE_NAME, options);
    if (!result.success) throw result.error;
    return result.data as ITM1RSBanks[];
  }
}