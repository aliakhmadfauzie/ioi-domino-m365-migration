import type { ScreenMeta } from './debugTypes';

/**
 * Module-level singleton that holds screen metadata registrations.
 * Each page calls debugRegistry.register(meta) on mount and
 * debugRegistry.unregister(screenId) on unmount.
 */
class DebugRegistry {
  private readonly screens = new Map<string, ScreenMeta>();

  register(meta: ScreenMeta): void {
    this.screens.set(meta.screenId, meta);
  }

  unregister(screenId: string): void {
    this.screens.delete(screenId);
  }

  getScreen(screenId: string): ScreenMeta | undefined {
    return this.screens.get(screenId);
  }

  getAllScreens(): ScreenMeta[] {
    return Array.from(this.screens.values());
  }

  /** Returns true if at least one screen has been registered */
  hasAny(): boolean {
    return this.screens.size > 0;
  }
}

export const debugRegistry = new DebugRegistry();
