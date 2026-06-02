import { useMemo } from 'react';
import { useUserRolesITList } from '@/generated/hooks/use-user-roles-it';
import { useUser } from '@/hooks/use-user';
import type { UserRolesIT } from '@/generated/models/user-roles-it-model';

export interface ApproverInfo {
  id: string;
  name: string;
  email: string;
  role: 'Approver' | 'HoD' | 'Manager' | 'ITAdmin' | 'SecurityOfficer' | 'ExecutiveDirector';
  department?: string;
  title?: string;
  site?: string;
  isActive?: boolean;
}

export interface ApprovalMatrixEntry {
  formCode: string;
  stage: string;
  approverRole: string;
  approverEmail: string;
  approverName: string;
  department?: string;
  site?: string;
  escalationDays?: number;
  isActive: boolean;
}

export interface SiteRoutingConfig {
  site: 'Johor' | 'Penang' | 'Prai';
  configKey: string;
  configValue: string;
  category: string;
  description?: string;
}

interface UseFormApproversResult {
  approvers: ApproverInfo[];
  hods: ApproverInfo[];
  managers: ApproverInfo[];
  itAdmins: ApproverInfo[];
  securityOfficers: ApproverInfo[];
  executiveDirectors: ApproverInfo[];
  allApprovers: ApproverInfo[];
  isLoading: boolean;
  error: Error | null;
  getApproverById: (id: string) => ApproverInfo | undefined;
  getApproversByRole: (role: ApproverInfo['role']) => ApproverInfo[];
  getApproversByDepartment: (department: string) => ApproverInfo[];
  getApproversBySite: (site: string) => ApproverInfo[];
}

interface UseApprovalMatrixResult {
  matrixEntries: ApprovalMatrixEntry[];
  getApproversForStage: (formCode: string, stage: string) => ApproverInfo[];
  getApproverChain: (formCode: string) => ApproverInfo[];
  getEscalationDays: (formCode: string, stage: string) => number;
  isLoading: boolean;
  error: Error | null;
}

interface UseSiteRoutingResult {
  johorRouting: SiteRoutingConfig[];
  penangRouting: SiteRoutingConfig[];
  getRoutingBySite: (site: 'Johor' | 'Penang') => SiteRoutingConfig[];
  getRoutingByCategory: (site: 'Johor' | 'Penang', category: string) => SiteRoutingConfig[];
  getConfigValue: (site: 'Johor' | 'Penang', configKey: string) => string | undefined;
  isLoading: boolean;
  error: Error | null;
}

interface UseUserRolePermissionsResult {
  userRoles: string[];
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;
  canApprove: (formCode: string, stage: string) => boolean;
  canView: (formCode: string) => boolean;
  canEdit: (formCode: string) => boolean;
  isITAdmin: boolean;
  isManager: boolean;
  isHoD: boolean;
  isSecurityOfficer: boolean;
  isExecutiveDirector: boolean;
  isLoading: boolean;
  error: Error | null;
}

// Fallback static data when SharePoint is unavailable
const STATIC_APPROVERS: ApproverInfo[] = [
  { id: 'approver-1', name: 'Sarah Johnson', email: 'sarah.johnson@ioi.com', role: 'Approver', title: 'IT Manager', department: 'IT' },
  { id: 'approver-2', name: 'David Chen', email: 'david.chen@ioi.com', role: 'Approver', title: 'IT Lead', department: 'IT' },
  { id: 'approver-3', name: 'Michelle Lee', email: 'michelle.lee@ioi.com', role: 'SecurityOfficer', title: 'Security Officer', department: 'Security' },
  { id: 'approver-4', name: 'Ahmad bin Ismail', email: 'ahmad.ismail@ioi.com', role: 'ITAdmin', title: 'IT Specialist', department: 'IT Support' },
  { id: 'approver-5', name: 'Tan Wei Ming', email: 'tan.weiming@ioi.com', role: 'ITAdmin', title: 'System Admin', department: 'Infrastructure' },
];

const STATIC_HODS: ApproverInfo[] = [
  { id: 'hod-1', name: 'Robert Williams', email: 'robert.williams@ioi.com', role: 'HoD', department: 'IT Operations' },
  { id: 'hod-2', name: 'Jennifer Brown', email: 'jennifer.brown@ioi.com', role: 'HoD', department: 'Infrastructure' },
  { id: 'hod-3', name: 'Michael Taylor', email: 'michael.taylor@ioi.com', role: 'HoD', department: 'Security' },
  { id: 'hod-4', name: 'Siti Nurhaliza', email: 'siti.nurhaliza@ioi.com', role: 'HoD', department: 'Human Resources' },
  { id: 'hod-5', name: 'Rajesh Kumar', email: 'rajesh.kumar@ioi.com', role: 'HoD', department: 'Production' },
];

const STATIC_MANAGERS: ApproverInfo[] = [
  { id: 'mgr-1', name: 'James Wilson', email: 'james.wilson@ioi.com', role: 'Manager', title: 'IT Director' },
  { id: 'mgr-2', name: 'Patricia Garcia', email: 'patricia.garcia@ioi.com', role: 'Manager', title: 'CIO' },
  { id: 'mgr-3', name: 'Thomas Anderson', email: 'thomas.anderson@ioi.com', role: 'Manager', title: 'VP Technology' },
  { id: 'mgr-4', name: 'Lee Mei Ling', email: 'lee.meiling@ioi.com', role: 'Manager', title: 'General Manager' },
];

const STATIC_EXECUTIVE_DIRECTORS: ApproverInfo[] = [
  { id: 'ed-1', name: "Dato' Lee Yeow Chor", email: 'lee.yeowchor@ioi.com', role: 'ExecutiveDirector', title: 'Executive Director' },
  { id: 'ed-2', name: "Dato' Lee Yeow Seng", email: 'lee.yeowseng@ioi.com', role: 'ExecutiveDirector', title: 'Executive Director' },
];

// Note: ConfigApproverMatrix is not available - using static data

/**
 * Hook to get approvers - uses static data since Config_ApproverMatrix is not available
 */
export function useFormApprovers(_formCode?: string): UseFormApproversResult {
  const allApprovers = useMemo(() => {
    // Using static data since ConfigApproverMatrix is not available
    return [...STATIC_APPROVERS, ...STATIC_HODS, ...STATIC_MANAGERS, ...STATIC_EXECUTIVE_DIRECTORS];
  }, []);

  const approvers = useMemo(() => allApprovers.filter((a: ApproverInfo) => a.role === 'Approver'), [allApprovers]);
  const hods = useMemo(() => allApprovers.filter((a: ApproverInfo) => a.role === 'HoD'), [allApprovers]);
  const managers = useMemo(() => allApprovers.filter((a: ApproverInfo) => a.role === 'Manager'), [allApprovers]);
  const itAdmins = useMemo(() => allApprovers.filter((a: ApproverInfo) => a.role === 'ITAdmin'), [allApprovers]);
  const securityOfficers = useMemo(() => allApprovers.filter((a: ApproverInfo) => a.role === 'SecurityOfficer'), [allApprovers]);
  const executiveDirectors = useMemo(() => allApprovers.filter((a: ApproverInfo) => a.role === 'ExecutiveDirector'), [allApprovers]);

  const getApproverById = (id: string): ApproverInfo | undefined => {
    return allApprovers.find((a: ApproverInfo) => a.id === id);
  };

  const getApproversByRole = (role: ApproverInfo['role']): ApproverInfo[] => {
    return allApprovers.filter((a: ApproverInfo) => a.role === role);
  };

  const getApproversByDepartment = (department: string): ApproverInfo[] => {
    return allApprovers.filter((a: ApproverInfo) => 
      a.department?.toLowerCase().includes(department.toLowerCase())
    );
  };

  const getApproversBySite = (site: string): ApproverInfo[] => {
    return allApprovers.filter((a: ApproverInfo) => 
      a.site?.toLowerCase() === site.toLowerCase()
    );
  };

  return {
    approvers,
    hods,
    managers,
    itAdmins,
    securityOfficers,
    executiveDirectors,
    allApprovers,
    isLoading: false,
    error: null,
    getApproverById,
    getApproversByRole,
    getApproversByDepartment,
    getApproversBySite,
  };
}

/**
 * Hook to get approval matrix configuration for forms
 * Note: Using static data since ConfigApproverMatrix is not available
 */
export function useApprovalMatrix(_formCode: string): UseApprovalMatrixResult {
  const { allApprovers } = useFormApprovers();

  const matrixEntries = useMemo((): ApprovalMatrixEntry[] => {
    // No matrix data available - return empty array
    return [];
  }, []);

  const getApproversForStage = (_code: string, _stage: string): ApproverInfo[] => {
    // No matrix data available - return all approvers as fallback
    return allApprovers;
  };

  const getApproverChain = (_code: string): ApproverInfo[] => {
    // No matrix data available - return all approvers as fallback
    return allApprovers;
  };

  const getEscalationDays = (_code: string, _stage: string): number => {
    return 3; // Default escalation days
  };

  return {
    matrixEntries,
    getApproversForStage,
    getApproverChain,
    getEscalationDays,
    isLoading: false,
    error: null,
  };
}

/**
 * Hook for site-based hardware routing configuration
 * Note: Using empty arrays since routing hooks are not available
 */
export function useSiteRouting(): UseSiteRoutingResult {
  const johorRouting: SiteRoutingConfig[] = [];
  const penangRouting: SiteRoutingConfig[] = [];

  const getRoutingBySite = (site: 'Johor' | 'Penang'): SiteRoutingConfig[] => {
    return site === 'Johor' ? johorRouting : penangRouting;
  };

  const getRoutingByCategory = (site: 'Johor' | 'Penang', category: string): SiteRoutingConfig[] => {
    const routing = getRoutingBySite(site);
    return routing.filter((r: SiteRoutingConfig) => r.category.toLowerCase() === category.toLowerCase());
  };

  const getConfigValue = (site: 'Johor' | 'Penang', configKey: string): string | undefined => {
    const routing = getRoutingBySite(site);
    return routing.find((r: SiteRoutingConfig) => r.configKey === configKey)?.configValue;
  };

  return {
    johorRouting,
    penangRouting,
    getRoutingBySite,
    getRoutingByCategory,
    getConfigValue,
    isLoading: false,
    error: null,
  };
}

/**
 * Hook for user role-based permissions
 */
export function useUserRolePermissions(): UseUserRolePermissionsResult {
  const { data: user } = useUser();
  const userEmail = user?.userPrincipalName || '';
  
  // Filter roles by email using useUserRolesITList
  const { data: allRolesData, isLoading, error } = useUserRolesITList();

  const userRoles = useMemo((): string[] => {
    const allRoles = allRolesData as UserRolesIT[] | undefined;
    if (!allRoles || !userEmail) return [];

    return allRoles
      .filter((r: UserRolesIT) => r.userEmail?.toLowerCase() === userEmail.toLowerCase() && r.isActive !== false)
      .map((r: UserRolesIT) => r.securityRole);
  }, [allRolesData, userEmail]);

  const hasRole = (role: string): boolean => {
    return userRoles.some((r: string) => r.toLowerCase() === role.toLowerCase());
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some((role: string) => hasRole(role));
  };

  const hasAllRoles = (roles: string[]): boolean => {
    return roles.every((role: string) => hasRole(role));
  };

  // Permission matrix for form operations
  const APPROVAL_PERMISSIONS: Record<string, Record<string, string[]>> = {
    'EAF': { 'S1': ['Requester'], 'S2': ['HoD', 'Manager'], 'S3': ['ExecutiveDirector', 'Manager'] },
    'NIR': { 'S1': ['Requester'], 'S2': ['HoD'], 'S3': ['ITAdmin', 'NotesAdmin'], 'S4': ['ITAdmin'] },
    'RS': { 'S1': ['Requester'], 'S2': ['ITAdmin'], 'S3': ['ExecutiveDirector'], 'S4': ['ITAdmin'] },
    'SFAR': { 'Draft': ['Requester'], 'Review': ['HoD', 'FolderOwner'], 'Approve': ['ITAdmin'] },
    'UR': { 'Draft': ['Requester'], 'Review': ['Manager', 'ITAdmin'], 'Approve': ['ITAdmin'] },
  };

  const canApprove = (formCode: string, stage: string): boolean => {
    const allowedRoles = APPROVAL_PERMISSIONS[formCode]?.[stage] || [];
    return hasAnyRole(allowedRoles) || hasAnyRole(['Admin', 'SuperAdmin']);
  };

  const canView = (_formCode: string): boolean => {
    return userRoles.length > 0 || true;
  };

  const canEdit = (formCode: string): boolean => {
    return canApprove(formCode, 'S1') || hasAnyRole(['Admin', 'SuperAdmin', 'ITAdmin']);
  };

  return {
    userRoles,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    canApprove,
    canView,
    canEdit,
    isITAdmin: hasAnyRole(['ITAdmin', 'IT Admin', 'Admin']),
    isManager: hasAnyRole(['Manager', 'IT Manager']),
    isHoD: hasAnyRole(['HoD', 'HOD', 'Head of Department']),
    isSecurityOfficer: hasAnyRole(['SecurityOfficer', 'Security Officer']),
    isExecutiveDirector: hasAnyRole(['ExecutiveDirector', 'Executive Director', 'ED']),
    isLoading,
    error: error as Error | null,
  };
}

/**
 * Get approver details by ID
 */
export function useApproverById(approverId: string) {
  const { allApprovers } = useFormApprovers();
  
  const approver = useMemo(() => {
    return allApprovers.find((a: ApproverInfo) => a.id === approverId);
  }, [allApprovers, approverId]);
  
  return { approver, isLoading: false, error: null };
}

// Export static lists for direct use in components
export { STATIC_APPROVERS as FALLBACK_APPROVERS, STATIC_HODS as FALLBACK_HODS, STATIC_MANAGERS as FALLBACK_MANAGERS };