/**
 * STR Department Submission Service
 * Connects to MainDB_STR SharePoint List
 *
 * Site: https://ioioi.sharepoint.com/sites/ioi-portal-str
 * List: MainDB_STR
 */

import { ensureInitialized } from '@/lib/app-init';
import { MainDBSTRService } from '@/generated/services/main-dbstr-service';
import { LineItemsSTRService } from '@/generated/services/line-items-str-service';
import { ApprovalHistorySTRService } from '@/generated/services/approval-history-str-service';
import type {
  MainDBSTR,
  MainDBSTRDepartmentKey,
  MainDBSTRSiteKey,
  MainDBSTRStatusKey,
} from '@/generated/models/main-dbstr-model';
import { MainDBSTRDepartmentKeyToLabel, MainDBSTRStatusKeyToLabel, MainDBSTRSiteKeyToLabel } from '@/generated/models/main-dbstr-model';
import type { LineItemsSTR } from '@/generated/models/line-items-str-model';
import type { ApprovalHistorySTR } from '@/generated/models/approval-history-str-model';
import type { MainDB_STR_Base, STRForm, STR_ApprovalRecord } from '@/types/str-forms';
import type { STRFormCode, STRStatus } from '@/config/str-constants';

interface STRLineItemInput {
  id?: string;
  itemCode?: string;
  description?: string;
  category?: string;
  quantity?: number | string;
  uom?: string;
  unitPrice?: number | string;
  totalPrice?: number | string;
  specifications?: string;
  preferredVendor?: string;
  alternateVendor?: string;
  remarks?: string;
  warehouseAvailable?: boolean;
  warehouseQty?: number | string;
  warehouseLocation?: string;
  recommended?: boolean;
  recommendedQty?: number | string;
}

export type STRSubmissionInput = Partial<STRForm> & Record<string, unknown> & {
  lineItems?: STRLineItemInput[];
  LineItems?: STRLineItemInput[];
};

const APP_NAME = 'ioi-platform';

const departmentKeyByLabel = new Map<string, MainDBSTRDepartmentKey>(
  Object.entries(MainDBSTRDepartmentKeyToLabel).map(([key, label]) => [
    label.toUpperCase(),
    key as MainDBSTRDepartmentKey,
  ])
);

const statusKeyByLabel: Record<string, MainDBSTRStatusKey> = {
  DRAFT: 'StatusKey0',
  SUBMITTED: 'StatusKey1',
  UNDERREVIEW: 'StatusKey2',
  PENDINGREVIEW: 'StatusKey2',
  PENDINGAPPROVAL: 'StatusKey2',
  APPROVED: 'StatusKey3',
  REJECTED: 'StatusKey4',
  CLOSED: 'StatusKey5',
  ARCHIVED: 'StatusKey6',
};

function textValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString();
  return String(value).trim();
}

function readText(data: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = textValue(data[key]);
    if (value) return value;
  }
  return '';
}

function toIsoString(value: unknown): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value.toISOString();
  }
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

function departmentKeyFromValue(value: unknown): MainDBSTRDepartmentKey {
  const normalized = textValue(value).toUpperCase();
  if (!normalized) return 'DepartmentKey17';
  if (normalized in MainDBSTRDepartmentKeyToLabel) return normalized as MainDBSTRDepartmentKey;
  return departmentKeyByLabel.get(normalized) || departmentKeyByLabel.get(normalized.replace('PURCH', 'PUR')) || 'DepartmentKey17';
}

function siteKeyFromValue(value: unknown): MainDBSTRSiteKey {
  const normalized = textValue(value).toUpperCase();
  return normalized === 'JOHOR' ? 'SiteKey1' : 'SiteKey0';
}

function statusKeyFromValue(value: unknown): MainDBSTRStatusKey {
  const normalized = textValue(value).replace(/\s+/g, '').toUpperCase();
  if (normalized in MainDBSTRStatusKeyToLabel) return normalized as MainDBSTRStatusKey;
  return statusKeyByLabel[normalized] || 'StatusKey0';
}

function buildDescription(data: Record<string, unknown>): string | undefined {
  const extraFields = data.ExtraFields && typeof data.ExtraFields === 'object'
    ? data.ExtraFields as Record<string, unknown>
    : {};
  const extraFieldLabels = data.ExtraFieldLabels && typeof data.ExtraFieldLabels === 'object'
    ? data.ExtraFieldLabels as Record<string, unknown>
    : {};
  const extraFieldLines = Object.entries(extraFields)
    .map(([key, value]) => [textValue(extraFieldLabels[key]) || key, textValue(value)] as const)
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`);

  const lines = [
    ['Comments', readText(data, 'Comments')],
    ['Justification', readText(data, 'Justification')],
    ['Item Description', readText(data, 'ItemDescription')],
    ['Quantity', readText(data, 'Quantity')],
    ['Cost Center', readText(data, 'CostCenter', 'costCenter')],
    ['Project Code', readText(data, 'ProjectCode', 'projectCode')],
    ['Budget Code', readText(data, 'BudgetCode', 'budgetCode')],
    ['Budget Available', readText(data, 'BudgetAvailable', 'budgetAvailable')],
    ['Total Estimated Cost', readText(data, 'TotalEstimatedCost', 'totalEstimatedCost')],
    ['Request Type', readText(data, 'RequestType', 'requestType')],
    ['Environment', readText(data, 'EnvironmentTag')],
  ]
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .concat(extraFieldLines);

  return lines.length > 0 ? lines.join('\n') : undefined;
}

function getLineItemInputs(data: STRSubmissionInput): STRLineItemInput[] {
  const submittedItems = Array.isArray(data.lineItems) ? data.lineItems : data.LineItems;
  if (Array.isArray(submittedItems) && submittedItems.length > 0) {
    return submittedItems;
  }

  const itemDescription = readText(data, 'ItemDescription');
  const quantity = readText(data, 'Quantity');
  if (!itemDescription && !quantity) return [];

  return [{
    description: itemDescription || 'Line item',
    quantity,
    remarks: readText(data, 'Justification'),
  }];
}

function buildLineItemRemarks(item: STRLineItemInput): string | undefined {
  const lines = [
    ['Category', item.category],
    ['UOM', item.uom],
    ['Specifications', item.specifications],
    ['Preferred Vendor', item.preferredVendor],
    ['Alternate Vendor', item.alternateVendor],
    ['Warehouse Available', item.warehouseAvailable === undefined ? '' : item.warehouseAvailable ? 'Yes' : 'No'],
    ['Warehouse Qty', item.warehouseQty],
    ['Warehouse Location', item.warehouseLocation],
    ['Recommended', item.recommended === undefined ? '' : item.recommended ? 'Yes' : 'No'],
    ['Recommended Qty', item.recommendedQty],
    ['Remarks', item.remarks],
  ]
    .map(([label, value]) => [label, textValue(value)] as const)
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`);

  return lines.length > 0 ? lines.join('\n') : undefined;
}

// =============================================================================
// TYPE ADAPTERS - Convert between SharePoint and UI types
// =============================================================================

function adaptToUIFormat(record: MainDBSTR): MainDB_STR_Base {
  // Get labels from the keys
  const departmentLabel = record.departmentKey ? MainDBSTRDepartmentKeyToLabel[record.departmentKey] : '';
  const statusLabel = record.statusKey ? MainDBSTRStatusKeyToLabel[record.statusKey] : 'Draft';
  const siteLabel = record.siteKey ? MainDBSTRSiteKeyToLabel[record.siteKey] : '';

  return {
    id: String(record.id),
    guid: String(record.id),
    Title: record.title,
    INO: record.documentNo || record.title,
    FormType: (record.formCode || 'ACMSTR') as STRFormCode,
    CurrentStatus: statusLabel as STRStatus,
    EnvironmentTag: 'PROD',
    Site: (siteLabel.toUpperCase() === 'PRAI' || siteLabel.toUpperCase() === 'JOHOR' ? siteLabel.toUpperCase() : 'PRAI') as 'PRAI' | 'JOHOR',
    Department: departmentLabel,
    Requestor: record.requestorDisplayName || '',
    RequestorEmail: record.requestorEmail || '',
    RequestDate: record.submittedOn ? new Date(record.submittedOn) : new Date(),
    Comments: record.description,
    Attachments: [],
    IsLocked: statusLabel === 'Approved' || statusLabel === 'Rejected',
    CreatedDate: record.submittedOn ? new Date(record.submittedOn) : new Date(),
    ModifiedDate: record.submittedOn ? new Date(record.submittedOn) : new Date(),
    CreatedBy: record.requestorDisplayName || '',
    ModifiedBy: record.requestorDisplayName || '',
  };
}

function adaptApprovalToUIFormat(record: ApprovalHistorySTR): STR_ApprovalRecord {
  return {
    id: String(record.id),
    guid: String(record.id),
    ParentID: record.parentID ? String(record.parentID) : '',
    FormCode: 'ACMSTR' as STRFormCode,
    StageNumber: 1,
    StageName: record.toState || 'Review',
    Action: (record.actionCode === 'Approve' || record.actionCode === 'Reject' || record.actionCode === 'Return' ? record.actionCode : 'Approve') as 'Approve' | 'Reject' | 'Return',
    ActionBy: record.actionByName || '',
    ActionByEmail: record.actionByEmail || '',
    ActionDate: record.actionOn ? new Date(record.actionOn) : new Date(),
    Comments: record.actionComment || '',
    CreatedDate: record.actionOn ? new Date(record.actionOn) : new Date(),
  };
}

// =============================================================================
// RETRY HELPER - handles transient SDK errors like "data model being updated"
// =============================================================================

const MAX_RETRIES = 8;
const INITIAL_DELAY_MS = 1000;

async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = MAX_RETRIES,
  initialDelayMs = INITIAL_DELAY_MS
): Promise<T> {
  let lastError: Error | null = null;
  let delayMs = initialDelayMs;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await ensureInitialized();
      return await operation();
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const errorMessage = lastError.message;

      // Check if it's a transient data model error
      const isDataModelError =
        errorMessage.includes('data model') ||
        errorMessage.includes('being updated') ||
        errorMessage.includes('currently being updated') ||
        errorMessage.includes('configuration');

      const isTransientError =
        isDataModelError ||
        errorMessage.includes('not available');

      if (isTransientError && attempt < maxRetries) {
        console.log(`[STR Service] Retry ${attempt}/${maxRetries} after ${delayMs}ms - ${errorMessage}`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        // Exponential backoff: 2s -> 3s -> 4.5s -> 6.75s -> 10s
        delayMs = Math.min(delayMs * 1.5, 10000);
        continue;
      }

      throw lastError;
    }
  }

  throw lastError || new Error('Operation failed after retries');
}

// =============================================================================
// STR SUBMISSION SERVICE
// =============================================================================

export class STRSubmissionService {
  /**
   * Get all STR submissions from SharePoint
   */
  static async getAll(): Promise<MainDB_STR_Base[]> {
    try {
      const records = await withRetry(() => MainDBSTRService.getAll());
      return records.map(adaptToUIFormat);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error fetching STR submissions:', error);

      // Re-throw data model errors with user-friendly message
      if (errorMessage.includes('data model') || errorMessage.includes('being updated')) {
        throw new Error('System is temporarily busy. Please refresh the page and try again.');
      }
      return [];
    }
  }

  /**
   * Get a single submission by GUID/ID
   */
  static async get(guid: string): Promise<MainDB_STR_Base | null> {
    try {
      await ensureInitialized();
      const record = await MainDBSTRService.get(guid);
      return adaptToUIFormat(record);
    } catch (error) {
      console.error('Error fetching STR submission:', error);
      return null;
    }
  }

  /**
   * Get submissions filtered by form code(s) — uses OData filter for delegation safety.
   */
  static async getByFormCodes(formCodes: STRFormCode[]): Promise<MainDB_STR_Base[]> {
    if (formCodes.length === 0) return [];
    if (formCodes.length === 1) {
      return STRSubmissionService.getByFormCode(formCodes[0]);
    }
    // Multiple form codes: use OData filter with OR clause
    const filter = formCodes.map((fc) => `formCode eq '${fc}'`).join(' or ');
    try {
      const records = await withRetry(() => MainDBSTRService.getAll({ filter }));
      return records.map(adaptToUIFormat);
    } catch {
      return [];
    }
  }

  /**
   * Get submissions by a single form code — uses OData filter for delegation safety.
   */
  static async getByFormCode(formCode: STRFormCode): Promise<MainDB_STR_Base[]> {
    try {
      const records = await withRetry(() =>
        MainDBSTRService.getAll({ filter: `formCode eq '${formCode}'` })
      );
      return records.map(adaptToUIFormat);
    } catch {
      return [];
    }
  }

  /**
   * Get submissions filtered by status — uses OData filter for delegation safety.
   */
  static async getByStatus(status: STRStatus): Promise<MainDB_STR_Base[]> {
    // Map status label to statusKey
    const statusKeyMap: Record<string, string> = {
      'Draft': 'StatusKey0',
      'Submitted': 'StatusKey1',
      'Under Review': 'StatusKey2',
      'Approved': 'StatusKey3',
      'Rejected': 'StatusKey4',
      'Closed': 'StatusKey5',
      'Archived': 'StatusKey6',
    };
    const statusKey = statusKeyMap[status];
    if (!statusKey) return [];
    try {
      const records = await withRetry(() =>
        MainDBSTRService.getAll({ filter: `statusKey eq '${statusKey}'` })
      );
      return records.map(adaptToUIFormat);
    } catch {
      return [];
    }
  }

  /**
   * Get submissions by module — uses OData filter for delegation safety.
   */
  static async getByModule(moduleFormCodes: string[]): Promise<MainDB_STR_Base[]> {
    if (moduleFormCodes.length === 0) return [];
    const filter = moduleFormCodes.map((fc) => `formCode eq '${fc}'`).join(' or ');
    try {
      const records = await withRetry(() => MainDBSTRService.getAll({ filter }));
      return records.map(adaptToUIFormat);
    } catch {
      return [];
    }
  }

  /**
   * Get submissions by user (requestor email) — uses OData filter for delegation safety.
   */
  static async getByUser(userEmail: string): Promise<MainDB_STR_Base[]> {
    try {
      const records = await withRetry(() =>
        MainDBSTRService.getAll({ filter: `requestorEmail eq '${userEmail}'` })
      );
      return records.map(adaptToUIFormat);
    } catch {
      return [];
    }
  }

  /**
   * Get pending approvals — uses OData filter for delegation safety.
   */
  static async getPendingApprovals(): Promise<MainDB_STR_Base[]> {
    try {
      const records = await withRetry(() =>
        MainDBSTRService.getAll({
          filter: `statusKey eq 'StatusKey1' or statusKey eq 'StatusKey2'`,
        })
      );
      return records.map(adaptToUIFormat);
    } catch {
      return [];
    }
  }

  /**
   * Create a new submission
   * @todo PRODUCTION: Replace client-side doc number generation with a Power Automate
   * flow triggered on list item creation (see flows/generate-ticket-id.json for reference).
   */
  static async create(data: STRSubmissionInput): Promise<MainDB_STR_Base> {
    await ensureInitialized();
    const formCode = readText(data, 'FormType') || 'ACMSTR';
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const seq = (now.getTime() % 100000).toString().padStart(5, '0');
    const docNo = `STR-${formCode}-${year}${month}-${seq}`;
    const statusKey = statusKeyFromValue(data.CurrentStatus);
    const isSubmitted = statusKey !== 'StatusKey0';
    const submittedOn = toIsoString(data.SubmittedDate) || (isSubmitted ? now.toISOString() : undefined);
    const requestTitle =
      readText(data, 'RequestTitle') ||
      readText(data, 'ItemDescription') ||
      `${formCode} request`;
    const siteKey = siteKeyFromValue(data.Site);
    let headerRecord: MainDBSTR | null = null;
    const createdLineItems: LineItemsSTR[] = [];

    try {
      headerRecord = await withRetry(() => MainDBSTRService.create({
        title: `${formCode}-${docNo}`,
        appName: APP_NAME,
        documentNo: docNo,
        requestorDisplayName: readText(data, 'Requestor', 'SubmittedBy'),
        requestorEmail: readText(data, 'RequestorEmail', 'SubmittedByEmail'),
        requestedBy: readText(data, 'Requestor', 'SubmittedBy'),
        departmentKey: departmentKeyFromValue(data.Department),
        statusKey,
        description: buildDescription(data),
        currentStage: MainDBSTRStatusKeyToLabel[statusKey],
        formCode,
        formVersion: '1.0',
        siteKey,
        submittedOn,
        dueDate: toIsoString(data.RequiredDate) || toIsoString(data.DueDate),
        targetDate: toIsoString(data.TargetDate),
        priority: readText(data, 'Priority', 'priority'),
        requestTitle,
        urgencyReason: readText(data, 'Justification'),
        workflowAction: isSubmitted ? 'Submit' : 'SaveDraft',
      }));

      for (const [index, item] of getLineItemInputs(data).entries()) {
        createdLineItems.push(await withRetry(() => LineItemsSTRService.create({
          title: `${docNo}-${String(index + 1).padStart(3, '0')}`,
          appName: APP_NAME,
          headerID: String(headerRecord?.id),
          lineItemID: item.itemCode || item.id || String(index + 1),
          itemDescription: item.description || readText(data, 'ItemDescription') || 'Line item',
          quantity: textValue(item.quantity),
          unitCost: textValue(item.unitPrice),
          totalCost: textValue(item.totalPrice),
          remarks: buildLineItemRemarks(item),
          siteKey,
        })));
      }

      if (isSubmitted) {
        await withRetry(() => ApprovalHistorySTRService.create({
          title: `${docNo}-submitted`,
          actionByEmail: readText(data, 'SubmittedByEmail', 'RequestorEmail'),
          actionByName: readText(data, 'SubmittedBy', 'Requestor'),
          actionCode: 'Submit',
          actionComment: readText(data, 'Comments'),
          actionOn: submittedOn || now.toISOString(),
          appName: APP_NAME,
          fromState: 'Draft',
          toState: MainDBSTRStatusKeyToLabel[statusKey],
          parentID: headerRecord?.id,
          recordID: docNo,
          siteKey,
        }));
      }

      return adaptToUIFormat(headerRecord);
    } catch (error) {
      for (const lineItem of createdLineItems.reverse()) {
        try {
          await LineItemsSTRService.delete(String(lineItem.id));
        } catch (deleteError) {
          console.warn('[STR Service] Failed to roll back STR line item:', deleteError);
        }
      }
      if (headerRecord) {
        try {
          await MainDBSTRService.delete(String(headerRecord.id));
        } catch (deleteError) {
          console.warn('[STR Service] Failed to roll back STR header:', deleteError);
        }
      }
      throw error;
    }
  }

  /**
   * Update a submission
   */
  static async update(guid: string, data: Partial<STRForm>): Promise<MainDB_STR_Base | null> {
    try {
      await ensureInitialized();
      const record = await MainDBSTRService.update(guid, {
        ...(data as any as Partial<MainDBSTR>),
      });
      return adaptToUIFormat(record);
    } catch (error) {
      console.error('Error updating STR submission:', error);
      return null;
    }
  }

  /**
   * Submit a draft submission
   */
  static async submit(guid: string, submittedBy: string, submittedByEmail: string): Promise<MainDB_STR_Base | null> {
    try {
      await ensureInitialized();
      const record = await MainDBSTRService.update(guid, {
        statusKey: 'StatusKey1',
        currentStage: 'Submitted',
        submittedOn: new Date().toISOString(),
      });
      return adaptToUIFormat(record);
    } catch (error) {
      console.error('Error submitting STR submission:', error);
      return null;
    }
  }

  /**
   * Delete a submission (only drafts)
   */
  static async delete(guid: string): Promise<boolean> {
    try {
      await ensureInitialized();
      await MainDBSTRService.delete(guid);
      return true;
    } catch (error) {
      console.error('Error deleting STR submission:', error);
      return false;
    }
  }

  /**
   * Approve a submission
   */
  static async approve(
    guid: string,
    approverName: string,
    approverEmail: string,
    comments: string
  ): Promise<MainDB_STR_Base | null> {
    try {
      await ensureInitialized();
      // Get current submission
      const existing = await MainDBSTRService.get(guid);
      if (!existing) return null;

      // Determine next status key
      const nextStatusKey = existing.statusKey === 'StatusKey1' ? 'StatusKey2' : 'StatusKey3';

      const record = await MainDBSTRService.update(guid, {
        statusKey: nextStatusKey,
        currentStage: nextStatusKey === 'StatusKey3' ? 'Approved' : 'Under Review',
        approverRemarks: comments,
      });

      return adaptToUIFormat(record);
    } catch (error) {
      console.error('Error approving STR submission:', error);
      return null;
    }
  }

  /**
   * Reject a submission (requires mandatory comments)
   */
  static async reject(
    guid: string,
    rejectorName: string,
    rejectorEmail: string,
    comments: string
  ): Promise<MainDB_STR_Base | null> {
    if (!comments || comments.trim().length === 0) {
      throw new Error('Comments are mandatory for rejection');
    }

    try {
      await ensureInitialized();
      const record = await MainDBSTRService.update(guid, {
        statusKey: 'StatusKey4',
        currentStage: 'Rejected',
        approverRemarks: comments,
      });
      return adaptToUIFormat(record);
    } catch (error) {
      console.error('Error rejecting STR submission:', error);
      return null;
    }
  }

  /**
   * Return a submission for amendments
   */
  static async return(
    guid: string,
    returnedBy: string,
    returnedByEmail: string,
    comments: string
  ): Promise<MainDB_STR_Base | null> {
    try {
      await ensureInitialized();
      const record = await MainDBSTRService.update(guid, {
        statusKey: 'StatusKey0',
        currentStage: 'Returned',
        approverRemarks: comments,
      });
      return adaptToUIFormat(record);
    } catch (error) {
      console.error('Error returning STR submission:', error);
      return null;
    }
  }

  /**
   * Get approval history for a submission
   */
  static async getApprovalHistory(guid: string): Promise<STR_ApprovalRecord[]> {
    try {
      await ensureInitialized();
      const parentId = Number(guid);
      const records = await ApprovalHistorySTRService.getAll(
        Number.isFinite(parentId) ? { filter: `parentID eq ${parentId}` } : undefined
      );
      return records.map(adaptApprovalToUIFormat);
    } catch (error) {
      console.error('Error fetching approval history:', error);
      return [];
    }
  }
}

// =============================================================================
// STATISTICS HELPERS
// =============================================================================

export async function getSTRStats() {
  const all = await STRSubmissionService.getAll();

  return {
    total: all.length,
    draft: all.filter((s) => s.CurrentStatus === 'Draft').length,
    pending: all.filter((s) => ['Submitted', 'PendingReview', 'PendingApproval'].includes(s.CurrentStatus)).length,
    approved: all.filter((s) => s.CurrentStatus === 'Approved').length,
    rejected: all.filter((s) => s.CurrentStatus === 'Rejected').length,
    returned: all.filter((s) => s.CurrentStatus === 'Returned').length,
  };
}

export async function getSTRModuleStats(moduleFormCodes: string[]) {
  const moduleSubmissions = await STRSubmissionService.getByModule(moduleFormCodes);

  return {
    total: moduleSubmissions.length,
    pending: moduleSubmissions.filter((s) => ['Submitted', 'PendingReview', 'PendingApproval'].includes(s.CurrentStatus)).length,
    approved: moduleSubmissions.filter((s) => s.CurrentStatus === 'Approved').length,
  };
}
