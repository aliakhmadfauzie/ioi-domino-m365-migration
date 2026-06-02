import { useQuery } from '@tanstack/react-query';
import { getContext } from '@microsoft/power-apps/app';
import { ensureInitialized, useIsAppInitialized } from '@/lib/app-init';
import { Office365UsersConnectorService, type Office365User } from '@/services/office365-users-service';

export interface User {
  fullName?: string;
  userPrincipalName?: string;
  objectId?: string;
  tenantId?: string;
  email?: string;
  department?: string;
  jobTitle?: string;
  officeLocation?: string;
}

type RawUserContext = User & {
  displayName?: string;
  name?: string;
  email?: string;
  mail?: string;
  upn?: string;
  id?: string;
};

type RawMicrosoft365User = Office365User & {
  Id?: string;
  DisplayName?: string;
  Mail?: string;
  UserPrincipalName?: string;
  Department?: string;
  JobTitle?: string;
  OfficeLocation?: string;
};

function normalizePowerAppsUser(user: RawUserContext): User {
  return {
    fullName: user.fullName || user.displayName || user.name,
    userPrincipalName: user.userPrincipalName || user.email || user.mail || user.upn,
    email: user.email || user.mail || user.userPrincipalName || user.upn,
    objectId: user.objectId || user.id,
    tenantId: user.tenantId,
  };
}

function normalizeMicrosoft365User(user: RawMicrosoft365User): User {
  const email = user.mail || user.Mail || user.userPrincipalName || user.UserPrincipalName;

  return {
    fullName: user.displayName || user.DisplayName,
    userPrincipalName: user.userPrincipalName || user.UserPrincipalName || email,
    email,
    objectId: user.id || user.Id,
    department: user.department || user.Department,
    jobTitle: user.jobTitle || user.JobTitle,
    officeLocation: user.officeLocation || user.OfficeLocation,
  };
}

function mergeUsers(primary: User | null, fallback: User | null): User | null {
  if (!primary && !fallback) return null;

  return {
    ...fallback,
    ...primary,
    fullName: primary?.fullName || fallback?.fullName,
    userPrincipalName: primary?.userPrincipalName || fallback?.userPrincipalName,
    email: primary?.email || fallback?.email,
    objectId: primary?.objectId || fallback?.objectId,
    tenantId: primary?.tenantId || fallback?.tenantId,
    department: primary?.department || fallback?.department,
    jobTitle: primary?.jobTitle || fallback?.jobTitle,
    officeLocation: primary?.officeLocation || fallback?.officeLocation,
  };
}

export const useUser = () => {
  const isInitialized = useIsAppInitialized();
  
  return useQuery({
    queryKey: ['user', 'm365-profile'],
    queryFn: async (): Promise<User | null> => {
      try {
        // Ensure app is initialized before fetching context
        await ensureInitialized();
        const context = await getContext();
        const powerAppsUser = context?.user
          ? normalizePowerAppsUser(context.user as RawUserContext)
          : null;

        const profileResult = await Office365UsersConnectorService.myProfile();
        if (profileResult.success && profileResult.data) {
          const user = mergeUsers(
            normalizeMicrosoft365User(profileResult.data as RawMicrosoft365User),
            powerAppsUser
          );

          console.log('[useUser] Microsoft 365 user profile retrieved:', {
            fullName: user?.fullName,
            userPrincipalName: user?.userPrincipalName,
            email: user?.email,
            objectId: user?.objectId,
          });
          return user;
        }

        if (profileResult.error) {
          console.warn('[useUser] Microsoft 365 profile unavailable, using Power Apps context:', profileResult.error);
        }

        if (!powerAppsUser) {
          return null;
        }

        console.log('[useUser] Power Apps user context retrieved:', {
          fullName: powerAppsUser.fullName,
          userPrincipalName: powerAppsUser.userPrincipalName,
          email: powerAppsUser.email,
          objectId: powerAppsUser.objectId,
        });
        return powerAppsUser;
      } catch (error: unknown) {
        try {
          const context = await getContext();
          const user = context?.user ? normalizePowerAppsUser(context.user as RawUserContext) : null;
          if (!user) return null;

          console.warn('[useUser] Microsoft 365 profile failed, using Power Apps context:', error);
          console.log('[useUser] Power Apps user context retrieved:', {
            fullName: user.fullName,
            userPrincipalName: user.userPrincipalName,
            email: user.email,
            objectId: user.objectId,
          });
          return user;
        } catch {
          // Log error but don't throw - return null for graceful degradation
          console.warn('Failed to get user context:', error);
          return null;
        }
      }
    },
    // Only enable the query when app is initialized
    enabled: isInitialized,
    // Retry with backoff if user profile fetch fails
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 5000),
    // Allow stale data while revalidating
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
