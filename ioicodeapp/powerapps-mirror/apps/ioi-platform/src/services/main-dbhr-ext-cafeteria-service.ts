import { ensureInitialized } from '@/lib/app-init';
import { MainDB_HR_Ext_CafeteriaService as GeneratedService } from '../generated/services/main-dbhr-ext-cafeteria-service';
import type { MainDB_HR_Ext_Cafeteria } from '../generated/models/main-dbhr-ext-cafeteria-model';
import type { IOperationOptions } from '../../app-gen-sdk/data/common/types';

export type MainDBHRExtCafeteria = MainDB_HR_Ext_Cafeteria;

export class MainDBHRExtCafeteriaService {
  static async create(
    record: Omit<MainDBHRExtCafeteria, 'id'>
  ): Promise<MainDBHRExtCafeteria> {
    await ensureInitialized();
    return GeneratedService.create(record);
  }

  static async update(
    id: string,
    changedFields: Partial<Omit<MainDBHRExtCafeteria, 'id'>>
  ): Promise<MainDBHRExtCafeteria> {
    await ensureInitialized();
    return GeneratedService.update(id, changedFields);
  }

  static async get(id: string): Promise<MainDBHRExtCafeteria> {
    await ensureInitialized();
    return GeneratedService.get(id);
  }

  static async getAll(options?: IOperationOptions): Promise<MainDBHRExtCafeteria[]> {
    await ensureInitialized();
    return GeneratedService.getAll(options);
  }

  static async getByParentRecord(parentRecordId: string): Promise<MainDBHRExtCafeteria | undefined> {
    const records = await this.getAll({
      filter: `ParentRecord eq '${parentRecordId}' and ParentFormCode eq 'CIR'`,
    });
    return records[0];
  }
}
