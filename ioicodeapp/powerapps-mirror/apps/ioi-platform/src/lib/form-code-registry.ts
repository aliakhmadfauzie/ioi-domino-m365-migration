/**
 * Form Code Registry
 *
 * Single source of truth for all form codes used across the platform.
 * Import from this file instead of using inline string literals.
 * This ensures consistency and enables compile-time checking.
 *
 * When adding a new form:
 * 1. Add the code to the appropriate module group below
 * 2. Add display names to FORM_CODE_LABELS
 * 3. Run `npx tsc --noEmit` to verify no broken references
 */

// =============================================================================
// IT DEPARTMENT — M1 to M6
// =============================================================================

/** M1 — User & Access Management */
export const M1_FORM_CODES = {
  EAF: 'EAF',
  NIR: 'NIR',
  RS: 'RS',
  SFAR: 'SFAR',
  UR: 'UR',
} as const;

/** M2 — IT Support & Service Requests */
export const M2_FORM_CODES = {
  IAL1: 'IAL1',
  IAL2: 'IAL2',
  IAL3: 'IAL3',
  IAL4: 'IAL4',
  IAL5: 'IAL5',
  ITDR: 'ITDR',
  ITDR2: 'ITDR2',
  ITSSR: 'ITSSR',
  PRF: 'PRF',
} as const;

/** M3 — Hardware & Infrastructure */
export const M3_FORM_CODES = {
  HI: 'HI',
  HWInv_NewInv: '1_HWInv_NewInv',
  ITSC: 'ITSC',
} as const;

/** M4 — SAP Management */
export const M4_FORM_CODES = {
  SAPAMR: 'SAPAMR',
  SAPCA: 'SAPCA',
  SAPCR: 'SAPCR',
  SAPSLCF: 'SAPSLCF',
  SAPSOF: 'SAPSOF',
  SAPSOF2: 'SAPSOF2',
  SAPTR: 'SAPTR',
} as const;

/** M5 — Documentation & Policies */
export const M5_FORM_CODES = {
  IOIP: 'IOIP',
  ITI: 'ITI',
  ITP: 'ITP',
  ITP2: 'ITP2',
  ISGDOC: 'ISGDOC',
  ITINFO: 'ITINFO',
} as const;

/** M6 — Disaster Recovery */
export const M6_FORM_CODES = {
  SAPDRP: 'SAPDRP',
} as const;

// Additional IT activity logs
export const IT_ACTIVITY_FORM_CODES = {
  DCAL: 'DCAL',
  DRR: 'DRR',
  SRL: 'SRL',
  SRR: 'SRR',
  SRVR: 'SRVR',
  TRNMAN: 'TRNMAN',
  MPSPRN: 'MPSPRN',
  HWRR: 'HWRR',
  ITE: 'ITE',
} as const;

// =============================================================================
// HR DEPARTMENT
// =============================================================================

export const HR_FORM_CODES = {
  AWHR: 'AWHR',
  BSD: 'BSD',
  CIR: 'CIR',
  CWR: 'CWR',
  DRD: 'DRD',
  EEN: 'EEN',
  EPHR: 'EPHR',
  EPDU: 'EPDU',
  ESF: 'ESF',
  FTCR: 'FTCR',
  FWWPD: 'FWWPD',
  FWWPE: 'FWWPE',
  GDSN: 'GDSN',
  HEALTHINFO: 'HEALTHINFO',
  HRAPR: 'HRAPR',
  HRINFO: 'HRINFO',
  INTERN: 'INTERN',
  INTERVIEWDB: 'INTERVIEWDB',
  JD: 'JD',
  LVE: 'LVE',
  NDF: 'NDF',
  ORGCHART: 'ORGCHART',
  OWP: 'OWP',
  PAF: 'PAF',
  RDWH: 'RDWH',
  SR: 'SR',
  TMPU: 'TMPU',
  TNPRA: 'TNPRA',
} as const;

// =============================================================================
// STR DEPARTMENT
// =============================================================================

export const STR_FORM_CODES = {
  ACMSTR: 'ACMSTR',
  MRFAPP: 'MRFAPP',
} as const;

// =============================================================================
// COMBINED REGISTRY
// =============================================================================

export const FORM_CODES = {
  ...M1_FORM_CODES,
  ...M2_FORM_CODES,
  ...M3_FORM_CODES,
  ...M4_FORM_CODES,
  ...M5_FORM_CODES,
  ...M6_FORM_CODES,
  ...IT_ACTIVITY_FORM_CODES,
  ...HR_FORM_CODES,
  ...STR_FORM_CODES,
} as const;

export type FormCode = typeof FORM_CODES[keyof typeof FORM_CODES];

// =============================================================================
// DISPLAY NAMES
// =============================================================================

export const FORM_CODE_LABELS: Record<string, string> = {
  // M1
  EAF: 'External Access Form',
  NIR: 'Notes ID Request',
  RS: 'Reset Password / Unlock ID',
  SFAR: 'Share Folder Access Request',
  UR: 'User ID Requisition',
  // M2
  IAL1: 'Server Reboot Log',
  IAL2: 'Data Center Access Log',
  IAL3: 'IT Event Log',
  IAL4: 'Server Records',
  IAL5: 'Data Restoration Request',
  ITDR: 'IT Daily Report',
  ITDR2: 'Outstanding Tasks Register',
  ITSSR: 'IT Support & Service Request',
  PRF: 'Program Request Form',
  // M3
  HI: 'Hardware Inventory',
  '1_HWInv_NewInv': 'New Hardware Inventory',
  ITSC: 'IT Server Checklist',
  // M4
  SAPAMR: 'SAP Authorisation Matrix Request',
  SAPCA: 'SAP Configuration Access',
  SAPCR: 'SAP Change Request',
  SAPSLCF: 'SAP Software Lifecycle Form',
  SAPSOF: 'SAP Sign-Off Form',
  SAPSOF2: 'SAP Sign-Off Form 2',
  SAPTR: 'SAP Transport Request',
  // M5
  IOIP: 'IOI Policy',
  ITI: 'IT Information Broadcast',
  ITP: 'ISG Documentation Register',
  ITP2: 'ISG Training Manual',
  ISGDOC: 'ISG Document',
  ITINFO: 'IT Information',
  // M6
  SAPDRP: 'SAP Disaster Recovery Plan',
  // Activity logs
  DCAL: 'Data Center Access Log',
  DRR: 'Data Restoration Request',
  SRL: 'Server Reboot Log',
  SRR: 'Server Records',
  SRVR: 'Server Records',
  TRNMAN: 'Training Manual',
  MPSPRN: 'MPS Printer',
  HWRR: 'Hardware Replacement Request',
  ITE: 'IT Event',
  // HR
  LVE: 'Leave Application',
  OWP: 'Overtime Work Permit',
  SR: 'Staff Requisition',
  EEN: 'Employee Exit Notice',
  PAF: 'Personnel Action Form',
  // STR
  ACMSTR: 'Stores Request',
  MRFAPP: 'Material Requisition Form',
};

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Get the display label for a form code.
 * Returns the form code itself if no label is registered.
 */
export function getFormLabel(formCode: string): string {
  return FORM_CODE_LABELS[formCode] || formCode;
}

/**
 * Check if a form code is valid (exists in the registry).
 */
export function isValidFormCode(code: string): code is FormCode {
  return code in FORM_CODES || Object.values(FORM_CODES).includes(code as FormCode);
}
