import { getClient } from '../../../app-gen-sdk/data';
import type { ITRoutingMatrix } from '../models/it-routing-matrix-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'ITRoutingMatrix';

export class ITRoutingMatrixService {
  static async create(record: Omit<ITRoutingMatrix, 'id'>): Promise<ITRoutingMatrix> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, record);
    if (!result.success) throw result.error;
    return result.data as ITRoutingMatrix;
  }

  static async update(
    id: string,
    changedFields: Partial<Omit<ITRoutingMatrix, 'id'>>
  ): Promise<ITRoutingMatrix> {
    const result = await getClient().updateRecordAsync(DATA_SOURCE_NAME, id, changedFields);
    if (!result.success) throw result.error;
    return result.data as ITRoutingMatrix;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<ITRoutingMatrix> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return result.data as ITRoutingMatrix;
  }

  static async getAll(options?: IOperationOptions): Promise<ITRoutingMatrix[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DATA_SOURCE_NAME, options);
    if (!result.success) throw result.error;
    return result.data as ITRoutingMatrix[];
  }
}