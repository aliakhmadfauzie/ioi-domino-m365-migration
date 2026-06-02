import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Search,
  ChevronRight,
  FileText,
  AlertTriangle,
  Flame,
  Skull,
  HardHat,
  Eye,
  HeartPulse,
  ClipboardCheck,
  FileWarning,
  Truck,
  Droplets,
  Zap,
  Users,
  Building2,
  Siren,
  Radiation,
  Wind,
  ThermometerSun,
  Plus,
  List,
  LayoutGrid,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty';
import { useMainDBSHEList } from '@/generated/hooks/use-main-dbshe';
import type { MainDBSHE } from '@/generated/models/main-dbshe-model';
import { useApprovalHistorySHEList } from '@/generated/hooks/use-approval-history-she';

// Reduced stagger for performance
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.01, delayChildren: 0.05 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.2 } },
} as const;

interface FormDefinition {
  code: string;
  name: string;
  category: string;
  icon: LucideIcon;
  description: string;
  priority?: 'high' | 'medium' | 'low';
}

const formDefinitions: FormDefinition[] = [
  // Incident Reporting (8 forms)
  { code: 'IR-001', name: 'Incident Report Form', category: 'Incidents', icon: AlertTriangle, description: 'Report workplace incidents and injuries', priority: 'high' },
  { code: 'IR-002', name: 'Near Miss Report', category: 'Incidents', icon: FileWarning, description: 'Report near-miss incidents', priority: 'high' },
  { code: 'IR-003', name: 'First Aid Report', category: 'Incidents', icon: HeartPulse, description: 'First aid treatment records', priority: 'high' },
  { code: 'IR-004', name: 'Accident Investigation', category: 'Incidents', icon: Eye, description: 'Detailed accident investigation form', priority: 'high' },
  { code: 'IR-005', name: 'Incident Follow-up', category: 'Incidents', icon: ClipboardCheck, description: 'Incident follow-up and closure' },
  { code: 'IR-006', name: 'Dangerous Occurrence Report', category: 'Incidents', icon: Siren, description: 'DOSH reportable incidents', priority: 'high' },
  { code: 'IR-007', name: 'Property Damage Report', category: 'Incidents', icon: Building2, description: 'Property/equipment damage reporting' },
  { code: 'IR-008', name: 'Vehicle Incident Report', category: 'Incidents', icon: Truck, description: 'Vehicle-related incident report' },
  
  // HIRADC (8 forms)
  { code: 'HR-001', name: 'HIRADC Assessment', category: 'HIRADC', icon: Eye, description: 'Hazard identification and risk assessment' },
  { code: 'HR-002', name: 'HIRADC Review', category: 'HIRADC', icon: ClipboardCheck, description: 'Periodic HIRADC review' },
  { code: 'HR-003', name: 'Risk Control Register', category: 'HIRADC', icon: FileText, description: 'Risk control measures register' },
  { code: 'HR-004', name: 'JSA Form', category: 'HIRADC', icon: ClipboardCheck, description: 'Job Safety Analysis' },
  { code: 'HR-005', name: 'Task Risk Assessment', category: 'HIRADC', icon: FileText, description: 'Task-specific risk assessment' },
  { code: 'HR-006', name: 'Change Risk Assessment', category: 'HIRADC', icon: AlertTriangle, description: 'Management of change risk review' },
  { code: 'HR-007', name: 'Contractor HIRADC', category: 'HIRADC', icon: Users, description: 'Contractor hazard assessment' },
  { code: 'HR-008', name: 'New Equipment HIRADC', category: 'HIRADC', icon: Eye, description: 'New equipment hazard review' },
  
  // Chemical Management (10 forms)
  { code: 'CM-001', name: 'Chemical Inventory', category: 'Chemical', icon: Skull, description: 'Chemical inventory management' },
  { code: 'CM-002', name: 'SDS Register', category: 'Chemical', icon: FileText, description: 'Safety Data Sheet register' },
  { code: 'CM-003', name: 'Chemical Risk Assessment', category: 'Chemical', icon: Eye, description: 'Chemical risk assessment form' },
  { code: 'CM-004', name: 'Chemical Spill Report', category: 'Chemical', icon: Droplets, description: 'Chemical spill incident report', priority: 'high' },
  { code: 'CM-005', name: 'COSHH Assessment', category: 'Chemical', icon: ClipboardCheck, description: 'Control of substances hazardous to health' },
  { code: 'CM-006', name: 'Chemical Approval Form', category: 'Chemical', icon: ClipboardCheck, description: 'New chemical approval request' },
  { code: 'CM-007', name: 'Chemical Storage Audit', category: 'Chemical', icon: Building2, description: 'Chemical storage inspection' },
  { code: 'CM-008', name: 'Hazardous Waste Manifest', category: 'Chemical', icon: Radiation, description: 'Hazardous waste tracking' },
  { code: 'CM-009', name: 'Chemical Exposure Report', category: 'Chemical', icon: AlertTriangle, description: 'Chemical exposure incident', priority: 'high' },
  { code: 'CM-010', name: 'GHS Label Request', category: 'Chemical', icon: FileText, description: 'GHS label printing request' },
  
  // Fire Safety (8 forms)
  { code: 'FS-001', name: 'Fire Risk Assessment', category: 'Fire', icon: Flame, description: 'Fire risk assessment form' },
  { code: 'FS-002', name: 'Fire Drill Report', category: 'Fire', icon: FileText, description: 'Fire drill exercise report' },
  { code: 'FS-003', name: 'Fire Equipment Inspection', category: 'Fire', icon: ClipboardCheck, description: 'Fire extinguisher inspection log' },
  { code: 'FS-004', name: 'Emergency Response Plan', category: 'Fire', icon: FileWarning, description: 'Emergency response documentation' },
  { code: 'FS-005', name: 'Hot Work Permit', category: 'Fire', icon: Flame, description: 'Hot work authorization' },
  { code: 'FS-006', name: 'Fire Watch Log', category: 'Fire', icon: Eye, description: 'Fire watch documentation' },
  { code: 'FS-007', name: 'Sprinkler System Check', category: 'Fire', icon: Droplets, description: 'Sprinkler system inspection' },
  { code: 'FS-008', name: 'Fire Door Inspection', category: 'Fire', icon: Building2, description: 'Fire door condition check' },
  
  // PPE Management (6 forms)
  { code: 'PPE-001', name: 'PPE Issue Form', category: 'PPE', icon: HardHat, description: 'PPE issuance and tracking' },
  { code: 'PPE-002', name: 'PPE Inspection Log', category: 'PPE', icon: ClipboardCheck, description: 'PPE condition inspection' },
  { code: 'PPE-003', name: 'PPE Request Form', category: 'PPE', icon: FileText, description: 'Request new PPE equipment' },
  { code: 'PPE-004', name: 'PPE Training Record', category: 'PPE', icon: ClipboardCheck, description: 'PPE usage training records' },
  { code: 'PPE-005', name: 'Respiratory Protection', category: 'PPE', icon: Wind, description: 'Respiratory fit test records' },
  { code: 'PPE-006', name: 'PPE Disposal Form', category: 'PPE', icon: FileText, description: 'PPE disposal documentation' },
  
  // Health Surveillance (8 forms)
  { code: 'HS-001', name: 'Health Screening Form', category: 'Health', icon: HeartPulse, description: 'Occupational health screening' },
  { code: 'HS-002', name: 'Medical Examination Record', category: 'Health', icon: FileText, description: 'Pre-employment/periodic medical exams' },
  { code: 'HS-003', name: 'Fitness for Work', category: 'Health', icon: ClipboardCheck, description: 'Fitness for work assessment' },
  { code: 'HS-004', name: 'Exposure Monitoring', category: 'Health', icon: Eye, description: 'Occupational exposure monitoring' },
  { code: 'HS-005', name: 'Audiometry Record', category: 'Health', icon: FileText, description: 'Hearing test records' },
  { code: 'HS-006', name: 'Biological Monitoring', category: 'Health', icon: Droplets, description: 'Biological exposure testing' },
  { code: 'HS-007', name: 'Heat Stress Assessment', category: 'Health', icon: ThermometerSun, description: 'Heat stress monitoring' },
  { code: 'HS-008', name: 'Return to Work Form', category: 'Health', icon: ClipboardCheck, description: 'Return to work clearance' },
  
  // Environmental (8 forms)
  { code: 'ENV-001', name: 'Environmental Aspect Register', category: 'Environment', icon: Droplets, description: 'Environmental aspects and impacts' },
  { code: 'ENV-002', name: 'Waste Management Log', category: 'Environment', icon: Truck, description: 'Waste disposal tracking' },
  { code: 'ENV-003', name: 'Spillage Report', category: 'Environment', icon: Droplets, description: 'Environmental spillage report', priority: 'high' },
  { code: 'ENV-004', name: 'Energy Monitoring', category: 'Environment', icon: Zap, description: 'Energy consumption tracking' },
  { code: 'ENV-005', name: 'Air Emission Monitoring', category: 'Environment', icon: Wind, description: 'Stack emission monitoring' },
  { code: 'ENV-006', name: 'Effluent Monitoring', category: 'Environment', icon: Droplets, description: 'Wastewater monitoring' },
  { code: 'ENV-007', name: 'Noise Monitoring', category: 'Environment', icon: FileText, description: 'Noise level measurement' },
  { code: 'ENV-008', name: 'Environmental Incident', category: 'Environment', icon: AlertTriangle, description: 'Environmental incident report', priority: 'high' },
  
  // Permits to Work (8 forms)
  { code: 'PTW-001', name: 'Permit to Work', category: 'Permits', icon: ClipboardCheck, description: 'General permit to work system' },
  { code: 'PTW-002', name: 'Hot Work Permit', category: 'Permits', icon: Flame, description: 'Hot work authorization' },
  { code: 'PTW-003', name: 'Confined Space Entry', category: 'Permits', icon: FileWarning, description: 'Confined space entry permit' },
  { code: 'PTW-004', name: 'Electrical Work Permit', category: 'Permits', icon: Zap, description: 'Electrical work authorization' },
  { code: 'PTW-005', name: 'Working at Height', category: 'Permits', icon: Building2, description: 'Height work permit' },
  { code: 'PTW-006', name: 'Excavation Permit', category: 'Permits', icon: FileText, description: 'Ground excavation authorization' },
  { code: 'PTW-007', name: 'Lifting Operations', category: 'Permits', icon: FileWarning, description: 'Crane/lifting operations permit' },
  { code: 'PTW-008', name: 'Radiation Work Permit', category: 'Permits', icon: Radiation, description: 'Radioactive work authorization' },
  
  // Safety Training (6 forms)
  { code: 'ST-001', name: 'Safety Induction', category: 'Training', icon: Users, description: 'New employee safety induction' },
  { code: 'ST-002', name: 'Training Needs Analysis', category: 'Training', icon: ClipboardCheck, description: 'Safety training needs assessment' },
  { code: 'ST-003', name: 'Training Attendance', category: 'Training', icon: FileText, description: 'Training attendance record' },
  { code: 'ST-004', name: 'Competency Assessment', category: 'Training', icon: ClipboardCheck, description: 'Safety competency evaluation' },
  { code: 'ST-005', name: 'Toolbox Talk Record', category: 'Training', icon: Users, description: 'Toolbox talk documentation' },
  { code: 'ST-006', name: 'Emergency Drill Record', category: 'Training', icon: Siren, description: 'Emergency drill participation' },
];

const categories = ['Incidents', 'HIRADC', 'Chemical', 'Fire', 'PPE', 'Health', 'Environment', 'Permits', 'Training'];

const categoryIcons: Record<string, LucideIcon> = {
  'Incidents': AlertTriangle,
  'HIRADC': Eye,
  'Chemical': Skull,
  'Fire': Flame,
  'PPE': HardHat,
  'Health': HeartPulse,
  'Environment': Droplets,
  'Permits': ClipboardCheck,
  'Training': Users,
};

const categoryColors: Record<string, string> = {
  'Incidents': '#ef4444',
  'HIRADC': '#f59e0b',
  'Chemical': '#8b5cf6',
  'Fire': '#dc2626',
  'PPE': '#3b82f6',
  'Health': '#10b981',
  'Environment': '#06b6d4',
  'Permits': '#6366f1',
  'Training': '#ec4899',
};

function getStatusBadge(status: string) {
  switch (status?.toLowerCase()) {
    case 'approved':
    case 'completed':
      return <Badge className="bg-primary text-white">Approved</Badge>;
    case 'pending':
    case 'in progress':
      return <Badge className="bg-accent text-white">Pending</Badge>;
    case 'rejected':
      return <Badge className="bg-destructive text-white">Rejected</Badge>;
    default:
      return <Badge className="bg-muted text-white">Draft</Badge>;
  }
}

function getStatusIcon(status: string) {
  switch (status?.toLowerCase()) {
    case 'approved':
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 text-primary" />;
    case 'pending':
    case 'in progress':
      return <Clock className="h-4 w-4 text-accent-foreground" />;
    case 'rejected':
      return <XCircle className="h-4 w-4 text-destructive" />;
    default:
      return <FileText className="h-4 w-4 text-muted-foreground" />;
  }
}

export default function SHEFormsIndexPage() {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'forms' | 'submissions'>('forms');
  const [submissionsSheetOpen, setSubmissionsSheetOpen] = useState(false);
  const [selectedFormCode, setSelectedFormCode] = useState<string | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    pageRef.current?.focus();
  }, []);

  // Fetch real data from SharePoint
  const { data: submissions, isLoading: submissionsLoading } = useMainDBSHEList();
  const { data: approvalHistory } = useApprovalHistorySHEList();

  // Filter form definitions
  const filteredForms = formDefinitions.filter((form: FormDefinition) => {
    const matchesSearch =
      form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'all' || form.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group forms by category
  const groupedForms = filteredForms.reduce((acc: Record<string, FormDefinition[]>, form: FormDefinition) => {
    if (!acc[form.category]) acc[form.category] = [];
    acc[form.category].push(form);
    return acc;
  }, {});

  // Count submissions by form code
  const submissionCounts: Record<string, number> = {};
  const pendingCounts: Record<string, number> = {};
  submissions?.forEach((sub: { formCode?: string; statusKey?: string }) => {
    const code = sub.formCode || 'UNKNOWN';
    submissionCounts[code] = (submissionCounts[code] || 0) + 1;
    if (sub.statusKey === 'StatusKey1') {
      pendingCounts[code] = (pendingCounts[code] || 0) + 1;
    }
  });

  const highPriorityCount = formDefinitions.filter((f: FormDefinition) => f.priority === 'high').length;
  const totalSubmissions = submissions?.length || 0;
  const pendingSubmissions = submissions?.filter((s: { statusKey?: string }) => s.statusKey === 'StatusKey1').length || 0;

  // Get submissions for a specific form code
  const getFormSubmissions = (formCode: string) => {
    return submissions?.filter((s: { formCode?: string }) => s.formCode === formCode) || [];
  };

  const handleFormClick = (form: FormDefinition) => {
    setSelectedFormCode(form.code);
    setSubmissionsSheetOpen(true);
  };

  const handleNewForm = (formCode: string) => {
    navigate(`/she/forms/${formCode}/new`);
  };

  return (
    <div ref={pageRef} tabIndex={-1} className="flex flex-col min-h-[calc(100vh-4rem)] outline-none">
      {/* Main Content - scrollable */}
      <div className="flex-1 space-y-6 p-4 md:p-6 pb-24 md:pb-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' as const }}
          className="flex flex-col gap-4"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-destructive rounded-xl">
                  <Shield className="h-6 w-6 md:h-7 md:w-7 text-destructive-foreground" />
                </div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">SHE Forms</h1>
              </div>
              <p className="text-sm md:text-base text-muted-foreground">
                {formDefinitions.length} forms • {totalSubmissions} submissions
              </p>
            </div>
            {/* Desktop Report Incident button */}
            <Button 
              className="hidden md:flex bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => navigate('/she/forms/IR-001/new')}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report Incident
            </Button>
          </div>
        </motion.div>

        {/* Stats Row - Horizontal scroll on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05, ease: 'easeOut' as const }}
        >
          <ScrollArea className="w-full">
            <div className="flex gap-3 pb-2">
              {categories.map((cat: string) => {
                const count = formDefinitions.filter((f: FormDefinition) => f.category === cat).length;
                const Icon = categoryIcons[cat];
                const color = categoryColors[cat];
                const isSelected = selectedCategory === cat;
                return (
                  <Card
                    key={cat}
                    className={`cursor-pointer transition-all shrink-0 min-w-[120px] ${isSelected ? 'ring-2 ring-offset-2' : 'hover:shadow-md'}`}
                    style={{ 
                      borderLeftWidth: '4px',
                      borderLeftColor: color,
                      ...(isSelected ? { ringColor: color } : {})
                    }}
                    onClick={() => setSelectedCategory(isSelected ? undefined : cat)}
                  >
                    <CardContent className="py-4 px-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-4 w-4" style={{ color }} />
                        <span className="text-xl font-bold">{count}</span>
                      </div>
                      <div className="text-xs font-medium text-foreground">{cat}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </motion.div>

        {/* Alert Banner - High Contrast */}
        {pendingSubmissions > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' as const }}
          >
            <Card className="bg-destructive text-destructive-foreground border-0">
              <CardContent className="flex items-center gap-4 py-4">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold">{pendingSubmissions} Pending Reviews</span>
                  <span className="hidden sm:inline ml-2">— {highPriorityCount} high priority form types available</span>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setViewMode('submissions')}
                  className="shrink-0"
                >
                  View
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15, ease: 'easeOut' as const }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search forms..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-9 h-12 text-base"
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={selectedCategory ?? 'all'}
              onValueChange={(val: string) => setSelectedCategory(val === 'all' ? undefined : val)}
            >
              <SelectTrigger className="w-full sm:w-44 h-12">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat: string) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="hidden sm:flex border rounded-lg">
              <Button
                variant={viewMode === 'forms' ? 'default' : 'ghost'}
                size="icon"
                className="h-12 w-12 rounded-r-none"
                onClick={() => setViewMode('forms')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'submissions' ? 'default' : 'ghost'}
                size="icon"
                className="h-12 w-12 rounded-l-none"
                onClick={() => setViewMode('submissions')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* View Toggle Tabs for Mobile */}
        <Tabs value={viewMode} onValueChange={(v: string) => setViewMode(v as 'forms' | 'submissions')} className="sm:hidden">
          <TabsList className="w-full h-12">
            <TabsTrigger value="forms" className="flex-1 h-10">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Forms
            </TabsTrigger>
            <TabsTrigger value="submissions" className="flex-1 h-10">
              <List className="h-4 w-4 mr-2" />
              Submissions
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Forms List View */}
        {viewMode === 'forms' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {Object.entries(groupedForms).map(([category, forms]: [string, FormDefinition[]]) => {
              const Icon = categoryIcons[category];
              const color = categoryColors[category];
              return (
                <Card key={category}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Icon className="h-5 w-5" style={{ color }} />
                      <span>{category}</span>
                      <Badge variant="secondary" className="ml-auto">{forms.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="divide-y divide-border">
                      {forms.map((form: FormDefinition) => {
                        const submissionCount = submissionCounts[form.code] || 0;
                        const pendingCount = pendingCounts[form.code] || 0;
                        return (
                          <motion.div
                            key={form.code}
                            variants={itemVariants}
                            className="flex items-center justify-between py-4 cursor-pointer hover:bg-muted/50 -mx-6 px-6 transition-colors min-h-[64px]"
                            onClick={() => handleFormClick(form)}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div 
                                className="p-2.5 rounded-lg shrink-0"
                                style={{ backgroundColor: form.priority === 'high' ? '#fef2f2' : `${color}15` }}
                              >
                                <form.icon 
                                  className="h-5 w-5" 
                                  style={{ color: form.priority === 'high' ? '#dc2626' : color }} 
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium text-foreground truncate">{form.name}</span>
                                  <Badge variant="outline" className="text-xs shrink-0">{form.code}</Badge>
                                  {form.priority === 'high' && (
                                    <Badge className="text-xs shrink-0 bg-destructive text-destructive-foreground">Urgent</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground truncate mt-0.5">{form.description}</p>
                                {submissionCount > 0 && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-muted-foreground">{submissionCount} submitted</span>
                                    {pendingCount > 0 && (
                                      <Badge variant="secondary" className="text-xs">{pendingCount} pending</Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 ml-2" />
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        )}

        {/* Submissions List View */}
        {viewMode === 'submissions' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-destructive" />
                  Recent Submissions
                  {submissionsLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {submissionsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i: number) => (
                      <div key={i} className="animate-pulse flex items-center gap-4 py-4" aria-hidden="true">
                        <div className="h-10 w-10 bg-muted rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-1/3" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : submissions && submissions.length > 0 ? (
                  <div className="divide-y divide-border">
                    {submissions.slice(0, 20).map((sub: MainDBSHE) => {
                      const formDef = formDefinitions.find((f: FormDefinition) => f.code === sub.formCode);
                      const status = sub.statusKey === 'StatusKey1' ? 'pending' : sub.statusKey === 'StatusKey2' ? 'approved' : 'draft';
                      return (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between py-4 cursor-pointer hover:bg-muted/50 -mx-6 px-6 transition-colors min-h-[64px]"
                          onClick={() => navigate(`/she/forms/${sub.formCode}/${sub.id}`)}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {getStatusIcon(status)}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground truncate">
                                  {sub.title || formDef?.name || sub.formCode}
                                </span>
                                <Badge variant="outline" className="text-xs shrink-0">{sub.formCode}</Badge>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-sm text-muted-foreground truncate">
                                  {sub.requestorEmail || 'Unknown'}
                                </span>
                                {sub.submittedDate && (
                                  <span className="text-xs text-muted-foreground">
                                    • {new Date(sub.submittedDate).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            {getStatusBadge(status)}
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Empty className="py-12">
                    <EmptyHeader>
                      <EmptyTitle>No submissions yet</EmptyTitle>
                      <EmptyDescription>Submit your first SHE form to see it here</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Empty State for Forms */}
        {viewMode === 'forms' && filteredForms.length === 0 && (
          <Empty className="py-16">
            <EmptyHeader>
              <EmptyTitle>No forms found</EmptyTitle>
              <EmptyDescription>Try adjusting your search or filter criteria</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>

      {/* Sticky Bottom CTA - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t md:hidden z-50">
        <Button 
          className="w-full h-14 text-base bg-destructive text-destructive-foreground hover:bg-destructive/90"
          onClick={() => navigate('/she/forms/IR-001/new')}
        >
          <AlertTriangle className="h-5 w-5 mr-2" />
          Report Incident
        </Button>
      </div>

      {/* Submissions Sheet for Form Type */}
      <Sheet open={submissionsSheetOpen} onOpenChange={setSubmissionsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {selectedFormCode && (() => {
                const formDef = formDefinitions.find((f: FormDefinition) => f.code === selectedFormCode);
                if (formDef) {
                  return (
                    <>
                      <formDef.icon className="h-5 w-5" style={{ color: categoryColors[formDef.category] }} />
                      {formDef.name}
                    </>
                  );
                }
                return selectedFormCode;
              })()}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <Button 
              className="w-full h-12 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                setSubmissionsSheetOpen(false);
                handleNewForm(selectedFormCode || 'IR-001');
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Submission
            </Button>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Previous Submissions
              </h3>
              {selectedFormCode && (() => {
                const formSubmissions = getFormSubmissions(selectedFormCode);
                if (formSubmissions.length === 0) {
                  return (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No submissions for this form type yet
                    </p>
                  );
                }
                return (
                  <div className="space-y-2">
                    {formSubmissions.map((sub: MainDBSHE) => {
                      const status = sub.statusKey === 'StatusKey1' ? 'pending' : sub.statusKey === 'StatusKey2' ? 'approved' : 'draft';
                      return (
                        <Card
                          key={sub.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => {
                            setSubmissionsSheetOpen(false);
                            navigate(`/she/forms/${selectedFormCode}/${sub.id}`);
                          }}
                        >
                          <CardContent className="py-3 px-4 flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{sub.title || sub.id}</p>
                              {sub.submittedDate && (
                                <p className="text-xs text-muted-foreground">
                                  {new Date(sub.submittedDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            {getStatusBadge(status)}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}