/**
 * STR Department Constants
 * Department Code: D06 - Store Management
 *
 * This file defines all form codes, modules, statuses, and configuration
 * for the STR (Store) department following the 5-screen architecture.
 */

// =============================================================================
// STR SITES
// =============================================================================

export const STR_SITES = ['PRAI', 'JOHOR'] as const;
export type STRSite = typeof STR_SITES[number];

export const STR_ENVIRONMENTS = ['DEV', 'TEST', 'PROD'] as const;
export type STREnvironmentTag = typeof STR_ENVIRONMENTS[number];

// =============================================================================
// STR FORM CODES BY MODULE
// =============================================================================

export const STR_MODULE_1_OPERATIONS = {
  ACMSTR: {
    code: 'ACMSTR',
    name: 'ACM Store Transaction Record',
    description: 'Records transactions at the Penang ACM store',
    icon: 'FileText',
  },
  ASMR: {
    code: 'ASMR',
    name: 'Annual Store Management Report',
    description: 'Captures annual performance metrics and audit findings',
    icon: 'BarChart3',
  },
  IRN: {
    code: 'IRN',
    name: 'Item Rejection Notice',
    description: 'Documents items that fail inspection criteria',
    icon: 'XCircle',
  },
  NIR: {
    code: 'NIR',
    name: 'Non-Conformance Item Report',
    description: 'Reports identified non-conforming items',
    icon: 'AlertTriangle',
  },
  SIC: {
    code: 'SIC',
    name: 'Store Issuance Certificate',
    description: 'Formal certificate for issuing controlled items',
    icon: 'Award',
  },
  SII: {
    code: 'SII',
    name: 'Store Inventory Issue',
    description: 'Records general inventory issuance transactions',
    icon: 'Package',
  },
  SIROP: {
    code: 'SIROP',
    name: 'Store Item Request/Order Processing',
    description: 'Manages item requests and order workflows',
    icon: 'ShoppingCart',
  },
  SIU: {
    code: 'SIU',
    name: 'Store Item Update',
    description: 'Captures updates to store master data',
    icon: 'Edit3',
  },
  SR: {
    code: 'SR',
    name: 'Store Receipt',
    description: 'Records receipt of items from suppliers or transfers',
    icon: 'PackageCheck',
  },
  STIDS: {
    code: 'STIDS',
    name: 'Store Transfer / Internal Despatch',
    description: 'Records internal material movements',
    icon: 'Truck',
  },
  STIR: {
    code: 'STIR',
    name: 'Store Transfer/Issue Request',
    description: 'Manages inter-departmental material transfer requests',
    icon: 'ArrowLeftRight',
  },
  SLED: {
    code: 'SLED',
    name: 'SAP Shelf Life Expiration Date',
    description: 'Manages shelf life expiration for process chemicals',
    icon: 'Calendar',
  },
  SRRI1: {
    code: 'SRRI1',
    name: 'Item Return to Store',
    description: 'Specifically for returning items to the store inventory',
    icon: 'RotateCcw',
  },
  SRRI2: {
    code: 'SRRI2',
    name: 'Transaction to be Reversed/Rectified',
    description: 'For correcting or reversing previous transactions',
    icon: 'RefreshCw',
  },
} as const;

export const STR_MODULE_2_REQUISITION = {
  MRF: {
    code: 'MRF',
    name: 'Material Receipt Form',
    description: 'Process chemicals, non-process chemicals, and packaging material receipt',
    icon: 'ClipboardList',
  },
  MRFAPP: {
    code: 'MRFAPP',
    name: 'Material Requisition Form Application',
    description: 'Standard material request form',
    icon: 'ClipboardList',
  },
  RETURNABLES: {
    code: 'RETURNABLES',
    name: 'Returnable Items',
    description: 'Tracks borrowed items issued to departments',
    icon: 'RefreshCw',
  },
  IFSSH: {
    code: 'IFSSH',
    name: 'Issuance Form For Safety Shoe & Helmet',
    description: 'Specialized requisition for safety gear',
    icon: 'HardHat',
  },
} as const;

export const STR_MODULE_3_PROCUREMENT = {
  PCSTKITEM: {
    code: 'PCSTKITEM',
    name: 'PC Stock Item Coding',
    description: 'Manages new stock item coding requests',
    icon: 'Barcode',
  },
  COD: {
    code: 'COD',
    name: 'Cost of Despatch',
    description: 'Records logistics cost details for material despatches',
    icon: 'DollarSign',
  },
  QUOTATIONMD: {
    code: 'QUOTATIONMD',
    name: 'Quotation for Material/Despatch',
    description: 'Manages supplier quotation requests',
    icon: 'FileSpreadsheet',
  },
  SAPSLCF: {
    code: 'SAPSLCF',
    name: 'SAP Store List Coding Form',
    description: 'Captures SAP coding assignments',
    icon: 'Code',
  },
  ODFM: {
    code: 'ODFM',
    name: 'One-Off Deviation From Min/Max Quantity',
    description: 'Requests to deviate from set stock levels',
    icon: 'AlertCircle',
  },
  IMSI: {
    code: 'IMSI',
    name: 'Stock Item Inclusion Form',
    description: 'For adding new items to the stock inventory',
    icon: 'PlusCircle',
  },
} as const;

export const STR_MODULE_4_DISPOSAL = {
  PCNMATDISPOSAL: {
    code: 'PCNMATDISPOSAL',
    name: 'PCN Material Disposal 2025',
    description: 'Disposal requests under the PCN process',
    icon: 'Trash2',
  },
  SWASTE: {
    code: 'SWASTE',
    name: 'Scheduled Waste',
    description: 'Records regulatory hazardous waste generation',
    icon: 'AlertOctagon',
  },
  ECMRMDNF: {
    code: 'ECMRMDNF',
    name: 'ECMR Material Disposal Notification',
    description: 'Extended cost material reporting for disposal',
    icon: 'FileWarning',
  },
  MDNF: {
    code: 'MDNF',
    name: 'Material Disposal Notification Form',
    description: 'Formal notification for site material disposal',
    icon: 'FileX',
  },
} as const;

export const STR_MODULE_5_COMPLIANCE = {
  STOREISP: {
    code: 'STOREISP',
    name: 'Store Inspection',
    description: 'Periodic inspection records for store areas',
    icon: 'ClipboardCheck',
  },
} as const;

// =============================================================================
// ALL STR FORM CODES
// =============================================================================

export const STR_ALL_FORMS = {
  ...STR_MODULE_1_OPERATIONS,
  ...STR_MODULE_2_REQUISITION,
  ...STR_MODULE_3_PROCUREMENT,
  ...STR_MODULE_4_DISPOSAL,
  ...STR_MODULE_5_COMPLIANCE,
} as const;

export type STRFormCode = keyof typeof STR_ALL_FORMS;

// =============================================================================
// STR MODULES CONFIGURATION
// =============================================================================

export const STR_MODULES = {
  M1: {
    id: 'M1',
    code: 'operations',
    name: 'Operations & Store Management',
    shortName: 'Operations',
    description: 'Store transactions, receipts, transfers, and inventory management',
    icon: 'Warehouse',
    color: 'bg-primary',
    colorLight: 'bg-primary/10',
    colorText: 'text-primary',
    forms: Object.keys(STR_MODULE_1_OPERATIONS),
    route: '/str/operations',
  },
  M2: {
    id: 'M2',
    code: 'requisition',
    name: 'Material Requisition & Returns',
    shortName: 'Requisition',
    description: 'Material requests, returnable items, and safety gear issuance',
    icon: 'ClipboardList',
    color: 'bg-primary',
    colorLight: 'bg-primary/10',
    colorText: 'text-primary',
    forms: Object.keys(STR_MODULE_2_REQUISITION),
    route: '/str/requisition',
  },
  M3: {
    id: 'M3',
    code: 'procurement',
    name: 'Procurement & Supplier Management',
    shortName: 'Procurement',
    description: 'Stock coding, quotations, SAP integration, and supplier management',
    icon: 'ShoppingBag',
    color: 'bg-primary',
    colorLight: 'bg-primary/10',
    colorText: 'text-primary',
    forms: Object.keys(STR_MODULE_3_PROCUREMENT),
    route: '/str/procurement',
  },
  M4: {
    id: 'M4',
    code: 'disposal',
    name: 'Material Disposal & Waste Management',
    shortName: 'Disposal',
    description: 'Material disposal, scheduled waste, and compliance reporting',
    icon: 'Trash2',
    color: 'bg-primary',
    colorLight: 'bg-primary/10',
    colorText: 'text-primary',
    forms: Object.keys(STR_MODULE_4_DISPOSAL),
    route: '/str/disposal',
  },
  M5: {
    id: 'M5',
    code: 'compliance',
    name: 'Store Inspection & Compliance',
    shortName: 'Compliance',
    description: 'Periodic inspections and regulatory compliance records',
    icon: 'ClipboardCheck',
    color: 'bg-primary',
    colorLight: 'bg-primary/10',
    colorText: 'text-primary',
    forms: Object.keys(STR_MODULE_5_COMPLIANCE),
    route: '/str/compliance',
  },
} as const;

export type STRModuleId = keyof typeof STR_MODULES;

// =============================================================================
// STR STATUS CONFIGURATION (Workflow-Managed)
// =============================================================================

export const STR_STATUSES = {
  // Schema key format (MainDBSTR.statusKey)
  StatusKey0: {
    key: 'StatusKey0',
    label: 'Draft',
    description: 'Record created but not submitted',
    color: 'bg-muted text-muted-foreground border-border',
    badgeVariant: 'secondary' as const,
    isFinal: false,
    allowEdit: true,
  },
  StatusKey1: {
    key: 'StatusKey1',
    label: 'Submitted',
    description: 'Pending review by supervisor',
    color: 'bg-primary/10 text-primary border-primary/20',
    badgeVariant: 'default' as const,
    isFinal: false,
    allowEdit: false,
  },
  StatusKey2: {
    key: 'StatusKey2',
    label: 'Under Review',
    description: 'Under review by Store Admin',
    color: 'bg-accent text-accent-foreground border-accent',
    badgeVariant: 'outline' as const,
    isFinal: false,
    allowEdit: false,
  },
  StatusKey3: {
    key: 'StatusKey3',
    label: 'Approved',
    description: 'Request has been approved',
    color: 'bg-primary text-primary-foreground border-primary',
    badgeVariant: 'default' as const,
    isFinal: true,
    allowEdit: false,
  },
  StatusKey4: {
    key: 'StatusKey4',
    label: 'Rejected',
    description: 'Request was rejected',
    color: 'bg-destructive text-destructive-foreground border-destructive',
    badgeVariant: 'destructive' as const,
    isFinal: true,
    allowEdit: false,
  },
  StatusKey5: {
    key: 'StatusKey5',
    label: 'Closed',
    description: 'Record is closed',
    color: 'bg-muted text-muted-foreground border-border',
    badgeVariant: 'secondary' as const,
    isFinal: true,
    allowEdit: false,
  },
  StatusKey6: {
    key: 'StatusKey6',
    label: 'Archived',
    description: 'Record is archived',
    color: 'bg-muted text-muted-foreground border-border',
    badgeVariant: 'secondary' as const,
    isFinal: true,
    allowEdit: false,
  },
  // Legacy label format (for backward compatibility with adaptToUIFormat)
  Draft: {
    key: 'StatusKey0',
    label: 'Draft',
    description: 'Record created but not submitted',
    color: 'bg-muted text-muted-foreground border-border',
    badgeVariant: 'secondary' as const,
    isFinal: false,
    allowEdit: true,
  },
  Submitted: {
    key: 'StatusKey1',
    label: 'Submitted',
    description: 'Pending review by supervisor',
    color: 'bg-primary/10 text-primary border-primary/20',
    badgeVariant: 'default' as const,
    isFinal: false,
    allowEdit: false,
  },
  PendingReview: {
    key: 'StatusKey2',
    label: 'Under Review',
    description: 'Under review by Store Admin',
    color: 'bg-accent text-accent-foreground border-accent',
    badgeVariant: 'outline' as const,
    isFinal: false,
    allowEdit: false,
  },
  PendingApproval: {
    key: 'StatusKey2',
    label: 'Pending Approval',
    description: 'Awaiting HOD approval',
    color: 'bg-secondary text-secondary-foreground border-secondary',
    badgeVariant: 'outline' as const,
    isFinal: false,
    allowEdit: false,
  },
  Approved: {
    key: 'StatusKey3',
    label: 'Approved',
    description: 'Request has been approved',
    color: 'bg-primary text-primary-foreground border-primary',
    badgeVariant: 'default' as const,
    isFinal: true,
    allowEdit: false,
  },
  Rejected: {
    key: 'StatusKey4',
    label: 'Rejected',
    description: 'Request was rejected',
    color: 'bg-destructive text-destructive-foreground border-destructive',
    badgeVariant: 'destructive' as const,
    isFinal: true,
    allowEdit: false,
  },
  Returned: {
    key: 'StatusKey2',
    label: 'Returned',
    description: 'Returned for amendments',
    color: 'bg-accent text-accent-foreground border-accent',
    badgeVariant: 'outline' as const,
    isFinal: false,
    allowEdit: true,
  },
  Closed: {
    key: 'StatusKey5',
    label: 'Closed',
    description: 'Record is closed',
    color: 'bg-muted text-muted-foreground border-border',
    badgeVariant: 'secondary' as const,
    isFinal: true,
    allowEdit: false,
  },
} as const;

export type STRStatus = keyof typeof STR_STATUSES;

// =============================================================================
// STR ROLES (Security Group Based)
// =============================================================================

export const STR_ROLES = {
  Viewer: {
    key: 'STR-Viewer',
    label: 'Viewer',
    description: 'Can view records only',
    permissions: ['view'],
  },
  Requestor: {
    key: 'STR-Requestor',
    label: 'Requestor',
    description: 'Can create and submit requests',
    permissions: ['view', 'create', 'submit'],
  },
  StoreAdmin: {
    key: 'STR-StoreAdmin',
    label: 'Store Admin',
    description: 'Can review and process store transactions',
    permissions: ['view', 'create', 'submit', 'review', 'edit'],
  },
  Supervisor: {
    key: 'STR-Supervisor',
    label: 'Supervisor',
    description: 'Can approve at supervisor level',
    permissions: ['view', 'approve', 'reject', 'return'],
  },
  HOD: {
    key: 'STR-HOD',
    label: 'Head of Department',
    description: 'Final approval authority',
    permissions: ['view', 'approve', 'reject', 'return'],
  },
} as const;

export type STRRole = keyof typeof STR_ROLES;


// Alias for consistency
export const getSTRFormInfo = getSTRFormByCode;
// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getSTRFormByCode(code: string) {
  return STR_ALL_FORMS[code as STRFormCode] || null;
}

export function getSTRModuleByFormCode(formCode: string): typeof STR_MODULES[STRModuleId] | null {
  for (const moduleKey of Object.keys(STR_MODULES) as STRModuleId[]) {
    const module = STR_MODULES[moduleKey];
    if ((module.forms as readonly string[]).includes(formCode)) {
      return module;
    }
  }
  return null;
}

export function getFormsForModule(moduleId: STRModuleId) {
  const module = STR_MODULES[moduleId];
  return module.forms.map((formCode: string) => {
    const form = STR_ALL_FORMS[formCode as STRFormCode];
    return {
      code: formCode as STRFormCode,
      name: form?.name || formCode,
      description: form?.description || '',
    };
  });
}

export function getSTRStatusInfo(status: string) {
  return STR_STATUSES[status as STRStatus] || {
    key: status,
    label: status,
    description: 'Unknown status',
    color: 'bg-muted text-muted-foreground border-border',
    badgeVariant: 'secondary' as const,
    isFinal: false,
    allowEdit: false,
  };
}

export function isSTRStatusPending(status: string): boolean {
  const pendingStatuses = ['Submitted', 'PendingReview', 'PendingApproval'];
  return pendingStatuses.includes(status);
}

export function isSTRStatusComplete(status: string): boolean {
  const completeStatuses = ['Approved', 'Rejected', 'Closed'];
  return completeStatuses.includes(status);
}

export function canEditSTRRecord(status: string, userRole: STRRole): boolean {
  const statusInfo = getSTRStatusInfo(status);
  if (!statusInfo.allowEdit) return false;

  const roleInfo = STR_ROLES[userRole];
  const permissions = roleInfo.permissions as readonly string[];
  return permissions.includes('edit') || permissions.includes('create');
}

export function canApproveSTRRecord(status: string, userRole: STRRole): boolean {
  if (status !== 'PendingApproval' && status !== 'Submitted') return false;

  const roleInfo = STR_ROLES[userRole];
  const permissions = roleInfo.permissions as readonly string[];
  return permissions.includes('approve');
}

// =============================================================================
// INO PATTERN (Document Number)
// Generated by Power Automate: STR-<FORMCODE>-YYMM-NNNN
// =============================================================================

export function formatSTRDocumentNumber(ino: string, formCode: string): string {
  // Display format: "ACMSTR-2605-0001" with friendly label
  const form = getSTRFormByCode(formCode);
  if (form) {
    return `${ino} (${form.name})`;
  }
  return ino;
}

export function getSTRFriendlyLabel(formCode: string): string {
  const form = getSTRFormByCode(formCode);
  return form?.name || formCode;
}

// =============================================================================
// ROLE-BASED FIELD VISIBILITY (Screen 4 - Edit/Update)
// =============================================================================

export interface FieldVisibility {
  fieldName: string;
  label: string;
  visibleTo: STRRole[];
  editableBy: STRRole[];
  editableInStatuses: STRStatus[];
  required: boolean;
}

export const STR_FIELD_VISIBILITY: Record<string, FieldVisibility> = {
  // Common fields
  ItemDescription: {
    fieldName: 'ItemDescription',
    label: 'Item Description',
    visibleTo: ['Viewer', 'Requestor', 'StoreAdmin', 'Supervisor', 'HOD'],
    editableBy: ['Requestor', 'StoreAdmin'],
    editableInStatuses: ['Draft', 'Returned'],
    required: true,
  },
  Quantity: {
    fieldName: 'Quantity',
    label: 'Quantity',
    visibleTo: ['Viewer', 'Requestor', 'StoreAdmin', 'Supervisor', 'HOD'],
    editableBy: ['Requestor', 'StoreAdmin'],
    editableInStatuses: ['Draft', 'Returned'],
    required: true,
  },
  Department: {
    fieldName: 'Department',
    label: 'Department',
    visibleTo: ['Viewer', 'Requestor', 'StoreAdmin', 'Supervisor', 'HOD'],
    editableBy: ['Requestor'],
    editableInStatuses: ['Draft'],
    required: true,
  },
  Justification: {
    fieldName: 'Justification',
    label: 'Justification',
    visibleTo: ['Viewer', 'Requestor', 'StoreAdmin', 'Supervisor', 'HOD'],
    editableBy: ['Requestor', 'StoreAdmin'],
    editableInStatuses: ['Draft', 'Returned'],
    required: true,
  },
  // Store Admin fields
  StoreRemarks: {
    fieldName: 'StoreRemarks',
    label: 'Store Remarks',
    visibleTo: ['StoreAdmin', 'Supervisor', 'HOD'],
    editableBy: ['StoreAdmin'],
    editableInStatuses: ['Submitted', 'PendingReview'],
    required: false,
  },
  VerifiedBy: {
    fieldName: 'VerifiedBy',
    label: 'Verified By',
    visibleTo: ['StoreAdmin', 'Supervisor', 'HOD'],
    editableBy: ['StoreAdmin'],
    editableInStatuses: ['Submitted', 'PendingReview'],
    required: true,
  },
  VerifiedDate: {
    fieldName: 'VerifiedDate',
    label: 'Verified Date',
    visibleTo: ['StoreAdmin', 'Supervisor', 'HOD'],
    editableBy: ['StoreAdmin'],
    editableInStatuses: ['Submitted', 'PendingReview'],
    required: true,
  },
  // Supervisor/HOD fields
  ApprovalComments: {
    fieldName: 'ApprovalComments',
    label: 'Approval Comments',
    visibleTo: ['Supervisor', 'HOD'],
    editableBy: ['Supervisor', 'HOD'],
    editableInStatuses: ['PendingApproval'],
    required: false,
  },
  RejectionReason: {
    fieldName: 'RejectionReason',
    label: 'Rejection Reason',
    visibleTo: ['Requestor', 'StoreAdmin', 'Supervisor', 'HOD'],
    editableBy: ['Supervisor', 'HOD'],
    editableInStatuses: ['PendingApproval'],
    required: true, // MANDATORY for rejections
  },
};

export function isFieldVisible(fieldName: string, userRole: STRRole): boolean {
  const field = STR_FIELD_VISIBILITY[fieldName];
  if (!field) return true; // If not configured, show by default
  return field.visibleTo.includes(userRole);
}

export function isFieldEditable(fieldName: string, userRole: STRRole, status: STRStatus): boolean {
  const field = STR_FIELD_VISIBILITY[fieldName];
  if (!field) return false;
  return field.editableBy.includes(userRole) && field.editableInStatuses.includes(status);
}

export function getVisibleFields(userRole: STRRole): string[] {
  return Object.keys(STR_FIELD_VISIBILITY).filter(fieldName =>
    isFieldVisible(fieldName, userRole)
  );
}

export function getEditableFields(userRole: STRRole, status: STRStatus): string[] {
  return Object.keys(STR_FIELD_VISIBILITY).filter(fieldName =>
    isFieldEditable(fieldName, userRole, status)
  );
}

// =============================================================================
// CONVENIENCE EXPORTS FOR PAGES
// =============================================================================

export const STR_MODULE_IDS = Object.keys(STR_MODULES) as STRModuleId[];

export function getAllSTRForms() {
  return Object.values(STR_ALL_FORMS);
}

export function getSTRModuleForms(moduleId: STRModuleId) {
  const module = STR_MODULES[moduleId];
  return module.forms.map((code: string) => STR_ALL_FORMS[code as STRFormCode]).filter(Boolean);
}
