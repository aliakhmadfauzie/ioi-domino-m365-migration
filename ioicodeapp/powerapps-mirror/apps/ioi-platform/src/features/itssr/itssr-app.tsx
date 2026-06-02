import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, CheckCircle2, ExternalLink, Eye, FileText, Headset, Lock, Plus, Route, RotateCcw, Search, Send, Upload, UserCheck, Wrench, X, Paperclip, ThumbsDown, Clock, Building2, XCircle, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { OutlookEmailService } from '@/services/outlook-email-service';
import { MainDBITService } from '@/generated/services/main-dbit-service';
import { MainDBITExtSupportService } from '@/generated/services/main-dbit-ext-support-service';
import { MainDBITExtDocsService } from '@/generated/services/main-dbit-ext-docs-service';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import type { MainDBITExtSupport } from '@/generated/models/main-dbit-ext-support-model';
import type { MainDBITExtDocs } from '@/generated/models/main-dbit-ext-docs-model';
import { EmployeePicker } from '@/components/employee-picker';
import { AppSettingsService } from '@/generated/services/app-settings-service';
import { useRoleAccess } from '@/hooks/use-platform';
import { useUser } from '@/hooks/use-user';
import { ITSSR } from '@/lib/it-forms-config';
import { mapLocationToSiteKey } from '@/lib/form-submission-utils';
import { buildFormCodeFilter, buildParentFormCodeFilter, getITFormDetailPath, getITFormListPath, getITFormNewPath } from '@/lib/it-form-page-utils';
import { determineITSSRRouting } from '@/hooks/use-itssr-routing';
import {
  ITSSR_APPLICATIONS,
  ITSSR_CLASSIFICATIONS,
  ITSSR_COMPANIES,
  ITSSR_DEPARTMENTS,
  ITSSR_HARDWARE_ITEMS,
  ITSSR_PROBLEM_CATEGORIES,
  ITSSR_PROBLEM_CATEGORIES_SECONDARY,
  ITSSR_SERVICE_TYPES,
  ITSSR_SUPPORT_METHODS,
  type ITSSRCaseStatus,
  type ITSSRServiceType,
} from '@/types/m2-itssr-types';

type PersonValue = { Email?: string; email?: string; Title?: string; title?: string; DisplayName?: string; Claims?: string } | string | null | undefined;
type ITSSRRecord = MainDBIT & {
  extSupportId?: number;
  CaseStatus?: ITSSRCaseStatus;
  /** CS sub-state: 0=Rejected, 1=Closed, 2=Pending (set by IT without changing CA) */
  csState?: CSState;
  FormType?: string;
  Site?: string;
  Company?: string;
  Department?: string;
  ServiceType?: string;
  Hardware?: string;
  Application?: string;
  ReportedByEmail?: PersonValue;
  PhoneExtension?: string;
  SendToEmail?: PersonValue;
  CCEmail?: PersonValue[] | string;
  ProblemDescription?: string;
  RequestorAttachment?: string;
  _attachmentFile?: File;
  _attachmentSize?: number;
  _attachmentType?: string;
  SubmittedBy?: string;
  SubmittedDate?: string;
  AssignedToEmail?: PersonValue;
  ITRemarks?: string;
  DateStarted?: string;
  Solution?: string;
  ITAttachment?: string;
  ProblemCategory?: string;
  SecondaryCategory?: string;
  Classification?: string;
  SupportMethod?: string;
  DateResolved?: string;
  DateNotifiedRequestor?: string;
  SatisfactionRating?: number;
  RequestorComment?: string;
  DateAccepted?: string;
  /** CS=2 Pending flag — IT set without changing CA (maps to iTSSRCS='2') */
  itPending?: boolean;
  itPendingDate?: string;
  /** PanCen desktop fields (maps to existing Ext_Support columns) */
  /** @description Maps to iTSSROU column */
  ou?: string;
  /** @description Maps to iTSSRType2 column */
  type2?: string;
  /** @description Maps to iTSSRCOOApproval column */
  cooApp?: string;
  /** @description Maps to iTSSRVerifiedBy column */
  itVerificationBy?: string;
  /** @description Maps to iTSSRVerificationDate column */
  itVerificationDate?: string;
  /** @description Maps to iTSSRManagerBy column */
  itManagerApprovedBy?: string;
  /** @description Maps to iTSSRManagerDate column */
  itManagerApprovedDate?: string;
  /** @description Maps to iTSSRCOOBy column */
  cooApprovedBy?: string;
  /** @description Maps to iTSSRCOODate column */
  cooApprovedDate?: string;
  /** CS sub-state from Ext_Support: '0'=Rejected, '1'=Closed, '2'=Pending */
  iTSSRCS?: string;
};

const ITSSR_CODE = ITSSR.code;
const ITSSR_BASE_PATH = getITFormListPath(ITSSR_CODE);
const ITSSR_LIST_PATH = `${ITSSR_BASE_PATH}/itssr_submissiom`;
const ITSSR_NEW_PATH = getITFormNewPath(ITSSR_CODE);
const ITSSR_PAGE_SIZE = 50;
const statusOptions: Array<ITSSRCaseStatus | 'All'> = ['All', 'Draft', 'Submitted', 'InProgress', 'Resolved', 'Accepted', 'Closed', 'Denied'];// CS sub-state: 0=Rejected, 1=Closed, 2=Pending (set by IT without changing CA)
type CSState = 0 | 1 | 2;
const SECTION1_REMARKS_START = '[ITSSR_SECTION1_JSON]';
const SECTION1_REMARKS_END = '[/ITSSR_SECTION1_JSON]';
const SECTION1_FIELDS: Array<keyof ITSSRRecord> = [
  'Company',
  'Department',
  'ServiceType',
  'Hardware',
  'Application',
  'ReportedByEmail',
  'PhoneExtension',
  'SendToEmail',
  'CCEmail',
  'RequestorAttachment',
  'ProblemDescription',
];

function formatITSSRCaseTitle(id: string | number, date = new Date()): string {
  const year = date.getFullYear();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${ITSSR_CODE}-${year}${day}${month}.${id}`;
}

/**
 * Build a human-readable summary for the remarks field.
 * NOTE: Section data is now stored in MainDB_IT_Ext_Support columns directly.
 * The remarks field only contains a plain-text summary for quick reference.
 * The JSON-in-remarks pattern has been removed to avoid fragile parsing.
 * Legacy records with JSON in remarks are still supported via parseITSSRRemarksSnapshot().
 */
function buildITSSRRemarksSummary(form: Partial<ITSSRRecord>, routedPIC?: PersonValue): string {
  const summary = [
    `Service Type: ${form.ServiceType || 'IT Support Request'}`,
    form.Company || form.Department ? `Company / Dept: ${form.Company || '-'} / ${form.Department || '-'}` : null,
    form.Application ? `Application: ${form.Application}` : null,
    form.Hardware ? `Hardware: ${form.Hardware}` : null,
    form.PhoneExtension ? `Phone Extension: ${form.PhoneExtension}` : null,
    form.SendToEmail || routedPIC ? `Primary PIC: ${personName(routedPIC ?? form.SendToEmail)} <${personEmail(routedPIC ?? form.SendToEmail)}>` : null,
    `---`,
    form.ProblemDescription,
  ].filter(Boolean);
  return summary.join('\n');
}

/**
 * Parse legacy ITSSR remarks that may contain JSON-embedded section data.
 * This is a backward-compatibility function for records created before the
 * refactoring that moved section data to ExtSupport columns.
 * Returns empty object if no legacy JSON is found.
 */
function parseITSSRRemarksSnapshot(remarks?: string): Record<string, string> {
  if (!remarks) return {};
  const start = remarks.indexOf(SECTION1_REMARKS_START);
  const end = remarks.indexOf(SECTION1_REMARKS_END);
  if (start < 0 || end <= start) return {};
  const json = remarks.slice(start + SECTION1_REMARKS_START.length, end).trim();
  try {
    const parsed = JSON.parse(json) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(parsed).map(([key, value]) => [key, typeof value === 'string' ? value : ''])
    );
  } catch {
    return {};
  }
}

function parsePrimaryPICFromRemarks(remarks?: string): PersonValue {
  if (!remarks) return undefined;
  const match = remarks.match(/^Primary PIC:\s*(.*?)\s*<([^<>]+)>/im);
  if (!match) return undefined;
  const title = match[1]?.trim();
  const email = match[2]?.trim();
  return email ? toPerson(email, title || email) : undefined;
}

function odataString(value?: string): string {
  return `'${String(value || '').replace(/'/g, "''")}'`;
}

function buildParentRecordFilter(record: Pick<MainDBIT, 'id' | 'title'>): string {
  const title = odataString(record.title);
  return `${buildParentFormCodeFilter(ITSSR_CODE)} and (ParentID/Id eq ${record.id} or title eq ${title})`;
}

function buildParentRecordSetFilter(records: Array<Pick<MainDBIT, 'id' | 'title'>>): string {
  if (records.length === 0) return buildParentFormCodeFilter(ITSSR_CODE);
  const idFilter = records.map((record) => `ParentID/Id eq ${record.id}`).join(' or ');
  const titleFilter = records.map((record) => `title eq ${odataString(record.title)}`).join(' or ');
  return `${buildParentFormCodeFilter(ITSSR_CODE)} and (${idFilter} or ${titleFilter})`;
}



function personEmail(value: PersonValue): string {
  if (!value) return '';
  if (typeof value === 'string') return value.toLowerCase();
  return String(value.Email || value.email || value.Claims || '').toLowerCase();
}

function personName(value: PersonValue): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return String(value.Title || value.title || value.DisplayName || value.Email || value.email || '');
}

function emailListIncludes(value: PersonValue, userEmail?: string): boolean {
  const target = String(userEmail || '').trim().toLowerCase();
  if (!target) return false;
  return personEmail(value).split(/[;,]/).map((email) => email.trim()).filter(Boolean).includes(target);
}

function rawStatusText(record?: ITSSRRecord | null): string {
  const raw = record as (ITSSRRecord & Record<string, unknown>) | null | undefined;
  const status = raw?.Status ?? raw?.CurrentStatus ?? raw?.currentStatus;
  if (typeof status === 'string') return status.trim().toLowerCase().replace(/[\s-]+/g, '');
  if (status && typeof status === 'object' && 'Value' in status) {
    return String((status as { Value?: unknown }).Value ?? '').trim().toLowerCase().replace(/[\s-]+/g, '');
  }
  return '';
}

function statusOf(record?: ITSSRRecord | null): ITSSRCaseStatus {
  if (!record) return 'Draft';
  if (record.CaseStatus) return record.CaseStatus;
  const rawStatus = rawStatusText(record);
  if (rawStatus === 'draft') return 'Draft';
  if (rawStatus === 'submitted' || rawStatus === 'pendingit' || record.workflowstage === 1) return 'Submitted';
  if (rawStatus === 'inprogress' || rawStatus === 'pendingitpic' || record.workflowstage === 2) return 'InProgress';
  if (rawStatus === 'resolved' || rawStatus === 'pendingreqacceptance' || record.workflowstage === 3) return 'Resolved';
  if ((rawStatus === 'accepted' || rawStatus === 'approved') && (record.workflowstage ?? 0) >= 4) return 'Accepted';
  if (rawStatus === 'denied' || rawStatus === 'rejected' || record.workflowstage === 6) return 'Denied';
  if (rawStatus === 'closed' || record.workflowstage === 5) return 'Closed';

  // Checking the mapped string text for CurrentStatus
  if (record.currentStatus === 'Draft') return 'Draft';
  if (record.currentStatus === 'PendingIT') return 'Submitted';
  if (record.currentStatus === 'PendingITPIC') return 'InProgress';
  if (record.currentStatus === 'PendingReqAcceptance') return 'Resolved';
  if (record.currentStatus === 'Approved' && (record.workflowstage ?? 0) >= 4) return 'Accepted';
  if (record.currentStatus === 'Denied' || record.currentStatus === 'Rejected') return 'Denied';
  if (record.currentStatus === 'Closed') return 'Closed';

  return 'Draft';
}

function mapCurrentStatus(status: ITSSRCaseStatus): string {
  if (status === 'Draft') return 'Draft';
  if (status === 'Submitted') return 'PendingIT';
  if (status === 'InProgress') return 'PendingITPIC';
  if (status === 'Resolved') return 'PendingReqAcceptance';
  if (status === 'Accepted') return 'Approved';
  if (status === 'Denied') return 'Denied';
  if (status === 'Closed') return 'Closed';
  return 'Draft';
}

function stageNumber(status: ITSSRCaseStatus): number {
  if (status === 'Draft') return 0;
  if (status === 'Submitted') return 1;
  if (status === 'InProgress') return 2;
  if (status === 'Resolved') return 3;
  if (status === 'Accepted') return 4;
  if (status === 'Denied') return 6;
  if (status === 'Closed') return 5;
  return 0;
}

function getField(record: ITSSRRecord, key: keyof ITSSRRecord): string {
  const value = record[key];
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
}

function toPerson(email: string, title?: string) {
  return email ? { Email: email.trim(), Title: title || email.trim() } : undefined;
}

function useAdminEmails() {
  return useQuery({
    queryKey: ['itssr-admin-emails'],
    queryFn: async () => {
      const settings = await AppSettingsService.getAll({ filter: "settingKey eq 'ITAdminEmails'", top: 1 });
      return (settings[0]?.settingValue || '').split(';').map((email) => email.trim().toLowerCase()).filter(Boolean);
    },
    retry: false,
  });
}

function rawText(record: unknown, ...keys: string[]): string {
  const raw = record as Record<string, unknown> | null | undefined;
  if (!raw) return '';
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === 'string' && value.trim()) return value;
    if (typeof value === 'number') return String(value);
    if (value && typeof value === 'object') {
      const objectValue = value as Record<string, unknown>;
      const label = objectValue.Value ?? objectValue.Title ?? objectValue.title ?? objectValue.Email ?? objectValue.email;
      if (typeof label === 'string' && label.trim()) return label;
    }
  }
  return '';
}

function sameKey(a?: string, b?: string): boolean {
  return Boolean(a && b && a.trim().toLowerCase() === b.trim().toLowerCase());
}

function findITSSRExtSupport(record: MainDBIT, extRecords: MainDBITExtSupport[]): MainDBITExtSupport | undefined {
  return extRecords.find((ext) => {
    const parentTitle = rawText(ext.parentRecord, 'title', 'Title', 'Value');
    return (
      ext.parentRecord?.id === record.id ||
      sameKey(parentTitle, record.title) ||
      sameKey(ext.iTSSRCaseNo, record.title) ||
      sameKey(ext.title, record.title)
    );
  });
}

function docsForRecord(record: MainDBIT, docs: MainDBITExtDocs[]): MainDBITExtDocs[] {
  return docs.filter((doc) => {
    const parentTitle = rawText(doc.parentRecord, 'title', 'Title', 'Value');
    return (
      doc.parentRecord?.id === record.id ||
      sameKey(parentTitle, record.title) ||
      sameKey(doc.title, record.title)
    );
  });
}

function documentUrl(doc: MainDBITExtDocs): string {
  const candidates = [
    doc.iTPAttachment,
    doc.iTP2Attachment,
    doc.iTIAttachment,
    doc.iTPComments,
    doc.iTIRemarks,
    doc.iOIPDescription,
  ].filter(Boolean) as string[];
  return candidates.find((value) => /^https?:\/\//i.test(value.trim())) || '';
}

async function createITSSRDocument(
  parent: Pick<MainDBIT, 'id' | 'title'>,
  docType: string,
  docTitle: string,
  url?: string
) {
  const cleanUrl = url?.trim();
  if (!cleanUrl) return;
  await MainDBITExtDocsService.create({
    title: parent.title,
    parentFormCode: ITSSR_CODE,
    parentRecord: { id: parent.id, title: parent.title },
    iTPDocType: docType,
    iTPDocTitle: docTitle || docType,
    iTPVersionNo: '1',
    iTPRevisionNo: '0',
    iTPDateLastUpdated: new Date().toISOString(),
    iTPApplicableTo: ITSSR_CODE,
    iTPComments: cleanUrl,
    iTPAttachment: cleanUrl,
  } as Omit<MainDBITExtDocs, 'id'>);
}

function mapITSSRRecord(record: MainDBIT, ext?: MainDBITExtSupport): ITSSRRecord {
  const rawRecord = record as MainDBIT & Record<string, unknown>;
  const section1 = parseITSSRRemarksSnapshot(record.remarks);
  const summaryPIC = parsePrimaryPICFromRemarks(record.remarks);
  const rawStatus = rawStatusText(record);
  const isSubmittedBeforeAssignment = Boolean(
    ext?.iTSSRAssignedToEmail &&
    !ext.iTSSRDateStarted &&
    (rawStatus === 'submitted' || rawStatus === 'pendingit' || record.workflowstage === 1)
  );
  const routedTo =
    ext?.iTSSRSendToEmail ||
    rawText(rawRecord, 'SendToEmail') ||
    section1.SendToEmail ||
    personEmail(summaryPIC) ||
    (isSubmittedBeforeAssignment ? ext?.iTSSRAssignedToEmail : '');
  return {
    ...record,
    extSupportId: ext?.id,
    Company: rawText(rawRecord, 'company', 'Company') || section1.Company,
    Department: ext?.iTSSRDepartment || rawText(rawRecord, 'department', 'Department') || section1.Department,
    ServiceType: ext?.iTSSRServiceType || rawText(rawRecord, 'ServiceType') || section1.ServiceType,
    Hardware: ext?.iTSSRHardware || rawText(rawRecord, 'Hardware') || section1.Hardware,
    Application: ext?.iTSSRApplication || rawText(rawRecord, 'Application') || section1.Application,
    PhoneExtension: ext?.iTSSRExtension || rawText(rawRecord, 'PhoneExtension') || section1.PhoneExtension,
    ProblemDescription: ext?.iTSSRProblemDescription || rawText(rawRecord, 'ProblemDescription') || section1.ProblemDescription,
    AssignedToEmail: isSubmittedBeforeAssignment ? undefined : (ext?.iTSSRAssignedToEmail || rawText(rawRecord, 'AssignedToEmail')),
    SendToEmail: routedTo ? toPerson(routedTo, personName(summaryPIC) || routedTo) : undefined,
    CCEmail: ext?.iTSSRCC || rawText(rawRecord, 'CCEmail', 'CC', 'cC') || section1.CCEmail,
    DateStarted: ext?.iTSSRDateStarted || rawText(rawRecord, 'DateStarted'),
    DateResolved: ext?.iTSSRDateResolved || rawText(rawRecord, 'DateResolved'),
    DateNotifiedRequestor: ext?.iTSSRDateNotified || rawText(rawRecord, 'DateNotifiedRequestor'),
    DateAccepted: ext?.iTSSRDateAccepted || rawText(rawRecord, 'DateAccepted'),
    Solution: ext?.iTSSRSolution || rawText(rawRecord, 'Solution'),
    ITRemarks: ext?.iTSSRITRemarks || rawText(rawRecord, 'serviceRemarks', 'ServiceRemarks', 'ITRemarks'),
    ProblemCategory: ext?.iTSSRProblemCategory || rawText(rawRecord, 'ProblemCategory'),
    SecondaryCategory: ext?.iTSSRProblemCategory2 || rawText(rawRecord, 'SecondaryCategory'),
    Classification: ext?.iTSSRServiceType2 || rawText(rawRecord, 'Classification'),
    SupportMethod: ext?.iTSSRSupportMethod || rawText(rawRecord, 'SupportMethod'),
    SatisfactionRating: ext?.iTSSRSatisfactionRating || Number(rawText(rawRecord, 'SatisfactionRating')) || undefined,
    ReportedByEmail: ext?.iTSSRReportedByEmail || rawText(rawRecord, 'ReportedByEmail') || section1.ReportedByEmail || record.requestoremail,
    RequestorAttachment: rawText(rawRecord, 'RequestorAttachment') || section1.RequestorAttachment,
    RequestorComment: ext?.iTSSRRequestorComment || rawText(rawRecord, 'RequestorComment'),
    SubmittedBy: record.requestorName || rawText(rawRecord, 'SubmittedBy'),
    SubmittedDate: record.submitteddate || rawText(rawRecord, 'SubmittedDate'),
    // CS sub-state + Pending flag
    itPending: ext?.iTSSRCS === '2',
    itPendingDate: ext?.iTSSRPendingDate || rawText(rawRecord, 'itPendingDate'),
    // PanCen fields
    ou: ext?.iTSSROU || rawText(rawRecord, 'ou'),
    type2: ext?.iTSSRType2 || rawText(rawRecord, 'type2'),
    cooApp: ext?.iTSSRCOOApproval || rawText(rawRecord, 'cooApp'),
    itVerificationBy: ext?.iTSSRVerifiedBy || rawText(rawRecord, 'itVerificationBy'),
    itVerificationDate: ext?.iTSSRVerificationDate || rawText(rawRecord, 'itVerificationDate'),
    itManagerApprovedBy: ext?.iTSSRManagerBy || rawText(rawRecord, 'itManagerApprovedBy'),
    itManagerApprovedDate: ext?.iTSSRManagerDate || rawText(rawRecord, 'itManagerApprovedDate'),
    cooApprovedBy: ext?.iTSSRCOOBy || rawText(rawRecord, 'cooApprovedBy'),
    cooApprovedDate: ext?.iTSSRCOODate || rawText(rawRecord, 'cooApprovedDate'),
  };
}

function useITSSRRecords(pageIndex: number, pageSize: number) {
  return useQuery({
    queryKey: ['itssr-records', pageIndex, pageSize],
    queryFn: async () => {
      const records = await MainDBITService.getAll({
        filter: buildFormCodeFilter(ITSSR_CODE),
        orderBy: ['submitteddate desc'],
        top: pageSize,
        skip: pageIndex * pageSize,
      });
      const extRecords = records.length > 0
        ? await MainDBITExtSupportService.getAll({
          filter: buildParentRecordSetFilter(records),
          top: pageSize,
        })
        : [];

      return records.map((record) => {
        const ext = findITSSRExtSupport(record, extRecords);
        return mapITSSRRecord(record, ext);
      });
    },
  });
}

function useITSSRRecord(id?: string) {
  return useQuery({
    queryKey: ['itssr-record', id],
    queryFn: async () => {
      if (!id) return null;
      const record = await MainDBITService.get(id);
      const extRecords = await MainDBITExtSupportService.getAll({
        filter: buildParentRecordFilter(record),
        top: 3,
      });
      const ext = findITSSRExtSupport(record, extRecords);
      return mapITSSRRecord(record, ext);
    },
    enabled: !!id,
  });
}

function useITSSRDocuments(record?: MainDBIT | null) {
  return useQuery({
    queryKey: ['itssr-documents', record?.id, record?.title],
    queryFn: async () => {
      if (!record) return [];
      const docs = await MainDBITExtDocsService.getAll({
        filter: buildParentRecordFilter(record),
        orderBy: ['title asc'],
        top: 25,
      });
      return docsForRecord(record, docs);
    },
    enabled: !!record,
  });
}

function useITSSRAccess(record?: ITSSRRecord | null) {
  const { data: user } = useUser();
  const { role } = useRoleAccess();
  const { data: adminEmails = [] } = useAdminEmails();
  const userEmail = user?.userPrincipalName?.toLowerCase() || '';
  const isITAdmin = role === 'admin' || adminEmails.includes(userEmail);
  const isRequestor = !record || personEmail(record.ReportedByEmail) === userEmail || record.requestoremail?.toLowerCase() === userEmail;
  const isITPIC = isITAdmin || emailListIncludes(record?.AssignedToEmail, userEmail) || emailListIncludes(record?.SendToEmail, userEmail);

  return { user, userEmail, isITAdmin, isRequestor, isITPIC };
}

function Field({ label, children, required }: { label: string; children: ReactNode; required?: boolean }) {
  return (
    <label className="grid min-w-0 content-start gap-2 text-sm font-medium text-slate-700">
      <span>{label}{required ? <span className="text-red-600"> *</span> : null}</span>
      {children}
    </label>
  );
}

function inputClass(readOnly?: boolean) {
  return `h-11 w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 ${readOnly ? 'bg-slate-100 text-slate-600' : ''}`;
}

function SelectField({ value, onChange, options, disabled }: { value?: string; onChange: (value: string) => void; options: readonly string[]; disabled?: boolean }) {
  return (
    <select className={inputClass(disabled)} value={value || ''} onChange={(event) => onChange(event.target.value)} disabled={disabled} title={value || ''}>
      <option value="">Select</option>
      {options.map((option) => <option key={option} value={option} title={option}>{option}</option>)}
    </select>
  );
}

function StatusBadge({ status, pending }: { status: ITSSRCaseStatus; pending?: boolean }) {
  const colors: Record<ITSSRCaseStatus, string> = {
    Draft: 'border-slate-300 bg-slate-100 text-slate-700',
    Submitted: 'border-blue-300 bg-blue-50 text-blue-800',
    InProgress: 'border-amber-300 bg-amber-50 text-amber-800',
    Resolved: 'border-emerald-300 bg-emerald-50 text-emerald-800',
    Accepted: 'border-green-300 bg-green-50 text-green-800',
    Closed: 'border-slate-300 bg-slate-100 text-slate-700',
    Denied: 'border-red-300 bg-red-50 text-red-800',
  };
  return <span className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${colors[status]}`}>{status}{pending ? ' (Pending)' : ''}</span>;
}

function StageTimeline({ status }: { status: ITSSRCaseStatus }) {
  const current = stageNumber(status);
  const isDenied = status === 'Denied';
  const stages = isDenied ? ['Submit', 'Denied'] : ['Submit', 'IT Review', 'Resolve', 'Accept', 'Closed']; // Denied has special shorter timeline
  return (
    <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-5">
      {stages.map((stage, index) => {
        const number = index + 1;
        const color = number < current ? 'bg-emerald-800' : number === current ? 'bg-blue-800' : 'bg-slate-300';
        return (
          <div key={stage} className="flex items-center gap-3 sm:flex-col sm:items-start">
            <span className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white sm:h-8 sm:w-8 sm:text-xs ${color}`}>{number}</span>
            <span className="text-sm font-medium text-slate-700">{stage}</span>
          </div>
        );
      })}
    </div>
  );
}

function LockedOverlay({ show, message }: { show: boolean; message: string }) {
  if (!show) return null;
  return (
    <div className="absolute inset-x-0 bottom-0 top-14 z-10 flex items-center justify-center rounded-b-lg bg-slate-100/80 px-4">
      <div className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
        <Lock className="h-4 w-4" />
        {message}
      </div>
    </div>
  );
}

function Section({
  title,
  actor,
  active,
  locked,
  lockMessage,
  children,
}: {
  title: string;
  actor: 'requestor' | 'it';
  active: boolean;
  locked: boolean;
  lockMessage: string;
  children: ReactNode;
}) {
  const stripe = active ? (actor === 'requestor' ? 'bg-emerald-800' : 'bg-blue-800') : 'bg-slate-300';

  return (
    <section className="relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center border-b border-slate-200 bg-slate-50">
        <span className={`h-14 w-1 ${stripe}`} />
        <h2 className="ml-3 text-base font-semibold text-slate-900">{title}</h2>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 p-5 md:grid-cols-2">{children}</div>
      <LockedOverlay show={locked} message={lockMessage} />
    </section>
  );
}


function DocumentGallery({ documents, isLoading }: { documents: MainDBITExtDocs[]; isLoading: boolean }) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-600" />
          <h2 className="text-base font-semibold text-slate-900">Document Gallery</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{documents.length} files</span>
      </div>
      {isLoading ? <p className="p-4 text-sm text-slate-500">Loading documents...</p> : null}
      {!isLoading && documents.length === 0 ? (
        <p className="p-4 text-sm text-slate-500">No document metadata found for this ITSSR case.</p>
      ) : null}
      {documents.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {documents.map((doc) => {
            const url = documentUrl(doc);
            const title = doc.iTPDocTitle || doc.iTISubject || doc.iOIPTitle || doc.title;
            const type = doc.iTPDocType || doc.iTIInfoType || doc.iOIPCategory || 'Document';
            return (
              <div key={doc.id} className="grid gap-3 px-4 py-3 md:grid-cols-[1fr_140px_120px_120px] md:items-center">
                <div>
                  <p className="font-semibold text-slate-900">{title}</p>
                  <p className="text-sm text-slate-500">{doc.iTPComments || doc.iTIRemarks || doc.iOIPDescription || 'No link/comment captured'}</p>
                </div>
                <span className="text-sm text-slate-600">{type}</span>
                <span className="text-sm text-slate-600">v{doc.iTPVersionNo || doc.iOIPVersionNo || '-'} / r{doc.iTPRevisionNo || '-'}</span>
                {url ? (
                  <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    <ExternalLink className="h-4 w-4" /> Open
                  </a>
                ) : (
                  <span className="text-sm text-slate-400">No URL</span>
                )}
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

function usePatchITSSR(record?: ITSSRRecord | null) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ status, values }: { status: ITSSRCaseStatus; values: Partial<ITSSRRecord> }) => {
      const id = record?.id;
      if (!id) throw new Error('Missing ITSSR record ID');

      const mainPatch: Partial<Omit<MainDBIT, 'id'>> = {
        currentStatus: mapCurrentStatus(status),
        workflowstage: stageNumber(status),
      };
      if (values.ReportedByEmail !== undefined) {
         mainPatch.requestoremail = personEmail(values.ReportedByEmail);
      }
      if (values.SubmittedDate !== undefined) {
        mainPatch.submitteddate = values.SubmittedDate;
      }
      if (SECTION1_FIELDS.some((field) => values[field] !== undefined)) {
        mainPatch.remarks = buildITSSRRemarksSummary(values);
      }
      await MainDBITService.update(String(id), mainPatch);

      const extPatch: Partial<Omit<MainDBITExtSupport, 'id'>> = {};
      if (values.Department !== undefined) extPatch.iTSSRDepartment = values.Department;
      if (values.PhoneExtension !== undefined) extPatch.iTSSRExtension = values.PhoneExtension;
      if (values.ServiceType !== undefined) extPatch.iTSSRServiceType = values.ServiceType;
      if (values.Hardware !== undefined) extPatch.iTSSRHardware = values.Hardware;
      if (values.Application !== undefined) extPatch.iTSSRApplication = values.Application;
      if (values.CCEmail !== undefined) extPatch.iTSSRCC = typeof values.CCEmail === 'string' ? values.CCEmail : '';
      if (values.ProblemDescription !== undefined) extPatch.iTSSRProblemDescription = values.ProblemDescription;
      if (values.SendToEmail !== undefined) extPatch.iTSSRSendToEmail = personEmail(values.SendToEmail);
      if (values.AssignedToEmail !== undefined) extPatch.iTSSRAssignedToEmail = personEmail(values.AssignedToEmail);
      if (values.ITRemarks !== undefined) extPatch.iTSSRITRemarks = values.ITRemarks;
      if (values.DateStarted !== undefined) extPatch.iTSSRDateStarted = values.DateStarted;
      if (values.DateResolved !== undefined) extPatch.iTSSRDateResolved = values.DateResolved;
      if (values.DateNotifiedRequestor !== undefined) extPatch.iTSSRDateNotified = values.DateNotifiedRequestor;
      if (values.DateAccepted !== undefined) extPatch.iTSSRDateAccepted = values.DateAccepted;
      if (values.Solution !== undefined) extPatch.iTSSRSolution = values.Solution;
      if (values.ProblemCategory !== undefined) extPatch.iTSSRProblemCategory = values.ProblemCategory;
      if (values.SecondaryCategory !== undefined) extPatch.iTSSRProblemCategory2 = values.SecondaryCategory;
      if (values.Classification !== undefined) extPatch.iTSSRServiceType2 = values.Classification;
      if (values.SupportMethod !== undefined) extPatch.iTSSRSupportMethod = values.SupportMethod;
      if (values.SatisfactionRating !== undefined) extPatch.iTSSRSatisfactionRating = values.SatisfactionRating;
      if (values.RequestorComment !== undefined) extPatch.iTSSRRequestorComment = values.RequestorComment;
      if (values.ReportedByEmail !== undefined) extPatch.iTSSRReportedByEmail = personEmail(values.ReportedByEmail);
      // CS sub-state: iTSSRCS = '0' (Rejected), '1' (Closed), '2' (Pending)
      if (values.csState !== undefined) extPatch.iTSSRCS = String(values.csState);
      if (values.itPendingDate !== undefined) extPatch.iTSSRPendingDate = values.itPendingDate;
      // PanCen fields
      if (values.ou !== undefined) extPatch.iTSSROU = values.ou;
      if (values.type2 !== undefined) extPatch.iTSSRType2 = values.type2;
      if (values.cooApp !== undefined) extPatch.iTSSRCOOApproval = values.cooApp;
      if (values.itVerificationBy !== undefined) extPatch.iTSSRVerifiedBy = values.itVerificationBy;
      if (values.itVerificationDate !== undefined) extPatch.iTSSRVerificationDate = values.itVerificationDate;
      if (values.itManagerApprovedBy !== undefined) extPatch.iTSSRManagerBy = values.itManagerApprovedBy;
      if (values.itManagerApprovedDate !== undefined) extPatch.iTSSRManagerDate = values.itManagerApprovedDate;
      if (values.cooApprovedBy !== undefined) extPatch.iTSSRCOOBy = values.cooApprovedBy;
      if (values.cooApprovedDate !== undefined) extPatch.iTSSRCOODate = values.cooApprovedDate;

      if (Object.keys(extPatch).length > 0) {
        if (record?.extSupportId) {
          await MainDBITExtSupportService.update(String(record.extSupportId), extPatch);
        } else {
          const title = record?.title || `${ITSSR_CODE}-${id}`;
          await MainDBITExtSupportService.create({
            title,
            parentFormCode: ITSSR_CODE,
            parentRecord: { id, title },
            iTSSRCaseNo: title,
            ...extPatch,
          } as Omit<MainDBITExtSupport, 'id'>);
        }
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['itssr-records'] });
      client.invalidateQueries({ queryKey: ['itssr-record', String(record?.id)] });
    },
  });
}

export function ITSSRListScreen() {
  const navigate = useNavigate();
  const access = useITSSRAccess();
  const client = useQueryClient();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<ITSSRCaseStatus | 'All'>('All');
  const [activeListTab, setActiveListTab] = useState<'mine' | 'itpic'>('mine');
  const [withdrawTarget, setWithdrawTarget] = useState<ITSSRRecord | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const { data: records = [], isLoading, isFetching } = useITSSRRecords(pageIndex, ITSSR_PAGE_SIZE);

  useEffect(() => {
    setPageIndex(0);
  }, [searchText, statusFilter, activeListTab, access.isITAdmin, access.userEmail]);

  // Sort by most recent first (submitteddate descending)
  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      const dateA = a.submitteddate ? new Date(a.submitteddate).getTime() : 0;
      const dateB = b.submitteddate ? new Date(b.submitteddate).getTime() : 0;
      return dateB - dateA;
    });
  }, [records]);

  const isMySubmissionRecord = (record: ITSSRRecord) => (
    personEmail(record.ReportedByEmail) === access.userEmail ||
    record.requestoremail?.toLowerCase() === access.userEmail
  );
  const isITPICRecord = (record: ITSSRRecord) => (
    access.isITAdmin ||
    emailListIncludes(record.AssignedToEmail, access.userEmail) ||
    emailListIncludes(record.SendToEmail, access.userEmail)
  );
  const hasITPICTab = useMemo(() => sortedRecords.some(isITPICRecord), [sortedRecords, access.isITAdmin, access.userEmail]);

  useEffect(() => {
    if (activeListTab === 'itpic' && !hasITPICTab) setActiveListTab('mine');
  }, [activeListTab, hasITPICTab]);

  const visibleRecords = useMemo(() => sortedRecords.filter((record) => {
    const recStatus = statusOf(record);
    if (statusFilter !== 'All' && recStatus !== statusFilter) return false;
    const query = searchText.trim().toLowerCase();
    if (query) {
      const haystack = [
        record.title,
        record.ProblemDescription,
        record.remarks,
        personName(record.ReportedByEmail),
        personEmail(record.ReportedByEmail),
        personName(record.AssignedToEmail),
        personEmail(record.AssignedToEmail),
        personName(record.SendToEmail),
        personEmail(record.SendToEmail),
      ].filter(Boolean).join(' ').toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return activeListTab === 'mine' ? isMySubmissionRecord(record) : isITPICRecord(record);
  }), [sortedRecords, access.isITAdmin, access.userEmail, searchText, statusFilter, activeListTab]);

  const withdrawMutation = useMutation({
    mutationFn: async (record: ITSSRRecord) => {
      await MainDBITService.update(String(record.id), {
        currentStatus: 'Draft',
        workflowstage: 0,
      });
    },
    onSuccess: (_data, record) => {
      client.invalidateQueries({ queryKey: ['itssr-records'] });
      toast.success('Request returned to Draft. You can now edit it.');
      setWithdrawTarget(null);
      navigate(getITFormDetailPath(ITSSR_CODE, record.id));
    },
    onError: () => toast.error('Unable to update the record.'),
  });

  // Color coding per status
  const statusColors: Record<ITSSRCaseStatus, { bg: string; text: string; dot: string }> = {
    Draft: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
    Denied: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
    Submitted: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
    InProgress: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
    Resolved: { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500' },
    Accepted: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    Closed: { bg: 'bg-slate-100', text: 'text-slate-500', dot: 'bg-slate-400' },
  };

  return (
    <main className="mx-auto grid max-w-6xl gap-5 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">MainDB_IT</p>
          <h1 className="text-2xl font-semibold text-slate-950">IT Support & Service Requests</h1>
          <p className="text-sm text-slate-500 mt-1">
            {visibleRecords.length} visible on page {pageIndex + 1} · {activeListTab === 'mine' ? 'My Submission' : 'IT PIC'}
          </p>
        </div>
        <Link to={ITSSR_NEW_PATH} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-emerald-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-900">
          <Plus className="h-4 w-4" /> New {ITSSR_CODE}
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-3 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">Total Active</p>
          <p className="text-xl font-bold text-slate-900">{sortedRecords.filter(r => statusOf(r) !== 'Accepted' && statusOf(r) !== 'Closed' && statusOf(r) !== 'Denied').length}</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase text-amber-700">In Progress</p>
          <p className="text-xl font-bold text-amber-900">{sortedRecords.filter(r => statusOf(r) === 'InProgress' || statusOf(r) === 'Submitted').length}</p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase text-emerald-700">Resolved</p>
          <p className="text-xl font-bold text-emerald-900">{sortedRecords.filter(r => statusOf(r) === 'Resolved').length}</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase text-red-700">Escalated (&gt;2h)</p>
          <p className="text-xl font-bold text-red-900">
            {sortedRecords.filter(r => {
              if (statusOf(r) !== 'InProgress' && statusOf(r) !== 'Submitted') return false;
              if (!r.submitteddate) return false;
              const hours = (Date.now() - new Date(r.submitteddate).getTime()) / 3600000;
              return hours > 2;
            }).length}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveListTab('mine')}
          className={`inline-flex min-h-11 items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
            activeListTab === 'mine'
              ? 'bg-emerald-800 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="h-4 w-4" />
          My Submission
        </button>
        {hasITPICTab ? (
          <button
            type="button"
            onClick={() => setActiveListTab('itpic')}
            className={`inline-flex min-h-11 items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
              activeListTab === 'itpic'
                ? 'bg-emerald-800 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            IT PIC
          </button>
        ) : null}
      </div>

      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_160px]">
        <label className="grid gap-1.5 text-sm font-medium text-slate-700">
          <span>Search cases</span>
          <span className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className={`${inputClass()} w-full pl-9`}
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Case, requestor, assignee, problem"
            />
          </span>
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-slate-700">
          <span>Status</span>
          <select className={`${inputClass()} w-full`} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as ITSSRCaseStatus | 'All')}>
            {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Loading ITSSR cases...</div>
        ) : null}

        {visibleRecords.map((record) => {
          const recStatus = statusOf(record);
          const colors = statusColors[recStatus] || statusColors.Draft;
          const isOwner = access.isITAdmin || personEmail(record.ReportedByEmail) === access.userEmail;
          const requestorName = personName(record.ReportedByEmail) || record.requestoremail?.split('@')[0] || 'N/A';
          const requestorEmail = personEmail(record.ReportedByEmail) || record.requestoremail || '';
          const assignedName = personName(record.AssignedToEmail);
          const assignedEmail = personEmail(record.AssignedToEmail);
          const routedName = personName(record.SendToEmail);
          const routedEmail = personEmail(record.SendToEmail);
          const ownerLabel = assignedEmail ? 'Assigned' : routedEmail ? 'Routed / Not Assigned' : 'Unassigned';
          const ownerName = assignedName || routedName;
          const ownerEmail = assignedEmail || routedEmail;

          return (
            <div
              key={record.id}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigate(getITFormDetailPath(ITSSR_CODE, record.id))}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left: main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${colors.dot} shrink-0`} />
                    <h3 className="font-semibold text-slate-900 truncate">{record.title}</h3>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text}`}>
                      {recStatus}
                    </span>
                    <span className="text-xs text-slate-400 shrink-0">Stage {stageNumber(recStatus)}/5</span>
                    {/* Escalation indicator — tickets in progress >2 hours */}
                    {(() => {
                      if (recStatus !== 'InProgress' && recStatus !== 'Submitted') return null;
                      if (!record.submitteddate) return null;
                      const hours = (Date.now() - new Date(record.submitteddate).getTime()) / 3600000;
                      if (hours <= 2) return null;
                      return (
                        <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700" title={`Waiting ${Math.round(hours)}h — escalated`}>
                          <Clock className="h-3 w-3" />
                          {Math.round(hours)}h
                        </span>
                      );
                    })()}
                  </div>

                  <p className="line-clamp-2 text-sm text-slate-600 mb-3">
                    {record.ProblemDescription || record.remarks || 'No description'}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    {/* Requestor */}
                    <span className="flex items-center gap-1" title={requestorEmail}>
                      <FileText className="h-3 w-3 text-slate-400" />
                      <span>Requestor: <strong className="text-slate-700">{requestorName}</strong></span>
                      {requestorEmail && (
                        <a href={`mailto:${requestorEmail}`} onClick={(e) => e.stopPropagation()} className="text-blue-600 hover:text-blue-800 hover:underline ml-1">
                          {requestorEmail}
                        </a>
                      )}
                    </span>

                    {/* IT Owner */}
                    {ownerEmail ? (
                      <span className="flex items-center gap-1" title={ownerEmail}>
                        <UserCheck className="h-3 w-3 text-amber-600" />
                        <span>{ownerLabel}: <strong className="text-slate-700">{ownerName || ownerEmail}</strong></span>
                        <a href={`mailto:${ownerEmail}`} onClick={(e) => e.stopPropagation()} className="text-blue-600 hover:text-blue-800 hover:underline ml-1">
                          {ownerEmail}
                        </a>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <UserCheck className="h-3 w-3 text-slate-300" />
                        <span className="text-slate-400">Unassigned</span>
                      </span>
                    )}

                    {/* Date */}
                    {record.submitteddate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        {format(new Date(record.submitteddate), 'MMM dd, yyyy')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button type="button" onClick={(e) => { e.stopPropagation(); navigate(getITFormDetailPath(ITSSR_CODE, record.id)); }} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" title="View details" aria-label={`View ${record.title}`}>
                    <Eye className="h-4 w-4" />
                  </button>
                  {isOwner && (recStatus === 'Submitted' || recStatus === 'InProgress') && (
                    <button type="button" onClick={(e) => { e.stopPropagation(); setWithdrawTarget(record); }} disabled={withdrawMutation.isPending} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-amber-300 px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-50" title="Return to Draft" aria-label={`Return ${record.title} to Draft`}>
                      <RotateCcw className="h-4 w-4" />
                      <span className="hidden lg:inline">Draft</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {!isLoading && visibleRecords.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-10 text-center">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600">No ITSSR records visible for your current role.</p>
            <p className="text-xs text-slate-400 mt-1">
              {access.isITAdmin ? 'No records found in the system.' : 'You can view records you submitted or are assigned to.'}
            </p>
          </div>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        <span>
          Showing page {pageIndex + 1}{isFetching ? ' · Refreshing...' : ''}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            className="min-h-11 rounded-md border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            disabled={pageIndex === 0 || isFetching}
            onClick={() => setPageIndex((current) => Math.max(0, current - 1))}
          >
            Previous
          </button>
          <button
            type="button"
            className="min-h-11 rounded-md border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            disabled={records.length < ITSSR_PAGE_SIZE || isFetching}
            onClick={() => setPageIndex((current) => current + 1)}
          >
            Next
          </button>
        </div>
      </div>
      <Dialog open={!!withdrawTarget} onOpenChange={(open) => { if (!open) setWithdrawTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return request to Draft?</DialogTitle>
            <DialogDescription>
              This will move {withdrawTarget?.title || 'this request'} back to Draft so the requestor can edit it again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button type="button" className="min-h-11 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={() => setWithdrawTarget(null)}>
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
              disabled={!withdrawTarget || withdrawMutation.isPending}
              onClick={() => withdrawTarget && withdrawMutation.mutate(withdrawTarget)}
            >
              <RotateCcw className="h-4 w-4" /> Return to Draft
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function RequestFields({ form, setForm, readOnly, onlySectionOne = false }: { form: Partial<ITSSRRecord>; setForm: (patch: Partial<ITSSRRecord>) => void; readOnly: boolean; onlySectionOne?: boolean }) {
  return (
    <>
      <Field label="Site" required>
        <SelectField
          value={form.Site || 'MY-PR'}
          onChange={(Site) => setForm({ Site })}
          options={['MY-PR', 'MY-JH']}
          disabled={readOnly}
        />
      </Field>
      <Field label="Company" required><SelectField value={form.Company} onChange={(Company) => setForm({ Company })} options={ITSSR_COMPANIES} disabled={readOnly} /></Field>
      <Field label="Department" required><SelectField value={form.Department} onChange={(Department) => setForm({ Department })} options={ITSSR_DEPARTMENTS} disabled={readOnly} /></Field>
      <Field label="Service Type" required><SelectField value={form.ServiceType} onChange={(ServiceType) => setForm({ ServiceType, Hardware: '', Application: '' })} options={ITSSR_SERVICE_TYPES} disabled={readOnly} /></Field>
      {form.ServiceType === 'Hardware' ? <Field label="Hardware"><SelectField value={form.Hardware} onChange={(Hardware) => setForm({ Hardware })} options={ITSSR_HARDWARE_ITEMS} disabled={readOnly} /></Field> : null}
      {form.ServiceType === 'Software' ? <Field label="Application"><SelectField value={form.Application} onChange={(Application) => setForm({ Application })} options={ITSSR_APPLICATIONS} disabled={readOnly} /></Field> : null}
      <div className="md:col-span-2 grid md:grid-cols-2 gap-x-6 items-center">
        <Field label="Reported By Email" required>
          <EmployeePicker
            value={personEmail(form.ReportedByEmail)}
            onChange={(_email: string, employee) => {
              if (employee) {
                setForm({ ReportedByEmail: toPerson(employee.email, employee.fullName) });
              } else {
                setForm({ ReportedByEmail: undefined });
              }
            }}
            placeholder="Search by full name or type email..."
            showEmail
            showTitle
          />
        </Field>
        <Field label="Phone Extension"><input className={inputClass(readOnly)} value={form.PhoneExtension || ''} onChange={(event) => setForm({ PhoneExtension: event.target.value })} readOnly={readOnly} /></Field>
      </div>
      <div className="md:col-span-2 grid md:grid-cols-2 gap-x-6 items-start">
        <Field label="Send To Email" required>
          {form.SendToEmail && personEmail(form.SendToEmail) ? (
            <div className="flex min-h-11 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              <Headset className="h-4 w-4 shrink-0 text-emerald-600" />
              <span className="truncate">{personName(form.SendToEmail)}</span>
              <span className="min-w-0 truncate text-xs text-slate-400">&lt;{personEmail(form.SendToEmail)}&gt;</span>
            </div>
          ) : (
            <div className="flex min-h-11 items-center rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Assigned automatically after selecting Service Type &amp; Department.
            </div>
          )}
        </Field>
        <Field label="CC Email">
          <EmployeePicker
            value={typeof form.CCEmail === 'string' ? form.CCEmail : ''}
            onChange={(_email: string, employee) => {
              if (employee) {
                setForm({ CCEmail: `${employee.fullName} <${employee.email}>` });
              } else {
                setForm({ CCEmail: '' });
              }
            }}
            placeholder="Search or type a full name..."
            showEmail
          />
        </Field>
      </div>
      <Field label="Attachment">
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
            <input
              type="file"
              className="hidden"
              disabled={readOnly}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setForm({
                    RequestorAttachment: file.name,
                    _attachmentFile: file,
                    _attachmentSize: file.size,
                    _attachmentType: file.type,
                  });
                  toast.success(`Selected: ${file.name}`);
                }
              }}
            />
            <Upload className="h-4 w-4" />
            <span className="text-xs">{form.RequestorAttachment ? 'Change file' : 'Browse files...'}</span>
          </label>
          {form.RequestorAttachment ? (
            <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
              <FileText className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate flex-1">{form.RequestorAttachment}</span>
              {!readOnly ? (
                <button type="button" onClick={() => setForm({ RequestorAttachment: '', _attachmentFile: undefined, _attachmentSize: undefined, _attachmentType: undefined })} className="shrink-0 text-slate-400 hover:text-red-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </Field>
      <label className="grid min-w-0 content-start gap-2 text-sm font-medium text-slate-700 md:col-span-2">
        <span>Problem Description <span className="text-red-600">*</span></span>
        <textarea className={`${inputClass(readOnly)} min-h-28`} value={form.ProblemDescription || ''} onChange={(event) => setForm({ ProblemDescription: event.target.value })} readOnly={readOnly} />
      </label>
      {onlySectionOne ? null : (
        <>
          <Field label="Submitted By"><input className={inputClass(true)} value={form.SubmittedBy || ''} readOnly /></Field>
          <Field label="Submitted Date"><input className={inputClass(true)} value={form.SubmittedDate ? new Date(form.SubmittedDate).toLocaleString() : ''} readOnly /></Field>
        </>
      )}
    </>
  );
}

export function ITSSRNewScreen() {
  const navigate = useNavigate();
  const client = useQueryClient();
  const { data: user } = useUser();
  const userEmail = user?.userPrincipalName || '';
  const [form, setFormState] = useState<Partial<ITSSRRecord>>({
    Company: '',
    Site: 'MY-PR',
    Department: '',
    ServiceType: '',
    ReportedByEmail: toPerson(userEmail, user?.fullName),
    SendToEmail: undefined,
    ProblemDescription: '',
    SubmittedBy: user?.fullName || 'Current User',
  });
  const setForm = (patch: Partial<ITSSRRecord>) => setFormState((current) => ({ ...current, ...patch }));
  const routing = useMemo(
    () => determineITSSRRouting({
      serviceType: form.ServiceType as ITSSRServiceType | undefined,
      application: form.Application,
      department: form.Department,
    }),
    [form.ServiceType, form.Application, form.Department]
  );

  useEffect(() => {
    if (!userEmail) return;
    setFormState((current) => {
      if (personEmail(current.ReportedByEmail)) return current;
      return {
        ...current,
        ReportedByEmail: toPerson(userEmail, user?.fullName),
        SubmittedBy: user?.fullName || current.SubmittedBy || 'Current User',
      };
    });
  }, [userEmail, user?.fullName]);

  useEffect(() => {
    if (!routing.primaryPICEmail) return;
    setFormState((current) => ({
      ...current,
      SendToEmail: toPerson(routing.primaryPICEmail, routing.primaryPICName),
    }));
  }, [routing.primaryPICEmail, routing.primaryPICName]);

  // Capture routed PIC for use in onSuccess callback (out of mutationFn scope)
  const routedPIC = routing.primaryPICEmail ? toPerson(routing.primaryPICEmail, routing.primaryPICName) : form.SendToEmail;

  const create = useMutation({
    mutationFn: async () => {
      const now = new Date().toISOString();
      const createdAt = new Date();
      const temporaryTitle = `${ITSSR_CODE}-${createdAt.getFullYear()}${String(createdAt.getDate()).padStart(2, '0')}${String(createdAt.getMonth() + 1).padStart(2, '0')}-draft-${Date.now().toString().slice(-4)}`;
      const remarks = buildITSSRRemarksSummary(form, routedPIC);
      const draft = await MainDBITService.create({
        title: temporaryTitle,
        currentStatus: mapCurrentStatus('Submitted'),
        formcode: ITSSR_CODE,
        environmenttagKey: 'EnvironmenttagKey0',
        islocked: false,
        siteKey: mapLocationToSiteKey(form.Site || 'MY-PR'),
        remarks,
        requestoremail: personEmail(form.ReportedByEmail),
        submitteddate: now,
        workflowstage: stageNumber('Submitted'),
      } as Omit<MainDBIT, 'id'>);
      const finalTitle = formatITSSRCaseTitle(draft.id, createdAt);
      const submitted = await MainDBITService.update(String(draft.id), { title: finalTitle });

      await MainDBITExtSupportService.create({
        title: finalTitle,
        parentFormCode: ITSSR_CODE,
        parentRecord: { id: submitted.id, title: finalTitle },
        iTSSRCaseNo: finalTitle,
        iTSSRServiceType: form.ServiceType,
        iTSSRProblemDescription: form.ProblemDescription,
        iTSSRReportedByEmail: personEmail(form.ReportedByEmail),
        iTSSRProblemCategory: form.ProblemCategory || form.ServiceType,
        iTSSRSupportMethod: form.SupportMethod || 'Remote',
        iTSSRDepartment: form.Department,
        iTSSRExtension: form.PhoneExtension,
        iTSSRHardware: form.Hardware,
        iTSSRApplication: form.Application,
        iTSSRCC: typeof form.CCEmail === 'string' ? form.CCEmail : '',
        iTSSRSendToEmail: personEmail(routedPIC),
      } as Omit<MainDBITExtSupport, 'id'>);
      await createITSSRDocument(
        submitted,
        'Requestor Attachment',
        form.RequestorAttachment || 'Requestor Attachment',
        form.RequestorAttachment
      ).catch(() => undefined);

      return submitted;
    },
    onSuccess: (submitted) => {
      const itEmail = personEmail(routedPIC);
      if (itEmail) OutlookEmailService.sendEmail({
        to: itEmail,
        subject: `[${ITSSR_CODE}] New Support Request Routed to You: ${submitted.title}`,
        body: `<p>A new IT support request has been submitted and routed to you.</p>
<p><strong>Case:</strong> ${submitted.title}</p>
<p><strong>Requestor:</strong> ${personName(form.ReportedByEmail)} (${personEmail(form.ReportedByEmail)})</p>
<p><strong>Company / Dept:</strong> ${form.Company || '–'} / ${form.Department || '–'}</p>
<p><strong>Service Type:</strong> ${form.ServiceType || '–'}</p>
<p><strong>Problem:</strong></p><blockquote style="border-left:3px solid #ccc;padding-left:10px;color:#555">${form.ProblemDescription || '–'}</blockquote>
<p>This case is now <strong>Submitted</strong>. Please log in to the IOI IT Platform and click <strong>Assign &amp; Start</strong> if you are taking ownership.</p>`,
      });
      client.invalidateQueries({ queryKey: ['itssr-records'] });
      toast.success('Request submitted to IT.');
      navigate(ITSSR_LIST_PATH);
    },
    onError: () => toast.error('Unable to create ITSSR item in MainDB_IT.'),
  });

  function submit() {
    if (!form.Company || !form.Department || !form.ServiceType || !personEmail(form.ReportedByEmail) || !routing.primaryPICEmail) {
      toast.warning('Please complete all required request fields.');
      return;
    }
    if (!form.ProblemDescription || form.ProblemDescription.trim().length < 10) {
      toast.warning('Please describe the problem (min 10 characters).');
      return;
    }
    create.mutate();
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-5 p-5 pb-24">
      <Link to={ITSSR_LIST_PATH} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"><ArrowLeft className="h-4 w-4" /> Back to {ITSSR_CODE} list</Link>
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <Section title="Section 1 - Your Request" actor="requestor" active locked={false} lockMessage="">
            <RequestFields form={form} setForm={setForm} readOnly={create.isPending} onlySectionOne />
            {routing.primaryPICEmail ? (
              <div className="md:col-span-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-950">
                Routed to: <span className="font-semibold">{routing.primaryPICName}</span> ({routing.primaryPICEmail})
                {routing.picDescription ? <span className="block text-xs text-emerald-800">{routing.picDescription}</span> : null}
              </div>
            ) : null}
            <div className="sticky bottom-0 -mx-5 flex justify-end border-t border-slate-100 bg-white/95 px-5 pt-4 shadow-[0_-8px_16px_rgba(15,23,42,0.04)] md:col-span-2 sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:shadow-none" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
              <button type="button" onClick={submit} disabled={create.isPending} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-emerald-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-900 disabled:opacity-60 sm:w-auto">
                <Send className="h-4 w-4" /> Submit request
              </button>
            </div>
          </Section>
        </div>
        <div className="lg:sticky lg:top-5 lg:self-start">
          <RoutingSidebar routing={routing} form={form} />
        </div>
      </div>
    </main>
  );
}

export function ITSSRDetailScreen() {
  const navigate = useNavigate();
  const client = useQueryClient();
  const params = useParams<{ id: string }>();
  const { data: record, isLoading } = useITSSRRecord(params.id);
  const [draft, setDraft] = useState<Partial<ITSSRRecord>>({});
  const form = { ...(record || {}), ...draft } as ITSSRRecord;
  const status = statusOf(form);
  const access = useITSSRAccess(form);
  const patch = usePatchITSSR(record);
  const { data: documents = [], isLoading: documentsLoading } = useITSSRDocuments(record);
  const setForm = (next: Partial<ITSSRRecord>) => setDraft((current) => ({ ...current, ...next }));
  function updateStatus(nextStatus: ITSSRCaseStatus, values: Partial<ITSSRRecord>, message: string, notify?: () => void) {
    patch.mutate({ status: nextStatus, values }, {
      onSuccess: () => {
        setDraft({ CaseStatus: nextStatus, ...values });
        toast.success(message);
        notify?.();
      },
      onError: () => toast.error('Unable to update MainDB_IT. Check the generated connector and SharePoint columns.'),
    });
  }

  const isRequestor = access.isRequestor;
  const isIT = access.isITPIC;
  const canEditRequest = status === 'Draft' && isRequestor;
  const canEditAssignment = status === 'Submitted' && isIT;
  const canAssignAndStart = canEditAssignment && !personEmail(form.AssignedToEmail);
  const canEditResolution = status === 'InProgress' && isIT;
  const canEditAcceptance = status === 'Resolved' && isRequestor;
  /** CS=2 Pending flag — set by IT without changing CA. iTSSRCS='2' marks pending */
  const isPending = form.iTSSRCS === '2' || Boolean(form.itPending);
  /** PanCen check: Type2="NEW REQUEST DESKTOP/LAPTOP" and OU="PanCen" (maps to iTSSRType2, iTSSROU) */
  const isPanCenDesktop = form.type2 === 'NEW REQUEST DESKTOP/LAPTOP' || form.ServiceType === 'Hardware' && (form.Company?.toLowerCase().includes('pancen') || form.ou === 'PanCen');

  // Tab state
  const tabs = [
    { key: 'request', label: 'Request Details', icon: FileText, role: 'requestor' as const },
    { key: 'assignment', label: 'IT Assignment', icon: UserCheck, role: 'it' as const },
    { key: 'resolution', label: 'IT Resolution', icon: Wrench, role: 'it' as const },
    { key: 'acceptance', label: 'Acceptance', icon: CheckCircle2, role: 'requestor' as const },
    ...(isPanCenDesktop ? [{ key: 'pancen', label: 'PanCen Approval', icon: Building2, role: 'both' as const }] : []),
    { key: 'attachments', label: `Attachments (${documents.length})`, icon: Paperclip, role: 'both' as const },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].key);

  // Read-only field renderer
  function ReadonlyField({ label, value }: { label: string; value: ReactNode }) {
    return (
      <div className="grid gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900">
          {value ?? <span className="text-slate-400">—</span>}
        </div>
      </div>
    );
  }

  function TabButton({ tab }: { tab: typeof tabs[0] }) {
    const Icon = tab.icon;
    const isActive = activeTab === tab.key;
    return (
      <button type="button" onClick={() => setActiveTab(tab.key)} className={`flex min-h-11 items-center gap-2 rounded-t-lg px-4 py-3 text-sm font-semibold transition-colors ${isActive ? 'border-b-2 border-emerald-800 bg-white text-emerald-900 shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'}`}>
        <Icon className="h-4 w-4" />
        <span className="hidden sm:inline">{tab.label}</span>
        <span className="sm:hidden text-xs">{tab.label.split(' ')[0]}</span>
      </button>
    );
  }

  if (isLoading) return <main className="p-5 text-sm text-slate-500">Loading {ITSSR_CODE} detail...</main>;
  if (!record) return <main className="p-5 text-sm text-slate-500">{ITSSR_CODE} record not found.</main>;

  return (
    <main className="mx-auto grid max-w-6xl gap-4 p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-emerald-950 px-4 py-3 text-white shadow-sm">
        <button type="button" onClick={() => navigate(ITSSR_LIST_PATH)} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20"><ArrowLeft className="h-4 w-4" /> Back</button>
        <div className="min-w-0 flex-1 text-left sm:text-center">
          <p className="text-xs uppercase tracking-wide text-emerald-100">{ITSSR_CODE} Case</p>
          <h1 className="truncate text-xl font-semibold">{form.title}</h1>
        </div>
        <StatusBadge status={status} pending={isPending} />
               </div>

      {/* Stage Timeline */}
      <StageTimeline status={status} />

      {/* Tabs Navigation */}
      <div className="flex flex-wrap border-b border-slate-200 bg-slate-50 rounded-t-lg overflow-hidden">
        {tabs.map((tab) => <TabButton key={tab.key} tab={tab} />)}
      </div>

      {/* Tab Content */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        {/* ===== TAB: Request Details ===== */}
        {activeTab === 'request' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Request Details</h2>
              {isRequestor && <Badge className="bg-emerald-50 text-emerald-700 border-0">Your Section</Badge>}
              {isIT && !isRequestor && <Badge className="bg-blue-50 text-blue-800 border-0">Read Only</Badge>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {canEditRequest ? (
                <>
                  <Field label="Site" required>
                    <SelectField value={form.Site || 'MY-PR'} onChange={(Site) => setForm({ Site })} options={['MY-PR', 'MY-JH']} />
                  </Field>
                  <Field label="Company" required><SelectField value={form.Company} onChange={(Company) => setForm({ Company })} options={ITSSR_COMPANIES} /></Field>
                  <Field label="Department" required><SelectField value={form.Department} onChange={(Department) => setForm({ Department })} options={ITSSR_DEPARTMENTS} /></Field>
                  <Field label="Service Type" required><SelectField value={form.ServiceType} onChange={(ServiceType) => setForm({ ServiceType, Hardware: '', Application: '' })} options={ITSSR_SERVICE_TYPES} /></Field>
                  {form.ServiceType === 'Hardware' ? <Field label="Hardware"><SelectField value={form.Hardware} onChange={(Hardware) => setForm({ Hardware })} options={ITSSR_HARDWARE_ITEMS} /></Field> : null}
                  {form.ServiceType === 'Software' ? <Field label="Application"><SelectField value={form.Application} onChange={(Application) => setForm({ Application })} options={ITSSR_APPLICATIONS} /></Field> : null}
                  <Field label="Reported By" required>
                    <EmployeePicker value={personEmail(form.ReportedByEmail)} onChange={(_email: string, employee) => { setForm({ ReportedByEmail: employee ? toPerson(employee.email, employee.fullName) : undefined }); }} placeholder="Search by full name..." showEmail />
                  </Field>
                  <Field label="Phone Extension"><input className={inputClass()} value={form.PhoneExtension || ''} onChange={(event) => setForm({ PhoneExtension: event.target.value })} /></Field>
                  <Field label="CC Email"><EmployeePicker value={typeof form.CCEmail === 'string' ? form.CCEmail : ''} onChange={(_email: string, employee) => { setForm({ CCEmail: employee ? `${employee.fullName} <${employee.email}>` : '' }); }} placeholder="Search..." showEmail /></Field>
                  <div className="sm:col-span-2">
                    <Field label="Problem Description" required>
                      <textarea className={`${inputClass()} min-h-24`} value={form.ProblemDescription || ''} onChange={(event) => setForm({ ProblemDescription: event.target.value })} />
                    </Field>
                  </div>
                </>
              ) : (
                <>
                  <ReadonlyField label="Company" value={form.Company} />
                  <ReadonlyField label="Department" value={form.Department} />
                  <ReadonlyField label="Service Type" value={form.ServiceType} />
                  {form.ServiceType === 'Hardware' ? <ReadonlyField label="Hardware" value={form.Hardware} /> : null}
                  {form.ServiceType === 'Software' ? <ReadonlyField label="Application" value={form.Application} /> : null}
                  <ReadonlyField label="Reported By" value={`${personName(form.ReportedByEmail)} <${personEmail(form.ReportedByEmail)}>` || form.requestoremail} />
                  <ReadonlyField label="Phone Extension" value={form.PhoneExtension} />
                  <ReadonlyField label="CC Email" value={typeof form.CCEmail === 'string' ? form.CCEmail : personName(record.CCEmail?.[0])} />
                  <ReadonlyField label="Routed to (IT PIC)" value={`${personName(form.SendToEmail)} <${personEmail(form.SendToEmail)}>`} />
                  <div className="sm:col-span-2">
                    <ReadonlyField label="Problem Description" value={form.ProblemDescription || form.remarks} />
                  </div>
                </>
              )}
            </div>
            {canEditRequest && (
              <div className="sticky bottom-0 -mx-5 flex justify-end border-t border-slate-100 bg-white/95 px-5 pt-4 shadow-[0_-8px_16px_rgba(15,23,42,0.04)] sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:shadow-none" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
                <button type="button" onClick={() => {
                  if (!form.ProblemDescription || form.ProblemDescription.length < 10) toast.warning('Please describe the problem (min 10 characters).');
                  else updateStatus('Submitted', {
                    Company: form.Company, Department: form.Department, ServiceType: form.ServiceType,
                    Hardware: form.Hardware, Application: form.Application,
                    ReportedByEmail: form.ReportedByEmail, PhoneExtension: form.PhoneExtension,
                    SendToEmail: form.SendToEmail, CCEmail: form.CCEmail,
                    RequestorAttachment: form.RequestorAttachment,
                    ProblemDescription: form.ProblemDescription,
                    SubmittedDate: new Date().toISOString(),
                  }, 'Request submitted to IT.', () => {
                    const itTo = personEmail(form.SendToEmail);
                    if (itTo) OutlookEmailService.sendEmail({ to: itTo, subject: `[${ITSSR_CODE}] New Support Request: ${form.title}`, body: `<p>A new IT support request has been submitted.</p><p><strong>Case:</strong> ${form.title}</p><p><strong>Requestor:</strong> ${personName(form.ReportedByEmail)} (${personEmail(form.ReportedByEmail)})</p><p><strong>Problem:</strong></p><blockquote style="border-left:3px solid #ccc;padding-left:10px;color:#555">${form.ProblemDescription || '–'}</blockquote>` });
                  });
                }} disabled={patch.isPending} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-emerald-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-900 disabled:opacity-60 sm:w-auto">
                  <Send className="h-4 w-4" /> Submit
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===== TAB: IT Assignment ===== */}
        {activeTab === 'assignment' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">IT Assignment</h2>
              {isIT && <Badge className="bg-blue-50 text-blue-800 border-0">Your Section</Badge>}
              {isRequestor && !isIT && <Badge className="bg-slate-50 text-slate-600 border-0">IT Only</Badge>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {canEditAssignment ? (
                <>
                  <div className="sm:col-span-2">
                    <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                      <strong className="font-semibold">Routed from routing matrix:</strong>
                      <div className="mt-1 flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-emerald-700" />
                        <span>{personName(form.SendToEmail) || '—'}</span>
                        <span className="text-emerald-600">&lt;{personEmail(form.SendToEmail) || '—'}&gt;</span>
                      </div>
                      <p className="mt-1 text-xs text-emerald-700">
                        {canAssignAndStart ? <>Click <strong>Assign &amp; Start</strong> to assign this case to yourself and start work.</> : 'This case is already assigned.'}
                      </p>
                    </div>
                  </div>
                  <ReadonlyField label="Assigned To Email" value={personEmail(form.AssignedToEmail) || 'Will be set to your email when you click Assign & Start'} />
                  <div className="sm:col-span-2">
                    <Field label="IT Remarks"><textarea className={`${inputClass()} min-h-24`} value={form.ITRemarks || ''} onChange={(event) => setForm({ ITRemarks: event.target.value })} /></Field>
                  </div>
                </>
              ) : (
                <>
                  <ReadonlyField label="Assigned To" value={form.AssignedToEmail ? `${personName(form.AssignedToEmail)} <${personEmail(form.AssignedToEmail)}>` : 'Not assigned yet'} />
                  <ReadonlyField label="Date Started" value={form.DateStarted ? new Date(form.DateStarted).toLocaleString() : 'Not started'} />
                  <div className="sm:col-span-2">
                    <ReadonlyField label="IT Remarks" value={form.ITRemarks} />
                  </div>
                </>
              )}
            </div>
            {canEditAssignment && (
              <div className="sticky bottom-0 -mx-5 flex flex-col justify-end gap-3 border-t border-slate-100 bg-white/95 px-5 pt-4 shadow-[0_-8px_16px_rgba(15,23,42,0.04)] sm:static sm:mx-0 sm:flex-row sm:bg-transparent sm:px-0 sm:shadow-none" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
                {canAssignAndStart ? (
                  <button type="button" onClick={() => {
                    const assignedPerson = toPerson(access.userEmail, access.user?.fullName);
                    if (!personEmail(assignedPerson)) toast.warning('Unable to determine your email for assignment.');
                    else updateStatus('InProgress', { AssignedToEmail: assignedPerson, DateStarted: new Date().toISOString(), ITRemarks: form.ITRemarks, csState: undefined, itPending: undefined }, 'Case assigned. Now In Progress.', () => {
                      const requestorTo = form.requestoremail;
                      if (requestorTo) OutlookEmailService.sendEmail({ to: requestorTo, subject: `[${ITSSR_CODE}] Your Request ${form.title} is Now In Progress`, body: `<p>Your IT support request is now in progress.</p><p><strong>Assigned IT PIC:</strong> ${personEmail(assignedPerson) || '–'}</p>` });
                    });
                  }} disabled={patch.isPending} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-900 disabled:opacity-60 sm:w-auto">
                    <UserCheck className="h-4 w-4" /> Assign &amp; Start
                  </button>
                ) : null}
                {/* Pending CS=2 — IT sets pending flag without changing CA (Domino: CS="2") */}
                <button type="button" onClick={() => {
                  if (!form.ITRemarks) { toast.warning('Add IT remarks explaining the pending status'); return; }
                  updateStatus('Submitted', { csState: 2 as CSState, itPending: true, itPendingDate: new Date().toISOString(), ITRemarks: form.ITRemarks }, 'Marked as Pending — requestor notified.', () => {
                    const requestorTo = form.requestoremail;
                    if (requestorTo) OutlookEmailService.sendEmail({ to: requestorTo, subject: `[${ITSSR_CODE}] Your Request ${form.title} — Pending`, body: `<p>Your IT support request has been marked as pending.</p><p><strong>IT Remarks:</strong> ${form.ITRemarks || '–'}</p>` });
                  });
                }} disabled={patch.isPending} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-60 sm:w-auto">
                  <Clock className="h-4 w-4" /> Mark as Pending
                </button>
                {/* Clear Pending — IT clears the pending flag, back to normal Submitted */}
                {isPending && (
                  <button type="button" onClick={() => {
                    updateStatus('Submitted', { csState: undefined, itPending: false, itPendingDate: undefined }, 'Pending flag cleared.', () => {
                      const requestorTo = form.requestoremail;
                      if (requestorTo) OutlookEmailService.sendEmail({ to: requestorTo, subject: `[${ITSSR_CODE}] Your Request ${form.title} — No Longer Pending`, body: `<p>Your IT support request is no longer pending. IT will proceed with resolution.</p>` });
                    });
                  }} disabled={patch.isPending} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 sm:w-auto">
                    <RotateCcw className="h-4 w-4" /> Clear Pending
                  </button>
                )}
                {/* Reject — IT rejects the ticket, goes to Denied terminal state (Domino: Reject sets CS=0, CA=Denied) */}
                <button type="button" onClick={() => {
                  if (!form.ITRemarks) { toast.warning('Add IT remarks explaining the rejection'); return; }
                  updateStatus('Denied', { csState: 0 as CSState, ITRemarks: form.ITRemarks, DateResolved: new Date().toISOString() }, 'Case rejected and closed (Denied).', () => {
                    const requestorTo = form.requestoremail;
                    if (requestorTo) OutlookEmailService.sendEmail({ to: requestorTo, subject: `[${ITSSR_CODE}] Your Request ${form.title} has been Denied`, body: `<p>Your IT support request has been denied.</p><p><strong>Reason:</strong> ${form.ITRemarks || '–'}</p>` });
                  });
                }} disabled={patch.isPending} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-800 hover:bg-red-100 disabled:opacity-60 sm:w-auto">
                  <ThumbsDown className="h-4 w-4" /> Reject &amp; Deny
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===== TAB: IT Resolution ===== */}
        {activeTab === 'resolution' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">IT Resolution</h2>
              {isIT && <Badge className="bg-blue-50 text-blue-800 border-0">Your Section</Badge>}
              {isRequestor && !isIT && <Badge className="bg-slate-50 text-slate-600 border-0">IT Only</Badge>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {canEditResolution ? (
                <>
                  <div className="sm:col-span-2">
                    <Field label="Solution" required><textarea className={`${inputClass()} min-h-28`} value={form.Solution || ''} onChange={(event) => setForm({ Solution: event.target.value })} /></Field>
                  </div>
                  <Field label="IT Attachment Link"><input className={inputClass()} value={form.ITAttachment || ''} onChange={(event) => setForm({ ITAttachment: event.target.value })} placeholder="URL or file path" /></Field>
                  <Field label="Problem Category"><SelectField value={form.ProblemCategory} onChange={(ProblemCategory) => setForm({ ProblemCategory })} options={ITSSR_PROBLEM_CATEGORIES} /></Field>
                  <Field label="Secondary Category"><SelectField value={form.SecondaryCategory} onChange={(SecondaryCategory) => setForm({ SecondaryCategory })} options={ITSSR_PROBLEM_CATEGORIES_SECONDARY} /></Field>
                  <Field label="Classification"><SelectField value={form.Classification} onChange={(Classification) => setForm({ Classification })} options={ITSSR_CLASSIFICATIONS} /></Field>
                  <Field label="Support Method"><SelectField value={form.SupportMethod} onChange={(SupportMethod) => setForm({ SupportMethod })} options={ITSSR_SUPPORT_METHODS} /></Field>
                </>
              ) : (
                <>
                  <div className="sm:col-span-2">
                    <ReadonlyField label="Solution" value={form.Solution} />
                  </div>
                  <ReadonlyField label="IT Attachment" value={form.ITAttachment ? <a href={form.ITAttachment} target="_blank" rel="noreferrer" className="text-blue-700 underline hover:text-blue-900">{form.ITAttachment}</a> : null} />
                  <ReadonlyField label="Problem Category" value={form.ProblemCategory} />
                  <ReadonlyField label="Secondary Category" value={form.SecondaryCategory} />
                  <ReadonlyField label="Classification" value={form.Classification} />
                  <ReadonlyField label="Support Method" value={form.SupportMethod} />
                  <ReadonlyField label="Date Resolved" value={form.DateResolved ? new Date(form.DateResolved).toLocaleString() : null} />
                  <ReadonlyField label="Date Notified Requestor" value={form.DateNotifiedRequestor ? new Date(form.DateNotifiedRequestor).toLocaleString() : null} />
                </>
              )}
            </div>
            {canEditResolution && (
              <div className="sticky bottom-0 -mx-5 flex justify-end border-t border-slate-100 bg-white/95 px-5 pt-4 shadow-[0_-8px_16px_rgba(15,23,42,0.04)] sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:shadow-none" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
                <button type="button" onClick={() => {
                  if (!form.Solution) toast.warning('Please enter the solution details before resolving.');
                  else updateStatus('Resolved', { Solution: form.Solution, ITAttachment: form.ITAttachment, ProblemCategory: form.ProblemCategory, SecondaryCategory: form.SecondaryCategory, Classification: form.Classification, SupportMethod: form.SupportMethod, DateResolved: new Date().toISOString(), DateNotifiedRequestor: new Date().toISOString() }, 'Case marked as Resolved.', () => {
                    if (record) void createITSSRDocument(record, 'IT Resolution', form.ITAttachment || 'IT Resolution', form.ITAttachment).then(() => client.invalidateQueries({ queryKey: ['itssr-documents', record.id, record.title] })).catch(() => undefined);
                    const requestorTo = form.requestoremail;
                    if (requestorTo) OutlookEmailService.sendEmail({ to: requestorTo, subject: `[${ITSSR_CODE}] Your Request ${form.title} has been Resolved`, body: `<p>Your IT support request has been resolved.</p><p><strong>Solution:</strong></p><blockquote style="border-left:3px solid #ccc;padding-left:10px;color:#555">${form.Solution || '–'}</blockquote><p>Please log in to review and accept.</p>` });
                  });
                }} disabled={patch.isPending} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-900 disabled:opacity-60 sm:w-auto">
                  <Wrench className="h-4 w-4" /> Mark as Resolved
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===== TAB: Acceptance ===== */}
        {activeTab === 'acceptance' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Requestor Acceptance</h2>
              {isRequestor && <Badge className="bg-emerald-50 text-emerald-700 border-0">Your Section</Badge>}
              {isIT && !isRequestor && <Badge className="bg-slate-50 text-slate-600 border-0">Read Only</Badge>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {canEditAcceptance ? (
                <>
                  <Field label="Satisfaction Rating" required>
                    <input type="range" min={1} max={10} step={1} className="h-10 w-full" value={form.SatisfactionRating || 8} onChange={(event) => setForm({ SatisfactionRating: Number(event.target.value) })} />
                  </Field>
                  <ReadonlyField label="Rating Label" value={(form.SatisfactionRating || 8) >= 8 ? 'Delighted' : (form.SatisfactionRating || 8) >= 5 ? 'Room for Improvement' : 'Dissatisfied'} />
                  <div className="sm:col-span-2">
                    <Field label="Your Comment"><textarea className={`${inputClass()} min-h-24`} value={form.RequestorComment || ''} onChange={(event) => setForm({ RequestorComment: event.target.value })} /></Field>
                  </div>
                </>
              ) : (
                <>
                  <ReadonlyField label="Satisfaction Rating" value={form.SatisfactionRating ? `${form.SatisfactionRating}/10` : 'Not rated'} />
                  <ReadonlyField label="Date Accepted" value={form.DateAccepted ? new Date(form.DateAccepted).toLocaleString() : 'Not accepted'} />
                  <div className="sm:col-span-2">
                    <ReadonlyField label="Requestor Comment" value={form.RequestorComment} />
                  </div>
                </>
              )}
            </div>
            {canEditAcceptance && (
              <div className="sticky bottom-0 -mx-5 flex flex-col justify-end gap-3 border-t border-slate-100 bg-white/95 px-5 pt-4 shadow-[0_-8px_16px_rgba(15,23,42,0.04)] sm:static sm:mx-0 sm:flex-row sm:bg-transparent sm:px-0 sm:shadow-none" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
                <button type="button" onClick={() => updateStatus('InProgress', { RequestorComment: form.RequestorComment }, 'Case returned to IT.', () => {
                  const picTo = personEmail(form.AssignedToEmail);
                  if (picTo) OutlookEmailService.sendEmail({ to: picTo, subject: `[${ITSSR_CODE}] Case ${form.title} Returned for Further Work`, body: `<p>The requestor has returned this case.</p><p><strong>Comment:</strong> ${form.RequestorComment || '–'}</p>` });
                })} disabled={patch.isPending} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-amber-500 bg-white px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-60 sm:w-auto">
                  <RotateCcw className="h-4 w-4" /> Return to IT
                </button>
                <button type="button" onClick={() => {
                  if ((form.SatisfactionRating || 8) < 8 && !form.RequestorComment) toast.warning('Comments required when rating below 8.');
                  else updateStatus('Accepted', { SatisfactionRating: form.SatisfactionRating || 8, RequestorComment: form.RequestorComment, DateAccepted: new Date().toISOString() }, 'Case accepted and closed.', () => {
                    const picTo = personEmail(form.AssignedToEmail);
                    if (picTo) OutlookEmailService.sendEmail({ to: picTo, subject: `[${ITSSR_CODE}] Case ${form.title} Accepted`, body: `<p>The requestor has accepted the resolution.</p><p><strong>Rating:</strong> ${form.SatisfactionRating || 8}/10</p><p><strong>Comment:</strong> ${form.RequestorComment || '–'}</p>` });
                  });
                }} disabled={patch.isPending} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-emerald-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-900 disabled:opacity-60 sm:w-auto">
                  <CheckCircle2 className="h-4 w-4" /> Accept &amp; Close
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===== TAB: PanCen Approval — Desktop Request Sections ===== */}
        {activeTab === 'pancen' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">PanCen Desktop Approval</h2>
              <Badge className="bg-amber-50 text-amber-800 border-0">PanCen Only</Badge>
            </div>

            {/* Section 1: IT Verification (Editor1b) — Requestor fills desktop checklist */}
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-slate-600" />
                  <h3 className="text-base font-semibold text-slate-900">IT Verification</h3>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Requestor</span>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-2">
                <ReadonlyField label="IT Verified By" value={form.itVerificationBy || '—'} />
                <ReadonlyField label="Verified Date" value={form.itVerificationDate ? new Date(form.itVerificationDate).toLocaleString() : '—'} />
                {(isRequestor || isIT) && (
                  <div className="sm:col-span-2">
                    <button type="button" onClick={() => {
                      setForm({ itVerificationBy: personEmail(form.ReportedByEmail) || form.requestoremail, itVerificationDate: new Date().toISOString() });
                      toast.success('IT Verification completed');
                    }} disabled={!isRequestor && !isIT} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blue-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-900 disabled:opacity-60">
                      <CheckCircle2 className="h-4 w-4" /> Complete Verification
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Section 2: IT Manager Approval (Editor1c) */}
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <UserCheck className="h-5 w-5 text-slate-600" />
                  <h3 className="text-base font-semibold text-slate-900">IT Manager Approval</h3>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">IT Mgr</span>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-2">
                <ReadonlyField label="Approved By" value={form.itManagerApprovedBy || '—'} />
                <ReadonlyField label="Approved Date" value={form.itManagerApprovedDate ? new Date(form.itManagerApprovedDate).toLocaleString() : '—'} />
                {isIT && (
                  <div className="sm:col-span-2 flex gap-3">
                    <button type="button" onClick={() => {
                      setForm({ itManagerApprovedBy: access.userEmail, itManagerApprovedDate: new Date().toISOString() });
                      toast.success('IT Manager approved');
                    }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-900">
                      <CheckCircle2 className="h-4 w-4" /> Approve
                    </button>
                    <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">
                      <XCircle className="h-4 w-4" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: COO Approval (Editor1d:PanCenM) — shown when COO_APP="Yes" */}
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-slate-600" />
                  <h3 className="text-base font-semibold text-slate-900">COO Approval</h3>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">COO</span>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-2">
                <ReadonlyField label="COO Required" value={form.cooApp || 'No'} />
                <ReadonlyField label="Approved By" value={form.cooApprovedBy || '—'} />
                <ReadonlyField label="Approved Date" value={form.cooApprovedDate ? new Date(form.cooApprovedDate).toLocaleString() : '—'} />
                {isIT && (
                  <div className="sm:col-span-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">COO Approval Needed?</span>
                    <select className={`${inputClass()} mt-1 w-40`} value={form.cooApp || 'No'} onChange={(e) => setForm({ cooApp: e.target.value })}>
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                    {form.cooApp === 'Yes' && (
                      <div className="mt-4">
                        <button type="button" onClick={() => {
                          setForm({ cooApprovedBy: access.userEmail, cooApprovedDate: new Date().toISOString() });
                          toast.success('COO approved');
                        }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-900">
                          <CheckCircle2 className="h-4 w-4" /> COO Approved
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== TAB: Attachments ===== */}
        {activeTab === 'attachments' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Attachments &amp; Documents</h2>
              <Badge className="bg-slate-100 text-slate-700 border-0">{documents.length} file(s)</Badge>
            </div>
            {documents.length === 0 && !form.RequestorAttachment && !form.ITAttachment ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Paperclip className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-600">No attachments</p>
                <p className="text-xs text-slate-400 mt-1">Attachments submitted with this case will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Requestor Attachment */}
                {form.RequestorAttachment ? (
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center border border-slate-200">
                        <FileText className="h-5 w-5 text-emerald-700" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{form.RequestorAttachment}</p>
                        <p className="text-xs text-slate-500">Requestor Attachment</p>
                      </div>
                    </div>
                    <span className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-400">
                      No link
                    </span>
                  </div>
                ) : null}
                {/* IT Attachment */}
                {form.ITAttachment ? (
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center border border-slate-200">
                        <FileText className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{form.ITAttachment}</p>
                        <p className="text-xs text-slate-500">IT Resolution Attachment</p>
                      </div>
                    </div>
                    <a href={form.ITAttachment} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                      <ExternalLink className="h-3.5 w-3.5" /> Open
                    </a>
                  </div>
                ) : null}
                {/* Document Gallery items */}
                {documents.map((doc) => {
                  const url = documentUrl(doc);
                  const title = doc.iTPDocTitle || doc.iTISubject || doc.iOIPTitle || doc.title;
                  const type = doc.iTPDocType || doc.iTIInfoType || doc.iOIPCategory || 'Document';
                  return (
                    <div key={doc.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center border border-slate-200">
                          <FileText className="h-5 w-5 text-slate-600" />
                        </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">{title}</p>
                        <p className="text-xs text-slate-500">{type} · v{doc.iTPVersionNo || '-'}</p>
                      </div>
                      </div>
                      {url ? (
                        <a href={url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                          <ExternalLink className="h-3.5 w-3.5" /> Open
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">No file</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

    </main>
  );
}

export function ITSSRIconHeader() {
  return <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-emerald-800 text-white"><Headset className="h-5 w-5" /></span>;
}

function RoutingSidebar({ routing, form }: { routing: ReturnType<typeof determineITSSRRouting>; form: Partial<ITSSRRecord> }) {
  const flowSteps = [
    { label: 'Service Type', value: form.ServiceType || '—', done: !!form.ServiceType },
    { label: 'Department', value: form.Department || '—', done: !!form.Department },
    { label: 'Company', value: form.Company || '—', done: !!form.Company },
    { label: 'Application', value: form.Application || '—', done: !!form.Application },
  ];
  const hasEnough = form.ServiceType && form.Department;

  return (
    <div className="space-y-4">
      {/* Routing Decision Card */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
          <Route className="h-4 w-4 text-slate-600" />
          <h2 className="text-sm font-semibold text-slate-900">Routing Process</h2>
        </div>
        <div className="space-y-0 divide-y divide-slate-100">
          {flowSteps.map((step) => (
            <div key={step.label} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <span className="text-slate-600">{step.label}</span>
              <div className="flex items-center gap-2">
                <span className={`max-w-[140px] truncate text-right font-medium ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>
                  {step.done ? step.value : 'Not set'}
                </span>
                {step.done ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                ) : (
                  <span className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-slate-300" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assigned IT PIC Card */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
          <Headset className="h-4 w-4 text-slate-600" />
          <h2 className="text-sm font-semibold text-slate-900">Assigned IT Staff</h2>
        </div>
        <div className="p-4">
          {!hasEnough ? (
            <div className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Select a Service Type and Department to see routing.
            </div>
          ) : routing.primaryPICEmail ? (
            <div className="space-y-3">
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-800 text-xs font-bold text-white">
                    {routing.primaryPICName?.charAt(0) || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-emerald-950">{routing.primaryPICName || 'Unnamed'}</p>
                    <p className="truncate text-xs text-emerald-700">{routing.primaryPICEmail}</p>
                  </div>
                  <UserCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                </div>
              </div>
              {routing.secondaryPICEmail ? (
                <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <p className="mb-1 text-xs font-medium text-slate-500">Secondary (Backup)</p>
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-400 text-xs font-bold text-white">
                      {routing.secondaryPICName?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">{routing.secondaryPICName || 'Unnamed'}</p>
                      <p className="truncate text-xs text-slate-500">{routing.secondaryPICEmail}</p>
                    </div>
                  </div>
                </div>
              ) : null}
              {routing.picDescription ? (
                <p className="text-xs text-slate-500 leading-relaxed">{routing.picDescription}</p>
              ) : null}
            </div>
          ) : (
            <div className="rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-600">
              {routing.routingExplanation || 'No routing match found for the selected criteria. An IT admin will manually assign this ticket.'}
            </div>
          )}
        </div>
      </div>

      {/* Form Summary Card */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
          <FileText className="h-4 w-4 text-slate-600" />
          <h2 className="text-sm font-semibold text-slate-900">Request Summary</h2>
        </div>
        <div className="space-y-0 divide-y divide-slate-100 p-0">
          {[
            { label: 'Form', value: `${ITSSR_CODE} - IT Support Request` },
            { label: 'Requestor', value: personName(form.ReportedByEmail) || '—' },
            { label: 'Routing', value: routing.isRoutingDetermined ? 'Auto-routed' : 'Manual assign' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <span className="text-slate-600">{item.label}</span>
              <span className="font-medium text-slate-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
