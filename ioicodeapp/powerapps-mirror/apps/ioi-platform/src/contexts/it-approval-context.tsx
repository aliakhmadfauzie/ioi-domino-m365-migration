/**
 * IT Approval Context
 *
 * Centralized state management for the IT Department approval workflow.
 * Handles:
 * - Fetching pending approvals for the current user (using SharePoint role assignments)
 * - Approval/rejection actions with real email notifications
 * - Real-time status updates via SharePoint
 *
 * PRODUCTION: Uses ConfigGlobalUserRoleAssignments SharePoint list for role-based access.
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useUser } from '@/hooks/use-user';
import { useFormRegistry } from '@/hooks/use-admin-config';
import { useDynamicRoleAccess } from '@/hooks/use-dynamic-role-access';
import { useMainDBITList, useUpdateMainDBIT } from '@/generated/hooks/use-main-dbit';
import { useSendEmail } from '@/hooks/use-send-email';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import { toast } from 'sonner';

// Types
export interface ApprovalRequest {
  id: number;
  ticketId: string;
  formCode: string;
  formTitle: string;
  title: string;
  requestorName: string;
  requestorEmail: string;
  submittedDate: Date;
  currentStatus: string;
  currentStage: string;
  assignedApproverEmail?: string;
  assignedApproverName?: string;
  department: string;
  justification?: string;
  details: Record<string, string>;
  rawData: MainDBIT;
}

export interface ApprovalAction {
  type: 'approve' | 'reject' | 'return' | 'escalate';
  comments?: string;
}

interface ITApprovalContextType {
  // Data
  pendingApprovals: ApprovalRequest[];
  mySubmissions: ApprovalRequest[];
  isLoading: boolean;
  error: string | null;

  // Actions
  approveRequest: (requestId: number, comments?: string) => Promise<void>;
  rejectRequest: (requestId: number, comments: string) => Promise<void>;
  returnRequest: (requestId: number, comments: string) => Promise<void>;
  refreshData: () => void;

  // Helpers
  getRequestById: (requestId: number) => ApprovalRequest | undefined;
  isApprover: (requestId: number) => boolean;
}

const ITApprovalContext = createContext<ITApprovalContextType | null>(null);

// Form code to title mapping
const FORM_TITLES: Record<string, string> = {
  EAF: 'External Access Form (VPN/Citrix)',
  NIR: 'Notes ID Request',
  RS: 'Reset Password / Unlock ID',
  SFAR: 'Share Folder Access Requisition',
  UR: 'User ID Requisition Form',
  ITSSR: 'IT Support & Service Request',
  PRF: 'Program Request Form',
  ITDR: 'IT Daily Report',
  IAL5: 'Data Restoration Request',
  HI: 'Hardware Inventory Form',
};

// Status key to label — use generated model mapping for completeness
import { MainDBITCurrentstatusKeyToLabel } from '@/generated/models/main-dbit-model';

const STATUS_LABELS: Record<string, string> = MainDBITCurrentstatusKeyToLabel;

export function ITApprovalProvider({ children }: { children: ReactNode }) {
  const { data: user } = useUser();
  const { forms: registeredForms } = useFormRegistry();
  const { data: submissions = [], isLoading, refetch } = useMainDBITList({
    orderBy: ['submitteddate desc'],
  });
  const updateMainDBIT = useUpdateMainDBIT();
  const sendEmail = useSendEmail();

  const [error, setError] = useState<string | null>(null);

  // Parse submission data into ApprovalRequest format
  const parseSubmission = useCallback((submission: MainDBIT): ApprovalRequest => {
    let parsedRemarks: Record<string, unknown> = {};
    try {
      if (submission.remarks) {
        parsedRemarks = JSON.parse(submission.remarks);
      }
    } catch {
      // Invalid JSON, use empty object
    }

    return {
      id: submission.id,
      ticketId: submission.title || '',
      formCode: submission.formcode || '',
      formTitle: FORM_TITLES[submission.formcode || ''] || submission.formcode || 'Unknown Form',
      title: submission.title || 'Untitled Request',
      requestorName: (parsedRemarks.requestor as string) || 'Unknown',
      requestorEmail: submission.requestoremail || '',
      submittedDate: new Date(submission.submitteddate || Date.now()),
      currentStatus: STATUS_LABELS[submission.currentStatus || ''] || 'Unknown',
      currentStage: (parsedRemarks.currentAction as string) || 'Submitted',
      assignedApproverEmail: (parsedRemarks.approverEmail as string) || (parsedRemarks.departmentHeadEmail as string),
      assignedApproverName: (parsedRemarks.approverName as string) || (parsedRemarks.departmentHead as string),
      department: 'IT',
      justification: (parsedRemarks.justification as string) || '',
      details: {
        company: (parsedRemarks.company as string) || '',
        targetUser: (parsedRemarks.targetUser as string) || '',
        application: (parsedRemarks.application as string) || '',
        systemName: (parsedRemarks.systemName as string) || '',
        requestType: (parsedRemarks.requestType as string) || '',
        priority: (parsedRemarks.priority as string) || 'Normal',
      },
      rawData: submission,
    };
  }, []);

  // Get pending approvals for current user
  // PRODUCTION: Uses SharePoint role assignments via useDynamicRoleAccess
  const { canApprove: userCanApprove, hasGlobalApprovalAccess, approverDepartments, approverModules } = useDynamicRoleAccess({ moduleScope: 'IT' });

  const pendingApprovals = submissions
    .filter((s: MainDBIT) => {
      // Check if pending approval status
      const isPending = s.currentStatus === 'Submitted' || s.currentStatus === 'Pending Approval';
      if (!isPending) return false;

      const userEmail = user?.userPrincipalName?.toLowerCase() || '';

      // PRODUCTION: Check dynamic role-based access from SharePoint
      // If user has approval permissions (via SharePoint roles), show pending items
      if (userCanApprove) {
        // If global access, show all pending items
        if (hasGlobalApprovalAccess) {
          return true;
        }

        // If module-scoped, check if IT is in their allowed modules
        if (approverModules.length === 0 || approverModules.includes('IT')) {
          return true;
        }
      }

      // Fallback: Check if current user is the explicitly assigned approver for this submission
      let parsedRemarks: Record<string, unknown> = {};
      try {
        if (s.remarks) parsedRemarks = JSON.parse(s.remarks);
      } catch {
        // Invalid JSON
      }

      const approverEmail = (parsedRemarks.approverEmail as string) ||
                           (parsedRemarks.departmentHeadEmail as string) || '';

      // Also check if the form has a manual assigned approver in form registry
      const registeredForm = registeredForms.find((f) => f.formCode === s.formcode);
      const manualApproverEmail = registeredForm?.manualAssignedApproverEmail;

      // User is approver if their email matches either the request's approver or the form's manual approver
      return approverEmail.toLowerCase() === userEmail ||
             (manualApproverEmail && manualApproverEmail.toLowerCase() === userEmail);
    })
    .map(parseSubmission);

  // Get submissions by current user
  const mySubmissions = submissions
    .filter((s: MainDBIT) => {
      const userEmail = user?.userPrincipalName?.toLowerCase() || '';
      return s.requestoremail?.toLowerCase() === userEmail;
    })
    .map(parseSubmission);

  // Approve request
  const approveRequest = async (requestId: number, comments?: string) => {
    const request = submissions.find((s: MainDBIT) => s.id === requestId);
    if (!request) {
      toast.error('Request not found');
      return;
    }

    try {
      // Parse existing remarks
      let parsedRemarks: Record<string, unknown> = {};
      try {
        if (request.remarks) parsedRemarks = JSON.parse(request.remarks);
      } catch {
        // Invalid JSON
      }

      // Update remarks with approval info
      const updatedRemarks = {
        ...parsedRemarks,
        approvedBy: user?.fullName,
        approvedByEmail: user?.userPrincipalName,
        approvedAt: new Date().toISOString(),
        approvalComments: comments,
        currentAction: 'IT_PROCESSING', // Move to next stage
        workflowStage: 4,
      };

      // Update the record
      await updateMainDBIT.mutateAsync({
        id: String(requestId),
        changedFields: {
          currentStatus: 'Approved',
          remarks: JSON.stringify(updatedRemarks),
        },
      });

      // Send email notification to requestor
      if (request.requestoremail) {
        try {
          await sendEmail.mutateAsync({
            to: request.requestoremail,
            subject: `[APPROVED] ${request.formcode} Request - ${request.title}`,
            body: buildApprovalNotificationEmail({
              ticketId: request.title || '',
              formType: request.formcode || '',
              requestorName: (parsedRemarks.requestor as string) || 'User',
              approverName: user?.fullName || 'Approver',
              status: 'Approved',
              comments,
            }),
            importance: 'Normal',
          });
        } catch (emailErr) {
          console.error('Failed to send approval notification:', emailErr);
        }
      }

      toast.success('Request approved successfully!');
      refetch();
    } catch (err) {
      console.error('Failed to approve request:', err);
      toast.error('Failed to approve request. Please try again.');
    }
  };

  // Reject request
  const rejectRequest = async (requestId: number, comments: string) => {
    if (!comments.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    const request = submissions.find((s: MainDBIT) => s.id === requestId);
    if (!request) {
      toast.error('Request not found');
      return;
    }

    try {
      let parsedRemarks: Record<string, unknown> = {};
      try {
        if (request.remarks) parsedRemarks = JSON.parse(request.remarks);
      } catch {
        // Invalid JSON
      }

      const updatedRemarks = {
        ...parsedRemarks,
        rejectedBy: user?.fullName,
        rejectedByEmail: user?.userPrincipalName,
        rejectedAt: new Date().toISOString(),
        rejectionReason: comments,
        currentAction: 'REJECTED',
      };

      await updateMainDBIT.mutateAsync({
        id: String(requestId),
        changedFields: {
          currentStatus: 'Rejected',
          remarks: JSON.stringify(updatedRemarks),
        },
      });

      // Send rejection notification
      if (request.requestoremail) {
        try {
          await sendEmail.mutateAsync({
            to: request.requestoremail,
            subject: `[REJECTED] ${request.formcode} Request - ${request.title}`,
            body: buildApprovalNotificationEmail({
              ticketId: request.title || '',
              formType: request.formcode || '',
              requestorName: (parsedRemarks.requestor as string) || 'User',
              approverName: user?.fullName || 'Approver',
              status: 'Rejected',
              comments,
            }),
            importance: 'High',
          });
        } catch (emailErr) {
          console.error('Failed to send rejection notification:', emailErr);
        }
      }

      toast.success('Request rejected');
      refetch();
    } catch (err) {
      console.error('Failed to reject request:', err);
      toast.error('Failed to reject request. Please try again.');
    }
  };

  // Return request for more info
  const returnRequest = async (requestId: number, comments: string) => {
    if (!comments.trim()) {
      toast.error('Please provide feedback for the requestor');
      return;
    }

    const request = submissions.find((s: MainDBIT) => s.id === requestId);
    if (!request) {
      toast.error('Request not found');
      return;
    }

    try {
      let parsedRemarks: Record<string, unknown> = {};
      try {
        if (request.remarks) parsedRemarks = JSON.parse(request.remarks);
      } catch {
        // Invalid JSON
      }

      const updatedRemarks = {
        ...parsedRemarks,
        returnedBy: user?.fullName,
        returnedByEmail: user?.userPrincipalName,
        returnedAt: new Date().toISOString(),
        returnComments: comments,
        currentAction: 'RETURNED',
      };

      await updateMainDBIT.mutateAsync({
        id: String(requestId),
        changedFields: {
          currentStatus: 'Returned',
          remarks: JSON.stringify(updatedRemarks),
        },
      });

      // Send return notification
      if (request.requestoremail) {
        try {
          await sendEmail.mutateAsync({
            to: request.requestoremail,
            subject: `[ACTION REQUIRED] ${request.formcode} Request - ${request.title}`,
            body: buildApprovalNotificationEmail({
              ticketId: request.title || '',
              formType: request.formcode || '',
              requestorName: (parsedRemarks.requestor as string) || 'User',
              approverName: user?.fullName || 'Approver',
              status: 'Returned',
              comments,
            }),
            importance: 'High',
          });
        } catch (emailErr) {
          console.error('Failed to send return notification:', emailErr);
        }
      }

      toast.success('Request returned to requestor');
      refetch();
    } catch (err) {
      console.error('Failed to return request:', err);
      toast.error('Failed to return request. Please try again.');
    }
  };

  // Get request by ID
  const getRequestById = (requestId: number) => {
    const submission = submissions.find((s: MainDBIT) => s.id === requestId);
    return submission ? parseSubmission(submission) : undefined;
  };

  // Check if current user is approver for a request
  const isApprover = (requestId: number) => {
    return pendingApprovals.some((r: ApprovalRequest) => r.id === requestId);
  };

  const value: ITApprovalContextType = {
    pendingApprovals,
    mySubmissions,
    isLoading,
    error,
    approveRequest,
    rejectRequest,
    returnRequest,
    refreshData: refetch,
    getRequestById,
    isApprover,
  };

  return (
    <ITApprovalContext.Provider value={value}>
      {children}
    </ITApprovalContext.Provider>
  );
}

export function useITApproval() {
  const context = useContext(ITApprovalContext);
  if (!context) {
    throw new Error('useITApproval must be used within an ITApprovalProvider');
  }
  return context;
}

// Helper to build notification email
function buildApprovalNotificationEmail(params: {
  ticketId: string;
  formType: string;
  requestorName: string;
  approverName: string;
  status: 'Approved' | 'Rejected' | 'Returned';
  comments?: string;
}): string {
  const statusColors = {
    Approved: { bg: '#E8F5E9', border: '#166534', text: '#166534' },
    Rejected: { bg: '#FFEBEE', border: '#B71C1C', text: '#B71C1C' },
    Returned: { bg: '#FFF3E0', border: '#E65100', text: '#E65100' },
  };

  const colors = statusColors[params.status];
  const commentsSection = params.comments
    ? `<div style="background-color: #FAFAFA; padding: 16px; border-radius: 8px; margin-top: 16px;">
         <p style="margin: 0 0 8px 0; font-weight: 600; color: #1C1C1C;">Comments:</p>
         <p style="margin: 0; color: #5C5C5C;">${params.comments}</p>
       </div>`
    : '';

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #F5F5F5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.1);">
              <tr>
                <td style="background-color: ${colors.border}; padding: 24px 32px; border-radius: 12px 12px 0 0;">
                  <h1 style="margin: 0; color: #FFFFFF; font-size: 20px;">Request ${params.status}</h1>
                  <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">IOI Portal - ${params.formType}</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 32px;">
                  <p style="margin: 0 0 16px 0; color: #1C1C1C; font-size: 15px;">Dear ${params.requestorName},</p>
                  <p style="margin: 0 0 24px 0; color: #1C1C1C; font-size: 15px;">Your request has been <strong>${params.status.toLowerCase()}</strong> by ${params.approverName}.</p>

                  <div style="background-color: ${colors.bg}; border: 1px solid ${colors.border}; border-radius: 8px; padding: 16px; text-align: center;">
                    <p style="margin: 0 0 4px 0; color: #5C5C5C; font-size: 12px; text-transform: uppercase;">Reference Number</p>
                    <p style="margin: 0; color: ${colors.text}; font-size: 20px; font-weight: 700;">${params.ticketId}</p>
                  </div>

                  ${commentsSection}
                </td>
              </tr>
              <tr>
                <td style="padding: 24px 32px; background-color: #FAFAFA; border-radius: 0 0 12px 12px; border-top: 1px solid #E0E0E0;">
                  <p style="margin: 0; color: #5C5C5C; font-size: 12px;">This is an automated notification from the IOI Portal.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
