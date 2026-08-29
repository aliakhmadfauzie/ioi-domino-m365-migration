import { useAtomValue } from 'jotai';
import { Database, ExternalLink } from 'lucide-react';
import { debugCurrentScreenIdAtom } from '@/debug/debugStore';
import { debugRegistry } from '@/debug/debugRegistry';
import type { ReadSourceMeta } from '@/debug/debugTypes';

export function DebugReadSources() {
  const screenId = useAtomValue(debugCurrentScreenIdAtom);
  const meta = screenId ? debugRegistry.getScreen(screenId) : null;

  if (!meta || meta.readSources.length === 0) {
    return <Empty>No read sources registered for this screen.</Empty>;
  }

  return (
    <div className="space-y-3">
      <SectionHeader icon={<Database size={12} />} title="Read Sources" count={meta.readSources.length} />
      {meta.readSources.map((src) => (
        <ReadSourceCard key={src.sourceKey} src={src} />
      ))}
    </div>
  );
}

function ReadSourceCard({ src }: { src: ReadSourceMeta }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-2.5 space-y-2">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs font-medium text-white">{src.friendlyTitle}</div>
          <div className="text-[10px] text-white/40 font-mono">{src.sourceKey}</div>
        </div>
        <KindBadge kind={src.sourceKind} />
      </div>

      {/* SP details */}
      {src.siteUrl && (
        <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-[10px]">
          <span className="text-white/40">Site</span>
          <span className="font-mono text-cyan-300 truncate">{src.siteUrl}</span>
          <span className="text-white/40">List</span>
          <span className="font-mono text-emerald-300">{src.listName}</span>
          <span className="text-white/40">Display</span>
          <span className="text-white/60">{src.listDisplayName}</span>
          <span className="text-white/40">Entity</span>
          <span className="font-mono text-white/60">{src.entityName}</span>
        </div>
      )}

      {/* App fields summary */}
      <div className="text-[10px] text-white/40">
        App fields: <span className="text-white/70">{src.appFields.length}</span>
        {src.spFields && (
          <>
            {' '}· SP fields: <span className="text-white/70">{src.spFields.length}</span>
          </>
        )}
      </div>

      {/* App field table */}
      <details className="group">
        <summary className="cursor-pointer text-[10px] text-white/40 hover:text-white/70 select-none">
          Show app fields ▸
        </summary>
        <div className="mt-1 overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="text-white/30">
                <th className="text-left pr-2 pb-0.5">Control</th>
                <th className="text-left pr-2 pb-0.5">App Column</th>
                <th className="text-left pr-2 pb-0.5">Type</th>
                <th className="text-left pb-0.5">Req</th>
              </tr>
            </thead>
            <tbody>
              {src.appFields.map((f) => (
                <tr key={f.appColumnName} className="border-t border-white/5">
                  <td className="pr-2 py-0.5 font-mono text-white/60">{f.controlName}</td>
                  <td className="pr-2 py-0.5 font-mono text-emerald-300">{f.appColumnName}</td>
                  <td className="pr-2 py-0.5 text-blue-300">{f.fieldType}</td>
                  <td className="py-0.5">{f.required ? <span className="text-red-400">✓</span> : <span className="text-white/20">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

function KindBadge({ kind }: { kind: string }) {
  const map: Record<string, string> = {
    SharePoint:     'bg-blue-500/20 text-blue-300',
    MockData:       'bg-yellow-500/20 text-yellow-300',
    M365Connector:  'bg-violet-500/20 text-violet-300',
    LocalState:     'bg-gray-500/20 text-gray-300',
    Collection:     'bg-orange-500/20 text-orange-300',
    StaticConfig:   'bg-green-500/20 text-green-300',
  };
  return (
    <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${map[kind] ?? 'bg-white/10 text-white/60'}`}>
      {kind}
    </span>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="text-xs text-white/30 italic px-1">{children}</div>;
}

function SectionHeader({ icon, title, count }: { icon: React.ReactNode; title: string; count: number }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
      {icon}
      {title}
      <span className="ml-1 rounded-full bg-white/10 px-1.5 py-0 text-[10px] text-white/60">{count}</span>
    </div>
  );
}
