/**
 * M2 - IT Support Forms Schema
 * 
 * Forms: SRL (Server Reboot Log), DCAL (Data Center Access Log), ITE (IT Event),
 *        SRVR (Server Records), DR (Data Restoration), ITDR (IT Daily Report), PRF (Project Request)
 * Site: PRAI (MainDB_IT)
 */

import type { EnvironmentTag } from '@/services/sharepoint-submission-service';

// =============================================================================
// SRL - SERVER REBOOT LOG
// =============================================================================

/**
 * SRL Reboot Type
 */
export type SRLRebootType = 'Planned' | 'Unplanned';

/**
 * SRL Form Status
 */
export type SRLStatus = 'Draft' | 'Submitted' | 'Reviewed' | 'Closed';

/**
 * SRL Form Schema
 * As per testing feedback - simplified fields
 */
export interface SRLFormData {
  // SharePoint System Fields
  Id?: number;
  GUID?: string;
  Created?: string;
  Modified?: string;

  // Mandatory Base Columns
  Title: string;                    // Auto-generated reference (SRL-YYYYMM-####)
  FormCode: 'SRL';
  
  // Request Details
  RebootType: SRLRebootType;        // Plan or Unplanned - TOP FIELD
  ServerLocation: string;           // Server location - moved up
  ServerName: string;               // Server name
  ServerUptime?: string;            // Server uptime before reboot - NEW FIELD
  RebootDate: string;               // Date/time of reboot
  RebootReason: string;             // Reason for reboot
  RebootDuration?: string;          // Duration of reboot
  
  // Requestor Info
  Requestor: string;                // Who performed the reboot
  Department?: string;
  
  // Post-reboot status
  PostRebootStatus?: string;        // Status after reboot
  ServicesRestored?: boolean;       // All services restored?
  Remarks?: string;
  
  // System Fields
  Status: SRLStatus;
  SubmittedDate?: string;
  EnvironmentTag?: EnvironmentTag;
}

/**
 * SRL Form Input - Fields for creating new SRL
 */
export interface SRLFormInput {
  RebootType: SRLRebootType;
  ServerLocation: string;
  ServerName: string;
  ServerUptime?: string;
  RebootDate: string;
  RebootReason: string;
  RebootDuration?: string;
  PostRebootStatus?: string;
  ServicesRestored?: boolean;
  Remarks?: string;
}

// SRL Choice Values
export const SRL_REBOOT_TYPES: SRLRebootType[] = ['Planned', 'Unplanned'];

export const SRL_SERVER_LOCATIONS = [
  'Prai Data Center - Main',
  'Prai Data Center - DR',
  'Johor Data Center - Main',
  'Johor Data Center - DR',
  'Cloud - Azure',
  'Cloud - AWS',
  'Remote Site',
] as const;

// =============================================================================
// DCAL - DATA CENTER ACCESS LOG
// =============================================================================

/**
 * DCAL Access Type
 */
export type DCALAccessType = 'Staff' | 'Contractor' | 'Vendor';

/**
 * DCAL Form Status
 */
export type DCALStatus = 'Draft' | 'Checked In' | 'Checked Out' | 'Closed';

/**
 * DCAL Form Schema
 * As per testing feedback - simplified fields
 */
export interface DCALFormData {
  // SharePoint System Fields
  Id?: number;
  GUID?: string;
  Created?: string;
  Modified?: string;

  // Mandatory Base Columns
  Title: string;                    // Auto-generated reference (DCAL-YYYYMM-####)
  FormCode: 'DCAL';
  
  // Location Info - MOVED UP
  Location: string;                 // Data center location - TOP FIELD
  ServerRoom: string;               // Server room - NEW FIELD
  
  // Visitor Info
  VisitorName: string;              // Person accessing
  Company: string;                  // Company/department
  ContactNumber?: string;           // Contact number
  
  // Access Details
  AccessDate: string;               // Date of access
  CheckInTime?: string;             // Check in time
  CheckOutTime?: string;            // Check out time
  PurposeOfVisit: string;           // Purpose of visit
  EquipmentBrought?: string;        // Equipment brought in
  
  // Escort Info
  EscortedBy?: string;              // IT staff escorting
  
  // Remarks
  Remarks?: string;
  
  // System Fields
  Status: DCALStatus;
  Requestor: string;
  SubmittedDate?: string;
  EnvironmentTag?: EnvironmentTag;
}

/**
 * DCAL Form Input - Fields for creating new DCAL
 */
export interface DCALFormInput {
  Location: string;
  ServerRoom: string;
  VisitorName: string;
  Company: string;
  ContactNumber?: string;
  AccessDate: string;
  PurposeOfVisit: string;
  EquipmentBrought?: string;
  EscortedBy?: string;
  Remarks?: string;
}

// DCAL Choice Values
export const DCAL_LOCATIONS = [
  'Prai Data Center',
  'Johor Data Center',
  'KL Office Server Room',
  'Singapore Data Center',
] as const;

export const DCAL_SERVER_ROOMS = [
  'Main Server Room',
  'Network Room',
  'UPS Room',
  'Storage Room',
  'Backup Room',
  'Cooling Room',
] as const;