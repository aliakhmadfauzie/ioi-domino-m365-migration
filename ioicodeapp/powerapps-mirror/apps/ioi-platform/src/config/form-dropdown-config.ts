/**
 * Form Dropdown Configuration
 * 
 * Centralized configuration for all form dropdowns across the IOI Platform.
 * These values are sourced from SharePoint config lists:
 * - Config_Companies
 * - Config_Departments
 * - IT_M1_RS_SystemsList
 * - IT_M1_RS_SAP_Client
 * - IT_M1_RS_Banks
 * - IT_M1_SFAR_Servers
 * - IT_M1_UR_Applications
 * 
 * Last Updated: 2026-05-16
 * Reference: Ali Task Excel Sheet
 */

// =============================================================================
// COMPANY CONFIGURATIONS
// =============================================================================

/**
 * Master Company List - Company codes used across all forms
 * Source: Config_Companies SharePoint list
 */
export const MASTER_COMPANIES = [
  { code: 'ACIDCHEM_EUROPE', name: 'Acidchem Europe Consignment', shortName: 'Acidchem Europe' },
  { code: 'ACIDCHEM_USA', name: 'Acidchem USA', shortName: 'Acidchem USA' },
  { code: 'ASB', name: 'ASB', shortName: 'ASB' },
  { code: 'DCS', name: 'DCS', shortName: 'DCS' },
  { code: 'ACM', name: 'IOI Acidchem Sdn Bhd', shortName: 'Acidchem' },
  { code: 'ECM', name: 'IOI Esterchem (M) Sdn Bhd', shortName: 'Esterchem' },
  { code: 'PCEO', name: 'IOI PAN-CENTURY EDIBLE OILS SDN.BHD. | PFA', shortName: 'Pan-Century Edible' },
  { code: 'PCOC', name: 'IOI PAN-CENTURY OLEOCHEMICALS SDN.BHD. | POC', shortName: 'Pan-Century Oleo' },
  { code: 'IOIOI', name: 'IOIOI', shortName: 'IOIOI' },
  { code: 'POM', name: 'Palmco Oil Mill', shortName: 'Palmco' },
  { code: 'PALMEX', name: 'Palmex Development Sdn Bhd', shortName: 'Palmex' },
  { code: 'PAMOL', name: 'Pamol Bintang Sdn Bhd', shortName: 'Pamol' },
  { code: 'PAL', name: 'PAL', shortName: 'PAL' },
  { code: 'PFC', name: 'PFC', shortName: 'PFC' },
  { code: 'PGA', name: 'PGA', shortName: 'PGA' },
  { code: 'PJY', name: 'PJY', shortName: 'PJY' },
  { code: 'PMS', name: 'PMS', shortName: 'PMS' },
  { code: 'PPL', name: 'PPL', shortName: 'PPL' },
  { code: 'QGS', name: 'QGS', shortName: 'QGS' },
  { code: 'SCM', name: 'SCM', shortName: 'SCM' },
] as const;

// Company code type
export type CompanyCode = typeof MASTER_COMPANIES[number]['code'];

// Helper functions
export const getCompanyName = (code: string): string => {
  const company = MASTER_COMPANIES.find(c => c.code === code);
  return company?.name || code;
};

export const getCompanyShortName = (code: string): string => {
  const company = MASTER_COMPANIES.find(c => c.code === code);
  return company?.shortName || code;
};

// Simple arrays for dropdowns
export const COMPANY_CODES = MASTER_COMPANIES.map(c => c.code);
export const COMPANY_NAMES = MASTER_COMPANIES.map(c => c.name);

// =============================================================================
// DEPARTMENT CONFIGURATIONS
// =============================================================================

/**
 * Master Department List - All departments sorted alphabetically
 * Source: Config_Departments SharePoint list
 */
export const MASTER_DEPARTMENTS = [
  { code: 'ADM', name: 'Administration', category: 'Admin' },
  { code: 'EI', name: 'Engineering & Instrumentation', category: 'Engineering' },
  { code: 'ENG', name: 'Engineering', category: 'Engineering' },
  { code: 'ENV', name: 'Environment', category: 'HSE' },
  { code: 'FIN', name: 'Finance', category: 'Finance' },
  { code: 'GA', name: 'General Admin', category: 'Admin' },
  { code: 'HR', name: 'Human Resources', category: 'HR' },
  { code: 'HSE', name: 'Health, Safety & Environment', category: 'HSE' },
  { code: 'IT', name: 'Information Technology', category: 'IT' },
  { code: 'LAB', name: 'Laboratory', category: 'QA/QC' },
  { code: 'LOG', name: 'Logistics', category: 'Operations' },
  { code: 'MGT', name: 'Management', category: 'Management' },
  { code: 'MKT', name: 'Marketing', category: 'Sales' },
  { code: 'MTN', name: 'Maintenance', category: 'Engineering' },
  { code: 'OPS', name: 'Operations', category: 'Operations' },
  { code: 'PBI', name: 'Process & Business Improvement', category: 'Operations' },
  { code: 'PRD', name: 'Production', category: 'Production' },
  { code: 'PRD1', name: 'Production - Plant 1', category: 'Production' },
  { code: 'PRD2', name: 'Production - Plant 2', category: 'Production' },
  { code: 'PRD3', name: 'Production - Plant 3', category: 'Production' },
  { code: 'PUR', name: 'Purchasing', category: 'Procurement' },
  { code: 'PROC', name: 'Procurement', category: 'Procurement' },
  { code: 'QA', name: 'Quality Assurance', category: 'QA/QC' },
  { code: 'QC', name: 'Quality Control', category: 'QA/QC' },
  { code: 'RD', name: 'Research & Development', category: 'R&D' },
  { code: 'SAF', name: 'Safety', category: 'HSE' },
  { code: 'SEC', name: 'Security', category: 'Admin' },
  { code: 'SHE', name: 'Safety, Health & Environment', category: 'HSE' },
  { code: 'SHP', name: 'Shipping', category: 'Operations' },
  { code: 'SLS', name: 'Sales', category: 'Sales' },
  { code: 'STR', name: 'Stores', category: 'Operations' },
  { code: 'TD', name: 'Technical Department', category: 'Engineering' },
  { code: 'TRN', name: 'Transport', category: 'Operations' },
  { code: 'WH', name: 'Warehouse', category: 'Operations' },
  { code: 'WHRM', name: 'Warehouse - Raw Material', category: 'Operations' },
  { code: 'WHFG', name: 'Warehouse - Finished Goods', category: 'Operations' },
  { code: 'OTHER', name: 'Other', category: 'Other' },
] as const;

export type DepartmentCode = typeof MASTER_DEPARTMENTS[number]['code'];
export type DepartmentCategory = typeof MASTER_DEPARTMENTS[number]['category'];

export const getDepartmentName = (code: string): string => {
  const dept = MASTER_DEPARTMENTS.find(d => d.code === code);
  return dept?.name || code;
};

export const getDepartmentsByCategory = (category: DepartmentCategory) => {
  return MASTER_DEPARTMENTS.filter(d => d.category === category);
};

export const DEPARTMENT_CODES = MASTER_DEPARTMENTS.map(d => d.code);
export const DEPARTMENT_NAMES = MASTER_DEPARTMENTS.map(d => d.name);

// =============================================================================
// M1: RESET PASSWORD (RS) FORM CONFIGURATIONS
// =============================================================================

/**
 * Application/System Types for Reset Password
 * Source: IT_M1_RS_SystemsList
 */
export const RS_APPLICATION_TYPES = [
  { code: 'BANK', name: 'Bank', requiresBankSelection: true },
  { code: 'DOMAIN_ID', name: 'Domain ID', requiresBankSelection: false },
  { code: 'DOMAIN_PC', name: 'Domain PC', requiresBankSelection: false },
  { code: 'ESKER', name: 'ESKER', requiresBankSelection: false },
  { code: 'HCL_NOTES', name: 'HCL Notes', requiresBankSelection: false },
  { code: 'IEP', name: 'IEP (Live System)', requiresSAPClient: true, requiresBankSelection: false },
  { code: 'NAVISION_2018', name: 'Navision 2018', requiresBankSelection: false },
  { code: 'SALES_PORTAL', name: 'Sales Portal', requiresBankSelection: false },
  { code: 'SAP_S4HANA', name: 'SAP S4/HANA', requiresSAPClient: true, requiresBankSelection: false },
  { code: 'SOLMAN', name: 'SOLMAN', requiresBankSelection: false },
  { code: 'VPN', name: 'VPN', requiresBankSelection: false },
  { code: 'WEIGHBRIDGE', name: 'Weighbridge', requiresBankSelection: false },
] as const;

export type RSApplicationType = typeof RS_APPLICATION_TYPES[number]['code'];

/**
 * SAP Client List for Reset Password
 * Source: IT_M1_RS_SAP_Client
 */
export const RS_SAP_CLIENTS = [
  { code: 'IEP', name: 'IEP (Live System)', isLive: true },
  { code: 'IEQ', name: 'IEQ (Testing System)', isLive: false },
  { code: 'IED', name: 'IED (Development System)', isLive: false },
] as const;

export type RSSAPClient = typeof RS_SAP_CLIENTS[number]['code'];

/**
 * Bank List for Reset Password
 * Source: IT_M1_RS_Banks
 */
export const RS_BANKS = [
  'AmBank',
  'BNM - ACM',
  'BNM - ECM',
  'CitiDirect',
  'MayBank',
  'SCB',
  'SMBC - ACM',
  'SMBC - POM',
  'UOB',
] as const;

export type RSBank = typeof RS_BANKS[number];

/**
 * Reset Types
 */
export const RS_RESET_TYPES = [
  { code: 'RESET_PASSWORD', name: 'Reset Password' },
  { code: 'UNLOCK_ID', name: 'Unlock ID' },
] as const;

export type RSResetType = typeof RS_RESET_TYPES[number]['code'];

/**
 * Unlock ID Options (for SAP/Solman/ESKER)
 */
export const RS_UNLOCK_OPTIONS = [
  { code: 'SAP_UNLOCK', name: 'SAP Unlock', forApplications: ['SAP_S4HANA'] },
  { code: 'SOLMAN_UNLOCK', name: 'SOLMAN Unlock', forApplications: ['SOLMAN'] },
  { code: 'ESKER_UNLOCK', name: 'ESKER Unlock', forApplications: ['ESKER'] },
] as const;

// =============================================================================
// M1: SHARE FOLDER ACCESS REQUEST (SFAR) CONFIGURATIONS
// =============================================================================

/**
 * Server List for Share Folder Access
 * Source: IT_M1_SFAR_Servers
 */
export const SFAR_SERVERS = [
  { code: 'ACM1BATCHSVR', name: 'ACM1BATCHSVR', requiresITVerification: false },
  { code: 'ACIDCHEM_FILESVR', name: 'ACIDCHEM.COM\\FILESVR', requiresITVerification: false },
  { code: 'IOIINTRANET', name: 'IOIINTRANET', requiresITVerification: false },
  { code: 'IOIPCNSHARE', name: 'IOIPCNSHARE', requiresITVerification: true },
  { code: 'ITSTORE', name: 'ITSTORE', requiresITVerification: false },
  { code: 'NAS', name: 'NAS', requiresITVerification: false },
  { code: 'STORAGESVR', name: 'STORAGESVR', requiresITVerification: false },
] as const;

export type SFARServer = typeof SFAR_SERVERS[number]['code'];

/**
 * Request Types for Share Folder Access
 */
export const SFAR_REQUEST_TYPES = [
  { code: 'GRANT_ACCESS', name: 'Grant Access' },
  { code: 'REMOVE_ACCESS', name: 'Remove Access' },
  { code: 'DELETE_FOLDER', name: 'Delete Folder' },
] as const;

export type SFARRequestType = typeof SFAR_REQUEST_TYPES[number]['code'];

/**
 * Folder Types
 */
export const SFAR_FOLDER_TYPES = [
  { code: 'NEW', name: 'New Folder' },
  { code: 'EXISTING', name: 'Existing Folder' },
] as const;

/**
 * Permission Types
 */
export const SFAR_PERMISSIONS = [
  { code: 'READ', name: 'Read Only' },
  { code: 'WRITE', name: 'Write/Read' },
] as const;

export type SFARPermission = typeof SFAR_PERMISSIONS[number]['code'];

// =============================================================================
// M1: USER ID REQUEST (UR) CONFIGURATIONS
// =============================================================================

/**
 * Request Types for User ID
 */
export const UR_REQUEST_TYPES = [
  { code: 'NEW_ID', name: 'New ID' },
  { code: 'EXISTING_ID', name: 'Existing ID' },
  { code: 'REACTIVATE', name: 'Reactivate' },
  { code: 'DEACTIVATE', name: 'Deactivate' },
] as const;

export type URRequestType = typeof UR_REQUEST_TYPES[number]['code'];

/**
 * Application List for User ID Request
 * Source: IT_M1_UR_Applications
 */
export const UR_APPLICATIONS = [
  { code: 'BANK', name: 'Bank', hasDoorAccess: false },
  { code: 'BTP_COCKPIT', name: 'BTP Cockpit', hasDoorAccess: false },
  { code: 'DASHBOARD', name: 'Dashboard', hasDoorAccess: false },
  { code: 'DOOR_ACCESS', name: 'Door Access', hasDoorAccess: true },
  { code: 'ESKER_AP', name: 'ESKER AP Automation', hasDoorAccess: false },
  { code: 'GATE_PASS', name: 'Gate Pass & Store DO', hasDoorAccess: false },
  { code: 'SAC', name: 'SAC', hasDoorAccess: false },
  { code: 'SALES_PORTAL', name: 'Sales Portal', hasDoorAccess: false },
  { code: 'SAP_S4HANA', name: 'SAP S4/HANA', hasDoorAccess: false },
  { code: 'VMS', name: 'VMS', hasDoorAccess: false },
  { code: 'WEIGHBRIDGE', name: 'Weighbridge', hasDoorAccess: false },
  { code: 'WINDOWS_ID', name: 'Windows ID', hasDoorAccess: false },
] as const;

export type URApplication = typeof UR_APPLICATIONS[number]['code'];

/**
 * Door Access Options (28 doors)
 */
export const UR_DOOR_ACCESS_OPTIONS = [
  'DATA & CCTV ROOM ECM (IT, SEC & PRD) (2nd Floor)',
  'Guard House ACM 1 Gate 1',
  'Guard House ACM 2 Gate 2',
  'Guard House ACM 3 Gate 4',
  'Guard House ASN Gate 3',
  'Guard House ECM Gate 1',
  'Guard House ECM Gate 2',
  'IT ACM 1 Front Door',
  'IT ACM 1 Rear Door',
  'IT ACM 1 Server Room',
  'IT ACM 1 Work and Storage Room',
  'IT ECM SERVER Room (1st Floor)',
  'Production ACM 1 Server Room',
  'QC ACM 1 Chemical Room (Ground Floor)',
  'QC ACM 1 Front Door (Ground Floor)',
  'QC ACM 1 Lab Front Door (1st Floor)',
  'QC ACM 1 Lab Rear Door (1st Floor)',
  'QC ACM 1 Rear Door (Ground Floor)',
  'QC ACM 2 Lab Font Door',
  'QC ACM 2 Lab Rear Door',
  'QC ECM CHEMICAL ROOM (Ground Floor)',
  'QC ECM Front (Ground Floor)',
  'QC ECM Glass (Ground Floor)',
  'QC ECM PILOT Front (Ground Floor)',
  'QC ECM PILOT Rear (Ground Floor)',
  'QC ECM Rear (Ground Floor)',
  'RND ECM CTR Front (1st Floor)',
  'RND ECM CTR Rear (1st Floor)',
  'RND ECM LAB TO PILOT Rear (1st Floor)',
  'RND ECM RND Office Front (1st Floor)',
  'RND ECM RND Office Rear (1st Floor)',
  'RND ECM SENSE Room (1st Floor)',
] as const;

// =============================================================================
// M1: NOTES ID REQUEST (NIR) CONFIGURATIONS
// =============================================================================

/**
 * Email Request Types for NIR
 * Updated to include Rename and Delete options
 */
export const NIR_EMAIL_TYPES = [
  { code: 'NEW', name: 'New Email' },
  { code: 'REPLACEMENT', name: 'Replacement' },
  { code: 'RENAME', name: 'Rename' },
  { code: 'DELETE', name: 'Delete' },
] as const;

export type NIREmailType = typeof NIR_EMAIL_TYPES[number]['code'];

/**
 * Employee Types for NIR
 */
export const NIR_EMPLOYEE_TYPES = [
  { code: 'EXECUTIVE', name: 'Executive' },
  { code: 'NON_EXECUTIVE', name: 'Non-Executive' },
] as const;

export type NIREmployeeType = typeof NIR_EMPLOYEE_TYPES[number]['code'];

// =============================================================================
// M1: EXTERNAL ACCESS FORM (EAF) CONFIGURATIONS
// =============================================================================

/**
 * Application Types for EAF
 */
export const EAF_APPLICATION_TYPES = [
  { code: 'CITRIX', name: 'Citrix' },
  { code: 'VPN', name: 'VPN' },
  { code: 'OTHER', name: 'Other' },
] as const;

export type EAFApplicationType = typeof EAF_APPLICATION_TYPES[number]['code'];

/**
 * System Names for EAF
 */
export const EAF_SYSTEMS = [
  'SAP ECC',
  'SAP HANA',
  'SAP S4/HANA',
  'SharePoint Online',
  'Microsoft 365',
  'Power BI',
  'Notes/Domino',
  'Active Directory',
  'Azure AD',
  'File Server',
  'Database Server',
  'Web Application',
  'Other',
] as const;

// =============================================================================
// SAP MODULE CONFIGURATIONS (for M4 forms)
// =============================================================================

/**
 * SAP Modules
 */
export const SAP_MODULES = [
  { code: 'BASIS', name: 'BASIS' },
  { code: 'BI', name: 'BI' },
  { code: 'CO', name: 'Controlling' },
  { code: 'FI', name: 'Financials' },
  { code: 'FI_AA', name: 'FI-AA' },
  { code: 'FI_AP', name: 'FI-AP' },
  { code: 'FI_AR', name: 'FI-AR' },
  { code: 'FI_GL', name: 'FI-GL' },
  { code: 'LOG_WB', name: 'Logistics/Weighbridge' },
  { code: 'MM', name: 'Materials Management' },
  { code: 'MM_LOG', name: 'MM-Logistics' },
  { code: 'MM_PUR', name: 'MM-Purchasing' },
  { code: 'MM_STR', name: 'MM-Store' },
  { code: 'MM_WH', name: 'MM-Warehouse' },
  { code: 'PM', name: 'Plant Maintenance' },
  { code: 'PP', name: 'Production & Planning' },
  { code: 'PP_PROD', name: 'PP-Production' },
  { code: 'PP_PLAN', name: 'PP-Production Planning' },
  { code: 'QM', name: 'Quality Management' },
  { code: 'SAC', name: 'SAC' },
  { code: 'SD', name: 'Sales & Distribution' },
  { code: 'SD_LOG', name: 'SD-Logistics' },
  { code: 'SD_MKT', name: 'SD-Marketing' },
  { code: 'SD_SHP', name: 'SD-Shipping' },
  { code: 'SD_WH', name: 'SD-Warehouse' },
  { code: 'WM', name: 'Warehouse Management' },
  { code: 'WM_STR', name: 'WM-Store' },
  { code: 'WM_WH', name: 'WM-Warehouse' },
  { code: 'OTHERS', name: 'Others' },
] as const;

export type SAPModule = typeof SAP_MODULES[number]['code'];

/**
 * SAP Plants
 */
export const SAP_PLANTS = [
  { code: '1100', name: '1100-IOI' },
  { code: '1200', name: '1200-ACM' },
  { code: '1300', name: '1300-PCN' },
  { code: '1400', name: '1400-PCS' },
  { code: '1500', name: '1500-SCM' },
  { code: '1600', name: '1600-PCF' },
  { code: '2100', name: '2100-PCEO' },
  { code: '2200', name: '2200-ECM' },
  { code: '2300', name: '2300-BLC' },
  { code: '3100', name: '3100-PJY' },
  { code: '4100', name: '4100-LCAP' },
  { code: '5100', name: '5100-PCO-PJY' },
  { code: '5200', name: '5200-PCO-PGA' },
  { code: '6100', name: '6100-BIO' },
  { code: '6200', name: '6200-BIOGAS' },
  { code: '7100', name: '7100-IOE' },
  { code: '7200', name: '7200-IOP' },
  { code: '8100', name: '8100-LOG' },
  { code: '8200', name: '8200-SHP' },
  { code: '9100', name: '9100-POM' },
  { code: '9110', name: '9110-ECM-JB' },
  { code: '9120', name: '9120-PGA' },
] as const;

export type SAPPlant = typeof SAP_PLANTS[number]['code'];

/**
 * SAP Clients (for various forms)
 */
export const SAP_CLIENTS = [
  { code: 'IEP', name: 'IEP', description: 'Production' },
  { code: 'IEQ', name: 'IEQ', description: 'Quality/Testing' },
  { code: 'IED', name: 'IED', description: 'Development' },
  { code: 'IEP_DR', name: 'IEP-DR', description: 'Disaster Recovery' },
  { code: 'IBP', name: 'IBP', description: 'Business Planning' },
  { code: 'IBQ', name: 'IBQ', description: 'Business Quality' },
] as const;

export type SAPClient = typeof SAP_CLIENTS[number]['code'];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if application requires SAP client selection
 */
export const requiresSAPClient = (appCode: string): boolean => {
  const app = RS_APPLICATION_TYPES.find(a => a.code === appCode);
  return 'requiresSAPClient' in (app || {}) && (app as { requiresSAPClient?: boolean }).requiresSAPClient === true;
};

/**
 * Check if application requires bank selection
 */
export const requiresBankSelection = (appCode: string): boolean => {
  const app = RS_APPLICATION_TYPES.find(a => a.code === appCode);
  return app?.requiresBankSelection === true;
};

/**
 * Check if server requires IT verification
 */
export const requiresITVerification = (serverCode: string): boolean => {
  const server = SFAR_SERVERS.find(s => s.code === serverCode);
  return server?.requiresITVerification === true;
};

/**
 * Check if application has door access
 */
export const hasDoorAccess = (appCode: string): boolean => {
  const app = UR_APPLICATIONS.find(a => a.code === appCode);
  return app?.hasDoorAccess === true;
};