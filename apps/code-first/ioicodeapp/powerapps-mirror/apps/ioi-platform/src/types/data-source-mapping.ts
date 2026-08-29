/**
 * Data Source Mapping Types
 *
 * Provides detailed information about how data flows for each form:
 * - Which table/list the data is saved to
 * - Whether data is hardcoded (mock) or live (SharePoint/Dataverse)
 * - Which columns are written to and read from
 * - Which service manages the data
 */

import type { DepartmentCode } from './admin-config';

// =============================================================================
// DATA SOURCE TYPES
// =============================================================================

export type DataSourceType =
  | 'sharepoint'      // SharePoint List (live data)
  | 'dataverse'       // Dataverse Table (live data)
  | 'in-memory'       // In-memory mock storage (hardcoded/sample data)
  | 'connector';      // Power Platform Connector

export type ConnectionStatus =
  | 'connected'       // Live connection active
  | 'pending'         // Connection configured but not yet active
  | 'mock'            // Using mock/sample data
  | 'error';          // Connection failed

export interface ColumnMapping {
  name: string;           // Internal column name
  displayName: string;    // User-friendly label
  type: 'text' | 'number' | 'date' | 'datetime' | 'boolean' | 'choice' | 'person' | 'lookup' | 'attachment' | 'json';
  direction: 'read' | 'write' | 'both';  // Data flow direction
  required: boolean;
  description?: string;
  lookupTarget?: string;  // For lookup columns, the target table/list
}

export interface ServiceInfo {
  name: string;           // Service class name
  path: string;           // File path relative to src/
  methods: string[];      // Available methods (create, update, delete, getAll, etc.)
  hooks: string[];        // React hooks provided
}

export interface DataSourceMapping {
  id: string;
  formCode: string;
  formName: string;
  departmentCode: DepartmentCode;
  departmentName: string;

  // Data source info
  sourceType: DataSourceType;
  connectionStatus: ConnectionStatus;

  // Table/List info
  tableName: string;              // SharePoint list name or Dataverse table name
  tableDisplayName: string;       // User-friendly table name
  siteUrl?: string;               // SharePoint site URL (if applicable)
  environment?: string;           // Dataverse environment (if applicable)

  // Column mappings
  columns: ColumnMapping[];

  // Service info
  service: ServiceInfo;

  // Metadata
  lastUpdated?: string;
  notes?: string;
}

// =============================================================================
// DEPARTMENT DATA SOURCE SUMMARY
// =============================================================================

export interface DepartmentDataSummary {
  departmentCode: DepartmentCode;
  departmentName: string;
  totalForms: number;
  connectedForms: number;
  mockForms: number;
  tables: string[];           // Unique tables used
  services: string[];         // Unique services used
}

// =============================================================================
// DATA SOURCE REGISTRY
// =============================================================================

export const DATA_SOURCE_MAPPINGS: DataSourceMapping[] = [
  // ==========================================================================
  // IT DEPARTMENT (D06)
  // ==========================================================================
  {
    id: 'it-itssr',
    formCode: 'ITSSR',
    formName: 'IT Service Support Request',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_IT',
    tableDisplayName: 'Main IT Database (Prai)',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'Title', displayName: 'Ticket ID', type: 'text', direction: 'both', required: true },
      { name: 'FormCode', displayName: 'Form Code', type: 'text', direction: 'write', required: true },
      { name: 'CurrentStatus', displayName: 'Status', type: 'choice', direction: 'both', required: true },
      { name: 'SubmittedDate', displayName: 'Submitted Date', type: 'datetime', direction: 'write', required: true },
      { name: 'Site', displayName: 'Site', type: 'choice', direction: 'write', required: true },
      { name: 'Requestor_Email', displayName: 'Submitted By', type: 'text', direction: 'write', required: true },
      { name: 'Requestor_Name', displayName: 'Requestor Name', type: 'text', direction: 'read', required: false },
      { name: 'Remarks', displayName: 'Remarks', type: 'text', direction: 'both', required: false },
      { name: 'WorkflowStage', displayName: 'Workflow Stage', type: 'number', direction: 'both', required: false },
      { name: 'Company', displayName: 'Company', type: 'text', direction: 'both', required: false },
    ],
    service: {
      name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'delete', 'get', 'getAll', 'deleteWithCascade'],
      hooks: ['useMainDBITList', 'useMainDBIT', 'useCreateMainDBIT', 'useUpdateMainDBIT', 'useDeleteMainDBIT'],
    },
    notes: 'IT Service Support Request with multi-stage workflow. Uses generated MainDBITService.',
  },
  {
    id: 'it-nir',
    formCode: 'NIR',
    formName: 'Notes ID Request',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_IT',
    tableDisplayName: 'Main IT Database (Prai)',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'Title', displayName: 'Request ID', type: 'text', direction: 'both', required: true },
      { name: 'FormCode', displayName: 'Form Code', type: 'text', direction: 'write', required: true },
      { name: 'NIR_RequestType', displayName: 'Request Type', type: 'choice', direction: 'write', required: true },
      { name: 'Company', displayName: 'Company', type: 'choice', direction: 'write', required: true },
      { name: 'NIR_FullName', displayName: 'Full Name', type: 'text', direction: 'write', required: true },
      { name: 'NIR_EmployeeNumber', displayName: 'Employee Number', type: 'text', direction: 'write', required: true },
      { name: 'NIR_Department', displayName: 'Department', type: 'choice', direction: 'write', required: true },
      { name: 'CurrentStatus', displayName: 'Status', type: 'choice', direction: 'both', required: true },
    ],
    service: {
      name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBITList', 'useMainDBIT', 'useCreateMainDBIT', 'useUpdateMainDBIT'],
    },
    notes: 'NIR - Notes ID Request. Uses generated MainDBITService with NIR_* columns on MainDB_IT.',
  },
  {
    id: 'it-dcal',
    formCode: 'DCAL',
    formName: 'Data Center Access Log',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_IT',
    tableDisplayName: 'Main IT Database (Prai)',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'Title', displayName: 'Record ID', type: 'text', direction: 'both', required: true },
      { name: 'FormCode', displayName: 'Form Code', type: 'text', direction: 'write', required: true },
      { name: 'CurrentStatus', displayName: 'Status', type: 'choice', direction: 'both', required: true },
    ],
    service: {
      name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBITList', 'useCreateMainDBIT', 'useUpdateMainDBIT'],
    },
    notes: 'Uses MainDB_IT with generated MainDBITService. Form-specific data via prefix columns (e.g., HI_*, RS_*).',
  },
  {
    id: 'it-drr',
    formCode: 'DRR',
    formName: 'Data Restoration Request',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_IT',
    tableDisplayName: 'Main IT Database (Prai)',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'Title', displayName: 'Request ID', type: 'text', direction: 'both', required: true },
      { name: 'FormCode', displayName: 'Form Code', type: 'text', direction: 'write', required: true },
      { name: 'CurrentStatus', displayName: 'Status', type: 'choice', direction: 'both', required: true },
    ],
    service: {
      name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBITList', 'useCreateMainDBIT', 'useUpdateMainDBIT'],
    },
    notes: 'Form-specific data stored in MainDB_IT prefix columns (DRR_*). Uses generated MainDBITService.',
  },
  {
    id: 'it-itdr',
    formCode: 'ITDR',
    formName: 'IT Daily Report',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_IT',
    tableDisplayName: 'Main IT Database (Prai)',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'Title', displayName: 'Report ID', type: 'text', direction: 'both', required: true },
      { name: 'FormCode', displayName: 'Form Code', type: 'text', direction: 'write', required: true },
      { name: 'CurrentStatus', displayName: 'Status', type: 'choice', direction: 'both', required: true },
    ],
    service: {
      name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBITList', 'useCreateMainDBIT', 'useUpdateMainDBIT'],
    },
    notes: 'IT Daily Report. Form-specific data stored in MainDB_IT prefix columns.',
  },
  {
    id: 'it-prf',
    formCode: 'PRF',
    formName: 'Program Request Form',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_IT',
    tableDisplayName: 'Main IT Database (Prai)',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'Title', displayName: 'Request ID', type: 'text', direction: 'both', required: true },
      { name: 'FormCode', displayName: 'Form Code', type: 'text', direction: 'write', required: true },
      { name: 'CurrentStatus', displayName: 'Status', type: 'choice', direction: 'both', required: true },
    ],
    service: {
      name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBITList', 'useCreateMainDBIT', 'useUpdateMainDBIT'],
    },
    notes: 'PRF data via MainDB_IT prefix columns (PRF_*). Uses generated MainDBITService.',
  },
  {
    id: 'it-srl',
    formCode: 'SRL',
    formName: 'Server Reboot Log',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_IT',
    tableDisplayName: 'Main IT Database (Prai)',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'Title', displayName: 'Log ID', type: 'text', direction: 'both', required: true },
      { name: 'FormCode', displayName: 'Form Code', type: 'text', direction: 'write', required: true },
      { name: 'CurrentStatus', displayName: 'Status', type: 'choice', direction: 'both', required: true },
    ],
    service: {
      name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBITList', 'useCreateMainDBIT', 'useUpdateMainDBIT'],
    },
    notes: 'Server Reboot Log via MainDB_IT. Uses generated MainDBITService.',
  },
  {
    id: 'it-srr',
    formCode: 'SRR',
    formName: 'Server Records',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_IT',
    tableDisplayName: 'Main IT Database (Prai)',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'Title', displayName: 'Record ID', type: 'text', direction: 'both', required: true },
      { name: 'FormCode', displayName: 'Form Code', type: 'text', direction: 'write', required: true },
      { name: 'CurrentStatus', displayName: 'Status', type: 'choice', direction: 'both', required: true },
    ],
    service: {
      name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBITList', 'useCreateMainDBIT', 'useUpdateMainDBIT'],
    },
    notes: 'Server Records via MainDB_IT. Uses generated MainDBITService.',
  },
  {
    id: 'it-rs',
    formCode: 'RS',
    formName: 'Reset Password / Unlock ID',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_IT',
    tableDisplayName: 'Main IT Database (Prai)',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'Title', displayName: 'Request ID', type: 'text', direction: 'both', required: true },
      { name: 'UserName', displayName: 'User Name', type: 'person', direction: 'write', required: true },
      { name: 'System', displayName: 'System', type: 'choice', direction: 'write', required: true, description: 'SAP/Notes/AD/Bank/etc.' },
      { name: 'ResetType', displayName: 'Reset Type', type: 'choice', direction: 'write', required: true, description: 'Reset/Unlock/Both' },
      { name: 'RS_Bank', displayName: 'Bank', type: 'choice', direction: 'write', required: false, description: 'Required for Bank system' },
      { name: 'HOD', displayName: 'Head of Department', type: 'person', direction: 'write', required: true },
      { name: 'ExecutiveDirector', displayName: 'Executive Director', type: 'person', direction: 'write', required: false, description: 'Required for Bank resets' },
      { name: 'CurrentAction', displayName: 'Status', type: 'choice', direction: 'both', required: true },
    ],
    service: {
      name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBITList', 'useCreateMainDBIT', 'useUpdateMainDBIT'],
    },
    notes: 'M1 - Password reset with conditional ED approval for Bank systems. Uses MainDB_IT via generated MainDBITService.',
  },
  {
    id: 'it-sfar',
    formCode: 'SFAR',
    formName: 'Share Folder Access Requisition',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_IT',
    tableDisplayName: 'Main IT Database (Prai)',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'Title', displayName: 'Request ID', type: 'text', direction: 'both', required: true },
      { name: 'Type', displayName: 'Folder Type', type: 'choice', direction: 'write', required: true, description: 'Existing/New' },
      { name: 'Server', displayName: 'Server', type: 'choice', direction: 'write', required: true },
      { name: 'Owner', displayName: 'Folder Owner', type: 'person', direction: 'write', required: true },
      { name: 'AccessType', displayName: 'Request Type', type: 'choice', direction: 'write', required: true, description: 'Grant/Remove/Modify' },
      { name: 'AccessTo', displayName: 'Grant Access To', type: 'text', direction: 'write', required: true },
      { name: 'FolderName', displayName: 'Folder Path', type: 'text', direction: 'write', required: true },
      { name: 'Permission', displayName: 'Permission', type: 'choice', direction: 'write', required: true, description: 'Read/Modify/Full' },
      { name: 'HOD', displayName: 'HOD', type: 'person', direction: 'write', required: true },
      { name: 'CurrentAction', displayName: 'Status', type: 'choice', direction: 'both', required: true },
    ],
    service: {
      name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBITList', 'useMainDBIT', 'useCreateMainDBIT', 'useUpdateMainDBIT'],
    },
    notes: 'M1 - Folder access with owner approval stage. Uses generated MainDBITService.',
  },
  {
    id: 'it-ur',
    formCode: 'UR',
    formName: 'User ID Request Form',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_IT',
    tableDisplayName: 'Main IT Database (Prai)',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'INO', displayName: 'Request Number', type: 'text', direction: 'both', required: true },
      { name: 'reqtype', displayName: 'Request Type', type: 'choice', direction: 'write', required: true, description: 'New/Modify/Delete' },
      { name: 'empname', displayName: 'Employee Name', type: 'text', direction: 'write', required: true },
      { name: 'EmployeeNum', displayName: 'Employee Number', type: 'text', direction: 'write', required: true },
      { name: 'type', displayName: 'Application', type: 'choice', direction: 'write', required: true, description: 'AD/SAP/Notes/etc.' },
      { name: 'coname', displayName: 'Company', type: 'choice', direction: 'write', required: true },
      { name: 'division', displayName: 'Division', type: 'choice', direction: 'write', required: true },
      { name: 'CurrentStatus', displayName: 'Status', type: 'choice', direction: 'both', required: true },
    ],
    service: {
      name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBITList', 'useCreateMainDBIT', 'useUpdateMainDBIT'],
    },
    notes: 'UR data via MainDB_IT prefix columns (UR_*). Uses generated MainDBITService.',
  },
  {
    id: 'it-ial1',
    formCode: 'IAL1',
    formName: 'Server Reboot Log',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_IT',
    tableDisplayName: 'Main IT Database (Prai)',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'Title', displayName: 'Log ID', type: 'text', direction: 'both', required: true },
      { name: 'FormCode', displayName: 'Form Code', type: 'text', direction: 'write', required: true },
      { name: 'CurrentStatus', displayName: 'Status', type: 'choice', direction: 'both', required: true },
    ],
    service: {
      name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBITList', 'useCreateMainDBIT', 'useUpdateMainDBIT'],
    },
    notes: 'IAL1 via MainDB_IT (alias for SRL). Uses generated MainDBITService.',
  },
  {
    id: 'it-ial2',
    formCode: 'IAL2',
    formName: 'Data Center Access Log',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_IT',
    tableDisplayName: 'Main IT Database (Prai)',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'rbSite', displayName: 'Site', type: 'choice', direction: 'write', required: true },
      { name: 'lstServerRoom', displayName: 'Server Room', type: 'choice', direction: 'write', required: true },
      { name: 'dtCreatedAccess', displayName: 'Date', type: 'date', direction: 'write', required: true },
      { name: 'dtTimeIN', displayName: 'Time In', type: 'text', direction: 'write', required: true },
      { name: 'nmVisitor', displayName: 'Visitor Name', type: 'text', direction: 'write', required: true },
      { name: 'lstCompany', displayName: 'Company', type: 'text', direction: 'write', required: true },
      { name: 'txtReasonAccess', displayName: 'Reason', type: 'text', direction: 'write', required: true },
      { name: 'nmPIC', displayName: 'Attended By', type: 'person', direction: 'write', required: true },
      { name: 'CurrentAction', displayName: 'Status', type: 'choice', direction: 'both', required: true },
    ],
    service: {
      name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBITList', 'useCreateMainDBIT', 'useUpdateMainDBIT'],
    },
    notes: 'M2 - IT Activity Log for data center visitor access. Uses generated MainDBITService.',
  },
  {
    id: 'it-ial3',
    formCode: 'IAL3',
    formName: 'IT Event',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_IT',
    tableDisplayName: 'Main IT Database (Prai)',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'Title', displayName: 'Event ID', type: 'text', direction: 'both', required: true },
      { name: 'FormCode', displayName: 'Form Code', type: 'text', direction: 'write', required: true },
      { name: 'CurrentStatus', displayName: 'Status', type: 'choice', direction: 'both', required: true },
    ],
    service: {
      name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBITList', 'useCreateMainDBIT', 'useUpdateMainDBIT'],
    },
    notes: 'IAL3 via MainDB_IT. Uses generated MainDBITService.',
  },
  {
    id: 'it-ial4',
    formCode: 'IAL4',
    formName: 'Server Records',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_IT',
    tableDisplayName: 'Main IT Database (Prai)',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'rbSite', displayName: 'Site', type: 'choice', direction: 'write', required: true },
      { name: 'lstServerName', displayName: 'Server Name', type: 'choice', direction: 'write', required: true },
      { name: 'lstRecType', displayName: 'Record Type', type: 'choice', direction: 'write', required: true, description: 'Incident/Maintenance/Upgrade/Audit' },
      { name: 'rbMode', displayName: 'Mode', type: 'choice', direction: 'write', required: true, description: 'Online/Offline/Maintenance' },
      { name: 'dtFrom', displayName: 'Date From', type: 'date', direction: 'write', required: true },
      { name: 'dtTo', displayName: 'Date To', type: 'date', direction: 'write', required: true },
      { name: 'txtSummary', displayName: 'Summary', type: 'text', direction: 'write', required: true },
      { name: 'CurrentAction', displayName: 'Status', type: 'choice', direction: 'both', required: true },
    ],
    service: {
      name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBITList', 'useCreateMainDBIT', 'useUpdateMainDBIT'],
    },
    notes: 'M2 - IT Activity Log for server inventory records. Uses generated MainDBITService.',
  },
  {
    id: 'it-hi',
    formCode: 'HI',
    formName: 'Hardware Inventory',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_IT',
    tableDisplayName: 'Main IT Database (Prai)',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'inventoryType', displayName: 'Inventory Type', type: 'choice', direction: 'write', required: true, description: 'newinventory/network/mspprinter' },
      { name: 'assetTag', displayName: 'Asset Tag', type: 'text', direction: 'write', required: true },
      { name: 'serialNumber', displayName: 'Serial Number', type: 'text', direction: 'write', required: true },
      { name: 'equipmentType', displayName: 'Equipment Type', type: 'choice', direction: 'write', required: true },
      { name: 'brand', displayName: 'Brand', type: 'text', direction: 'write', required: true },
      { name: 'model', displayName: 'Model', type: 'text', direction: 'write', required: true },
      { name: 'assignedTo', displayName: 'Assigned To', type: 'person', direction: 'both', required: false },
      { name: 'location', displayName: 'Location', type: 'text', direction: 'write', required: true },
      { name: 'purchaseDate', displayName: 'Purchase Date', type: 'date', direction: 'write', required: false },
      { name: 'warrantyExpiry', displayName: 'Warranty Expiry', type: 'date', direction: 'write', required: false },
      { name: 'CurrentAction', displayName: 'Status', type: 'choice', direction: 'both', required: true },
    ],
    service: {
      name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'get', 'getAll', 'delete'],
      hooks: ['useMainDBITList', 'useCreateMainDBIT', 'useUpdateMainDBIT'],
    },
    notes: 'M3 - Hardware Inventory with conditional sections for Network/MSP Printer. Uses MainDB_IT via generated MainDBITService.',
  },
  {
    id: 'it-sapamr',
    formCode: 'SAPAMR',
    formName: 'SAP Authorization Master Record',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_IT',
    tableDisplayName: 'Main IT Database (Prai)',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'Title', displayName: 'Request ID', type: 'text', direction: 'both', required: true },
      { name: 'Module', displayName: 'SAP Module', type: 'choice', direction: 'write', required: true, description: 'FI/CO/MM/SD/PP/PM/QM/HCM/BASIS' },
      { name: 'Plant', displayName: 'Plant', type: 'choice', direction: 'write', required: true },
      { name: 'AuthType', displayName: 'Authorization Type', type: 'choice', direction: 'write', required: true, description: 'New/Modify/Remove' },
      { name: 'TBV', displayName: 'To Be Verified By', type: 'person', direction: 'write', required: true },
      { name: 'TBA', displayName: 'BPO/HOD', type: 'person', direction: 'write', required: true },
      { name: 'Remarks', displayName: 'Remarks', type: 'text', direction: 'write', required: false },
      { name: 'CurrentAction', displayName: 'Status', type: 'choice', direction: 'both', required: true },
    ],
    service: {
      name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBITList', 'useCreateMainDBIT', 'useUpdateMainDBIT'],
    },
    notes: 'M4 - SAP authorization maintenance with IT Functional verification and BPO/HOD approval. Uses MainDB_IT via generated MainDBITService.',
  },
  {
    id: 'it-sapca',
    formCode: 'SAPCA',
    formName: 'SAP Configuration Access Form',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_IT',
    tableDisplayName: 'Main IT Database (Prai)',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'ReqNum', displayName: 'Form Number', type: 'text', direction: 'both', required: true },
      { name: 'btnAppArea', displayName: 'SAP Module', type: 'choice', direction: 'write', required: true },
      { name: 'Client', displayName: 'System ID', type: 'choice', direction: 'write', required: true, description: 'IED/IEQ/IEP' },
      { name: 'ClientNum', displayName: 'Client Number', type: 'text', direction: 'write', required: true },
      { name: 'RefDoc', displayName: 'Reference Document', type: 'text', direction: 'write', required: true },
      { name: 'Purpose', displayName: 'Purpose', type: 'text', direction: 'write', required: true },
      { name: 'ChangesDone', displayName: 'Changes to be Done', type: 'text', direction: 'write', required: true },
      { name: 'CurrentAction', displayName: 'Status', type: 'choice', direction: 'both', required: true },
    ],
    service: {
      name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBITList', 'useCreateMainDBIT', 'useUpdateMainDBIT'],
    },
    notes: 'M4 - SAP Configuration Access with 4-stage workflow (IT Functional -> BASIS -> Config Close -> Completion). Uses MainDB_IT via generated MainDBITService.',
  },
  {
    id: 'it-sapcr',
    formCode: 'SAPCR',
    formName: 'SAP & WB Change Request',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_IT',
    tableDisplayName: 'Main IT Database (Prai)',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'ChgReqNo', displayName: 'Change Request No', type: 'text', direction: 'both', required: true },
      { name: 'ProjectPhase', displayName: 'Project Phase', type: 'choice', direction: 'write', required: true, description: 'DEV/UAT/PROD' },
      { name: 'AllDivision', displayName: 'Plant', type: 'choice', direction: 'write', required: true },
      { name: 'System', displayName: 'System', type: 'choice', direction: 'write', required: true, description: 'SAP ECC/HANA/Fiori/WB' },
      { name: 'btnAppArea', displayName: 'Module', type: 'choice', direction: 'write', required: true },
      { name: 'dlPriority', displayName: 'Priority', type: 'choice', direction: 'write', required: true },
      { name: 'btnPurpose', displayName: 'Purpose', type: 'choice', direction: 'write', required: true, description: 'Bug Fix/Enhancement/New Dev/Optimization' },
      { name: 'txtProposedChange', displayName: 'Proposed Change', type: 'text', direction: 'write', required: true },
      { name: 'CurrentAction', displayName: 'Status', type: 'choice', direction: 'both', required: true },
    ],
    service: {
      name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBITList', 'useCreateMainDBIT', 'useUpdateMainDBIT'],
    },
    notes: 'M4 - SAP/Workbench change request with 3-stage workflow. Uses MainDB_IT via generated MainDBITService.',
  },
  {
    id: 'it-sapdrp',
    formCode: 'SAPDRP',
    formName: 'SAP DRP Procedures',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_IT',
    tableDisplayName: 'Main IT Database (Prai)',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'Subject', displayName: 'Title', type: 'text', direction: 'write', required: true },
      { name: 'Categories', displayName: 'Category', type: 'choice', direction: 'write', required: true, description: 'Backup/Recovery/Failover/Restoration' },
      { name: 'EffectDate', displayName: 'Effective Date', type: 'date', direction: 'write', required: true },
      { name: 'Revision', displayName: 'Revision', type: 'text', direction: 'write', required: true },
      { name: 'Dept', displayName: 'Department', type: 'text', direction: 'write', required: true },
      { name: 'Team', displayName: 'Team', type: 'text', direction: 'write', required: true },
      { name: 'Body', displayName: 'DRP Procedures', type: 'text', direction: 'write', required: true },
      { name: 'AppBy', displayName: 'Head of Department', type: 'person', direction: 'write', required: true },
      { name: 'CurrentAction', displayName: 'Status', type: 'choice', direction: 'both', required: true },
    ],
    service: {
      name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBITList', 'useCreateMainDBIT', 'useUpdateMainDBIT'],
    },
    notes: 'M4 - SAP Disaster Recovery Procedures with Initiator verification and HOD endorsement. Uses MainDB_IT via generated MainDBITService.',
  },
  {
    id: 'it-sapslcf',
    formCode: 'SAPSLCF',
    formName: 'Storage Location Creation Form',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_IT',
    tableDisplayName: 'Main IT Database (Prai)',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'txtReqNo', displayName: 'Request No', type: 'text', direction: 'both', required: true },
      { name: 'txtDesignation', displayName: 'Designation', type: 'text', direction: 'write', required: true },
      { name: 'cboDep', displayName: 'Department', type: 'choice', direction: 'write', required: true },
      { name: 'cboProteanSite', displayName: 'Plant Code', type: 'choice', direction: 'write', required: true },
      { name: 'txtAreaLocNo', displayName: 'Storage Location Code', type: 'text', direction: 'write', required: true },
      { name: 'txtAreaLocDesc', displayName: 'Storage Location Description', type: 'text', direction: 'write', required: true },
      { name: 'namesDepHead', displayName: 'Department Head', type: 'person', direction: 'write', required: true },
      { name: 'CurrentAction', displayName: 'Status', type: 'choice', direction: 'both', required: true },
    ],
    service: {
      name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBITList', 'useCreateMainDBIT', 'useUpdateMainDBIT'],
    },
    notes: 'M4 - SAP Storage Location creation with HOD approval and IT processing. Uses MainDB_IT via generated MainDBITService.',
  },
  {
    id: 'it-saptr',
    formCode: 'SAPTR',
    formName: 'SAP Transport Request',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_IT',
    tableDisplayName: 'Main IT Database (Prai)',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'Title', displayName: 'Transport Number', type: 'text', direction: 'both', required: true },
      { name: 'TransportType', displayName: 'Transport Type', type: 'choice', direction: 'write', required: true },
      { name: 'SourceSystem', displayName: 'Source System', type: 'choice', direction: 'write', required: true },
      { name: 'TargetSystem', displayName: 'Target System', type: 'choice', direction: 'write', required: true },
      { name: 'TransportDescription', displayName: 'Description', type: 'text', direction: 'write', required: true },
      { name: 'PreparedBy', displayName: 'Prepared By', type: 'person', direction: 'write', required: true },
      { name: 'CheckedBy', displayName: 'Checked By', type: 'person', direction: 'write', required: true },
      { name: 'ApprovedBy', displayName: 'Approved By', type: 'person', direction: 'write', required: true },
      { name: 'CurrentAction', displayName: 'Status', type: 'choice', direction: 'both', required: true },
    ],
    service: {
      name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBITList', 'useCreateMainDBIT', 'useUpdateMainDBIT'],
    },
    notes: 'M4 - SAP Transport with Prepared/Checked/Approved signature workflow. Uses MainDB_IT via generated MainDBITService.',
  },
  {
    id: 'it-sapsof2',
    formCode: 'SAPSOF2',
    formName: 'SAP Sign-Off Form',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_IT',
    tableDisplayName: 'Main IT Database (Prai)',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'Title', displayName: 'Sign-Off ID', type: 'text', direction: 'both', required: true },
      { name: 'Module', displayName: 'SAP Module', type: 'choice', direction: 'write', required: true },
      { name: 'Subject', displayName: 'Subject', type: 'text', direction: 'write', required: true },
      { name: 'Description', displayName: 'Description', type: 'text', direction: 'write', required: true },
      { name: 'TestResults', displayName: 'Test Results', type: 'text', direction: 'write', required: true },
      { name: 'PreparedBy', displayName: 'Prepared By', type: 'person', direction: 'write', required: true },
      { name: 'CheckedBy', displayName: 'Checked By', type: 'person', direction: 'write', required: true },
      { name: 'ApprovedBy', displayName: 'Approved By', type: 'person', direction: 'write', required: true },
      { name: 'CurrentAction', displayName: 'Status', type: 'choice', direction: 'both', required: true },
    ],
    service: {
      name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBITList', 'useCreateMainDBIT', 'useUpdateMainDBIT'],
    },
    notes: 'M4 - SAP Sign-Off with 3-signature workflow (Prepared/Checked/Approved). Uses MainDB_IT via generated MainDBITService.',
  },
  {
    id: 'it-eaf',
    formCode: 'EAF',
    formName: 'External Access Form',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_IT',
    tableDisplayName: 'Main IT Database (Prai)',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'GUID', displayName: 'GUID', type: 'text', direction: 'read', required: true },
      { name: 'Title', displayName: 'Ticket ID', type: 'text', direction: 'both', required: true },
      { name: 'FormCode', displayName: 'Form Code', type: 'text', direction: 'write', required: true },
      { name: 'CurrentAction', displayName: 'Status', type: 'choice', direction: 'both', required: true },
      { name: 'SubmittedBy', displayName: 'Submitted By', type: 'person', direction: 'write', required: true },
      { name: 'TargetUser', displayName: 'Target User', type: 'person', direction: 'write', required: true, description: 'User receiving access' },
      { name: 'AccessType', displayName: 'Access Type', type: 'choice', direction: 'write', required: true },
      { name: 'Justification', displayName: 'Justification', type: 'text', direction: 'write', required: true },
      { name: 'DepartmentHead', displayName: 'Department Head', type: 'person', direction: 'write', required: true },
      { name: 'FormData', displayName: 'Form Data (JSON)', type: 'json', direction: 'both', required: false },
    ],
    service: {
      name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBITList', 'useCreateMainDBIT', 'useUpdateMainDBIT'],
    },
    notes: 'Uses 5-stage workflow: Submission -> DeptHead -> DivisionDirector -> ITManager -> ITProvisioning. Uses MainDB_IT via generated MainDBITService.',
  },
  {
    id: 'it-srvr',
    formCode: 'SRVR',
    formName: 'Server Request',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_IT',
    tableDisplayName: 'Main IT Database (Prai)',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'Title', displayName: 'Ticket ID', type: 'text', direction: 'both', required: true },
      { name: 'FormCode', displayName: 'Form Code', type: 'text', direction: 'write', required: true },
      { name: 'ServerType', displayName: 'Server Type', type: 'choice', direction: 'write', required: true },
      { name: 'Purpose', displayName: 'Purpose', type: 'text', direction: 'write', required: true },
      { name: 'Resources', displayName: 'Resources Required', type: 'json', direction: 'write', required: true },
    ],
    service: {
      name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBITList', 'useCreateMainDBIT', 'useUpdateMainDBIT'],
    },
  },
  {
    id: 'it-hwrr',
    formCode: 'HWRR',
    formName: 'Hardware Request & Return',
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_IT',
    tableDisplayName: 'Main IT Database (Prai)',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'Title', displayName: 'Ticket ID', type: 'text', direction: 'both', required: true },
      { name: 'RequestType', displayName: 'Request Type', type: 'choice', direction: 'write', required: true, description: 'New/Return/Exchange' },
      { name: 'HardwareType', displayName: 'Hardware Type', type: 'choice', direction: 'write', required: true },
      { name: 'AssetTag', displayName: 'Asset Tag', type: 'text', direction: 'both', required: false },
      { name: 'Technician', displayName: 'Assigned Technician', type: 'person', direction: 'both', required: false },
    ],
    service: {
      name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBITList', 'useCreateMainDBIT', 'useUpdateMainDBIT'],
    },
  },

  // ==========================================================================
  // HR DEPARTMENT (D01)
  // ==========================================================================
  {
    id: 'hr-lve',
    formCode: 'LVE',
    formName: 'Leave Application',
    departmentCode: 'HR',
    departmentName: 'Human Resources',
    sourceType: 'in-memory',
    connectionStatus: 'mock',
    tableName: 'MainDB_HR',
    tableDisplayName: 'Main HR Database',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-hr',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'GUID', displayName: 'GUID', type: 'text', direction: 'read', required: true },
      { name: 'INO', displayName: 'Reference Number', type: 'text', direction: 'both', required: true },
      { name: 'FormType', displayName: 'Form Type', type: 'text', direction: 'write', required: true },
      { name: 'CurrentStatus', displayName: 'Status', type: 'choice', direction: 'both', required: true },
      { name: 'Division', displayName: 'Division', type: 'text', direction: 'write', required: true },
      { name: 'LeaveType', displayName: 'Leave Type', type: 'choice', direction: 'write', required: true },
      { name: 'StartDate', displayName: 'Start Date', type: 'date', direction: 'write', required: true },
      { name: 'EndDate', displayName: 'End Date', type: 'date', direction: 'write', required: true },
      { name: 'Reason', displayName: 'Reason', type: 'text', direction: 'write', required: true },
      { name: 'FormData', displayName: 'Form Data (JSON)', type: 'json', direction: 'both', required: false },
    ],
    service: {
      name: 'HRSubmissionService',
      path: 'services/hr-submission-service.ts',
      methods: ['create', 'update', 'get', 'getAll', 'processApproval', 'getApprovalHistory'],
      hooks: ['useHRSubmissions', 'useHRSubmission', 'useCreateHRSubmission', 'useProcessHRApproval'],
    },
    notes: 'Approval history stored in cr_approvalrecord list.',
  },
  {
    id: 'hr-rec',
    formCode: 'REC',
    formName: 'Recruitment Request',
    departmentCode: 'HR',
    departmentName: 'Human Resources',
    sourceType: 'in-memory',
    connectionStatus: 'mock',
    tableName: 'MainDB_HR',
    tableDisplayName: 'Main HR Database',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-hr',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'INO', displayName: 'Reference Number', type: 'text', direction: 'both', required: true },
      { name: 'FormType', displayName: 'Form Type', type: 'text', direction: 'write', required: true },
      { name: 'Position', displayName: 'Position Title', type: 'text', direction: 'write', required: true },
      { name: 'Department', displayName: 'Department', type: 'text', direction: 'write', required: true },
      { name: 'Headcount', displayName: 'Headcount', type: 'number', direction: 'write', required: true },
      { name: 'JustificationType', displayName: 'Justification Type', type: 'choice', direction: 'write', required: true },
    ],
    service: {
      name: 'HRSubmissionService',
      path: 'services/hr-submission-service.ts',
      methods: ['create', 'update', 'get', 'getAll', 'processApproval'],
      hooks: ['useHRSubmissions', 'useCreateHRSubmission'],
    },
  },

  // ==========================================================================
  // STR DEPARTMENT (Store Management)
  // ==========================================================================
  {
    id: 'str-acmstr',
    formCode: 'ACMSTR',
    formName: 'Store Requisition',
    departmentCode: 'LOG',
    departmentName: 'Store Management',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_STR',
    tableDisplayName: 'Main STR Database',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-str',
    columns: [
      { name: 'id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'title', displayName: 'Title', type: 'text', direction: 'both', required: true },
      { name: 'documentNo', displayName: 'Document Number', type: 'text', direction: 'both', required: true },
      { name: 'formCode', displayName: 'Form Code', type: 'text', direction: 'write', required: true },
      { name: 'departmentKey', displayName: 'Department', type: 'choice', direction: 'write', required: true },
      { name: 'statusKey', displayName: 'Status', type: 'choice', direction: 'both', required: true },
      { name: 'siteKey', displayName: 'Site', type: 'choice', direction: 'write', required: true },
      { name: 'requestorDisplayName', displayName: 'Requestor', type: 'text', direction: 'write', required: true },
      { name: 'requestorEmail', displayName: 'Requestor Email', type: 'text', direction: 'write', required: true },
      { name: 'description', displayName: 'Description', type: 'text', direction: 'both', required: false },
      { name: 'currentStage', displayName: 'Current Stage', type: 'text', direction: 'both', required: false },
      { name: 'submittedOn', displayName: 'Submitted On', type: 'datetime', direction: 'write', required: false },
      { name: 'approverRemarks', displayName: 'Approver Remarks', type: 'text', direction: 'both', required: false },
    ],
    service: {
      name: 'STRSubmissionService',
      path: 'services/str-submission-service.ts',
      methods: ['getAll', 'get', 'create', 'update', 'submit', 'delete', 'approve', 'reject', 'return', 'getApprovalHistory'],
      hooks: ['useSTRSubmissions (via useQuery)'],
    },
    notes: 'Connected to SharePoint via MainDBSTRService. Uses generated service from data model.',
  },
  {
    id: 'str-gir',
    formCode: 'GIR',
    formName: 'Goods Issue Request',
    departmentCode: 'LOG',
    departmentName: 'Store Management',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_STR',
    tableDisplayName: 'Main STR Database',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-str',
    columns: [
      { name: 'id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'title', displayName: 'Title', type: 'text', direction: 'both', required: true },
      { name: 'formCode', displayName: 'Form Code', type: 'text', direction: 'write', required: true },
      { name: 'statusKey', displayName: 'Status', type: 'choice', direction: 'both', required: true },
      { name: 'itemCode', displayName: 'Item Code', type: 'text', direction: 'write', required: true },
      { name: 'quantity', displayName: 'Quantity', type: 'number', direction: 'write', required: true },
    ],
    service: {
      name: 'STRSubmissionService',
      path: 'services/str-submission-service.ts',
      methods: ['getAll', 'get', 'create', 'update'],
      hooks: ['useSTRSubmissions'],
    },
  },

  // ==========================================================================
  // ADM DEPARTMENT (Administration)
  // ==========================================================================
  {
    id: 'adm-room',
    formCode: 'ROOM',
    formName: 'Room Booking',
    departmentCode: 'ADM',
    departmentName: 'Administration',
    sourceType: 'in-memory',
    connectionStatus: 'pending',
    tableName: 'MainDB_ADM',
    tableDisplayName: 'Main ADM Database',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-adm',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'Title', displayName: 'Booking Reference', type: 'text', direction: 'both', required: true },
      { name: 'RoomId', displayName: 'Room', type: 'lookup', direction: 'write', required: true, lookupTarget: 'Rooms' },
      { name: 'BookingDate', displayName: 'Booking Date', type: 'date', direction: 'write', required: true },
      { name: 'StartTime', displayName: 'Start Time', type: 'datetime', direction: 'write', required: true },
      { name: 'EndTime', displayName: 'End Time', type: 'datetime', direction: 'write', required: true },
      { name: 'Purpose', displayName: 'Purpose', type: 'text', direction: 'write', required: true },
      { name: 'Attendees', displayName: 'Attendees', type: 'number', direction: 'write', required: true },
    ],
    service: {
      name: 'ADMSubmissionService',
      path: 'services/adm-submission-service.ts',
      methods: ['create', 'update', 'get', 'getAll', 'checkAvailability'],
      hooks: ['useADMSubmissions'],
    },
    notes: 'SharePoint connection pending. Currently using mock data.',
  },
  {
    id: 'adm-transport',
    formCode: 'TRANS',
    formName: 'Transport Request',
    departmentCode: 'ADM',
    departmentName: 'Administration',
    sourceType: 'in-memory',
    connectionStatus: 'pending',
    tableName: 'MainDB_ADM',
    tableDisplayName: 'Main ADM Database',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-adm',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'Title', displayName: 'Request Reference', type: 'text', direction: 'both', required: true },
      { name: 'TripType', displayName: 'Trip Type', type: 'choice', direction: 'write', required: true },
      { name: 'Destination', displayName: 'Destination', type: 'text', direction: 'write', required: true },
      { name: 'TravelDate', displayName: 'Travel Date', type: 'date', direction: 'write', required: true },
      { name: 'Passengers', displayName: 'Passengers', type: 'number', direction: 'write', required: true },
    ],
    service: {
      name: 'ADMSubmissionService',
      path: 'services/adm-submission-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useADMSubmissions'],
    },
  },

  // ==========================================================================
  // QA DEPARTMENT (Quality Assurance)
  // ==========================================================================
  {
    id: 'qa-icar',
    formCode: 'ICAR',
    formName: 'Internal Corrective Action Report',
    departmentCode: 'QA',
    departmentName: 'Quality Assurance',
    sourceType: 'in-memory',
    connectionStatus: 'mock',
    tableName: 'MainDB_QA',
    tableDisplayName: 'Main QA Database',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-qa',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'Title', displayName: 'ICAR Number', type: 'text', direction: 'both', required: true },
      { name: 'NCType', displayName: 'Non-Conformance Type', type: 'choice', direction: 'write', required: true },
      { name: 'Description', displayName: 'Description', type: 'text', direction: 'write', required: true },
      { name: 'RootCause', displayName: 'Root Cause', type: 'text', direction: 'both', required: false },
      { name: 'CorrectiveAction', displayName: 'Corrective Action', type: 'text', direction: 'both', required: false },
      { name: 'TargetDate', displayName: 'Target Date', type: 'date', direction: 'write', required: true },
    ],
    service: {
      name: 'QASubmissionService',
      path: 'services/qa-submission-service.ts',
      methods: ['create', 'update', 'get', 'getAll', 'closeCAR'],
      hooks: ['useQASubmissions'],
    },
  },
  {
    id: 'qa-sop',
    formCode: 'SOP',
    formName: 'Standard Operating Procedure',
    departmentCode: 'QA',
    departmentName: 'Quality Assurance',
    sourceType: 'in-memory',
    connectionStatus: 'mock',
    tableName: 'MainDB_QA',
    tableDisplayName: 'Main QA Database',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-qa',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'Title', displayName: 'SOP Number', type: 'text', direction: 'both', required: true },
      { name: 'SOPTitle', displayName: 'SOP Title', type: 'text', direction: 'write', required: true },
      { name: 'Version', displayName: 'Version', type: 'text', direction: 'both', required: true },
      { name: 'EffectiveDate', displayName: 'Effective Date', type: 'date', direction: 'write', required: true },
      { name: 'Document', displayName: 'Document', type: 'attachment', direction: 'write', required: true },
    ],
    service: {
      name: 'QASubmissionService',
      path: 'services/qa-submission-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useQASubmissions'],
    },
  },

  // ==========================================================================
  // FIN DEPARTMENT (Finance)
  // ==========================================================================
  {
    id: 'fin-car',
    formCode: 'CAR',
    formName: 'Capital Appropriation Request',
    departmentCode: 'FIN',
    departmentName: 'Finance',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_FIN',
    tableDisplayName: 'Main FIN Database',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-fin',
    columns: [
      { name: 'title', displayName: 'Title', type: 'text', direction: 'both', required: true },
      { name: 'formCode', displayName: 'Form Code', type: 'text', direction: 'write', required: true },
      { name: 'departmentKey', displayName: 'Department', type: 'choice', direction: 'write', required: true },
      { name: 'statusKey', displayName: 'Status', type: 'choice', direction: 'both', required: true },
      { name: 'siteKey', displayName: 'Site', type: 'choice', direction: 'write', required: true },
      { name: 'submittedOn', displayName: 'Submitted On', type: 'datetime', direction: 'write', required: false },
      { name: 'requestorEmail', displayName: 'Requestor Email', type: 'text', direction: 'write', required: true },
    ],
    service: {
      name: 'MainDBFINService',
      path: 'generated/services/main-dbfin-service.ts',
      methods: ['create', 'update', 'get', 'getAll', 'delete'],
      hooks: ['useMainDBFINList', 'useMainDBFIN', 'useCreateMainDBFIN', 'useUpdateMainDBFIN'],
    },
    notes: 'Connected to SharePoint via generated MainDBFINService.',
  },
  {
    id: 'fin-earf',
    formCode: 'EARF',
    formName: 'Expense Approval Request Form',
    departmentCode: 'FIN',
    departmentName: 'Finance',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_FIN',
    tableDisplayName: 'Main FIN Database',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-fin',
    columns: [
      { name: 'title', displayName: 'Title', type: 'text', direction: 'both', required: true },
      { name: 'formCode', displayName: 'Form Code', type: 'text', direction: 'write', required: true },
      { name: 'statusKey', displayName: 'Status', type: 'choice', direction: 'both', required: true },
    ],
    service: {
      name: 'MainDBFINService',
      path: 'generated/services/main-dbfin-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBFINList', 'useCreateMainDBFIN'],
    },
    notes: 'Connected to SharePoint via generated MainDBFINService.',
  },
  {
    id: 'fin-tclaim',
    formCode: 'TClaim',
    formName: 'Travel Claim Form',
    departmentCode: 'FIN',
    departmentName: 'Finance',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_FIN',
    tableDisplayName: 'Main FIN Database',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-fin',
    columns: [
      { name: 'title', displayName: 'Title', type: 'text', direction: 'both', required: true },
      { name: 'formCode', displayName: 'Form Code', type: 'text', direction: 'write', required: true },
      { name: 'statusKey', displayName: 'Status', type: 'choice', direction: 'both', required: true },
    ],
    service: {
      name: 'MainDBFINService',
      path: 'generated/services/main-dbfin-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBFINList', 'useCreateMainDBFIN'],
    },
    notes: 'Connected to SharePoint via generated MainDBFINService.',
  },
  {
    id: 'fin-monthclose',
    formCode: 'MonthClose',
    formName: 'Month-End Checklist',
    departmentCode: 'FIN',
    departmentName: 'Finance',
    sourceType: 'sharepoint',
    connectionStatus: 'connected',
    tableName: 'MainDB_FIN',
    tableDisplayName: 'Main FIN Database',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-fin',
    columns: [
      { name: 'title', displayName: 'Title', type: 'text', direction: 'both', required: true },
      { name: 'formCode', displayName: 'Form Code', type: 'text', direction: 'write', required: true },
      { name: 'statusKey', displayName: 'Status', type: 'choice', direction: 'both', required: true },
    ],
    service: {
      name: 'MainDBFINService',
      path: 'generated/services/main-dbfin-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBFINList', 'useCreateMainDBFIN'],
    },
    notes: 'Connected to SharePoint via generated MainDBFINService.',
  },

  // ==========================================================================
  // LOG DEPARTMENT (Logistics)
  // ==========================================================================
  {
    id: 'log-csd',
    formCode: 'CSD',
    formName: 'Container Shipment Database',
    departmentCode: 'LOG',
    departmentName: 'Logistics',
    sourceType: 'in-memory',
    connectionStatus: 'mock',
    tableName: 'MainDB_LOG',
    tableDisplayName: 'Main LOG Database',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-log',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'ShipmentNo', displayName: 'Shipment Number', type: 'text', direction: 'both', required: true },
      { name: 'ContainerNo', displayName: 'Container Number', type: 'text', direction: 'write', required: true },
      { name: 'ShipDate', displayName: 'Ship Date', type: 'date', direction: 'write', required: true },
      { name: 'ArrivalDate', displayName: 'Arrival Date', type: 'date', direction: 'both', required: false },
      { name: 'ContainerDetails', displayName: 'Container Table (50 rows)', type: 'json', direction: 'both', required: false, description: 'Repeating table for container details' },
    ],
    service: {
      name: 'LOGSubmissionService',
      path: 'pages/log/forms (inline)',
      methods: ['create', 'update'],
      hooks: ['useState (local)'],
    },
    notes: 'Form 01 per LOG schema. 50-row container table for details.',
  },
  {
    id: 'log-ti',
    formCode: 'TI',
    formName: 'Tanker Inspection',
    departmentCode: 'STR',
    departmentName: 'Logistics',
    sourceType: 'in-memory',
    connectionStatus: 'mock',
    tableName: 'MainDB_LOG',
    tableDisplayName: 'Main LOG Database',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-log',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'TankerNo', displayName: 'Tanker Number', type: 'text', direction: 'write', required: true },
      { name: 'InspectionDate', displayName: 'Inspection Date', type: 'date', direction: 'write', required: true },
      { name: 'Inspector', displayName: 'Inspector', type: 'person', direction: 'write', required: true },
      { name: 'ChecklistItems', displayName: 'Checklist (JSON)', type: 'json', direction: 'both', required: true },
      { name: 'QCApproval', displayName: 'QC Approval', type: 'boolean', direction: 'both', required: false },
    ],
    service: {
      name: 'LOGSubmissionService',
      path: 'pages/log/forms (inline)',
      methods: ['create', 'update'],
      hooks: ['useState (local)'],
    },
    notes: 'Form 02 per LOG schema. QC Approval section at end.',
  },
  {
    id: 'log-pod',
    formCode: 'POD',
    formName: 'Product Over/Short Delivery',
    departmentCode: 'STR',
    departmentName: 'Logistics',
    sourceType: 'in-memory',
    connectionStatus: 'mock',
    tableName: 'MainDB_LOG',
    tableDisplayName: 'Main LOG Database',
    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-log',
    columns: [
      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },
      { name: 'DeliveryNo', displayName: 'Delivery Number', type: 'text', direction: 'write', required: true },
      { name: 'ExpectedWeight', displayName: 'Expected Weight', type: 'number', direction: 'write', required: true },
      { name: 'ActualWeight', displayName: 'Actual Weight', type: 'number', direction: 'write', required: true },
      { name: 'Variance', displayName: 'Variance (Computed)', type: 'number', direction: 'read', required: true, description: 'CM: ActualWeight - ExpectedWeight' },
    ],
    service: {
      name: 'LOGSubmissionService',
      path: 'pages/log/forms (inline)',
      methods: ['create', 'update'],
      hooks: ['useState (local)'],
    },
    notes: 'Form 10 per LOG schema. Variance is computed field.',
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getDataSourcesByDepartment(departmentCode: DepartmentCode): DataSourceMapping[] {
  return DATA_SOURCE_MAPPINGS.filter(m => m.departmentCode === departmentCode);
}

export function getDataSourceByFormCode(formCode: string): DataSourceMapping | undefined {
  return DATA_SOURCE_MAPPINGS.find(m => m.formCode === formCode);
}

export function getDepartmentSummaries(): DepartmentDataSummary[] {
  const departments = new Map<DepartmentCode, DepartmentDataSummary>();

  for (const mapping of DATA_SOURCE_MAPPINGS) {
    let summary = departments.get(mapping.departmentCode);

    if (!summary) {
      summary = {
        departmentCode: mapping.departmentCode,
        departmentName: mapping.departmentName,
        totalForms: 0,
        connectedForms: 0,
        mockForms: 0,
        tables: [],
        services: [],
      };
      departments.set(mapping.departmentCode, summary);
    }

    summary.totalForms++;

    if (mapping.connectionStatus === 'connected') {
      summary.connectedForms++;
    } else {
      summary.mockForms++;
    }

    if (!summary.tables.includes(mapping.tableName)) {
      summary.tables.push(mapping.tableName);
    }

    if (!summary.services.includes(mapping.service.name)) {
      summary.services.push(mapping.service.name);
    }
  }

  return Array.from(departments.values());
}

export function getConnectionStatusColor(status: ConnectionStatus): string {
  switch (status) {
    case 'connected': return 'text-green-600 dark:text-green-400';
    case 'pending': return 'text-amber-600 dark:text-amber-400';
    case 'mock': return 'text-blue-600 dark:text-blue-400';
    case 'error': return 'text-red-600 dark:text-red-400';
  }
}

export function getConnectionStatusBadgeVariant(status: ConnectionStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'connected': return 'default';
    case 'pending': return 'outline';
    case 'mock': return 'secondary';
    case 'error': return 'destructive';
  }
}

