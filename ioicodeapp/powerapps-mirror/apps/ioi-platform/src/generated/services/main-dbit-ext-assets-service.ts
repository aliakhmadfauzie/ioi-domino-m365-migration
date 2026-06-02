import { getClient } from '../../../app-gen-sdk/data';
import type { MainDBITExtAssets } from '../models/main-dbit-ext-assets-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'maindb_it_ext_assets';

type RawAssets = Record<string, unknown>;

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

function str(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return undefined;
  return String(value);
}

function num(value: unknown): number | undefined {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim()) {
    const n = Number(value);
    return Number.isNaN(n) ? undefined : n;
  }
  return undefined;
}

const FIELD_TO_SP: Record<string, string> = {
  hIAssetNo: 'HI_AssetNo',
  hICompany: 'HI_Company',
  hIComputerName: 'HI_ComputerName',
  hIDepartment: 'HI_Department',
  hILastAuditedDate: 'HI_LastAuditedDate_dt',
  hILocation: 'HI_Location',
  hIMachineID: 'HI_MachineID',
  hIMonth: 'HI_Month',
  hIOfficeVersion: 'HI_OfficeVersion',
  hIPurchaseDate: 'HI_PurchaseDate_dt',
  hIPurchasePrice: 'HI_PurchasePrice',
  hIPONumber: 'HI_PONumber',
  hIWarrantyExpiry: 'HI_WarrantyExpiry_dt',
  hICondition: 'HI_Condition',
  hISpecifications: 'HI_Specifications',
  hISerialNo: 'HI_SerialNo',
  hISite: 'HI_Site',
  hIBuilding: 'HI_Building',
  hIFloor: 'HI_Floor',
  hIRoom: 'HI_Room',
  hIStatus: 'HI_Status',
  hITagNo: 'HI_TagNo',
  hIType: 'HI_Type',
  hIUsedByEmail: 'HI_UsedBy_Email',
  hIVendor: 'HI_Vendor',
  hIWindowsVersion: 'HI_WinVersion',
  hIYear: 'HI_Year',
  iTSCChecklistYear: 'ITSC_ChecklistYear',
  iTSCReviewedBy: 'ITSC_ReviewedBy',
  iTSCReviewedDate: 'ITSC_ReviewedDate_dt',
  iTSCServerName: 'ITSC_ServerName',
  hIModel: 'HI_Model',
  hICPU: 'HI_CPU',
  hICPUModel: 'HI_CPUModel',
  hICPUType: 'HI_CPUType',
  hICPUSerialNo: 'HI_CPUSerialNo',
  hIHDDSize: 'HI_HDDSize',
  hIHDDType: 'HI_HDDType',
  hIRAM: 'HI_RAM',
  hIRAMSize: 'HI_RAMSize',
  hIRAMType: 'HI_RAMType',
  hIMonitorModel: 'HI_MonitorModel',
  hIMonitorSize: 'HI_MonitorSize',
  hIMonitorType: 'HI_MonitorType',
  hICDType: 'HI_CDType',
  hIVLAN: 'HI_VLAN',
  hISANStorage: 'HI_SANStorage',
  hIIPAddress: 'HI_IPAddress',
  hIMACAddress: 'HI_MACAddress',
  hIOSVersion: 'HI_OSVersion',
  hIWinServicePack: 'HI_WinServicePack',
  hIWinKey: 'HI_WinKey',
  hIMSOfficeVer: 'HI_MSOfficeVer',
  hIMSOfficeKey: 'HI_MSOfficeKey',
  hIMSVersion: 'HI_MSVersion',
  hIAntiVirusVersion: 'HI_AntiVirusVersion',
  hINotesVer: 'HI_NotesVer',
  hINotesVersion: 'HI_NotesVersion',
  hIMSEmail: 'HI_MSEmail',
  hIDRP: 'HI_DRP',
  hISentBy: 'HI_SentBy',
  hIProbFindings: 'HI_ProbFindings',
  hIActions: 'HI_Actions',
  hIPreviousUser: 'HI_PreviousUser',
  hICarNo: 'HI_CarNo',
  hIFARNo: 'HI_FARNo',
  hIInvoiceNo: 'HI_InvoiceNo',
  hIServerType: 'HI_ServerType',
  hIAccessType: 'HI_AccessType',
  hIKeyboardLanguage: 'HI_KeyboardLanguage',
};

// SP column names (HI_TagNo, ITSC_ServerName, etc.) → model camelCase (hITagNo, iTSCServerName, etc.)
function normalizeAssets(record: RawAssets): MainDBITExtAssets {
  const parent = record.parentRecord ?? record.ParentID;
  const parentLookup = parentObject(parent);
  return {
    id: num(record.id) ?? num(record.ID) ?? 0,
    title: str(record.title) ?? str(record.Title) ?? '',
    hIAssetNo: str(record.hIAssetNo) ?? str(record.HI_AssetNo),
    hICompany: str(record.hICompany) ?? str(record.HI_Company),
    hIComputerName: str(record.hIComputerName) ?? str(record.HI_ComputerName),
    hIDepartment: str(record.hIDepartment) ?? str(record.HI_Department),
    hILastAuditedDate:
      str(record.hILastAuditedDate) ??
      str(record.HI_LastAuditedDate_dt) ??
      str(record.HI_LastAuditedDate),
    hILocation: str(record.hILocation) ?? str(record.HI_Location),
    hIMachineID: str(record.hIMachineID) ?? str(record.HI_MachineID),
    hIMonth: num(record.hIMonth) ?? num(record.HI_Month),
    hIOfficeVersion:
      str(record.hIOfficeVersion) ??
      str(record.HI_OfficeVersion) ??
      str(record.HI_MSVersion) ??
      str(record.HI_MSOfficeVer),
    hIPurchaseDate:
      str(record.hIPurchaseDate) ??
      str(record.HI_PurchaseDate_dt) ??
      str(record.HI_PurchaseDate),
    hIPurchasePrice: num(record.hIPurchasePrice) ?? num(record.HI_PurchasePrice),
    hIPONumber: str(record.hIPONumber) ?? str(record.HI_PONumber),
    hIWarrantyExpiry:
      str(record.hIWarrantyExpiry) ??
      str(record.HI_WarrantyExpiry_dt) ??
      str(record.HI_WarrantyExpiry),
    hICondition: str(record.hICondition) ?? str(record.HI_Condition),
    hISpecifications: str(record.hISpecifications) ?? str(record.HI_Specifications),
    hISerialNo: str(record.hISerialNo) ?? str(record.HI_SerialNo),
    hISite: str(record.hISite) ?? str(record.HI_Site),
    hIBuilding: str(record.hIBuilding) ?? str(record.HI_Building),
    hIFloor: str(record.hIFloor) ?? str(record.HI_Floor),
    hIRoom: str(record.hIRoom) ?? str(record.HI_Room),
    hIStatus: str(record.hIStatus) ?? str(record.HI_Status),
    hITagNo: str(record.hITagNo) ?? str(record.HI_TagNo),
    hIType: str(record.hIType) ?? str(record.HI_Type),
    hIUsedByEmail:
      str(record.hIUsedByEmail) ??
      str(record.HI_UsedBy_Email) ??
      str(record.HI_UsedByEmail),
    hIVendor: str(record.hIVendor) ?? str(record.HI_Vendor),
    hIWindowsVersion:
      str(record.hIWindowsVersion) ??
      str(record.HI_WinVersion) ??
      str(record.HI_WindowsVersion) ??
      str(record.HI_OSVersion),
    hIYear: num(record.hIYear) ?? num(record.HI_Year),
    iTSCChecklistYear:
      str(record.iTSCChecklistYear) ?? str(record.ITSC_ChecklistYear),
    iTSCReviewedBy:
      str(record.iTSCReviewedBy) ?? str(record.ITSC_ReviewedBy),
    iTSCReviewedDate:
      str(record.iTSCReviewedDate) ?? str(record.ITSC_ReviewedDate),
    iTSCServerName:
      str(record.iTSCServerName) ?? str(record.ITSC_ServerName),
    parentFormCode:
      str(record.parentFormCode) ?? str(record.ParentFormCode) ?? '',
    parentRecord: (record.parentRecord as MainDBITExtAssets['parentRecord']) ?? {
      id: num(record['ParentID#Id'] ?? parentLookup?.Id ?? parentLookup?.id) ?? 0,
      title: str(parentLookup?.Value ?? parentLookup?.Title ?? parentLookup?.title ?? record.ParentID) ?? '',
    },
    parentSite: str(record.parentSite) ?? str(record.ParentSite),
    hIModel: str(record.hIModel) ?? str(record.HI_Model),
    hICPU: str(record.hICPU) ?? str(record.HI_CPU),
    hICPUModel: str(record.hICPUModel) ?? str(record.HI_CPUModel),
    hICPUType: str(record.hICPUType) ?? str(record.HI_CPUType),
    hICPUSerialNo: str(record.hICPUSerialNo) ?? str(record.HI_CPUSerialNo),
    hIHDDSize: str(record.hIHDDSize) ?? str(record.HI_HDDSize),
    hIHDDType: str(record.hIHDDType) ?? str(record.HI_HDDType),
    hIRAM: str(record.hIRAM) ?? str(record.HI_RAM),
    hIRAMSize: str(record.hIRAMSize) ?? str(record.HI_RAMSize),
    hIRAMType: str(record.hIRAMType) ?? str(record.HI_RAMType),
    hIMonitorModel: str(record.hIMonitorModel) ?? str(record.HI_MonitorModel),
    hIMonitorSize: str(record.hIMonitorSize) ?? str(record.HI_MonitorSize),
    hIMonitorType: str(record.hIMonitorType) ?? str(record.HI_MonitorType),
    hICDType: str(record.hICDType) ?? str(record.HI_CDType),
    hIVLAN: str(record.hIVLAN) ?? str(record.HI_VLAN),
    hISANStorage: str(record.hISANStorage) ?? str(record.HI_SANStorage),
    hIIPAddress: str(record.hIIPAddress) ?? str(record.HI_IPAddress),
    hIMACAddress: str(record.hIMACAddress) ?? str(record.HI_MACAddress),
    hIOSVersion: str(record.hIOSVersion) ?? str(record.HI_OSVersion),
    hIWinServicePack: str(record.hIWinServicePack) ?? str(record.HI_WinServicePack),
    hIWinKey: str(record.hIWinKey) ?? str(record.HI_WinKey),
    hIMSOfficeVer: str(record.hIMSOfficeVer) ?? str(record.HI_MSOfficeVer),
    hIMSOfficeKey: str(record.hIMSOfficeKey) ?? str(record.HI_MSOfficeKey),
    hIMSVersion: str(record.hIMSVersion) ?? str(record.HI_MSVersion),
    hIAntiVirusVersion: str(record.hIAntiVirusVersion) ?? str(record.HI_AntiVirusVersion),
    hINotesVer: str(record.hINotesVer) ?? str(record.HI_NotesVer),
    hINotesVersion: str(record.hINotesVersion) ?? str(record.HI_NotesVersion),
    hIMSEmail: str(record.hIMSEmail) ?? str(record.HI_MSEmail),
    hIDRP: str(record.hIDRP) ?? str(record.HI_DRP),
    hISentBy: str(record.hISentBy) ?? str(record.HI_SentBy),
    hIProbFindings: str(record.hIProbFindings) ?? str(record.HI_ProbFindings),
    hIActions: str(record.hIActions) ?? str(record.HI_Actions),
    hIPreviousUser: str(record.hIPreviousUser) ?? str(record.HI_PreviousUser),
    hICarNo: str(record.hICarNo) ?? str(record.HI_CarNo),
    hIFARNo: str(record.hIFARNo) ?? str(record.HI_FARNo),
    hIInvoiceNo: str(record.hIInvoiceNo) ?? str(record.HI_InvoiceNo),
    hIServerType: str(record.hIServerType) ?? str(record.HI_ServerType),
    hIAccessType: str(record.hIAccessType) ?? str(record.HI_AccessType),
    hIKeyboardLanguage: str(record.hIKeyboardLanguage) ?? str(record.HI_KeyboardLanguage),
  };
}

function denormalizeAssets(record: Partial<Omit<MainDBITExtAssets, 'id'>>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    if (value === undefined) continue;
    out[FIELD_TO_SP[key] ?? key] = value;
  }
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

export class MainDBITExtAssetsService {
  static async create(record: Omit<MainDBITExtAssets, 'id'>): Promise<MainDBITExtAssets> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, denormalizeAssets(record));
    if (!result.success) throw result.error;
    return normalizeAssets(result.data as RawAssets);
  }

  static async update(
    id: string,
    changedFields: Partial<Omit<MainDBITExtAssets, 'id'>>
  ): Promise<MainDBITExtAssets> {
    const result = await getClient().updateRecordAsync(DATA_SOURCE_NAME, id, denormalizeAssets(changedFields));
    if (!result.success) throw result.error;
    return normalizeAssets(result.data as RawAssets);
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<MainDBITExtAssets> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return normalizeAssets(result.data as RawAssets);
  }

  static async getAll(options?: IOperationOptions): Promise<MainDBITExtAssets[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DATA_SOURCE_NAME, translateOptions(options));
    if (!result.success) throw result.error;
    return (result.data as RawAssets[]).map(normalizeAssets);
  }
}
