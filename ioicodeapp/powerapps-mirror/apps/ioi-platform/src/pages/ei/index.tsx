// EI Department Home - Electrical & Instrumentation

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
  Plus,
  Eye,
  Inbox,
  XCircle,
  AlertTriangle,
  Zap,
  Gauge,
  Battery,
  Activity,
  Settings2,
  Paperclip,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUser } from '@/hooks/use-user';
import { DataReadyGuard } from '@/components/data-ready-guard';
import type { LucideIcon } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.2, 0, 0, 1] } },
} as const;

// EI Forms based on catalogue
const EI_FORMS = [
  {
    code: 'EI',
    name: 'Electrical & Instrumentation Inspection',
    description: 'General E&I inspection records',
    icon: Zap,
    path: '/ei/forms/ei/new',
    colorClass: 'bg-primary',
    isFrequent: true,
  },
  {
    code: 'ENMS1',
    name: 'Energy Management System — Form 1',
    description: 'Energy monitoring and management',
    icon: Activity,
    path: '/ei/forms/enms1/new',
    colorClass: 'bg-secondary',
    isFrequent: true,
  },
  {
    code: 'ENMS2',
    name: 'Energy Management System — Form 2',
    description: 'Energy data collection and analysis',
    icon: Activity,
    path: '/ei/forms/enms2/new',
    colorClass: 'bg-secondary',
    isFrequent: false,
  },
  {
    code: 'EARF',
    name: 'Equipment / Asset Register Form',
    description: 'E&I equipment registration and tracking',
    icon: Settings2,
    path: '/ei/forms/earf/new',
    colorClass: 'bg-accent',
    isFrequent: true,
  },
  {
    code: 'GBMB',
    name: 'Generator / Battery Maintenance Book',
    description: 'Generator and battery maintenance logs',
    icon: Battery,
    path: '/ei/forms/gbmb/new',
    colorClass: 'bg-primary',
    isFrequent: true,
  },
  {
    code: 'GBMB2',
    name: 'Generator / Battery Maintenance Book 2',
    description: 'Extended maintenance documentation',
    icon: Battery,
    path: '/ei/forms/gbmb2/new',
    colorClass: 'bg-primary',
    isFrequent: false,
  },
];

function EIDepartmentHomePageContent() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [submissionsOpen, setSubmissionsOpen] = useState(false);

  // Mock stats - will be replaced with real SharePoint data
  const stats = {
    pending: 5,
    approved: 23,
    rejected: 2,
    total: 30,
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const frequentForms = EI_FORMS.filter((f) => f.isFrequent);

  return (
    <motion.div
      className="space-y-6 p-4 md:p-6 pb-24 md:pb-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-primary rounded-xl">
              <Zap className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Electrical & Instrumentation</h1>
          </div>
          <p className="text-muted-foreground">
            Welcome{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}! Instrument calibration, equipment inspection & electrical records.
          </p>
        </div>
        <div className="hidden md:flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/ei/attachments">
              <Paperclip className="h-4 w-4 mr-2" />
              Attachments
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/my-submissions">
              <Eye className="h-4 w-4 mr-2" />
              Submissions
            </Link>
          </Button>
          <Button asChild>
            <Link to="/ei/forms/ei/new">
              <Plus className="h-4 w-4 mr-2" />
              New Inspection
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Connection Banner */}
      <motion.div variants={itemVariants}>
        <Alert>
          <Gauge className="h-4 w-4" />
          <AlertTitle>SharePoint Connected</AlertTitle>
          <AlertDescription>
            Connected to <strong>MainDB_EI</strong> SharePoint site. {EI_FORMS.length} form types available.
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-secondary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                <Clock className="h-5 w-5 text-secondary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-destructive flex items-center justify-center">
                <XCircle className="h-5 w-5 text-destructive-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <FileText className="h-5 w-5 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Frequent Forms */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Frequently Used Forms</CardTitle>
                <CardDescription>Quick access to E&I forms</CardDescription>
              </div>
              <Badge variant="secondary">{frequentForms.length} forms</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {frequentForms.map((form) => (
                <Link
                  key={form.code}
                  to={form.path}
                  className="flex items-center gap-3 p-4 min-h-[56px] rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-all active:scale-[0.98]"
                >
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${form.colorClass}`}>
                    <form.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{form.code}</p>
                    <p className="text-sm text-muted-foreground truncate">{form.name}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* All Forms */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">All E&I Forms</CardTitle>
                <CardDescription>Complete list of available forms</CardDescription>
              </div>
              <Badge variant="outline">{EI_FORMS.length} total</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {EI_FORMS.map((form) => (
                <Link
                  key={form.code}
                  to={form.path}
                  className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${form.colorClass}`}>
                    <form.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs font-mono">{form.code}</Badge>
                      {form.isFrequent && <Badge variant="secondary" className="text-xs">Popular</Badge>}
                    </div>
                    <p className="font-medium">{form.name}</p>
                    <p className="text-sm text-muted-foreground">{form.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t md:hidden z-50">
        <div className="flex gap-2">
          <Sheet open={submissionsOpen} onOpenChange={setSubmissionsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex-1 min-h-[48px]">
                <Eye className="h-4 w-4 mr-2" />
                Submissions
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>Recent Submissions</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <Empty className="py-12">
                  <EmptyHeader>
                    <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <EmptyTitle>No submissions yet</EmptyTitle>
                    <EmptyDescription>Create your first E&I inspection</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </div>
            </SheetContent>
          </Sheet>
          <Button asChild className="flex-1 min-h-[48px]">
            <Link to="/ei/forms/ei/new">
              <Plus className="h-4 w-4 mr-2" />
              New Inspection
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function EIDepartmentHomePage() {
  return (
    <DataReadyGuard loadingMessage="Loading E&I dashboard...">
      <EIDepartmentHomePageContent />
    </DataReadyGuard>
  );
}
