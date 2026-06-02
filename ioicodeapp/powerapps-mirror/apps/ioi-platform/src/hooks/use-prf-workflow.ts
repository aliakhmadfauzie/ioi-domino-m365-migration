/**
 * usePRFWorkflow — PRF Program Request Form State Machine Hook
 *
 * Dual-track workflow (Domino PRF26.nsf):
 *   Non-SAP: Request → Submitted → Acceptance1 → Acceptance2 → Closed
 *   SAP:     Request → Submitted → Acceptance1 → Acceptance → Submitted_SAP → Acceptance3 → Completed-SAP → Closed
 *
 * All paths converge at Closed (Pending Requestor Acceptance) with
 * Accept / To be revised / KIV actions.
 *
 * Terminal states: Rejected (both tracks), Closed (after final acceptance)
 */

import { useCallback, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MainDBITService } from '@/generated/services/main-dbit-service';
import { MainDBITExtAccessService } from '@/generated/services/main-dbit-ext-access-service';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import type { MainDBITExtAccess } from '@/generated/models/main-dbit-ext-access-model';
import { useUser } from '@/hooks/use-user';
import { useRoleAccess } from '@/hooks/use-platform';
import { recordITApprovalAction } from '@/lib/it-approval-actions';
import {
  type PRFCurrentAction,
  PRF_WORKFLOW_CONFIG,
  prfStageNumber,
} from '@/types/m2-prf-types';

// =============================================================================
// TYPES
// =============================================================================

export interface PRFRecord extends MainDBIT {
  caState: PRFCurrentAction;
  isSAP: boolean;
}

export interface PRFAccess {
  isRequestor: boolean;
  isDeptHead: boolean;
  isITMgr2: boolean;
  isITStaff: boolean;
  isITMgr: boolean;
  isITDev: boolean;
  isITStaffFinal: boolean;
  isRequestorFinal: boolean;
  isAdmin: boolean;
  userEmail: string;
}

// =============================================================================
// CA STATE HELPERS
// =============================================================================

function mapStatusToCA(currentStatus?: string, remarksCA?: string): PRFCurrentAction {
  if (remarksCA && Object.keys(PRF_WORKFLOW_CONFIG).includes(remarksCA)) {
    return remarksCA as PRFCurrentAction;
  }
  const map: Record<string, PRFCurrentAction> = {
    CurrentstatusKey3: 'Request',
    CurrentstatusKey27: 'Request',
    CurrentstatusKey30: 'Submitted',
    CurrentstatusKey38: 'Acceptance1',
    CurrentstatusKey51: 'Closed',
    CurrentstatusKey1: 'Closed',
    CurrentstatusKey2: 'Rejected',
  };
  return (currentStatus && map[currentStatus]) || 'Request';
}

function caToStatusKey(ca: PRFCurrentAction): string {
  const map: Record<PRFCurrentAction, string> = {
    Request: 'CurrentstatusKey27',
    Submitted: 'CurrentstatusKey30',
    Acceptance1: 'CurrentstatusKey38',
    Acceptance: 'CurrentstatusKey38',
    Acceptance2: 'CurrentstatusKey38',
    Submitted_SAP: 'CurrentstatusKey38',
    Acceptance3: 'CurrentstatusKey38',
    'Completed-SAP': 'CurrentstatusKey51',
    Closed: 'CurrentstatusKey1',
    Rejected: 'CurrentstatusKey2',
  };
  return map[ca] || 'CurrentstatusKey27';
}

function parsePRFRecord(record: MainDBIT): PRFRecord {
  let remarksCA: string | undefined;
  try {
    const remarks = record.remarks ? JSON.parse(record.remarks) : {};
    remarksCA = remarks.prfCA;
  } catch { /* ignore */ }
  return {
    ...record,
    caState: mapStatusToCA(record.currentStatus, remarksCA),
    isSAP: record.pRFIsSAP === 'Yes',
  };
}

// =============================================================================
// HOOK
// =============================================================================

export function usePRFWorkflow(record: MainDBIT | null, extAccessRecordId?: string | null) {
  const { data: user } = useUser();
  const { role: platformRole } = useRoleAccess();
  const queryClient = useQueryClient();

  const userEmail = user?.userPrincipalName?.toLowerCase() || '';
  const isAdmin = platformRole === 'admin';

  const prf: PRFRecord | null = record ? parsePRFRecord(record) : null;
  const caState = prf?.caState ?? 'Request';
  const config = PRF_WORKFLOW_CONFIG[caState];
  const isSAP = prf?.isSAP ?? false;

  const access: PRFAccess = useMemo(() => ({
    isRequestor: isAdmin || record?.requestoremail?.toLowerCase() === userEmail,
    isDeptHead: isAdmin || record?.pRFDeptManagerEmail?.toLowerCase() === userEmail,
    isITMgr2: isAdmin,
    isITStaff: isAdmin,
    isITMgr: isAdmin,
    isITDev: isAdmin,
    isITStaffFinal: isAdmin,
    isRequestorFinal: isAdmin || record?.requestoremail?.toLowerCase() === userEmail,
    isAdmin,
    userEmail,
  }), [isAdmin, record, userEmail]);

  const canEditRequestor = isAdmin || (config?.requestorEditable && access.isRequestor);
  const canEditDeptHead = isAdmin || (config?.deptHeadEditable && access.isDeptHead);
  const canEditITMgr2 = isAdmin || (config?.itMgr2Editable && access.isITMgr2);
  const canEditITStaff = isAdmin || (config?.itStaffEditable && access.isITStaff);
  const canEditITMgr = isAdmin || (config?.itMgrEditable && access.isITMgr);
  const canEditITDev = isAdmin || (config?.itDevEditable && access.isITDev);
  const canEditITStaffFinal = isAdmin || (config?.itStaffFinalEditable && access.isITStaffFinal);
  const canEditRequestorFinal = isAdmin || (config?.requestorFinalEditable && access.isRequestorFinal);
  const canEditAdmin = isAdmin;

  const transition = useMutation({
    mutationFn: async ({
      toState,
      fields = {},
    }: {
      toState: PRFCurrentAction;
      fields?: Record<string, string | number | undefined>;
    }) => {
      if (!record?.id) throw new Error('No PRF record');

      const patch: Partial<Omit<MainDBIT, 'id'>> & Record<string, unknown> = {
        currentStatus: caToStatusKey(toState),
        workflowstage: prfStageNumber(toState),
      };
      const extPatch: Partial<Omit<MainDBITExtAccess, 'id'>> & Record<string, unknown> = {};

      // Apply Domino field mappings based on transition
      if (toState === 'Submitted') {
        patch.submitteddate = new Date().toISOString();
        patch.pRFDeptManagerEmail = fields.deptManagerEmail != null ? String(fields.deptManagerEmail) : '';
      }
      if (toState === 'Acceptance1') {
        patch.pRFDeptManagerEmail = userEmail;
        patch.pRFITApprovedDate = new Date().toISOString();
        extPatch.pRFStatus1 = 'Accepted';
        extPatch.pRFDeptHead = fields.deptHead != null ? String(fields.deptHead) : (userEmail || '');
        extPatch.pRFDateApp1 = new Date().toISOString();
        extPatch.pRFComments1 = fields.comment as string;
      }
      if (toState === 'Rejected') {
        extPatch.pRFStatus1 = 'Rejected';
        extPatch.pRFDeptHead = userEmail;
        extPatch.pRFDateApp1 = new Date().toISOString();
        extPatch.pRFComments1 = fields.comment as string;
      }
      if (toState === 'Acceptance2' || toState === 'Acceptance') {
        extPatch.pRFStatus2 = String(fields.status2 ?? '') || 'Accepted';
        extPatch.pRFAppByISG = userEmail;
        extPatch.pRFDateApp2 = new Date().toISOString();
        extPatch.pRFISG = String(fields.isg ?? '');
        patch.pRFITApprovedEmail = String(fields.isg ?? '');
      }
      if (toState === 'Submitted_SAP') {
        extPatch.pRFAttachedBy = userEmail;
        extPatch.pRFDateSent = new Date().toISOString();
      }
      if (toState === 'Submitted_SAP') {
        extPatch.pRFAttachedBy = userEmail;
        extPatch.pRFDateSent = new Date().toISOString();
      }
      if (toState === 'Acceptance3') {
        extPatch.pRFAppBySAP = userEmail;
        extPatch.pRFDateApp2_1 = new Date().toISOString();
        extPatch.pRFABAP = fields.abap as string;
        extPatch.pRFFuncOwnerSAP = fields.funcOwnerSAP as string;
      }
      if (toState === 'Closed' && caState !== 'Closed') {
        extPatch.pRFStatus3 = 'Completed';
        extPatch.pRFByISStaff = userEmail;
        extPatch.pRFDateApp3 = new Date().toISOString();
      }
      if (toState === 'Completed-SAP') {
        extPatch.pRFStatusISG = 'Completed';
        extPatch.pRFNotifiedBy = userEmail;
        extPatch.pRFDateISG = new Date().toISOString();
        extPatch.pRFCommentsISG = fields.comment as string;
      }
      // Final acceptance (Closed → Closed, requestor accepting)
      if (toState === 'Closed' && caState === 'Closed') {
        extPatch.pRFStatus4 = 'Accepted';
        extPatch.pRFRating = fields.rating as number;
        extPatch.pRFComment1 = fields.comment as string;
        extPatch.pRFDateApp4 = new Date().toISOString();
      }

      // Store CA in remarks on main record
      try {
        const existing = record.remarks ? JSON.parse(record.remarks) : {};
        existing.prfCA = toState;
        existing.prfFinalStatus = fields.finalStatus || config?.label || toState;
        patch.remarks = JSON.stringify(existing);
      } catch {
        patch.remarks = JSON.stringify({ prfCA: toState });
      }

      await recordITApprovalAction({
        id: String(record.id),
        record,
        user,
        nextStatus: caToStatusKey(toState),
        stageName: config?.label || toState,
        actionType: toState === 'Rejected'
          ? 'rejected'
          : toState === 'Submitted'
            ? 'submitted'
            : toState === 'Closed' || toState === 'Completed-SAP'
              ? 'completed'
              : 'approved',
        comment: fields.comment != null ? String(fields.comment) : '',
        workflowstage: prfStageNumber(toState),
        mainPatch: patch,
      });

      // Write PRF workflow fields to Ext_Access child record
      if (extAccessRecordId && Object.keys(extPatch).length > 0) {
        await MainDBITExtAccessService.update(extAccessRecordId, extPatch);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mainDBIT-list'] });
      queryClient.invalidateQueries({ queryKey: ['mainDBIT', String(record?.id)] });
      queryClient.invalidateQueries({ queryKey: ['mainDBITExtAccess-list'] });
    },
  });

  // ---- Action helpers ----
  const submit = useCallback(
    (opts?: { deptManagerEmail?: string }) => transition.mutate({ toState: 'Submitted', fields: opts }),
    [transition]
  );
  const approveDeptHead = useCallback(
    (opts?: { comment?: string; deptHead?: string }) => transition.mutate({ toState: 'Acceptance1', fields: opts }),
    [transition]
  );
  const rejectDeptHead = useCallback(
    (opts?: { comment?: string }) => transition.mutate({ toState: 'Rejected', fields: opts }),
    [transition]
  );
  const assignTasks = useCallback(
    (opts?: { status2?: string; isg?: string }) => transition.mutate({
      toState: isSAP ? 'Acceptance' : 'Acceptance2',
      fields: opts,
    }),
    [transition, isSAP]
  );
  const submitFunctionalSpec = useCallback(
    () => transition.mutate({ toState: 'Submitted_SAP' }),
    [transition]
  );
  const assignTasksII = useCallback(
    (opts?: { abap?: string; funcOwnerSAP?: string }) => transition.mutate({ toState: 'Acceptance3', fields: opts }),
    [transition]
  );
  const notifyRequestor = useCallback(
    () => transition.mutate({ toState: 'Closed' }),
    [transition]
  );
  const notifyRequestorSAP = useCallback(
    (opts?: { comment?: string }) => transition.mutate({ toState: 'Completed-SAP', fields: opts }),
    [transition]
  );
  const acceptClose = useCallback(
    (opts?: { rating?: number; comment?: string }) => transition.mutate({ toState: 'Closed', fields: opts }),
    [transition]
  );

  return {
    prf,
    caState,
    config,
    access,
    isSAP,
    canEditRequestor,
    canEditDeptHead,
    canEditITMgr2,
    canEditITStaff,
    canEditITMgr,
    canEditITDev,
    canEditITStaffFinal,
    canEditRequestorFinal,
    canEditAdmin,
    isPending: transition.isPending,
    actions: {
      submit,
      approveDeptHead,
      rejectDeptHead,
      assignTasks,
      submitFunctionalSpec,
      assignTasksII,
      notifyRequestor,
      notifyRequestorSAP,
      acceptClose,
    },
  };
}
