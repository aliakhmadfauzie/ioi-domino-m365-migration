/**
 * Auto Role Detection Hook
 * 
 * Automatically sets the user's role based on their email.
 * Users matching specific emails are granted super admin access.
 */

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useUser } from '@/hooks/use-user';
import { currentRoleAtom } from '@/store/platform-store';

// Email addresses that grant automatic super admin access
const SUPER_ADMIN_EMAILS: string[] = [
  'alimigration@ioioi.onmicrosoft.com',
];

export function useAutoRole(): { isSuperAdmin: boolean; isLoading: boolean } {
  const { data: user, isLoading } = useUser();
  const setRole = useSetAtom(currentRoleAtom);

  useEffect(() => {
    if (!user?.userPrincipalName) return;

    const email = user.userPrincipalName.toLowerCase();

    // Check if user should be super admin
    const isSuperAdminEmail = SUPER_ADMIN_EMAILS.some(
      (adminEmail: string) => email === adminEmail.toLowerCase()
    );

    if (isSuperAdminEmail) {
      setRole('admin');
      console.log(`Auto-role: Super Admin access granted for ${email}`);
    }
  }, [user?.userPrincipalName, setRole]);

  const email = user?.userPrincipalName?.toLowerCase() || '';
  
  const isSuperAdmin = SUPER_ADMIN_EMAILS.some(
    (adminEmail: string) => email === adminEmail.toLowerCase()
  );

  return { isSuperAdmin, isLoading };
}

/**
 * Helper to check if a given email has super admin access
 */
export function isSuperAdminEmail(email: string): boolean {
  const normalizedEmail = email.toLowerCase();

  return SUPER_ADMIN_EMAILS.some(
    (adminEmail: string) => normalizedEmail === adminEmail.toLowerCase()
  );
}