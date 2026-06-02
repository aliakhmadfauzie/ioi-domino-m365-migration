/**
 * useNIRWorkflow — NIR Notes ID Request State Machine Hook
 *
 * Maps Domino LNIDRequest.nsf workflow:
 *   Request → Submitted → ISGHODApproved → Done → Completed
 *              ├→ ISGHODRejected              └→ HODRejected (admin)
 *
 * Role fields (Domino Editor1-4):
 *   Editor1  = DocAuthor (requestor)     — active when CA="Request"
 *   Editor2  = ISGHOD group              — active when CA="Submitted"
 *   Editor3  = PIC group                 — active when CA="ISGHODApproved"
 *   Editor4  = HWG group                 — active when CA="Done"
 *   ISADMIN  — always retains access
 */

import { useCallback, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { MainDBITService } from '@/generated/services/main-dbit-service';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import type { NIRCurrentAction, NIRRole } from '@/types/m1-forms';
import { NIR_WORKFLOW_CONFIG } from '@/types/m1-forms';
import { useUser } from '@/hooks/use-user';
import { useRoleAccess } from '@/hooks/use-platform';

// =============================================================================
// TYPES
// =============================================================================

export interface NIRRecord extends MainDBIT {
  // Computed CA state (read from currentStatus map or custom field)
  caState: NIRCurrentAction;
  // ISG HOD fields
  isgHODStatus?: string;
  isgHODName?: string;
  isgHODDate?: string;
  isgHODComment?: string;
  // PIC / Notes Admin fields
  picName?: string;
  picDate?: string;
  picTask?: string;
  // HWG fields
  hwgName?: string;
  hwgDate?: string;
  hwgStatus?: string;
  hwgTask?: string;
  // Requestor
  requestorName?: string;
  dateSent?: string;
}

export interface NIRWorkflowAccess {
  role: NIRRole | null;
  canEditSection1: boolean;   // Requestor
  canEditSection2: boolean;   // ISG HOD
  canEditSection3: boolean;   // PIC
  canEditSection4: boolean;   // HWG
  canEditAdmin: boolean;      // ISADMIN
  userEmail: string;
  userName: string;
}

export interface NIRTransitionOptions {
  comment?: string;
  task?: string;
  additionalFields?: Record<string, string>;
}

// =============================================================================
// CA STATE HELPERS
// =============================================================================

/**
 * Map SharePoint currentStatus key to NIR CA state
 */
function mapStatusToCA(currentStatus?: string, remarksCA?: string): NIRCurrentAction {
  // If CA explicitly stored in remarks or a dedicated field, use it
  if (remarksCA && Object.keys(NIR_WORKFLOW_CONFIG).includes(remarksCA)) {
    return remarksCA as NIRCurrentAction;
  }

  // Fallback: map from SharePoint currentStatus keys
  const statusMap: Record<string, NIRCurrentAction> = {
    CurrentstatusKey3: 'Request',      // Draft
    CurrentstatusKey27: 'Request',     // Initial NIR
    CurrentstatusKey30: 'Submitted',   // Pending
    CurrentstatusKey38: 'ISGHODApproved', // In Progress
    CurrentstatusKey51: 'Done',        // Resolved
    CurrentstatusKey1: 'Completed',    // Accepted
  };

  if (currentStatus && statusMap[currentStatus]) {
    return statusMap[currentStatus];
  }

  return 'Request';
}

/**
 * Map NIR CA state to SharePoint currentStatus key
 */
function caToStatusKey(ca: NIRCurrentAction): string {
  const keyMap: Record<NIRCurrentAction, string> = {
    Request: 'CurrentstatusKey27',
    Submitted: 'CurrentstatusKey30',
    ISGHODApproved: 'CurrentstatusKey38',
    ISGHODRejected: 'CurrentstatusKey2',
    Done: 'CurrentstatusKey51',
    Completed: 'CurrentstatusKey1',
    HODRejected: 'CurrentstatusKey2',
    Closed: 'CurrentstatusKey1',
    RequestSubmitted: 'CurrentstatusKey30',
    HODPending: 'CurrentstatusKey27',
    NotesAdminPending: 'CurrentstatusKey38',
    HardwarePending: 'CurrentstatusKey51',
  };
  return keyMap[ca] || 'CurrentstatusKey27';
}

/**
 * Map NIR CA state to workflow stage number
 */
function caToStage(ca: NIRCurrentAction): number {
  return NIR_WORKFLOW_CONFIG[ca]?.stage ?? 1;
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Determine the current user's role for a given NIR record
 */
function determineRole(
  record: NIRRecord | null,
  userEmail: string,
  isAdmin: boolean
): NIRWorkflowAccess {
  const ca = record?.caState ?? 'Request';
  const config = NIR_WORKFLOW_CONFIG[ca];
  const isRequestor = record?.requestoremail?.toLowerCase() === userEmail;
  const isHOD = record?.nIRHODApprovedBy?.toLowerCase() === userEmail;
  const isPIC = record?.nIRNotesAdminBy?.toLowerCase() === userEmail;
  const isHWG = record?.nIRITHardwareBy?.toLowerCase() === userEmail;

  // If admin, they have all roles
  const isAdminRole = isAdmin;
  const canEditSection1 = isAdminRole || (config.editor1Editable && isRequestor);
  const canEditSection2 = isAdminRole || (config.editor2Editable && isHOD);
  const canEditSection3 = isAdminRole || (config.editor3Editable && isPIC);
  const canEditSection4 = isAdminRole || (config.editor4Editable && isHWG);

  let activeRole: NIRRole | null = 'ISADMIN';
  if (!isAdminRole) {
    if (canEditSection1) activeRole = 'Editor1';
    else if (canEditSection2) activeRole = 'Editor2';
    else if (canEditSection3) activeRole = 'Editor3';
    else if (canEditSection4) activeRole = 'Editor4';
    else activeRole = null;
  }

  return {
    role: activeRole,
    canEditSection1,
    canEditSection2,
    canEditSection3,
    canEditSection4,
    canEditAdmin: isAdminRole,
    userEmail,
    userName: '',
  };
}

/**
 * Build a NIRRecord from a MainDBIT record
 */
function buildNIRRecord(record: MainDBIT, remarksCA?: string): NIRRecord {
  return {
    ...record,
    caState: mapStatusToCA(record.currentStatus, remarksCA),
  } as NIRRecord;
}

/**
 * Main hook for NIR workflow access & transitions
 */
export function useNIRWorkflow(record: NIRRecord | null) {
  const { data: user } = useUser();
  const { role: platformRole } = useRoleAccess();
  const queryClient = useQueryClient();

  const userEmail = user?.userPrincipalName?.toLowerCase() || '';
  const isAdmin = platformRole === 'admin' || userEmail.includes('admin') || userEmail.includes('it');

  const access = useMemo(
    () => determineRole(record, userEmail, isAdmin),
    [record, userEmail, isAdmin]
  );

  const caState = record?.caState ?? 'Request';
  const config = NIR_WORKFLOW_CONFIG[caState];

  // Available transitions for current user
  const availableTransitions = useMemo(() => {
    if (!config) return [];
    return config.transitions.filter((t) => {
      if (t.actor === 'ISADMIN') return isAdmin;
      if (t.actor === 'Editor1') return access.canEditSection1;
      if (t.actor === 'Editor2') return access.canEditSection2;
      if (t.actor === 'Editor3') return access.canEditSection3;
      if (t.actor === 'Editor4') return access.canEditSection4;
      return false;
    });
  }, [config, access, isAdmin]);

  // Transition mutation
  const transition = useMutation({
    mutationFn: async ({
      toState,
      options = {},
    }: {
      toState: NIRCurrentAction;
      options?: NIRTransitionOptions;
    }) => {
      if (!record?.id) throw new Error('No NIR record loaded');

      const mainPatch: Partial<Omit<MainDBIT, 'id'>> = {
        currentStatus: caToStatusKey(toState),
        workflowstage: caToStage(toState),
      };

      // Map comment/task to correct SharePoint fields based on target state
      if (toState === 'Submitted') {
        mainPatch.submitteddate = new Date().toISOString();
      }
      if (toState === 'ISGHODApproved') {
        mainPatch.nIRHODApprovalStatus = 'Approved';
        mainPatch.nIRHODApprovedBy = userEmail;
        mainPatch.nIRHODApprovedDate = new Date().toISOString();
      }
      if (toState === 'ISGHODRejected') {
        mainPatch.nIRHODApprovalStatus = 'Rejected';
        mainPatch.nIRHODApprovedBy = userEmail;
        mainPatch.nIRHODApprovedDate = new Date().toISOString();
      }
      if (toState === 'Done') {
        mainPatch.nIRNotesAdminStatus = 'Done';
        mainPatch.nIRNotesAdminBy = userEmail;
        mainPatch.nIRNotesAdminDate = new Date().toISOString();
      }
      if (toState === 'Completed') {
        mainPatch.nIRITHardwareStatus = 'Completed';
        mainPatch.nIRITHardwareBy = userEmail;
      }
      if (toState === 'HODRejected') {
        mainPatch.nIRITHardwareStatus = 'Rejected';
      }

      // Store CA state in remarks JSON for round-trip preservation
      try {
        const existingRemarks = record.remarks ? JSON.parse(record.remarks) : {};
        existingRemarks.nirCA = toState;
        if (options.comment) existingRemarks.nirComment = options.comment;
        if (options.task) existingRemarks.nirTask = options.task;
        mainPatch.remarks = JSON.stringify(existingRemarks);
      } catch {
        mainPatch.remarks = JSON.stringify({ nirCA: toState });
      }

      await MainDBITService.update(String(record.id), mainPatch);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mainDBIT-list'] });
      queryClient.invalidateQueries({ queryKey: ['mainDBIT', String(record?.id)] });
    },
  });

  const sendToISG = useCallback(
    (options?: NIRTransitionOptions) =>
      transition.mutate({ toState: 'Submitted', options }),
    [transition]
  );

  const approveHOD = useCallback(
    (options?: NIRTransitionOptions) =>
      transition.mutate({ toState: 'ISGHODApproved', options }),
    [transition]
  );

  const rejectHOD = useCallback(
    (options?: NIRTransitionOptions) =>
      transition.mutate({ toState: 'ISGHODRejected', options }),
    [transition]
  );

  const markDone = useCallback(
    (options?: NIRTransitionOptions) =>
      transition.mutate({ toState: 'Done', options }),
    [transition]
  );

  const markCompleted = useCallback(
    (options?: NIRTransitionOptions) =>
      transition.mutate({ toState: 'Completed', options }),
    [transition]
  );

  const adminSetHODRejected = useCallback(
    (options?: NIRTransitionOptions) =>
      transition.mutate({ toState: 'HODRejected', options }),
    [transition]
  );

  return {
    record,
    caState,
    config,
    access,
    availableTransitions,
    transition,
    isPending: transition.isPending,
    actions: {
      sendToISG,
      approveHOD,
      rejectHOD,
      markDone,
      markCompleted,
      adminSetHODRejected,
    },
    // Helper to parse NIR record from MainDBIT
    buildNIRRecord,
  };
}

// =============================================================================
// NON-HOOK HELPERS
// =============================================================================

/**
 * Parse a NIR record from MainDBIT (for use outside React components)
 */
export function parseNIRRecord(record: MainDBIT): NIRRecord {
  let remarksCA: string | undefined;
  try {
    const remarks = record.remarks ? JSON.parse(record.remarks) : {};
    remarksCA = remarks.nirCA;
  } catch {
    // ignore
  }
  return buildNIRRecord(record, remarksCA);
}

/**
 * Get human-readable label for a NIR CA state
 */
export function getNIRStateLabel(ca: NIRCurrentAction): string {
  return NIR_WORKFLOW_CONFIG[ca]?.label ?? ca;
}

/**
 * Get badge color for a NIR CA state
 */
export function getNIRStateColor(ca: NIRCurrentAction): string {
  return NIR_WORKFLOW_CONFIG[ca]?.badgeColor ?? '#64748b';
}

// =============================================================================
// HWG ROUTING
// =============================================================================

/** HWG team identifier */
export type NIRHWGGroup = 'ISGHardware' | 'ISGHardware2';

/**
 * IOI Company → Site mapping for HWG routing
 * Matches the Domino computed field logic:
 *   Penang / ACM companies → ISGHardware
 *   Johor / PanCen companies → ISGHardware2
 */
const HWG_SITE_MAP: Record<string, { site: 'Penang' | 'Johor'; group: NIRHWGGroup }> = {
  'IOI Corporation Berhad': { site: 'Penang', group: 'ISGHardware' },
  'IOI Oleochemical Industries Berhad': { site: 'Penang', group: 'ISGHardware' },
  'IOI Acidchem Sdn Bhd': { site: 'Penang', group: 'ISGHardware' },
  'IOI Edible Oils Sdn Bhd': { site: 'Penang', group: 'ISGHardware' },
  'IOI Bio-Energy Sdn Bhd': { site: 'Penang', group: 'ISGHardware' },
  'IOI Pan-Century Oleochemicals Sdn Bhd': { site: 'Johor', group: 'ISGHardware2' },
  'IOI Pan-Century Edible Oils Sdn Bhd': { site: 'Johor', group: 'ISGHardware2' },
  'Pan-Century Surfactants Sdn Bhd': { site: 'Johor', group: 'ISGHardware2' },
  'Loders Croklaan Asia Pacific Sdn Bhd': { site: 'Johor', group: 'ISGHardware2' },
  'Bunge Loders Croklaan': { site: 'Johor', group: 'ISGHardware2' },
};

/**
 * Default fallback when company is not in the map
 */
const DEFAULT_HWG: NIRHWGGroup = 'ISGHardware';

/**
 * Compute the HWG routing group based on the requestor's company
 *
 * @param company The company name from the NIR record
 * @returns The HWG routing group (ISGHardware for Penang, ISGHardware2 for Johor/PanCen)
 */
export function computeHWGRouting(company?: string | null): {
  group: NIRHWGGroup;
  site: 'Penang' | 'Johor';
} {
  if (!company) {
    return { group: DEFAULT_HWG, site: 'Penang' };
  }

  const mapped = HWG_SITE_MAP[company];
  if (mapped) {
    return { group: mapped.group, site: mapped.site };
  }

  // Fallback: check for keywords in the company name
  const lower = company.toLowerCase();
  if (lower.includes('pancen') || lower.includes('johor') || lower.includes('croklaan') || lower.includes('bunge')) {
    return { group: 'ISGHardware2', site: 'Johor' };
  }

  return { group: DEFAULT_HWG, site: 'Penang' };
}

/**
 * Get the display label for an HWG group
 */
export function getHWGLabel(group: NIRHWGGroup): string {
  return group === 'ISGHardware' ? 'IT Hardware (Penang)' : 'IT Hardware 2 (Johor/PanCen)';
}
