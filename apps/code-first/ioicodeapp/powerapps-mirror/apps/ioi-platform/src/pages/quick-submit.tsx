// Quick Submit - Mobile-optimized form submission view
// Designed for one-handed operation with large touch targets

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Monitor,
  Users,
  Factory,
  Warehouse,
  Shield,
  Wrench,
  DollarSign,
  Truck,
  Beaker,
  ChevronRight,
  ChevronLeft,
  Search,
  Star,
  Clock,
  FileText,
  Home,
  Zap,
  Building2,
  CheckCircle2,
  X,
  Sparkles,
  ArrowUpRight,
  Filter,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/use-user';
import { DEPARTMENTS, type DepartmentCode, type Department } from '@/config/departments';
import { Skeleton } from '@/components/ui/skeleton';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { format, formatDistanceToNow } from 'date-fns';
import { MainDBIT, MainDBITCurrentstatusKeyToLabel } from '@/generated/models/main-dbit-model';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.08 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: [0.2, 0, 0, 1] } },
} as const;

// Department icons mapping
const departmentIcons: Record<string, LucideIcon> = {
  IT: Monitor,
  HR: Users,
  PROD: Factory,
  QA: Beaker,
  QC: Shield,
  STR: Warehouse,
  FIN: DollarSign,
  SHE: Shield,
  LOG: Truck,
  MTR: Wrench,
  ADM: Building2,
  PUR: DollarSign,
  GOV: Shield,
};

// Department gradient colors for visual distinction
const departmentGradients: Record<string, string> = {
  IT: 'from-blue-500 to-indigo-600',
  HR: 'from-rose-500 to-pink-600',
  PROD: 'from-amber-500 to-orange-600',
  QA: 'from-emerald-500 to-teal-600',
  QC: 'from-violet-500 to-purple-600',
  STR: 'from-sky-500 to-cyan-600',
  FIN: 'from-green-500 to-emerald-600',
  SHE: 'from-red-500 to-rose-600',
  LOG: 'from-cyan-500 to-blue-600',
  MTR: 'from-indigo-500 to-violet-600',
  ADM: 'from-slate-500 to-gray-600',
  PUR: 'from-orange-500 to-red-500',
  GOV: 'from-purple-500 to-indigo-600',
};

// Popular/frequently used forms across departments
interface QuickForm {
  formCode: string;
  name: string;
  description: string;
  departmentCode: DepartmentCode;
  departmentName: string;
  path: string;
  icon: LucideIcon;
  isPopular?: boolean;
}

// Recent submission display
interface RecentSubmission {
  id: string;
  title: string;
  formCode: string;
  status: string;
  date: Date;
}

export default function QuickSubmitPage() {
  const navigate = useNavigate();
  const { data: user, isLoading: userLoading } = useUser();
  const [selectedDept, setSelectedDept] = useState<DepartmentCode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch recent submissions for personalization
  const { data: itForms = [] } = useMainDBITList();

  // Get active departments
  const activeDepartments = useMemo(() => {
    return Object.values(DEPARTMENTS).filter((d: Department) => d.status === 'active');
  }, []);

  // Build quick forms list from all active departments
  const allForms = useMemo(() => {
    const forms: QuickForm[] = [];
    
    for (const dept of activeDepartments) {
      if (!dept.modules) continue;
      
      const basePath = getBasePath(dept.code);
      
      for (const module of dept.modules) {
        for (const form of module.forms) {
          if (!form.isInitialSubmission) continue;
          
          forms.push({
            formCode: form.formCode,
            name: form.name,
            description: form.description,
            departmentCode: dept.code,
            departmentName: dept.name,
            path: `${basePath}/forms/${form.formCode.toLowerCase()}/new`,
            icon: departmentIcons[dept.code] || Building2,
            isPopular: isPopularForm(form.formCode),
          });
        }
      }
    }
    
    return forms;
  }, [activeDepartments]);

  // Get base path for department routing
  function getBasePath(code: DepartmentCode): string {
    const routeMap: Partial<Record<DepartmentCode, string>> = {
      PROD: '/production',
      PURCH: '/procurement',
      PUR: '/procurement',
    };
    return routeMap[code] || `/${code.toLowerCase()}`;
  }

  // Popular forms (hardcoded for now, could be based on usage analytics)
  function isPopularForm(formCode: string): boolean {
    const popular = ['ITSSR', 'EAF', 'NIR', 'LVE', 'SR', 'MRF', 'IR-001', 'DEF', 'TPM-001', 'CAR'];
    return popular.includes(formCode);
  }

  // Get recent submissions from user
  const recentSubmissions = useMemo((): RecentSubmission[] => {
    const userEmail = user?.userPrincipalName?.toLowerCase();
    if (!userEmail) return [];
    
    return itForms
      .filter((form: MainDBIT) => {
        const requestorEmail = form.requestoremail?.toLowerCase();
        return requestorEmail === userEmail;
      })
      .sort((a: MainDBIT, b: MainDBIT) => {
        const dateA = a.submitteddate ? new Date(a.submitteddate).getTime() : 0;
        const dateB = b.submitteddate ? new Date(b.submitteddate).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 3)
      .map((form: MainDBIT) => ({
        id: form.title || '',
        title: form.formcode || form.title || 'Form Submission',
        formCode: form.formcode || 'IT',
        status: form.currentStatus ? MainDBITCurrentstatusKeyToLabel[form.currentStatus] : 'Submitted',
        date: form.submitteddate ? new Date(form.submitteddate) : new Date(),
      }));
  }, [itForms, user]);

  // Filter forms based on search and department
  const filteredForms = useMemo(() => {
    let forms = allForms;
    
    // Filter by department
    if (selectedDept) {
      forms = forms.filter((f: QuickForm) => f.departmentCode === selectedDept);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      forms = forms.filter(
        (f: QuickForm) =>
          f.name.toLowerCase().includes(query) ||
          f.formCode.toLowerCase().includes(query) ||
          f.description.toLowerCase().includes(query) ||
          f.departmentName.toLowerCase().includes(query)
      );
    }
    
    return forms;
  }, [allForms, selectedDept, searchQuery]);

  // Popular forms for quick access
  const popularForms = useMemo(() => {
    return allForms.filter((f: QuickForm) => f.isPopular).slice(0, 8);
  }, [allForms]);

  const firstName = user?.fullName?.split(' ')[0] || 'there';
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  const handleFormClick = (form: QuickForm) => {
    navigate(form.path);
  };

  const getGradient = (code: string) => departmentGradients[code] || departmentGradients.IT;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col">
      {/* Header - Immersive gradient for mobile */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-blue-700">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
            }}
          />
        </div>
        
        <div className="relative px-4 pt-4 pb-6 safe-area-inset-top">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-5">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-white/90 hover:bg-white/20 rounded-xl"
              onClick={() => navigate('/')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-300" />
              <span className="text-white font-semibold">Quick Submit</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-white/90 hover:bg-white/20 rounded-xl"
              onClick={() => navigate('/')}
            >
              <Home className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Greeting */}
          <div className="mb-5">
            {userLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-7 w-48 bg-white/20" />
                <Skeleton className="h-4 w-64 bg-white/10" />
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-white">
                  {greeting}, {firstName}
                </h1>
                <p className="text-white/70 text-sm mt-1">
                  Quick access to all your forms in one place
                </p>
              </>
            )}
          </div>

          {/* Search Bar - Floating style */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search forms by name or code..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 h-14 bg-white text-foreground border-0 rounded-2xl shadow-lg text-base"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-28">
        {/* Department Filter Pills */}
        <section className="px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            <Button
              variant={selectedDept === null ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'shrink-0 h-11 rounded-full px-4',
                selectedDept === null && 'shadow-md'
              )}
              onClick={() => setSelectedDept(null)}
            >
              <Sparkles className="h-4 w-4 mr-1.5" />
              All
            </Button>
            {activeDepartments.map((dept: Department) => {
              const Icon = departmentIcons[dept.code] || Building2;
              const isSelected = selectedDept === dept.code;
              return (
                <Button
                  key={dept.code}
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    'shrink-0 h-11 rounded-full gap-1.5 px-4',
                    isSelected && 'shadow-md'
                  )}
                  onClick={() => setSelectedDept(isSelected ? null : dept.code)}
                >
                  <Icon className="h-4 w-4" />
                  {dept.code}
                </Button>
              );
            })}
          </div>
        </section>

        {/* Recent Submissions - Show when not searching */}
        {!searchQuery && !selectedDept && recentSubmissions.length > 0 && (
          <section className="px-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-8"
                onClick={() => navigate('/my-submissions')}
              >
                View All
                <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
            <div className="space-y-2">
              {recentSubmissions.map((sub: RecentSubmission, idx: number) => (
                <motion.div
                  key={sub.id || idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, ease: 'easeOut' as const }}
                  className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{sub.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(sub.date, { addSuffix: true })}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      'shrink-0 text-xs',
                      sub.status.toLowerCase().includes('approved') && 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
                      sub.status.toLowerCase().includes('pending') && 'bg-amber-500/10 text-amber-700 border-amber-500/30',
                      sub.status.toLowerCase().includes('submitted') && 'bg-blue-500/10 text-blue-700 border-blue-500/30'
                    )}
                  >
                    {sub.status}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Access - Popular Forms */}
        {!searchQuery && !selectedDept && (
          <section className="px-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <h2 className="text-sm font-semibold text-foreground">Popular Forms</h2>
            </div>
            <motion.div
              className="grid grid-cols-2 gap-3"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {popularForms.map((form: QuickForm) => {
                const gradient = getGradient(form.departmentCode);
                return (
                  <motion.button
                    key={`${form.departmentCode}-${form.formCode}`}
                    variants={itemVariants}
                    onClick={() => handleFormClick(form)}
                    className={cn(
                      'relative p-4 rounded-2xl text-left transition-all overflow-hidden',
                      'bg-card border border-border shadow-sm',
                      'active:scale-[0.97] hover:shadow-lg hover:border-primary/20'
                    )}
                  >
                    {/* Gradient accent */}
                    <div className={cn(
                      'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r',
                      gradient
                    )} />
                    
                    <div className={cn(
                      'h-11 w-11 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br shadow-sm',
                      gradient
                    )}>
                      <form.icon className="h-5 w-5 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-[10px] mb-1.5 px-1.5 py-0 font-mono">
                      {form.formCode}
                    </Badge>
                    <p className="font-medium text-sm text-foreground line-clamp-2 leading-tight">{form.name}</p>
                    <Star className="absolute top-4 right-4 h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  </motion.button>
                );
              })}
            </motion.div>
          </section>
        )}

        {/* All Forms List */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">
                {searchQuery ? 'Search Results' : selectedDept ? DEPARTMENTS[selectedDept]?.name : 'All Forms'}
              </h2>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              {filteredForms.length} forms
            </Badge>
          </div>

          {filteredForms.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-foreground font-medium">No forms found</p>
              <p className="text-sm text-muted-foreground mt-1">Try a different search term or filter</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => { setSearchQuery(''); setSelectedDept(null); }}
              >
                Clear Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-2"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              key={`${selectedDept}-${searchQuery}`}
            >
              {filteredForms.map((form: QuickForm) => {
                const gradient = getGradient(form.departmentCode);
                return (
                  <motion.button
                    key={`${form.departmentCode}-${form.formCode}`}
                    variants={itemVariants}
                    onClick={() => handleFormClick(form)}
                    className={cn(
                      'w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all',
                      'bg-card border border-border',
                      'active:scale-[0.99] hover:shadow-md hover:border-primary/20'
                    )}
                  >
                    <div className={cn(
                      'h-14 w-14 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br shadow-sm',
                      gradient
                    )}>
                      <form.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-mono">
                          {form.departmentCode}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono">{form.formCode}</span>
                        {form.isPopular && (
                          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        )}
                      </div>
                      <p className="font-medium text-foreground text-sm leading-tight">{form.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{form.description}</p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </section>
      </main>

      {/* Bottom Navigation - Thumb-friendly */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-50">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          <Button
            variant="ghost"
            className="flex-1 h-14 flex-col gap-0.5 rounded-xl"
            onClick={() => navigate('/')}
          >
            <Home className="h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">Home</span>
          </Button>
          <Button
            variant="ghost"
            className="flex-1 h-14 flex-col gap-0.5 rounded-xl"
            onClick={() => navigate('/my-submissions')}
          >
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">Mine</span>
          </Button>
          <Button
            variant="ghost"
            className="flex-1 h-14 flex-col gap-0.5 rounded-xl bg-primary/10"
          >
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-[10px] text-primary font-semibold">Quick</span>
          </Button>
          <Button
            variant="ghost"
            className="flex-1 h-14 flex-col gap-0.5 rounded-xl"
            onClick={() => navigate('/approvals')}
          >
            <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">Tasks</span>
          </Button>
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  );
}