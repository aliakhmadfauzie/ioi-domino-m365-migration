/**
 * DebugToggle — floating action button shown only in debug mode.
 *
 * Renders in the bottom-right corner.
 * Does NOT render for normal (non-debug-enabled) sessions.
 * Restricted to authorized user: alimigration@ioioi.onmicrisoft.com
 */
import { useAtomValue, useSetAtom } from 'jotai';
import { Bug } from 'lucide-react';
import { debugEnabledAtom, debugOpenAtom, debugIssuesAtom } from '@/debug/debugStore';
import { IssueSeverity } from '@/debug/debugTypes';
import { useUser } from '@/hooks/use-user';

export function DebugToggle() {
  const isEnabled = useAtomValue(debugEnabledAtom);
  const isOpen    = useAtomValue(debugOpenAtom);
  const setOpen   = useSetAtom(debugOpenAtom);
  const issues    = useAtomValue(debugIssuesAtom);
  const { data: user } = useUser();

  // Restrict to authorized debug user
  const authorizedEmail = 'alimigration@ioioi.onmicrisoft.com';
  const isAuthorized = user?.userPrincipalName?.toLowerCase() === authorizedEmail.toLowerCase();
  if (!isEnabled || !isAuthorized) return null;

  const errorCount = issues.filter((i) => i.severity === IssueSeverity.Error).length;

  return (
    <button
      onClick={() => setOpen(!isOpen)}
      className="fixed bottom-5 right-5 z-[10000] flex h-10 w-10 items-center justify-center rounded-full bg-[#0d1117] border border-cyan-500/50 text-cyan-400 shadow-lg hover:border-cyan-400 hover:text-cyan-300 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
      title="Toggle Debug Panel"
    >
      <Bug size={18} />
      {errorCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
          {errorCount > 9 ? '9+' : errorCount}
        </span>
      )}
    </button>
  );
}
