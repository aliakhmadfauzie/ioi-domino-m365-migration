/**
 * Reset Password PIC (Person-in-Charge) Routing Matrix
 * 
 * This module provides automatic assignment of IT support personnel
 * based on Application Type and Site Location.
 */

export interface PICContact {
  name: string;
  email: string;
}

export interface PICRoutingRule {
  applicationType: string;
  location?: 'PENANG' | 'JOHOR' | 'ALL';
  contacts: PICContact[];
}

/**
 * PIC Routing Matrix based on Application Type and Location
 * 
 * Global (All Locations):
 * - WHAT 8: taung@ioioleo.com, cindychew@ioioleo.com
 * - SALES PORTAL: cindychew@ioioleo.com, annaooi@ioioleo.com
 * - HCL NOTES: ravimadhu@ioioleo.com, qayyim@ioioleo.com
 * - BANK: kllit@ioioleo.com
 * - ESKER: wstan@ioioleo.com, kllit@ioioleo.com
 * 
 * Penang Specific:
 * - WEIGHBRIDGE: kelly@ioioleo.com, dannylee@ioioleo.com
 * - DOMAIN ID: taung@ioioleo.com, tinakaran@ioioleo.com, ecsaw@ioioleo.com
 * - VPN: ecsaw@ioioleo.com
 * 
 * Johor Specific:
 * - VPN: prakash@ioioleo.com
 * - WEIGHBRIDGE: cindychew@ioioleo.com, fadzli@ioioleo.com
 */
export const PIC_ROUTING_MATRIX: PICRoutingRule[] = [
  // Global applications (available at all locations)
  {
    applicationType: 'WHAT 8',
    location: 'ALL',
    contacts: [
      { name: 'Taung', email: 'taung@ioioleo.com' },
      { name: 'Cindy Chew', email: 'cindychew@ioioleo.com' },
    ],
  },
  {
    applicationType: 'SALES PORTAL',
    location: 'ALL',
    contacts: [
      { name: 'Cindy Chew', email: 'cindychew@ioioleo.com' },
      { name: 'Anna Ooi', email: 'annaooi@ioioleo.com' },
    ],
  },
  {
    applicationType: 'HCL NOTES',
    location: 'ALL',
    contacts: [
      { name: 'Ravi Madhu', email: 'ravimadhu@ioioleo.com' },
      { name: 'Qayyim', email: 'qayyim@ioioleo.com' },
    ],
  },
  {
    applicationType: 'BANK',
    location: 'ALL',
    contacts: [
      { name: 'KL IT', email: 'kllit@ioioleo.com' },
    ],
  },
  {
    applicationType: 'ESKER',
    location: 'ALL',
    contacts: [
      { name: 'W Stan', email: 'wstan@ioioleo.com' },
      { name: 'KL IT', email: 'kllit@ioioleo.com' },
    ],
  },
  {
    applicationType: 'SAP S4/HANA',
    location: 'ALL',
    contacts: [
      { name: 'SAP Support', email: 'sap-support@ioioleo.com' },
    ],
  },
  {
    applicationType: 'SOLMAN',
    location: 'ALL',
    contacts: [
      { name: 'SAP Support', email: 'sap-support@ioioleo.com' },
    ],
  },
  {
    applicationType: 'IEP',
    location: 'ALL',
    contacts: [
      { name: 'SAP Support', email: 'sap-support@ioioleo.com' },
    ],
  },
  {
    applicationType: 'NAVISION 2018',
    location: 'ALL',
    contacts: [
      { name: 'Taung', email: 'taung@ioioleo.com' },
      { name: 'Cindy Chew', email: 'cindychew@ioioleo.com' },
    ],
  },
  {
    applicationType: 'DOMAIN PC',
    location: 'ALL',
    contacts: [
      { name: 'Taung', email: 'taung@ioioleo.com' },
      { name: 'Tina Karan', email: 'tinakaran@ioioleo.com' },
      { name: 'EC Saw', email: 'ecsaw@ioioleo.com' },
    ],
  },
  
  // Penang-specific applications
  {
    applicationType: 'WEIGHBRIDGE',
    location: 'PENANG',
    contacts: [
      { name: 'Kelly', email: 'kelly@ioioleo.com' },
      { name: 'Danny Lee', email: 'dannylee@ioioleo.com' },
    ],
  },
  {
    applicationType: 'DOMAIN ID',
    location: 'PENANG',
    contacts: [
      { name: 'Taung', email: 'taung@ioioleo.com' },
      { name: 'Tina Karan', email: 'tinakaran@ioioleo.com' },
      { name: 'EC Saw', email: 'ecsaw@ioioleo.com' },
    ],
  },
  {
    applicationType: 'VPN',
    location: 'PENANG',
    contacts: [
      { name: 'EC Saw', email: 'ecsaw@ioioleo.com' },
    ],
  },
  
  // Johor-specific applications
  {
    applicationType: 'VPN',
    location: 'JOHOR',
    contacts: [
      { name: 'Prakash', email: 'prakash@ioioleo.com' },
    ],
  },
  {
    applicationType: 'WEIGHBRIDGE',
    location: 'JOHOR',
    contacts: [
      { name: 'Cindy Chew', email: 'cindychew@ioioleo.com' },
      { name: 'Fadzli', email: 'fadzli@ioioleo.com' },
    ],
  },
];

/**
 * Get the assigned PIC(s) for a given application type and location
 * 
 * @param applicationType - The type of application/system (e.g., 'WHAT 8', 'VPN')
 * @param location - The site location ('PENANG' or 'JOHOR')
 * @returns Array of PIC contacts, or empty array if no match found
 */
export function getAssignedPIC(
  applicationType: string,
  location: 'PENANG' | 'JOHOR'
): PICContact[] {
  // First, try to find a location-specific rule
  const locationSpecificRule = PIC_ROUTING_MATRIX.find(
    (rule) =>
      rule.applicationType === applicationType && rule.location === location
  );
  
  if (locationSpecificRule) {
    return locationSpecificRule.contacts;
  }
  
  // Fall back to global rule (location: 'ALL')
  const globalRule = PIC_ROUTING_MATRIX.find(
    (rule) =>
      rule.applicationType === applicationType && rule.location === 'ALL'
  );
  
  return globalRule?.contacts || [
    { name: 'Taung', email: 'taung@ioioleo.com' },
    { name: 'Cindy Chew', email: 'cindychew@ioioleo.com' },
  ];
}

/**
 * Get the primary PIC (first contact) for a given application type and location
 * 
 * @param applicationType - The type of application/system
 * @param location - The site location
 * @returns Primary PIC contact, or null if no match found
 */
export function getPrimaryPIC(
  applicationType: string,
  location: 'PENANG' | 'JOHOR'
): PICContact | null {
  const contacts = getAssignedPIC(applicationType, location);
  return contacts[0] || null;
}

/**
 * Get formatted PIC string for display (comma-separated emails)
 * 
 * @param applicationType - The type of application/system
 * @param location - The site location
 * @returns Comma-separated email string, or 'Not assigned' if no match
 */
export function getFormattedPICEmails(
  applicationType: string,
  location: 'PENANG' | 'JOHOR'
): string {
  const contacts = getAssignedPIC(applicationType, location);
  if (contacts.length === 0) return 'Not assigned';
  return contacts.map((c) => c.email).join(', ');
}

/**
 * Get formatted PIC names for display
 * 
 * @param applicationType - The type of application/system
 * @param location - The site location
 * @returns Comma-separated name string, or 'Not assigned' if no match
 */
export function getFormattedPICNames(
  applicationType: string,
  location: 'PENANG' | 'JOHOR'
): string {
  const contacts = getAssignedPIC(applicationType, location);
  if (contacts.length === 0) return 'Not assigned';
  return contacts.map((c) => c.name).join(', ');
}

/**
 * Check if an application type requires location-specific routing
 * (i.e., different PICs for different locations)
 * 
 * @param applicationType - The type of application/system
 * @returns true if the application has different PICs per location
 */
export function isLocationSpecificApplication(applicationType: string): boolean {
  const locationSpecificRules = PIC_ROUTING_MATRIX.filter(
    (rule) => rule.applicationType === applicationType && rule.location !== 'ALL'
  );
  return locationSpecificRules.length > 0;
}

/**
 * Get all unique application types from the routing matrix
 * 
 * @returns Array of unique application type strings
 */
export function getAllApplicationTypes(): string[] {
  const types = new Set(PIC_ROUTING_MATRIX.map((rule) => rule.applicationType));
  return Array.from(types);
}

/**
 * Get applications available for a specific location
 * Includes both location-specific and global applications
 * 
 * @param location - The site location
 * @returns Array of application types available at that location
 */
export function getApplicationsForLocation(location: 'PENANG' | 'JOHOR'): string[] {
  return PIC_ROUTING_MATRIX
    .filter((rule) => rule.location === 'ALL' || rule.location === location)
    .map((rule) => rule.applicationType)
    .filter((value, index, self) => self.indexOf(value) === index); // unique
}