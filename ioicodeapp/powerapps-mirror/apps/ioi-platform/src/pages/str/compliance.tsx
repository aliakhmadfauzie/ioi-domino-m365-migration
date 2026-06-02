/**
 * STR Module 5: Store Inspection & Compliance
 * Forms: STOREISP
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
  Package,
  ClipboardCheck,
  ArrowRight,
  Shield,
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
import { useSTRSubmissionsByModule } from '@/hooks/use-str-submissions';
import { STR_MODULE_5_COMPLIANCE, STR_MODULES, getSTRStatusInfo } from '@/config/str-constants';
import { format } from 'date-fns';

const MODULE = STR_MODULES.M5;
const MODULE_FORMS = Object.values(STR_MODULE_5_COMPLIANCE);
const FORM_CODES = Object.keys(STR_MODULE_5_COMPLIANCE);

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
} as const;

export default function STRCompliancePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewDialog, setShowNewDialog] = useState(false);
  
  const { data: submissions, isLoading } = useSTRSubmissionsByModule(FORM_CODES);
  
  const filteredSubmissions = useMemo(() => {
    if (!submissions) return [];
    return submissions.filter((s) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!(s.INO ?? '').toLowerCase().includes(query) &&
            !(s.Title ?? '').toLowerCase().includes(query) &&
            !(s.Requestor ?? '').toLowerCase().includes(query)) {
          return false;
        }
      }
      if (statusFilter !== 'all' && s.CurrentStatus !== statusFilter) return false;
      return true;
    });
  }, [submissions, searchQuery, statusFilter]);
  
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
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-11 w-11" asChild>
              <Link to="/str"><ArrowLeft className="h-5 w-5" /></Link>
            </Button>
            <div className={`rounded-xl p-2.5 ${MODULE.colorLight}`}>
              <ClipboardCheck className={`h-5 w-5 ${MODULE.colorText}`} />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">{MODULE.name}</h1>
              <p className="text-sm text-muted-foreground">
                {MODULE.forms.length} form type • {stats.total} records
              </p>
            </div>
            <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
              <DialogTrigger asChild>
                <Button className={MODULE.color}>
                  <Plus className="mr-2 h-4 w-4" />New Inspection
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>New Store Inspection</DialogTitle>
                  <DialogDescription>Start a new inspection record</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-4">
                  {MODULE_FORMS.map((form) => (
                    <button
                      key={form.code}
                      onClick={() => handleNewRequest(form.code)}
                      className="flex items-start gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-muted"
                    >
                      <div className={`rounded-lg p-2 ${MODULE.colorLight}`}>
                        <Shield className={`h-4 w-4 ${MODULE.colorText}`} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{form.code}</p>
                        <p className="text-sm text-muted-foreground">{form.name}</p>
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
        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card className={`cursor-pointer ${statusFilter === 'all' ? 'ring-2 ring-rose-500' : ''}`}
                onClick={() => setStatusFilter('all')}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-destructive" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={`cursor-pointer ${statusFilter === 'PendingApproval' ? 'ring-2 ring-amber-500' : ''}`}
                onClick={() => setStatusFilter(statusFilter === 'PendingApproval' ? 'all' : 'PendingApproval')}>
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
          <Card className={`cursor-pointer ${statusFilter === 'Approved' ? 'ring-2 ring-emerald-500' : ''}`}
                onClick={() => setStatusFilter(statusFilter === 'Approved' ? 'all' : 'Approved')}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={`cursor-pointer ${statusFilter === 'Rejected' ? 'ring-2 ring-rose-500' : ''}`}
                onClick={() => setStatusFilter(statusFilter === 'Rejected' ? 'all' : 'Rejected')}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <XCircle className="h-8 w-8 text-destructive" />
                <div>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                  <p className="text-xs text-muted-foreground">Issues</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search inspections..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="PendingApproval">Pending Review</SelectItem>
                  <SelectItem value="Approved">Completed</SelectItem>
                  <SelectItem value="Rejected">Issues Found</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        {/* List */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Inspection Records</CardTitle>
              <Badge variant="outline">{filteredSubmissions.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="py-12 text-center">
                <ClipboardCheck className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="text-muted-foreground">No inspection records found</p>
                <Button className="mt-4" onClick={() => setShowNewDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Start New Inspection
                </Button>
              </div>
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-2">
                {filteredSubmissions.map((submission) => {
                  const statusInfo = getSTRStatusInfo(submission.CurrentStatus);
                  return (
                    <motion.div
                      key={submission.guid}
                      variants={itemVariants}
                      onClick={() => navigate(`/submissions/${submission.guid}`)}
                      className="group flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-all hover:bg-muted/50"
                    >
                      <div className={`rounded-lg p-2.5 ${MODULE.colorLight}`}>
                        <Shield className={`h-5 w-5 ${MODULE.colorText}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{submission.INO}</p>
                          <Badge variant="outline" className="text-xs">Inspection</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Inspected by {submission.Requestor}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(submission.RequestDate), 'dd MMM yyyy')}
                        </p>
                      </div>
                      <Badge variant={statusInfo.badgeVariant}>{statusInfo.label}</Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
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
