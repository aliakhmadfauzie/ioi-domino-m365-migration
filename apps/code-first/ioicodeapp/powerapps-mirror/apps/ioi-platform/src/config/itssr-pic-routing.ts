/**
 * ITSSR Form - PIC Routing Configuration
 *
 * Auto-assigns the correct Person-In-Charge (PIC) based on:
 * - Service Type (Hardware, Software, Network, Email, SAP, Bank, Other)
 * - Application (for Software type: HCL NOTES, SALES PORTAL, ESKER, WEIGHING SYSTEM, etc.)
 * - Location (Penang/PRAI, Johor/JHR, KL)
 *
 * The routed PIC is the IT admin who should action the ticket.
 * Mirrors the same personnel assignments as rs-pic-routing.ts.
 */

import type { MainDBITSiteKey } from '@/generated/models/main-dbit-model';

export type ITSSRRoutingLocation = 'PENANG' | 'JOHOR' | 'KL';

export interface ITSSRPICConfig {
  primaryPIC: string;
  secondaryPIC?: string;
  description?: string;
}

/**
 * PIC Routing Matrix
 * Keys: "ServiceType", "ServiceType_LOCATION", "Software_APPLICATION", "Software_APPLICATION_LOCATION"
 */
const ITSSR_PIC_MATRIX: Record<string, ITSSRPICConfig> = {
  // ── Hardware ────────────────────────────────────────────────────────────────
  'Hardware_PENANG': {
    primaryPIC: 'dannylee@ioioleo.com',
    secondaryPIC: 'kelly@ioioleo.com',
    description: 'Hardware Support – Penang / PRAI',
  },
  'Hardware_JOHOR': {
    primaryPIC: 'fadzli@ioioleo.com',
    secondaryPIC: 'cindychew@ioioleo.com',
    description: 'Hardware Support – Johor / JHR',
  },
  'Hardware_KL': {
    primaryPIC: 'itklsupport@ioileo.com',
    description: 'Hardware Support – Kuala Lumpur',
  },

  // ── Network ─────────────────────────────────────────────────────────────────
  'Network_PENANG': {
    primaryPIC: 'ecsaw@ioioleo.com',
    secondaryPIC: 'taung@ioioleo.com',
    description: 'Network Support – Penang / PRAI',
  },
  'Network_JOHOR': {
    primaryPIC: 'prakash@ioioleo.com',
    description: 'Network Support – Johor / JHR',
  },
  'Network_KL': {
    primaryPIC: 'itklsupport@ioileo.com',
    description: 'Network Support – Kuala Lumpur',
  },

  // ── Email (HCL Notes / mail team) ───────────────────────────────────────────
  'Email': {
    primaryPIC: 'ravimadhu@ioioleo.com',
    secondaryPIC: 'qayyim@ioioleo.com',
    description: 'Email / HCL Notes System Support',
  },

  // ── SAP ─────────────────────────────────────────────────────────────────────
  'SAP': {
    primaryPIC: 'itklsupport@ioileo.com',
    description: 'SAP Support',
  },

  // ── Bank ────────────────────────────────────────────────────────────────────
  'Bank': {
    primaryPIC: 'itklsupport@ioileo.com',
    description: 'Banking Systems Support',
  },

  // ── Software – application-specific ─────────────────────────────────────────
  'Software_BANK': {
    primaryPIC: 'itklsupport@ioileo.com',
    description: 'Software – Bank Application',
  },
  'Software_HCL NOTES': {
    primaryPIC: 'ravimadhu@ioioleo.com',
    secondaryPIC: 'qayyim@ioioleo.com',
    description: 'Software – HCL Notes / Domino',
  },
  'Software_SALES PORTAL': {
    primaryPIC: 'cindychew@ioioleo.com',
    secondaryPIC: 'annaooi@ioioleo.com',
    description: 'Software – Sales Portal',
  },
  'Software_ESKER AP AUTOMATION': {
    primaryPIC: 'wstan@ioioleo.com',
    secondaryPIC: 'itklsupport@ioileo.com',
    description: 'Software – Esker AP Automation',
  },
  'Software_WEIGHING SYSTEM_PENANG': {
    primaryPIC: 'kelly@ioioleo.com',
    secondaryPIC: 'dannylee@ioioleo.com',
    description: 'Software – Weighing System (Penang / PRAI)',
  },
  'Software_WEIGHING SYSTEM_JOHOR': {
    primaryPIC: 'cindychew@ioioleo.com',
    secondaryPIC: 'fadzli@ioioleo.com',
    description: 'Software – Weighing System (Johor / JHR)',
  },
  'Software_SAP S4/HANA': {
    primaryPIC: 'itklsupport@ioileo.com',
    description: 'Software – SAP S4/HANA',
  },
  'Software_SAC': {
    primaryPIC: 'itklsupport@ioileo.com',
    description: 'Software – SAP Analytics Cloud',
  },
  'Software_ESDE': {
    primaryPIC: 'itklsupport@ioileo.com',
    description: 'Software – ESDE',
  },

  // ── Other / fallback ────────────────────────────────────────────────────────
  'Other': {
    primaryPIC: 'taung@ioioleo.com',
    secondaryPIC: 'cindychew@ioioleo.com',
    description: 'General IT Support',
  },
};

// Service types that require a location to resolve correctly
export const ITSSR_LOCATION_DEPENDENT_TYPES: string[] = ['Hardware', 'Network'];

// Software applications that are location-dependent
export const ITSSR_LOCATION_DEPENDENT_APPS: string[] = ['WEIGHING SYSTEM'];

/**
 * Map from MainDBITSiteKey → routing location string.
 * Prai (SiteKey2) shares Penang IT staff.
 */
export const SITE_KEY_TO_ROUTING_LOCATION: Partial<Record<MainDBITSiteKey, ITSSRRoutingLocation>> = {
  SiteKey0: 'JOHOR',   // Johor
  SiteKey1: 'PENANG',  // Penang
  SiteKey2: 'PENANG',  // Prai (same IT team as Penang)
  SiteKey3: 'KL',      // Kuala Lumpur
  // SiteKey4 = All Sites — no site-specific routing
};

/**
 * Resolve the PIC config for a given ITSSR ticket.
 *
 * Resolution order:
 * 1. Software + location-dependent application + location  (e.g. WEIGHING SYSTEM_JOHOR)
 * 2. Software + application                               (e.g. HCL NOTES)
 * 3. Location-dependent type + location                   (e.g. Hardware_PENANG)
 * 4. Type only                                            (e.g. Email, SAP, Bank)
 * 5. "Other" fallback
 */
export function getITSSRPIC(
  serviceType?: string,
  application?: string,
  location?: ITSSRRoutingLocation
): ITSSRPICConfig | null {
  if (!serviceType) return ITSSR_PIC_MATRIX['Other'] ?? null;

  // Software → try application-specific routing
  if (serviceType === 'Software' && application) {
    const appKey = application.toUpperCase();

    // Location-dependent app (e.g. WEIGHING SYSTEM)
    if (ITSSR_LOCATION_DEPENDENT_APPS.includes(appKey) && location) {
      const key = `Software_${appKey}_${location}`;
      if (ITSSR_PIC_MATRIX[key]) return ITSSR_PIC_MATRIX[key];
    }

    // App-specific (case-sensitive as stored in matrix)
    const directKey = `Software_${application}`;
    if (ITSSR_PIC_MATRIX[directKey]) return ITSSR_PIC_MATRIX[directKey];
  }

  // Location-dependent service types (Hardware, Network)
  if (ITSSR_LOCATION_DEPENDENT_TYPES.includes(serviceType) && location) {
    const key = `${serviceType}_${location}`;
    if (ITSSR_PIC_MATRIX[key]) return ITSSR_PIC_MATRIX[key];
  }

  // Type-level lookup (Email, SAP, Bank, Other)
  if (ITSSR_PIC_MATRIX[serviceType]) return ITSSR_PIC_MATRIX[serviceType];

  // Fallback
  return ITSSR_PIC_MATRIX['Other'] ?? null;
}

/** Returns [primaryPIC, secondaryPIC?] email array for the given routing. */
export function getITSSRPICEmails(
  serviceType?: string,
  application?: string,
  location?: ITSSRRoutingLocation
): string[] {
  const config = getITSSRPIC(serviceType, application, location);
  if (!config) return ['taung@ioioleo.com', 'cindychew@ioioleo.com'];
  return [config.primaryPIC, ...(config.secondaryPIC ? [config.secondaryPIC] : [])];
}

/** Returns true if the given email is a primary or secondary PIC for the routing. */
export function isITSSRPICForTicket(
  email: string,
  serviceType?: string,
  application?: string,
  location?: ITSSRRoutingLocation
): boolean {
  const config = getITSSRPIC(serviceType, application, location);
  if (!config) return false;
  const emailL = email.toLowerCase();
  return (
    config.primaryPIC.toLowerCase() === emailL ||
    (config.secondaryPIC?.toLowerCase() === emailL)
  );
}

/** Display names for all ITSSR PICs (mirrors rs-pic-routing.ts PIC_DISPLAY_NAMES). */
export const ITSSR_PIC_DISPLAY_NAMES: Record<string, string> = {
  'dannylee@ioioleo.com': 'Danny Lee',
  'kelly@ioioleo.com': 'Kelly',
  'fadzli@ioioleo.com': 'Fadzli',
  'cindychew@ioioleo.com': 'Cindy Chew',
  'ecsaw@ioioleo.com': 'EC Saw',
  'taung@ioioleo.com': 'T. Aung',
  'prakash@ioioleo.com': 'Prakash',
  'kllit@ioioleo.com': 'Ravi, Qayyim, Kelly',
  'itklsupport@ioileo.com': 'Ravi, Qayyim, Kelly',
  'ravimadhu@ioioleo.com': 'Ravi Madhu',
  'qayyim@ioioleo.com': 'Qayyim',
  'wstan@ioioleo.com': 'W. Stan',
  'annaooi@ioioleo.com': 'Anna Ooi',
  'tinakaran@ioioleo.com': 'Tina Karan',
};

/** Get a display name for a PIC email, falls back to the email itself. */
export function getITSSRPICDisplayName(email: string): string {
  return ITSSR_PIC_DISPLAY_NAMES[email.toLowerCase()] ?? email;
}
