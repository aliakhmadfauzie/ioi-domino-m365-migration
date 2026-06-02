import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBPURExtMASTOFAPPR } from '../models/main-dbpur-ext-mastofappr-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DS = 'MainDBPURExtMASTOFAPPR';

export class MainDBPURExtMASTOFAPPRService {
  static async create(r: Omit<MainDBPURExtMASTOFAPPR, 'id'>): Promise<MainDBPURExtMASTOFAPPR> {
    const result = await getClient().createRecordAsync(DS, r);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtMASTOFAPPR;
  }

  static async update(id: string, f: Partial<Omit<MainDBPURExtMASTOFAPPR, 'id'>>): Promise<MainDBPURExtMASTOFAPPR> {
    const result = await getClient().updateRecordAsync(DS, id, f);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtMASTOFAPPR;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DS, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<MainDBPURExtMASTOFAPPR> {
    const result = await getClient().retrieveRecordAsync(DS, id);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtMASTOFAPPR;
  }

  static async getAll(o?: IOperationOptions): Promise<MainDBPURExtMASTOFAPPR[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DS, o);
    if (!result.success) throw result.error;
    return result.data as MainDBPURExtMASTOFAPPR[];
  }
}
