/**
 * Live Approver Search Hook
 * 
 * Provides real-time user search via Microsoft Graph API.
 * Falls back to local approver matrix if Graph is unavailable.
 * 
 * Features:
 * - Debounced search to prevent excessive API calls
 * - Caching of recent results
 * - Fallback to static approver list
 * - Type-safe Graph API integration
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { ApproverInfo } from '@/hooks/use-approver-matrix';

// =============================================================================
// TYPES
// =============================================================================

export interface GraphUser {
  id: string;
  displayName: string;
  mail: string | null;
  userPrincipalName: string;
  jobTitle: string | null;
  department: string | null;
  officeLocation: string | null;
  mobilePhone: string | null;
  businessPhones: string[];
}

export interface GraphSearchResult {
  '@odata.context'?: string;
  value: GraphUser[];
}

export interface SearchOptions {
  top?: number;
  select?: string[];
  filter?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DEBOUNCE_MS = 300;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_RESULTS = 10;

const DEFAULT_SELECT_FIELDS = [
  'id',
  'displayName',
  'mail',
  'userPrincipalName',
  'jobTitle',
  'department',
  'officeLocation',
];

// =============================================================================
// GRAPH API SERVICE
// =============================================================================

class GraphAPIService {
  private static cache: Map<string, { data: GraphUser[]; timestamp: number }> = new Map();
  
  /**
   * Search users in Microsoft Graph
   * In production, this calls the actual Graph API via the Power Apps connector
   */
  static async searchUsers(
    query: string,
    options: SearchOptions = {}
  ): Promise<GraphUser[]> {
    const cacheKey = `search:${query}:${JSON.stringify(options)}`;
    
    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
    
    try {
      // In production, this would call the Graph API
      // const response = await graphClient
      //   .api('/users')
      //   .filter(`startswith(displayName,'${query}') or startswith(mail,'${query}')`)
      //   .select(options.select || DEFAULT_SELECT_FIELDS)
      //   .top(options.top || MAX_RESULTS)
      //   .get();
      
      // Mock implementation for demo
      const mockUsers = await this.getMockUsers(query);
      
      // Cache results
      this.cache.set(cacheKey, { data: mockUsers, timestamp: Date.now() });
      
      return mockUsers;
      
    } catch (error) {
      console.error('[GraphAPIService] Search failed:', error);
      return [];
    }
  }
  
  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<GraphUser | null> {
    const cacheKey = `user:${userId}`;
    
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data[0] || null;
    }
    
    try {
      // In production:
      // const user = await graphClient.api(`/users/${userId}`).get();
      
      // Mock implementation
      const mockUser = MOCK_USERS.find(u => u.id === userId);
      
      if (mockUser) {
        this.cache.set(cacheKey, { data: [mockUser], timestamp: Date.now() });
      }
      
      return mockUser || null;
      
    } catch (error) {
      console.error('[GraphAPIService] Get user failed:', error);
      return null;
    }
  }
  
  /**
   * Get user's manager
   */
  static async getUserManager(userId: string): Promise<GraphUser | null> {
    try {
      // In production:
      // const manager = await graphClient.api(`/users/${userId}/manager`).get();
      
      // Mock - return a random manager
      const managers = MOCK_USERS.filter(u => 
        u.jobTitle?.toLowerCase().includes('manager') ||
        u.jobTitle?.toLowerCase().includes('director') ||
        u.jobTitle?.toLowerCase().includes('head')
      );
      
      return managers[0] || null;
      
    } catch (error) {
      console.error('[GraphAPIService] Get manager failed:', error);
      return null;
    }
  }
  
  /**
   * Get direct reports
   */
  static async getDirectReports(userId: string): Promise<GraphUser[]> {
    try {
      // In production:
      // const reports = await graphClient.api(`/users/${userId}/directReports`).get();
      
      // Mock - return some users
      return MOCK_USERS.slice(0, 3);
      
    } catch (error) {
      console.error('[GraphAPIService] Get direct reports failed:', error);
      return [];
    }
  }
  
  /**
   * Mock user search for demo
   */
  private static async getMockUsers(query: string): Promise<GraphUser[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const lowerQuery = query.toLowerCase();
    return MOCK_USERS.filter(user => 
      user.displayName.toLowerCase().includes(lowerQuery) ||
      user.mail?.toLowerCase().includes(lowerQuery) ||
      user.department?.toLowerCase().includes(lowerQuery) ||
      user.jobTitle?.toLowerCase().includes(lowerQuery)
    ).slice(0, MAX_RESULTS);
  }
  
  /**
   * Clear cache
   */
  static clearCache(): void {
    this.cache.clear();
  }
}

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_USERS: GraphUser[] = [
  {
    id: 'user-001',
    displayName: 'Sarah Johnson',
    mail: 'sarah.johnson@ioi.com',
    userPrincipalName: 'sarah.johnson@ioi.com',
    jobTitle: 'IT Manager',
    department: 'Information Technology',
    officeLocation: 'Prai HQ',
    mobilePhone: '+60-12-345-6789',
    businessPhones: ['+60-4-123-4567'],
  },
  {
    id: 'user-002',
    displayName: 'David Chen',
    mail: 'david.chen@ioi.com',
    userPrincipalName: 'david.chen@ioi.com',
    jobTitle: 'IT Lead',
    department: 'Information Technology',
    officeLocation: 'Prai HQ',
    mobilePhone: '+60-12-456-7890',
    businessPhones: [],
  },
  {
    id: 'user-003',
    displayName: 'Michelle Lee',
    mail: 'michelle.lee@ioi.com',
    userPrincipalName: 'michelle.lee@ioi.com',
    jobTitle: 'Security Officer',
    department: 'Information Security',
    officeLocation: 'Prai HQ',
    mobilePhone: '+60-12-567-8901',
    businessPhones: [],
  },
  {
    id: 'user-004',
    displayName: 'Ahmad bin Ismail',
    mail: 'ahmad.ismail@ioi.com',
    userPrincipalName: 'ahmad.ismail@ioi.com',
    jobTitle: 'IT Manager',
    department: 'Information Technology',
    officeLocation: 'Johor Office',
    mobilePhone: '+60-12-678-9012',
    businessPhones: [],
  },
  {
    id: 'user-005',
    displayName: 'Robert Williams',
    mail: 'robert.williams@ioi.com',
    userPrincipalName: 'robert.williams@ioi.com',
    jobTitle: 'Head of IT Operations',
    department: 'IT Operations',
    officeLocation: 'Prai HQ',
    mobilePhone: '+60-12-789-0123',
    businessPhones: [],
  },
  {
    id: 'user-006',
    displayName: 'Jennifer Brown',
    mail: 'jennifer.brown@ioi.com',
    userPrincipalName: 'jennifer.brown@ioi.com',
    jobTitle: 'Head of Infrastructure',
    department: 'IT Infrastructure',
    officeLocation: 'Prai HQ',
    mobilePhone: '+60-12-890-1234',
    businessPhones: [],
  },
  {
    id: 'user-007',
    displayName: 'Tan Wei Ming',
    mail: 'tan.weiming@ioi.com',
    userPrincipalName: 'tan.weiming@ioi.com',
    jobTitle: 'System Administrator',
    department: 'IT Infrastructure',
    officeLocation: 'Prai HQ',
    mobilePhone: '+60-12-901-2345',
    businessPhones: [],
  },
  {
    id: 'user-008',
    displayName: 'Siti Nurhaliza',
    mail: 'siti.nurhaliza@ioi.com',
    userPrincipalName: 'siti.nurhaliza@ioi.com',
    jobTitle: 'HR Director',
    department: 'Human Resources',
    officeLocation: 'Prai HQ',
    mobilePhone: '+60-12-012-3456',
    businessPhones: [],
  },
  {
    id: 'user-009',
    displayName: 'James Wilson',
    mail: 'james.wilson@ioi.com',
    userPrincipalName: 'james.wilson@ioi.com',
    jobTitle: 'CIO',
    department: 'Executive',
    officeLocation: 'Prai HQ',
    mobilePhone: '+60-12-123-4567',
    businessPhones: [],
  },
  {
    id: 'user-010',
    displayName: 'Patricia Garcia',
    mail: 'patricia.garcia@ioi.com',
    userPrincipalName: 'patricia.garcia@ioi.com',
    jobTitle: 'General Manager',
    department: 'Executive',
    officeLocation: 'Prai HQ',
    mobilePhone: '+60-12-234-5678',
    businessPhones: [],
  },
  {
    id: 'user-011',
    displayName: 'Kevin Ng',
    mail: 'kevin.ng@ioi.com',
    userPrincipalName: 'kevin.ng@ioi.com',
    jobTitle: 'IT Support Specialist',
    department: 'IT Support',
    officeLocation: 'Prai HQ',
    mobilePhone: '+60-12-345-6780',
    businessPhones: [],
  },
  {
    id: 'user-012',
    displayName: 'Nurul Aina',
    mail: 'nurul.aina@ioi.com',
    userPrincipalName: 'nurul.aina@ioi.com',
    jobTitle: 'IT Support Specialist',
    department: 'IT Support',
    officeLocation: 'Johor Office',
    mobilePhone: '+60-12-456-7891',
    businessPhones: [],
  },
];

// =============================================================================
// CONVERSION HELPERS
// =============================================================================

/**
 * Convert Graph user to ApproverInfo format
 */
function graphUserToApproverInfo(user: GraphUser): ApproverInfo {
  // Determine role based on job title
  let role: ApproverInfo['role'] = 'Approver';
  const title = (user.jobTitle || '').toLowerCase();
  
  if (title.includes('director') || title.includes('cio') || title.includes('cto')) {
    role = 'ExecutiveDirector';
  } else if (title.includes('head') || title.includes('hod')) {
    role = 'HoD';
  } else if (title.includes('manager') || title.includes('gm')) {
    role = 'Manager';
  } else if (title.includes('admin') || title.includes('administrator')) {
    role = 'ITAdmin';
  } else if (title.includes('security')) {
    role = 'SecurityOfficer';
  }
  
  return {
    id: user.id,
    name: user.displayName,
    email: user.mail || user.userPrincipalName,
    role,
    department: user.department || undefined,
    title: user.jobTitle || undefined,
    site: user.officeLocation?.toLowerCase().includes('johor') ? 'Johor' : 'Prai',
    isActive: true,
  };
}

// =============================================================================
// REACT HOOKS
// =============================================================================

/**
 * Hook for searching approvers with live Graph API integration
 */
export function useLiveApproverSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ApproverInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  
  // Search function
  const searchUsers = useCallback(async (searchQuery: string) => {
    setQuery(searchQuery);
    
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Don't search for very short queries
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }
    
    // Debounce the search
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      setError(null);
      
      try {
        const graphUsers = await GraphAPIService.searchUsers(searchQuery);
        const approverInfos = graphUsers.map(graphUserToApproverInfo);
        setResults(approverInfos);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, DEBOUNCE_MS);
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);
  
  // Clear results
  const clearResults = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);
  
  return {
    query,
    results,
    isSearching,
    error,
    searchUsers,
    clearResults,
  };
}

/**
 * Hook for fetching a single user by ID
 */
export function useGraphUser(userId: string | undefined) {
  return useQuery({
    queryKey: ['graph-user', userId],
    queryFn: async () => {
      if (!userId) return null;
      const user = await GraphAPIService.getUserById(userId);
      return user ? graphUserToApproverInfo(user) : null;
    },
    enabled: !!userId,
    staleTime: CACHE_TTL_MS,
  });
}

/**
 * Hook for fetching user's manager
 */
export function useUserManager(userId: string | undefined) {
  return useQuery({
    queryKey: ['user-manager', userId],
    queryFn: async () => {
      if (!userId) return null;
      const manager = await GraphAPIService.getUserManager(userId);
      return manager ? graphUserToApproverInfo(manager) : null;
    },
    enabled: !!userId,
    staleTime: CACHE_TTL_MS,
  });
}

/**
 * Hook for fetching direct reports
 */
export function useDirectReports(userId: string | undefined) {
  return useQuery({
    queryKey: ['direct-reports', userId],
    queryFn: async () => {
      if (!userId) return [];
      const reports = await GraphAPIService.getDirectReports(userId);
      return reports.map(graphUserToApproverInfo);
    },
    enabled: !!userId,
    staleTime: CACHE_TTL_MS,
  });
}

/**
 * Hook for getting the organizational hierarchy for approvals
 */
export function useApprovalHierarchy(userId: string | undefined, formCode?: string) {
  const { data: manager } = useUserManager(userId);
  
  return {
    manager,
    // In production, this would build the full approval chain
    // based on form code and organizational structure
    suggestedApprovers: manager ? [manager] : [],
  };
}

// Export utilities only - types are already exported above via interface declarations
export { GraphAPIService, graphUserToApproverInfo };