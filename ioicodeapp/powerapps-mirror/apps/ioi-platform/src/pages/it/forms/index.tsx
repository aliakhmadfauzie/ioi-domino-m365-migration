import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  FileText,
  UserPlus,
  Headset,
  HardDrive,
  ArrowRight,
  Clock,
  CheckCircle2,
  Server,
  Database,
  HelpCircle,
  GitBranch,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { M1_FORMS, M2_FORMS, M3_FORMS, M4_FORMS, M5_FORMS, M7_FORMS, ALL_IT_FORMS, type ITFormConfig } from '@/lib/it-forms-config';
import { normalizeITFormRouteSlug } from '@/lib/it-form-routes';

// Module definitions
interface FormModule {
  id: string;
  code: 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M7';
  title: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  database: string;
  forms: ITFormConfig[];
}

const formModules: FormModule[] = [
  {
    id: 'user-access',
    code: 'M1',
    title: 'User & Access Management',
    description: 'Account creation, access requests, and permissions',
    icon: UserPlus,
    colorClass: 'bg-primary text-primary-foreground',
    database: 'MainDB_IT (PRAI)',
    forms: M1_FORMS,
  },
  {
    id: 'it-support',
    code: 'M2',
    title: 'IT Support & Service Requests',
    description: 'Support tickets, project requests, and service forms',
    icon: Headset,
    colorClass: 'bg-secondary text-secondary-foreground',
    database: 'MainDB_IT',
    forms: M2_FORMS,
  },
  {
    id: 'hardware',
    code: 'M3',
    title: 'Hardware & Infrastructure',
    description: 'Hardware requests, IT setup, and infrastructure',
    icon: HardDrive,
    colorClass: 'bg-accent text-accent-foreground',
    database: 'MainDB_IT',
    forms: M3_FORMS,
  },
  {
    id: 'sap',
    code: 'M4',
    title: 'SAP & Enterprise Systems',
    description: 'SAP access, transport requests, and configuration',
    icon: Server,
    colorClass: 'bg-chart-3 text-white',
    database: 'MainDB_IT',
    forms: M4_FORMS,
  },
  {
    id: 'documentation',
    code: 'M5',
    title: 'IT Documentation',
    description: 'IT information, policies, and ISG documentation',
    icon: Database,
    colorClass: 'bg-chart-5 text-white',
    database: 'MainDB_IT',
    forms: M5_FORMS,
  },
  {
    id: 'sap-systems',
    code: 'M7',
    title: 'SAP Systems',
    description: 'SAP access, authorization, transport, and incident forms',
    icon: GitBranch,
    colorClass: 'bg-chart-4 text-white',
    database: 'MainDB_IT',
    forms: M7_FORMS,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
} as const;

// Popular forms
const POPULAR_FORM_CODES = ['EAF', 'NIR', 'RS', 'ITSSR', 'PRF'];

export default function ITFormsIndexPage() {
  const popularForms = ALL_IT_FORMS.filter((f: ITFormConfig) => POPULAR_FORM_CODES.includes(f.code));
  
  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" as const }}
          className="space-y-2"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">IT Forms</h1>
              <p className="text-muted-foreground">
                Browse and submit IT service requests. Select a form category below.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" as const }}
          className="flex flex-wrap gap-3"
        >
          <Button asChild variant="default" size="lg" className="min-h-[44px]">
            <Link to="/it/forms/itssr/new">
              <FileText className="mr-2 h-5 w-5" />
              New Request
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-h-[44px]">
            <Link to="/my-submissions">
              <Clock className="mr-2 h-5 w-5" />
              My Submissions
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-h-[44px]">
            <Link to="/it/approvals">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Pending Approvals
            </Link>
          </Button>
        </motion.div>

        {/* Popular Forms */}
        {popularForms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" as const }}
            className="space-y-2"
          >
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Popular Forms</h2>
            <div className="flex flex-wrap gap-2">
              {popularForms.map((form: ITFormConfig) => {
                const FormIcon = form.icon;
                return (
                  <Link
                    key={form.code}
                    to={`/it/forms/${normalizeITFormRouteSlug(form.code)}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-primary/50 hover:bg-muted/50 transition-all duration-200"
                  >
                    <FormIcon className="h-4 w-4" style={{ color: form.color }} />
                    {form.name}
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" as const }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Forms</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">{ALL_IT_FORMS.length}</p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Modules</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">{formModules.length}</p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Popular</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">{popularForms.length}</p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Database</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">MainDB_IT</p>
          </div>
        </motion.div>

        {/* Form Modules */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {formModules.map((module) => {
            const Icon = module.icon;
            return (
              <motion.div key={module.id} variants={itemVariants}>
                <Card className="h-full transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${module.colorClass}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </div>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="p-2 rounded-md hover:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p className="text-sm">Database: {module.database}</p>
                          <p className="text-sm">Module: {module.code}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {module.forms.length > 0 ? (
                      module.forms.map((form: ITFormConfig) => {
                        const FormIcon = form.icon;
                        const isPopular = POPULAR_FORM_CODES.includes(form.code);
                        return (
                          <Link
                            key={form.code}
                            to={`/it/forms/${normalizeITFormRouteSlug(form.code)}`}
                            className="group flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-muted/50 transition-all duration-200"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div 
                                className="p-1.5 rounded-md" 
                                style={{ backgroundColor: `${form.color}15` }}
                              >
                                <FormIcon className="h-4 w-4" style={{ color: form.color }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                                    {form.name}
                                  </span>
                                  {isPopular && (
                                    <Badge variant="secondary" className="text-sm">
                                      Popular
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground truncate mt-0.5">
                                  {form.description}
                                </p>
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 ml-3" />
                          </Link>
                        );
                      })
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <HelpCircle className="h-8 w-8 text-muted-foreground/40 mb-2" />
                        <p className="text-sm text-muted-foreground">No forms available in this module</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" as const }}
          className="bg-muted/30 rounded-xl p-6 border border-border/50"
        >
          <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Not sure which form to use? Visit our help center or contact IT support for assistance.
          </p>
          <div className="flex gap-3">
            <Button asChild variant="outline" size="sm" className="min-h-[44px]">
              <Link to="/it/help">View Help Center</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="min-h-[44px]">
              <Link to="/it/support">Contact Support</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </TooltipProvider>
  );
}
