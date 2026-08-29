/**
 * MainDB_QA / MainDB_QC Site-Aware Service
 *
 * Provides site-aware CRUD operations for the QA/QC main lists.
 * Automatically routes to the correct SharePoint data source based on site context.
 *
 * Data Sources (from power.config.json):
 *   - 'maindb_qa'        → MainDB_QA (Prai QA)       — https://ioioi.sharepoint.com/sites/ioi-portal-qa
 *   - 'maindb_qa_jhr'    → MainDB_QA_JHR (Johor QA)  — https://ioioi.sharepoint.com/sites/ioi-portal-qa
 *   - 'maindb_qc'        → MainDB_QC (Prai QC)       — https://ioioi.sharepoint.com/sites/ioi-portal-qc
 *   - 'maindb_qc_jhr'    → MainDB_QC_JHR (Johor QC)  — https://ioioi.sharepoint.com/sites/ioi-portal-qc
 *
 * @example
 *   import { MainDBQASiteService } from '@/services/main-dbqa-site-service';
 *   const records = await MainDBQASiteService.getAll('QA', 'MY-JH', { filter: "FormCode eq 'SOP'" });
 */

import { getClient } from '../../app-gen-sdk/data';
import { MainDBQAService } from '../generated/services/main-dbqa-service';
import type { MainDBQA } from '../generated/models/main-dbqa-model';
import type { IOperationOptions } from '../../app-gen-sdk/data/common/types';
import type { SiteCode, DepartmentCode } from '@/types/platform';

// =============================================================================
// DATA SOURCE MAPPING
// =============================================================================

/**
 * Map a department + site code to the SharePoint data source name.
 */
export const SITE_DATA_SOURCE: Record<string, Record<SiteCode, string>> = {
  QA: {
    'MY-PR': 'maindb_qa',       // MainDB_QA — Prai QA
    'MY-JH': 'maindb_qa_jhr',   // MainDB_QA_JHR — Johor QA
  },
  QC: {
    'MY-PR': 'maindb_qc',       // MainDB_QC — Prai QC
    'MY-JH': 'maindb_qc_jhr',   // MainDB_QC_JHR — Johor QC
  },
} as const;

// =============================================================================
// HELPER: Get the correct data source
// =============================================================================

function getDataSource(dept: DepartmentCode, site: SiteCode): string {
  const deptMap = SITE_DATA_SOURCE[dept];
  if (!deptMap) {
    console.warn(`[MainDBQASiteService] Unknown department: ${dept}. Falling back to maindb_qa.`);
    return 'maindb_qa';
  }
  const ds = deptMap[site];
  if (!ds) {
    console.warn(`[MainDBQASiteService] Unknown site: ${site} for dept ${dept}. Falling back to ${dept === 'QC' ? 'maindb_qc' : 'maindb_qa'}.`);
    return dept === 'QC' ? 'maindb_qc' : 'maindb_qa';
  }
  return ds;
}

// =============================================================================
// SITE-AWARE SERVICE
// =============================================================================

export class MainDBQASiteService {
  /**
   * Create a record in the department/site-specific list.
   */
  static async create(
    dept: DepartmentCode,
    site: SiteCode,
    record: Omit<MainDBQA, 'id'>
  ): Promise<MainDBQA> {
    const dataSource = getDataSource(dept, site);
    try {
      const result = await getClient().createRecordAsync(dataSource, record as unknown as Record<string, unknown>);
      if (!result.success) throw result.error;
      return result.data as MainDBQA;
    } catch (err) {
      // Fallback to default service if data source doesn't exist yet
      if (String(err).includes('not found')) {
        console.warn(`[MainDBQASiteService] Falling back to MainDBQAService for ${dept}/${site}`);
        return MainDBQAService.create(record);
      }
      throw err;
    }
  }

  /**
   * Update a record in the department/site-specific list.
   */
  static async update(
    dept: DepartmentCode,
    site: SiteCode,
    id: string,
    changedFields: Partial<Omit<MainDBQA, 'id'>>
  ): Promise<MainDBQA> {
    const dataSource = getDataSource(dept, site);
    try {
      const result = await getClient().updateRecordAsync(dataSource, id, changedFields as unknown as Record<string, unknown>);
      if (!result.success) throw result.error;
      return result.data as MainDBQA;
    } catch (err) {
      if (String(err).includes('not found')) {
        return MainDBQAService.update(id, changedFields);
      }
      throw err;
    }
  }

  /**
   * Delete a record from the department/site-specific list.
   */
  static async delete(dept: DepartmentCode, site: SiteCode, id: string): Promise<void> {
    const dataSource = getDataSource(dept, site);
    try {
      const result = await getClient().deleteRecordAsync(dataSource, id);
      if (!result.success) throw result.error;
    } catch (err) {
      if (String(err).includes('not found')) {
        return MainDBQAService.delete(id);
      }
      throw err;
    }
  }

  /**
   * Retrieve a single record from the department/site-specific list.
   */
  static async get(dept: DepartmentCode, site: SiteCode, id: string): Promise<MainDBQA> {
    const dataSource = getDataSource(dept, site);
    try {
      const result = await getClient().retrieveRecordAsync(dataSource, id);
      if (!result.success) throw result.error;
      return result.data as MainDBQA;
    } catch (err) {
      if (String(err).includes('not found')) {
        return MainDBQAService.get(id);
      }
      throw err;
    }
  }

  /**
   * Retrieve all records from the department/site-specific list with optional filtering/sorting.
   */
  static async getAll(
    dept: DepartmentCode,
    site: SiteCode,
    options?: IOperationOptions
  ): Promise<MainDBQA[]> {
    const dataSource = getDataSource(dept, site);
    try {
      const result = await getClient().retrieveMultipleRecordsAsync(dataSource, options);
      if (!result.success) throw result.error;
      return result.data as MainDBQA[];
    } catch (err) {
      if (String(err).includes('not found')) {
        return MainDBQAService.getAll(options);
      }
      throw err;
    }
  }

  /**
   * Get records filtered by form code.
   */
  static async getByFormCode(
    dept: DepartmentCode,
    site: SiteCode,
    formCode: string,
    options?: IOperationOptions
  ): Promise<MainDBQA[]> {
    const filterOptions: IOperationOptions = {
      ...options,
      filter: `FormCode eq '${formCode}'`,
    };
    return MainDBQASiteService.getAll(dept, site, filterOptions);
  }

  /**
   * Get records filtered by status.
   */
  static async getByStatus(
    dept: DepartmentCode,
    site: SiteCode,
    status: string,
    options?: IOperationOptions
  ): Promise<MainDBQA[]> {
    const filterOptions: IOperationOptions = {
      ...options,
      filter: `StatusKey eq '${status}'`,
    };
    return MainDBQASiteService.getAll(dept, site, filterOptions);
  }

  /**
   * Get records filtered by form code and status.
   */
  static async getByFormCodeAndStatus(
    dept: DepartmentCode,
    site: SiteCode,
    formCode: string,
    status: string,
    options?: IOperationOptions
  ): Promise<MainDBQA[]> {
    const filterOptions: IOperationOptions = {
      ...options,
      filter: `FormCode eq '${formCode}' and StatusKey eq '${status}'`,
    };
    return MainDBQASiteService.getAll(dept, site, filterOptions);
  }
}
