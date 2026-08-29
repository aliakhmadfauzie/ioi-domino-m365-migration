/**
 * Mock toggle state — persisted in localStorage.
 *
 * When enabled, all IT department pages use mock data instead of real
 * SharePoint connectors.
 *
 * Restricted to alimigration@ioioi.onmicrosoft.com.
 */
import { atom } from 'jotai';

const STORAGE_KEY = 'ioi-mock-toggle';

function loadPersisted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function persist(value: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, value ? 'true' : 'false');
  } catch {
    // localStorage unavailable — ignore
  }
}

/** Base atom backed by localStorage */
const baseMockToggleAtom = atom<boolean>(loadPersisted());

/** Public read/write atom that syncs to localStorage on change */
export const mockToggleAtom = atom(
  (get) => get(baseMockToggleAtom),
  (_get, set, next: boolean) => {
    persist(next);
    set(baseMockToggleAtom, next);
  }
);
