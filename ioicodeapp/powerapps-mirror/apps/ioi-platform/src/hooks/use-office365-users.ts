import { useQuery } from '@tanstack/react-query';
import { useIsAppInitialized, ensureInitialized } from '@/lib/app-init';
import { Office365UsersService } from '@/generated/services/office365-users-service';
import type { GraphUser_V1 as GraphUser } from '@/generated/models/office365-users-model';

export interface User {
  Id?: string;
  DisplayName?: string;
  GivenName?: string;
  Surname?: string;
  Mail?: string;
  UserPrincipalName?: string;
  Department?: string;
  JobTitle?: string;
  OfficeLocation?: string;
  mobilePhone?: string;
}

function graphUserToUser(g: GraphUser): User {
  return {
    Id: g.id,
    DisplayName: g.displayName,
    GivenName: g.givenName,
    Surname: g.surname,
    Mail: g.mail,
    UserPrincipalName: g.userPrincipalName,
    Department: g.department,
    JobTitle: g.jobTitle,
    OfficeLocation: g.officeLocation,
    mobilePhone: g.mobilePhone,
  };
}

let connectionVerified = false;
let connectionCheckPromise: Promise<boolean> | null = null;

async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 500): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < maxRetries; i++) {
    try {
      if (i > 0) {
        await new Promise(r => setTimeout(r, initialDelay * Math.pow(1.5, i - 1)));
      }
      return await fn();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

async function ensureConnectionReady(): Promise<boolean> {
  if (connectionVerified) return true;
  if (!connectionCheckPromise) {
    connectionCheckPromise = (async () => {
      try {
        await ensureInitialized();
        const result = await retryWithBackoff(() => Office365UsersService.MyProfile_V2());
        if (result) {
          connectionVerified = true;
          return true;
        }
        return false;
      } catch {
        connectionVerified = false;
        connectionCheckPromise = null;
        return false;
      }
    })();
  }
  return connectionCheckPromise;
}

export function useSearchUsers(searchTerm: string, enabled = true) {
  const isInitialized = useIsAppInitialized();
  return useQuery({
    queryKey: ['office365-users-search', searchTerm],
    queryFn: async () => {
      const ready = await ensureConnectionReady();
      if (!ready || !searchTerm || searchTerm.trim().length < 2) return [];
      const term = searchTerm.trim();
      const result = await Office365UsersService.SearchUserV2(`startswith(displayName,'${term}') or startswith(mail,'${term}')`, 25);
      const users = (result as { value?: GraphUser[] }).value || [];
      return users.map(graphUserToUser);
    },
    staleTime: 5 * 60 * 1000,
    enabled: enabled && isInitialized && !!searchTerm && searchTerm.trim().length >= 2,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 5000),
  });
}

export function useMyProfile(enabled = true) {
  const isInitialized = useIsAppInitialized();
  return useQuery({
    queryKey: ['office365-users-my-profile'],
    queryFn: async () => {
      const ready = await ensureConnectionReady();
      if (!ready) return null;
      const result = await Office365UsersService.MyProfile_V2();
      if (!result) return null;
      return graphUserToUser(result);
    },
    staleTime: 10 * 60 * 1000,
    enabled: enabled && isInitialized,
    retry: 2,
  });
}

export function useUserProfile(userId: string | undefined, enabled = true) {
  const isInitialized = useIsAppInitialized();
  return useQuery({
    queryKey: ['office365-users-profile', userId],
    queryFn: async () => {
      const ready = await ensureConnectionReady();
      if (!ready || !userId) return null;
      const result = await Office365UsersService.UserProfile_V2(userId);
      if (!result) return null;
      return graphUserToUser(result);
    },
    staleTime: 10 * 60 * 1000,
    enabled: enabled && isInitialized && !!userId,
    retry: 2,
  });
}

export function useUserManager(userId: string | undefined, enabled = true) {
  const isInitialized = useIsAppInitialized();
  return useQuery({
    queryKey: ['office365-users-manager', userId],
    queryFn: async () => {
      const ready = await ensureConnectionReady();
      if (!ready || !userId) return null;
      const result = await Office365UsersService.Manager_V2(userId);
      if (!result) return null;
      return graphUserToUser(result);
    },
    staleTime: 10 * 60 * 1000,
    enabled: enabled && isInitialized && !!userId,
    retry: 2,
  });
}

export function useDirectReports(userId: string | undefined, enabled = true) {
  const isInitialized = useIsAppInitialized();
  return useQuery({
    queryKey: ['office365-users-direct-reports', userId],
    queryFn: async () => {
      const ready = await ensureConnectionReady();
      if (!ready || !userId) return [];
      const result = await Office365UsersService.DirectReports_V2(userId);
      const users = (result as { value?: GraphUser[] }).value || [];
      return users.map(graphUserToUser);
    },
    staleTime: 10 * 60 * 1000,
    enabled: enabled && isInitialized && !!userId,
    retry: 2,
  });
}

export function useAllOrganizationUsers() {
  const isInitialized = useIsAppInitialized();
  return useQuery({
    queryKey: ['office365-users-all'],
    queryFn: async () => {
      const ready = await ensureConnectionReady();
      if (!ready) return [];
      const result = await Office365UsersService.SearchUserV2(undefined, 999);
      const users = (result as { value?: GraphUser[] }).value || [];
      return users.map(graphUserToUser);
    },
    staleTime: 10 * 60 * 1000,
    enabled: isInitialized,
    retry: 2,
  });
}
