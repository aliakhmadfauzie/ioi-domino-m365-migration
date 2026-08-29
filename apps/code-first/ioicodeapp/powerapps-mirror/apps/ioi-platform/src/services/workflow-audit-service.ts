/**
 * Workflow Audit Service
 *
 * Comprehensive audit trail service for all workflow activities.
 * Tracks all changes, approvals, system actions, and provides queryable history.
 */

import { useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import type { ApprovalRecords } from '@/generated/models/approval-records-model';
import type { ApprovalActionType, WorkflowStatus, ApproverRoleType } from '@/types/it-approval-workflow';

// =============================================================================
// TYPES
// =============================================================================

export type AuditEventType =
  | 'FORM_CREATED'
  | 'FORM_SUBMITTED'
  | 'FORM_APPROVED'
  | 'FORM_REJECTED'
  | 'FORM_RETURNED'
  | 'FORM_DELEGATED'
  | 'FORM_ESCALATED'
  | 'FORM_COMPLETED'
  | 'FORM_CLOSED'
  | 'FIELD_UPDATED'
  | 'ATTACHMENT_ADDED'
  | 'ATTACHMENT_REMOVED'
  | 'COMMENT_ADDED'
  | 'SLA_WARNING'
  | 'SLA_BREACHED'
  | 'SYSTEM_AUTO_ACTION'
  | 'ASSIGNMENT_CHANGED'
  | 'WORKFLOW_STARTED'
  | 'WORKFLOW_ENDED'
  | 'ERROR';

export type AuditCategory = 'WORKFLOW' | 'DATA' | 'SYSTEM' | 'SECURITY' | 'SLA';

export interface AuditEntry {
  id: string;
  timestamp: Date;
  formId: string;
  formCode: string;
  ticketId: string;
  eventType: AuditEventType;
  category: AuditCategory;
  actorId: string;
  actorName: string;
  actorEmail: string;
  actorRole?: ApproverRoleType | 'System' | 'Submitter';
  stageKey?: string;
  stageName?: string;
  action?: ApprovalActionType;
  previousValue?: unknown;
  newValue?: unknown;
  fieldName?: string;
  description: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
}

export interface AuditQueryFilters {
  formId?: string;
  formCode?: string;
  eventTypes?: AuditEventType[];
  categories?: AuditCategory[];
  actorId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchText?: string;
}

export interface AuditSummary {
  totalEvents: number;
  eventsByType: Record<AuditEventType, number>;
  eventsByCategory: Record<AuditCategory, number>;
  recentActors: { id: string; name: string; count: number }[];
  avgEventsPerDay: number;
  lastActivity: Date | null;
}

export interface AuditTimeline {
  date: Date;
  entries: AuditEntry[];
}

// =============================================================================
// STORAGE (In-memory with local persistence + SharePoint persistence)
// =============================================================================

import { WorkflowAuditLogService } from '../generated/services/workflow-audit-log-service';

const STORAGE_KEY = 'ioi_workflow_audit_log';
let auditStore: AuditEntry[] = [];

function loadFromStorage(): AuditEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((e: AuditEntry) => ({
        ...e,
        timestamp: new Date(e.timestamp),
      }));
    }
  } catch {
    console.warn('Failed to load audit log from storage');
  }
  return [];
}

function saveToStorage(entries: AuditEntry[]): void {
  try {
    // Keep only last 1000 entries to prevent storage overflow
    const toStore = entries.slice(-1000);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch {
    console.warn('Failed to save audit log to storage');
  }
}

/**
 * Persist an audit entry to the SharePoint WorkflowAuditLog list.
 * Falls back silently on error (non-blocking — primary audit is still in-memory).
 */
async function persistToSharePoint(entry: AuditEntry): Promise<void> {
  try {
    await WorkflowAuditLogService.create({
      title: `AUD-${entry.formCode}-${entry.formId}-${Date.now()}`,
      formCode: entry.formCode,
      requestItemID: Number(entry.formId),
      actionTaken: entry.eventType,
      actorName: entry.actorName,
      actorEmail: entry.actorEmail,
      comment: entry.description,
      timestamp: entry.timestamp.toISOString(),
      oldStatus: entry.previousValue as string | undefined,
      newStatus: entry.newValue as string | undefined,
      siteTag: 'PRAI',
    });
  } catch (err) {
    // Non-blocking: log warning but don't fail the operation
    console.warn('[WorkflowAuditService] Failed to persist audit entry to SharePoint:', err);
  }
}

// Initialize store
auditStore = loadFromStorage();

// =============================================================================
// AUDIT LOGGING FUNCTIONS
// =============================================================================

function generateAuditId(): string {
  return `AUD-${Date.now()}-${uuidv4().slice(0, 8)}`;
}

function createAuditEntry(
  formId: string,
  formCode: string,
  ticketId: string,
  eventType: AuditEventType,
  actor: { id: string; name: string; email: string; role?: ApproverRoleType | 'System' | 'Submitter' },
  description: string,
  options?: {
    category?: AuditCategory;
    action?: ApprovalActionType;
    stageKey?: string;
    stageName?: string;
    fieldName?: string;
    previousValue?: unknown;
    newValue?: unknown;
    metadata?: Record<string, unknown>;
  }
): AuditEntry {
  const entry: AuditEntry = {
    id: generateAuditId(),
    timestamp: new Date(),
    formId,
    formCode,
    ticketId,
    eventType,
    category: options?.category || inferCategory(eventType),
    actorId: actor.id,
    actorName: actor.name,
    actorEmail: actor.email,
    actorRole: actor.role,
    description,
    ...options,
  };

  // Local persistence (fast, always works)
  auditStore.push(entry);
  saveToStorage(auditStore);

  // SharePoint persistence (non-blocking, fire-and-forget)
  persistToSharePoint(entry);

  return entry;
}

function inferCategory(eventType: AuditEventType): AuditCategory {
  const categoryMap: Record<AuditEventType, AuditCategory> = {
    'FORM_CREATED': 'WORKFLOW',
    'FORM_SUBMITTED': 'WORKFLOW',
    'FORM_APPROVED': 'WORKFLOW',
    'FORM_REJECTED': 'WORKFLOW',
    'FORM_RETURNED': 'WORKFLOW',
    'FORM_DELEGATED': 'WORKFLOW',
    'FORM_ESCALATED': 'WORKFLOW',
    'FORM_COMPLETED': 'WORKFLOW',
    'FORM_CLOSED': 'WORKFLOW',
    'FIELD_UPDATED': 'DATA',
    'ATTACHMENT_ADDED': 'DATA',
    'ATTACHMENT_REMOVED': 'DATA',
    'COMMENT_ADDED': 'DATA',
    'SLA_WARNING': 'SLA',
    'SLA_BREACHED': 'SLA',
    'SYSTEM_AUTO_ACTION': 'SYSTEM',
    'ASSIGNMENT_CHANGED': 'WORKFLOW',
    'WORKFLOW_STARTED': 'WORKFLOW',
    'WORKFLOW_ENDED': 'WORKFLOW',
    'ERROR': 'SYSTEM',
  };
  return categoryMap[eventType];
}

// =============================================================================
// PUBLIC API
// =============================================================================

export const WorkflowAuditService = {
  /**
   * Log a workflow action (approve, reject, etc.)
   */
  logWorkflowAction(
    submission: MainDBIT,
    action: ApprovalActionType,
    actor: { id: string; name: string; email: string; role?: ApproverRoleType | 'System' | 'Submitter' },
    stageInfo: { key?: string; name?: string },
    comments?: string
  ): AuditEntry {
    const eventTypeMap: Record<ApprovalActionType, AuditEventType> = {
      'Submit': 'FORM_SUBMITTED',
      'Approve': 'FORM_APPROVED',
      'Reject': 'FORM_REJECTED',
      'Return': 'FORM_RETURNED',
      'Rework': 'FORM_RETURNED',
      'Delegate': 'FORM_DELEGATED',
      'Escalate': 'FORM_ESCALATED',
      'Complete': 'FORM_COMPLETED',
      'Cancel': 'FORM_CLOSED',
      'Edit': 'FORM_SUBMITTED',
      'Close': 'FORM_CLOSED',
      'RequestClose': 'FORM_CLOSED',
      'Extend': 'FORM_SUBMITTED',
      'Confirm': 'FORM_COMPLETED',
    };
    const eventType = eventTypeMap[action];
    const description = comments
      ? `${actor.name} performed ${action} action: ${comments}`
      : `${actor.name} performed ${action} action`;

    return createAuditEntry(
      String(submission.id),
      submission.formcode,
      submission.title,
      eventType,
      actor,
      description,
      {
        action,
        stageKey: stageInfo.key,
        stageName: stageInfo.name,
        metadata: { comments },
      }
    );
  },

  /**
   * Log field value change
   */
  logFieldChange(
    submission: MainDBIT,
    fieldName: string,
    previousValue: unknown,
    newValue: unknown,
    actor: { id: string; name: string; email: string }
  ): AuditEntry {
    return createAuditEntry(
      String(submission.id),
      submission.formcode,
      submission.title,
      'FIELD_UPDATED',
      actor,
      `Field "${fieldName}" changed from "${String(previousValue)}" to "${String(newValue)}"`,
      {
        fieldName,
        previousValue,
        newValue,
      }
    );
  },

  /**
   * Log SLA warning
   */
  logSLAWarning(
    submission: MainDBIT,
    hoursOverdue: number,
    currentApprover?: { id: string; name: string; email: string }
  ): AuditEntry {
    return createAuditEntry(
      String(submission.id),
      submission.formcode,
      submission.title,
      'SLA_WARNING',
      { id: 'SYSTEM', name: 'System', email: 'system@ioi.com', role: 'System' },
      `SLA warning: Request has been pending for ${Math.round(hoursOverdue)} hours`,
      {
        category: 'SLA',
        metadata: {
          hoursOverdue,
          currentApprover,
        },
      }
    );
  },

  /**
   * Log SLA breach (escalation)
   */
  logSLABreach(
    submission: MainDBIT,
    hoursOverdue: number,
    escalatedTo: { id: string; name: string; email: string },
    previousApprover?: { id: string; name: string; email: string }
  ): AuditEntry {
    return createAuditEntry(
      String(submission.id),
      submission.formcode,
      submission.title,
      'SLA_BREACHED',
      { id: 'SYSTEM', name: 'System', email: 'system@ioi.com', role: 'System' },
      `SLA breached after ${Math.round(hoursOverdue)} hours. Escalated to ${escalatedTo.name}`,
      {
        category: 'SLA',
        metadata: {
          hoursOverdue,
          escalatedTo,
          previousApprover,
        },
      }
    );
  },

  /**
   * Log delegation
   */
  logDelegation(
    submission: MainDBIT,
    delegator: { id: string; name: string; email: string },
    delegate: { id: string; name: string; email: string },
    reason: string
  ): AuditEntry {
    return createAuditEntry(
      String(submission.id),
      submission.formcode,
      submission.title,
      'FORM_DELEGATED',
      delegator,
      `Delegated to ${delegate.name}: ${reason}`,
      {
        action: 'Delegate',
        metadata: {
          delegateId: delegate.id,
          delegateName: delegate.name,
          delegateEmail: delegate.email,
          reason,
        },
      }
    );
  },

  /**
   * Log system auto-action
   */
  logSystemAction(
    submission: MainDBIT,
    description: string,
    actionType: string,
    metadata?: Record<string, unknown>
  ): AuditEntry {
    return createAuditEntry(
      String(submission.id),
      submission.formcode,
      submission.title,
      'SYSTEM_AUTO_ACTION',
      { id: 'SYSTEM', name: 'System', email: 'system@ioi.com', role: 'System' },
      description,
      {
        category: 'SYSTEM',
        metadata: { actionType, ...metadata },
      }
    );
  },

  /**
   * Log form creation
   */
  logFormCreation(
    submission: MainDBIT,
    creator: { id: string; name: string; email: string }
  ): AuditEntry {
    return createAuditEntry(
      String(submission.id),
      submission.formcode,
      submission.title,
      'FORM_CREATED',
      { ...creator, role: 'Submitter' },
      `${submission.formcode} request created by ${creator.name}`
    );
  },

  /**
   * Query audit entries
   */
  queryEntries(filters?: AuditQueryFilters): AuditEntry[] {
    let results = [...auditStore];

    if (filters?.formId) {
      results = results.filter(e => e.formId === filters.formId);
    }
    if (filters?.formCode) {
      results = results.filter(e => e.formCode === filters.formCode);
    }
    if (filters?.eventTypes?.length) {
      results = results.filter(e => filters.eventTypes!.includes(e.eventType));
    }
    if (filters?.categories?.length) {
      results = results.filter(e => filters.categories!.includes(e.category));
    }
    if (filters?.actorId) {
      results = results.filter(e => e.actorId === filters.actorId);
    }
    if (filters?.dateFrom) {
      results = results.filter(e => e.timestamp >= filters.dateFrom!);
    }
    if (filters?.dateTo) {
      results = results.filter(e => e.timestamp <= filters.dateTo!);
    }
    if (filters?.searchText) {
      const text = filters.searchText.toLowerCase();
      results = results.filter(e =>
        e.description.toLowerCase().includes(text) ||
        e.ticketId.toLowerCase().includes(text) ||
        e.actorName.toLowerCase().includes(text)
      );
    }

    return results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  },

  /**
   * Get entries for a specific form
   */
  getFormHistory(formId: string): AuditEntry[] {
    return this.queryEntries({ formId });
  },

  /**
   * Get timeline view (grouped by date)
   */
  getTimeline(formId: string): AuditTimeline[] {
    const entries = this.getFormHistory(formId);
    const grouped: Record<string, AuditEntry[]> = {};

    for (const entry of entries) {
      const dateKey = entry.timestamp.toISOString().split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(entry);
    }

    return Object.entries(grouped)
      .map(([date, entries]) => ({
        date: new Date(date),
        entries,
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  },

  /**
   * Get audit summary
   */
  getSummary(filters?: AuditQueryFilters): AuditSummary {
    const entries = this.queryEntries(filters);

    const eventsByType: Record<AuditEventType, number> = {} as Record<AuditEventType, number>;
    const eventsByCategory: Record<AuditCategory, number> = {} as Record<AuditCategory, number>;
    const actorCounts: Record<string, { id: string; name: string; count: number }> = {};

    for (const entry of entries) {
      eventsByType[entry.eventType] = (eventsByType[entry.eventType] || 0) + 1;
      eventsByCategory[entry.category] = (eventsByCategory[entry.category] || 0) + 1;

      if (entry.actorId !== 'SYSTEM') {
        if (!actorCounts[entry.actorId]) {
          actorCounts[entry.actorId] = { id: entry.actorId, name: entry.actorName, count: 0 };
        }
        actorCounts[entry.actorId].count++;
      }
    }

    const recentActors = Object.values(actorCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate avg events per day
    let avgEventsPerDay = 0;
    if (entries.length > 0) {
      const firstEntry = entries[entries.length - 1];
      const lastEntry = entries[0];
      const daysDiff = Math.max(1, Math.ceil(
        (lastEntry.timestamp.getTime() - firstEntry.timestamp.getTime()) / (1000 * 60 * 60 * 24)
      ));
      avgEventsPerDay = entries.length / daysDiff;
    }

    return {
      totalEvents: entries.length,
      eventsByType,
      eventsByCategory,
      recentActors,
      avgEventsPerDay,
      lastActivity: entries.length > 0 ? entries[0].timestamp : null,
    };
  },

  /**
   * Clear all audit entries (admin only)
   */
  clearAll(): void {
    auditStore = [];
    saveToStorage(auditStore);
  },
};

// =============================================================================
// REACT HOOK
// =============================================================================

export function useWorkflowAudit(formId?: string) {
  const queryClient = useQueryClient();

  // Query entries for a form
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['workflow-audit', formId],
    queryFn: () => formId ? WorkflowAuditService.getFormHistory(formId) : [],
    enabled: !!formId,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Timeline view
  const timeline = useMemo(() => {
    return formId ? WorkflowAuditService.getTimeline(formId) : [];
  }, [formId, entries]);

  // Summary
  const summary = useMemo(() => {
    return formId ? WorkflowAuditService.getSummary({ formId }) : null;
  }, [formId, entries]);

  // Log action mutation
  const logAction = useMutation({
    mutationFn: async (params: {
      submission: MainDBIT;
      action: ApprovalActionType;
      actor: { id: string; name: string; email: string; role?: ApproverRoleType | 'System' | 'Submitter' };
      stageInfo: { key?: string; name?: string };
      comments?: string;
    }) => {
      return WorkflowAuditService.logWorkflowAction(
        params.submission,
        params.action,
        params.actor,
        params.stageInfo,
        params.comments
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-audit'] });
    },
  });

  // Log field change
  const logFieldChange = useCallback((params: {
    submission: MainDBIT;
    fieldName: string;
    previousValue: unknown;
    newValue: unknown;
    actor: { id: string; name: string; email: string };
  }) => {
    WorkflowAuditService.logFieldChange(
      params.submission,
      params.fieldName,
      params.previousValue,
      params.newValue,
      params.actor
    );
    queryClient.invalidateQueries({ queryKey: ['workflow-audit'] });
  }, [queryClient]);

  return {
    entries,
    timeline,
    summary,
    isLoading,
    logAction: logAction.mutateAsync,
    logFieldChange,
    isLogging: logAction.isPending,
  };
}

// =============================================================================
// AUDIT LOG VIEWER HOOK
// =============================================================================

export function useAuditLogViewer(filters?: AuditQueryFilters) {
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['workflow-audit-all', filters],
    queryFn: () => WorkflowAuditService.queryEntries(filters),
    refetchInterval: 30000,
  });

  const summary = useMemo(() => {
    return WorkflowAuditService.getSummary(filters);
  }, [filters, entries]);

  // Group by form for overview
  const entriesByForm = useMemo(() => {
    const grouped: Record<string, { formId: string; ticketId: string; formCode: string; entries: AuditEntry[] }> = {};

    for (const entry of entries) {
      if (!grouped[entry.formId]) {
        grouped[entry.formId] = {
          formId: entry.formId,
          ticketId: entry.ticketId,
          formCode: entry.formCode,
          entries: [],
        };
      }
      grouped[entry.formId].entries.push(entry);
    }

    return Object.values(grouped);
  }, [entries]);

  return {
    entries,
    entriesByForm,
    summary,
    isLoading,
  };
}

export default WorkflowAuditService;