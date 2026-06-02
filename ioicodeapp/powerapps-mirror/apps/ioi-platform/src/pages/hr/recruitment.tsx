/**
 * HR Recruitment & Staffing Page
 * Modern Industrial Governance Design - Navy & Teal theme
 * Uses MainDB_HR SharePoint list with SR, CWR, FTCR, INTERVIEWDB, JD, INTERN form codes
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Plus,
  Search,
  Briefcase,
  ChevronRight,
  Loader2,
  Users,
  Clock,
  CheckCircle2,
  FileText,
  Calendar,
  Eye,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  UserPlus,
  Building2,
  Target,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Import from generated model
import type { MainDBHR } from '@/generated/models/main-dbhr-model';
import { MainDBHRStatusKeyToLabel } from '@/generated/models/main-dbhr-model';
import { useMainDBHR, useCreateMainDBHR } from '@/hooks/use-main-dbhr';
import { useUser } from '@/hooks/use-user';

import {
  HRLayout,
  HRCard,
  hrContainerVariants,
  hrItemVariants,
} from '@/components/hr/hr-layout';

const RECRUITMENT_FORM_CODES = ['SR', 'CWR', 'FTCR', 'INTERVIEWDB', 'JD', 'INTERN'];

const FORM_CODE_LABELS: Record<string, string> = {
  SR: 'Staff Requisition',
  CWR: 'Contract Worker',
  FTCR: 'Fixed Term Contract',
  INTERVIEWDB: 'Interview Database',
  JD: 'Job Description',
  INTERN: 'Internship',
};

const FORM_CODE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  SR: { bg: 'bg-secondary/50', text: 'text-secondary-foreground', border: 'border-secondary' },
  CWR: { bg: 'bg-secondary/50', text: 'text-secondary-foreground', border: 'border-secondary' },
  FTCR: { bg: 'bg-accent/50', text: 'text-accent-foreground', border: 'border-accent' },
  INTERVIEWDB: { bg: 'bg-secondary', text: 'text-primary', border: 'border-primary/30' },
  JD: { bg: 'bg-muted/50', text: 'text-foreground', border: 'border-border' },
  INTERN: { bg: 'bg-secondary', text: 'text-secondary-foreground', border: 'border-accent' },
};

// Mock recruitment pipeline data
const PIPELINE_DATA = [
  { id: '1', position: 'Senior Chemist', department: 'R&D', status: 'Interview', candidates: 4, daysOpen: 12, priority: 'High' },
  { id: '2', position: 'Plant Operator', department: 'Operations', status: 'Screening', candidates: 8, daysOpen: 5, priority: 'Medium' },
  { id: '3', position: 'QC Analyst', department: 'Quality', status: 'Interview', candidates: 3, daysOpen: 18, priority: 'High' },
  { id: '4', position: 'Safety Officer', department: 'HSE', status: 'Offer', candidates: 1, daysOpen: 25, priority: 'Low' },
  { id: '5', position: 'IT Support', department: 'IT', status: 'New', candidates: 12, daysOpen: 2, priority: 'Medium' },
];

const DEPARTMENTS = [
  { value: 'all', label: 'All Departments' },
  { value: 'R&D', label: 'R&D' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Quality', label: 'Quality' },
  { value: 'HSE', label: 'HSE' },
  { value: 'IT', label: 'IT' },
  { value: 'Finance', label: 'Finance' },
  { value: 'HR', label: 'HR' },
];

const FORM_TYPES = [
  { value: 'all', label: 'All Types' },
  ...RECRUITMENT_FORM_CODES.map((code) => ({ value: code, label: FORM_CODE_LABELS[code] || code })),
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

export default function HRRecruitmentPage() {
  const { data: user } = useUser();
  const { data: allSubmissions, isLoading, error, refetch } = useMainDBHR();
  const createSubmission = useCreateMainDBHR();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [formTypeFilter, setFormTypeFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newFormType, setNewFormType] = useState('');
  const [newPosition, setNewPosition] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [newJustification, setNewJustification] = useState('');

  // Filter to recruitment form codes
  const submissions = allSubmissions?.filter((s: MainDBHR) => 
    RECRUITMENT_FORM_CODES.includes(s.formcode)
  ) || [];

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((s: MainDBHR) => {
      const matchesSearch = !searchQuery || 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.employeename?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = formTypeFilter === 'all' || s.formcode === formTypeFilter;
      const matchesDept = departmentFilter === 'all' || s.department === departmentFilter;
      return matchesSearch && matchesType && matchesDept;
    });
  }, [submissions, searchQuery, formTypeFilter, departmentFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const pending = submissions.filter((s: MainDBHR) => s.statusKey === 'StatusKey2').length;
    const approved = submissions.filter((s: MainDBHR) => s.statusKey === 'StatusKey3').length;
    const byFormCode: Record<string, number> = {};
    submissions.forEach((s: MainDBHR) => {
      byFormCode[s.formcode] = (byFormCode[s.formcode] || 0) + 1;
    });
    return { total: submissions.length, pending, approved, byFormCode };
  }, [submissions]);

  const handleCreateRequest = async () => {
    if (!newFormType || !newPosition) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createSubmission.mutateAsync({
        title: `${newFormType}-${newPosition.replace(/\s+/g, '-').toUpperCase()}-${format(new Date(), 'yyyyMMdd')}`,
        formcode: newFormType,
        statusKey: 'StatusKey1',
        employeeid: user?.objectId || '',
        employeename: user?.fullName || 'Unknown',
        requestoremail: user?.userPrincipalName || '',
        department: newDepartment,
        description: newJustification,
      });
      toast.success('Recruitment request submitted', {
        description: 'Your request has been submitted for approval.',
      });
      setShowNewDialog(false);
      setNewFormType('');
      setNewPosition('');
      setNewDepartment('');
      setNewJustification('');
    } catch (err: unknown) {
      toast.error('Failed to submit request');
    }
  };

  const getStatusBadge = (statusKey: string | null | undefined) => {
    switch (statusKey) {
      case 'StatusKey2':
        return { class: 'bg-warning/10 text-warning border-warning/20', label: 'Pending' };
      case 'StatusKey3':
        return { class: 'bg-success/10 text-success border-success/20', label: 'Approved' };
      case 'StatusKey4':
        return { class: 'bg-destructive/10 text-destructive border-destructive/20', label: 'Rejected' };
      default:
        return { class: 'bg-muted text-muted-foreground', label: 'Draft' };
    }
  };

  const getPipelineStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-secondary text-secondary-foreground border-secondary';
      case 'Screening': return 'bg-secondary text-secondary-foreground border-secondary';
      case 'Interview': return 'bg-accent text-accent-foreground border-accent';
      case 'Offer': return 'bg-success/10 text-success border-success/20';
      case 'Hired': return 'bg-success/20 text-success border-success/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <HRLayout
      title="Recruitment & Staffing"
      subtitle={`${RECRUITMENT_FORM_CODES.length} Form Types`}
      breadcrumbs={[
        { label: 'HR', href: '/hr' },
        { label: 'Recruitment & Staffing' },
      ]}
      dataSource="MainDB_HR"
      recordCount={submissions.length}
      onRefresh={() => refetch()}
      pendingCount={stats.pending}
      showSearch
      searchPlaceholder="Search requisitions, positions..."
      onSearch={setSearchQuery}
      actions={
        <>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-[10px] font-bold uppercase tracking-wide gap-1"
          >
            <Download className="h-3 w-3" />
            Export
          </Button>
          <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="h-7 text-[10px] font-bold uppercase tracking-wide gap-1 bg-[#003366] hover:bg-[#003366]/90"
              >
                <Plus className="h-3 w-3" />
                New Requisition
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-base">New Staff Requisition</DialogTitle>
                <DialogDescription className="text-[10px] text-muted-foreground">
                  Submit a new recruitment request for approval
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-medium">Request Type *</Label>
                  <Select value={newFormType} onValueChange={setNewFormType}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select request type" />
                    </SelectTrigger>
                    <SelectContent>
                      {RECRUITMENT_FORM_CODES.map((code) => (
                        <SelectItem key={code} value={code} className="text-xs">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={cn(
                                'text-[8px] px-1 py-0 h-3.5',
                                FORM_CODE_COLORS[code]?.bg,
                                FORM_CODE_COLORS[code]?.text,
                                FORM_CODE_COLORS[code]?.border
                              )}
                            >
                              {code}
                            </Badge>
                            {FORM_CODE_LABELS[code] || code}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-medium">Position Title *</Label>
                  <Input
                    placeholder="e.g., Senior Chemist"
                    value={newPosition}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPosition(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-medium">Department</Label>
                  <Select value={newDepartment} onValueChange={setNewDepartment}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.slice(1).map((dept) => (
                        <SelectItem key={dept.value} value={dept.value} className="text-xs">
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-medium">Business Justification</Label>
                  <Textarea
                    placeholder="Explain why this position is needed..."
                    value={newJustification}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewJustification(e.target.value)}
                    className="text-xs min-h-[80px] resize-none"
                  />
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setShowNewDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  className="h-7 text-[10px] bg-[#003366] hover:bg-[#003366]/90" 
                  onClick={handleCreateRequest}
                  disabled={createSubmission.isPending}
                >
                  {createSubmission.isPending && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                  Submit Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      }
    >
      {/* Error State */}
      {error && (
        <div className="mb-4 p-3 rounded bg-destructive/10 border border-destructive/20">
          <p className="text-[10px] text-destructive font-bold uppercase tracking-wide">
            Connection Error: Unable to connect to SharePoint
          </p>
        </div>
      )}

      <motion.div
        variants={hrContainerVariants}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {/* KPI Metrics Row */}
        <motion.div variants={hrItemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Total Requisitions */}
          <HRCard>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Total Requisitions
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">{stats.total}</span>
                    <Badge className="text-[8px] px-1.5 py-0 h-4 bg-success/10 text-success border-0">
                      <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                      +12%
                    </Badge>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1">This quarter</p>
                </div>
                <div className="h-10 w-10 rounded bg-[#003366]/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-[#003366]" />
                </div>
              </div>
            </CardContent>
          </HRCard>

          {/* Pending Approvals */}
          <HRCard className="border-l-2 border-l-warning">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Pending Approvals
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">{stats.pending}</span>
                    <Badge className="text-[8px] px-1.5 py-0 h-4 bg-warning/10 text-warning border-0 animate-pulse">
                      Action Required
                    </Badge>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1">Awaiting HOD/HR</p>
                </div>
                <div className="h-10 w-10 rounded bg-warning/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
              </div>
            </CardContent>
          </HRCard>

          {/* Active Vacancies */}
          <HRCard>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Active Vacancies
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">{PIPELINE_DATA.length}</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1">{PIPELINE_DATA.reduce((s, p) => s + p.candidates, 0)} total candidates</p>
                </div>
                <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </HRCard>

          {/* Hired This Month */}
          <HRCard>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Hired This Month
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">{stats.approved}</span>
                    <Badge className="text-[8px] px-1.5 py-0 h-4 bg-success/10 text-success border-0">
                      <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                      On Track
                    </Badge>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1">Target: 15</p>
                </div>
                <div className="h-10 w-10 rounded bg-success/10 flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-success" />
                </div>
              </div>
            </CardContent>
          </HRCard>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-3">
          {/* Recruitment Pipeline - Medium Card (5 cols) */}
          <motion.div variants={hrItemVariants} className="col-span-12 lg:col-span-5">
            <HRCard className="h-full">
              <CardHeader className="p-3 pb-2 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Recruitment Pipeline
                  </CardTitle>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">
                    {PIPELINE_DATA.length} Open
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {PIPELINE_DATA.map((opening) => (
                    <div key={opening.id} className="p-3 hover:bg-muted/30 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-[10px] font-semibold text-foreground truncate">
                              {opening.position}
                            </p>
                            {opening.priority === 'High' && (
                              <Badge className="text-[7px] px-1 py-0 h-3 bg-destructive/10 text-destructive border-0">
                                Urgent
                              </Badge>
                            )}
                          </div>
                          <p className="text-[9px] text-muted-foreground">{opening.department}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn('text-[8px] px-1.5 py-0 h-4 border', getPipelineStatusColor(opening.status))}
                        >
                          {opening.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-[8px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-2.5 w-2.5" />
                          {opening.candidates} candidates
                        </span>
                        <span>•</span>
                        <span className={opening.daysOpen > 20 ? 'text-destructive' : ''}>
                          {opening.daysOpen}d open
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </HRCard>
          </motion.div>

          {/* Form Type Distribution - Small Card (3 cols) */}
          <motion.div variants={hrItemVariants} className="col-span-12 sm:col-span-6 lg:col-span-3">
            <HRCard className="h-full">
              <CardHeader className="p-3 pb-2 border-b border-border/50">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  By Request Type
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-2">
                  {RECRUITMENT_FORM_CODES.map((code) => {
                    const count = stats.byFormCode[code] || 0;
                    const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                    const colors = FORM_CODE_COLORS[code] || FORM_CODE_COLORS.SR;
                    
                    return (
                      <div key={code} className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            'text-[8px] px-1.5 py-0 h-4 font-mono w-12 justify-center',
                            colors.bg, colors.text, colors.border
                          )}
                        >
                          {code}
                        </Badge>
                        <div className="flex-1">
                          <Progress value={percentage} className="h-1.5" />
                        </div>
                        <span className="text-[9px] text-muted-foreground w-6 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </HRCard>
          </motion.div>

          {/* Quick Actions - Small Card (4 cols) */}
          <motion.div variants={hrItemVariants} className="col-span-12 sm:col-span-6 lg:col-span-4">
            <HRCard className="h-full">
              <CardHeader className="p-3 pb-2 border-b border-border/50">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="h-auto py-3 px-3 flex flex-col items-center gap-1.5 text-left"
                    onClick={() => {
                      setNewFormType('SR');
                      setShowNewDialog(true);
                    }}
                  >
                    <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center">
                      <Briefcase className="h-4 w-4 text-secondary-foreground" />
                    </div>
                    <span className="text-[9px] font-semibold">Staff Requisition</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-3 px-3 flex flex-col items-center gap-1.5"
                    onClick={() => {
                      setNewFormType('CWR');
                      setShowNewDialog(true);
                    }}
                  >
                    <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center">
                      <Users className="h-4 w-4 text-secondary-foreground" />
                    </div>
                    <span className="text-[9px] font-semibold">Contract Worker</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-3 px-3 flex flex-col items-center gap-1.5"
                    onClick={() => {
                      setNewFormType('INTERN');
                      setShowNewDialog(true);
                    }}
                  >
                    <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-secondary-foreground" />
                    </div>
                    <span className="text-[9px] font-semibold">Internship</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-3 px-3 flex flex-col items-center gap-1.5"
                    onClick={() => {
                      setNewFormType('JD');
                      setShowNewDialog(true);
                    }}
                  >
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                      <FileText className="h-4 w-4 text-foreground" />
                    </div>
                    <span className="text-[9px] font-semibold">Job Description</span>
                  </Button>
                </div>
              </CardContent>
            </HRCard>
          </motion.div>

          {/* Requisitions Table - Full Width */}
          <motion.div variants={hrItemVariants} className="col-span-12">
            <HRCard>
              <CardHeader className="p-3 pb-2 border-b border-border/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    All Requisitions
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        className="h-7 pl-7 w-32 text-[10px]"
                      />
                    </div>
                    <Select value={formTypeFilter} onValueChange={setFormTypeFilter}>
                      <SelectTrigger className="h-7 w-28 text-[10px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FORM_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="text-[10px]">
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger className="h-7 w-32 text-[10px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map((dept) => (
                          <SelectItem key={dept.value} value={dept.value} className="text-[10px]">
                            {dept.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-8 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-[10px] text-muted-foreground">Loading requisitions...</span>
                  </div>
                ) : filteredSubmissions.length === 0 ? (
                  <Empty className="py-12">
                    <EmptyHeader>
                      <EmptyTitle className="text-sm">No Requisitions Found</EmptyTitle>
                      <EmptyDescription className="text-[10px]">
                        No recruitment requests found. Create a new requisition to get started.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3">Reference</TableHead>
                        <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3">Type</TableHead>
                        <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3">Requester</TableHead>
                        <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3">Department</TableHead>
                        <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3">Submitted</TableHead>
                        <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3">Status</TableHead>
                        <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3 w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubmissions.map((form: MainDBHR, idx: number) => {
                        const status = getStatusBadge(form.statusKey);
                        const colors = FORM_CODE_COLORS[form.formcode] || FORM_CODE_COLORS.SR;
                        
                        return (
                          <TableRow
                            key={form.id}
                            className={cn(
                              'cursor-pointer hover:bg-muted/50 transition-colors',
                              idx % 2 === 1 && 'bg-muted/20'
                            )}
                          >
                            <TableCell className="text-[10px] font-medium px-3 py-2">
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded bg-secondary flex items-center justify-center">
                                  <Briefcase className="h-3 w-3 text-secondary-foreground" />
                                </div>
                                <span className="truncate max-w-[150px]">{form.title}</span>
                              </div>
                            </TableCell>
                            <TableCell className="px-3 py-2">
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  'text-[8px] px-1.5 py-0 h-4 font-mono',
                                  colors.bg, colors.text, colors.border
                                )}
                              >
                                {form.formcode}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-[10px] text-muted-foreground px-3 py-2">
                              {form.employeename || '—'}
                            </TableCell>
                            <TableCell className="text-[10px] text-muted-foreground px-3 py-2">
                              {form.department || '—'}
                            </TableCell>
                            <TableCell className="text-[10px] text-muted-foreground px-3 py-2">
                              {form.submittedon ? format(new Date(form.submittedon), 'MMM d, yyyy') : '—'}
                            </TableCell>
                            <TableCell className="px-3 py-2">
                              <Badge
                                variant="outline"
                                className={cn('text-[8px] px-1.5 py-0 h-4 border', status.class)}
                              >
                                {status.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-3 py-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-32">
                                  <DropdownMenuItem className="text-[10px]" asChild>
                                    <Link to={`/submissions/${form.id}`}>
                                      <Eye className="h-3 w-3 mr-2" />
                                      View Details
                                    </Link>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </HRCard>
          </motion.div>
        </div>
      </motion.div>
    </HRLayout>
  );
}
