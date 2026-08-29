import { useAtomValue } from 'jotai';
import { AlertTriangle, Download } from 'lucide-react';
import { debugIssuesAtom, debugCurrentUserAtom, debugCurrentScreenIdAtom } from '@/debug/debugStore';
import { IssueSeverity } from '@/debug/debugTypes';
import { debugRegistry } from '@/debug/debugRegistry';
import { downloadIssuesCSV, downloadDebugJSON } from '@/debug/debugExport';

export function DebugIssues() {
  const issues      = useAtomValue(debugIssuesAtom);
  const currentUser = useAtomValue(debugCurrentUserAtom);
  const screenId    = useAtomValue(debugCurrentScreenIdAtom);
  const meta        = screenId ? debugRegistry.getScreen(screenId) : null;

  const errors   = issues.filter((i) => i.severity === IssueSeverity.Error);
  const warnings = issues.filter((i) => i.severity === IssueSeverity.Warning);
  const infos    = issues.filter((i) => i.severity === IssueSeverity.Info);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
          <AlertTriangle size={12} />
          Issues
          {issues.length > 0 && (
            <span className={`rounded-full px-1.5 text-[10px] ${errors.length > 0 ? 'bg-red-500/30 text-red-300' : 'bg-yellow-500/30 text-yellow-300'}`}>
              {issues.length}
            </span>
          )}
        </div>

        {issues.length > 0 && (
          <button
            onClick={() => downloadIssuesCSV(issues)}
            className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/70 transition-colors"
          >
            <Download size={9} />
            CSV
          </button>
        )}
      </div>

      {/* Summary counts */}
      {issues.length > 0 && (
        <div className="flex gap-1.5 text-[10px]">
          {errors.length   > 0 && <Pill color="red"    label={`${errors.length} error${errors.length   !== 1 ? 's' : ''}`} />}
          {warnings.length > 0 && <Pill color="yellow" label={`${warnings.length} warning${warnings.length !== 1 ? 's' : ''}`} />}
          {infos.length    > 0 && <Pill color="blue"   label={`${infos.length} info`} />}
        </div>
      )}

      {issues.length === 0 && (
        <div className="text-[10px] text-white/30 italic">
          No issues. Run schema comparison to detect mapping problems.
        </div>
      )}

      <div className="space-y-1">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className={`rounded border p-2 text-[10px] space-y-0.5 ${
              issue.severity === IssueSeverity.Error
                ? 'border-red-500/30 bg-red-500/10'
                : issue.severity === IssueSeverity.Warning
                ? 'border-yellow-500/30 bg-yellow-500/10'
                : 'border-blue-500/30 bg-blue-500/10'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className={`font-medium ${
                issue.severity === IssueSeverity.Error ? 'text-red-300'
                : issue.severity === IssueSeverity.Warning ? 'text-yellow-300'
                : 'text-blue-300'
              }`}>
                [{issue.severity}] {issue.category}
              </span>
              <span className="font-mono text-white/50">— {issue.fieldName}</span>
            </div>
            <div className="text-white/60">{issue.description}</div>
            <div className="text-emerald-300/70">
              <span className="font-medium text-emerald-300">Fix: </span>{issue.recommendedFix}
            </div>
          </div>
        ))}
      </div>

      {/* Export full debug snapshot */}
      {meta && (
        <button
          onClick={() =>
            downloadDebugJSON({
              exportedAt: new Date().toISOString(),
              currentScreenId: screenId,
              currentUser: currentUser || null,
              screenMeta: meta,
              issues,
              events: [],
            })
          }
          className="flex w-full items-center justify-center gap-1.5 rounded border border-white/10 py-1 text-[10px] text-white/30 hover:border-white/20 hover:text-white/60 transition-colors"
        >
          <Download size={9} />
          Export full debug snapshot (JSON)
        </button>
      )}
    </div>
  );
}

function Pill({ color, label }: { color: string; label: string }) {
  const map: Record<string, string> = {
    red:    'bg-red-500/20 text-red-300',
    yellow: 'bg-yellow-500/20 text-yellow-300',
    blue:   'bg-blue-500/20 text-blue-300',
  };
  return <span className={`rounded px-1.5 py-0.5 font-medium ${map[color] ?? ''}`}>{label}</span>;
}
