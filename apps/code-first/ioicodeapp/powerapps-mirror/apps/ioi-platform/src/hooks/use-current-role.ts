import { useQuery } from '@tanstack/react-query';
import { useUser } from './use-user';

// Role types for the platform
export type UserRoleKey = 'initiator' | 'manager' | 'approver' | 'admin';

export interface CurrentUserRole {
  role: UserRoleKey;
  isAdmin: boolean;
  isManager: boolean;
  isEmployee: boolean;
  canApprove: boolean;
  departmentId: string | null;
  departmentName: string | null;
  userEmail: string | null;
  userName: string | null;
}

/**
 * Custom hook to determine the current user's role.
 * Since user_role table has been removed and roles are now determined
 * via platform state or O365 user context.
 */
export const useCurrentRole = () => {
  const { data: user } = useUser();

  return useQuery<CurrentUserRole>({
    queryKey: ['currentRole', user?.objectId],
    queryFn: () => {
      // Default role is 'initiator' - all employees can submit forms
      const role: UserRoleKey = 'initiator';
      
      return {
        role,
        isAdmin: false,
        isManager: false,
        isEmployee: true,
        canApprove: false,
        departmentId: null,
        departmentName: null,
        userEmail: user?.userPrincipalName ?? null,
        userName: user?.fullName ?? null,
      };
    },
    enabled: !!user,
  });
};