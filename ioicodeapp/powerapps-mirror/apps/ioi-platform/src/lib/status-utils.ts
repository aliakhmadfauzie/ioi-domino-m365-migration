import { getStatusStyle, getPriorityStyle, type StatusStyle, type PriorityStyle } from './color-tokens';
import {
  normalizeStatusSlug,
  slugToStatusLabel,
  slugToStatusType,
  isPendingSlug,
  isTerminalSlug,
  SLUG_TO_LABEL,
  SLUG_TO_TYPE,
  LEGACY_KEY_TO_SLUG,
  type StatusType,
} from './status-slugs';

// Re-export StatusType for backward compatibility
export type { StatusType };

// Re-export MainDBITCurrentstatusKey for backward compatibility
export type { MainDBITCurrentstatusKey } from '@/generated/models/main-dbit-model';
import type { MainDBITCurrentstatusKey } from '@/generated/models/main-dbit-model';

interface StatusConfig {
  label: string;
  type: StatusType;
  color: string;
  bgColor: string;
}

// Color palette by type
const INITIAL_STYLE  = { color: 'text-muted-foreground',       bgColor: 'bg-muted' };
const PENDING_STYLE  = { color: 'text-amber-700',               bgColor: 'bg-amber-50' };
const TERMINAL_STYLE = { color: 'text-emerald-700',             bgColor: 'bg-emerald-50' };
const ACTIVE_STYLE   = { color: 'text-primary',                 bgColor: 'bg-primary/10' };
const CLOSED_STYLE   = { color: 'text-muted-foreground',        bgColor: 'bg-muted' };

// Build slug-keyed statusConfig from the canonical slug maps
const STYLE_BY_TYPE: Record<StatusType, { color: string; bgColor: string }> = {
  'initial':     INITIAL_STYLE,
  'in-progress': PENDING_STYLE,
  'terminal':    TERMINAL_STYLE,
};

/** Slug-keyed status config — the primary lookup for all status operations */
export const statusConfig: Record<string, StatusConfig> = Object.fromEntries(
  Object.entries(SLUG_TO_LABEL).map(([slug, label]) => {
    const type = SLUG_TO_TYPE[slug] ?? 'in-progress';
    let style = STYLE_BY_TYPE[type];
    // Special-case: active and closed get muted style
    if (slug === 'active' || slug === 'closed' || slug === 'withdrawn') {
      style = type === 'terminal' && slug === 'active' ? ACTIVE_STYLE : CLOSED_STYLE;
    }
    return [slug, { label, type, ...style }];
  })
);

// =============================================================================
// BACKWARD COMPAT: Legacy key → statusConfig (for any remaining old callers)
// =============================================================================
/** @deprecated Use statusConfig[slug] instead */
export const legacyStatusConfig: Record<MainDBITCurrentstatusKey, StatusConfig> = Object.fromEntries(
  Object.entries(LEGACY_KEY_TO_SLUG).map(([key, slug]) => [key, statusConfig[slug]])
) as Record<MainDBITCurrentstatusKey, StatusConfig>;

// =============================================================================
// PRIMARY HELPERS (slug-based)
// =============================================================================

/** Normalize any status value to a slug, then get its display label */
export const getStatusLabel = (status: string) => {
  const slug = normalizeStatusSlug(status);
  return slugToStatusLabel(slug);
};

/** Normalize any status value to a slug, then get its lifecycle type */
export const getStatusType = (status: string): StatusType => {
  const slug = normalizeStatusSlug(status);
  return slugToStatusType(slug);
};

/** Is this status pending/in-progress? Accepts any format (key, label, or slug) */
export const isPendingStatus = (status: string) => {
  const slug = normalizeStatusSlug(status);
  return isPendingSlug(slug);
};

/** Is this status terminal (approved, rejected, withdrawn, etc.)? Accepts any format */
export const isTerminalStatus = (status: string) => {
  const slug = normalizeStatusSlug(status);
  return isTerminalSlug(slug);
};

// Re-export from color-tokens for convenience
export { getStatusStyle, getPriorityStyle };
export type { StatusStyle, PriorityStyle };

// =============================================================================
// PRIORITY CONFIGURATION (unchanged)
// =============================================================================

export type PriorityKey = 'low' | 'normal' | 'high' | 'critical';

export const priorityConfig: Record<PriorityKey, { label: string; color: string; bgColor: string }> = {
  'low':      { label: 'Low',      color: 'text-muted-foreground',     bgColor: 'bg-muted' },
  'normal':   { label: 'Normal',   color: 'text-secondary-foreground', bgColor: 'bg-secondary' },
  'high':     { label: 'High',     color: 'text-primary',              bgColor: 'bg-primary/10' },
  'critical': { label: 'Critical', color: 'text-destructive-foreground', bgColor: 'bg-destructive' },
};

export const getPriorityLabel = (key: PriorityKey) => priorityConfig[key]?.label ?? 'Unknown';
