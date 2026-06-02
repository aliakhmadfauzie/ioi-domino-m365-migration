// =============================================================================
// IOI IT DEPARTMENT FORMS CONFIGURATION
// Modules M1 (User & Access Management) and M2 (IT Support & Service Requests)
// =============================================================================

import type { LucideIcon } from 'lucide-react';
import { ITSSR_DEPARTMENTS } from '@/types/m2-itssr-types';
import { getAssignedPIC } from '@/lib/rs-pic-routing';
import {
  Key,
  Mail,
  Shield,
  FolderLock,
  UserPlus,
  Server,
  Database,
  Calendar,
  HardDrive,
  RotateCcw,
  ClipboardList,
  ListTodo,
  Headset,
  FileCode,
  Settings,
  FileText,
  GitBranch,
  CheckSquare,
  Warehouse,
  FolderCog,
  Upload,
  BookOpen,
  Megaphone,
} from 'lucide-react';

// =============================================================================
// SHARED OPTIONS
// =============================================================================

export const IOI_DEPARTMENT_OPTIONS: { value: string; label: string }[] =
  ITSSR_DEPARTMENTS.map((d) => ({ value: d, label: d }));

export const IOI_SYSTEM_OPTIONS: { value: string; label: string }[] = [
  { value: 'SAP', label: 'SAP' },
  { value: 'Lotus Notes', label: 'Lotus Notes / HCL Notes' },
  { value: 'Active Directory', label: 'Active Directory' },
  { value: 'Sales Portal', label: 'Sales Portal' },
  { value: 'Esker', label: 'Esker' },
  { value: 'Bank System', label: 'Bank System' },
  { value: 'SharePoint', label: 'SharePoint' },
  { value: 'Other', label: 'Other' },
];

export const IOI_COMPANY_OPTIONS: { value: string; label: string }[] = [
  { value: 'IOI Corporation Berhad', label: 'IOI Corporation Berhad' },
  { value: 'IOI Oleochemical Industries Berhad', label: 'IOI Oleochemical Industries Berhad' },
  { value: 'IOI Acidchem Sdn Bhd', label: 'IOI Acidchem Sdn Bhd' },
  { value: 'IOI Pan-Century Oleochemicals Sdn Bhd', label: 'IOI Pan-Century Oleochemicals Sdn Bhd' },
  { value: 'IOI Pan-Century Edible Oils Sdn Bhd', label: 'IOI Pan-Century Edible Oils Sdn Bhd' },
  { value: 'Loders Croklaan Asia Pacific Sdn Bhd', label: 'Loders Croklaan Asia Pacific Sdn Bhd' },
  { value: 'IOI Bio-Energy Sdn Bhd', label: 'IOI Bio-Energy Sdn Bhd' },
  { value: 'Bunge Loders Croklaan', label: 'Bunge Loders Croklaan' },
  { value: 'IOI Edible Oils Sdn Bhd', label: 'IOI Edible Oils Sdn Bhd' },
  { value: 'Pan-Century Surfactants Sdn Bhd', label: 'Pan-Century Surfactants Sdn Bhd' },
];

// =============================================================================
// TYPES
// =============================================================================

export type WorkflowStageKey = string;

export interface WorkflowStage {
  key: WorkflowStageKey;
  name: string;
  order: number;
  actor: string;
  description: string;
  isConditional?: boolean;
  conditionField?: string;
  conditionValue?: string;
}

/** User-context properties that can be auto-filled from the authenticated user. */
export type AutoFillSource =
  | 'user.fullName'       // user.fullName from useUser()
  | 'user.email'          // user.userPrincipalName from useUser()
  | 'user.department';    // department from user profile (if available)

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'date' | 'number' | 'file' | 'people';
  /** For 'people' type: allow multiple selection */
  multipleSelection?: boolean;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  /**
   * Auto-fills this field from the current authenticated user's context.
   * The field is rendered as read-only when auto-filled.
   */
  autoFill?: AutoFillSource;
}

export interface ConditionalFieldConfig {
  field: string;
  value: string;
  /** Multiple values that can trigger the condition (OR logic) */
  values?: string[];
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  visibleAtStages: WorkflowStageKey[];
  isStageGated: boolean;
  requiredFields?: string[];
  conditionalField?: ConditionalFieldConfig;
  fields?: FormField[];
}

export interface ITFormConfig {
  code: string;
  name: string;
  module: 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M7';
  moduleName: string;
  icon: LucideIcon;
  color: string;
  description: string;
  database: string;
  stages: WorkflowStage[];
  sections: FormSection[];
  hasConditionalSections: boolean;
  conditionalSectionDescription?: string;
  hideApprovalChain?: boolean;
  /**
   * Optional transform function called before form submission.
   * Receives the raw form data and the current user, returns additional
   * fields to merge into the MainDB_IT create payload.
   * Used to populate discrete SharePoint columns (e.g. PIC email) at submission time.
   */
  submitTransform?: (formData: Record<string, string | boolean>, user?: { userPrincipalName?: string; fullName?: string }) => Record<string, unknown>;
  /** Optional extension list to create after the MainDB_IT parent row is created. */
  extensionTable?: 'access' | 'assets' | 'docs' | 'infra' | 'policy' | 'sap' | 'support';
  /** Returns model-backed fields for the configured extension list. */
  extensionTransform?: (formData: Record<string, string | boolean>, user?: { userPrincipalName?: string; fullName?: string }) => Record<string, unknown>;
}

const fieldValue = (formData: Record<string, string | boolean>, key: string) =>
  String(formData[key] || '').trim();

const fieldNumber = (formData: Record<string, string | boolean>, key: string) => {
  const parsed = Number(formData[key]);
  return Number.isFinite(parsed) ? parsed : undefined;
};

// =============================================================================
// MODULE 1: USER & ACCESS MANAGEMENT (5 Forms)
// =============================================================================

export const EAF: ITFormConfig = {
  code: 'EAF',
  name: 'VPN ACCESS REQUEST',
  module: 'M1',
  moduleName: 'User & Access Management',
  icon: Key,
  color: '#4f46e5',
  description: 'External Access Form - Request VPN or Citrix access for remote work',
  database: 'MainDB_IT (PRAI)',
  // Resolve and store computed fields at submission time
  submitTransform: (formData, user) => {
    const company = String(formData['Company'] || '').toUpperCase();
    const isPancen = company.includes('PCEO') || company.includes('PCOC') || company.includes('PAN-CENTURY');
    return {
      eAFIsPCN: isPancen ? '1' : '0',
      eAFTargetUserEmail: user?.userPrincipalName || '',
    };
  },
  stages: [
    { key: 'S1', name: 'Submission', order: 1, actor: 'Requester', description: 'Initial form submission' },
    { key: 'S2', name: 'Dept Head Approval', order: 2, actor: 'Department Head', description: 'Department head reviews and approves' },
    { key: 'S3', name: 'Division Director', order: 3, actor: 'Division Director', description: 'Division director sign-off' },
    { key: 'S4', name: 'IT Manager', order: 4, actor: 'IT Manager', description: 'IT Manager reviews and authorises' },
    { key: 'S5', name: 'IT Provisioning', order: 5, actor: 'IT PIC', description: 'IT team configures and provisions access' },
  ],
  sections: [
    {
      id: 'form-header',
      title: 'EXTERNAL ACCESS FORM (VPN & Citrix)',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5'],
      isStageGated: false,
      fields: [],
    },
    {
      id: 'requester-section',
      title: "REQUESTOR'S SECTION",
      visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5'],
      isStageGated: false,
      fields: [
        { id: 'Company', label: 'Company', type: 'select', required: true, options: [
          { value: 'IOI Corporation Berhad', label: 'IOI Corporation Berhad' },
          { value: 'IOI Oleochemical Industries Berhad', label: 'IOI Oleochemical Industries Berhad' },
          { value: 'IOI Acidchem Sdn Bhd', label: 'IOI Acidchem Sdn Bhd' },
          { value: 'IOI Pan-Century Oleochemicals Sdn Bhd', label: 'IOI Pan-Century Oleochemicals Sdn Bhd' },
          { value: 'IOI Pan-Century Edible Oils Sdn Bhd', label: 'IOI Pan-Century Edible Oils Sdn Bhd' },
          { value: 'Loders Croklaan Asia Pacific Sdn Bhd', label: 'Loders Croklaan Asia Pacific Sdn Bhd' },
          { value: 'IOI Bio-Energy Sdn Bhd', label: 'IOI Bio-Energy Sdn Bhd' },
          { value: 'Bunge Loders Croklaan', label: 'Bunge Loders Croklaan' },
          { value: 'IOI Edible Oils Sdn Bhd', label: 'IOI Edible Oils Sdn Bhd' },
          { value: 'Pan-Century Surfactants Sdn Bhd', label: 'Pan-Century Surfactants Sdn Bhd' },
          { value: 'Contractor', label: 'Contractor' },
          { value: 'Vendor', label: 'Vendor/Third Party' },
          { value: 'Other', label: 'Other' },
        ]},
        { id: 'req', label: 'Requestor', type: 'people', required: true },
        { id: 'date1', label: 'Submitted on', type: 'date', disabled: true },
        { id: 'UserID', label: 'User ID (Domain\\UserID)', type: 'text', required: true, placeholder: 'e.g., IOIOLEO\\John.Smith', helperText: 'Windows domain login ID of the user who needs access' },
        { id: 'User', label: 'User Name', type: 'people', required: true, helperText: 'Select or search for the user who needs access' },
        { id: 'system', label: 'System', type: 'select', required: true, options: [
          { value: 'Active Directory', label: 'Active Directory' },
          { value: 'Azure AD', label: 'Azure AD' },
          { value: 'Database Server', label: 'Database Server' },
          { value: 'File Server', label: 'File Server' },
          { value: 'Microsoft 365', label: 'Microsoft 365' },
          { value: 'Notes/Domino', label: 'Notes/Domino' },
          { value: 'Power BI', label: 'Power BI' },
          { value: 'SAP ECC', label: 'SAP ECC' },
          { value: 'SAP HANA', label: 'SAP HANA' },
          { value: 'SAP S4/HANA', label: 'SAP S4/HANA' },
          { value: 'SharePoint Online', label: 'SharePoint Online' },
          { value: 'Web Application', label: 'Web Application' },
          { value: 'Other', label: 'Other' },
        ]},
        { id: 'App', label: 'Application', type: 'select', required: true, options: [
          { value: 'VPN', label: 'VPN' },
          { value: 'Citrix', label: 'Citrix - https://xenapp.ioioleo.com/' },
          { value: 'Both', label: 'Both VPN & Citrix' },
        ]},
        { id: 'justification', label: 'Justification', type: 'textarea', required: true },
        { id: 'depthead', label: 'Head of Dept (HOD)', type: 'people', required: true, helperText: 'Select department head who will approve this request' },
        { id: 'CC', label: 'CC', type: 'people', multipleSelection: true },
      ],
    },
    {
      id: 'dept-head-approval',
      title: 'ACCEPTANCE OF DEPARTMENT HEAD',
      visibleAtStages: ['S2', 'S3', 'S4', 'S5'],
      isStageGated: true,
      fields: [
        { id: 'status1', label: 'Status', type: 'select', required: true, options: [
          { value: 'Approved', label: 'Approved' },
          { value: 'Rejected', label: 'Rejected' },
        ]},
        { id: 'HODNAME', label: 'Accepted by', type: 'text', disabled: true },
        { id: 'date2', label: 'Accepted Date', type: 'date', disabled: true },
        { id: 'comment1', label: 'Comment', type: 'textarea' },
      ],
    },
    {
      id: 'division-approval',
      title: 'ACCEPTANCE OF DIVISION DIRECTOR / COO',
      description: 'Visible only for PanCen companies (PCEO/PCOC/Pan-Century) or when Higher Approver is specified',
      visibleAtStages: ['S3', 'S4', 'S5'],
      isStageGated: true,
      conditionalField: { field: 'Company', value: '', values: ['IOI Pan-Century Oleochemicals Sdn Bhd', 'IOI Pan-Century Edible Oils Sdn Bhd', 'Pan-Century Surfactants Sdn Bhd'] },
      fields: [
        { id: 'DDApp', label: 'DD Application', type: 'text' },
        { id: 'status2', label: 'Status', type: 'select', required: true, options: [
          { value: 'Approved', label: 'Approved' },
          { value: 'Rejected', label: 'Rejected' },
        ]},
        { id: 'DIVNAME', label: 'Accepted by', type: 'text', disabled: true },
        { id: 'date3', label: 'Accepted Date', type: 'date', disabled: true },
        { id: 'comment2', label: 'Comment', type: 'textarea' },
      ],
    },
    {
      id: 'it-manager-approval',
      title: 'ACCEPTANCE OF IT MANAGER',
      visibleAtStages: ['S4', 'S5'],
      isStageGated: true,
      fields: [
        { id: 'status3', label: 'Status', type: 'select', required: true, options: [
          { value: 'Accepted', label: 'Accepted' },
          { value: 'Rejected', label: 'Rejected' },
        ]},
        { id: 'name4', label: 'Accepted by', type: 'text', disabled: true },
        { id: 'date4', label: 'Accepted Date', type: 'date', disabled: true },
        { id: 'comment3', label: 'Comment', type: 'textarea' },
      ],
    },
    {
      id: 'it-provisioning',
      title: 'ACCEPTANCE OF IT',
      visibleAtStages: ['S5'],
      isStageGated: true,
      fields: [
        { id: 'status4', label: 'Status', type: 'select', required: true, options: [
          { value: 'Completed', label: 'Completed' },
          { value: 'Rejected', label: 'Rejected' },
        ]},
        { id: 'name5', label: 'Completed by', type: 'text', disabled: true },
        { id: 'date5', label: 'Date Sent', type: 'date', disabled: true },
        { id: 'comment4', label: 'Remarks', type: 'textarea' },
      ],
    },
    {
      id: 'for-it-use',
      title: 'For IT Use (Attachment & Admin)',
      visibleAtStages: ['S5'],
      isStageGated: true,
      fields: [
        { id: 'att', label: 'Attachment', type: 'text' },
        { id: 'remarks', label: 'Remarks (Admin)', type: 'textarea' },
        { id: 'Status', label: 'Status (Admin)', type: 'select', options: [
          { value: 'ACTIVE', label: 'ACTIVE' },
          { value: 'INACTIVE', label: 'INACTIVE' },
        ]},
      ],
    },
  ],
  hasConditionalSections: true,
  conditionalSectionDescription: 'Stage-gated approval sections per tier — S2 HOD, S3 Dir/COO, S4 IT Mgr, S5 IT Provisioning + Admin',
};

export const NIR: ITFormConfig = {
  code: 'NIR',
  name: 'Notes ID Request',
  module: 'M1',
  moduleName: 'User & Access Management',
  icon: Mail,
  color: '#0ea5e9',
  database: 'MainDB_IT (PRAI)',
  description: 'Request a new IBM Notes/Lotus Notes user ID',
  stages: [
    { key: 'S1', name: 'Request', order: 1, actor: 'Requester', description: 'Submit Notes ID request' },
    { key: 'S2', name: 'HOD Approval', order: 2, actor: 'Head of Department', description: 'HOD approves request' },
    { key: 'S3', name: 'Notes Admin', order: 3, actor: 'Notes Administrator', description: 'Notes admin creates ID' },
    { key: 'S4', name: 'IT Hardware', order: 4, actor: 'IT Hardware Team', description: 'Hardware setup and delivery' },
  ],
  sections: [
    {
      id: 'employee-info',
      title: 'Employee Information',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4'],
      isStageGated: false,
      fields: [
        { id: 'EmailType', label: 'Request Type', type: 'select', required: true, options: [
          { value: 'New Email', label: 'New Email' },
          { value: 'Replacement', label: 'Replacement' },
          { value: 'Rename', label: 'Rename' },
          { value: 'Delete', label: 'Delete' },
        ]},
        { id: 'Company', label: 'Company', type: 'select', required: true, options: IOI_COMPANY_OPTIONS },
        { id: 'ExistingEmailAddress', label: 'Existing Email Address', type: 'email', helperText: 'Required for Replacement' },
        { id: 'FullName', label: 'Full Name', type: 'text', required: true },
        { id: 'EmployeeNumber', label: 'Employee Number', type: 'text', required: true },
        { id: 'Department', label: 'Department', type: 'select', required: true, options: IOI_DEPARTMENT_OPTIONS },
        { id: 'Executive', label: 'Executive (Head of Division)', type: 'people', helperText: 'Select if HOD is not available or for executive-level requests' },
        { id: 'Designation', label: 'Designation / Job Title', type: 'text' },
        { id: 'PhoneExtension', label: 'Phone Extension', type: 'text' },
        { id: 'HODApprover', label: 'HOD Approver', type: 'people', required: true },
        { id: 'Remarks', label: 'Remarks', type: 'textarea' },
      ],
    },
    { id: 'hod-approval', title: 'HOD Approval', visibleAtStages: ['S2', 'S3', 'S4'], isStageGated: true },
    { id: 'notes-admin', title: 'Notes Admin Action', visibleAtStages: ['S3', 'S4'], isStageGated: true },
    { id: 'hardware-setup', title: 'Hardware Setup', visibleAtStages: ['S4'], isStageGated: true },
  ],
  hasConditionalSections: true,
  conditionalSectionDescription: 'Stage-gated actor sections',
  hideApprovalChain: true,
};

export const RS: ITFormConfig = {
  code: 'RS',
  name: 'Reset Password / Unlock ID',
  module: 'M1',
  moduleName: 'User & Access Management',
  icon: Shield,
  database: 'MainDB_IT (PRAI)',
  color: '#f59e0b',
  description: 'Request password reset or unlock user account - Routes directly to IT PIC based on Application Type and Location',
  stages: [
    // RS form flows DIRECTLY to IT PIC (no manager approval required)
    { key: 'S1', name: 'Submission', order: 1, actor: 'Requester', description: 'Submit reset request' },
    { key: 'S2', name: 'IT Processing', order: 2, actor: 'IT PIC', description: 'IT PIC processes the reset based on Application Type' },
    { key: 'S3', name: 'ED Approval', order: 3, actor: 'Executive Director', description: 'ED approval for bank systems', isConditional: true, conditionField: 'RS_Bank', conditionValue: 'filled' },
    { key: 'S4', name: 'Closed', order: 4, actor: 'System', description: 'Request completed' },
  ],
  sections: [
    {
      id: 'user-info',
      title: 'User Information',
      description: 'Enter the details of the user who needs password reset or ID unlock',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4'],
      isStageGated: false,
      fields: [
        // Name field allows manual entry (not just people picker)
        { id: 'UserName', label: 'Name', type: 'text', required: true, placeholder: 'Enter full name of user requiring reset' },
        { id: 'Designation', label: 'Designation', type: 'text', helperText: 'Job title/position of the user' },
        { id: 'Company', label: 'Company', type: 'select', required: true, placeholder: 'Select company', options: IOI_COMPANY_OPTIONS },
        { id: 'ExtensionNumber', label: 'Extension Number', type: 'text', placeholder: 'e.g., 1234' },
        { id: 'Department', label: 'Department', type: 'select', required: true, placeholder: 'Select department', options: IOI_DEPARTMENT_OPTIONS },
      ],
    },
    {
      id: 'reset-details',
      title: 'Reset Details',
      description: 'Specify the application and type of reset required',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4'],
      isStageGated: false,
      fields: [
        // Site Location - determines PIC routing
        { id: 'Location', label: 'Site Location', type: 'select', required: true, helperText: 'Required for PIC routing', options: [
          { value: 'PENANG', label: 'Penang (PRAI)' },
          { value: 'JOHOR', label: 'Johor (JHR)' },
        ]},
        // Application Type dropdown - BEFORE Reset Type per plan
        // Will be replaced with SharePoint IT_M1_RS_SystemsList lookup via useSharePointSystems hook
        { id: 'ApplicationType', label: 'Application Type', type: 'select', required: true, helperText: 'Select the application - determines which IT PIC handles your request', options: [
          { value: 'WHAT 8', label: 'WHAT 8' },
          { value: 'SALES PORTAL', label: 'Sales Portal' },
          { value: 'HCL NOTES', label: 'HCL Notes' },
          { value: 'BANK', label: 'Bank' },
          { value: 'ESKER', label: 'Esker' },
          { value: 'WEIGHBRIDGE', label: 'Weighbridge' },
          { value: 'DOMAIN ID', label: 'Domain ID' },
          { value: 'DOMAIN PC', label: 'Domain PC' },
          { value: 'VPN', label: 'VPN' },
          { value: 'SAP S4/HANA', label: 'SAP S4/HANA' },
          { value: 'SOLMAN', label: 'SOLMAN' },
          { value: 'IEP', label: 'IEP (Live System)' },
          { value: 'NAVISION 2018', label: 'Navision 2018' },
        ]},
        // Reset Type dropdown - aligned with Domino model (boolean REQ_Unlock checkbox)
        // Reset Password is the default action; Unlock ID is a separate selection
        { id: 'ResetType', label: 'Reset Type', type: 'select', required: true, options: [
          { value: 'RESET_PASSWORD', label: 'Reset Password' },
          { value: 'UNLOCK_ID', label: 'Unlock ID' },
        ]},
        // System Login ID
        { id: 'SystemLoginId', label: 'System Login ID', type: 'text', required: true, helperText: 'Your login ID for the selected system' },
        // Renamed from Justification to Reason for Reset per plan
        { id: 'ReasonForReset', label: 'Reason for Reset', type: 'textarea', required: true, placeholder: 'Explain why password reset or ID unlock is needed' },
      ],
    },
    // SAP Client section - conditional on SAP S4/HANA
    {
      id: 'sap-details',
      title: 'SAP Details',
      description: 'Required when Application Type is SAP S4/HANA',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4'],
      isStageGated: false,
      conditionalField: { field: 'ApplicationType', value: 'SAP S4/HANA' },
      fields: [
        // SAP Client dropdown - will be replaced with SharePoint IT_M1_RS_SAP_Client lookup via useSharePointSAPClients hook
        { id: 'SAPClient', label: 'SAP Client', type: 'select', required: true, options: [
          { value: 'IEP', label: 'IEP - Production' },
          { value: 'IEQ', label: 'IEQ - Quality' },
          { value: 'IED', label: 'IED - Development' },
        ]},
      ],
    },
    // IEP Client Name section - conditional on IEP (Live System)
    {
      id: 'iep-details',
      title: 'IEP Details',
      description: 'Required when Application Type is IEP (Live System)',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4'],
      isStageGated: false,
      conditionalField: { field: 'ApplicationType', value: 'IEP' },
      fields: [
        { id: 'IEPClientName', label: 'Client Name', type: 'text', required: true, helperText: 'Specify the IEP client name' },
      ],
    },
    // Bank System section - conditional on BANK selection
    {
      id: 'bank-system',
      title: 'Bank System Details',
      description: 'Required when Application Type is Bank',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4'],
      isStageGated: false,
      conditionalField: { field: 'ApplicationType', value: 'BANK' },
      fields: [
        // Bank dropdown - will be replaced with SharePoint IT_M1_RS_Banks lookup via useSharePointBanks hook
        { id: 'RS_Bank', label: 'Bank', type: 'select', required: true, options: [
          { value: 'CIMB', label: 'CIMB' },
          { value: 'MAYBANK', label: 'Maybank' },
          { value: 'PUBLIC', label: 'Public Bank' },
          { value: 'HSBC', label: 'HSBC' },
          { value: 'UOB', label: 'UOB' },
          { value: 'OCBC', label: 'OCBC' },
          { value: 'RHB', label: 'RHB' },
          { value: 'AMBANK', label: 'AmBank' },
          { value: 'HONGLEONG', label: 'Hong Leong Bank' },
          { value: 'STANDARD CHARTERED', label: 'Standard Chartered' },
        ]},
        { id: 'BankTokenSerial', label: 'Token Serial Number', type: 'text', helperText: 'If token reset required' },
        { id: 'ExecutiveDirector', label: 'Executive Director (for approval)', type: 'people', required: true, helperText: 'Bank system resets require ED approval' },
      ],
    },
    // IT Processing section - stage gated for IT PIC
    {
      id: 'it-processing',
      title: 'IT Processing',
      visibleAtStages: ['S2', 'S3', 'S4'],
      isStageGated: true,
      fields: [
        { id: 'ITStatus', label: 'Status', type: 'select', required: true, options: [
          { value: 'COMPLETED', label: 'Completed' },
          { value: 'PENDING', label: 'Pending' },
          { value: 'REJECTED', label: 'Rejected' },
        ]},
        { id: 'ITRemarks', label: 'IT Remarks', type: 'textarea' },
        { id: 'ProcessedBy', label: 'Processed By', type: 'text', disabled: true },
        { id: 'ProcessedDate', label: 'Processed Date', type: 'date', disabled: true },
      ],
    },
    // ED Approval section - stage gated, only for Bank systems
    {
      id: 'ed-approval',
      title: 'Executive Director Approval',
      description: 'Required for Bank system resets',
      visibleAtStages: ['S3', 'S4'],
      isStageGated: true,
      fields: [
        { id: 'EDStatus', label: 'Status', type: 'select', required: true, options: [
          { value: 'APPROVED', label: 'Approved' },
          { value: 'REJECTED', label: 'Rejected' },
        ]},
        { id: 'EDRemarks', label: 'ED Remarks', type: 'textarea' },
        { id: 'ApprovedBy', label: 'Approved By', type: 'text', disabled: true },
        { id: 'ApprovedDate', label: 'Approved Date', type: 'date', disabled: true },
      ],
    },
  ],
  hasConditionalSections: true,
  conditionalSectionDescription: 'SAP Details visible when SAP S4/HANA selected, IEP Details when IEP selected, Bank Details when Bank selected, ED Approval for Bank systems only',
  hideApprovalChain: true,
  // Resolve and store the assigned IT PIC email at submission time for email routing
  submitTransform: (formData, user) => {
    const appType = String(formData['ApplicationType'] || '');
    const location = (String(formData['Location'] || 'JOHOR')) as 'PENANG' | 'JOHOR';
    const picContacts = getAssignedPIC(appType, location);
    const picEmail = picContacts.map((c) => c.email).join('; ');
    return {
      rSUserName: fieldValue(formData, 'UserName'),
      rSDesignation: fieldValue(formData, 'Designation'),
      rSCompany: fieldValue(formData, 'Company'),
      rSDepartment: fieldValue(formData, 'Department'),
      rSAssignedPICEmail: picEmail,
      rSRequestType: appType,
      rSLocation: location,
      rSResetType: fieldValue(formData, 'ResetType'),
      rSReasonForReset: fieldValue(formData, 'ReasonForReset') || fieldValue(formData, 'Reason'),
      rSBankTokenSerial: fieldValue(formData, 'RS_Bank'),
      rSExecutiveDirectorEmail: fieldValue(formData, 'ExecutiveDirector'),
      rSSAPClient: fieldValue(formData, 'SAPClient'),
      rSIEPClientName: fieldValue(formData, 'IEPClientName'),
      rSTargetUserEmail: user?.userPrincipalName || '',
    };
  },
  extensionTable: 'access',
  extensionTransform: (formData, user) => ({
    rSRequestType: fieldValue(formData, 'ApplicationType'),
    rSTargetUserEmail: user?.userPrincipalName || '',
    rSNeedsEDApproval: fieldValue(formData, 'RS_Bank') ? 'Yes' : 'No',
  }),
};

export const SFAR: ITFormConfig = {
  code: 'SFAR',
  name: 'Share Folder Access Requisition',
  module: 'M1',
  moduleName: 'User & Access Management',
  database: 'MainDB_IT (PRAI)',
  icon: FolderLock,
  color: '#10b981',
  description: 'Request access to shared network folders - supports grant, remove, and delete operations',
  submitTransform: (formData) => {
    return {
      sFARCompany: fieldValue(formData, 'Company'),
      sFARDepartment: fieldValue(formData, 'Dept'),
      sFARExtension: fieldValue(formData, 'Extension'),
      sFARFolderType: fieldValue(formData, 'Type'),
      sFARServerName: fieldValue(formData, 'ServerNameOther') || fieldValue(formData, 'Server'),
      sFARRequestType: fieldValue(formData, 'RequestType'),
      sFARHODEmail: fieldValue(formData, 'HOD'),
      sFAROwner: fieldValue(formData, 'Owner'),
      sFARAccessTo: fieldValue(formData, 'AccessTo'),
      sFARAccessToName: fieldValue(formData, 'AccessToName'),
      sFARFolderPath: fieldValue(formData, 'FolderName'),
      sFARAccessLevel: fieldValue(formData, 'Permission'),
      sFARPurpose: fieldValue(formData, 'Purpose'),
      sFARJustification: fieldValue(formData, 'Justification') || fieldValue(formData, 'Remark'),
    };
  },
  extensionTable: 'access',
  extensionTransform: (formData) => ({
    sFARFolderPath: fieldValue(formData, 'FolderName'),
    sFARAccessLevel: fieldValue(formData, 'Permission'),
    sFARReviewedBy: fieldValue(formData, 'Owner'),
  }),
  stages: [
    { key: 'Draft', name: 'Draft', order: 1, actor: 'Requester', description: 'Create request' },
    { key: 'Review', name: 'Review', order: 2, actor: 'Folder Owner', description: 'Folder owner reviews' },
    { key: 'ITVerify', name: 'IT Verification', order: 3, actor: 'IT Admin', description: 'IT verifies new folder request (IOIPCNSHARE only)', isConditional: true, conditionField: 'Server', conditionValue: 'IOIPCNSHARE' },
    { key: 'Approve', name: 'Approved', order: 4, actor: 'IT Admin', description: 'Access granted' },
  ],
  sections: [
    {
      id: 'requestor-section',
      title: 'Requestor Section',
      visibleAtStages: ['Draft', 'Review', 'ITVerify', 'Approve'],
      isStageGated: false,
      fields: [
        { id: 'Company', label: 'Company', type: 'select', required: true, placeholder: 'Select company', options: IOI_COMPANY_OPTIONS },
        { id: 'Type', label: 'Type of Folder', type: 'select', required: true, options: [
          { value: 'EXISTING', label: 'Existing Folder' },
          { value: 'NEW', label: 'New Folder' },
        ]},
        // Server dropdown - will use SharePoint IT_M1_SFAR_Servers via useSharePointServers hook
        { id: 'Server', label: 'Server Name', type: 'select', required: true, helperText: 'Select server - IOIPCNSHARE requires IT verification', options: [
          { value: 'IOIPCNSHARE', label: 'IOIPCNSHARE (Requires IT Verification)' },
          { value: 'FILESVR', label: 'ACIDCHEM.COM\\FILESVR' },
          { value: 'FILESVR2', label: 'IOIOLEO.COM\\FILESVR' },
          { value: 'NETAPP', label: 'NetApp Storage' },
          { value: 'SHAREPOINT', label: 'SharePoint' },
          { value: 'ONEDRIVE', label: 'OneDrive for Business' },
        ]},
        { id: 'ServerNameOther', label: 'Other Server Name', type: 'text', placeholder: 'Specify if not in dropdown' },
        { id: 'RequestorName', label: 'Requestor Name', type: 'people', required: true },
        { id: 'Dept', label: 'Department', type: 'select', required: true, placeholder: 'Select department', options: IOI_DEPARTMENT_OPTIONS },
        { id: 'Extension', label: 'Extension', type: 'text', placeholder: 'Phone extension' },
        { id: 'HOD', label: 'HOD Approval', type: 'people', required: true, helperText: 'Head of Department for approval' },
        { id: 'CC', label: 'CC', type: 'people', multipleSelection: true },
      ],
    },
    {
      id: 'folder-details',
      title: 'Folder Details',
      visibleAtStages: ['Draft', 'Review', 'ITVerify', 'Approve'],
      isStageGated: false,
      fields: [
        { id: 'Owner', label: 'Owner of Folder', type: 'people', required: true, helperText: 'Person responsible for the folder' },
        // Request Type with Grant, Remove, and Delete Folder options per plan
        { id: 'RequestType', label: 'Request Type', type: 'select', required: true, options: [
          { value: 'GRANT', label: 'Grant Access' },
          { value: 'REMOVE', label: 'Remove Access' },
          { value: 'DELETE', label: 'Delete Folder' },
        ]},
        // AccessTo field (Windows IDs) - hidden for Delete Folder
        { id: 'AccessTo', label: 'Access To (Windows Login ID)', type: 'text', required: true, placeholder: 'e.g., IOIOLEO\\john.smith', helperText: 'Windows ID for user requiring access' },
        { id: 'AccessToName', label: 'Access To Name', type: 'text', required: true, helperText: 'Full name of user' },
        { id: 'FolderName', label: 'Folder Name (Including full path)', type: 'text', required: true, placeholder: 'e.g., \\\\FILESVR\\Shared\\Finance\\Reports' },
        { id: 'Permission', label: 'Permission', type: 'select', required: true, options: [
          { value: 'READ', label: 'Read Only' },
          { value: 'WRITE_READ', label: 'Write/Read' },
          { value: 'FULL', label: 'Full Control' },
        ]},
        { id: 'Remark', label: 'Remark', type: 'textarea', placeholder: 'Additional remarks or comments' },
      ],
    },
    {
      id: 'justification-section',
      title: 'Justification',
      visibleAtStages: ['Draft', 'Review', 'ITVerify', 'Approve'],
      isStageGated: false,
      fields: [
        { id: 'Purpose', label: 'Purpose/Objective', type: 'textarea', required: true },
        { id: 'Justification', label: 'Justification/Benefits', type: 'textarea' },
        { id: 'Attachment', label: 'Supporting Document', type: 'file' },
      ],
    },
    {
      id: 'folder-owner-approval',
      title: 'Folder Owner Approval',
      visibleAtStages: ['Review', 'ITVerify', 'Approve'],
      isStageGated: true,
      fields: [
        { id: 'OwnerStatus', label: 'Status', type: 'select', required: true, options: [
          { value: 'APPROVED', label: 'Approved' },
          { value: 'REJECTED', label: 'Rejected' },
        ]},
        { id: 'OwnerRemarks', label: 'Owner Remarks', type: 'textarea' },
        { id: 'OwnerApprovedBy', label: 'Approved By', type: 'text', disabled: true },
        { id: 'OwnerApprovedDate', label: 'Approved Date', type: 'date', disabled: true },
      ],
    },
    // IT Verifier section - only for IOIPCNSHARE new folders
    {
      id: 'it-verification',
      title: 'IT Verification',
      description: 'Required for new folders on IOIPCNSHARE only',
      visibleAtStages: ['ITVerify', 'Approve'],
      isStageGated: true,
      conditionalField: { field: 'Server', value: 'IOIPCNSHARE' },
      fields: [
        { id: 'ITVerifierStatus', label: 'Status', type: 'select', required: true, options: [
          { value: 'VERIFIED', label: 'Verified' },
          { value: 'REJECTED', label: 'Rejected' },
        ]},
        { id: 'ITVerifierRemarks', label: 'IT Verifier Remarks', type: 'textarea' },
        { id: 'VerifiedBy', label: 'Verified By', type: 'text', disabled: true },
        { id: 'VerifiedDate', label: 'Verified Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'it-processing',
      title: 'IT Processing',
      visibleAtStages: ['Approve'],
      isStageGated: true,
      fields: [
        { id: 'ITStatus', label: 'Status', type: 'select', required: true, options: [
          { value: 'COMPLETED', label: 'Completed' },
          { value: 'PENDING', label: 'Pending' },
          { value: 'REJECTED', label: 'Rejected' },
        ]},
        { id: 'ITRemarks', label: 'IT Remarks', type: 'textarea' },
        { id: 'ProcessedBy', label: 'Processed By', type: 'text', disabled: true },
        { id: 'ProcessedDate', label: 'Processed Date', type: 'date', disabled: true },
      ],
    },
  ],
  hasConditionalSections: true,
  conditionalSectionDescription: 'IT Verification section visible only for IOIPCNSHARE server, Delete Folder hides AccessTo fields',
  hideApprovalChain: true,
};

export const UR: ITFormConfig = {
  code: 'UR',
  name: 'IOI OLEOCHEMICAL User ID Request Form',
  module: 'M1',
  database: 'MainDB_IT (PRAI)',
  moduleName: 'User & Access Management',
  icon: UserPlus,
  color: '#8b5cf6',
  description: 'User ID Requisition Form for IOI Oleochemical Industries Bhd - supports New, Existing, Reactivate, and Deactivate ID requests',
  submitTransform: (formData) => ({
    uRRequestType: fieldValue(formData, 'reqtype'),
    uREmployeeNumber: fieldValue(formData, 'EmployeeNum'),
    uRDesignation: fieldValue(formData, 'designation'),
    uRCompany: fieldValue(formData, 'coname'),
    uRDivision: fieldValue(formData, 'division'),
    uRExtension: fieldValue(formData, 'Extension'),
    uREmailAddress: fieldValue(formData, 'EmailAddress'),
    uRBankName: fieldValue(formData, 'Bank'),
    uRBankUserEmail: fieldValue(formData, 'BankUserEmail'),
    uRPlant: fieldValue(formData, 'Plant') || fieldValue(formData, 'SAPPlant'),
    uRUserFullName: fieldValue(formData, 'empname'),
    uRUserDepartment: fieldValue(formData, 'dept'),
    uRSystemAccess: fieldValue(formData, 'Application'),
  }),
  extensionTable: 'access',
  extensionTransform: (formData) => ({
    uRSystemAccess: fieldValue(formData, 'Application'),
    uRITAdminBy: fieldValue(formData, 'ITAdminBy'),
    uRITAdminDate: fieldValue(formData, 'ITAdminDate'),
  }),
  stages: [
    { key: 'Draft', name: 'Draft', order: 1, actor: 'Requester', description: 'Create request' },
    { key: 'Review', name: 'Review', order: 2, actor: 'IT Manager', description: 'IT Manager reviews' },
    { key: 'Approve', name: 'Approved', order: 3, actor: 'IT Admin', description: 'Account created/modified' },
  ],
  sections: [
    {
      id: 'requestor-section',
      title: 'Requestor Section',
      description: 'Please raise separate forms if the Request type are for both New and Existing ID together.',
      visibleAtStages: ['Draft', 'Review', 'Approve'],
      isStageGated: false,
      fields: [
        // Request Type - updated per plan with New ID, Existing ID, Reactivate, Deactivate
        { id: 'reqtype', label: 'Request Type', type: 'select', required: true, options: [
          { value: 'NEW', label: 'New ID' },
          { value: 'EXISTING', label: 'Existing ID' },
          { value: 'REACTIVATE', label: 'Reactivate ID' },
          { value: 'DEACTIVATE', label: 'Deactivate ID' },
        ]},
        { id: 'empname', label: 'Employee Full Name', type: 'text', required: true },
        { id: 'EmployeeNum', label: "User's Emp. Number", type: 'text', required: true },
        { id: 'designation', label: 'Designation', type: 'text', required: true },
        { id: 'coname', label: 'Company', type: 'select', required: true, placeholder: 'Select company', options: IOI_COMPANY_OPTIONS },
        { id: 'division', label: 'Division', type: 'select', required: true, options: [
          { value: 'Oleochemicals', label: 'Oleochemicals' },
          { value: 'Specialty Fats', label: 'Specialty Fats' },
          { value: 'Refined Oils', label: 'Refined Oils' },
          { value: 'Surfactants', label: 'Surfactants' },
          { value: 'Corporate', label: 'Corporate' },
          { value: 'IT', label: 'IT/Information Technology' },
          { value: 'Finance', label: 'Finance' },
          { value: 'HR', label: 'Human Resources' },
          { value: 'Other', label: 'Other' },
        ]},
        { id: 'dept', label: 'Department', type: 'select', required: true, options: [
          { value: 'Information Technology', label: 'Information Technology' },
          { value: 'Human Resources', label: 'Human Resources' },
          { value: 'Finance', label: 'Finance' },
          { value: 'Accounts', label: 'Accounts' },
          { value: 'Production', label: 'Production' },
          { value: 'Quality Assurance', label: 'Quality Assurance' },
          { value: 'Quality Control', label: 'Quality Control' },
          { value: 'Warehouse', label: 'Warehouse' },
          { value: 'Logistics', label: 'Logistics' },
          { value: 'Engineering', label: 'Engineering' },
          { value: 'Maintenance', label: 'Maintenance' },
          { value: 'Administration', label: 'Administration' },
          { value: 'Marketing', label: 'Marketing' },
          { value: 'Sales', label: 'Sales' },
          { value: 'Procurement', label: 'Procurement' },
          { value: 'HSE', label: 'HSE' },
          { value: 'Plant Operations', label: 'Plant Operations' },
          { value: 'R&D', label: 'R&D' },
          { value: 'Management', label: 'Management' },
          { value: 'Security', label: 'Security' },
          { value: 'Transport', label: 'Transport' },
          { value: 'Other', label: 'Other' },
        ]},
        // Extension field - added per plan
        { id: 'Extension', label: 'Extension', type: 'text', placeholder: 'Phone extension' },
        { id: 'EmailAddress', label: 'Email Address', type: 'email', helperText: 'For new employee, request Notes ID first' },
        { id: 'Application', label: 'Application', type: 'select', required: true, options: [
          { value: 'AD', label: 'Active Directory' },
          { value: 'WINDOWS_ID', label: 'Windows ID' },
          { value: 'SAP', label: 'SAP S4/HANA' },
          { value: 'SAC', label: 'SAC (SAP Analytics Cloud)' },
          { value: 'NOTES', label: 'Lotus Notes' },
          { value: 'DOOR_ACCESS', label: 'Door Access' },
          { value: 'BANK', label: 'Bank System' },
          { value: 'ESKER', label: 'Esker' },
          { value: 'DASHBOARD', label: 'Dashboard' },
          { value: 'VPN', label: 'VPN' },
          { value: 'CITRIX', label: 'Citrix' },
          { value: 'POWER_BI', label: 'Power BI' },
          { value: 'SHAREPOINT', label: 'SharePoint' },
          { value: 'IEP', label: 'IEP (Live System)' },
          { value: 'NAVISION', label: 'Navision' },
        ]},
      ],
    },
    // Access Card Details - conditional on DOOR ACCESS selection
    {
      id: 'access-card-section',
      title: 'Access Card Details',
      description: 'Required when Application is DOOR ACCESS',
      visibleAtStages: ['Draft', 'Review', 'Approve'],
      isStageGated: false,
      conditionalField: { field: 'Application', value: 'DOOR_ACCESS' },
      fields: [
        { id: 'EmployeeCard', label: 'Employee Card Serial (last 5 digits)', type: 'text', required: true, helperText: 'Serial number on employee access card' },
        // Door Selection multi-select with 34 doors per plan
        { id: 'DoorSelection', label: 'Door Selection', type: 'select', required: true, helperText: 'Select doors for access', options: [
          { value: 'MAIN_ENTRANCE', label: 'Main Entrance' },
          { value: 'BACK_ENTRANCE', label: 'Back Entrance' },
          { value: 'SERVER_ROOM', label: 'Server Room' },
          { value: 'DATA_CENTER', label: 'Data Center' },
          { value: 'FINANCE_OFFICE', label: 'Finance Office' },
          { value: 'HR_OFFICE', label: 'HR Office' },
          { value: 'IT_OFFICE', label: 'IT Office' },
          { value: 'WAREHOUSE_MAIN', label: 'Warehouse Main' },
          { value: 'WAREHOUSE_BACK', label: 'Warehouse Back' },
          { value: 'PRODUCTION_FLOOR', label: 'Production Floor' },
          { value: 'PLANT_1_MAIN', label: 'Plant 1 Main Gate' },
          { value: 'PLANT_1_OFFICE', label: 'Plant 1 Office' },
          { value: 'PLANT_2_MAIN', label: 'Plant 2 Main Gate' },
          { value: 'PLANT_2_OFFICE', label: 'Plant 2 Office' },
          { value: 'QA_LAB', label: 'QA Laboratory' },
          { value: 'QC_LAB', label: 'QC Laboratory' },
          { value: 'RND_LAB', label: 'R&D Laboratory' },
          { value: 'CANTEEN', label: 'Canteen' },
          { value: 'PARKING_A', label: 'Parking Area A' },
          { value: 'PARKING_B', label: 'Parking Area B' },
          { value: 'ADMIN_BUILDING', label: 'Admin Building' },
          { value: 'ENGINEERING_BUILDING', label: 'Engineering Building' },
          { value: 'MAINTENANCE_WORKSHOP', label: 'Maintenance Workshop' },
          { value: 'CHEMICAL_STORE', label: 'Chemical Store' },
          { value: 'RAW_MATERIAL_STORE', label: 'Raw Material Store' },
          { value: 'FINISHED_GOODS_STORE', label: 'Finished Goods Store' },
          { value: 'LOADING_BAY_1', label: 'Loading Bay 1' },
          { value: 'LOADING_BAY_2', label: 'Loading Bay 2' },
          { value: 'WEIGHBRIDGE', label: 'Weighbridge' },
          { value: 'SECURITY_OFFICE', label: 'Security Office' },
          { value: 'VISITOR_CENTER', label: 'Visitor Center' },
          { value: 'TRAINING_ROOM', label: 'Training Room' },
          { value: 'MEETING_ROOM_A', label: 'Meeting Room A' },
          { value: 'MEETING_ROOM_B', label: 'Meeting Room B' },
          { value: 'ALL_DOORS', label: 'All Doors' },
        ]},
      ],
    },
    {
      id: 'bank-section',
      title: 'Bank System Details',
      description: 'Please inform Finance person in charge to fill up form to submit to bank for new ID creation!',
      visibleAtStages: ['Draft', 'Review', 'Approve'],
      isStageGated: false,
      conditionalField: { field: 'Application', value: 'BANK' },
      fields: [
        { id: 'Bank', label: 'Bank', type: 'select', required: true, options: [
          { value: 'CIMB', label: 'CIMB' },
          { value: 'MAYBANK', label: 'Maybank' },
          { value: 'PUBLIC', label: 'Public Bank' },
          { value: 'HSBC', label: 'HSBC' },
          { value: 'UOB', label: 'UOB' },
          { value: 'OCBC', label: 'OCBC' },
          { value: 'RHB', label: 'RHB' },
          { value: 'AMBANK', label: 'AmBank' },
        ]},
        { id: 'BankDesc', label: 'Roles to assign', type: 'textarea', helperText: 'Please state the roles to assign' },
        { id: 'BankUserEmail', label: "User's Email Address", type: 'email', helperText: 'For new employee please request for Notes ID first before raise UR.' },
      ],
    },
    {
      id: 'plant-section',
      title: 'Plant Access',
      visibleAtStages: ['Draft', 'Review', 'Approve'],
      isStageGated: false,
      fields: [
        { id: 'Plant', label: 'Plant (Dashboard & Sales Portal)', type: 'select', options: [
          { value: 'PRAI', label: 'Prai' },
          { value: 'JOHOR', label: 'Johor' },
          { value: 'ALL', label: 'All Plants' },
        ]},
      ],
    },
    // SAP/SAC Plant section - conditional on SAP application selection
    {
      id: 'sap-plant-section',
      title: 'SAP/SAC Plant Selection',
      description: 'Select the plant for SAP/SAC access',
      visibleAtStages: ['Draft', 'Review', 'Approve'],
      isStageGated: false,
      conditionalField: { field: 'Application', value: 'SAP', values: ['SAP', 'SAC'] },
      fields: [
        { id: 'SAPPlant', label: 'Plant (SAP/SAC)', type: 'select', required: true, options: [
          { value: '1100', label: '1100 - IOI Plant' },
          { value: '1200', label: '1200 - ACM Plant | ACM' },
          { value: '1201', label: '1201 - AES Plant | AES' },
          { value: '1202', label: '1202 - AEC Plant | AEC' },
          { value: '1203', label: '1203 - ASN Plant | ASN' },
          { value: '1300', label: '1300 - AUS Plant | AUC' },
          { value: '1400', label: '1400 - DCM Plant | DCM' },
          { value: '1500', label: '1500 - POM Plant | POM' },
          { value: '1501', label: '1501 - BIO | BIO' },
          { value: '1600', label: '1600 - ECM Plant | ECM' },
          { value: '1700', label: '1700 - SCM' },
          { value: '1800', label: '1800 - PMS' },
          { value: '1801', label: '1801 - PBI' },
          { value: '1900', label: '1900 - PJY' },
          { value: '2000', label: '2000 - QGS' },
          { value: '2140', label: '2140 - PFC' },
          { value: '2150', label: '2150 - PAL' },
          { value: '2160', label: '2160 - PPL' },
          { value: '2170', label: '2170 - DCS' },
          { value: '2180', label: '2180 - ASB' },
          { value: '2190', label: '2190 - PBT' },
          { value: '5100', label: '5100 - PEO - Fatty Acid' },
          { value: '5102', label: '5102 - PEO Refinery Plant | PCEO' },
          { value: '5103', label: '5103 - PEO Consumer Packs Plant' },
          { value: '5200', label: '5200 - POC Plant' },
          { value: '5201', label: '5201 - POC Soap Noodles Plant | PCOC' },
          { value: '9120', label: '9120 - PGA | PGA' },
        ]},
      ],
    },
  ],
  hasConditionalSections: true,
  conditionalSectionDescription: 'Access Card section visible when DOOR ACCESS selected, Bank section visible when Bank selected',
};

// =============================================================================
// MODULE 2: IT SUPPORT & SERVICE REQUESTS (9 Forms)
// =============================================================================

export const IAL1: ITFormConfig = {
  code: 'IAL1',
  name: 'Server Reboot Log',
  database: 'MainDB_IT (PRAI)',
  module: 'M2',
  moduleName: 'IT Support & Service Requests',
  icon: Server,
  color: '#ef4444',
  description: 'Log server reboot activities',
  extensionTable: 'infra',
  extensionTransform: (formData) => ({
    iAL1Site: fieldValue(formData, 'rbSite'),
    iAL1RebootType: fieldValue(formData, 'rbRebootType'),
    iAL1ServerName: fieldValue(formData, 'lstServerName'),
    iAL1DownDate: fieldValue(formData, 'dtDown'),
    iAL1DownTime: fieldValue(formData, 'dtTimeDown'),
    iAL1UpDate: fieldValue(formData, 'dtUp'),
    iAL1UpTime: fieldValue(formData, 'dtTimeUp'),
    iAL1TotalDowntime: fieldNumber(formData, 'TotalDownTime'),
    iAL1Reason: fieldValue(formData, 'txtReason'),
    iAL1PerformedBy: fieldValue(formData, 'nmReqReboot'),
  }),
  stages: [
    { key: 'Draft', name: 'Draft', order: 1, actor: 'IT Staff', description: 'Create log entry' },
    { key: 'Review', name: 'Review', order: 2, actor: 'IT Manager', description: 'Manager reviews' },
    { key: 'Approve', name: 'Approved', order: 3, actor: 'IT Manager', description: 'Log approved' },
  ],
  sections: [
    {
      id: 'server-info',
      title: 'Server Reboot Information',
      visibleAtStages: ['Draft', 'Review', 'Approve'],
      isStageGated: false,
      fields: [
        { id: 'rbSite', label: 'Site', type: 'select', required: true, options: [
          { value: 'MY-PR', label: 'Prai (MY-PR)' },
          { value: 'MY-JH', label: 'Johor (MY-JH)' },
        ]},
        { id: 'rbRebootType', label: 'Reboot Type', type: 'select', required: true, options: [
          { value: 'Scheduled', label: 'Scheduled' },
          { value: 'Unscheduled', label: 'Unscheduled' },
          { value: 'Emergency', label: 'Emergency' },
        ]},
        { id: 'lstServerName', label: 'Server Name', type: 'select', required: true, options: [
          { value: 'SAP_PROD', label: 'SAP Production' },
          { value: 'SAP_DEV', label: 'SAP Development' },
          { value: 'SQL_CLUSTER', label: 'SQL Database Cluster' },
          { value: 'FILE_SVR', label: 'File Server' },
          { value: 'DC', label: 'Domain Controller' },
        ]},
        { id: 'dtDown', label: 'Server Downtime Date', type: 'date', required: true },
        { id: 'dtTimeDown', label: 'Server Downtime Time', type: 'text', required: true, placeholder: 'HH:MM' },
        { id: 'dtUp', label: 'Server Uptime Date', type: 'date', required: true },
        { id: 'dtTimeUp', label: 'Server Uptime Time', type: 'text', required: true, placeholder: 'HH:MM' },
        { id: 'TotalDownTime', label: 'Total Down Time (min)', type: 'number', disabled: true },
        { id: 'txtReason', label: 'Reason', type: 'textarea', required: true },
        { id: 'RebootRemarks', label: 'Remarks/Attachment', type: 'textarea' },
        { id: 'nmReqReboot', label: 'Performed By', type: 'people', required: true },
      ],
    },
    {
      id: 'hidden-fields',
      title: 'System Fields',
      visibleAtStages: ['Draft', 'Review', 'Approve'],
      isStageGated: false,
      fields: [
        { id: 'nmRequestor', label: 'Creator', type: 'text', disabled: true },
        { id: 'dtCreatedOn', label: 'Created', type: 'date', disabled: true },
        { id: 'CurrentAction', label: 'CurrentAction', type: 'text', disabled: true },
        { id: 'ISGRecipients', label: 'ISG Recipients', type: 'people', multipleSelection: true, disabled: true },
      ],
    },
  ],
  hasConditionalSections: false,
  hideApprovalChain: true,
};

export const IAL2: ITFormConfig = {
  code: 'IAL2',
  database: 'MainDB_IT (PRAI)',
  name: 'Data Center Access Log',
  module: 'M2',
  moduleName: 'IT Support & Service Requests',
  icon: Database,
  color: '#6366f1',
  description: 'Log data center access activities',
  extensionTable: 'infra',
  extensionTransform: (formData) => ({
    iAL2Site: fieldValue(formData, 'rbSite'),
    iAL2ServerRoom: fieldValue(formData, 'lstServerRoom'),
    iAL2AccessDate: fieldValue(formData, 'dtCreatedAccess'),
    iAL2TimeIn: fieldValue(formData, 'dtTimeIN'),
    iAL2VisitorName: fieldValue(formData, 'nmVisitor'),
    iAL2Company: fieldValue(formData, 'lstCompany'),
    iAL2Reason: fieldValue(formData, 'txtReasonAccess'),
    iAL2AttendedBy: fieldValue(formData, 'nmPIC'),
  }),
  stages: [
    { key: 'Draft', name: 'Draft', order: 1, actor: 'Visitor', description: 'Create access log' },
    { key: 'Review', name: 'Review', order: 2, actor: 'IT Security', description: 'Security reviews' },
    { key: 'Approve', name: 'Approved', order: 3, actor: 'IT Manager', description: 'Access logged' },
  ],
  sections: [
    {
      id: 'visitor-info',
      title: 'Data Center Access Information',
      visibleAtStages: ['Draft', 'Review', 'Approve'],
      isStageGated: false,
      fields: [
        { id: 'rbSite', label: 'Site', type: 'select', required: true, options: [
          { value: 'MY-PR', label: 'Prai' },
          { value: 'MY-PG', label: 'Penang' },
          { value: 'MY-JH', label: 'Johor' },
          { value: 'MY-KL', label: 'Kuala Lumpur' },
          { value: 'ALL', label: 'All Sites' },
        ]},
        { id: 'lstServerRoom', label: 'Server Room', type: 'select', required: true, options: [
          { value: 'SERVER_ROOM_A', label: 'Server Room A' },
          { value: 'SERVER_ROOM_B', label: 'Server Room B' },
          { value: 'MAIN_DC', label: 'Main Data Center' },
          { value: 'BACKUP_DC', label: 'Backup Data Center' },
          { value: 'NETWORK_ROOM', label: 'Network Room' },
          { value: 'UPS_ROOM', label: 'UPS Room' },
          { value: 'OTHER', label: 'Other' },
        ]},
        { id: 'dtCreatedAccess', label: 'Date', type: 'date', required: true },
        { id: 'dtTimeIN', label: 'Time In', type: 'text', required: true, placeholder: 'HH:MM (24-hour format)' },
        { id: 'nmVisitor', label: 'Visitor Name', type: 'text', required: true, placeholder: 'Full name of visitor' },
        { id: 'lstCompany', label: 'Company', type: 'select', required: true, options: [
          { value: 'IOI Acidchem Sdn Bhd', label: 'IOI Acidchem Sdn Bhd' },
          { value: 'IOI Corporation Berhad', label: 'IOI Corporation Berhad' },
          { value: 'IOI Oleochemical Industries', label: 'IOI Oleochemical Industries' },
          { value: 'HCL Technologies', label: 'HCL Technologies' },
          { value: 'External Vendor', label: 'External Vendor' },
          { value: 'Government Agency', label: 'Government Agency' },
          { value: 'Other', label: 'Other' },
        ]},
        { id: 'txtReasonAccess', label: 'Reason for Access', type: 'textarea', required: true, placeholder: 'Describe the reason for accessing the data center...' },
        { id: 'nmPIC', label: 'Attended By (PIC)', type: 'text', required: true, placeholder: 'Name or email of IT staff attending' },
      ],
    },
    {
      id: 'system-fields',
      title: 'System Fields',
      visibleAtStages: ['Draft', 'Review', 'Approve'],
      isStageGated: false,
      fields: [
        { id: 'nmRequestor', label: 'Creator', type: 'text', disabled: true },
        { id: 'dtCreatedOn', label: 'Created', type: 'date', disabled: true },
        { id: 'CurrentAction', label: 'CurrentAction', type: 'text', disabled: true },
      ],
    },
  ],
  hasConditionalSections: false,
  hideApprovalChain: true,
};

export const IAL3: ITFormConfig = {
  database: 'MainDB_IT (PRAI)',
  code: 'IAL3',
  name: 'IT Event',
  module: 'M2',
  moduleName: 'IT Support & Service Requests',
  icon: Calendar,
  color: '#14b8a6',
  description: 'Log IT events and incidents',
  extensionTable: 'infra',
  extensionTransform: (formData) => ({
    iAL3EventType: fieldValue(formData, 'lstEventType'),
    iAL3Description: fieldValue(formData, 'txtEventDesc'),
    iAL3Purpose: fieldValue(formData, 'txtPurpose'),
    iAL3Hardware: fieldValue(formData, 'txtServer'),
    iAL3DateFrom: fieldValue(formData, 'EvtDate'),
    iAL3TimeFrom: fieldValue(formData, 'EvtTime'),
    iAL3DateTo: fieldValue(formData, 'EvtDate_1'),
    iAL3TimeTo: fieldValue(formData, 'EvtTime_1'),
  }),
  stages: [
    { key: 'Draft', name: 'Draft', order: 1, actor: 'IT Staff', description: 'Create event entry' },
    { key: 'Review', name: 'Review', order: 2, actor: 'IT Manager', description: 'Manager reviews' },
    { key: 'Approve', name: 'Approved', order: 3, actor: 'IT Manager', description: 'Event logged' },
  ],
  sections: [
    {
      id: 'event-info',
      title: 'IT Event Information',
      visibleAtStages: ['Draft', 'Review', 'Approve'],
      isStageGated: false,
      fields: [
        { id: 'lstEventType', label: 'Event Type', type: 'select', required: true, options: [
          { value: 'SCHEDULED_MAINTENANCE', label: 'Scheduled Maintenance' },
          { value: 'UNSCHEDULED_MAINTENANCE', label: 'Unscheduled Maintenance' },
          { value: 'SYSTEM_OUTAGE', label: 'System Outage / Downtime' },
          { value: 'SERVER_REBOOT', label: 'Server Reboot' },
          { value: 'NETWORK_ISSUE', label: 'Network Issue' },
          { value: 'SYSTEM_UPGRADE', label: 'System Upgrade / Patching' },
          { value: 'DATA_MIGRATION', label: 'Data Migration / Backup' },
          { value: 'SECURITY_INCIDENT', label: 'Security Incident' },
          { value: 'NEW_DEPLOYMENT', label: 'New System Deployment' },
          { value: 'DECOMMISSION', label: 'System Decommission' },
          { value: 'OTHER', label: 'Other' },
        ]},
        { id: 'txtEventDesc', label: 'Event Description', type: 'textarea', required: true },
        { id: 'txtPurpose', label: 'Purpose', type: 'textarea', required: true },
        { id: 'txtServer', label: 'Hardware Involved', type: 'textarea', required: true },
        { id: 'rtxtEventAtt', label: 'Attachment', type: 'file' },
        { id: 'EvtDate', label: 'Scheduled Date (From)', type: 'date', required: true },
        { id: 'EvtTime', label: 'Scheduled Time (From)', type: 'text', required: true, placeholder: 'HH:MM' },
        { id: 'EvtDate_1', label: 'Scheduled Date (To)', type: 'date', required: true },
        { id: 'EvtTime_1', label: 'Scheduled Time (To)', type: 'text', required: true, placeholder: 'HH:MM' },
        { id: 'txtRemarks', label: 'Remarks', type: 'textarea' },
        { id: 'nmReqEvent', label: 'Prepared by', type: 'people', required: true },
      ],
    },
    {
      id: 'system-fields',
      title: 'System Fields',
      visibleAtStages: ['Draft', 'Review', 'Approve'],
      isStageGated: false,
      fields: [
        { id: 'nmRequestor', label: 'Creator', type: 'text', disabled: true },
        { id: 'dtCreatedOn', label: 'Created', type: 'date', disabled: true },
        { id: 'CurrentAction', label: 'CurrentAction', type: 'text', disabled: true },
      ],
    },
  ],
  hasConditionalSections: false,
  hideApprovalChain: true,
};

export const IAL4: ITFormConfig = {
  database: 'MainDB_IT (PRAI)',
  code: 'IAL4',
  name: 'Server Records',
  module: 'M2',
  moduleName: 'IT Support & Service Requests',
  icon: HardDrive,
  color: '#78716c',
  description: 'Manage server inventory records',
  extensionTable: 'infra',
  extensionTransform: (formData) => ({
    iAL4Site: fieldValue(formData, 'rbSite'),
    iAL4ServerName: fieldValue(formData, 'lstServerName'),
    iAL4RecordType: fieldValue(formData, 'lstRecType'),
    iAL4Mode: fieldValue(formData, 'rbMode'),
    iAL4DateFrom: fieldValue(formData, 'dtFrom'),
    iAL4DateTo: fieldValue(formData, 'dtTo'),
    iAL4Summary: fieldValue(formData, 'txtSummary'),
    iAL4RootCause: fieldValue(formData, 'txtRootCause'),
    iAL4CorrectiveActions: fieldValue(formData, 'txtCorrectiveActions'),
    iAL4PreventiveActions: fieldValue(formData, 'txtPreventiveActions'),
  }),
  stages: [
    { key: 'Draft', name: 'Draft', order: 1, actor: 'IT Staff', description: 'Create record' },
    { key: 'Review', name: 'Review', order: 2, actor: 'IT Manager', description: 'Manager reviews' },
    { key: 'Approve', name: 'Approved', order: 3, actor: 'IT Manager', description: 'Record approved' },
  ],
  sections: [
    {
      id: 'server-records',
      title: 'Server Records',
      visibleAtStages: ['Draft', 'Review', 'Approve'],
      isStageGated: false,
      fields: [
        { id: 'rbSite', label: 'Site', type: 'select', required: true, options: [
          { value: 'MY-PR', label: 'Prai (MY-PR)' },
          { value: 'MY-JH', label: 'Johor (MY-JH)' },
        ]},
        { id: 'lstServerName', label: 'Server Name', type: 'select', required: true, options: [
          { value: 'SAP_PROD', label: 'SAP Production' },
          { value: 'SAP_DEV', label: 'SAP Development' },
          { value: 'SQL_CLUSTER', label: 'SQL Database Cluster' },
          { value: 'FILE_SVR', label: 'File Server' },
          { value: 'DC', label: 'Domain Controller' },
        ]},
        { id: 'lstRecType', label: 'Record Type', type: 'select', required: true, options: [
          { value: 'INCIDENT', label: 'Incident Report' },
          { value: 'MAINTENANCE', label: 'Maintenance Log' },
          { value: 'UPGRADE', label: 'Upgrade Record' },
          { value: 'AUDIT', label: 'Audit Record' },
        ]},
        { id: 'rbMode', label: 'Mode', type: 'select', required: true, options: [
          { value: 'ONLINE', label: 'Online' },
          { value: 'OFFLINE', label: 'Offline' },
          { value: 'MAINTENANCE', label: 'Maintenance Mode' },
        ]},
        { id: 'dtFrom', label: 'Date From', type: 'date', required: true },
        { id: 'dtTo', label: 'Date To', type: 'date', required: true },
        { id: 'tmFrom', label: 'Time From', type: 'text', placeholder: 'HH:MM' },
        { id: 'tmTo', label: 'Time To', type: 'text', placeholder: 'HH:MM' },
        { id: 'txtSummary', label: 'Overview/Summary', type: 'textarea', required: true },
        { id: 'txtBackground', label: 'Background', type: 'textarea', required: true },
        { id: 'txtAnalysis', label: 'Analysis', type: 'textarea', required: true },
        { id: 'txtRootCause', label: 'Root Cause Description', type: 'textarea', required: true },
        { id: 'txtCorrectiveActions', label: 'Corrective Actions', type: 'textarea', required: true, placeholder: 'Actions taken to resolve the issue' },
        { id: 'txtPreventiveActions', label: 'Preventive Actions', type: 'textarea', placeholder: 'Actions to prevent recurrence' },
      ],
    },
  ],
  hasConditionalSections: false,
  hideApprovalChain: true,
};

export const IAL5: ITFormConfig = {
  database: 'MainDB_IT (PRAI)',
  code: 'IAL5',
  name: 'Data Restoration Request',
  module: 'M2',
  moduleName: 'IT Support & Service Requests',
  icon: RotateCcw,
  color: '#f97316',
  description: 'Request data restoration from backup',
  extensionTable: 'infra',
  extensionTransform: (formData) => ({
    iAL5Site: fieldValue(formData, 'rbSite'),
    iAL5Dept: fieldValue(formData, 'lstDept'),
    iAL5BackupDate: fieldValue(formData, 'txtMedia') || fieldValue(formData, 'dtMediadate'),
    iAL5ServerName: fieldValue(formData, 'lstServerName'),
    iAL5FilePath: fieldValue(formData, 'txtFilePath'),
    iAL5FileName: fieldValue(formData, 'txtFileName'),
    iAL5Reason: fieldValue(formData, 'txtReason'),
    iAL5MediaName: fieldValue(formData, 'txtMediaName'),
    iAL5RestoredFileName: fieldValue(formData, 'RestoredFileName'),
  }),
  stages: [
    { key: 'Draft', name: 'Draft', order: 1, actor: 'Requester', description: 'Submit request' },
    { key: 'Review', name: 'Review', order: 2, actor: 'IT Manager', description: 'Manager reviews' },
    { key: 'Approve', name: 'Approved', order: 3, actor: 'IT Admin', description: 'Restoration completed' },
  ],
  sections: [
    {
      id: 'requester-section',
      title: 'Requester Information',
      visibleAtStages: ['Draft', 'Review', 'Approve'],
      isStageGated: false,
      fields: [
        { id: 'INO', label: 'Request No', type: 'text', disabled: true },
        { id: 'rbSite', label: 'Site', type: 'select', required: true, options: [
          { value: 'MY-PR', label: 'Prai (MY-PR)' },
          { value: 'MY-JH', label: 'Johor (MY-JH)' },
        ]},
        { id: 'nmRequestedBy', label: 'Requested by', type: 'people', required: true },
        { id: 'lstDept', label: 'Department', type: 'select', required: true, options: [
          { value: 'IT', label: 'IT' },
          { value: 'FINANCE', label: 'Finance' },
          { value: 'HR', label: 'Human Resources' },
          { value: 'OPERATIONS', label: 'Operations' },
          { value: 'PRODUCTION', label: 'Production' },
        ]},
        { id: 'txtMedia', label: 'Media Backup Date', type: 'text', required: true, placeholder: 'Date of backup to restore from' },
        { id: 'lstServerName', label: 'Server Name', type: 'select', required: true, options: [
          { value: 'FILE_SVR', label: 'File Server' },
          { value: 'SQL_SVR', label: 'SQL Server' },
          { value: 'EXCHANGE', label: 'Exchange Server' },
          { value: 'SHAREPOINT', label: 'SharePoint' },
        ]},
        { id: 'txtFilePath', label: 'Path', type: 'text', required: true, placeholder: 'Full path to restore' },
        { id: 'txtFileName', label: 'Folder/File Name', type: 'text', required: true },
        { id: 'txtReason', label: 'Reason', type: 'textarea', required: true },
        { id: 'rtxtAttach', label: 'Attachment', type: 'file' },
        { id: 'nmCC', label: 'CC (within IT)', type: 'people', multipleSelection: true },
        { id: 'nmSubmitted', label: 'Submitted by', type: 'text', disabled: true },
        { id: 'dtSubmitted', label: 'Submitted on', type: 'date', disabled: true },
      ],
    },
    {
      id: 'backup-admin-section',
      title: 'Backup Administrator',
      visibleAtStages: ['Review', 'Approve'],
      isStageGated: true,
      fields: [
        { id: 'txtMediaName', label: 'Media', type: 'text', required: true },
        { id: 'dtMediadate', label: 'Media Date', type: 'date', required: true },
        { id: 'RestoredFileName', label: 'Restored File Name', type: 'text' },
      ],
    },
  ],
  hasConditionalSections: false,
  hideApprovalChain: true,
  conditionalSectionDescription: 'Backup admin section becomes visible at Review stage for backup team to fill',
};

export const ITDR: ITFormConfig = {
  code: 'ITDR',
  name: 'IT Daily Report',
  module: 'M2',
  moduleName: 'IT Support & Service Requests',
  icon: ClipboardList,
  color: '#0284c7',
  description: 'Daily IT operations report with conditional activity sections',
  database: 'MainDB_IT (PRAI)',
  stages: [
    { key: 'Sent', name: 'Sent', order: 1, actor: 'IT Staff', description: 'Report submitted; no approval workflow' },
  ],
  sections: [
    {
      id: 'report-header',
      title: 'Report Header',
      description: 'Basic report identification and categorization',
      visibleAtStages: ['Sent'],
      isStageGated: false,
      fields: [
        { id: 'Company', label: 'Company', type: 'select', required: true, options: IOI_COMPANY_OPTIONS },
        { id: 'subject', label: 'Subject', type: 'text', required: true, placeholder: 'Report subject/title' },
        { id: 'startDate', label: 'Date (From)', type: 'date', required: true },
        { id: 'endDate', label: 'Date (To)', type: 'date', required: true },
        {
          id: 'category',
          label: 'Category',
          type: 'select',
          required: true,
          options: [
            { value: 'Meeting', label: 'Meeting' },
            { value: 'Seminar', label: 'Seminar / Training' },
            { value: 'OT', label: 'OT (Overtime)' },
            { value: 'Maintenance', label: 'Maintenance' },
            { value: 'Incident', label: 'Incident / Breakdown' },
            { value: 'Project', label: 'Project Work' },
            { value: 'Support', label: 'User Support' },
            { value: 'Audit', label: 'Audit / Compliance' },
            { value: 'Travel', label: 'Business Travel' },
            { value: 'Other', label: 'Other' },
          ],
        },
      ],
    },
    {
      id: 'ot-section',
      title: 'Overtime (OT) Details',
      description: 'Overtime-specific information',
      visibleAtStages: ['Sent'],
      isStageGated: false,
      conditionalField: { field: 'category', value: 'OT' },
      fields: [
        { id: 'otTimeFrom', label: 'Time (From)', type: 'text', required: true, placeholder: 'e.g., 18:00' },
        { id: 'otTimeTo', label: 'Time (To)', type: 'text', required: true, placeholder: 'e.g., 22:00' },
        { id: 'otCategory', label: 'OT Category', type: 'text', required: true, placeholder: 'OT category classification' },
        { id: 'otPurpose', label: 'Purpose', type: 'textarea', required: true, placeholder: 'Purpose of overtime' },
      ],
    },
    {
      id: 'meeting-section',
      title: 'Meeting Details',
      description: 'Meeting-specific information',
      visibleAtStages: ['Sent'],
      isStageGated: false,
      conditionalField: { field: 'category', value: 'Meeting' },
      fields: [
        { id: 'chairman', label: 'Chairman', type: 'text', required: true, placeholder: 'Meeting chairperson' },
        { id: 'present', label: 'Present', type: 'textarea', required: true, placeholder: 'Attendees present at the meeting' },
        { id: 'venue', label: 'Venue', type: 'text', required: true, placeholder: 'Meeting venue/location' },
        { id: 'meetingDate', label: 'Date', type: 'date', required: true },
        { id: 'timeFrom', label: 'Time (From)', type: 'text', placeholder: 'e.g., 09:00 AM' },
        { id: 'timeTo', label: 'Time (To)', type: 'text', placeholder: 'e.g., 11:00 AM' },
      ],
    },
    {
      id: 'seminar-section',
      title: 'Seminar / Training Details',
      description: 'Seminar or training-specific information',
      visibleAtStages: ['Sent'],
      isStageGated: false,
      conditionalField: { field: 'category', value: 'Seminar' },
      fields: [
        { id: 'trainingVenue', label: 'Venue', type: 'text', required: true, placeholder: 'Seminar or training venue' },
        { id: 'trainingDateStart', label: 'Date (From)', type: 'date', required: true },
        { id: 'trainingDateEnd', label: 'Date (To)', type: 'date', required: true },
        { id: 'participants', label: 'Participants', type: 'textarea', required: true, placeholder: 'List of participants' },
        { id: 'trainer', label: 'Trainer', type: 'text', required: true, placeholder: 'Name of trainer' },
      ],
    },
    {
      id: 'activities',
      title: 'Activities',
      description: 'Daily activities summary',
      visibleAtStages: ['Sent'],
      isStageGated: false,
      fields: [
        { id: 'activitiesDescription', label: 'Activities Description', type: 'textarea', required: true, placeholder: 'Describe activities performed' },
      ],
    },
    {
      id: 'issues',
      title: 'Issues & Escalations',
      description: 'Any issues encountered or escalations needed',
      visibleAtStages: ['Sent'],
      isStageGated: false,
      fields: [
        { id: 'issuesDescription', label: 'Issues', type: 'textarea', placeholder: 'Describe any issues or escalations' },
      ],
    },
  ],
  hasConditionalSections: true,
  conditionalSectionDescription: 'Meeting section visible when Category = Meeting; Seminar/Training section visible when Category = Seminar',
  hideApprovalChain: true,
};

export const ITDR2: ITFormConfig = {
  code: 'ITDR2',
  name: 'IT Daily Report — Outstanding Tasks',
  module: 'M2',
  moduleName: 'IT Support & Service Requests',
  icon: ListTodo,
  color: '#84cc16',
  description: 'Monthly outstanding tasks register for IT operations',
  database: 'MainDB_IT (PRAI)',
  stages: [
    { key: 'Sent', name: 'Sent', order: 1, actor: 'IT Staff', description: 'Task register submitted; no approval workflow' },
  ],
  sections: [
    {
      id: 'report-header',
      title: 'Report Header',
      description: 'Outstanding tasks report identification',
      visibleAtStages: ['Sent'],
      isStageGated: false,
      fields: [
        {
          id: 'year',
          label: 'Year',
          type: 'select',
          required: true,
          options: [
            { value: '2024', label: '2024' },
            { value: '2025', label: '2025' },
            { value: '2026', label: '2026' },
          ],
        },
        {
          id: 'month',
          label: 'Month',
          type: 'select',
          required: true,
          options: [
            { value: 'January', label: 'January' },
            { value: 'February', label: 'February' },
            { value: 'March', label: 'March' },
            { value: 'April', label: 'April' },
            { value: 'May', label: 'May' },
            { value: 'June', label: 'June' },
            { value: 'July', label: 'July' },
            { value: 'August', label: 'August' },
            { value: 'September', label: 'September' },
            { value: 'October', label: 'October' },
            { value: 'November', label: 'November' },
            { value: 'December', label: 'December' },
          ],
        },
        { id: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Title/subject of the outstanding tasks report' },
      ],
    },
    {
      id: 'outstanding-tasks-table',
      title: 'Outstanding Tasks',
      description: 'Flat repeating-row structure — 10 fixed task rows (No_1–No_10, Task_1–Task_10, Desc_1–Desc_10)',
      visibleAtStages: ['Sent'],
      isStageGated: false,
      fields: [
        // Row 1
        { id: 'No_1', label: 'No (Row 1)', type: 'number', placeholder: '1' },
        { id: 'Task_1', label: 'Task (Row 1)', type: 'text', placeholder: 'Task name' },
        { id: 'Desc_1', label: 'Description (Row 1)', type: 'textarea', placeholder: 'Task description' },
        // Row 2
        { id: 'No_2', label: 'No (Row 2)', type: 'number', placeholder: '2' },
        { id: 'Task_2', label: 'Task (Row 2)', type: 'text', placeholder: 'Task name' },
        { id: 'Desc_2', label: 'Description (Row 2)', type: 'textarea', placeholder: 'Task description' },
        // Row 3
        { id: 'No_3', label: 'No (Row 3)', type: 'number', placeholder: '3' },
        { id: 'Task_3', label: 'Task (Row 3)', type: 'text', placeholder: 'Task name' },
        { id: 'Desc_3', label: 'Description (Row 3)', type: 'textarea', placeholder: 'Task description' },
        // Row 4
        { id: 'No_4', label: 'No (Row 4)', type: 'number', placeholder: '4' },
        { id: 'Task_4', label: 'Task (Row 4)', type: 'text', placeholder: 'Task name' },
        { id: 'Desc_4', label: 'Description (Row 4)', type: 'textarea', placeholder: 'Task description' },
        // Row 5
        { id: 'No_5', label: 'No (Row 5)', type: 'number', placeholder: '5' },
        { id: 'Task_5', label: 'Task (Row 5)', type: 'text', placeholder: 'Task name' },
        { id: 'Desc_5', label: 'Description (Row 5)', type: 'textarea', placeholder: 'Task description' },
        // Row 6
        { id: 'No_6', label: 'No (Row 6)', type: 'number', placeholder: '6' },
        { id: 'Task_6', label: 'Task (Row 6)', type: 'text', placeholder: 'Task name' },
        { id: 'Desc_6', label: 'Description (Row 6)', type: 'textarea', placeholder: 'Task description' },
        // Row 7
        { id: 'No_7', label: 'No (Row 7)', type: 'number', placeholder: '7' },
        { id: 'Task_7', label: 'Task (Row 7)', type: 'text', placeholder: 'Task name' },
        { id: 'Desc_7', label: 'Description (Row 7)', type: 'textarea', placeholder: 'Task description' },
        // Row 8
        { id: 'No_8', label: 'No (Row 8)', type: 'number', placeholder: '8' },
        { id: 'Task_8', label: 'Task (Row 8)', type: 'text', placeholder: 'Task name' },
        { id: 'Desc_8', label: 'Description (Row 8)', type: 'textarea', placeholder: 'Task description' },
        // Row 9
        { id: 'No_9', label: 'No (Row 9)', type: 'number', placeholder: '9' },
        { id: 'Task_9', label: 'Task (Row 9)', type: 'text', placeholder: 'Task name' },
        { id: 'Desc_9', label: 'Description (Row 9)', type: 'textarea', placeholder: 'Task description' },
        // Row 10
        { id: 'No_10', label: 'No (Row 10)', type: 'number', placeholder: '10' },
        { id: 'Task_10', label: 'Task (Row 10)', type: 'text', placeholder: 'Task name' },
        { id: 'Desc_10', label: 'Description (Row 10)', type: 'textarea', placeholder: 'Task description' },
      ],
    },
    {
      id: 'footer',
      title: 'Footer',
      description: 'Supporting files and record information',
      visibleAtStages: ['Sent'],
      isStageGated: false,
      fields: [
        { id: 'Attachment', label: 'Attachment', type: 'file', placeholder: 'Supporting file attachment' },
        { id: 'DocAuthor', label: 'Created by', type: 'text', disabled: true, helperText: 'Computed — document author' },
        { id: 'CDate', label: 'Created on', type: 'date', disabled: true, helperText: 'Computed — creation date' },
      ],
    },
  ],
  hasConditionalSections: false,
  hideApprovalChain: true,
};

export const ITSSR: ITFormConfig = {
  code: 'ITSSR',
  name: 'IT Support & Service Request 2025',
  module: 'M2',
  moduleName: 'IT Support & Service Requests',
  icon: Headset,
  color: '#2563eb',
  description: 'Submit IT support or service request',
  stages: [
    { key: 'S1', name: 'Submission', order: 1, actor: 'Requester', description: 'Submit request' },
    { key: 'S2', name: 'Triage', order: 2, actor: 'IT Helpdesk', description: 'Helpdesk triages request' },
    { key: 'S3', name: 'Resolution', order: 3, actor: 'IT Technician', description: 'Tech resolves issue' },
    { key: 'S4', name: 'Requestor Acceptance', order: 4, actor: 'Requester', description: 'Requester accepts resolution' },
    { key: 'S5', name: 'Closure', order: 5, actor: 'IT Helpdesk', description: 'Ticket closed' },
  ],
  sections: [
    {
      id: 'requester-info',
      title: 'Requester Information',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5'],
      isStageGated: false,
      fields: [
        { id: 'ServiceType', label: 'Service Type', type: 'select', required: true, options: [
          { value: 'HARDWARE', label: 'Hardware' },
          { value: 'SOFTWARE', label: 'Software / Application' },
          { value: 'BANK', label: 'Bank System' },
        ]},
        { id: 'Company', label: 'Company', type: 'select', required: true, options: IOI_COMPANY_OPTIONS },
        { id: 'ReportedBy', label: 'Reported By', type: 'text', required: true, disabled: true, helperText: 'Auto-filled from your login' },
        { id: 'ReportedByEmail', label: 'Email', type: 'email', required: true, disabled: true },
        { id: 'Department', label: 'Department', type: 'select', required: true, options: IOI_DEPARTMENT_OPTIONS },
        { id: 'PhoneExtension', label: 'Phone Extension', type: 'text' },
        { id: 'CC', label: 'CC (Notify)', type: 'people', multipleSelection: true, helperText: 'IT team will be notified automatically; add additional recipients here' },
        { id: 'IssueDescription', label: 'Issue Description', type: 'textarea', required: true, placeholder: 'Describe the issue in detail' },
        { id: 'Priority', label: 'Priority', type: 'select', required: true, options: [
          { value: 'LOW', label: 'Low' },
          { value: 'MEDIUM', label: 'Medium' },
          { value: 'HIGH', label: 'High' },
          { value: 'CRITICAL', label: 'Critical' },
        ]},
      ],
    },
    {
      id: 'service-type-hardware',
      title: 'Hardware Issue Details',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5'],
      isStageGated: false,
      conditionalField: { field: 'ServiceType', value: 'HARDWARE' },
      fields: [
        { id: 'HardwareType', label: 'Hardware Type', type: 'select', required: true, options: [
          { value: 'PC_DESKTOP', label: 'PC / Desktop' },
          { value: 'LAPTOP', label: 'Laptop' },
          { value: 'PRINTER', label: 'Printer / Scanner' },
          { value: 'NETWORK', label: 'Network Device (switch, router, AP)' },
          { value: 'UPS', label: 'UPS / Power' },
          { value: 'MONITOR', label: 'Monitor / Display' },
          { value: 'PERIPHERAL', label: 'Peripheral (keyboard, mouse, etc.)' },
          { value: 'SERVER', label: 'Server' },
          { value: 'OTHER', label: 'Other' },
        ]},
        { id: 'AssetTag', label: 'Asset Tag / Serial No.', type: 'text', helperText: 'If known' },
        { id: 'HardwareLocation', label: 'Location / Room', type: 'text', required: true },
        { id: 'HardwareSymptoms', label: 'Symptoms / Error', type: 'textarea', required: true },
      ],
    },
    {
      id: 'service-type-application',
      title: 'Software / Application Issue Details',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5'],
      isStageGated: false,
      conditionalField: { field: 'ServiceType', value: 'SOFTWARE' },
      fields: [
        { id: 'ApplicationName', label: 'Application / System Name', type: 'text', required: true },
        { id: 'AppVersion', label: 'Version (if known)', type: 'text' },
        { id: 'AppErrorMessage', label: 'Error Message / Screenshot', type: 'textarea', required: true },
        { id: 'AppStepsToReproduce', label: 'Steps to Reproduce', type: 'textarea' },
      ],
    },
    {
      id: 'service-type-bank',
      title: 'Bank System Issue Details',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5'],
      isStageGated: false,
      conditionalField: { field: 'ServiceType', value: 'BANK' },
      fields: [
        { id: 'BankName', label: 'Bank', type: 'select', required: true, options: [
          { value: 'CIMB', label: 'CIMB' },
          { value: 'MAYBANK', label: 'Maybank' },
          { value: 'PUBLIC', label: 'Public Bank' },
          { value: 'HSBC', label: 'HSBC' },
          { value: 'UOB', label: 'UOB' },
          { value: 'OCBC', label: 'OCBC' },
          { value: 'RHB', label: 'RHB' },
          { value: 'AMBANK', label: 'AmBank' },
        ]},
        { id: 'BankIssueType', label: 'Issue Type', type: 'select', required: true, options: [
          { value: 'LOGIN', label: 'Login / Access Issue' },
          { value: 'TOKEN', label: 'Token / Authentication Problem' },
          { value: 'TRANSACTION', label: 'Transaction Error' },
          { value: 'OTHER', label: 'Other' },
        ]},
        { id: 'BankUserID', label: 'Bank User ID', type: 'text', helperText: 'Your bank system login ID' },
        { id: 'BankIssueDesc', label: 'Issue Description', type: 'textarea', required: true },
      ],
    },
    { id: 'triage', title: 'Triage Information', visibleAtStages: ['S2', 'S3', 'S4', 'S5'], isStageGated: true,
      fields: [
        { id: 'TriagePriority', label: 'Assigned Priority', type: 'select', options: [
          { value: 'LOW', label: 'Low' }, { value: 'MEDIUM', label: 'Medium' },
          { value: 'HIGH', label: 'High' }, { value: 'CRITICAL', label: 'Critical' },
        ]},
        { id: 'AssignedTo', label: 'Assigned Technician', type: 'people' },
        { id: 'TriageNotes', label: 'Triage Notes', type: 'textarea' },
      ],
    },
    { id: 'resolution', title: 'Resolution Details', visibleAtStages: ['S3', 'S4', 'S5'], isStageGated: true,
      fields: [
        { id: 'ResolutionType', label: 'Resolution Type', type: 'select', options: [
          { value: 'RESOLVED', label: 'Resolved' }, { value: 'WORKAROUND', label: 'Workaround Applied' },
          { value: 'ESCALATED', label: 'Escalated' }, { value: 'NO_FIX', label: 'No Fix Available' },
        ]},
        { id: 'ResolutionDescription', label: 'Resolution Description', type: 'textarea', required: true },
        { id: 'ResolvedBy', label: 'Resolved By', type: 'people' },
        { id: 'ResolvedDate', label: 'Resolution Date', type: 'date' },
      ],
    },
    { id: 'acceptance', title: 'User Acceptance', visibleAtStages: ['S4', 'S5'], isStageGated: true,
      fields: [
        { id: 'UserAcceptance', label: 'Acceptance Status', type: 'select', required: true, options: [
          { value: 'ACCEPTED', label: 'Accepted — Issue resolved' },
          { value: 'REJECTED', label: 'Rejected — Issue persists' },
        ]},
        { id: 'UserAcceptanceRemarks', label: 'Remarks', type: 'textarea' },
      ],
    },
    { id: 'closure', title: 'Closure Notes', visibleAtStages: ['S5'], isStageGated: true,
      fields: [
        { id: 'ClosureRemarks', label: 'Closure Remarks', type: 'textarea' },
        { id: 'ClosedDate', label: 'Closed Date', type: 'date', disabled: true },
      ],
    },
  ],
  database: 'MainDB_IT (PRAI)',
  hasConditionalSections: true,
  conditionalSectionDescription: 'Hardware, Software, or Bank detail section shown based on ServiceType selection',
  hideApprovalChain: true,
};

export const PRF: ITFormConfig = {
  code: 'PRF',
  name: 'Program Request Form 2025',
  module: 'M2',
  moduleName: 'IT Support & Service Requests',
  database: 'MainDB_IT (PRAI)',
  icon: FileCode,
  color: '#7c3aed',
  description: 'Request software or system development',
  stages: [
    { key: 'S1', name: 'Requesting', order: 1, actor: 'Requester', description: 'Submit program request' },
    { key: 'S2', name: 'Authorizing', order: 2, actor: 'Department Head', description: 'Dept head authorizes' },
    { key: 'S3', name: 'Triaging', order: 3, actor: 'IT Manager', description: 'IT triages request' },
    { key: 'S4', name: 'Function Review', order: 4, actor: 'SAP Functional', description: 'SAP functional review', isConditional: true, conditionField: 'IsSAP', conditionValue: 'Yes' },
    { key: 'S5', name: 'Processing', order: 5, actor: 'IT Developer', description: 'Development in progress' },
    { key: 'S6', name: 'Validating', order: 6, actor: 'Requester', description: 'User validates solution' },
  ],
  sections: [
    {
      id: 'requester-info',
      title: 'Requester Information',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
      isStageGated: false,
      fields: [
        { id: 'RequestorName', label: 'Requestor Name', type: 'text', required: true, disabled: true, helperText: 'Auto-filled from your login' },
        { id: 'RequestorEmail', label: 'Email', type: 'email', required: true, disabled: true },
        { id: 'Company', label: 'Company', type: 'select', required: true, options: IOI_COMPANY_OPTIONS },
        { id: 'Department', label: 'Department', type: 'select', required: true, options: IOI_DEPARTMENT_OPTIONS },
        { id: 'PhoneExtension', label: 'Phone Extension', type: 'text' },
        { id: 'RequestDate', label: 'Request Date', type: 'date', disabled: true },
        { id: 'HOD', label: 'Head of Department', type: 'people', required: true },
      ],
    },
    {
      id: 'program-details',
      title: 'Program / System Request Details',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
      isStageGated: false,
      fields: [
        { id: 'SystemList', label: 'System / Application', type: 'select', required: true, options: IOI_SYSTEM_OPTIONS },
        { id: 'RequestTitle', label: 'Request Title', type: 'text', required: true, placeholder: 'Brief title of the request' },
        { id: 'Objective', label: 'Objective', type: 'textarea', required: true, placeholder: 'What is the objective of this program/change?' },
        { id: 'Justification', label: 'Justification / Business Need', type: 'textarea', required: true, placeholder: 'Why is this needed? What is the business impact?' },
        { id: 'CurrentProcess', label: 'Current Process / Problem', type: 'textarea', required: true, placeholder: 'Describe the current process or problem to be solved' },
        { id: 'ExpectedOutcome', label: 'Expected Outcome', type: 'textarea', required: true, placeholder: 'Describe the expected result after implementation' },
        { id: 'IsSAP', label: 'Does this involve SAP?', type: 'select', required: true, options: [
          { value: 'Yes', label: 'Yes — involves SAP system' },
          { value: 'No', label: 'No — non-SAP system' },
        ]},
        { id: 'RequestedCompletionDate', label: 'Requested Completion Date', type: 'date' },
        { id: 'Attachment', label: 'Supporting Documents', type: 'file' },
      ],
    },
    { id: 'authorization', title: 'Authorization', visibleAtStages: ['S2', 'S3', 'S4', 'S5', 'S6'], isStageGated: true,
      fields: [
        { id: 'AuthStatus', label: 'Authorization Status', type: 'select', required: true, options: [
          { value: 'APPROVED', label: 'Approved' }, { value: 'REJECTED', label: 'Rejected' },
        ]},
        { id: 'AuthRemarks', label: 'Remarks', type: 'textarea' },
        { id: 'AuthBy', label: 'Authorized By', type: 'text', disabled: true },
        { id: 'AuthDate', label: 'Authorization Date', type: 'date', disabled: true },
      ],
    },
    { id: 'triage', title: 'IT Triage', visibleAtStages: ['S3', 'S4', 'S5', 'S6'], isStageGated: true,
      fields: [
        { id: 'TriageCategory', label: 'Category', type: 'select', options: [
          { value: 'NEW_FEATURE', label: 'New Feature' }, { value: 'ENHANCEMENT', label: 'Enhancement' },
          { value: 'BUG_FIX', label: 'Bug Fix' }, { value: 'CONFIGURATION', label: 'Configuration Change' },
        ]},
        { id: 'EstimatedEffort', label: 'Estimated Effort (days)', type: 'number' },
        { id: 'AssignedDeveloper', label: 'Assigned Developer', type: 'people' },
        { id: 'TriageRemarks', label: 'IT Remarks', type: 'textarea' },
      ],
    },
    { id: 'sap-review', title: 'SAP Functional Review', visibleAtStages: ['S4', 'S5', 'S6'], isStageGated: true,
      fields: [
        { id: 'SAPReviewStatus', label: 'Review Status', type: 'select', required: true, options: [
          { value: 'FEASIBLE', label: 'Feasible' }, { value: 'NOT_FEASIBLE', label: 'Not Feasible' }, { value: 'NEEDS_CLARIFICATION', label: 'Needs Clarification' },
        ]},
        { id: 'SAPRemarks', label: 'SAP Functional Remarks', type: 'textarea' },
        { id: 'SAPReviewedBy', label: 'Reviewed By', type: 'people' },
      ],
    },
    { id: 'development', title: 'Development Progress', visibleAtStages: ['S5', 'S6'], isStageGated: true,
      fields: [
        { id: 'DevStatus', label: 'Status', type: 'select', required: true, options: [
          { value: 'IN_PROGRESS', label: 'In Progress' }, { value: 'UAT_READY', label: 'Ready for UAT' }, { value: 'COMPLETED', label: 'Completed' },
        ]},
        { id: 'DevRemarks', label: 'Development Remarks', type: 'textarea' },
        { id: 'ActualEffort', label: 'Actual Effort (days)', type: 'number' },
      ],
    },
    { id: 'validation', title: 'User Validation', visibleAtStages: ['S6'], isStageGated: true,
      fields: [
        { id: 'ValidationStatus', label: 'Validation Result', type: 'select', required: true, options: [
          { value: 'PASSED', label: 'Passed — Accepted for production' }, { value: 'FAILED', label: 'Failed — Requires rework' },
        ]},
        { id: 'ValidationRemarks', label: 'Validation Remarks', type: 'textarea' },
        { id: 'ValidatedBy', label: 'Validated By', type: 'text', disabled: true },
        { id: 'ValidationDate', label: 'Validation Date', type: 'date', disabled: true },
      ],
    },
  ],
  hasConditionalSections: true,
  conditionalSectionDescription: 'SAP Functional section visible when IsSAP="Yes"; SAP section conditional on S4 stage',
  hideApprovalChain: true,
};

export const VPN: ITFormConfig = {
  code: 'VPN',
  name: 'VPN Request Form',
  module: 'M2',
  moduleName: 'IT Support & Service Requests',
  icon: Key,
  color: '#0284c7',
  description: 'Request VPN access for remote connectivity',
  database: 'MainDB_IT (PRAI)',
  stages: [
    { key: 'S1', name: 'Submission', order: 1, actor: 'Requester', description: 'Submit VPN request' },
    { key: 'S2', name: 'HOD Approval', order: 2, actor: 'Head of Department', description: 'Department head approval' },
    { key: 'S3', name: 'IT Processing', order: 3, actor: 'IT Infrastructure', description: 'IT processes VPN access' },
    { key: 'S4', name: 'Completion', order: 4, actor: 'IT Infrastructure', description: 'VPN access granted' },
  ],
  sections: [
    {
      id: 'requestor-section',
      title: 'Requestor Information',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4'],
      isStageGated: false,
      fields: [
        { id: 'RequestNo', label: 'Request Number', type: 'text', disabled: true },
        { id: 'Company', label: 'Company', type: 'select', required: true, options: [
          { value: 'IOI Corporation Berhad', label: 'IOI Corporation Berhad' },
          { value: 'IOI Oleochemical Industries Berhad', label: 'IOI Oleochemical Industries Berhad' },
          { value: 'IOI Acidchem Sdn Bhd', label: 'IOI Acidchem Sdn Bhd' },
          { value: 'IOI Pan-Century Oleochemicals Sdn Bhd', label: 'IOI Pan-Century Oleochemicals Sdn Bhd' },
          { value: 'IOI Pan-Century Edible Oils Sdn Bhd', label: 'IOI Pan-Century Edible Oils Sdn Bhd' },
          { value: 'Loders Croklaan Asia Pacific Sdn Bhd', label: 'Loders Croklaan Asia Pacific Sdn Bhd' },
          { value: 'IOI Bio-Energy Sdn Bhd', label: 'IOI Bio-Energy Sdn Bhd' },
          { value: 'Bunge Loders Croklaan', label: 'Bunge Loders Croklaan' },
          { value: 'IOI Edible Oils Sdn Bhd', label: 'IOI Edible Oils Sdn Bhd' },
          { value: 'Pan-Century Surfactants Sdn Bhd', label: 'Pan-Century Surfactants Sdn Bhd' },
        ]},
        { id: 'RequestorName', label: 'Requestor Name', type: 'people', required: true },
        { id: 'Department', label: 'Department', type: 'select', required: true, options: [
          { value: 'Information Technology', label: 'Information Technology' },
          { value: 'Human Resources', label: 'Human Resources' },
          { value: 'Finance', label: 'Finance' },
          { value: 'Accounts', label: 'Accounts' },
          { value: 'Production', label: 'Production' },
          { value: 'Quality Assurance', label: 'Quality Assurance' },
          { value: 'Quality Control', label: 'Quality Control' },
          { value: 'Warehouse', label: 'Warehouse' },
          { value: 'Logistics', label: 'Logistics' },
          { value: 'Engineering', label: 'Engineering' },
          { value: 'Maintenance', label: 'Maintenance' },
          { value: 'Administration', label: 'Administration' },
          { value: 'Marketing', label: 'Marketing' },
          { value: 'Sales', label: 'Sales' },
          { value: 'Procurement', label: 'Procurement' },
          { value: 'HSE', label: 'HSE' },
          { value: 'Plant Operations', label: 'Plant Operations' },
          { value: 'R&D', label: 'R&D' },
          { value: 'Other', label: 'Other' },
        ]},
        { id: 'PhoneExt', label: 'Phone Extension', type: 'text' },
        { id: 'EmailAddress', label: 'Email Address', type: 'email', required: true },
        { id: 'HOD', label: 'Head of Department', type: 'people', required: true },
        { id: 'CC', label: 'CC', type: 'people', multipleSelection: true },
        { id: 'SubmittedDate', label: 'Submitted Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'vpn-details',
      title: 'VPN Access Details',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4'],
      isStageGated: false,
      fields: [
        { id: 'VPNType', label: 'VPN Type', type: 'select', required: true, options: [
          { value: 'SSL_VPN', label: 'SSL VPN (FortiClient)' },
          { value: 'IPSEC', label: 'IPSec VPN' },
          { value: 'SITE_TO_SITE', label: 'Site-to-Site VPN' },
        ]},
        { id: 'AccessType', label: 'Access Type', type: 'select', required: true, options: [
          { value: 'NEW', label: 'New Access' },
          { value: 'MODIFY', label: 'Modify Existing' },
          { value: 'REMOVE', label: 'Remove Access' },
          { value: 'RENEW', label: 'Renew Access' },
        ]},
        { id: 'UserID', label: 'User ID (Domain\\UserID)', type: 'text', required: true, placeholder: 'e.g., IOIOLEO\\John.Smith' },
        { id: 'AccessDuration', label: 'Access Duration', type: 'select', required: true, options: [
          { value: '1_MONTH', label: '1 Month' },
          { value: '3_MONTHS', label: '3 Months' },
          { value: '6_MONTHS', label: '6 Months' },
          { value: '1_YEAR', label: '1 Year' },
          { value: 'PERMANENT', label: 'Permanent' },
        ]},
        { id: 'StartDate', label: 'Start Date', type: 'date', required: true },
        { id: 'EndDate', label: 'End Date', type: 'date' },
      ],
    },
    {
      id: 'access-requirements',
      title: 'Access Requirements',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4'],
      isStageGated: false,
      fields: [
        { id: 'SystemsToAccess', label: 'Systems to Access', type: 'textarea', required: true, placeholder: 'List systems/applications requiring VPN access' },
        { id: 'Purpose', label: 'Purpose/Business Justification', type: 'textarea', required: true },
        { id: 'WorkLocation', label: 'Work Location', type: 'select', required: true, options: [
          { value: 'HOME', label: 'Home Office' },
          { value: 'CLIENT_SITE', label: 'Client Site' },
          { value: 'REMOTE_OFFICE', label: 'Remote Office' },
          { value: 'TRAVEL', label: 'Business Travel' },
          { value: 'OTHER', label: 'Other' },
        ]},
        { id: 'DeviceType', label: 'Device Type', type: 'select', required: true, options: [
          { value: 'COMPANY_LAPTOP', label: 'Company Laptop' },
          { value: 'COMPANY_DESKTOP', label: 'Company Desktop' },
          { value: 'PERSONAL_DEVICE', label: 'Personal Device (BYOD)' },
        ]},
        { id: 'Attachment', label: 'Supporting Documents', type: 'file' },
      ],
    },
    {
      id: 'hod-approval',
      title: 'HOD Approval',
      visibleAtStages: ['S2', 'S3', 'S4'],
      isStageGated: true,
      fields: [
        { id: 'HODStatus', label: 'Approval Status', type: 'select', required: true, options: [
          { value: 'APPROVED', label: 'Approved' },
          { value: 'REJECTED', label: 'Rejected' },
        ]},
        { id: 'HODRemarks', label: 'HOD Remarks', type: 'textarea' },
        { id: 'HODApprovedBy', label: 'Approved By', type: 'text', disabled: true },
        { id: 'HODApprovedDate', label: 'Approved Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'it-processing',
      title: 'IT Processing',
      visibleAtStages: ['S3', 'S4'],
      isStageGated: true,
      fields: [
        { id: 'ITTechnician', label: 'Assigned Technician', type: 'people' },
        { id: 'VPNProfile', label: 'VPN Profile Assigned', type: 'text' },
        { id: 'IPAddress', label: 'IP Address Assigned', type: 'text' },
        { id: 'ProcessingStatus', label: 'Processing Status', type: 'select', required: true, options: [
          { value: 'IN_PROGRESS', label: 'In Progress' },
          { value: 'PENDING_INFO', label: 'Pending Information' },
          { value: 'COMPLETED', label: 'Completed' },
          { value: 'REJECTED', label: 'Rejected' },
        ]},
        { id: 'ITRemarks', label: 'IT Remarks', type: 'textarea' },
      ],
    },
    {
      id: 'completion',
      title: 'Completion',
      visibleAtStages: ['S4'],
      isStageGated: true,
      fields: [
        { id: 'CompletionDate', label: 'Completion Date', type: 'date', required: true },
        { id: 'CredentialsSent', label: 'Credentials Sent To', type: 'people' },
        { id: 'InstructionsSent', label: 'Setup Instructions Sent', type: 'checkbox' },
        { id: 'CompletionRemarks', label: 'Completion Remarks', type: 'textarea' },
        { id: 'CompletedBy', label: 'Completed By', type: 'text', disabled: true },
      ],
    },
  ],
  hasConditionalSections: false,
};

export const EDL: ITFormConfig = {
  code: 'EDL',
  name: 'Email Distribution List Request',
  module: 'M2',
  moduleName: 'IT Support & Service Requests',
  icon: Mail,
  color: '#8b5cf6',
  description: 'Request to create, modify, or delete email distribution lists',
  database: 'MainDB_IT (PRAI)',
  stages: [
    { key: 'S1', name: 'Submission', order: 1, actor: 'Requester', description: 'Submit distribution list request' },
    { key: 'S2', name: 'HOD Approval', order: 2, actor: 'Head of Department', description: 'Department head approval' },
    { key: 'S3', name: 'IT Processing', order: 3, actor: 'IT Admin', description: 'IT processes the request' },
  ],
  sections: [
    {
      id: 'requestor-section',
      title: 'Requestor Information',
      visibleAtStages: ['S1', 'S2', 'S3'],
      isStageGated: false,
      fields: [
        { id: 'RequestNo', label: 'Request Number', type: 'text', disabled: true },
        { id: 'Company', label: 'Company', type: 'select', required: true, options: [
          { value: 'IOI Corporation Berhad', label: 'IOI Corporation Berhad' },
          { value: 'IOI Oleochemical Industries Berhad', label: 'IOI Oleochemical Industries Berhad' },
          { value: 'IOI Acidchem Sdn Bhd', label: 'IOI Acidchem Sdn Bhd' },
          { value: 'IOI Pan-Century Oleochemicals Sdn Bhd', label: 'IOI Pan-Century Oleochemicals Sdn Bhd' },
          { value: 'IOI Pan-Century Edible Oils Sdn Bhd', label: 'IOI Pan-Century Edible Oils Sdn Bhd' },
          { value: 'Loders Croklaan Asia Pacific Sdn Bhd', label: 'Loders Croklaan Asia Pacific Sdn Bhd' },
          { value: 'IOI Bio-Energy Sdn Bhd', label: 'IOI Bio-Energy Sdn Bhd' },
          { value: 'Bunge Loders Croklaan', label: 'Bunge Loders Croklaan' },
        ]},
        { id: 'RequestorName', label: 'Requestor Name', type: 'people', required: true },
        { id: 'Department', label: 'Department', type: 'select', required: true, options: [
          { value: 'Information Technology', label: 'Information Technology' },
          { value: 'Human Resources', label: 'Human Resources' },
          { value: 'Finance', label: 'Finance' },
          { value: 'Accounts', label: 'Accounts' },
          { value: 'Production', label: 'Production' },
          { value: 'Quality Assurance', label: 'Quality Assurance' },
          { value: 'Quality Control', label: 'Quality Control' },
          { value: 'Warehouse', label: 'Warehouse' },
          { value: 'Logistics', label: 'Logistics' },
          { value: 'Engineering', label: 'Engineering' },
          { value: 'Maintenance', label: 'Maintenance' },
          { value: 'Administration', label: 'Administration' },
          { value: 'Marketing', label: 'Marketing' },
          { value: 'Sales', label: 'Sales' },
          { value: 'Procurement', label: 'Procurement' },
          { value: 'HSE', label: 'HSE' },
          { value: 'Other', label: 'Other' },
        ]},
        { id: 'PhoneExt', label: 'Phone Extension', type: 'text' },
        { id: 'EmailAddress', label: 'Email Address', type: 'email', required: true },
        { id: 'HOD', label: 'Head of Department', type: 'people', required: true },
        { id: 'CC', label: 'CC', type: 'people', multipleSelection: true },
        { id: 'SubmittedDate', label: 'Submitted Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'dl-details',
      title: 'Distribution List Details',
      visibleAtStages: ['S1', 'S2', 'S3'],
      isStageGated: false,
      fields: [
        { id: 'RequestType', label: 'Request Type', type: 'select', required: true, options: [
          { value: 'CREATE', label: 'Create New Distribution List' },
          { value: 'MODIFY', label: 'Modify Existing Distribution List' },
          { value: 'DELETE', label: 'Delete Distribution List' },
        ]},
        { id: 'DLName', label: 'Distribution List Name', type: 'text', required: true, placeholder: 'e.g., IT-Support-Team' },
        { id: 'DLEmail', label: 'Distribution List Email', type: 'email', required: true, placeholder: 'e.g., it-support@ioioleo.com' },
        { id: 'DLType', label: 'Distribution List Type', type: 'select', required: true, options: [
          { value: 'DEPARTMENT', label: 'Department List' },
          { value: 'PROJECT', label: 'Project Team' },
          { value: 'ANNOUNCEMENT', label: 'Announcement List' },
          { value: 'EXTERNAL', label: 'External Communication' },
          { value: 'OTHER', label: 'Other' },
        ]},
        { id: 'Purpose', label: 'Purpose/Description', type: 'textarea', required: true },
      ],
    },
    {
      id: 'members-section',
      title: 'Distribution List Members',
      visibleAtStages: ['S1', 'S2', 'S3'],
      isStageGated: false,
      fields: [
        { id: 'DLOwner', label: 'Distribution List Owner', type: 'people', required: true, helperText: 'Person responsible for managing the list' },
        { id: 'MembersToAdd', label: 'Members to Add', type: 'textarea', placeholder: 'List email addresses to add, one per line' },
        { id: 'MembersToRemove', label: 'Members to Remove', type: 'textarea', placeholder: 'List email addresses to remove, one per line' },
        { id: 'ExternalMembers', label: 'External Members', type: 'textarea', placeholder: 'List external email addresses (non-IOI), one per line' },
        { id: 'AllowExternalSenders', label: 'Allow External Senders', type: 'select', options: [
          { value: 'YES', label: 'Yes - Allow external emails' },
          { value: 'NO', label: 'No - Internal only' },
        ]},
      ],
    },
    {
      id: 'justification-section',
      title: 'Justification',
      visibleAtStages: ['S1', 'S2', 'S3'],
      isStageGated: false,
      fields: [
        { id: 'BusinessJustification', label: 'Business Justification', type: 'textarea', required: true },
        { id: 'Attachment', label: 'Supporting Documents', type: 'file' },
      ],
    },
    {
      id: 'hod-approval',
      title: 'HOD Approval',
      visibleAtStages: ['S2', 'S3'],
      isStageGated: true,
      fields: [
        { id: 'HODStatus', label: 'Approval Status', type: 'select', required: true, options: [
          { value: 'APPROVED', label: 'Approved' },
          { value: 'REJECTED', label: 'Rejected' },
        ]},
        { id: 'HODRemarks', label: 'HOD Remarks', type: 'textarea' },
        { id: 'HODApprovedBy', label: 'Approved By', type: 'text', disabled: true },
        { id: 'HODApprovedDate', label: 'Approved Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'it-processing',
      title: 'IT Processing',
      visibleAtStages: ['S3'],
      isStageGated: true,
      fields: [
        { id: 'ITTechnician', label: 'Processed By', type: 'people' },
        { id: 'FinalDLEmail', label: 'Final Distribution List Email', type: 'email' },
        { id: 'MembersAdded', label: 'Members Added', type: 'number' },
        { id: 'MembersRemoved', label: 'Members Removed', type: 'number' },
        { id: 'ProcessingStatus', label: 'Processing Status', type: 'select', required: true, options: [
          { value: 'COMPLETED', label: 'Completed' },
          { value: 'PARTIAL', label: 'Partially Completed' },
          { value: 'REJECTED', label: 'Rejected' },
        ]},
        { id: 'ITRemarks', label: 'IT Remarks', type: 'textarea' },
        { id: 'ProcessedDate', label: 'Processed Date', type: 'date', disabled: true },
      ],
    },
  ],
  hasConditionalSections: false,
};

// =============================================================================
// MODULE 3: HARDWARE & INFRASTRUCTURE (4 Forms)
// =============================================================================

export const HI: ITFormConfig = {
  code: 'HI',
  name: 'Hardware Inventory Form',
  module: 'M3',
  moduleName: 'Hardware & Infrastructure',
  icon: HardDrive,
  color: '#059669',
  description: 'Register and manage IT hardware inventory',
  database: 'MainDB_IT (PRAI)',
  stages: [
    { key: 'Registration', name: 'Registration', order: 1, actor: 'IT Staff', description: 'Register new hardware' },
    { key: 'Update', name: 'Update', order: 2, actor: 'IT Manager', description: 'Review and update details' },
    { key: 'Audit', name: 'Audit', order: 3, actor: 'IT Auditor', description: 'Audit and approve' },
  ],
  sections: [
    {
      id: 'equipment-info',
      title: 'Equipment Information',
      visibleAtStages: ['Registration', 'Update', 'Audit'],
      isStageGated: false,
      fields: [
        { id: 'equipmentId', label: 'Equipment ID', type: 'text', required: true, placeholder: 'Auto-generated' },
        { id: 'equipmentType', label: 'Equipment Type', type: 'select', required: true, options: [
          { value: 'laptop', label: 'Laptop' },
          { value: 'desktop', label: 'Desktop PC' },
          { value: 'monitor', label: 'Monitor' },
          { value: 'printer', label: 'Printer' },
          { value: 'server', label: 'Server' },
          { value: 'network', label: 'Network Equipment' },
          { value: 'other', label: 'Other' },
        ]},
        { id: 'serialNumber', label: 'Serial Number', type: 'text', required: true, placeholder: 'Enter serial number' },
        { id: 'assetTag', label: 'Asset Tag', type: 'text', required: true, placeholder: 'IOI-IT-XXXX' },
      ],
    },
    {
      id: 'location-owner',
      title: 'Location & Ownership',
      visibleAtStages: ['Registration', 'Update', 'Audit'],
      isStageGated: false,
      fields: [
        { id: 'site', label: 'Site', type: 'select', required: true, options: [
          { value: 'MY-PR', label: 'MY-PR (Prai)' },
          { value: 'MY-JH', label: 'MY-JH (Johor)' },
        ]},
        { id: 'location', label: 'Location/Building', type: 'text', required: true, placeholder: 'e.g., HQ Building, Level 3' },
        { id: 'department', label: 'Department', type: 'text', required: true },
        { id: 'assignedUser', label: 'Assigned User', type: 'text', placeholder: 'Employee name' },
      ],
    },
    {
      id: 'acquisition',
      title: 'Acquisition Details',
      visibleAtStages: ['Registration', 'Update', 'Audit'],
      isStageGated: false,
      fields: [
        { id: 'acquisitionDate', label: 'Acquisition Date', type: 'date', required: true },
        { id: 'purchasePrice', label: 'Purchase Price (MYR)', type: 'number', placeholder: '0.00' },
        { id: 'vendor', label: 'Vendor', type: 'text', placeholder: 'Vendor name' },
        { id: 'warrantyExpiry', label: 'Warranty Expiry', type: 'date' },
      ],
    },
    {
      id: 'condition-status',
      title: 'Condition & Status',
      visibleAtStages: ['Registration', 'Update', 'Audit'],
      isStageGated: false,
      fields: [
        { id: 'condition', label: 'Condition', type: 'select', required: true, options: [
          { value: 'new', label: 'New' },
          { value: 'good', label: 'Good' },
          { value: 'fair', label: 'Fair' },
          { value: 'poor', label: 'Poor' },
          { value: 'retired', label: 'Retired' },
        ]},
        { id: 'status', label: 'Status', type: 'select', required: true, options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'maintenance', label: 'Under Maintenance' },
          { value: 'disposed', label: 'Disposed' },
        ]},
        { id: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Additional notes about this equipment' },
      ],
    },
    {
      id: 'audit-section',
      title: 'Audit Information',
      visibleAtStages: ['Audit'],
      isStageGated: true,
      fields: [
        { id: 'auditDate', label: 'Audit Date', type: 'date', required: true },
        { id: 'auditor', label: 'Auditor Name', type: 'text', required: true },
        { id: 'auditResult', label: 'Audit Result', type: 'select', required: true, options: [
          { value: 'pass', label: 'Pass' },
          { value: 'fail', label: 'Fail' },
          { value: 'pending', label: 'Pending Review' },
        ]},
        { id: 'auditComments', label: 'Audit Comments', type: 'textarea' },
      ],
    },
  ],
  hasConditionalSections: true,
  conditionalSectionDescription: 'Audit section visible at Audit stage only',
};

export const ITSC: ITFormConfig = {
  code: 'ITSC',
  name: 'IT Server Checklist',
  module: 'M3',
  moduleName: 'Hardware & Infrastructure',
  icon: Server,
  color: '#dc2626',
  description: 'Server monitoring and health checklist',
  database: 'MainDB_IT (PRAI)',
  stages: [
    { key: 'Monitoring', name: 'Monitoring', order: 1, actor: 'IT Staff', description: 'Complete server checks' },
    { key: 'Review', name: 'Systems Manager Review', order: 2, actor: 'Systems Manager', description: 'Manager reviews and approves' },
  ],
  sections: [
    {
      id: 'server-identification',
      title: 'Server Identification',
      visibleAtStages: ['Monitoring', 'Review'],
      isStageGated: false,
      fields: [
        { id: 'serverName', label: 'Server Name', type: 'text', required: true },
        { id: 'serverType', label: 'Server Type', type: 'select', required: true, options: [
          { value: 'physical', label: 'Physical Server' },
          { value: 'virtual', label: 'Virtual Machine' },
          { value: 'saphana', label: 'SAP HANA' },
          { value: 'database', label: 'Database Server' },
          { value: 'application', label: 'Application Server' },
        ]},
        { id: 'ipAddress', label: 'IP Address', type: 'text', required: true },
        { id: 'os', label: 'Operating System', type: 'text' },
      ],
    },
    {
      id: 'health-metrics',
      title: 'Health Metrics',
      visibleAtStages: ['Monitoring', 'Review'],
      isStageGated: false,
      fields: [
        { id: 'cpuUsage', label: 'CPU Usage (%)', type: 'number', required: true, placeholder: '0-100' },
        { id: 'memoryUsage', label: 'Memory Usage (%)', type: 'number', required: true, placeholder: '0-100' },
        { id: 'diskUsage', label: 'Disk Usage (%)', type: 'number', required: true, placeholder: '0-100' },
        { id: 'uptime', label: 'Uptime (days)', type: 'number' },
      ],
    },
    {
      id: 'backup-status',
      title: 'Backup Status',
      visibleAtStages: ['Monitoring', 'Review'],
      isStageGated: false,
      fields: [
        { id: 'lastBackup', label: 'Last Backup Date', type: 'date', required: true },
        { id: 'backupStatus', label: 'Backup Status', type: 'select', required: true, options: [
          { value: 'success', label: 'Successful' },
          { value: 'failed', label: 'Failed' },
          { value: 'partial', label: 'Partial' },
          { value: 'pending', label: 'Pending' },
        ]},
        { id: 'backupSize', label: 'Backup Size (GB)', type: 'number' },
      ],
    },
    {
      id: 'sap-hana-section',
      title: 'SAP HANA Metrics',
      description: 'HANA-specific monitoring metrics',
      visibleAtStages: ['Monitoring', 'Review'],
      isStageGated: false,
      conditionalField: { field: 'serverType', value: 'saphana' },
      fields: [
        { id: 'hanaMemory', label: 'HANA Memory Usage (GB)', type: 'number', required: true },
        { id: 'hanaAlerts', label: 'Active Alerts', type: 'number' },
        { id: 'hanaReplication', label: 'Replication Status', type: 'select', options: [
          { value: 'active', label: 'Active' },
          { value: 'syncing', label: 'Syncing' },
          { value: 'error', label: 'Error' },
          { value: 'disabled', label: 'Disabled' },
        ]},
        { id: 'hanaResponseTime', label: 'Response Time (ms)', type: 'number' },
      ],
    },
    {
      id: 'manager-review',
      title: 'Systems Manager Review',
      visibleAtStages: ['Review'],
      isStageGated: true,
      fields: [
        { id: 'reviewDate', label: 'Review Date', type: 'date', required: true },
        { id: 'reviewerName', label: 'Reviewer Name', type: 'text', required: true },
        { id: 'reviewStatus', label: 'Review Status', type: 'select', required: true, options: [
          { value: 'approved', label: 'Approved' },
          { value: 'attention', label: 'Needs Attention' },
          { value: 'critical', label: 'Critical Issues' },
        ]},
        { id: 'reviewComments', label: 'Review Comments', type: 'textarea' },
      ],
    },
  ],
  hasConditionalSections: true,
  conditionalSectionDescription: 'SAP HANA section visible when server type is SAP HANA',
};

export const HI_JHR: ITFormConfig = {
  code: 'HI_JHR',
  name: 'PanCen Hardware Inventory (Johor)',
  module: 'M3',
  moduleName: 'Hardware & Infrastructure',
  icon: HardDrive,
  color: '#0891b2',
  description: 'Hardware inventory for Johor PanCen site',
  database: 'MainDB_IT_JHR',
  stages: [
    { key: 'Registration', name: 'Registration', order: 1, actor: 'IT Staff', description: 'Single-stage registration' },
  ],
  sections: [
    {
      id: 'hardware-type',
      title: 'Hardware Type Selection',
      visibleAtStages: ['Registration'],
      isStageGated: false,
      fields: [
        { id: 'inventoryType', label: 'Inventory Type', type: 'select', required: true, options: [
          { value: 'new', label: 'New Inventory' },
          { value: 'network', label: 'Network Equipment' },
          { value: 'mspprinter', label: 'MSP Network Printer' },
        ]},
      ],
    },
    {
      id: 'new-inventory-section',
      title: 'New Inventory Details',
      visibleAtStages: ['Registration'],
      isStageGated: false,
      conditionalField: { field: 'inventoryType', value: 'new' },
      fields: [
        { id: 'equipmentName', label: 'Equipment Name', type: 'text', required: true },
        { id: 'brand', label: 'Brand', type: 'text', required: true },
        { id: 'model', label: 'Model', type: 'text', required: true },
        { id: 'serialNumber', label: 'Serial Number', type: 'text', required: true },
        { id: 'location', label: 'Location', type: 'text', required: true, helperText: 'Johor site locations only' },
        { id: 'purchaseDate', label: 'Purchase Date', type: 'date', required: true },
      ],
    },
    {
      id: 'network-section',
      title: 'Network Equipment Details',
      visibleAtStages: ['Registration'],
      isStageGated: false,
      conditionalField: { field: 'inventoryType', value: 'network' },
      fields: [
        { id: 'deviceName', label: 'Device Name', type: 'text', required: true },
        { id: 'deviceType', label: 'Device Type', type: 'select', required: true, options: [
          { value: 'switch', label: 'Switch' },
          { value: 'router', label: 'Router' },
          { value: 'firewall', label: 'Firewall' },
          { value: 'ap', label: 'Access Point' },
        ]},
        { id: 'ipAddress', label: 'IP Address', type: 'text', required: true },
        { id: 'macAddress', label: 'MAC Address', type: 'text', required: true },
        { id: 'vlan', label: 'VLAN', type: 'text' },
        { id: 'portCount', label: 'Port Count', type: 'number' },
      ],
    },
    {
      id: 'msp-printer-section',
      title: 'MSP Network Printer Details',
      visibleAtStages: ['Registration'],
      isStageGated: false,
      conditionalField: { field: 'inventoryType', value: 'mspprinter' },
      fields: [
        { id: 'printerName', label: 'Printer Name', type: 'text', required: true },
        { id: 'printerModel', label: 'Printer Model', type: 'text', required: true },
        { id: 'printerIP', label: 'IP Address', type: 'text', required: true },
        { id: 'tonerCapacity', label: 'Toner Capacity (%)', type: 'number', placeholder: '0-100' },
        { id: 'pageCount', label: 'Page Count', type: 'number' },
        { id: 'maintenanceDate', label: 'Last Maintenance', type: 'date' },
      ],
    },
  ],
  hasConditionalSections: true,
  conditionalSectionDescription: 'Dynamic hardware type switch: New Inventory / Network / MSP Network Printer',
};

export const SRVR: ITFormConfig = {
  code: 'SRVR',
  name: 'Server Request Form',
  module: 'M3',
  moduleName: 'Hardware & Infrastructure',
  icon: Server,
  color: '#7c3aed',
  description: 'Request new server provisioning, modification, or decommissioning',
  database: 'MainDB_IT (PRAI)',
  extensionTable: 'infra',
  extensionTransform: (formData) => ({
    sRVRSite: fieldValue(formData, 'Site'),
    sRVRDept: fieldValue(formData, 'Department'),
    sRVRRequestType: fieldValue(formData, 'RequestType'),
    sRVRServerType: fieldValue(formData, 'ServerType'),
    sRVRServerName: fieldValue(formData, 'ServerName'),
    sRVROS: fieldValue(formData, 'OS'),
    sRVRCPU: fieldValue(formData, 'CPU'),
    sRVRMemory: fieldValue(formData, 'Memory'),
    sRVRStorage: fieldValue(formData, 'Storage'),
    sRVRNetwork: fieldValue(formData, 'Network'),
    sRVRApplication: fieldValue(formData, 'Application'),
    sRVRPurpose: fieldValue(formData, 'Purpose'),
    sRVRRequiredDate: fieldValue(formData, 'RequiredDate'),
    sRVRHODEmail: fieldValue(formData, 'HOD'),
    sRVREstimatedCost: fieldNumber(formData, 'EstimatedCost'),
  }),
  stages: [
    { key: 'S1', name: 'Submission', order: 1, actor: 'Requester', description: 'Submit server request' },
    { key: 'S2', name: 'IT Review', order: 2, actor: 'IT Infrastructure', description: 'IT reviews request' },
    { key: 'S3', name: 'HOD Approval', order: 3, actor: 'HOD', description: 'Department head approval' },
    { key: 'S4', name: 'IT Processing', order: 4, actor: 'IT Infrastructure', description: 'IT provisions server' },
    { key: 'S5', name: 'Completion', order: 5, actor: 'IT Infrastructure', description: 'Request completed' },
  ],
  sections: [
    {
      id: 'requestor-section',
      title: 'Requestor Information',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5'],
      isStageGated: false,
      fields: [
        { id: 'RequestNo', label: 'Request Number', type: 'text', disabled: true },
        { id: 'Company', label: 'Company', type: 'select', required: true, options: [
          { value: 'IOI Oleochemical Industries Berhad', label: 'IOI Oleochemical Industries Berhad' },
          { value: 'IOI Acidchem Sdn Bhd', label: 'IOI Acidchem Sdn Bhd' },
          { value: 'IOI Pan-Century Oleochemicals Sdn Bhd', label: 'IOI Pan-Century Oleochemicals Sdn Bhd' },
          { value: 'IOI Pan-Century Edible Oils Sdn Bhd', label: 'IOI Pan-Century Edible Oils Sdn Bhd' },
          { value: 'Loders Croklaan Asia Pacific Sdn Bhd', label: 'Loders Croklaan Asia Pacific Sdn Bhd' },
          { value: 'Bunge Loders Croklaan', label: 'Bunge Loders Croklaan' },
          { value: 'IOI Edible Oils Sdn Bhd', label: 'IOI Edible Oils Sdn Bhd' },
          { value: 'Pan-Century Surfactants Sdn Bhd', label: 'Pan-Century Surfactants Sdn Bhd' },
        ]},
        { id: 'Site', label: 'Site', type: 'select', required: true, options: [
          { value: 'MY-PR', label: 'Prai (MY-PR)' },
          { value: 'MY-JH', label: 'Johor (MY-JH)' },
        ]},
        { id: 'RequestorName', label: 'Requestor Name', type: 'people', required: true },
        { id: 'Department', label: 'Department', type: 'select', required: true, options: [
          { value: 'Information Technology', label: 'Information Technology' },
          { value: 'Human Resources', label: 'Human Resources' },
          { value: 'Finance', label: 'Finance' },
          { value: 'Accounts', label: 'Accounts' },
          { value: 'Production', label: 'Production' },
          { value: 'Quality Assurance', label: 'Quality Assurance' },
          { value: 'Quality Control', label: 'Quality Control' },
          { value: 'Warehouse', label: 'Warehouse' },
          { value: 'Logistics', label: 'Logistics' },
          { value: 'Engineering', label: 'Engineering' },
          { value: 'Maintenance', label: 'Maintenance' },
          { value: 'Administration', label: 'Administration' },
          { value: 'Marketing', label: 'Marketing' },
          { value: 'Sales', label: 'Sales' },
          { value: 'Procurement', label: 'Procurement' },
          { value: 'HSE', label: 'HSE' },
          { value: 'Plant Operations', label: 'Plant Operations' },
          { value: 'R&D', label: 'R&D' },
          { value: 'Other', label: 'Other' },
        ]},
        { id: 'PhoneExt', label: 'Phone Extension', type: 'text' },
        { id: 'HOD', label: 'Head of Department', type: 'people', required: true },
        { id: 'CC', label: 'CC', type: 'people', multipleSelection: true },
        { id: 'SubmittedDate', label: 'Submitted Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'server-details',
      title: 'Server Details',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5'],
      isStageGated: false,
      fields: [
        { id: 'RequestType', label: 'Request Type', type: 'select', required: true, options: [
          { value: 'NEW', label: 'New Server' },
          { value: 'MODIFY', label: 'Modify Existing Server' },
          { value: 'DECOMMISSION', label: 'Decommission Server' },
          { value: 'MIGRATION', label: 'Server Migration' },
          { value: 'UPGRADE', label: 'Server Upgrade' },
        ]},
        { id: 'ServerType', label: 'Server Type', type: 'select', required: true, options: [
          { value: 'PHYSICAL', label: 'Physical Server' },
          { value: 'VIRTUAL', label: 'Virtual Machine' },
          { value: 'CLOUD', label: 'Cloud Instance' },
        ]},
        { id: 'ServerName', label: 'Server Name', type: 'text', required: true, placeholder: 'e.g., SVR-PROD-01' },
        { id: 'OS', label: 'Operating System', type: 'select', required: true, options: [
          { value: 'WIN_SRV_2022', label: 'Windows Server 2022' },
          { value: 'WIN_SRV_2019', label: 'Windows Server 2019' },
          { value: 'WIN_SRV_2016', label: 'Windows Server 2016' },
          { value: 'RHEL_9', label: 'Red Hat Enterprise Linux 9' },
          { value: 'RHEL_8', label: 'Red Hat Enterprise Linux 8' },
          { value: 'SUSE_15', label: 'SUSE Linux Enterprise 15' },
          { value: 'UBUNTU_22', label: 'Ubuntu Server 22.04 LTS' },
          { value: 'OTHER', label: 'Other' },
        ]},
        { id: 'CPU', label: 'CPU (Cores)', type: 'select', required: true, options: [
          { value: '2', label: '2 Cores' },
          { value: '4', label: '4 Cores' },
          { value: '8', label: '8 Cores' },
          { value: '16', label: '16 Cores' },
          { value: '32', label: '32 Cores' },
          { value: 'OTHER', label: 'Other (specify in remarks)' },
        ]},
        { id: 'Memory', label: 'Memory (RAM)', type: 'select', required: true, options: [
          { value: '4GB', label: '4 GB' },
          { value: '8GB', label: '8 GB' },
          { value: '16GB', label: '16 GB' },
          { value: '32GB', label: '32 GB' },
          { value: '64GB', label: '64 GB' },
          { value: '128GB', label: '128 GB' },
          { value: 'OTHER', label: 'Other (specify in remarks)' },
        ]},
        { id: 'Storage', label: 'Storage', type: 'select', required: true, options: [
          { value: '100GB', label: '100 GB' },
          { value: '250GB', label: '250 GB' },
          { value: '500GB', label: '500 GB' },
          { value: '1TB', label: '1 TB' },
          { value: '2TB', label: '2 TB' },
          { value: 'OTHER', label: 'Other (specify in remarks)' },
        ]},
        { id: 'Network', label: 'Network Requirements', type: 'select', options: [
          { value: 'INTERNAL', label: 'Internal Network Only' },
          { value: 'DMZ', label: 'DMZ' },
          { value: 'EXTERNAL', label: 'External Access Required' },
        ]},
      ],
    },
    {
      id: 'purpose-section',
      title: 'Purpose & Justification',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5'],
      isStageGated: false,
      fields: [
        { id: 'Application', label: 'Application/System to be hosted', type: 'text', required: true, placeholder: 'e.g., SAP, SQL Database, File Server' },
        { id: 'Purpose', label: 'Purpose/Business Justification', type: 'textarea', required: true, placeholder: 'Describe the business need for this server' },
        { id: 'ExpectedUsers', label: 'Expected Number of Users', type: 'select', options: [
          { value: '1-10', label: '1-10 users' },
          { value: '11-50', label: '11-50 users' },
          { value: '51-100', label: '51-100 users' },
          { value: '100+', label: 'More than 100 users' },
        ]},
        { id: 'RequiredDate', label: 'Required By Date', type: 'date', required: true },
        { id: 'Attachment', label: 'Supporting Documents', type: 'file' },
        { id: 'Remarks', label: 'Additional Remarks', type: 'textarea' },
      ],
    },
    {
      id: 'it-review',
      title: 'IT Review',
      visibleAtStages: ['S2', 'S3', 'S4', 'S5'],
      isStageGated: true,
      fields: [
        { id: 'ITReviewer', label: 'Reviewed By', type: 'text', disabled: true },
        { id: 'ITReviewDate', label: 'Review Date', type: 'date', disabled: true },
        { id: 'ITFeasibility', label: 'Feasibility Assessment', type: 'select', required: true, options: [
          { value: 'FEASIBLE', label: 'Feasible - Proceed' },
          { value: 'FEASIBLE_CHANGES', label: 'Feasible with Changes' },
          { value: 'NOT_FEASIBLE', label: 'Not Feasible' },
        ]},
        { id: 'EstimatedCost', label: 'Estimated Cost (MYR)', type: 'number', placeholder: '0.00' },
        { id: 'ITRemarks', label: 'IT Remarks', type: 'textarea' },
      ],
    },
    {
      id: 'hod-approval',
      title: 'HOD Approval',
      visibleAtStages: ['S3', 'S4', 'S5'],
      isStageGated: true,
      fields: [
        { id: 'HODStatus', label: 'Approval Status', type: 'select', required: true, options: [
          { value: 'APPROVED', label: 'Approved' },
          { value: 'REJECTED', label: 'Rejected' },
        ]},
        { id: 'HODRemarks', label: 'HOD Remarks', type: 'textarea' },
        { id: 'ApprovedBy', label: 'Approved By', type: 'text', disabled: true },
        { id: 'ApprovedDate', label: 'Approved Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'it-processing',
      title: 'IT Processing',
      visibleAtStages: ['S4', 'S5'],
      isStageGated: true,
      fields: [
        { id: 'AssignedTo', label: 'Assigned To', type: 'people', required: true },
        { id: 'StartDate', label: 'Start Date', type: 'date' },
        { id: 'ServerIPAddress', label: 'Server IP Address', type: 'text', placeholder: 'Assigned IP address' },
        { id: 'ProvisioningStatus', label: 'Provisioning Status', type: 'select', required: true, options: [
          { value: 'IN_PROGRESS', label: 'In Progress' },
          { value: 'PENDING_HARDWARE', label: 'Pending Hardware' },
          { value: 'PENDING_LICENSE', label: 'Pending License' },
          { value: 'COMPLETED', label: 'Completed' },
        ]},
        { id: 'ProcessingRemarks', label: 'Processing Remarks', type: 'textarea' },
      ],
    },
    {
      id: 'completion',
      title: 'Completion',
      visibleAtStages: ['S5'],
      isStageGated: true,
      fields: [
        { id: 'CompletionDate', label: 'Completion Date', type: 'date', required: true },
        { id: 'FinalServerName', label: 'Final Server Name', type: 'text' },
        { id: 'FinalIPAddress', label: 'Final IP Address', type: 'text' },
        { id: 'AccessCredentials', label: 'Access Credentials Provided To', type: 'people' },
        { id: 'CompletionRemarks', label: 'Completion Remarks', type: 'textarea' },
        { id: 'CompletedBy', label: 'Completed By', type: 'text', disabled: true },
      ],
    },
  ],
  hasConditionalSections: false,
};

export const HWRR: ITFormConfig = {
  code: 'HWRR',
  name: 'Hardware Request Form',
  module: 'M3',
  moduleName: 'Hardware & Infrastructure',
  icon: HardDrive,
  color: '#f59e0b',
  description: 'Request new hardware, equipment replacement, or hardware disposal',
  database: 'MainDB_IT (PRAI)',
  stages: [
    { key: 'S1', name: 'Submission', order: 1, actor: 'Requester', description: 'Submit hardware request' },
    { key: 'S2', name: 'HOD Approval', order: 2, actor: 'Head of Department', description: 'Department head approval' },
    { key: 'S3', name: 'IT Review', order: 3, actor: 'IT Infrastructure', description: 'IT reviews and assesses request' },
    { key: 'S4', name: 'Procurement', order: 4, actor: 'Procurement', description: 'Procurement process' },
    { key: 'S5', name: 'IT Setup', order: 5, actor: 'IT Infrastructure', description: 'IT configures and deploys hardware' },
    { key: 'S6', name: 'Handover', order: 6, actor: 'IT Infrastructure', description: 'Hardware handover to user' },
  ],
  sections: [
    {
      id: 'requestor-section',
      title: 'Requestor Information',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
      isStageGated: false,
      fields: [
        { id: 'RequestNo', label: 'Request Number', type: 'text', disabled: true },
        { id: 'Company', label: 'Company', type: 'select', required: true, options: [
          { value: 'IOI Corporation Berhad', label: 'IOI Corporation Berhad' },
          { value: 'IOI Oleochemical Industries Berhad', label: 'IOI Oleochemical Industries Berhad' },
          { value: 'IOI Acidchem Sdn Bhd', label: 'IOI Acidchem Sdn Bhd' },
          { value: 'IOI Pan-Century Oleochemicals Sdn Bhd', label: 'IOI Pan-Century Oleochemicals Sdn Bhd' },
          { value: 'IOI Pan-Century Edible Oils Sdn Bhd', label: 'IOI Pan-Century Edible Oils Sdn Bhd' },
          { value: 'Loders Croklaan Asia Pacific Sdn Bhd', label: 'Loders Croklaan Asia Pacific Sdn Bhd' },
          { value: 'IOI Bio-Energy Sdn Bhd', label: 'IOI Bio-Energy Sdn Bhd' },
          { value: 'Bunge Loders Croklaan', label: 'Bunge Loders Croklaan' },
          { value: 'IOI Edible Oils Sdn Bhd', label: 'IOI Edible Oils Sdn Bhd' },
          { value: 'Pan-Century Surfactants Sdn Bhd', label: 'Pan-Century Surfactants Sdn Bhd' },
          { value: 'IOI Properties Berhad', label: 'IOI Properties Berhad' },
          { value: 'IOI Management Services Sdn Bhd', label: 'IOI Management Services Sdn Bhd' },
          { value: 'Loders Croklaan Oils Sdn Bhd', label: 'Loders Croklaan Oils Sdn Bhd' },
          { value: 'Pan Century Fatty Acids Sdn Bhd', label: 'Pan Century Fatty Acids Sdn Bhd' },
          { value: 'IOI Palm Biotech Sdn Bhd', label: 'IOI Palm Biotech Sdn Bhd' },
        ]},
        { id: 'Site', label: 'Site', type: 'select', required: true, options: [
          { value: 'MY-PR', label: 'Prai (MY-PR)' },
          { value: 'MY-JH', label: 'Johor (MY-JH)' },
          { value: 'MY-KL', label: 'Kuala Lumpur (MY-KL)' },
        ]},
        { id: 'RequestorName', label: 'Requestor Name', type: 'people', required: true },
        { id: 'Department', label: 'Department', type: 'select', required: true, options: [
          { value: 'Information Technology', label: 'Information Technology' },
          { value: 'Human Resources', label: 'Human Resources' },
          { value: 'Finance', label: 'Finance' },
          { value: 'Accounts', label: 'Accounts' },
          { value: 'Production', label: 'Production' },
          { value: 'Quality Assurance', label: 'Quality Assurance' },
          { value: 'Quality Control', label: 'Quality Control' },
          { value: 'Laboratory', label: 'Laboratory' },
          { value: 'Warehouse', label: 'Warehouse' },
          { value: 'Logistics', label: 'Logistics' },
          { value: 'Engineering', label: 'Engineering' },
          { value: 'Maintenance', label: 'Maintenance' },
          { value: 'Administration', label: 'Administration' },
          { value: 'Marketing', label: 'Marketing' },
          { value: 'Sales', label: 'Sales' },
          { value: 'Procurement', label: 'Procurement' },
          { value: 'HSE', label: 'HSE' },
          { value: 'Plant Operations', label: 'Plant Operations' },
          { value: 'R&D', label: 'R&D' },
          { value: 'Technical', label: 'Technical' },
          { value: 'Management', label: 'Management' },
          { value: 'Other', label: 'Other' },
        ]},
        { id: 'PhoneExt', label: 'Phone Extension', type: 'text' },
        { id: 'EmailAddress', label: 'Email Address', type: 'email' },
        { id: 'HOD', label: 'Head of Department', type: 'people', required: true },
        { id: 'CC', label: 'CC', type: 'people', multipleSelection: true },
        { id: 'SubmittedDate', label: 'Submitted Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'request-details',
      title: 'Request Details',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
      isStageGated: false,
      fields: [
        { id: 'RequestType', label: 'Request Type', type: 'select', required: true, options: [
          { value: 'NEW', label: 'New Hardware' },
          { value: 'REPLACEMENT', label: 'Replacement' },
          { value: 'UPGRADE', label: 'Upgrade' },
          { value: 'DISPOSAL', label: 'Disposal' },
          { value: 'TRANSFER', label: 'Transfer' },
        ]},
        { id: 'HardwareType', label: 'Hardware Type', type: 'select', required: true, options: [
          { value: 'LAPTOP', label: 'Laptop' },
          { value: 'DESKTOP', label: 'Desktop PC' },
          { value: 'MONITOR', label: 'Monitor' },
          { value: 'PRINTER', label: 'Printer' },
          { value: 'SCANNER', label: 'Scanner' },
          { value: 'UPS', label: 'UPS' },
          { value: 'KEYBOARD', label: 'Keyboard' },
          { value: 'MOUSE', label: 'Mouse' },
          { value: 'HEADSET', label: 'Headset' },
          { value: 'WEBCAM', label: 'Webcam' },
          { value: 'DOCKING_STATION', label: 'Docking Station' },
          { value: 'EXTERNAL_DRIVE', label: 'External Hard Drive' },
          { value: 'PROJECTOR', label: 'Projector' },
          { value: 'NETWORK', label: 'Network Equipment' },
          { value: 'SERVER', label: 'Server' },
          { value: 'TABLET', label: 'Tablet' },
          { value: 'MOBILE', label: 'Mobile Device' },
          { value: 'OTHER', label: 'Other' },
        ]},
        { id: 'Quantity', label: 'Quantity', type: 'number', required: true, placeholder: '1' },
        { id: 'Specifications', label: 'Specifications/Model', type: 'textarea', required: true, placeholder: 'Specify brand, model, specs requirements' },
        { id: 'ForUser', label: 'For User', type: 'people', required: true, helperText: 'User who will receive/use the hardware' },
        { id: 'Location', label: 'Installation Location', type: 'text', required: true, placeholder: 'e.g., HQ Building, Level 3, Room 301' },
      ],
    },
    {
      id: 'replacement-section',
      title: 'Replacement Details',
      description: 'Fill in for replacement or upgrade requests',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
      isStageGated: false,
      conditionalField: { field: 'RequestType', value: 'REPLACEMENT' },
      fields: [
        { id: 'OldAssetTag', label: 'Old Asset Tag', type: 'text', required: true, placeholder: 'IOI-IT-XXXX' },
        { id: 'OldSerialNumber', label: 'Old Serial Number', type: 'text', required: true },
        { id: 'ReplacementReason', label: 'Reason for Replacement', type: 'select', required: true, options: [
          { value: 'FAULTY', label: 'Faulty/Defective' },
          { value: 'END_OF_LIFE', label: 'End of Life' },
          { value: 'PERFORMANCE', label: 'Performance Issues' },
          { value: 'OBSOLETE', label: 'Obsolete/Outdated' },
          { value: 'DAMAGE', label: 'Physical Damage' },
          { value: 'OTHER', label: 'Other' },
        ]},
        { id: 'OldEquipmentPhoto', label: 'Photo of Old Equipment', type: 'file' },
      ],
    },
    {
      id: 'upgrade-section',
      title: 'Upgrade Details',
      description: 'Fill in for upgrade requests',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
      isStageGated: false,
      conditionalField: { field: 'RequestType', value: 'UPGRADE' },
      fields: [
        { id: 'CurrentAssetTag', label: 'Current Asset Tag', type: 'text', required: true, placeholder: 'IOI-IT-XXXX' },
        { id: 'CurrentSpecs', label: 'Current Specifications', type: 'textarea', required: true },
        { id: 'DesiredSpecs', label: 'Desired Upgrade Specifications', type: 'textarea', required: true },
        { id: 'UpgradeReason', label: 'Reason for Upgrade', type: 'select', required: true, options: [
          { value: 'PERFORMANCE', label: 'Performance Requirements' },
          { value: 'SOFTWARE', label: 'Software Requirements' },
          { value: 'CAPACITY', label: 'Storage/Capacity' },
          { value: 'JOB_CHANGE', label: 'Job Role Change' },
          { value: 'OTHER', label: 'Other' },
        ]},
      ],
    },
    {
      id: 'disposal-section',
      title: 'Disposal Details',
      description: 'Fill in for disposal requests',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
      isStageGated: false,
      conditionalField: { field: 'RequestType', value: 'DISPOSAL' },
      fields: [
        { id: 'DisposalAssetTag', label: 'Asset Tag', type: 'text', required: true, placeholder: 'IOI-IT-XXXX' },
        { id: 'DisposalSerialNumber', label: 'Serial Number', type: 'text', required: true },
        { id: 'DisposalReason', label: 'Reason for Disposal', type: 'select', required: true, options: [
          { value: 'END_OF_LIFE', label: 'End of Life' },
          { value: 'IRREPARABLE', label: 'Beyond Repair' },
          { value: 'OBSOLETE', label: 'Obsolete' },
          { value: 'POLICY', label: 'Policy Requirement' },
        ]},
        { id: 'DataWipeConfirm', label: 'Data Wipe Confirmation', type: 'checkbox', helperText: 'Confirm that all data has been backed up or is not required' },
      ],
    },
    {
      id: 'justification-section',
      title: 'Justification',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
      isStageGated: false,
      fields: [
        { id: 'BusinessJustification', label: 'Business Justification', type: 'textarea', required: true, placeholder: 'Explain the business need for this hardware request' },
        { id: 'RequiredDate', label: 'Required By Date', type: 'date', required: true },
        { id: 'Priority', label: 'Priority', type: 'select', required: true, options: [
          { value: 'LOW', label: 'Low' },
          { value: 'MEDIUM', label: 'Medium' },
          { value: 'HIGH', label: 'High' },
          { value: 'URGENT', label: 'Urgent' },
        ]},
        { id: 'Attachment', label: 'Supporting Documents', type: 'file' },
        { id: 'Remarks', label: 'Additional Remarks', type: 'textarea' },
      ],
    },
    {
      id: 'hod-approval',
      title: 'HOD Approval',
      visibleAtStages: ['S2', 'S3', 'S4', 'S5', 'S6'],
      isStageGated: true,
      fields: [
        { id: 'HODStatus', label: 'Approval Status', type: 'select', required: true, options: [
          { value: 'APPROVED', label: 'Approved' },
          { value: 'REJECTED', label: 'Rejected' },
        ]},
        { id: 'HODRemarks', label: 'HOD Remarks', type: 'textarea' },
        { id: 'HODApprovedBy', label: 'Approved By', type: 'text', disabled: true },
        { id: 'HODApprovedDate', label: 'Approved Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'it-review',
      title: 'IT Review',
      visibleAtStages: ['S3', 'S4', 'S5', 'S6'],
      isStageGated: true,
      fields: [
        { id: 'ITReviewer', label: 'Reviewed By', type: 'people' },
        { id: 'ITReviewDate', label: 'Review Date', type: 'date' },
        { id: 'ITAssessment', label: 'Technical Assessment', type: 'select', required: true, options: [
          { value: 'APPROVED', label: 'Approved - Proceed' },
          { value: 'APPROVED_CHANGES', label: 'Approved with Changes' },
          { value: 'REJECTED', label: 'Rejected' },
        ]},
        { id: 'RecommendedModel', label: 'Recommended Model/Brand', type: 'text', placeholder: 'IT recommended hardware' },
        { id: 'EstimatedCost', label: 'Estimated Cost (MYR)', type: 'number', placeholder: '0.00' },
        { id: 'ITRemarks', label: 'IT Remarks', type: 'textarea' },
      ],
    },
    {
      id: 'procurement-section',
      title: 'Procurement',
      visibleAtStages: ['S4', 'S5', 'S6'],
      isStageGated: true,
      fields: [
        { id: 'PONumber', label: 'PO Number', type: 'text', placeholder: 'Purchase Order Number' },
        { id: 'Vendor', label: 'Vendor', type: 'text' },
        { id: 'ActualCost', label: 'Actual Cost (MYR)', type: 'number', placeholder: '0.00' },
        { id: 'ExpectedDelivery', label: 'Expected Delivery Date', type: 'date' },
        { id: 'ProcurementStatus', label: 'Procurement Status', type: 'select', required: true, options: [
          { value: 'PENDING', label: 'Pending' },
          { value: 'ORDERED', label: 'Ordered' },
          { value: 'SHIPPED', label: 'Shipped' },
          { value: 'RECEIVED', label: 'Received' },
        ]},
        { id: 'ProcurementRemarks', label: 'Procurement Remarks', type: 'textarea' },
      ],
    },
    {
      id: 'it-setup',
      title: 'IT Setup & Configuration',
      visibleAtStages: ['S5', 'S6'],
      isStageGated: true,
      fields: [
        { id: 'AssignedTechnician', label: 'Assigned Technician', type: 'people', required: true },
        { id: 'NewAssetTag', label: 'New Asset Tag', type: 'text', required: true, placeholder: 'IOI-IT-XXXX' },
        { id: 'NewSerialNumber', label: 'Serial Number', type: 'text', required: true },
        { id: 'SetupDate', label: 'Setup Date', type: 'date' },
        { id: 'SetupStatus', label: 'Setup Status', type: 'select', required: true, options: [
          { value: 'IN_PROGRESS', label: 'In Progress' },
          { value: 'IMAGING', label: 'Imaging/OS Installation' },
          { value: 'SOFTWARE', label: 'Software Installation' },
          { value: 'TESTING', label: 'Testing' },
          { value: 'COMPLETED', label: 'Completed' },
        ]},
        { id: 'ConfigurationNotes', label: 'Configuration Notes', type: 'textarea' },
      ],
    },
    {
      id: 'handover-section',
      title: 'Handover',
      visibleAtStages: ['S6'],
      isStageGated: true,
      fields: [
        { id: 'HandoverDate', label: 'Handover Date', type: 'date', required: true },
        { id: 'ReceivedBy', label: 'Received By', type: 'people', required: true },
        { id: 'HandoverTechnician', label: 'Handover By (IT)', type: 'people', required: true },
        { id: 'AcknowledgeReceipt', label: 'User Acknowledgement', type: 'checkbox', required: true, helperText: 'User confirms receipt of hardware in good condition' },
        { id: 'HandoverRemarks', label: 'Handover Remarks', type: 'textarea' },
        { id: 'EquipmentPhoto', label: 'Equipment Photo (with user)', type: 'file' },
      ],
    },
  ],
  hasConditionalSections: true,
  conditionalSectionDescription: 'Replacement, Upgrade, and Disposal sections show based on Request Type',
};

// =============================================================================
// MODULE 4: SAP FORMS (7 Forms)
// =============================================================================

export const SAPAMR: ITFormConfig = {
  code: 'SAPAMR',
  name: 'SAP Authorization Master Record',
  module: 'M4' as const,
  moduleName: 'SAP Management',
  icon: Settings,
  color: '#0284c7',
  description: 'SAP authorization maintenance request form',
  database: 'MainDB_IT (PRAI)',
  stages: [
    { key: 'Draft', name: 'Initiation', order: 1, actor: 'Requester', description: 'Submit authorization request' },
    { key: 'PendingVerification', name: 'Verification', order: 2, actor: 'Key User (TBV)', description: 'Verify by Key User' },
    { key: 'PendingBPOApproval', name: 'BPO/HOD Approval', order: 3, actor: 'BPO/HOD', description: 'Business approval' },
  ],
  sections: [
    {
      id: 'initiation',
      title: 'Initiation',
      visibleAtStages: ['Draft', 'PendingVerification', 'PendingBPOApproval'],
      isStageGated: false,
      fields: [
        { id: 'RecordNum', label: 'Record Number', type: 'text', disabled: true, helperText: 'Auto-generated on submission' },
        { id: 'Module', label: 'Module', type: 'select', required: true, options: [
          { value: 'FI', label: 'FI - Finance' },
          { value: 'CO', label: 'CO - Controlling' },
          { value: 'MM', label: 'MM - Materials Management' },
          { value: 'SD', label: 'SD - Sales & Distribution' },
          { value: 'PP', label: 'PP - Production Planning' },
          { value: 'PM', label: 'PM - Plant Maintenance' },
          { value: 'QM', label: 'QM - Quality Management' },
          { value: 'HCM', label: 'HCM - Human Capital Management' },
          { value: 'BASIS', label: 'BASIS' },
        ]},
        { id: 'Plant', label: 'Plant', type: 'select', required: true, options: [
          { value: 'PRAI', label: 'Prai (MY-PR)' },
          { value: 'JOHOR', label: 'Johor (MY-JH)' },
          { value: 'ALL', label: 'All Plants' },
        ]},
        { id: 'AuthType', label: 'Authorization Type', type: 'select', required: true, options: [
          { value: 'NEW', label: 'New Authorization' },
          { value: 'MODIFY', label: 'Modify Existing' },
          { value: 'REMOVE', label: 'Remove Authorization' },
        ]},
        { id: 'AuthAttachment', label: 'Attachment', type: 'file' },
        { id: 'Remarks', label: 'Remarks', type: 'textarea', placeholder: 'Enter justification and remarks' },
        { id: 'CC', label: 'CC', type: 'people', multipleSelection: true },
        { id: 'TBV', label: 'To be verified by', type: 'people', required: true },
        { id: 'TBA', label: 'BPO/HOD', type: 'people', required: true },
      ],
    },
    {
      id: 'verification',
      title: 'Verification',
      visibleAtStages: ['PendingVerification', 'PendingBPOApproval'],
      isStageGated: true,
      fields: [
        { id: 'VerifiedBy', label: 'Verified By', type: 'text', disabled: true },
        { id: 'VerifiedDate', label: 'Verified Date', type: 'date', disabled: true },
        { id: 'txtComment1', label: 'Verifier Comments', type: 'textarea' },
      ],
    },
    {
      id: 'approval',
      title: 'BPO/HOD Approval',
      visibleAtStages: ['PendingBPOApproval'],
      isStageGated: true,
      fields: [
        { id: 'PreparedBy', label: 'Prepared By', type: 'text', disabled: true },
        { id: 'PreparedDate', label: 'Prepared Date', type: 'date', disabled: true },
        { id: 'txtComment2', label: 'Approver Comments', type: 'textarea' },
      ],
    },
  ],
  hasConditionalSections: false,
  hideApprovalChain: true,
  // Store TBV, TBA, and TBV_1-5 email references for email routing in the workflow engine
  submitTransform: (formData, user) => {
    const tbv = String(formData['TBV'] || '');
    const tba = String(formData['TBA'] || '');
    const module = String(formData['Module'] || '');
    const isFI = module.toUpperCase().startsWith('FI');
    const result: Record<string, string> = {
      sAPAMRTBVEmail: tbv,
      sAPAMRTBAEmail: tba,
      requestoremail: user?.userPrincipalName || '',
    };
    // For FI modules, also pass through TBV_1-5 emails
    if (isFI) {
      for (let i = 1; i <= 5; i++) {
        const val = String(formData[`TBV${i}`] || '');
        if (val) {
          result[`sAPAMRTBV${i}Email`] = val;
        }
      }
    }
    return result;
  },
};

export const SAPCA: ITFormConfig = {
  code: 'SAPCA',
  name: 'SAP Configuration Access Form',
  module: 'M4' as const,
  moduleName: 'SAP Management',
  icon: FolderCog,
  color: '#7c3aed',
  description: 'Request SAP configuration access for changes',
  database: 'MainDB_IT (PRAI)',
  stages: [
    { key: 'Request', name: 'Draft', order: 1, actor: 'Requestor / Editor1', description: 'Requestor prepares SAP config access request' },
    { key: 'Submitted', name: 'Pending IT Approval', order: 2, actor: 'ITAPP / Editor1a', description: 'IT approver reviews and approves or rejects' },
    { key: 'Approved', name: 'Pending BASIS Reply', order: 3, actor: 'Transporter / Editor2', description: 'BASIS opens access or rejects the request' },
    { key: 'ConfigAccess-Done', name: 'Pending Requestor Closure Request', order: 4, actor: 'DocAuthor / ITPIC / Editor3', description: 'Requestor requests closure after config access is done' },
    { key: 'Submitted-Closure', name: 'Pending BASIS Confirmation', order: 5, actor: 'Transporter / Editor4', description: 'BASIS confirms config access closure' },
    { key: 'Completed', name: 'Completed', order: 6, actor: 'System', description: 'Config access workflow completed' },
  ],
  sections: [
    {
      id: 'section-a',
      title: 'Section A - IT Functional Team',
      visibleAtStages: ['Request', 'Submitted', 'Approved', 'ConfigAccess-Done', 'Submitted-Closure', 'Completed'],
      isStageGated: false,
      fields: [
        { id: 'ReqNum', label: 'Form Number', type: 'text', disabled: true },
        { id: 'btnAppArea', label: 'Module', type: 'select', required: true, options: [
          { value: 'FI', label: 'FI' }, { value: 'CO', label: 'CO' },
          { value: 'MM', label: 'MM' }, { value: 'SD', label: 'SD' },
          { value: 'PP', label: 'PP' }, { value: 'PM', label: 'PM' },
          { value: 'QM', label: 'QM' }, { value: 'HCM', label: 'HCM' },
          { value: 'BASIS', label: 'BASIS' }, { value: 'OTHERS', label: 'Others' },
        ]},
        { id: 'txtOthers', label: 'Others (please specify)', type: 'text' },
        { id: 'Client', label: 'System ID', type: 'select', required: true, options: [
          { value: 'IED', label: 'IED - Development' },
          { value: 'IEQ', label: 'IEQ - Quality' },
          { value: 'IEP', label: 'IEP - Production' },
        ]},
        { id: 'ClientNum', label: 'Client Number', type: 'text', required: true },
        { id: 'RefDoc', label: 'CR/Issue Log/SSR/PRF/SAP Notes Number', type: 'text', required: true },
        { id: 'Purpose', label: 'Purpose', type: 'textarea', required: true },
        { id: 'ChangesDone', label: 'Changes to be done', type: 'textarea', required: true },
        { id: 'Attachment', label: 'Attachment', type: 'file' },
        { id: 'CCFuncOwner', label: 'Functional Owner', type: 'people' },
        { id: 'ITAPP', label: 'IT Approver', type: 'people', required: true },
        { id: 'Transporter', label: 'BASIS Transporter', type: 'people', required: true },
        { id: 'ITPIC', label: 'IT PIC', type: 'people' },
        { id: 'RequestedBy', label: 'Requested By', type: 'text', disabled: true },
        { id: 'DateSubmitted', label: 'Date Submitted', type: 'date', disabled: true },
      ],
    },
    {
      id: 'section-b',
      title: 'Section B - BASIS Team',
      visibleAtStages: ['Approved', 'ConfigAccess-Done', 'Submitted-Closure', 'Completed', 'Reject - Closed'],
      isStageGated: true,
      fields: [
        { id: 'ConfigStatus', label: 'Config Status', type: 'select', required: true, options: [
          { value: 'Config Opened', label: 'Config Opened' },
          { value: 'Rejected', label: 'Rejected' },
        ]},
        { id: 'BasisAction', label: 'BASIS Reply / Action', type: 'textarea' },
        { id: 'BasisDate', label: 'Reply Date', type: 'date' },
      ],
    },
    {
      id: 'section-c',
      title: 'Section C - Request for Config Close',
      visibleAtStages: ['ConfigAccess-Done', 'Submitted-Closure', 'Completed'],
      isStageGated: true,
      fields: [
        { id: 'ConfigCloseRequest', label: 'Config Close Request', type: 'textarea' },
        { id: 'dtReqClose', label: 'Request Close Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'section-d',
      title: 'Section D - Completion',
      visibleAtStages: ['Submitted-Closure', 'Completed'],
      isStageGated: true,
      fields: [
        { id: 'Closure', label: 'Closure', type: 'text', disabled: true },
        { id: 'Basis_Admin_Close', label: 'BASIS Closed By', type: 'text', disabled: true },
        { id: 'dtClosed', label: 'Closed Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'requestor-remarks',
      title: "Requestor's Remarks (If Any)",
      visibleAtStages: ['ConfigAccess-Done', 'Submitted-Closure', 'Completed'],
      isStageGated: false,
      fields: [
        { id: 'Requestor_s_Remarks__', label: "Requestor's Remarks", type: 'textarea' },
      ],
    },
    {
      id: 'withdrawal',
      title: 'Withdrawal',
      visibleAtStages: ['Withdrawn'],
      isStageGated: true,
      fields: [
        { id: 'WDStatus', label: 'Withdrawal Status', type: 'text', disabled: true },
        { id: 'Withdrawn__', label: 'Withdrawal Remarks', type: 'textarea' },
      ],
    },
  ],
  hasConditionalSections: false,
  hideApprovalChain: true,
};

export const SAPCR: ITFormConfig = {
  code: 'SAPCR',
  name: 'SAP & WB Change Request',
  module: 'M4' as const,
  moduleName: 'SAP Management',
  icon: GitBranch,
  color: '#dc2626',
  description: 'SAP and Workbench change request form',
  database: 'MainDB_IT (PRAI)',
  stages: [
    { key: 'Draft', name: 'Initiation', order: 1, actor: 'Requester', description: 'Submit change request' },
    { key: 'Submitted', name: 'Pending BPO Approval', order: 2, actor: 'BPO', description: 'BPO review' },
    { key: 'BPOApp', name: 'Pending PM Approval', order: 3, actor: 'Project Manager', description: 'PM review for investigation' },
    { key: 'PMApp', name: 'Pending Developer Investigation', order: 4, actor: 'Developer', description: 'Developer resolution' },
    { key: 'SubmittedDetails', name: 'Pending PM Impact Analysis', order: 5, actor: 'Project Manager', description: 'PM impact analysis' },
    { key: 'PMAppImp', name: 'Pending Project Director Approval', order: 6, actor: 'Project Director', description: 'Final PD sign-off' },
  ],
  sections: [
    {
      id: 'section-a',
      title: 'Section A — Initiation',
      visibleAtStages: ['Draft', 'Submitted', 'BPOApp', 'PMApp', 'SubmittedDetails', 'PMAppImp'],
      isStageGated: false,
      fields: [
        { id: 'ChgReqNo', label: 'Change Request No', type: 'text', disabled: true },
        { id: 'ProjectPhase', label: 'Project Phase', type: 'select', required: true, options: [
          { value: 'DEV', label: 'Development' },
          { value: 'UAT', label: 'UAT' },
          { value: 'PROD', label: 'Production' },
        ]},
        { id: 'AllDivision', label: 'Plant', type: 'select', required: true, options: [
          { value: 'PRAI', label: 'Prai' }, { value: 'JOHOR', label: 'Johor' },
          { value: 'ALL', label: 'All Divisions' },
        ]},
        { id: 'Division', label: 'Division', type: 'select', multipleSelection: true, options: [
          { value: 'FI', label: 'FI - Finance' },
          { value: 'CO', label: 'CO - Controlling' },
          { value: 'MM', label: 'MM - Materials Management' },
          { value: 'SD', label: 'SD - Sales & Distribution' },
          { value: 'PP', label: 'PP - Production Planning' },
          { value: 'PM', label: 'PM - Plant Maintenance' },
          { value: 'QM', label: 'QM - Quality Management' },
          { value: 'HCM', label: 'HCM - Human Capital Management' },
          { value: 'ABAP', label: 'ABAP' },
          { value: 'BASIS', label: 'BASIS' },
        ]},
        { id: 'System', label: 'System', type: 'select', required: true, options: [
          { value: 'SAP', label: 'SAP ECC' },
          { value: 'HANA', label: 'SAP HANA' },
          { value: 'FIORI', label: 'SAP Fiori' },
          { value: 'WB', label: 'Workbench' },
        ]},
        { id: 'btnAppArea', label: 'Module', type: 'select', required: true, options: [
          { value: 'FI', label: 'FI' }, { value: 'CO', label: 'CO' },
          { value: 'MM', label: 'MM' }, { value: 'SD', label: 'SD' },
          { value: 'PP', label: 'PP' }, { value: 'PM', label: 'PM' },
          { value: 'ABAP', label: 'ABAP' }, { value: 'BASIS', label: 'BASIS' },
        ]},
        { id: 'txtOthers', label: 'Others (specify)', type: 'text' },
      ],
    },
    {
      id: 'section-b',
      title: 'Section B — Priority',
      visibleAtStages: ['Submitted', 'BPOApp', 'PMApp', 'SubmittedDetails', 'PMAppImp'],
      isStageGated: true,
      fields: [
        { id: 'dlPriority', label: 'Level of Priority', type: 'select', required: true, options: [
          { value: 'HIGH', label: 'High' },
          { value: 'MEDIUM', label: 'Medium' },
          { value: 'LOW', label: 'Low' },
        ]},
        { id: 'btnPurpose', label: 'Purpose', type: 'select', required: true, options: [
          { value: 'BUG_FIX', label: 'Bug Fix' },
          { value: 'ENHANCEMENT', label: 'Enhancement' },
          { value: 'NEW_DEV', label: 'New Development' },
          { value: 'OPTIMIZATION', label: 'Optimization' },
        ]},
      ],
    },
    {
      id: 'section-c',
      title: 'Section C — Detailed Description',
      visibleAtStages: ['PMApp', 'SubmittedDetails', 'PMAppImp'],
      isStageGated: true,
      fields: [
        { id: 'txtProposedChange', label: 'Description of Proposed Change', type: 'textarea', required: true },
        { id: 'Att_C', label: 'Attachment', type: 'file' },
        { id: 'nmReportedBy', label: 'Reported By', type: 'text', disabled: true },
        { id: 'dtReportedBy', label: 'Date', type: 'date', disabled: true },
        { id: 'CCNameList', label: 'CC (Main/Backup person)', type: 'people', multipleSelection: true },
        { id: 'SAPChange', label: 'Require changes in standard SAP', type: 'checkbox' },
      ],
    },
  ],
  hasConditionalSections: false,
  hideApprovalChain: true,
  // Store BPO, PM, Developer, and Project Director emails for workflow email routing
  submitTransform: (formData, user) => {
    return {
      sAPCRBPOEmail: String(formData['BPO'] || formData['nmAppBy'] || ''),
      sAPCRPMEmail: String(formData['ProjectManager'] || formData['AEditor2'] || ''),
      sAPCRDeveloperEmail: String(formData['Developer'] || formData['nmAssgTo'] || ''),
      sAPCRDirectorEmail: String(formData['ProjectDirector'] || formData['KhooTC'] || ''),
      requestoremail: user?.userPrincipalName || '',
    };
  },
};

export const SAPDRP: ITFormConfig = {
  code: 'SAPDRP',
  name: 'SAP DRP Procedures',
  module: 'M4' as const,
  moduleName: 'SAP Management',
  icon: FileText,
  color: '#059669',
  description: 'SAP Disaster Recovery Procedures documentation form',
  database: 'MainDB_IT (PRAI)',
  stages: [
    { key: 'Draft', name: 'Section A - Entry', order: 1, actor: 'IT Staff', description: 'Procedure entry' },
    { key: 'Verify', name: 'Initiator Verification', order: 2, actor: 'Team Leader', description: 'Initiator verifies' },
    { key: 'Endorse', name: 'HOD Endorsement', order: 3, actor: 'HOD', description: 'HOD endorses procedure' },
  ],
  sections: [
    {
      id: 'procedure-entry',
      title: 'Procedure Entry',
      visibleAtStages: ['Draft', 'Verify', 'Endorse'],
      isStageGated: false,
      fields: [
        { id: 'TimeCreated', label: 'Created', type: 'date', disabled: true },
        { id: 'TimeModified', label: 'Modified', type: 'date', disabled: true },
        { id: 'Distributed', label: 'Distributed', type: 'date' },
        { id: 'Subject', label: 'Title', type: 'text', required: true },
        { id: 'Categories', label: 'Category', type: 'select', required: true, options: [
          { value: 'DRP_PROCEDURE', label: 'DRP Procedure' },
          { value: 'BACKUP', label: 'Backup Procedures' },
          { value: 'RECOVERY', label: 'Recovery Procedures' },
          { value: 'FAILOVER', label: 'Failover Procedures' },
          { value: 'RESTORATION', label: 'Restoration Procedures' },
        ]},
        { id: 'EffectDate', label: 'Effective Date', type: 'date', required: true },
        { id: 'Revision', label: 'Revision', type: 'text', required: true },
        { id: 'Dept', label: 'Department', type: 'text', required: true },
        { id: 'Team', label: 'Team', type: 'select', required: true, options: [
          { value: 'SAP_FUNCTIONAL', label: 'SAP Functional' },
          { value: 'SAP_BASIS', label: 'SAP BASIS' },
          { value: 'SAP_ABAP', label: 'SAP ABAP' },
          { value: 'IT_INFRA', label: 'IT Infrastructure' },
          { value: 'IT_SUPPORT', label: 'IT Support' },
          { value: 'NETWORK', label: 'Network' },
        ]},
        { id: 'selection1', label: 'Team Leader of', type: 'people' },
        { id: 'AppBy', label: 'Head of Department', type: 'people', required: true },
        { id: 'Body', label: 'DRP Procedures', type: 'textarea', required: true },
        { id: 'Comments', label: 'Comments', type: 'textarea' },
      ],
    },
    {
      id: 'initiator-section',
      title: 'Initiator',
      visibleAtStages: ['Verify', 'Endorse'],
      isStageGated: true,
      fields: [
        { id: 'VeriBy', label: 'Verified By', type: 'text', disabled: true },
        { id: 'dateapp1', label: 'Date Verified', type: 'date', disabled: true },
        { id: 'Com1', label: 'Comments', type: 'textarea' },
        { id: 'statusapp1', label: 'Status', type: 'select', options: [
          { value: 'VERIFIED', label: 'Verified' },
          { value: 'RETURNED', label: 'Returned' },
        ]},
      ],
    },
    {
      id: 'endorser-section',
      title: 'Endorser',
      visibleAtStages: ['Endorse'],
      isStageGated: true,
      fields: [
        { id: 'EndorseBy', label: 'Endorsed By', type: 'text', disabled: true },
        { id: 'dateapp2', label: 'Date', type: 'date', disabled: true },
        { id: 'Com2', label: 'Comments', type: 'textarea' },
        { id: 'Status', label: 'Status', type: 'select', options: [
          { value: 'ENDORSED', label: 'Endorsed' },
          { value: 'REJECTED', label: 'Rejected' },
        ]},
      ],
    },
  ],
  hasConditionalSections: false,
  hideApprovalChain: true,
};

export const SAPSLCF: ITFormConfig = {
  code: 'SAPSLCF',
  name: 'Storage Location Creation Form',
  module: 'M4' as const,
  moduleName: 'SAP Management',
  icon: Warehouse,
  color: '#ea580c',
  description: 'SAP Storage Location creation and configuration request',
  database: 'MainDB_IT (PRAI)',
  stages: [
    { key: 'Request', name: 'Requestor', order: 1, actor: 'Requester', description: 'Submit storage location request' },
    { key: 'HODApprove', name: 'HOD Approval', order: 2, actor: 'HOD', description: 'Department head approval' },
    { key: 'ITProcess', name: 'IT Processing', order: 3, actor: 'IT Staff', description: 'IT creates storage location' },
  ],
  sections: [
    {
      id: 'requestor-section',
      title: 'Requestor',
      visibleAtStages: ['Request', 'HODApprove', 'ITProcess'],
      isStageGated: false,
      fields: [
        { id: 'txtReqNo', label: 'Request No', type: 'text', disabled: true },
        { id: 'txtReqBy', label: 'Requested By', type: 'text', disabled: true },
        { id: 'dtSubmittedTimestamp', label: 'Date Submitted', type: 'date', disabled: true },
        { id: 'txtDesignation', label: 'Designation', type: 'text', required: true },
        { id: 'cboDep', label: 'Department', type: 'select', required: true, options: [
          { value: 'PRODUCTION', label: 'Production' },
          { value: 'WAREHOUSE', label: 'Warehouse' },
          { value: 'LOGISTICS', label: 'Logistics' },
          { value: 'QC', label: 'Quality Control' },
        ]},
        { id: 'txtPhoneNo', label: 'Phone No./Ext.', type: 'text', required: true },
        { id: 'namesDepHead', label: 'Department/Section Head', type: 'people', required: true },
        { id: 'cboProteanSite', label: 'Plant Code', type: 'select', required: true, options: [
          { value: '1000', label: '1000 - Prai' },
          { value: '2000', label: '2000 - Johor' },
        ]},
        { id: 'txtAreaLocNo', label: 'Storage Location Code', type: 'text', required: true },
        { id: 'txtLocAdd1', label: 'Storage Location Description', type: 'text', required: true },
        { id: 'txtMatExtend', label: 'Extended to Material Code', type: 'text', required: true, helperText: 'e.g., 10000400, 13000013' },
        { id: 'cboUllage', label: 'Tank included for Ullage StockTake', type: 'select', options: [
          { value: 'YES', label: 'Yes' },
          { value: 'NO', label: 'No' },
        ]},
        { id: 'txtRmk', label: 'Remarks', type: 'textarea' },
        { id: 'Attach', label: 'Attachment', type: 'file' },
      ],
    },
    {
      id: 'it-support-section',
      title: 'IT Support Staff',
      visibleAtStages: ['ITProcess'],
      isStageGated: true,
      fields: [
        { id: 'txtProteanSite', label: 'Plant Code', type: 'text', required: true },
        { id: 'txtProteanLoc', label: 'Storage Location Code', type: 'text', required: true },
        { id: 'txtSLocDesc', label: 'Storage Location Desc.', type: 'text', required: true },
        { id: 'txtRemarks', label: 'Remarks', type: 'textarea' },
        { id: 'ITAttachment', label: 'Attachment', type: 'file' },
        { id: 'txtRejRem', label: 'Rejected Remarks', type: 'textarea' },
        { id: 'txtCpISGApp', label: 'Created By', type: 'text', disabled: true },
        { id: 'dtISGCreatedDate', label: 'Date Created', type: 'date', disabled: true },
        { id: 'ExtendedStatus', label: 'Extended Status', type: 'select', options: [
          { value: 'EXTENDED', label: 'Extended' },
          { value: 'PENDING', label: 'Pending' },
          { value: 'REJECTED', label: 'Rejected' },
        ]},
      ],
    },
  ],
  hasConditionalSections: false,
  hideApprovalChain: true,
};

export const SAPSOF2: ITFormConfig = {
  code: 'SAPSOF2',
  name: 'Integrated UAT Sign-Off Form',
  module: 'M4' as const,
  moduleName: 'SAP Management',
  icon: CheckSquare,
  color: '#16a34a',
  description: 'SAP Integrated User Acceptance Testing sign-off form',
  database: 'MainDB_IT (PRAI)',
  stages: [
    { key: 'Submit', name: 'IT Submission', order: 1, actor: 'IT Functional', description: 'IT submits UAT for sign-off' },
    { key: 'KeyUser', name: 'Key User Sign-Off', order: 2, actor: 'Key Users', description: 'Key users sign off' },
    { key: 'BPO', name: 'BPO Sign-Off', order: 3, actor: 'BPO', description: 'Business Process Owner sign-off' },
  ],
  sections: [
    {
      id: 'it-functional',
      title: 'IT Functional Use',
      visibleAtStages: ['Submit', 'KeyUser', 'BPO'],
      isStageGated: false,
      fields: [
        { id: 'DisplayNum', label: 'Display Number', type: 'text', disabled: true },
        { id: 'Module', label: 'Module', type: 'select', required: true, options: [
          { value: 'FI', label: 'FI - Finance' },
          { value: 'CO', label: 'CO - Controlling' },
          { value: 'MM', label: 'MM - Materials Management' },
          { value: 'SD', label: 'SD - Sales & Distribution' },
          { value: 'PP', label: 'PP - Production Planning' },
          { value: 'PM', label: 'PM - Plant Maintenance' },
          { value: 'QM', label: 'QM - Quality Management' },
          { value: 'HCM', label: 'HCM - Human Capital Management' },
          { value: 'ABAP', label: 'ABAP' },
          { value: 'BASIS', label: 'BASIS' },
        ]},
        { id: 'Reference', label: 'Reference (SSR/PRF)', type: 'text', required: true, placeholder: 'Enter SSR or PRF reference number' },
        { id: 'Client', label: 'Client', type: 'select', required: true, options: [
          { value: 'IEQ', label: 'IEQ - Quality' },
          { value: 'IEP', label: 'IEP - Production' },
        ]},
        { id: 'ClientNum', label: 'Client Number', type: 'text', required: true },
        { id: 'Plant', label: 'Plant', type: 'select', required: true, options: [
          { value: 'PRAI', label: 'Prai' },
          { value: 'JOHOR', label: 'Johor' },
          { value: 'ALL', label: 'All Plants' },
        ]},
        { id: 'ProjectTitle', label: 'Project Title', type: 'text', required: true },
        { id: 'ProjectDesc', label: 'Project Description', type: 'textarea', required: true },
        { id: 'TRNumber', label: 'TR Number', type: 'text', required: true },
        { id: 'UATAttachment', label: 'UAT File Attachment', type: 'file' },
        { id: 'KU1', label: 'Key User 1', type: 'people' },
        { id: 'KU2', label: 'Key User 2', type: 'people' },
        { id: 'KU3', label: 'Key User 3', type: 'people' },
        { id: 'BPO1', label: 'BPO 1', type: 'people' },
        { id: 'BPO2', label: 'BPO 2', type: 'people' },
        { id: 'CCEmailAdd', label: 'CC', type: 'people', multipleSelection: true },
        { id: 'SAPRemarks', label: 'SAP Remarks', type: 'textarea', placeholder: 'Enter SAP-specific remarks or notes' },
        { id: 'ITName', label: 'Submitted by (IT)', type: 'text', disabled: true },
        { id: 'UATSubmittedDate', label: 'Date Submitted', type: 'date', disabled: true },
      ],
    },
    {
      id: 'signoff-section',
      title: 'Sign Off Acceptance',
      visibleAtStages: ['KeyUser', 'BPO'],
      isStageGated: true,
      fields: [
        { id: 'KU1Attach', label: 'Key User Attachment', type: 'file' },
        { id: 'KU1Rem', label: 'Remarks', type: 'textarea' },
      ],
    },
  ],
  hasConditionalSections: false,
  hideApprovalChain: true,
};

export const SAPTR: ITFormConfig = {
  code: 'SAPTR',
  name: 'SAP Transport Request Form',
  module: 'M4' as const,
  moduleName: 'SAP Management',
  icon: Upload,
  color: '#0891b2',
  description: 'SAP Transport Request for moving changes between systems',
  database: 'MainDB_IT (PRAI)',
  stages: [
    { key: 'Request', name: 'Request', order: 1, actor: 'IT Functional', description: 'Submit transport request' },
    { key: 'Review', name: 'Review', order: 2, actor: 'IT Manager', description: 'Manager reviews request' },
    { key: 'Execute', name: 'Execute', order: 3, actor: 'BASIS Team', description: 'BASIS executes transport' },
  ],
  sections: [
    {
      id: 'section-a',
      title: 'Section A - Transport Request',
      visibleAtStages: ['Request', 'Review', 'Execute'],
      isStageGated: false,
      fields: [
        { id: 'ReqNum', label: 'Request Number', type: 'text', disabled: true },
        { id: 'FormStatus', label: 'Status', type: 'text', disabled: true },
        { id: 'btnAppArea', label: 'Module', type: 'select', required: true, options: [
          { value: 'FI', label: 'FI' }, { value: 'CO', label: 'CO' },
          { value: 'MM', label: 'MM' }, { value: 'SD', label: 'SD' },
          { value: 'PP', label: 'PP' }, { value: 'ABAP', label: 'ABAP' },
          { value: 'BASIS', label: 'BASIS' },
        ]},
        { id: 'Category', label: 'TR Category', type: 'select', required: true, options: [
          { value: 'WORKBENCH', label: 'Workbench' },
          { value: 'CUSTOMIZING', label: 'Customizing' },
          { value: 'TRANSPORT_COPY', label: 'Transport Copy' },
        ]},
        { id: 'DevCategory', label: 'Development Type', type: 'select', required: true, options: [
          { value: 'NEW', label: 'New Development' },
          { value: 'CHANGE', label: 'Change Request' },
          { value: 'BUG_FIX', label: 'Bug Fix' },
        ]},
        { id: 'Phase', label: 'Phase', type: 'select', required: true, options: [
          { value: 'DEV_TO_QA', label: 'DEV to QA' },
          { value: 'QA_TO_PROD', label: 'QA to PROD' },
          { value: 'EMERGENCY', label: 'Emergency' },
        ]},
        { id: 'Client', label: 'Client (From)', type: 'select', required: true, options: [
          { value: 'IED', label: 'IED - Development' },
          { value: 'IEQ', label: 'IEQ - Quality' },
        ]},
        { id: 'Client_2', label: 'Client (To)', type: 'select', required: true, options: [
          { value: 'IEQ', label: 'IEQ - Quality' },
          { value: 'IEP', label: 'IEP - Production' },
        ]},
        { id: 'IssueNum', label: 'CR/SSR/PRF/SAP Notes Number', type: 'text', required: true },
        { id: 'TRNumber', label: 'Transport Number', type: 'text', required: true },
        { id: 'TRDependant', label: 'Dependencies', type: 'text' },
        { id: 'Tcode', label: 'SAP Tcode', type: 'text' },
        { id: 'RptName', label: 'Report Name/Program Name/Fiori Apps', type: 'text' },
        { id: 'ChangesDone', label: 'Changes done', type: 'textarea', required: true },
        { id: 'Remarks', label: 'Remarks', type: 'textarea' },
        { id: 'Attachment', label: 'Attachment', type: 'file' },
        { id: 'KeyUser', label: 'Key User', type: 'people' },
        { id: 'CCFuncOwner', label: 'CC main/backup Functional Owner', type: 'people', multipleSelection: true },
      ],
    },
  ],
  hasConditionalSections: false,
  hideApprovalChain: true,
};

// =============================================================================
// MODULE 5: DOCUMENTATION FORMS (3 Forms)
// =============================================================================

export const ITI: ITFormConfig = {
  code: 'ITI',
  name: 'IT Information Broadcast',
  module: 'M5' as const,
  moduleName: 'IT Documentation',
  icon: Megaphone,
  color: '#f59e0b',
  description: 'IT information broadcast and notices',
  database: 'MainDB_IT (PRAI)',
  stages: [
    { key: 'Draft', name: 'Draft', order: 1, actor: 'IT Staff', description: 'Create broadcast' },
    { key: 'Publish', name: 'Publish', order: 2, actor: 'IT Admin', description: 'Publish broadcast' },
  ],
  sections: [
    {
      id: 'broadcast-info',
      title: 'Broadcast Information',
      visibleAtStages: ['Draft', 'Publish'],
      isStageGated: false,
      fields: [
        { id: 'Send', label: 'To', type: 'people', multipleSelection: true, required: true },
        { id: 'InfoType', label: 'Info Type', type: 'select', required: true, options: [
          { value: 'ANNOUNCEMENT', label: 'Announcement' },
          { value: 'MAINTENANCE', label: 'Scheduled Maintenance' },
          { value: 'OUTAGE', label: 'System Outage' },
          { value: 'UPDATE', label: 'System Update' },
          { value: 'POLICY', label: 'Policy Change' },
        ]},
        { id: 'Subject', label: 'Title', type: 'text', required: true },
        { id: 'Attachment', label: 'Attachment', type: 'file' },
        { id: 'ISGRemarks', label: 'Remarks', type: 'textarea', required: true },
        { id: 'Resend', label: 'Resend', type: 'checkbox' },
      ],
    },
    {
      id: 'hidden-fields',
      title: 'System Fields',
      visibleAtStages: ['Draft', 'Publish'],
      isStageGated: false,
      fields: [
        { id: 'Author', label: 'Creator', type: 'text', disabled: true },
        { id: 'DateSent', label: 'Date Sent', type: 'date', disabled: true },
        { id: 'Lock', label: 'Section Control', type: 'text', disabled: true },
        { id: 'ISAdmin', label: 'IT Admin', type: 'text', disabled: true },
        { id: 'CurrentAction', label: 'CurrentAction', type: 'text', disabled: true },
      ],
    },
  ],
  hasConditionalSections: false,
};

export const ITP: ITFormConfig = {
  code: 'ITP',
  name: 'ISG Documentation Register',
  module: 'M5' as const,
  moduleName: 'IT Documentation',
  icon: BookOpen,
  color: '#8b5cf6',
  description: 'IT/ISG documentation metadata and version control',
  database: 'MainDB_IT (PRAI)',
  extensionTable: 'docs',
  extensionTransform: (formData) => ({
    iTPDocType: fieldValue(formData, 'type'),
    iTPDocTitle: fieldValue(formData, 'doctitle'),
    iTPVersionNo: fieldValue(formData, 'verno'),
    iTPDateLastUpdated: fieldValue(formData, 'datelast'),
    iTPRevisionNo: fieldValue(formData, 'revision'),
    iTPApplicableTo: fieldValue(formData, 'ApplicableTo'),
    iTPComments: fieldValue(formData, 'Comments'),
    iTPAttachment: fieldValue(formData, 'att'),
  }),
  stages: [
    { key: 'Draft', name: 'Draft', order: 1, actor: 'IT Staff', description: 'Create document entry' },
    { key: 'Approve', name: 'Approve', order: 2, actor: 'IT Manager', description: 'Approve documentation' },
  ],
  sections: [
    {
      id: 'documentation',
      title: 'Documentation',
      visibleAtStages: ['Draft', 'Approve'],
      isStageGated: false,
      fields: [
        { id: 'type', label: 'Document Type', type: 'select', required: true, options: [
          { value: 'SOP', label: 'Standard Operating Procedure' },
          { value: 'POLICY', label: 'Policy' },
          { value: 'GUIDELINE', label: 'Guideline' },
          { value: 'MANUAL', label: 'User Manual' },
          { value: 'TEMPLATE', label: 'Template' },
        ]},
        { id: 'doctitle', label: 'Document Title', type: 'text', required: true },
        { id: 'verno', label: 'Version No.', type: 'text', required: true },
        { id: 'datelast', label: 'Date Last Updated', type: 'date', required: true },
        { id: 'revision', label: 'Revision No.', type: 'text', required: true },
        { id: 'Owner', label: 'Allow Editing By', type: 'people', multipleSelection: true },
        { id: 'att', label: 'Attachment', type: 'file', required: true },
        { id: 'ApplicableTo', label: 'Applicable To', type: 'select', required: true, options: [
          { value: 'ALL', label: 'All Staff' },
          { value: 'IT', label: 'IT Department' },
          { value: 'MANAGERS', label: 'Managers Only' },
          { value: 'SPECIFIC', label: 'Specific Groups' },
        ]},
        { id: 'Comments', label: 'Comment / Instruction', type: 'textarea' },
      ],
    },
  ],
  hasConditionalSections: false,
};

export const ITP2: ITFormConfig = {
  code: 'ITP2',
  name: 'ISG Training Manual',
  module: 'M5' as const,
  moduleName: 'IT Documentation',
  icon: BookOpen,
  color: '#0ea5e9',
  description: 'IT/ISG training documentation and manuals',
  database: 'MainDB_IT (PRAI)',
  extensionTable: 'docs',
  extensionTransform: (formData) => ({
    iTP2TrainingType: fieldValue(formData, 'Trgtype'),
    iTP2Title: fieldValue(formData, 'TrgTitle'),
    iTP2VersionNo: fieldValue(formData, 'Trgverno'),
    iTP2DateLastUpdated: fieldValue(formData, 'Trgdatelast'),
    iTP2RevisionNo: fieldValue(formData, 'Trgrevision'),
    iTP2ApplicableTo: fieldValue(formData, 'ApplicableTo'),
    iTP2Comments: fieldValue(formData, 'TrgComments'),
    iTP2Attachment: fieldValue(formData, 'Trgatt'),
  }),
  stages: [
    { key: 'Draft', name: 'Draft', order: 1, actor: 'IT Staff', description: 'Create training manual entry' },
    { key: 'Review', name: 'Review', order: 2, actor: 'IT Manager', description: 'Review training manual' },
  ],
  sections: [
    {
      id: 'training-manual',
      title: 'Training Manual',
      visibleAtStages: ['Draft', 'Review'],
      isStageGated: false,
      fields: [
        { id: 'Trgtype', label: 'Training Type', type: 'select', required: true, options: [
          { value: 'SYSTEM', label: 'System Training' },
          { value: 'APPLICATION', label: 'Application Training' },
          { value: 'PROCESS', label: 'Process Training' },
          { value: 'SECURITY', label: 'Security Training' },
          { value: 'ONBOARDING', label: 'Onboarding' },
        ]},
        { id: 'TrgTitle', label: 'Title', type: 'text', required: true },
        { id: 'Trgverno', label: 'Version No.', type: 'text', required: true },
        { id: 'Trgdatelast', label: 'Date Last Updated', type: 'date', required: true },
        { id: 'Trgrevision', label: 'Revision No.', type: 'text', required: true },
        { id: 'TrgOwner', label: 'Allow Editing By', type: 'people', multipleSelection: true },
        { id: 'Trgatt', label: 'Attachment', type: 'file', required: true },
        { id: 'ApplicableTo', label: 'Applicable To', type: 'select', required: true, options: [
          { value: 'ALL', label: 'All Staff' },
          { value: 'IT', label: 'IT Department' },
          { value: 'NEW_HIRE', label: 'New Hires' },
          { value: 'SPECIFIC', label: 'Specific Groups' },
        ]},
        { id: 'TrgComments', label: 'Comment / Instruction', type: 'textarea' },
      ],
    },
  ],
  hasConditionalSections: false,
};

export const IOIP: ITFormConfig = {
  code: 'IOIP',
  name: 'IOI Policy',
  module: 'M5' as const,
  moduleName: 'IT Documentation',
  icon: FileText,
  color: '#059669',
  description: 'Company policy management with approval workflow, revision history, and distribution',
  database: 'MainDB_IT + MainDB_IT_Ext_Policy',
  stages: [
    { key: 'Draft', name: 'Draft', order: 1, actor: 'Author', description: 'Policy being drafted (FinalStatus=0)' },
    { key: 'PendingApproval', name: 'Pending Approval', order: 2, actor: 'Approvers 1-3', description: 'Awaiting 3-level approval chain' },
    { key: 'Distributed', name: 'Distributed', order: 3, actor: 'Author', description: 'Policy distributed to staff (FinalStatus=4)' },
    { key: 'Archived', name: 'Archived', order: 4, actor: 'Author', description: 'Old policy archived (FinalStatus=6)' },
  ],
  sections: [
    {
      id: 'policy-header',
      title: 'Policy Information',
      visibleAtStages: ['Draft', 'PendingApproval', 'Distributed', 'Archived'],
      isStageGated: false,
      fields: [
        { id: 'PolicyNo', label: 'Policy No', type: 'text', required: true, placeholder: 'e.g., IOI-POL-001' },
        { id: 'Subject', label: 'Subject/Title', type: 'text', required: true, placeholder: 'Policy title' },
        { id: 'ReviNum', label: 'Revision Number', type: 'text', required: true, placeholder: 'e.g., 1.0' },
        { id: 'DateIssue', label: 'Effective Date', type: 'date', required: true },
        { id: 'Body', label: 'Policy Content', type: 'textarea', required: true, helperText: 'Main policy text/content' },
      ],
    },
    {
      id: 'approval-section',
      title: 'Approval Chain (3 Approvers)',
      visibleAtStages: ['Draft', 'PendingApproval'],
      isStageGated: false,
      fields: [
        { id: 'App1_1', label: 'Approver 1', type: 'people', required: true, helperText: 'First approver' },
        { id: 'App2_1', label: 'Approver 2', type: 'people', required: true, helperText: 'Second approver' },
        { id: 'App3_1', label: 'Approver 3', type: 'people', required: true, helperText: 'Third approver' },
        { id: 'DistributionList', label: 'Additional Distribution', type: 'people', multipleSelection: true, helperText: 'Additional staff to notify on distribution' },
      ],
    },
    {
      id: 'approver1-status',
      title: 'Approver 1 — Sign-off',
      visibleAtStages: ['PendingApproval'],
      isStageGated: true,
      fields: [
        { id: 'Status1', label: 'Status', type: 'select', options: [
          { value: '', label: 'Pending' },
          { value: '1', label: 'Approved' },
        ]},
        { id: 'comment1', label: 'Comment', type: 'textarea' },
        { id: 'DateApproved1', label: 'Date Approved', type: 'date', disabled: true },
      ],
    },
    {
      id: 'approver2-status',
      title: 'Approver 2 — Sign-off',
      visibleAtStages: ['PendingApproval'],
      isStageGated: true,
      fields: [
        { id: 'Status2', label: 'Status', type: 'select', options: [
          { value: '', label: 'Pending' },
          { value: '1', label: 'Approved' },
        ]},
        { id: 'comment2', label: 'Comment', type: 'textarea' },
        { id: 'DateApproved2', label: 'Date Approved', type: 'date', disabled: true },
      ],
    },
    {
      id: 'approver3-status',
      title: 'Approver 3 — Sign-off',
      visibleAtStages: ['PendingApproval'],
      isStageGated: true,
      fields: [
        { id: 'Status3', label: 'Status', type: 'select', options: [
          { value: '', label: 'Pending' },
          { value: '1', label: 'Approved' },
        ]},
        { id: 'comment3', label: 'Comment', type: 'textarea' },
        { id: 'DateApproved3', label: 'Date Approved', type: 'date', disabled: true },
      ],
    },
    {
      id: 'distribution-info',
      title: 'Distribution & Archive',
      visibleAtStages: ['Distributed', 'Archived'],
      isStageGated: true,
      fields: [
        { id: 'DefaultList', label: 'Distribution To', type: 'text', disabled: true, helperText: 'Auto-computed from approvers' },
        { id: 'DateArchived', label: 'Date Archived', type: 'date', disabled: true },
      ],
    },
    {
      id: 'revision-history',
      title: 'Revision History',
      visibleAtStages: ['Draft', 'PendingApproval', 'Distributed', 'Archived'],
      isStageGated: false,
      fields: [
        { id: 'Rev_R', label: 'Latest Revision', type: 'text', disabled: true },
        { id: 'Rev_D', label: 'Latest Revision Date', type: 'date', disabled: true },
        { id: 'Rev_U', label: 'Latest Updated By', type: 'text', disabled: true },
      ],
    },
  ],
  hasConditionalSections: true,
  conditionalSectionDescription: 'Stage-gated approval sections — each approver signs off in sequence. Distribution & Archive visible after approval.',
};

export const SAPSOF: ITFormConfig = {
  code: 'SAPSOF',
  name: 'SAP Sign-Off Form',
  module: 'M4' as const,
  moduleName: 'SAP Management',
  icon: CheckSquare,
  color: '#10b981',
  description: 'SAP project or change sign-off form',
  database: 'MainDB_IT (PRAI)',
  stages: [
    { key: 'S1', name: 'Initiation', order: 1, actor: 'IT Functional', description: 'Submit sign-off request' },
    { key: 'S2', name: 'User Testing', order: 2, actor: 'Business User', description: 'User acceptance testing' },
    { key: 'S3', name: 'BPO Sign-Off', order: 3, actor: 'Business Process Owner', description: 'BPO signs off' },
    { key: 'S4', name: 'IT Sign-Off', order: 4, actor: 'IT Manager', description: 'IT final sign-off' },
  ],
  sections: [
    {
      id: 'signoff-header',
      title: 'Sign-Off Header',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4'],
      isStageGated: false,
      fields: [
        { id: 'SOFNo', label: 'Sign-Off Number', type: 'text', disabled: true },
        { id: 'SOFType', label: 'Sign-Off Type', type: 'select', required: true, options: [
          { value: 'NEW_DEV', label: 'New Development' },
          { value: 'ENHANCEMENT', label: 'Enhancement' },
          { value: 'BUG_FIX', label: 'Bug Fix' },
          { value: 'CONFIG', label: 'Configuration Change' },
          { value: 'REPORT', label: 'Report Development' },
          { value: 'INTERFACE', label: 'Interface Development' },
          { value: 'MIGRATION', label: 'Data Migration' },
        ]},
        { id: 'Module', label: 'SAP Module', type: 'select', required: true, options: [
          { value: 'FI', label: 'FI - Finance' },
          { value: 'CO', label: 'CO - Controlling' },
          { value: 'MM', label: 'MM - Materials Management' },
          { value: 'SD', label: 'SD - Sales & Distribution' },
          { value: 'PP', label: 'PP - Production Planning' },
          { value: 'PM', label: 'PM - Plant Maintenance' },
          { value: 'QM', label: 'QM - Quality Management' },
          { value: 'HCM', label: 'HCM - Human Capital Management' },
          { value: 'BASIS', label: 'BASIS' },
          { value: 'ABAP', label: 'ABAP Development' },
        ]},
        { id: 'Plant', label: 'Plant', type: 'select', required: true, options: [
          { value: 'PRAI', label: 'Prai (MY-PR)' },
          { value: 'JOHOR', label: 'Johor (MY-JH)' },
          { value: 'ALL', label: 'All Plants' },
        ]},
        { id: 'ProjectRef', label: 'Project/CR Reference', type: 'text', required: true, placeholder: 'e.g., CR-2025-001' },
        { id: 'Title', label: 'Title / Description', type: 'text', required: true },
      ],
    },
    {
      id: 'change-details',
      title: 'Change Details',
      visibleAtStages: ['S1', 'S2', 'S3', 'S4'],
      isStageGated: false,
      fields: [
        { id: 'BusinessRequirement', label: 'Business Requirement', type: 'textarea', required: true },
        { id: 'TechnicalSpec', label: 'Technical Specification', type: 'textarea', required: true },
        { id: 'TestScenarios', label: 'Test Scenarios', type: 'textarea', required: true },
        { id: 'TransportNumbers', label: 'Transport Request Numbers', type: 'textarea', placeholder: 'List all transport numbers' },
        { id: 'Attachment', label: 'Supporting Documents', type: 'file' },
        { id: 'Remarks', label: 'Remarks', type: 'textarea' },
        { id: 'PreparedBy', label: 'Prepared By', type: 'text', disabled: true },
        { id: 'PreparedDate', label: 'Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'user-testing',
      title: 'User Acceptance Testing',
      visibleAtStages: ['S2', 'S3', 'S4'],
      isStageGated: true,
      fields: [
        { id: 'UATStatus', label: 'UAT Status', type: 'select', required: true, options: [
          { value: 'PASS', label: 'Pass - All Tests Successful' },
          { value: 'PASS_MINOR', label: 'Pass with Minor Issues' },
          { value: 'FAIL', label: 'Fail - Major Issues Found' },
        ]},
        { id: 'UATResults', label: 'Test Results Summary', type: 'textarea', required: true },
        { id: 'UATIssues', label: 'Issues Found (if any)', type: 'textarea' },
        { id: 'TestedBy', label: 'Tested By', type: 'people', required: true },
        { id: 'TestDate', label: 'Test Date', type: 'date', required: true },
        { id: 'UATAttachment', label: 'UAT Evidence', type: 'file' },
      ],
    },
    {
      id: 'bpo-signoff',
      title: 'Business Process Owner Sign-Off',
      visibleAtStages: ['S3', 'S4'],
      isStageGated: true,
      fields: [
        { id: 'BPOStatus', label: 'BPO Sign-Off Status', type: 'select', required: true, options: [
          { value: 'APPROVED', label: 'Approved for Production' },
          { value: 'REJECTED', label: 'Rejected' },
          { value: 'HOLD', label: 'On Hold' },
        ]},
        { id: 'BPOComments', label: 'BPO Comments', type: 'textarea' },
        { id: 'BPOSignedBy', label: 'Signed By', type: 'text', disabled: true },
        { id: 'BPODate', label: 'Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'it-signoff',
      title: 'IT Final Sign-Off',
      visibleAtStages: ['S4'],
      isStageGated: true,
      fields: [
        { id: 'ITSignOffStatus', label: 'IT Sign-Off Status', type: 'select', required: true, options: [
          { value: 'APPROVED', label: 'Approved - Ready for Transport' },
          { value: 'REJECTED', label: 'Rejected' },
        ]},
        { id: 'ProductionDate', label: 'Production Go-Live Date', type: 'date' },
        { id: 'ITComments', label: 'IT Comments', type: 'textarea' },
        { id: 'ITSignedBy', label: 'Signed By', type: 'text', disabled: true },
        { id: 'ITSignOffDate', label: 'Date', type: 'date', disabled: true },
      ],
    },
  ],
  hasConditionalSections: false,
};

// =============================================================================
// MODULE 7: SAP SYSTEMS (4 Forms)
// =============================================================================

export const SAP_ACC: ITFormConfig = {
  code: 'SAP-ACC',
  name: 'SAP Access Request',
  module: 'M4' as const,
  moduleName: 'SAP Systems',
  icon: Key,
  color: '#0284c7',
  description: 'Request access to SAP systems (ERP, S/4HANA, SuccessFactors)',
  database: 'MainDB_IT (PRAI)',
  stages: [
    { key: 'Submit', name: 'Submit Request', order: 1, actor: 'Requester', description: 'Submit SAP access request' },
    { key: 'ManagerApproval', name: 'Manager Approval', order: 2, actor: 'Manager', description: 'Manager approval for SAP access' },
    { key: 'ITProcessing', name: 'IT Processing', order: 3, actor: 'IT Admin', description: 'IT processes and grants access' },
  ],
  sections: [
    {
      id: 'requestor-info',
      title: 'Requestor Information',
      visibleAtStages: ['Submit', 'ManagerApproval', 'ITProcessing'],
      isStageGated: false,
      fields: [
        { id: 'requestorName', label: 'Requestor Name', type: 'text', required: true, disabled: true },
        { id: 'requestorEmail', label: 'Email', type: 'email', required: true, disabled: true },
        { id: 'requestorDept', label: 'Department', type: 'text', required: true },
        { id: 'requestorCompany', label: 'Company', type: 'select', required: true, options: [
          { value: 'IOI_CORP', label: 'IOI Corporation Berhad' },
          { value: 'IOI_OLEO', label: 'IOI Oleochemical Industries Berhad' },
          { value: 'IOI_PAN', label: 'IOI Pan-Century Oleochemicals Sdn Bhd' },
          { value: 'IOI_ACIDCHEM', label: 'IOI Acidchem Sdn Bhd' },
          { value: 'IOI_LIPID', label: 'IOI Lipid Enzymtec Sdn Bhd' },
        ]},
      ],
    },
    {
      id: 'sap-access-details',
      title: 'SAP Access Details',
      visibleAtStages: ['Submit', 'ManagerApproval', 'ITProcessing'],
      isStageGated: false,
      fields: [
        { id: 'sapSystem', label: 'SAP System', type: 'select', required: true, options: [
          { value: 'SAP_ERP', label: 'SAP ERP' },
          { value: 'SAP_S4HANA', label: 'SAP S/4HANA' },
          { value: 'SAP_SF', label: 'SAP SuccessFactors' },
          { value: 'SAP_BW', label: 'SAP BW/BI' },
          { value: 'SAP_ARIBA', label: 'SAP Ariba' },
        ]},
        { id: 'sapClient', label: 'SAP Client', type: 'select', required: true, options: [
          { value: 'IEP', label: 'IEP (Production)' },
          { value: 'IEQ', label: 'IEQ (Quality)' },
          { value: 'IED', label: 'IED (Development)' },
        ]},
        { id: 'accessType', label: 'Access Type', type: 'select', required: true, options: [
          { value: 'NEW', label: 'New Access' },
          { value: 'MODIFY', label: 'Modify Existing' },
          { value: 'REMOVE', label: 'Remove Access' },
        ]},
        { id: 'roles', label: 'Requested Roles/Authorizations', type: 'textarea', required: true, helperText: 'List the SAP roles or T-codes required' },
        { id: 'justification', label: 'Business Justification', type: 'textarea', required: true },
        { id: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
      ],
    },
    {
      id: 'it-processing',
      title: 'IT Processing',
      visibleAtStages: ['ITProcessing'],
      isStageGated: true,
      fields: [
        { id: 'sapUserId', label: 'SAP User ID Assigned', type: 'text' },
        { id: 'rolesGranted', label: 'Roles Granted', type: 'textarea' },
        { id: 'itNotes', label: 'IT Notes', type: 'textarea' },
      ],
    },
  ],
  hasConditionalSections: false,
};

export const SAP_AUTH: ITFormConfig = {
  code: 'SAP-AUTH',
  name: 'SAP Authorization Change',
  module: 'M4' as const,
  moduleName: 'SAP Systems',
  icon: Shield,
  color: '#7c3aed',
  description: 'Modify SAP user authorizations and role assignments',
  database: 'MainDB_IT (PRAI)',
  stages: [
    { key: 'Submit', name: 'Submit Request', order: 1, actor: 'Requester', description: 'Submit authorization change request' },
    { key: 'Review', name: 'Security Review', order: 2, actor: 'IT Security', description: 'IT security reviews authorization changes' },
    { key: 'Approve', name: 'Approval', order: 3, actor: 'IT Manager', description: 'Final approval for authorization change' },
  ],
  sections: [
    {
      id: 'user-info',
      title: 'User Information',
      visibleAtStages: ['Submit', 'Review', 'Approve'],
      isStageGated: false,
      fields: [
        { id: 'targetUser', label: 'Target User', type: 'people', required: true },
        { id: 'sapUserId', label: 'SAP User ID', type: 'text', required: true },
        { id: 'sapSystem', label: 'SAP System', type: 'select', required: true, options: [
          { value: 'SAP_ERP', label: 'SAP ERP' },
          { value: 'SAP_S4HANA', label: 'SAP S/4HANA' },
          { value: 'SAP_SF', label: 'SAP SuccessFactors' },
        ]},
        { id: 'sapClient', label: 'SAP Client', type: 'select', required: true, options: [
          { value: 'IEP', label: 'IEP (Production)' },
          { value: 'IEQ', label: 'IEQ (Quality)' },
          { value: 'IED', label: 'IED (Development)' },
        ]},
      ],
    },
    {
      id: 'auth-changes',
      title: 'Authorization Changes',
      visibleAtStages: ['Submit', 'Review', 'Approve'],
      isStageGated: false,
      fields: [
        { id: 'changeType', label: 'Change Type', type: 'select', required: true, options: [
          { value: 'ADD_ROLE', label: 'Add Role' },
          { value: 'REMOVE_ROLE', label: 'Remove Role' },
          { value: 'MODIFY_ROLE', label: 'Modify Role' },
          { value: 'COPY_USER', label: 'Copy from Another User' },
        ]},
        { id: 'currentRoles', label: 'Current Roles', type: 'textarea', helperText: 'List current roles (if known)' },
        { id: 'requestedChanges', label: 'Requested Changes', type: 'textarea', required: true, helperText: 'Detail the authorization changes needed' },
        { id: 'justification', label: 'Business Justification', type: 'textarea', required: true },
      ],
    },
    {
      id: 'security-review',
      title: 'Security Review',
      visibleAtStages: ['Review', 'Approve'],
      isStageGated: true,
      fields: [
        { id: 'segregationCheck', label: 'Segregation of Duties Check', type: 'select', options: [
          { value: 'PASS', label: 'Pass - No Conflicts' },
          { value: 'WARNING', label: 'Warning - Minor Conflicts' },
          { value: 'FAIL', label: 'Fail - Critical Conflicts' },
        ]},
        { id: 'securityNotes', label: 'Security Review Notes', type: 'textarea' },
      ],
    },
  ],
  hasConditionalSections: false,
};

export const SAP_TRANS: ITFormConfig = {
  code: 'SAP-TRANS',
  name: 'SAP Transport Request',
  module: 'M4' as const,
  moduleName: 'SAP Systems',
  icon: GitBranch,
  color: '#16a34a',
  description: 'Request SAP transport between systems (Dev → QA → Production)',
  database: 'MainDB_IT (PRAI)',
  stages: [
    { key: 'Submit', name: 'Submit Request', order: 1, actor: 'Developer', description: 'Submit transport request' },
    { key: 'TechnicalReview', name: 'Technical Review', order: 2, actor: 'IT Basis', description: 'Technical review of transport' },
    { key: 'Approve', name: 'Approval', order: 3, actor: 'IT Manager', description: 'Approve transport to target system' },
  ],
  sections: [
    {
      id: 'transport-info',
      title: 'Transport Information',
      visibleAtStages: ['Submit', 'TechnicalReview', 'Approve'],
      isStageGated: false,
      fields: [
        { id: 'transportNumber', label: 'Transport Request Number', type: 'text', required: true, helperText: 'e.g., DEVK900123' },
        { id: 'sourceSystem', label: 'Source System', type: 'select', required: true, options: [
          { value: 'IED', label: 'IED (Development)' },
          { value: 'IEQ', label: 'IEQ (Quality)' },
        ]},
        { id: 'targetSystem', label: 'Target System', type: 'select', required: true, options: [
          { value: 'IEQ', label: 'IEQ (Quality)' },
          { value: 'IEP', label: 'IEP (Production)' },
        ]},
        { id: 'transportType', label: 'Transport Type', type: 'select', required: true, options: [
          { value: 'WORKBENCH', label: 'Workbench Request' },
          { value: 'CUSTOMIZING', label: 'Customizing Request' },
          { value: 'MIXED', label: 'Mixed' },
        ]},
      ],
    },
    {
      id: 'transport-details',
      title: 'Transport Details',
      visibleAtStages: ['Submit', 'TechnicalReview', 'Approve'],
      isStageGated: false,
      fields: [
        { id: 'description', label: 'Description of Changes', type: 'textarea', required: true },
        { id: 'objects', label: 'Objects Included', type: 'textarea', required: true, helperText: 'List programs, tables, reports, etc.' },
        { id: 'testResults', label: 'Test Results in Source', type: 'textarea', required: true },
        { id: 'dependencies', label: 'Dependencies', type: 'textarea', helperText: 'List any dependent transports' },
        { id: 'rollbackPlan', label: 'Rollback Plan', type: 'textarea', required: true },
      ],
    },
    {
      id: 'technical-review',
      title: 'Technical Review',
      visibleAtStages: ['TechnicalReview', 'Approve'],
      isStageGated: true,
      fields: [
        { id: 'codeReview', label: 'Code Review Status', type: 'select', options: [
          { value: 'APPROVED', label: 'Approved' },
          { value: 'CHANGES_REQUIRED', label: 'Changes Required' },
          { value: 'REJECTED', label: 'Rejected' },
        ]},
        { id: 'technicalNotes', label: 'Technical Notes', type: 'textarea' },
        { id: 'scheduledDate', label: 'Scheduled Import Date', type: 'date' },
      ],
    },
  ],
  hasConditionalSections: false,
};

export const SAP_INC: ITFormConfig = {
  code: 'SAP-INC',
  name: 'SAP Incident Report',
  module: 'M4' as const,
  moduleName: 'SAP Systems',
  icon: ClipboardList,
  color: '#dc2626',
  description: 'Report SAP system incidents, errors, and issues',
  database: 'MainDB_IT (PRAI)',
  stages: [
    { key: 'Submit', name: 'Report Incident', order: 1, actor: 'User', description: 'Report SAP incident' },
    { key: 'Triage', name: 'Triage', order: 2, actor: 'IT Support', description: 'Triage and assign incident' },
    { key: 'Resolution', name: 'Resolution', order: 3, actor: 'IT Support', description: 'Resolve incident' },
  ],
  sections: [
    {
      id: 'incident-info',
      title: 'Incident Information',
      visibleAtStages: ['Submit', 'Triage', 'Resolution'],
      isStageGated: false,
      fields: [
        { id: 'reporterName', label: 'Reported By', type: 'text', required: true, disabled: true },
        { id: 'reporterEmail', label: 'Contact Email', type: 'email', required: true, disabled: true },
        { id: 'incidentDate', label: 'Date/Time of Incident', type: 'date', required: true },
        { id: 'sapSystem', label: 'SAP System Affected', type: 'select', required: true, options: [
          { value: 'SAP_ERP', label: 'SAP ERP' },
          { value: 'SAP_S4HANA', label: 'SAP S/4HANA' },
          { value: 'SAP_SF', label: 'SAP SuccessFactors' },
          { value: 'SAP_BW', label: 'SAP BW/BI' },
          { value: 'MULTIPLE', label: 'Multiple Systems' },
        ]},
        { id: 'sapClient', label: 'SAP Client', type: 'select', required: true, options: [
          { value: 'IEP', label: 'IEP (Production)' },
          { value: 'IEQ', label: 'IEQ (Quality)' },
          { value: 'IED', label: 'IED (Development)' },
        ]},
      ],
    },
    {
      id: 'incident-details',
      title: 'Incident Details',
      visibleAtStages: ['Submit', 'Triage', 'Resolution'],
      isStageGated: false,
      fields: [
        { id: 'severity', label: 'Severity', type: 'select', required: true, options: [
          { value: 'CRITICAL', label: 'Critical - System Down' },
          { value: 'HIGH', label: 'High - Major Function Impacted' },
          { value: 'MEDIUM', label: 'Medium - Workaround Available' },
          { value: 'LOW', label: 'Low - Minor Issue' },
        ]},
        { id: 'category', label: 'Category', type: 'select', required: true, options: [
          { value: 'PERFORMANCE', label: 'Performance' },
          { value: 'ERROR', label: 'Error/Exception' },
          { value: 'ACCESS', label: 'Access Issue' },
          { value: 'DATA', label: 'Data Issue' },
          { value: 'INTERFACE', label: 'Interface/Integration' },
          { value: 'OTHER', label: 'Other' },
        ]},
        { id: 'transactionCode', label: 'Transaction Code (if applicable)', type: 'text' },
        { id: 'description', label: 'Incident Description', type: 'textarea', required: true },
        { id: 'stepsToReproduce', label: 'Steps to Reproduce', type: 'textarea' },
        { id: 'errorMessage', label: 'Error Message (if any)', type: 'textarea' },
        { id: 'attachment', label: 'Screenshot/Attachment', type: 'file' },
      ],
    },
    {
      id: 'triage-section',
      title: 'Triage',
      visibleAtStages: ['Triage', 'Resolution'],
      isStageGated: true,
      fields: [
        { id: 'priority', label: 'Priority', type: 'select', options: [
          { value: 'P1', label: 'P1 - Immediate' },
          { value: 'P2', label: 'P2 - High' },
          { value: 'P3', label: 'P3 - Medium' },
          { value: 'P4', label: 'P4 - Low' },
        ]},
        { id: 'assignedTo', label: 'Assigned To', type: 'people' },
        { id: 'triageNotes', label: 'Triage Notes', type: 'textarea' },
      ],
    },
    {
      id: 'resolution-section',
      title: 'Resolution',
      visibleAtStages: ['Resolution'],
      isStageGated: true,
      fields: [
        { id: 'rootCause', label: 'Root Cause', type: 'textarea' },
        { id: 'resolution', label: 'Resolution', type: 'textarea' },
        { id: 'preventiveMeasures', label: 'Preventive Measures', type: 'textarea' },
      ],
    },
  ],
  hasConditionalSections: false,
};

// =============================================================================
// MODULE GROUPINGS
// =============================================================================

export const M1_FORMS: ITFormConfig[] = [EAF, NIR, RS, SFAR, UR];
export const M2_FORMS: ITFormConfig[] = [IAL1, IAL2, IAL3, IAL4, IAL5, ITDR, ITDR2, ITSSR, PRF, VPN, EDL];
export const M3_FORMS: ITFormConfig[] = [HI, ITSC, HI_JHR, SRVR, HWRR];
export const M4_FORMS: ITFormConfig[] = [SAPAMR, SAPCA, SAPCR, SAPDRP, SAPSLCF, SAPSOF, SAPSOF2, SAPTR];
export const M5_FORMS: ITFormConfig[] = [IOIP, ITI, ITP, ITP2];
export const M7_FORMS: ITFormConfig[] = [SAP_ACC, SAP_AUTH, SAP_TRANS, SAP_INC];
export const ALL_IT_FORMS: ITFormConfig[] = [...M1_FORMS, ...M2_FORMS, ...M3_FORMS, ...M4_FORMS, ...M5_FORMS, ...M7_FORMS];

// Get form by code
export function getFormByCode(code: string): ITFormConfig | undefined {
  return ALL_IT_FORMS.find((f) => f.code === code);
}

// Get forms by module
export function getFormsByModule(module: 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M7'): ITFormConfig[] {
  return ALL_IT_FORMS.filter((f) => f.module === module);
}

// Get current stage
export function getCurrentStage(form: ITFormConfig, stageKey: string): WorkflowStage | undefined {
  return form.stages.find((s) => s.key === stageKey);
}

// Get next stage
export function getNextStage(form: ITFormConfig, currentStageKey: string): WorkflowStage | undefined {
  const current = getCurrentStage(form, currentStageKey);
  if (!current) return undefined;
  return form.stages.find((s) => s.order === current.order + 1);
}

// Check if stage is conditional and should be skipped
export function shouldSkipStage(
  stage: WorkflowStage,
  formData: Record<string, unknown>
): boolean {
  if (!stage.isConditional) return false;
  if (!stage.conditionField) return false;

  const fieldValue = formData[stage.conditionField];

  if (stage.conditionValue === 'filled') {
    return !fieldValue || (typeof fieldValue === 'string' && fieldValue.trim() === '');
  }

  return fieldValue !== stage.conditionValue;
}

// Get visible sections for a stage
export function getVisibleSections(
  form: ITFormConfig,
  stageKey: string,
  formData?: Record<string, unknown>
): FormSection[] {
  return form.sections.filter((section) => {
    // Check if section is visible at this stage
    if (!section.visibleAtStages.includes(stageKey)) return false;

    // Handle service type switching for ITSSR
    if (form.code === 'ITSSR' && formData) {
      const serviceType = formData.serviceType as string;
      if (section.id === 'service-type-hardware' && serviceType !== 'Hardware') return false;
      if (section.id === 'service-type-application' && serviceType !== 'Application') return false;
      if (section.id === 'service-type-sap' && serviceType !== 'SAP') return false;
      if (section.id === 'service-type-bank' && serviceType !== 'Bank') return false;
    }

    return true;
  });
}

// Get stage progress percentage
export function getStageProgress(form: ITFormConfig, currentStageKey: string): number {
  const currentStage = getCurrentStage(form, currentStageKey);
  if (!currentStage) return 0;
  return Math.round((currentStage.order / form.stages.length) * 100);
}

// Stage status colors (IOI design system)
export const stageStatusColors = {
  completed: { bg: 'bg-[#E8F5E9]', text: 'text-[#166534]', border: 'border-[#166534]' },
  current: { bg: 'bg-[#EAF0FB]', text: 'text-[#1752A8]', border: 'border-[#1752A8]' },
  pending: { bg: 'bg-[#F5F5F5]', text: 'text-[#5C5C5C]', border: 'border-[#D0D0D0]' },
  skipped: { bg: 'bg-[#EEEEEE]', text: 'text-[#9E9E9E]', border: 'border-[#BDBDBD]' },
};
