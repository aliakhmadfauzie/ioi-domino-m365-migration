import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Search,
  Users,
  Package,
  PackageCheck,
  FileText,
  ShieldCheck,
  ClipboardCheck,
  Truck,
  TrendingUp,
  ArrowRight,
  Plus,
  AlertTriangle,
  Factory,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
} as const;

// All procurement forms (58+)
const allForms = [
  // Vendor Management (12)
  { code: 'VCAR', name: 'Vendor Corrective Action Request', category: 'vendor-management', priority: 'critical', site: 'both' },
  { code: 'VRF', name: 'Vendor Registration Form', category: 'vendor-management', priority: 'critical', site: 'both' },
  { code: 'VEF', name: 'Vendor Evaluation Form', category: 'vendor-management', priority: 'high', site: 'both' },
  { code: 'VSA', name: 'Vendor Self-Assessment', category: 'vendor-management', priority: 'high', site: 'both' },
  { code: 'VQA', name: 'Vendor Quality Audit', category: 'vendor-management', priority: 'high', site: 'both' },
  { code: 'VPR', name: 'Vendor Performance Review', category: 'vendor-management', priority: 'medium', site: 'both' },
  { code: 'VBL', name: 'Vendor Blacklist Request', category: 'vendor-management', priority: 'critical', site: 'both' },
  { code: 'VReact', name: 'Vendor Reactivation Form', category: 'vendor-management', priority: 'medium', site: 'both' },
  { code: 'VCert', name: 'Vendor Certification Tracker', category: 'vendor-management', priority: 'high', site: 'both' },
  { code: 'VDoc', name: 'Vendor Document Request', category: 'vendor-management', priority: 'medium', site: 'both' },
  { code: 'VContact', name: 'Vendor Contact Update', category: 'vendor-management', priority: 'low', site: 'both' },
  { code: 'VMaster', name: 'Vendor Master Update', category: 'vendor-management', priority: 'high', site: 'both' },

  // Material Evaluation (8)
  { code: 'MER', name: 'Material Evaluation Request', category: 'material-evaluation', priority: 'critical', site: 'both' },
  { code: 'MST', name: 'Material Sample Testing', category: 'material-evaluation', priority: 'high', site: 'both' },
  { code: 'MAC', name: 'Material Approval Certificate', category: 'material-evaluation', priority: 'critical', site: 'both' },
  { code: 'MSpec', name: 'Material Specification Form', category: 'material-evaluation', priority: 'high', site: 'both' },
  { code: 'MNCon', name: 'Material Non-Conformance', category: 'material-evaluation', priority: 'critical', site: 'both' },
  { code: 'MAlt', name: 'Alternative Material Request', category: 'material-evaluation', priority: 'high', site: 'both' },
  { code: 'MRisk', name: 'Material Risk Assessment', category: 'material-evaluation', priority: 'medium', site: 'both' },
  { code: 'MSDS', name: 'MSDS Request Form', category: 'material-evaluation', priority: 'high', site: 'both' },

  // Purchasing (10)
  { code: 'PR', name: 'Purchase Requisition', category: 'purchasing', priority: 'critical', site: 'both' },
  { code: 'RFQ', name: 'Request for Quotation', category: 'purchasing', priority: 'high', site: 'both' },
  { code: 'PO', name: 'Purchase Order', category: 'purchasing', priority: 'critical', site: 'both' },
  { code: 'POA', name: 'PO Amendment', category: 'purchasing', priority: 'high', site: 'both' },
  { code: 'POC', name: 'PO Cancellation', category: 'purchasing', priority: 'medium', site: 'both' },
  { code: 'GRN', name: 'Goods Received Note', category: 'purchasing', priority: 'critical', site: 'both' },
  { code: 'GRIR', name: 'GR/IR Clearing', category: 'purchasing', priority: 'high', site: 'both' },
  { code: 'URG', name: 'Urgent Purchase Request', category: 'purchasing', priority: 'critical', site: 'both' },
  { code: 'Blanket', name: 'Blanket PO Request', category: 'purchasing', priority: 'high', site: 'both' },
  { code: 'Consign', name: 'Consignment Agreement', category: 'purchasing', priority: 'medium', site: 'both' },

  // Contracts & Agreements (6)
  { code: 'SLA', name: 'Service Level Agreement', category: 'contracts', priority: 'critical', site: 'both' },
  { code: 'NDA', name: 'Non-Disclosure Agreement', category: 'contracts', priority: 'critical', site: 'both' },
  { code: 'FrameAgr', name: 'Framework Agreement', category: 'contracts', priority: 'high', site: 'both' },
  { code: 'ContRen', name: 'Contract Renewal', category: 'contracts', priority: 'high', site: 'both' },
  { code: 'ContTerm', name: 'Contract Termination', category: 'contracts', priority: 'medium', site: 'both' },
  { code: 'ContAmend', name: 'Contract Amendment', category: 'contracts', priority: 'high', site: 'both' },

  // Approved Materials List (6)
  { code: 'AML', name: 'Approved Material List Update', category: 'approved-materials', priority: 'critical', site: 'both' },
  { code: 'AMLAdd', name: 'AML Addition Request', category: 'approved-materials', priority: 'high', site: 'both' },
  { code: 'AMLRem', name: 'AML Removal Request', category: 'approved-materials', priority: 'high', site: 'both' },
  { code: 'AMLRev', name: 'AML Review Form', category: 'approved-materials', priority: 'medium', site: 'both' },
  { code: 'EquivMat', name: 'Equivalent Material Request', category: 'approved-materials', priority: 'high', site: 'both' },
  { code: 'SoleSource', name: 'Sole Source Justification', category: 'approved-materials', priority: 'critical', site: 'both' },

  // Supplier Audit (6)
  { code: 'SAR', name: 'Supplier Audit Request', category: 'supplier-audit', priority: 'high', site: 'both' },
  { code: 'SAC', name: 'Supplier Audit Checklist', category: 'supplier-audit', priority: 'high', site: 'both' },
  { code: 'SAF', name: 'Supplier Audit Findings', category: 'supplier-audit', priority: 'critical', site: 'both' },
  { code: 'SCAR', name: 'Supplier Corrective Action', category: 'supplier-audit', priority: 'critical', site: 'both' },
  { code: 'SAClose', name: 'Audit Closure Form', category: 'supplier-audit', priority: 'medium', site: 'both' },
  { code: 'SAScore', name: 'Supplier Scorecard', category: 'supplier-audit', priority: 'high', site: 'both' },

  // Logistics & Delivery (6)
  { code: 'DelSched', name: 'Delivery Schedule', category: 'logistics', priority: 'high', site: 'both' },
  { code: 'DelDelay', name: 'Delivery Delay Report', category: 'logistics', priority: 'critical', site: 'both' },
  { code: 'InTrans', name: 'In-Transit Claim', category: 'logistics', priority: 'high', site: 'both' },
  { code: 'ShortShip', name: 'Short Shipment Report', category: 'logistics', priority: 'critical', site: 'both' },
  { code: 'DamageRpt', name: 'Damage Report', category: 'logistics', priority: 'critical', site: 'both' },
  { code: 'RTV', name: 'Return to Vendor', category: 'logistics', priority: 'high', site: 'both' },

  // Cost Management (4)
  { code: 'PriceNeg', name: 'Price Negotiation Form', category: 'cost-management', priority: 'high', site: 'both' },
  { code: 'CostRed', name: 'Cost Reduction Initiative', category: 'cost-management', priority: 'high', site: 'both' },
  { code: 'PriceInc', name: 'Price Increase Analysis', category: 'cost-management', priority: 'critical', site: 'both' },
  { code: 'SaveTrack', name: 'Savings Tracker', category: 'cost-management', priority: 'medium', site: 'both' },
];

const categories = [
  { id: 'vendor-management', name: 'Vendor Management', icon: Users },
  { id: 'material-evaluation', name: 'Material Evaluation', icon: PackageCheck },
  { id: 'purchasing', name: 'Purchasing', icon: Package },
  { id: 'contracts', name: 'Contracts & Agreements', icon: FileText },
  { id: 'approved-materials', name: 'Approved Materials', icon: ShieldCheck },
  { id: 'supplier-audit', name: 'Supplier Audit', icon: ClipboardCheck },
  { id: 'logistics', name: 'Logistics & Delivery', icon: Truck },
  { id: 'cost-management', name: 'Cost Management', icon: TrendingUp },
];

export default function ProcurementFormsIndexPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPriority, setSelectedPriority] = useState('all');

  const filteredForms = allForms.filter((form) => {
    if (selectedCategory !== 'all' && form.category !== selectedCategory) return false;
    if (selectedPriority !== 'all' && form.priority !== selectedPriority) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        form.name.toLowerCase().includes(query) ||
        form.code.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'high':
        return 'bg-accent/500 text-white';
      case 'medium':
        return 'bg-secondary/500 text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.icon || FileText;
  };

  return (
      <motion.div
        className="space-y-6 p-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Procurement Forms</h1>
            <p className="text-muted-foreground">58 forms for vendor management, purchasing & supplier quality</p>
          </div>
          <Button asChild>
            <Link to="/procurement/forms/VCAR/new">
              <Plus className="h-4 w-4 mr-2" />
              New VCAR
            </Link>
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by form name or code..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span className="font-medium">Critical</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {allForms.filter((f) => f.priority === 'critical').length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-accent/500/10 border-accent/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-accent-foreground" />
                <span className="font-medium">High</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {allForms.filter((f) => f.priority === 'high').length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-secondary/500/10 border-secondary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-secondary-foreground" />
                <span className="font-medium">Medium</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {allForms.filter((f) => f.priority === 'medium').length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-secondary">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Factory className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Total Forms</span>
              </div>
              <p className="text-2xl font-bold mt-1">{allForms.length}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Forms List */}
        <motion.div variants={containerVariants} className="space-y-2">
          {filteredForms.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No forms found matching your criteria</p>
              </CardContent>
            </Card>
          ) : (
            filteredForms.map((form) => {
              const CategoryIcon = getCategoryIcon(form.category);
              return (
                <motion.div key={form.code} variants={itemVariants}>
                  <Link
                    to={`/procurement/forms/${form.code}/new`}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CategoryIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-muted-foreground">{form.code}</span>
                          <span className="font-medium">{form.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {categories.find((c) => c.id === form.category)?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{form.site === 'both' ? 'Prai & Johor' : form.site}</Badge>
                      <Badge className={getPriorityColor(form.priority)}>{form.priority}</Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                </motion.div>
              );
            })
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="text-center text-sm text-muted-foreground">
          Showing {filteredForms.length} of {allForms.length} forms
        </motion.div>
      </motion.div>
  );
}