import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Factory,
  Search,
  Filter,
  ChevronRight,
  FileText,
  Wrench,
  Gauge,
  Package,
  BarChart3,
  Settings,
  ClipboardCheck,
  Thermometer,
  Droplets,
  Zap,
  Clock,
  Beaker,
  Scale,
  Truck,
  AlertTriangle,
  CheckCircle2,
  FlaskConical,
  Layers,
  Box,
  Cog,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    transition: { staggerChildren: 0.03, delayChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
} as const;

interface FormItem {
  code: string;
  name: string;
  category: string;
  icon: LucideIcon;
  description: string;
  status: 'active' | 'draft' | 'archived';
  site?: 'Prai' | 'Johor' | 'Both';
}

const productionForms: FormItem[] = [
  // SAM - Standard Analytical Methods (12 forms)
  { code: 'SAM-001', name: 'SAM Master List', category: 'SAM', icon: ClipboardCheck, description: 'Master list of standard analytical methods', status: 'active', site: 'Both' },
  { code: 'SAM-002', name: 'SAM Request Form', category: 'SAM', icon: FileText, description: 'Request new analytical method', status: 'active', site: 'Both' },
  { code: 'SAM-003', name: 'SAM Review Form', category: 'SAM', icon: ClipboardCheck, description: 'Review and update existing SAM', status: 'active', site: 'Both' },
  { code: 'SAM-004', name: 'SAM Deviation Report', category: 'SAM', icon: AlertTriangle, description: 'Report deviations from standard methods', status: 'active', site: 'Both' },
  { code: 'SAM-005', name: 'SAM Validation Protocol', category: 'SAM', icon: CheckCircle2, description: 'Method validation documentation', status: 'active', site: 'Both' },
  { code: 'SAM-006', name: 'SAM Training Record', category: 'SAM', icon: ClipboardCheck, description: 'SAM training completion records', status: 'active', site: 'Both' },
  
  // TPM - Total Productive Maintenance (10 forms)
  { code: 'TPM-001', name: 'TPM Database', category: 'TPM', icon: Wrench, description: 'Total productive maintenance master database', status: 'active', site: 'Both' },
  { code: 'TPM-002', name: 'TPM Daily Checklist', category: 'TPM', icon: ClipboardCheck, description: 'Daily maintenance checklist', status: 'active', site: 'Both' },
  { code: 'TPM-003', name: 'TPM Breakdown Report', category: 'TPM', icon: AlertTriangle, description: 'Equipment breakdown reporting', status: 'active', site: 'Both' },
  { code: 'TPM-004', name: 'TPM Spare Parts Request', category: 'TPM', icon: Package, description: 'Request spare parts for maintenance', status: 'active', site: 'Both' },
  { code: 'TPM-005', name: 'TPM PM Schedule', category: 'TPM', icon: Clock, description: 'Preventive maintenance schedule', status: 'active', site: 'Both' },
  { code: 'TPM-006', name: 'TPM Work Order', category: 'TPM', icon: FileText, description: 'Maintenance work order form', status: 'active', site: 'Both' },
  { code: 'TPM-007', name: 'TPM Lubricant Log', category: 'TPM', icon: Droplets, description: 'Lubrication tracking log', status: 'active', site: 'Both' },
  { code: 'TPM-008', name: 'TPM Autonomous Maintenance', category: 'TPM', icon: Cog, description: 'Operator-led maintenance checklist', status: 'active', site: 'Both' },
  
  // CCP - Critical Control Points (8 forms)
  { code: 'CCP-001', name: 'CCP Filter Inspection', category: 'CCP', icon: Gauge, description: 'Critical control point filter inspection', status: 'active', site: 'Both' },
  { code: 'CCP-002', name: 'CCP Monitoring Log', category: 'CCP', icon: ClipboardCheck, description: 'CCP monitoring and recording', status: 'active', site: 'Both' },
  { code: 'CCP-003', name: 'CCP Deviation Report', category: 'CCP', icon: AlertTriangle, description: 'Report CCP deviations', status: 'active', site: 'Both' },
  { code: 'CCP-004', name: 'CCP Corrective Action', category: 'CCP', icon: CheckCircle2, description: 'CCP corrective action form', status: 'active', site: 'Both' },
  { code: 'CCP-005', name: 'CCP Verification Record', category: 'CCP', icon: ClipboardCheck, description: 'CCP verification documentation', status: 'active', site: 'Both' },
  { code: 'CCP-006', name: 'CCP Calibration Log', category: 'CCP', icon: Gauge, description: 'CCP instrument calibration', status: 'active', site: 'Both' },
  
  // Material Master (8 forms)
  { code: 'MM-001', name: 'Material Master', category: 'Material', icon: Package, description: 'Material master data management', status: 'active', site: 'Both' },
  { code: 'MM-002', name: 'Material Spec Request', category: 'Material', icon: FileText, description: 'Request new material specifications', status: 'active', site: 'Both' },
  { code: 'MM-003', name: 'Material Change Request', category: 'Material', icon: Settings, description: 'Material specification change request', status: 'active', site: 'Both' },
  { code: 'MM-004', name: 'Material Approval Form', category: 'Material', icon: CheckCircle2, description: 'Material approval workflow', status: 'active', site: 'Both' },
  { code: 'MM-005', name: 'Raw Material Inspection', category: 'Material', icon: ClipboardCheck, description: 'Incoming raw material inspection', status: 'active', site: 'Both' },
  { code: 'MM-006', name: 'Material Traceability', category: 'Material', icon: Layers, description: 'Material batch traceability', status: 'active', site: 'Both' },
  
  // Production Reports (10 forms)
  { code: 'PR-001', name: 'Daily Production Report', category: 'Reports', icon: BarChart3, description: 'Daily production summary report', status: 'active', site: 'Both' },
  { code: 'PR-002', name: 'Weekly Production Summary', category: 'Reports', icon: BarChart3, description: 'Weekly production analysis', status: 'active', site: 'Both' },
  { code: 'PR-003', name: 'Monthly KPI Report', category: 'Reports', icon: BarChart3, description: 'Monthly KPI dashboard report', status: 'active', site: 'Both' },
  { code: 'PR-004', name: 'Production Variance Report', category: 'Reports', icon: FileText, description: 'Production variance analysis', status: 'active', site: 'Both' },
  { code: 'PR-005', name: 'Shift Handover Report', category: 'Reports', icon: Clock, description: 'Shift handover documentation', status: 'active', site: 'Both' },
  { code: 'PR-006', name: 'Downtime Report', category: 'Reports', icon: AlertTriangle, description: 'Production downtime analysis', status: 'active', site: 'Both' },
  { code: 'PR-007', name: 'Yield Report', category: 'Reports', icon: BarChart3, description: 'Production yield tracking', status: 'active', site: 'Both' },
  { code: 'PR-008', name: 'OEE Report', category: 'Reports', icon: Gauge, description: 'Overall Equipment Effectiveness', status: 'active', site: 'Both' },
  
  // Process Control (10 forms)
  { code: 'PC-001', name: 'Temperature Log', category: 'Process', icon: Thermometer, description: 'Process temperature monitoring', status: 'active', site: 'Both' },
  { code: 'PC-002', name: 'Flow Rate Log', category: 'Process', icon: Droplets, description: 'Process flow rate monitoring', status: 'active', site: 'Both' },
  { code: 'PC-003', name: 'Pressure Log', category: 'Process', icon: Gauge, description: 'Process pressure monitoring', status: 'active', site: 'Both' },
  { code: 'PC-004', name: 'Energy Consumption Log', category: 'Process', icon: Zap, description: 'Energy consumption tracking', status: 'active', site: 'Both' },
  { code: 'PC-005', name: 'Batch Record', category: 'Process', icon: ClipboardCheck, description: 'Production batch documentation', status: 'active', site: 'Both' },
  { code: 'PC-006', name: 'Process Parameter Sheet', category: 'Process', icon: Settings, description: 'Process parameter settings', status: 'active', site: 'Both' },
  { code: 'PC-007', name: 'Reaction Monitoring', category: 'Process', icon: FlaskConical, description: 'Chemical reaction monitoring', status: 'active', site: 'Both' },
  { code: 'PC-008', name: 'pH Control Log', category: 'Process', icon: Beaker, description: 'pH monitoring and control', status: 'active', site: 'Both' },
  
  // Equipment (8 forms)
  { code: 'EQ-001', name: 'Equipment Setup Form', category: 'Equipment', icon: Settings, description: 'Equipment setup and configuration', status: 'active', site: 'Both' },
  { code: 'EQ-002', name: 'Equipment Calibration', category: 'Equipment', icon: Gauge, description: 'Equipment calibration records', status: 'active', site: 'Both' },
  { code: 'EQ-003', name: 'Equipment Transfer Form', category: 'Equipment', icon: Truck, description: 'Equipment transfer between lines', status: 'active', site: 'Both' },
  { code: 'EQ-004', name: 'Equipment Disposal Form', category: 'Equipment', icon: FileText, description: 'Equipment disposal request', status: 'active', site: 'Both' },
  { code: 'EQ-005', name: 'Equipment Qualification', category: 'Equipment', icon: CheckCircle2, description: 'Equipment IQ/OQ/PQ records', status: 'active', site: 'Both' },
  { code: 'EQ-006', name: 'Equipment History Card', category: 'Equipment', icon: ClipboardCheck, description: 'Equipment maintenance history', status: 'active', site: 'Both' },
  
  // Quality (8 forms)
  { code: 'PQ-001', name: 'In-Process Quality Check', category: 'Quality', icon: ClipboardCheck, description: 'In-process quality inspection', status: 'active', site: 'Both' },
  { code: 'PQ-002', name: 'Final Product Inspection', category: 'Quality', icon: CheckCircle2, description: 'Final product quality release', status: 'active', site: 'Both' },
  { code: 'PQ-003', name: 'Non-Conformance Report', category: 'Quality', icon: AlertTriangle, description: 'Production NCR form', status: 'active', site: 'Both' },
  { code: 'PQ-004', name: 'Rework Request', category: 'Quality', icon: Wrench, description: 'Product rework authorization', status: 'active', site: 'Both' },
  { code: 'PQ-005', name: 'Hold/Release Form', category: 'Quality', icon: Box, description: 'Product hold and release', status: 'active', site: 'Both' },
  { code: 'PQ-006', name: 'Sample Submission', category: 'Quality', icon: Beaker, description: 'Sample submission to lab', status: 'active', site: 'Both' },
  
  // Weighing & Dispensing (6 forms)
  { code: 'WD-001', name: 'Weighing Log', category: 'Weighing', icon: Scale, description: 'Material weighing records', status: 'active', site: 'Both' },
  { code: 'WD-002', name: 'Dispensing Record', category: 'Weighing', icon: ClipboardCheck, description: 'Material dispensing documentation', status: 'active', site: 'Both' },
  { code: 'WD-003', name: 'Scale Verification', category: 'Weighing', icon: Gauge, description: 'Daily scale verification', status: 'active', site: 'Both' },
  { code: 'WD-004', name: 'Blend Sheet', category: 'Weighing', icon: Layers, description: 'Blending operation record', status: 'active', site: 'Both' },
];

const categories = ['All', 'SAM', 'TPM', 'CCP', 'Material', 'Reports', 'Process', 'Equipment', 'Quality', 'Weighing'];

const promotedProductionForms: FormItem[] = [
  { code: 'TPM', name: 'TPM Database', category: 'TPM', icon: Wrench, description: 'Total productive maintenance production records', status: 'active', site: 'Johor' },
  { code: 'BHTADDI', name: 'BHT Addition Database', category: 'Process', icon: Beaker, description: 'BHT addition production record', status: 'active', site: 'Johor' },
  { code: 'FILTCLOTREPL', name: 'Filter Cloth Replacement Record', category: 'Inspection', icon: ClipboardCheck, description: 'Filter cloth replacement record', status: 'active', site: 'Johor' },
  { code: 'OPRPCCPFILT', name: 'OPRP/CCP Filter Inspection Record', category: 'CCP', icon: Gauge, description: 'OPRP and CCP inspection record', status: 'active', site: 'Johor' },
  { code: 'STOCALLOMEMO', name: 'Stock Allocation Memo', category: 'Stock', icon: Layers, description: 'Production stock allocation memo', status: 'active', site: 'Both' },
  { code: 'STORTANKCLEA', name: 'Storage Tank Cleaning Inspection', category: 'Tank', icon: Droplets, description: 'Storage tank cleaning inspection', status: 'active', site: 'Johor' },
  { code: 'WEIGSCALVERI', name: 'Weighing Scale Verification', category: 'Weighing', icon: Scale, description: 'Weighing scale verification record', status: 'active', site: 'Johor' },
  { code: 'EQUIPREINSP', name: 'Equipment Pre-Inspection Report', category: 'Inspection', icon: ClipboardCheck, description: 'Equipment pre-operation safety and readiness checks', status: 'active', site: 'Prai' },
  { code: 'SAPMATEMAST', name: 'SAP Material Master Maintenance Request', category: 'Material', icon: Package, description: 'SAP material master creation and maintenance request', status: 'active', site: 'Prai' },
  { code: 'CCP1FILTINSP', name: 'CCP1 Filter Inspection Findings', category: 'CCP', icon: Gauge, description: 'Critical control point filter inspection findings', status: 'active', site: 'Prai' },
  { code: 'STORTANKVERI', name: 'Storage Tank Verification Form', category: 'Tank', icon: Droplets, description: 'Storage tank verification and inspection record', status: 'active', site: 'Prai' },
];

const promotedProductionCategories = ['All', ...Array.from(new Set(promotedProductionForms.map((form) => form.category)))];

export default function ProductionFormsIndexPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const filteredForms = promotedProductionForms.filter((form: FormItem) => {
    const matchesSearch =
      form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'all' || form.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedForms = filteredForms.reduce((acc: Record<string, FormItem[]>, form: FormItem) => {
    if (!acc[form.category]) acc[form.category] = [];
    acc[form.category].push(form);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Factory className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Production Forms</h1>
          </div>
          <p className="text-muted-foreground">{promotedProductionForms.length} promoted PRD forms from source analysis</p>
        </div>
        <Button onClick={() => navigate('/production/forms/EQUIPREINSP/new')}>
          <Factory className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' as const }}
        className="grid grid-cols-2 md:grid-cols-5 gap-3"
      >
        {promotedProductionCategories.filter((c: string) => c !== 'All').map((cat: string) => {
          const count = promotedProductionForms.filter((f: FormItem) => f.category === cat).length;
          return (
            <Card
              key={cat}
              className={`cursor-pointer transition-all hover:shadow-md ${selectedCategory === cat ? 'ring-2 ring-emerald-500' : ''}`}
              onClick={() => setSelectedCategory(selectedCategory === cat ? undefined : cat)}
            >
              <CardContent className="py-3 px-4">
                <div className="text-2xl font-bold text-primary">{count}</div>
                <div className="text-xs text-muted-foreground">{cat}</div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' as const }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search forms..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={selectedCategory ?? 'all'}
          onValueChange={(val: string) => setSelectedCategory(val === 'all' ? undefined : val)}
        >
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {promotedProductionCategories.map((cat: string) => (
              <SelectItem key={cat} value={cat === 'All' ? 'all' : cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Forms by Category */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {Object.entries(groupedForms).map(([category, forms]: [string, FormItem[]]) => (
          <Card key={category}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Factory className="h-5 w-5 text-primary" />
                {category}
                <Badge variant="secondary" className="ml-2">{forms.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="divide-y divide-border">
                {forms.map((form: FormItem) => (
                  <motion.div
                    key={form.code}
                    variants={itemVariants}
                    className="flex items-center justify-between py-3 cursor-pointer hover:bg-muted/50 -mx-4 px-4 transition-colors"
                    onClick={() => navigate(`/production/forms/${form.code}/new`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/50/10">
                        <form.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{form.name}</span>
                          <Badge variant="outline" className="text-xs">{form.code}</Badge>
                          {form.site && (
                            <Badge variant="secondary" className="text-xs">{form.site}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{form.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                          event.stopPropagation();
                          navigate(`/production/forms/${form.code}`);
                        }}
                      >
                        View Rows
                      </Button>
                      <Button
                        size="sm"
                        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                          event.stopPropagation();
                          navigate(`/production/forms/${form.code}/new`);
                        }}
                      >
                        New
                      </Button>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {filteredForms.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <Factory className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No forms found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
