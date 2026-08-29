import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ensureInitialized } from '@/lib/app-init';
import { MainDBHRService } from '../services/main-dbhr-service';
import type { MainDBHR, HRFormCode, HRCurrentStatus, HRSite } from '../services/main-dbhr-service';
import type { IOperationOptions } from '../../app-gen-sdk/data/common/types';

// Re-export types
export type { MainDBHR, HRFormCode, HRCurrentStatus, HRSite };

const QUERY_KEY = 'main-dbhr';
const STALE_TIME = 5 * 60 * 1000; // 5 minutes

// =============================================================================
// QUERY HOOKS
// =============================================================================

/** Fetch all HR records */
export function useMainDBHR(options?: IOperationOptions) {
  return useQuery({
    queryKey: [QUERY_KEY, 'all', options],
    queryFn: async () => {
      await ensureInitialized();
      return MainDBHRService.getAll(options);
    },
    staleTime: STALE_TIME,
  });
}

/** Fetch HR records by FormType (discriminator column) */
export function useMainDBHRByFormType(formType: HRFormCode, options?: IOperationOptions) {
  return useQuery({
    queryKey: [QUERY_KEY, 'formType', formType, options],
    queryFn: async () => {
      await ensureInitialized();
      return MainDBHRService.getByFormType(formType, options);
    },
    staleTime: STALE_TIME,
    enabled: !!formType,
  });
}

/** Fetch HR records by CurrentStatus */
export function useMainDBHRByStatus(status: HRCurrentStatus, options?: IOperationOptions) {
  return useQuery({
    queryKey: [QUERY_KEY, 'status', status, options],
    queryFn: async () => {
      await ensureInitialized();
      return MainDBHRService.getByStatus(status, options);
    },
    staleTime: STALE_TIME,
    enabled: !!status,
  });
}

/** Fetch HR records by FormType and CurrentStatus */
export function useMainDBHRByFormTypeAndStatus(
  formType: HRFormCode,
  status: HRCurrentStatus,
  options?: IOperationOptions
) {
  return useQuery({
    queryKey: [QUERY_KEY, 'formType', formType, 'status', status, options],
    queryFn: async () => {
      await ensureInitialized();
      return MainDBHRService.getByFormTypeAndStatus(formType, status, options);
    },
    staleTime: STALE_TIME,
    enabled: !!formType && !!status,
  });
}

/** Fetch single HR record by ID */
export function useMainDBHRById(id: string) {
  return useQuery({
    queryKey: [QUERY_KEY, 'id', id],
    queryFn: async () => {
      await ensureInitialized();
      return MainDBHRService.get(id);
    },
    staleTime: STALE_TIME,
    enabled: !!id,
  });
}

// =============================================================================
// MUTATION HOOKS
// =============================================================================

/** Create HR record mutation */
export function useCreateMainDBHR() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: Omit<MainDBHR, 'id'>) => {
      await ensureInitialized();
      return MainDBHRService.create(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

/** Update HR record mutation */
export function useUpdateMainDBHR() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, changes }: { id: string; changes: Partial<Omit<MainDBHR, 'id'>> }) => {
      await ensureInitialized();
      return MainDBHRService.update(id, changes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

/** Delete HR record mutation */
export function useDeleteMainDBHR() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await ensureInitialized();
      return MainDBHRService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

// =============================================================================
// WORKFLOW MUTATION HOOKS
// =============================================================================

/** Submit a draft record */
export function useSubmitMainDBHR() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, submittedBy }: { id: string; submittedBy: string }) => {
      await ensureInitialized();
      return MainDBHRService.submit(id, submittedBy);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

/** Approve a submitted record */
export function useApproveMainDBHR() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, approvedBy }: { id: string; approvedBy: string }) => {
      await ensureInitialized();
      return MainDBHRService.approve(id, approvedBy);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

/** Reject a submitted record */
export function useRejectMainDBHR() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, comments }: { id: string; comments?: string }) => {
      await ensureInitialized();
      return MainDBHRService.reject(id, comments);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

/** Return a record for revision */
export function useReturnMainDBHR() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, comments }: { id: string; comments?: string }) => {
      await ensureInitialized();
      return MainDBHRService.returnForRevision(id, comments);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

/** Lock a record after final approval */
export function useLockMainDBHR() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await ensureInitialized();
      return MainDBHRService.lock(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

// =============================================================================
// LEGACY ALIASES (for backwards compatibility)
// =============================================================================

/** @deprecated Use useMainDBHRByFormType instead */
export function useMainDBHRByFormCode(formCode: HRFormCode, options?: IOperationOptions) {
  return useMainDBHRByFormType(formCode, options);
}

/** @deprecated Site column removed in Section 4 */
export function useMainDBHRBySite(site: 'PRAI' | 'JOHOR', options?: IOperationOptions) {
  return useQuery({
    queryKey: [QUERY_KEY, 'site', site, options],
    queryFn: async () => {
      await ensureInitialized();
      return MainDBHRService.getBySite(site, options);
    },
    staleTime: STALE_TIME,
    enabled: !!site,
  });
}

/** @deprecated Use useMainDBHRByFormType instead */
export function useMainDBHRByFormCodeAndSite(
  formCode: HRFormCode,
  site: 'PRAI' | 'JOHOR',
  options?: IOperationOptions
) {
  return useQuery({
    queryKey: [QUERY_KEY, 'formCode', formCode, 'site', site, options],
    queryFn: async () => {
      await ensureInitialized();
      return MainDBHRService.getByFormCodeAndSite(formCode, site, options);
    },
    staleTime: STALE_TIME,
    enabled: !!formCode && !!site,
  });
}