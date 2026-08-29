/**
 * Hook to get the assigned approver for a form
 * 
 * Checks the admin form registry for manual assigned approvers.
 * Falls back to workflow-based routing if no manual approver is set.
 */

import { useFormRegistry } from '@/hooks/use-admin-config';

export interface FormApprover {
  id?: string;
  name: string;
  email: string;
  isManualAssigned: boolean;
}

export function useFormApprover(formCode: string): {
  approver: FormApprover | null;
  isLoading: boolean;
  isManualAssign: boolean;
} {
  const { forms } = useFormRegistry();
  const isLoading = false; // Form registry uses Jotai atoms which are sync
  
  // Find the form in registry
  const registeredForm = forms.find((f) => f.formCode === formCode);
  
  if (!registeredForm) {
    return {
      approver: null,
      isLoading: false,
      isManualAssign: false,
    };
  }
  
  // Check if form has manual assigned approver
  if (!registeredForm.autoAssignApprover && registeredForm.manualAssignedApproverEmail) {
    return {
      approver: {
        id: registeredForm.manualAssignedApproverId,
        name: registeredForm.manualAssignedApproverName || 'Assigned Approver',
        email: registeredForm.manualAssignedApproverEmail,
        isManualAssigned: true,
      },
      isLoading: false,
      isManualAssign: true,
    };
  }
  
  // No manual approver, use workflow-based routing
  return {
    approver: null,
    isLoading: false,
    isManualAssign: false,
  };
}

/**
 * Get approver info for submission
 * Returns the approver to use - either from manual assignment or user selection
 */
export function getApproverForSubmission(
  formCode: string,
  registeredForms: Array<{
    formCode: string;
    autoAssignApprover: boolean;
    manualAssignedApproverId?: string;
    manualAssignedApproverEmail?: string;
    manualAssignedApproverName?: string;
  }>,
  selectedApprover?: {
    id?: string;
    name: string;
    email: string;
  }
): FormApprover | null {
  const registeredForm = registeredForms.find((f) => f.formCode === formCode);
  
  // If form has manual assigned approver in registry, use that
  if (registeredForm && !registeredForm.autoAssignApprover && registeredForm.manualAssignedApproverEmail) {
    return {
      id: registeredForm.manualAssignedApproverId,
      name: registeredForm.manualAssignedApproverName || 'Assigned Approver',
      email: registeredForm.manualAssignedApproverEmail,
      isManualAssigned: true,
    };
  }
  
  // Otherwise use the selected approver from the form
  if (selectedApprover) {
    return {
      id: selectedApprover.id,
      name: selectedApprover.name,
      email: selectedApprover.email,
      isManualAssigned: false,
    };
  }
  
  return null;
}