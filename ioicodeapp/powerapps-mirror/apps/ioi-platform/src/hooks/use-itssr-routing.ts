/**
 * useITSSRRouting - IT Team Routing Logic Hook
 * 
 * Determines which IT team should handle a request based on:
 * - Service type (Hardware vs Software)
 * - Requestor's location/site (Prai/Penang vs Johor)
 * - Requestor's organisational unit (OU)
 * 
 * Maps to Lotus Domino hidden fields: Team, HWP, HWJ, ALLHW, ALLSW
 */

import { useMemo } from 'react';
import type { ITSSRServiceType } from '@/types/m2-itssr-types';
import {
  type ITSSRTeam,
  type ITSSRSite,
  type ITSSRRoutingGroup,
  ITSSR_ROUTING_GROUPS,
  HARDWARE_SERVICE_TYPES,
  SOFTWARE_SERVICE_TYPES,
} from '@/types/m2-itssr-workflow';
import {
  getITSSRPIC,
  getITSSRPICDisplayName,
  type ITSSRRoutingLocation,
} from '@/config/itssr-pic-routing';

// =============================================================================
// TYPES
// =============================================================================

export interface UseITSSRRoutingOptions {
  /** The service type selected by the requestor */
  serviceType?: ITSSRServiceType;
  /** The requestor's site/location */
  site?: ITSSRSite;
  /** The requestor's organisational unit (for additional routing logic) */
  organizationalUnit?: string;
  /** The requestor's department */
  department?: string;
  /** Selected software/application when service type is Software */
  application?: string;
}

export interface ITSSRRoutingResult {
  /** Determined IT team (HW or SW) */
  team: ITSSRTeam | null;
  /** Team label for display */
  teamLabel: string;
  /** Primary routing group */
  primaryGroup: ITSSRRoutingGroup | null;
  /** Fallback routing group (all team members) */
  fallbackGroup: ITSSRRoutingGroup | null;
  /** All applicable mailing lists */
  mailingLists: string[];
  /** Primary routed PIC email from the ITSSR PIC matrix */
  primaryPICEmail: string;
  /** Primary routed PIC display name */
  primaryPICName: string;
  /** Secondary routed PIC email, when configured */
  secondaryPICEmail?: string;
  /** Secondary routed PIC display name, when configured */
  secondaryPICName?: string;
  /** PIC routing description */
  picDescription: string;
  /** Whether routing could be determined */
  isRoutingDetermined: boolean;
  /** Routing explanation for display */
  routingExplanation: string;
}

// =============================================================================
// ROUTING CONSTANTS
// =============================================================================

/**
 * Department to site mapping (for automatic site detection)
 */
const DEPARTMENT_SITE_MAP: Record<string, ITSSRSite> = {
  // Prai (Penang) departments
  'Accounting': 'Prai',
  'Administration': 'Prai',
  'Finance': 'Prai',
  'Human Resources': 'Prai',
  'Information Technology': 'Prai',
  'Legal': 'Prai',
  'Marketing': 'Prai',
  'Procurement': 'Prai',
  'Research & Development': 'Prai',
  'Sales': 'Prai',
  // Johor departments
  'Engineering': 'Johor',
  'Logistics': 'Johor',
  'Operations': 'Johor',
  'Production': 'Johor',
  'Quality Assurance': 'Johor',
  'Supply Chain': 'Johor',
};

/**
 * OU patterns for site detection
 */
const OU_SITE_PATTERNS: Array<{ pattern: RegExp; site: ITSSRSite }> = [
  { pattern: /prai|penang|png|pgn/i, site: 'Prai' },
  { pattern: /johor|jhr|jhb/i, site: 'Johor' },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Determine IT team based on service type
 */
function determineTeam(serviceType?: ITSSRServiceType): ITSSRTeam | null {
  if (!serviceType) return null;
  
  if ((HARDWARE_SERVICE_TYPES as readonly string[]).includes(serviceType)) {
    return 'HW';
  }
  if ((SOFTWARE_SERVICE_TYPES as readonly string[]).includes(serviceType)) {
    return 'SW';
  }
  return null;
}

/**
 * Detect site from OU string
 */
function detectSiteFromOU(ou?: string): ITSSRSite | null {
  if (!ou) return null;
  
  for (const { pattern, site } of OU_SITE_PATTERNS) {
    if (pattern.test(ou)) {
      return site;
    }
  }
  return null;
}

/**
 * Detect site from department
 */
function detectSiteFromDepartment(department?: string): ITSSRSite | null {
  if (!department) return null;
  return DEPARTMENT_SITE_MAP[department] ?? null;
}

function toPICLocation(site?: ITSSRSite | null): ITSSRRoutingLocation | undefined {
  if (site === 'Prai') return 'PENANG';
  if (site === 'Johor') return 'JOHOR';
  return undefined;
}

/**
 * Get routing group by team and site
 */
function getRoutingGroup(team: ITSSRTeam, site?: ITSSRSite): ITSSRRoutingGroup | null {
  // For hardware team, try to get site-specific group
  if (team === 'HW' && site) {
    const siteGroup = ITSSR_ROUTING_GROUPS.find(
      (g: ITSSRRoutingGroup) => g.team === team && g.site === site
    );
    if (siteGroup) return siteGroup;
  }
  
  // Fallback to all-team group
  return ITSSR_ROUTING_GROUPS.find(
    (g: ITSSRRoutingGroup) => g.team === team && !g.site
  ) ?? null;
}

/**
 * Get fallback routing group (all team members)
 */
function getFallbackGroup(team: ITSSRTeam): ITSSRRoutingGroup | null {
  if (team === 'HW') {
    return ITSSR_ROUTING_GROUPS.find((g: ITSSRRoutingGroup) => g.id === 'allhw') ?? null;
  }
  if (team === 'SW') {
    return ITSSR_ROUTING_GROUPS.find((g: ITSSRRoutingGroup) => g.id === 'allsw') ?? null;
  }
  return null;
}

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

export function useITSSRRouting(options: UseITSSRRoutingOptions): ITSSRRoutingResult {
  const { serviceType, site, organizationalUnit, department, application } = options;

  return useMemo(() => {
    // Step 1: Determine team from service type
    const team = determineTeam(serviceType);
    
    if (!team) {
      return {
        team: null,
        teamLabel: 'Not Determined',
        primaryGroup: null,
        fallbackGroup: null,
        mailingLists: [],
        primaryPICEmail: '',
        primaryPICName: '',
        secondaryPICEmail: undefined,
        secondaryPICName: undefined,
        picDescription: '',
        isRoutingDetermined: false,
        routingExplanation: 'Service type required to determine routing',
      };
    }

    // Step 2: Determine site (explicit > OU > department)
    const detectedSite = site 
      ?? detectSiteFromOU(organizationalUnit) 
      ?? detectSiteFromDepartment(department);
    const pic = getITSSRPIC(serviceType, application, toPICLocation(detectedSite));
    const primaryPICEmail = pic?.primaryPIC || '';
    const secondaryPICEmail = pic?.secondaryPIC;

    // Step 3: Get routing groups
    const primaryGroup = getRoutingGroup(team, detectedSite ?? undefined);
    const fallbackGroup = getFallbackGroup(team);

    // Step 4: Build mailing lists
    const mailingLists: string[] = [];
    if (primaryGroup) {
      mailingLists.push(primaryGroup.dominoField);
    }
    if (fallbackGroup && fallbackGroup.id !== primaryGroup?.id) {
      mailingLists.push(fallbackGroup.dominoField);
    }

    // Step 5: Generate explanation
    let routingExplanation = '';
    if (team === 'HW') {
      if (detectedSite === 'Prai') {
        routingExplanation = 'Routed to Hardware Team (Penang/Prai)';  
      } else if (detectedSite === 'Johor') {
        routingExplanation = 'Routed to Hardware Team (Johor)';
      } else {
        routingExplanation = 'Routed to Hardware Team (all locations)';
      }
    } else {
      routingExplanation = 'Routed to Software Team';
    }

    return {
      team,
      teamLabel: team === 'HW' ? 'Hardware Team' : 'Software Team',
      primaryGroup,
      fallbackGroup,
      mailingLists,
      primaryPICEmail,
      primaryPICName: primaryPICEmail ? getITSSRPICDisplayName(primaryPICEmail) : '',
      secondaryPICEmail,
      secondaryPICName: secondaryPICEmail ? getITSSRPICDisplayName(secondaryPICEmail) : undefined,
      picDescription: pic?.description || '',
      isRoutingDetermined: true,
      routingExplanation,
    };
  }, [serviceType, site, organizationalUnit, department, application]);
}

// =============================================================================
// UTILITY FUNCTIONS (for use outside React components)
// =============================================================================

/**
 * Determine routing synchronously (for use in form submission handlers)
 */
export function determineITSSRRouting(options: UseITSSRRoutingOptions): ITSSRRoutingResult {
  const { serviceType, site, organizationalUnit, department, application } = options;
  
  const team = determineTeam(serviceType);
  
  if (!team) {
    return {
      team: null,
      teamLabel: 'Not Determined',
      primaryGroup: null,
      fallbackGroup: null,
      mailingLists: [],
      primaryPICEmail: '',
      primaryPICName: '',
      secondaryPICEmail: undefined,
      secondaryPICName: undefined,
      picDescription: '',
      isRoutingDetermined: false,
      routingExplanation: 'Service type required to determine routing',
    };
  }

  const detectedSite = site 
    ?? detectSiteFromOU(organizationalUnit) 
    ?? detectSiteFromDepartment(department);
  const pic = getITSSRPIC(serviceType, application, toPICLocation(detectedSite));
  const primaryPICEmail = pic?.primaryPIC || '';
  const secondaryPICEmail = pic?.secondaryPIC;

  const primaryGroup = getRoutingGroup(team, detectedSite ?? undefined);
  const fallbackGroup = getFallbackGroup(team);

  const mailingLists: string[] = [];
  if (primaryGroup) {
    mailingLists.push(primaryGroup.dominoField);
  }
  if (fallbackGroup && fallbackGroup.id !== primaryGroup?.id) {
    mailingLists.push(fallbackGroup.dominoField);
  }

  let routingExplanation = '';
  if (team === 'HW') {
    if (detectedSite === 'Prai') {
      routingExplanation = 'Routed to Hardware Team (Penang/Prai)';  
    } else if (detectedSite === 'Johor') {
      routingExplanation = 'Routed to Hardware Team (Johor)';
    } else {
      routingExplanation = 'Routed to Hardware Team (all locations)';
    }
  } else {
    routingExplanation = 'Routed to Software Team';
  }

  return {
    team,
    teamLabel: team === 'HW' ? 'Hardware Team' : 'Software Team',
    primaryGroup,
    fallbackGroup,
    mailingLists,
    primaryPICEmail,
    primaryPICName: primaryPICEmail ? getITSSRPICDisplayName(primaryPICEmail) : '',
    secondaryPICEmail,
    secondaryPICName: secondaryPICEmail ? getITSSRPICDisplayName(secondaryPICEmail) : undefined,
    picDescription: pic?.description || '',
    isRoutingDetermined: true,
    routingExplanation,
  };
}

/**
 * Get all routing groups for a specific team
 */
export function getRoutingGroupsForTeam(team: ITSSRTeam): ITSSRRoutingGroup[] {
  return ITSSR_ROUTING_GROUPS.filter((g: ITSSRRoutingGroup) => g.team === team);
}

/**
 * Get routing group by Domino field name
 */
export function getRoutingGroupByField(dominoField: string): ITSSRRoutingGroup | undefined {
  return ITSSR_ROUTING_GROUPS.find((g: ITSSRRoutingGroup) => g.dominoField === dominoField);
}
