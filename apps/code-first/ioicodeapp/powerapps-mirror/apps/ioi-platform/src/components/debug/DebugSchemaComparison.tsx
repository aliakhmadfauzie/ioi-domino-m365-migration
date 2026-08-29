import { useAtomValue, useSetAtom } from 'jotai';
import { GitCompare, RefreshCw } from 'lucide-react';
import { debugCurrentScreenIdAtom, debugSchemaResultsAtom, setSchemaResultAtom } from '@/debug/debugStore';
import { debugRegistry } from '@/debug/debugRegistry';
import { compareReadSchema, compareWriteMap } from '@/debug/schemaCompare';
import { logSchemaCheck } from '@/debug/debugLogger';
import { IssueSeverity } from '@/debug/debugTypes';
import type { DebugIssue } from '@/debug/debugTypes';

export function DebugSchemaComparison() {
  const screenId     = useAtomValue(debugCurrentScreenIdAtom);
  const schemaResults = useAtomValue(debugSchemaResultsAtom);
  const setResult    = useSetAtom(setSchemaResultAtom);
  const meta         = screenId ? debugRegistry.getScreen(screenId) : null;

  function runComparison() {
    if (!meta) return;

    for (const src of meta.readSources) {
      if (!src.spFields) continue;
      const issues = compareReadSchema(src.sourceKey, src.appFields, src.spFields);
      setResult({ sourceKey: src.sourceKey, issues });
      logSchemaCheck({ screenId: meta.screenId, sourceKey: src.sourceKey, issueCount: issues.length });
    }

    for (const action of meta.writeActions) {
      const src = meta.readSources.find((s) => s.listName === action.targetListName);
      if (!src?.spFields) continue;
      const issues = compareWriteMap(action.actionKey, action, src.spFields);
      setResult({ sourceKey: action.actionKey, issues });
      logSchemaCheck({ screenId: meta.screenId, sourceKey: action.actionKey, issueCount: issues.length });
    }
  }

  if (!meta) {
    return <div className="text-xs text-white/30 italic px-1">No screen registered.</div>;
  }

  const allIssues = Object.values(schemaResults).flat();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
          <GitCompare size={12} />
          Schema Comparison
          {allIssues.length > 0 && (
            <span className="rounded-full bg-red-500/30 px-1.5 py-0 text-[10px] text-red-300">
              {allIssues.length} issue{allIssues.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <button
          onClick={runComparison}
          className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors"
        >
          <RefreshCw size={9} />
          Run
        </button>
      </div>

      {Object.entries(schemaResults).length === 0 && (
        <div className="text-[10px] text-white/30 italic">Click Run to compare app schema vs SP schema registry.</div>
      )}

      {Object.entries(schemaResults).map(([key, issues]) => (
        <SourceResult key={key} sourceKey={key} issues={issues} />
      ))}
    </div>
  );
}

function SourceResult({ sourceKey, issues }: { sourceKey: string; issues: DebugIssue[] }) {
  const errors   = issues.filter((i) => i.severity === IssueSeverity.Error);
  const warnings = issues.filter((i) => i.severity === IssueSeverity.Warning);
  const infos    = issues.filter((i) => i.severity === IssueSeverity.Info);

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-2.5 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-white/70">{sourceKey}</span>
        <div className="flex gap-1">
          {errors.length > 0   && <Pill color="red"    label={`${errors.length} error${errors.length !== 1 ? 's' : ''}`} />}
          {warnings.length > 0 && <Pill color="yellow" label={`${warnings.length} warn`} />}
          {infos.length > 0    && <Pill color="gray"   label={`${infos.length} info`} />}
          {issues.length === 0 && <Pill color="green"  label="OK" />}
        </div>
      </div>

      {issues.length > 0 && (
        <div className="space-y-1">
          {issues.map((issue) => (
            <IssueRow key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}

function IssueRow({ issue }: { issue: DebugIssue }) {
  const colors: Record<string, string> = {
    Error:   'border-red-500/30 bg-red-500/10 text-red-300',
    Warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
    Info:    'border-blue-500/30 bg-blue-500/10 text-blue-300',
  };
  return (
    <div className={`rounded border p-2 text-[10px] ${colors[issue.severity] ?? ''}`}>
      <div className="flex items-center gap-1.5 font-medium">
        <SeverityIcon severity={issue.severity} />
        <span className="font-mono">{issue.fieldName}</span>
        <span className="text-[9px] opacity-60">[{issue.category}]</span>
      </div>
      <div className="mt-0.5 text-[9px] opacity-80">{issue.description}</div>
      <div className="mt-0.5 text-[9px] opacity-60">
        <span className="font-medium">Fix: </span>{issue.recommendedFix}
      </div>
    </div>
  );
}

function SeverityIcon({ severity }: { severity: string }) {
  if (severity === 'Error')   return <span>✗</span>;
  if (severity === 'Warning') return <span>⚠</span>;
  return <span>ℹ</span>;
}

function Pill({ color, label }: { color: string; label: string }) {
  const map: Record<string, string> = {
    red:    'bg-red-500/20 text-red-300',
    yellow: 'bg-yellow-500/20 text-yellow-300',
    gray:   'bg-white/10 text-white/50',
    green:  'bg-emerald-500/20 text-emerald-300',
  };
  return (
    <span className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${map[color] ?? ''}`}>{label}</span>
  );
}
