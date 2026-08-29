import { format } from 'date-fns';
import type { WorkflowAuditLog } from '@/generated/models/workflow-audit-log-model';
import { WorkflowAuditLogService } from '@/generated/services/workflow-audit-log-service';

export type DRDStatus = 'Submitted' | 'HOSApproved' | 'HODApproved' | 'Completed';

export interface DRDRecord extends Record<string, any> {
  ID?: number | string;
  id?: number | string;
  Title?: string;
  title?: string;
  drdCompany?: string;
  drdCategory?: string;
  drdDepartment?: string;
  drdSection?: string;
  drdHOS?: string;
  drdHOD?: string;
  drdCC?: string;
  drdMonth?: number;
  drdYear?: number;
  drdAttch?: string;
  drdAmend?: string;
  drdChanges?: string;
  drdEmpName?: string;
  drdSubmittedBy?: string;
  drdSubmittedDate?: string;
  drdHOSName?: string;
  drdHOSDate?: string;
  drdHOSRemark?: string;
  drdHODName?: string;
  drdHODDate?: string;
  drdHODRemark?: string;
  drdHRName?: string;
  drdHRDate?: string;
  drdHOSApp?: boolean;
  drdHODApp?: boolean;
  drdHRApp?: boolean;
  drdCurrentAction?: DRDStatus;
}

export const DRD_FORM_CODE = 'DRD' as const;

export const DRD_STAGES = [
  { key: 'Submitted', label: 'Submitted' },
  { key: 'HOSApproved', label: 'HOS Approved' },
  { key: 'HODApproved', label: 'HOD Approved' },
  { key: 'Completed', label: 'Completed by HR' },
];

export const DRD_SHIFT_CODES = [
  { code: 'OFC', hours: '08:30-17:45' },
  { code: 'OFO', hours: '08:30-17:30' },
  { code: 'N1', hours: '08:30-17:00' },
  { code: 'A1', hours: '07:00-14:30' },
  { code: 'A2', hours: '07:30-15:00' },
  { code: 'B1', hours: '15:00-22:30' },
  { code: 'C1', hours: '23:00-06:30' },
  { code: '7A1', hours: '07:00-19:00' },
  { code: '7A2', hours: '07:30-19:00' },
  { code: '7P1', hours: '19:00-06:30' },
];

export const DRD_COMPANIES = ['YKS', 'YTC', 'NAGA'];
export const DRD_CATEGORIES = ['Both', 'Outsource Worker'];

export function fieldValue(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(fieldValue).filter(Boolean).join('; ');
  if (typeof value === 'object') {
    const item = value as { DisplayName?: string; Email?: string; Title?: string; Value?: string };
    return item.DisplayName || item.Email || item.Title || item.Value || '';
  }
  return String(value);
}

export function recordId(record: DRDRecord | undefined): string {
  return fieldValue(record?.ID || record?.id);
}

export function recordTitle(record: DRDRecord | undefined): string {
  return fieldValue(record?.Title || record?.title || record?.requesttitle || recordId(record));
}

export function formatDateTime(value: unknown): string {
  const raw = fieldValue(value);
  if (!raw) return '-';
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? raw : format(date, 'dd MMM yyyy, HH:mm');
}

export function monthLabel(month: unknown): string {
  const value = Number(month);
  if (!value) return '-';
  return format(new Date(2026, value - 1, 1), 'MMMM');
}

export async function logDRDWorkflowAction(params: {
  record: DRDRecord;
  actorName: string;
  actorEmail: string;
  stage: string;
  action: 'Submitted' | 'Approved' | 'Acknowledged';
  previousState?: string;
  newState: DRDStatus;
  comments?: string;
}) {
  const id = Number(recordId(params.record));
  const title = recordTitle(params.record) || `DRD-${Date.now()}`;
  const entry: Omit<WorkflowAuditLog, 'id'> = {
    title: `DRD-${params.stage}-${Date.now()}`,
    formCode: DRD_FORM_CODE,
    requestItemID: Number.isNaN(id) ? undefined : id,
    actionTaken: params.action,
    actorName: params.actorName,
    actorEmail: params.actorEmail,
    comment: params.comments || `${params.stage} ${params.action}`,
    timestamp: new Date().toISOString(),
    oldStatus: params.previousState,
    newStatus: params.newState,
    siteTag: 'PRAI',
  };

  try {
    await WorkflowAuditLogService.create(entry);
  } catch (err) {
    console.warn(`[DRD] Failed to write workflow audit log for ${title}`, err);
  }
}
