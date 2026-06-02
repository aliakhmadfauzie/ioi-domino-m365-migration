/**
 * QA CAPAs Management Page
 * Corrective and Preventive Actions tracking
 * 
 * Improvements:
 * - Semantic color tokens (no hardcoded colors)
 * - Proper touch targets (44px minimum)
 * - Responsive mobile design with card view
 * - Mobile bottom navigation
 * - Bulk selection and actions
 * - Pagination
 * - Working CRUD operations
 * - Accessible badge text (12px minimum)
 */

import { useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Target,
  Plus,
  Search,
  Download,
  Calendar,
  Users,
  Building2,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Clock,
  X,
  Eye,
  Edit2,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  MoreHorizontal,
  FileText,
  ListChecks,
  TrendingUp,
  Zap,
  Flame,
  ClipboardCheck,
  Bug,
  MessageSquare,
  Home,
  Menu,
  Check,
  Trash2,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format, isBefore, differenceInDays } from 'date-fns';
import { toast } from 'sonner';

// Types
interface CAPA {
  id: string;
  title: string;
  description: string;
  type: 'Corrective' | 'Preventive';
  source: 'Audit Finding' | 'Customer Complaint' | 'Internal Issue' | 'Process Deviation' | 'Regulatory';
  relatedId?: string;
  relatedType?: 'Defect' | 'Audit' | 'Complaint';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  department: string;
  site: string;
  owner: string;
  status: 'Open' | 'In Progress' | 'Verification' | 'Closed';
  rootCauseAnalysis?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  targetDate: string;
  completionDate?: string;
  verificationDate?: string;
  effectivenessVerified: boolean;
  progress: number;
  createdDate: string;
  attachments: number;
  comments: number;
}

// Initial Mock Data
const INITIAL_CAPAS: CAPA[] = [
  {
    id: 'CAPA-2026-018',
    title: 'Implement temperature monitoring system upgrade',
    description: 'Install redundant temperature sensors on reactor R-201 with automated alerting system.',
    type: 'Corrective',
    source: 'Audit Finding',
    relatedId: 'AUD-2026-004',
    relatedType: 'Audit',
    priority: 'Critical',
    department: 'Operations',
    site: 'PRAI',
    owner: 'Ahmad Razak',
    status: 'In Progress',
    rootCauseAnalysis: 'Single point of failure in temperature monitoring. Existing sensor showed drift before failure.',
    correctiveAction: 'Procure and install dual redundant sensors with independent power supply.',
    targetDate: '2026-05-20',
    progress: 65,
    createdDate: '2026-04-22',
    attachments: 4,
    comments: 8,
    effectivenessVerified: false,
  },
  {
    id: 'CAPA-2026-017',
    title: 'Update packaging inspection SOP',
    description: 'Revise SOP-PKG-005 to include additional seal integrity checks and sampling frequency.',
    type: 'Preventive',
    source: 'Internal Issue',
    relatedId: 'DEF-2026-040',
    relatedType: 'Defect',
    priority: 'High',
    department: 'Packaging',
    site: 'JHR',
    owner: 'Lim Mei',
    status: 'Open',
    rootCauseAnalysis: 'Current inspection frequency insufficient for high-speed packaging line.',
    preventiveAction: 'Increase inspection frequency from hourly to every 30 minutes. Add statistical process control chart.',
    targetDate: '2026-05-25',
    progress: 30,
    createdDate: '2026-04-30',
    attachments: 2,
    comments: 5,
    effectivenessVerified: false,
  },
  {
    id: 'CAPA-2026-016',
    title: 'Supplier qualification enhancement',
    description: 'Implement additional qualification criteria for raw material suppliers including on-site audits.',
    type: 'Preventive',
    source: 'Customer Complaint',
    priority: 'Medium',
    department: 'Procurement',
    site: 'PRAI',
    owner: 'Sarah Lee',
    status: 'Verification',
    rootCauseAnalysis: 'Supplier qualification process did not include on-site verification of storage conditions.',
    correctiveAction: 'Conduct immediate audit of all active suppliers.',
    preventiveAction: 'Update supplier qualification procedure to include annual on-site audits.',
    targetDate: '2026-05-10',
    completionDate: '2026-05-05',
    progress: 90,
    createdDate: '2026-04-15',
    attachments: 6,
    comments: 12,
    effectivenessVerified: false,
  },
  {
    id: 'CAPA-2026-015',
    title: 'Training program for new SOPs',
    description: 'Develop and deliver comprehensive training for all production operators on updated procedures.',
    type: 'Corrective',
    source: 'Internal Issue',
    relatedId: 'DEF-2026-039',
    relatedType: 'Defect',
    priority: 'High',
    department: 'QA',
    site: 'PRAI',
    owner: 'Chen Wei',
    status: 'In Progress',
    rootCauseAnalysis: 'New SOPs published without formal training. Operators unaware of procedure changes.',
    correctiveAction: 'Conduct immediate refresher training for all affected operators.',
    preventiveAction: 'Implement mandatory training acknowledgment before SOP effectivity date.',
    targetDate: '2026-05-15',
    progress: 50,
    createdDate: '2026-04-26',
    attachments: 3,
    comments: 7,
    effectivenessVerified: false,
  },
  {
    id: 'CAPA-2026-014',
    title: 'Equipment calibration schedule update',
    description: 'Review and update calibration frequencies based on historical drift data analysis.',
    type: 'Preventive',
    source: 'Regulatory',
    priority: 'Medium',
    department: 'Maintenance',
    site: 'JHR',
    owner: 'Raj Kumar',
    status: 'Closed',
    rootCauseAnalysis: 'Current calibration intervals not based on statistical analysis of drift patterns.',
    preventiveAction: 'Implement risk-based calibration scheduling with automated due date tracking.',
    targetDate: '2026-04-30',
    completionDate: '2026-04-28',
    verificationDate: '2026-05-02',
    progress: 100,
    createdDate: '2026-04-01',
    attachments: 5,
    comments: 10,
    effectivenessVerified: true,
  },
  {
    id: 'CAPA-2026-013',
    title: 'Raw material storage temperature monitoring',
    description: 'Install continuous temperature monitoring with data logging in warehouse area B.',
    type: 'Corrective',
    source: 'Audit Finding',
    relatedId: 'AUD-2026-003',
    relatedType: 'Audit',
    priority: 'High',
    department: 'Warehouse',
    site: 'JHR',
    owner: 'Lim Mei',
    status: 'Closed',
    rootCauseAnalysis: 'Manual temperature logging missed overnight excursions. No continuous monitoring.',
    correctiveAction: 'Install 24/7 temperature monitoring with SMS alerts for excursions.',
    targetDate: '2026-04-25',
    completionDate: '2026-04-24',
    verificationDate: '2026-05-01',
    progress: 100,
    createdDate: '2026-04-08',
    attachments: 4,
    comments: 6,
    effectivenessVerified: true,
  },
];

const DEPARTMENTS = ['Operations', 'Production', 'QA', 'QC', 'Packaging', 'Warehouse', 'Maintenance', 'Procurement', 'HSE'];
const SITES = ['PRAI', 'JHR'];
const SOURCES: CAPA['source'][] = ['Audit Finding', 'Customer Complaint', 'Internal Issue', 'Process Deviation', 'Regulatory'];
const OWNERS = ['Ahmad Razak', 'Sarah Lee', 'Chen Wei', 'Raj Kumar', 'Lim Mei', 'Ali Hassan'];
const ITEMS_PER_PAGE = 5;

// Mobile Navigation
const MOBILE_NAV = [
  { id: 'home', name: 'Home', icon: Home, href: '/' },
  { id: 'qa', name: 'QA', icon: ClipboardCheck, href: '/qa' },
  { id: 'capas', name: 'CAPAs', icon: Target, href: '/qa/capas', active: true },
  { id: 'defects', name: 'Defects', icon: Bug, href: '/qa/defects' },
];

export default function CAPAsPage() {
  // Data state
  const [capas, setCapas] = useState<CAPA[]>(INITIAL_CAPAS);
  
  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterSite, setFilterSite] = useState('all');
  const [selectedCAPA, setSelectedCAPA] = useState<CAPA | null>(null);
  const [showDetailSheet, setShowDetailSheet] = useState(false);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showFiltersSheet, setShowFiltersSheet] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  // New CAPA form state
  const [newCapaForm, setNewCapaForm] = useState({
    title: '',
    description: '',
    type: '' as CAPA['type'] | '',
    priority: '' as CAPA['priority'] | '',
    source: '' as CAPA['source'] | '',
    owner: '',
    department: '',
    site: '',
    targetDate: '',
  });

  // Filter CAPAs
  const filteredCAPAs = useMemo(() => {
    return capas.filter((c: CAPA) => {
      const matchesSearch = !searchQuery ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
      const matchesType = filterType === 'all' || c.type === filterType;
      const matchesPriority = filterPriority === 'all' || c.priority === filterPriority;
      const matchesSite = filterSite === 'all' || c.site === filterSite;
      return matchesSearch && matchesStatus && matchesType && matchesPriority && matchesSite;
    });
  }, [capas, searchQuery, filterStatus, filterType, filterPriority, filterSite]);

  // Pagination
  const totalPages = Math.ceil(filteredCAPAs.length / ITEMS_PER_PAGE);
  const paginatedCAPAs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCAPAs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCAPAs, currentPage]);

  // Stats
  const stats = useMemo(() => ({
    total: capas.length,
    open: capas.filter((c: CAPA) => c.status === 'Open').length,
    inProgress: capas.filter((c: CAPA) => c.status === 'In Progress').length,
    verification: capas.filter((c: CAPA) => c.status === 'Verification').length,
    overdue: capas.filter((c: CAPA) => c.status !== 'Closed' && isBefore(new Date(c.targetDate), new Date())).length,
    corrective: capas.filter((c: CAPA) => c.type === 'Corrective').length,
    preventive: capas.filter((c: CAPA) => c.type === 'Preventive').length,
  }), [capas]);

  // Handlers
  const handleCreateCAPA = useCallback(() => {
    if (!newCapaForm.title || !newCapaForm.type || !newCapaForm.priority || !newCapaForm.source || !newCapaForm.owner) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const newCapa: CAPA = {
      id: `CAPA-2026-${String(capas.length + 19).padStart(3, '0')}`,
      title: newCapaForm.title,
      description: newCapaForm.description,
      type: newCapaForm.type as CAPA['type'],
      priority: newCapaForm.priority as CAPA['priority'],
      source: newCapaForm.source as CAPA['source'],
      owner: newCapaForm.owner,
      department: newCapaForm.department || 'QA',
      site: newCapaForm.site || 'PRAI',
      status: 'Open',
      targetDate: newCapaForm.targetDate || format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      progress: 0,
      createdDate: format(new Date(), 'yyyy-MM-dd'),
      attachments: 0,
      comments: 0,
      effectivenessVerified: false,
    };
    
    setCapas((prev: CAPA[]) => [newCapa, ...prev]);
    setNewCapaForm({ title: '', description: '', type: '', priority: '', source: '', owner: '', department: '', site: '', targetDate: '' });
    setShowNewDialog(false);
    toast.success('CAPA created successfully!');
  }, [newCapaForm, capas.length]);

  const handleUpdateStatus = useCallback((id: string, newStatus: CAPA['status']) => {
    setCapas((prev: CAPA[]) => prev.map((c: CAPA) => {
      if (c.id === id) {
        const updates: Partial<CAPA> = { status: newStatus };
        if (newStatus === 'Closed') {
          updates.progress = 100;
          updates.completionDate = format(new Date(), 'yyyy-MM-dd');
        }
        return { ...c, ...updates };
      }
      return c;
    }));
    toast.success(`CAPA status updated to ${newStatus}`);
    setShowDetailSheet(false);
  }, []);

  const handleBulkClose = useCallback(() => {
    setCapas((prev: CAPA[]) => prev.map((c: CAPA) => {
      if (selectedIds.has(c.id)) {
        return { ...c, status: 'Closed', progress: 100, completionDate: format(new Date(), 'yyyy-MM-dd') };
      }
      return c;
    }));
    toast.success(`${selectedIds.size} CAPA(s) closed`);
    setSelectedIds(new Set());
    setShowBulkActions(false);
  }, [selectedIds]);

  const handleBulkDelete = useCallback(() => {
    setCapas((prev: CAPA[]) => prev.filter((c: CAPA) => !selectedIds.has(c.id)));
    toast.success(`${selectedIds.size} CAPA(s) deleted`);
    setSelectedIds(new Set());
    setShowBulkActions(false);
  }, [selectedIds]);

  const handleExport = useCallback(() => {
    const csvContent = [
      ['ID', 'Title', 'Type', 'Priority', 'Status', 'Owner', 'Department', 'Site', 'Target Date', 'Progress'].join(','),
      ...filteredCAPAs.map((c: CAPA) => [
        c.id, `"${c.title}"`, c.type, c.priority, c.status, c.owner, c.department, c.site, c.targetDate, c.progress
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `capas-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CAPAs exported to CSV');
  }, [filteredCAPAs]);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === paginatedCAPAs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedCAPAs.map((c: CAPA) => c.id)));
    }
  }, [selectedIds.size, paginatedCAPAs]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Style helpers using semantic tokens
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-destructive text-destructive-foreground';
      case 'High': return 'bg-accent text-accent-foreground';
      case 'Medium': return 'bg-primary text-primary-foreground';
      case 'Low': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-destructive text-destructive-foreground';
      case 'In Progress': return 'bg-primary text-primary-foreground';
      case 'Verification': return 'bg-accent text-accent-foreground';
      case 'Closed': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getTypeClass = (type: string) => {
    return type === 'Corrective'
      ? 'bg-primary text-primary-foreground'
      : 'bg-secondary text-secondary-foreground';
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Critical': return <Flame className="h-4 w-4 text-destructive" />;
      case 'High': return <Zap className="h-4 w-4 text-accent-foreground" />;
      default: return null;
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Audit Finding': return <ClipboardCheck className="h-4 w-4" />;
      case 'Customer Complaint': return <MessageSquare className="h-4 w-4" />;
      case 'Internal Issue': return <Bug className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getDaysRemaining = (targetDate: string, status: string) => {
    if (status === 'Closed') return null;
    const days = differenceInDays(new Date(targetDate), new Date());
    if (days < 0) return <span className="text-destructive font-medium">{Math.abs(days)} days overdue</span>;
    if (days === 0) return <span className="text-destructive font-medium">Due today</span>;
    if (days <= 7) return <span className="text-muted-foreground font-medium">{days} days left</span>;
    return <span className="text-muted-foreground">{days} days left</span>;
  };

  const activeFiltersCount = [filterStatus, filterType, filterPriority, filterSite].filter((f: string) => f !== 'all').length;

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/qa" 
                className="p-2 rounded-lg hover:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-base font-semibold text-foreground">CAPAs</h1>
                  <p className="text-xs text-muted-foreground">Corrective & Preventive Actions</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="min-h-[44px] min-w-[44px] hidden sm:flex"
                      onClick={handleExport}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Export CAPAs to CSV</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button onClick={() => setShowNewDialog(true)} className="min-h-[44px]">
                <Plus className="h-4 w-4 mr-1.5" /> <span className="hidden sm:inline">New CAPA</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats Cards - 3 columns on mobile, 5 on large */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          <Card className="border-l-4 border-l-destructive">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Open</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.open}</p>
                </div>
                <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-destructive/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.inProgress}</p>
                </div>
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-primary/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Verification</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.verification}</p>
                </div>
                <ListChecks className="h-6 w-6 sm:h-8 sm:w-8 text-accent/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary hidden md:block">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Corrective</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.corrective}</p>
                </div>
                <Target className="h-6 w-6 sm:h-8 sm:w-8 text-primary/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary hidden md:block">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Preventive</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.preventive}</p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-secondary/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overdue Alert */}
        {stats.overdue > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-destructive/10 border border-destructive/30"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {stats.overdue} Overdue CAPA{stats.overdue > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-muted-foreground">Immediate attention required</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="destructive"
                className="min-h-[44px] shrink-0"
                onClick={() => {
                  setFilterStatus('all');
                  setFilterPriority('Critical');
                }}
              >
                View
              </Button>
            </div>
          </motion.div>
        )}

        {/* Bulk Actions Bar */}
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">{selectedIds.size} selected</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="min-h-[44px]"
                onClick={handleBulkClose}
              >
                <CheckCircle2 className="h-4 w-4 mr-1.5" /> Close All
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="min-h-[44px]"
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-4 w-4 mr-1.5" /> Delete
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="min-h-[44px]"
                onClick={() => setSelectedIds(new Set())}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}

        {/* Filters - Desktop */}
        <Card className="hidden lg:block">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search CAPAs..."
                  className="pl-9 h-11"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px] h-11">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Verification">Verification</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[140px] h-11">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Corrective">Corrective</SelectItem>
                  <SelectItem value="Preventive">Preventive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[140px] h-11">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterSite} onValueChange={setFilterSite}>
                <SelectTrigger className="w-[120px] h-11">
                  <SelectValue placeholder="Site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sites</SelectItem>
                  {SITES.map((site: string) => (
                    <SelectItem key={site} value={site}>{site}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-11 w-11" onClick={handleExport}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Export to CSV</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>

        {/* Filters - Mobile */}
        <div className="lg:hidden">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9 h-12"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              />
            </div>
            <Sheet open={showFiltersSheet} onOpenChange={setShowFiltersSheet}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-12 w-12 relative shrink-0">
                  <Filter className="h-4 w-4" />
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-auto max-h-[70vh]">
                <SheetHeader>
                  <SheetTitle>Filter CAPAs</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="h-12"><SelectValue placeholder="All Status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Verification">Verification</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="h-12"><SelectValue placeholder="All Types" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Corrective">Corrective</SelectItem>
                        <SelectItem value="Preventive">Preventive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={filterPriority} onValueChange={setFilterPriority}>
                      <SelectTrigger className="h-12"><SelectValue placeholder="All Priority" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Site</Label>
                    <Select value={filterSite} onValueChange={setFilterSite}>
                      <SelectTrigger className="h-12"><SelectValue placeholder="All Sites" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sites</SelectItem>
                        {SITES.map((site: string) => (
                          <SelectItem key={site} value={site}>{site}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 h-12"
                      onClick={() => {
                        setFilterStatus('all');
                        setFilterType('all');
                        setFilterPriority('all');
                        setFilterSite('all');
                      }}
                    >
                      Clear All
                    </Button>
                    <Button className="flex-1 h-12" onClick={() => setShowFiltersSheet(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* CAPAs Table - Desktop */}
        <Card className="hidden lg:block">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedIds.size === paginatedCAPAs.length && paginatedCAPAs.length > 0}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="w-[120px]">ID</TableHead>
                  <TableHead>CAPA</TableHead>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead className="w-[100px]">Priority</TableHead>
                  <TableHead className="w-[110px]">Status</TableHead>
                  <TableHead className="w-[140px]">Progress</TableHead>
                  <TableHead className="w-[100px]">Owner</TableHead>
                  <TableHead className="w-[120px]">Due Date</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCAPAs.map((capa: CAPA) => (
                  <TableRow
                    key={capa.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => { setSelectedCAPA(capa); setShowDetailSheet(true); }}
                  >
                    <TableCell onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.has(capa.id)}
                        onCheckedChange={() => toggleSelect(capa.id)}
                        aria-label={`Select ${capa.id}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm text-foreground">{capa.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPriorityIcon(capa.priority)}
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate max-w-[300px] text-foreground">{capa.title}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                            {getSourceIcon(capa.source)}
                            <span>{capa.source}</span>
                            {capa.relatedId && (
                              <>
                                <span>•</span>
                                <span className="font-mono">{capa.relatedId}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('text-xs', getTypeClass(capa.type))}>
                        {capa.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('text-xs', getPriorityClass(capa.priority))}>
                        {capa.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('text-xs', getStatusClass(capa.status))}>
                        {capa.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={capa.progress} className="h-2 flex-1" />
                        <span className="text-sm font-medium w-8 text-foreground">{capa.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{capa.owner}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {getDaysRemaining(capa.targetDate, capa.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-11 w-11">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedCAPA(capa); setShowDetailSheet(true); }}>
                            <Eye className="h-4 w-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedCAPA(capa); setShowEditDialog(true); }}>
                            <Edit2 className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleUpdateStatus(capa.id, 'Closed')}>
                            <CheckCircle2 className="h-4 w-4 mr-2" /> Mark Complete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredCAPAs.length)} of {filteredCAPAs.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-11 w-11"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p: number) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-foreground px-3">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-11 w-11"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p: number) => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CAPAs Cards - Mobile */}
        <div className="lg:hidden space-y-3">
          {paginatedCAPAs.map((capa: CAPA) => (
            <Card
              key={capa.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => { setSelectedCAPA(capa); setShowDetailSheet(true); }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <Checkbox
                      checked={selectedIds.has(capa.id)}
                      onCheckedChange={() => toggleSelect(capa.id)}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      className="mt-1"
                      aria-label={`Select ${capa.id}`}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">{capa.id}</span>
                        {getPriorityIcon(capa.priority)}
                      </div>
                      <p className="text-sm font-medium text-foreground line-clamp-2">{capa.title}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge className={cn('text-xs', getTypeClass(capa.type))}>{capa.type}</Badge>
                        <Badge className={cn('text-xs', getPriorityClass(capa.priority))}>{capa.priority}</Badge>
                        <Badge className={cn('text-xs', getStatusClass(capa.status))}>{capa.status}</Badge>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                </div>
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{capa.owner}</span>
                    {getDaysRemaining(capa.targetDate, capa.status)}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Progress value={capa.progress} className="h-2 flex-1" />
                    <span className="text-sm font-medium text-foreground">{capa.progress}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Mobile Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                className="h-12"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p: number) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                className="h-12"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p: number) => p + 1)}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t lg:hidden z-50 safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16">
          {MOBILE_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-3 py-2 transition-colors",
                  item.active ? "text-primary" : "text-muted-foreground hover:text-primary"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Detail Sheet */}
      <Sheet open={showDetailSheet} onOpenChange={setShowDetailSheet}>
        <SheetContent className="w-full sm:max-w-xl p-0">
          {selectedCAPA && (
            <ScrollArea className="h-full">
              <div className="h-16 bg-primary relative flex items-center px-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-11 w-11 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={() => setShowDetailSheet(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
                <div className="flex gap-2">
                  <Badge className={cn('text-xs', getTypeClass(selectedCAPA.type))}>
                    {selectedCAPA.type}
                  </Badge>
                  <Badge className={cn('text-xs', getPriorityClass(selectedCAPA.priority))}>
                    {selectedCAPA.priority}
                  </Badge>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <p className="text-sm font-mono text-muted-foreground">{selectedCAPA.id}</p>
                  <h2 className="text-lg font-semibold mt-1 text-foreground">{selectedCAPA.title}</h2>
                  <p className="text-sm text-muted-foreground mt-2">{selectedCAPA.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={cn('text-xs', getStatusClass(selectedCAPA.status))}>
                    {selectedCAPA.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-foreground">{selectedCAPA.progress}% Complete</span>
                </div>

                <Progress value={selectedCAPA.progress} className="h-2" />

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details" className="min-h-[44px]">Details</TabsTrigger>
                    <TabsTrigger value="analysis" className="min-h-[44px]">Analysis</TabsTrigger>
                    <TabsTrigger value="history" className="min-h-[44px]">History</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-muted">
                        <p className="text-xs text-muted-foreground">Source</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          {getSourceIcon(selectedCAPA.source)}
                          <p className="text-sm font-medium text-foreground">{selectedCAPA.source}</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted">
                        <p className="text-xs text-muted-foreground">Related ID</p>
                        <p className="text-sm font-medium font-mono text-foreground">{selectedCAPA.relatedId || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between py-3 border-b min-h-[48px] items-center">
                        <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
                          <Users className="h-4 w-4" /> Owner
                        </span>
                        <span className="text-sm text-foreground">{selectedCAPA.owner}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b min-h-[48px] items-center">
                        <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
                          <Building2 className="h-4 w-4" /> Department
                        </span>
                        <span className="text-sm text-foreground">{selectedCAPA.department}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b min-h-[48px] items-center">
                        <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
                          <MapPin className="h-4 w-4" /> Site
                        </span>
                        <span className="text-sm text-foreground">{selectedCAPA.site}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b min-h-[48px] items-center">
                        <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
                          <Calendar className="h-4 w-4" /> Target Date
                        </span>
                        <span className="text-sm text-foreground">{format(new Date(selectedCAPA.targetDate), 'MMM d, yyyy')}</span>
                      </div>
                      {selectedCAPA.completionDate && (
                        <div className="flex justify-between py-3 border-b min-h-[48px] items-center">
                          <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
                            <CheckCircle2 className="h-4 w-4" /> Completed
                          </span>
                          <span className="text-sm text-foreground">{format(new Date(selectedCAPA.completionDate), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-3 min-h-[48px] items-center">
                        <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
                          <ListChecks className="h-4 w-4" /> Effectiveness Verified
                        </span>
                        <Badge className={selectedCAPA.effectivenessVerified ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}>
                          {selectedCAPA.effectivenessVerified ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="analysis" className="mt-4 space-y-4">
                    {selectedCAPA.rootCauseAnalysis && (
                      <div className="p-3 rounded-lg bg-muted">
                        <p className="text-xs text-muted-foreground mb-1">Root Cause Analysis</p>
                        <p className="text-sm text-foreground">{selectedCAPA.rootCauseAnalysis}</p>
                      </div>
                    )}
                    {selectedCAPA.correctiveAction && (
                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                        <p className="text-xs text-primary mb-1">Corrective Action</p>
                        <p className="text-sm text-foreground">{selectedCAPA.correctiveAction}</p>
                      </div>
                    )}
                    {selectedCAPA.preventiveAction && (
                      <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                        <p className="text-xs text-muted-foreground mb-1">Preventive Action</p>
                        <p className="text-sm text-foreground">{selectedCAPA.preventiveAction}</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="history" className="mt-4">
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="text-sm font-medium text-foreground">CAPA Created</p>
                          <p className="text-sm text-muted-foreground">{format(new Date(selectedCAPA.createdDate), 'MMM d, yyyy')}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="text-sm font-medium text-foreground">Investigation Started</p>
                          <p className="text-sm text-muted-foreground">Root cause analysis in progress</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    className="flex-1 min-h-[48px]"
                    onClick={() => { setShowDetailSheet(false); setShowEditDialog(true); }}
                  >
                    <Edit2 className="h-4 w-4 mr-1.5" /> Update CAPA
                  </Button>
                  {selectedCAPA.status !== 'Closed' && (
                    <Button 
                      variant="outline" 
                      className="min-h-[48px]"
                      onClick={() => handleUpdateStatus(selectedCAPA.id, 'Closed')}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1.5" /> Close
                    </Button>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>

      {/* New CAPA Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New CAPA</DialogTitle>
            <DialogDescription>Fill in the details to create a new Corrective or Preventive Action.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="capa-title">Title *</Label>
              <Input 
                id="capa-title"
                placeholder="Brief description of the CAPA" 
                className="h-12"
                value={newCapaForm.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCapaForm((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select value={newCapaForm.type} onValueChange={(v: string) => setNewCapaForm((prev) => ({ ...prev, type: v as CAPA['type'] }))}>
                  <SelectTrigger className="h-12"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Corrective">Corrective</SelectItem>
                    <SelectItem value="Preventive">Preventive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority *</Label>
                <Select value={newCapaForm.priority} onValueChange={(v: string) => setNewCapaForm((prev) => ({ ...prev, priority: v as CAPA['priority'] }))}>
                  <SelectTrigger className="h-12"><SelectValue placeholder="Select priority" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Source *</Label>
                <Select value={newCapaForm.source} onValueChange={(v: string) => setNewCapaForm((prev) => ({ ...prev, source: v as CAPA['source'] }))}>
                  <SelectTrigger className="h-12"><SelectValue placeholder="Select source" /></SelectTrigger>
                  <SelectContent>
                    {SOURCES.map((source: string) => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Owner *</Label>
                <Select value={newCapaForm.owner} onValueChange={(v: string) => setNewCapaForm((prev) => ({ ...prev, owner: v }))}>
                  <SelectTrigger className="h-12"><SelectValue placeholder="Select owner" /></SelectTrigger>
                  <SelectContent>
                    {OWNERS.map((owner: string) => (
                      <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={newCapaForm.department} onValueChange={(v: string) => setNewCapaForm((prev) => ({ ...prev, department: v }))}>
                  <SelectTrigger className="h-12"><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept: string) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Site</Label>
                <Select value={newCapaForm.site} onValueChange={(v: string) => setNewCapaForm((prev) => ({ ...prev, site: v }))}>
                  <SelectTrigger className="h-12"><SelectValue placeholder="Select site" /></SelectTrigger>
                  <SelectContent>
                    {SITES.map((site: string) => (
                      <SelectItem key={site} value={site}>{site}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="capa-desc">Description</Label>
              <Textarea 
                id="capa-desc"
                placeholder="Detailed description of the corrective/preventive action" 
                rows={4}
                value={newCapaForm.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewCapaForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowNewDialog(false)} className="min-h-[48px]">Cancel</Button>
            <Button onClick={handleCreateCAPA} className="min-h-[48px]">
              Create CAPA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit CAPA Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit CAPA</DialogTitle>
            <DialogDescription>Update the CAPA details and status.</DialogDescription>
          </DialogHeader>
          {selectedCAPA && (
            <div className="space-y-4 py-4">
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-xs text-muted-foreground">CAPA ID</p>
                <p className="text-sm font-mono font-medium text-foreground">{selectedCAPA.id}</p>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={selectedCAPA.status} 
                  onValueChange={(v: string) => {
                    handleUpdateStatus(selectedCAPA.id, v as CAPA['status']);
                    setShowEditDialog(false);
                  }}
                >
                  <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Verification">Verification</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                Note: Additional editing capabilities can be added here (owner reassignment, due date change, etc.)
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)} className="min-h-[48px]">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}