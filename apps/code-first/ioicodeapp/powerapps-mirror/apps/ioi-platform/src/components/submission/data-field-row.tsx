import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* =============================================================================
 * DataFieldRow — clean label/value pair with proper typographic hierarchy
 *
 * - Labels de-emphasized: 11px muted uppercase
 * - Values emphasized: 14px medium charcoal
 * - No underlines — spacing handles separation
 * - Auto-hides when value is null/undefined/empty/dash
 * ============================================================================= */

interface DataFieldRowProps {
  label: string;
  value?: string | number | null;
  icon?: React.ElementType;
  className?: string;
  /** Placeholder shown when value is empty — defaults to `—` */
  placeholder?: string;
  /** Whether to always render even when value is empty */
  alwaysRender?: boolean;
}

export function DataFieldRow({ label, value, icon: Icon, className, placeholder = '—', alwaysRender }: DataFieldRowProps) {
  const isEmpty = value === null || value === undefined || value === '' || value === '—' || value === '-';
  if (isEmpty && !alwaysRender) return null;

  return (
    <div className={cn('space-y-0.5', className)}>
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="h-3 w-3 text-muted-foreground/50 shrink-0" />}
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
          {label}
        </span>
      </div>
      <p className={cn(
        'text-sm leading-snug',
        isEmpty ? 'text-muted-foreground/40 italic' : 'font-medium text-foreground',
      )}>
        {isEmpty ? placeholder : String(value)}
      </p>
    </div>
  );
}

/* =============================================================================
 * DataFieldGrid — 2-column responsive grid of DataFieldRow items
 * Fields with empty values are automatically hidden.
 * ============================================================================= */

interface DataFieldGridProps {
  children: ReactNode;
  className?: string;
  columns?: 2 | 3;
}

export function DataFieldGrid({ children, className, columns = 2 }: DataFieldGridProps) {
  return (
    <div className={cn(
      'grid gap-x-6 gap-y-3',
      columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      className,
    )}>
      {children}
    </div>
  );
}
