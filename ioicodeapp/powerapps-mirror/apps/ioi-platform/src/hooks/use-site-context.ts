/**
 * Site Context Hook
 *
 * Provides the current user's site context (Prai or Johor) for routing
 * data operations to the correct SharePoint list.
 *
 * The site is determined by:
 *   1. User's profile site attribute (if available)
 *   2. URL query parameter `?site=MY-JH` (for testing / admin override)
 *   3. Default to Prai (MY-PR)
 *
 * @example
 *   const { site, listName, isJohor, isPrai } = useSiteContext();
 *   const { data } = useMainDBITListBySite({ filter: "..." });
 */

import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { currentDepartmentAtom } from '@/store/platform-store';
import { MainDBITSiteService, siteKeyToSiteCode } from '@/services/main-dbit-site-service';
import type { SiteCode } from '@/types/platform';

export interface SiteContext {
  /** Current site code: 'MY-PR' (Prai) or 'MY-JH' (Johor) */
  site: SiteCode;
  /** Whether the current site is Johor */
  isJohor: boolean;
  /** Whether the current site is Prai */
  isPrai: boolean;
  /** SharePoint list display name for the current site */
  listName: string;
  /** Internal data source name for the current site */
  dataSourceName: string;
  /** Toggle site (useful for admin testing) */
  toggleSite: () => SiteCode;
}

/**
 * Hook to get the current user's site context.
 *
 * Site priority: URL param > department context > default (Prai)
 */
export function useSiteContext(): SiteContext {
  const [searchParams, setSearchParams] = useSearchParams();
  const department = useAtomValue(currentDepartmentAtom);

  const site = useMemo<SiteCode>(() => {
    // 1. URL query parameter override (for testing/admin)
    const urlSite = searchParams.get('site');
    if (urlSite === 'MY-JH' || urlSite === 'MY-PR') {
      return urlSite;
    }

    // 2. Department-based inference (Jon site = Johor)
    if (department?.toUpperCase() === 'JON' || department?.toUpperCase() === 'JOHOR') {
      return 'MY-JH';
    }

    // 3. Default to Prai
    return 'MY-PR';
  }, [searchParams, department]);

  const isJohor = site === 'MY-JH';
  const isPrai = site === 'MY-PR';
  const listName = MainDBITSiteService.getListDisplayName(site);
  const dataSourceName = MainDBITSiteService.getDataSourceName(site);

  const toggleSite = (): SiteCode => {
    const newSite: SiteCode = site === 'MY-PR' ? 'MY-JH' : 'MY-PR';
    setSearchParams((prev) => {
      prev.set('site', newSite);
      return prev;
    });
    return newSite;
  };

  return { site, isJohor, isPrai, listName, dataSourceName, toggleSite };
}

/**
 * Resolve site code from a submission's siteKey or submittedby/department info.
 */
export function resolveSubmissionSite(
  siteKey?: string,
  department?: string
): SiteCode {
  if (siteKey) {
    return siteKeyToSiteCode(siteKey);
  }
  if (department?.toUpperCase() === 'JOHOR') {
    return 'MY-JH';
  }
  return 'MY-PR';
}
