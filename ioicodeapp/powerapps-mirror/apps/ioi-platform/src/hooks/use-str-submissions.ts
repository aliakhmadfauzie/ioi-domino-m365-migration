/**
 * STR Department React Query Hooks
 * Provides data fetching and mutations for STR submissions
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { STRSubmissionService, getSTRStats, getSTRModuleStats } from '@/services/str-submission-service';
import type { STRSubmissionInput } from '@/services/str-submission-service';
import type { MainDB_STR_Base, STRForm } from '@/types/str-forms';
import type { STRFormCode, STRStatus } from '@/config/str-constants';
import { toast } from 'sonner';
import { useIsAppInitialized } from '@/lib/app-init';

// =============================================================================
// QUERY KEYS
// =============================================================================

export const strQueryKeys = {
  all: ['str-submissions'] as const,
  lists: () => [...strQueryKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...strQueryKeys.lists(), filters] as const,
  details: () => [...strQueryKeys.all, 'detail'] as const,
  detail: (guid: string) => [...strQueryKeys.details(), guid] as const,
  stats: () => [...strQueryKeys.all, 'stats'] as const,
  moduleStats: (moduleId: string) => [...strQueryKeys.all, 'module-stats', moduleId] as const,
  approvalHistory: (guid: string) => [...strQueryKeys.all, 'approval-history', guid] as const,
};

// Shared retry config for transient data model errors
const isTransientError = (error: Error) => {
  const msg = error?.message || '';
  return msg.includes('currently being updated') ||
    msg.includes('data model') ||
    msg.includes('configuration') ||
    msg.includes('not available');
};

const retryConfig = {
  retry: (failureCount: number, error: Error) => {
    if (isTransientError(error) && failureCount < 8) return true;
    return failureCount < 2;
  },
  retryDelay: (attemptIndex: number) => Math.min(500 * Math.pow(1.5, attemptIndex), 5000),
  throwOnError: false,
  staleTime: 30000,
};

// =============================================================================
// LIST HOOKS
// =============================================================================

/**
 * Get all STR submissions
 */
export function useSTRSubmissions() {
  const isInitialized = useIsAppInitialized();
  return useQuery({
    queryKey: strQueryKeys.lists(),
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return STRSubmissionService.getAll();
    },
    enabled: isInitialized,
    ...retryConfig,
  });
}
/**
 * Get STR submissions by form codes
 */
export function useSTRSubmissionsByFormCodes(formCodes: STRFormCode[]) {
  const isInitialized = useIsAppInitialized();
  return useQuery({
    queryKey: strQueryKeys.list({ formCodes }),
    queryFn: () => STRSubmissionService.getByFormCodes(formCodes),
    enabled: isInitialized && formCodes.length > 0,
    ...retryConfig,
  });
}

/**
 * Get STR submissions by status
 */
export function useSTRSubmissionsByStatus(status: STRStatus) {
  const isInitialized = useIsAppInitialized();
  return useQuery({
    queryKey: strQueryKeys.list({ status }),
    queryFn: () => STRSubmissionService.getByStatus(status),
    enabled: isInitialized,
    ...retryConfig,
  });
}

/**
 * Get STR submissions by module
 */
export function useSTRSubmissionsByModule(moduleFormCodes: string[]) {
  const isInitialized = useIsAppInitialized();
  return useQuery({
    queryKey: strQueryKeys.list({ module: moduleFormCodes }),
    queryFn: () => STRSubmissionService.getByModule(moduleFormCodes),
    enabled: isInitialized && moduleFormCodes.length > 0,
    ...retryConfig,
  });
}

/**
 * Get STR submissions by user
 */
export function useSTRSubmissionsByUser(userEmail: string) {
  const isInitialized = useIsAppInitialized();
  return useQuery({
    queryKey: strQueryKeys.list({ user: userEmail }),
    queryFn: () => STRSubmissionService.getByUser(userEmail),
    enabled: isInitialized && !!userEmail,
    ...retryConfig,
  });
}

/**
 * Get pending approvals
 */
export function useSTRPendingApprovals() {
  const isInitialized = useIsAppInitialized();
  return useQuery({
    queryKey: strQueryKeys.list({ pending: true }),
    queryFn: () => STRSubmissionService.getPendingApprovals(),
    enabled: isInitialized,
    ...retryConfig,
  });
}

// =============================================================================
// DETAIL HOOKS
// =============================================================================

/**
 * Get a single STR submission
 */
export function useSTRSubmission(guid: string) {
  const isInitialized = useIsAppInitialized();
  return useQuery({
    queryKey: strQueryKeys.detail(guid),
    queryFn: () => STRSubmissionService.get(guid),
    enabled: isInitialized && !!guid,
    ...retryConfig,
  });
}

/**
 * Get approval history for a submission
 */
export function useSTRApprovalHistory(guid: string) {
  const isInitialized = useIsAppInitialized();
  return useQuery({
    queryKey: strQueryKeys.approvalHistory(guid),
    queryFn: () => STRSubmissionService.getApprovalHistory(guid),
    enabled: isInitialized && !!guid,
    ...retryConfig,
  });
}

// =============================================================================
// STATS HOOKS
// =============================================================================

/**
 * Get overall STR stats
 */
export function useSTRStats() {
  const isInitialized = useIsAppInitialized();
  return useQuery({
    queryKey: strQueryKeys.stats(),
    queryFn: () => getSTRStats(),
    enabled: isInitialized,
    ...retryConfig,
  });
}

/**
 * Get module-specific stats
 */
export function useSTRModuleStats(moduleId: string, moduleFormCodes: string[]) {
  const isInitialized = useIsAppInitialized();
  return useQuery({
    queryKey: strQueryKeys.moduleStats(moduleId),
    queryFn: () => getSTRModuleStats(moduleFormCodes),
    enabled: isInitialized && moduleFormCodes.length > 0,
    ...retryConfig,
  });
}

// =============================================================================
// MUTATION HOOKS
// =============================================================================

/**
 * Create a new STR submission
 */
export function useCreateSTRSubmission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: STRSubmissionInput) => STRSubmissionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: strQueryKeys.all });
      toast.success('Submission created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create submission: ${error.message}`);
    },
  });
}

/**
 * Update an STR submission
 */
export function useUpdateSTRSubmission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ guid, data }: { guid: string; data: Partial<STRForm> }) => STRSubmissionService.update(guid, data),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: strQueryKeys.all });
        toast.success('Submission updated successfully');
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to update submission: ${error.message}`);
    },
  });
}

/**
 * Submit a draft submission
 */
export function useSubmitSTRSubmission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ guid, submittedBy, submittedByEmail }: { guid: string; submittedBy: string; submittedByEmail: string }) => STRSubmissionService.submit(guid, submittedBy, submittedByEmail),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: strQueryKeys.all });
        toast.success('Submission submitted successfully');
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit: ${error.message}`);
    },
  });
}

/**
 * Delete a draft submission
 */
export function useDeleteSTRSubmission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (guid: string) => STRSubmissionService.delete(guid),
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: strQueryKeys.all });
        toast.success('Submission deleted successfully');
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete submission: ${error.message}`);
    },
  });
}

/**
 * Approve a submission
 */
export function useApproveSTRSubmission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ guid, approverName, approverEmail, comments }: {
      guid: string;
      approverName: string;
      approverEmail: string;
      comments: string;
    }) => STRSubmissionService.approve(guid, approverName, approverEmail, comments),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: strQueryKeys.all });
        toast.success('Submission approved successfully');
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve: ${error.message}`);
    },
  });
}

/**
 * Reject a submission (mandatory comments)
 */
export function useRejectSTRSubmission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ guid, rejectorName, rejectorEmail, comments }: {
      guid: string;
      rejectorName: string;
      rejectorEmail: string;
      comments: string;
    }) => STRSubmissionService.reject(guid, rejectorName, rejectorEmail, comments),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: strQueryKeys.all });
        toast.success('Submission rejected');
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to reject: ${error.message}`);
    },
  });
}

/**
 * Return a submission for amendments
 */
export function useReturnSTRSubmission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ guid, returnedBy, returnedByEmail, comments }: {
      guid: string;
      returnedBy: string;
      returnedByEmail: string;
      comments: string;
    }) => STRSubmissionService.return(guid, returnedBy, returnedByEmail, comments),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: strQueryKeys.all });
        toast.success('Submission returned for amendments');
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to return submission: ${error.message}`);
    },
  });
}
