// Department Hub - Welcome Landing Page for IOI Acidchem Enterprise Platform
// Redesigned with refined industrial governance aesthetic
// Enhanced with proper loading states and recent submissions display

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  Monitor,
  Users,
  Factory,
  Beaker,
  Warehouse,
  Truck,
  DollarSign,
  BarChart3,
  Wrench,
  Leaf,
  HardHat,
  Shield,
  FileText,
  ChevronRight,
  Sparkles,
  Activity,
  CheckCircle,
  Clock,
  ArrowRight,
  Layers,
  ClipboardList,
  Send,
  Settings,
  Plus,
  Eye,
  Lock,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DEPARTMENTS, type DepartmentCode, type Department } from '@/config/departments';
import { cn } from '@/lib/utils';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import { NotificationsPanel } from '@/components/notifications-panel';
import { RoleSwitcherCompact } from '@/components/role-switcher';
import { useAutoRole } from '@/hooks/use-auto-role';
import { useUser } from '@/hooks/use-user';
import { useSendEmail } from '@/hooks/use-send-email';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { MainDBITCurrentstatusKeyToLabel, type MainDBITCurrentstatusKey, type MainDBIT } from '@/generated/models/main-dbit-model';
import { DataReadyGuard } from '@/components/data-ready-guard';
import { getDepartmentRoutePath } from '@/lib/navigation';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

import { Skeleton } from '@/components/ui/skeleton';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.2, 0, 0, 1] },
  },
} as const;

const departmentIcons: Record<string, LucideIcon> = {
  IT: Monitor,
  HR: Users,
  PROD: Factory,
  QA: Beaker,
  QC: Shield,
  WH: Warehouse,
  STR: Warehouse,
  ADMIN: Building2,
  ADM: Building2,
  ENG: Wrench,
  FIN: DollarSign,
  LOG: Truck,
  MKT: BarChart3,
  MAINT: HardHat,
  MTR: HardHat,
  POWERBI: BarChart3,
  PLANT: Leaf,
  SAFETY: Shield,
  SHE: Shield,
  PURCH: FileText,
  RND: Beaker,
  LEGAL: FileText,
  ENV: Leaf,
  SEC: Lock,
  TD: GraduationCap,
  TRANS: Truck,
  COMM: Users,
  EXEC: Building2,
  OPS: Factory,
};

// Department cards use a consistent navy accent system for the hub.
const departmentAccents: Record<string, { gradient: string; ring: string }> = {
  IT: { gradient: 'from-slate-900 to-blue-900', ring: 'ring-blue-900/20' },
  HR: { gradient: 'from-blue-950 to-blue-800', ring: 'ring-blue-900/20' },
  PROD: { gradient: 'from-slate-800 to-blue-900', ring: 'ring-blue-900/20' },
  QA: { gradient: 'from-blue-900 to-slate-900', ring: 'ring-blue-900/20' },
  QC: { gradient: 'from-blue-950 to-slate-800', ring: 'ring-blue-900/20' },
  STR: { gradient: 'from-slate-900 to-blue-800', ring: 'ring-blue-900/20' },
  FIN: { gradient: 'from-blue-900 to-blue-950', ring: 'ring-blue-900/20' },
  PURCH: { gradient: 'from-slate-800 to-blue-950', ring: 'ring-blue-900/20' },
  SHE: { gradient: 'from-blue-950 to-slate-900', ring: 'ring-blue-900/20' },
  ADM: { gradient: 'from-slate-800 to-slate-950', ring: 'ring-blue-900/20' },
  MTR: { gradient: 'from-blue-800 to-slate-900', ring: 'ring-blue-900/20' },
  GOV: { gradient: 'from-slate-900 to-blue-950', ring: 'ring-blue-900/20' },
  SEC: { gradient: 'from-slate-950 to-blue-900', ring: 'ring-blue-900/20' },
  TD: { gradient: 'from-blue-900 to-slate-800', ring: 'ring-blue-900/20' },
  ENG: { gradient: 'from-slate-900 to-blue-900', ring: 'ring-blue-900/20' },
  LOG: { gradient: 'from-blue-950 to-slate-800', ring: 'ring-blue-900/20' },
  MKT: { gradient: 'from-slate-800 to-blue-900', ring: 'ring-blue-900/20' },
  MAINT: { gradient: 'from-blue-900 to-slate-950', ring: 'ring-blue-900/20' },
  WH: { gradient: 'from-slate-900 to-blue-800', ring: 'ring-blue-900/20' },
};

export default function DepartmentHubPage() {
  const navigate = useNavigate();
  // Get current user for personalized greeting
  const { data: user, isLoading: userLoading } = useUser();
  const sendEmail = useSendEmail();
  const [emailTestRunning, setEmailTestRunning] = useState(false);

  // Auto-detect super admin role based on user's email
  // Users matching ali.migration@ioioi.onmicrosoft.com get super admin access
  const { isSuperAdmin } = useAutoRole();

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Compute department stats (no personal data)
  const stats = useMemo(() => {
    const all = Object.values(DEPARTMENTS);
    let active = 0, pending = 0, forms = 0;
    
    for (const d of all) {
      if (d.status === 'active') {
        active++;
        forms += d.modules?.reduce((acc: number, m) => acc + m.forms.filter((f) => f.isInitialSubmission).length, 0) || 0;
      } else if (d.status === 'pending') {
        pending++;
      }
    }
    
    return { total: all.length, active, pending, forms };
  }, []);

  const activeDepartments = Object.values(DEPARTMENTS)
    .filter((d: Department) => d.status === 'active')
    .filter((dept: Department, index: number, departments: Department[]) => {
      const routePath = getDepartmentRoutePath(dept.code);
      return departments.findIndex((candidate) => getDepartmentRoutePath(candidate.code) === routePath) === index;
    });
  const comingSoonCount = Object.values(DEPARTMENTS).filter((d: Department) => d.status === 'pending').length;

  const handleDepartmentClick = (code: DepartmentCode) => {
    const dept = DEPARTMENTS[code];
    if (dept?.status === 'active') {
      navigate(getDepartmentRoutePath(code));
    }
  };

  const getAccent = (code: string) => departmentAccents[code] || departmentAccents.IT;

  // Quick actions for the hero section - include Admin Panel for super admins
  const quickActions = [
    { label: 'Directory', icon: Users, path: '/employee-directory', color: 'bg-violet-500' },
    // Admin Panel - only shown to super admin users (filtered below)
    ...(isSuperAdmin ? [{ label: 'Admin Panel', icon: Settings, path: '/admin', color: 'bg-red-500' }] : []),
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className={cn(
        "relative overflow-hidden",
        isSuperAdmin && "ring-2 ring-blue-900 ring-inset rounded-b-xl"
      )}>
        {/* Super Admin Indicator */}
        {isSuperAdmin && (
          <div className="absolute top-0 left-0 right-0 z-10 bg-blue-900 text-white text-xs font-medium py-1.5 px-4 flex items-center justify-center gap-2">
            <Shield className="h-3.5 w-3.5" />
            <span>Super Admin Access</span>
          </div>
        )}
        
        {/* Background with gradient */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-blue-800",
          isSuperAdmin && "top-7"
        )}>
          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '48px 48px'
            }}
          />
          {/* Radial gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            {/* Welcome Content */}
            <motion.div
              className="max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] as const }}
            >
              {/* Personalized Greeting */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.2, 0, 0, 1] as const }}
                className="mb-6"
              >
                {userLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-64 bg-white/20" />
                    <Skeleton className="h-5 w-48 bg-white/10" />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                      {getGreeting()}, {user?.fullName || 'there'}!
                    </h1>
                    <p className="text-white/80 text-sm mt-2 flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-blue-200" />
                      Logged in as {user?.userPrincipalName || 'Guest'}
                    </p>
                    <div className="mt-3">
                      <RoleSwitcherCompact />
                    </div>
                  </>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.2, 0, 0, 1] as const }}
                className="flex items-center gap-3 mb-5"
              >
                <div className="h-11 w-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-xs font-medium tracking-wide uppercase">Enterprise Platform</p>
                  <h2 className="text-lg font-semibold text-white tracking-tight">IOI Acidchem Sdn Bhd</h2>
                </div>
              </motion.div>

              <div className="h-2" />

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.2, 0, 0, 1] as const }}
                className="flex flex-wrap gap-2"
              >
                {quickActions.map((action) => (
                  <Button
                    key={action.label}
                    variant="secondary"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                    onClick={() => navigate(action.path)}
                  >
                    <action.icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Button>
                ))}
                
                {/* Notifications Panel */}
                <NotificationsPanel
                  triggerClassName="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                />
              </motion.div>
            </motion.div>

            {/* Stats Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.2, 0, 0, 1] as const }}
              className="lg:w-72"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/15 p-5 shadow-2xl">
                <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-white/70" />
                  Platform Overview
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-xl p-3.5 border border-white/5">
                    <p className="text-white/70 text-xs font-medium mb-1">Departments</p>
                    <p className="text-2xl font-bold text-white">{stats.active}</p>
                    <p className="text-white/60 text-xs">of {stats.total} active</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3.5 border border-white/5">
                    <p className="text-white/70 text-xs font-medium mb-1">Forms</p>
                    <p className="text-2xl font-bold text-white">{stats.forms}</p>
                    <p className="text-white/60 text-xs">available</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3.5 border border-white/5">
                    <p className="text-white/70 text-xs font-medium mb-1">Coming Soon</p>
                    <p className="text-2xl font-bold text-white">{stats.pending}</p>
                    <p className="text-white/60 text-xs">departments</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3.5 border border-white/5">
                    <p className="text-white/70 text-xs font-medium mb-1">Modules</p>
                    <p className="text-2xl font-bold text-white">
                      {activeDepartments.reduce((acc: number, d: Department) => acc + (d.modules?.length || 0), 0)}
                    </p>
                    <p className="text-white/60 text-xs">total</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-24 lg:pb-16 pt-8">
        {/* Active Departments Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Select a Department</h3>
                <p className="text-sm text-muted-foreground">Choose a department to access its portal</p>
              </div>
            </div>
            <Badge variant="outline" className="hidden sm:flex gap-1.5 text-muted-foreground text-xs">
              <CheckCircle className="h-3 w-3" />
              {stats.active} Active
            </Badge>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr items-stretch"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {activeDepartments.map((dept: Department) => {
              const Icon = departmentIcons[dept.code] || Building2;
              const accent = getAccent(dept.code);
              return (
                <motion.div
                  key={dept.code}
                  variants={itemVariants}
                  className="h-full min-h-[176px]"
                >
                  <Card
                    className={cn(
                      'cursor-pointer transition-all duration-300 bg-card group overflow-hidden relative border flex h-full min-h-[176px] flex-col',
                      'hover:shadow-xl hover:-translate-y-0.5 hover:ring-2 ' + accent.ring
                    )}
                    onClick={() => handleDepartmentClick(dept.code)}
                  >
                    {/* Top gradient accent */}
                    <div className={cn(
                      'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r transition-all duration-300',
                      accent.gradient,
                      'opacity-80 group-hover:h-1.5 group-hover:opacity-100'
                    )} />
                    
                    <CardContent className="flex h-full p-5">
                      <div className="flex h-full w-full items-start gap-4">
                        <div className={cn(
                          'h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 bg-gradient-to-br shadow-sm',
                          accent.gradient,
                          'group-hover:scale-105 group-hover:shadow-md'
                        )}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs font-mono px-1.5 py-0">
                              {dept.code}
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-foreground text-base leading-tight mb-1">{dept.name}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                            {dept.description}
                          </p>
                          <div className="mt-auto flex items-center gap-4 pt-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Activity className="h-3 w-3" />
                              {dept.modules?.length || 0} Modules
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {dept.modules?.reduce((acc: number, m) => acc + m.forms.filter((f) => f.isInitialSubmission).length, 0) || 0} Forms
                            </span>
                          </div>
                        </div>
                        <div className={cn(
                          'h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0',
                          'bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground'
                        )}>
                          <ArrowRight className={cn(
                            'h-4 w-4 transition-transform duration-300',
                            'group-hover:translate-x-0.5'
                          )} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.section>

        {/* Coming Soon Section */}
        {comingSoonCount > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="bg-muted/50 rounded-2xl border border-border p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center shadow-sm">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">More Departments Coming Soon</h3>
                  <p className="text-sm text-muted-foreground">
                    {comingSoonCount} additional department{comingSoonCount !== 1 ? 's' : ''} are being prepared
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.values(DEPARTMENTS)
                  .filter((d: Department) => d.status === 'pending')
                  .slice(0, 8)
                  .map((dept: Department) => (
                    <Badge 
                      key={dept.code} 
                      variant="outline" 
                      className="bg-background text-muted-foreground border-border"
                    >
                      {dept.code}
                    </Badge>
                  ))}
                {comingSoonCount > 8 && (
                  <Badge variant="outline" className="bg-background text-muted-foreground border-border">
                    +{comingSoonCount - 8} more
                  </Badge>
                )}
              </div>
            </div>
          </motion.section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">IOI Acidchem Enterprise Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/help')} className="text-muted-foreground hover:text-foreground text-sm">
                Help Center
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/settings')} className="text-muted-foreground hover:text-foreground text-sm">
                Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={emailTestRunning}
                onClick={async () => {
                  setEmailTestRunning(true);
                  try {
                    const result = await sendEmail.mutateAsync({
                      to: 'alimigration@ioioi.onmicrosoft.com',
                      subject: `[TEST] Connector Test - ${new Date().toLocaleString()}`,
                      body: '<h1>✅ Test Successful</h1><p>Office 365 Outlook connector is working!</p>',
                      importance: 'Normal',
                    });
                    if (result.success) {
                      toast.success('Test email sent! Check alimigration@ioioi.onmicrosoft.com inbox');
                    } else {
                      toast.error('Failed: ' + (result.error || 'Unknown'));
                    }
                  } catch (e) {
                    toast.error('Error: ' + String(e));
                  }
                  setEmailTestRunning(false);
                }}
                className="text-xs border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                <Send className="h-3 w-3 mr-1" />
                {emailTestRunning ? 'Sending...' : 'Test Email'}
              </Button>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav variant="hub" />
    </div>
  );
}
