import { getClient } from '../../../app-gen-sdk/data';
import type { LookupTargetb1de9795563e48c399a31430234dc6e2 } from '../models/lookup-targetb1de9795563e48c399a31430234dc6e2-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'LookupTargetb1de9795563e48c399a31430234dc6e2';

export class LookupTargetb1de9795563e48c399a31430234dc6e2Service {
  static async create(record: Omit<LookupTargetb1de9795563e48c399a31430234dc6e2, 'id'>): Promise<LookupTargetb1de9795563e48c399a31430234dc6e2> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, record);
    if (!result.success) throw result.error;
    return result.data as LookupTargetb1de9795563e48c399a31430234dc6e2;
  }

  static async update(
    id: string,
    changedFields: Partial<Omit<LookupTargetb1de9795563e48c399a31430234dc6e2, 'id'>>
  ): Promise<LookupTargetb1de9795563e48c399a31430234dc6e2> {
    const result = await getClient().updateRecordAsync(DATA_SOURCE_NAME, id, changedFields);
    if (!result.success) throw result.error;
    return result.data as LookupTargetb1de9795563e48c399a31430234dc6e2;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<LookupTargetb1de9795563e48c399a31430234dc6e2> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return result.data as LookupTargetb1de9795563e48c399a31430234dc6e2;
  }

  static async getAll(options?: IOperationOptions): Promise<LookupTargetb1de9795563e48c399a31430234dc6e2[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DATA_SOURCE_NAME, options);
    if (!result.success) throw result.error;
    return result.data as LookupTargetb1de9795563e48c399a31430234dc6e2[];
  }
}