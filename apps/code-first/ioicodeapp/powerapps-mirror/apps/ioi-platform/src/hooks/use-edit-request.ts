import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUpdateMainDBIT, useMainDBITList } from '@/generated/hooks/use-main-dbit';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import { toast } from 'sonner';

// Edit request states are stored in MainDB_IT workflow columns.
// Legacy records with remarks JSON are still parsed by the helpers below.
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
      const editRequest: EditRequest = {
        id: `ER-${Date.now()}`,
        submissionId: String(submission.id),
        requestedBy,
        requestedAt: new Date().toISOString(),
        editReason,
        fieldsRequested,
        status: 'PENDING',
      };

      return updateMutation.mutateAsync({
        id: String(submission.id),
        changedFields: {
          currentAction: 'EDIT_REQUEST_RAISED',
          hODApproverRemarks: [
            `Edit Request: ${editRequest.id}`,
            `Requested By: ${requestedBy}`,
            `Requested At: ${editRequest.requestedAt}`,
            `Reason: ${editReason}`,
            fieldsRequested?.length ? `Fields: ${fieldsRequested.join(', ')}` : '',
          ].filter(Boolean).join('\n'),
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
      const editRequest = getEditRequestFromRemarks(submission.remarks) || {
        id: `ER-${submission.id}`,
        submissionId: String(submission.id),
        requestedBy: submission.requestoremail || '',
        requestedAt: submission.submitteddate || new Date().toISOString(),
        editReason: submission.hODApproverRemarks || 'Edit requested',
        status: 'PENDING',
      } as EditRequest;
      
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

      return updateMutation.mutateAsync({
        id: String(submission.id),
        changedFields: {
          currentAction: 'EDIT_UNLOCKED',
          hODApproverRemarks: [
            submission.hODApproverRemarks,
            `Edit Approved: ${updatedEditRequest.reviewedAt}`,
            `Approved By: ${approverEmail}`,
            approverComments ? `Comments: ${approverComments}` : '',
            `Edit Window Expires: ${editWindowExpires.toISOString()}`,
          ].filter(Boolean).join('\n'),
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
      const editRequest = getEditRequestFromRemarks(submission.remarks) || {
        id: `ER-${submission.id}`,
        submissionId: String(submission.id),
        requestedBy: submission.requestoremail || '',
        requestedAt: submission.submitteddate || new Date().toISOString(),
        editReason: submission.hODApproverRemarks || 'Edit requested',
        status: 'PENDING',
      } as EditRequest;
      
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

      return updateMutation.mutateAsync({
        id: String(submission.id),
        changedFields: {
          currentAction: 'SUBMITTED',
          hODApproverRemarks: [
            submission.hODApproverRemarks,
            `Edit Rejected: ${updatedEditRequest.reviewedAt}`,
            `Rejected By: ${approverEmail}`,
            `Reason: ${rejectionReason}`,
          ].filter(Boolean).join('\n'),
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
      return updateMutation.mutateAsync({
        id: String(submission.id),
        changedFields: {
          currentAction: 'EDIT_COMPLETED',
          hODApproverRemarks: [
            submission.hODApproverRemarks,
            `Edit Completed: ${new Date().toISOString()}`,
            `Edited By: ${editorEmail}`,
            fieldChanges?.length ? `Fields Changed: ${fieldChanges.map((field) => field.fieldName).join(', ')}` : '',
          ].filter(Boolean).join('\n'),
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
    return editRequest?.status === 'PENDING' || submission.currentAction === 'EDIT_REQUEST_RAISED';
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
