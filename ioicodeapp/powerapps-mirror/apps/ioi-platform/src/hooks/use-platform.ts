// Platform Hooks - Role management, department context, and logout

import { useCallback, useMemo } from 'react';
import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useQueryClient } from '@tanstack/react-query';
import type { DepartmentCode, Department } from '@/config/departments';
import { getDepartmentModules, DEPARTMENTS } from '@/config/departments';

// Types
export type UserRole = 'initiator' | 'manager' | 'approver' | 'admin';

export interface PlatformState {
  currentDepartment: DepartmentCode | null;
  role: UserRole;
  recentDepartments: DepartmentCode[];
}

const defaultState: PlatformState = {
  currentDepartment: null,
  role: 'initiator',
  recentDepartments: [],
};

// Atoms with persistence
export const platformStateAtom = atomWithStorage<PlatformState>('ioi-platform-state', defaultState);
export const currentDepartmentAtom = atom(
  (get) => get(platformStateAtom).currentDepartment,
  (get, set, department: DepartmentCode | null) => {
    const state = get(platformStateAtom);
    const recentDepartments = department 
      ? [department, ...state.recentDepartments.filter(d => d !== department)].slice(0, 5)
      : state.recentDepartments;
    set(platformStateAtom, { ...state, currentDepartment: department, recentDepartments });
  }
);

export const userRoleAtom = atom(
  (get) => get(platformStateAtom).role,
  (get, set, role: UserRole) => {
    const state = get(platformStateAtom);
    set(platformStateAtom, { ...state, role });
  }
);

// Current Department Hook
export function useCurrentDepartment() {
  const [currentDepartment, setCurrentDepartment] = useAtom(currentDepartmentAtom);
  const [platformState] = useAtom(platformStateAtom);

  return {
    currentDepartment,
    setCurrentDepartment,
    recentDepartments: platformState.recentDepartments,
  };
}

// Role Access Hook
export function useRoleAccess() {
  const [role, setRole] = useAtom(userRoleAtom);

  const hasRole = useCallback((requiredRole: UserRole | UserRole[]): boolean => {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    // Role hierarchy: admin > approver > manager > initiator
    const roleHierarchy: Record<UserRole, number> = {
      initiator: 1,
      manager: 2,
      approver: 3,
      admin: 4,
    };

    const userLevel = roleHierarchy[role];
    return roles.some(r => roleHierarchy[r] <= userLevel);
  }, [role]);

  const canApprove = role === 'manager' || role === 'approver' || role === 'admin';
  const canAdmin = role === 'admin';
  const canManage = role === 'manager' || role === 'admin';

  return {
    role,
    setRole,
    hasRole,
    canApprove,
    canAdmin,
    canManage,
  };
}

// Logout Hook - Resets all data and navigates to department hub
export function useLogout() {
  const queryClient = useQueryClient();
  const [, setPlatformState] = useAtom(platformStateAtom);

  const logout = useCallback(() => {
    // Clear all React Query caches
    queryClient.clear();

    // Reset platform state to defaults
    setPlatformState(defaultState);

    // Clear any localStorage items related to the app
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('ioi-') || key.startsWith('submission-'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Clear session storage
    sessionStorage.clear();
  }, [queryClient, setPlatformState]);

  return { logout };
}

// Permission Check Hook
export function usePermissions(requiredRoles?: UserRole[]) {
  const { role, hasRole } = useRoleAccess();
  
  const hasAccess = !requiredRoles || hasRole(requiredRoles);

  return {
    hasAccess,
    currentRole: role,
  };
}

// Department Navigation Hook
export function useDepartmentNavigation() {
  const { currentDepartment, setCurrentDepartment, recentDepartments } = useCurrentDepartment();

  const navigateToDepartment = useCallback((code: DepartmentCode) => {
    setCurrentDepartment(code);
  }, [setCurrentDepartment]);

  const exitDepartment = useCallback(() => {
    setCurrentDepartment(null);
  }, [setCurrentDepartment]);

  return {
    currentDepartment,
    recentDepartments,
    navigateToDepartment,
    exitDepartment,
  };
}

// Global Search Hook
const searchQueryAtom = atom<string>('');
const searchOpenAtom = atom<boolean>(false);

export function useGlobalSearch() {
  const [query, setQuery] = useAtom(searchQueryAtom);
  const [isOpen, setIsOpen] = useAtom(searchOpenAtom);
  const { currentDepartment } = useCurrentDepartment();

  const openSearch = useCallback(() => setIsOpen(true), [setIsOpen]);
  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, [setIsOpen, setQuery]);

  const searchResults = useMemo(() => {
    if (!query || query.length < 2) return [];
    const searchTerm = query.toLowerCase();
    const results: Array<{
      id: string;
      type: 'form' | 'module';
      title: string;
      description: string;
      path: string;
    }> = [];

    // Search in current department if selected
    const deptsToSearch = currentDepartment 
      ? [DEPARTMENTS[currentDepartment]]
      : Object.values(DEPARTMENTS).filter((d): d is Department => !!d && d.status === 'active');

    deptsToSearch.forEach(dept => {
      if (!dept) return;
      const modules = getDepartmentModules(dept.code);
      modules.forEach(module => {
        // Search module name
        if (module.name.toLowerCase().includes(searchTerm)) {
          results.push({
            id: module.id,
            type: 'module',
            title: module.name,
            description: module.description,
            path: module.path,
          });
        }
        // Search forms
        module.forms.forEach(form => {
          if (
            form.name.toLowerCase().includes(searchTerm) ||
            form.formCode.toLowerCase().includes(searchTerm) ||
            form.description.toLowerCase().includes(searchTerm)
          ) {
            results.push({
              id: form.formCode,
              type: 'form',
              title: `${form.formCode} - ${form.name}`,
              description: form.description,
              path: `/${dept.code.toLowerCase()}/forms/${form.formCode.toLowerCase()}/new`,
            });
          }
        });
      });
    });

    return results.slice(0, 10);
  }, [query, currentDepartment]);

  return {
    query,
    setQuery,
    isOpen,
    openSearch,
    closeSearch,
    searchResults,
  };
}