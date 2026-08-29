import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ConfigEmployeeDirectoryService } from '@/generated/services/config-employee-directory-service';
import type { ConfigEmployeeDirectory } from '@/generated/models/config-employee-directory-model';

export interface EmployeeRecord {
  id: string | number;
  fullName: string;
  email: string;
  employeeId?: string;
  department?: string;
  designation?: string;
  company?: string;
  location?: string;
  phone?: string;
  extension?: string;
  manager?: string;
  status?: string;
  isActive?: boolean;
}

/**
 * Derive a display name from an email address.
 * e.g. "mohdhafizfarid@ioioleo.com" → "Mohd Hafiz Farid"
 *      "cindychew@ioioleo.com"      → "Cindy Chew"
 */
function nameFromEmail(email: string): string {
  const namePart = email.split('@')[0];
  if (!namePart) return email;
  // Handle known formats: fullname, first.last, first_last
  const parts = namePart
    .replace(/[._-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  return parts
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Real IOI Oleo employee directory — used as fallback when SharePoint
 * employee directory is unavailable (e.g. local dev, connector down).
 * Source: actual employee emails provided by IOI IT team.
 */
const FALLBACK_EMPLOYEES: EmployeeRecord[] = [
  // Sorted alphabetically by email
  { id: 1,   fullName: 'Acco',                    email: 'acco@ioioleo.com',               company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 2,   fullName: 'Ahsha',                   email: 'ahsha@ioioleo.com',              company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 3,   fullName: 'Ali Migration',           email: 'alimigration@ioioi.onmicrosoft.com', company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 4,   fullName: 'Atiqah Ahmad',            email: 'atiqahahmad@ioioleo.com',        company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 5,   fullName: 'Btt Tan',                 email: 'bttan@ioioleo.com',              company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 6,   fullName: 'Cf Surayni',              email: 'cfsurayni@ioioleo.com',          company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 7,   fullName: 'Cindy Chew',              email: 'cindychew@ioioleo.com',          company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 8,   fullName: 'Ck Chai',                 email: 'ckchai@ioioleo.com',             company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 9,   fullName: 'Cok Hirul',               email: 'cokhirul@ioioleo.com',           company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 10,  fullName: 'Csteoh',                  email: 'csteoh@ioioleo.com',             company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 11,  fullName: 'Cw Lim',                  email: 'cwlim@ioioleo.com',              company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 12,  fullName: 'Dewi Chai',               email: 'dewichai@ioioleo.com',           company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 13,  fullName: 'Dominic Chow',             email: 'dominicchow@ioioleo.com',        company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 14,  fullName: 'Evelyn Tan',               email: 'evelyntan@ioioleo.com',          company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 15,  fullName: 'Ginny',                   email: 'ginny@ioioleo.com',              company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 16,  fullName: 'Irin',                    email: 'irin@ioioleo.com',               company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 17,  fullName: 'Kelly',                   email: 'kelly@ioioleo.com',              company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 18,  fullName: 'Lim Jl',                  email: 'limjl@ioioleo.com',              company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 19,  fullName: 'Malani Hr',               email: 'malanihr@ioioleo.com',           company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 20,  fullName: 'Mm Teh',                  email: 'mmteh@ioioleo.com',              company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 21,  fullName: 'Mohd Hafiz',              email: 'mohdhafiz@ioioleo.com',          company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 22,  fullName: 'Mohd Hafiz Farid',        email: 'mohdhafizfarid@ioioleo.com',     company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 23,  fullName: 'Mugunthen',               email: 'mugunthen@ioioleo.com',          company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 24,  fullName: 'Muhd Amirudin',           email: 'muhdamirudin@ioioleo.com',       company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 25,  fullName: 'Murelitheran',            email: 'murelitheran@ioioleo.com',       company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 26,  fullName: 'Naufal',                  email: 'naufal@ioioleo.com',             company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 27,  fullName: 'Nuranis',                 email: 'nuranis@ioioleo.com',            company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 28,  fullName: 'Nurhanim',                email: 'nurhanim@ioioleo.com',           company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 29,  fullName: 'Nurshida',                email: 'nurshida@ioioleo.com',           company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 30,  fullName: 'Nursyifaa',               email: 'nursyifaa@ioioleo.com',          company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 31,  fullName: 'Pin Huey Wong',           email: 'pinhueywong@ioioleo.com',        company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 32,  fullName: 'Qayyim',                  email: 'qayyim@ioioleo.com',             company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 33,  fullName: 'Ravi Madhu',              email: 'ravimadhu@ioioleo.com',          company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 34,  fullName: 'Ravindran',               email: 'ravindran@ioioleo.com',          company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 35,  fullName: 'Renugadevi',              email: 'renugadevi@ioioleo.com',         company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 36,  fullName: 'Romlianawati',            email: 'romlianawati@ioioleo.com',       company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 37,  fullName: 'Rosli',                   email: 'rosli@ioioleo.com',              company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 38,  fullName: 'Roziah',                  email: 'roziah@ioioleo.com',             company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 39,  fullName: 'Ry Mok',                  email: 'rymok@ioioleo.com',              company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 40,  fullName: 'Saiful Abrar Khalil',     email: 'saifulabrarkhalil@ioioleo.com',  company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 41,  fullName: 'Sharma',                  email: 'sharma@ioioleo.com',             company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 42,  fullName: 'Spang',                   email: 'spang@ioioleo.com',              company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 43,  fullName: 'Sramesh',                 email: 'sramesh@ioioleo.com',            company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 44,  fullName: 'Stella',                  email: 'stella@ioioleo.com',             company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 45,  fullName: 'Store Staff 2',           email: 'storestaff2@ioioleo.com',        company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 46,  fullName: 'Subaqa',                  email: 'subaqa@ioioleo.com',             company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 47,  fullName: 'Suzanne',                 email: 'suzanne@ioioleo.com',            company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 48,  fullName: 'Tajuddin',                email: 'tajuddin@ioioleo.com',           company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 49,  fullName: 'Taung',                   email: 'taung@ioioleo.com',              company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 50,  fullName: 'Vijayakumar',             email: 'vijayakumar@ioioleo.com',        company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 51,  fullName: 'Wafli',                   email: 'wafli@ioioleo.com',              company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 52,  fullName: 'Wx Poon',                 email: 'wxpoon@ioioleo.com',             company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 53,  fullName: 'Yl Wong',                 email: 'ylwong@ioioleo.com',             company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 54,  fullName: 'Yp Tan',                  email: 'yptan@ioioleo.com',              company: 'IOI Oleo', status: 'Active', isActive: true },
  { id: 55,  fullName: 'Yuvaraj',                 email: 'yuvaraj@ioioleo.com',             company: 'IOI Oleo', status: 'Active', isActive: true },
];

/**
 * Check if an error is a Power Apps SDK connectivity error (local dev or connector down).
 * These errors mean we should fall back to mock data.
 */
function isConnectivityError(error: unknown): boolean {
  if (!error) return false;
  const msg = error instanceof Error ? error.message : String(error);
  const patterns = [
    'not initialized',
    'not available',
    'configuration',
    'Timed out',
    'network',
    'timeout',
    'ECONNRESET',
    'ETIMEDOUT',
    'Failed to fetch',
    'NetworkError',
    'load failed',
    'retrieveMultipleRecords',
  ];
  return patterns.some((p) => msg.toLowerCase().includes(p.toLowerCase()));
}

export function useEmployeeLookup(searchTerm: string = '', enabled: boolean = true) {
  const { data: queryResult, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['employee-directory-list'],
    queryFn: async () => {
      console.log('[EmployeeLookup] Fetching employee directory...');
      try {
        const result = await ConfigEmployeeDirectoryService.getAll({ top: 5000 });
        console.log('[EmployeeLookup] Got', result?.length, 'employees from SharePoint');
        return result;
      } catch (err) {
        console.warn('[EmployeeLookup] Failed to fetch from SharePoint:', err);
        throw err;
      }
    },
    staleTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 5000),
    enabled,
  });

  // Determine if we should use fallback
  const shouldUseFallback = useMemo(() => {
    // If we have data from SharePoint, use it
    if (queryResult && Array.isArray(queryResult) && queryResult.length > 0) return false;
    // Still loading — wait
    if (isLoading) return false;
    // Error or empty/no data — fallback to hardcoded list
    if (error) return true;
    if (!isLoading && (!queryResult || !Array.isArray(queryResult) || queryResult.length === 0)) return true;
    return false;
  }, [queryResult, isLoading, error]);

  const employees = useMemo<EmployeeRecord[]>(() => {
    // If SharePoint data is available, map it correctly
    if (queryResult && Array.isArray(queryResult) && queryResult.length > 0) {
      return queryResult.map((emp: ConfigEmployeeDirectory): EmployeeRecord => {
        // Actual SharePoint list columns:
        //   ConfigKey  → employee email
        //   Title      → employee full name
        //   Category   → company
        //   Description → department
        //   ConfigValue → legacy display name
        // NOTE: SDK returns raw SharePoint column names (PascalCase),
        // not the generated model's camelCase property names.
        const e = emp as any;
        const email = e.ConfigKey || e.configKey || '';
        const fullName = e.Title || e.title || e.ConfigValue || e.configValue || nameFromEmail(email);
        return {
          id: e.ID ?? e.id ?? 0,
          fullName,
          email,
          employeeId: String(e.ID ?? e.id ?? ''),
          department: e.Description || e.description || '',
          designation: '',
          company: e.Category || e.category || '',
          location: '',
          phone: '',
          extension: '',
          manager: '',
          status: 'Active',
          isActive: true,
        };
      });
    }

    // Fallback: use the hardcoded IOI employee list
    if (shouldUseFallback) {
      console.log('[EmployeeLookup] SharePoint unavailable, using fallback employee list');
      return FALLBACK_EMPLOYEES;
    }

    return [];
  }, [queryResult, shouldUseFallback]);

  const filteredEmployees = useMemo(() => {
    if (!enabled) return [];
    if (!searchTerm || searchTerm.length < 2) return [];

    const searchLower = searchTerm.toLowerCase().trim();

    return employees.filter((emp: EmployeeRecord) => {
      return (
        emp.fullName.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        (emp.company && emp.company.toLowerCase().includes(searchLower)) ||
        (emp.department && emp.department.toLowerCase().includes(searchLower)) ||
        (emp.designation && emp.designation.toLowerCase().includes(searchLower))
      );
    }).slice(0, 20);
  }, [employees, searchTerm, enabled]);

  return {
    employees: filteredEmployees,
    allEmployees: employees,
    isLoading,
    isFetching,
    error,
    refetch,
  };
}

export function useEmployeeByEmail(email: string) {
  const { allEmployees, isLoading } = useEmployeeLookup('', true);

  const employee = useMemo(() => {
    if (!email || !allEmployees.length) return null;
    const emailLower = email.toLowerCase();
    return allEmployees.find(
      (emp: EmployeeRecord) =>
        emp.email.toLowerCase() === emailLower ||
        emp.employeeId === email
    ) || null;
  }, [email, allEmployees]);

  return { employee, isLoading };
}

export function useEmployeesByEmails(emails: string[]) {
  const { allEmployees, isLoading } = useEmployeeLookup('', true);

  const employees = useMemo(() => {
    if (!emails.length || !allEmployees.length) return [];
    const emailsLower = emails.map((e: string) => e.toLowerCase());
    return allEmployees.filter(
      (emp: EmployeeRecord) => emailsLower.includes(emp.email.toLowerCase())
    );
  }, [emails, allEmployees]);

  return { employees, isLoading };
}
