// Sales & Marketing Department Home - Navigation Hub (Placeholder)
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
  Plus,
  Eye,
  XCircle,
  TrendingUp,
  ChevronRight,
  ShoppingCart,
  Users,
  MessageSquare,
  FileCheck,
  AlertCircle,
  Activity,
  RefreshCw,
  Target,
  BarChart3,
  Megaphone,
  Gift,
  BadgePercent,
  HandshakeIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
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

// Sales & Marketing Modules Configuration (Placeholder)
const SALES_MODULES = [
  {
    code: 'M1',
    name: 'Customer Requests',
    description: 'Customer inquiries, service requests, account management',
    icon: Users,
    path: '/sales/customer-requests',
    colorClass: 'bg-primary',
    borderClass: 'border-l-primary',
    formCodes: ['CRQ', 'ACC', 'INQ', 'SVC'],
    quickForm: { code: 'CRQ', name: 'Customer Request', path: '/sales/forms/crq/new' },
    isPlaceholder: true,
  },
  {
    code: 'M2',
    name: 'Quotations',
    description: 'Price quotes, proposals, tenders, RFQ responses',
    icon: FileCheck,
    path: '/sales/quotations',
    colorClass: 'bg-secondary',
    borderClass: 'border-l-secondary',
    formCodes: ['QUO', 'PRP', 'TND', 'RFQ'],
    quickForm: { code: 'QUO', name: 'New Quote', path: '/sales/forms/quo/new' },
    isPlaceholder: true,
  },
  {
    code: 'M3',
    name: 'Sample Requests',
    description: 'Product samples, trial orders, demo requests',
    icon: Gift,
    path: '/sales/samples',
    colorClass: 'bg-accent',
    borderClass: 'border-l-accent',
    formCodes: ['SMP', 'TRL', 'DMO', 'EVL'],
    quickForm: { code: 'SMP', name: 'Sample Request', path: '/sales/forms/smp/new' },
    isPlaceholder: true,
  },
  {
    code: 'M4',
    name: 'Customer Complaints',
    description: 'Complaints handling, returns, claims, feedback',
    icon: MessageSquare,
    path: '/sales/complaints',
    colorClass: 'bg-primary',
    borderClass: 'border-l-primary',
    formCodes: ['CMP', 'RTN', 'CLM', 'FBK'],
    quickForm: { code: 'CMP', name: 'Log Complaint', path: '/sales/forms/cmp/new' },
    isPlaceholder: true,
  },
];

// Mock data for demo
const mockStats = {
  thisMonth: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
  total: 0,
};

const mockModuleStats = SALES_MODULES.map((module) => ({
  ...module,
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
  thisMonth: 0,
}));

function SalesDepartmentHomeContent() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [submissionsOpen, setSubmissionsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
              <ShoppingCart className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Sales & Marketing</h1>
            <Badge variant="secondary" className="ml-2">Placeholder</Badge>
          </div>
          <p className="text-muted-foreground">
            Welcome{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}! Modules and forms will be configured separately.
          </p>
        </div>
        <div className="hidden md:flex gap-2">
          <Button variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" asChild>
            <Link to="/my-submissions">
              <Eye className="h-4 w-4 mr-2" />
              View Submissions
            </Link>
          </Button>
          <Button asChild>
            <Link to="/sales/forms">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Placeholder Alert */}
      <motion.div variants={itemVariants}>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Placeholder Module</AlertTitle>
          <AlertDescription>
            This Sales & Marketing department is a placeholder. Forms and modules will be configured separately based on your requirements.
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">{mockStats.thisMonth}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{mockStats.pending}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                <Clock className="h-5 w-5 text-secondary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{mockStats.approved}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{mockStats.rejected}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-destructive flex items-center justify-center">
                <XCircle className="h-5 w-5 text-destructive-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{mockStats.total}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <FileText className="h-5 w-5 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Module Cards */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Sales & Marketing Modules</h2>
            <p className="text-sm text-muted-foreground">Placeholder modules - to be configured</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/sales/forms">
              View All Forms
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {mockModuleStats.map((module) => (
            <motion.div
              key={module.code}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Card
                className={`h-full cursor-pointer hover:shadow-lg transition-all border-l-4 ${module.borderClass} opacity-75`}
                onClick={() => navigate(module.path)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-4">
                    <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${module.colorClass} shrink-0`}>
                      <module.icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs font-mono">{module.code}</Badge>
                        <CardTitle className="text-lg truncate">{module.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs">Placeholder</Badge>
                      </div>
                      <CardDescription className="line-clamp-2">{module.description}</CardDescription>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-secondary" />
                      <span className="text-muted-foreground">Pending:</span>
                      <span className="font-medium">{module.pending}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-muted-foreground">Approved:</span>
                      <span className="font-medium">{module.approved}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-destructive" />
                      <span className="text-muted-foreground">Rejected:</span>
                      <span className="font-medium">{module.rejected}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <p className="text-xs text-muted-foreground">{module.thisMonth} this month · {module.total} total</p>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        navigate(module.quickForm.path);
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {module.quickForm.name}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity - Empty */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>No submissions yet</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No activity to display</p>
                <p className="text-sm text-muted-foreground">Forms will be configured separately</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Links</CardTitle>
              <CardDescription>Tools and dashboards (placeholder)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <Link
                  to="/sales/dashboard"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-all opacity-75"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Sales Dashboard</p>
                    <p className="text-sm text-muted-foreground">Performance metrics</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Link
                  to="/sales/customers"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-all opacity-75"
                >
                  <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                    <Users className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Customer Directory</p>
                    <p className="text-sm text-muted-foreground">Customer master data</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Link
                  to="/sales/campaigns"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-all opacity-75"
                >
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Megaphone className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Marketing Campaigns</p>
                    <p className="text-sm text-muted-foreground">Campaign management</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Link
                  to="/sales/reports"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-all opacity-75"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Sales Reports</p>
                    <p className="text-sm text-muted-foreground">Analytics and forecasts</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Mobile CTA */}
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
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No submissions yet</p>
              </div>
            </SheetContent>
          </Sheet>
          <Button asChild className="flex-1 min-h-[48px]">
            <Link to="/sales/forms">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function SalesDepartmentHomePage() {
  return (
    <DataReadyGuard loadingMessage="Loading Sales & Marketing dashboard...">
      <SalesDepartmentHomeContent />
    </DataReadyGuard>
  );
}
