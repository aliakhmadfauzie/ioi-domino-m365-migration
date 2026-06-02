/**
 * useDebugInit — call once in the root AppContent component.
 *
 * - Detects whether debug mode should be active
 * - Resolves the global data mode from URL param
 * - Wires setDebugLoggerStore so the logger can push events to jotai
 * - Updates the current user atom after auth resolves
 */
import { useEffect } from 'react';
import { useSetAtom, useStore } from 'jotai';
import {
  debugEnabledAtom,
  debugDataModeAtom,
  debugCurrentUserAtom,
} from './debugStore';
import { setDebugLoggerStore } from './debugLogger';
import { isDebugMode, resolveDataMode } from '@/data/dataMode';

interface UseDebugInitOptions {
  currentUserEmail?: string | null;
}

export function useDebugInit({ currentUserEmail }: UseDebugInitOptions = {}) {
  const store          = useStore();
  const setEnabled     = useSetAtom(debugEnabledAtom);
  const setDataMode    = useSetAtom(debugDataModeAtom);
  const setCurrentUser = useSetAtom(debugCurrentUserAtom);

  // Wire the logger to the current jotai store (Provider-scoped)
  useEffect(() => {
    setDebugLoggerStore(store);
  }, [store]);

  // Detect debug mode once on mount
  useEffect(() => {
    const enabled = isDebugMode();
    setEnabled(enabled);
    if (enabled) {
      setDataMode(resolveDataMode());
    }
  }, [setEnabled, setDataMode]);

  // Update current user when auth resolves
  useEffect(() => {
    setCurrentUser(currentUserEmail ?? '');
  }, [currentUserEmail, setCurrentUser]);
}
