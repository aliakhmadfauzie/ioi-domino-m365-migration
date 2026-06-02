/**
 * Logistics (LOG) Department Form Types
 * 
 * Based on Logistics_PowerApps_Data_Schema.xlsx
 * Forms: 01-CSD, 02-TI, 04-ECMFB, 05-FBN, 10-POD, 14-GTPW, 15-TMI
 */

// =============================================================================
// SHARED LOOKUP VALUES
// =============================================================================

export const LOG_SITES = [
  'IOI Acidchem Pasir Gudang',
  'IOI Acidchem Prai',
  'IOI Acidchem Sandakan',
] as const;

export const LOG_CONTAINER_TYPES = [
  '20ft Standard',
  '40ft Standard',
  '40ft High Cube',
  '20ft Reefer',
  '40ft Reefer',
  'ISO Tank',
  'Flexitank',
] as const;

export const LOG_PRODUCTS = [
  'Oleic Acid',
  'Stearic Acid',
  'Glycerine (Refined)',
  'Glycerine (Crude)',
  'Fatty Acid',
  'Palm Kernel Oil',
  'Palm Stearin',
  'RBD Palm Oil',
  'Soap Noodles',
] as const;

export const LOG_CLEANLINESS_STATUS = [
  'Good',
  'Satisfactory',
  'Poor',
  'Rejected',
] as const;

export const LOG_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

// =============================================================================
// FORM 01: CONTAINER SHIPMENT DATABASE (CSD)
// =============================================================================

export interface CSDFormInput {
  // Header
  Site: string; // DS - dropdown from sites
  
  // Section A
  SoNo: string; // UI - SO number
  Quantity: number; // UI - Quantity in MTS
  BookingNo: string; // UI - Booking number
  Volume: number; // UI - Volume
  Type: string; // UI - Container type dropdown
  IncotermA: string; // UI - Incoterm
  DestA: string; // UI - Destination
  ClosingDate: string; // UI - Closing date
  ClosingTime: string; // UI - Closing time
  Customer: string; // DS - Customer lookup
  
  // Section A: Table (up to 50 container numbers)
  ContainerNumbers: string[]; // UI - Container number entries
  
  // Computed
  TotalContainers?: number; // CM - count of ContainerNumbers
}

export interface CSDFormSubmission extends CSDFormInput {
  // Hidden/System Generated
  RecordId: string; // SG - Auto-generated document number
  CreatedBy: string; // SG - User().FullName
  CreatedDate: string; // SG - Now()
  Status: 'Draft' | 'Submitted';
}

// =============================================================================
// FORM 02: TANKER INSPECTION (TI)
// =============================================================================

export interface TIFormInput {
  // Section A
  InDate: string; // UI - Date In
  TankNo: string; // UI - Tanker & Trailer No
  Product: string; // DS - Product to load
  
  // Section B - Checklist items with Yes/No/NA answers
  ChecklistAnswers: Record<string, {
    answer: 'Yes' | 'No' | '';
    remark: string;
  }>;
  
  // QC Approval
  QCRemark: string; // UI - QC remarks
  QCStatus?: 'Pending' | 'Approved' | 'Rejected'; // Hidden - set by approver
}

export interface TIFormSubmission extends TIFormInput {
  // System Generated
  InspectionId: string; // SG - Auto-generated
  InspectedBy: string; // SG - User().FullName
  InspectedDate: string; // SG - Now()
  QCApprovedBy?: string; // SG - Approver name
  QCApprovedDate?: string; // SG - Approval date
}

// =============================================================================
// FORM 04: ECM FORKLIFT BREAKDOWN NOTIFICATION (ECMFB)
// =============================================================================

export interface ECMFBFormInput {
  // Initiator
  FNumber: string; // UI - Forklift number
  Desc: string; // UI - Problem description
  
  // Approval
  TotalCost: string; // UI - Estimated total cost (RM)
}

export interface ECMFBFormSubmission extends ECMFBFormInput {
  // System Generated
  NotificationId: string; // SG - Auto-generated
  ReportedBy: string; // SG - User().FullName
  ReportedDate: string; // SG - Now()
  ApprovalStatus: 'Pending' | 'Approved' | 'Rejected';
  ApprovedBy?: string;
  ApprovedDate?: string;
}

// =============================================================================
// FORM 05: FORKLIFT BREAKDOWN NOTIFICATION (FBN)
// =============================================================================

export interface FBNFormInput {
  // Initiator
  BNumber: string; // UI - Battery number
  SMUHours: string; // UI - SMU hours reading
}

export interface FBNFormSubmission extends FBNFormInput {
  // System Generated
  NotificationId: string; // SG - Auto-generated
  ReportedBy: string; // SG - User().FullName
  ReportedDate: string; // SG - Now()
}

// =============================================================================
// FORM 10: PRODUCT OVER/SHORT DELIVERY (POD)
// =============================================================================

export interface PODFormInput {
  // Requestor
  TankNo: string; // UI - Vehicle number
  ACMLoadTemp: string; // UI - Loading temp at ACM (degrees C)
  
  // Weights
  ACMNetWeight: string; // UI - ACM net weight (MT)
  CustNetWeight: string; // UI - Customer net weight (MT)
  
  // Computed
  TempDrop?: number; // CM - Temperature drop calculation
  WeightVariance?: number; // CM - ACM - Customer weight
}

export interface PODFormSubmission extends PODFormInput {
  // System Generated
  ReportId: string; // SG - Auto-generated
  ReportedBy: string; // SG - User().FullName
  ReportedDate: string; // SG - Now()
}

// =============================================================================
// FORM 14: GLYCERINE TANKER PERIODIC WASHING (GTPW)
// =============================================================================

export interface GTPWFormInput {
  // Section B
  WMonth: string; // DS - Washing for the month (dropdown)
  Temperature: string; // UI - Hot water temperature (>= 80 degrees C)
}

export interface GTPWFormSubmission extends GTPWFormInput {
  // System Generated
  RecordId: string; // SG - Auto-generated
  RecordedBy: string; // SG - User().FullName
  RecordedDate: string; // SG - Now()
}

// =============================================================================
// FORM 15: TANKER MONTHLY INSPECTION (TMI)
// =============================================================================

export interface TMIFormInput {
  // Initiator
  PrLTDate: string; // DS - Previous inspection date (carried from prior record)
  
  // Checklist items with status ratings
  ChecklistItems: Record<string, {
    status: string; // DS - Cleanliness status dropdown
    comment: string;
  }>;
}

export interface TMIFormSubmission extends TMIFormInput {
  // System Generated
  InspectionId: string; // SG - Auto-generated
  InspectedBy: string; // SG - User().FullName
  InspectionDate: string; // SG - Now()
}

// =============================================================================
// FORM METADATA
// =============================================================================

export interface LOGFormDefinition {
  id: string;
  code: string;
  title: string;
  description: string;
  sections: string[];
  category: 'Shipment' | 'Inspection' | 'Breakdown' | 'Delivery' | 'Maintenance';
  icon: string;
  color: string;
  route: string;
}

export const LOG_FORMS: LOGFormDefinition[] = [
  {
    id: '01',
    code: 'CSD',
    title: 'Container Shipment Database',
    description: 'Track container shipments with booking details and up to 50 container numbers',
    sections: ['Header', 'Section A', 'Section A: Table'],
    category: 'Shipment',
    icon: 'Container',
    color: '#003366',
    route: '/log/forms/csd/new',
  },
  {
    id: '02',
    code: 'TI',
    title: 'Tanker Inspection',
    description: 'Inspect tankers before loading with QC approval workflow',
    sections: ['Section A', 'Section B', 'QC Approval'],
    category: 'Inspection',
    icon: 'ClipboardCheck',
    color: '#003366',
    route: '/log/forms/ti/new',
  },
  {
    id: '04',
    code: 'ECMFB',
    title: 'ECM Forklift Breakdown Notification',
    description: 'Report ECM forklift breakdowns with cost tracking and approval',
    sections: ['Initiator', 'Approval'],
    category: 'Breakdown',
    icon: 'AlertTriangle',
    color: '#F59E0B',
    route: '/log/forms/ecmfb/new',
  },
  {
    id: '05',
    code: 'FBN',
    title: 'Forklift Breakdown Notification',
    description: 'Report standard forklift breakdowns with SMU hour tracking',
    sections: ['Initiator'],
    category: 'Breakdown',
    icon: 'AlertTriangle',
    color: '#F59E0B',
    route: '/log/forms/fbn/new',
  },
  {
    id: '10',
    code: 'POD',
    title: 'Product Over/Short Delivery',
    description: 'Document product weight discrepancies and temperature variations',
    sections: ['Requestor', 'Weights'],
    category: 'Delivery',
    icon: 'Scale',
    color: '#003366',
    route: '/log/forms/pod/new',
  },
  {
    id: '14',
    code: 'GTPW',
    title: 'Glycerine Tanker Periodic Washing',
    description: 'Schedule and track glycerine tanker washing cycles',
    sections: ['Section B'],
    category: 'Maintenance',
    icon: 'Droplets',
    color: '#0891B2',
    route: '/log/forms/gtpw/new',
  },
  {
    id: '15',
    code: 'TMI',
    title: 'Tanker Monthly Inspection',
    description: 'Monthly inspection checklist for tanker fleet',
    sections: ['Initiator', 'Checklist'],
    category: 'Inspection',
    icon: 'Calendar',
    color: '#003366',
    route: '/log/forms/tmi/new',
  },
];