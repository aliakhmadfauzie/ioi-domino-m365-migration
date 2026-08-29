// Warehouse / Logistics Department Home - Navigation Hub
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Plus,
  Eye,
  Inbox,
  XCircle,
  TrendingUp,
  ChevronRight,
  Warehouse,
  PackageOpen,
  Truck,
  ClipboardList,
  AlertTriangle,
  Activity,
  RefreshCw,
  BoxSelect,
  ArrowLeftRight,
  BarChart3,
  MapPin,
  ScanLine,
  Scale,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
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

// Warehouse Modules Configuration
const WAREHOUSE_MODULES = [
  {
    code: 'M1',
    name: 'Goods Receipt',
    description: 'Inbound shipments, receiving inspections, GRN processing',
    icon: PackageOpen,
    path: '/warehouse/goods-receipt',
    colorClass: 'bg-primary',
    borderClass: 'border-l-primary',
    formCodes: ['GRN', 'RCV', 'INS', 'POD', 'UNL'],
    quickForm: { code: 'GRN', name: 'Goods Receipt', path: '/warehouse/forms/grn/new' },
  },
  {
    code: 'M2',
    name: 'Stock Transfer',
    description: 'Inter-warehouse transfers, location moves, bin management',
    icon: ArrowLeftRight,
    path: '/warehouse/stock-transfer',
    colorClass: 'bg-secondary',
    borderClass: 'border-l-secondary',
    formCodes: ['STO', 'BIN', 'LOC', 'IWT', 'PLT'],
    quickForm: { code: 'STO', name: 'Stock Transfer', path: '/warehouse/forms/sto/new' },
  },
  {
    code: 'M3',
    name: 'Delivery Orders',
    description: 'Outbound shipments, picking, packing, dispatch',
    icon: Truck,
    path: '/warehouse/delivery',
    colorClass: 'bg-accent',
    borderClass: 'border-l-accent',
    formCodes: ['DO', 'PKL', 'PKG', 'DIS', 'POD'],
    quickForm: { code: 'DO', name: 'Delivery Order', path: '/warehouse/forms/do/new' },
  },
  {
    code: 'M4',
    name: 'Inventory Adjustment',
    description: 'Stock counts, write-offs, adjustments, cycle counts',
    icon: ClipboardList,
    path: '/warehouse/inventory',
    colorClass: 'bg-primary',
    borderClass: 'border-l-primary',
    formCodes: ['ADJ', 'CYC', 'PHY', 'WRT', 'VAR'],
    quickForm: { code: 'ADJ', name: 'Stock Adjustment', path: '/warehouse/forms/adj/new' },
  },
];

// Mock data for demo
const mockStats = {
  thisMonth: 234,
  pending: 28,
  approved: 412,
  rejected: 8,
  total: 678,
};

const mockModuleStats = WAREHOUSE_MODULES.map((module, index) => ({
  ...module,
  total: 150 + index * 30,
  pending: 5 + index * 2,
  approved: 120 + index * 20,
  rejected: 2 + index,
  thisMonth: 50 + index * 15,
}));

const mockRecentSubmissions = [
  { id: '1', title: 'GRN-2024-0567 - Raw Materials', formcode: 'GRN', status: 'Pending', submitteddate: '30 mins ago' },
  { id: '2', title: 'Stock Transfer - WH1 to WH2', formcode: 'STO', status: 'Approved', submitteddate: '2 hours ago' },
  { id: '3', title: 'DO-2024-0892 - Customer Shipment', formcode: 'DO', status: 'In Progress', submitteddate: '4 hours ago' },
  { id: '4', title: 'Cycle Count - Zone A', formcode: 'CYC', status: 'Completed', submitteddate: '1 day ago' },
  { id: '5', title: 'Stock Adjustment - Damaged Goods', formcode: 'ADJ', status: 'Pending', submitteddate: '2 days ago' },
];

function WarehouseDepartmentHomeContent() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [submissionsOpen, setSubmissionsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const alertCount = 5; // Mock alert count for pending receipts

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
              <Warehouse className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Warehouse & Logistics</h1>
          </div>
          <p className="text-muted-foreground">
            Welcome{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}! Select a module below to get started.
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
            <Link to="/warehouse/forms/grn/new">
              <Plus className="h-4 w-4 mr-2" />
              New Receipt
            </Link>
          </Button>
        </div>
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
                <p className="text-sm text-muted-foreground">Processed</p>
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

      {/* Alert Banner */}
      {alertCount > 0 && (
        <motion.div variants={itemVariants}>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Pending Receipts</AlertTitle>
            <AlertDescription>
              {alertCount} goods receipt{alertCount > 1 ? 's' : ''} awaiting inspection and processing.
              <Link to="/warehouse/goods-receipt?status=pending" className="ml-2 underline font-medium">
                Process now
              </Link>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Module Cards */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Warehouse Modules</h2>
            <p className="text-sm text-muted-foreground">Select a module to view its dashboard and process transactions</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/warehouse/forms">
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
                className={`h-full cursor-pointer hover:shadow-lg transition-all border-l-4 ${module.borderClass}`}
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
                      <span className="text-muted-foreground">Processed:</span>
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
        {/* Recent Submissions */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest transactions across all modules</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/my-submissions">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockRecentSubmissions.map((submission) => (
                  <button
                    type="button"
                    key={submission.id}
                    className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    onClick={() => navigate(`/submissions/${submission.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium truncate">{submission.title}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{submission.formcode}</span>
                            <span>•</span>
                            <span>{submission.submitteddate}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">{submission.status}</Badge>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Links</CardTitle>
              <CardDescription>Tools, dashboards, and operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <Link
                  to="/warehouse/stock-levels"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                    <BoxSelect className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Stock Levels</p>
                    <p className="text-sm text-muted-foreground">Real-time inventory status</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Link
                  to="/warehouse/bin-locations"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Bin Locations</p>
                    <p className="text-sm text-muted-foreground">Warehouse mapping and zones</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Link
                  to="/warehouse/scanner"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                    <ScanLine className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Barcode Scanner</p>
                    <p className="text-sm text-muted-foreground">Quick item lookup</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Link
                  to="/warehouse/reports"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Warehouse Reports</p>
                    <p className="text-sm text-muted-foreground">Analytics and KPIs</p>
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
                <SheetTitle>Recent Transactions</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-2">
                {mockRecentSubmissions.map((submission) => (
                  <button
                    type="button"
                    key={submission.id}
                    className="w-full text-left p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setSubmissionsOpen(false);
                      navigate(`/submissions/${submission.id}`);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{submission.title}</p>
                      <Badge variant="secondary">{submission.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{submission.formcode}</p>
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <Button asChild className="flex-1 min-h-[48px]">
            <Link to="/warehouse/forms/grn/new">
              <Plus className="h-4 w-4 mr-2" />
              New Receipt
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function WarehouseDepartmentHomePage() {
  return (
    <DataReadyGuard loadingMessage="Loading Warehouse dashboard...">
      <WarehouseDepartmentHomeContent />
    </DataReadyGuard>
  );
}
