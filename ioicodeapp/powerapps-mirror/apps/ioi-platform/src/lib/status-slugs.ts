/**
 * Status Slugs — Canonical Status Keys for IOI Platform
 *
 * Replaces the opaque `CurrentstatusKey0`–`CurrentstatusKey59` SharePoint
 * choice key pattern with stable, human-readable kebab-case slugs.
 *
 * Design rules:
 *  - Lowercase, hyphen-separated (URL-safe, grep-friendly)
 *  - Derived from the label: "Pending HOD Acceptance" → "pending-hod-acceptance"
 *  - Idempotent: slug → slug is a no-op
 *  - SharePoint `CurrentStatus` column stores slugs for NEW records
 *  - `normalizeStatusSlug()` handles legacy key strings and label text on read
 */

import { MainDBITCurrentstatusKeyToLabel, type MainDBITCurrentstatusKey } from '@/generated/models/main-dbit-model';

// =============================================================================
// LEGACY KEY → SLUG MAP
// =============================================================================

/**
 * Maps every legacy `CurrentstatusKey*` string to its human-readable slug.
 * Derived deterministically from `MainDBITCurrentstatusKeyToLabel`.
 */
export const LEGACY_KEY_TO_SLUG: Record<MainDBITCurrentstatusKey, string> = {
  'CurrentstatusKey0':  'active',
  'CurrentstatusKey1':  'approved',
  'CurrentstatusKey2':  'closed',
  'CurrentstatusKey3':  'draft',
  'CurrentstatusKey4':  'sent',
  'CurrentstatusKey5':  'verified',
  'CurrentstatusKey6':  'withdrawn',
  'CurrentstatusKey7':  'pending-abaper',
  'CurrentstatusKey8':  'pending-acceptance',
  'CurrentstatusKey9':  'pending-approval-a',
  'CurrentstatusKey10': 'pending-approval-b',
  'CurrentstatusKey11': 'pending-authority-1',
  'CurrentstatusKey12': 'pending-authority-2',
  'CurrentstatusKey13': 'pending-basis',
  'CurrentstatusKey14': 'pending-bpo',
  'CurrentstatusKey15': 'pending-bpo-sign-off',
  'CurrentstatusKey16': 'pending-backup-admin',
  'CurrentstatusKey17': 'pending-bank-it',
  'CurrentstatusKey18': 'pending-bank-token',
  'CurrentstatusKey19': 'pending-close',
  'CurrentstatusKey20': 'pending-completion',
  'CurrentstatusKey21': 'pending-div-dept-head',
  'CurrentstatusKey22': 'pending-div-head',
  'CurrentstatusKey23': 'pending-ed',
  'CurrentstatusKey24': 'pending-endorsement',
  'CurrentstatusKey25': 'pending-finance',
  'CurrentstatusKey26': 'pending-func-procedure',
  'CurrentstatusKey27': 'pending-hod',
  'CurrentstatusKey28': 'pending-hod-acceptance',
  'CurrentstatusKey29': 'pending-isg-action',
  'CurrentstatusKey30': 'pending-it',
  'CurrentstatusKey31': 'pending-it-action',
  'CurrentstatusKey32': 'pending-it-approver',
  'CurrentstatusKey33': 'pending-it-checker',
  'CurrentstatusKey34': 'pending-it-config',
  'CurrentstatusKey35': 'pending-it-func-complete',
  'CurrentstatusKey36': 'pending-it-hardware',
  'CurrentstatusKey37': 'pending-it-manager',
  'CurrentstatusKey38': 'pending-it-pic',
  'CurrentstatusKey39': 'pending-it-staff',
  'CurrentstatusKey40': 'pending-it-superior',
  'CurrentstatusKey41': 'pending-it-support-use',
  'CurrentstatusKey42': 'pending-it-task-assign',
  'CurrentstatusKey43': 'pending-it-testing',
  'CurrentstatusKey44': 'pending-it-verifier',
  'CurrentstatusKey45': 'pending-impl-status',
  'CurrentstatusKey46': 'pending-initiator',
  'CurrentstatusKey47': 'pending-ku-sign-off',
  'CurrentstatusKey48': 'pending-notes-admin',
  'CurrentstatusKey49': 'pending-owner',
  'CurrentstatusKey50': 'pending-pm',
  'CurrentstatusKey51': 'pending-req-acceptance',
  'CurrentstatusKey52': 'pending-sap-abap-assign',
  'CurrentstatusKey53': 'pending-sap-it',
  'CurrentstatusKey54': 'pending-sap-std',
  'CurrentstatusKey55': 'pending-section-b',
  'CurrentstatusKey56': 'pending-transport',
  'CurrentstatusKey57': 'pending-transport-a',
  'CurrentstatusKey58': 'pending-transport-b',
  'CurrentstatusKey59': 'pending-verification',
} as const;

// =============================================================================
// SLUG → LABEL MAP
// =============================================================================

/** Slug → human-readable display label (for UI badges, headings, etc.) */
export const SLUG_TO_LABEL: Record<string, string> = Object.fromEntries(
  Object.entries(LEGACY_KEY_TO_SLUG).map(([key, slug]) => [slug, MainDBITCurrentstatusKeyToLabel[key]])
);

// =============================================================================
// SLUG → STATUS TYPE MAP
// =============================================================================

export type StatusType = 'initial' | 'in-progress' | 'terminal';

/** Slug → status lifecycle type */
export const SLUG_TO_TYPE: Record<string, StatusType> = {
  // ── Terminal / Initial ──────────────────────────────────────────────────────
  'active':                    'terminal',
  'approved':                  'terminal',
  'closed':                    'terminal',
  'draft':                     'initial',
  'sent':                      'terminal',
  'verified':                  'terminal',
  'withdrawn':                 'terminal',
  // ── Pending (In-Progress) ───────────────────────────────────────────────────
  'pending-abaper':            'in-progress',
  'pending-acceptance':        'in-progress',
  'pending-approval-a':        'in-progress',
  'pending-approval-b':        'in-progress',
  'pending-authority-1':       'in-progress',
  'pending-authority-2':       'in-progress',
  'pending-basis':             'in-progress',
  'pending-bpo':               'in-progress',
  'pending-bpo-sign-off':      'in-progress',
  'pending-backup-admin':      'in-progress',
  'pending-bank-it':           'in-progress',
  'pending-bank-token':        'in-progress',
  'pending-close':             'in-progress',
  'pending-completion':        'in-progress',
  'pending-div-dept-head':     'in-progress',
  'pending-div-head':          'in-progress',
  'pending-ed':                'in-progress',
  'pending-endorsement':       'in-progress',
  'pending-finance':           'in-progress',
  'pending-func-procedure':    'in-progress',
  'pending-hod':               'in-progress',
  'pending-hod-acceptance':    'in-progress',
  'pending-isg-action':        'in-progress',
  'pending-it':                'in-progress',
  'pending-it-action':         'in-progress',
  'pending-it-approver':       'in-progress',
  'pending-it-checker':        'in-progress',
  'pending-it-config':         'in-progress',
  'pending-it-func-complete':  'in-progress',
  'pending-it-hardware':       'in-progress',
  'pending-it-manager':        'in-progress',
  'pending-it-pic':            'in-progress',
  'pending-it-staff':          'in-progress',
  'pending-it-superior':       'in-progress',
  'pending-it-support-use':    'in-progress',
  'pending-it-task-assign':    'in-progress',
  'pending-it-testing':        'in-progress',
  'pending-it-verifier':       'in-progress',
  'pending-impl-status':       'in-progress',
  'pending-initiator':         'in-progress',
  'pending-ku-sign-off':       'in-progress',
  'pending-notes-admin':       'in-progress',
  'pending-owner':             'in-progress',
  'pending-pm':                'in-progress',
  'pending-req-acceptance':    'in-progress',
  'pending-sap-abap-assign':   'in-progress',
  'pending-sap-it':            'in-progress',
  'pending-sap-std':           'in-progress',
  'pending-section-b':         'in-progress',
  'pending-transport':         'in-progress',
  'pending-transport-a':       'in-progress',
  'pending-transport-b':       'in-progress',
  'pending-verification':      'in-progress',
};

// =============================================================================
// SLUG → LEGACY KEY (REVERSE MAP)
// =============================================================================

/** Slug → legacy `CurrentstatusKey*` for write-back compatibility if needed */
export const SLUG_TO_LEGACY_KEY: Record<string, MainDBITCurrentstatusKey> = Object.fromEntries(
  Object.entries(LEGACY_KEY_TO_SLUG).map(([key, slug]) => [slug, key as MainDBITCurrentstatusKey])
);

// =============================================================================
// NORMALIZE — THE MIGRATION BRIDGE
// =============================================================================

/**
 * Normalize any status value (legacy key, label text, or slug) into a slug.
 *
 * This is **idempotent** — passing a slug returns the same slug.
 * This is the primary entry point for the migration bridge.
 *
 * Usage:
 *   normalizeStatusSlug('CurrentstatusKey30')  → 'pending-it'
 *   normalizeStatusSlug('Pending IT')          → 'pending-it'
 *   normalizeStatusSlug('pending-it')          → 'pending-it'
 *   normalizeStatusSlug('')                    → ''
 *   normalizeStatusSlug(undefined)             → ''
 */
export function normalizeStatusSlug(raw: string | undefined): string {
  if (!raw) return '';

  // Already a slug? Return as-is (idempotent)
  if (SLUG_TO_TYPE[raw] !== undefined || SLUG_TO_LABEL[raw] !== undefined) {
    return raw;
  }

  // Check if it's a legacy key (e.g. "CurrentstatusKey30")
  const asKey = raw as MainDBITCurrentstatusKey;
  if (LEGACY_KEY_TO_SLUG[asKey]) {
    return LEGACY_KEY_TO_SLUG[asKey];
  }

  // Check case-insensitive legacy key (e.g. "currentstatuskey30")
  const lowerRaw = raw.toLowerCase();
  for (const [key, slug] of Object.entries(LEGACY_KEY_TO_SLUG)) {
    if (key.toLowerCase() === lowerRaw) return slug;
  }

  // Try label-text → slug lookup (e.g. "Pending IT" → "pending-it")
  for (const [key, label] of Object.entries(MainDBITCurrentstatusKeyToLabel)) {
    if (label === raw || label.toLowerCase() === lowerRaw) {
      return LEGACY_KEY_TO_SLUG[key as MainDBITCurrentstatusKey];
    }
  }

  // Unknown value — return as-is (let downstream handle it)
  console.warn(`[status-slugs] Unknown status value: "${raw}". Pass-through.`);
  return raw;
}

// =============================================================================
// HELPERS
// =============================================================================

/** Slug → display label. Falls back to the slug itself if unknown. */
export function slugToStatusLabel(slug: string): string {
  return SLUG_TO_LABEL[slug] ?? slug;
}

/** Slug → status type. Falls back to 'in-progress' if unknown. */
export function slugToStatusType(slug: string): StatusType {
  return SLUG_TO_TYPE[slug] ?? 'in-progress';
}

/** Is this slug a pending/in-progress status? */
export function isPendingSlug(slug: string): boolean {
  return slugToStatusType(slug) === 'in-progress';
}

/** Is this slug a terminal status (approved, rejected, withdrawn, etc.)? */
export function isTerminalSlug(slug: string): boolean {
  return slugToStatusType(slug) === 'terminal';
}

// =============================================================================
// CONVENIENCE EXPORTS
// =============================================================================

/** All known status slugs as a readonly array */
export const ALL_STATUS_SLUGS = Object.keys(SLUG_TO_LABEL) as readonly string[];

/** Pending/in-progress status slugs only */
export const PENDING_SLUGS = ALL_STATUS_SLUGS.filter(s => isPendingSlug(s));

/** Terminal status slugs only */
export const TERMINAL_SLUGS = ALL_STATUS_SLUGS.filter(s => isTerminalSlug(s));
