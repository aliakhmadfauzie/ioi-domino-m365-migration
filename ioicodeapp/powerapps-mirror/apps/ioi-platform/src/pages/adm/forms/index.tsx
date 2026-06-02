import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  FileText,
  Building2,
  ArrowRight,
  Clock,
  CheckCircle2,
  CalendarCheck,
  Car,
  FileSpreadsheet,
  HelpCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { LucideIcon } from 'lucide-react';

interface FormDefinition {
  code: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  isPopular: boolean;
}

interface FormModule {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  database: string;
  forms: FormDefinition[];
}

// ADM Form definitions
const formModules: FormModule[] = [
  {
    id: 'facilities',
    code: 'ADM-M1',
    title: 'Facilities & Logistics',
    description: 'Room bookings, stationery, and transport services',
    icon: Building2,
    colorClass: 'bg-primary text-primary-foreground',
    database: 'MainDB_ADM (PRAI)',
    forms: [
      {
        code: 'RAR',
        name: 'Room Arrangement Requisition',
        description: 'Request meeting rooms, conference halls, and facility arrangements',
        icon: CalendarCheck,
        color: '#6366f1',
        isPopular: true,
      },
      {
        code: 'SRF',
        name: 'Stationery Requisition Form',
        description: 'Request office supplies, stationery, and consumables',
        icon: FileSpreadsheet,
        color: '#10b981',
        isPopular: true,
      },
      {
        code: 'DAR',
        name: 'Driver Arrangement Requisition',
        description: 'Request company driver and vehicle services for business travel (Critical)',
        icon: Car,
        color: '#ef4444',
        isPopular: true,
      },
    ],
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

// All forms across all modules
const ALL_ADM_FORMS = formModules.flatMap((m: FormModule) => m.forms);
const POPULAR_FORM_CODES = ['RAR', 'SRF', 'DAR'];

export default function ADMFormsIndexPage() {
  const popularForms = ALL_ADM_FORMS.filter((f: FormDefinition) => POPULAR_FORM_CODES.includes(f.code));

  return (
    <TooltipProvider>
      <div className="space-y-8 p-4 md:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' as const }}
          className="space-y-2"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">ADM Forms</h1>
              <p className="text-muted-foreground">
                Browse and submit administration service requests. Select a form below.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' as const }}
          className="flex flex-wrap gap-3"
        >
          <Button asChild variant="default" size="lg" className="min-h-[44px]">
            <Link to="/adm/forms/dar/new">
              <Car className="mr-2 h-5 w-5" />
              New Driver Request
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-h-[44px]">
            <Link to="/my-submissions">
              <Clock className="mr-2 h-5 w-5" />
              My Submissions
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-h-[44px]">
            <Link to="/adm/approvals">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Pending Approvals
            </Link>
          </Button>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' as const }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Forms</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">{ALL_ADM_FORMS.length}</p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
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
            <p className="text-lg font-bold text-foreground mt-1">MainDB_ADM</p>
          </div>
        </motion.div>

        {/* Form Modules */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-6 lg:grid-cols-1"
        >
          {formModules.map((module: FormModule) => {
            const Icon = module.icon;
            return (
              <motion.div key={module.id} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
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
                          <p className="text-xs">Database: {module.database}</p>
                          <p className="text-xs">Module: {module.code}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {module.forms.length > 0 ? (
                      module.forms.map((form: FormDefinition) => {
                        const FormIcon = form.icon;
                        const isPopular = POPULAR_FORM_CODES.includes(form.code);
                        return (
                          <Link
                            key={form.code}
                            to={`/adm/forms/${form.code.toLowerCase()}/new`}
                            className="group flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-muted/50 transition-all duration-200"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div
                                className="p-2 rounded-md"
                                style={{ backgroundColor: `${form.color}15` }}
                              >
                                <FormIcon className="h-5 w-5" style={{ color: form.color }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                                    {form.name}
                                  </span>
                                  {isPopular && (
                                    <Badge variant="secondary" className="text-xs">
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
                      <div className="p-4 text-center text-muted-foreground text-sm">
                        No forms available in this module
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
          transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' as const }}
          className="bg-muted/30 rounded-xl p-6 border border-border/50"
        >
          <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Not sure which form to use? Contact the Admin department or visit our help center for assistance.
          </p>
          <div className="flex gap-3">
            <Button asChild variant="outline" size="sm" className="min-h-[44px]">
              <Link to="/adm/help">View Help Center</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </TooltipProvider>
  );
}
