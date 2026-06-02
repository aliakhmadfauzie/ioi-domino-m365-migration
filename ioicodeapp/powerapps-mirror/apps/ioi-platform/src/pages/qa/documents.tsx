/**
 * QA Document Control Page
 * Document reviews, approvals, version control, training records
 */

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  FileText,
  Plus,
  Search,
  Download,
  Calendar,
  X,
  Eye,
  Edit2,
  MoreHorizontal,
  FolderOpen,
  File,
  FileCheck,
  FileClock,
  FileX,
  Upload,
  Send,
  Archive,
  Lock,
  Unlock,
  GitBranch,
  Tag,
  CheckCircle2,
  Clock,
  Home,
  ClipboardList,
  BarChart3,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'sonner';

// Types
type DocumentStatus = 'Draft' | 'In Review' | 'Approved' | 'Effective' | 'Superseded' | 'Obsolete';
type DocumentCategory = 'SOP' | 'Policy' | 'Specification' | 'Form' | 'Manual' | 'Work Instruction' | 'Record';
type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

interface DocumentVersion {
  version: string;
  date: string;
  author: string;
  changes: string;
}

interface DocumentApproval {
  role: string;
  name: string;
  status: ApprovalStatus;
  date?: string;
  comments?: string;
}

interface Document {
  id: string;
  docNumber: string;
  title: string;
  category: DocumentCategory;
  department: string;
  site: string;
  status: DocumentStatus;
  currentVersion: string;
  effectiveDate?: string;
  reviewDate?: string;
  expiryDate?: string;
  owner: string;
  lastModified: string;
  isLocked: boolean;
  versions: DocumentVersion[];
  approvals: DocumentApproval[];
  tags: string[];
}

// Mock Data
const MOCK_DOCUMENTS: Document[] = [
  { 
    id: '1', 
    docNumber: 'SOP-PRD-001', 
    title: 'Production Line Startup Procedure', 
    category: 'SOP', 
    department: 'Production', 
    site: 'PRAI', 
    status: 'Effective', 
    currentVersion: '3.0',
    effectiveDate: '2026-01-15',
    reviewDate: '2027-01-15',
    owner: 'Ahmad Razak',
    lastModified: '2026-01-10',
    isLocked: true,
    versions: [
      { version: '3.0', date: '2026-01-10', author: 'Ahmad Razak', changes: 'Updated safety checks section' },
      { version: '2.0', date: '2025-06-15', author: 'Chen Wei', changes: 'Added new equipment procedures' },
      { version: '1.0', date: '2024-01-20', author: 'Ahmad Razak', changes: 'Initial release' },
    ],
    approvals: [
      { role: 'Author', name: 'Ahmad Razak', status: 'Approved', date: '2026-01-08' },
      { role: 'Reviewer', name: 'Sarah Lee', status: 'Approved', date: '2026-01-09' },
      { role: 'Approver', name: 'Chen Wei', status: 'Approved', date: '2026-01-10' },
    ],
    tags: ['production', 'startup', 'safety']
  },
  { 
    id: '2', 
    docNumber: 'SOP-QC-012', 
    title: 'Viscosity Testing Procedure', 
    category: 'SOP', 
    department: 'QC', 
    site: 'PRAI', 
    status: 'In Review', 
    currentVersion: '2.1',
    owner: 'Sarah Lee',
    lastModified: '2026-05-02',
    isLocked: false,
    versions: [
      { version: '2.1', date: '2026-05-02', author: 'Sarah Lee', changes: 'Updated temperature specifications' },
      { version: '2.0', date: '2025-08-10', author: 'Sarah Lee', changes: 'New equipment model added' },
    ],
    approvals: [
      { role: 'Author', name: 'Sarah Lee', status: 'Approved', date: '2026-05-02' },
      { role: 'Reviewer', name: 'Ahmad Razak', status: 'Pending' },
      { role: 'Approver', name: 'Chen Wei', status: 'Pending' },
    ],
    tags: ['testing', 'viscosity', 'qc']
  },
  { 
    id: '3', 
    docNumber: 'POL-QA-001', 
    title: 'Quality Policy', 
    category: 'Policy', 
    department: 'QA', 
    site: 'All', 
    status: 'Effective', 
    currentVersion: '5.0',
    effectiveDate: '2025-07-01',
    reviewDate: '2026-07-01',
    owner: 'Chen Wei',
    lastModified: '2025-06-25',
    isLocked: true,
    versions: [
      { version: '5.0', date: '2025-06-25', author: 'Chen Wei', changes: 'Annual review - minor updates' },
    ],
    approvals: [
      { role: 'Author', name: 'Chen Wei', status: 'Approved', date: '2025-06-20' },
      { role: 'Reviewer', name: 'Ahmad Razak', status: 'Approved', date: '2025-06-22' },
      { role: 'Approver', name: 'Management', status: 'Approved', date: '2025-06-25' },
    ],
    tags: ['policy', 'quality', 'company-wide']
  },
  { 
    id: '4', 
    docNumber: 'SPEC-RM-045', 
    title: 'Palm Oil Specification', 
    category: 'Specification', 
    department: 'Procurement', 
    site: 'All', 
    status: 'Effective', 
    currentVersion: '2.0',
    effectiveDate: '2025-09-01',
    reviewDate: '2026-09-01',
    owner: 'Raj Kumar',
    lastModified: '2025-08-20',
    isLocked: true,
    versions: [
      { version: '2.0', date: '2025-08-20', author: 'Raj Kumar', changes: 'Updated quality parameters' },
    ],
    approvals: [
      { role: 'Author', name: 'Raj Kumar', status: 'Approved', date: '2025-08-15' },
      { role: 'Reviewer', name: 'Sarah Lee', status: 'Approved', date: '2025-08-18' },
      { role: 'Approver', name: 'Chen Wei', status: 'Approved', date: '2025-08-20' },
    ],
    tags: ['specification', 'raw-material', 'palm-oil']
  },
  { 
    id: '5', 
    docNumber: 'WI-PKG-003', 
    title: 'Carton Sealing Work Instruction', 
    category: 'Work Instruction', 
    department: 'Packaging', 
    site: 'JHR', 
    status: 'Draft', 
    currentVersion: '0.1',
    owner: 'Lim Mei',
    lastModified: '2026-05-01',
    isLocked: false,
    versions: [
      { version: '0.1', date: '2026-05-01', author: 'Lim Mei', changes: 'Initial draft' },
    ],
    approvals: [],
    tags: ['packaging', 'work-instruction', 'new']
  },
  { 
    id: '6', 
    docNumber: 'FRM-QC-101', 
    title: 'Incoming Material Inspection Checklist', 
    category: 'Form', 
    department: 'QC', 
    site: 'All', 
    status: 'Effective', 
    currentVersion: '1.2',
    effectiveDate: '2025-11-01',
    reviewDate: '2026-11-01',
    owner: 'Sarah Lee',
    lastModified: '2025-10-20',
    isLocked: true,
    versions: [
      { version: '1.2', date: '2025-10-20', author: 'Sarah Lee', changes: 'Added new inspection criteria' },
    ],
    approvals: [
      { role: 'Author', name: 'Sarah Lee', status: 'Approved', date: '2025-10-15' },
      { role: 'Approver', name: 'Chen Wei', status: 'Approved', date: '2025-10-20' },
    ],
    tags: ['form', 'inspection', 'qc']
  },
  { 
    id: '7', 
    docNumber: 'SOP-HSE-008', 
    title: 'Chemical Spill Response Procedure', 
    category: 'SOP', 
    department: 'HSE', 
    site: 'All', 
    status: 'Effective', 
    currentVersion: '4.0',
    effectiveDate: '2026-02-01',
    reviewDate: '2026-08-01',
    expiryDate: '2026-05-15',
    owner: 'Ali Hassan',
    lastModified: '2026-01-28',
    isLocked: true,
    versions: [
      { version: '4.0', date: '2026-01-28', author: 'Ali Hassan', changes: 'Updated emergency contacts and procedures' },
    ],
    approvals: [
      { role: 'Author', name: 'Ali Hassan', status: 'Approved', date: '2026-01-25' },
      { role: 'Reviewer', name: 'Ahmad Razak', status: 'Approved', date: '2026-01-27' },
      { role: 'Approver', name: 'Chen Wei', status: 'Approved', date: '2026-01-28' },
    ],
    tags: ['hse', 'emergency', 'chemical', 'safety']
  },
  { 
    id: '8', 
    docNumber: 'MAN-QA-001', 
    title: 'Quality Management System Manual', 
    category: 'Manual', 
    department: 'QA', 
    site: 'All', 
    status: 'Effective', 
    currentVersion: '6.0',
    effectiveDate: '2025-05-01',
    reviewDate: '2026-05-01',
    owner: 'Chen Wei',
    lastModified: '2025-04-25',
    isLocked: true,
    versions: [
      { version: '6.0', date: '2025-04-25', author: 'Chen Wei', changes: 'ISO 9001:2015 compliance update' },
    ],
    approvals: [
      { role: 'Author', name: 'Chen Wei', status: 'Approved', date: '2025-04-20' },
      { role: 'Reviewer', name: 'External Consultant', status: 'Approved', date: '2025-04-23' },
      { role: 'Approver', name: 'Management', status: 'Approved', date: '2025-04-25' },
    ],
    tags: ['manual', 'qms', 'iso9001']
  },
];

const CATEGORIES: DocumentCategory[] = ['SOP', 'Policy', 'Specification', 'Form', 'Manual', 'Work Instruction', 'Record'];
const DEPARTMENTS = ['Production', 'Operations', 'QA', 'QC', 'HSE', 'Procurement', 'Packaging', 'Maintenance', 'Warehouse'];
const SITES = ['PRAI', 'JHR', 'All'];
const STATUSES: DocumentStatus[] = ['Draft', 'In Review', 'Approved', 'Effective', 'Superseded', 'Obsolete'];

// Mobile navigation items
const mobileNavItems = [
  { label: 'QA Home', href: '/qa', icon: Home },
  { label: 'Documents', href: '/qa/documents', icon: FileText, active: true },
  { label: 'CAPAs', href: '/qa/capas', icon: ClipboardList },
  { label: 'Reports', href: '/qa/reports', icon: BarChart3 },
];

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showDetailSheet, setShowDetailSheet] = useState(false);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [showFilters, setShowFilters] = useState(false);

  // Filter documents
  const filteredDocs = useMemo(() => {
    return MOCK_DOCUMENTS.filter((d: Document) => {
      const matchesSearch = !searchQuery || 
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.docNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || d.status === filterStatus;
      const matchesCategory = filterCategory === 'all' || d.category === filterCategory;
      const matchesDepartment = filterDepartment === 'all' || d.department === filterDepartment;
      return matchesSearch && matchesStatus && matchesCategory && matchesDepartment;
    });
  }, [searchQuery, filterStatus, filterCategory, filterDepartment]);

  // Stats
  const stats = useMemo(() => {
    const today = new Date();
    return {
      total: MOCK_DOCUMENTS.length,
      effective: MOCK_DOCUMENTS.filter((d: Document) => d.status === 'Effective').length,
      inReview: MOCK_DOCUMENTS.filter((d: Document) => d.status === 'In Review').length,
      draft: MOCK_DOCUMENTS.filter((d: Document) => d.status === 'Draft').length,
      expiringSoon: MOCK_DOCUMENTS.filter((d: Document) => d.reviewDate && differenceInDays(new Date(d.reviewDate), today) <= 30 && differenceInDays(new Date(d.reviewDate), today) > 0).length,
      overdue: MOCK_DOCUMENTS.filter((d: Document) => d.reviewDate && differenceInDays(new Date(d.reviewDate), today) <= 0 && d.status === 'Effective').length,
    };
  }, []);

  const getStatusBadgeClass = (status: DocumentStatus): string => {
    switch (status) {
      case 'Draft': return 'bg-muted text-muted-foreground';
      case 'In Review': return 'bg-secondary text-secondary-foreground';
      case 'Approved': return 'bg-primary text-primary-foreground';
      case 'Effective': return 'bg-accent text-accent-foreground';
      case 'Superseded': return 'bg-secondary text-secondary-foreground';
      case 'Obsolete': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: DocumentCategory) => {
    switch (category) {
      case 'SOP': return <FileCheck className="h-4 w-4" />;
      case 'Policy': return <FileText className="h-4 w-4" />;
      case 'Specification': return <File className="h-4 w-4" />;
      case 'Form': return <FileText className="h-4 w-4" />;
      case 'Manual': return <FolderOpen className="h-4 w-4" />;
      case 'Work Instruction': return <FileText className="h-4 w-4" />;
      case 'Record': return <Archive className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getApprovalStatusIcon = (status: ApprovalStatus) => {
    switch (status) {
      case 'Approved': return <CheckCircle2 className="h-4 w-4 text-accent-foreground" />;
      case 'Pending': return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'Rejected': return <FileX className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleOpenDetail = (doc: Document) => {
    setSelectedDoc(doc);
    setShowDetailSheet(true);
    setActiveTab('details');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setFilterCategory('all');
    setFilterDepartment('all');
  };

  const hasActiveFilters = searchQuery || filterStatus !== 'all' || filterCategory !== 'all' || filterDepartment !== 'all';

  const isReviewDue = (doc: Document) => {
    if (!doc.reviewDate) return false;
    const daysUntil = differenceInDays(new Date(doc.reviewDate), new Date());
    return daysUntil <= 30;
  };

  const isOverdue = (doc: Document) => {
    if (!doc.reviewDate) return false;
    return differenceInDays(new Date(doc.reviewDate), new Date()) <= 0;
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/qa" className="p-2.5 rounded-lg hover:bg-muted transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-base font-semibold">Document Control</h1>
                  <p className="text-xs text-muted-foreground">{filteredDocs.length} documents</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" className="hidden sm:flex h-11">
                <Download className="h-4 w-4 mr-1.5" /> Export
              </Button>
              <Button className="h-11" onClick={() => setShowNewDialog(true)}>
                <Plus className="h-4 w-4 mr-1.5" /> <span className="hidden sm:inline">New Document</span><span className="sm:hidden">New</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-accent">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{stats.effective}</p>
              <p className="text-xs text-muted-foreground">Effective</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-secondary">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{stats.inReview}</p>
              <p className="text-xs text-muted-foreground">In Review</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-muted hidden sm:block">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{stats.draft}</p>
              <p className="text-xs text-muted-foreground">Draft</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-primary hidden lg:block">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{stats.expiringSoon}</p>
              <p className="text-xs text-muted-foreground">Expiring Soon</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-destructive hidden lg:block">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{stats.overdue}</p>
              <p className="text-xs text-muted-foreground">Overdue</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3">
              {/* Search row */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents, tags..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    className="pl-9 h-11"
                  />
                </div>
                <Button 
                  variant="outline" 
                  className="md:hidden h-11 min-w-[44px]"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Filter dropdowns - collapsible on mobile */}
              <div className={cn(
                'flex flex-wrap items-center gap-3',
                !showFilters && 'hidden md:flex'
              )}>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-36 h-11">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {STATUSES.map((s: DocumentStatus) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-40 h-11">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map((c: DocumentCategory) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-full sm:w-36 h-11">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Depts</SelectItem>
                    {DEPARTMENTS.map((d: string) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button variant="ghost" className="h-11" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" /> Clear
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents - Desktop Table */}
        <Card className="hidden md:block">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">Doc #</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="w-28">Category</TableHead>
                  <TableHead className="w-28">Department</TableHead>
                  <TableHead className="w-24">Version</TableHead>
                  <TableHead className="w-28">Status</TableHead>
                  <TableHead className="w-28">Review Date</TableHead>
                  <TableHead className="w-14"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocs.map((doc: Document) => (
                  <TableRow
                    key={doc.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleOpenDetail(doc)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {doc.isLocked ? (
                          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                        ) : (
                          <Unlock className="h-3.5 w-3.5 text-primary" />
                        )}
                        <span className="font-mono text-sm">{doc.docNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{doc.title}</span>
                        {isOverdue(doc) && (
                          <Badge variant="destructive" className="text-xs">Overdue</Badge>
                        )}
                        {!isOverdue(doc) && isReviewDue(doc) && (
                          <Badge variant="outline" className="text-xs">Review Soon</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        {getCategoryIcon(doc.category)}
                        <span className="text-sm">{doc.category}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{doc.department}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm font-mono">{doc.currentVersion}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('text-xs', getStatusBadgeClass(doc.status))}>
                        {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {doc.reviewDate ? format(new Date(doc.reviewDate), 'MMM d, yyyy') : '—'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-11 w-11">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleOpenDetail(doc); }}>
                            <Eye className="h-3.5 w-3.5 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e: React.MouseEvent) => { e.stopPropagation(); toast.success('Download started'); }}>
                            <Download className="h-3.5 w-3.5 mr-2" /> Download
                          </DropdownMenuItem>
                          {!doc.isLocked && (
                            <DropdownMenuItem onClick={(e: React.MouseEvent) => { e.stopPropagation(); toast.success('Edit mode'); }}>
                              <Edit2 className="h-3.5 w-3.5 mr-2" /> Edit
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e: React.MouseEvent) => { e.stopPropagation(); toast.success('Sent for review'); }}>
                            <Send className="h-3.5 w-3.5 mr-2" /> Send for Review
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredDocs.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No documents found</p>
                <Button variant="link" onClick={clearFilters}>Clear filters</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documents - Mobile Card View */}
        <div className="md:hidden space-y-3">
          {filteredDocs.map((doc: Document) => (
            <Card 
              key={doc.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleOpenDetail(doc)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {doc.isLocked ? (
                        <Lock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <Unlock className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      )}
                      <span className="font-mono text-sm text-muted-foreground">{doc.docNumber}</span>
                    </div>
                    <h3 className="font-medium text-sm mb-2 line-clamp-2">{doc.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={cn('text-xs', getStatusBadgeClass(doc.status))}>
                        {doc.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {doc.category}
                      </Badge>
                      {isOverdue(doc) && (
                        <Badge variant="destructive" className="text-xs">Overdue</Badge>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-11 w-11 flex-shrink-0"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      handleOpenDetail(doc);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t text-sm text-muted-foreground">
                  <span>{doc.department}</span>
                  <span>v{doc.currentVersion}</span>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredDocs.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No documents found</p>
              <Button variant="link" onClick={clearFilters}>Clear filters</Button>
            </div>
          )}
        </div>
      </main>

      {/* Detail Sheet */}
      <Sheet open={showDetailSheet} onOpenChange={setShowDetailSheet}>
        <SheetContent className="w-full sm:max-w-xl p-0">
          {selectedDoc && (
            <>
              <div className={cn(
                'h-20 relative',
                selectedDoc.status === 'Effective' && 'bg-accent',
                selectedDoc.status === 'In Review' && 'bg-secondary',
                selectedDoc.status === 'Draft' && 'bg-muted',
                selectedDoc.status === 'Approved' && 'bg-primary',
                selectedDoc.status === 'Superseded' && 'bg-secondary',
                selectedDoc.status === 'Obsolete' && 'bg-destructive'
              )}>
                <div className="absolute top-3 left-4 flex items-center gap-2">
                  <Badge className="bg-card/20 text-card-foreground border-0 text-xs">
                    {selectedDoc.category}
                  </Badge>
                  <Badge className="bg-card/20 text-card-foreground border-0 text-xs">
                    v{selectedDoc.currentVersion}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-11 w-11 text-card-foreground/70 hover:text-card-foreground hover:bg-card/10"
                  onClick={() => setShowDetailSheet(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-mono text-muted-foreground">{selectedDoc.docNumber}</span>
                  <Badge className={cn('text-xs', getStatusBadgeClass(selectedDoc.status))}>
                    {selectedDoc.status}
                  </Badge>
                  {selectedDoc.isLocked ? (
                    <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <Unlock className="h-3.5 w-3.5 text-primary" />
                  )}
                </div>
                <h2 className="text-lg font-semibold mb-4">{selectedDoc.title}</h2>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full">
                    <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                    <TabsTrigger value="versions" className="flex-1">Versions ({selectedDoc.versions.length})</TabsTrigger>
                    <TabsTrigger value="approvals" className="flex-1">Approvals</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="mt-4">
                    <ScrollArea className="h-[calc(100vh-300px)]">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg border">
                            <p className="text-xs text-muted-foreground">Department</p>
                            <p className="text-sm font-medium">{selectedDoc.department}</p>
                          </div>
                          <div className="p-3 rounded-lg border">
                            <p className="text-xs text-muted-foreground">Site</p>
                            <p className="text-sm font-medium">{selectedDoc.site}</p>
                          </div>
                          <div className="p-3 rounded-lg border">
                            <p className="text-xs text-muted-foreground">Owner</p>
                            <p className="text-sm font-medium">{selectedDoc.owner}</p>
                          </div>
                          <div className="p-3 rounded-lg border">
                            <p className="text-xs text-muted-foreground">Last Modified</p>
                            <p className="text-sm font-medium">{format(new Date(selectedDoc.lastModified), 'MMM d, yyyy')}</p>
                          </div>
                          {selectedDoc.effectiveDate && (
                            <div className="p-3 rounded-lg border">
                              <p className="text-xs text-muted-foreground">Effective Date</p>
                              <p className="text-sm font-medium">{format(new Date(selectedDoc.effectiveDate), 'MMM d, yyyy')}</p>
                            </div>
                          )}
                          {selectedDoc.reviewDate && (
                            <div className={cn(
                              'p-3 rounded-lg border',
                              isOverdue(selectedDoc) && 'border-destructive bg-destructive/5',
                              !isOverdue(selectedDoc) && isReviewDue(selectedDoc) && 'border-secondary bg-secondary/10'
                            )}>
                              <p className="text-xs text-muted-foreground">Review Date</p>
                              <p className={cn(
                                'text-sm font-medium',
                                isOverdue(selectedDoc) && 'text-destructive',
                                !isOverdue(selectedDoc) && isReviewDue(selectedDoc) && 'text-foreground'
                              )}>
                                {format(new Date(selectedDoc.reviewDate), 'MMM d, yyyy')}
                                {isOverdue(selectedDoc) && ' (Overdue)'}
                              </p>
                            </div>
                          )}
                        </div>

                        {selectedDoc.tags.length > 0 && (
                          <div className="p-3 rounded-lg border">
                            <p className="text-xs text-muted-foreground mb-2">Tags</p>
                            <div className="flex flex-wrap gap-1">
                              {selectedDoc.tags.map((tag: string) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  <Tag className="h-2.5 w-2.5 mr-1" /> {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="versions" className="mt-4">
                    <ScrollArea className="h-[calc(100vh-300px)]">
                      <div className="space-y-3">
                        {selectedDoc.versions.map((v: DocumentVersion, idx: number) => (
                          <div key={v.version} className={cn(
                            'p-3 rounded-lg border',
                            idx === 0 && 'border-accent bg-accent/10'
                          )}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant={idx === 0 ? 'default' : 'outline'} className="text-xs">
                                  v{v.version}
                                </Badge>
                                {idx === 0 && <span className="text-xs text-accent-foreground">Current</span>}
                              </div>
                              <span className="text-sm text-muted-foreground">{format(new Date(v.date), 'MMM d, yyyy')}</span>
                            </div>
                            <p className="text-sm mb-1">{v.changes}</p>
                            <p className="text-sm text-muted-foreground">By {v.author}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="approvals" className="mt-4">
                    <ScrollArea className="h-[calc(100vh-300px)]">
                      {selectedDoc.approvals.length === 0 ? (
                        <div className="text-center py-8">
                          <FileClock className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No approvals yet</p>
                          <p className="text-sm text-muted-foreground">Document is still in draft</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedDoc.approvals.map((a: DocumentApproval, idx: number) => (
                            <div key={idx} className="p-3 rounded-lg border flex items-center gap-3">
                              {getApprovalStatusIcon(a.status)}
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium">{a.name}</p>
                                  <Badge variant="outline" className="text-xs">{a.role}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {a.status} {a.date && `· ${format(new Date(a.date), 'MMM d, yyyy')}`}
                                </p>
                                {a.comments && <p className="text-sm mt-1">{a.comments}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button className="flex-1 h-11" onClick={() => toast.success('Download started')}>
                    <Download className="h-4 w-4 mr-1.5" /> Download
                  </Button>
                  {!selectedDoc.isLocked && (
                    <Button variant="outline" className="h-11" onClick={() => toast.success('Edit mode')}>
                      <Edit2 className="h-4 w-4 mr-1.5" /> Edit
                    </Button>
                  )}
                  {selectedDoc.status === 'Draft' && (
                    <Button variant="outline" className="h-11" onClick={() => toast.success('Sent for review')}>
                      <Send className="h-4 w-4 mr-1.5" /> Submit
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* New Document Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Document Title</Label>
              <Input id="title" placeholder="e.g., Production Line Cleanup Procedure" className="mt-1 h-11" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select defaultValue="SOP">
                  <SelectTrigger className="mt-1 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c: DocumentCategory) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Department</Label>
                <Select defaultValue="Production">
                  <SelectTrigger className="mt-1 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d: string) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Site</Label>
                <Select defaultValue="PRAI">
                  <SelectTrigger className="mt-1 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SITES.map((s: string) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Document Number</Label>
                <Input placeholder="Auto-generated" className="mt-1 h-11" disabled />
              </div>
            </div>
            <div>
              <Label>Tags</Label>
              <Input placeholder="Add tags separated by commas" className="mt-1 h-11" />
            </div>
            <div>
              <Label>Upload File (Optional)</Label>
              <div className="mt-1 border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer min-h-[100px] flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PDF, DOCX, XLSX up to 10MB</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="h-11" onClick={() => setShowNewDialog(false)}>Cancel</Button>
            <Button className="h-11" onClick={() => { toast.success('Document created!'); setShowNewDialog(false); }}>
              <Plus className="h-4 w-4 mr-1.5" /> Create Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t md:hidden z-50">
        <div className="flex items-center justify-around py-2">
          {mobileNavItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                'flex flex-col items-center gap-1 p-2 min-w-[64px] min-h-[56px] rounded-lg transition-colors',
                item.active ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}