// =============================================================================
// IOI IT FORM FIELD DEFINITIONS
// Complete field configurations for all 14 forms in M1 and M2 modules
// =============================================================================

import type { FormField, ConditionalFieldConfig } from './it-forms-config';
import { ITSSR_DEPARTMENTS } from '@/types/m2-itssr-types';

const DEPARTMENT_OPTIONS = ITSSR_DEPARTMENTS.map((d) => ({ value: d, label: d }));

export interface SectionFieldConfig {
  sectionId: string;
  fields: FormField[];
  conditionalField?: ConditionalFieldConfig;
}

// =============================================================================
// EAF - External Access Form (VPN & Citrix)
// =============================================================================
export const EAF_FIELDS: SectionFieldConfig[] = [
  {
    sectionId: 'requester-info',
    fields: [
      { id: 'employeeName', label: 'Employee Name', type: 'text', required: true, autoFill: 'user.fullName', disabled: true },
      { id: 'employeeId', label: 'Employee ID', type: 'text', required: true, placeholder: 'e.g., EMP001' },
      { id: 'department', label: 'Department', type: 'select', required: true, autoFill: 'user.department', options: DEPARTMENT_OPTIONS },
      { id: 'email', label: 'Email Address', type: 'email', required: true, autoFill: 'user.email', disabled: true },
    ],
  },
  {
    sectionId: 'access-details',
    fields: [
      {
        id: 'accessType',
        label: 'Access Type',
        type: 'select',
        required: true,
        options: [
          { value: 'VPN', label: 'VPN Access' },
          { value: 'Citrix', label: 'Citrix Access' },
          { value: 'Both', label: 'Both VPN & Citrix' },
        ],
      },
      {
        id: 'duration',
        label: 'Duration',
        type: 'select',
        required: true,
        options: [
          { value: '1month', label: '1 Month' },
          { value: '3months', label: '3 Months' },
          { value: '6months', label: '6 Months' },
          { value: 'permanent', label: 'Permanent' },
        ],
      },
      { id: 'justification', label: 'Business Justification', type: 'textarea', required: true, placeholder: 'Explain why external access is needed' },
    ],
  },
  {
    sectionId: 'dept-approval',
    fields: [
      { id: 'deptApproval', label: 'Approval Decision', type: 'select', options: [{ value: 'approved', label: 'Approved' }, { value: 'rejected', label: 'Rejected' }] },
      { id: 'deptComments', label: 'Comments', type: 'textarea' },
    ],
  },
  {
    sectionId: 'director-approval',
    fields: [
      { id: 'directorApproval', label: 'Approval Decision', type: 'select', options: [{ value: 'approved', label: 'Approved' }, { value: 'rejected', label: 'Rejected' }] },
      { id: 'directorComments', label: 'Comments', type: 'textarea' },
    ],
  },
  {
    sectionId: 'it-review',
    fields: [
      { id: 'itReview', label: 'Technical Review', type: 'select', options: [{ value: 'approved', label: 'Approved' }, { value: 'requiresChanges', label: 'Requires Changes' }] },
      { id: 'itComments', label: 'Technical Notes', type: 'textarea' },
    ],
  },
  {
    sectionId: 'provisioning',
    fields: [
      { id: 'vpnAccount', label: 'VPN Account Created', type: 'checkbox' },
      { id: 'citrixAccount', label: 'Citrix Account Created', type: 'checkbox' },
      { id: 'expiryDate', label: 'Access Expiry Date', type: 'date' },
      { id: 'provisioningNotes', label: 'Provisioning Notes', type: 'textarea' },
    ],
  },
];

// =============================================================================
// NIR - Notes ID Request
// =============================================================================
export const NIR_FIELDS: SectionFieldConfig[] = [
  {
    sectionId: 'employee-info',
    fields: [
      { id: 'employeeName', label: 'Employee Name', type: 'text', required: true, autoFill: 'user.fullName', disabled: true },
      { id: 'employeeId', label: 'Employee ID', type: 'text', required: true },
      { id: 'department', label: 'Department', type: 'select', required: true, autoFill: 'user.department', options: DEPARTMENT_OPTIONS },
      { id: 'position', label: 'Position', type: 'text', required: true },
    ],
  },
  {
    sectionId: 'notes-details',
    fields: [
      { id: 'preferredId', label: 'Preferred Notes ID', type: 'text', placeholder: 'e.g., firstname.lastname' },
      { id: 'mailServer', label: 'Mail Server', type: 'select', options: [{ value: 'PRAI', label: 'PRAI Server' }, { value: 'JHR', label: 'JHR Server' }] },
    ],
  },
  {
    sectionId: 'hod-approval',
    fields: [
      { id: 'hodApproval', label: 'Approval', type: 'select', options: [{ value: 'approved', label: 'Approved' }, { value: 'rejected', label: 'Rejected' }] },
      { id: 'hodComments', label: 'Comments', type: 'textarea' },
    ],
  },
  {
    sectionId: 'notes-admin',
    fields: [
      { id: 'notesIdCreated', label: 'Notes ID Created', type: 'text' },
      { id: 'creationDate', label: 'Creation Date', type: 'date' },
    ],
  },
  {
    sectionId: 'hardware-setup',
    fields: [
      { id: 'hardwareAssigned', label: 'Hardware Assigned', type: 'checkbox' },
      { id: 'deliveryDate', label: 'Delivery Date', type: 'date' },
    ],
  },
];

// =============================================================================
// RS - Reset Password / Unlock ID
// =============================================================================
export const RS_FIELDS: SectionFieldConfig[] = [
  {
    sectionId: 'user-info',
    fields: [
      { id: 'userName', label: 'User Name', type: 'text', required: true, autoFill: 'user.fullName', disabled: true },
      { id: 'userId', label: 'User ID', type: 'text', required: true, autoFill: 'user.email', disabled: true },
      { id: 'contactPhone', label: 'Contact Phone', type: 'text' },
    ],
  },
  {
    sectionId: 'reset-details',
    fields: [
      {
        id: 'resetType',
        label: 'Reset Type',
        type: 'select',
        required: true,
        options: [
          { value: 'password', label: 'Password Reset' },
          { value: 'unlock', label: 'Unlock Account' },
          { value: 'both', label: 'Both' },
        ],
      },
      {
        id: 'system',
        label: 'System',
        type: 'select',
        required: true,
        options: [
          { value: 'AD', label: 'Active Directory' },
          { value: 'SAP', label: 'SAP' },
          { value: 'Notes', label: 'Lotus Notes' },
          { value: 'Bank', label: 'Bank System' },
        ],
      },
    ],
  },
  {
    sectionId: 'bank-system',
    conditionalField: { field: 'system', value: 'Bank' },
    fields: [
      { id: 'RS_Bank', label: 'Bank System Name', type: 'text' },
      { id: 'bankAccountType', label: 'Account Type', type: 'text' },
    ],
  },
  {
    sectionId: 'it-processing',
    fields: [
      { id: 'resetCompleted', label: 'Reset Completed', type: 'checkbox' },
      { id: 'processingNotes', label: 'Processing Notes', type: 'textarea' },
    ],
  },
  {
    sectionId: 'ed-approval',
    fields: [
      { id: 'edApproval', label: 'ED Approval', type: 'select', options: [{ value: 'approved', label: 'Approved' }, { value: 'rejected', label: 'Rejected' }] },
      { id: 'edComments', label: 'ED Comments', type: 'textarea' },
    ],
  },
];

// =============================================================================
// SFAR - Share Folder Access Requisition
// =============================================================================
export const SFAR_FIELDS: SectionFieldConfig[] = [
  {
    sectionId: 'requester-info',
    fields: [
      { id: 'requesterName', label: 'Name', type: 'text', required: true, autoFill: 'user.fullName', disabled: true },
      { id: 'requesterDept', label: 'Department', type: 'select', required: true, autoFill: 'user.department', options: DEPARTMENT_OPTIONS },
    ],
  },
  {
    sectionId: 'folder-details',
    fields: [
      { id: 'folderPath', label: 'Folder Path', type: 'text', required: true, placeholder: '\\\\server\\share\\folder' },
      { id: 'folderOwner', label: 'Folder Owner', type: 'text', required: true },
    ],
  },
  {
    sectionId: 'access-level',
    fields: [
      {
        id: 'accessLevel',
        label: 'Access Level',
        type: 'select',
        required: true,
        options: [
          { value: 'read', label: 'Read Only' },
          { value: 'write', label: 'Read/Write' },
          { value: 'full', label: 'Full Control' },
        ],
      },
      { id: 'justification', label: 'Justification', type: 'textarea' },
    ],
  },
];

// =============================================================================
// UR - User ID Requisition Form 2025
// =============================================================================
export const UR_FIELDS: SectionFieldConfig[] = [
  {
    sectionId: 'employee-info',
    fields: [
      { id: 'employeeName', label: 'Employee Name', type: 'text', required: true, autoFill: 'user.fullName', disabled: true },
      { id: 'employeeId', label: 'Employee ID', type: 'text', required: true },
      { id: 'department', label: 'Department', type: 'select', required: true, autoFill: 'user.department', options: DEPARTMENT_OPTIONS },
      { id: 'position', label: 'Position', type: 'text', required: true },
      { id: 'startDate', label: 'Start Date', type: 'date', required: true },
    ],
  },
  {
    sectionId: 'account-details',
    fields: [
      { id: 'preferredUsername', label: 'Preferred Username', type: 'text', placeholder: 'firstname.lastname' },
      { id: 'emailRequired', label: 'Email Account Required', type: 'checkbox' },
    ],
  },
  {
    sectionId: 'systems-access',
    fields: [
      { id: 'adAccess', label: 'Active Directory', type: 'checkbox' },
      { id: 'emailAccess', label: 'Email', type: 'checkbox' },
      { id: 'sapAccess', label: 'SAP', type: 'checkbox' },
      { id: 'otherSystems', label: 'Other Systems', type: 'textarea', placeholder: 'List other required systems' },
    ],
  },
];

// =============================================================================
// IAL1 - Server Reboot Log
// =============================================================================
export const IAL1_FIELDS: SectionFieldConfig[] = [
  {
    sectionId: 'server-info',
    fields: [
      { id: 'serverName', label: 'Server Name', type: 'text', required: true },
      { id: 'serverIP', label: 'IP Address', type: 'text' },
      { id: 'environment', label: 'Environment', type: 'select', options: [{ value: 'prod', label: 'Production' }, { value: 'dev', label: 'Development' }, { value: 'test', label: 'Testing' }] },
    ],
  },
  {
    sectionId: 'reboot-details',
    fields: [
      { id: 'rebootDate', label: 'Reboot Date/Time', type: 'date', required: true },
      { id: 'reason', label: 'Reason for Reboot', type: 'textarea', required: true },
      { id: 'plannedUnplanned', label: 'Type', type: 'select', options: [{ value: 'planned', label: 'Planned' }, { value: 'unplanned', label: 'Unplanned' }] },
    ],
  },
  {
    sectionId: 'verification',
    fields: [
      { id: 'serverUp', label: 'Server Back Online', type: 'checkbox' },
      { id: 'servicesRestored', label: 'All Services Restored', type: 'checkbox' },
      { id: 'verificationNotes', label: 'Notes', type: 'textarea' },
    ],
  },
];

// =============================================================================
// IAL2 - Data Center Access Log
// =============================================================================
export const IAL2_FIELDS: SectionFieldConfig[] = [
  {
    sectionId: 'visitor-info',
    fields: [
      { id: 'visitorName', label: 'Visitor Name', type: 'text', required: true },
      { id: 'company', label: 'Company', type: 'text' },
      { id: 'purpose', label: 'Purpose of Visit', type: 'textarea', required: true },
    ],
  },
  {
    sectionId: 'access-details',
    fields: [
      { id: 'entryTime', label: 'Entry Time', type: 'text', required: true },
      { id: 'escortedBy', label: 'Escorted By', type: 'text', required: true },
    ],
  },
  {
    sectionId: 'exit-time',
    fields: [
      { id: 'exitTime', label: 'Exit Time', type: 'text' },
      { id: 'accessNotes', label: 'Notes', type: 'textarea' },
    ],
  },
];

// =============================================================================
// IAL3 - IT Event
// =============================================================================
export const IAL3_FIELDS: SectionFieldConfig[] = [
  {
    sectionId: 'event-info',
    fields: [
      { id: 'eventTitle', label: 'Event Title', type: 'text', required: true },
      { id: 'eventDate', label: 'Event Date', type: 'date', required: true },
      { id: 'eventType', label: 'Event Type', type: 'select', options: [{ value: 'incident', label: 'Incident' }, { value: 'maintenance', label: 'Maintenance' }, { value: 'change', label: 'Change' }] },
    ],
  },
  {
    sectionId: 'impact',
    fields: [
      { id: 'impactLevel', label: 'Impact Level', type: 'select', options: [{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }] },
      { id: 'affectedSystems', label: 'Affected Systems', type: 'textarea' },
    ],
  },
  {
    sectionId: 'resolution',
    fields: [
      { id: 'resolutionSteps', label: 'Resolution Steps', type: 'textarea' },
      { id: 'preventiveMeasures', label: 'Preventive Measures', type: 'textarea' },
    ],
  },
];

// =============================================================================
// IAL4 - Server Records
// =============================================================================
export const IAL4_FIELDS: SectionFieldConfig[] = [
  {
    sectionId: 'server-details',
    fields: [
      { id: 'serverName', label: 'Server Name', type: 'text', required: true },
      { id: 'serverType', label: 'Server Type', type: 'select', options: [{ value: 'physical', label: 'Physical' }, { value: 'virtual', label: 'Virtual' }] },
      { id: 'operatingSystem', label: 'Operating System', type: 'text' },
    ],
  },
  {
    sectionId: 'configuration',
    fields: [
      { id: 'cpu', label: 'CPU', type: 'text' },
      { id: 'memory', label: 'Memory (GB)', type: 'number' },
      { id: 'storage', label: 'Storage (GB)', type: 'number' },
    ],
  },
  {
    sectionId: 'maintenance',
    fields: [
      { id: 'lastMaintenance', label: 'Last Maintenance', type: 'date' },
      { id: 'nextMaintenance', label: 'Next Scheduled Maintenance', type: 'date' },
    ],
  },
];

// =============================================================================
// IAL5 - Data Restoration Request
// =============================================================================
export const IAL5_FIELDS: SectionFieldConfig[] = [
  {
    sectionId: 'requester-info',
    fields: [
      { id: 'requesterName', label: 'Name', type: 'text', required: true, autoFill: 'user.fullName', disabled: true },
      { id: 'department', label: 'Department', type: 'select', required: true, autoFill: 'user.department', options: DEPARTMENT_OPTIONS },
    ],
  },
  {
    sectionId: 'data-details',
    fields: [
      { id: 'dataPath', label: 'Data Path/Location', type: 'text', required: true },
      { id: 'dataDescription', label: 'Description of Data', type: 'textarea', required: true },
      { id: 'restoreDate', label: 'Restore to Date', type: 'date', required: true },
    ],
  },
  {
    sectionId: 'backup-source',
    fields: [
      { id: 'backupType', label: 'Backup Type', type: 'select', options: [{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }] },
      { id: 'urgency', label: 'Urgency', type: 'select', options: [{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }] },
    ],
  },
];

// =============================================================================
// ITDR - IT Daily Report
// =============================================================================
export const ITDR_FIELDS: SectionFieldConfig[] = [
  {
    sectionId: 'date-shift',
    fields: [
      { id: 'reportDate', label: 'Report Date', type: 'date', required: true },
      { id: 'shift', label: 'Shift', type: 'select', options: [{ value: 'morning', label: 'Morning' }, { value: 'afternoon', label: 'Afternoon' }, { value: 'night', label: 'Night' }] },
    ],
  },
  {
    sectionId: 'activities',
    fields: [
      { id: 'activitiesSummary', label: 'Activities Summary', type: 'textarea', required: true },
      { id: 'ticketsResolved', label: 'Tickets Resolved', type: 'number' },
    ],
  },
  {
    sectionId: 'issues',
    fields: [
      { id: 'issuesEncountered', label: 'Issues Encountered', type: 'textarea' },
      { id: 'escalations', label: 'Escalations', type: 'textarea' },
    ],
  },
];

// =============================================================================
// ITDR2 - Outstanding Tasks Register
// =============================================================================
export const ITDR2_FIELDS: SectionFieldConfig[] = [
  {
    sectionId: 'task-info',
    fields: [
      { id: 'taskTitle', label: 'Task Title', type: 'text', required: true },
      { id: 'taskDescription', label: 'Description', type: 'textarea', required: true },
      { id: 'assignee', label: 'Assigned To', type: 'text' },
    ],
  },
  {
    sectionId: 'status',
    fields: [
      { id: 'taskStatus', label: 'Status', type: 'select', options: [{ value: 'notStarted', label: 'Not Started' }, { value: 'inProgress', label: 'In Progress' }, { value: 'blocked', label: 'Blocked' }, { value: 'completed', label: 'Completed' }] },
      { id: 'progressNotes', label: 'Progress Notes', type: 'textarea' },
    ],
  },
  {
    sectionId: 'target-date',
    fields: [
      { id: 'targetDate', label: 'Target Completion Date', type: 'date', required: true },
      { id: 'priority', label: 'Priority', type: 'select', options: [{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }] },
    ],
  },
];

// =============================================================================
// ITSSR - IT Support & Service Request 2025
// =============================================================================
export const ITSSR_FIELDS: SectionFieldConfig[] = [
  {
    sectionId: 'requester-info',
    fields: [
      { id: 'requesterName', label: 'Name', type: 'text', required: true, autoFill: 'user.fullName', disabled: true },
      { id: 'department', label: 'Department', type: 'select', required: true, autoFill: 'user.department', options: DEPARTMENT_OPTIONS },
      { id: 'phone', label: 'Phone', type: 'text' },
      {
        id: 'serviceType',
        label: 'Service Type',
        type: 'select',
        required: true,
        options: [
          { value: 'Hardware', label: 'Hardware' },
          { value: 'Application', label: 'Application' },
          { value: 'SAP', label: 'SAP' },
          { value: 'Bank', label: 'Bank System' },
        ],
      },
    ],
  },
  {
    sectionId: 'service-type-hardware',
    conditionalField: { field: 'serviceType', value: 'Hardware' },
    fields: [
      { id: 'deviceType', label: 'Device Type', type: 'select', options: [{ value: 'desktop', label: 'Desktop' }, { value: 'laptop', label: 'Laptop' }, { value: 'printer', label: 'Printer' }, { value: 'other', label: 'Other' }] },
      { id: 'assetTag', label: 'Asset Tag', type: 'text' },
      { id: 'issueDescription', label: 'Issue Description', type: 'textarea', required: true },
    ],
  },
  {
    sectionId: 'service-type-application',
    conditionalField: { field: 'serviceType', value: 'Application' },
    fields: [
      { id: 'applicationName', label: 'Application Name', type: 'text', required: true },
      { id: 'appVersion', label: 'Version', type: 'text' },
      { id: 'appIssue', label: 'Issue Description', type: 'textarea', required: true },
    ],
  },
  {
    sectionId: 'service-type-sap',
    conditionalField: { field: 'serviceType', value: 'SAP' },
    fields: [
      { id: 'sapModule', label: 'SAP Module', type: 'text', required: true },
      { id: 'transactionCode', label: 'Transaction Code', type: 'text' },
      { id: 'sapIssue', label: 'Issue Description', type: 'textarea', required: true },
    ],
  },
  {
    sectionId: 'service-type-bank',
    conditionalField: { field: 'serviceType', value: 'Bank' },
    fields: [
      { id: 'bankSystem', label: 'Bank System', type: 'text', required: true },
      { id: 'bankIssue', label: 'Issue Description', type: 'textarea', required: true },
    ],
  },
  {
    sectionId: 'triage',
    fields: [
      { id: 'priority', label: 'Priority', type: 'select', options: [{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'critical', label: 'Critical' }] },
      { id: 'assignedTo', label: 'Assigned To', type: 'text' },
      { id: 'triageNotes', label: 'Triage Notes', type: 'textarea' },
    ],
  },
  {
    sectionId: 'resolution',
    fields: [
      { id: 'resolutionSummary', label: 'Resolution Summary', type: 'textarea', required: true },
      { id: 'resolutionDate', label: 'Resolution Date', type: 'date' },
    ],
  },
  {
    sectionId: 'acceptance',
    fields: [
      { id: 'userAccepted', label: 'Issue Resolved', type: 'select', options: [{ value: 'yes', label: 'Yes, Accepted' }, { value: 'no', label: 'No, Not Resolved' }] },
      { id: 'userFeedback', label: 'Feedback', type: 'textarea' },
    ],
  },
  {
    sectionId: 'closure',
    fields: [
      { id: 'closureNotes', label: 'Closure Notes', type: 'textarea' },
      { id: 'closureDate', label: 'Closure Date', type: 'date' },
    ],
  },
];

// =============================================================================
// PRF - Program Request Form 2025
// =============================================================================
export const PRF_FIELDS: SectionFieldConfig[] = [
  {
    sectionId: 'requester-info',
    fields: [
      { id: 'requesterName', label: 'Name', type: 'text', required: true, autoFill: 'user.fullName', disabled: true },
      { id: 'department', label: 'Department', type: 'select', required: true, autoFill: 'user.department', options: DEPARTMENT_OPTIONS },
      { id: 'phone', label: 'Phone', type: 'text' },
    ],
  },
  {
    sectionId: 'program-details',
    fields: [
      { id: 'programTitle', label: 'Program/Report Title', type: 'text', required: true },
      { id: 'IsSAP', label: 'Is this SAP related?', type: 'select', options: [{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }] },
      { id: 'programDescription', label: 'Description', type: 'textarea', required: true },
      { id: 'businessJustification', label: 'Business Justification', type: 'textarea', required: true },
    ],
  },
  {
    sectionId: 'authorization',
    fields: [
      { id: 'deptHeadApproval', label: 'Department Head Approval', type: 'select', options: [{ value: 'approved', label: 'Approved' }, { value: 'rejected', label: 'Rejected' }] },
      { id: 'authComments', label: 'Comments', type: 'textarea' },
    ],
  },
  {
    sectionId: 'triage',
    fields: [
      { id: 'estimatedEffort', label: 'Estimated Effort (days)', type: 'number' },
      { id: 'assignedDeveloper', label: 'Assigned Developer', type: 'text' },
      { id: 'triageNotes', label: 'Triage Notes', type: 'textarea' },
    ],
  },
  {
    sectionId: 'sap-review',
    conditionalField: { field: 'IsSAP', value: 'Yes' },
    fields: [
      { id: 'sapFunctionalReview', label: 'Functional Review', type: 'textarea' },
      { id: 'sapApproval', label: 'SAP Team Approval', type: 'select', options: [{ value: 'approved', label: 'Approved' }, { value: 'changes', label: 'Requires Changes' }] },
    ],
  },
  {
    sectionId: 'development',
    fields: [
      { id: 'devProgress', label: 'Development Progress (%)', type: 'number' },
      { id: 'devNotes', label: 'Development Notes', type: 'textarea' },
      { id: 'testingCompleted', label: 'Testing Completed', type: 'checkbox' },
    ],
  },
  {
    sectionId: 'validation',
    fields: [
      { id: 'userValidation', label: 'User Validation', type: 'select', options: [{ value: 'accepted', label: 'Accepted' }, { value: 'rejected', label: 'Rejected' }] },
      { id: 'validationNotes', label: 'Validation Notes', type: 'textarea' },
    ],
  },
];

// =============================================================================
// FORM FIELDS LOOKUP
// =============================================================================
export const FORM_FIELDS_MAP: Record<string, SectionFieldConfig[]> = {
  EAF: EAF_FIELDS,
  NIR: NIR_FIELDS,
  RS: RS_FIELDS,
  SFAR: SFAR_FIELDS,
  UR: UR_FIELDS,
  IAL1: IAL1_FIELDS,
  IAL2: IAL2_FIELDS,
  IAL3: IAL3_FIELDS,
  IAL4: IAL4_FIELDS,
  IAL5: IAL5_FIELDS,
  ITDR: ITDR_FIELDS,
  ITDR2: ITDR2_FIELDS,
  ITSSR: ITSSR_FIELDS,
  PRF: PRF_FIELDS,
};

// Helper function to get field configuration for a form
export function getFormFields(formCode: string): SectionFieldConfig[] {
  return FORM_FIELDS_MAP[formCode] || [];
}

// Helper function to get fields for a specific section
export function getSectionFields(formCode: string, sectionId: string): SectionFieldConfig | undefined {
  const formFields = FORM_FIELDS_MAP[formCode];
  if (!formFields) return undefined;
  return formFields.find((section) => section.sectionId === sectionId);
}

// =============================================================================
// AUTO-FILL UTILITIES
// =============================================================================

export interface UserAutoFillContext {
  fullName?: string;
  email?: string;
  department?: string;
}

/**
 * Given the current user context, returns a flat map of field id → auto-filled value
 * for all fields across the given form that have `autoFill` set.
 *
 * Usage in a form component:
 *   const { data: user } = useUser();
 *   const defaults = resolveAutoFillValues('ITSSR', { fullName: user?.fullName, email: user?.userPrincipalName });
 *   // merge defaults into form initial values
 */
export function resolveAutoFillValues(
  formCode: string,
  user: UserAutoFillContext
): Record<string, string> {
  const sections = getFormFields(formCode);
  const result: Record<string, string> = {};

  for (const section of sections) {
    for (const field of section.fields) {
      if (!field.autoFill) continue;
      switch (field.autoFill) {
        case 'user.fullName':
          if (user.fullName) result[field.id] = user.fullName;
          break;
        case 'user.email':
          if (user.email) result[field.id] = user.email;
          break;
        case 'user.department':
          if (user.department) result[field.id] = user.department;
          break;
      }
    }
  }

  return result;
}

/** Returns all field ids that are auto-filled (read-only) for a given form. */
export function getAutoFillFieldIds(formCode: string): string[] {
  return getFormFields(formCode)
    .flatMap((s) => s.fields)
    .filter((f) => f.autoFill !== undefined)
    .map((f) => f.id);
}