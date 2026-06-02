// =============================================================================
// MODULE 1: USER & ACCESS MANAGEMENT - FORM FIELD DEFINITIONS
// Schema Reference: IT Department D06 (2026-05-01)
// =============================================================================

import type { FormSection } from './it-forms-config';

// =============================================================================
// EAF — External Access Form (VPN & Citrix)
// 51 Columns | 5-Stage Workflow | Site: PRAI
// =============================================================================

export const EAF_SECTIONS: FormSection[] = [
  // -----------------------------------------------------------------------------
  // Section 1: Request Information (visible at all stages)
  // -----------------------------------------------------------------------------
  {
    id: 'request-info',
    title: 'Request Information',
    description: 'Basic information about this access request',
    visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5'],
    isStageGated: false,
    fields: [
      {
        id: 'Title',
        label: 'Request ID',
        type: 'text',
        required: true,
        disabled: true,
        placeholder: 'Auto-generated (EAF-YYYYMM-####)',
        helperText: 'System-generated reference number',
      },
      {
        id: 'FormCode',
        label: 'Form Code',
        type: 'text',
        required: true,
        disabled: true,
        placeholder: 'EAF',
      },
      {
        id: 'Company',
        label: 'Company',
        type: 'select',
        required: true,
        placeholder: 'Select company...',
        options: [
          { value: 'IOI-ACM', label: 'IOI Acidchem Sdn Bhd' },
          { value: 'IOI-PCN', label: 'Pan-Century Oleochemicals Sdn Bhd' },
          { value: 'IOI-PAM', label: 'Palmco Sdn Bhd' },
          { value: 'IOI-OCP', label: 'IOI Oleochemical Industries Bhd' },
          { value: 'IOI-EDC', label: 'IOI Edible Oils Sdn Bhd' },
          { value: 'IOI-BHD', label: 'IOI Corporation Berhad' },
        ],
      },
      {
        id: 'SubmittedOn',
        label: 'Submitted On',
        type: 'text',
        required: true,
        disabled: true,
        placeholder: 'System timestamp',
      },
    ],
  },

  // -----------------------------------------------------------------------------
  // Section 2: Requestor Information
  // -----------------------------------------------------------------------------
  {
    id: 'requestor-info',
    title: 'Requestor Information',
    description: 'Details of the person submitting this request',
    visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5'],
    isStageGated: false,
    fields: [
      {
        id: 'Requestor',
        label: 'Requestor Name',
        type: 'people',
        required: true,
        placeholder: 'Search for requestor...',
      },
      {
        id: 'SubmittedBy',
        label: 'Submitted By',
        type: 'people',
        required: true,
        disabled: true,
        placeholder: 'Auto-filled from login',
        helperText: 'Governance audit field',
      },
      {
        id: 'SubmittedDate',
        label: 'Submitted Date',
        type: 'text',
        required: true,
        disabled: true,
        placeholder: 'Auto-filled timestamp',
      },
    ],
  },

  // -----------------------------------------------------------------------------
  // Section 3: Target User & Access Details
  // -----------------------------------------------------------------------------
  {
    id: 'access-details',
    title: 'Access Requirements',
    description: 'Specify the user and access type being requested',
    visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5'],
    isStageGated: false,
    fields: [
      {
        id: 'TargetUser',
        label: 'Target User',
        type: 'people',
        required: true,
        placeholder: 'Search for user who needs access...',
        helperText: 'The person who will use this VPN/Citrix access',
      },
      {
        id: 'Application',
        label: 'Application',
        type: 'select',
        required: true,
        placeholder: 'Select application...',
        options: [
          { value: 'Citrix', label: 'Citrix Remote Desktop' },
          { value: 'VPN', label: 'VPN Connection' },
          { value: 'Other', label: 'Other (specify in justification)' },
        ],
      },
      {
        id: 'SystemName',
        label: 'System Name',
        type: 'select',
        required: true,
        placeholder: 'Select system...',
        options: [
          { value: 'SAP-ECC', label: 'SAP ECC' },
          { value: 'SAP-HANA', label: 'SAP S/4HANA' },
          { value: 'SharePoint', label: 'SharePoint Online' },
          { value: 'FileServer', label: 'File Server' },
          { value: 'Email', label: 'Email (Outlook)' },
          { value: 'Database', label: 'Database Server' },
          { value: 'Other', label: 'Other System' },
        ],
      },
      {
        id: 'Justification',
        label: 'Justification',
        type: 'textarea',
        required: true,
        placeholder: 'Provide business justification for this access request...',
        helperText: 'Explain why this external access is needed',
      },
    ],
  },

  // -----------------------------------------------------------------------------
  // Section 4: Routing Information (Read-only, flow-managed)
  // -----------------------------------------------------------------------------
  {
    id: 'routing-info',
    title: 'Routing Information',
    description: 'Approval routing configuration (system-managed)',
    visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5'],
    isStageGated: false,
    fields: [
      {
        id: 'DepartmentHead',
        label: 'Department Head',
        type: 'people',
        required: true,
        placeholder: 'Search for department head...',
        helperText: 'Approver from matrix',
      },
      {
        id: 'CCRecipients',
        label: 'CC Recipients',
        type: 'people',
        multipleSelection: true,
        placeholder: 'Search for additional recipients...',
        helperText: 'Optional: additional people to notify',
      },
      {
        id: 'IsPCN',
        label: 'Is PCN Company',
        type: 'checkbox',
        disabled: true,
        helperText: 'Computed from company selection',
      },
    ],
  },

  // -----------------------------------------------------------------------------
  // Section 5: Department Head Approval (Stage-gated: S2+)
  // -----------------------------------------------------------------------------
  {
    id: 'dept-head-approval',
    title: 'Department Head Approval',
    description: 'Department head reviews and approves the request',
    visibleAtStages: ['S2', 'S3', 'S4', 'S5'],
    isStageGated: true,
    fields: [
      {
        id: 'DeptHeadStatus',
        label: 'Approval Status',
        type: 'select',
        required: true,
        options: [
          { value: 'Pending', label: 'Pending' },
          { value: 'Approved', label: 'Approved' },
          { value: 'Rejected', label: 'Rejected' },
        ],
      },
      {
        id: 'DeptHeadApprovedBy',
        label: 'Approved By',
        type: 'text',
        disabled: true,
        placeholder: 'Flow-managed',
      },
      {
        id: 'DeptHeadApprovedDate',
        label: 'Approval Date',
        type: 'text',
        disabled: true,
        placeholder: 'Flow-managed',
      },
      {
        id: 'DeptHeadComment',
        label: 'Comments',
        type: 'textarea',
        placeholder: 'Enter approval comments or feedback...',
      },
    ],
  },

  // -----------------------------------------------------------------------------
  // Section 6: Division Director Approval (Stage-gated: S3+)
  // -----------------------------------------------------------------------------
  {
    id: 'division-director-approval',
    title: 'Division Director Approval',
    description: 'Division Director sign-off for external access',
    visibleAtStages: ['S3', 'S4', 'S5'],
    isStageGated: true,
    fields: [
      {
        id: 'DDAppStatus',
        label: 'Approval Status',
        type: 'select',
        required: true,
        options: [
          { value: 'Pending', label: 'Pending' },
          { value: 'Approved', label: 'Approved' },
          { value: 'Rejected', label: 'Rejected' },
        ],
      },
      {
        id: 'DDAppApprovedBy',
        label: 'Approved By',
        type: 'text',
        disabled: true,
        placeholder: 'Flow-managed',
      },
      {
        id: 'DDAppApprovedDate',
        label: 'Approval Date',
        type: 'text',
        disabled: true,
        placeholder: 'Flow-managed',
      },
      {
        id: 'DDAppComment',
        label: 'Comments',
        type: 'textarea',
        placeholder: 'Enter approval comments or feedback...',
      },
    ],
  },

  // -----------------------------------------------------------------------------
  // Section 7: IT Manager Review (Stage-gated: S4+)
  // -----------------------------------------------------------------------------
  {
    id: 'it-manager-review',
    title: 'IT Manager Review',
    description: 'Technical review by IT Manager',
    visibleAtStages: ['S4', 'S5'],
    isStageGated: true,
    fields: [
      {
        id: 'ITManagerStatus',
        label: 'Review Status',
        type: 'select',
        required: true,
        options: [
          { value: 'Pending', label: 'Pending' },
          { value: 'Approved', label: 'Approved' },
          { value: 'Rejected', label: 'Rejected' },
        ],
      },
      {
        id: 'ITManagerApprovedBy',
        label: 'Reviewed By',
        type: 'text',
        disabled: true,
        placeholder: 'Flow-managed',
      },
      {
        id: 'ITManagerApprovedDate',
        label: 'Review Date',
        type: 'text',
        disabled: true,
        placeholder: 'Flow-managed',
      },
      {
        id: 'ITManagerComment',
        label: 'Technical Comments',
        type: 'textarea',
        placeholder: 'Enter technical review comments...',
      },
    ],
  },

  // -----------------------------------------------------------------------------
  // Section 8: IT Provisioning (Stage-gated: S5 only)
  // -----------------------------------------------------------------------------
  {
    id: 'it-provisioning',
    title: 'IT Provisioning',
    description: 'Access provisioning by IT Admin',
    visibleAtStages: ['S5'],
    isStageGated: true,
    fields: [
      {
        id: 'ITCompletionStatus',
        label: 'Completion Status',
        type: 'select',
        required: true,
        options: [
          { value: 'Pending', label: 'Pending' },
          { value: 'Completed', label: 'Completed' },
          { value: 'Rework', label: 'Requires Rework' },
        ],
      },
      {
        id: 'ITCompletedBy',
        label: 'Completed By',
        type: 'text',
        disabled: true,
        placeholder: 'Flow-managed',
      },
      {
        id: 'ITCompletedDate',
        label: 'Completion Date',
        type: 'text',
        disabled: true,
        placeholder: 'Flow-managed',
      },
      {
        id: 'ITCompletionRemarks',
        label: 'Completion Remarks',
        type: 'textarea',
        placeholder: 'Details about the provisioning...',
      },
      {
        id: 'ITInternalRemarks',
        label: 'Internal IT Remarks',
        type: 'textarea',
        placeholder: 'Internal notes (not visible to requester)',
        helperText: 'For IT team reference only',
      },
      {
        id: 'ITPIC',
        label: 'IT PIC',
        type: 'text',
        disabled: true,
        placeholder: 'Flow-managed',
      },
      {
        id: 'ITPIC2',
        label: 'IT PIC (Backup)',
        type: 'text',
        disabled: true,
        placeholder: 'Flow-managed',
      },
    ],
  },

  // -----------------------------------------------------------------------------
  // Section 9: Final Status & Governance
  // -----------------------------------------------------------------------------
  {
    id: 'final-status',
    title: 'Final Status',
    description: 'Overall request status and governance fields',
    visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5'],
    isStageGated: false,
    fields: [
      {
        id: 'Status',
        label: 'Status',
        type: 'select',
        required: true,
        disabled: true,
        options: [
          { value: 'Draft', label: 'Draft' },
          { value: 'Submitted', label: 'Submitted' },
          { value: 'InReview', label: 'In Review' },
          { value: 'Completed', label: 'Completed' },
          { value: 'Rejected', label: 'Rejected' },
          { value: 'Closed', label: 'Closed' },
        ],
      },
      {
        id: 'FinalStatus',
        label: 'Final Status',
        type: 'select',
        disabled: true,
        options: [
          { value: 'Open', label: 'Open' },
          { value: 'Approved', label: 'Approved' },
          { value: 'Rejected', label: 'Rejected' },
          { value: 'Closed', label: 'Closed' },
        ],
      },
      {
        id: 'CurrentAction',
        label: 'Current Action',
        type: 'select',
        required: true,
        disabled: true,
        options: [
          { value: 'Requestor', label: 'Requestor' },
          { value: 'HOD', label: 'HOD' },
          { value: 'DDApp', label: 'Division Director' },
          { value: 'ITManager', label: 'IT Manager' },
          { value: 'ITComplete', label: 'IT Complete' },
          { value: 'Closed', label: 'Closed' },
        ],
        helperText: 'State machine key',
      },
      {
        id: 'ApprovedBy',
        label: 'Final Approved By',
        type: 'text',
        disabled: true,
        placeholder: 'Flow-managed',
      },
      {
        id: 'ApprovedDate',
        label: 'Final Approval Date',
        type: 'text',
        disabled: true,
        placeholder: 'Flow-managed',
      },
      {
        id: 'Comments',
        label: 'Consolidated Comments',
        type: 'textarea',
        placeholder: 'Additional remarks...',
      },
    ],
  },

  // -----------------------------------------------------------------------------
  // Section 10: Flow Routing (Hidden, system-managed)
  // -----------------------------------------------------------------------------
  {
    id: 'flow-routing',
    title: 'Flow Routing Configuration',
    description: 'System-managed routing fields (for Power Automate)',
    visibleAtStages: [],
    isStageGated: true,
    fields: [
      { id: 'RouteACMIT', label: 'Route ACM IT', type: 'people', disabled: true },
      { id: 'RoutePCNIT', label: 'Route PCN IT', type: 'people', disabled: true },
      { id: 'RoutePCNIT2', label: 'Route PCN IT 2', type: 'people', disabled: true },
      { id: 'ExecutiveDirector', label: 'Executive Director', type: 'people', disabled: true },
      { id: 'HeadOfOperation', label: 'Head of Operation', type: 'people', disabled: true },
      { id: 'HigherApprover', label: 'Higher Approver', type: 'people', disabled: true },
      { id: 'RecipientRouting', label: 'Recipient Routing', type: 'people', multipleSelection: true, disabled: true },
      { id: 'ISManager', label: 'IS Manager', type: 'people', disabled: true },
      { id: 'ITAdmin', label: 'IT Admin', type: 'people', disabled: true },
      { id: 'ReminderTo', label: 'Reminder To', type: 'people', multipleSelection: true, disabled: true },
      { id: 'ReminderSubject', label: 'Reminder Subject', type: 'text', disabled: true },
      { id: 'WorkflowAuditJson', label: 'Workflow Audit JSON', type: 'textarea', disabled: true },
    ],
  },
];

// =============================================================================
// NIR — Notes ID Request
// Site: PRAI | 4-Stage Workflow
// =============================================================================

export const NIR_SECTIONS: FormSection[] = [
  {
    id: 'employee-info',
    title: 'Employee Information',
    description: 'Details of the employee requiring Notes ID',
    visibleAtStages: ['S1', 'S2', 'S3', 'S4'],
    isStageGated: false,
    fields: [
      { id: 'Title', label: 'Request ID', type: 'text', required: true, disabled: true, placeholder: 'Auto-generated (NIR-YYYYMM-####)' },
      { id: 'FormCode', label: 'Form Code', type: 'text', required: true, disabled: true, placeholder: 'NIR' },
      { id: 'EmployeeName', label: 'Employee Name', type: 'people', required: true, placeholder: 'Search for employee...' },
      { id: 'EmployeeID', label: 'Employee ID', type: 'text', required: true, placeholder: 'Employee number' },
      { id: 'Department', label: 'Department', type: 'text', required: true },
      { id: 'Position', label: 'Position', type: 'text', required: true },
      { id: 'Email', label: 'Email', type: 'email', placeholder: 'Existing email if any' },
    ],
  },
  {
    id: 'notes-details',
    title: 'Notes ID Details',
    description: 'Specify the Notes ID configuration required',
    visibleAtStages: ['S1', 'S2', 'S3', 'S4'],
    isStageGated: false,
    fields: [
      { id: 'NotesIDType', label: 'Notes ID Type', type: 'select', required: true, options: [
        { value: 'New', label: 'New Notes ID' },
        { value: 'Transfer', label: 'Transfer from Another Server' },
        { value: 'Reactivate', label: 'Reactivate Existing ID' },
      ]},
      { id: 'MailDatabase', label: 'Mail Database Server', type: 'select', required: true, options: [
        { value: 'Server1', label: 'Mail Server 1 (Prai)' },
        { value: 'Server2', label: 'Mail Server 2 (Johor)' },
      ]},
      { id: 'MailQuota', label: 'Mail Quota (MB)', type: 'number', placeholder: 'Default: 500' },
      { id: 'Justification', label: 'Business Justification', type: 'textarea', required: true },
    ],
  },
  {
    id: 'hod-approval',
    title: 'HOD Approval',
    description: 'Head of Department approval',
    visibleAtStages: ['S2', 'S3', 'S4'],
    isStageGated: true,
    fields: [
      { id: 'HODStatus', label: 'Approval Status', type: 'select', required: true, options: [
        { value: 'Pending', label: 'Pending' },
        { value: 'Approved', label: 'Approved' },
        { value: 'Rejected', label: 'Rejected' },
      ]},
      { id: 'HODApprovedBy', label: 'Approved By', type: 'people', disabled: true },
      { id: 'HODApprovedDate', label: 'Approval Date', type: 'date', disabled: true },
      { id: 'HODComments', label: 'Comments', type: 'textarea' },
    ],
  },
  {
    id: 'notes-admin',
    title: 'Notes Admin Action',
    description: 'Notes administrator creates the ID',
    visibleAtStages: ['S3', 'S4'],
    isStageGated: true,
    fields: [
      { id: 'NotesIDCreated', label: 'Notes ID Created', type: 'text', placeholder: 'Generated Notes ID' },
      { id: 'AdminActionDate', label: 'Action Date', type: 'text', disabled: true },
      { id: 'AdminComments', label: 'Admin Comments', type: 'textarea' },
    ],
  },
  {
    id: 'hardware-setup',
    title: 'Hardware Setup',
    description: 'IT Hardware team configures the workstation',
    visibleAtStages: ['S4'],
    isStageGated: true,
    fields: [
      { id: 'HardwareStatus', label: 'Hardware Status', type: 'select', options: [
        { value: 'Pending', label: 'Pending Setup' },
        { value: 'Completed', label: 'Setup Completed' },
        { value: 'Issue', label: 'Has Issues' },
      ]},
      { id: 'WorkstationID', label: 'Workstation ID', type: 'text', placeholder: 'Asset tag of workstation' },
      { id: 'SetupCompletedDate', label: 'Completion Date', type: 'text', disabled: true },
      { id: 'SetupRemarks', label: 'Setup Remarks', type: 'textarea' },
    ],
  },
];

// =============================================================================
// RS — Reset Password / Unlock ID
// Site: PRAI | Direct to IT PIC (no approval chain per plan)
// Application Type and Location determine PIC routing
// =============================================================================

export const RS_SECTIONS: FormSection[] = [
  {
    id: 'user-info',
    title: 'User Information',
    description: 'Details of the user requiring password reset or ID unlock',
    visibleAtStages: ['S1', 'S2'],
    isStageGated: false,
    fields: [
      // Name field allows manual entry (not just people picker) per plan
      { id: 'UserName', label: 'Name', type: 'text', required: true, placeholder: 'Enter full name of user requiring reset' },
      { id: 'Designation', label: 'Designation', type: 'text', placeholder: 'Job title/position' },
      // Company dropdown - uses SharePoint Config_Companies via useSharePointCompanies hook
      { id: 'Company', label: 'Company', type: 'select', required: true, placeholder: 'Select company...', options: [], helperText: 'Loaded from SharePoint' },
      // Extension Number (renamed from Contact Number per plan)
      { id: 'ExtensionNumber', label: 'Extension Number', type: 'text', placeholder: 'e.g., 1234' },
      // Department dropdown - uses SharePoint Config_Departments via useSharePointDepartments hook
      { id: 'Department', label: 'Department', type: 'select', required: true, placeholder: 'Select department...', options: [], helperText: 'Loaded from SharePoint' },
    ],
  },
  {
    id: 'reset-details',
    title: 'Reset Details',
    description: 'Application Type determines which IT PIC handles your request',
    visibleAtStages: ['S1', 'S2'],
    isStageGated: false,
    fields: [
      // Site Location - determines PIC routing
      { id: 'Location', label: 'Site Location', type: 'select', required: true, helperText: 'Required for PIC routing', options: [
        { value: 'PENANG', label: 'Penang (PRAI)' },
        { value: 'JOHOR', label: 'Johor (JHR)' },
      ]},
      // Application Type dropdown BEFORE Reset Type - uses SharePoint IT_M1_RS_SystemsList via useSharePointSystems hook
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
      // Reset Type dropdown with expanded options for SAP/SOLMAN/ESKER
      { id: 'ResetType', label: 'Reset Type', type: 'select', required: true, options: [
        { value: 'RESET', label: 'Reset Password' },
        { value: 'UNLOCK', label: 'Unlock ID' },
        { value: 'UNLOCK_RESET', label: 'Unlock ID and Reset Password' },
        { value: 'UNLOCK_ONLY', label: 'Unlock ID without resetting the password' },
        { value: 'BOTH', label: 'Reset & Unlock' },
      ], helperText: 'For SAP/SOLMAN/ESKER: additional unlock options available' },
      // System Login ID
      { id: 'SystemLoginId', label: 'System Login ID', type: 'text', required: true, helperText: 'Your login ID for the selected system' },
      // Reason for Reset (renamed from Justification per plan)
      { id: 'ReasonForReset', label: 'Reason for Reset', type: 'textarea', required: true, placeholder: 'Explain why password reset or ID unlock is needed' },
    ],
  },
  // SAP Client section - conditional on SAP S4/HANA
  {
    id: 'sap-details',
    title: 'SAP Details',
    description: 'Required when Application Type is SAP S4/HANA',
    visibleAtStages: ['S1', 'S2'],
    isStageGated: false,
    conditionalField: { field: 'ApplicationType', value: 'SAP S4/HANA' },
    fields: [
      // SAP Client dropdown - uses SharePoint IT_M1_RS_SAP_Client via useSharePointSAPClients hook
      { id: 'SAPClient', label: 'SAP Client', type: 'select', required: true, options: [
        { value: 'IEP', label: 'IEP - Production' },
        { value: 'IEQ', label: 'IEQ - Quality' },
        { value: 'IED', label: 'IED - Development' },
      ], helperText: 'Loaded from SharePoint' },
    ],
  },
  // IEP Client Name section - conditional on IEP (Live System)
  {
    id: 'iep-details',
    title: 'IEP Details',
    description: 'Required when Application Type is IEP (Live System)',
    visibleAtStages: ['S1', 'S2'],
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
    visibleAtStages: ['S1', 'S2'],
    isStageGated: false,
    conditionalField: { field: 'ApplicationType', value: 'BANK' },
    fields: [
      // Bank dropdown - uses SharePoint IT_M1_RS_Banks via useSharePointBanks hook
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
      ], helperText: 'Loaded from SharePoint' },
      { id: 'BankTokenSerial', label: 'Token Serial Number', type: 'text', helperText: 'If token reset required' },
    ],
  },
  // IT Processing section - stage gated for IT PIC (flow direct to IT per plan, no manager approval)
  {
    id: 'it-processing',
    title: 'IT Processing',
    description: 'IT PIC processes the reset (routed directly based on Application Type & Location)',
    visibleAtStages: ['S2'],
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
];

// =============================================================================
// SFAR — Share Folder Access Requisition
// Site: PRAI | 4-Stage Workflow (includes IT Verification for IOIPCNSHARE)
// Request Types: Grant Access, Remove Access, Delete Folder
// =============================================================================

export const SFAR_SECTIONS: FormSection[] = [
  {
    id: 'requester-info',
    title: 'Requester Information',
    description: 'Enter your details and approval routing',
    visibleAtStages: ['Draft', 'Review', 'ITVerify', 'Approve'],
    isStageGated: false,
    fields: [
      { id: 'Title', label: 'Request ID', type: 'text', required: true, disabled: true, placeholder: 'Auto-generated' },
      { id: 'FormCode', label: 'Form Code', type: 'text', required: true, disabled: true, placeholder: 'SFAR' },
      // Company dropdown - uses SharePoint Config_Companies via useSharePointCompanies hook
      { id: 'Company', label: 'Company', type: 'select', required: true, placeholder: 'Select company...', options: [], helperText: 'Loaded from SharePoint' },
      // Type of Folder selection (New/Existing) per plan
      { id: 'FolderType', label: 'Type of Folder', type: 'select', required: true, options: [
        { value: 'NEW', label: 'New Folder' },
        { value: 'EXISTING', label: 'Existing Folder' },
      ]},
      // Server Name dropdown - uses SharePoint IT_M1_SFAR_Servers via useSharePointServers hook
      { id: 'ServerName', label: 'Server Name', type: 'select', required: true, options: [
        { value: 'IOIPCNSHARE', label: 'IOIPCNSHARE (Requires IT Verification)' },
        { value: 'FILESVR', label: 'ACIDCHEM.COM\\FILESVR' },
        { value: 'FILESVR2', label: 'IOIOLEO.COM\\FILESVR' },
        { value: 'NETAPP', label: 'NetApp Storage' },
        { value: 'SHAREPOINT', label: 'SharePoint' },
        { value: 'ONEDRIVE', label: 'OneDrive for Business' },
      ], helperText: 'IOIPCNSHARE requires IT verification for new folders' },
      { id: 'RequesterName', label: 'Requester Name', type: 'people', required: true },
      // Department dropdown - uses SharePoint Config_Departments via useSharePointDepartments hook
      { id: 'Department', label: 'Department', type: 'select', required: true, placeholder: 'Select department...', options: [], helperText: 'Loaded from SharePoint' },
      { id: 'Extension', label: 'Extension', type: 'text', placeholder: 'Phone extension' },
      { id: 'HOD', label: 'HOD Approval', type: 'people', required: true, helperText: 'Head of Department for approval' },
      { id: 'CC', label: 'CC', type: 'people', multipleSelection: true },
    ],
  },
  {
    id: 'folder-details',
    title: 'Folder Access Details',
    description: 'Specify folder path and access configuration',
    visibleAtStages: ['Draft', 'Review', 'ITVerify', 'Approve'],
    isStageGated: false,
    fields: [
      // Request Type with Grant, Remove, and Delete Folder options per plan
      { id: 'RequestType', label: 'Request Type', type: 'select', required: true, options: [
        { value: 'GRANT', label: 'Grant Access' },
        { value: 'REMOVE', label: 'Remove Access' },
        { value: 'DELETE', label: 'Delete Folder' },
      ]},
      { id: 'FolderOwner', label: 'Owner of Folder', type: 'people', required: true, helperText: 'Person responsible for the folder' },
      { id: 'FolderPath', label: 'Folder Name (Including full path)', type: 'text', required: true, placeholder: 'e.g., \\\\FILESVR\\Shared\\Finance\\Reports' },
      // Grant Access To field (Windows IDs) - hidden for Delete Folder
      { id: 'GrantAccessTo', label: 'Grant Access To', type: 'people', helperText: 'User(s) requiring access' },
      { id: 'AccessToWindowsID', label: 'Access To (Windows Login ID)', type: 'text', placeholder: 'e.g., IOIOLEO\\john.smith', helperText: 'Windows ID for user requiring access' },
      { id: 'AccessToName', label: 'Access To Name', type: 'text', helperText: 'Full name of user' },
      // Permission field: Read Only / Write/Read per plan
      { id: 'Permission', label: 'Permission', type: 'select', required: true, options: [
        { value: 'READ', label: 'Read Only' },
        { value: 'WRITE_READ', label: 'Write/Read' },
      ]},
      { id: 'Remark', label: 'Remark', type: 'textarea', placeholder: 'Additional remarks or comments' },
    ],
  },
  // Folder Owner Approval section
  {
    id: 'folder-owner-approval',
    title: 'Folder Owner Approval',
    description: 'Owner of the folder reviews and approves the request',
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
  // IT Verification section - conditional on IOIPCNSHARE new folders per plan
  {
    id: 'it-verification',
    title: 'IT Verification',
    description: 'Required for new folders on IOIPCNSHARE only',
    visibleAtStages: ['ITVerify', 'Approve'],
    isStageGated: true,
    conditionalField: { field: 'ServerName', value: 'IOIPCNSHARE' },
    fields: [
      { id: 'ITVerifierStatus', label: 'Status', type: 'select', required: true, options: [
        { value: 'VERIFIED', label: 'Verified' },
        { value: 'REJECTED', label: 'Rejected' },
      ]},
      { id: 'ITVerifierRemarks', label: 'IT Verifier Remarks', type: 'textarea' },
      { id: 'ITVerifierName', label: 'IT Verifier Name', type: 'text', disabled: true },
      { id: 'VerifiedDate', label: 'Verified Date', type: 'date', disabled: true },
    ],
  },
  // IT Processing section
  {
    id: 'it-processing',
    title: 'IT Processing',
    description: 'IT Admin processes the folder access request',
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
];

// =============================================================================
// UR — User ID Requisition Form 2025
// Site: PRAI | 3-Stage Workflow
// NOTE: Please raise separate forms if the Request type are for both New and Existing ID together.
// =============================================================================

export const UR_SECTIONS: FormSection[] = [
  // Section 1: Request Information
  {
    id: 'request-info',
    title: 'Request Information',
    description: 'Please raise separate forms if the Request type are for both New and Existing ID together.',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    fields: [
      { id: 'Title', label: 'Request ID', type: 'text', required: true, disabled: true, placeholder: 'Auto-generated (UR-YYYYMM-####)' },
      { id: 'FormCode', label: 'Form Code', type: 'text', required: true, disabled: true, placeholder: 'UR' },
      { id: 'reqtype', label: 'Request Type', type: 'select', required: true, options: [
        { value: 'New', label: 'New ID' },
        { value: 'Existing', label: 'Existing ID' },
      ], helperText: 'Please raise SEPARATE forms for New and Existing ID requests' },
      { id: 'datecreated', label: 'Date Created', type: 'date', disabled: true },
    ],
  },
  // Section 2: Employee Information
  {
    id: 'employee-info',
    title: 'Employee Information',
    description: 'Details of the employee requiring user ID',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    fields: [
      { id: 'empname', label: 'Employee Full Name', type: 'people', required: true, placeholder: 'Search for employee...' },
      { id: 'EmployeeNum', label: "User's Emp. Number", type: 'text', required: true, placeholder: 'Employee number' },
      { id: 'designation', label: 'Designation', type: 'text', required: true },
      { id: 'coname', label: 'Company', type: 'select', required: true, options: [
        { value: 'IOI-ACM', label: 'IOI Acidchem Sdn Bhd' },
        { value: 'IOI-PCN', label: 'Pan-Century Oleochemicals Sdn Bhd' },
        { value: 'IOI-PAM', label: 'Palmco Sdn Bhd' },
        { value: 'IOI-OCP', label: 'IOI Oleochemical Industries Bhd' },
        { value: 'IOI-EDC', label: 'IOI Edible Oils Sdn Bhd' },
        { value: 'IOI-BHD', label: 'IOI Corporation Berhad' },
      ]},
      { id: 'division', label: 'Division', type: 'text', required: true },
      { id: 'dept', label: 'Department', type: 'text', required: true },
      { id: 'phnum', label: 'Phone Extension', type: 'text', placeholder: 'Extension number' },
      { id: 'EmailAddress', label: "User's Email Address", type: 'email', placeholder: 'user@ioigroup.com', helperText: 'For new employee please request for Notes ID first before raise UR.' },
    ],
  },
  // Section 3: Application Selection
  {
    id: 'application-selection',
    title: 'Application',
    description: 'Select the application/system requiring access',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    fields: [
      { id: 'type', label: 'Application', type: 'select', required: true, options: [
        { value: 'AccessCard', label: 'Access Card / Door Access' },
        { value: 'Bank', label: 'Bank System' },
        { value: 'Dashboard', label: 'Dashboard & Sales Portal' },
        { value: 'SAP', label: 'SAP/SAC' },
      ]},
    ],
  },
  // Section 4: Access Card / Door Access (conditional on type=AccessCard)
  {
    id: 'access-card-section',
    title: 'Access Card / Door Selection',
    description: 'Employee card and door access configuration',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    conditionalField: { field: 'type', value: 'AccessCard' },
    fields: [
      { id: 'EmployeeCard', label: 'Serial Number in Employee Card (last 5 digits)', type: 'text', required: true, placeholder: 'Last 5 digits of card serial' },
      { id: 'DoorSelection', label: 'Door Selection', type: 'select', required: true, options: [
        { value: 'MainEntrance', label: 'Main Entrance' },
        { value: 'OfficeArea', label: 'Office Area' },
        { value: 'ProductionArea', label: 'Production Area' },
        { value: 'ServerRoom', label: 'Server Room' },
        { value: 'Warehouse', label: 'Warehouse' },
        { value: 'Laboratory', label: 'Laboratory' },
        { value: 'All', label: 'All Areas (Requires Approval)' },
      ]},
    ],
  },
  // Section 5: Bank System (conditional on type=Bank)
  {
    id: 'bank-section',
    title: 'Bank System Access',
    description: 'Bank system access configuration',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    conditionalField: { field: 'type', value: 'Bank' },
    fields: [
      { id: 'Bank', label: 'Bank', type: 'select', required: true, options: [
        { value: 'Maybank', label: 'Maybank' },
        { value: 'CIMB', label: 'CIMB' },
        { value: 'PublicBank', label: 'Public Bank' },
        { value: 'RHB', label: 'RHB' },
        { value: 'HSBC', label: 'HSBC' },
        { value: 'Other', label: 'Other' },
      ]},
      { id: 'BankDesc', label: 'Please state the roles to assign', type: 'textarea', required: true, placeholder: 'Describe the bank system roles required...', helperText: 'Please inform Finance person in charge to fill up form to submit to bank for new ID creation! For existing token, please inform Finance person in charge to fill up form for requesting or recycle an existing token!' },
    ],
  },
  // Section 6: Dashboard & Sales Portal (conditional on type=Dashboard)
  {
    id: 'dashboard-section',
    title: 'Dashboard & Sales Portal Access',
    description: 'Dashboard and portal access configuration',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    conditionalField: { field: 'type', value: 'Dashboard' },
    fields: [
      { id: 'Plant', label: 'Plant (Dashboard & Sales Portal)', type: 'select', required: true, options: [
        { value: 'PRAI', label: 'Prai' },
        { value: 'JHR', label: 'Johor' },
        { value: 'ALL', label: 'All Plants' },
      ]},
      { id: 'dbmodules', label: 'Dashboard Modules (http://ioiintranet/Dashboard/Default.aspx)', type: 'textarea', placeholder: 'Specify the dashboard modules required...' },
      { id: 'PortalModule', label: 'Sales Portal Modules (Pls specify the modules/pages or specify the access same as which user)', type: 'textarea', placeholder: 'Specify modules/pages or reference user with same access...' },
    ],
  },
  // Section 7: SAP/SAC Access (conditional on type=SAP)
  {
    id: 'sap-section',
    title: 'SAP/SAC Access',
    description: 'SAP system access configuration',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    conditionalField: { field: 'type', value: 'SAP' },
    fields: [
      { id: 'SAPPlant', label: 'Plant (SAP/SAC)', type: 'select', required: true, options: [
        { value: 'PRAI', label: 'Prai' },
        { value: 'JHR', label: 'Johor' },
        { value: 'ALL', label: 'All Plants' },
      ]},
      { id: 'TCodeAccess', label: 'SAP/SAC Required Access (specify the TCode)', type: 'textarea', required: true, placeholder: 'List the TCodes required for access...' },
    ],
  },
  // Section 8: Duration & Access Type
  {
    id: 'access-config',
    title: 'Access Configuration',
    description: 'Duration and type of access',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    fields: [
      { id: 'AccessDuration', label: 'Duration', type: 'select', required: true, options: [
        { value: 'Permanent', label: 'Permanent' },
        { value: '30Days', label: '30 Days' },
        { value: '90Days', label: '90 Days' },
        { value: '6Months', label: '6 Months' },
        { value: '1Year', label: '1 Year' },
      ]},
      { id: 'AccessType', label: 'Access Type', type: 'select', required: true, options: [
        { value: 'ReadOnly', label: 'Read Only' },
        { value: 'ReadWrite', label: 'Read & Write' },
        { value: 'FullAccess', label: 'Full Access' },
      ]},
    ],
  },
  // Section 9: Approval Routing
  {
    id: 'approval-routing',
    title: 'Approval Routing',
    description: 'Approval chain configuration',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    fields: [
      { id: 'Approver', label: 'Approver (SAP - To be approved by BPO of Module Owner)', type: 'people', required: true, placeholder: 'Search for approver...' },
      { id: 'CC', label: 'CC [Mandatory for Cross Function Module]', type: 'people', multipleSelection: true, placeholder: 'Search for CC recipients...' },
      { id: 'Remark', label: 'Remark', type: 'textarea', placeholder: 'Additional remarks or notes...' },
    ],
  },
];

// =============================================================================
// EXPORT M1 FORM SECTIONS MAP
// =============================================================================

export const M1_FORM_SECTIONS: Record<string, FormSection[]> = {
  EAF: EAF_SECTIONS,
  NIR: NIR_SECTIONS,
  RS: RS_SECTIONS,
  SFAR: SFAR_SECTIONS,
  UR: UR_SECTIONS,
};