/**
 * HR Module Layout - Modern Industrial Governance Design System
 * Shared layout components for all HR screens
 * 
 * Design Specs:
 * - Primary: #003366 (Navy)
 * - Secondary: #006a6a (Teal)
 * - Background: #f9f9fe (Off-white)
 * - Typography: 9px-10px for data, 16px-22px for headings
 * - Label Caps: 8px-9px, bold, uppercase, tracking-widest
 */

import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Building2,
  Search,
  Bell,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  Heart,
  Award,
  FileText,
  Network,
  Settings,
  HelpCircle,
  ArrowLeft,
  ClipboardList,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/use-user';
import { format } from 'date-fns';

// Design System Constants
export const HR_COLORS = {
  navy: '#003366',
  teal: '#006a6a',
  background: '#f9f9fe',
} as const;

// Sidebar Navigation Items
const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/hr' },
  { id: 'migration-workbench', label: 'Migration', icon: ClipboardList, href: '/hr/migration-workbench' },
  { id: 'org-chart', label: 'Org Chart', icon: Network, href: '/hr/org-chart' },
  { id: 'recruitment', label: 'Staffing', icon: Briefcase, href: '/hr/sr' },
  { id: 'interview-pipeline', label: 'Interview Pipeline', icon: Users, href: '/hr/interview-db' },
  { id: 'leave', label: 'Leave', icon: Calendar, href: '/hr/lve' },
  { id: 'health', label: 'Health', icon: Heart, href: '/hr/healthinfo' },
  { id: 'performance', label: 'Performance', icon: Award, href: '/hr/paf' },
  { id: 'records', label: 'Records', icon: Users, href: '/hr/epdu' },
  { id: 'documents', label: 'Documents', icon: FileText, href: '/hr/ndf' },
];

interface HRLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: ReactNode;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  searchValue?: string;
  pendingCount?: number;
  dataSource?: string;
  recordCount?: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function HRLayout({
  children,
  title,
  subtitle,
  breadcrumbs = [{ label: 'HR', href: '/hr' }],
  actions,
  showSearch = false,
  searchPlaceholder = 'Search...',
  onSearch,
  searchValue = '',
  pendingCount = 0,
  dataSource,
  recordCount,
  onRefresh,
  isRefreshing = false,
}: HRLayoutProps) {
  const { data: user, isLoading: userLoading } = useUser();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchValue);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <div className="min-h-screen bg-[#f9f9fe]">
      {/* Fixed Top Bar - 72px Navy */}
      <header className="sticky top-0 z-50 h-[72px] bg-[#003366] text-white shadow-md">
        <div className="h-full max-w-[1920px] mx-auto px-4 flex items-center justify-between gap-4">
          {/* Left: Suite Title & Nav */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-white/80 hover:text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-[#00a6a6]" />
              <div>
                <h1 className="text-sm font-bold tracking-tight">IOI ACIDCHEM</h1>
                <p className="text-[9px] uppercase tracking-widest text-white/60">Enterprise Suite</p>
              </div>
            </div>
            <nav className="hidden lg:flex items-center gap-1 ml-8">
              {SIDEBAR_ITEMS.slice(0, 5).map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href !== '/hr' && location.pathname.startsWith(item.href));
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={cn(
                      'h-8 px-3 text-[10px] font-bold uppercase tracking-wide',
                      isActive
                        ? 'text-white bg-white/15 hover:bg-white/20'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    )}
                    asChild
                  >
                    <Link to={item.href}>{item.label}</Link>
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Center: Search */}
          {showSearch && (
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={handleSearch}
                  className="h-9 pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-xs focus:bg-white/15 focus:border-white/30"
                />
              </div>
            </div>
          )}

          {/* Right: User & Actions */}
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-white/70 hover:text-white hover:bg-white/10 relative">
                    <Bell className="h-4 w-4" />
                    {pendingCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[8px] font-bold flex items-center justify-center">
                        {pendingCount > 9 ? '9+' : pendingCount}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-[10px]">
                  {pendingCount} pending approvals
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="h-8 w-[1px] bg-white/20" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-[#006a6a] flex items-center justify-center font-bold text-xs">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="hidden xl:block text-right">
                {userLoading ? (
                  <Skeleton className="h-4 w-20 bg-white/20" />
                ) : (
                  <p className="text-[10px] font-semibold">{user?.fullName || 'User'}</p>
                )}
                <p className="text-[8px] text-white/60 uppercase tracking-wide">HR Admin</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Secondary Breadcrumb Bar - 68px */}
      <div className="h-[68px] bg-card border-b border-border/50 sticky top-[72px] z-40">
        <div className="h-full max-w-[1920px] mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              {breadcrumbs.map((crumb, idx) => (
                <span key={idx} className="flex items-center gap-2">
                  {crumb.href ? (
                    <Link to={crumb.href} className="hover:text-foreground transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-foreground">{crumb.label}</span>
                  )}
                  {idx < breadcrumbs.length - 1 && <ChevronRight className="h-3 w-3" />}
                </span>
              ))}
            </div>
            {/* Page Title (Mobile) */}
            <div className="lg:hidden ml-4">
              <h2 className="text-sm font-bold text-foreground">{title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-[9px] font-bold uppercase tracking-wide gap-1"
                onClick={onRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={cn('h-3 w-3', isRefreshing && 'animate-spin')} />
                Refresh
              </Button>
            )}
            {dataSource && (
              <Badge variant="outline" className="text-[9px] font-mono px-2 py-0.5">
                SharePoint: {dataSource}
              </Badge>
            )}
            {typeof recordCount === 'number' && (
              <Badge variant="outline" className="text-[9px] font-mono px-2 py-0.5 border-[#006a6a] text-[#006a6a]">
                {recordCount} Records
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex">
        {/* Collapsible Sidebar - 64px collapsed / 256px expanded */}
        <aside
          className={cn(
            'hidden lg:flex flex-col border-r border-border/50 bg-card shrink-0 transition-all duration-200 sticky top-[140px] h-[calc(100vh-140px)]',
            sidebarCollapsed ? 'w-16' : 'w-64'
          )}
        >
          {/* Sidebar Toggle */}
          <div className="p-2 border-b border-border/50">
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-8 justify-center"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href ||
                (item.href !== '/hr' && location.pathname.startsWith(item.href));
              
              return (
                <TooltipProvider key={item.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-sm text-[10px] font-semibold transition-colors',
                          isActive
                            ? 'bg-[#003366] text-white'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {!sidebarCollapsed && (
                          <span className="uppercase tracking-wide truncate">{item.label}</span>
                        )}
                      </Link>
                    </TooltipTrigger>
                    {sidebarCollapsed && (
                      <TooltipContent side="right" className="text-[10px]">
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-2 border-t border-border/50 space-y-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-sm text-[10px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full',
                  )}>
                    <Settings className="h-4 w-4 shrink-0" />
                    {!sidebarCollapsed && <span className="uppercase tracking-wide">Settings</span>}
                  </button>
                </TooltipTrigger>
                {sidebarCollapsed && (
                  <TooltipContent side="right" className="text-[10px]">
                    Settings
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-sm text-[10px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full',
                  )}>
                    <HelpCircle className="h-4 w-4 shrink-0" />
                    {!sidebarCollapsed && <span className="uppercase tracking-wide">Help</span>}
                  </button>
                </TooltipTrigger>
                {sidebarCollapsed && (
                  <TooltipContent side="right" className="text-[10px]">
                    Help
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 max-w-[1920px] p-4 overflow-x-hidden">
          {/* Page Header with Actions */}
          {(title || actions) && (
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-foreground hidden lg:block">{title}</h2>
                {subtitle && (
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
          )}
          
          {children}
        </main>
      </div>

      {/* Fixed Bottom Status Bar - 32px */}
      <footer className="fixed bottom-0 left-0 right-0 h-8 bg-card border-t border-border/50 z-40">
        <div className="h-full max-w-[1920px] mx-auto px-4 flex items-center justify-between text-[9px] text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Connected
            </span>
            <span>Last Sync: {format(new Date(), 'HH:mm:ss')}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>IOI Acidchem Enterprise Suite v1.0</span>
            <span>HR Module</span>
          </div>
        </div>
      </footer>

      {/* Bottom padding for fixed footer */}
      <div className="h-8" />
    </div>
  );
}

// Subcomponents for consistent styling
export function HRSectionHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn(
      'text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2',
      className
    )}>
      {children}
    </h3>
  );
}

export function HRCard({ 
  children, 
  className,
  hover = true,
}: { 
  children: ReactNode; 
  className?: string;
  hover?: boolean;
}) {
  return (
    <div className={cn(
      'border border-border/50 rounded-sm shadow-sm bg-card',
      hover && 'hover:border-[#006a6a]/30 transition-colors',
      className
    )}>
      {children}
    </div>
  );
}

export function HRStatusBadge({ 
  status, 
  className 
}: { 
  status: 'pending' | 'approved' | 'rejected' | 'draft' | 'review' | 'compliant' | 'warning' | 'expired';
  className?: string;
}) {
  const styles = {
    pending: 'bg-warning/10 text-warning border-warning/20',
    approved: 'bg-success/10 text-success border-success/20',
    rejected: 'bg-destructive/10 text-destructive border-destructive/20',
    draft: 'bg-muted text-muted-foreground border-border',
    review: 'bg-primary/10 text-primary border-primary/20',
    compliant: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    expired: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  const labels = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    draft: 'Draft',
    review: 'In Review',
    compliant: 'Compliant',
    warning: 'Warning',
    expired: 'Expired',
  };

  return (
    <Badge
      variant="outline"
      className={cn('text-[8px] px-1.5 py-0 h-4 border', styles[status], className)}
    >
      {labels[status]}
    </Badge>
  );
}

export function HRMetricCard({
  label,
  value,
  trend,
  trendLabel,
  icon: Icon,
  iconColor = 'text-[#003366]',
  onClick,
}: {
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon: React.ElementType;
  iconColor?: string;
  onClick?: () => void;
}) {
  return (
    <HRCard className={cn(onClick && 'cursor-pointer group')} hover={!!onClick}>
      <div className="p-4" onClick={onClick}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
              {label}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">{value}</span>
              {typeof trend === 'number' && (
                <Badge className={cn(
                  'text-[8px] px-1.5 py-0 h-4 border-0',
                  trend >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                )}>
                  {trend >= 0 ? '+' : ''}{trend}%
                </Badge>
              )}
            </div>
            {trendLabel && (
              <p className="text-[9px] text-muted-foreground mt-1">{trendLabel}</p>
            )}
          </div>
          <div className={cn(
            'h-10 w-10 rounded flex items-center justify-center',
            onClick ? 'bg-[#003366]/10 group-hover:bg-[#003366]/20 transition-colors' : 'bg-muted'
          )}>
            <Icon className={cn('h-5 w-5', iconColor)} />
          </div>
        </div>
      </div>
    </HRCard>
  );
}

// Animation variants for consistent motion
export const hrContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
} as const;

export const hrItemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
} as const;
