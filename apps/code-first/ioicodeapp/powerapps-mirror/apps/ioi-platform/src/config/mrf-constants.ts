/**
 * MRF (Material Receipt Form) Constants
 * Based on IOI Acidchem MRF Excel schema
 */

// =============================================================================
// SITES
// =============================================================================

export const MRF_SITES = [
  { code: '5102', name: '5102 PEO Refinery', description: 'Palm Oil Refinery operations' },
  { code: '5103', name: '5103 PEO Consumer Packs', description: 'Consumer packaging operations' },
  { code: '5200', name: '5200 POC', description: 'Palm Oleochemical Complex' },
  { code: '5201', name: '5201 POC Soap Noodles', description: 'Soap noodles production' },
] as const;

export type MRFSiteCode = typeof MRF_SITES[number]['code'];

// =============================================================================
// MATERIAL CATEGORIES
// =============================================================================

export const MRF_MAIN_CATEGORIES = [
  { code: 'PC', name: 'Process Chemicals', description: 'Chemicals used in production processes' },
  { code: 'NPC', name: 'Non-Process Chemicals', description: 'Support chemicals not used in production' },
  { code: 'PM', name: 'Packaging Materials', description: 'Materials for product packaging' },
] as const;

export type MRFMainCategory = typeof MRF_MAIN_CATEGORIES[number]['code'];

// =============================================================================
// MATERIALS (grouped by category)
// =============================================================================

export const MRF_MATERIALS = [
  // Process Chemicals (PC) - Tanker Materials
  { code: 'PHOSPHORIC_ACID', name: 'Phosphoric Acid', category: 'PC', isTanker: true },
  { code: 'CITRIC_ACID', name: 'Citric Acid', category: 'PC', isTanker: true },
  { code: 'CAUSTIC_SODA', name: 'Caustic Soda', category: 'PC', isTanker: true },
  { code: 'SULFURIC_ACID', name: 'Sulfuric Acid', category: 'PC', isTanker: true },
  { code: 'HYDROCHLORIC_ACID', name: 'Hydrochloric Acid', category: 'PC', isTanker: true },
  { code: 'BLEACHING_EARTH', name: 'Bleaching Earth', category: 'PC', isTanker: false },
  { code: 'ACTIVATED_CARBON', name: 'Activated Carbon', category: 'PC', isTanker: false },
  { code: 'FILTER_AID', name: 'Filter Aid', category: 'PC', isTanker: false },
  
  // Non-Process Chemicals (NPC)
  { code: 'BOILER_CHEMICAL', name: 'Boiler Chemical', category: 'NPC', isTanker: false },
  { code: 'COOLING_TOWER_CHEM', name: 'Cooling Tower Chemical', category: 'NPC', isTanker: false },
  { code: 'CLEANING_CHEMICAL', name: 'Cleaning Chemical', category: 'NPC', isTanker: false },
  { code: 'LUBRICANT', name: 'Lubricant', category: 'NPC', isTanker: false },
  { code: 'LABORATORY_REAGENT', name: 'Laboratory Reagent', category: 'NPC', isTanker: false },
  
  // Packaging Materials (PM)
  { code: 'DRUM_STEEL', name: 'Steel Drum', category: 'PM', isTanker: false },
  { code: 'DRUM_PLASTIC', name: 'Plastic Drum', category: 'PM', isTanker: false },
  { code: 'IBC', name: 'IBC Container', category: 'PM', isTanker: false },
  { code: 'FLEXIBAG', name: 'Flexibag', category: 'PM', isTanker: false },
  { code: 'CARTON', name: 'Carton', category: 'PM', isTanker: false },
  { code: 'PALLET', name: 'Pallet', category: 'PM', isTanker: false },
  { code: 'SHRINK_WRAP', name: 'Shrink Wrap', category: 'PM', isTanker: false },
  { code: 'LABEL', name: 'Label', category: 'PM', isTanker: false },
] as const;

export type MRFMaterialCode = typeof MRF_MATERIALS[number]['code'];

// Helper to get materials by category
export function getMRFMaterialsByCategory(category: MRFMainCategory) {
  return MRF_MATERIALS.filter(m => m.category === category);
}

// Helper to check if material uses tanker discharge
export function isMRFTankerMaterial(code: string): boolean {
  const material = MRF_MATERIALS.find(m => m.code === code);
  return material?.isTanker ?? false;
}

// =============================================================================
// WIZARD STEPS
// =============================================================================

export const MRF_WIZARD_STEPS = [
  {
    id: 'header',
    label: 'Header',
    description: 'Basic receipt info',
    requiredFields: ['Site', 'MaterialName', 'ReceiptDate', 'QtyDO', 'VehicleNo'],
  },
  {
    id: 'sectionA',
    label: 'Section A',
    description: 'Store details',
    requiredFields: ['DONumber', 'PONumber', 'Supplier', 'LotNo'],
  },
  {
    id: 'packaging',
    label: 'Packaging',
    description: 'Packaging materials',
    requiredFields: [],
  },
  {
    id: 'sectionB',
    label: 'Section B',
    description: 'QC sampling & testing',
    requiredFields: [],
  },
  {
    id: 'sectionC',
    label: 'Section C',
    description: 'Production acknowledgement',
    requiredFields: [],
  },
  {
    id: 'sectionD',
    label: 'Section D',
    description: 'Store final & checklist',
    requiredFields: [],
  },
  {
    id: 'review',
    label: 'Review',
    description: 'Review & submit',
    requiredFields: [],
  },
] as const;

export type MRFWizardStepId = typeof MRF_WIZARD_STEPS[number]['id'];

// =============================================================================
// DISCHARGE CHECKLIST ITEMS (for Tanker materials)
// =============================================================================

export const MRF_CHECKLIST_ITEMS = [
  {
    no: 1,
    item: 'Engine off, choke wheels, emergency brake applied',
    internalName: 'Chk_Engine',
  },
  {
    no: 2,
    item: 'Safety warning signage / barrier installed',
    internalName: 'Chk_SafetySign',
  },
  {
    no: 3,
    item: 'Driver briefed on discharge procedure',
    internalName: 'Chk_DriverBrief',
  },
  {
    no: 4,
    item: 'Proper PPE worn by all personnel',
    internalName: 'Chk_PPE',
  },
  {
    no: 5,
    item: 'Discharge hose connection checked',
    internalName: 'Chk_HoseConnection',
  },
  {
    no: 6,
    item: 'Tank level and available space verified',
    internalName: 'Chk_TankLevel',
  },
  {
    no: 7,
    item: 'Emergency spill kit available',
    internalName: 'Chk_SpillKit',
  },
  {
    no: 8,
    item: 'Communication device available',
    internalName: 'Chk_Communication',
  },
  {
    no: 9,
    item: 'No leakage observed during discharge',
    internalName: 'Chk_NoLeakage',
  },
  {
    no: 10,
    item: 'Discharge completed and hose disconnected',
    internalName: 'Chk_DischargeComplete',
  },
  {
    no: 11,
    item: 'Tank level after discharge verified',
    internalName: 'Chk_TankLevelAfter',
  },
  {
    no: 12,
    item: 'Area cleaned after discharge',
    internalName: 'Chk_AreaCleaned',
  },
] as const;

export type MRFChecklistItem = typeof MRF_CHECKLIST_ITEMS[number];

// =============================================================================
// STATUS WORKFLOW
// =============================================================================

export const MRF_STATUSES = [
  { code: 'Draft', name: 'Draft', color: 'secondary' },
  { code: 'Submitted', name: 'Submitted', color: 'default' },
  { code: 'Store_Review', name: 'Store Review', color: 'default' },
  { code: 'QC_Testing', name: 'QC Testing', color: 'default' },
  { code: 'Production_Pending', name: 'Production Pending', color: 'default' },
  { code: 'Store_Final', name: 'Store Final', color: 'default' },
  { code: 'Approved', name: 'Approved', color: 'default' },
  { code: 'Rejected', name: 'Rejected', color: 'destructive' },
] as const;

export type MRFStatus = typeof MRF_STATUSES[number]['code'];