/**
 * SharePoint Config Hooks
 * 
 * Custom hooks that wrap the generated SharePoint hooks for use in form dropdowns.
 * These provide a cleaner interface with loading states and error handling.
 */

import { useConfigCompaniesList } from '@/generated/hooks/use-config-companies';
import { useConfigDepartmentsList } from '@/generated/hooks/use-config-departments';
import { useITM1RSBanksList } from '@/generated/hooks/use-itm1rsbanks';
import { useITM1RSSystemsListList } from '@/generated/hooks/use-itm1rssystems-list';
import { useITM1RSSAPClientList } from '@/generated/hooks/use-itm1rssapclient';
import { useITM1SFARServersList } from '@/generated/hooks/use-itm1sfarservers';
import { useMemo } from 'react';

/**
 * Company dropdown option type
 */
export interface CompanyOption {
  code: string;
  name: string;
}

/**
 * Department dropdown option type
 */
export interface DepartmentOption {
  code: string;
  name: string;
}

/**
 * Hook for fetching companies from SharePoint Config_Companies list
 * Use this in all forms that need a company dropdown
 */
export function useSharePointCompanies() {
  const { data, isLoading, error } = useConfigCompaniesList();

  const companies = useMemo(() => {
    if (!data) return [];
    return data
      .filter((item) => item.title) // Filter out items without title
      .map((item) => ({
        code: item.title || '',
        name: item.title || '',
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  return {
    companies,
    isLoading,
    error,
    // Helper to get company names array for simple selects
    companyNames: companies.map((c) => c.name),
  };
}

/**
 * Hook for fetching departments from SharePoint Config_Departments list
 * Use this in all forms that need a department dropdown
 */
export function useSharePointDepartments() {
  const { data, isLoading, error } = useConfigDepartmentsList();

  const departments = useMemo(() => {
    if (!data) return [];
    return data
      .filter((item) => item.title)
      .map((item) => ({
        code: item.title || '',
        name: item.title || '',
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  return {
    departments,
    isLoading,
    error,
    departmentNames: departments.map((d) => d.name),
  };
}

/**
 * Hook for fetching banks from SharePoint IT_M1_RS_Banks list
 * Use this in Reset Password form
 */
export function useSharePointBanks() {
  const { data, isLoading, error } = useITM1RSBanksList();

  const banks = useMemo(() => {
    if (!data) return [];
    return data
      .filter((item) => item.title)
      .map((item) => item.title || '')
      .sort();
  }, [data]);

  return {
    banks,
    isLoading,
    error,
  };
}

/**
 * Hook for fetching systems/applications from SharePoint IT_M1_RS_SystemsList
 * Use this in Reset Password form
 */
export function useSharePointSystems() {
  const { data, isLoading, error } = useITM1RSSystemsListList();

  const systems = useMemo(() => {
    if (!data) return [];
    return data
      .filter((item) => item.title)
      .map((item) => ({
        code: item.title || '',
        name: item.title || '',
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  return {
    systems,
    isLoading,
    error,
    systemNames: systems.map((s) => s.name),
  };
}

/**
 * Hook for fetching SAP clients from SharePoint IT_M1_RS_SAP_Client list
 * Use this in Reset Password form when SAP S4/HANA is selected
 */
export function useSharePointSAPClients() {
  const { data, isLoading, error } = useITM1RSSAPClientList();

  const sapClients = useMemo(() => {
    if (!data) return [];
    return data
      .filter((item) => item.title)
      .map((item) => ({
        code: item.title || '',
        name: item.title || '',
      }));
  }, [data]);

  return {
    sapClients,
    isLoading,
    error,
    sapClientNames: sapClients.map((c) => c.name),
  };
}

/**
 * Hook for fetching servers from SharePoint IT_M1_SFAR_Servers list
 * Use this in Share Folder Access Request form
 */
export function useSharePointServers() {
  const { data, isLoading, error } = useITM1SFARServersList();

  const servers = useMemo(() => {
    if (!data) return [];
    return data
      .filter((item) => item.title)
      .map((item) => ({
        code: item.title || '',
        name: item.title || '',
        // IOIPCNSHARE requires IT verification
        requiresITVerification: item.title === 'IOIPCNSHARE',
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  return {
    servers,
    isLoading,
    error,
    serverNames: servers.map((s) => s.name),
  };
}