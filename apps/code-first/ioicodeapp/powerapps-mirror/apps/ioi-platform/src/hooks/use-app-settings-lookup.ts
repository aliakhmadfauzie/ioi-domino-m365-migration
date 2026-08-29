/**
 * App Settings Lookup Hook
 * 
 * DEC-004 Compliance: All emails, routing, and escalation recipients
 * must come from Config_AppSettings - no hard-coded emails.
 * 
 * This hook fetches environment-specific configuration values from
 * the AppSettings SharePoint list.
 */

import { useMemo } from 'react';
import { useAppSettingsList } from '@/generated/hooks/use-app-settings';
import type { AppSettings } from '@/generated/models/app-settings-model';

// Setting key constants for type-safe lookups
export const APP_SETTING_KEYS = {
  // IT Routing
  IT_ADMIN_EMAIL: 'IT_Admin_Email',
  IT_ADMIN_GROUP: 'IT_Admin_Group',
  IT_DEFAULT_MAILING_LIST: 'IT_Default_Mailing_List',
  IT_ALL_READERS: 'IT_All_Readers',
  
  // Site-based IT Teams
  IT_PENANG_TEAM: 'IT_Penang_Team',
  IT_JOHOR_TEAM: 'IT_Johor_Team',
  IT_PRAI_TEAM: 'IT_Prai_Team',
  IT_PASIR_GUDANG_TEAM: 'IT_Pasir_Gudang_Team',
  
  // Function-based IT Teams
  IT_HARDWARE_TEAM: 'IT_Hardware_Team',
  IT_SOFTWARE_TEAM: 'IT_Software_Team',
  IT_NETWORK_TEAM: 'IT_Network_Team',
  IT_SAP_TEAM: 'IT_SAP_Team',
  IT_BASIS_TEAM: 'IT_Basis_Team',
  
  // SAP-specific
  SAP_ADMIN_EMAIL: 'SAP_Admin_Email',
  SAP_FUNCTIONAL_LEADS: 'SAP_Functional_Leads',
  SAP_BPO_DEFAULT: 'SAP_BPO_Default',
  SAP_ESCALATION_EMAIL: 'SAP_Escalation_Email',
  
  // Escalation
  ESCALATION_TIMEOUT_HOURS: 'Escalation_Timeout_Hours',
  ESCALATION_EMAIL_GROUP: 'Escalation_Email_Group',
  
  // Notification Templates
  NOTIFY_SUBMISSION_TEMPLATE: 'Notify_Submission_Template',
  NOTIFY_APPROVAL_TEMPLATE: 'Notify_Approval_Template',
  NOTIFY_REJECTION_TEMPLATE: 'Notify_Rejection_Template',
  NOTIFY_CLOSURE_TEMPLATE: 'Notify_Closure_Template',
} as const;

export type AppSettingKey = typeof APP_SETTING_KEYS[keyof typeof APP_SETTING_KEYS];

/**
 * Hook to lookup a specific setting value by key
 */
export function useAppSettingValue(settingKey: AppSettingKey) {
  const { data: settings, isLoading, error } = useAppSettingsList();
  
  const value = useMemo(() => {
    if (!settings || !Array.isArray(settings)) return null;
    const setting = settings.find((s: AppSettings) => s.settingKey === settingKey);
    return setting?.settingValue || null;
  }, [settings, settingKey]);
  
  return { value, isLoading, error };
}

/**
 * Hook to lookup multiple setting values at once
 */
export function useAppSettingValues(settingKeys: AppSettingKey[]) {
  const { data: settings, isLoading, error } = useAppSettingsList();
  
  const values = useMemo(() => {
    if (!settings || !Array.isArray(settings)) {
      return Object.fromEntries(settingKeys.map((key: AppSettingKey) => [key, null])) as Record<AppSettingKey, string | null>;
    }
    
    return Object.fromEntries(
      settingKeys.map((key: AppSettingKey) => {
        const setting = settings.find((s: AppSettings) => s.settingKey === key);
        return [key, setting?.settingValue || null];
      })
    ) as Record<AppSettingKey, string | null>;
  }, [settings, settingKeys]);
  
  return { values, isLoading, error };
}

/**
 * Hook to get IT routing emails based on site and service type
 */
export function useITRoutingEmails(site?: string, serviceType?: string) {
  const { data: settings, isLoading, error } = useAppSettingsList();
  
  const routingEmails = useMemo(() => {
    if (!settings || !Array.isArray(settings)) {
      return {
        primaryEmail: null,
        teamEmail: null,
        adminEmail: null,
        escalationEmail: null,
      };
    }
    
    const getSetting = (key: string): string | null => {
      const setting = settings.find((s: AppSettings) => s.settingKey === key);
      return setting?.settingValue || null;
    };
    
    // Determine site-based team
    let teamEmail: string | null = null;
    if (site) {
      const siteUpper = site.toUpperCase();
      if (siteUpper.includes('PENANG') || siteUpper.includes('PRAI')) {
        teamEmail = getSetting(APP_SETTING_KEYS.IT_PENANG_TEAM) || getSetting(APP_SETTING_KEYS.IT_PRAI_TEAM);
      } else if (siteUpper.includes('JOHOR') || siteUpper.includes('PASIR')) {
        teamEmail = getSetting(APP_SETTING_KEYS.IT_JOHOR_TEAM) || getSetting(APP_SETTING_KEYS.IT_PASIR_GUDANG_TEAM);
      }
    }
    
    // Determine function-based team
    let primaryEmail: string | null = null;
    if (serviceType) {
      const typeUpper = serviceType.toUpperCase();
      if (typeUpper.includes('HARDWARE')) {
        primaryEmail = getSetting(APP_SETTING_KEYS.IT_HARDWARE_TEAM);
      } else if (typeUpper.includes('SOFTWARE')) {
        primaryEmail = getSetting(APP_SETTING_KEYS.IT_SOFTWARE_TEAM);
      } else if (typeUpper.includes('NETWORK')) {
        primaryEmail = getSetting(APP_SETTING_KEYS.IT_NETWORK_TEAM);
      } else if (typeUpper.includes('SAP')) {
        primaryEmail = getSetting(APP_SETTING_KEYS.IT_SAP_TEAM);
      }
    }
    
    return {
      primaryEmail: primaryEmail || getSetting(APP_SETTING_KEYS.IT_DEFAULT_MAILING_LIST),
      teamEmail,
      adminEmail: getSetting(APP_SETTING_KEYS.IT_ADMIN_EMAIL),
      escalationEmail: getSetting(APP_SETTING_KEYS.ESCALATION_EMAIL_GROUP),
    };
  }, [settings, site, serviceType]);
  
  return { ...routingEmails, isLoading, error };
}

/**
 * Hook to get SAP-specific routing emails
 */
export function useSAPRoutingEmails() {
  const { data: settings, isLoading, error } = useAppSettingsList();
  
  const routingEmails = useMemo(() => {
    if (!settings || !Array.isArray(settings)) {
      return {
        sapAdminEmail: null,
        sapFunctionalLeads: null,
        sapBpoDefault: null,
        basisTeamEmail: null,
        escalationEmail: null,
      };
    }
    
    const getSetting = (key: string): string | null => {
      const setting = settings.find((s: AppSettings) => s.settingKey === key);
      return setting?.settingValue || null;
    };
    
    return {
      sapAdminEmail: getSetting(APP_SETTING_KEYS.SAP_ADMIN_EMAIL),
      sapFunctionalLeads: getSetting(APP_SETTING_KEYS.SAP_FUNCTIONAL_LEADS),
      sapBpoDefault: getSetting(APP_SETTING_KEYS.SAP_BPO_DEFAULT),
      basisTeamEmail: getSetting(APP_SETTING_KEYS.IT_BASIS_TEAM),
      escalationEmail: getSetting(APP_SETTING_KEYS.SAP_ESCALATION_EMAIL),
    };
  }, [settings]);
  
  return { ...routingEmails, isLoading, error };
}

/**
 * Hook to get escalation timeout in hours
 */
export function useEscalationTimeout() {
  const { value, isLoading, error } = useAppSettingValue(APP_SETTING_KEYS.ESCALATION_TIMEOUT_HOURS);
  
  const timeoutHours = useMemo(() => {
    if (!value) return 2; // Default 2 hours
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 2 : parsed;
  }, [value]);
  
  return { timeoutHours, isLoading, error };
}