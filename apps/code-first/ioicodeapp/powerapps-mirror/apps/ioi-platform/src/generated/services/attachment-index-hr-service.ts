import { getClient } from '../../../app-gen-sdk/data';
import type { AttachmentIndexHR } from '../models/attachment-index-hr-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'AttachmentIndexHR';

export class AttachmentIndexHRService {
  static async create(record: Omit<AttachmentIndexHR, 'id'>): Promise<AttachmentIndexHR> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, record);
    if (!result.success) throw result.error;
    return result.data as AttachmentIndexHR;
  }

  static async update(
    id: string,
    changedFields: Partial<Omit<AttachmentIndexHR, 'id'>>
  ): Promise<AttachmentIndexHR> {
    const result = await getClient().updateRecordAsync(DATA_SOURCE_NAME, id, changedFields);
    if (!result.success) throw result.error;
    return result.data as AttachmentIndexHR;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<AttachmentIndexHR> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return result.data as AttachmentIndexHR;
  }

  static async getAll(options?: IOperationOptions): Promise<AttachmentIndexHR[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DATA_SOURCE_NAME, options);
    if (!result.success) throw result.error;
    return result.data as AttachmentIndexHR[];
  }
}