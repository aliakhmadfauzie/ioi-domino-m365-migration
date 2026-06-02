/**
 * MainDB_IT Site-Aware Service
 *
 * Provides site-aware CRUD operations for the MainDB_IT / MainDB_IT_JHR lists.
 * Automatically routes to the correct SharePoint data source based on site context.
 *
 * Data Sources (from power.config.json):
 *   - 'maindb_it'       → MainDB_IT (Prai)       — https://ioioi.sharepoint.com/sites/ioi-portal-it
 *   - 'maindb_it_jhr'   → MainDB_IT_JHR (Johor)  — Requires SharePoint list creation + power.config.json update
 *
 * @example
 *   import { MainDBITSiteService } from '@/services/main-dbit-site-service';
 *   const records = await MainDBITSiteService.getAll('MY-JH', { filter: "FormCode eq 'EAF'" });
 */

import { getClient } from '../../app-gen-sdk/data';
import { MainDBITService } from '../generated/services/main-dbit-service';
import type { MainDBIT } from '../generated/models/main-dbit-model';
import type { IOperationOptions } from '../../app-gen-sdk/data/common/types';
import type { SiteCode } from '@/types/platform';

// =============================================================================
// DATA SOURCE MAPPING
// =============================================================================

/**
 * Map a site code to the SharePoint data source name.
 *
 * @todo After creating the MainDB_IT_JHR SharePoint list:
 *   1. Add the list as a data source in Power Apps Studio
 *   2. Copy the generated GUID from Power Apps Studio
 *   3. Add to power.config.json under ioi-portal-it or ioi-portal-johor connection
 *   4. Remove the 'as const' assertion warning below
 */
export const SITE_DATA_SOURCE: Record<SiteCode, string> = {
  'MY-PR': 'maindb_it',       // MainDB_IT — Prai (exists, confirmed in power.config.json)
  'MY-JH': 'maindb_it_jhr',   // MainDB_IT_JHR — Johor (pending: needs SP list + config)
} as const;

// =============================================================================
// HELPER: Check if a data source is available
// =============================================================================

let johorWarningShown = false;

function getDataSource(site: SiteCode): string {
  const ds = SITE_DATA_SOURCE[site];
  if (site === 'MY-JH' && !johorWarningShown) {
    console.warn(
      '[MainDBITSiteService] Johor data source (maindb_it_jhr) is not yet configured. ' +
      'Create the MainDB_IT_JHR SharePoint list and add it to power.config.json. ' +
      'Falling back to maindb_it for now.'
    );
    johorWarningShown = true;
  }
  return ds;
}

// =============================================================================
// SITE-AWARE SERVICE
// =============================================================================

export class MainDBITSiteService {
  /**
   * Create a record in the site-specific list.
   */
  static async create(site: SiteCode, record: Omit<MainDBIT, 'id'>): Promise<MainDBIT> {
    const dataSource = getDataSource(site);
    try {
      const result = await getClient().createRecordAsync(dataSource, record as unknown as Record<string, unknown>);
      if (!result.success) throw result.error;
      return result.data as MainDBIT;
    } catch (err) {
      // Fallback to default service if Johor data source doesn't exist yet
      if (site === 'MY-JH' && String(err).includes('not found')) {
        console.warn('[MainDBITSiteService] Falling back to MainDBITService for Johor');
        return MainDBITService.create(record);
      }
      throw err;
    }
  }

  /**
   * Update a record in the site-specific list.
   */
  static async update(
    site: SiteCode,
    id: string,
    changedFields: Partial<Omit<MainDBIT, 'id'>>
  ): Promise<MainDBIT> {
    const dataSource = getDataSource(site);
    try {
      const result = await getClient().updateRecordAsync(dataSource, id, changedFields as unknown as Record<string, unknown>);
      if (!result.success) throw result.error;
      return result.data as MainDBIT;
    } catch (err) {
      if (site === 'MY-JH' && String(err).includes('not found')) {
        return MainDBITService.update(id, changedFields);
      }
      throw err;
    }
  }

  /**
   * Delete a record from the site-specific list.
   */
  static async delete(site: SiteCode, id: string): Promise<void> {
    const dataSource = getDataSource(site);
    try {
      const result = await getClient().deleteRecordAsync(dataSource, id);
      if (!result.success) throw result.error;
    } catch (err) {
      if (site === 'MY-JH' && String(err).includes('not found')) {
        return MainDBITService.delete(id);
      }
      throw err;
    }
  }

  /**
   * Retrieve a single record from the site-specific list.
   */
  static async get(site: SiteCode, id: string): Promise<MainDBIT> {
    const dataSource = getDataSource(site);
    try {
      const result = await getClient().retrieveRecordAsync(dataSource, id);
      if (!result.success) throw result.error;
      return result.data as MainDBIT;
    } catch (err) {
      if (site === 'MY-JH' && String(err).includes('not found')) {
        return MainDBITService.get(id);
      }
      throw err;
    }
  }

  /**
   * Retrieve all records from the site-specific list with optional filtering/sorting.
   */
  static async getAll(site: SiteCode, options?: IOperationOptions): Promise<MainDBIT[]> {
    const dataSource = getDataSource(site);
    try {
      const result = await getClient().retrieveMultipleRecordsAsync(dataSource, options);
      if (!result.success) throw result.error;
      return result.data as MainDBIT[];
    } catch (err) {
      if (site === 'MY-JH' && String(err).includes('not found')) {
        return MainDBITService.getAll(options);
      }
      throw err;
    }
  }

  /**
   * Get the display name for a site's SharePoint list.
   */
  static getListDisplayName(site: SiteCode): string {
    return site === 'MY-JH' ? 'MainDB_IT_JHR (Johor)' : 'MainDB_IT (Prai)';
  }

  /**
   * Get the data source name for a site.
   */
  static getDataSourceName(site: SiteCode): string {
    return SITE_DATA_SOURCE[site];
  }
}

// =============================================================================
// SITE RESOLUTION HELPERS
// =============================================================================

/**
 * Resolve site code from a SiteKey choice value.
 */
export function siteKeyToSiteCode(siteKey: string): SiteCode {
  switch (siteKey) {
    case 'SiteKey0': return 'MY-JH';  // Johor
    case 'SiteKey1': return 'MY-PR';  // Prai
    default:
      console.warn(`[siteKeyToSiteCode] Unknown siteKey: "${siteKey}". Defaulting to MY-PR. Check SharePoint Site choice options.`);
      return 'MY-PR';           // Default to Prai
  }
}

/**
 * Resolve site code from a location string (form field value).
 */
export function locationToSiteCode(location: string): SiteCode {
  switch (location) {
    case 'MY-JH': return 'MY-JH';
    case 'MY-PR': return 'MY-PR';
    default: return 'MY-PR';
  }
}
