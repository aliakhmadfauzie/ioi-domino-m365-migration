/**
 * MainDB_HR service wrapper.
 *
 * HR pages were built against the SharePoint list shape generated as
 * MainDB_HRModel/MainDB_HRService. This wrapper keeps the existing camel/lower
 * aliases working while routing all operations to the configured maindb_hr data
 * source.
 */

import { ensureInitialized } from '@/lib/app-init';
import { MainDB_HRService as GeneratedService } from '../generated/services/MainDB_HRService';
import type { MainDB_HRRead, MainDB_HRWrite } from '../generated/models/MainDB_HRModel';
import type { HRFormCode, HRCurrentStatus, HRSite } from '@/types/hr-forms';
import type { IGetAllOptions } from '../generated/models/CommonModels';
import type { IOperationOptions } from '../../app-gen-sdk/data/common/types';

export type MainDBHRStatusKey =
  | 'StatusKey0'
  | 'StatusKey1'
  | 'StatusKey2'
  | 'StatusKey3'
  | 'StatusKey4'
  | 'StatusKey5'
  | 'StatusKey6';

export type MainDBHRSiteKey = 'SiteKey0' | 'SiteKey1';

export type MainDBHR = MainDB_HRRead & {
  id: number;
  title: string;
  formcode: string;
  formType?: string;
  statusKey?: MainDBHRStatusKey;
  siteKey?: MainDBHRSiteKey;
  submittedon?: string;
  currentaction?: string;
  currentAction?: string;
  workflowaction?: string;
  currentstage?: string;
  department?: string;
  division?: string;
  description?: string;
  details?: string;
  documentno?: string;
  requestedby?: string;
  employeeid: string;
  employeename: string;
  [key: string]: unknown;
};

export type { HRFormCode, HRCurrentStatus, HRSite };

const STATUS_KEY_TO_LABEL: Record<MainDBHRStatusKey, string> = {
  StatusKey0: 'Draft',
  StatusKey1: 'Submitted',
  StatusKey2: 'Under Review',
  StatusKey3: 'Approved',
  StatusKey4: 'Rejected',
  StatusKey5: 'Closed',
  StatusKey6: 'Archived',
};

const STATUS_LABEL_TO_KEY: Record<string, MainDBHRStatusKey> = {
  Draft: 'StatusKey0',
  Request: 'StatusKey0',
  Submitted: 'StatusKey1',
  EndorsedHOD: 'StatusKey2',
  'Under Review': 'StatusKey2',
  HODApproval: 'StatusKey2',
  HRReview: 'StatusKey2',
  Approved: 'StatusKey3',
  ApprovedHR: 'StatusKey3',
  Rejected: 'StatusKey4',
  Closed: 'StatusKey5',
  Completed: 'StatusKey5',
  Archived: 'StatusKey6',
  Returned: 'StatusKey6',
  ApprovedCOO: 'StatusKey3',
  ApprovedED: 'StatusKey3',
};

const SITE_KEY_TO_LABEL: Record<MainDBHRSiteKey, string> = {
  SiteKey0: 'PRAI',
  SiteKey1: 'JOHOR',
};

const SITE_LABEL_TO_KEY: Record<string, MainDBHRSiteKey> = {
  PRAI: 'SiteKey0',
  Prai: 'SiteKey0',
  JOHOR: 'SiteKey1',
  Johor: 'SiteKey1',
};

const FORM_ACTION_ALIASES = [
  'awhrCurrentAction',
  'cirCurrentAction',
  'drdCurrentAction',
  'eenCurrentAction',
  'epduCurrentAction',
  'esfCurrentAction',
  'ftcrCurrentAction',
  'fwwpeCurrentAction',
  'gdsnCurrentAction',
  'healthinfoCurrentAction',
  'hraprCurrentAction',
  'hrinfoCurrentAction',
  'hseCurrentAction',
  'internCurrentAction',
  'jdCurrentAction',
  'lveCurrentAction',
  'mclCurrentAction',
  'ndfCurrentAction',
  'owpCurrentAction',
  'srCurrentAction',
  'tmpuCurrentAction',
] as const;

const LOWER_TO_SHAREPOINT: Record<string, keyof MainDB_HRWrite | 'Divison'> = {
  appname: 'AppName',
  approverremarks: 'ApproverRemarks',
  attachmentlinks: 'AttachmentLinks',
  backupPIC: 'BackupPIC',
  businessarea: 'BusinessArea',
  candidateName: 'CandidateName',
  company: 'Company',
  correctiveactionsummary: 'CorrectiveActionSummary',
  currentapproverdisplayname: 'CurrentApprover_DisplayName',
  currentapproveremail: 'CurrentApprover_Email',
  currentapprovergroup: 'CurrentApproverGroup',
  currentstage: 'CurrentStage',
  department: 'Department',
  dept: 'Dept',
  description: 'Description',
  details: 'Details',
  designation: 'Designation',
  division: 'Divison',
  divisons: 'Divison',
  documentno: 'DocumentNo',
  documenttype: 'DocumentType',
  duedate: 'DueDate',
  effectivedate: 'EffectiveDate',
  employeeid: 'EmployeeID',
  employeename: 'EmployeeName',
  empName: 'EmpName',
  empNo: 'EmpNo',
  finalstatus: 'FinalStatus',
  formcode: 'FormCode',
  formType: 'FormType',
  formversion: 'FormVersion',
  hODEmail: 'HOD_x002e_Email',
  inDate: 'InDate',
  iNO: 'INO',
  jobdesignation: 'Designation',
  lastWorkingDay: 'LastWorkingDay',
  nationality: 'Nationality',
  phoneExtension: 'PhoneExtension',
  priority: 'Priority',
  problemDesc: 'ProblemDesc',
  profileDetails: 'ProfileDetails',
  reasonForLeaving: 'ReasonForLeaving',
  remarks: 'Remarks',
  requestedby: 'RequestedBy',
  requestordisplayname: 'Requestor_DisplayName',
  requestoremail: 'Requestor_Email',
  requesttitle: 'RequestTitle',
  section: 'Section',
  submittedon: 'SubmittedOn',
  title: 'Title',
  vacancyTitle: 'VacancyTitle',
  workerID: 'WorkerID',
  workerName: 'WorkerName',
};

function unwrap<T>(result: { success?: boolean; data?: T; error?: unknown } | T): T {
  if (typeof result === 'object' && result && 'success' in result) {
    if (!result.success) throw result.error;
    return result.data as T;
  }
  return result as T;
}

function autoMapLowerCaseAlias(key: string): string | undefined {
  const explicitMapping = LOWER_TO_SHAREPOINT[key];
  if (explicitMapping) return explicitMapping;

  const match = key.match(/^([a-z]+)([A-Z].*)$/);
  if (!match) return undefined;

  const [, prefix, suffix] = match;
  return `${prefix.toUpperCase()}_${suffix}`;
}

function statusKeyFromValue(value: unknown): MainDBHRStatusKey | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') {
    if (value in STATUS_KEY_TO_LABEL) return value as MainDBHRStatusKey;
    return STATUS_LABEL_TO_KEY[value];
  }
  if (typeof value === 'object' && 'Value' in value) {
    return STATUS_LABEL_TO_KEY[String((value as { Value?: unknown }).Value)];
  }
  return undefined;
}

function siteKeyFromValue(value: unknown): MainDBHRSiteKey | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') {
    if (value in SITE_KEY_TO_LABEL) return value as MainDBHRSiteKey;
    return SITE_LABEL_TO_KEY[value];
  }
  if (typeof value === 'object' && 'Value' in value) {
    return SITE_LABEL_TO_KEY[String((value as { Value?: unknown }).Value)];
  }
  return undefined;
}

function normalizeRecord(record: MainDB_HRRead): MainDBHR {
  const r = record as MainDB_HRRead & Record<string, unknown>;
  const id = Number(r.ID ?? r.id ?? 0);
  const statusKey =
    statusKeyFromValue(r.statusKey) ??
    statusKeyFromValue(r.Status) ??
    statusKeyFromValue(r.CurrentStatus) ??
    statusKeyFromValue(r.CurrentAction);
  const siteKey = siteKeyFromValue(r.siteKey) ?? siteKeyFromValue(r.EntitySite);
  const currentAction = String(r.CurrentAction ?? r.currentaction ?? r.currentAction ?? STATUS_KEY_TO_LABEL[statusKey ?? 'StatusKey0']);

  const normalized: MainDBHR = {
    ...r,
    ID: r.ID ?? id,
    id,
    Title: String(r.Title ?? r.title ?? ''),
    title: String(r.Title ?? r.title ?? ''),
    FormCode: String(r.FormCode ?? r.formcode ?? r.FormType ?? ''),
    formcode: String(r.FormCode ?? r.formcode ?? r.FormType ?? ''),
    formType: String(r.FormType ?? r.FormCode ?? r.formcode ?? ''),
    statusKey,
    siteKey,
    submittedon: String(r.SubmittedOn ?? r.submittedon ?? r.SubmittedDate ?? ''),
    currentaction: currentAction,
    currentAction,
    workflowaction: currentAction,
    currentstage: String(r.CurrentStage ?? r.currentstage ?? ''),
    department: String(r.Department ?? r.department ?? ''),
    division: String(r.Divison ?? r.SR_dDivision ?? r.division ?? ''),
    description: String(r.Description ?? r.description ?? ''),
    details: String(r.Details ?? r.details ?? ''),
    documentno: String(r.DocumentNo ?? r.documentno ?? r.INO ?? ''),
    requestedby: String(r.RequestedBy ?? r.requestedby ?? ''),
    employeeid: String(r.EmployeeID ?? r.employeeid ?? ''),
    employeename: String(r.EmployeeName ?? r.employeename ?? ''),
  };

  for (const alias of FORM_ACTION_ALIASES) {
    normalized[alias] = r[alias] ?? currentAction;
  }

  return normalized;
}

function normalizeRecords(records: MainDB_HRRead[]): MainDBHR[] {
  return records.map(normalizeRecord);
}

function toChoiceLabel(status: MainDBHRStatusKey | HRCurrentStatus | string | undefined): string | undefined {
  if (!status) return undefined;
  if (status in STATUS_KEY_TO_LABEL) return STATUS_KEY_TO_LABEL[status as MainDBHRStatusKey];
  return String(status);
}

function toSharePointWrite(input: Record<string, unknown>): Partial<MainDB_HRWrite> {
  const out: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    if (value === undefined) continue;

    if (key === 'id' || key === 'ID') continue;
    if (key === 'statusKey') {
      const label = toChoiceLabel(value as MainDBHRStatusKey);
      out.Status = label;
      out.CurrentStatus = label;
      out.CurrentAction = out.CurrentAction ?? label;
      continue;
    }
    if (key === 'siteKey') {
      out.EntitySite = SITE_KEY_TO_LABEL[value as MainDBHRSiteKey] ?? value;
      continue;
    }
    if (key === 'currentaction' || key === 'currentAction' || key === 'workflowaction') {
      out.CurrentAction = value;
      continue;
    }

    const mapped = autoMapLowerCaseAlias(key);
    if (mapped) {
      out[mapped] = value;
      continue;
    }

    if (/^[A-Z{"]/.test(key) || key.includes('#')) {
      out[key] = value;
    }
  }

  out.Title = out.Title ?? input.title ?? input.Title ?? 'HR Submission';
  out.FormCode = out.FormCode ?? input.formcode ?? input.FormCode ?? input.formType ?? input.FormType ?? 'HR';
  out.FormType = out.FormType ?? out.FormCode;
  out.CurrentAction = out.CurrentAction ?? 'Request';
  out.EntitySite = out.EntitySite ?? 'Prai';
  out.EmployeeID = out.EmployeeID ?? input.employeeid ?? input.EmployeeID ?? '';
  out.EmployeeName = out.EmployeeName ?? input.employeename ?? input.EmployeeName ?? '';

  return out as Partial<MainDB_HRWrite>;
}

function translateOptions(options?: IOperationOptions): IGetAllOptions | undefined {
  if (!options) return undefined;
  const translated: IGetAllOptions = { ...(options as IGetAllOptions) };
  if (translated.filter) {
    translated.filter = translated.filter
      .replace(/\bformcode\b/g, 'FormCode')
      .replace(/\bstatusKey\b/g, 'Status')
      .replace(/\bsiteKey\b/g, 'EntitySite')
      .replace(/\bsubmittedon\b/g, 'SubmittedOn')
      .replace(/\btitle\b/g, 'Title');
  }
  if (translated.orderBy) {
    translated.orderBy = translated.orderBy.map((value) =>
      value
        .replace(/\bformcode\b/g, 'FormCode')
        .replace(/\bstatusKey\b/g, 'Status')
        .replace(/\bsiteKey\b/g, 'EntitySite')
        .replace(/\bsubmittedon\b/g, 'SubmittedOn')
        .replace(/\bsubmittedDate\b/g, 'SubmittedDate')
        .replace(/\btitle\b/g, 'Title')
    );
  }
  return translated;
}

function getStatusLabel(statusKey: MainDBHRStatusKey | undefined): HRCurrentStatus | undefined {
  if (!statusKey) return undefined;
  const statusMap: Partial<Record<MainDBHRStatusKey, HRCurrentStatus>> = {
    StatusKey0: 'Draft',
    StatusKey1: 'Submitted',
    StatusKey2: 'EndorsedHOD',
    StatusKey3: 'ApprovedHR',
    StatusKey4: 'Rejected',
    StatusKey5: 'Closed',
    StatusKey6: 'Returned',
  };
  return statusMap[statusKey];
}

function getStatusKeyFromLabel(label: HRCurrentStatus | string): MainDBHRStatusKey | undefined {
  return STATUS_LABEL_TO_KEY[label];
}

function getSiteLabel(siteKey: MainDBHRSiteKey | undefined): HRSite | undefined {
  return siteKey ? (SITE_KEY_TO_LABEL[siteKey] as HRSite) : undefined;
}

function getSiteKeyFromLabel(label: HRSite): MainDBHRSiteKey | undefined {
  return SITE_LABEL_TO_KEY[label];
}

export class MainDBHRService {
  static async create(record: Record<string, unknown>): Promise<MainDBHR> {
    await ensureInitialized();
    const spPayload = toSharePointWrite(record) as Omit<MainDB_HRWrite, 'ID'>;
    if (process.env.DEBUG_HR_MAPPING === '1') {
      // Log the exact payload sent to the generated SharePoint service for debugging
      // eslint-disable-next-line no-console
      console.log('[DEBUG_MAINDBHR_OUTgoing_CREATE]', JSON.stringify(spPayload, null, 2));
    }
    const result = await GeneratedService.create(spPayload);
    return normalizeRecord(unwrap<MainDB_HRRead>(result));
  }

  static async update(id: string, changedFields: Record<string, unknown>): Promise<MainDBHR> {
    await ensureInitialized();
    const spPayload = toSharePointWrite(changedFields);
    if (process.env.DEBUG_HR_MAPPING === '1') {
      // eslint-disable-next-line no-console
      console.log('[DEBUG_MAINDBHR_OUTgoing_UPDATE]', id, JSON.stringify(spPayload, null, 2));
    }
    const result = await GeneratedService.update(id, spPayload);
    return normalizeRecord(unwrap<MainDB_HRRead>(result));
  }

  static async delete(id: string): Promise<void> {
    await ensureInitialized();
    return GeneratedService.delete(id);
  }

  static async get(id: string): Promise<MainDBHR> {
    await ensureInitialized();
    const result = await GeneratedService.get(id);
    return normalizeRecord(unwrap<MainDB_HRRead>(result));
  }

  static async getAll(options?: IOperationOptions): Promise<MainDBHR[]> {
    await ensureInitialized();
    const result = await GeneratedService.getAll(translateOptions(options));
    return normalizeRecords(unwrap<MainDB_HRRead[]>(result));
  }

  static async getByFormType(formType: HRFormCode, options?: IOperationOptions): Promise<MainDBHR[]> {
    return this.getAll({
      ...options,
      filter: `FormCode eq '${formType}'`,
    });
  }

  static async getByStatus(status: HRCurrentStatus, options?: IOperationOptions): Promise<MainDBHR[]> {
    const label = toChoiceLabel(getStatusKeyFromLabel(status)) ?? status;
    return this.getAll({
      ...options,
      filter: `Status eq '${label}'`,
    });
  }

  static async getByFormTypeAndStatus(
    formType: HRFormCode,
    status: HRCurrentStatus,
    options?: IOperationOptions
  ): Promise<MainDBHR[]> {
    const label = toChoiceLabel(getStatusKeyFromLabel(status)) ?? status;
    return this.getAll({
      ...options,
      filter: `FormCode eq '${formType}' and Status eq '${label}'`,
    });
  }

  static async getBySite(site: HRSite, options?: IOperationOptions): Promise<MainDBHR[]> {
    return this.getAll({
      ...options,
      filter: `EntitySite eq '${site}'`,
    });
  }

  static async getByFormCodeAndSite(formCode: HRFormCode, site: HRSite, options?: IOperationOptions): Promise<MainDBHR[]> {
    return this.getAll({
      ...options,
      filter: `FormCode eq '${formCode}' and EntitySite eq '${site}'`,
    });
  }

  static async submit(id: string, submittedBy: string): Promise<MainDBHR> {
    return this.update(id, {
      statusKey: 'StatusKey1',
      CurrentAction: 'Submitted',
      SubmittedOn: new Date().toISOString(),
      RequestedBy: submittedBy,
    });
  }

  static async approve(id: string, approvedBy: string): Promise<MainDBHR> {
    return this.update(id, {
      statusKey: 'StatusKey3',
      CurrentAction: 'Approved',
      CurrentApprover_DisplayName: approvedBy,
    });
  }

  static async reject(id: string, comments?: string): Promise<MainDBHR> {
    return this.update(id, {
      statusKey: 'StatusKey4',
      CurrentAction: 'Rejected',
      ApproverRemarks: comments,
    });
  }

  static async returnForRevision(id: string, comments?: string): Promise<MainDBHR> {
    return this.update(id, {
      statusKey: 'StatusKey0',
      CurrentAction: 'Request',
      ApproverRemarks: comments,
    });
  }

  static async lock(id: string): Promise<MainDBHR> {
    return this.update(id, {
      FinalStatus: 'Locked',
    });
  }

  static getStatusLabel = getStatusLabel;
  static getSiteLabel = getSiteLabel;
}
