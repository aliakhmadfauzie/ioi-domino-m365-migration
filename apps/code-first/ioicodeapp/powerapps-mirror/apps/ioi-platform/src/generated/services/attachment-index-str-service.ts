import { getClient } from '../../../app-gen-sdk/data';
import type { AttachmentIndexSTR } from '../models/attachment-index-str-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'AttachmentIndexSTR';

export class AttachmentIndexSTRService {
  static async create(record: Omit<AttachmentIndexSTR, 'id'>): Promise<AttachmentIndexSTR> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, record);
    if (!result.success) throw result.error;
    return result.data as AttachmentIndexSTR;
  }

  static async update(
    id: string,
    changedFields: Partial<Omit<AttachmentIndexSTR, 'id'>>
  ): Promise<AttachmentIndexSTR> {
    const result = await getClient().updateRecordAsync(DATA_SOURCE_NAME, id, changedFields);
    if (!result.success) throw result.error;
    return result.data as AttachmentIndexSTR;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<AttachmentIndexSTR> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return result.data as AttachmentIndexSTR;
  }

  static async getAll(options?: IOperationOptions): Promise<AttachmentIndexSTR[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DATA_SOURCE_NAME, options);
    if (!result.success) throw result.error;
    return result.data as AttachmentIndexSTR[];
  }
}