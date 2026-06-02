/**
 * HR Breadcrumb Navigation Component
 * Provides consistent breadcrumb navigation across all HR subpages
 */

import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HRBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  variant?: 'default' | 'compact' | 'dark';
}

export function HRBreadcrumb({ items, className, variant = 'default' }: HRBreadcrumbProps) {
  const isCompact = variant === 'compact';
  const isDark = variant === 'dark';

  return (
    <Breadcrumb className={cn('', className)}>
      <BreadcrumbList
        className={cn(
          'flex-wrap',
          isCompact && 'text-[10px] gap-1 sm:gap-1.5',
          isDark && 'text-white/70'
        )}
      >
        {/* Home */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              to="/"
              className={cn(
                'flex items-center gap-1 transition-colors',
                isDark ? 'hover:text-white' : 'hover:text-foreground',
                isCompact && 'text-[10px]'
              )}
            >
              <Home className={cn('h-3 w-3', isCompact && 'h-2.5 w-2.5')} />
              <span className="sr-only sm:not-sr-only">Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className={cn('h-3 w-3', isCompact && 'h-2.5 w-2.5', isDark && 'text-white/50')} />
        </BreadcrumbSeparator>

        {/* HR */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              to="/hr"
              className={cn(
                'transition-colors',
                isDark ? 'hover:text-white' : 'hover:text-foreground',
                isCompact && 'text-[10px]'
              )}
            >
              HR
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className={cn('h-3 w-3', isCompact && 'h-2.5 w-2.5', isDark && 'text-white/50')} />
        </BreadcrumbSeparator>

        {/* Dynamic items */}
        {items.map((item, index) => (
          <BreadcrumbItem key={item.label}>
            {index < items.length - 1 ? (
              <>
                <BreadcrumbLink asChild>
                  <Link
                    to={item.href || '#'}
                    className={cn(
                      'transition-colors',
                      isDark ? 'hover:text-white' : 'hover:text-foreground',
                      isCompact && 'text-[10px]'
                    )}
                  >
                    {item.label}
                  </Link>
                </BreadcrumbLink>
                <BreadcrumbSeparator>
                  <ChevronRight className={cn('h-3 w-3 ml-1.5', isCompact && 'h-2.5 w-2.5', isDark && 'text-white/50')} />
                </BreadcrumbSeparator>
              </>
            ) : (
              <BreadcrumbPage
                className={cn(
                  isDark && 'text-white',
                  isCompact && 'text-[10px]'
                )}
              >
                {item.label}
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

/**
 * Compact breadcrumb for use in dark headers (like the navy header bar)
 */
export function HRBreadcrumbCompact({ items }: { items: BreadcrumbItem[] }) {
  return <HRBreadcrumb items={items} variant="dark" className="mb-0.5" />;
}

export default HRBreadcrumb;