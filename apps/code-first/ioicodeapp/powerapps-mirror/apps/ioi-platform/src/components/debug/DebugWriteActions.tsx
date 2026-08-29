import { useAtomValue } from 'jotai';
import { PenSquare, CheckCircle2, XCircle } from 'lucide-react';
import { debugCurrentScreenIdAtom, debugLastWriteResultsAtom } from '@/debug/debugStore';
import { debugRegistry } from '@/debug/debugRegistry';
import type { WriteActionMeta } from '@/debug/debugTypes';

export function DebugWriteActions() {
  const screenId    = useAtomValue(debugCurrentScreenIdAtom);
  const lastResults = useAtomValue(debugLastWriteResultsAtom);
  const meta        = screenId ? debugRegistry.getScreen(screenId) : null;

  if (!meta || meta.writeActions.length === 0) {
    return <Empty>No write actions registered for this screen.</Empty>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
        <PenSquare size={12} />
        Write Actions
        <span className="ml-1 rounded-full bg-white/10 px-1.5 py-0 text-[10px] text-white/60">
          {meta.writeActions.length}
        </span>
      </div>

      {meta.writeActions.map((action) => (
        <WriteActionCard
          key={action.actionKey}
          action={action}
          lastResult={lastResults[action.actionKey]}
        />
      ))}
    </div>
  );
}

function WriteActionCard({
  action,
  lastResult,
}: {
  action: WriteActionMeta;
  lastResult?: { success: boolean; errorMessage?: string; recordId?: string | number; timestamp: string };
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-2.5 space-y-2">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs font-medium text-white">{action.buttonOrActionName}</div>
          <div className="text-[10px] font-mono text-white/40">{action.actionKey}</div>
        </div>
        <OperationBadge op={action.operation} />
      </div>

      {/* Target */}
      <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-[10px]">
        <span className="text-white/40">Target List</span>
        <span className="font-mono text-emerald-300">{action.targetListName}</span>
        <span className="text-white/40">Display</span>
        <span className="text-white/60">{action.targetListDisplayName}</span>
        <span className="text-white/40">Site</span>
        <span className="font-mono text-cyan-300 truncate">{action.targetSiteUrl}</span>
      </div>

      {/* Last write result */}
      {lastResult && (
        <div className={`flex items-start gap-1.5 rounded px-2 py-1 text-[10px] ${lastResult.success ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>
          {lastResult.success
            ? <CheckCircle2 size={10} className="mt-0.5 shrink-0" />
            : <XCircle     size={10} className="mt-0.5 shrink-0" />}
          <span>
            {lastResult.success
              ? `OK — Record ID: ${lastResult.recordId ?? 'new'}`
              : `FAILED: ${lastResult.errorMessage}`}
            <span className="ml-1 text-white/30">{lastResult.timestamp}</span>
          </span>
        </div>
      )}

      {/* Field mappings */}
      <details>
        <summary className="cursor-pointer text-[10px] text-white/40 hover:text-white/70 select-none">
          Field mappings ({action.fieldMappings.length}) ▸
        </summary>
        <div className="mt-1 overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="text-white/30">
                <th className="text-left pr-2 pb-0.5">Control</th>
                <th className="text-left pr-2 pb-0.5">App Col</th>
                <th className="text-left pr-2 pb-0.5">SP Col</th>
                <th className="text-left pr-2 pb-0.5">Transform</th>
                <th className="text-left pb-0.5">Validation</th>
              </tr>
            </thead>
            <tbody>
              {action.fieldMappings.map((m) => {
                const mismatch = m.appFieldType !== m.spFieldType;
                const nameMismatch = m.appColumnName !== m.spColumnName;
                return (
                  <tr key={m.spColumnName} className={`border-t border-white/5 ${mismatch || nameMismatch ? 'bg-red-500/5' : ''}`}>
                    <td className="pr-2 py-0.5 font-mono text-white/50">{m.appControlName}</td>
                    <td className={`pr-2 py-0.5 font-mono ${nameMismatch ? 'text-orange-300' : 'text-white/70'}`}>{m.appColumnName}</td>
                    <td className={`pr-2 py-0.5 font-mono ${nameMismatch ? 'text-orange-300' : 'text-emerald-300'}`}>{m.spColumnName}</td>
                    <td className="pr-2 py-0.5 text-violet-300">{m.transformFn ?? '—'}</td>
                    <td className="py-0.5 text-white/40 max-w-[120px] truncate">{m.validationRule ?? '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

function OperationBadge({ op }: { op: string }) {
  const map: Record<string, string> = {
    Create: 'bg-green-500/20 text-green-300',
    Update: 'bg-blue-500/20 text-blue-300',
    Delete: 'bg-red-500/20 text-red-300',
    Patch:  'bg-orange-500/20 text-orange-300',
  };
  return (
    <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${map[op] ?? 'bg-white/10 text-white/60'}`}>
      {op}
    </span>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="text-xs text-white/30 italic px-1">{children}</div>;
}
