/**
 * Role Indicator Component
 * Displays the current user's role for the session
 * Shows on all screens to indicate what permissions the user has
 */

import { Shield, User, UserCheck, Crown, type LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRoleAccess, type UserRole } from '@/hooks/use-platform';
import { useAutoRole } from '@/hooks/use-auto-role';
import { cn } from '@/lib/utils';

interface RoleConfig {
  label: string;
  description: string;
  icon: LucideIcon;
  className: string;
  badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline';
}

const roleConfigs: Record<UserRole, RoleConfig> = {
  initiator: {
    label: 'Initiator',
    description: 'Can submit forms and view own submissions',
    icon: User,
    className: 'bg-secondary text-secondary-foreground',
    badgeVariant: 'secondary',
  },
  manager: {
    label: 'Manager',
    description: 'Can approve team forms and view team submissions',
    icon: UserCheck,
    className: 'bg-primary text-primary-foreground',
    badgeVariant: 'default',
  },
  approver: {
    label: 'Approver',
    description: 'Multi-level approval authority across departments',
    icon: Shield,
    className: 'bg-accent text-accent-foreground',
    badgeVariant: 'outline',
  },
  admin: {
    label: 'Admin',
    description: 'Full CRUD access, configure workflows, manage users',
    icon: Crown,
    className: 'bg-destructive text-destructive-foreground',
    badgeVariant: 'destructive',
  },
};

interface RoleIndicatorProps {
  variant?: 'badge' | 'pill' | 'minimal';
  showTooltip?: boolean;
  className?: string;
}

export function RoleIndicator({ 
  variant = 'badge', 
  showTooltip = true,
  className 
}: RoleIndicatorProps) {
  const { role } = useRoleAccess();
  const { isSuperAdmin } = useAutoRole();
  
  const config = roleConfigs[role];
  const Icon = config.icon;
  
  const displayLabel = isSuperAdmin ? 'Super Admin' : config.label;
  const displayDescription = isSuperAdmin 
    ? 'Full platform access with elevated permissions' 
    : config.description;

  const content = (
    <Badge 
      variant={isSuperAdmin ? 'destructive' : config.badgeVariant}
      className={cn(
        'gap-1.5 font-medium transition-all duration-200',
        variant === 'minimal' && 'px-2 py-0.5 text-xs',
        variant === 'pill' && 'rounded-full px-3',
        isSuperAdmin && 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500',
        className
      )}
    >
      <Icon className={cn(
        'shrink-0',
        variant === 'minimal' ? 'h-3 w-3' : 'h-3.5 w-3.5'
      )} />
      <span className="uppercase tracking-wide text-[10px] font-semibold">
        {displayLabel}
      </span>
    </Badge>
  );

  if (!showTooltip) {
    return content;
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[200px]">
          <p className="font-medium">{displayLabel}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{displayDescription}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Compact role indicator for tight spaces (e.g., headers, toolbars)
 */
export function RoleIndicatorCompact({ className }: { className?: string }) {
  return <RoleIndicator variant="minimal" className={className} />;
}

/**
 * Role indicator with full context for dashboards
 */
export function RoleIndicatorFull({ className }: { className?: string }) {
  const { role, canApprove, canAdmin, canManage } = useRoleAccess();
  const { isSuperAdmin } = useAutoRole();
  const config = roleConfigs[role];
  const Icon = config.icon;

  return (
    <div className={cn('flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border', className)}>
      <div className={cn(
        'h-10 w-10 rounded-lg flex items-center justify-center',
        isSuperAdmin ? 'bg-emerald-600 text-white' : config.className
      )}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground text-sm">
          {isSuperAdmin ? 'Super Admin' : config.label}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {isSuperAdmin ? 'Full platform access' : config.description}
        </p>
      </div>
      <div className="flex flex-col gap-1 text-[10px] font-medium">
        {canApprove && (
          <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary">Approve</span>
        )}
        {canManage && (
          <span className="px-1.5 py-0.5 rounded bg-accent/50 text-accent-foreground">Manage</span>
        )}
        {canAdmin && (
          <span className="px-1.5 py-0.5 rounded bg-destructive/10 text-destructive">Admin</span>
        )}
      </div>
    </div>
  );
}