/**
 * STR Module 1: Operations & Store Management
 * 
 * Forms: ACMSTR, ASMR, IRN, NIR, SIC, SII, SIROP, SIU, SR, STIDS, STIR, SLED, SRRI1, SRRI2
 * 
 * Implements the 5-screen architecture:
 * 1. Browse/List View - Gallery of records
 * 2. New Request - Data entry form
 * 3. Detail View - Read-only snapshot
 * 4. Edit/Update - Role-gated editing
 * 5. Approval/Decision - Approve/Reject workflow
 */

import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Search,
  Plus,
  FileText,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Package,
  Warehouse,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSTRSubmissionsByModule } from '@/hooks/use-str-submissions';
import { STR_MODULE_1_OPERATIONS, STR_MODULES, getSTRStatusInfo, formatSTRDocumentNumber } from '@/config/str-constants';
import { formatDistanceToNow, format } from 'date-fns';

const MODULE = STR_MODULES.M1;
const MODULE_FORMS = Object.values(STR_MODULE_1_OPERATIONS);
const FORM_CODES = Object.keys(STR_MODULE_1_OPERATIONS);

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
} as const;

export default function STROperationsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [formFilter, setFormFilter] = useState<string>('all');
  const [showNewDialog, setShowNewDialog] = useState(false);
  
  const { data: submissions, isLoading } = useSTRSubmissionsByModule(FORM_CODES);
  
  // Filter submissions
  const filteredSubmissions = useMemo(() => {
    if (!submissions) return [];
    
    return submissions.filter((s) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          (s.INO ?? '').toLowerCase().includes(query) ||
          (s.Title ?? '').toLowerCase().includes(query) ||
          (s.Requestor ?? '').toLowerCase().includes(query) ||
          (s.FormType ?? '').toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      
      // Status filter
      if (statusFilter !== 'all' && s.CurrentStatus !== statusFilter) {
        return false;
      }
      
      // Form type filter
      if (formFilter !== 'all' && s.FormType !== formFilter) {
        return false;
      }
      
      return true;
    });
  }, [submissions, searchQuery, statusFilter, formFilter]);
  
  // Stats
  const stats = useMemo(() => {
    if (!submissions) return { total: 0, pending: 0, approved: 0, rejected: 0 };
    
    return {
      total: submissions.length,
      pending: submissions.filter((s) => ['Submitted', 'PendingReview', 'PendingApproval'].includes(s.CurrentStatus)).length,
      approved: submissions.filter((s) => s.CurrentStatus === 'Approved').length,
      rejected: submissions.filter((s) => s.CurrentStatus === 'Rejected').length,
    };
  }, [submissions]);
  
  const handleNewRequest = (formCode: string) => {
    setShowNewDialog(false);
    navigate(`/str/forms/${formCode}/new`);
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-11 w-11" asChild>
              <Link to="/str">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className={`rounded-xl p-2.5 ${MODULE.colorLight}`}>
              <Warehouse className={`h-5 w-5 ${MODULE.colorText}`} />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">{MODULE.name}</h1>
              <p className="text-sm text-muted-foreground">
                {MODULE.forms.length} form types • {stats.total} records
              </p>
            </div>
            <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
              <DialogTrigger asChild>
                <Button className={MODULE.color}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Select Form Type</DialogTitle>
                  <DialogDescription>
                    Choose the type of operations form you want to create
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-4 sm:grid-cols-2">
                  {MODULE_FORMS.map((form) => (
                    <button
                      key={form.code}
                      onClick={() => handleNewRequest(form.code)}
                      className="flex items-start gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-muted"
                    >
                      <div className={`rounded-lg p-2 ${MODULE.colorLight}`}>
                        <FileText className={`h-4 w-4 ${MODULE.colorText}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground">{form.code}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {form.name}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card
            className={`cursor-pointer transition-all ${statusFilter === 'all' ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-secondary-foreground" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card
            className={`cursor-pointer transition-all ${statusFilter === 'PendingApproval' ? 'ring-2 ring-amber-500' : ''}`}
            onClick={() => setStatusFilter(statusFilter === 'PendingApproval' ? 'all' : 'PendingApproval')}
          >
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-accent-foreground" />
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card
            className={`cursor-pointer transition-all ${statusFilter === 'Approved' ? 'ring-2 ring-emerald-500' : ''}`}
            onClick={() => setStatusFilter(statusFilter === 'Approved' ? 'all' : 'Approved')}
          >
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card
            className={`cursor-pointer transition-all ${statusFilter === 'Rejected' ? 'ring-2 ring-rose-500' : ''}`}
            onClick={() => setStatusFilter(statusFilter === 'Rejected' ? 'all' : 'Rejected')}
          >
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <XCircle className="h-8 w-8 text-destructive" />
                <div>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by INO, title, or requestor..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Submitted">Submitted</SelectItem>
                    <SelectItem value="PendingReview">Pending Review</SelectItem>
                    <SelectItem value="PendingApproval">Pending Approval</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={formFilter} onValueChange={setFormFilter}>
                  <SelectTrigger className="w-[140px]">
                    <FileText className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Form Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Forms</SelectItem>
                    {FORM_CODES.map((code) => (
                      <SelectItem key={code} value={code}>
                        {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Active Filters */}
            {(statusFilter !== 'all' || formFilter !== 'all' || searchQuery) && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchQuery}
                    <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-destructive">
                      ×
                    </button>
                  </Badge>
                )}
                {statusFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {statusFilter}
                    <button onClick={() => setStatusFilter('all')} className="ml-1 hover:text-destructive">
                      ×
                    </button>
                  </Badge>
                )}
                {formFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Form: {formFilter}
                    <button onClick={() => setFormFilter('all')} className="ml-1 hover:text-destructive">
                      ×
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setFormFilter('all');
                  }}
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Submissions List */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Records</CardTitle>
              <Badge variant="outline">
                {filteredSubmissions.length} of {submissions?.length || 0}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="py-12 text-center">
                <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="text-lg font-medium text-foreground">No records found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchQuery || statusFilter !== 'all' || formFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Create a new request to get started'}
                </p>
                {!searchQuery && statusFilter === 'all' && formFilter === 'all' && (
                  <Button className="mt-4" onClick={() => setShowNewDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Request
                  </Button>
                )}
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-2"
              >
                {filteredSubmissions.map((submission) => {
                  const statusInfo = getSTRStatusInfo(submission.CurrentStatus);
                  const formInfo = STR_MODULE_1_OPERATIONS[submission.FormType as keyof typeof STR_MODULE_1_OPERATIONS];
                  
                  return (
                    <motion.div
                      key={submission.guid}
                      variants={itemVariants}
                      onClick={() => navigate(`/submissions/${submission.guid}`)}
                      className="group flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-all hover:bg-muted/50 hover:shadow-sm"
                    >
                      <div className={`rounded-lg p-2.5 ${MODULE.colorLight}`}>
                        <FileText className={`h-5 w-5 ${MODULE.colorText}`} />
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{submission.INO}</p>
                          <Badge variant="outline" className="text-xs">
                            {submission.FormType}
                          </Badge>
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {formInfo?.name || submission.FormType} • {submission.Requestor}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {format(new Date(submission.RequestDate), 'dd MMM yyyy')}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge variant={statusInfo.badgeVariant}>
                          {statusInfo.label}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
