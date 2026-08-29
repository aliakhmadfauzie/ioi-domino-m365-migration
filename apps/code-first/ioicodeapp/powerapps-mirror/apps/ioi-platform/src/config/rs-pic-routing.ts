/**
 * Reset Password (RS) Form - PIC Routing Configuration
 * 
 * Auto-assigns the correct Person-In-Charge (PIC) based on:
 * - Application Type (WHAT 8, SALES PORTAL, HCL NOTES, BANK, ESKER, WEIGHBRIDGE, DOMAIN ID, VPN)
 * - Location (Penang/PRAI or Johor/JHR)
 * 
 * The PIC assignment flows directly to IT after submission - no manager approval required.
 */

export type RSApplicationType = 
  | 'WHAT 8'
  | 'SALES PORTAL'
  | 'HCL NOTES'
  | 'BANK'
  | 'ESKER'
  | 'WEIGHBRIDGE'
  | 'DOMAIN ID'
  | 'DOMAIN PC'
  | 'VPN'
  | 'SAP S4/HANA'
  | 'SOLMAN'
  | 'IEP'
  | 'NAVISION 2018';

export type RSLocation = 'PENANG' | 'JOHOR';

export interface RSPICConfig {
  primaryPIC: string;
  secondaryPIC?: string;
  description?: string;
}

/**
 * PIC Routing Matrix
 * Maps Application Type + Location to the assigned PIC(s)
 */
const RS_PIC_MATRIX: Record<string, RSPICConfig> = {
  // Global applications (not location-specific)
  'WHAT 8': {
    primaryPIC: 'taung@ioioleo.com',
    secondaryPIC: 'cindychew@ioioleo.com',
    description: 'WHAT 8 System',
  },
  'SALES PORTAL': {
    primaryPIC: 'cindychew@ioioleo.com',
    secondaryPIC: 'annaooi@ioioleo.com',
    description: 'Sales Portal System',
  },
  'HCL NOTES': {
    primaryPIC: 'ravimadhu@ioioleo.com',
    secondaryPIC: 'qayyim@ioioleo.com',
    description: 'HCL Notes/Domino',
  },
  'BANK': {
    primaryPIC: 'itklsupport@ioileo.com',
    description: 'Banking Systems',
  },
  'ESKER': {
    primaryPIC: 'wstan@ioioleo.com',
    secondaryPIC: 'itklsupport@ioileo.com',
    description: 'Esker Automation',
  },
  'SAP S4/HANA': {
    primaryPIC: 'sap-support@ioioleo.com',
    description: 'SAP S4/HANA',
  },
  'SOLMAN': {
    primaryPIC: 'sap-support@ioioleo.com',
    description: 'SOLMAN',
  },
  'IEP': {
    primaryPIC: 'sap-support@ioioleo.com',
    description: 'SAP Live System (IEP)',
  },
  'NAVISION 2018': {
    primaryPIC: 'taung@ioioleo.com',
    secondaryPIC: 'cindychew@ioioleo.com',
    description: 'Navision 2018 ERP',
  },
  'DOMAIN PC': {
    primaryPIC: 'taung@ioioleo.com',
    secondaryPIC: 'tinakaran@ioioleo.com',
    description: 'Domain PC Management',
  },
  
  // Penang location-specific
  'WEIGHBRIDGE_PENANG': {
    primaryPIC: 'kelly@ioioleo.com',
    secondaryPIC: 'dannylee@ioioleo.com',
    description: 'Weighbridge - Penang/PRAI',
  },
  'DOMAIN ID_PENANG': {
    primaryPIC: 'taung@ioioleo.com',
    secondaryPIC: 'tinakaran@ioioleo.com',
    description: 'Domain ID - Penang/PRAI',
  },
  'VPN_PENANG': {
    primaryPIC: 'ecsaw@ioioleo.com',
    description: 'VPN Access - Penang/PRAI',
  },
  
  // Johor location-specific
  'VPN_JOHOR': {
    primaryPIC: 'prakash@ioioleo.com',
    description: 'VPN Access - Johor/JHR',
  },
  'WEIGHBRIDGE_JOHOR': {
    primaryPIC: 'cindychew@ioioleo.com',
    secondaryPIC: 'fadzli@ioioleo.com',
    description: 'Weighbridge - Johor/JHR',
  },
};

/**
 * Application types that require location selection
 */
export const LOCATION_DEPENDENT_APPS: RSApplicationType[] = [
  'WEIGHBRIDGE',
  'DOMAIN ID',
  'VPN',
];

/**
 * All available application types for Reset Password form
 */
export const RS_APPLICATION_TYPES: { value: RSApplicationType; label: string; requiresLocation: boolean }[] = [
  { value: 'WHAT 8', label: 'WHAT 8', requiresLocation: false },
  { value: 'SALES PORTAL', label: 'Sales Portal', requiresLocation: false },
  { value: 'HCL NOTES', label: 'HCL Notes', requiresLocation: false },
  { value: 'BANK', label: 'Bank', requiresLocation: false },
  { value: 'ESKER', label: 'Esker', requiresLocation: false },
  { value: 'WEIGHBRIDGE', label: 'Weighbridge', requiresLocation: true },
  { value: 'DOMAIN ID', label: 'Domain ID', requiresLocation: true },
  { value: 'VPN', label: 'VPN', requiresLocation: true },
  { value: 'SAP S4/HANA', label: 'SAP S4/HANA', requiresLocation: false },
  { value: 'SOLMAN', label: 'SOLMAN', requiresLocation: false },
  { value: 'IEP', label: 'IEP (Live System)', requiresLocation: false },
  { value: 'NAVISION 2018', label: 'Navision 2018', requiresLocation: false },
  { value: 'DOMAIN PC', label: 'Domain PC', requiresLocation: false },
];

/**
 * Location options for the form
 */
export const RS_LOCATIONS: { value: RSLocation; label: string }[] = [
  { value: 'PENANG', label: 'Penang (PRAI)' },
  { value: 'JOHOR', label: 'Johor (JHR)' },
];

/**
 * Get the PIC configuration for a given application type and location
 * @param applicationType The application/system type
 * @param location Optional location (required for some application types)
 * @returns PIC configuration with primary and optional secondary PIC emails
 */
export function getRSPIC(
  applicationType: RSApplicationType,
  location?: RSLocation
): RSPICConfig | null {
  // Check if this application type requires location
  const requiresLocation = LOCATION_DEPENDENT_APPS.includes(applicationType);
  
  if (requiresLocation && location) {
    // Try location-specific key first
    const locationKey = `${applicationType}_${location}`;
    if (RS_PIC_MATRIX[locationKey]) {
      return RS_PIC_MATRIX[locationKey];
    }
  }
  
  // Fall back to global application type
  if (RS_PIC_MATRIX[applicationType]) {
    return RS_PIC_MATRIX[applicationType];
  }
  
  return null;
}

/**
 * Get all PICs as a comma-separated string for email notification
 * @param applicationType The application/system type
 * @param location Optional location
 * @returns Comma-separated email addresses of all assigned PICs
 */
export function getRSPICEmails(
  applicationType: RSApplicationType,
  location?: RSLocation
): string {
  const picConfig = getRSPIC(applicationType, location);
  
  if (!picConfig) {
    // Default fallback to IT support
    return 'taung@ioioleo.com; cindychew@ioioleo.com';
  }
  
  const emails = [picConfig.primaryPIC];
  if (picConfig.secondaryPIC) {
    emails.push(picConfig.secondaryPIC);
  }
  
  return emails.join(', ');
}

/**
 * Check if a given application type requires location selection
 */
export function requiresLocationSelection(applicationType: RSApplicationType): boolean {
  return LOCATION_DEPENDENT_APPS.includes(applicationType);
}

/**
 * Get the display name for a PIC email
 * (Maps known emails to display names for UI purposes)
 */
export const PIC_DISPLAY_NAMES: Record<string, string> = {
  'taung@ioioleo.com': 'Taung',
  'cindychew@ioioleo.com': 'Cindy Chew',
  'annaooi@ioioleo.com': 'Anna Ooi',
  'ravimadhu@ioioleo.com': 'Ravi Madhu',
  'qayyim@ioioleo.com': 'Qayyim',
  'kllit@ioioleo.com': 'Ravi, Qayyim, Kelly (KL IT)',
  'itklsupport@ioileo.com': 'Ravi, Qayyim, Kelly',
  'wstan@ioioleo.com': 'W. Stan',
  'kelly@ioioleo.com': 'Kelly',
  'dannylee@ioioleo.com': 'Danny Lee',
  'tinakaran@ioioleo.com': 'Tina Karan',
  'ecsaw@ioioleo.com': 'EC Saw',
  'prakash@ioioleo.com': 'Prakash',
  'fadzli@ioioleo.com': 'Fadzli',
};

/**
 * Get display name for a PIC email
 */
export function getPICDisplayName(email: string): string {
  return PIC_DISPLAY_NAMES[email.toLowerCase()] || email;
}