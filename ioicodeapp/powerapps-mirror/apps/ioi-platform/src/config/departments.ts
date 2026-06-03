/**
 * Static department configuration.
 * Since department data is static configuration rather than dynamic data,
 * we store it here instead of in a SharePoint list.
 */

import { type LucideIcon, Key, Lock, Monitor, HardDrive, Database, FileCode, AlertTriangle, Server, Users, Heart, Briefcase, FileText, Award, LogOut, TrendingUp, FileCheck, DollarSign, Settings, Wrench, Megaphone, Package, ShoppingCart, Trash2, ClipboardCheck, ClipboardList, Warehouse, Bug, Target, GraduationCap, FileSearch, BarChart3, Beaker, Factory, Shield, Flame, HardHat, Eye, Skull, Droplets, Zap, Truck, Gauge, Thermometer, HeartPulse, Building2, CalendarCheck, FileSpreadsheet, Car, Activity, Battery, FlaskConical, Lightbulb, Leaf, ArrowLeftRight } from 'lucide-react';

export type DepartmentCode = 'IT' | 'HR' | 'STR' | 'FIN' | 'OPS' | 'ENG' | 'MKT' | 'PROD' | 'QA' | 'QC' | 'WH' | 'ADMIN' | 'LOG' | 'MAINT' | 'POWERBI' | 'PLANT' | 'SAFETY' | 'SHE' | 'PURCH' | 'RND' | 'LEGAL' | 'ENV' | 'SEC' | 'TRANS' | 'COMM' | 'EXEC' | 'GOV' | 'PUR' | 'ADM' | 'MTR' | 'TD' | 'EI' | 'PBI' | 'POM' | 'PRC' | 'SA';

export interface FormDefinition {
  formCode: string;
  name: string;
  description: string;
  isInitialSubmission: boolean;
  stages: Array<{ name: string; order: number }>;
}

export interface ModuleDefinition {
  id: string;
  code: string;
  name: string;
  description: string;
  path: string;
  icon: LucideIcon;
  forms: FormDefinition[];
}

export interface Department {
  id: string;
  code: DepartmentCode;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  icon: LucideIcon;
  status: 'active' | 'pending' | 'inactive';
  modules?: ModuleDefinition[];
}

// IT Module definitions
const IT_MODULES: ModuleDefinition[] = [
  {
    id: 'it-m1',
    code: 'M1',
    name: 'User & Access Management',
    description: 'User accounts, email access, and system permissions',
    path: '/it/access',
    icon: Key,
    forms: [
      { formCode: 'EAF', name: 'External Access Form', description: 'VPN and Citrix access requests', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Manager Approval', order: 2 }, { name: 'IT Processing', order: 3 }] },
      { formCode: 'NIR', name: 'Notes ID Request', description: 'Lotus Notes email account requests', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Approval', order: 2 }, { name: 'Processing', order: 3 }] },
      { formCode: 'RS', name: 'Reset Password/Unlock ID', description: 'Password reset and account unlock', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Verify', order: 2 }, { name: 'Complete', order: 3 }] },
      { formCode: 'ITSSR', name: 'IT Support & Service Request', description: 'General IT support tickets', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Triage', order: 2 }, { name: 'Resolution', order: 3 }] },
      { formCode: 'PRF', name: 'Program Request Form', description: 'Software installation requests', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Install', order: 3 }] },
    ],
  },
  {
    id: 'it-m2',
    code: 'M2',
    name: 'IT Support',
    description: 'Technical support and service requests',
    path: '/it/support',
    icon: Monitor,
    forms: [
      { formCode: 'ITDR', name: 'IT Daily Report', description: 'Daily IT operations report', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'ITDR2', name: 'IT Outstanding Tasks', description: 'Task tracking register', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Update', order: 2 }] },
    ],
  },
  {
    id: 'it-m3',
    code: 'M3',
    name: 'Hardware Management',
    description: 'Hardware inventory and asset management',
    path: '/it/hardware',
    icon: HardDrive,
    forms: [
      { formCode: 'HI', name: 'Hardware Inventory', description: 'Hardware asset tracking', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Verify', order: 2 }] },
    ],
  },
  {
    id: 'it-m4',
    code: 'M4',
    name: 'Infrastructure',
    description: 'Server and data center management',
    path: '/it/sap',  // SAP infrastructure management
    icon: Database,
    forms: [
      { formCode: 'IAL1', name: 'Server Reboot Log', description: 'Server reboot tracking', isInitialSubmission: true, stages: [{ name: 'Log', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'IAL2', name: 'Data Center Access Log', description: 'Data center entry records', isInitialSubmission: true, stages: [{ name: 'Log', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'IAL4', name: 'Server Records', description: 'Server configuration records', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'ITSC', name: 'IT Server Checklist', description: 'Server maintenance checklist', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Verify', order: 2 }] },
    ],
  },
  {
    id: 'it-m7',
    code: 'M7',
    name: 'SAP Systems',
    description: 'SAP ERP system management and support',
    path: '/it/sap',
    icon: Server,
    forms: [
      { formCode: 'SAP-ACC', name: 'SAP Access Request', description: 'Request SAP system access', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Manager Approval', order: 2 }, { name: 'IT Processing', order: 3 }] },
      { formCode: 'SAP-AUTH', name: 'SAP Authorization Change', description: 'Modify SAP user authorizations', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
      { formCode: 'SAP-TRANS', name: 'SAP Transport Request', description: 'Request SAP transport between systems', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Technical Review', order: 2 }, { name: 'Approve', order: 3 }] },
      { formCode: 'SAP-INC', name: 'SAP Incident Report', description: 'Report SAP system incidents', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Triage', order: 2 }, { name: 'Resolution', order: 3 }] },
    ],
  },
  {
    id: 'it-m5',
    code: 'M5',
    name: 'Documentation',
    description: 'IT policies and procedures documentation',
    path: '/it/documentation',
    icon: FileCode,
    forms: [
      { formCode: 'ITP', name: 'ISG Documentation Register', description: 'IT/ISG documentation metadata', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Approve', order: 2 }] },
      { formCode: 'ITP2', name: 'ISG Training Manual', description: 'Training documentation', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'ITI', name: 'IT Information Broadcast', description: 'IT notices and announcements', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Publish', order: 2 }] },
      { formCode: 'IOIP', name: 'IOI Policy', description: 'IOI IT policy documents', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Approve', order: 2 }] },
    ],
  },
  {
    id: 'it-m6',
    code: 'M6',
    name: 'Disaster Recovery',
    description: 'Backup and disaster recovery management',
    path: '/it/disaster',
    icon: AlertTriangle,
    forms: [
      { formCode: 'IAL3', name: 'IT Event', description: 'IT incident tracking', isInitialSubmission: true, stages: [{ name: 'Log', order: 1 }, { name: 'Resolve', order: 2 }] },
      { formCode: 'IAL5', name: 'Data Restoration Request', description: 'Data recovery requests', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Execute', order: 2 }, { name: 'Verify', order: 3 }] },
    ],
  },
];

// HR Module definitions based on MainDB_HR blueprint
const HR_MODULES: ModuleDefinition[] = [
  {
    id: 'hr-m1',
    code: 'HRM1',
    name: 'Recruitment',
    description: 'Contract requisitions, staffing, and interview management',
    path: '/hr/recruitment',
    icon: Users,
    forms: [
      { formCode: 'SR', name: 'Staff Requisition', description: 'Request for new staff positions', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HOD Approval', order: 2 }, { name: 'HR Review', order: 3 }, { name: 'GM Approval', order: 4 }] },
      { formCode: 'CWR', name: 'Contract Worker Request', description: 'Contract worker engagement requests', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HOD Approval', order: 2 }, { name: 'HR Review', order: 3 }, { name: 'GM Approval', order: 4 }] },
      { formCode: 'FTCR', name: 'Fixed Term Contract Renewal', description: 'Contract renewal for fixed-term employees', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HOD Approval', order: 2 }, { name: 'HR Review', order: 3 }, { name: 'GM Approval', order: 4 }] },
      { formCode: 'INTERVIEWDB', name: 'Interview Database', description: 'Interview records and candidate tracking', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HR Review', order: 2 }] },
      { formCode: 'JD', name: 'Job Description', description: 'Job description management', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HOD Review', order: 2 }] },
      { formCode: 'INTERN', name: 'Internship Application', description: 'Internship program applications', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HR Review', order: 2 }, { name: 'HOD Approval', order: 3 }] },
    ],
  },
  {
    id: 'hr-m2',
    code: 'HRM2',
    name: 'Leave Management',
    description: 'Leave applications and attendance tracking',
    path: '/hr/leave',
    icon: Briefcase,
    forms: [
      { formCode: 'LVE', name: 'Leave Application', description: 'Employee leave requests', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Manager Approval', order: 2 }, { name: 'HR Processing', order: 3 }] },
      { formCode: 'OWP', name: 'Overtime Work Permit', description: 'Overtime work authorization', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Manager Approval', order: 2 }, { name: 'HR Approval', order: 3 }] },
      { formCode: 'FWWPE', name: 'Flexible Working/Work Permit Extension', description: 'Work arrangement and permit requests', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Manager Approval', order: 2 }, { name: 'HR Approval', order: 3 }] },
    ],
  },
  {
    id: 'hr-m3',
    code: 'HRM3',
    name: 'Health & Compliance',
    description: 'Health information and medical declarations',
    path: '/hr/health',
    icon: Heart,
    forms: [
      { formCode: 'HEALTHINFO', name: 'Health Information Form', description: 'Employee health information and declarations', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HR Review', order: 2 }] },
      { formCode: 'GDSN', name: 'Group Dependants Scheme Nomination', description: 'Dependant insurance nominations', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HR Processing', order: 2 }] },
    ],
  },
  {
    id: 'hr-m4',
    code: 'HRM4',
    name: 'Performance',
    description: 'Performance appraisals and reviews',
    path: '/hr/performance',
    icon: Award,
    forms: [
      { formCode: 'PAF', name: 'Personnel Action Form', description: 'Personnel changes, promotions, transfers', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HOD Approval', order: 2 }, { name: 'HR Review', order: 3 }, { name: 'GM Approval', order: 4 }] },
      { formCode: 'HRAPR', name: 'HR Approval Request', description: 'HR-related approval requests', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HR Review', order: 2 }, { name: 'HR Approval', order: 3 }] },
    ],
  },
  {
    id: 'hr-m5',
    code: 'HRM5',
    name: 'Employee Lifecycle',
    description: 'Exit notifications, clearance, and status changes',
    path: '/hr/lifecycle',
    icon: LogOut,
    forms: [
      { formCode: 'EEN', name: 'Employee Exit Notice', description: 'Resignation and exit notifications', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HOD Acknowledgement', order: 2 }, { name: 'HR Processing', order: 3 }] },
      { formCode: 'ESF', name: 'Employee Status Form', description: 'Employee status changes', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HR Review', order: 2 }, { name: 'Approval', order: 3 }] },
      { formCode: 'RDWH', name: 'Return to Duty/Work from Home', description: 'Return to work arrangements', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Manager Approval', order: 2 }, { name: 'HR Approval', order: 3 }] },
    ],
  },
  {
    id: 'hr-m6',
    code: 'HRM6',
    name: 'Succession Planning',
    description: 'Backup staff and career development',
    path: '/hr/succession',
    icon: TrendingUp,
    forms: [
      { formCode: 'BSD', name: 'Backup Staff Declaration', description: 'Backup staff nominations', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HOD Review', order: 2 }, { name: 'HR Approval', order: 3 }] },
      { formCode: 'ORGCHART', name: 'Organization Chart', description: 'Organizational structure management', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HR Review', order: 2 }] },
    ],
  },
  {
    id: 'hr-m7',
    code: 'HRM7',
    name: 'Compliance Records',
    description: 'Employee compliance and documentation',
    path: '/hr/compliance',
    icon: FileCheck,
    forms: [
      { formCode: 'EPDU', name: 'Employee Personal Data Update', description: 'Personal information updates', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HR Processing', order: 2 }] },
      { formCode: 'HRINFO', name: 'HR Information', description: 'HR records and information management', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HR Review', order: 2 }] },
      { formCode: 'DRD', name: 'Document Request/Destruction', description: 'Document management requests', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HR Approval', order: 2 }] },
      { formCode: 'NDF', name: 'New Document Form', description: 'New HR document creation', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HR Review', order: 2 }] },
      { formCode: 'TMPU', name: 'Template Update', description: 'HR template management', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HR Review', order: 2 }] },
      { formCode: 'TNPRA', name: 'Training Program Administration', description: 'Training program management', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HR Review', order: 2 }] },
    ],
  },
];

// STR Module definitions based on STR Department migration blueprint
const STR_MODULES: ModuleDefinition[] = [
  {
    id: 'str-m1',
    code: 'STRM1',
    name: 'Store Operations',
    description: 'Store transactions, inventory movements, and daily operations',
    path: '/str/operations',
    icon: Package,
    forms: [
      { formCode: 'ACMSTR', name: 'ACM Store Transaction Record', description: 'Store transaction logging', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Store Admin Review', order: 2 }, { name: 'Manager Approval', order: 3 }] },
      { formCode: 'ASMR', name: 'Annual Store Management Report', description: 'Annual inventory and management reports', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HOD Review', order: 2 }, { name: 'GM Approval', order: 3 }] },
      { formCode: 'STRINV', name: 'Store Inventory Count', description: 'Physical inventory counting', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Verify', order: 2 }, { name: 'Approve', order: 3 }] },
    ],
  },
  {
    id: 'str-m2',
    code: 'STRM2',
    name: 'Requisition',
    description: 'Material requisition and stock requests',
    path: '/str/requisition',
    icon: ShoppingCart,
    forms: [
      { formCode: 'MRF', name: 'Material Requisition Form', description: 'Request materials from store', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HOD Approval', order: 2 }, { name: 'Store Processing', order: 3 }] },
      { formCode: 'SRF', name: 'Stock Requisition Form', description: 'Stock withdrawal requests', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Supervisor Approval', order: 2 }, { name: 'Store Issue', order: 3 }] },
      { formCode: 'URF', name: 'Urgent Requisition Form', description: 'Emergency material requests', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Manager Approval', order: 2 }, { name: 'Expedited Processing', order: 3 }] },
    ],
  },
  {
    id: 'str-m3',
    code: 'STRM3',
    name: 'Procurement',
    description: 'Purchase orders and vendor management',
    path: '/str/procurement',
    icon: FileText,
    forms: [
      { formCode: 'PO', name: 'Purchase Order', description: 'Material purchase orders', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HOD Approval', order: 2 }, { name: 'Finance Review', order: 3 }, { name: 'GM Approval', order: 4 }] },
      { formCode: 'GRN', name: 'Goods Received Note', description: 'Record received materials', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'QC Check', order: 2 }, { name: 'Store Receipt', order: 3 }] },
      { formCode: 'VR', name: 'Vendor Registration', description: 'New vendor registration', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Procurement Review', order: 2 }, { name: 'Finance Approval', order: 3 }] },
    ],
  },
  {
    id: 'str-m4',
    code: 'STRM4',
    name: 'Disposal',
    description: 'Asset disposal and write-off management',
    path: '/str/disposal',
    icon: Trash2,
    forms: [
      { formCode: 'DAF', name: 'Disposal Authorization Form', description: 'Asset disposal authorization', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HOD Approval', order: 2 }, { name: 'Finance Review', order: 3 }, { name: 'GM Approval', order: 4 }] },
      { formCode: 'WOF', name: 'Write-Off Form', description: 'Inventory write-off requests', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Store Verification', order: 2 }, { name: 'Finance Approval', order: 3 }] },
      { formCode: 'SRV', name: 'Scrap Return Voucher', description: 'Scrap material returns', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Store Review', order: 2 }, { name: 'Approve', order: 3 }] },
    ],
  },
  {
    id: 'str-m5',
    code: 'STRM5',
    name: 'Compliance',
    description: 'Store audits, inspections, and compliance records',
    path: '/str/compliance',
    icon: ClipboardCheck,
    forms: [
      { formCode: 'SAR', name: 'Store Audit Report', description: 'Internal store audit reports', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Audit Review', order: 2 }, { name: 'Management Action', order: 3 }] },
      { formCode: 'SIC', name: 'Store Inspection Checklist', description: 'Regular store inspections', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'STR-NCR', name: 'Non-Conformance Report', description: 'Store non-conformance records', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Investigation', order: 2 }, { name: 'CAPA', order: 3 }, { name: 'Close', order: 4 }] },
    ],
  },
];
// QA Module definitions for Quality Assurance Department
const QA_MODULES: ModuleDefinition[] = [
  {
    id: 'qa-m1',
    code: 'QAM1',
    name: 'Audits',
    description: 'Audit scheduling, execution, and findings management',
    path: '/qa/audits',
    icon: ClipboardCheck,
    forms: [
      { formCode: 'AUD', name: 'Audit Request', description: 'Internal/External audit scheduling', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'QA Review', order: 2 }, { name: 'Schedule', order: 3 }] },
      { formCode: 'AUDR', name: 'Audit Report', description: 'Audit findings and observations', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Close', order: 3 }] },
      { formCode: 'AUDF', name: 'Audit Finding', description: 'Individual audit finding record', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Investigation', order: 2 }, { name: 'CAPA', order: 3 }] },
    ],
  },
  {
    id: 'qa-m2',
    code: 'QAM2',
    name: 'Defects',
    description: 'Issue tracking, defect reporting, and resolution',
    path: '/qa/defects',
    icon: Bug,
    forms: [
      { formCode: 'DEF', name: 'Defect Report', description: 'Product/Process defect reporting', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Investigation', order: 2 }, { name: 'Resolution', order: 3 }, { name: 'Verification', order: 4 }] },
      { formCode: 'QA-NCR', name: 'Non-Conformance Report', description: 'Non-conformance recording and tracking', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Investigation', order: 2 }, { name: 'CAPA', order: 3 }, { name: 'Close', order: 4 }] },
      { formCode: 'CCR', name: 'Customer Complaint', description: 'Customer complaint tracking', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Investigation', order: 2 }, { name: 'Response', order: 3 }, { name: 'Close', order: 4 }] },
    ],
  },
  {
    id: 'qa-m3',
    code: 'QAM3',
    name: 'CAPAs',
    description: 'Corrective and preventive action management',
    path: '/qa/capas',
    icon: Target,
    forms: [
      { formCode: 'CAPA', name: 'CAPA Request', description: 'Corrective/Preventive action request', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Root Cause', order: 2 }, { name: 'Action Plan', order: 3 }, { name: 'Implementation', order: 4 }, { name: 'Verification', order: 5 }] },
      { formCode: 'CAPAV', name: 'CAPA Verification', description: 'CAPA effectiveness verification', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Verify', order: 2 }, { name: 'Close', order: 3 }] },
    ],
  },
  {
    id: 'qa-m4',
    code: 'QAM4',
    name: 'Documents',
    description: 'Document control, SOPs, and policies',
    path: '/qa/documents',
    icon: FileSearch,
    forms: [
      { formCode: 'DCR', name: 'Document Change Request', description: 'Document creation/revision request', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }, { name: 'Publish', order: 4 }] },
      { formCode: 'DOCR', name: 'Document Review', description: 'Periodic document review', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
      { formCode: 'SOP', name: 'SOP Request', description: 'New SOP creation request', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Draft', order: 2 }, { name: 'Review', order: 3 }, { name: 'Approve', order: 4 }] },
    ],
  },
  {
    id: 'qa-m5',
    code: 'QAM5',
    name: 'Training',
    description: 'Training records and compliance tracking',
    path: '/qa/training',
    icon: GraduationCap,
    forms: [
      { formCode: 'TRN', name: 'Training Request', description: 'Training session request', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HR Review', order: 2 }, { name: 'Schedule', order: 3 }] },
      { formCode: 'TRNR', name: 'Training Record', description: 'Training completion record', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Verify', order: 2 }] },
      { formCode: 'TRNM', name: 'Training Matrix', description: 'Role-based training matrix update', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
    ],
  },
  {
    id: 'qa-m6',
    code: 'QAM6',
    name: 'Reports',
    description: 'Quality metrics, analytics, and reporting',
    path: '/qa/reports',
    icon: BarChart3,
    forms: [
      { formCode: 'QMR', name: 'Quality Metrics Report', description: 'Monthly/Quarterly quality metrics', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'MRR', name: 'Management Review Report', description: 'Management review meeting report', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
    ],
  },
];

// FIN Module definitions for Finance Department (from Migration Master)
const FIN_MODULES: ModuleDefinition[] = [
  {
    id: 'fin-m1',
    code: 'FINM1',
    name: 'Capital & Expenditure',
    description: 'Capital appropriation and expenditure requests',
    path: '/fin/capital',
    icon: DollarSign,
    forms: [
      { formCode: 'CAR', name: 'Capital Appropriation Request', description: 'Request for capital expenditure approval', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HOD Approval', order: 2 }, { name: 'Finance Review', order: 3 }, { name: 'GM Approval', order: 4 }] },
      { formCode: 'EARF', name: 'Expenditure Appropriation Request', description: 'Request for expenditure approval', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HOD Approval', order: 2 }, { name: 'Finance Review', order: 3 }, { name: 'GM Approval', order: 4 }] },
    ],
  },
  {
    id: 'fin-m2',
    code: 'FINM2',
    name: 'Credit Management',
    description: 'Credit management and customer accounts',
    path: '/fin/credit',
    icon: FileText,
    forms: [
      { formCode: 'CMF_A', name: 'Credit Management Form - Appendix A', description: 'Credit limit application', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Credit Review', order: 2 }, { name: 'Approval', order: 3 }] },
      { formCode: 'CMF_B', name: 'Credit Management Form - Appendix B', description: 'Credit terms modification', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Credit Review', order: 2 }, { name: 'Approval', order: 3 }] },
      { formCode: 'CMF_C', name: 'Credit Management Form - Appendix C', description: 'Credit release request', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Credit Review', order: 2 }, { name: 'Approval', order: 3 }] },
    ],
  },
  {
    id: 'fin-m3',
    code: 'FINM3',
    name: 'Insurance & Claims',
    description: 'Insurance claims and coverage management',
    path: '/fin/insurance',
    icon: Settings,
    forms: [
      { formCode: 'IC', name: 'Insurance Claim', description: 'Submit insurance claim', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Finance Review', order: 2 }, { name: 'Processing', order: 3 }] },
    ],
  },
  {
    id: 'fin-m4',
    code: 'FINM4',
    name: 'Service Entry',
    description: 'Service entry sheets and reversals',
    path: '/fin/service',
    icon: FileCheck,
    forms: [
      { formCode: 'RSES', name: 'Reversal Service Entry Sheet', description: 'Request reversal of service entry', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Finance Review', order: 2 }, { name: 'Approval', order: 3 }] },
    ],
  },
  {
    id: 'fin-m5',
    code: 'FINM5',
    name: 'Vendor Management',
    description: 'Vendor registration and maintenance',
    path: '/fin/vendor',
    icon: Users,
    forms: [
      { formCode: 'VRF', name: 'Vendor Registration Form', description: 'Register new vendor in system', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Finance Review', order: 2 }, { name: 'Procurement Review', order: 3 }, { name: 'Approval', order: 4 }] },
    ],
  },
];

// QC Module definitions for Quality Control Department (from Migration Master)
const QC_MODULES: ModuleDefinition[] = [
  {
    id: 'qc-m1',
    code: 'QCM1',
    name: 'Laboratory Management',
    description: 'Lab equipment, calibration, and testing management',
    path: '/qc/laboratory',
    icon: Beaker,
    forms: [
      { formCode: 'MLE', name: 'Masterlist of Lab Equipments', description: 'Equipment inventory and tracking', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'QC Review', order: 2 }, { name: 'Approval', order: 3 }] },
      { formCode: 'PT', name: 'Proficiency Testing', description: 'Lab proficiency test records', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'LWR', name: 'Lab Work Request', description: 'Request laboratory testing', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Lab Processing', order: 2 }, { name: 'Results', order: 3 }] },
    ],
  },
  {
    id: 'qc-m2',
    code: 'QCM2',
    name: 'Product Specifications',
    description: 'Product data sheets and specifications',
    path: '/qc/specifications',
    icon: FileSearch,
    forms: [
      { formCode: 'PDS', name: 'Product Data Sheet', description: 'Product specification documentation', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'QC Review', order: 2 }, { name: 'Approval', order: 3 }] },
      { formCode: 'PSC', name: 'Product Spec Code', description: 'Product specification code assignment', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approval', order: 3 }] },
      { formCode: 'COI', name: 'Certificate of Ingredient', description: 'Ingredient certification', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'QC Review', order: 2 }] },
    ],
  },
  {
    id: 'qc-m3',
    code: 'QCM3',
    name: 'Testing & Results',
    description: 'Testing results and non-conformance management',
    path: '/qc/testing',
    icon: Bug,
    forms: [
      { formCode: 'OOS', name: 'Out of Specification Report', description: 'OOS investigation and reporting', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Investigation', order: 2 }, { name: 'CAPA', order: 3 }, { name: 'Close', order: 4 }] },
      { formCode: 'MICRO-RR', name: 'Microbiology Results Report', description: 'Microbiology testing notifications', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'RNMR', name: 'Raw/Non-Material Record', description: 'Raw material testing records', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'QC Review', order: 2 }] },
      { formCode: 'NRTR', name: 'Non-Routine Testing Report', description: 'Special testing reports', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
    ],
  },
  {
    id: 'qc-m4',
    code: 'QCM4',
    name: 'Certificates & Compliance',
    description: 'Certificates, declarations, and compliance documentation',
    path: '/qc/certificates',
    icon: ClipboardCheck,
    forms: [
      { formCode: 'CD', name: 'Certificate/Declaration', description: 'Product certifications and declarations', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'QC Review', order: 2 }, { name: 'Approval', order: 3 }] },
      { formCode: 'CS', name: 'ChemSHERPA', description: 'Chemical substance declaration', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'ISO17025', name: 'ISO/IEC 17025 Related', description: 'Lab accreditation documentation', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approval', order: 3 }] },
    ],
  },
  {
    id: 'qc-m5',
    code: 'QCM5',
    name: 'Quality Actions',
    description: 'PQCAR, PAR, and quality action requests',
    path: '/qc/actions',
    icon: Target,
    forms: [
      { formCode: 'PQCAR', name: 'Product Quality Corrective Action', description: 'Product quality corrective action request', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Investigation', order: 2 }, { name: 'Action Plan', order: 3 }, { name: 'Verification', order: 4 }] },
      { formCode: 'PAR', name: 'Preventive Action Request', description: 'Preventive action request', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Implementation', order: 3 }] },
      { formCode: 'PCQI', name: 'PCQI Verification', description: 'PCQI verification checklist', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Verification', order: 2 }] },
    ],
  },
  {
    id: 'qc-m6',
    code: 'QCM6',
    name: 'QC Information',
    description: 'QC information center and sampling database',
    path: '/qc/info',
    icon: BarChart3,
    forms: [
      { formCode: 'QCINFO', name: 'QC Information', description: 'QC information and updates', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'SD', name: 'Sampling Database', description: 'Product sampling records', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Processing', order: 2 }] },
      { formCode: 'STIR', name: 'Storage Tank Inspection Report', description: 'Tank inspection records', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
    ],
  },
];

// Production Module definitions
const PROD_MODULES: ModuleDefinition[] = [
  {
    id: 'prod-m1',
    code: 'PRODM1',
    name: 'SAM Database',
    description: 'Standard Analytical Methods tracking and management',
    path: '/production/forms',
    icon: ClipboardCheck,
    forms: [
      { formCode: 'SAM-001', name: 'SAM Master List', description: 'Master list of standard analytical methods', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'SAM-002', name: 'SAM Request Form', description: 'Request new analytical method', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
      { formCode: 'SAM-003', name: 'SAM Review Form', description: 'Review and update existing SAM', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'SAM-004', name: 'SAM Deviation Report', description: 'Report deviations from standard methods', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Investigation', order: 2 }, { name: 'Close', order: 3 }] },
    ],
  },
  {
    id: 'prod-m2',
    code: 'PRODM2',
    name: 'TPM Database',
    description: 'Total Productive Maintenance records and tracking',
    path: '/production/forms',
    icon: Wrench,
    forms: [
      { formCode: 'TPM-001', name: 'TPM Database', description: 'Total productive maintenance records', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'TPM-002', name: 'TPM Daily Checklist', description: 'Daily maintenance checklist', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'TPM-003', name: 'TPM Breakdown Report', description: 'Equipment breakdown reporting', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Investigation', order: 2 }, { name: 'Resolution', order: 3 }] },
      { formCode: 'TPM-004', name: 'TPM Spare Parts Request', description: 'Request spare parts for maintenance', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Approval', order: 2 }, { name: 'Processing', order: 3 }] },
      { formCode: 'TPM-005', name: 'TPM PM Schedule', description: 'Preventive maintenance schedule', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
    ],
  },
  {
    id: 'prod-m3',
    code: 'PRODM3',
    name: 'CCP Monitoring',
    description: 'Critical Control Point filter inspection and monitoring',
    path: '/production/forms',
    icon: Gauge,
    forms: [
      { formCode: 'CCP-001', name: 'CCP Filter Inspection', description: 'Critical control point filter inspection', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'CCP-002', name: 'CCP Monitoring Log', description: 'CCP monitoring and recording', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'CCP-003', name: 'CCP Deviation Report', description: 'Report CCP deviations', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Investigation', order: 2 }, { name: 'CAPA', order: 3 }] },
      { formCode: 'CCP-004', name: 'CCP Corrective Action', description: 'CCP corrective action form', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Action', order: 2 }, { name: 'Verify', order: 3 }] },
    ],
  },
  {
    id: 'prod-m4',
    code: 'PRODM4',
    name: 'Material Master',
    description: 'Material specifications and data management',
    path: '/production/forms',
    icon: Package,
    forms: [
      { formCode: 'MM-001', name: 'Material Master', description: 'Material master data management', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
      { formCode: 'MM-002', name: 'Material Spec Request', description: 'Request new material specifications', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
      { formCode: 'MM-003', name: 'Material Change Request', description: 'Material specification change request', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
    ],
  },
  {
    id: 'prod-m5',
    code: 'PRODM5',
    name: 'Production Reports',
    description: 'Daily, weekly, and monthly production reports',
    path: '/production/forms',
    icon: BarChart3,
    forms: [
      { formCode: 'PR-001', name: 'Daily Production Report', description: 'Daily production summary report', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'PR-002', name: 'Weekly Production Summary', description: 'Weekly production analysis', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'PR-003', name: 'Monthly KPI Report', description: 'Monthly KPI dashboard report', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'PR-004', name: 'Production Variance Report', description: 'Production variance analysis', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Investigation', order: 2 }] },
    ],
  },
  {
    id: 'prod-m6',
    code: 'PRODM6',
    name: 'Process Control',
    description: 'Process monitoring and control logs',
    path: '/production/forms',
    icon: Thermometer,
    forms: [
      { formCode: 'PC-001', name: 'Temperature Log', description: 'Process temperature monitoring', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'PC-002', name: 'Flow Rate Log', description: 'Process flow rate monitoring', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'PC-003', name: 'Pressure Log', description: 'Process pressure monitoring', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'PC-004', name: 'Energy Consumption Log', description: 'Energy consumption tracking', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
    ],
  },
];

// SHE Module definitions (Safety, Health & Environment)
const SHE_MODULES: ModuleDefinition[] = [
  {
    id: 'she-m1',
    code: 'SHEM1',
    name: 'Incident Reporting',
    description: 'Incident reports, near misses, and accident investigations',
    path: '/she/forms',
    icon: AlertTriangle,
    forms: [
      { formCode: 'IR-001', name: 'Incident Report Form', description: 'Report workplace incidents and injuries', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Investigation', order: 2 }, { name: 'CAPA', order: 3 }, { name: 'Close', order: 4 }] },
      { formCode: 'IR-002', name: 'Near Miss Report', description: 'Report near-miss incidents', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Close', order: 3 }] },
      { formCode: 'IR-003', name: 'First Aid Report', description: 'First aid treatment records', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'IR-004', name: 'Accident Investigation', description: 'Detailed accident investigation form', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Investigation', order: 2 }, { name: 'RCA', order: 3 }, { name: 'Close', order: 4 }] },
      { formCode: 'IR-005', name: 'Incident Follow-up', description: 'Incident follow-up and closure', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Verify', order: 2 }, { name: 'Close', order: 3 }] },
    ],
  },
  {
    id: 'she-m2',
    code: 'SHEM2',
    name: 'HIRADC',
    description: 'Hazard identification, risk assessment, and controls',
    path: '/she/forms',
    icon: Eye,
    forms: [
      { formCode: 'HR-001', name: 'HIRADC Assessment', description: 'Hazard identification and risk assessment', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
      { formCode: 'HR-002', name: 'HIRADC Review', description: 'Periodic HIRADC review', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'HR-003', name: 'Risk Control Register', description: 'Risk control measures register', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'HR-004', name: 'JSA Form', description: 'Job Safety Analysis', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
    ],
  },
  {
    id: 'she-m3',
    code: 'SHEM3',
    name: 'Chemical Management',
    description: 'Chemical inventory, SDS, and hazardous materials',
    path: '/she/forms',
    icon: Skull,
    forms: [
      { formCode: 'CM-001', name: 'Chemical Inventory', description: 'Chemical inventory management', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'CM-002', name: 'SDS Register', description: 'Safety Data Sheet register', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'CM-003', name: 'Chemical Risk Assessment', description: 'Chemical risk assessment form', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
      { formCode: 'CM-004', name: 'Chemical Spill Report', description: 'Chemical spill incident report', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Investigation', order: 2 }, { name: 'Close', order: 3 }] },
      { formCode: 'CM-005', name: 'COSHH Assessment', description: 'Control of substances hazardous to health', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
    ],
  },
  {
    id: 'she-m4',
    code: 'SHEM4',
    name: 'Fire Safety',
    description: 'Fire risk assessments, drills, and emergency procedures',
    path: '/she/forms',
    icon: Flame,
    forms: [
      { formCode: 'FS-001', name: 'Fire Risk Assessment', description: 'Fire risk assessment form', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
      { formCode: 'FS-002', name: 'Fire Drill Report', description: 'Fire drill exercise report', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'FS-003', name: 'Fire Equipment Inspection', description: 'Fire extinguisher inspection log', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'FS-004', name: 'Emergency Response Plan', description: 'Emergency response documentation', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
    ],
  },
  {
    id: 'she-m5',
    code: 'SHEM5',
    name: 'PPE Management',
    description: 'Personal protective equipment issuance and inspection',
    path: '/she/forms',
    icon: HardHat,
    forms: [
      { formCode: 'PPE-001', name: 'PPE Issue Form', description: 'PPE issuance and tracking', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Issue', order: 2 }] },
      { formCode: 'PPE-002', name: 'PPE Inspection Log', description: 'PPE condition inspection', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'PPE-003', name: 'PPE Request Form', description: 'Request new PPE equipment', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Approve', order: 2 }, { name: 'Issue', order: 3 }] },
      { formCode: 'PPE-004', name: 'PPE Training Record', description: 'PPE usage training records', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
    ],
  },
  {
    id: 'she-m6',
    code: 'SHEM6',
    name: 'Health Surveillance',
    description: 'Occupational health monitoring and screening',
    path: '/she/forms',
    icon: HeartPulse,
    forms: [
      { formCode: 'HS-001', name: 'Health Screening Form', description: 'Occupational health screening', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'HS-002', name: 'Medical Examination Record', description: 'Pre-employment/periodic medical exams', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'HS-003', name: 'Fitness for Work', description: 'Fitness for work assessment', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
      { formCode: 'HS-004', name: 'Exposure Monitoring', description: 'Occupational exposure monitoring', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
    ],
  },
  {
    id: 'she-m7',
    code: 'SHEM7',
    name: 'Environmental',
    description: 'Environmental aspects, waste management, and spillage',
    path: '/she/forms',
    icon: Droplets,
    forms: [
      { formCode: 'ENV-001', name: 'Environmental Aspect Register', description: 'Environmental aspects and impacts', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'ENV-002', name: 'Waste Management Log', description: 'Waste disposal tracking', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'ENV-003', name: 'Spillage Report', description: 'Environmental spillage report', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Investigation', order: 2 }, { name: 'Close', order: 3 }] },
      { formCode: 'ENV-004', name: 'Energy Monitoring', description: 'Energy consumption tracking', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
    ],
  },
  {
    id: 'she-m8',
    code: 'SHEM8',
    name: 'Permits',
    description: 'Permit to work, hot work, confined space entry',
    path: '/she/forms',
    icon: ClipboardCheck,
    forms: [
      { formCode: 'PTW-001', name: 'Permit to Work', description: 'General permit to work system', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
      { formCode: 'PTW-002', name: 'Hot Work Permit', description: 'Hot work authorization', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
      { formCode: 'PTW-003', name: 'Confined Space Entry', description: 'Confined space entry permit', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
      { formCode: 'PTW-004', name: 'Electrical Work Permit', description: 'Electrical work authorization', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
    ],
  },
];


// LOG Module definitions for Logistics Department
const LOG_MODULES: ModuleDefinition[] = [
  {
    id: 'log-m1',
    code: 'LOGM1',
    name: 'Container Shipment',
    description: 'Container shipment database and tracking',
    path: '/log/forms',
    icon: Truck,
    forms: [
      { formCode: 'CSD', name: 'Container Shipment Database', description: 'Track container shipments with 50-row container table', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Coordinator Review', order: 2 }, { name: 'Manager Approval', order: 3 }] },
    ],
  },
  {
    id: 'log-m2',
    code: 'LOGM2',
    name: 'Tanker Operations',
    description: 'Tanker inspections, washing, and maintenance',
    path: '/log/forms',
    icon: Gauge,
    forms: [
      { formCode: 'TI', name: 'Tanker Inspection', description: 'Tanker inspection checklist with QC approval', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Inspector Review', order: 2 }, { name: 'QC Approval', order: 3 }] },
      { formCode: 'GTPW', name: 'Glycerine Tanker Periodic Washing', description: 'Glycerine tanker washing record (temp ≥80°C)', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'TMI', name: 'Tanker Monthly Inspection', description: 'Monthly tanker inspection checklist', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
    ],
  },
  {
    id: 'log-m3',
    code: 'LOGM3',
    name: 'Forklift Management',
    description: 'Forklift breakdown notifications and maintenance',
    path: '/log/forms',
    icon: Wrench,
    forms: [
      { formCode: 'ECMFB', name: 'ECM Forklift Breakdown Notification', description: 'ECM forklift breakdown with cost tracking (RM)', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Supervisor Review', order: 2 }, { name: 'Approval', order: 3 }] },
      { formCode: 'FBN', name: 'Forklift Breakdown Notification', description: 'General forklift breakdown with SMU hours', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
    ],
  },
  {
    id: 'log-m4',
    code: 'LOGM4',
    name: 'Delivery Management',
    description: 'Product over/short delivery tracking',
    path: '/log/forms',
    icon: FileSpreadsheet,
    forms: [
      { formCode: 'POD', name: 'Product Over/Short Delivery (POD)', description: 'Track product delivery variances with computed weights', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Coordinator Review', order: 2 }, { name: 'Finance Review', order: 3 }] },
    ],
  },
  {
    id: 'log-m5',
    code: 'LOGM5',
    name: 'Fleet & Equipment Inspections',
    description: 'Weekly counter checks, shunting truck service records, and equipment inspections',
    path: '/log/forms',
    icon: ClipboardCheck,
    forms: [
      { formCode: 'WCC', name: 'Weekly Counter Check', description: 'Weekly tanker stock reconciliation and variance tracking', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Checker Review', order: 2 }, { name: 'Verified', order: 3 }] },
      { formCode: 'SHUNTING', name: 'Shunting Truck Service Record', description: 'Shunting truck maintenance and service history', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Technician Review', order: 2 }, { name: 'Supervisor Sign-off', order: 3 }] },
    ],
  },
  {
    id: 'log-m6',
    code: 'LOGM6',
    name: 'DG & Storage Inspections',
    description: 'Dangerous goods inspections and storage tank cleanliness checks',
    path: '/log/forms',
    icon: HardHat,
    forms: [
      { formCode: 'IMDG', name: 'IMDG Inspection Checklist', description: 'Dangerous goods vehicle and documentation compliance check', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Inspector Review', order: 2 }, { name: 'Compliance Check', order: 3 }] },
      { formCode: 'FJB', name: 'FJB Storage Tank Cleanliness Inspection', description: 'FJB tank cleanliness grading and inspection scheduling', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Inspection', order: 2 }, { name: 'QC Verification', order: 3 }] },
    ],
  },
];

// ADM Module definitions for Admin Department
const ADM_MODULES: ModuleDefinition[] = [
  {
    id: 'adm-m1',
    code: 'ADMM1',
    name: 'Facilities & Logistics',
    description: 'Room arrangements, stationery, and driver services',
    path: '/adm/facilities',
    icon: Building2,
    forms: [
      { formCode: 'RAR', name: 'Room Arrangement Requisition', description: 'Request meeting room and facility arrangements', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Admin Review', order: 2 }, { name: 'Facility Check', order: 3 }, { name: 'Approved', order: 4 }] },
      { formCode: 'SR', name: 'Stationery Requisition', description: 'Request office supplies and stationery', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HOD Approval', order: 2 }, { name: 'Admin Processing', order: 3 }, { name: 'Issue', order: 4 }] },
      { formCode: 'DAR', name: 'Driver Arrangement Request', description: 'Request company driver and vehicle services (Critical)', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HOD Approval', order: 2 }, { name: 'Admin Review', order: 3 }, { name: 'Vehicle Assignment', order: 4 }, { name: 'Confirmed', order: 5 }] },
    ],
  },
];

// MTR Module definitions for Maintenance Department
const MTR_MODULES: ModuleDefinition[] = [
  {
    id: 'mtr-m1',
    code: 'MTRM1',
    name: 'Failure Analysis & Reporting',
    description: 'Equipment failure analysis, root cause investigation, and corrective actions',
    path: '/mtr/failure-analysis',
    icon: AlertTriangle,
    forms: [
      { formCode: 'FAR', name: 'Failure Analysis Report', description: 'Equipment failure root cause analysis and corrective actions (IMS Critical)', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Initial Review', order: 2 }, { name: 'Investigation', order: 3 }, { name: 'Root Cause Analysis', order: 4 }, { name: 'HOD Approval', order: 5 }, { name: 'Closed', order: 6 }] },
    ],
  },
  {
    id: 'mtr-m2',
    code: 'MTRM2',
    name: 'Maintenance Planning',
    description: 'Preventive maintenance schedules, work orders, and resource planning',
    path: '/mtr/planning',
    icon: CalendarCheck,
    forms: [
      { formCode: 'MTP', name: 'Maintenance Plan', description: 'Preventive and predictive maintenance scheduling', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Planner Review', order: 2 }, { name: 'Resource Allocation', order: 3 }, { name: 'Approved', order: 4 }] },
      { formCode: 'PMD', name: 'Plant Maintenance Documentation', description: 'Plant equipment maintenance records and history', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Technical Review', order: 2 }, { name: 'QA Verification', order: 3 }, { name: 'Filed', order: 4 }] },
    ],
  },
  {
    id: 'mtr-m3',
    code: 'MTRM3',
    name: 'Energy & Efficiency',
    description: 'Energy consumption monitoring, efficiency tracking, and optimization',
    path: '/mtr/energy',
    icon: Zap,
    forms: [
      { formCode: 'EEI', name: 'Energy Efficiency Info', description: 'Energy consumption and efficiency monitoring data', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Data Validation', order: 2 }, { name: 'Analysis', order: 3 }, { name: 'Report', order: 4 }] },
    ],
  },
  {
    id: 'mtr-m4',
    code: 'MTRM4',
    name: 'Emergency Procedures',
    description: 'Emergency maintenance changes and urgent equipment interventions',
    path: '/mtr/emergency',
    icon: Flame,
    forms: [
      { formCode: 'MECP', name: 'MTN Emergency Change Procedure', description: 'Emergency maintenance change requests and approvals', isInitialSubmission: true, stages: [{ name: 'Emergency Submit', order: 1 }, { name: 'Supervisor Approval', order: 2 }, { name: 'Safety Review', order: 3 }, { name: 'Execute', order: 4 }, { name: 'Post-Action Review', order: 5 }] },
    ],
  },
  {
    id: 'mtr-m5',
    code: 'MTRM5',
    name: 'Equipment Inspection',
    description: 'Pre-operation equipment checks, inspections, and condition assessments',
    path: '/mtr/inspection',
    icon: Eye,
    forms: [
      { formCode: 'EPI', name: 'Equipment Pre-Inspection', description: 'Pre-operation equipment safety and readiness checks', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Technician Review', order: 2 }, { name: 'Supervisor Sign-off', order: 3 }, { name: 'Cleared', order: 4 }] },
    ],
  },
];

// SEC Module definitions for Security Department
const SEC_MODULES: ModuleDefinition[] = [
  {
    id: 'sec-m1',
    code: 'SECM1',
    name: 'Visitor Management',
    description: 'Visitor registration, passes, and tracking',
    path: '/security/forms',
    icon: Users,
    forms: [
      { formCode: 'VR', name: 'Visitor Registration', description: 'Register and track visitor entries', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Security Review', order: 2 }, { name: 'Approved', order: 3 }] },
      { formCode: 'VP', name: 'Visitor Pass', description: 'Issue temporary visitor passes', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Issue', order: 2 }] },
      { formCode: 'VL', name: 'Visitor Log', description: 'Daily visitor log record', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
    ],
  },
  {
    id: 'sec-m2',
    code: 'SECM2',
    name: 'Vehicle Control',
    description: 'Vehicle entry, exit, and parking management',
    path: '/security/forms',
    icon: Car,
    forms: [
      { formCode: 'VE', name: 'Vehicle Entry', description: 'Vehicle entry registration', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Verify', order: 2 }] },
      { formCode: 'PP', name: 'Parking Pass', description: 'Issue parking permits', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Approve', order: 2 }, { name: 'Issue', order: 3 }] },
      { formCode: 'VX', name: 'Vehicle Exit', description: 'Vehicle exit clearance', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Verify', order: 2 }] },
    ],
  },
  {
    id: 'sec-m3',
    code: 'SECM3',
    name: 'Access Control',
    description: 'Key issuance, access cards, and entry authorization',
    path: '/security/forms',
    icon: Key,
    forms: [
      { formCode: 'KI', name: 'Key Issuance', description: 'Issue keys and access cards', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HOD Approval', order: 2 }, { name: 'Security Issue', order: 3 }] },
      { formCode: 'KR', name: 'Key Return', description: 'Key and card return process', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Verify', order: 2 }] },
      { formCode: 'AC', name: 'Access Control Request', description: 'Request area access authorization', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HOD Approval', order: 2 }, { name: 'Security Approval', order: 3 }] },
    ],
  },
  {
    id: 'sec-m4',
    code: 'SECM4',
    name: 'Patrol & Monitoring',
    description: 'Security patrol logs and incident monitoring',
    path: '/security/forms',
    icon: Eye,
    forms: [
      { formCode: 'PR', name: 'Patrol Report', description: 'Security patrol log and observations', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
    ],
  },
];

// ENG Module definitions for Engineering Department
const ENG_MODULES: ModuleDefinition[] = [
  {
    id: 'eng-m1',
    code: 'ENGM1',
    name: 'Project Management',
    description: 'Engineering project proposals, status, and completion',
    path: '/engineering/forms',
    icon: FileText,
    forms: [
      { formCode: 'PP', name: 'Project Proposal', description: 'New engineering project proposal', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Technical Review', order: 2 }, { name: 'HOD Approval', order: 3 }, { name: 'GM Approval', order: 4 }] },
      { formCode: 'PS', name: 'Project Status', description: 'Engineering project status update', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'PC', name: 'Project Completion', description: 'Project completion and handover', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Verification', order: 2 }, { name: 'Sign-off', order: 3 }] },
    ],
  },
  {
    id: 'eng-m2',
    code: 'ENGM2',
    name: 'Management of Change',
    description: 'Engineering change requests and approvals',
    path: '/engineering/forms',
    icon: Settings,
    forms: [
      { formCode: 'MOC', name: 'MOC Request', description: 'Management of change request', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Technical Review', order: 2 }, { name: 'Safety Review', order: 3 }, { name: 'Approval', order: 4 }] },
      { formCode: 'MOCR', name: 'MOC Review', description: 'MOC effectiveness review', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'MOCC', name: 'MOC Closure', description: 'MOC closure and sign-off', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Verify', order: 2 }, { name: 'Close', order: 3 }] },
    ],
  },
  {
    id: 'eng-m3',
    code: 'ENGM3',
    name: 'Technical Drawings',
    description: 'Engineering drawings and documentation',
    path: '/engineering/forms',
    icon: FileCode,
    forms: [
      { formCode: 'DR', name: 'Drawing Request', description: 'Request engineering drawing', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Complete', order: 3 }] },
      { formCode: 'DU', name: 'Drawing Update', description: 'Update existing drawing', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
      { formCode: 'DC', name: 'Drawing Control', description: 'Drawing revision control', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
    ],
  },
  {
    id: 'eng-m4',
    code: 'ENGM4',
    name: 'Equipment',
    description: 'Equipment specifications and installation',
    path: '/engineering/forms',
    icon: HardDrive,
    forms: [
      { formCode: 'ES', name: 'Equipment Specification', description: 'New equipment specification', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Technical Review', order: 2 }, { name: 'Approve', order: 3 }] },
      { formCode: 'EI', name: 'Equipment Installation', description: 'Equipment installation record', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Commissioning', order: 2 }, { name: 'Sign-off', order: 3 }] },
      { formCode: 'EC', name: 'Equipment Commissioning', description: 'Equipment commissioning checklist', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Test', order: 2 }, { name: 'Verify', order: 3 }] },
    ],
  },
  {
    id: 'eng-m5',
    code: 'ENGM5',
    name: 'Electrical & Instrumentation',
    description: 'E&I work requests and calibration',
    path: '/engineering/forms',
    icon: Zap,
    forms: [
      { formCode: 'EIR', name: 'E&I Work Request', description: 'Electrical/Instrumentation work request', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Execute', order: 3 }] },
      { formCode: 'IL', name: 'Instrument List', description: 'Instrument inventory list', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'CL', name: 'Calibration Log', description: 'Instrument calibration record', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Verify', order: 2 }] },
    ],
  },
];

// TD Module definitions for Training & Development Department
const TD_MODULES: ModuleDefinition[] = [
  {
    id: 'td-m1',
    code: 'TDM1',
    name: 'Training Planning',
    description: 'Training needs analysis and planning',
    path: '/training/forms',
    icon: ClipboardCheck,
    forms: [
      { formCode: 'TNA', name: 'Training Needs Analysis', description: 'Identify training requirements', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
      { formCode: 'ATP', name: 'Annual Training Plan', description: 'Annual training calendar', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
      { formCode: 'TR', name: 'Training Request', description: 'Request specific training', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HOD Approval', order: 2 }, { name: 'TD Review', order: 3 }] },
    ],
  },
  {
    id: 'td-m2',
    code: 'TDM2',
    name: 'Course Management',
    description: 'Course registration and attendance',
    path: '/training/forms',
    icon: GraduationCap,
    forms: [
      { formCode: 'CR', name: 'Course Registration', description: 'Register for training course', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HOD Approval', order: 2 }, { name: 'Confirmed', order: 3 }] },
      { formCode: 'TA', name: 'Training Attendance', description: 'Training attendance record', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Verify', order: 2 }] },
      { formCode: 'CE', name: 'Course Evaluation', description: 'Training effectiveness evaluation', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
    ],
  },
  {
    id: 'td-m3',
    code: 'TDM3',
    name: 'Certification',
    description: 'Certification tracking and renewal',
    path: '/training/forms',
    icon: Award,
    forms: [
      { formCode: 'CCR', name: 'Certification Request', description: 'Request professional certification', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HOD Approval', order: 2 }, { name: 'TD Processing', order: 3 }] },
      { formCode: 'CC', name: 'Certification Completion', description: 'Record certification completion', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Verify', order: 2 }] },
      { formCode: 'CER', name: 'Certification Renewal', description: 'Renew expiring certification', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Process', order: 3 }] },
    ],
  },
  {
    id: 'td-m4',
    code: 'TDM4',
    name: 'External Training',
    description: 'External training requests and budget',
    path: '/training/forms',
    icon: Briefcase,
    forms: [
      { formCode: 'ETR', name: 'External Training Request', description: 'Request external training program', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HOD Approval', order: 2 }, { name: 'HR Review', order: 3 }, { name: 'Budget Approval', order: 4 }] },
      { formCode: 'ETB', name: 'External Training Budget', description: 'External training budget allocation', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
    ],
  },
];

// OPS Module definitions for Operations Department
const OPS_MODULES: ModuleDefinition[] = [
  {
    id: 'ops-m1',
    code: 'OPSM1',
    name: 'Production Planning',
    description: 'Production schedules, capacity planning, and resource allocation',
    path: '/ops/planning',
    icon: CalendarCheck,
    forms: [
      { formCode: 'PPS', name: 'Production Planning Schedule', description: 'Weekly/monthly production schedules', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Planner Review', order: 2 }, { name: 'HOD Approval', order: 3 }] },
      { formCode: 'CPR', name: 'Capacity Planning Request', description: 'Request capacity analysis and allocation', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Analysis', order: 2 }, { name: 'Approval', order: 3 }] },
      { formCode: 'RAR', name: 'Resource Allocation Request', description: 'Request resource allocation for operations', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
      { formCode: 'SDR', name: 'Schedule Deviation Report', description: 'Report deviations from production schedule', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Investigation', order: 2 }, { name: 'Close', order: 3 }] },
    ],
  },
  {
    id: 'ops-m2',
    code: 'OPSM2',
    name: 'Inventory Control',
    description: 'Inventory management, stock levels, and material flow',
    path: '/ops/inventory',
    icon: Package,
    forms: [
      { formCode: 'ICR', name: 'Inventory Control Report', description: 'Daily/weekly inventory status report', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'SLM', name: 'Stock Level Monitoring', description: 'Monitor and adjust stock levels', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
      { formCode: 'MFT', name: 'Material Flow Tracking', description: 'Track material movement across operations', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'SDA', name: 'Stock Discrepancy Alert', description: 'Report stock discrepancies and variances', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Investigation', order: 2 }, { name: 'Resolution', order: 3 }] },
    ],
  },
  {
    id: 'ops-m3',
    code: 'OPSM3',
    name: 'Work Orders',
    description: 'Work order creation, tracking, and completion',
    path: '/ops/work-orders',
    icon: FileText,
    forms: [
      { formCode: 'WOC', name: 'Work Order Creation', description: 'Create new work orders for operations', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Planning', order: 2 }, { name: 'Execution', order: 3 }, { name: 'Close', order: 4 }] },
      { formCode: 'WOS', name: 'Work Order Status', description: 'Update work order progress status', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'WOD', name: 'Work Order Deviation', description: 'Report work order deviations', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Investigation', order: 2 }, { name: 'Resolution', order: 3 }] },
      { formCode: 'WOX', name: 'Work Order Completion', description: 'Work order completion and sign-off', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Verification', order: 2 }, { name: 'Close', order: 3 }] },
    ],
  },
  {
    id: 'ops-m4',
    code: 'OPSM4',
    name: 'Shift Management',
    description: 'Shift scheduling, handover, and attendance',
    path: '/ops/shifts',
    icon: Users,
    forms: [
      { formCode: 'SSH', name: 'Shift Schedule', description: 'Create and manage shift schedules', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Supervisor Review', order: 2 }, { name: 'Approve', order: 3 }] },
      { formCode: 'SHO', name: 'Shift Handover', description: 'Shift handover report and notes', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Acknowledge', order: 2 }] },
      { formCode: 'OTR', name: 'Overtime Request', description: 'Request overtime work authorization', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Supervisor Approval', order: 2 }, { name: 'HOD Approval', order: 3 }] },
      { formCode: 'SAR', name: 'Shift Attendance Report', description: 'Daily shift attendance record', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
    ],
  },
  {
    id: 'ops-m5',
    code: 'OPSM5',
    name: 'Performance Monitoring',
    description: 'OEE, efficiency tracking, and performance reports',
    path: '/ops/performance',
    icon: BarChart3,
    forms: [
      { formCode: 'OEE', name: 'OEE Report', description: 'Overall Equipment Effectiveness report', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'DPR', name: 'Daily Performance Report', description: 'Daily operations performance summary', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'ETR', name: 'Efficiency Tracking Report', description: 'Track operational efficiency metrics', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Analysis', order: 2 }] },
      { formCode: 'DTA', name: 'Downtime Analysis', description: 'Analyze and report equipment downtime', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Investigation', order: 2 }, { name: 'Action Plan', order: 3 }] },
    ],
  },
];

// MKT Module definitions for Marketing Department
const MKT_MODULES: ModuleDefinition[] = [
  {
    id: 'mkt-m1',
    code: 'MKTM1',
    name: 'Campaign Management',
    description: 'Marketing campaigns, promotions, and event planning',
    path: '/sales/campaigns',
    icon: Megaphone,
    forms: [
      { formCode: 'MCR', name: 'Marketing Campaign Request', description: 'Request new marketing campaign', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'MKT Review', order: 2 }, { name: 'Budget Approval', order: 3 }, { name: 'GM Approval', order: 4 }] },
      { formCode: 'PMR', name: 'Promotion Request', description: 'Request promotional activities', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'MKT Review', order: 2 }, { name: 'Approval', order: 3 }] },
      { formCode: 'EPR', name: 'Event Planning Request', description: 'Plan and request marketing events', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Planning', order: 2 }, { name: 'Budget Review', order: 3 }, { name: 'Approval', order: 4 }] },
      { formCode: 'CER', name: 'Campaign Evaluation Report', description: 'Post-campaign evaluation and ROI', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
    ],
  },
  {
    id: 'mkt-m2',
    code: 'MKTM2',
    name: 'Brand & Creative',
    description: 'Brand assets, creative materials, and design requests',
    path: '/sales/brand',
    icon: Award,
    forms: [
      { formCode: 'BAR', name: 'Brand Asset Request', description: 'Request brand assets and materials', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Creative Review', order: 2 }, { name: 'Brand Approval', order: 3 }] },
      { formCode: 'CDR', name: 'Creative Design Request', description: 'Request creative design work', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Design Brief', order: 2 }, { name: 'Review', order: 3 }, { name: 'Approval', order: 4 }] },
      { formCode: 'BGA', name: 'Brand Guidelines Amendment', description: 'Request brand guideline changes', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'MKT Review', order: 2 }, { name: 'GM Approval', order: 3 }] },
      { formCode: 'PMC', name: 'Print Material Request', description: 'Request printed marketing materials', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Design', order: 2 }, { name: 'Print Approval', order: 3 }, { name: 'Production', order: 4 }] },
    ],
  },
  {
    id: 'mkt-m3',
    code: 'MKTM3',
    name: 'Digital Marketing',
    description: 'Website, social media, and digital content management',
    path: '/sales/digital',
    icon: Monitor,
    forms: [
      { formCode: 'WCR', name: 'Website Content Request', description: 'Request website content updates', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Content Review', order: 2 }, { name: 'IT Implementation', order: 3 }, { name: 'Publish', order: 4 }] },
      { formCode: 'SMR', name: 'Social Media Request', description: 'Request social media posts/campaigns', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Content Review', order: 2 }, { name: 'Approval', order: 3 }, { name: 'Schedule', order: 4 }] },
      { formCode: 'DCR', name: 'Digital Content Request', description: 'Request digital content creation', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Creative Brief', order: 2 }, { name: 'Production', order: 3 }, { name: 'Approval', order: 4 }] },
      { formCode: 'SEO', name: 'SEO Request', description: 'Request SEO optimization work', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Analysis', order: 2 }, { name: 'Implementation', order: 3 }] },
    ],
  },
  {
    id: 'mkt-m4',
    code: 'MKTM4',
    name: 'Market Research',
    description: 'Market analysis, competitor research, and surveys',
    path: '/sales/research',
    icon: FileSearch,
    forms: [
      { formCode: 'MRR', name: 'Market Research Request', description: 'Request market research study', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Scope Review', order: 2 }, { name: 'Research', order: 3 }, { name: 'Report', order: 4 }] },
      { formCode: 'CAR', name: 'Competitor Analysis Report', description: 'Competitor analysis and insights', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'CSR', name: 'Customer Survey Request', description: 'Request customer survey/feedback', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Design', order: 2 }, { name: 'Approval', order: 3 }, { name: 'Deploy', order: 4 }] },
      { formCode: 'MIR', name: 'Market Intelligence Report', description: 'Market trends and intelligence report', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
    ],
  },
  {
    id: 'mkt-m5',
    code: 'MKTM5',
    name: 'Budget & ROI',
    description: 'Marketing budget tracking, spend analysis, and ROI',
    path: '/sales/budget',
    icon: DollarSign,
    forms: [
      { formCode: 'MBR', name: 'Marketing Budget Request', description: 'Request marketing budget allocation', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'MKT Review', order: 2 }, { name: 'Finance Review', order: 3 }, { name: 'GM Approval', order: 4 }] },
      { formCode: 'SAR', name: 'Spend Analysis Report', description: 'Marketing spend analysis report', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'ROI', name: 'ROI Report', description: 'Marketing ROI and effectiveness report', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Analysis', order: 2 }, { name: 'Review', order: 3 }] },
      { formCode: 'VPR', name: 'Vendor Payment Request', description: 'Request payment for marketing vendors', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'MKT Approval', order: 2 }, { name: 'Finance Processing', order: 3 }] },
    ],
  },
];

// EI Module definitions for Electrical & Instrumentation Department
const EI_MODULES: ModuleDefinition[] = [
  {
    id: 'ei-m1',
    code: 'EIM1',
    name: 'Inspection & Testing',
    description: 'Electrical and instrumentation inspection records',
    path: '/ei/inspection',
    icon: Zap,
    forms: [
      { formCode: 'EI', name: 'E&I Inspection', description: 'General electrical & instrumentation inspection', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
      { formCode: 'EIT', name: 'E&I Testing Record', description: 'Electrical testing documentation', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Test', order: 2 }, { name: 'Verify', order: 3 }] },
      { formCode: 'EIPM', name: 'E&I Preventive Maintenance', description: 'Scheduled PM checklist', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Execute', order: 2 }, { name: 'Close', order: 3 }] },
    ],
  },
  {
    id: 'ei-m2',
    code: 'EIM2',
    name: 'Energy Management',
    description: 'Energy monitoring and ISO 50001 compliance',
    path: '/ei/energy',
    icon: Activity,
    forms: [
      { formCode: 'ENMS1', name: 'Energy Management System Form 1', description: 'Energy data collection', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'ENMS2', name: 'Energy Management System Form 2', description: 'Energy performance analysis', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
    ],
  },
  {
    id: 'ei-m3',
    code: 'EIM3',
    name: 'Asset Management',
    description: 'E&I equipment registration and tracking',
    path: '/ei/assets',
    icon: HardDrive,
    forms: [
      { formCode: 'EARF', name: 'Equipment/Asset Register Form', description: 'E&I equipment registration', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Verify', order: 2 }, { name: 'Approve', order: 3 }] },
      { formCode: 'EIAL', name: 'E&I Asset List', description: 'Asset inventory management', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
    ],
  },
  {
    id: 'ei-m4',
    code: 'EIM4',
    name: 'Generator & Battery',
    description: 'Generator and battery maintenance records',
    path: '/ei/generator',
    icon: Battery,
    forms: [
      { formCode: 'GBMB', name: 'Generator/Battery Maintenance Book', description: 'Generator and battery maintenance logs', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'GBMB2', name: 'Generator/Battery Maintenance Book 2', description: 'Extended maintenance documentation', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'GRL', name: 'Generator Run Log', description: 'Generator operation records', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
    ],
  },
  {
    id: 'ei-m5',
    code: 'EIM5',
    name: 'Calibration',
    description: 'Instrument calibration and verification',
    path: '/ei/calibration',
    icon: Gauge,
    forms: [
      { formCode: 'EICAL', name: 'Calibration Record', description: 'Instrument calibration documentation', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Calibrate', order: 2 }, { name: 'Verify', order: 3 }] },
      { formCode: 'EICL', name: 'Calibration Log', description: 'Calibration schedule and tracking', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
    ],
  },
];

// PBI Module definitions for Plant Business Intelligence Department
const PBI_MODULES: ModuleDefinition[] = [
  {
    id: 'pbi-m1',
    code: 'PBIM1',
    name: 'Energy Management (ISO 50001)',
    description: 'ISO 50001 energy management system compliance',
    path: '/pbi/energy',
    icon: Lightbulb,
    forms: [
      { formCode: 'ENMS1', name: 'Energy Management System Form 1', description: 'ISO 50001 energy data collection', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'ENMS2', name: 'Energy Management System Form 2', description: 'Energy performance indicators', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'ISO50001BR', name: 'ISO 50001 Baseline Review', description: 'Energy baseline establishment', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
      { formCode: 'ISO50001NCR', name: 'ISO 50001 Non-Conformance Report', description: 'Energy system non-conformances', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Investigation', order: 2 }, { name: 'CAPA', order: 3 }, { name: 'Close', order: 4 }] },
    ],
  },
  {
    id: 'pbi-m2',
    code: 'PBIM2',
    name: 'Documentation & SOPs',
    description: 'SOP and work instruction management',
    path: '/pbi/documentation',
    icon: FileText,
    forms: [
      { formCode: 'ISO50001SOP', name: 'ISO 50001 SOP/Procedure', description: 'Energy management procedures', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
      { formCode: 'PBISOPWI', name: 'PBI SOP/Work Instruction Publication', description: 'SOP and WI documentation', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Publish', order: 3 }] },
    ],
  },
  {
    id: 'pbi-m3',
    code: 'PBIM3',
    name: 'KPI & Performance',
    description: 'KPI tracking and cost control monitoring',
    path: '/pbi/kpi',
    icon: BarChart3,
    forms: [
      { formCode: 'TCCI', name: 'Target/Cost Control Index', description: 'KPI tracking and cost control', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'PBIKPI', name: 'PBI KPI Report', description: 'Monthly KPI reporting', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'PBIDASH', name: 'PBI Dashboard Data', description: 'Dashboard data submission', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
    ],
  },
  {
    id: 'pbi-m4',
    code: 'PBIM4',
    name: 'Sustainability',
    description: 'Environmental and sustainability initiatives',
    path: '/pbi/sustainability',
    icon: Leaf,
    forms: [
      { formCode: 'PBISUS', name: 'Sustainability Report', description: 'Sustainability metrics and initiatives', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'PBICARB', name: 'Carbon Footprint Report', description: 'Carbon emission tracking', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
    ],
  },
];

// RND Module definitions for Research & Development Department
const RND_MODULES: ModuleDefinition[] = [
  {
    id: 'rnd-m1',
    code: 'RNDM1',
    name: 'R&D Projects',
    description: 'Research and development project management',
    path: '/rnd/projects',
    icon: FlaskConical,
    forms: [
      { formCode: 'RNDDB', name: 'R&D Database', description: 'Research & development records', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'RNDPRJ', name: 'R&D Project Form', description: 'New R&D project registration', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Technical Review', order: 2 }, { name: 'HOD Approval', order: 3 }, { name: 'GM Approval', order: 4 }] },
      { formCode: 'RNDPR', name: 'R&D Progress Report', description: 'Project progress updates', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
    ],
  },
  {
    id: 'rnd-m2',
    code: 'RNDM2',
    name: 'New Materials',
    description: 'New material testing and evaluation',
    path: '/rnd/materials',
    icon: Beaker,
    forms: [
      { formCode: 'RNMR', name: 'Raw/New Material Record', description: 'New material testing records', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Lab Testing', order: 2 }, { name: 'Evaluation', order: 3 }, { name: 'Approve', order: 4 }] },
      { formCode: 'RNDMAT', name: 'Material Evaluation Form', description: 'Material evaluation results', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
    ],
  },
  {
    id: 'rnd-m3',
    code: 'RNDM3',
    name: 'New Product Development',
    description: 'New product development requests and tracking',
    path: '/rnd/products',
    icon: Package,
    forms: [
      { formCode: 'NEWPRDREQ', name: 'New Product Request', description: 'New product development requests', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Feasibility', order: 2 }, { name: 'R&D Review', order: 3 }, { name: 'GM Approval', order: 4 }] },
      { formCode: 'NPDTR', name: 'NPD Trial Report', description: 'New product trial results', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'QC Review', order: 2 }, { name: 'Approve', order: 3 }] },
    ],
  },
  {
    id: 'rnd-m4',
    code: 'RNDM4',
    name: 'Customer & Market',
    description: 'Customer requirements and market analysis',
    path: '/rnd/market',
    icon: Users,
    forms: [
      { formCode: 'CMF_A', name: 'Customer/Market Form A', description: 'Customer requirements - Part A', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'CMF_B', name: 'Customer/Market Form B', description: 'Market analysis - Part B', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'CMF_C', name: 'Customer/Market Form C', description: 'Product specifications - Part C', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
    ],
  },
  {
    id: 'rnd-m5',
    code: 'RNDM5',
    name: 'Technical Documentation',
    description: 'Technical reports and documentation',
    path: '/rnd/documentation',
    icon: FileCode,
    forms: [
      { formCode: 'RNDTDS', name: 'Technical Data Sheet', description: 'Product technical data sheets', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
      { formCode: 'RNDMSDS', name: 'Material Safety Data Sheet', description: 'MSDS documentation', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'SHE Review', order: 2 }, { name: 'Approve', order: 3 }] },
    ],
  },
];

// GOV Module definitions for Governance Department
const GOV_MODULES: ModuleDefinition[] = [
  {
    id: 'gov-m1',
    code: 'GOVM1',
    name: 'Policy Management',
    description: 'Corporate policies and procedures',
    path: '/governance/policies',
    icon: FileText,
    forms: [
      { formCode: 'GOVPOL', name: 'Policy Document', description: 'Corporate policy management', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Legal Review', order: 2 }, { name: 'GM Approval', order: 3 }] },
      { formCode: 'GOVPROC', name: 'Procedure Document', description: 'Standard operating procedures', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
    ],
  },
  {
    id: 'gov-m2',
    code: 'GOVM2',
    name: 'Compliance',
    description: 'Regulatory compliance and reporting',
    path: '/governance/compliance',
    icon: ClipboardCheck,
    forms: [
      { formCode: 'GOVCOMP', name: 'Compliance Report', description: 'Regulatory compliance reporting', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'GOVAUD', name: 'Governance Audit', description: 'Internal governance audit', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Audit', order: 2 }, { name: 'Report', order: 3 }] },
    ],
  },
  {
    id: 'gov-m3',
    code: 'GOVM3',
    name: 'Risk Management',
    description: 'Enterprise risk management',
    path: '/governance/risk',
    icon: AlertTriangle,
    forms: [
      { formCode: 'GOVRISK', name: 'Risk Assessment', description: 'Enterprise risk assessment', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Mitigation Plan', order: 3 }] },
      { formCode: 'GOVBCP', name: 'Business Continuity Plan', description: 'BCP documentation', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
    ],
  },
];

// PUR Module definitions for Purchasing Department
const PUR_MODULES: ModuleDefinition[] = [
  {
    id: 'pur-m1',
    code: 'PURM1',
    name: 'Purchase Requests',
    description: 'Purchase requisitions and orders',
    path: '/procurement/requests',
    icon: ShoppingCart,
    forms: [
      { formCode: 'PR', name: 'Purchase Requisition', description: 'Material purchase request', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'HOD Approval', order: 2 }, { name: 'Procurement Review', order: 3 }, { name: 'GM Approval', order: 4 }] },
      { formCode: 'PO', name: 'Purchase Order', description: 'Purchase order creation', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Finance Review', order: 2 }, { name: 'Approve', order: 3 }] },
      { formCode: 'EPR', name: 'Emergency Purchase Request', description: 'Urgent purchase requisition', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Manager Approval', order: 2 }, { name: 'Expedite', order: 3 }] },
    ],
  },
  {
    id: 'pur-m2',
    code: 'PURM2',
    name: 'Vendor Management',
    description: 'Vendor registration and evaluation',
    path: '/procurement/vendors',
    icon: Users,
    forms: [
      { formCode: 'VRF', name: 'Vendor Registration Form', description: 'New vendor registration', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Procurement Review', order: 2 }, { name: 'QA Review', order: 3 }, { name: 'Approve', order: 4 }] },
      { formCode: 'VEF', name: 'Vendor Evaluation Form', description: 'Vendor performance evaluation', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
      { formCode: 'VCR', name: 'Vendor Complaint Report', description: 'Vendor performance issues', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Investigation', order: 2 }, { name: 'Resolution', order: 3 }] },
    ],
  },
  {
    id: 'pur-m3',
    code: 'PURM3',
    name: 'Contracts',
    description: 'Contract management and tracking',
    path: '/procurement/contracts',
    icon: FileText,
    forms: [
      { formCode: 'CON', name: 'Contract Request', description: 'New contract request', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Legal Review', order: 2 }, { name: 'Negotiation', order: 3 }, { name: 'Approve', order: 4 }] },
      { formCode: 'CONR', name: 'Contract Renewal', description: 'Contract renewal request', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }, { name: 'Approve', order: 3 }] },
    ],
  },
  {
    id: 'pur-m4',
    code: 'PURM4',
    name: 'Receiving',
    description: 'Goods receiving and inspection',
    path: '/procurement/receiving',
    icon: Package,
    forms: [
      { formCode: 'GRN', name: 'Goods Received Note', description: 'Material receiving record', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'QC Inspection', order: 2 }, { name: 'Store Receipt', order: 3 }] },
      { formCode: 'GRIR', name: 'GR/IR Report', description: 'Goods receipt/invoice receipt reconciliation', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Finance Review', order: 2 }] },
    ],
  },
];

// WH Module definitions for Warehouse Department
const WH_MODULES: ModuleDefinition[] = [
  {
    id: 'wh-m1',
    code: 'WHM1',
    name: 'Goods Receipt',
    description: 'Inbound shipments, receiving inspections, GRN processing',
    path: '/warehouse/goods-receipt',
    icon: Package,
    forms: [
      { formCode: 'GRN', name: 'Goods Receipt Note', description: 'Inbound shipment receiving and inspection', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Inspection', order: 2 }, { name: 'Putaway', order: 3 }] },
      { formCode: 'RCV', name: 'Receiving Record', description: 'Material receiving documentation', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Verify', order: 2 }] },
    ],
  },
  {
    id: 'wh-m2',
    code: 'WHM2',
    name: 'Stock Transfer',
    description: 'Inter-warehouse transfers, location moves, bin management',
    path: '/warehouse/stock-transfer',
    icon: ArrowLeftRight,
    forms: [
      { formCode: 'STO', name: 'Stock Transfer Order', description: 'Inter-warehouse stock transfer request', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Origin Verify', order: 2 }, { name: 'Destination Confirm', order: 3 }] },
    ],
  },
  {
    id: 'wh-m3',
    code: 'WHM3',
    name: 'Delivery Orders',
    description: 'Outbound shipments, picking, packing, dispatch',
    path: '/warehouse/delivery',
    icon: Truck,
    forms: [
      { formCode: 'DO', name: 'Delivery Order', description: 'Outbound delivery and dispatch record', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Pick', order: 2 }, { name: 'Pack', order: 3 }, { name: 'Dispatch', order: 4 }] },
    ],
  },
  {
    id: 'wh-m4',
    code: 'WHM4',
    name: 'Inventory Adjustment',
    description: 'Stock counts, write-offs, adjustments, cycle counts',
    path: '/warehouse/inventory',
    icon: ClipboardList,
    forms: [
      { formCode: 'ADJ', name: 'Stock Adjustment', description: 'Inventory adjustment and write-off request', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Supervisor Review', order: 2 }, { name: 'Approval', order: 3 }] },
      { formCode: 'CYC', name: 'Cycle Count', description: 'Cycle counting records', isInitialSubmission: true, stages: [{ name: 'Submit', order: 1 }, { name: 'Review', order: 2 }] },
    ],
  },
];

export const DEPARTMENTS: Partial<Record<DepartmentCode, Department>> = {
  IT: {
    id: 'dept-it',
    code: 'IT',
    name: 'Information Technology',
    description: 'IT services, infrastructure, and support',
    color: '#3b82f6',
    bgColor: 'bg-blue-500/10',
    icon: Monitor,
    status: 'active',
    modules: IT_MODULES,
  },
  HR: {
    id: 'dept-hr',
    code: 'HR',
    name: 'Human Resources',
    description: 'HR management, recruitment, and employee services',
    color: '#ec4899',
    bgColor: 'bg-pink-500/10',
    icon: Users,
    status: 'active',
    modules: HR_MODULES,
  },
  FIN: {
    id: 'dept-finance',
    code: 'FIN',
    name: 'Finance',
    description: 'Capital appropriation, credit management, insurance, and vendor services',
    color: '#003366',
    bgColor: 'bg-blue-900/10',
    icon: DollarSign,
    status: 'active',
    modules: FIN_MODULES,
  },
  STR: {
    id: 'dept-str',
    code: 'STR',
    name: 'Store Management',
    description: 'Store operations, requisition, procurement, disposal, and compliance',
    color: '#f97316',
    bgColor: 'bg-orange-500/10',
    icon: Warehouse,
    status: 'active',
    modules: STR_MODULES,
  },
  OPS: {
    id: 'dept-ops',
    code: 'OPS',
    name: 'Operations',
    description: 'Production planning, inventory control, work orders, and performance monitoring',
    color: '#f59e0b',
    bgColor: 'bg-amber-500/10',
    icon: Settings,
    status: 'active',
    modules: OPS_MODULES,
  },
  ENG: {
    id: 'dept-eng',
    code: 'ENG',
    name: 'Engineering',
    description: 'Engineering projects, MOC, drawings, and E&I services',
    color: '#8b5cf6',
    bgColor: 'bg-violet-500/10',
    icon: Wrench,
    status: 'active',
    modules: ENG_MODULES,
  },
  MKT: {
    id: 'dept-mkt',
    code: 'MKT',
    name: 'Marketing',
    description: 'Campaign management, brand & creative, digital marketing, and market research',
    color: '#06b6d4',
    bgColor: 'bg-cyan-500/10',
    icon: Megaphone,
    status: 'active',
    modules: MKT_MODULES,
  },
  QA: {
    id: 'dept-qa',
    code: 'QA',
    name: 'Quality Assurance',
    description: 'Quality management, audits, defects, CAPAs, and compliance',
    color: '#003366',
    bgColor: 'bg-blue-900/10',
    icon: Beaker,
    status: 'active',
    modules: QA_MODULES,
  },
  MTR: {
    id: 'dept-mtr',
    code: 'MTR',
    name: 'Maintenance',
    description: 'Equipment maintenance, failure analysis, energy efficiency, and plant upkeep',
    color: '#f59e0b',
    bgColor: 'bg-amber-500/10',
    icon: Wrench,
    status: 'active',
    modules: MTR_MODULES,
  },
  MAINT: {
    id: 'dept-maint',
    code: 'MAINT',
    name: 'Maintenance',
    description: 'Equipment maintenance, failure analysis, energy efficiency, and plant upkeep (alias for MTR)',
    color: '#f59e0b',
    bgColor: 'bg-amber-500/10',
    icon: Wrench,
    status: 'active',
    modules: MTR_MODULES,
  },
  QC: {
    id: 'dept-qc',
    code: 'QC',
    name: 'Quality Control',
    description: 'Laboratory management, testing, specifications, and quality actions',
    color: '#0ea5e9',
    bgColor: 'bg-sky-500/10',
    icon: Beaker,
    status: 'active',
    modules: QC_MODULES,
  },
  PROD: {
    id: 'dept-production',
    code: 'PROD',
    name: 'Production',
    description: 'Manufacturing operations, TPM, SAM, and process control',
    color: '#003366',
    bgColor: 'bg-blue-900/10',
    icon: Factory,
    status: 'active',
    modules: PROD_MODULES,
  },
  SHE: {
    id: 'dept-she',
    code: 'SHE',
    name: 'Safety, Health & Environment',
    description: 'SHE management, incident reporting, HIRADC, and compliance',
    color: '#ef4444',
    bgColor: 'bg-red-500/10',
    icon: Shield,
    status: 'active',
    modules: SHE_MODULES,
  },
  PURCH: {
    id: 'dept-procurement',
    code: 'PURCH',
    name: 'Procurement',
    description: 'Vendor management, purchasing, and supplier quality',
    color: '#3b82f6',
    bgColor: 'bg-blue-500/10',
    icon: Package,
    status: 'active',
  },
  ADM: {
    id: 'dept-adm',
    code: 'ADM',
    name: 'Administration',
    description: 'Facilities management, room bookings, stationery, and transport services',
    color: '#6366f1',
    bgColor: 'bg-indigo-500/10',
    icon: Building2,
    status: 'active',
    modules: ADM_MODULES,
  },
  LOG: {
    id: 'dept-log',
    code: 'LOG',
    name: 'Logistics',
    description: 'Container shipments, tanker operations, forklift management, and delivery tracking',
    color: '#0ea5e9',
    bgColor: 'bg-sky-500/10',
    icon: Truck,
    status: 'active',
    modules: LOG_MODULES,
  },
  SEC: {
    id: 'dept-sec',
    code: 'SEC',
    name: 'Security',
    description: 'Visitor management, vehicle control, access control, and patrol monitoring',
    color: '#64748b',
    bgColor: 'bg-slate-500/10',
    icon: Lock,
    status: 'active',
    modules: SEC_MODULES,
  },
  TD: {
    id: 'dept-td',
    code: 'TD',
    name: 'Training & Development',
    description: 'Training planning, course management, certification, and external training',
    color: '#a855f7',
    bgColor: 'bg-purple-500/10',
    icon: GraduationCap,
    status: 'active',
    modules: TD_MODULES,
  },
  EI: {
    id: 'dept-ei',
    code: 'EI',
    name: 'Electrical & Instrumentation',
    description: 'E&I inspection, testing, energy management, calibration, and equipment maintenance',
    color: '#eab308',
    bgColor: 'bg-yellow-500/10',
    icon: Zap,
    status: 'active',
    modules: EI_MODULES,
  },
  PBI: {
    id: 'dept-pbi',
    code: 'PBI',
    name: 'Plant Business Intelligence',
    description: 'ISO 50001 energy management, KPI tracking, sustainability, and documentation',
    color: '#06b6d4',
    bgColor: 'bg-cyan-500/10',
    icon: BarChart3,
    status: 'active',
    modules: PBI_MODULES,
  },
  RND: {
    id: 'dept-rnd',
    code: 'RND',
    name: 'Research & Development',
    description: 'R&D projects, new materials, product development, and technical documentation',
    color: '#8b5cf6',
    bgColor: 'bg-violet-500/10',
    icon: FlaskConical,
    status: 'active',
    modules: RND_MODULES,
  },
  GOV: {
    id: 'dept-gov',
    code: 'GOV',
    name: 'Governance',
    description: 'Policy management, compliance, and enterprise risk management',
    color: '#64748b',
    bgColor: 'bg-slate-500/10',
    icon: Shield,
    status: 'active',
    modules: GOV_MODULES,
  },
  PUR: {
    id: 'dept-pur',
    code: 'PUR',
    name: 'Purchasing',
    description: 'Purchase requests, vendor management, contracts, and receiving',
    color: '#3b82f6',
    bgColor: 'bg-blue-500/10',
    icon: ShoppingCart,
    status: 'active',
    modules: PUR_MODULES,
  },
  WH: {
    id: 'dept-wh',
    code: 'WH',
    name: 'Warehouse',
    description: 'Inventory management, receiving, dispatch, storage, and reporting',
    color: '#f97316',
    bgColor: 'bg-orange-500/10',
    icon: Warehouse,
    status: 'active',
    modules: WH_MODULES,
  },
  ADMIN: {
    id: 'dept-admin',
    code: 'ADMIN',
    name: 'Administration',
    description: 'Administration department for general administrative forms and records',
    color: '#6b7280',
    bgColor: 'bg-gray-500/10',
    icon: FileText,
    status: 'active',
    modules: [],
  },
  POM: {
    id: 'dept-pom',
    code: 'POM',
    name: 'POM',
    description: 'POM department forms and records',
    color: '#003366',
    bgColor: 'bg-blue-900/10',
    icon: FileText,
    status: 'active',
    modules: [],
  },
  PRC: {
    id: 'dept-prc',
    code: 'PRC',
    name: 'PRC',
    description: 'PRC department forms and records',
    color: '#003366',
    bgColor: 'bg-blue-900/10',
    icon: FileText,
    status: 'active',
    modules: [],
  },
  SA: {
    id: 'dept-sa',
    code: 'SA',
    name: 'SA',
    description: 'SA department forms and records',
    color: '#003366',
    bgColor: 'bg-blue-900/10',
    icon: FileText,
    status: 'active',
    modules: [],
  },
};
export const getDepartmentByCode = (code: string): Department | undefined => {
  return DEPARTMENTS[code as DepartmentCode];
};

export const getDepartment = (code: string): Department | undefined => {
  return getDepartmentByCode(code);
};

export const getDepartmentById = (id: string): Department | undefined => {
  return Object.values(DEPARTMENTS).find((d): d is Department => !!d && d.id === id);
};

export const getDepartmentModules = (code: DepartmentCode): ModuleDefinition[] => {
  return DEPARTMENTS[code]?.modules || [];
};

export const useDepartments = () => {
  return {
    data: Object.values(DEPARTMENTS).filter((d): d is Department => !!d),
    isLoading: false,
    error: null,
  };
};

export const getActiveDepartments = (): Department[] => {
  return Object.values(DEPARTMENTS).filter((d): d is Department => !!d && d.status === 'active');
};
