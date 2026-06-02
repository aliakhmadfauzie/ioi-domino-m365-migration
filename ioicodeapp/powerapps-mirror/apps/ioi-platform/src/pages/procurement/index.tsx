import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Package,
  FileText,
  Users,
  ClipboardCheck,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Truck,
  ShieldCheck,
  ArrowRight,
  Plus,
  BarChart3,
  Award,
  PackageCheck,
  Star,
  XCircle,
  MapPin,
  Calendar,
  DollarSign,
  Eye,
  Inbox,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.02 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
} as const;

// Form categories with counts derived from forms array
const formCategories = [
  {
    id: 'vendor-management',
    name: 'Vendor Management',
    icon: Users,
    colorClass: 'bg-accent',
    borderClass: 'border-l-accent',
    forms: [
      { code: 'VCAR', name: 'Vendor Corrective Action Request', priority: 'critical', isFrequent: true },
      { code: 'VRF', name: 'Vendor Registration Form', priority: 'critical', isFrequent: true },
      { code: 'VEF', name: 'Vendor Evaluation Form', priority: 'high', isFrequent: true },
      { code: 'VSA', name: 'Vendor Self-Assessment', priority: 'high', isFrequent: false },
      { code: 'VQA', name: 'Vendor Quality Audit', priority: 'high', isFrequent: false },
      { code: 'VPR', name: 'Vendor Performance Review', priority: 'medium', isFrequent: false },
      { code: 'VBL', name: 'Vendor Blacklist Request', priority: 'critical', isFrequent: false },
      { code: 'VReact', name: 'Vendor Reactivation Form', priority: 'medium', isFrequent: false },
      { code: 'VCert', name: 'Vendor Certification Tracker', priority: 'high', isFrequent: false },
      { code: 'VDoc', name: 'Vendor Document Request', priority: 'medium', isFrequent: false },
      { code: 'VContact', name: 'Vendor Contact Update', priority: 'low', isFrequent: false },
      { code: 'VMaster', name: 'Vendor Master Update', priority: 'high', isFrequent: false },
    ],
  },
  {
    id: 'material-evaluation',
    name: 'Material Evaluation',
    icon: PackageCheck,
    colorClass: 'bg-primary',
    borderClass: 'border-l-primary',
    forms: [
      { code: 'MER', name: 'Material Evaluation Request', priority: 'critical', isFrequent: true },
      { code: 'MST', name: 'Material Sample Testing', priority: 'high', isFrequent: true },
      { code: 'MAC', name: 'Material Approval Certificate', priority: 'critical', isFrequent: false },
      { code: 'MSpec', name: 'Material Specification Form', priority: 'high', isFrequent: false },
      { code: 'MNCon', name: 'Material Non-Conformance', priority: 'critical', isFrequent: true },
      { code: 'MAlt', name: 'Alternative Material Request', priority: 'high', isFrequent: false },
      { code: 'MRisk', name: 'Material Risk Assessment', priority: 'medium', isFrequent: false },
      { code: 'MSDS', name: 'MSDS Request Form', priority: 'high', isFrequent: false },
    ],
  },
  {
    id: 'purchasing',
    name: 'Purchasing',
    icon: Package,
    colorClass: 'bg-secondary',
    borderClass: 'border-l-secondary',
    forms: [
      { code: 'PR', name: 'Purchase Requisition', priority: 'critical', isFrequent: true },
      { code: 'RFQ', name: 'Request for Quotation', priority: 'high', isFrequent: true },
      { code: 'PO', name: 'Purchase Order', priority: 'critical', isFrequent: true },
      { code: 'POA', name: 'PO Amendment', priority: 'high', isFrequent: false },
      { code: 'POC', name: 'PO Cancellation', priority: 'medium', isFrequent: false },
      { code: 'GRN', name: 'Goods Received Note', priority: 'critical', isFrequent: true },
      { code: 'GRIR', name: 'GR/IR Clearing', priority: 'high', isFrequent: false },
      { code: 'URG', name: 'Urgent Purchase Request', priority: 'critical', isFrequent: false },
      { code: 'Blanket', name: 'Blanket PO Request', priority: 'high', isFrequent: false },
      { code: 'Consign', name: 'Consignment Agreement', priority: 'medium', isFrequent: false },
    ],
  },
  {
    id: 'contracts',
    name: 'Contracts & Agreements',
    icon: FileText,
    colorClass: 'bg-accent',
    borderClass: 'border-l-accent',
    forms: [
      { code: 'SLA', name: 'Service Level Agreement', priority: 'critical', isFrequent: false },
      { code: 'NDA', name: 'Non-Disclosure Agreement', priority: 'critical', isFrequent: true },
      { code: 'FrameAgr', name: 'Framework Agreement', priority: 'high', isFrequent: false },
      { code: 'ContRen', name: 'Contract Renewal', priority: 'high', isFrequent: false },
      { code: 'ContTerm', name: 'Contract Termination', priority: 'medium', isFrequent: false },
      { code: 'ContAmend', name: 'Contract Amendment', priority: 'high', isFrequent: false },
    ],
  },
  {
    id: 'approved-materials',
    name: 'Approved Materials List',
    icon: ShieldCheck,
    colorClass: 'bg-primary',
    borderClass: 'border-l-primary',
    forms: [
      { code: 'AML', name: 'Approved Material List Update', priority: 'critical', isFrequent: true },
      { code: 'AMLAdd', name: 'AML Addition Request', priority: 'high', isFrequent: false },
      { code: 'AMLRem', name: 'AML Removal Request', priority: 'high', isFrequent: false },
      { code: 'AMLRev', name: 'AML Review Form', priority: 'medium', isFrequent: false },
      { code: 'EquivMat', name: 'Equivalent Material Request', priority: 'high', isFrequent: false },
      { code: 'SoleSource', name: 'Sole Source Justification', priority: 'critical', isFrequent: false },
    ],
  },
  {
    id: 'supplier-audit',
    name: 'Supplier Audit',
    icon: ClipboardCheck,
    colorClass: 'bg-accent',
    borderClass: 'border-l-accent',
    forms: [
      { code: 'SAR', name: 'Supplier Audit Request', priority: 'high', isFrequent: false },
      { code: 'SAC', name: 'Supplier Audit Checklist', priority: 'high', isFrequent: false },
      { code: 'SAF', name: 'Supplier Audit Findings', priority: 'critical', isFrequent: true },
      { code: 'SCAR', name: 'Supplier Corrective Action', priority: 'critical', isFrequent: true },
      { code: 'SAClose', name: 'Audit Closure Form', priority: 'medium', isFrequent: false },
      { code: 'SAScore', name: 'Supplier Scorecard', priority: 'high', isFrequent: false },
    ],
  },
  {
    id: 'logistics',
    name: 'Logistics & Delivery',
    icon: Truck,
    colorClass: 'bg-secondary',
    borderClass: 'border-l-secondary',
    forms: [
      { code: 'DelSched', name: 'Delivery Schedule', priority: 'high', isFrequent: true },
      { code: 'DelDelay', name: 'Delivery Delay Report', priority: 'critical', isFrequent: true },
      { code: 'InTrans', name: 'In-Transit Claim', priority: 'high', isFrequent: false },
      { code: 'ShortShip', name: 'Short Shipment Report', priority: 'critical', isFrequent: false },
      { code: 'DamageRpt', name: 'Damage Report', priority: 'critical', isFrequent: false },
      { code: 'RTV', name: 'Return to Vendor', priority: 'high', isFrequent: false },
    ],
  },
  {
    id: 'cost-management',
    name: 'Cost Management',
    icon: TrendingUp,
    colorClass: 'bg-primary',
    borderClass: 'border-l-primary',
    forms: [
      { code: 'PriceNeg', name: 'Price Negotiation Form', priority: 'high', isFrequent: true },
      { code: 'CostRed', name: 'Cost Reduction Initiative', priority: 'high', isFrequent: false },
      { code: 'PriceInc', name: 'Price Increase Analysis', priority: 'critical', isFrequent: true },
      { code: 'SaveTrack', name: 'Savings Tracker', priority: 'medium', isFrequent: false },
    ],
  },
];

function getPriorityBadge(priority: string) {
  switch (priority) {
    case 'critical':
      return <Badge variant="destructive">critical</Badge>;
    case 'high':
      return <Badge variant="default">high</Badge>;
    case 'medium':
      return <Badge variant="secondary">medium</Badge>;
    default:
      return <Badge variant="outline">low</Badge>;
  }
}

function getTrendIcon(trend: string) {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-primary" />;
    case 'down':
      return <TrendingDown className="h-4 w-4 text-destructive" />;
    default:
      return <div className="h-4 w-4 rounded-full bg-muted" />;
  }
}

export default function ProcurementDepartmentHomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [submissionsOpen, setSubmissionsOpen] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalForms = formCategories.reduce((acc: number, cat) => acc + cat.forms.length, 0);
    return {
      totalForms,
      pendingCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      totalSubmissions: 0,
    };
  }, []);

  // Filter categories based on search and selection
  const filteredCategories = useMemo(() => {
    return formCategories.filter((category) => {
      if (selectedCategory && category.id !== selectedCategory) return false;
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase();
        return (
          category.name.toLowerCase().includes(query) ||
          category.forms.some(
            (form) => form.name.toLowerCase().includes(query) || form.code.toLowerCase().includes(query)
          )
        );
      }
      return true;
    });
  }, [debouncedSearch, selectedCategory]);

  // Get frequent forms across all categories
  const frequentForms = useMemo(() => {
    return formCategories
      .flatMap((cat) =>
        cat.forms.filter((f) => f.isFrequent).map((f) => ({ ...f, category: cat.name, colorClass: cat.colorClass }))
      )
      .slice(0, 8);
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
              <Package className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Procurement</h1>
          </div>
          <p className="text-muted-foreground">Vendor management, purchasing & supplier quality</p>
        </div>
        <div className="hidden md:flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/my-submissions">
              <Eye className="h-4 w-4 mr-2" />
              View Submissions
            </Link>
          </Button>
          <Button asChild>
            <Link to="/procurement/forms/VCAR/new">
              <Plus className="h-4 w-4 mr-2" />
              New VCAR
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Connection Banner */}
      <motion.div variants={itemVariants}>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>SharePoint Connection Required</AlertTitle>
          <AlertDescription>
            Connect the <strong>ioi-portal-pur</strong> SharePoint site via the Data panel to enable live submission tracking.
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
                <p className="text-2xl font-bold">{stats.pendingCount}</p>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
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
                <p className="text-2xl font-bold">{stats.approvedCount}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
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
                <p className="text-2xl font-bold">{stats.rejectedCount}</p>
                <p className="text-xs text-muted-foreground">Need attention</p>
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
                <p className="text-sm text-muted-foreground">Total Forms</p>
                <p className="text-2xl font-bold">{stats.totalForms}</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <FileText className="h-5 w-5 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Frequent Forms - Quick Access */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Frequently Used Forms</CardTitle>
                <CardDescription>Quick access to the forms you use most</CardDescription>
              </div>
              <Badge variant="secondary">{frequentForms.length} forms</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {frequentForms.map((form) => (
                <Link
                  key={form.code}
                  to={`/procurement/forms/${form.code}/new`}
                  className="flex items-center gap-3 p-4 min-h-[56px] rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-all active:scale-[0.98]"
                >
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${form.colorClass}`}>
                    <FileText className="h-5 w-5 text-primary-foreground" />
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

      {/* Main Content */}
      <Tabs defaultValue="forms" className="space-y-6">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="forms">Forms Library</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-6">
          {/* Search and Filter */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search forms by name or code..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                className="min-h-[44px] whitespace-nowrap"
                onClick={() => setSelectedCategory(null)}
              >
                All ({stats.totalForms})
              </Button>
              {formCategories.slice(0, 4).map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  className="min-h-[44px] whitespace-nowrap"
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name.split(' ')[0]}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Form Categories Grid */}
          {filteredCategories.length === 0 ? (
            <Empty className="py-12">
              <EmptyHeader>
                <EmptyTitle>No forms found</EmptyTitle>
                <EmptyDescription>Try adjusting your search or filter criteria</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <motion.div variants={containerVariants} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map((category) => (
                <motion.div key={category.id} variants={itemVariants}>
                  <Card className={`h-full hover:shadow-lg transition-shadow border-l-4 ${category.borderClass}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${category.colorClass}`}>
                          <category.icon className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{category.forms.length} forms</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-1">
                      {category.forms.slice(0, 5).map((form) => (
                        <Link
                          key={form.code}
                          to={`/procurement/forms/${form.code}/new`}
                          className="flex items-center justify-between p-3 min-h-[48px] rounded-md bg-card hover:bg-accent hover:text-accent-foreground transition-colors active:scale-[0.98]"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-mono text-sm text-muted-foreground">{form.code}</span>
                            <span className="text-sm truncate">{form.name}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {getPriorityBadge(form.priority)}
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </Link>
                      ))}
                      {category.forms.length > 5 && (
                        <Button variant="ghost" size="sm" className="w-full mt-2 min-h-[44px]" asChild>
                          <Link to={`/procurement/forms?category=${category.id}`}>
                            View all {category.forms.length} forms
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          {/* Vendor Summary Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">189</p>
                    <p className="text-sm text-muted-foreground">Approved</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                    <Clock className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">32</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-destructive flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-destructive-foreground" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">8</p>
                    <p className="text-sm text-muted-foreground">Watch List</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">3</p>
                    <p className="text-sm text-muted-foreground">Blacklisted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top Vendors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Top Performing Vendors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Palm Oil Suppliers Sdn Bhd', category: 'Raw Materials', score: 98, spend: 'RM 2.4M', location: 'Johor', trend: 'up' },
                    { name: 'Chemical Trading Corp', category: 'Chemicals', score: 95, spend: 'RM 1.8M', location: 'Selangor', trend: 'up' },
                    { name: 'Packaging Solutions Ltd', category: 'Packaging', score: 92, spend: 'RM 890K', location: 'Penang', trend: 'stable' },
                    { name: 'Industrial Equipment Sdn Bhd', category: 'Equipment', score: 89, spend: 'RM 650K', location: 'Kuala Lumpur', trend: 'down' },
                    { name: 'Transport & Logistics Co', category: 'Logistics', score: 87, spend: 'RM 420K', location: 'Perak', trend: 'up' },
                  ].map((vendor, index: number) => (
                    <div key={vendor.name} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{vendor.name}</p>
                          {getTrendIcon(vendor.trend)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{vendor.category}</span>
                          <span>•</span>
                          <MapPin className="h-3 w-3" />
                          <span>{vendor.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-primary fill-primary" />
                          <span className="font-bold">{vendor.score}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{vendor.spend}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Watch List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Vendors on Watch List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Chemical Traders Sdn Bhd', issue: 'Quality non-conformance', daysOnList: 45, lastAudit: '2024-01-15' },
                    { name: 'Bulk Materials Corp', issue: 'Late deliveries (3 incidents)', daysOnList: 30, lastAudit: '2024-02-01' },
                    { name: 'Specialty Chemicals Ltd', issue: 'Documentation issues', daysOnList: 15, lastAudit: '2024-02-20' },
                  ].map((vendor) => (
                    <div key={vendor.name} className="p-4 rounded-lg border border-destructive bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{vendor.name}</p>
                        <Badge variant="destructive">{vendor.daysOnList} days</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{vendor.issue}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Last audit: {vendor.lastAudit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Certification Expirations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Upcoming Certification Expirations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { vendor: 'Palm Oil Suppliers Sdn Bhd', cert: 'RSPO', expires: '2024-04-15', daysLeft: 45 },
                  { vendor: 'Chemical Trading Corp', cert: 'ISO 9001', expires: '2024-05-01', daysLeft: 61 },
                  { vendor: 'Packaging Solutions Ltd', cert: 'FSSC 22000', expires: '2024-03-30', daysLeft: 30 },
                ].map((cert) => (
                  <div key={`${cert.vendor}-${cert.cert}`} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant={cert.daysLeft <= 30 ? 'destructive' : 'secondary'}>
                        {cert.daysLeft} days left
                      </Badge>
                      <span className="font-mono text-sm">{cert.cert}</span>
                    </div>
                    <p className="font-medium text-sm">{cert.vendor}</p>
                    <p className="text-xs text-muted-foreground mt-1">Expires: {cert.expires}</p>
                    <Progress value={100 - (cert.daysLeft / 90) * 100} className="h-1.5 mt-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vendor Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Overall Vendor Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-foreground">92.4%</p>
                  <p className="text-sm text-muted-foreground">On-Time Delivery</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-foreground">97.1%</p>
                  <p className="text-sm text-muted-foreground">Quality Acceptance</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-foreground">4.2</p>
                  <p className="text-sm text-muted-foreground">Avg Response Days</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-foreground">89.6</p>
                  <p className="text-sm text-muted-foreground">Avg Vendor Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
                    <EmptyTitle>Connect SharePoint</EmptyTitle>
                    <EmptyDescription>Add the ioi-portal-pur site to view submissions</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </div>
            </SheetContent>
          </Sheet>
          <Button asChild className="flex-1 min-h-[48px]">
            <Link to="/procurement/forms/VCAR/new">
              <Plus className="h-4 w-4 mr-2" />
              New VCAR
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
