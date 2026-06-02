/**
 * MockToggle — floating toggle for IT department mock data mode.
 *
 * When enabled, all IT department pages use in-memory mock data instead of
 * real SharePoint connectors. This is useful for development, demo, and
 * testing without affecting real data.
 *
 * Only visible to alimigration@ioioi.onmicrosoft.com.
 * State is persisted in localStorage.
 */
import { useAtom } from 'jotai';
import { Database, DatabaseZap } from 'lucide-react';
import { mockToggleAtom } from '@/data/mockToggle';
import { useUser } from '@/hooks/use-user';

const AUTHORIZED_EMAIL = 'alimigration@ioioi.onmicrosoft.com';

export function MockToggle() {
  const [isMock, setMock] = useAtom(mockToggleAtom);
  const { data: user } = useUser();

  // Restrict to authorized user only
  const isAuthorized =
    user?.userPrincipalName?.toLowerCase() === AUTHORIZED_EMAIL.toLowerCase();

  if (!isAuthorized) return null;

  return (
    <button
      onClick={() => setMock(!isMock)}
      className={`fixed bottom-20 right-5 z-[10000] flex h-10 w-10 items-center justify-center rounded-full border shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
        isMock
          ? 'border-amber-500/60 bg-amber-50 text-amber-600 hover:bg-amber-100 focus:ring-amber-400'
          : 'border-slate-300 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-500 focus:ring-slate-400'
      }`}
      title={isMock ? 'Mock data ON — click to use real data' : 'Mock data OFF — click to use mock data'}
    >
      {isMock ? <DatabaseZap size={18} /> : <Database size={18} />}
    </button>
  );
}
