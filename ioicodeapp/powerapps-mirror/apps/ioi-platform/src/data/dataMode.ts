import { useAtomValue } from 'jotai';
import { DataMode } from '@/debug/debugTypes';
import { mockToggleAtom } from './mockToggle';

/**
 * Resolves whether debug mode is currently active.
 *
 * Activation priority (highest wins):
 *  1. `import.meta.env.VITE_DEBUG_MODE=true` (build-time env var)
 *  2. Running on localhost
 *  3. URL search param `?debugMode=true`
 */
export function isDebugMode(): boolean {
  if (import.meta.env.DEV) return true;
  if (import.meta.env.VITE_DEBUG_MODE === 'true') return true;
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || host === '::1') return true;
  return new URLSearchParams(window.location.search).get('debugMode') === 'true';
}

/**
 * Returns the active DataMode from the URL param `?dataMode=Mock|Real|Hybrid`.
 * Falls back to Real if not set or invalid.
 *
 * Individual screens can override this via their ScreenMeta.dataMode property.
 */
export function resolveDataMode(): DataMode {
  if (typeof window === 'undefined') return DataMode.Real;
  const param = new URLSearchParams(window.location.search).get('dataMode');
  if (param === 'Mock') return DataMode.Mock;
  if (param === 'Hybrid') return DataMode.Hybrid;
  return DataMode.Real;
}

/** True when we should skip the real Power Apps connector and use mock data */
export function useMockData(screenDataMode?: DataMode): boolean {
  // Priority 1: explicit screen-level override
  if (screenDataMode !== undefined) {
    return screenDataMode === DataMode.Mock;
  }
  // Priority 2: mock toggle (persisted UI switch)
  const mockToggle = useAtomValue(mockToggleAtom);
  if (mockToggle) return true;
  // Priority 3: URL query param
  return resolveDataMode() === DataMode.Mock;
}

/** True when some sources are real and some are mocked */
export function useHybridData(screenDataMode?: DataMode): boolean {
  const effective = screenDataMode ?? resolveDataMode();
  return effective === DataMode.Hybrid;
}
