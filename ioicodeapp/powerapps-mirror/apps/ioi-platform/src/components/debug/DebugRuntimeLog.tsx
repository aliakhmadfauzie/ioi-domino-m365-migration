import { useAtomValue, useSetAtom } from 'jotai';
import { ScrollText, Trash2 } from 'lucide-react';
import { debugEventsAtom, clearDebugEventsAtom } from '@/debug/debugStore';
import { DebugEventType } from '@/debug/debugTypes';
import type { DebugEvent } from '@/debug/debugTypes';

const TYPE_STYLES: Record<DebugEventType, string> = {
  [DebugEventType.Navigation]: 'text-blue-300',
  [DebugEventType.Read]:       'text-emerald-300',
  [DebugEventType.Write]:      'text-yellow-300',
  [DebugEventType.SchemaCheck]:'text-violet-300',
  [DebugEventType.Error]:      'text-red-300',
  [DebugEventType.AuthCheck]:  'text-cyan-300',
};

const TYPE_PREFIX: Record<DebugEventType, string> = {
  [DebugEventType.Navigation]: 'NAV',
  [DebugEventType.Read]:       'READ',
  [DebugEventType.Write]:      'WRITE',
  [DebugEventType.SchemaCheck]:'SCHEMA',
  [DebugEventType.Error]:      'ERR',
  [DebugEventType.AuthCheck]:  'AUTH',
};

export function DebugRuntimeLog() {
  const events    = useAtomValue(debugEventsAtom);
  const clearAll  = useSetAtom(clearDebugEventsAtom);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
          <ScrollText size={12} />
          Runtime Log
          <span className="rounded-full bg-white/10 px-1.5 text-[10px] text-white/60">{events.length}</span>
        </div>
        {events.length > 0 && (
          <button
            onClick={() => clearAll()}
            className="flex items-center gap-1 text-[10px] text-white/30 hover:text-red-300 transition-colors"
          >
            <Trash2 size={9} />
            Clear
          </button>
        )}
      </div>

      {events.length === 0 && (
        <div className="text-[10px] text-white/30 italic">No events yet. Navigate or submit a form to see events.</div>
      )}

      <div className="max-h-64 overflow-y-auto space-y-0.5 rounded-lg border border-white/10 bg-black/20 p-1.5">
        {events.map((e) => (
          <EventRow key={e.id} event={e} />
        ))}
      </div>
    </div>
  );
}

function EventRow({ event }: { event: DebugEvent }) {
  const color  = TYPE_STYLES[event.type] ?? 'text-white/60';
  const prefix = TYPE_PREFIX[event.type] ?? event.type;
  const ts     = event.timestamp.slice(11, 23); // HH:mm:ss.mmm

  return (
    <div className={`flex items-start gap-1.5 rounded px-1 py-0.5 text-[10px] hover:bg-white/5 ${event.success === false ? 'bg-red-500/5' : ''}`}>
      <span className="shrink-0 font-mono text-white/20">{ts}</span>
      <span className={`shrink-0 w-[46px] font-mono font-medium ${color}`}>{prefix}</span>
      <span className="text-white/60 break-all">{event.summary}</span>
      {event.durationMs !== undefined && (
        <span className="shrink-0 text-white/20">{event.durationMs}ms</span>
      )}
    </div>
  );
}
