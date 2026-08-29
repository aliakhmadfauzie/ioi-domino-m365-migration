// =============================================================================
// IOI IT DEPARTMENT FORMS CONFIGURATION - REVISED
// Modules M1 (User & Access Management) and M2 (IT Support & Service Requests)
// UPDATED: Aligned with IT_RoutingRules.csv and ApprovalConfig(in).csv
// =============================================================================

import type { LucideIcon } from 'lucide-react';
import { ITSSR_DEPARTMENTS } from '@/types/m2-itssr-types';
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
  Lock,
  RefreshCw,
  Building2,
  FileCheck,
} from 'lucide-react';
import { HI, HI_JHR, HWRR, IAL1, IAL2, IAL3, IAL4, ITDR, ITDR2, ITI, ITP, ITP2, ITSC, ITSSR, SAP_ACC, SAP_AUTH, SAP_INC, SAP_TRANS, SAPAMR, SAPCA, SAPCR, SAPDRP, SAPSLCF, SAPSOF, SAPSOF2, SAPTR, SFAR, SRVR, UR } from './it-forms-config';

// =============================================================================
// SHARED OPTIONS
// =============================================================================

export const IOI_DEPARTMENT_OPTIONS: { value: string; label: string }[] = [
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
];

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
  /** Role that can act on this stage (from ActorRole in RoutingRules) */
  actorRole?: string;
  /** Can withdraw at this stage */
  canWithdraw?: boolean;
}

/** User-context properties that can be auto-filled from the authenticated user. */
export type AutoFillSource =
  | 'user.fullName'
  | 'user.email'
  | 'user.department';

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'date' | 'number' | 'file' | 'people';
  multipleSelection?: boolean;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  autoFill?: AutoFillSource;
}

export interface ConditionalFieldConfig {
  field: string;
  value: string;
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

export interface WithdrawalConfig {
  enabled: boolean;
  allowedStages: WorkflowStageKey[];
  allowedActors: string[];
  requiresReason: boolean;
  targetStatus: string;
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
  withdrawalConfig?: WithdrawalConfig;
}

// =============================================================================
// MODULE 1: USER & ACCESS MANAGEMENT (Updated Forms)
// =============================================================================

export const VPNACCESS: ITFormConfig = {
  code: 'VPNACCESS',
  name: 'VPN ACCESS REQUEST',
  module: 'M1',
  moduleName: 'User & Access Management',
  icon: Key,
  color: '#4f46e5',
  description: 'External Access Form - Request VPN or Citrix access for remote work',
  database: 'MainDB_IT (PRAI)',
  stages: [
    { key: 'Draft', name: 'Draft', order: 1, actor: 'Requestor', description: 'Initial form creation', canWithdraw: false },
    { key: 'PendingHOD', name: 'HOD Review', order: 2, actor: 'Department Head', description: 'Head of Department approves request', actorRole: 'REQ_DeptHead', canWithdraw: false },
    { key: 'PendingDivHead', name: 'Division Head Review', order: 3, actor: 'Division Head', description: 'Division Head approves request', actorRole: 'DIV_ApproverResolved', canWithdraw: false },
    { key: 'PendingITManager', name: 'IT Manager Review', order: 4, actor: 'IT Manager', description: 'IT Manager approves access level', actorRole: 'ITMGR_Resolved', canWithdraw: false },
    { key: 'PendingIT', name: 'IT Action', order: 5, actor: 'IT Admin', description: 'IT investigates and processes request', actorRole: 'IT_TeamMember', canWithdraw: false },
    { key: 'PendingITConfig', name: 'IT Configuration', order: 6, actor: 'IT Admin', description: 'IT Admin completes configuration', actorRole: 'IT_ADMIN', canWithdraw: false },
    { key: 'Closed', name: 'Closed', order: 7, actor: 'System', description: 'Workflow completed', canWithdraw: false },
  ],
  sections: [
    {
      id: 'form-header',
      title: 'EXTERNAL ACCESS FORM (VPN & Citrix)',
      visibleAtStages: ['Draft', 'PendingHOD', 'PendingDivHead', 'PendingITManager', 'PendingIT', 'PendingITConfig', 'Closed'],
      isStageGated: false,
      fields: [],
    },
    {
      id: 'requester-section',
      title: "REQUESTOR'S SECTION",
      visibleAtStages: ['Draft', 'PendingHOD', 'PendingDivHead', 'PendingITManager', 'PendingIT', 'PendingITConfig', 'Closed'],
      isStageGated: false,
      fields: [
        { id: 'Company', label: 'Company', type: 'select', required: true, options: IOI_COMPANY_OPTIONS },
        { id: 'req', label: 'Requestor', type: 'people', required: true },
        { id: 'date1', label: 'Submitted on', type: 'date', disabled: true },
        { id: 'UserID', label: 'User ID (Domain\\UserID)', type: 'text', required: true, placeholder: 'e.g., IOIOLEO\\John.Smith' },
        { id: 'User', label: 'User Name', type: 'people', required: true },
        { id: 'App', label: 'Application', type: 'select', required: true, options: [
          { value: 'VPN', label: 'VPN' },
          { value: 'Citrix', label: 'Citrix' },
          { value: 'Both', label: 'Both VPN & Citrix' },
        ]},
        { id: 'justification', label: 'Justification', type: 'textarea', required: true },
        { id: 'depthead', label: 'Head of Dept (HOD)', type: 'people', required: true },
        { id: 'CC', label: 'CC', type: 'people', multipleSelection: true },
      ],
    },
    {
      id: 'hod-approval',
      title: 'ACCEPTANCE OF DEPARTMENT HEAD',
      visibleAtStages: ['PendingHOD', 'PendingDivHead', 'PendingITManager', 'PendingIT', 'PendingITConfig', 'Closed'],
      isStageGated: true,
      fields: [
        { id: 'hod_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Approve', label: 'Approve' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'hod_comment', label: 'Comment', type: 'textarea' },
        { id: 'hod_approved_by', label: 'Accepted by', type: 'text', disabled: true },
        { id: 'hod_approved_date', label: 'Accepted Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'division-approval',
      title: 'Division Director Approval',
      visibleAtStages: ['PendingDivHead', 'PendingITManager', 'PendingIT', 'PendingITConfig', 'Closed'],
      isStageGated: true,
      fields: [
        { id: 'div_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Approve', label: 'Approve' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'div_comment', label: 'Comment', type: 'textarea' },
        { id: 'div_approved_by', label: 'Accepted by', type: 'text', disabled: true },
        { id: 'div_approved_date', label: 'Accepted Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'it-manager-approval',
      title: 'IT Manager Review',
      visibleAtStages: ['PendingITManager', 'PendingIT', 'PendingITConfig', 'Closed'],
      isStageGated: true,
      fields: [
        { id: 'itmgr_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Approve', label: 'Approve' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'itmgr_comment', label: 'Comment', type: 'textarea' },
        { id: 'itmgr_approved_by', label: 'Accepted by', type: 'text', disabled: true },
        { id: 'itmgr_approved_date', label: 'Accepted Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'it-action',
      title: 'IT Action',
      visibleAtStages: ['PendingIT', 'PendingITConfig', 'Closed'],
      isStageGated: true,
      fields: [
        { id: 'it_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Complete', label: 'Complete' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'it_comment', label: 'Comment', type: 'textarea' },
        { id: 'it_processed_by', label: 'Processed By', type: 'text', disabled: true },
        { id: 'it_processed_date', label: 'Processed Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'it-config',
      title: 'IT Configuration',
      visibleAtStages: ['PendingITConfig', 'Closed'],
      isStageGated: true,
      fields: [
        { id: 'config_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Complete', label: 'Complete' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'config_comment', label: 'Comment', type: 'textarea' },
        { id: 'config_completed_by', label: 'Completed By', type: 'text', disabled: true },
        { id: 'config_completed_date', label: 'Completed Date', type: 'date', disabled: true },
        { id: 'vpn_profile', label: 'VPN Profile Assigned', type: 'text' },
        { id: 'ip_address', label: 'IP Address Assigned', type: 'text' },
      ],
    },
  ],
  hasConditionalSections: true,
  conditionalSectionDescription: 'Stage-gated approval sections per tier',
};

export const NOTESID: ITFormConfig = {
  code: 'NOTESID',
  name: 'Notes ID Request',
  module: 'M1',
  moduleName: 'User & Access Management',
  icon: Mail,
  color: '#0ea5e9',
  database: 'MainDB_IT (PRAI)',
  description: 'Request a new IBM Notes/Lotus Notes user ID',
  stages: [
    { key: 'Draft', name: 'Request', order: 1, actor: 'Requester', description: 'Submit Notes ID request', canWithdraw: false },
    { key: 'PendingHOD', name: 'HOD Approval', order: 2, actor: 'Head of Department', description: 'HOD approves request', actorRole: 'REQ_DeptHead', canWithdraw: false },
    { key: 'PendingNotesAdmin', name: 'Notes Admin', order: 3, actor: 'Notes Administrator', description: 'Notes admin creates ID', actorRole: 'NotesAdmin', canWithdraw: false },
    { key: 'PendingITHardware', name: 'IT Hardware', order: 4, actor: 'IT Hardware Team', description: 'Hardware setup and delivery', actorRole: 'IT_Hardware_Assignee', canWithdraw: false },
    { key: 'Closed', name: 'Closed', order: 5, actor: 'System', description: 'Request completed', canWithdraw: false },
  ],
  sections: [
    {
      id: 'employee-info',
      title: 'Employee Information',
      visibleAtStages: ['Draft', 'PendingHOD', 'PendingNotesAdmin', 'PendingITHardware', 'Closed'],
      isStageGated: false,
      fields: [
        { id: 'RequestType', label: 'Request Type', type: 'select', required: true, options: [
          { value: 'NEW', label: 'New Email' },
          { value: 'REPLACEMENT', label: 'Replacement' },
          { value: 'RENAME', label: 'Rename' },
          { value: 'DELETE', label: 'Delete' },
        ]},
        { id: 'Company', label: 'Company', type: 'select', required: true, options: IOI_COMPANY_OPTIONS },
        { id: 'ExistingEmailAddress', label: 'Existing Email Address', type: 'email', helperText: 'Required for Replacement' },
        { id: 'FullName', label: 'Full Name', type: 'text', required: true },
        { id: 'EmployeeNumber', label: 'Employee Number', type: 'text', required: true },
        { id: 'Department', label: 'Department', type: 'select', required: true, options: IOI_DEPARTMENT_OPTIONS },
        { id: 'Designation', label: 'Designation / Job Title', type: 'text' },
        { id: 'PhoneExtension', label: 'Phone Extension', type: 'text' },
        { id: 'HODApprover', label: 'HOD Approver', type: 'people', required: true },
        { id: 'Remarks', label: 'Remarks', type: 'textarea' },
      ],
    },
    {
      id: 'hod-approval',
      title: 'HOD Approval',
      visibleAtStages: ['PendingHOD', 'PendingNotesAdmin', 'PendingITHardware', 'Closed'],
      isStageGated: true,
      fields: [
        { id: 'hod_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Approve', label: 'Approve' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'hod_comment', label: 'Comment', type: 'textarea' },
        { id: 'hod_approved_by', label: 'Approved By', type: 'text', disabled: true },
        { id: 'hod_approved_date', label: 'Approved Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'notes-admin',
      title: 'Notes Admin Action',
      visibleAtStages: ['PendingNotesAdmin', 'PendingITHardware', 'Closed'],
      isStageGated: true,
      fields: [
        { id: 'notes_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Complete', label: 'Complete' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'notes_comment', label: 'Notes Admin Remarks', type: 'textarea' },
        { id: 'notes_completed_by', label: 'Completed By', type: 'text', disabled: true },
        { id: 'notes_completed_date', label: 'Completed Date', type: 'date', disabled: true },
        { id: 'notes_id_created', label: 'Notes ID Created', type: 'text' },
      ],
    },
    {
      id: 'hardware-setup',
      title: 'IT Hardware Setup',
      visibleAtStages: ['PendingITHardware', 'Closed'],
      isStageGated: true,
      fields: [
        { id: 'hardware_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Complete', label: 'Complete' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'hardware_comment', label: 'Hardware Remarks', type: 'textarea' },
        { id: 'hardware_completed_by', label: 'Completed By', type: 'text', disabled: true },
        { id: 'hardware_completed_date', label: 'Completed Date', type: 'date', disabled: true },
        { id: 'asset_tag', label: 'Asset Tag', type: 'text' },
      ],
    },
  ],
  hasConditionalSections: true,
  conditionalSectionDescription: 'Stage-gated actor sections',
  hideApprovalChain: true,
};

export const PWDRESET: ITFormConfig = {
  code: 'PWDRESET',
  name: 'Reset Password / Unlock ID',
  module: 'M1',
  moduleName: 'User & Access Management',
  icon: RefreshCw,
  database: 'MainDB_IT (PRAI)',
  color: '#f59e0b',
  description: 'Request password reset or unlock user account',
  stages: [
    { key: 'Draft', name: 'Submission', order: 1, actor: 'Requester', description: 'Submit reset request', canWithdraw: false },
    { key: 'PendingIT', name: 'IT Processing', order: 2, actor: 'IT PIC', description: 'IT PIC processes the reset', actorRole: 'IT_TeamMember', canWithdraw: false },
    { key: 'PendingED', name: 'ED Approval', order: 3, actor: 'Executive Director', description: 'ED approval for bank systems', isConditional: true, conditionField: 'Bank', conditionValue: 'filled', actorRole: 'ED_Approver', canWithdraw: false },
    { key: 'Closed', name: 'Closed', order: 4, actor: 'System', description: 'Request completed', canWithdraw: false },
  ],
  sections: [
    {
      id: 'user-info',
      title: 'User Information',
      visibleAtStages: ['Draft', 'PendingIT', 'PendingED', 'Closed'],
      isStageGated: false,
      fields: [
        { id: 'UserName', label: 'Name', type: 'text', required: true, placeholder: 'Enter full name of user requiring reset' },
        { id: 'Designation', label: 'Designation', type: 'text' },
        { id: 'Company', label: 'Company', type: 'select', required: true, options: IOI_COMPANY_OPTIONS },
        { id: 'ExtensionNumber', label: 'Extension Number', type: 'text' },
        { id: 'Department', label: 'Department', type: 'select', required: true, options: IOI_DEPARTMENT_OPTIONS },
        { id: 'Site', label: 'Site', type: 'select', required: true, options: [
          { value: 'PENANG', label: 'Penang (PRAI)' },
          { value: 'JOHOR', label: 'Johor (JHR)' },
        ]},
        { id: 'SystemLoginId', label: 'System Login ID', type: 'text', required: true },
        { id: 'ReasonForReset', label: 'Reason for Reset', type: 'textarea', required: true },
      ],
    },
    {
      id: 'reset-details',
      title: 'Reset Details',
      visibleAtStages: ['Draft', 'PendingIT', 'PendingED', 'Closed'],
      isStageGated: false,
      fields: [
        { id: 'ApplicationType', label: 'Application Type', type: 'select', required: true, options: [
          { value: 'SAP S4/HANA', label: 'SAP S4/HANA' },
          { value: 'HCL NOTES', label: 'HCL Notes' },
          { value: 'BANK', label: 'Bank' },
          { value: 'ESKER', label: 'Esker' },
          { value: 'DOMAIN ID', label: 'Domain ID' },
          { value: 'VPN', label: 'VPN' },
          { value: 'OTHER', label: 'Other' },
        ]},
        { id: 'ResetType', label: 'Reset Type', type: 'select', required: true, options: [
          { value: 'RESET', label: 'Reset Password' },
          { value: 'UNLOCK', label: 'Unlock ID' },
          { value: 'BOTH', label: 'Reset & Unlock' },
        ]},
      ],
    },
    {
      id: 'bank-details',
      title: 'Bank System Details',
      visibleAtStages: ['Draft', 'PendingIT', 'PendingED', 'Closed'],
      isStageGated: false,
      conditionalField: { field: 'ApplicationType', value: 'BANK' },
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
        { id: 'BankTokenSerial', label: 'Token Serial Number', type: 'text' },
        { id: 'ExecutiveDirector', label: 'Executive Director (for approval)', type: 'people', required: true },
      ],
    },
    {
      id: 'it-processing',
      title: 'IT Processing',
      visibleAtStages: ['PendingIT', 'PendingED', 'Closed'],
      isStageGated: true,
      fields: [
        { id: 'it_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Complete', label: 'Complete' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'it_remarks', label: 'IT Remarks', type: 'textarea' },
        { id: 'it_processed_by', label: 'Processed By', type: 'text', disabled: true },
        { id: 'it_processed_date', label: 'Processed Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'ed-approval',
      title: 'Executive Director Approval',
      description: 'Required for Bank system resets',
      visibleAtStages: ['PendingED', 'Closed'],
      isStageGated: true,
      conditionalField: { field: 'ApplicationType', value: 'BANK' },
      fields: [
        { id: 'ed_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Approve', label: 'Approve' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'ed_remarks', label: 'ED Remarks', type: 'textarea' },
        { id: 'ed_approved_by', label: 'Approved By', type: 'text', disabled: true },
        { id: 'ed_approved_date', label: 'Approved Date', type: 'date', disabled: true },
      ],
    },
  ],
  hasConditionalSections: true,
  conditionalSectionDescription: 'Bank Details visible when Bank selected, ED Approval for Bank systems only',
  hideApprovalChain: true,
};

export const USERID: ITFormConfig = {
  code: 'USERID',
  name: 'IOI OLEOCHEMICAL User ID Request Form',
  module: 'M1',
  database: 'MainDB_IT (PRAI)',
  moduleName: 'User & Access Management',
  icon: UserPlus,
  color: '#8b5cf6',
  description: 'User ID Requisition Form - supports New, Existing, Reactivate, and Deactivate ID requests',
  stages: [
    { key: 'Draft', name: 'Draft', order: 1, actor: 'Requester', description: 'Create request', canWithdraw: true },
    { key: 'PendingHOD', name: 'HOD Review', order: 2, actor: 'Head of Department', description: 'HOD approval required', actorRole: 'REQ_DeptHead', canWithdraw: true },
    { key: 'PendingSAPIT', name: 'SAP/SAC IT Action', order: 3, actor: 'SAP IT', description: 'SAP module IT processes access', actorRole: 'SAPIT_AssignedTo', canWithdraw: true },
    { key: 'PendingBankIT', name: 'Bank IT Action', order: 4, actor: 'Bank IT', description: 'Bank module IT processes access', actorRole: 'BankIT_AssignedTo', canWithdraw: true },
    { key: 'PendingITChecker', name: 'IT Checker Review', order: 5, actor: 'IT Checker', description: 'IT checker validates setup', actorRole: 'IT_Checker', canWithdraw: true },
    { key: 'PendingBankToken', name: 'Bank Token Action', order: 6, actor: 'Bank Token IT', description: 'Bank token setup', actorRole: 'BankToken_AssignedTo', canWithdraw: true },
    { key: 'PendingFinance', name: 'Finance Maintenance', order: 7, actor: 'Finance', description: 'Finance completes maintenance', actorRole: 'FinanceMaintainer', canWithdraw: true },
    { key: 'Closed', name: 'Closed', order: 8, actor: 'System', description: 'Request completed', canWithdraw: false },
    { key: 'Withdrawn', name: 'Withdrawn', order: 9, actor: 'System', description: 'Request withdrawn', canWithdraw: false },
  ],
  withdrawalConfig: {
    enabled: true,
    allowedStages: ['Draft', 'PendingHOD', 'PendingSAPIT', 'PendingBankIT', 'PendingITChecker', 'PendingBankToken', 'PendingFinance'],
    allowedActors: ['Requestor', 'IT_MANAGER', 'IS_ADMIN'],
    requiresReason: true,
    targetStatus: 'Withdrawn',
  },
  sections: [
    {
      id: 'requestor-section',
      title: 'Requestor Section',
      description: 'Please raise separate forms if the Request type are for both New and Existing ID together.',
      visibleAtStages: ['Draft', 'PendingHOD', 'PendingSAPIT', 'PendingBankIT', 'PendingITChecker', 'PendingBankToken', 'PendingFinance', 'Closed', 'Withdrawn'],
      isStageGated: false,
      fields: [
        { id: 'RequestType', label: 'Request Type', type: 'select', required: true, options: [
          { value: 'NEW', label: 'New ID' },
          { value: 'EXISTING', label: 'Existing ID' },
          { value: 'REACTIVATE', label: 'Reactivate ID' },
          { value: 'DEACTIVATE', label: 'Deactivate ID' },
        ]},
        { id: 'EmployeeFullName', label: 'Employee Full Name', type: 'text', required: true },
        { id: 'EmployeeNumber', label: "User's Emp. Number", type: 'text', required: true },
        { id: 'Designation', label: 'Designation', type: 'text', required: true },
        { id: 'Company', label: 'Company', type: 'select', required: true, options: IOI_COMPANY_OPTIONS },
        { id: 'Division', label: 'Division', type: 'select', required: true, options: [
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
        { id: 'Department', label: 'Department', type: 'select', required: true, options: IOI_DEPARTMENT_OPTIONS },
        { id: 'Extension', label: 'Extension', type: 'text' },
        { id: 'EmailAddress', label: 'Email Address', type: 'email' },
        { id: 'Application', label: 'Application', type: 'select', required: true, options: [
          { value: 'AD', label: 'Active Directory' },
          { value: 'WINDOWS_ID', label: 'Windows ID' },
          { value: 'SAP', label: 'SAP S4/HANA' },
          { value: 'SAC', label: 'SAC (SAP Analytics Cloud)' },
          { value: 'NOTES', label: 'Lotus Notes' },
          { value: 'DOOR_ACCESS', label: 'Door Access' },
          { value: 'BANK', label: 'Bank System' },
          { value: 'ESKER', label: 'Esker' },
          { value: 'VPN', label: 'VPN' },
          { value: 'CITRIX', label: 'Citrix' },
        ]},
        { id: 'HOD', label: 'Head of Department', type: 'people', required: true },
      ],
    },
    {
      id: 'access-card-section',
      title: 'Access Card Details',
      visibleAtStages: ['Draft', 'PendingHOD', 'PendingSAPIT', 'PendingBankIT', 'PendingITChecker', 'PendingBankToken', 'PendingFinance', 'Closed', 'Withdrawn'],
      isStageGated: false,
      conditionalField: { field: 'Application', value: 'DOOR_ACCESS' },
      fields: [
        { id: 'EmployeeCardSerial', label: 'Employee Card Serial (last 5 digits)', type: 'text', required: true },
        { id: 'DoorSelection', label: 'Door Selection', type: 'select', required: true, options: [
          { value: 'MAIN_ENTRANCE', label: 'Main Entrance' },
          { value: 'SERVER_ROOM', label: 'Server Room' },
          { value: 'DATA_CENTER', label: 'Data Center' },
          { value: 'FINANCE_OFFICE', label: 'Finance Office' },
          { value: 'IT_OFFICE', label: 'IT Office' },
          { value: 'WAREHOUSE_MAIN', label: 'Warehouse Main' },
          { value: 'PRODUCTION_FLOOR', label: 'Production Floor' },
          { value: 'ALL_DOORS', label: 'All Doors' },
        ]},
      ],
    },
    {
      id: 'bank-section',
      title: 'Bank System Details',
      visibleAtStages: ['Draft', 'PendingHOD', 'PendingSAPIT', 'PendingBankIT', 'PendingITChecker', 'PendingBankToken', 'PendingFinance', 'Closed', 'Withdrawn'],
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
        { id: 'BankRoles', label: 'Roles to assign', type: 'textarea' },
        { id: 'BankUserEmail', label: "User's Email Address", type: 'email' },
      ],
    },
    {
      id: 'sap-plant-section',
      title: 'SAP/SAC Plant Selection',
      visibleAtStages: ['Draft', 'PendingHOD', 'PendingSAPIT', 'PendingBankIT', 'PendingITChecker', 'PendingBankToken', 'PendingFinance', 'Closed', 'Withdrawn'],
      isStageGated: false,
      conditionalField: {
        field: 'Application', values: ['SAP', 'SAC'],
        value: ''
      },
      fields: [
        { id: 'SAPPlant', label: 'Plant (SAP/SAC)', type: 'select', required: true, options: [
          { value: '1100', label: '1100 - IOI Plant' },
          { value: '1200', label: '1200 - ACM Plant' },
          { value: '1300', label: '1300 - AUS Plant' },
          { value: '1400', label: '1400 - DCM Plant' },
          { value: '1500', label: '1500 - POM Plant' },
          { value: '5100', label: '5100 - PEO - Fatty Acid' },
          { value: '5200', label: '5200 - POC Plant' },
        ]},
      ],
    },
    {
      id: 'hod-approval',
      title: 'HOD Approval',
      visibleAtStages: ['PendingHOD', 'PendingSAPIT', 'PendingBankIT', 'PendingITChecker', 'PendingBankToken', 'PendingFinance', 'Closed'],
      isStageGated: true,
      fields: [
        { id: 'hod_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Approve', label: 'Approve' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'hod_comment', label: 'Comment', type: 'textarea' },
        { id: 'hod_approved_by', label: 'Approved By', type: 'text', disabled: true },
        { id: 'hod_approved_date', label: 'Approved Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'sap-it-action',
      title: 'SAP/SAC IT Action',
      visibleAtStages: ['PendingSAPIT', 'PendingBankIT', 'PendingITChecker', 'PendingBankToken', 'PendingFinance', 'Closed'],
      isStageGated: true,
      fields: [
        { id: 'sapit_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Approve', label: 'Approve' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'sapit_comment', label: 'Remarks', type: 'textarea' },
        { id: 'sapit_processed_by', label: 'Processed By', type: 'text', disabled: true },
        { id: 'sapit_processed_date', label: 'Processed Date', type: 'date', disabled: true },
        { id: 'sap_user_id', label: 'SAP User ID Created', type: 'text' },
      ],
    },
    {
      id: 'bank-it-action',
      title: 'Bank IT Action',
      visibleAtStages: ['PendingBankIT', 'PendingITChecker', 'PendingBankToken', 'PendingFinance', 'Closed'],
      isStageGated: true,
      fields: [
        { id: 'bankit_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Approve', label: 'Approve' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'bankit_comment', label: 'Remarks', type: 'textarea' },
        { id: 'bankit_processed_by', label: 'Processed By', type: 'text', disabled: true },
        { id: 'bankit_processed_date', label: 'Processed Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'it-checker',
      title: 'IT Checker Review',
      visibleAtStages: ['PendingITChecker', 'PendingBankToken', 'PendingFinance', 'Closed'],
      isStageGated: true,
      fields: [
        { id: 'itchecker_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Approve', label: 'Approve' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'itchecker_comment', label: 'Review Comments', type: 'textarea' },
        { id: 'itchecker_approved_by', label: 'Reviewed By', type: 'text', disabled: true },
        { id: 'itchecker_approved_date', label: 'Review Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'bank-token',
      title: 'Bank Token Action',
      visibleAtStages: ['PendingBankToken', 'PendingFinance', 'Closed'],
      isStageGated: true,
      fields: [
        { id: 'banktoken_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Approve', label: 'Approve' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'banktoken_comment', label: 'Remarks', type: 'textarea' },
        { id: 'banktoken_processed_by', label: 'Processed By', type: 'text', disabled: true },
        { id: 'banktoken_processed_date', label: 'Processed Date', type: 'date', disabled: true },
        { id: 'token_serial', label: 'Token Serial Number', type: 'text' },
      ],
    },
    {
      id: 'finance-maintenance',
      title: 'Finance Maintenance',
      visibleAtStages: ['PendingFinance', 'Closed'],
      isStageGated: true,
      fields: [
        { id: 'finance_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Complete', label: 'Complete' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'finance_comment', label: 'Remarks', type: 'textarea' },
        { id: 'finance_completed_by', label: 'Completed By', type: 'text', disabled: true },
        { id: 'finance_completed_date', label: 'Completed Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'withdrawal-section',
      title: 'Withdrawal Request',
      visibleAtStages: ['Draft', 'PendingHOD', 'PendingSAPIT', 'PendingBankIT', 'PendingITChecker', 'PendingBankToken', 'PendingFinance'],
      isStageGated: true,
      fields: [
        { id: 'withdrawal_reason', label: 'Reason for Withdrawal', type: 'textarea', required: true },
        { id: 'withdrawal_requested_by', label: 'Requested By', type: 'text', disabled: true },
        { id: 'withdrawal_requested_date', label: 'Requested Date', type: 'date', disabled: true },
      ],
    },
  ],
  hasConditionalSections: true,
  conditionalSectionDescription: 'Access Card section visible when DOOR ACCESS selected, Bank section visible when Bank selected',
};

export const IOIPOL: ITFormConfig = {
  code: 'IOIPOL',
  name: 'IOI Policy',
  module: 'M1',
  moduleName: 'User & Access Management',
  icon: FileText,
  color: '#059669',
  description: 'IOI IT Policy documentation and guidelines',
  database: 'MainDB_IT (PRAI)',
  stages: [
    { key: 'Draft', name: 'Draft', order: 1, actor: 'Requester', description: 'Create policy entry', canWithdraw: false },
    { key: 'PendingAuthority1Table', name: 'Authority Table 1 Sign-Off', order: 2, actor: 'Authority1', description: 'First authority table signs policy', actorRole: 'Authority1Table', canWithdraw: false },
    { key: 'PendingAuthority2Table', name: 'Authority Table 2 Sign-Off', order: 3, actor: 'Authority2', description: 'Second authority table signs policy', actorRole: 'Authority2Table', canWithdraw: false },
    { key: 'Approved', name: 'Approved', order: 4, actor: 'System', description: 'Policy approved', canWithdraw: false },
  ],
  sections: [
    {
      id: 'policy-details',
      title: 'Policy Details',
      visibleAtStages: ['Draft', 'PendingAuthority1Table', 'PendingAuthority2Table', 'Approved'],
      isStageGated: false,
      fields: [
        { id: 'PolicyNo', label: 'Policy Number', type: 'text', disabled: true },
        { id: 'PolicyCategory', label: 'Policy Category', type: 'select', required: true, options: [
          { value: 'SECURITY', label: 'Security Policy' },
          { value: 'ACCESS', label: 'Access Control Policy' },
          { value: 'DATA', label: 'Data Management Policy' },
          { value: 'NETWORK', label: 'Network Policy' },
          { value: 'BACKUP', label: 'Backup & Recovery Policy' },
          { value: 'CHANGE', label: 'Change Management Policy' },
          { value: 'INCIDENT', label: 'Incident Management Policy' },
          { value: 'ACCEPTABLE_USE', label: 'Acceptable Use Policy' },
          { value: 'PASSWORD', label: 'Password Policy' },
          { value: 'OTHER', label: 'Other' },
        ]},
        { id: 'PolicyTitle', label: 'Policy Title', type: 'text', required: true },
        { id: 'VersionNo', label: 'Version Number', type: 'text', required: true },
        { id: 'EffectiveDate', label: 'Effective Date', type: 'date', required: true },
        { id: 'Scope', label: 'Scope / Applicable To', type: 'select', required: true, options: [
          { value: 'ALL', label: 'All Staff' },
          { value: 'IT', label: 'IT Department Only' },
          { value: 'MANAGEMENT', label: 'Management' },
        ]},
        { id: 'PolicyDescription', label: 'Policy Description', type: 'textarea', required: true },
        { id: 'PolicyStatements', label: 'Policy Statements', type: 'textarea', required: true },
        { id: 'Attachment', label: 'Policy Document', type: 'file', required: true },
        { id: 'PolicyOwner', label: 'Policy Owner', type: 'people', required: true },
        { id: 'CC', label: 'CC', type: 'people', multipleSelection: true },
      ],
    },
    {
      id: 'authority1-approval',
      title: 'Authority Table 1 Sign-Off',
      visibleAtStages: ['PendingAuthority1Table', 'PendingAuthority2Table', 'Approved'],
      isStageGated: true,
      fields: [
        { id: 'auth1_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Approve', label: 'Approve' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'auth1_comment', label: 'Comments', type: 'textarea' },
        { id: 'auth1_approved_by', label: 'Signed By', type: 'text', disabled: true },
        { id: 'auth1_approved_date', label: 'Sign Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'authority2-approval',
      title: 'Authority Table 2 Sign-Off',
      visibleAtStages: ['PendingAuthority2Table', 'Approved'],
      isStageGated: true,
      fields: [
        { id: 'auth2_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Approve', label: 'Approve' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'auth2_comment', label: 'Comments', type: 'textarea' },
        { id: 'auth2_approved_by', label: 'Signed By', type: 'text', disabled: true },
        { id: 'auth2_approved_date', label: 'Sign Date', type: 'date', disabled: true },
      ],
    },
  ],
  hasConditionalSections: false,
};

// =============================================================================
// MODULE 2: IT SUPPORT & SERVICE REQUESTS (Updated PRF with full stages)
// =============================================================================

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
    { key: 'Draft', name: 'Draft', order: 1, actor: 'Requester', description: 'Submit program request', canWithdraw: true },
    { key: 'PendingITApprover', name: 'IT Approver Update', order: 2, actor: 'IT Approver', description: 'IT approver updates routing', actorRole: 'ITApprover', canWithdraw: true },
    { key: 'PendingDivDeptHead', name: 'Division/Department Head Approval', order: 3, actor: 'Division Head', description: 'Division head approves request', actorRole: 'DIV_ApproverResolved', canWithdraw: true },
    { key: 'PendingITTaskAssign', name: 'IT Task Assignment', order: 4, actor: 'IT Manager', description: 'IT assigns task owners', actorRole: 'ITTaskAssigner', canWithdraw: true },
    { key: 'PendingFuncProcedure', name: 'Functional Procedure', order: 5, actor: 'IT Functional', description: 'Functional owner updates program', actorRole: 'FunctionalOwner', canWithdraw: true },
    { key: 'PendingITSupportUse', name: 'IT Support Use', order: 6, actor: 'IT Admin', description: 'IT captures support details', actorRole: 'ITSupport_AssignedTo', canWithdraw: true },
    { key: 'PendingSAPABAPAssign', name: 'SAP/ABAP Assignment', order: 7, actor: 'IT Manager', description: 'SAP/ABAP work assigned', actorRole: 'SAPABAP_AssignedTo', canWithdraw: true },
    { key: 'PendingITStaff', name: 'IT Staff Work', order: 8, actor: 'IT Admin', description: 'Assigned IT staff completes work', actorRole: 'ITStaff_AssignedTo', canWithdraw: true },
    { key: 'PendingITTesting', name: 'IT Testing', order: 9, actor: 'Tester', description: 'Testing completed', actorRole: 'Tester', canWithdraw: true },
    { key: 'PendingITFuncComplete', name: 'IT Functional Completion', order: 10, actor: 'IT Functional', description: 'Functional completion confirmed', actorRole: 'FunctionalOwner', canWithdraw: true },
    { key: 'PendingReqAcceptance', name: 'Requestor Acceptance', order: 11, actor: 'Requester', description: 'Requestor accepts solution', actorRole: 'Requestor', canWithdraw: true },
    { key: 'Closed', name: 'Closed', order: 12, actor: 'System', description: 'Request completed', canWithdraw: false },
    { key: 'Withdrawn', name: 'Withdrawn', order: 13, actor: 'System', description: 'Request withdrawn', canWithdraw: false },
  ],
  withdrawalConfig: {
    enabled: true,
    allowedStages: ['Draft', 'PendingITApprover', 'PendingDivDeptHead', 'PendingITTaskAssign', 'PendingFuncProcedure', 'PendingITSupportUse', 'PendingSAPABAPAssign', 'PendingITStaff', 'PendingITTesting', 'PendingITFuncComplete', 'PendingReqAcceptance'],
    allowedActors: ['Requestor', 'IT_MANAGER', 'IS_ADMIN'],
    requiresReason: true,
    targetStatus: 'Withdrawn',
  },
  sections: [
    {
      id: 'requester-info',
      title: 'Requester Information',
      visibleAtStages: ['Draft', 'PendingITApprover', 'PendingDivDeptHead', 'PendingITTaskAssign', 'PendingFuncProcedure', 'PendingITSupportUse', 'PendingSAPABAPAssign', 'PendingITStaff', 'PendingITTesting', 'PendingITFuncComplete', 'PendingReqAcceptance', 'Closed', 'Withdrawn'],
      isStageGated: false,
      fields: [
        { id: 'RequestorName', label: 'Requestor Name', type: 'text', required: true, disabled: true },
        { id: 'RequestorEmail', label: 'Email', type: 'email', required: true, disabled: true },
        { id: 'Company', label: 'Company', type: 'select', required: true, options: IOI_COMPANY_OPTIONS },
        { id: 'Department', label: 'Department', type: 'select', required: true, options: IOI_DEPARTMENT_OPTIONS },
        { id: 'PhoneExtension', label: 'Phone Extension', type: 'text' },
        { id: 'HOD', label: 'Head of Department', type: 'people', required: true },
      ],
    },
    {
      id: 'program-details',
      title: 'Program / System Request Details',
      visibleAtStages: ['Draft', 'PendingITApprover', 'PendingDivDeptHead', 'PendingITTaskAssign', 'PendingFuncProcedure', 'PendingITSupportUse', 'PendingSAPABAPAssign', 'PendingITStaff', 'PendingITTesting', 'PendingITFuncComplete', 'PendingReqAcceptance', 'Closed', 'Withdrawn'],
      isStageGated: false,
      fields: [
        { id: 'SystemList', label: 'System / Application', type: 'select', required: true, options: IOI_SYSTEM_OPTIONS },
        { id: 'RequestTitle', label: 'Request Title', type: 'text', required: true },
        { id: 'Objective', label: 'Objective', type: 'textarea', required: true },
        { id: 'Justification', label: 'Justification / Business Need', type: 'textarea', required: true },
        { id: 'CurrentProcess', label: 'Current Process / Problem', type: 'textarea', required: true },
        { id: 'ExpectedOutcome', label: 'Expected Outcome', type: 'textarea', required: true },
        { id: 'IsSAP', label: 'Does this involve SAP?', type: 'select', required: true, options: [
          { value: 'Yes', label: 'Yes — involves SAP system' },
          { value: 'No', label: 'No — non-SAP system' },
        ]},
        { id: 'Attachment', label: 'Supporting Documents', type: 'file' },
      ],
    },
    {
      id: 'it-approver',
      title: 'IT Approver Update',
      visibleAtStages: ['PendingITApprover', 'PendingDivDeptHead', 'PendingITTaskAssign', 'PendingFuncProcedure', 'PendingITSupportUse', 'PendingSAPABAPAssign', 'PendingITStaff', 'PendingITTesting', 'PendingITFuncComplete', 'PendingReqAcceptance', 'Closed'],
      isStageGated: true,
      fields: [
        { id: 'itapprover_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Complete', label: 'Complete' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'itapprover_comment', label: 'Remarks', type: 'textarea' },
        { id: 'itapprover_processed_by', label: 'Processed By', type: 'text', disabled: true },
        { id: 'itapprover_processed_date', label: 'Processed Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'division-approval',
      title: 'Division/Department Head Approval',
      visibleAtStages: ['PendingDivDeptHead', 'PendingITTaskAssign', 'PendingFuncProcedure', 'PendingITSupportUse', 'PendingSAPABAPAssign', 'PendingITStaff', 'PendingITTesting', 'PendingITFuncComplete', 'PendingReqAcceptance', 'Closed'],
      isStageGated: true,
      fields: [
        { id: 'div_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Approve', label: 'Approve' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'div_comment', label: 'Comment', type: 'textarea' },
        { id: 'div_approved_by', label: 'Approved By', type: 'text', disabled: true },
        { id: 'div_approved_date', label: 'Approved Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'it-task-assign',
      title: 'IT Task Assignment',
      visibleAtStages: ['PendingITTaskAssign', 'PendingFuncProcedure', 'PendingITSupportUse', 'PendingSAPABAPAssign', 'PendingITStaff', 'PendingITTesting', 'PendingITFuncComplete', 'PendingReqAcceptance', 'Closed'],
      isStageGated: true,
      fields: [
        { id: 'task_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Assign', label: 'Assign' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'task_assignee', label: 'Assigned To', type: 'people' },
        { id: 'task_comment', label: 'Remarks', type: 'textarea' },
        { id: 'task_processed_by', label: 'Processed By', type: 'text', disabled: true },
        { id: 'task_processed_date', label: 'Processed Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'functional-procedure',
      title: 'Functional Procedure',
      visibleAtStages: ['PendingFuncProcedure', 'PendingITSupportUse', 'PendingSAPABAPAssign', 'PendingITStaff', 'PendingITTesting', 'PendingITFuncComplete', 'PendingReqAcceptance', 'Closed'],
      isStageGated: true,
      fields: [
        { id: 'func_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Complete', label: 'Complete' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'func_comment', label: 'Remarks', type: 'textarea' },
        { id: 'func_processed_by', label: 'Processed By', type: 'text', disabled: true },
        { id: 'func_processed_date', label: 'Processed Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'it-support-use',
      title: 'IT Support Use',
      visibleAtStages: ['PendingITSupportUse', 'PendingSAPABAPAssign', 'PendingITStaff', 'PendingITTesting', 'PendingITFuncComplete', 'PendingReqAcceptance', 'Closed'],
      isStageGated: true,
      fields: [
        { id: 'support_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Complete', label: 'Complete' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'support_comment', label: 'Remarks', type: 'textarea' },
        { id: 'support_processed_by', label: 'Processed By', type: 'text', disabled: true },
        { id: 'support_processed_date', label: 'Processed Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'sap-abap-assign',
      title: 'SAP/ABAP Assignment',
      visibleAtStages: ['PendingSAPABAPAssign', 'PendingITStaff', 'PendingITTesting', 'PendingITFuncComplete', 'PendingReqAcceptance', 'Closed'],
      isStageGated: true,
      fields: [
        { id: 'sapabap_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Assign', label: 'Assign' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'sapabap_assignee', label: 'Assigned To', type: 'people' },
        { id: 'sapabap_comment', label: 'Remarks', type: 'textarea' },
        { id: 'sapabap_processed_by', label: 'Processed By', type: 'text', disabled: true },
        { id: 'sapabap_processed_date', label: 'Processed Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'it-staff-work',
      title: 'IT Staff Work',
      visibleAtStages: ['PendingITStaff', 'PendingITTesting', 'PendingITFuncComplete', 'PendingReqAcceptance', 'Closed'],
      isStageGated: true,
      fields: [
        { id: 'staff_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Complete', label: 'Complete' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'staff_comment', label: 'Remarks', type: 'textarea' },
        { id: 'staff_processed_by', label: 'Processed By', type: 'text', disabled: true },
        { id: 'staff_processed_date', label: 'Processed Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'it-testing',
      title: 'IT Testing',
      visibleAtStages: ['PendingITTesting', 'PendingITFuncComplete', 'PendingReqAcceptance', 'Closed'],
      isStageGated: true,
      fields: [
        { id: 'test_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Accept', label: 'Accept' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'test_comment', label: 'Testing Remarks', type: 'textarea' },
        { id: 'test_processed_by', label: 'Tested By', type: 'text', disabled: true },
        { id: 'test_processed_date', label: 'Test Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'it-func-complete',
      title: 'IT Functional Completion',
      visibleAtStages: ['PendingITFuncComplete', 'PendingReqAcceptance', 'Closed'],
      isStageGated: true,
      fields: [
        { id: 'func_complete_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Complete', label: 'Complete' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'func_complete_comment', label: 'Remarks', type: 'textarea' },
        { id: 'func_complete_processed_by', label: 'Processed By', type: 'text', disabled: true },
        { id: 'func_complete_processed_date', label: 'Processed Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'requestor-acceptance',
      title: 'Requestor Acceptance',
      visibleAtStages: ['PendingReqAcceptance', 'Closed'],
      isStageGated: true,
      fields: [
        { id: 'acceptance_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Accept', label: 'Accept' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'acceptance_comment', label: 'Remarks', type: 'textarea' },
        { id: 'acceptance_processed_by', label: 'Accepted By', type: 'text', disabled: true },
        { id: 'acceptance_processed_date', label: 'Acceptance Date', type: 'date', disabled: true },
      ],
    },
    {
      id: 'withdrawal-section',
      title: 'Withdrawal Request',
      visibleAtStages: ['Draft', 'PendingITApprover', 'PendingDivDeptHead', 'PendingITTaskAssign', 'PendingFuncProcedure', 'PendingITSupportUse', 'PendingSAPABAPAssign', 'PendingITStaff', 'PendingITTesting', 'PendingITFuncComplete', 'PendingReqAcceptance'],
      isStageGated: true,
      fields: [
        { id: 'withdrawal_reason', label: 'Reason for Withdrawal', type: 'textarea', required: true },
        { id: 'withdrawal_requested_by', label: 'Requested By', type: 'text', disabled: true },
        { id: 'withdrawal_requested_date', label: 'Requested Date', type: 'date', disabled: true },
      ],
    },
  ],
  hasConditionalSections: true,
  conditionalSectionDescription: 'SAP Functional section visible when IsSAP="Yes"',
  hideApprovalChain: true,
};

// =============================================================================
// MODULE 2: DATAREST (formerly IAL5)
// =============================================================================

export const DATAREST: ITFormConfig = {
  code: 'DATAREST',
  name: 'Data Restoration Request',
  module: 'M2',
  moduleName: 'IT Support & Service Requests',
  icon: RotateCcw,
  color: '#f97316',
  description: 'Request data restoration from backup',
  database: 'MainDB_IT (PRAI)',
  stages: [
    { key: 'Draft', name: 'Draft', order: 1, actor: 'Requester', description: 'Submit request', canWithdraw: false },
    { key: 'PendingBackupAdmin', name: 'Backup Administrator Action', order: 2, actor: 'Backup Administrator', description: 'Backup admin processes restoration', actorRole: 'Backup_Administrator', canWithdraw: false },
    { key: 'Closed', name: 'Closed', order: 3, actor: 'System', description: 'Restoration completed', canWithdraw: false },
  ],
  sections: [
    {
      id: 'requester-section',
      title: 'Requester Information',
      visibleAtStages: ['Draft', 'PendingBackupAdmin', 'Closed'],
      isStageGated: false,
      fields: [
        { id: 'Company', label: 'Company', type: 'select', required: true, options: IOI_COMPANY_OPTIONS },
        { id: 'Requestor', label: 'Requested by', type: 'people', required: true },
        { id: 'Department', label: 'Department', type: 'select', required: true, options: IOI_DEPARTMENT_OPTIONS },
        { id: 'ServerName', label: 'Server Name', type: 'select', required: true, options: [
          { value: 'FILE_SVR', label: 'File Server' },
          { value: 'SQL_SVR', label: 'SQL Server' },
          { value: 'EXCHANGE', label: 'Exchange Server' },
          { value: 'SHAREPOINT', label: 'SharePoint' },
        ]},
        { id: 'FilePath', label: 'Path', type: 'text', required: true },
        { id: 'FileName', label: 'Folder/File Name', type: 'text', required: true },
        { id: 'Reason', label: 'Reason for Restoration', type: 'textarea', required: true },
        { id: 'Attachment', label: 'Attachment', type: 'file' },
      ],
    },
    {
      id: 'backup-admin-section',
      title: 'Backup Administrator',
      visibleAtStages: ['PendingBackupAdmin', 'Closed'],
      isStageGated: true,
      fields: [
        { id: 'backup_status', label: 'Status', type: 'select', required: true, options: [
          { value: 'Complete', label: 'Complete' },
          { value: 'Reject', label: 'Reject' },
        ]},
        { id: 'backup_comment', label: 'Remarks', type: 'textarea' },
        { id: 'backup_processed_by', label: 'Processed By', type: 'text', disabled: true },
        { id: 'backup_processed_date', label: 'Processed Date', type: 'date', disabled: true },
        { id: 'RestoredFileName', label: 'Restored File Name', type: 'text' },
        { id: 'MediaName', label: 'Media Name', type: 'text' },
        { id: 'MediaDate', label: 'Media Date', type: 'date' },
      ],
    },
  ],
  hasConditionalSections: false,
  hideApprovalChain: true,
};

// =============================================================================
// MODULE GROUPINGS (UPDATED)
// =============================================================================

export const M1_FORMS: ITFormConfig[] = [VPNACCESS, NOTESID, PWDRESET, USERID, SFAR, UR, IOIPOL];
export const M2_FORMS: ITFormConfig[] = [IAL1, IAL2, IAL3, IAL4, DATAREST, ITDR, ITDR2, ITSSR, PRF];
export const M3_FORMS: ITFormConfig[] = [HI, ITSC, HI_JHR, SRVR, HWRR];
export const M4_FORMS: ITFormConfig[] = [SAPAMR, SAPCA, SAPCR, SAPDRP, SAPSLCF, SAPSOF, SAPSOF2, SAPTR];
export const M5_FORMS: ITFormConfig[] = [ITI, ITP, ITP2];
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

// Get previous stage
export function getPreviousStage(form: ITFormConfig, currentStageKey: string): WorkflowStage | undefined {
  const current = getCurrentStage(form, currentStageKey);
  if (!current) return undefined;
  return form.stages.find((s) => s.order === current.order - 1);
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
    if (!section.visibleAtStages.includes(stageKey)) return false;
    
    if (formData && section.conditionalField) {
      const fieldValue = formData[section.conditionalField.field];
      if (section.conditionalField.values) {
        if (!section.conditionalField.values.includes(fieldValue as string)) return false;
      } else if (fieldValue !== section.conditionalField.value) {
        return false;
      }
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

// Check if withdrawal is allowed at current stage
export function canWithdraw(form: ITFormConfig, stageKey: string, actorRole: string): boolean {
  if (!form.withdrawalConfig?.enabled) return false;
  
  const currentStage = getCurrentStage(form, stageKey);
  if (!currentStage) return false;
  
  const isStageAllowed = form.withdrawalConfig.allowedStages.includes(stageKey);
  const isActorAllowed = form.withdrawalConfig.allowedActors.includes(actorRole);
  const stageCanWithdraw = currentStage.canWithdraw !== false;
  
  return isStageAllowed && isActorAllowed && stageCanWithdraw;
}

// Get target stage after withdrawal
export function getWithdrawalTargetStage(form: ITFormConfig): string | undefined {
  return form.withdrawalConfig?.targetStatus;
}

// Stage status colors (IOI design system)
export const stageStatusColors = {
  completed: { bg: 'bg-[#E8F5E9]', text: 'text-[#166534]', border: 'border-[#166534]' },
  current: { bg: 'bg-[#EAF0FB]', text: 'text-[#1752A8]', border: 'border-[#1752A8]' },
  pending: { bg: 'bg-[#F5F5F5]', text: 'text-[#5C5C5C]', border: 'border-[#D0D0D0]' },
  skipped: { bg: 'bg-[#EEEEEE]', text: 'text-[#9E9E9E]', border: 'border-[#BDBDBD]' },
  withdrawn: { bg: 'bg-[#FEF2F2]', text: 'text-[#991B1B]', border: 'border-[#991B1B]' },
};

// Allowed actions per stage (derived from RoutingRules)
export const getAllowedActionsForStage = (
  form: ITFormConfig,
  stageKey: string,
  formData?: Record<string, unknown>
): string[] => {
  const stage = getCurrentStage(form, stageKey);
  if (!stage) return [];
  
  const actions: string[] = [];
  
  // Determine allowed actions based on stage and form code
  switch (form.code) {
    case 'VPNACCESS':
      if (stageKey === 'Draft') actions.push('Submit');
      if (stageKey === 'PendingHOD') actions.push('Approve', 'Reject');
      if (stageKey === 'PendingDivHead') actions.push('Approve', 'Reject');
      if (stageKey === 'PendingITManager') actions.push('Approve', 'Reject');
      if (stageKey === 'PendingIT') actions.push('Complete', 'Reject');
      if (stageKey === 'PendingITConfig') actions.push('Complete', 'Reject');
      break;
      
    case 'USERID':
      actions.push('Approve', 'Reject');
      if (stageKey !== 'Closed' && stageKey !== 'Withdrawn') actions.push('Withdraw');
      break;
      
    case 'PRF':
      if (stageKey === 'Draft') actions.push('Submit', 'Withdraw');
      if (stageKey === 'PendingITApprover') actions.push('Complete', 'Reject', 'Withdraw');
      if (stageKey === 'PendingDivDeptHead') actions.push('Approve', 'Reject', 'Withdraw');
      if (stageKey === 'PendingITTaskAssign') actions.push('Assign', 'Reject', 'Withdraw');
      if (stageKey === 'PendingFuncProcedure') actions.push('Complete', 'Reject', 'Withdraw');
      if (stageKey === 'PendingITSupportUse') actions.push('Complete', 'Reject', 'Withdraw');
      if (stageKey === 'PendingSAPABAPAssign') actions.push('Assign', 'Reject', 'Withdraw');
      if (stageKey === 'PendingITStaff') actions.push('Complete', 'Reject', 'Withdraw');
      if (stageKey === 'PendingITTesting') actions.push('Accept', 'Reject', 'Withdraw');
      if (stageKey === 'PendingITFuncComplete') actions.push('Complete', 'Reject', 'Withdraw');
      if (stageKey === 'PendingReqAcceptance') actions.push('Accept', 'Reject', 'Withdraw');
      break;
      
    case 'PWDRESET':
      if (stageKey === 'Draft') actions.push('Submit');
      if (stageKey === 'PendingIT') actions.push('Complete', 'Reject');
      if (stageKey === 'PendingED') actions.push('Approve', 'Reject');
      break;
      
    case 'NOTESID':
      if (stageKey === 'Draft') actions.push('Submit');
      if (stageKey === 'PendingHOD') actions.push('Approve', 'Reject');
      if (stageKey === 'PendingNotesAdmin') actions.push('Complete', 'Reject');
      if (stageKey === 'PendingITHardware') actions.push('Complete', 'Reject');
      break;
      
    case 'IOIPOL':
      if (stageKey === 'Draft') actions.push('Submit');
      if (stageKey === 'PendingAuthority1Table') actions.push('Approve', 'Reject');
      if (stageKey === 'PendingAuthority2Table') actions.push('Approve', 'Reject');
      break;
      
    case 'DATAREST':
      if (stageKey === 'Draft') actions.push('Submit');
      if (stageKey === 'PendingBackupAdmin') actions.push('Complete', 'Reject');
      break;
      
    default:
      actions.push('Approve', 'Reject', 'Submit');
  }
  
  return actions;
};