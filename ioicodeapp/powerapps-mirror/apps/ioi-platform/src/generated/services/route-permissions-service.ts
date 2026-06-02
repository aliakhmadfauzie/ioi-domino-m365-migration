import { getClient } from '../../../app-gen-sdk/data';
import type { RoutePermissions } from '../models/route-permissions-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'RoutePermissions';

export class RoutePermissionsService {
  static async create(record: Omit<RoutePermissions, 'id'>): Promise<RoutePermissions> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, record);
    if (!result.success) throw result.error;
    return result.data as RoutePermissions;
  }

  static async update(
    id: string,
    changedFields: Partial<Omit<RoutePermissions, 'id'>>
  ): Promise<RoutePermissions> {
    const result = await getClient().updateRecordAsync(DATA_SOURCE_NAME, id, changedFields);
    if (!result.success) throw result.error;
    return result.data as RoutePermissions;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<RoutePermissions> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return result.data as RoutePermissions;
  }

  static async getAll(options?: IOperationOptions): Promise<RoutePermissions[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DATA_SOURCE_NAME, options);
    if (!result.success) throw result.error;
    return result.data as RoutePermissions[];
  }
}