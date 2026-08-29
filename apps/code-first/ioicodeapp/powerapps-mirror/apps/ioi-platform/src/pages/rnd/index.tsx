// R&D Department Home - Research & Development

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
  FlaskConical,
  Microscope,
  Beaker,
  Package,
  Users,
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

// R&D Forms based on catalogue
const RND_FORMS = [
  {
    code: 'RNDDB',
    name: 'R&D Database',
    description: 'Research & development records',
    icon: FlaskConical,
    path: '/rnd/forms/rnddb/new',
    colorClass: 'bg-primary',
    isFrequent: true,
  },
  {
    code: 'RNDPRJ',
    name: 'R&D Project Form',
    description: 'New R&D project registration',
    icon: Microscope,
    path: '/rnd/forms/rndprj/new',
    colorClass: 'bg-primary',
    isFrequent: true,
  },
  {
    code: 'RNMR',
    name: 'Raw / New Material Record',
    description: 'New material testing records',
    icon: Beaker,
    path: '/rnd/forms/rnmr/new',
    colorClass: 'bg-secondary',
    isFrequent: true,
  },
  {
    code: 'NEWPRDREQ',
    name: 'New Product Request',
    description: 'New product development requests',
    icon: Package,
    path: '/rnd/forms/newprdreq/new',
    colorClass: 'bg-accent',
    isFrequent: true,
  },
  {
    code: 'CMF_A',
    name: 'Customer / Market Form A',
    description: 'Customer requirements - Part A',
    icon: Users,
    path: '/rnd/forms/cmf-a/new',
    colorClass: 'bg-secondary',
    isFrequent: false,
  },
  {
    code: 'CMF_B',
    name: 'Customer / Market Form B',
    description: 'Market analysis - Part B',
    icon: Users,
    path: '/rnd/forms/cmf-b/new',
    colorClass: 'bg-secondary',
    isFrequent: false,
  },
  {
    code: 'CMF_C',
    name: 'Customer / Market Form C',
    description: 'Product specifications - Part C',
    icon: Users,
    path: '/rnd/forms/cmf-c/new',
    colorClass: 'bg-secondary',
    isFrequent: false,
  },
];

function RnDDepartmentHomePageContent() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [submissionsOpen, setSubmissionsOpen] = useState(false);

  // Mock stats
  const stats = {
    pending: 12,
    approved: 38,
    rejected: 3,
    total: 53,
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const frequentForms = RND_FORMS.filter((f) => f.isFrequent);

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
              <FlaskConical className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Research & Development</h1>
          </div>
          <p className="text-muted-foreground">
            Welcome{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}! R&D projects, new product development & trial records.
          </p>
        </div>
        <div className="hidden md:flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/rnd/attachments">
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
            <Link to="/rnd/forms/rndprj/new">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Connection Banner */}
      <motion.div variants={itemVariants}>
        <Alert>
          <Microscope className="h-4 w-4" />
          <AlertTitle>SharePoint Connected</AlertTitle>
          <AlertDescription>
            Connected to <strong>MainDB_RD</strong> SharePoint site. {RND_FORMS.length} form types available.
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
                <CardDescription>Quick access to R&D forms</CardDescription>
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
                <CardTitle className="text-lg">All R&D Forms</CardTitle>
                <CardDescription>Complete list of available forms</CardDescription>
              </div>
              <Badge variant="outline">{RND_FORMS.length} total</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {RND_FORMS.map((form) => (
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
                    <EmptyDescription>Create your first R&D project</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </div>
            </SheetContent>
          </Sheet>
          <Button asChild className="flex-1 min-h-[48px]">
            <Link to="/rnd/forms/rndprj/new">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function RnDDepartmentHomePage() {
  return (
    <DataReadyGuard loadingMessage="Loading R&D dashboard...">
      <RnDDepartmentHomePageContent />
    </DataReadyGuard>
  );
}
