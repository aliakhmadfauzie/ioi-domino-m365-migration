import { getClient } from '../../../app-gen-sdk/data';
import type { ConfigCompanies } from '../models/config-companies-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'ConfigCompanies';

export class ConfigCompaniesService {
  static async create(record: Omit<ConfigCompanies, 'id'>): Promise<ConfigCompanies> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, record);
    if (!result.success) throw result.error;
    return result.data as ConfigCompanies;
  }

  static async update(
    id: string,
    changedFields: Partial<Omit<ConfigCompanies, 'id'>>
  ): Promise<ConfigCompanies> {
    const result = await getClient().updateRecordAsync(DATA_SOURCE_NAME, id, changedFields);
    if (!result.success) throw result.error;
    return result.data as ConfigCompanies;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<ConfigCompanies> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return result.data as ConfigCompanies;
  }

  static async getAll(options?: IOperationOptions): Promise<ConfigCompanies[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DATA_SOURCE_NAME, options);
    if (!result.success) throw result.error;
    return result.data as ConfigCompanies[];
  }
}