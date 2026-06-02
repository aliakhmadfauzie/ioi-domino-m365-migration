/**
 * Role Switcher Component
 * Allows users to switch between different roles for testing purposes
 * Displays the current role and provides a dropdown to change roles
 */

import { useState } from 'react';
import { 
  Shield, 
  User, 
  UserCheck, 
  Crown, 
  ChevronDown,
  Check,
  FlaskConical,
  type LucideIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useRoleAccess, type UserRole } from '@/hooks/use-platform';
import { useAutoRole } from '@/hooks/use-auto-role';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
  icon: LucideIcon;
  permissions: string[];
}

const roleOptions: RoleOption[] = [
  {
    value: 'initiator',
    label: 'Initiator',
    description: 'Standard user',
    icon: User,
    permissions: ['Submit forms', 'View own submissions', 'Track status'],
  },
  {
    value: 'manager',
    label: 'Manager',
    description: 'Team lead',
    icon: UserCheck,
    permissions: ['Approve team forms', 'View team submissions', 'Manager dashboard'],
  },
  {
    value: 'approver',
    label: 'Approver',
    description: 'Multi-level approver',
    icon: Shield,
    permissions: ['Multi-level approvals', 'Cross-department access', 'Batch approvals'],
  },
  {
    value: 'admin',
    label: 'Admin',
    description: 'Full access',
    icon: Crown,
    permissions: ['Full CRUD', 'Configure workflows', 'Manage users', 'Archive records'],
  },
];

interface RoleSwitcherProps {
  variant?: 'default' | 'compact' | 'hero';
  className?: string;
}

export function RoleSwitcher({ variant = 'default', className }: RoleSwitcherProps) {
  const { role, setRole } = useRoleAccess();
  const { isSuperAdmin } = useAutoRole();
  const [isOpen, setIsOpen] = useState(false);

  const currentRoleOption = roleOptions.find((r) => r.value === role) || roleOptions[0];
  const CurrentIcon = currentRoleOption.icon;

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setIsOpen(false);
    
    const roleOption = roleOptions.find((r) => r.value === newRole);
    toast.success(`Role changed to ${roleOption?.label}`, {
      description: roleOption?.description,
      duration: 2000,
    });
  };

  if (variant === 'hero') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            className={cn(
              'bg-white/20 border-white/30 text-white hover:bg-white/30 gap-2',
              className
            )}
          >
            <FlaskConical className="h-4 w-4" />
            <span className="hidden sm:inline">Role:</span>
            <span className="font-semibold">
              {isSuperAdmin ? 'Super Admin' : currentRoleOption.label}
            </span>
            <ChevronDown className={cn(
              'h-3.5 w-3.5 transition-transform duration-200',
              isOpen && 'rotate-180'
            )} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72">
          <DropdownMenuLabel className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
            <span>Switch Role (Testing)</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {roleOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = role === option.value;
            
            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleRoleChange(option.value)}
                className={cn(
                  'flex items-start gap-3 p-3 cursor-pointer',
                  isSelected && 'bg-accent'
                )}
              >
                <div className={cn(
                  'h-9 w-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{option.label}</span>
                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {option.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {option.permissions.slice(0, 2).map((perm: string) => (
                      <Badge 
                        key={perm} 
                        variant="secondary" 
                        className="text-[10px] px-1.5 py-0"
                      >
                        {perm}
                      </Badge>
                    ))}
                    {option.permissions.length > 2 && (
                      <Badge 
                        variant="outline" 
                        className="text-[10px] px-1.5 py-0"
                      >
                        +{option.permissions.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            );
          })}
          {isSuperAdmin && (
            <>
              <DropdownMenuSeparator />
              <div className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-b-md">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <Shield className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Super Admin Override Active</span>
                </div>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-500 mt-0.5">
                  Your account has elevated permissions regardless of selected role
                </p>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === 'compact') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn('gap-1.5 h-8', className)}
          >
            <CurrentIcon className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">
              {isSuperAdmin ? 'Super Admin' : currentRoleOption.label}
            </span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-xs">Switch Role</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {roleOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = role === option.value;
            
            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleRoleChange(option.value)}
                className={cn(
                  'flex items-center gap-2 cursor-pointer',
                  isSelected && 'bg-accent'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{option.label}</span>
                {isSelected && <Check className="h-4 w-4 ml-auto text-primary" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default variant - full card display
  return (
    <div className={cn('rounded-lg border border-border bg-card p-4', className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Role Switcher</span>
        </div>
        <Badge variant="outline" className="text-[10px]">
          Testing Mode
        </Badge>
      </div>
      
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-auto py-3"
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'h-10 w-10 rounded-lg flex items-center justify-center',
                isSuperAdmin 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                  : 'bg-primary/10 text-primary'
              )}>
                <CurrentIcon className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">
                  {isSuperAdmin ? 'Super Admin' : currentRoleOption.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isSuperAdmin ? 'Elevated permissions' : currentRoleOption.description}
                </p>
              </div>
            </div>
            <ChevronDown className={cn(
              'h-4 w-4 text-muted-foreground transition-transform duration-200',
              isOpen && 'rotate-180'
            )} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-[var(--radix-dropdown-menu-trigger-width)]">
          <DropdownMenuLabel>Select a Role</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {roleOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = role === option.value;
            
            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleRoleChange(option.value)}
                className={cn(
                  'flex items-center gap-3 p-3 cursor-pointer',
                  isSelected && 'bg-accent'
                )}
              >
                <div className={cn(
                  'h-8 w-8 rounded-lg flex items-center justify-center',
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-foreground">{option.label}</span>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
                {isSelected && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Permission summary */}
      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Current Permissions</p>
        <div className="flex flex-wrap gap-1">
          {currentRoleOption.permissions.map((perm: string) => (
            <Badge key={perm} variant="secondary" className="text-[10px] px-1.5 py-0">
              {perm}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Compact role switcher for headers/toolbars
 */
export function RoleSwitcherCompact({ className }: { className?: string }) {
  return <RoleSwitcher variant="compact" className={className} />;
}

/**
 * Hero-style role switcher for dark backgrounds
 */
export function RoleSwitcherHero({ className }: { className?: string }) {
  return <RoleSwitcher variant="hero" className={className} />;
}