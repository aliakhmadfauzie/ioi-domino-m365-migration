import { getClient } from '../../../app-gen-sdk/data';
import type { ConfigGlobalUserRoleAssignments } from '../models/config-global-user-role-assignments-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'ConfigGlobalUserRoleAssignments';

export class ConfigGlobalUserRoleAssignmentsService {
  static async create(record: Omit<ConfigGlobalUserRoleAssignments, 'id'>): Promise<ConfigGlobalUserRoleAssignments> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, record);
    if (!result.success) throw result.error;
    return result.data as ConfigGlobalUserRoleAssignments;
  }

  static async update(
    id: string,
    changedFields: Partial<Omit<ConfigGlobalUserRoleAssignments, 'id'>>
  ): Promise<ConfigGlobalUserRoleAssignments> {
    const result = await getClient().updateRecordAsync(DATA_SOURCE_NAME, id, changedFields);
    if (!result.success) throw result.error;
    return result.data as ConfigGlobalUserRoleAssignments;
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<ConfigGlobalUserRoleAssignments> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return result.data as ConfigGlobalUserRoleAssignments;
  }

  static async getAll(options?: IOperationOptions): Promise<ConfigGlobalUserRoleAssignments[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DATA_SOURCE_NAME, options);
    if (!result.success) throw result.error;
    return result.data as ConfigGlobalUserRoleAssignments[];
  }
}