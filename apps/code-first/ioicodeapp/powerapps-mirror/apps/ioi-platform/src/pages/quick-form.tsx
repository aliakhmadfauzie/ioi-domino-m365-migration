// Quick Form Submission - Mobile-Optimized Interface for Field Workers
// Streamlined, touch-friendly form submission experience

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Zap,
  Clock,
  Star,
  ChevronRight,
  FileText,
  CheckCircle,
  Send,
  X,
  Monitor,
  Users,
  Package,
  Beaker,
  Shield,
  DollarSign,
  Factory,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/use-user';
import { Skeleton } from '@/components/ui/skeleton';
import { DEPARTMENTS, type Department, type FormDefinition } from '@/config/departments';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: [0.2, 0, 0, 1] },
  },
} as const;

// Department icons mapping
const departmentIcons: Record<string, LucideIcon> = {
  IT: Monitor,
  HR: Users,
  STR: Package,
  QA: Beaker,
  QC: Shield,
  FIN: DollarSign,
  PROD: Factory,
  SHE: AlertTriangle,
};

// Frequently used forms (curated for quick access)
interface QuickForm {
  formCode: string;
  name: string;
  description: string;
  departmentCode: string;
  departmentName: string;
  path: string;
  icon: LucideIcon;
  priority: 'high' | 'normal';
}

const QUICK_FORMS: QuickForm[] = [
  {
    formCode: 'ITSSR',
    name: 'IT Support Request',
    description: 'Report IT issues quickly',
    departmentCode: 'IT',
    departmentName: 'IT Department',
    path: '/it/forms/itssr/new',
    icon: Monitor,
    priority: 'high',
  },
  {
    formCode: 'IR-001',
    name: 'Incident Report',
    description: 'Report workplace incidents',
    departmentCode: 'SHE',
    departmentName: 'Safety & Health',
    path: '/she/forms/incident',
    icon: AlertTriangle,
    priority: 'high',
  },
  {
    formCode: 'LVE',
    name: 'Leave Application',
    description: 'Request time off',
    departmentCode: 'HR',
    departmentName: 'HR Department',
    path: '/hr/leave',
    icon: Users,
    priority: 'normal',
  },
  {
    formCode: 'MRF',
    name: 'Material Request',
    description: 'Request materials from store',
    departmentCode: 'STR',
    departmentName: 'Store',
    path: '/str/requisition',
    icon: Package,
    priority: 'normal',
  },
  {
    formCode: 'OWP',
    name: 'Overtime Permit',
    description: 'Request overtime work',
    departmentCode: 'HR',
    departmentName: 'HR Department',
    path: '/hr/leave',
    icon: Clock,
    priority: 'normal',
  },
  {
    formCode: 'DEF',
    name: 'Defect Report',
    description: 'Report product defects',
    departmentCode: 'QA',
    departmentName: 'Quality Assurance',
    path: '/qa/defects',
    icon: Beaker,
    priority: 'normal',
  },
];

// Recent form interface
interface RecentForm {
  formCode: string;
  name: string;
  submittedAt: Date;
  status: 'submitted' | 'approved' | 'pending';
}

export default function QuickFormPage() {
  const navigate = useNavigate();
  const { data: user, isLoading: userLoading } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Mock recent forms (would come from actual data in production)
  const recentForms: RecentForm[] = [
    { formCode: 'ITSSR', name: 'IT Support Request', submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), status: 'submitted' },
    { formCode: 'LVE', name: 'Leave Application', submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), status: 'approved' },
  ];

  // Get all forms from departments for search
  const allForms = useMemo(() => {
    const forms: Array<{
      formCode: string;
      name: string;
      description: string;
      departmentCode: string;
      departmentName: string;
      modulePath: string;
    }> = [];
    
    Object.values(DEPARTMENTS).forEach((dept: Department) => {
      if (dept.status === 'active' && dept.modules) {
        dept.modules.forEach((module) => {
          module.forms.forEach((form: FormDefinition) => {
            forms.push({
              formCode: form.formCode,
              name: form.name,
              description: form.description,
              departmentCode: dept.code,
              departmentName: dept.name,
              modulePath: module.path,
            });
          });
        });
      }
    });
    
    return forms;
  }, []);

  // Filter forms based on search
  const filteredForms = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return allForms.filter(
      (form) =>
        form.name.toLowerCase().includes(query) ||
        form.formCode.toLowerCase().includes(query) ||
        form.description.toLowerCase().includes(query) ||
        form.departmentName.toLowerCase().includes(query)
    ).slice(0, 8);
  }, [searchQuery, allForms]);

  // Active departments for category filter
  const activeDepartments = useMemo(() => {
    return Object.values(DEPARTMENTS).filter((d: Department) => d.status === 'active');
  }, []);

  // Filter quick forms by category
  const displayedQuickForms = useMemo(() => {
    if (!selectedCategory) return QUICK_FORMS;
    return QUICK_FORMS.filter((f) => f.departmentCode === selectedCategory);
  }, [selectedCategory]);

  const handleFormSelect = (path: string) => {
    navigate(path);
  };

  const getStatusColor = (status: RecentForm['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500';
      case 'pending':
        return 'bg-amber-500';
      case 'submitted':
        return 'bg-blue-500';
      default:
        return 'bg-muted';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Compact Mobile Header */}
      <header className="sticky top-0 z-50 bg-primary border-b border-primary-foreground/10">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="text-primary-foreground hover:bg-primary-foreground/10 -ml-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-primary-foreground">Quick Submit</h1>
            {userLoading ? (
              <Skeleton className="h-3 w-24 bg-primary-foreground/20" />
            ) : (
              <p className="text-xs text-primary-foreground/70">
                {user?.fullName || 'Field Worker'}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-primary-foreground/70">Online</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search forms by name or code..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-11 bg-background border-0 rounded-xl text-sm"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery('')}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Search Results Overlay */}
      <AnimatePresence>
        {searchQuery && filteredForms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 z-40 px-4 pt-2"
          >
            <Card className="shadow-xl border-border">
              <CardContent className="p-2">
                {filteredForms.map((form) => (
                  <button
                    key={`${form.departmentCode}-${form.formCode}`}
                    onClick={() => handleFormSelect(form.modulePath)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{form.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {form.departmentName} • {form.formCode}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="px-4 py-5 pb-24 space-y-6">
        {/* Recent Submissions */}
        {recentForms.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Recent Submissions</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {recentForms.map((form, index) => (
                <motion.div
                  key={`${form.formCode}-${index}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="shrink-0"
                >
                  <Card className="w-44 border-border bg-card hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn('h-2 w-2 rounded-full', getStatusColor(form.status))} />
                        <span className="text-[10px] uppercase font-medium text-muted-foreground">
                          {form.status}
                        </span>
                      </div>
                      <p className="font-medium text-sm text-foreground truncate">{form.name}</p>
                      <p className="text-xs text-muted-foreground">{formatTimeAgo(form.submittedAt)}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: recentForms.length * 0.1 }}
                className="shrink-0"
              >
                <Button
                  variant="outline"
                  className="h-[76px] w-32 border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  onClick={() => navigate('/my-submissions')}
                >
                  <span className="text-xs">View All</span>
                </Button>
              </motion.div>
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Quick Access Forms</h2>
          </div>
          
          {/* Department pills */}
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={cn(
                'shrink-0 h-8 rounded-full text-xs',
                selectedCategory === null && 'bg-primary text-primary-foreground'
              )}
            >
              All Forms
            </Button>
            {activeDepartments.slice(0, 6).map((dept: Department) => {
              const Icon = departmentIcons[dept.code] || FileText;
              const isSelected = selectedCategory === dept.code;
              return (
                <Button
                  key={dept.code}
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(isSelected ? null : dept.code)}
                  className={cn(
                    'shrink-0 h-8 rounded-full text-xs gap-1.5',
                    isSelected && 'bg-primary text-primary-foreground'
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {dept.code}
                </Button>
              );
            })}
          </div>
        </section>

        {/* Quick Forms Grid */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <div className="grid grid-cols-1 gap-3">
            {displayedQuickForms.map((form) => {
              const Icon = form.icon;
              const isHighPriority = form.priority === 'high';
              
              return (
                <motion.div key={form.formCode} variants={itemVariants}>
                  <Card
                    className={cn(
                      'border-border cursor-pointer transition-all active:scale-[0.98]',
                      'hover:shadow-lg hover:border-primary/30',
                      isHighPriority && 'ring-1 ring-primary/20'
                    )}
                    onClick={() => handleFormSelect(form.path)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          'h-14 w-14 rounded-xl flex items-center justify-center shrink-0',
                          isHighPriority
                            ? 'bg-gradient-to-br from-primary to-blue-600'
                            : 'bg-muted'
                        )}>
                          <Icon className={cn(
                            'h-6 w-6',
                            isHighPriority ? 'text-primary-foreground' : 'text-muted-foreground'
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-base text-foreground">{form.name}</h3>
                            {isHighPriority && (
                              <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-1.5 py-0">
                                <Zap className="h-2.5 w-2.5 mr-0.5" />
                                Quick
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{form.description}</p>
                          <p className="text-xs text-muted-foreground/70 mt-1">{form.departmentName}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <ChevronRight className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* All Forms Link */}
        <section className="pt-2">
          <Button
            variant="outline"
            className="w-full h-12 border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            onClick={() => navigate('/')}
          >
            <FileText className="h-4 w-4 mr-2" />
            Browse All Department Forms
          </Button>
        </section>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border px-4 py-3 safe-area-pb">
        <div className="flex gap-3 max-w-lg mx-auto">
          <Button
            variant="outline"
            className="flex-1 h-12"
            onClick={() => navigate('/my-submissions')}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            My Submissions
          </Button>
          <Button
            className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => navigate('/it/forms/itssr/new')}
          >
            <Send className="h-4 w-4 mr-2" />
            IT Request
          </Button>
        </div>
        {/* Safe area padding for iOS */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  );
}