import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  Network,
  UserMinus,
  Monitor,
  Headphones,
  Package,
  FileText,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Shield,
  FileSearch,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  group?: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Dashboard', path: '/', group: 'Main' },
  { icon: Users, label: 'Directory', path: '/hr/directory', group: 'HR' },
  { icon: Network, label: 'Org Structure', path: '/hr/org-structure', group: 'HR' },
  { icon: UserMinus, label: 'Exit Tracking', path: '/hr/exit-tracking', group: 'HR' },
  { icon: Monitor, label: 'Hardware', path: '/it/hardware', group: 'IT' },
  { icon: Headphones, label: 'Service Desk', path: '/it/service-desk', group: 'IT' },
  { icon: Package, label: 'Assets', path: '/it/assets', group: 'IT' },
  { icon: ClipboardList, label: 'Requisitions', path: '/str/forms', group: 'STR' },
  { icon: FileText, label: 'Reports', path: '/str/reports', group: 'STR' },
  { icon: Shield, label: 'Governance Hub', path: '/governance', group: 'GOV' },
  { icon: FileSearch, label: 'Audit Monitoring', path: '/governance/audit', group: 'GOV' },
];

const groups = ['Main', 'HR', 'IT', 'STR', 'GOV'];

interface IGSidenavProps {
  expanded: boolean;
  onToggle: () => void;
}

export function IGSidenav({ expanded, onToggle }: IGSidenavProps) {
  const location = useLocation();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'ig-sidenav transition-all duration-200',
          expanded && 'expanded'
        )}
      >
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggle}
          className="absolute top-2 -right-3 z-50 w-6 h-6 rounded-full bg-muted border border-border text-muted-foreground hover:text-white hover:bg-muted"
        >
          {expanded ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </Button>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 mt-8">
          {groups.map((group: string) => (
            <div key={group}>
              {expanded && group !== 'Main' && (
                <div className="ig-label-caps text-muted-foreground px-3 py-2 mt-2">
                  {group}
                </div>
              )}
              {navItems
                .filter((item: NavItem) => item.group === group)
                .map((item: NavItem) => {
                  const Icon = item.icon;
                  const isActive = item.path === '/' 
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path);

                  const navButton = (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        'ig-sidenav-item',
                        isActive && 'active',
                        !expanded && 'justify-center px-0'
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {expanded && (
                        <span className="ig-data-text truncate">{item.label}</span>
                      )}
                    </Link>
                  );

                  if (!expanded) {
                    return (
                      <Tooltip key={item.path}>
                        <TooltipTrigger asChild>
                          {navButton}
                        </TooltipTrigger>
                        <TooltipContent side="right" className="ig-data-text">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return navButton;
                })}
            </div>
          ))}
        </nav>
      </aside>
    </TooltipProvider>
  );
}