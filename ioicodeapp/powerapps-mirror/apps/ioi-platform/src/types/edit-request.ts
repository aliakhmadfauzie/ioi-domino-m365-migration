/**
 * Edit Request Types
 * Supports post-submission edit workflow with IT approver gate
 */

export type EditRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export interface EditRequest {
  id: string;
  submissionId: string;
  requestedBy: string;
  requestedByName: string;
  requestedAt: string;
  editReason: string;
  fieldsRequested?: string[];
  status: EditRequestStatus;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  reviewerComments?: string;
  editWindowExpires?: string;
  editCompletedAt?: string;
  fieldChanges?: FieldChange[];
}

export interface FieldChange {
  fieldName: string;
  previousValue: unknown;
  newValue: unknown;
  changedAt: string;
}

export const EditRequestStatusLabels: Record<EditRequestStatus, string> = {
  PENDING: 'Pending Review',
  APPROVED: 'Edit Approved',
  REJECTED: 'Edit Rejected',
  EXPIRED: 'Edit Window Expired',
};

export const EditRequestStatusColors: Record<EditRequestStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  APPROVED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  EXPIRED: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

// Edit state stored in submission remarks JSON
export interface EditState {
  editRequest?: EditRequest;
  isUnlocked?: boolean;
  unlockedAt?: string;
  unlockedBy?: string;
}

// Extract edit state from remarks
export function getEditStateFromRemarks(remarks: string | undefined | null): EditState {
  if (!remarks) return {};
  try {
    const parsed = JSON.parse(remarks);
    return {
      editRequest: parsed.editRequest,
      isUnlocked: parsed.isUnlocked,
      unlockedAt: parsed.unlockedAt,
      unlockedBy: parsed.unlockedBy,
    };
  } catch {
    return {};
  }
}

// Update remarks with edit state
export function updateRemarksWithEditState(
  existingRemarks: string | undefined | null,
  editState: Partial<EditState>
): string {
  let existing: Record<string, unknown> = {};
  if (existingRemarks) {
    try {
      existing = JSON.parse(existingRemarks);
    } catch {
      existing = {};
    }
  }
  return JSON.stringify({ ...existing, ...editState });
}