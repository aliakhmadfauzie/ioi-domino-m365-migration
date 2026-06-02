import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUpdateMainDBIT, useMainDBITList } from '@/generated/hooks/use-main-dbit';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import { toast } from 'sonner';

// Edit request states stored in remarks JSON
export type EditRequestStatus = 'SUBMITTED' | 'EDIT_REQUEST_RAISED' | 'EDIT_UNLOCKED' | 'EDIT_COMPLETED';

export interface EditRequest {
  id: string;
  submissionId: string;
  requestedBy: string;
  requestedAt: string;
  editReason: string;
  fieldsRequested?: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewerComments?: string;
  editWindowExpires?: string;
  editCompletedAt?: string;
}

export interface FieldChange {
  fieldName: string;
  previousValue: unknown;
  newValue: unknown;
  changedAt: string;
}

// Parse edit request from remarks JSON
export function getEditRequestFromRemarks(remarks: string | undefined): EditRequest | null {
  if (!remarks) return null;
  try {
    const data = JSON.parse(remarks);
    return data.editRequest || null;
  } catch {
    return null;
  }
}

// Get edit state from remarks JSON
export function getEditStateFromRemarks(remarks: string | undefined): EditRequestStatus {
  if (!remarks) return 'SUBMITTED';
  try {
    const data = JSON.parse(remarks);
    return data.editState || 'SUBMITTED';
  } catch {
    return 'SUBMITTED';
  }
}

// Check if submission is currently editable
export function isSubmissionEditable(remarks: string | undefined): boolean {
  const state = getEditStateFromRemarks(remarks);
  return state === 'EDIT_UNLOCKED';
}

// Check if edit request is pending
export function hasActiveEditRequest(remarks: string | undefined): boolean {
  const editRequest = getEditRequestFromRemarks(remarks);
  return editRequest?.status === 'PENDING';
}

// Hook to request edit on a submission
export function useRequestEdit() {
  const updateMutation = useUpdateMainDBIT();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      submission,
      editReason,
      requestedBy,
      fieldsRequested,
    }: {
      submission: MainDBIT;
      editReason: string;
      requestedBy: string;
      fieldsRequested?: string[];
    }) => {
      const existingRemarks = submission.remarks ? JSON.parse(submission.remarks) : {};
      
      const editRequest: EditRequest = {
        id: `ER-${Date.now()}`,
        submissionId: String(submission.id),
        requestedBy,
        requestedAt: new Date().toISOString(),
        editReason,
        fieldsRequested,
        status: 'PENDING',
      };

      const updatedRemarks = {
        ...existingRemarks,
        editState: 'EDIT_REQUEST_RAISED' as EditRequestStatus,
        editRequest,
        editHistory: [
          ...(existingRemarks.editHistory || []),
          {
            action: 'EDIT_REQUESTED',
            timestamp: new Date().toISOString(),
            actor: requestedBy,
            reason: editReason,
          },
        ],
      };

      return updateMutation.mutateAsync({
        id: String(submission.id),
        changedFields: {
          remarks: JSON.stringify(updatedRemarks),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mainDBIT'] });
      toast.success('Edit request submitted successfully');
    },
    onError: () => {
      toast.error('Failed to submit edit request');
    },
  });
}

// Hook to approve edit request (for IT approvers)
export function useApproveEditRequest() {
  const updateMutation = useUpdateMainDBIT();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      submission,
      approverEmail,
      approverComments,
      editWindowHours = 72,
    }: {
      submission: MainDBIT;
      approverEmail: string;
      approverComments?: string;
      editWindowHours?: number;
    }) => {
      const existingRemarks = submission.remarks ? JSON.parse(submission.remarks) : {};
      const editRequest = existingRemarks.editRequest as EditRequest;
      
      if (!editRequest) {
        throw new Error('No edit request found');
      }

      const editWindowExpires = new Date();
      editWindowExpires.setHours(editWindowExpires.getHours() + editWindowHours);

      const updatedEditRequest: EditRequest = {
        ...editRequest,
        status: 'APPROVED',
        reviewedBy: approverEmail,
        reviewedAt: new Date().toISOString(),
        reviewerComments: approverComments,
        editWindowExpires: editWindowExpires.toISOString(),
      };

      const updatedRemarks = {
        ...existingRemarks,
        editState: 'EDIT_UNLOCKED' as EditRequestStatus,
        editRequest: updatedEditRequest,
        editHistory: [
          ...(existingRemarks.editHistory || []),
          {
            action: 'EDIT_APPROVED',
            timestamp: new Date().toISOString(),
            actor: approverEmail,
            comments: approverComments,
            expiresAt: editWindowExpires.toISOString(),
          },
        ],
      };

      return updateMutation.mutateAsync({
        id: String(submission.id),
        changedFields: {
          remarks: JSON.stringify(updatedRemarks),
          islocked: false, // Unlock the submission for editing
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mainDBIT'] });
      toast.success('Edit request approved - submission is now editable');
    },
    onError: () => {
      toast.error('Failed to approve edit request');
    },
  });
}

// Hook to reject edit request (for IT approvers)
export function useRejectEditRequest() {
  const updateMutation = useUpdateMainDBIT();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      submission,
      approverEmail,
      rejectionReason,
    }: {
      submission: MainDBIT;
      approverEmail: string;
      rejectionReason: string;
    }) => {
      const existingRemarks = submission.remarks ? JSON.parse(submission.remarks) : {};
      const editRequest = existingRemarks.editRequest as EditRequest;
      
      if (!editRequest) {
        throw new Error('No edit request found');
      }

      const updatedEditRequest: EditRequest = {
        ...editRequest,
        status: 'REJECTED',
        reviewedBy: approverEmail,
        reviewedAt: new Date().toISOString(),
        reviewerComments: rejectionReason,
      };

      const updatedRemarks = {
        ...existingRemarks,
        editState: 'SUBMITTED' as EditRequestStatus, // Back to locked state
        editRequest: updatedEditRequest,
        editHistory: [
          ...(existingRemarks.editHistory || []),
          {
            action: 'EDIT_REJECTED',
            timestamp: new Date().toISOString(),
            actor: approverEmail,
            reason: rejectionReason,
          },
        ],
      };

      return updateMutation.mutateAsync({
        id: String(submission.id),
        changedFields: {
          remarks: JSON.stringify(updatedRemarks),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mainDBIT'] });
      toast.success('Edit request rejected');
    },
    onError: () => {
      toast.error('Failed to reject edit request');
    },
  });
}

// Hook to complete edit (save changes and re-lock)
export function useCompleteEdit() {
  const updateMutation = useUpdateMainDBIT();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      submission,
      editorEmail,
      fieldChanges,
    }: {
      submission: MainDBIT;
      editorEmail: string;
      fieldChanges?: FieldChange[];
    }) => {
      const existingRemarks = submission.remarks ? JSON.parse(submission.remarks) : {};
      const editRequest = existingRemarks.editRequest as EditRequest;

      const updatedEditRequest: EditRequest | null = editRequest ? {
        ...editRequest,
        editCompletedAt: new Date().toISOString(),
      } : null;

      const updatedRemarks = {
        ...existingRemarks,
        editState: 'EDIT_COMPLETED' as EditRequestStatus,
        editRequest: updatedEditRequest,
        editHistory: [
          ...(existingRemarks.editHistory || []),
          {
            action: 'EDIT_COMPLETED',
            timestamp: new Date().toISOString(),
            actor: editorEmail,
            fieldChanges,
          },
        ],
      };

      return updateMutation.mutateAsync({
        id: String(submission.id),
        changedFields: {
          remarks: JSON.stringify(updatedRemarks),
          islocked: true, // Re-lock the submission
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mainDBIT'] });
      toast.success('Changes saved and submission re-locked');
    },
    onError: () => {
      toast.error('Failed to save changes');
    },
  });
}

// Hook to get all submissions with pending edit requests (for approver dashboard)
export function useSubmissionsWithPendingEditRequests() {
  const { data: allSubmissions = [], isLoading, error } = useMainDBITList();

  const pendingEditRequests = allSubmissions.filter((submission: MainDBIT) => {
    const editRequest = getEditRequestFromRemarks(submission.remarks);
    return editRequest?.status === 'PENDING';
  });

  return {
    data: pendingEditRequests,
    isLoading,
    error,
  };
}


// Export EditRequestInfo type for components
export interface EditRequestInfo {
  submissionId: number;
  submissionTitle: string;
  formCode: string;
  requestorEmail: string;
  requestorName: string;
  editRequest: EditRequest | null;
  canRequestEdit: boolean;
  canApproveEdit: boolean;
  canEdit: boolean;
  isEditWindowExpired: boolean;
  editWindowHoursRemaining: number;
}

// Hook to get pending edit requests for approver dashboard
export function usePendingEditRequests() {
  const { data: allSubmissions = [], isLoading, error, refetch } = useMainDBITList();
  
  const pendingRequests: EditRequestInfo[] = allSubmissions
    .filter((submission: MainDBIT) => {
      const editRequest = getEditRequestFromRemarks(submission.remarks);
      return editRequest?.status === 'PENDING';
    })
    .map((submission: MainDBIT) => {
      const editRequest = getEditRequestFromRemarks(submission.remarks);
      return {
        submissionId: submission.id,
        submissionTitle: submission.title || `#${submission.id}`,
        formCode: submission.formcode || '',
        requestorEmail: submission.requestoremail || '',
        requestorName: editRequest?.requestedBy || 'Unknown',
        editRequest,
        canRequestEdit: false,
        canApproveEdit: true,
        canEdit: false,
        isEditWindowExpired: false,
        editWindowHoursRemaining: 0,
      };
    });
  
  return {
    pendingRequests,
    isLoading,
    error,
    refetch,
  };
}

// Alias for useReviewEditRequest (used in review modal)
export const useReviewEditRequest = useApproveEditRequest;

// Parse edit request (alias)
export const parseEditRequest = getEditRequestFromRemarks;