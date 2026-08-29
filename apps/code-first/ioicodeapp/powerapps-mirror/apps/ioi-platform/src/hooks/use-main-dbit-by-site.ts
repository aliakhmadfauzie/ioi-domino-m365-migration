/**
 * Site-Aware MainDBIT Hooks
 *
 * React Query hooks that automatically route to the correct SharePoint list
 * (MainDB_IT for Prai, MainDB_IT_JHR for Johor) based on site context.
 *
 * These are drop-in replacements for useMainDBITList / useMainDBIT / useCreateMainDBIT
 * when you need site-aware data operations.
 *
 * @example
 *   // In a page component:
 *   const { site } = useSiteContext();
 *   const { data } = useMainDBITListBySite({ filter: "FormCode eq 'EAF'" });
 *
 *   // Create with site context:
 *   const createMutation = useCreateMainDBITBySite();
 *   await createMutation.mutateAsync({ site: 'MY-JH', data: { ... } });
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MainDBITSiteService } from '@/services/main-dbit-site-service';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import type { IOperationOptions } from '../../app-gen-sdk/data/common/types';
import type { SiteCode } from '@/types/platform';
import { useSiteContext } from './use-site-context';

// =============================================================================
// QUERY KEY FACTORY
// =============================================================================

const siteQueryKeys = {
  all: ['mainDBIT-by-site'] as const,
  list: (site: SiteCode, options?: IOperationOptions) =>
    ['mainDBIT-by-site', 'list', site, options] as const,
  detail: (site: SiteCode, id: string) =>
    ['mainDBIT-by-site', 'detail', site, id] as const,
};

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Fetch all MainDBIT records for the current user's site.
 * Automatically routes to MainDB_IT (Prai) or MainDB_IT_JHR (Johor).
 */
export function useMainDBITListBySite(options?: IOperationOptions) {
  const { site } = useSiteContext();

  return useQuery({
    queryKey: siteQueryKeys.list(site, options),
    queryFn: () => MainDBITSiteService.getAll(site, options),
    enabled: true,
  });
}

/**
 * Fetch a single MainDBIT record by ID for the current user's site.
 */
export function useMainDBITBySite(id: string) {
  const { site } = useSiteContext();

  return useQuery({
    queryKey: siteQueryKeys.detail(site, id),
    queryFn: () => MainDBITSiteService.get(site, id),
    enabled: !!id,
  });
}

/**
 * Create a new MainDBIT record on the specified site.
 * Use `site` property of the mutation input to specify target site.
 */
export function useCreateMainDBITBySite() {
  const queryClient = useQueryClient();
  const { site: defaultSite } = useSiteContext();

  return useMutation({
    mutationFn: ({
      site,
      data,
    }: {
      site?: SiteCode;
      data: Omit<MainDBIT, 'id'>;
    }) => MainDBITSiteService.create(site ?? defaultSite, data),
    onSuccess: (_data, variables) => {
      const targetSite = variables.site ?? defaultSite;
      queryClient.invalidateQueries({ queryKey: siteQueryKeys.list(targetSite) });
    },
  });
}

/**
 * Update an existing MainDBIT record on the specified site.
 */
export function useUpdateMainDBITBySite() {
  const queryClient = useQueryClient();
  const { site: defaultSite } = useSiteContext();

  return useMutation({
    mutationFn: ({
      site,
      id,
      changedFields,
    }: {
      site?: SiteCode;
      id: string;
      changedFields: Partial<Omit<MainDBIT, 'id'>>;
    }) => MainDBITSiteService.update(site ?? defaultSite, id, changedFields),
    onSuccess: (_data, variables) => {
      const targetSite = variables.site ?? defaultSite;
      queryClient.invalidateQueries({ queryKey: siteQueryKeys.list(targetSite) });
      queryClient.invalidateQueries({ queryKey: siteQueryKeys.detail(targetSite, variables.id) });
    },
  });
}

/**
 * Delete a MainDBIT record on the specified site.
 */
export function useDeleteMainDBITBySite() {
  const queryClient = useQueryClient();
  const { site: defaultSite } = useSiteContext();

  return useMutation({
    mutationFn: ({
      site,
      id,
    }: {
      site?: SiteCode;
      id: string;
    }) => MainDBITSiteService.delete(site ?? defaultSite, id),
    onSuccess: (_data, variables) => {
      const targetSite = variables.site ?? defaultSite;
      queryClient.invalidateQueries({ queryKey: siteQueryKeys.list(targetSite) });
    },
  });
}
