/**
 * Centralized semantic color tokens for IOI AcidChem platform
 * All colors use CSS variables that work in both light and dark mode
 * NEVER use hardcoded Tailwind palette colors (bg-blue-500, text-emerald-600, etc.)
 */

// =============================================================================
// STATUS COLORS - For workflow states and submission statuses
// =============================================================================

export type StatusType =
  | 'draft'
  | 'submitted'
  | 'pending'
  | 'pending-approval'
  | 'in-review'
  | 'in-progress'
  | 'approved'
  | 'rejected'
  | 'returned'
  | 'closed'
  | 'completed'
  | 'cancelled';

export interface StatusStyle {
  label: string;
  bg: string;
  text: string;
  border: string;
  badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline';
}

export const STATUS_STYLES: Record<StatusType, StatusStyle> = {
  draft: {
    label: 'Draft',
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    border: 'border-border',
    badgeVariant: 'secondary',
  },
  submitted: {
    label: 'Submitted',
    bg: 'bg-primary/10',
    text: 'text-primary',
    border: 'border-primary/20',
    badgeVariant: 'default',
  },
  pending: {
    label: 'Pending',
    bg: 'bg-accent',
    text: 'text-accent-foreground',
    border: 'border-accent',
    badgeVariant: 'outline',
  },
  'pending-approval': {
    label: 'Pending Approval',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    badgeVariant: 'outline',
  },
  'in-progress': {
    label: 'In Progress',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    badgeVariant: 'outline',
  },
  'in-review': {
    label: 'In Review',
    bg: 'bg-secondary',
    text: 'text-secondary-foreground',
    border: 'border-secondary',
    badgeVariant: 'outline',
  },
  approved: {
    label: 'Approved',
    bg: 'bg-primary',
    text: 'text-primary-foreground',
    border: 'border-primary',
    badgeVariant: 'default',
  },
  rejected: {
    label: 'Rejected',
    bg: 'bg-destructive',
    text: 'text-destructive-foreground',
    border: 'border-destructive',
    badgeVariant: 'destructive',
  },
  returned: {
    label: 'Returned',
    bg: 'bg-accent',
    text: 'text-accent-foreground',
    border: 'border-accent',
    badgeVariant: 'outline',
  },
  closed: {
    label: 'Closed',
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    border: 'border-border',
    badgeVariant: 'secondary',
  },
  completed: {
    label: 'Completed',
    bg: 'bg-primary',
    text: 'text-primary-foreground',
    border: 'border-primary',
    badgeVariant: 'default',
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    border: 'border-border',
    badgeVariant: 'secondary',
  },
};

export function getStatusStyle(status: string): StatusStyle {
  const normalizedStatus = status.toLowerCase().replace(/[\s_-]+/g, '-') as StatusType;
  return STATUS_STYLES[normalizedStatus] || STATUS_STYLES.draft;
}

/**
 * Check if a status label represents a cancelled/withdrawn terminal state.
 */
export function isCancelledStatus(status: string): boolean {
  const normalized = status.toLowerCase().replace(/[\s_-]+/g, '-');
  return normalized === 'cancelled' || normalized === 'withdrawn';
}

// =============================================================================
// PRIORITY COLORS - For urgency levels
// =============================================================================

export type PriorityType = 'low' | 'normal' | 'medium' | 'high' | 'critical' | 'urgent';

export interface PriorityStyle {
  label: string;
  bg: string;
  text: string;
  border: string;
  badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline';
}

export const PRIORITY_STYLES: Record<PriorityType, PriorityStyle> = {
  low: {
    label: 'Low',
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    border: 'border-border',
    badgeVariant: 'secondary',
  },
  normal: {
    label: 'Normal',
    bg: 'bg-secondary',
    text: 'text-secondary-foreground',
    border: 'border-secondary',
    badgeVariant: 'secondary',
  },
  medium: {
    label: 'Medium',
    bg: 'bg-accent',
    text: 'text-accent-foreground',
    border: 'border-accent',
    badgeVariant: 'outline',
  },
  high: {
    label: 'High',
    bg: 'bg-primary',
    text: 'text-primary-foreground',
    border: 'border-primary',
    badgeVariant: 'default',
  },
  critical: {
    label: 'Critical',
    bg: 'bg-destructive',
    text: 'text-destructive-foreground',
    border: 'border-destructive',
    badgeVariant: 'destructive',
  },
  urgent: {
    label: 'Urgent',
    bg: 'bg-destructive',
    text: 'text-destructive-foreground',
    border: 'border-destructive',
    badgeVariant: 'destructive',
  },
};

export function getPriorityStyle(priority: string): PriorityStyle {
  const normalizedPriority = priority.toLowerCase() as PriorityType;
  return PRIORITY_STYLES[normalizedPriority] || PRIORITY_STYLES.normal;
}

// =============================================================================
// DEPARTMENT COLORS - For department identification
// =============================================================================

export type DepartmentType =
  | 'it' | 'hr' | 'str' | 'fin' | 'qa' | 'qc'
  | 'she' | 'prod' | 'procurement' | 'governance';

export interface DepartmentStyle {
  bg: string;
  text: string;
  accent: string;
  border: string;
}

// All departments use the same primary color for consistency
export const DEPARTMENT_STYLES: Record<DepartmentType, DepartmentStyle> = {
  it: { bg: 'bg-primary', text: 'text-primary-foreground', accent: 'bg-primary/10', border: 'border-primary' },
  hr: { bg: 'bg-primary', text: 'text-primary-foreground', accent: 'bg-primary/10', border: 'border-primary' },
  str: { bg: 'bg-primary', text: 'text-primary-foreground', accent: 'bg-primary/10', border: 'border-primary' },
  fin: { bg: 'bg-primary', text: 'text-primary-foreground', accent: 'bg-primary/10', border: 'border-primary' },
  qa: { bg: 'bg-primary', text: 'text-primary-foreground', accent: 'bg-primary/10', border: 'border-primary' },
  qc: { bg: 'bg-primary', text: 'text-primary-foreground', accent: 'bg-primary/10', border: 'border-primary' },
  she: { bg: 'bg-primary', text: 'text-primary-foreground', accent: 'bg-primary/10', border: 'border-primary' },
  prod: { bg: 'bg-primary', text: 'text-primary-foreground', accent: 'bg-primary/10', border: 'border-primary' },
  procurement: { bg: 'bg-primary', text: 'text-primary-foreground', accent: 'bg-primary/10', border: 'border-primary' },
  governance: { bg: 'bg-primary', text: 'text-primary-foreground', accent: 'bg-primary/10', border: 'border-primary' },
};

export function getDepartmentStyle(dept: string): DepartmentStyle {
  const normalizedDept = dept.toLowerCase() as DepartmentType;
  return DEPARTMENT_STYLES[normalizedDept] || DEPARTMENT_STYLES.it;
}

// =============================================================================
// MODULE COLORS - For form categories and modules
// =============================================================================

export const MODULE_STYLES = {
  // Use consistent semantic colors for all modules
  primary: {
    bg: 'bg-primary',
    text: 'text-primary-foreground',
    accent: 'bg-primary/10',
    border: 'border-primary',
  },
  secondary: {
    bg: 'bg-secondary',
    text: 'text-secondary-foreground',
    accent: 'bg-secondary/50',
    border: 'border-secondary',
  },
  accent: {
    bg: 'bg-accent',
    text: 'text-accent-foreground',
    accent: 'bg-accent/50',
    border: 'border-accent',
  },
  muted: {
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    accent: 'bg-muted/50',
    border: 'border-border',
  },
} as const;

// =============================================================================
// CARD & SURFACE COLORS
// =============================================================================

export const SURFACE_STYLES = {
  card: 'bg-card text-card-foreground',
  cardHover: 'hover:bg-accent/50',
  muted: 'bg-muted text-muted-foreground',
  elevated: 'bg-card text-card-foreground shadow-md',
  interactive: 'bg-card text-card-foreground hover:bg-accent/50 cursor-pointer',
} as const;

// =============================================================================
// ICON COLORS - Use with Lucide icons
// =============================================================================

export const ICON_STYLES = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  primary: 'text-primary',
  destructive: 'text-destructive',
  success: 'text-primary', // Use primary for success states
  warning: 'text-accent-foreground',
} as const;

// =============================================================================
// WORKFLOW STATUS MAPPING - For SharePoint CurrentStatus values
// =============================================================================

import { normalizeStatusSlug, SLUG_TO_TYPE, type StatusType as SlugStatusType } from './status-slugs';

/**
 * Map a status value (legacy key, label, or slug) to a StatusStyle for UI rendering.
 *
 * The IT status keys are mapped via the canonical slug system in status-slugs.ts.
 * HR/STR statuses are mapped directly (they use different patterns per DEC-005).
 */
export function mapWorkflowStatus(status: string | undefined): StatusStyle {
  if (!status) return STATUS_STYLES.draft;

  // Try slug-based normalization first (handles IT statuses)
  const slug = normalizeStatusSlug(status);
  const slugType = SLUG_TO_TYPE[slug];

  if (slugType) {
    // Map slug lifecycle type to color-tokens StatusType
    switch (slugType) {
      case 'initial':     return STATUS_STYLES.draft;
      case 'in-progress': return STATUS_STYLES['in-progress'];
      case 'terminal': {
        // Terminal statuses need finer-grained mapping
        if (slug === 'approved' || slug === 'verified') return STATUS_STYLES.approved;
        if (slug === 'closed') return STATUS_STYLES.closed;
        if (slug === 'sent') return STATUS_STYLES.submitted;
        if (slug === 'active') return STATUS_STYLES['in-progress'];
        if (slug === 'withdrawn') return STATUS_STYLES.cancelled;
        return STATUS_STYLES.closed;
      }
    }
  }

  // Fallback for HR/STR/Generic statuses (not in IT slug system)
  const statusMap: Record<string, StatusType> = {
    // HR statuses
    'Draft': 'draft',
    'Submitted': 'submitted',
    'EndorsedHOD': 'pending',
    'ApprovedHR': 'approved',
    'ApprovedCOO': 'approved',
    'ApprovedED': 'approved',
    'Rejected': 'rejected',
    'Returned': 'returned',
    'Closed': 'closed',

    // STR statuses
    'PendingReview': 'in-review',
    'PendingApproval': 'pending',
    'Approved': 'approved',

    // Generic
    'Pending': 'pending',
    'InProgress': 'in-review',
    'In Progress': 'in-review',
    'Complete': 'completed',
    'Completed': 'completed',
    'Cancelled': 'cancelled',
    'Canceled': 'cancelled',
  };

  const mappedStatus = statusMap[status] ?? statusMap[slug];
  return mappedStatus ? STATUS_STYLES[mappedStatus] : STATUS_STYLES.draft;
}
