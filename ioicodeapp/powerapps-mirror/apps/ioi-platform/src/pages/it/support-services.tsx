/**
 * IT Support Services - Redesigned Module Home
 * 
 * User flow:
 * 1. Header: "IT Support Services"
 * 2. Forms grid: Available forms for IT Services
 * 3. My Submissions: User's submissions with stage indicators
 * 4. AI Filter: Filter by type, date, status
 */

import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { format, parseISO, isWithinInterval, subDays, startOfMonth, startOfWeek } from 'date-fns';
import {
  Headset,
  FileText,
  Calendar,
  ClipboardList,
  ArrowLeft,
  Plus,
  Search,
  Filter,
  ChevronRight,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { Skeleton } from '@/components/ui/skeleton';
import { DataReadyGuard } from '@/components/data-ready-guard';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import { useUser } from '@/hooks/use-user';
import type { DateRange } from 'react-day-picker';
import { M2_FORMS, type ITFormConfig } from '@/lib/it-forms-config';

// =============================================================================
// TYPES & CONSTANTS
// =============================================================================

const M2_FORM_CODES = M2_FORMS.map((form) => form.code);

function getFormColorClass(index: number): string {
  const colors = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-chart-1', 'bg-chart-2', 'bg-chart-3', 'bg-chart-4', 'bg-chart-5'];
  return colors[index % colors.length];
}

// Stage definitions
type SubmissionStage = 'Stage 1' | 'Stage 2' | 'Stage 3' | 'Completed';

interface StageInfo {
  label: string;
  description: string;
  color: string;
  bgColor: string;
}

const STAGE_INFO: Record<SubmissionStage, StageInfo> = {
  'Stage 1': {
    label: 'Stage 1',
    description: 'Submitted - Awaiting IT Review',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
  },
  'Stage 2': {
    label: 'Stage 2',
    description: 'In Progress - IT Working',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  'Stage 3': {
    label: 'Stage 3',
    description: 'Resolved - Awaiting Acceptance',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
  },
  'Completed': {
    label: 'Completed',
    description: 'Closed',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.2, 0, 0, 1] } },
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getSubmissionStage(submission: MainDBIT): SubmissionStage {
  // Parse remarks to get caseStatus
  let caseStatus = 'Submitted';
  try {
    const remarks = JSON.parse(submission.remarks || '{}');
    caseStatus = remarks.caseStatus || 'Submitted';
  } catch {
    // Default to Submitted
  }

  // Map caseStatus to Stage
  switch (caseStatus) {
    case 'Draft':
    case 'Submitted':
      return 'Stage 1';
    case 'InProgress':
      return 'Stage 2';
    case 'Resolved':
      return 'Stage 3';
    case 'Accepted':
    case 'Closed':
      return 'Completed';
    default:
      return 'Stage 1';
  }
}

function getAssignedITSupport(submission: MainDBIT): string | null {
  try {
    const remarks = JSON.parse(submission.remarks || '{}');
    return remarks.assignedToName || remarks.assignedToEmail || null;
  } catch {
    return null;
  }
}

function getITFeedback(submission: MainDBIT): string | null {
  try {
    const remarks = JSON.parse(submission.remarks || '{}');
    return remarks.solution || remarks.itComments || null;
  } catch {
    return null;
  }
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface FormsGridProps {
  forms: ITFormConfig[];
}

function FormsGrid({ forms }: FormsGridProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary">
              <FileText className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">Available Forms</CardTitle>
              <CardDescription>Select a form to submit a new IT request</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {forms.map((form, index) => {
              const Icon = form.icon;
              const path = `/it/forms/${form.code.toLowerCase()}/new`;
              return (
                <Link
                  key={form.code}
                  to={path}
                  className="group flex flex-col p-4 rounded-lg border bg-card hover:bg-accent hover:border-accent transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${getFormColorClass(index)}`}>
                      <Icon className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">
                      {form.code}
                    </Badge>
                  </div>
                  <h3 className="font-medium text-foreground group-hover:text-accent-foreground">
                    {form.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {form.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface AIFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onClearFilters: () => void;
  hasFilters: boolean;
  formTypes: string[];
}

function AIFilterBar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  dateRange,
  onDateRangeChange,
  onClearFilters,
  hasFilters,
  formTypes,
}: AIFilterBarProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* AI Badge */}
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Smart Filter</span>
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, form code..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={onTypeChange}>
              <SelectTrigger className="w-[160px] bg-background">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Request Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {formTypes.filter((t): t is string => Boolean(t)).map((type: string) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger className="w-[150px] bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="Stage 1">Stage 1 - Submitted</SelectItem>
                <SelectItem value="Stage 2">Stage 2 - In Progress</SelectItem>
                <SelectItem value="Stage 3">Stage 3 - Resolved</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-start bg-background">
                  <Calendar className="h-4 w-4 mr-2" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <span>
                        {format(dateRange.from, 'MMM d')} - {format(dateRange.to, 'MMM d')}
                      </span>
                    ) : (
                      format(dateRange.from, 'MMM d, yyyy')
                    )
                  ) : (
                    <span>Date Range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="range"
                  selected={dateRange}
                  onSelect={onDateRangeChange}
                  numberOfMonths={2}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Clear Filters */}
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface SubmissionCardProps {
  submission: MainDBIT;
  onClick: () => void;
}

function SubmissionCard({ submission, onClick }: SubmissionCardProps) {
  const stage = getSubmissionStage(submission);
  const stageInfo = STAGE_INFO[stage];
  const assignedTo = getAssignedITSupport(submission);
  const feedback = getITFeedback(submission);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left p-4 rounded-lg border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all"
      >
        <div className="flex items-start justify-between gap-4">
          {/* Left: Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="font-mono text-xs">
                {submission.formcode}
              </Badge>
              <Badge className={`${stageInfo.bgColor} ${stageInfo.color} border-0`}>
                {stageInfo.label}
              </Badge>
            </div>
            <h3 className="font-medium text-foreground truncate">
              {submission.title || 'Untitled Request'}
            </h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                <span>{submission.requestoremail?.split('@')[0] || 'Unknown'}</span>
              </div>
              {submission.submitteddate && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{format(parseISO(submission.submitteddate), 'MMM d, yyyy')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: IT Support & Arrow */}
          <div className="flex items-center gap-4">
            {assignedTo && (
              <div className="text-right hidden sm:block">
                <p className="text-xs text-muted-foreground">IT Support</p>
                <p className="text-sm font-medium text-foreground">{assignedTo}</p>
              </div>
            )}
            <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          </div>
        </div>

        {/* IT Feedback Preview (if resolved) */}
        {feedback && stage === 'Stage 3' && (
          <div className="mt-3 p-3 rounded-md bg-blue-50 border border-blue-200">
            <p className="text-xs font-medium text-blue-700 mb-1">IT Response:</p>
            <p className="text-sm text-blue-800 line-clamp-2">{feedback}</p>
          </div>
        )}
      </button>
    </motion.div>
  );
}

interface MySubmissionsPanelProps {
  submissions: MainDBIT[];
  isLoading: boolean;
  onSubmissionClick: (id: number) => void;
}

function MySubmissionsPanel({ submissions, isLoading, onSubmissionClick }: MySubmissionsPanelProps) {
  if (isLoading) {
    return (
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div>
                <Skeleton className="h-5 w-40 mb-1" />
                <Skeleton className="h-4 w-60" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i: number) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary">
                <ClipboardList className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">My Submissions</CardTitle>
                <CardDescription>
                  {submissions.length} request{submissions.length !== 1 ? 's' : ''} in IT Support
                </CardDescription>
              </div>
            </div>
            <Link to="/my-submissions">
              <Button variant="outline" size="sm">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <Empty className="py-8">
              <EmptyHeader>
                <EmptyTitle>No submissions yet</EmptyTitle>
                <EmptyDescription>Submit your first IT support request above</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-3">
                {submissions.map((submission: MainDBIT) => (
                  <SubmissionCard
                    key={submission.id}
                    submission={submission}
                    onClick={() => onSubmissionClick(submission.id)}
                  />
                ))}
              </div>
            </AnimatePresence>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

function ITSupportServicesContent() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const { data: allSubmissions = [], isLoading } = useMainDBITList({
    orderBy: ['submitteddate desc'],
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Get user's email
  const userEmail = user?.userPrincipalName?.toLowerCase() || '';

  // Filter submissions for M2 module and current user
  const mySubmissions = useMemo(() => {
    return allSubmissions.filter((s: MainDBIT) => {
      const code = s.formcode?.toUpperCase();
      const isM2Form = code && M2_FORM_CODES.map((c: string) => c.toUpperCase()).includes(code);
      const isMySubmission = s.requestoremail?.toLowerCase() === userEmail;
      return isM2Form && isMySubmission;
    });
  }, [allSubmissions, userEmail]);

  // Get unique form types for filter
  const formTypes = useMemo(() => {
    return [...new Set(mySubmissions.map((s: MainDBIT) => s.formcode).filter(Boolean))];
  }, [mySubmissions]);

  // Apply filters
  const filteredSubmissions = useMemo(() => {
    return mySubmissions.filter((s: MainDBIT) => {
      // Search filter
      const matchesSearch =
        searchTerm === '' ||
        s.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.formcode?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status/Stage filter
      const stage = getSubmissionStage(s);
      const matchesStatus = statusFilter === 'all' || stage === statusFilter;

      // Type filter
      const matchesType = typeFilter === 'all' || s.formcode === typeFilter;

      // Date filter
      let matchesDate = true;
      if (dateRange?.from && s.submitteddate) {
        try {
          const submitDate = parseISO(s.submitteddate);
          const start = dateRange.from;
          const end = dateRange.to || dateRange.from;
          matchesDate = isWithinInterval(submitDate, { start, end });
        } catch {
          matchesDate = true;
        }
      }

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [mySubmissions, searchTerm, statusFilter, typeFilter, dateRange]);

  // Check if any filters are active
  const hasFilters =
    searchTerm !== '' ||
    statusFilter !== 'all' ||
    typeFilter !== 'all' ||
    dateRange !== undefined;

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setDateRange(undefined);
  };

  // Navigate to submission detail
  const handleSubmissionClick = (id: number) => {
    navigate(`/it/support-services/submission/${id}`);
  };

  return (
    <motion.div
      className="space-y-6 p-4 md:p-6 pb-24 md:pb-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/it')} className="-ml-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="p-3 rounded-xl bg-secondary">
            <Headset className="h-8 w-8 text-secondary-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">M2</Badge>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">IT Support Services</h1>
            </div>
            <p className="text-sm text-muted-foreground">Submit support tickets, program requests, and IT operational logs</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/it/forms/itssr/new">
              <Plus className="h-4 w-4 mr-2" />
              New Support Request
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Forms Grid */}
      <FormsGrid forms={M2_FORMS} />

      {/* AI Filter Bar */}
      <AIFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onClearFilters={handleClearFilters}
        hasFilters={hasFilters}
        formTypes={formTypes as string[]}
      />

      {/* My Submissions */}
      <MySubmissionsPanel
        submissions={filteredSubmissions}
        isLoading={isLoading}
        onSubmissionClick={handleSubmissionClick}
      />

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t md:hidden z-50">
        <Button className="w-full min-h-[48px]" asChild>
          <Link to="/it/forms/itssr/new">
            <Plus className="h-4 w-4 mr-2" />
            New Support Request
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}

export default function ITSupportServicesPage() {
  return (
    <DataReadyGuard loadingMessage="Loading IT Support Services...">
      <ITSupportServicesContent />
    </DataReadyGuard>
  );
}
