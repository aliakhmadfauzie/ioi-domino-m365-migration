/**
 * Material Receipt Form (MRF) Type Definitions
 * Based on MRF_App_Schema_Builder_3 Excel Schema
 * 
 * This form captures material receipts for:
 * - Process Chemicals & Packaging Material (New Steel Drum)
 * - Non-Process Chemicals
 * - Packaging Material
 */

// =============================================================================
// SITE CONFIGURATION
// =============================================================================

export const MRF_SITES = [
  { code: '5102', name: '5102 - PEO Refinery Plant', shortName: 'PEO Refinery' },
  { code: '5103', name: '5103 - PEO Consumer Packs Plant', shortName: 'PEO Consumer' },
  { code: '5200', name: '5200 - POC Plant', shortName: 'POC' },
  { code: '5201', name: '5201 - POC Soap Noodles Plant', shortName: 'POC Soap' },
] as const;

export type MRFSiteCode = typeof MRF_SITES[number]['code'];

// =============================================================================
// MATERIAL CATEGORIES
// =============================================================================

export const MRF_CATEGORIES = [
  { code: 'PC_PM', name: 'Process Chemicals & Packaging Material (New Steel Drum)', shortName: 'Process Chemicals' },
  { code: 'NPC', name: 'Non Process Chemicals', shortName: 'Non-Process' },
  { code: 'PM', name: 'Packaging Material', shortName: 'Packaging' },
] as const;

export type MRFCategory = typeof MRF_CATEGORIES[number]['code'];

export const MRF_MATERIALS = [
  // Section 1 - Tanker materials
  { code: 'BE', name: 'BE', category: 'PC_PM', isTanker: true },
  { code: 'PACID', name: 'PACID', category: 'PC_PM', isTanker: true },
  { code: 'CSODA', name: 'CSODA', category: 'PC_PM', isTanker: true },
  { code: 'Others', name: 'Others', category: 'PC_PM', isTanker: false },
  { code: 'PC1', name: 'PC1', category: 'PC_PM', isTanker: false },
  { code: 'PC2', name: 'PC2', category: 'PC_PM', isTanker: false },
  { code: 'PC3', name: 'PC3', category: 'PC_PM', isTanker: false },
  { code: 'PC4', name: 'PC4', category: 'PC_PM', isTanker: false },
  { code: 'DRUMS', name: 'DRUMS', category: 'PC_PM', isTanker: false },
  // Section 2 - Non-process chemicals
  { code: 'NPC1', name: 'NPC1', category: 'NPC', isTanker: false },
  { code: 'NPC2', name: 'NPC2', category: 'NPC', isTanker: false },
  { code: 'NPC3', name: 'NPC3', category: 'NPC', isTanker: false },
  // Section 3 - Packaging materials
  { code: 'PM1', name: 'PM1', category: 'PM', isTanker: false },
  { code: 'PM2', name: 'PM2', category: 'PM', isTanker: false },
  { code: 'PM3', name: 'PM3', category: 'PM', isTanker: false },
] as const;

export type MRFMaterial = typeof MRF_MATERIALS[number]['code'];

// =============================================================================
// WORKFLOW STATUS
// =============================================================================

export const MRF_STATUSES = [
  { code: 'Draft', label: 'Draft', color: 'bg-muted text-muted-foreground', step: 0 },
  { code: 'Submitted', label: 'Submitted', color: 'bg-primary/10 text-primary', step: 1 },
  { code: 'StoreApproved', label: 'Store Approved', color: 'bg-accent text-accent-foreground', step: 2 },
  { code: 'StoreRejected', label: 'Store Rejected', color: 'bg-destructive text-destructive-foreground', step: 2 },
  { code: 'QCPending', label: 'QC Pending', color: 'bg-secondary text-secondary-foreground', step: 3 },
  { code: 'QCApproved', label: 'QC Approved', color: 'bg-accent text-accent-foreground', step: 4 },
  { code: 'QCRejected', label: 'QC Rejected', color: 'bg-destructive text-destructive-foreground', step: 4 },
  { code: 'ProductionPending', label: 'Production Pending', color: 'bg-secondary text-secondary-foreground', step: 5 },
  { code: 'ProductionApproved', label: 'Production Approved', color: 'bg-accent text-accent-foreground', step: 6 },
  { code: 'Completed', label: 'Completed', color: 'bg-primary text-primary-foreground', step: 7 },
  { code: 'Withdrawn', label: 'Withdrawn', color: 'bg-muted text-muted-foreground', step: -1 },
] as const;

export type MRFStatus = typeof MRF_STATUSES[number]['code'];

export const MRF_ACTIONS = ['Submit', 'Approve', 'Reject', 'Withdraw', 'Acknowledge', 'Complete'] as const;
export type MRFAction = typeof MRF_ACTIONS[number];

// =============================================================================
// CHECKLIST ITEMS
// =============================================================================

export const MRF_CHECKLIST_ITEMS = [
  { id: 'YN_1', no: '1', item: 'Vehicle weigh in.', required: true },
  { id: 'YN_2', no: '2', item: 'Vehicle parked properly at designated area.', required: true },
  { id: 'YN_3', no: '3', item: "Driver's PPE", required: true },
  { id: 'YN_4', no: '3a', item: 'Hardhat / Helmet', required: true },
  { id: 'YN_5', no: '3b', item: 'Goggles', required: true },
  { id: 'YN_6', no: '3c', item: 'Rubber boots', required: true },
  { id: 'YN_7', no: '3d', item: 'Face Shield', required: true },
  { id: 'YN_8', no: '3e', item: 'Apron / Chemical Suit', required: true },
  { id: 'YN_9', no: '3f', item: 'Rubber Hand Gloves', required: true },
  { id: 'YN_10', no: '4', item: 'Connection of Flexible hose from tanker to inlet valve.', required: true },
  { id: 'YN_11', no: '5', item: 'Condition of Flexible hose.', required: true },
  { id: 'YN_12', no: '6', item: 'Inlet valve open before discharge by Store personnel', required: true },
  { id: 'YN_13', no: '7', item: 'Inlet valve closed after discharge by Store personnel', required: true },
  { id: 'YN_14', no: '8', item: 'Collect residual caustic after complete discharge into container provided.', required: true },
  { id: 'YN_15', no: '9', item: 'While unloading driver need to be at a distance of 3 meters from the tanker', required: true },
  { id: 'YN_16', no: '10', item: 'Discharge Tank confirmation.', required: true },
] as const;

export type MRFChecklistItem = typeof MRF_CHECKLIST_ITEMS[number]['id'];

// =============================================================================
// FORM SECTIONS (for multi-step navigation)
// =============================================================================

export const MRF_FORM_SECTIONS = [
  { id: 'header', name: 'Header', description: 'Basic receipt information', icon: 'FileText' },
  { id: 'sectionA', name: 'Section A - Store', description: 'Store receipt details', icon: 'Package' },
  { id: 'packaging', name: 'Packaging Material', description: 'Packaging details and verification', icon: 'Box' },
  { id: 'sectionB', name: 'Section B - QC', description: 'QC sampling and testing', icon: 'FlaskConical' },
  { id: 'sectionC', name: 'Section C - Production', description: 'Production acknowledgement', icon: 'Factory' },
  { id: 'sectionD', name: 'Section D - Final', description: 'Final store approval and checklist', icon: 'ClipboardCheck' },
] as const;

export type MRFFormSection = typeof MRF_FORM_SECTIONS[number]['id'];

// =============================================================================
// MAIN MRF DATA TYPE
// =============================================================================

export interface MRFFormData {
  // System fields
  guid: string;
  createdAt: string;
  updatedAt: string;
  
  // Header
  mrfNo: string;
  site: MRFSiteCode;
  materialCategory: MRFCategory;
  materialName: string;
  receiptDate: string;
  receiptTime: string;
  qtyDO: number;
  vehicleNo: string;
  status: MRFStatus;
  currentAction?: MRFAction;
  docNo?: string;
  docAuthor: string;
  docAuthorEmail: string;
  cDate: string;

  // Section A - Store
  doNumber: string;
  poNumber: string;
  supplier: string;
  supplier5103?: string;
  supplier5200?: string;
  supplier5102C?: string;
  supplier5200C?: string;
  rawMaterial?: string;
  brand?: string;
  brand1?: string;
  soNo?: string;
  vNo: string;
  lotNo: string;
  shelfLife: string;
  qty1: number;
  batchNo?: string;
  tripNo?: string;
  openStock?: number;
  openStock1?: number;
  availableSpace?: number;
  availableSpace1?: number;
  remark?: string;
  remark1?: string;
  discTank?: string;
  discTank1?: string;

  // Packaging Material
  pMaterial?: string;
  pMaterial1?: string;
  pMaterial2?: string;
  pMaterial3?: string;
  pMaterial4?: string;
  pMaterial5?: string;
  pMaterial6?: string;
  pMaterial7?: string;
  pMaterial8?: string;
  pMaterial9?: string;
  pMaterial10?: string;
  pMaterial11?: string;
  dm1?: string;
  dm2?: string;
  dm3?: string;
  dm4?: string;
  clpBag?: string;
  lr1?: number;
  lr2?: number;
  lr3?: number;
  cl1?: string;
  checkedQty?: number;
  attachments?: string[];
  verifier?: string;
  cc?: string;
  checkedBy?: string;
  checkedDate?: string;

  // Store Approval 1
  appByST?: string;
  appDateST?: string;
  appRemST?: string;
  appST?: 'Approve' | 'Reject';

  // Section B - User Verification
  appByProd?: string;
  appByProdDate?: string;
  appRemark?: string;
  appPD1?: 'Approve' | 'Reject';

  // Section B - QC Sampling
  topSeal?: boolean;
  drainValve?: boolean;
  topMainHole?: boolean;

  // Section B - QC Testing
  ph?: number;
  phAcc?: boolean;
  density?: number;
  densityAcc?: boolean;
  moisture?: number;
  temp?: number;
  tempAcc?: boolean;
  concentration?: number;
  concAcc?: boolean;

  // Section B - QC Release
  secBName?: string;
  secBDate?: string;

  // Section B - Lab Sampling
  sample?: number;
  assayResult?: string;
  d1?: boolean;
  d2?: boolean;
  d3?: boolean;
  sampledBy?: string;
  appByLab?: string;
  appByLabDate?: string;

  // QC Approval
  meetingSpec?: boolean;
  reasonRej?: string;
  appByQC?: string;
  appDateQC?: string;

  // Section C - User Verification
  appByProd2?: string;
  appByProdDate2?: string;
  appRemark2?: string;
  appPD2?: 'Approve' | 'Reject';

  // Section C - Production Acknowledgement
  prodAcc?: 'Accept' | 'Reject';
  rejectReason?: string;
  prodAppName?: string;
  prodAppDate?: string;

  // Production Authority
  pdAppName?: string;
  pdAppDate?: string;
  pdAppRem?: string;
  appPD?: 'Approve' | 'Reject';

  // Section D - Store
  secDSAPBatchNo?: string;
  secDFieldman?: string;
  secDDate?: string;

  // Store Approval 2
  stAppName?: string;
  stAppDate?: string;
  stAppRem?: string;
  appST2?: 'Approve' | 'Reject';

  // Store Acknowledgement
  sapBatchNoST?: string;
  strName?: string;
  strDate?: string;

  // QC SAP Batch Approval
  qcAppName?: string;
  qcAppDate?: string;
  qcAppRem?: string;
  appQC?: 'Approve' | 'Reject';

  // Withdrawn
  wdBy?: string;
  wdDate?: string;
  wdReason?: string;

  // Checklist (YN_1 through YN_16)
  checklist: Record<MRFChecklistItem, boolean | null>;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getMRFStatusInfo(status: MRFStatus) {
  return MRF_STATUSES.find(s => s.code === status) || MRF_STATUSES[0];
}

export function getMRFSiteInfo(siteCode: string) {
  return MRF_SITES.find(s => s.code === siteCode);
}

export function getMRFMaterialInfo(materialCode: string) {
  return MRF_MATERIALS.find(m => m.code === materialCode);
}

export function isTankerMaterial(materialCode: string): boolean {
  const material = getMRFMaterialInfo(materialCode);
  return material?.isTanker || false;
}

export function createEmptyMRFForm(site: MRFSiteCode, author: string, authorEmail: string): Partial<MRFFormData> {
  const now = new Date();
  return {
    guid: crypto.randomUUID(),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    site,
    status: 'Draft',
    receiptDate: now.toISOString().split('T')[0],
    receiptTime: now.toTimeString().slice(0, 5),
    docAuthor: author,
    docAuthorEmail: authorEmail,
    cDate: now.toISOString(),
    checklist: MRF_CHECKLIST_ITEMS.reduce((acc, item) => {
      acc[item.id] = null;
      return acc;
    }, {} as Record<MRFChecklistItem, boolean | null>),
  };
}

export function calculateAvailableSpace(tankCapacity: number, openStock: number): number {
  return Math.max(0, tankCapacity - openStock);
}

// Tank A capacity: 380 MTS, Tank B capacity: 570 MTS
export const TANK_A_CAPACITY = 380;
export const TANK_B_CAPACITY = 570;