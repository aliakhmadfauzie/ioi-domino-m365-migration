import { atom } from 'jotai';
import { DataMode } from './debugTypes';
import type { DebugEvent, DebugIssue, LastWriteResult } from './debugTypes';

// ─── Primitive atoms ──────────────────────────────────────────────────────────

export const debugEnabledAtom    = atom<boolean>(false);
export const debugOpenAtom       = atom<boolean>(false);
export const debugDataModeAtom   = atom<DataMode>(DataMode.Real);
// '' means "not set" — strictNullChecks is off in this project, so
// atom<string|null>(null) incorrectly resolves to a read-only Atom<string>.
export const debugCurrentScreenIdAtom = atom('');
export const debugCurrentUserAtom     = atom('');

/** Newest-first ring buffer, capped at 300 entries */
export const debugEventsAtom = atom<DebugEvent[]>([]);

/** All issues from the last schema comparison, flat list */
export const debugIssuesAtom = atom<DebugIssue[]>([]);

/** Per-source schema results; key = sourceKey */
export const debugSchemaResultsAtom = atom<Record<string, DebugIssue[]>>({});

/** Latest write result per actionKey */
export const debugLastWriteResultsAtom = atom<Record<string, LastWriteResult>>({});

// ─── Derived write atoms ──────────────────────────────────────────────────────

export const appendDebugEventAtom = atom(
  null,
  (get, set, event: DebugEvent) => {
    const prev = get(debugEventsAtom);
    set(debugEventsAtom, [event, ...prev].slice(0, 300));
  }
);

export const setSchemaResultAtom = atom(
  null,
  (get, set, payload: { sourceKey: string; issues: DebugIssue[] }) => {
    const newResults = {
      ...get(debugSchemaResultsAtom),
      [payload.sourceKey]: payload.issues,
    };
    set(debugSchemaResultsAtom, newResults);
    set(debugIssuesAtom, Object.values(newResults).flat());
  }
);

export const setLastWriteResultAtom = atom(
  null,
  (get, set, payload: { actionKey: string; result: LastWriteResult }) => {
    set(debugLastWriteResultsAtom, {
      ...get(debugLastWriteResultsAtom),
      [payload.actionKey]: payload.result,
    });
  }
);

export const clearDebugEventsAtom = atom(null, (_get, set) => {
  set(debugEventsAtom, []);
});
