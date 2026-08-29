import { getClient } from '../../../app-gen-sdk/data';
import type { LineItemsSTR } from '../models/line-items-str-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'LineItemsSTR';

export class LineItemsSTRService {
  static async create(record: Omit<LineItemsSTR, 'id'>): Promise<LineItemsSTR> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, record);
    if (!result.success) throw result.error;
    return result.data as LineItemsSTR;
  }

  static async update(
    id: string,
    changedFields: Partial<Omit<LineItemsSTR, 'id'>>
  ): Promise<LineItemsSTR> {
    const result = await getClient().updateRecordAsync(DATA_SOURCE_NAME, id, changedFields);
    if (!result.success) throw result.error;
    return result.data as LineItemsSTR;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<LineItemsSTR> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return result.data as LineItemsSTR;
  }

  static async getAll(options?: IOperationOptions): Promise<LineItemsSTR[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DATA_SOURCE_NAME, options);
    if (!result.success) throw result.error;
    return result.data as LineItemsSTR[];
  }
}