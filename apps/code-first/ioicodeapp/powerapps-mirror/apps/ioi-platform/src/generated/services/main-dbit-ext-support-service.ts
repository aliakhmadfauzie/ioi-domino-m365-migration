import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBITExtSupport } from '../models/main-dbit-ext-support-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'maindb_it_ext_support';

type RawExtSupport = Partial<MainDBITExtSupport> & Record<string, unknown>;

// Translate model camelCase names → SP column names in OData filter/orderBy
const EXT_SUPPORT_FIELD_MAP: Record<string, string> = {
  parentformcode: 'ParentFormCode',
  parentsite: 'ParentSite',
  title: 'Title',
  id: 'ID',
};

function translateOptions(options?: IOperationOptions): IOperationOptions | undefined {
  if (!options) return undefined;
  const translated = { ...options };
  const pattern = /\b(parentformcode|parentsite|title|id)\b/gi;
  if (translated.filter) {
    translated.filter = translated.filter.replace(
      pattern,
      (m) => EXT_SUPPORT_FIELD_MAP[m.toLowerCase()] ?? m
    );
  }
  if (translated.orderBy) {
    const arr = Array.isArray(translated.orderBy) ? translated.orderBy : [translated.orderBy];
    translated.orderBy = arr.map((s) =>
      s.replace(pattern, (m) => EXT_SUPPORT_FIELD_MAP[m.toLowerCase()] ?? m)
    );
  }
  return translated;
}

function str(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return undefined;
  return String(value);
}

function num(value: unknown): number | undefined {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

function normalizeExtSupport(record: RawExtSupport): MainDBITExtSupport {
  const parent = record.parentRecord ?? record.ParentID;
  const parentObject =
    parent && typeof parent === 'object'
      ? (parent as Record<string, unknown>)
      : undefined;

  return {
    ...record,
    id: record.id ?? num(record.ID ?? record.ItemInternalId) ?? 0,
    title: record.title ?? str(record.Title) ?? '',
    iTDR2AssignedTo: record.iTDR2AssignedTo ?? str(record.ITDR2_AssignedTo),
    iTDR2ClosedDate: record.iTDR2ClosedDate ?? str(record.ITDR2_ClosedDate_dt ?? record.ITDR2_ClosedDate),
    iTDR2DueDate: record.iTDR2DueDate ?? str(record.ITDR2_DueDate_dt ?? record.ITDR2_DueDate),
    iTDR2TaskDescription: record.iTDR2TaskDescription ?? str(record.ITDR2_TaskDescription),
    iTDR2TaskStatus: record.iTDR2TaskStatus ?? str(record.ITDR2_TaskStatus),
    iTDR2Year: record.iTDR2Year ?? str(record.ITDR2_Year),
    iTDR2Month: record.iTDR2Month ?? str(record.ITDR2_Month),
    iTDR2Title: record.iTDR2Title ?? str(record.ITDR2_Title),
    iTDR2Category: record.iTDR2Category ?? str(record.ITDR2_Category),
    iTDR2Priority: record.iTDR2Priority ?? str(record.ITDR2_Priority),
    iTDR2Remarks: record.iTDR2Remarks ?? str(record.ITDR2_Remarks),
    iTDRActivityType: record.iTDRActivityType ?? str(record.ITDR_ActivityType),
    iTDRCategory: record.iTDRCategory ?? str(record.ITDR_Category),
    iTDRDisplayText: record.iTDRDisplayText ?? str(record.ITDR_DisplayText),
    iTDRDocAuthor: record.iTDRDocAuthor ?? str(record.ITDR_DocAuthor),
    iTDRAuditCreatedDate: record.iTDRAuditCreatedDate ?? str(record.ITDR_AuditCreatedDate),
    iTDRDateFrom: record.iTDRDateFrom ?? str(record.ITDR_DateFrom_dt ?? record.ITDR_DateFrom),
    iTDRDateTo: record.iTDRDateTo ?? str(record.ITDR_DateTo_dt ?? record.ITDR_DateTo),
    iTDRParticipants: record.iTDRParticipants ?? str(record.ITDR_Participants),
    iTDRMeetingChairman: record.iTDRMeetingChairman ?? str(record.ITDR_MeetingChairman),
    iTDRTimeFrom: record.iTDRTimeFrom ?? str(record.ITDR_TimeFrom),
    iTDRTimeTo: record.iTDRTimeTo ?? str(record.ITDR_TimeTo),
    iTDRTrainer: record.iTDRTrainer ?? str(record.ITDR_Trainer),
    iTDROtCategory: record.iTDROtCategory ?? str(record.ITDR_OTCategory),
    iTDROtPurpose: record.iTDROtPurpose ?? str(record.ITDR_OTPurpose),
    iTDRVenue: record.iTDRVenue ?? str(record.ITDR_Venue),
    iTSSRAssignedToEmail: record.iTSSRAssignedToEmail ?? str(record.ITSSR_AssignedTo_Email),
    iTSSRSendToEmail: record.iTSSRSendToEmail ?? str(record.ITSSR_SendTo_Email),
    iTSSRCaseNo: record.iTSSRCaseNo ?? str(record.ITSSR_CaseNo),
    iTSSRDateAccepted: record.iTSSRDateAccepted ?? str(record.ITSSR_DateAccepted),
    iTSSRDateResolved: record.iTSSRDateResolved ?? str(record.ITSSR_DateResolved),
    iTSSRDateStarted: record.iTSSRDateStarted ?? str(record.ITSSR_DateStarted),
    iTSSRProblemCategory: record.iTSSRProblemCategory ?? str(record.ITSSR_ProblemCategory),
    iTSSRProblemDescription:
      record.iTSSRProblemDescription ?? str(record.ITSSR_ProblemDescription),
    iTSSRReportedByEmail: record.iTSSRReportedByEmail ?? str(record.ITSSR_ReportedBy_Email),
    iTSSRSatisfactionRating:
      record.iTSSRSatisfactionRating ?? num(record.ITSSR_SatisfactionRating),
    iTSSRServiceType: record.iTSSRServiceType ?? str(record.ITSSR_ServiceType),
    iTSSRSolution: record.iTSSRSolution ?? str(record.ITSSR_Solution),
    iTSSRSupportMethod: record.iTSSRSupportMethod ?? str(record.ITSSR_SupportMethod),
    iTSSRDepartment: record.iTSSRDepartment ?? str(record.ITSSR_Department),
    iTSSRExtension: record.iTSSRExtension ?? str(record.ITSSR_Extension),
    iTSSRServiceType2: record.iTSSRServiceType2 ?? str(record.ITSSR_ServiceType2),
    iTSSRHardware: record.iTSSRHardware ?? str(record.ITSSR_Hardware),
    iTSSRHardware2: record.iTSSRHardware2 ?? str(record.ITSSR_Hardware2),
    iTSSRApplication: record.iTSSRApplication ?? str(record.ITSSR_Application),
    iTSSRModule: record.iTSSRModule ?? str(record.ITSSR_Module),
    iTSSRSAPModule: record.iTSSRSAPModule ?? str(record.ITSSR_SAPModule),
    iTSSRBankModule: record.iTSSRBankModule ?? str(record.ITSSR_BankModule),
    iTSSRCC: record.iTSSRCC ?? str(record.ITSSR_CC),
    iTSSRITRemarks: record.iTSSRITRemarks ?? str(record.ITSSR_ITRemarks),
    iTSSRDateNotified: record.iTSSRDateNotified ?? str(record.ITSSR_DateNotified),
    iTSSRDateClosed: record.iTSSRDateClosed ?? str(record.ITSSR_DateClosed),
    iTSSRITName: record.iTSSRITName ?? str(record.ITSSR_ITName),
    iTSSRProblemCategory2: record.iTSSRProblemCategory2 ?? str(record.ITSSR_ProblemCategory2),
    iTSSRRequestorComment: record.iTSSRRequestorComment ?? str(record.ITSSR_RequestorComment),
    parentFormCode: record.parentFormCode ?? str(record.ParentFormCode) ?? '',
    parentRecord: record.parentRecord ?? {
      id: num(record['ParentID#Id'] ?? parentObject?.Id ?? parentObject?.id) ?? 0,
      title: str(parentObject?.Value ?? parentObject?.Title ?? parentObject?.title) ?? '',
    },
    parentSite: record.parentSite ?? str(record.ParentSite),
  };
}

function denormalizeExtSupport(
  record: Partial<Omit<MainDBITExtSupport, 'id'>>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (record.title !== undefined) out.Title = record.title;
  if (record.parentFormCode !== undefined) out.ParentFormCode = record.parentFormCode;
  if (record.parentSite !== undefined) out.ParentSite = record.parentSite;
  if (record.parentRecord !== undefined) {
    out.ParentID = { Id: record.parentRecord.id, Value: record.parentRecord.title };
  }
  if (record.iTDRDateFrom !== undefined) out.ITDR_DateFrom_dt = record.iTDRDateFrom;
  if (record.iTDRDateTo !== undefined) out.ITDR_DateTo_dt = record.iTDRDateTo;
  if (record.iTDRCategory !== undefined) out.ITDR_Category = record.iTDRCategory;
  if (record.iTDRActivityType !== undefined) out.ITDR_ActivityType = record.iTDRActivityType;
  if (record.iTDRDisplayText !== undefined) out.ITDR_DisplayText = record.iTDRDisplayText;
  if (record.iTDRDocAuthor !== undefined) out.ITDR_DocAuthor = record.iTDRDocAuthor;
  if (record.iTDRAuditCreatedDate !== undefined)
    out.ITDR_AuditCreatedDate = record.iTDRAuditCreatedDate;
  if (record.iTDRVenue !== undefined) out.ITDR_Venue = record.iTDRVenue;
  if (record.iTDRParticipants !== undefined) out.ITDR_Participants = record.iTDRParticipants;
  if (record.iTDRMeetingChairman !== undefined)
    out.ITDR_MeetingChairman = record.iTDRMeetingChairman;
  if (record.iTDRTimeFrom !== undefined) out.ITDR_TimeFrom = record.iTDRTimeFrom;
  if (record.iTDRTimeTo !== undefined) out.ITDR_TimeTo = record.iTDRTimeTo;
  if (record.iTDRTrainer !== undefined) out.ITDR_Trainer = record.iTDRTrainer;
  if (record.iTDROtCategory !== undefined) out.ITDR_OTCategory = record.iTDROtCategory;
  if (record.iTDROtPurpose !== undefined) out.ITDR_OTPurpose = record.iTDROtPurpose;
  if (record.iTDR2TaskDescription !== undefined)
    out.ITDR2_TaskDescription = record.iTDR2TaskDescription;
  if (record.iTDR2AssignedTo !== undefined) out.ITDR2_AssignedTo = record.iTDR2AssignedTo;
  if (record.iTDR2DueDate !== undefined) out.ITDR2_DueDate_dt = record.iTDR2DueDate;
  if (record.iTDR2TaskStatus !== undefined) out.ITDR2_TaskStatus = record.iTDR2TaskStatus;
  if (record.iTDR2ClosedDate !== undefined) out.ITDR2_ClosedDate_dt = record.iTDR2ClosedDate;
  if (record.iTDR2Year !== undefined) out.ITDR2_Year = record.iTDR2Year;
  if (record.iTDR2Month !== undefined) out.ITDR2_Month = record.iTDR2Month;
  if (record.iTDR2Title !== undefined) out.ITDR2_Title = record.iTDR2Title;
  if (record.iTDR2Category !== undefined) out.ITDR2_Category = record.iTDR2Category;
  if (record.iTDR2Priority !== undefined) out.ITDR2_Priority = record.iTDR2Priority;
  if (record.iTDR2Remarks !== undefined) out.ITDR2_Remarks = record.iTDR2Remarks;
  if (record.iTSSRCaseNo !== undefined) out.ITSSR_CaseNo = record.iTSSRCaseNo;
  if (record.iTSSRServiceType !== undefined) out.ITSSR_ServiceType = record.iTSSRServiceType;
  if (record.iTSSRProblemDescription !== undefined)
    out.ITSSR_ProblemDescription = record.iTSSRProblemDescription;
  if (record.iTSSRReportedByEmail !== undefined)
    out.ITSSR_ReportedBy_Email = record.iTSSRReportedByEmail;
  if (record.iTSSRAssignedToEmail !== undefined)
    out.ITSSR_AssignedTo_Email = record.iTSSRAssignedToEmail;
  if (record.iTSSRSendToEmail !== undefined)
    out.ITSSR_SendTo_Email = record.iTSSRSendToEmail;
  if (record.iTSSRProblemCategory !== undefined)
    out.ITSSR_ProblemCategory = record.iTSSRProblemCategory;
  if (record.iTSSRSupportMethod !== undefined) out.ITSSR_SupportMethod = record.iTSSRSupportMethod;
  if (record.iTSSRSolution !== undefined) out.ITSSR_Solution = record.iTSSRSolution;
  if (record.iTSSRDateStarted !== undefined) out.ITSSR_DateStarted = record.iTSSRDateStarted;
  if (record.iTSSRDateResolved !== undefined) out.ITSSR_DateResolved = record.iTSSRDateResolved;
  if (record.iTSSRDateAccepted !== undefined) out.ITSSR_DateAccepted = record.iTSSRDateAccepted;
  if (record.iTSSRSatisfactionRating !== undefined)
    out.ITSSR_SatisfactionRating = record.iTSSRSatisfactionRating;
  if (record.iTSSRDepartment !== undefined) out.ITSSR_Department = record.iTSSRDepartment;
  if (record.iTSSRExtension !== undefined) out.ITSSR_Extension = record.iTSSRExtension;
  if (record.iTSSRServiceType2 !== undefined) out.ITSSR_ServiceType2 = record.iTSSRServiceType2;
  if (record.iTSSRHardware !== undefined) out.ITSSR_Hardware = record.iTSSRHardware;
  if (record.iTSSRHardware2 !== undefined) out.ITSSR_Hardware2 = record.iTSSRHardware2;
  if (record.iTSSRApplication !== undefined) out.ITSSR_Application = record.iTSSRApplication;
  if (record.iTSSRModule !== undefined) out.ITSSR_Module = record.iTSSRModule;
  if (record.iTSSRSAPModule !== undefined) out.ITSSR_SAPModule = record.iTSSRSAPModule;
  if (record.iTSSRBankModule !== undefined) out.ITSSR_BankModule = record.iTSSRBankModule;
  if (record.iTSSRCC !== undefined) out.ITSSR_CC = record.iTSSRCC;
  if (record.iTSSRITRemarks !== undefined) out.ITSSR_ITRemarks = record.iTSSRITRemarks;
  if (record.iTSSRDateNotified !== undefined) out.ITSSR_DateNotified = record.iTSSRDateNotified;
  if (record.iTSSRDateClosed !== undefined) out.ITSSR_DateClosed = record.iTSSRDateClosed;
  if (record.iTSSRITName !== undefined) out.ITSSR_ITName = record.iTSSRITName;
  if (record.iTSSRProblemCategory2 !== undefined)
    out.ITSSR_ProblemCategory2 = record.iTSSRProblemCategory2;
  if (record.iTSSRRequestorComment !== undefined)
    out.ITSSR_RequestorComment = record.iTSSRRequestorComment;
  return out;
}

export class MainDBITExtSupportService {
  static async create(record: Omit<MainDBITExtSupport, 'id'>): Promise<MainDBITExtSupport> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, denormalizeExtSupport(record));
    if (!result.success) throw result.error;
    return normalizeExtSupport(result.data as RawExtSupport);
  }

  static async update(
    id: string,
    changedFields: Partial<Omit<MainDBITExtSupport, 'id'>>
  ): Promise<MainDBITExtSupport> {
    const result = await getClient().updateRecordAsync(
      DATA_SOURCE_NAME,
      id,
      denormalizeExtSupport(changedFields)
    );
    if (!result.success) throw result.error;
    return normalizeExtSupport(result.data as RawExtSupport);
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<MainDBITExtSupport> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return normalizeExtSupport(result.data as RawExtSupport);
  }

  static async getAll(options?: IOperationOptions): Promise<MainDBITExtSupport[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(
      DATA_SOURCE_NAME,
      translateOptions(options)
    );
    if (!result.success) throw result.error;
    return (result.data as RawExtSupport[]).map(normalizeExtSupport);
  }
}
