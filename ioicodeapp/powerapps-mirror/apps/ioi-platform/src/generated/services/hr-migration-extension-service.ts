import { getClient } from '../../../app-gen-sdk/data';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

export type HRMigrationDataSourceName =
  | 'maindb_hr_ext_een'
  | 'maindb_hr_ext_epdu'
  | 'maindb_hr_ext_ephr'
  | 'maindb_hr_ext_esf'
  | 'maindb_hr_ext_ftcr'
  | 'maindb_hr_ext_fwwpe'
  | 'maindb_hr_ext_fwwpd'
  | 'maindb_hr_ext_gdsn'
  | 'maindb_hr_ext_healthinfo'
  | 'maindb_hr_ext_hrapr'
  | 'hr_fwwpd_hostelrecords'
  | 'hr_fwwpd_insurancedeductions'
  | 'hr_fwwpd_complianceassets'
  | 'hr_migrationreminderlog';

export type HRMigrationRecord = Record<string, unknown> & {
  ID?: number;
  id?: number;
  Title?: string;
  title?: string;
};

function normalizeRecord(record: HRMigrationRecord): HRMigrationRecord {
  return {
    ...record,
    id: record.id ?? record.ID,
    title: record.title ?? record.Title,
  };
}

export class HRMigrationExtensionService {
  static async create<TRecord extends HRMigrationRecord>(
    dataSourceName: HRMigrationDataSourceName,
    record: Omit<TRecord, 'id' | 'ID'>
  ): Promise<TRecord> {
    const result = await getClient().createRecordAsync(dataSourceName, record);
    if (!result.success) throw result.error;
    return normalizeRecord(result.data as HRMigrationRecord) as TRecord;
  }

  static async update<TRecord extends HRMigrationRecord>(
    dataSourceName: HRMigrationDataSourceName,
    id: string,
    changedFields: Partial<Omit<TRecord, 'id' | 'ID'>>
  ): Promise<TRecord> {
    const result = await getClient().updateRecordAsync(dataSourceName, id, changedFields);
    if (!result.success) throw result.error;
    return normalizeRecord(result.data as HRMigrationRecord) as TRecord;
  }

  static async delete(dataSourceName: HRMigrationDataSourceName, id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(dataSourceName, id);
    if (!result.success) throw result.error;
  }

  static async get<TRecord extends HRMigrationRecord>(
    dataSourceName: HRMigrationDataSourceName,
    id: string
  ): Promise<TRecord> {
    const result = await getClient().retrieveRecordAsync(dataSourceName, id);
    if (!result.success) throw result.error;
    return normalizeRecord(result.data as HRMigrationRecord) as TRecord;
  }

  static async getAll<TRecord extends HRMigrationRecord>(
    dataSourceName: HRMigrationDataSourceName,
    options?: IOperationOptions
  ): Promise<TRecord[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(dataSourceName, options);
    if (!result.success) throw result.error;
    return (result.data as HRMigrationRecord[]).map(normalizeRecord) as TRecord[];
  }
}
