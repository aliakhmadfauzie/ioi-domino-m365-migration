/**
 * HR Submission Service — SharePoint-Connected
 *
 * Replaced the in-memory mock implementation with real MainDBHRService calls.
 * All methods maintain the same public signature for backward compatibility.
 *
 * Target List: MainDB_HR
 * Department Code: D05
 *
 * @see MainDBHRService — src/services/main-dbhr-service.ts
 * @see ApprovalHistoryHRService (generated) — src/generated/services/approval-history-hr-service.ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ensureInitialized } from '@/lib/app-init';
import {
  MainDBHRService,
  type MainDBHR,
  type MainDBHRStatusKey,
  type MainDBHRSiteKey,
} from '@/services/main-dbhr-service';
import { ApprovalHistoryHRService } from '@/generated/services/approval-history-hr-service';
import type {
  HRFormCode,
  HRSite,
  HRCurrentStatus,
  MainDBHRBase,
  CRApprovalRecord,
  ApprovalAction,
} from '@/types/hr-forms';
import { generateHRFormINO, generateHRFormTitle, getHRFormWorkflowStages } from '@/types/hr-forms';

// =============================================================================
// TYPE HELPERS
// =============================================================================

/** Map UI status labels to SharePoint status key values */
const STATUS_LABEL_TO_KEY: Record<string, MainDBHRStatusKey> = {
  'Draft': 'StatusKey0',
  'Submitted': 'StatusKey1',
  'Under Review': 'StatusKey2',
  'Approved': 'StatusKey3',
  'Rejected': 'StatusKey4',
  'Closed': 'StatusKey5',
  'Archived': 'StatusKey6',
};

const SITE_LABEL_TO_KEY: Record<string, MainDBHRSiteKey> = {
  'PRAI': 'SiteKey0',
  'JOHOR': 'SiteKey1',
};

/** Map HR current status to a status key for SP writes */
function toStatusKey(status: HRCurrentStatus): MainDBHRStatusKey {
  return STATUS_LABEL_TO_KEY[status] || 'StatusKey0';
}

/** Map site label to SP site key */
function toSiteKey(site: HRSite): MainDBHRSiteKey {
  return SITE_LABEL_TO_KEY[site] || 'SiteKey0';
}

/** Adapt a SharePoint MainDBHR record back to the HRSubmission shape */
function mapToHRSubmission(sp: MainDBHR): HRSubmission {
  return {
    Id: sp.id,
    GUID: String(sp.id),
    Created: sp.submittedon || '',
    Modified: sp.submittedon || '',
    FormType: sp.formcode as HRFormCode,
    Title: sp.title,
    INO: String(sp.documentno || sp.title),
    CurrentStatus: (sp.statusKey ? getStatusLabel(sp.statusKey) : 'Draft') as HRCurrentStatus,
    EnvironmentTag: 'PROD',
    Division: sp.division || '',
    SubmittedDate: sp.submittedon || '',
    Comments: sp.description,
    CurrentStage: sp.currentstage || 'Submission',
    CurrentStageNumber: Number(sp.statusKey?.replace('StatusKey', '')) || 1,
    FormData: sp.details,
  };
}

function getStatusLabel(statusKey: MainDBHRStatusKey): string {
  const labels: Record<string, string> = {
    'StatusKey0': 'Draft',
    'StatusKey1': 'Submitted',
    'StatusKey2': 'Under Review',
    'StatusKey3': 'Approved',
    'StatusKey4': 'Rejected',
    'StatusKey5': 'Closed',
    'StatusKey6': 'Archived',
  };
  return labels[statusKey] || 'Draft';
}

// =============================================================================
// HR SUBMISSION TYPES
// =============================================================================

export interface HRSubmission extends MainDBHRBase {
  Id: number;
  GUID: string;
  Created: string;
  Modified: string;
  FormData?: string;
  CurrentStage: string;
  CurrentStageNumber: number;
  CompletedDate?: string;
}

export interface CreateHRSubmissionInput {
  FormType: HRFormCode;
  Division: string;
  DepartmentRole?: string;
  Comments?: string;
  EnvironmentTag?: string;
  FormData?: Record<string, unknown>;
}

export interface UpdateHRSubmissionInput {
  CurrentStatus?: HRCurrentStatus;
  CurrentStage?: string;
  CurrentStageNumber?: number;
  Comments?: string;
  FormData?: Record<string, unknown>;
}

export interface HRApprovalActionInput {
  Action: ApprovalAction;
  ActionBy: { Id: number; Title: string; Email: string };
  Comments?: string;
  NextStage?: string;
}

// =============================================================================
// HR SUBMISSION SERVICE — SharePoint Connected
// =============================================================================

export class HRSubmissionService {
  /**
   * Create a new HR submission in MainDB_HR
   */
  static async create(input: CreateHRSubmissionInput): Promise<HRSubmission> {
    await ensureInitialized();
    const ino = generateHRFormINO(input.FormType, 'PRAI');
    const title = generateHRFormTitle(input.FormType, ino);
    const stages = getHRFormWorkflowStages(input.FormType);
    const initialStage = stages[0];

    const spRecord: Omit<MainDBHR, 'id'> = {
      title,
      formcode: input.FormType,
      statusKey: 'StatusKey1' as MainDBHRStatusKey, // Submitted
      siteKey: 'SiteKey0' as MainDBHRSiteKey,        // Prai
      division: input.Division,
      description: input.Comments,
      submittedon: new Date().toISOString(),
    } as any;

    const created = await MainDBHRService.create(spRecord as any);

    // Create initial approval history record
    try {
      await ApprovalHistoryHRService.create({
        title: initialStage?.name || 'Submission',
        parentid: created.id,
        appname: input.FormType,
        actioncode: 'Submitted',
        actionon: new Date().toISOString(),
        actioncomment: 'Initial submission',
      } as any);
    } catch (err) {
      console.warn('[HRSubmissionService] Failed to create approval history record:', err);
    }

    console.log(`[HRSubmissionService] Created HR submission: ${title} (SP ID: ${created.id})`);
    return mapToHRSubmission(created);
  }

  /**
   * Update an HR submission
   */
  static async update(guid: string, input: UpdateHRSubmissionInput): Promise<HRSubmission> {
    await ensureInitialized();
    const changes: Partial<Omit<MainDBHR, 'id'>> = {};
    if (input.CurrentStatus) changes.statusKey = toStatusKey(input.CurrentStatus);
    if (input.CurrentStage) changes.currentstage = input.CurrentStage;
    if (input.Comments) changes.description = input.Comments;
    if (input.FormData) changes.details = JSON.stringify(input.FormData);

    const updated = await MainDBHRService.update(guid, changes as unknown as Partial<Omit<MainDBHR, 'id'>>);
    return mapToHRSubmission(updated);
  }

  /**
   * Process approval action
   */
  static async processApproval(
    guid: string,
    action: HRApprovalActionInput
  ): Promise<HRSubmission> {
    await ensureInitialized();
    const existing = await MainDBHRService.get(guid);
    const stages = getHRFormWorkflowStages(existing.formcode as HRFormCode);
    const currentStageIndex = stages.findIndex(
      (s) => s.order === Number(existing.statusKey?.replace('StatusKey', ''))
    );

    let newStatus: HRCurrentStatus = 'Submitted';
    let newStage = existing.currentstage || 'Submission';
    let newStageNumber = currentStageIndex >= 0 ? currentStageIndex + 1 : 1;

    switch (action.Action) {
      case 'Approved':
        if (currentStageIndex < stages.length - 1 && currentStageIndex >= 0) {
          const nextStage = stages[currentStageIndex + 1];
          newStage = nextStage.name;
          newStageNumber = nextStage.order;
          newStatus = 'Submitted';
        } else {
          newStatus = 'Closed';
        }
        break;
      case 'Rejected':
        newStatus = 'Rejected';
        break;
      case 'Returned':
        newStatus = 'Returned';
        if (currentStageIndex > 0) {
          const prevStage = stages[currentStageIndex - 1];
          newStage = prevStage.name;
          newStageNumber = prevStage.order;
        }
        break;
      case 'Completed':
        newStatus = 'Closed';
        break;
    }

    const updated = await MainDBHRService.update(guid, {
      statusKey: toStatusKey(newStatus),
      currentstage: newStage,
      description: action.Comments,
    } as any);

    // Create approval history record
    try {
      await ApprovalHistoryHRService.create({
        title: newStage,
        parentid: Number(guid),
        appname: existing.formcode,
        actioncode: action.Action,
        actionbyemail: action.ActionBy.Email,
        actionbyname: action.ActionBy.Title,
        actionon: new Date().toISOString(),
        actioncomment: action.Comments,
      } as any);
    } catch (err) {
      console.warn('[HRSubmissionService] Failed to create approval history record:', err);
    }

    return mapToHRSubmission(updated);
  }

  /**
   * Get a single submission by ID
   */
  static async get(guid: string): Promise<HRSubmission | null> {
    try {
      await ensureInitialized();
      const record = await MainDBHRService.get(guid);
      return mapToHRSubmission(record);
    } catch {
      return null;
    }
  }

  /**
   * Get all HR submissions with optional filtering
   */
  static async getAll(options?: {
    formCode?: HRFormCode;
    formCodes?: HRFormCode[];
    status?: HRCurrentStatus;
    division?: string;
    limit?: number;
  }): Promise<HRSubmission[]> {
    await ensureInitialized();
    const filterParts: string[] = [];
    if (options?.formCode) filterParts.push(`formcode eq '${options.formCode}'`);
    if (options?.status) {
      const statusKey = toStatusKey(options.status);
      filterParts.push(`statusKey eq '${statusKey}'`);
    }
    if (options?.division) filterParts.push(`division eq '${options.division}'`);

    const filter = filterParts.length > 0 ? filterParts.join(' and ') : undefined;
    const records = await MainDBHRService.getAll({ filter, orderBy: ['submittedDate desc'] });
    let results = records.map(mapToHRSubmission);
    if (options?.limit) results = results.slice(0, options.limit);
    return results;
  }

  /**
   * Get approval history for a submission
   */
  static async getApprovalHistory(parentId: number): Promise<CRApprovalRecord[]> {
    try {
      await ensureInitialized();
      const records = await ApprovalHistoryHRService.getAll({
        filter: `parentID eq '${parentId}'`,
      });
      return records.map((r) => ({
        Id: Number(r.id),
        GUID: String(r.id),
        Title: r.title || '',
        ParentID: parentId,
        FormCode: r.appname || '',
        StageNumber: 1,
        Action: (r.actioncode || 'Submitted') as ApprovalAction,
        ActionDate: r.actionon || '',
        ActionByID: r.actionbyemail || '',
        ActionByName: r.actionbyname || '',
        Comments: r.actioncomment || '',
      } as CRApprovalRecord));
    } catch {
      return [];
    }
  }

  /**
   * Get pending approvals
   */
  static async getPendingApprovals(): Promise<HRSubmission[]> {
    return this.getAll({
      status: 'Submitted' as HRCurrentStatus,
    });
  }

  /**
   * Delete a submission
   */
  static async delete(guid: string): Promise<void> {
    await ensureInitialized();
    await MainDBHRService.delete(guid);
  }
}

// =============================================================================
// REACT HOOKS
// =============================================================================

export function useHRSubmissions(options?: {
  formCode?: HRFormCode;
  formCodes?: HRFormCode[];
  status?: HRCurrentStatus;
  division?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['hr-submissions', options],
    queryFn: () => HRSubmissionService.getAll(options),
  });
}

export function useHRSubmission(guid: string) {
  return useQuery({
    queryKey: ['hr-submission', guid],
    queryFn: () => HRSubmissionService.get(guid),
    enabled: !!guid,
  });
}

export function useHRApprovalHistory(parentId: number) {
  return useQuery({
    queryKey: ['hr-approval-history', parentId],
    queryFn: () => HRSubmissionService.getApprovalHistory(parentId),
    enabled: parentId > 0,
  });
}

export function useHRPendingApprovals(approverId?: number) {
  return useQuery({
    queryKey: ['hr-pending-approvals', approverId],
    queryFn: () => HRSubmissionService.getPendingApprovals(),
  });
}

export function useCreateHRSubmission() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateHRSubmissionInput) => HRSubmissionService.create(input),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['hr-submissions'] });
    },
  });
}

export function useUpdateHRSubmission() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ guid, input }: { guid: string; input: UpdateHRSubmissionInput }) =>
      HRSubmissionService.update(guid, input),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ['hr-submissions'] });
      client.invalidateQueries({ queryKey: ['hr-submission', variables.guid] });
      client.invalidateQueries({ queryKey: ['hr-pending-approvals'] });
    },
  });
}

export function useProcessHRApproval() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ guid, action }: { guid: string; action: HRApprovalActionInput }) =>
      HRSubmissionService.processApproval(guid, action),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ['hr-submissions'] });
      client.invalidateQueries({ queryKey: ['hr-submission', variables.guid] });
      client.invalidateQueries({ queryKey: ['hr-pending-approvals'] });
      client.invalidateQueries({ queryKey: ['hr-approval-history'] });
    },
  });
}

export function useDeleteHRSubmission() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (guid: string) => HRSubmissionService.delete(guid),
    onSuccess: (_data, guid) => {
      client.invalidateQueries({ queryKey: ['hr-submissions'] });
      client.invalidateQueries({ queryKey: ['hr-submission', guid] });
    },
  });
}
