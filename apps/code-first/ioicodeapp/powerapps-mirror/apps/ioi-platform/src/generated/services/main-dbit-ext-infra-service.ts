import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBITExtInfra } from '../models/main-dbit-ext-infra-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'maindb_it_ext_infra';

type Raw = Record<string, unknown>;

function parentObject(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' ? value as Record<string, unknown> : undefined;
}

function translateOptions(options?: IOperationOptions): IOperationOptions | undefined {
  if (!options) return undefined;
  const translated = { ...options };
  if (translated.filter) {
    translated.filter = translated.filter
      .replace(/\bparentRecord\/(?:id|ID)\b/gi, 'ParentID/Id')
      .replace(/\bparentRecord\b/gi, 'ParentID')
      .replace(/\bparentFormCode\b/gi, 'ParentFormCode')
      .replace(/\bparentSite\b/gi, 'ParentSite')
      .replace(/\btitle\b/gi, 'Title')
      .replace(/\bid\b/gi, 'ID');
  }
  return translated;
}

function str(v: unknown): string | undefined {
  if (typeof v === 'string') return v;
  if (v === null || v === undefined) return undefined;
  return String(v);
}

function num(v: unknown): number | undefined {
  if (typeof v === 'number') return v;
  if (typeof v === 'string' && v.trim()) { const n = Number(v); return Number.isNaN(n) ? undefined : n; }
  return undefined;
}

function normalize(r: Raw): MainDBITExtInfra {
  const parent = r.parentRecord ?? r.ParentID;
  const parentLookup = parentObject(parent);
  return {
    id: num(r.id) ?? num(r.ID) ?? 0,
    title: str(r.title) ?? str(r.Title) ?? '',
    parentFormCode: str(r.parentFormCode) ?? str(r.ParentFormCode) ?? '',
    parentRecord: (r.parentRecord as MainDBITExtInfra['parentRecord']) ?? {
      id: num(r['ParentID#Id'] ?? parentLookup?.Id ?? parentLookup?.id) ?? 0,
      title: str(parentLookup?.Value ?? parentLookup?.Title ?? parentLookup?.title ?? r.ParentID) ?? '',
    },
    parentSite: str(r.parentSite) ?? str(r.ParentSite),
    // IAL1
    iAL1Site: str(r.iAL1Site) ?? str(r.IAL1_Site),
    iAL1RebootType: str(r.iAL1RebootType) ?? str(r.IAL1_RebootType),
    iAL1ServerName: str(r.iAL1ServerName) ?? str(r.IAL1_ServerName),
    iAL1DownDate: str(r.iAL1DownDate) ?? str(r.IAL1_DownDate),
    iAL1DownTime: str(r.iAL1DownTime) ?? str(r.IAL1_DownTime),
    iAL1UpDate: str(r.iAL1UpDate) ?? str(r.IAL1_UpDate),
    iAL1UpTime: str(r.iAL1UpTime) ?? str(r.IAL1_UpTime),
    iAL1TotalDowntime: num(r.iAL1TotalDowntime) ?? num(r.IAL1_TotalDowntime),
    iAL1Reason: str(r.iAL1Reason) ?? str(r.IAL1_Reason),
    iAL1PerformedBy: str(r.iAL1PerformedBy) ?? str(r.IAL1_PerformedBy),
    // IAL2
    iAL2Site: str(r.iAL2Site) ?? str(r.IAL2_Site),
    iAL2ServerRoom: str(r.iAL2ServerRoom) ?? str(r.IAL2_ServerRoom),
    iAL2AccessDate: str(r.iAL2AccessDate) ?? str(r.IAL2_AccessDate),
    iAL2TimeIn: str(r.iAL2TimeIn) ?? str(r.IAL2_TimeIn),
    iAL2VisitorName: str(r.iAL2VisitorName) ?? str(r.IAL2_VisitorName),
    iAL2Company: str(r.iAL2Company) ?? str(r.IAL2_Company),
    iAL2Reason: str(r.iAL2Reason) ?? str(r.IAL2_Reason),
    iAL2AttendedBy: str(r.iAL2AttendedBy) ?? str(r.IAL2_AttendedBy),
    // IAL3
    iAL3EventType: str(r.iAL3EventType) ?? str(r.IAL3_EventType),
    iAL3Description: str(r.iAL3Description) ?? str(r.IAL3_Description),
    iAL3Purpose: str(r.iAL3Purpose) ?? str(r.IAL3_Purpose),
    iAL3Hardware: str(r.iAL3Hardware) ?? str(r.IAL3_Hardware),
    iAL3DateFrom: str(r.iAL3DateFrom) ?? str(r.IAL3_DateFrom),
    iAL3TimeFrom: str(r.iAL3TimeFrom) ?? str(r.IAL3_TimeFrom),
    iAL3DateTo: str(r.iAL3DateTo) ?? str(r.IAL3_DateTo),
    iAL3TimeTo: str(r.iAL3TimeTo) ?? str(r.IAL3_TimeTo),
    // IAL4
    iAL4Site: str(r.iAL4Site) ?? str(r.IAL4_Site),
    iAL4ServerName: str(r.iAL4ServerName) ?? str(r.IAL4_ServerName),
    iAL4RecordType: str(r.iAL4RecordType) ?? str(r.IAL4_RecordType),
    iAL4Mode: str(r.iAL4Mode) ?? str(r.IAL4_Mode),
    iAL4DateFrom: str(r.iAL4DateFrom) ?? str(r.IAL4_DateFrom),
    iAL4DateTo: str(r.iAL4DateTo) ?? str(r.IAL4_DateTo),
    iAL4Summary: str(r.iAL4Summary) ?? str(r.IAL4_Summary),
    iAL4RootCause: str(r.iAL4RootCause) ?? str(r.IAL4_RootCause),
    iAL4CorrectiveActions: str(r.iAL4CorrectiveActions) ?? str(r.IAL4_CorrectiveActions),
    iAL4PreventiveActions: str(r.iAL4PreventiveActions) ?? str(r.IAL4_PreventiveActions),
    // IAL5
    iAL5Site: str(r.iAL5Site) ?? str(r.IAL5_Site),
    iAL5Dept: str(r.iAL5Dept) ?? str(r.IAL5_Dept),
    iAL5BackupDate: str(r.iAL5BackupDate) ?? str(r.IAL5_BackupDate),
    iAL5ServerName: str(r.iAL5ServerName) ?? str(r.IAL5_ServerName),
    iAL5FilePath: str(r.iAL5FilePath) ?? str(r.IAL5_FilePath),
    iAL5FileName: str(r.iAL5FileName) ?? str(r.IAL5_FileName),
    iAL5Reason: str(r.iAL5Reason) ?? str(r.IAL5_Reason),
    iAL5MediaName: str(r.iAL5MediaName) ?? str(r.IAL5_MediaName),
    iAL5RestoredFileName: str(r.iAL5RestoredFileName) ?? str(r.IAL5_RestoredFileName),
    // SRVR
    sRVRSite: str(r.sRVRSite) ?? str(r.SRVR_Site),
    sRVRDept: str(r.sRVRDept) ?? str(r.SRVR_Dept),
    sRVRRequestType: str(r.sRVRRequestType) ?? str(r.SRVR_RequestType),
    sRVRServerType: str(r.sRVRServerType) ?? str(r.SRVR_ServerType),
    sRVRServerName: str(r.sRVRServerName) ?? str(r.SRVR_ServerName),
    sRVROS: str(r.sRVROS) ?? str(r.SRVR_OS),
    sRVRCPU: str(r.sRVRCPU) ?? str(r.SRVR_CPU),
    sRVRMemory: str(r.sRVRMemory) ?? str(r.SRVR_Memory),
    sRVRStorage: str(r.sRVRStorage) ?? str(r.SRVR_Storage),
    sRVRNetwork: str(r.sRVRNetwork) ?? str(r.SRVR_Network),
    sRVRApplication: str(r.sRVRApplication) ?? str(r.SRVR_Application),
    sRVRPurpose: str(r.sRVRPurpose) ?? str(r.SRVR_Purpose),
    sRVRRequiredDate: str(r.sRVRRequiredDate) ?? str(r.SRVR_RequiredDate),
    sRVRHODEmail: str(r.sRVRHODEmail) ?? str(r.SRVR_HODEmail),
    sRVRServerIP: str(r.sRVRServerIP) ?? str(r.SRVR_ServerIP),
    sRVREstimatedCost: num(r.sRVREstimatedCost) ?? num(r.SRVR_EstimatedCost),
    // HWRR
    hWRRSite: str(r.hWRRSite) ?? str(r.HWRR_Site),
    hWRRDept: str(r.hWRRDept) ?? str(r.HWRR_Dept),
    hWRRRequestType: str(r.hWRRRequestType) ?? str(r.HWRR_RequestType),
    hWRRHardwareType: str(r.hWRRHardwareType) ?? str(r.HWRR_HardwareType),
    hWRRQuantity: num(r.hWRRQuantity) ?? num(r.HWRR_Quantity),
    hWRRSpecs: str(r.hWRRSpecs) ?? str(r.HWRR_Specs),
    hWRRForUserEmail: str(r.hWRRForUserEmail) ?? str(r.HWRR_ForUserEmail),
    hWRRLocation: str(r.hWRRLocation) ?? str(r.HWRR_Location),
    hWRRJustification: str(r.hWRRJustification) ?? str(r.HWRR_Justification),
    hWRRRequiredDate: str(r.hWRRRequiredDate) ?? str(r.HWRR_RequiredDate),
    hWRRPriority: str(r.hWRRPriority) ?? str(r.HWRR_Priority),
    hWRRPONumber: str(r.hWRRPONumber) ?? str(r.HWRR_PONumber),
    hWRRVendor: str(r.hWRRVendor) ?? str(r.HWRR_Vendor),
    hWRRActualCost: num(r.hWRRActualCost) ?? num(r.HWRR_ActualCost),
    hWRRNewAssetTag: str(r.hWRRNewAssetTag) ?? str(r.HWRR_NewAssetTag),
    hWRRNewSerialNo: str(r.hWRRNewSerialNo) ?? str(r.HWRR_NewSerialNo),
    hWRRHODEmail: str(r.hWRRHODEmail) ?? str(r.HWRR_HODEmail),
  };
}

function denormalize(record: Partial<Omit<MainDBITExtInfra, 'id'>>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...record };
  if (record.title !== undefined) out.Title = record.title;
  if (record.parentFormCode !== undefined) out.ParentFormCode = record.parentFormCode;
  if (record.parentSite !== undefined) out.ParentSite = record.parentSite;
  if (record.parentRecord !== undefined) {
    out.ParentID = { Id: record.parentRecord.id, Value: record.parentRecord.title };
  }
  delete out.title;
  delete out.parentFormCode;
  delete out.parentSite;
  delete out.parentRecord;
  return out;
}

export class MainDBITExtInfraService {
  static async create(record: Omit<MainDBITExtInfra, 'id'>): Promise<MainDBITExtInfra> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, denormalize(record));
    if (!result.success) throw result.error;
    return normalize(result.data as Raw);
  }

  static async update(id: string, changedFields: Partial<Omit<MainDBITExtInfra, 'id'>>): Promise<MainDBITExtInfra> {
    const result = await getClient().updateRecordAsync(DATA_SOURCE_NAME, id, denormalize(changedFields));
    if (!result.success) throw result.error;
    return normalize(result.data as Raw);
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<MainDBITExtInfra> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return normalize(result.data as Raw);
  }

  static async getAll(options?: IOperationOptions): Promise<MainDBITExtInfra[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DATA_SOURCE_NAME, translateOptions(options));
    if (!result.success) throw result.error;
    return (result.data as Raw[]).map(normalize);
  }
}
