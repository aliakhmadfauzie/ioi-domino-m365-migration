import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Search, Bell, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface IGTopbarProps {
  showSearch?: boolean;
}

export function IGTopbar({ showSearch = true }: IGTopbarProps) {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const breadcrumbLabels: Record<string, string> = {
    hr: 'Human Resources',
    it: 'IT Services',
    str: 'Store Requisition',
    governance: 'Corporate Governance',
    directory: 'Directory',
    'org-structure': 'Org Structure',
    lifecycle: 'Employee Lifecycle',
    'exit-tracking': 'Exit Tracking',
    hardware: 'Hardware Inventory',
    'service-desk': 'Service Desk',
    assets: 'Asset Management',
    audit: 'Audit Monitoring',
    policies: 'Policy Management',
    compliance: 'Compliance Checklists',
  };

  return (
    <header className="ig-topbar" style={{ height: '48px' }}>
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="flex items-center justify-center w-7 h-7 rounded bg-white/10">
          <span className="ig-heading-md text-white">IOI</span>
        </div>
        <span className="ig-label-caps text-white/80 hidden md:block">Enterprise Suite</span>
      </Link>

      {/* Breadcrumbs */}
      <div className="ig-breadcrumbs ml-4 hidden lg:flex">
        <Link to="/" className="text-white/60 hover:text-white">
          Home
        </Link>
        {pathSegments.map((segment: string, idx: number) => (
          <span key={segment} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3 text-white/40" />
            {idx === pathSegments.length - 1 ? (
              <span className="text-white font-semibold">
                {breadcrumbLabels[segment] || segment}
              </span>
            ) : (
              <Link
                to={`/${pathSegments.slice(0, idx + 1).join('/')}`}
                className="text-white/60 hover:text-white"
              >
                {breadcrumbLabels[segment] || segment}
              </Link>
            )}
          </span>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      {showSearch && (
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-white/40" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-52 h-8 pl-8 bg-white/10 border-white/20 text-white placeholder:text-white/40 text-xs focus:bg-white/15 focus:border-white/30"
          />
        </div>
      )}

      {/* Notifications */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-white/70 hover:text-white hover:bg-white/10 relative"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#ba1a1a] rounded-full" />
      </Button>

      {/* Settings */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-white/70 hover:text-white hover:bg-white/10"
      >
        <Settings className="h-4 w-4" />
      </Button>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-2 text-white/80 hover:text-white hover:bg-white/10"
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <User className="h-3.5 w-3.5" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="ig-data-text">
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="ig-data-text">
            Preferences
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="ig-data-text text-[#ba1a1a]">
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}