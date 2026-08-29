import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Beaker,
  ClipboardCheck,
  FlaskConical,
  AlertTriangle,
  FileText,
  Activity,
  Target,
  FileSpreadsheet,
  ChevronRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Calendar,
  User,
  Building2,
  Send,
  Save,
  BarChart3,
  Microscope,
  TestTube2,
  Thermometer,
  Scale,
  FileWarning,
  ClipboardList,
  Gauge,
  ShieldCheck,
  BadgeCheck,
  Boxes,
  Truck,
  Package,
  Container,
  Settings2,
  History,
  AlertCircle,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// QC Forms from Excel spec
const qcForms = [
  {
    code: 'PQCAR',
    name: 'PQCAR - Product Quality Customer Action Report',
    description: 'Customer complaint resolution and product quality investigations',
    category: 'Quality Actions',
    icon: AlertTriangle,
    color: 'bg-destructive',
    workflow: ['QC Analyst', 'QC Supervisor', 'QC Manager', 'Quality Head'],
    fields: [
      { name: 'customerName', label: 'Customer Name', type: 'text', required: true },
      { name: 'complaintDate', label: 'Complaint Date', type: 'date', required: true },
      { name: 'productBatch', label: 'Product/Batch Number', type: 'text', required: true },
      { name: 'defectType', label: 'Defect Type', type: 'select', options: ['Appearance', 'Contamination', 'Packaging', 'Performance', 'Documentation', 'Other'], required: true },
      { name: 'severity', label: 'Severity Level', type: 'select', options: ['Critical', 'Major', 'Minor'], required: true },
      { name: 'description', label: 'Complaint Description', type: 'textarea', required: true },
      { name: 'immediateAction', label: 'Immediate Action Taken', type: 'textarea', required: true },
      { name: 'rootCause', label: 'Root Cause Analysis', type: 'textarea', required: false },
      { name: 'correctiveAction', label: 'Corrective Action Plan', type: 'textarea', required: false },
    ],
  },
  {
    code: 'PAR',
    name: 'PAR - Product Action Report',
    description: 'Internal product quality deviations and corrective actions',
    category: 'Quality Actions',
    icon: FileWarning,
    color: 'bg-accent/500',
    workflow: ['QC Analyst', 'QC Supervisor', 'QC Manager'],
    fields: [
      { name: 'productName', label: 'Product Name', type: 'text', required: true },
      { name: 'batchNumber', label: 'Batch Number', type: 'text', required: true },
      { name: 'deviationType', label: 'Deviation Type', type: 'select', options: ['Process Deviation', 'Specification Deviation', 'Equipment Failure', 'Raw Material Issue', 'Environmental', 'Other'], required: true },
      { name: 'description', label: 'Deviation Description', type: 'textarea', required: true },
      { name: 'impactAssessment', label: 'Impact Assessment', type: 'textarea', required: true },
      { name: 'proposedAction', label: 'Proposed Action', type: 'textarea', required: true },
      { name: 'preventiveMeasures', label: 'Preventive Measures', type: 'textarea', required: false },
    ],
  },
  {
    code: 'COS',
    name: 'COS - Certificate of Specification',
    description: 'Product specification certification and compliance documentation',
    category: 'Specifications',
    icon: BadgeCheck,
    color: 'bg-primary/50',
    workflow: ['QC Analyst', 'QC Supervisor', 'Quality Head'],
    fields: [
      { name: 'productName', label: 'Product Name', type: 'text', required: true },
      { name: 'productCode', label: 'Product Code', type: 'text', required: true },
      { name: 'specificationVersion', label: 'Specification Version', type: 'text', required: true },
      { name: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
      { name: 'parameters', label: 'Specification Parameters', type: 'textarea', required: true },
      { name: 'testMethods', label: 'Test Methods', type: 'textarea', required: true },
      { name: 'acceptanceCriteria', label: 'Acceptance Criteria', type: 'textarea', required: true },
    ],
  },
  {
    code: 'OOS',
    name: 'OOS - Out of Specification Investigation',
    description: 'Investigation and documentation of out-of-specification test results',
    category: 'Investigations',
    icon: AlertCircle,
    color: 'bg-destructive',
    workflow: ['QC Analyst', 'QC Supervisor', 'QC Manager', 'Quality Head'],
    fields: [
      { name: 'sampleId', label: 'Sample ID', type: 'text', required: true },
      { name: 'testParameter', label: 'Test Parameter', type: 'text', required: true },
      { name: 'specificationLimit', label: 'Specification Limit', type: 'text', required: true },
      { name: 'actualResult', label: 'Actual Result', type: 'text', required: true },
      { name: 'testDate', label: 'Test Date', type: 'date', required: true },
      { name: 'analyst', label: 'Analyst Name', type: 'text', required: true },
      { name: 'investigation', label: 'Investigation Details', type: 'textarea', required: true },
      { name: 'phase1Review', label: 'Phase 1 Review (Lab Error)', type: 'textarea', required: true },
      { name: 'phase2Review', label: 'Phase 2 Review (Extended)', type: 'textarea', required: false },
      { name: 'conclusion', label: 'Conclusion', type: 'select', options: ['Lab Error - Retest', 'Confirmed OOS - Reject', 'Under Investigation', 'Process Deviation'], required: true },
    ],
  },
  {
    code: 'ECF',
    name: 'ECF - Equipment Calibration Form',
    description: 'Lab equipment calibration scheduling and documentation',
    category: 'Equipment',
    icon: Gauge,
    color: 'bg-primary',
    workflow: ['QC Technician', 'QC Supervisor'],
    fields: [
      { name: 'equipmentName', label: 'Equipment Name', type: 'text', required: true },
      { name: 'equipmentId', label: 'Equipment ID', type: 'text', required: true },
      { name: 'location', label: 'Location', type: 'text', required: true },
      { name: 'calibrationDate', label: 'Calibration Date', type: 'date', required: true },
      { name: 'nextCalibrationDate', label: 'Next Calibration Due', type: 'date', required: true },
      { name: 'calibrationType', label: 'Calibration Type', type: 'select', options: ['Internal', 'External - Vendor', 'External - Third Party'], required: true },
      { name: 'standardsUsed', label: 'Reference Standards Used', type: 'textarea', required: true },
      { name: 'results', label: 'Calibration Results', type: 'textarea', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['Pass', 'Fail - Repair Required', 'Out of Service'], required: true },
    ],
  },
  {
    code: 'RMLR',
    name: 'RMLR - Raw Material Lab Request',
    description: 'Raw material testing requests and analysis documentation',
    category: 'Testing',
    icon: TestTube2,
    color: 'bg-secondary/500',
    workflow: ['Warehouse', 'QC Analyst', 'QC Supervisor'],
    fields: [
      { name: 'materialName', label: 'Material Name', type: 'text', required: true },
      { name: 'materialCode', label: 'Material Code', type: 'text', required: true },
      { name: 'batchNumber', label: 'Batch/Lot Number', type: 'text', required: true },
      { name: 'supplier', label: 'Supplier', type: 'text', required: true },
      { name: 'receivedDate', label: 'Date Received', type: 'date', required: true },
      { name: 'quantity', label: 'Quantity', type: 'text', required: true },
      { name: 'testsRequired', label: 'Tests Required', type: 'textarea', required: true },
      { name: 'priority', label: 'Priority', type: 'select', options: ['Normal', 'Urgent', 'Critical'], required: true },
    ],
  },
  {
    code: 'FPLR',
    name: 'FPLR - Finished Product Lab Request',
    description: 'Finished product testing and release documentation',
    category: 'Testing',
    icon: Package,
    color: 'bg-primary',
    workflow: ['Production', 'QC Analyst', 'QC Supervisor', 'QC Manager'],
    fields: [
      { name: 'productName', label: 'Product Name', type: 'text', required: true },
      { name: 'batchNumber', label: 'Batch Number', type: 'text', required: true },
      { name: 'productionDate', label: 'Production Date', type: 'date', required: true },
      { name: 'quantity', label: 'Batch Quantity', type: 'text', required: true },
      { name: 'testsRequired', label: 'Tests Required', type: 'textarea', required: true },
      { name: 'rushRequest', label: 'Rush Request', type: 'select', options: ['No', 'Yes - Customer Order', 'Yes - Other'], required: true },
      { name: 'notes', label: 'Additional Notes', type: 'textarea', required: false },
    ],
  },
  {
    code: 'SAR',
    name: 'SAR - Stability Analysis Request',
    description: 'Product stability study requests and protocol documentation',
    category: 'Testing',
    icon: Thermometer,
    color: 'bg-accent/500',
    workflow: ['R&D', 'QC Analyst', 'QC Supervisor', 'QC Manager'],
    fields: [
      { name: 'productName', label: 'Product Name', type: 'text', required: true },
      { name: 'batchNumber', label: 'Batch Number', type: 'text', required: true },
      { name: 'studyType', label: 'Study Type', type: 'select', options: ['Accelerated', 'Long-term', 'Intermediate', 'In-use'], required: true },
      { name: 'storageConditions', label: 'Storage Conditions', type: 'text', required: true },
      { name: 'duration', label: 'Study Duration', type: 'text', required: true },
      { name: 'testingIntervals', label: 'Testing Intervals', type: 'textarea', required: true },
      { name: 'parameters', label: 'Parameters to Test', type: 'textarea', required: true },
    ],
  },
  {
    code: 'MRR',
    name: 'MRR - Method Review Request',
    description: 'Analytical method review and validation documentation',
    category: 'Methods',
    icon: Microscope,
    color: 'bg-secondary/500',
    workflow: ['QC Analyst', 'QC Supervisor', 'QC Manager', 'Quality Head'],
    fields: [
      { name: 'methodName', label: 'Method Name', type: 'text', required: true },
      { name: 'methodNumber', label: 'Method Number', type: 'text', required: true },
      { name: 'reviewType', label: 'Review Type', type: 'select', options: ['New Method', 'Method Revision', 'Periodic Review', 'Transfer Validation'], required: true },
      { name: 'scope', label: 'Scope/Application', type: 'textarea', required: true },
      { name: 'changes', label: 'Proposed Changes', type: 'textarea', required: false },
      { name: 'validationRequired', label: 'Validation Required', type: 'select', options: ['Full Validation', 'Partial Validation', 'Verification Only', 'Not Required'], required: true },
    ],
  },
  {
    code: 'COA',
    name: 'COA - Certificate of Analysis',
    description: 'Product batch analysis certification for release',
    category: 'Certificates',
    icon: ClipboardCheck,
    color: 'bg-primary',
    workflow: ['QC Analyst', 'QC Supervisor', 'QC Manager'],
    fields: [
      { name: 'productName', label: 'Product Name', type: 'text', required: true },
      { name: 'batchNumber', label: 'Batch Number', type: 'text', required: true },
      { name: 'manufacturingDate', label: 'Manufacturing Date', type: 'date', required: true },
      { name: 'expiryDate', label: 'Expiry Date', type: 'date', required: true },
      { name: 'testResults', label: 'Test Results Summary', type: 'textarea', required: true },
      { name: 'disposition', label: 'Disposition', type: 'select', options: ['Release', 'Reject', 'On Hold'], required: true },
    ],
  },
  {
    code: 'RCF',
    name: 'RCF - Reagent Control Form',
    description: 'Laboratory reagent tracking and management',
    category: 'Equipment',
    icon: FlaskConical,
    color: 'bg-secondary/500',
    workflow: ['QC Technician', 'QC Supervisor'],
    fields: [
      { name: 'reagentName', label: 'Reagent Name', type: 'text', required: true },
      { name: 'lotNumber', label: 'Lot Number', type: 'text', required: true },
      { name: 'supplier', label: 'Supplier', type: 'text', required: true },
      { name: 'receivedDate', label: 'Date Received', type: 'date', required: true },
      { name: 'expiryDate', label: 'Expiry Date', type: 'date', required: true },
      { name: 'openedDate', label: 'Date Opened', type: 'date', required: false },
      { name: 'storageLocation', label: 'Storage Location', type: 'text', required: true },
      { name: 'storageConditions', label: 'Storage Conditions', type: 'text', required: true },
    ],
  },
  {
    code: 'SRF',
    name: 'SRF - Sample Retention Form',
    description: 'Sample retention and storage documentation',
    category: 'Samples',
    icon: Boxes,
    color: 'bg-primary',
    workflow: ['QC Analyst', 'QC Supervisor'],
    fields: [
      { name: 'sampleType', label: 'Sample Type', type: 'select', options: ['Raw Material', 'Finished Product', 'Stability', 'Reference Standard'], required: true },
      { name: 'productBatch', label: 'Product/Batch', type: 'text', required: true },
      { name: 'quantity', label: 'Quantity Retained', type: 'text', required: true },
      { name: 'storageLocation', label: 'Storage Location', type: 'text', required: true },
      { name: 'retentionPeriod', label: 'Retention Period', type: 'text', required: true },
      { name: 'disposalDate', label: 'Scheduled Disposal Date', type: 'date', required: true },
    ],
  },
];

// Group forms by category
const formsByCategory = qcForms.reduce((acc, form) => {
  if (!acc[form.category]) {
    acc[form.category] = [];
  }
  acc[form.category].push(form);
  return acc;
}, {} as Record<string, typeof qcForms>);

const categoryIcons: Record<string, typeof Beaker> = {
  'Quality Actions': AlertTriangle,
  'Specifications': BadgeCheck,
  'Investigations': AlertCircle,
  'Equipment': Settings2,
  'Testing': TestTube2,
  'Methods': Microscope,
  'Certificates': ClipboardCheck,
  'Samples': Boxes,
};

const categoryColors: Record<string, string> = {
  'Quality Actions': 'from-rose-500/20 to-amber-500/20 border-destructive/30',
  'Specifications': 'from-primary/50/20 to-teal-500/20 border-primary/30',
  'Investigations': 'from-red-500/20 to-rose-500/20 border-destructive/30',
  'Equipment': 'from-sky-500/20 to-blue-500/20 border-primary/30',
  'Testing': 'from-violet-500/20 to-purple-500/20 border-violet-500/30',
  'Methods': 'from-indigo-500/20 to-violet-500/20 border-secondary/30',
  'Certificates': 'from-green-500/20 to-emerald-500/20 border-primary/30',
  'Samples': 'from-cyan-500/20 to-sky-500/20 border-primary/30',
};

// Recent submissions mock data
const recentSubmissions = [
  { id: 'QC-2024-001', form: 'PQCAR', product: 'Palm Oil RBD', status: 'Pending Review', date: new Date('2024-01-15'), stage: 'QC Supervisor' },
  { id: 'QC-2024-002', form: 'OOS', product: 'Batch PK-2024-0892', status: 'Under Investigation', date: new Date('2024-01-14'), stage: 'QC Manager' },
  { id: 'QC-2024-003', form: 'ECF', product: 'HPLC Unit 3', status: 'Completed', date: new Date('2024-01-13'), stage: 'Completed' },
  { id: 'QC-2024-004', form: 'COA', product: 'Oleic Acid Batch 2024-01', status: 'Released', date: new Date('2024-01-12'), stage: 'Completed' },
  { id: 'QC-2024-005', form: 'RMLR', product: 'Sodium Hydroxide', status: 'Testing', date: new Date('2024-01-11'), stage: 'QC Analyst' },
];

export default function QCFormsIndexPage() {
  const navigate = useNavigate();
  const { formCode } = useParams<{ formCode?: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(!!formCode);
  const [selectedForm, setSelectedForm] = useState<typeof qcForms[0] | null>(
    formCode ? qcForms.find((f) => f.code.toLowerCase() === formCode.toLowerCase()) || null : null
  );
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('forms');

  const filteredForms = qcForms.filter((form) => {
    const matchesSearch =
      form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || form.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenForm = (form: typeof qcForms[0]) => {
    setSelectedForm(form);
    setFormData({});
    setIsFormDialogOpen(true);
    navigate(`/qc/forms/${form.code.toLowerCase()}/new`, { replace: true });
  };

  const handleCloseForm = () => {
    setIsFormDialogOpen(false);
    setSelectedForm(null);
    setFormData({});
    navigate('/qc/forms', { replace: true });
  };

  const handleSubmit = () => {
    toast.success(`${selectedForm?.code} form submitted successfully!`, {
      description: 'Your request has been sent for approval.',
    });
    handleCloseForm();
  };

  const handleSaveDraft = () => {
    toast.info('Draft saved', {
      description: 'You can continue this form later from My Submissions.',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Released':
        return 'bg-primary/50/10 text-primary border-primary/20';
      case 'Pending Review':
        return 'bg-accent/500/10 text-accent-foreground border-accent/20';
      case 'Under Investigation':
      case 'Testing':
        return 'bg-primary/10 text-secondary-foreground border-primary/20';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50/30 dark:from-sky-950/20 dark:via-background dark:to-cyan-950/10">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/qc')} className="shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">QC Forms & Workflows</h1>
                <p className="text-sm text-muted-foreground">Quality Control forms, testing requests, and investigations</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-primary/10 text-secondary-foreground border-primary/20">
                <Beaker className="h-3.5 w-3.5 mr-1" />
                {qcForms.length} Forms
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border">
            <TabsTrigger value="forms" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              All Forms
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <History className="h-4 w-4 mr-2" />
              Recent Submissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="forms" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search forms by name, code, or description..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory ?? 'all'} onValueChange={(val: string) => setSelectedCategory(val === 'all' ? null : val)}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.keys(formsByCategory).map((category: string) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Forms Grid by Category */}
            <div className="space-y-8">
              {Object.entries(formsByCategory)
                .filter(([category]) => !selectedCategory || category === selectedCategory)
                .map(([category, forms]) => {
                  const CategoryIcon = categoryIcons[category] || FileText;
                  const categoryFormsFiltered = forms.filter((form: typeof qcForms[0]) =>
                    form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    form.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    form.code.toLowerCase().includes(searchQuery.toLowerCase())
                  );

                  if (categoryFormsFiltered.length === 0) return null;

                  return (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className={cn('p-2 rounded-lg bg-gradient-to-br', categoryColors[category])}>
                          <CategoryIcon className="h-5 w-5 text-foreground" />
                        </div>
                        <h2 className="text-lg font-semibold text-foreground">{category}</h2>
                        <Badge variant="secondary" className="text-xs">
                          {categoryFormsFiltered.length} forms
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryFormsFiltered.map((form: typeof qcForms[0], idx: number) => {
                          const FormIcon = form.icon;
                          return (
                            <motion.div
                              key={form.code}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: idx * 0.05, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                            >
                              <Card
                                className="group cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-300 bg-card/80 backdrop-blur-sm"
                                onClick={() => handleOpenForm(form)}
                              >
                                <CardHeader className="pb-3">
                                  <div className="flex items-start justify-between">
                                    <div className={cn('p-2.5 rounded-xl', form.color)}>
                                      <FormIcon className="h-5 w-5 text-white" />
                                    </div>
                                    <Badge variant="outline" className="text-xs bg-background">
                                      {form.code}
                                    </Badge>
                                  </div>
                                  <CardTitle className="text-base mt-3 group-hover:text-secondary-foreground transition-colors line-clamp-2">
                                    {form.name}
                                  </CardTitle>
                                  <CardDescription className="text-xs line-clamp-2">
                                    {form.description}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Activity className="h-3 w-3" />
                                      <span>{form.workflow.length} steps</span>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Submissions</CardTitle>
                <CardDescription>Your recent QC form submissions and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSubmissions.map((submission, idx: number) => (
                    <motion.div
                      key={submission.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FileText className="h-4 w-4 text-secondary-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{submission.id}</span>
                            <Badge variant="outline" className="text-xs">{submission.form}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{submission.product}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge className={cn('text-xs', getStatusColor(submission.status))}>
                            {submission.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(submission.date, 'MMM d, yyyy')}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={(open: boolean) => !open && handleCloseForm()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedForm && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className={cn('p-2.5 rounded-xl', selectedForm.color)}>
                    <selectedForm.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-lg">{selectedForm.name}</DialogTitle>
                    <DialogDescription>{selectedForm.description}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* Workflow Steps */}
              <div className="flex items-center gap-2 py-3 overflow-x-auto">
                {selectedForm.workflow.map((step: string, idx: number) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap',
                      idx === 0 ? 'bg-primary text-white' : 'bg-secondary text-secondary-foreground'
                    )}>
                      {step}
                    </div>
                    {idx < selectedForm.workflow.length - 1 && (
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="space-y-4 py-4">
                {selectedForm.fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name} className="flex items-center gap-1">
                      {field.label}
                      {field.required && <span className="text-destructive">*</span>}
                    </Label>
                    {field.type === 'text' && (
                      <Input
                        id={field.name}
                        value={formData[field.name] || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))
                        }
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    )}
                    {field.type === 'date' && (
                      <Input
                        id={field.name}
                        type="date"
                        value={formData[field.name] || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))
                        }
                      />
                    )}
                    {field.type === 'textarea' && (
                      <Textarea
                        id={field.name}
                        value={formData[field.name] || ''}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))
                        }
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        rows={3}
                      />
                    )}
                    {field.type === 'select' && field.options && (
                      <Select
                        value={formData[field.name] || ''}
                        onValueChange={(val: string) =>
                          setFormData((prev) => ({ ...prev, [field.name]: val }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options.map((option: string) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex items-center justify-between pt-4">
                <Button variant="outline" onClick={handleSaveDraft}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={handleCloseForm}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} className="bg-primary hover:bg-primary text-white">
                    <Send className="h-4 w-4 mr-2" />
                    Submit for Approval
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}