import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  Server,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Bell,
  Search,
  ClipboardList,
  FileText,
  Settings,
  Heart,
  Briefcase,
  UserCheck,
  Award,
  LogOut,
  Shield,
  HelpCircle,
  Monitor,
  Key,
  HardDrive,
  Database,
  FileCode,
  AlertTriangle,
  Building2,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useUser } from '@/hooks/use-user';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import type { MainDBIT } from '@/generated/models/main-dbit-model';

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  badge?: number;
}

interface DepartmentModule {
  icon: LucideIcon;
  label: string;
  path: string;
}

interface Department {
  icon: LucideIcon;
  label: string;
  code: string;
  path: string;
  color: string;
  active: boolean;
  modules: DepartmentModule[];
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: ClipboardList, label: 'Manager Dashboard', path: '/manager-dashboard' },
  { icon: ClipboardList, label: 'Approvals', path: '/approvals' },
  { icon: FileText, label: 'My Submissions', path: '/my-submissions' },
];

const departments: Department[] = [
  {
    icon: Users,
    label: 'Human Resources',
    code: 'HR',
    path: '/hr',
    color: 'bg-[#1B5E20]',
    active: true,
    modules: [
      { icon: Briefcase, label: 'Recruitment', path: '/hr/recruitment' },
      { icon: Heart, label: 'Health & Compliance', path: '/hr/health' },
      { icon: UserCheck, label: 'Leave Management', path: '/hr/leave' },
      { icon: Award, label: 'Performance', path: '/hr/performance' },
      { icon: Users, label: 'Succession Planning', path: '/hr/succession' },
      { icon: LogOut, label: 'Employee Lifecycle', path: '/hr/lifecycle' },
      { icon: Shield, label: 'Compliance Records', path: '/hr/compliance' },
    ],
  },
  {
    icon: Server,
    label: 'Information Technology',
    code: 'IT',
    path: '/it',
    color: 'bg-[#2E7D32]',
    active: true,
    modules: [
      { icon: Monitor, label: 'IT Support', path: '/it/support' },
      { icon: Key, label: 'User & Access', path: '/it/access' },
      { icon: HardDrive, label: 'Hardware Inventory', path: '/it/hardware' },
      { icon: Database, label: 'SAP Management', path: '/it/sap' },
      { icon: FileCode, label: 'Documentation', path: '/it/documentation' },
      { icon: AlertTriangle, label: 'Disaster Recovery', path: '/it/disaster' },
    ],
  },
];

const pendingDepartments = [
  'Production', 'Quality Assurance', 'Quality Control', 'Warehouse',
  'Administration', 'Engineering', 'Finance', 'Logistics',
  'Marketing', 'Maintenance', 'Power BI', 'Plant Operations',
];

export default function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedDepts, setExpandedDepts] = useState<string[]>(['HR', 'IT']);
  const { data: user } = useUser();
  const { data: submissions = [] } = useMainDBITList();

  const pendingCount = submissions.filter((s: MainDBIT) => s.currentStatus === 'Submitted').length;

  const toggleDept = (code: string) => {
    setExpandedDepts((prev: string[]) =>
      prev.includes(code) ? prev.filter((c: string) => c !== code) : [...prev, code]
    );
  };

  const isModuleActive = (path: string) => location.pathname === path;
  const isDeptActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] as const }}
            className="flex-shrink-0 bg-[#1B5E20] flex flex-col overflow-hidden"
          >
            {/* Logo Header */}
            <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
              <Link to="/" className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IOI</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-semibold text-sm leading-tight">Acidchem Sdn Bhd</span>
                  <span className="text-white/60 text-[10px] uppercase tracking-wider">Enterprise Platform</span>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 md:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 px-3 py-4">
              {/* Quick Links */}
              <div className="space-y-1 mb-6">
                {navItems.map((item: NavItem) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  const showBadge = item.path === '/approvals' && pendingCount > 0;
                  return (
                    <Link key={item.path} to={item.path}>
                      <div
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-standard',
                          'hover:bg-white/15',
                          isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white'
                        )}
                      >
                        <Icon className="h-[18px] w-[18px]" />
                        <span className="flex-1">{item.label}</span>
                        {showBadge && (
                          <Badge className="bg-accent/500 text-white text-xs px-1.5 py-0 h-5 border-0">
                            {pendingCount}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>

              <Separator className="bg-white/10 mb-4" />

              {/* Departments - Active */}
              <div className="mb-6">
                <h3 className="px-3 mb-2 text-[10px] uppercase tracking-widest text-white/50 font-semibold">
                  Active Departments
                </h3>
                <div className="space-y-1">
                  {departments.map((dept: Department) => {
                    const Icon = dept.icon;
                    const isActive = isDeptActive(dept.path);
                    const isExpanded = expandedDepts.includes(dept.code);

                    return (
                      <Collapsible
                        key={dept.code}
                        open={isExpanded}
                        onOpenChange={() => toggleDept(dept.code)}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center">
                            <Link to={dept.path} className="flex-1">
                              <div
                                className={cn(
                                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-standard',
                                  'hover:bg-white/15',
                                  isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white'
                                )}
                              >
                                <div className={cn('h-7 w-7 rounded-lg flex items-center justify-center bg-white/20')}>
                                  <Icon className="h-4 w-4 text-white" />
                                </div>
                                <span className="flex-1 truncate">{dept.label}</span>
                              </div>
                            </Link>
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                          </div>

                          <CollapsibleContent>
                            <div className="ml-4 pl-4 border-l border-white/10 space-y-0.5 py-1">
                              {dept.modules.map((module: DepartmentModule) => {
                                const ModuleIcon = module.icon;
                                const moduleActive = isModuleActive(module.path);
                                return (
                                  <Link key={module.path} to={module.path}>
                                    <div
                                      className={cn(
                                        'flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-standard',
                                        'hover:bg-white/10',
                                        moduleActive
                                          ? 'bg-white/15 text-white font-medium'
                                          : 'text-white/70 hover:text-white'
                                      )}
                                    >
                                      <ModuleIcon className="h-4 w-4" />
                                      <span>{module.label}</span>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    );
                  })}
                </div>
              </div>

              <Separator className="bg-white/10 mb-4" />

              {/* Pending Departments */}
              <div>
                <h3 className="px-3 mb-2 text-[10px] uppercase tracking-widest text-white/50 font-semibold">
                  In Migration ({pendingDepartments.length})
                </h3>
                <div className="space-y-0.5">
                  {pendingDepartments.slice(0, 4).map((dept: string) => (
                    <div
                      key={dept}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/40 cursor-not-allowed"
                    >
                      <div className="h-6 w-6 rounded-md bg-white/5 flex items-center justify-center">
                        <Building2 className="h-3.5 w-3.5" />
                      </div>
                      <span className="truncate">{dept}</span>
                      <Badge variant="outline" className="text-[9px] border-white/20 text-white/40 ml-auto">
                        Soon
                      </Badge>
                    </div>
                  ))}
                  <div className="px-3 py-2 text-xs text-white/40">
                    +{pendingDepartments.length - 4} more departments
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* User Section */}
            <div className="p-3 border-t border-white/10">
              <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-white/10">
                <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.fullName || 'Loading...'}
                  </p>
                  <p className="text-xs text-white/60 truncate">Employee</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-background border-b border-border flex items-center px-4 gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-foreground"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search forms, submissions, departments..."
                className="pl-9 bg-muted/50 border-border focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            {pendingCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#9B2F23] rounded-full" />
            )}
          </Button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-[#F5F5F5]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}