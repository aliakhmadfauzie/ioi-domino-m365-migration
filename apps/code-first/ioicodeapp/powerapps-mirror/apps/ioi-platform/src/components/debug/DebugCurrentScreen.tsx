import { useAtomValue } from 'jotai';
import { useLocation } from 'react-router-dom';
import { Monitor } from 'lucide-react';
import { debugCurrentScreenIdAtom, debugCurrentUserAtom, debugDataModeAtom } from '@/debug/debugStore';
import { debugRegistry } from '@/debug/debugRegistry';

export function DebugCurrentScreen() {
  const location   = useLocation();
  const screenId   = useAtomValue(debugCurrentScreenIdAtom);
  const currentUser = useAtomValue(debugCurrentUserAtom);
  const dataMode   = useAtomValue(debugDataModeAtom);
  const meta       = screenId ? debugRegistry.getScreen(screenId) : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
        <Monitor size={12} />
        Current Screen
      </div>

      {/* Always-visible route row — works even on unregistered pages */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-2.5 space-y-1">
        <Row label="Current URL"  value={location.pathname} mono highlight />
        <Row label="Data Mode"    value={meta?.dataMode ?? dataMode} />
        <Row label="Current User" value={currentUser || '(resolving…)'} />
        <Row label="Timestamp"    value={new Date().toLocaleTimeString()} />
      </div>

      {/* If no screen is registered, show how to add instrumentation */}
      {!meta && (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 space-y-2">
          <p className="text-xs font-medium text-yellow-300">
            This page is not instrumented yet.
          </p>
          <p className="text-[10px] text-yellow-300/70">
            Add to the page component:
          </p>
          <pre className="rounded bg-black/40 p-2 text-[9px] text-yellow-200/80 whitespace-pre-wrap leading-relaxed">{`import { debugRegistry } from '@/debug/debugRegistry';
import { debugCurrentScreenIdAtom } from '@/debug/debugStore';
import { logNavigation } from '@/debug/debugLogger';
import { useSetAtom } from 'jotai';
import { YOUR_META } from './your-form.metadata';

// Inside the component:
const setCurrentScreen = useSetAtom(debugCurrentScreenIdAtom);
useEffect(() => {
  debugRegistry.register(YOUR_META);
  setCurrentScreen(YOUR_META.screenId);
  logNavigation({ screenId: YOUR_META.screenId,
                  routePath: YOUR_META.routePath });
  return () => setCurrentScreen('');
}, [setCurrentScreen]);`}</pre>
          <p className="text-[9px] text-yellow-300/50">
            See <span className="font-mono">src/forms/mrf/MRFNewPage.tsx</span> for a complete example.
            Navigate to <span className="font-mono">/it/forms/mrf/new</span> to see a live demo.
          </p>
        </div>
      )}

      {/* Registered screen details */}
      {meta && (
        <>
          <table className="w-full text-xs">
            <tbody>
              {([
                ['Screen ID',       meta.screenId],
                ['Route',           meta.routePath],
                ['Screen Title',    meta.screenTitle],
                ['Department Code', meta.departmentCode],
                ['Department Name', meta.departmentName],
                ['Form Code',       meta.formCode],
                ['Form Title',      meta.formTitle],
                ['Form Mode',       meta.formMode],
              ] as [string, string][]).map(([label, value]) => (
                <tr key={label} className="border-b border-white/5">
                  <td className="py-0.5 pr-3 text-white/40 align-top whitespace-nowrap">{label}</td>
                  <td className="py-0.5 font-mono text-emerald-300 break-all">{value ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-wrap gap-1.5">
            <Badge color="blue"   label="Mode" value={meta.formMode} />
            <Badge color="amber"  label="Data" value={meta.dataMode ?? dataMode} />
            <Badge color="violet" label="Dept" value={meta.departmentCode} />
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, value, mono, highlight }: {
  label: string; value: string; mono?: boolean; highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-2 text-[10px]">
      <span className="shrink-0 text-white/40 w-24">{label}</span>
      <span className={`break-all ${mono ? 'font-mono' : ''} ${highlight ? 'text-cyan-300' : 'text-white/70'}`}>
        {value}
      </span>
    </div>
  );
}

function Badge({ color, label, value }: { color: string; label: string; value: string }) {
  const colors: Record<string, string> = {
    blue:   'bg-blue-500/20 text-blue-300 border-blue-500/30',
    amber:  'bg-amber-500/20 text-amber-300 border-amber-500/30',
    violet: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium ${colors[color] ?? ''}`}>
      <span className="text-white/40">{label}</span>
      {value}
    </span>
  );
}
