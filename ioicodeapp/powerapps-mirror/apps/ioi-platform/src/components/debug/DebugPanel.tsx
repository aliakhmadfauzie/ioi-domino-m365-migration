/**
 * DebugPanel — floating collapsible debug panel.
 *
 * Only rendered when debugEnabledAtom is true.
 * The panel is draggable along the Y axis to avoid covering important UI.
 * Restricted to authorized user: alimigration@ioioi.onmicrisoft.com
 */
import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useLocation } from 'react-router-dom';
import {
  Monitor, Database, PenSquare, GitCompare, ScrollText, AlertTriangle, X,
} from 'lucide-react';
import { debugEnabledAtom, debugOpenAtom, debugCurrentScreenIdAtom } from '@/debug/debugStore';
import { debugRegistry } from '@/debug/debugRegistry';
import { DebugCurrentScreen }    from './DebugCurrentScreen';
import { DebugReadSources }      from './DebugReadSources';
import { DebugWriteActions }     from './DebugWriteActions';
import { DebugSchemaComparison } from './DebugSchemaComparison';
import { DebugRuntimeLog }       from './DebugRuntimeLog';
import { DebugIssues }           from './DebugIssues';
import { useUser } from '@/hooks/use-user';

type TabId = 'screen' | 'reads' | 'writes' | 'schema' | 'log' | 'issues';

const TABS: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
  { id: 'screen', label: 'Screen',  icon: <Monitor    size={11} /> },
  { id: 'reads',  label: 'Reads',   icon: <Database   size={11} /> },
  { id: 'writes', label: 'Writes',  icon: <PenSquare  size={11} /> },
  { id: 'schema', label: 'Schema',  icon: <GitCompare size={11} /> },
  { id: 'log',    label: 'Log',     icon: <ScrollText size={11} /> },
  { id: 'issues', label: 'Issues',  icon: <AlertTriangle size={11} /> },
];

export function DebugPanel() {
  const isEnabled  = useAtomValue(debugEnabledAtom);
  const isOpen     = useAtomValue(debugOpenAtom);
  const setOpen    = useSetAtom(debugOpenAtom);
  const screenId   = useAtomValue(debugCurrentScreenIdAtom);
  const location   = useLocation();
  const { data: user } = useUser();
  const [tab, setTab] = useState<TabId>('screen');

  // Restrict to authorized debug user (safety net alongside DebugToggle)
  const authorizedEmail = 'alimigration@ioioi.onmicrisoft.com';
  const isAuthorized = user?.userPrincipalName?.toLowerCase() === authorizedEmail.toLowerCase();
  if (!isEnabled || !isOpen || !isAuthorized) return null;

  if (!isEnabled || !isOpen) return null;

  const meta        = screenId ? debugRegistry.getScreen(screenId) : null;
  const isRegistered = !!meta;

  return (
    // Fixed overlay — right side, scrollable
    <div
      className="fixed right-0 top-0 z-[9999] flex h-full w-[420px] flex-col bg-[#0d1117] text-white shadow-2xl border-l border-white/10"
      style={{ fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}
    >
      {/* Title bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-[#161b22] px-3 py-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`shrink-0 h-2 w-2 rounded-full animate-pulse ${isRegistered ? 'bg-cyan-400' : 'bg-yellow-500'}`} />
          <div className="min-w-0">
            <div className="text-[10px] font-bold tracking-widest uppercase text-cyan-400">Debug Map</div>
            <div className="text-[9px] text-white/30 font-mono truncate">{location.pathname}</div>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="shrink-0 rounded p-0.5 text-white/40 hover:bg-white/10 hover:text-white/80 transition-colors"
        >
          <X size={13} />
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex shrink-0 gap-0.5 border-b border-white/10 bg-[#0d1117] px-1 pt-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1 rounded-t px-2 py-1 text-[10px] font-medium whitespace-nowrap transition-colors ${
              tab === t.id
                ? 'bg-[#161b22] text-cyan-400 border-t border-x border-white/10'
                : 'text-white/30 hover:text-white/60'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-3">
        {tab === 'screen' && <DebugCurrentScreen />}
        {tab === 'reads'  && <DebugReadSources />}
        {tab === 'writes' && <DebugWriteActions />}
        {tab === 'schema' && <DebugSchemaComparison />}
        {tab === 'log'    && <DebugRuntimeLog />}
        {tab === 'issues' && <DebugIssues />}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-white/10 bg-[#161b22] px-3 py-1">
        <div className="text-[9px] text-white/20 text-center">
          IOI Acidchem Debug Map · {import.meta.env.MODE}
        </div>
      </div>
    </div>
  );
}
