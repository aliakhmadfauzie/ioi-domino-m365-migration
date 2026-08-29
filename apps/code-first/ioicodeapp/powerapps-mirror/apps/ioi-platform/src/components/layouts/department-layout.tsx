// Department Layout - Isolated sidebar navigation for each department

import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  CheckCircle,
  Archive,
  Search,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronRight,
  Building2,
  Menu,
  X,
  Bell,
  Key,
  Monitor,
  HardDrive,
  Database,
  FileCode,
  AlertTriangle,
  Server,
  Briefcase,
  Heart,
  UserCheck,
  Award,
  Shield,
  LayoutDashboard,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GlobalSearch } from '@/components/global-search';
import { RouteLoadingWrapper } from '@/components/route-loading-wrapper';
import { useUser } from '@/hooks/use-user';
import { useLogout, useCurrentDepartment, useRoleAccess, type UserRole } from '@/hooks/use-platform';
import { getDepartment } from '@/config/departments';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import { cn } from '@/lib/utils';
import { getDepartmentBasePath } from '@/lib/navigation';
import type { LucideIcon } from 'lucide-react';

interface DepartmentLayoutProps {
  departmentCode: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: number;
  roles?: UserRole[];
}

interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
  collapsible?: boolean;
}

const moduleIcons: Record<string, LucideIcon> = {
  // IT Modules
  M1: Key,
  M2: Monitor,
  M3: HardDrive,
  M4: Database,
  M5: FileCode,
  M6: AlertTriangle,
  M7: Server,
  // HR Modules
  'HR-M1': Briefcase,
  'HR-M2': Heart,
  'HR-M3': UserCheck,
  'HR-M4': Award,
  'HR-M5': Users,
  'HR-M6': Shield,
};

const roleLabels: Record<UserRole, string> = {
  initiator: 'Employee',
  manager: 'Manager',
  approver: 'Approver',
  admin: 'Administrator',
};

function getNavigationItems(departmentCode: string, basePath: string, role: UserRole): NavSection[] {
  const department = getDepartment(departmentCode);
  if (!department) return [];

  const sections: NavSection[] = [
    {
      id: 'main',
      label: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Home, path: `/${basePath}` },
        { id: 'approvals', label: 'Pending Tasks', icon: CheckCircle, path: `/${basePath}/approvals`, badge: 5, roles: ['manager', 'approver', 'admin'] },
        { id: 'submissions', label: 'My Submissions', icon: Archive, path: `/${basePath}/submissions` },
      ],
    },
    {
      id: 'modules',
      label: 'Modules',
      collapsible: true,
      items: (department.modules ?? []).map(module => ({
        id: module.id,
        label: module.name,
        icon: moduleIcons[module.code] || Building2,
        path: module.path,
      })),
    },
  ];

  // Add admin section for managers and admins
  if (role === 'manager' || role === 'admin') {
    sections.push({
      id: 'admin',
      label: 'Administration',
      items: [
        { id: 'manager-dashboard', label: 'Manager Dashboard', icon: LayoutDashboard, path: `/${basePath}/manager-dashboard`, roles: ['manager', 'admin'] },
        { id: 'users', label: 'User Management', icon: Users, path: '/admin', roles: ['admin'] },
      ],
    });
  }

  // Add support section
  sections.push({
    id: 'support',
    label: 'Support',
    items: [
      { id: 'help', label: 'Help & Support', icon: HelpCircle, path: `/${basePath}/help` },
    ],
  });

  // Filter items by role
  return sections.map(section => ({
    ...section,
    items: section.items.filter(item => !item.roles || item.roles.includes(role)),
  })).filter(section => section.items.length > 0);
}

/**
 * Main export - wraps the layout content with RouteLoadingWrapper
 * This ensures SDK is initialized before any hooks (useUser, etc.) are called
 */
export default function DepartmentLayout({ departmentCode }: DepartmentLayoutProps) {
  return (
    <RouteLoadingWrapper message="Loading workspace...">
      <DepartmentLayoutContent departmentCode={departmentCode} />
    </RouteLoadingWrapper>
  );
}

/**
 * Internal layout content - only rendered after SDK is initialized
 */
function DepartmentLayoutContent({ departmentCode }: DepartmentLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useUser();
  const { logout } = useLogout();
  const { role, setRole } = useRoleAccess();
  const { setCurrentDepartment } = useCurrentDepartment();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>(['modules']);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mainContentRef = useRef<HTMLElement>(null);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
    mainContentRef.current?.scrollTo(0, 0);
  }, [location.pathname]);
  const department = getDepartment(departmentCode);

  const basePath = getDepartmentBasePath(departmentCode);
  const navSections = getNavigationItems(departmentCode, basePath, role);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleExitDepartment = () => {
    setCurrentDepartment(null);
    navigate('/');
  };

  const isActivePath = (path: string) => {
    if (path === `/${basePath}`) {
      return location.pathname === `/${basePath}` || location.pathname === `/${basePath}/`;
    }
    return location.pathname.startsWith(path);
  };

  const userInitials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-white border-r border-border transition-all duration-300 z-40',
          sidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border bg-[#003366]">
          {sidebarOpen && (
            <Link to={`/${basePath}`} className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white leading-tight">IOI {department?.name || departmentCode}</h1>
                <p className="text-[10px] text-white/70">Department Portal</p>
              </div>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-white/80 hover:text-white hover:bg-white/10"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Global Search - only when sidebar is open */}
        {sidebarOpen && (
          <div className="p-3 border-b border-border">
            <GlobalSearch />
          </div>
        )}

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="px-3 space-y-6">
            {navSections.map(section => (
              <div key={section.id}>
                {sidebarOpen && (
                  <div
                    className={cn(
                      'flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider',
                      section.collapsible && 'cursor-pointer hover:text-foreground'
                    )}
                    onClick={() => section.collapsible && toggleSection(section.id)}
                  >
                    <span>{section.label}</span>
                    {section.collapsible && (
                      <motion.div
                        animate={{ rotate: expandedSections.includes(section.id) ? 0 : -90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </motion.div>
                    )}
                  </div>
                )}

                <AnimatePresence initial={false}>
                  {(!section.collapsible || expandedSections.includes(section.id) || !sidebarOpen) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-1 mt-1">
                        {section.items.map(item => {
                          const Icon = item.icon;
                          const isActive = isActivePath(item.path);

                          return (
                            <Link
                              key={item.id}
                              to={item.path}
                              className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150',
                                isActive
                                  ? 'bg-[#003366]/10 text-[#003366] font-medium'
                                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                !sidebarOpen && 'justify-center px-0'
                              )}
                              title={!sidebarOpen ? item.label : undefined}
                            >
                              <Icon className={cn('h-5 w-5 shrink-0', isActive && 'text-[#003366]')} />
                              {sidebarOpen && (
                                <>
                                  <span className="text-sm truncate flex-1">{item.label}</span>
                                  {item.badge && item.badge > 0 && (
                                    <Badge className="bg-[#003366] text-white text-[10px] h-5 min-w-5 justify-center">
                                      {item.badge}
                                    </Badge>
                                  )}
                                </>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* Exit Department Link */}
            {sidebarOpen && (
              <div className="pt-4 border-t border-border">
                <button
                  onClick={handleExitDepartment}
                  className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                  <span className="text-sm">All Departments</span>
                </button>
              </div>
            )}
          </nav>
        </ScrollArea>

        {/* User Profile */}
        <div className="border-t border-border p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  'w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors',
                  !sidebarOpen && 'justify-center'
                )}
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={undefined} />
                  <AvatarFallback className="bg-[#003366] text-white text-sm font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                {sidebarOpen && (
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.fullName || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {roleLabels[role]}
                    </p>
                  </div>
                )}
                {sidebarOpen && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                  <p className="text-xs text-muted-foreground">{user?.userPrincipalName}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Switch Role (Demo)</DropdownMenuLabel>
              {(['initiator', 'manager', 'approver', 'admin'] as UserRole[]).map((r) => (
                <DropdownMenuItem
                  key={r}
                  onClick={() => setRole(r)}
                  className={cn(role === r && 'bg-[#003366]/10 text-[#003366]')}
                >
                  <span className="flex-1">{roleLabels[r]}</span>
                  {role === r && <CheckCircle className="h-4 w-4" />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(`/${basePath}/settings`)}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#003366] z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-white font-semibold">IOI {department?.name || departmentCode}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-white/20 text-white text-sm">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{user?.fullName}</p>
                  <p className="text-xs text-muted-foreground">{roleLabels[role]}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExitDepartment}>
                <ExternalLink className="h-4 w-4 mr-2" />
                All Departments
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/40 z-50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-background z-50 flex flex-col border-r border-border"
            >
              <div className="h-14 flex items-center justify-between px-4 bg-[#003366]">
                <span className="text-white font-semibold">IOI {department?.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <ScrollArea className="flex-1 py-4">
                <nav className="px-3 space-y-4">
                  {navSections.map(section => (
                    <div key={section.id}>
                      <div className="px-3 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {section.label}
                      </div>
                      <div className="space-y-1 mt-1">
                        {section.items.map(item => {
                          const Icon = item.icon;
                          const isActive = isActivePath(item.path);

                          return (
                            <Link
                              key={item.id}
                              to={item.path}
                              onClick={() => setMobileMenuOpen(false)}
                              className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg',
                                isActive
                                  ? 'bg-[#003366]/10 text-[#003366] font-medium'
                                  : 'text-muted-foreground hover:bg-muted'
                              )}
                            >
                              <Icon className="h-5 w-5" />
                              <span className="text-sm">{item.label}</span>
                              {item.badge && item.badge > 0 && (
                                <Badge className="bg-[#003366] text-white text-[10px] ml-auto">
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-border">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleExitDepartment();
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-muted-foreground hover:bg-muted"
                    >
                      <ExternalLink className="h-5 w-5" />
                      <span className="text-sm">All Departments</span>
                    </button>
                  </div>
                </nav>
              </ScrollArea>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main 
        ref={mainContentRef}
        className="flex-1 min-w-0 lg:pt-0 pt-14 pb-16 lg:pb-0 overflow-y-auto"
      >
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        variant="department"
        departmentCode={departmentCode}
        pendingTasks={5}
      />
    </div>
  );
}
