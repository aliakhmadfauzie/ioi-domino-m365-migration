import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBITExtPolicy } from '../models/main-dbit-ext-policy-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'maindb_it_ext_policy';

type Raw = Record<string, unknown>;

const FIELD_MAP: Record<string, string> = {
  id: 'ID',
  title: 'Title',
  parentformcode: 'ParentFormCode',
  parentrecordid: 'ParentRecordId',
};

function translateOptions(options?: IOperationOptions): IOperationOptions | undefined {
  if (!options) return undefined;
  const translated = { ...options };
  const pattern = /\b(parentformcode|parentrecordid|title|id)\b/gi;
  if (translated.filter) {
    translated.filter = translated.filter.replace(pattern, (m) => FIELD_MAP[m.toLowerCase()] ?? m);
  }
  if (translated.orderBy) {
    const arr = Array.isArray(translated.orderBy) ? translated.orderBy : [translated.orderBy];
    translated.orderBy = arr.map((s) => s.replace(pattern, (m) => FIELD_MAP[m.toLowerCase()] ?? m));
  }
  return translated;
}

function str(v: unknown): string | undefined {
  if (v == null) return undefined;
  return String(v);
}

function num(v: unknown): number | undefined {
  if (v == null) return undefined;
  const n = Number(v);
  return isNaN(n) ? undefined : n;
}

function mapToModel(raw: Raw): MainDBITExtPolicy {
  const parent = raw.ParentRecordId ?? raw.ParentID ?? raw.parentRecord;
  const parentObject =
    parent && typeof parent === 'object'
      ? (parent as Record<string, unknown>)
      : undefined;

  return {
    id: num(raw.ID) ?? 0,
    title: str(raw.Title),

    parentFormCode: str(raw.ParentFormCode),
    parentRecordId: num(raw.ParentRecordId ?? raw['ParentID#Id'] ?? parentObject?.Id ?? parentObject?.id),
    parentRecord: {
      id: num(raw.ParentRecordId ?? raw['ParentID#Id'] ?? parentObject?.Id ?? parentObject?.id) ?? 0,
      title: str(parentObject?.Value ?? parentObject?.Title ?? parentObject?.title),
    },

    iOIPPolicyNo: str(raw.IOIP_x003a_PolicyNo ?? raw.IOIPPolicyNo),
    iOIPSubject: str(raw.IOIP_x003a_Subject ?? raw.IOIPSubject),
    iOIPReviNum: str(raw.IOIP_x003a_ReviNum ?? raw.IOIPReviNum),
    iOIPDateIssue: str(raw.IOIP_x003a_DateIssue ?? raw.IOIPDateIssue),
    iOIPBody: str(raw.IOIP_x003a_Body ?? raw.IOIPBody),
    iOIPDocTitle: str(raw.IOIP_x003a_DocTitle ?? raw.IOIPDocTitle),

    iOIPFinalStatus: str(raw.IOIP_x003a_FinalStatus ?? raw.IOIPFinalStatus),
    iOIPDateArchived: str(raw.IOIP_x003a_DateArchived ?? raw.IOIPDateArchived),

    iOIPApp1_1: str(raw.IOIP_x003a_App1_1 ?? raw.IOIPApp1_1),
    iOIPReq1: str(raw.IOIP_x003a_Req1 ?? raw.IOIPReq1),
    iOIPStatus1: str(raw.IOIP_x003a_Status1 ?? raw.IOIPStatus1),
    iOIPDateApproved1: str(raw.IOIP_x003a_DateApproved1 ?? raw.IOIPDateApproved1),
    iOIPComment1: str(raw.IOIP_x003a_Comment1 ?? raw.IOIPComment1),
    iOIPA1replied: str(raw.IOIP_x003a_A1replied ?? raw.IOIPA1replied),

    iOIPApp2_1: str(raw.IOIP_x003a_App2_1 ?? raw.IOIPApp2_1),
    iOIPReq2: str(raw.IOIP_x003a_Req2 ?? raw.IOIPReq2),
    iOIPStatus2: str(raw.IOIP_x003a_Status2 ?? raw.IOIPStatus2),
    iOIPDateApproved2: str(raw.IOIP_x003a_DateApproved2 ?? raw.IOIPDateApproved2),
    iOIPComment2: str(raw.IOIP_x003a_Comment2 ?? raw.IOIPComment2),
    iOIPA2replied: str(raw.IOIP_x003a_A2replied ?? raw.IOIPA2replied),

    iOIPApp3_1: str(raw.IOIP_x003a_App3_1 ?? raw.IOIPApp3_1),
    iOIPReq3: str(raw.IOIP_x003a_Req3 ?? raw.IOIPReq3),
    iOIPStatus3: str(raw.IOIP_x003a_Status3 ?? raw.IOIPStatus3),
    iOIPDateApproved3: str(raw.IOIP_x003a_DateApproved3 ?? raw.IOIPDateApproved3),
    iOIPComment3: str(raw.IOIP_x003a_Comment3 ?? raw.IOIPComment3),
    iOIPA3replied: str(raw.IOIP_x003a_A3replied ?? raw.IOIPA3replied),

    iOIPDefaultList: str(raw.IOIP_x003a_DefaultList ?? raw.IOIPDefaultList),
    iOIPDistributionList: str(raw.IOIP_x003a_DistributionList ?? raw.IOIPDistributionList),

    iOIPRevR: str(raw.IOIP_x003a_RevR ?? raw.IOIPRevR),
    iOIPRevD: str(raw.IOIP_x003a_RevD ?? raw.IOIPRevD),
    iOIPRevU: str(raw.IOIP_x003a_RevU ?? raw.IOIPRevU),
  };
}

function denormalizePolicy(record: Partial<Omit<MainDBITExtPolicy, 'id'>>): Raw {
  const out: Raw = {};
  if (record.title !== undefined) out.Title = record.title;
  if (record.parentFormCode !== undefined) out.ParentFormCode = record.parentFormCode;
  if (record.parentRecordId !== undefined) out.ParentRecordId = record.parentRecordId;
  if (record.parentRecord !== undefined) {
    out.ParentID = { Id: record.parentRecord.id, Value: record.parentRecord.title };
    out.ParentRecordId = record.parentRecord.id;
  }
  if (record.iOIPPolicyNo !== undefined) out.IOIP_x003a_PolicyNo = record.iOIPPolicyNo;
  if (record.iOIPSubject !== undefined) out.IOIP_x003a_Subject = record.iOIPSubject;
  if (record.iOIPReviNum !== undefined) out.IOIP_x003a_ReviNum = record.iOIPReviNum;
  if (record.iOIPDateIssue !== undefined) out.IOIP_x003a_DateIssue = record.iOIPDateIssue;
  if (record.iOIPBody !== undefined) out.IOIP_x003a_Body = record.iOIPBody;
  if (record.iOIPDocTitle !== undefined) out.IOIP_x003a_DocTitle = record.iOIPDocTitle;
  if (record.iOIPFinalStatus !== undefined) out.IOIP_x003a_FinalStatus = record.iOIPFinalStatus;
  if (record.iOIPDateArchived !== undefined) out.IOIP_x003a_DateArchived = record.iOIPDateArchived;
  if (record.iOIPApp1_1 !== undefined) out.IOIP_x003a_App1_1 = record.iOIPApp1_1;
  if (record.iOIPReq1 !== undefined) out.IOIP_x003a_Req1 = record.iOIPReq1;
  if (record.iOIPStatus1 !== undefined) out.IOIP_x003a_Status1 = record.iOIPStatus1;
  if (record.iOIPDateApproved1 !== undefined) out.IOIP_x003a_DateApproved1 = record.iOIPDateApproved1;
  if (record.iOIPComment1 !== undefined) out.IOIP_x003a_Comment1 = record.iOIPComment1;
  if (record.iOIPA1replied !== undefined) out.IOIP_x003a_A1replied = record.iOIPA1replied;
  if (record.iOIPApp2_1 !== undefined) out.IOIP_x003a_App2_1 = record.iOIPApp2_1;
  if (record.iOIPReq2 !== undefined) out.IOIP_x003a_Req2 = record.iOIPReq2;
  if (record.iOIPStatus2 !== undefined) out.IOIP_x003a_Status2 = record.iOIPStatus2;
  if (record.iOIPDateApproved2 !== undefined) out.IOIP_x003a_DateApproved2 = record.iOIPDateApproved2;
  if (record.iOIPComment2 !== undefined) out.IOIP_x003a_Comment2 = record.iOIPComment2;
  if (record.iOIPA2replied !== undefined) out.IOIP_x003a_A2replied = record.iOIPA2replied;
  if (record.iOIPApp3_1 !== undefined) out.IOIP_x003a_App3_1 = record.iOIPApp3_1;
  if (record.iOIPReq3 !== undefined) out.IOIP_x003a_Req3 = record.iOIPReq3;
  if (record.iOIPStatus3 !== undefined) out.IOIP_x003a_Status3 = record.iOIPStatus3;
  if (record.iOIPDateApproved3 !== undefined) out.IOIP_x003a_DateApproved3 = record.iOIPDateApproved3;
  if (record.iOIPComment3 !== undefined) out.IOIP_x003a_Comment3 = record.iOIPComment3;
  if (record.iOIPA3replied !== undefined) out.IOIP_x003a_A3replied = record.iOIPA3replied;
  if (record.iOIPDefaultList !== undefined) out.IOIP_x003a_DefaultList = record.iOIPDefaultList;
  if (record.iOIPDistributionList !== undefined) out.IOIP_x003a_DistributionList = record.iOIPDistributionList;
  if (record.iOIPRevR !== undefined) out.IOIP_x003a_RevR = record.iOIPRevR;
  if (record.iOIPRevD !== undefined) out.IOIP_x003a_RevD = record.iOIPRevD;
  if (record.iOIPRevU !== undefined) out.IOIP_x003a_RevU = record.iOIPRevU;
  return out;
}

export const MainDBITExtPolicyService = {
  async getList(options?: IOperationOptions): Promise<MainDBITExtPolicy[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DATA_SOURCE_NAME, translateOptions(options));
    if (!result.success) throw result.error;
    return (result.data as Raw[]).map(mapToModel);
  },

  async getById(id: number, options?: IOperationOptions): Promise<MainDBITExtPolicy | undefined> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, String(id), translateOptions(options));
    if (!result.success) throw result.error;
    if (!result.data) return undefined;
    return mapToModel(result.data as Raw);
  },

  async create(data: Omit<MainDBITExtPolicy, 'id'>, options?: IOperationOptions): Promise<MainDBITExtPolicy> {
    void options;
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, denormalizePolicy(data));
    if (!result.success) throw result.error;
    return mapToModel(result.data as Raw);
  },

  async update(id: number, data: Partial<MainDBITExtPolicy>, options?: IOperationOptions): Promise<MainDBITExtPolicy> {
    void options;
    const result = await getClient().updateRecordAsync(DATA_SOURCE_NAME, String(id), denormalizePolicy(data));
    if (!result.success) throw result.error;
    return mapToModel(result.data as Raw);
  },

  async delete(id: number, options?: IOperationOptions): Promise<void> {
    void options;
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, String(id));
    if (!result.success) throw result.error;
  },
};
