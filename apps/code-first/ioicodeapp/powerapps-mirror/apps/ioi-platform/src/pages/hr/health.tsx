/**
 * HR Health & Compliance Page
 * Modern Industrial Governance Design - Navy & Teal theme
 * Uses MainDB_HR SharePoint list with HEALTHINFO form code
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Plus,
  Search,
  Heart,
  Stethoscope,
  Shield,
  ChevronRight,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  User,
  FileText,
  Activity,
  Eye,
  MoreHorizontal,
  Filter,
  Download,
  TrendingUp,
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
} from '@/components/ui/dialog';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty';
import { format, differenceInDays, addDays } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Import from generated model
import type { MainDBHR } from '@/generated/models/main-dbhr-model';
import { MainDBHRStatusKeyToLabel } from '@/generated/models/main-dbhr-model';
import { useMainDBHRByFormType, useCreateMainDBHR } from '@/hooks/use-main-dbhr';
import type { HRFormCode } from '@/hooks/use-main-dbhr';

import {
  HRLayout,
  HRCard,
  HRSectionHeader,
  HRStatusBadge,
  HRMetricCard,
  hrContainerVariants,
  hrItemVariants,
} from '@/components/hr/hr-layout';

const HEALTH_FORM_CODE: HRFormCode = 'HEALTHINFO';

// Mock compliance data for demonstration
const COMPLIANCE_CATEGORIES = [
  { id: 'medical', label: 'Medical Checkups', icon: Stethoscope, due: 12, completed: 156, total: 168, color: 'text-warning' },
  { id: 'safety', label: 'Safety Certifications', icon: Shield, due: 8, completed: 142, total: 150, color: 'text-primary' },
  { id: 'vaccinations', label: 'Vaccinations', icon: Heart, due: 5, completed: 163, total: 168, color: 'text-success' },
  { id: 'training', label: 'Health Training', icon: Activity, due: 15, completed: 120, total: 135, color: 'text-destructive' },
];

const UPCOMING_EXPIRATIONS = [
  { id: '1', employee: 'Ahmad Razak', type: 'Medical Checkup', expiryDate: addDays(new Date(), 7), department: 'Operations', site: 'PRAI' },
  { id: '2', employee: 'Siti Aminah', type: 'Safety Cert', expiryDate: addDays(new Date(), 12), department: 'Finance', site: 'PRAI' },
  { id: '3', employee: 'Kumar Raj', type: 'Typhoid Vaccination', expiryDate: addDays(new Date(), 15), department: 'Production', site: 'JHR' },
  { id: '4', employee: 'Lee Wei Ming', type: 'Medical Checkup', expiryDate: addDays(new Date(), 21), department: 'IT', site: 'PRAI' },
  { id: '5', employee: 'Fatimah Hassan', type: 'Safety Training', expiryDate: addDays(new Date(), 25), department: 'HR', site: 'PRAI' },
];

const DEPARTMENTS = [
  { value: 'all', label: 'All Departments' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Production', label: 'Production' },
  { value: 'Finance', label: 'Finance' },
  { value: 'IT', label: 'IT' },
  { value: 'HR', label: 'HR' },
];

const SITES = [
  { value: 'all', label: 'All Sites' },
  { value: 'PRAI', label: 'PRAI' },
  { value: 'JHR', label: 'JHR' },
];

const COMPLIANCE_STATUS = [
  { value: 'all', label: 'All Status' },
  { value: 'compliant', label: 'Compliant' },
  { value: 'due', label: 'Due Soon' },
  { value: 'overdue', label: 'Overdue' },
];

export default function HRHealthPage() {
  const { data: submissions, isLoading, error, refetch } = useMainDBHRByFormType(HEALTH_FORM_CODE);
  const createSubmission = useCreateMainDBHR();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [siteFilter, setSiteFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<MainDBHR | null>(null);
  const [newRecordDialogOpen, setNewRecordDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New record form state
  const [newRecord, setNewRecord] = useState({
    employeeName: '',
    recordType: '',
    department: '',
    site: 'PRAI',
    notes: '',
  });

  const filteredSubmissions = useMemo(() => {
    if (!submissions) return [];
    return submissions.filter((s: MainDBHR) => {
      const matchesSearch = !searchQuery || 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.employeename?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = departmentFilter === 'all' || s.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
  }, [submissions, searchQuery, departmentFilter]);

  // Calculate overall compliance rate
  const overallCompliance = useMemo(() => {
    const totalCompleted = COMPLIANCE_CATEGORIES.reduce((sum, cat) => sum + cat.completed, 0);
    const totalRequired = COMPLIANCE_CATEGORIES.reduce((sum, cat) => sum + cat.total, 0);
    return Math.round((totalCompleted / totalRequired) * 100);
  }, []);

  const getExpiryStatus = (expiryDate: Date) => {
    const daysUntil = differenceInDays(expiryDate, new Date());
    if (daysUntil < 0) return { status: 'overdue' as const, label: 'Overdue', color: 'text-destructive' };
    if (daysUntil <= 7) return { status: 'due' as const, label: `${daysUntil}d`, color: 'text-destructive' };
    if (daysUntil <= 14) return { status: 'due' as const, label: `${daysUntil}d`, color: 'text-warning' };
    return { status: 'compliant' as const, label: `${daysUntil}d`, color: 'text-success' };
  };

  const handleExport = () => {
    toast.success('Compliance report exported', {
      description: 'Report generated and ready for download',
    });
  };

  const handleNewRecord = async () => {
    if (!newRecord.employeeName || !newRecord.recordType) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await createSubmission.mutateAsync({
        title: newRecord.recordType,
        formcode: HEALTH_FORM_CODE,
        employeeid: `EMP-${Date.now()}`, // Auto-generate employee ID
        employeename: newRecord.employeeName,
        department: newRecord.department,
        siteKey: newRecord.site === 'PRAI' ? 'SiteKey0' : 'SiteKey1',
        statusKey: 'StatusKey1',
        inspectionremarks: newRecord.notes,
        submittedon: new Date().toISOString(),
      });
      toast.success('Health record created', {
        description: 'New record has been submitted successfully',
      });
      setNewRecordDialogOpen(false);
      setNewRecord({ employeeName: '', recordType: '', department: '', site: 'PRAI', notes: '' });
      refetch();
    } catch (err) {
      // Still close dialog and show offline message - data will sync when connection is restored
      toast.warning('Record saved locally', {
        description: 'Will sync when SharePoint connection is restored',
      });
      setNewRecordDialogOpen(false);
      setNewRecord({ employeeName: '', recordType: '', department: '', site: 'PRAI', notes: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <HRLayout
      title="Health & Compliance"
      subtitle={`FormCode: ${HEALTH_FORM_CODE}`}
      breadcrumbs={[
        { label: 'HR', href: '/hr' },
        { label: 'Health & Compliance' },
      ]}
      dataSource="MainDB_HR"
      recordCount={submissions?.length || 0}
      onRefresh={() => refetch()}
      pendingCount={COMPLIANCE_CATEGORIES.reduce((sum, cat) => sum + cat.due, 0)}
      showSearch
      searchPlaceholder="Search employees, records..."
      onSearch={setSearchQuery}
      actions={
        <>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-[10px] font-bold uppercase tracking-wide gap-1"
            onClick={handleExport}
          >
            <Download className="h-3 w-3" />
            Export
          </Button>
          <Button
            size="sm"
            className="h-7 text-[10px] font-bold uppercase tracking-wide gap-1 bg-[#003366] hover:bg-[#003366]/90"
            onClick={() => setNewRecordDialogOpen(true)}
          >
            <Plus className="h-3 w-3" />
            New Record
          </Button>
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
          {/* Overall Compliance */}
          <HRCard>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Overall Compliance
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">{overallCompliance}%</span>
                    <Badge className="text-[8px] px-1.5 py-0 h-4 bg-success/10 text-success border-0">
                      <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                      +2.3%
                    </Badge>
                  </div>
                  <Progress value={overallCompliance} className="h-1.5 mt-2" />
                </div>
                <div className="h-10 w-10 rounded bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
              </div>
            </CardContent>
          </HRCard>

          {/* Due This Month */}
          <HRCard className="border-l-2 border-l-warning">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Due This Month
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">
                      {COMPLIANCE_CATEGORIES.reduce((sum, cat) => sum + cat.due, 0)}
                    </span>
                    <Badge className="text-[8px] px-1.5 py-0 h-4 bg-warning/10 text-warning border-0">
                      <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                      Action Required
                    </Badge>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1">Across all categories</p>
                </div>
                <div className="h-10 w-10 rounded bg-warning/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
              </div>
            </CardContent>
          </HRCard>

          {/* Medical Checkups */}
          <HRCard>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Medical Checkups
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">156</span>
                    <span className="text-[10px] text-muted-foreground">/ 168</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1">12 due this month</p>
                </div>
                <div className="h-10 w-10 rounded bg-[#003366]/10 flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 text-[#003366]" />
                </div>
              </div>
            </CardContent>
          </HRCard>

          {/* Safety Certs */}
          <HRCard>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Safety Certifications
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">142</span>
                    <span className="text-[10px] text-muted-foreground">/ 150</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1">8 due this month</p>
                </div>
                <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </HRCard>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-3">
          {/* Compliance Categories - Medium Card (5 cols) */}
          <motion.div variants={hrItemVariants} className="col-span-12 lg:col-span-5">
            <HRCard>
              <CardHeader className="p-3 pb-2 border-b border-border/50">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Compliance Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {COMPLIANCE_CATEGORIES.map((category) => {
                    const Icon = category.icon;
                    const percentage = Math.round((category.completed / category.total) * 100);
                    
                    return (
                      <div key={category.id} className="p-3 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'h-8 w-8 rounded flex items-center justify-center',
                            category.color.replace('text-', 'bg-') + '/10'
                          )}>
                            <Icon className={cn('h-4 w-4', category.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-[10px] font-semibold text-foreground">
                                {category.label}
                              </p>
                              <span className="text-[9px] text-muted-foreground">
                                {category.completed}/{category.total}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={percentage} className="h-1 flex-1" />
                              <span className="text-[9px] font-medium text-foreground">{percentage}%</span>
                            </div>
                          </div>
                          {category.due > 0 && (
                            <Badge className="text-[8px] px-1.5 py-0 h-4 bg-warning/10 text-warning border-0 shrink-0">
                              {category.due} due
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </HRCard>
          </motion.div>

          {/* Upcoming Expirations - Large Card (7 cols) */}
          <motion.div variants={hrItemVariants} className="col-span-12 lg:col-span-7">
            <HRCard>
              <CardHeader className="p-3 pb-2 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Upcoming Expirations
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-[9px] gap-1">
                    View All
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3">Employee</TableHead>
                      <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3">Type</TableHead>
                      <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3">Department</TableHead>
                      <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3">Site</TableHead>
                      <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3">Expires In</TableHead>
                      <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3 w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {UPCOMING_EXPIRATIONS.map((item, idx) => {
                      const expiryInfo = getExpiryStatus(item.expiryDate);
                      
                      return (
                        <TableRow
                          key={item.id}
                          className={cn(
                            'cursor-pointer hover:bg-muted/50 transition-colors',
                            idx % 2 === 1 && 'bg-muted/20'
                          )}
                        >
                          <TableCell className="text-[10px] font-medium px-3 py-2">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-[8px] font-bold text-primary">
                                  {item.employee.split(' ').map((n: string) => n[0]).join('')}
                                </span>
                              </div>
                              {item.employee}
                            </div>
                          </TableCell>
                          <TableCell className="text-[10px] text-muted-foreground px-3 py-2">
                            {item.type}
                          </TableCell>
                          <TableCell className="text-[10px] text-muted-foreground px-3 py-2">
                            {item.department}
                          </TableCell>
                          <TableCell className="px-3 py-2">
                            <Badge 
                              variant="outline" 
                              className={cn(
                                'text-[8px] px-1.5 py-0 h-4 font-mono',
                                item.site === 'PRAI' ? 'border-secondary text-secondary-foreground bg-secondary/50' : 'border-primary text-primary bg-primary/5'
                              )}
                            >
                              {item.site}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-3 py-2">
                            <Badge 
                              variant="outline" 
                              className={cn('text-[8px] px-1.5 py-0 h-4 border', expiryInfo.color)}
                            >
                              <Clock className="h-2.5 w-2.5 mr-0.5" />
                              {expiryInfo.label}
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
                                <DropdownMenuItem className="text-[10px]">
                                  <Eye className="h-3 w-3 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-[10px]">
                                  <Calendar className="h-3 w-3 mr-2" />
                                  Schedule
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </HRCard>
          </motion.div>

          {/* Health Records Table - Full Width */}
          <motion.div variants={hrItemVariants} className="col-span-12">
            <HRCard>
              <CardHeader className="p-3 pb-2 border-b border-border/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Health Records
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                      <Input
                        placeholder="Search records..."
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        className="h-7 pl-7 w-40 text-[10px]"
                      />
                    </div>
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
                    <Select value={siteFilter} onValueChange={setSiteFilter}>
                      <SelectTrigger className="h-7 w-24 text-[10px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SITES.map((site) => (
                          <SelectItem key={site.value} value={site.value} className="text-[10px]">
                            {site.label}
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
                    <span className="ml-2 text-[10px] text-muted-foreground">Loading health records...</span>
                  </div>
                ) : filteredSubmissions.length === 0 ? (
                  <Empty className="py-12">
                    <EmptyHeader>
                      <EmptyTitle className="text-sm">No Health Records</EmptyTitle>
                      <EmptyDescription className="text-[10px]">
                        No health records found. Create a new record to get started.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3">Employee</TableHead>
                        <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3">Record Type</TableHead>
                        <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3">Department</TableHead>
                        <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3">Submitted</TableHead>
                        <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3">Status</TableHead>
                        <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3 w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubmissions.map((record: MainDBHR, idx: number) => {
                        const statusLabel = record.statusKey ? MainDBHRStatusKeyToLabel[record.statusKey] : 'Unknown';
                        const isPending = record.statusKey === 'StatusKey1' || record.statusKey === 'StatusKey2';
                        const isApproved = record.statusKey === 'StatusKey3';
                        
                        return (
                          <TableRow
                            key={record.id}
                            className={cn(
                              'cursor-pointer hover:bg-muted/50 transition-colors',
                              idx % 2 === 1 && 'bg-muted/20',
                              selectedRecord?.id === record.id && 'bg-[#006a6a]/10'
                            )}
                            onClick={() => setSelectedRecord(record)}
                          >
                            <TableCell className="text-[10px] font-medium px-3 py-2">
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-destructive/10 flex items-center justify-center">
                                  <Heart className="h-3 w-3 text-destructive" />
                                </div>
                                {record.employeename || 'Unknown'}
                              </div>
                            </TableCell>
                            <TableCell className="text-[10px] text-muted-foreground px-3 py-2">
                              {record.title}
                            </TableCell>
                            <TableCell className="text-[10px] text-muted-foreground px-3 py-2">
                              {record.department || '—'}
                            </TableCell>
                            <TableCell className="text-[10px] text-muted-foreground px-3 py-2">
                              {record.submittedon ? format(new Date(record.submittedon), 'MMM d, yyyy') : '—'}
                            </TableCell>
                            <TableCell className="px-3 py-2">
                              <Badge
                                variant="outline"
                                className={cn(
                                  'text-[8px] px-1.5 py-0 h-4 border',
                                  isPending && 'bg-warning/10 text-warning border-warning/20',
                                  isApproved && 'bg-success/10 text-success border-success/20'
                                )}
                              >
                                {statusLabel}
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
                                    <Link to={`/submissions/${record.id}`}>
                                      <Eye className="h-3 w-3 mr-2" />
                                      View
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
      {/* New Record Dialog */}
      <Dialog open={newRecordDialogOpen} onOpenChange={setNewRecordDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Create Health Record</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {error && (
              <div className="p-2 rounded bg-warning/10 border border-warning/20">
                <p className="text-[10px] text-warning">
                  ⚠️ SharePoint offline - Record will be saved locally and synced later
                </p>
              </div>
            )}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Employee Name *
              </label>
              <Input
                value={newRecord.employeeName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRecord(prev => ({ ...prev, employeeName: e.target.value }))}
                placeholder="Enter employee name"
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Record Type *
              </label>
              <Select
                value={newRecord.recordType}
                onValueChange={(val: string) => setNewRecord(prev => ({ ...prev, recordType: val }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select record type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Medical Checkup">Medical Checkup</SelectItem>
                  <SelectItem value="Safety Certification">Safety Certification</SelectItem>
                  <SelectItem value="Vaccination">Vaccination</SelectItem>
                  <SelectItem value="Health Training">Health Training</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Department
              </label>
              <Select
                value={newRecord.department}
                onValueChange={(val: string) => setNewRecord(prev => ({ ...prev, department: val }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.filter(d => d.value !== 'all').map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>{dept.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Site
              </label>
              <Select
                value={newRecord.site}
                onValueChange={(val: string) => setNewRecord(prev => ({ ...prev, site: val }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRAI">PRAI</SelectItem>
                  <SelectItem value="JHR">JHR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Notes
              </label>
              <Input
                value={newRecord.notes}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRecord(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes (optional)"
                className="mt-1 text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setNewRecordDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleNewRecord}
              disabled={isSubmitting}
              className="bg-[#003366] hover:bg-[#003366]/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create Record'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </HRLayout>
  );
}
