/**
 * HR Interview Pipeline Tracking Page
 * Modern Industrial Governance Design - Navy & Teal theme
 * Kanban-style pipeline view with candidate tracking
 * Ready for HR_InterviewPipeline SharePoint list integration
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  Users,
  Clock,
  CheckCircle2,
  Calendar,
  Eye,
  MoreHorizontal,
  TrendingUp,
  Filter,
  Download,
  UserPlus,
  Building2,
  Target,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Star,
  ArrowRight,
  X,
  ChevronRight,
  GripVertical,
  AlertCircle,
  FileText,
  Video,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  UserCheck,
  Send,
  CalendarPlus,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty';
import { format, formatDistanceToNow, addDays } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/use-user';

import {
  HRLayout,
  HRCard,
  hrContainerVariants,
  hrItemVariants,
} from '@/components/hr/hr-layout';

// Pipeline stages
const PIPELINE_STAGES = [
  { id: 'new', label: 'New Applications', color: 'bg-secondary/500', count: 0 },
  { id: 'screening', label: 'Screening', color: 'bg-secondary/500', count: 0 },
  { id: 'interview', label: 'Interview', color: 'bg-accent/500', count: 0 },
  { id: 'assessment', label: 'Assessment', color: 'bg-primary', count: 0 },
  { id: 'offer', label: 'Offer', color: 'bg-primary/50', count: 0 },
  { id: 'hired', label: 'Hired', color: 'bg-primary', count: 0 },
] as const;

type PipelineStage = typeof PIPELINE_STAGES[number]['id'];

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  stage: PipelineStage;
  rating: number;
  appliedDate: Date;
  lastActivity: Date;
  source: string;
  resume: boolean;
  notes: string;
  interviewDate?: Date;
  interviewer?: string;
  status: 'active' | 'on-hold' | 'rejected';
}

// Mock data - will be replaced with SharePoint data
const MOCK_CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'Ahmad Razak',
    email: 'ahmad.razak@email.com',
    phone: '+60 12-345 6789',
    position: 'Senior Chemist',
    department: 'R&D',
    stage: 'interview',
    rating: 4,
    appliedDate: addDays(new Date(), -12),
    lastActivity: addDays(new Date(), -1),
    source: 'LinkedIn',
    resume: true,
    notes: 'Strong background in oleochemistry. 8 years experience.',
    interviewDate: addDays(new Date(), 2),
    interviewer: 'Dr. Tan Wei Ming',
    status: 'active',
  },
  {
    id: '2',
    name: 'Siti Aminah',
    email: 'siti.aminah@email.com',
    phone: '+60 13-456 7890',
    position: 'Senior Chemist',
    department: 'R&D',
    stage: 'screening',
    rating: 3,
    appliedDate: addDays(new Date(), -8),
    lastActivity: addDays(new Date(), -2),
    source: 'JobStreet',
    resume: true,
    notes: 'PhD in Chemistry. Fresh graduate.',
    status: 'active',
  },
  {
    id: '3',
    name: 'Kumar Selvam',
    email: 'kumar.s@email.com',
    phone: '+60 14-567 8901',
    position: 'Plant Operator',
    department: 'Operations',
    stage: 'new',
    rating: 0,
    appliedDate: addDays(new Date(), -2),
    lastActivity: addDays(new Date(), -2),
    source: 'Walk-in',
    resume: true,
    notes: '',
    status: 'active',
  },
  {
    id: '4',
    name: 'Lee Mei Ling',
    email: 'mei.ling@email.com',
    phone: '+60 16-789 0123',
    position: 'QC Analyst',
    department: 'Quality',
    stage: 'assessment',
    rating: 5,
    appliedDate: addDays(new Date(), -18),
    lastActivity: new Date(),
    source: 'Referral',
    resume: true,
    notes: 'Excellent technical assessment. Top candidate.',
    status: 'active',
  },
  {
    id: '5',
    name: 'Mohammad Faiz',
    email: 'faiz.m@email.com',
    phone: '+60 17-890 1234',
    position: 'Safety Officer',
    department: 'HSE',
    stage: 'offer',
    rating: 4,
    appliedDate: addDays(new Date(), -25),
    lastActivity: addDays(new Date(), -1),
    source: 'Indeed',
    resume: true,
    notes: 'Offer extended. Awaiting response.',
    status: 'active',
  },
  {
    id: '6',
    name: 'Rajesh Nair',
    email: 'rajesh.n@email.com',
    phone: '+60 18-901 2345',
    position: 'IT Support',
    department: 'IT',
    stage: 'new',
    rating: 0,
    appliedDate: addDays(new Date(), -1),
    lastActivity: addDays(new Date(), -1),
    source: 'Company Website',
    resume: true,
    notes: '',
    status: 'active',
  },
  {
    id: '7',
    name: 'Nurul Huda',
    email: 'nurul.h@email.com',
    phone: '+60 19-012 3456',
    position: 'Senior Chemist',
    department: 'R&D',
    stage: 'interview',
    rating: 4,
    appliedDate: addDays(new Date(), -14),
    lastActivity: addDays(new Date(), -3),
    source: 'LinkedIn',
    resume: true,
    notes: 'Second interview scheduled.',
    interviewDate: addDays(new Date(), 3),
    interviewer: 'Dr. Tan Wei Ming',
    status: 'active',
  },
  {
    id: '8',
    name: 'Chong Wei Keat',
    email: 'weikeat@email.com',
    phone: '+60 11-123 4567',
    position: 'Plant Operator',
    department: 'Operations',
    stage: 'hired',
    rating: 4,
    appliedDate: addDays(new Date(), -30),
    lastActivity: new Date(),
    source: 'JobStreet',
    resume: true,
    notes: 'Started on May 1, 2026.',
    status: 'active',
  },
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

const SOURCES = [
  { value: 'all', label: 'All Sources' },
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'JobStreet', label: 'JobStreet' },
  { value: 'Indeed', label: 'Indeed' },
  { value: 'Referral', label: 'Referral' },
  { value: 'Company Website', label: 'Company Website' },
  { value: 'Walk-in', label: 'Walk-in' },
];

export default function HRInterviewPipelinePage() {
  const { data: user } = useUser();
  const [candidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c: Candidate) => {
      const matchesSearch = !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.position.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = departmentFilter === 'all' || c.department === departmentFilter;
      const matchesSource = sourceFilter === 'all' || c.source === sourceFilter;
      return matchesSearch && matchesDept && matchesSource && c.status === 'active';
    });
  }, [candidates, searchQuery, departmentFilter, sourceFilter]);

  // Calculate stage counts
  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    PIPELINE_STAGES.forEach((stage) => {
      counts[stage.id] = filteredCandidates.filter((c: Candidate) => c.stage === stage.id).length;
    });
    return counts;
  }, [filteredCandidates]);

  // Stats
  const stats = useMemo(() => {
    const total = candidates.filter((c: Candidate) => c.status === 'active').length;
    const inInterview = candidates.filter((c: Candidate) => c.stage === 'interview' || c.stage === 'assessment').length;
    const offersExtended = candidates.filter((c: Candidate) => c.stage === 'offer').length;
    const hired = candidates.filter((c: Candidate) => c.stage === 'hired').length;
    const avgTimeToHire = 28; // Mock - would calculate from data
    return { total, inInterview, offersExtended, hired, avgTimeToHire };
  }, [candidates]);

  const handleMoveStage = (candidateId: string, newStage: PipelineStage) => {
    // Would update via SharePoint
    toast.success('Candidate moved to ' + PIPELINE_STAGES.find((s) => s.id === newStage)?.label);
  };

  const handleScheduleInterview = () => {
    toast.success('Interview scheduled successfully');
    setShowScheduleModal(false);
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star: number) => (
          <Star
            key={star}
            className={cn(
              'h-3 w-3',
              star <= rating ? 'fill-amber-400 text-accent-foreground' : 'text-muted-foreground/30'
            )}
          />
        ))}
      </div>
    );
  };

  const getCandidatesByStage = (stage: PipelineStage) => {
    return filteredCandidates.filter((c: Candidate) => c.stage === stage);
  };

  return (
    <HRLayout
      title="Interview Pipeline"
      subtitle="Candidate Tracking & Management"
      breadcrumbs={[
        { label: 'HR', href: '/hr' },
        { label: 'Recruitment', href: '/hr/recruitment' },
        { label: 'Interview Pipeline' },
      ]}
      dataSource="HR_InterviewPipeline"
      recordCount={filteredCandidates.length}
      onRefresh={() => toast.info('Data refreshed')}
      pendingCount={stats.inInterview}
      showSearch
      searchPlaceholder="Search candidates, positions..."
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
          <Button
            size="sm"
            className="h-7 text-[10px] font-bold uppercase tracking-wide gap-1 bg-[#003366] hover:bg-[#003366]/90"
          >
            <Plus className="h-3 w-3" />
            Add Candidate
          </Button>
        </>
      }
    >
      {/* Notice Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 p-3 rounded-sm bg-primary/5 border border-primary/20"
      >
        <div className="flex items-center gap-3">
          <AlertCircle className="h-4 w-4 text-primary shrink-0" />
          <div className="flex-1">
            <p className="text-[10px] font-semibold text-foreground">SharePoint Integration Pending</p>
            <p className="text-[9px] text-muted-foreground">
              Connect HR_InterviewPipeline list from SharePoint via the Data panel to enable live data sync.
            </p>
          </div>
          <Button variant="outline" size="sm" className="h-6 text-[9px] shrink-0">
            Connect List
          </Button>
        </div>
      </motion.div>

      <motion.div
        variants={hrContainerVariants}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {/* KPI Metrics Row */}
        <motion.div variants={hrItemVariants} className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <HRCard>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Active Candidates
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">{stats.total}</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1">In pipeline</p>
                </div>
                <div className="h-10 w-10 rounded bg-[#003366]/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-[#003366]" />
                </div>
              </div>
            </CardContent>
          </HRCard>

          <HRCard className="border-l-2 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    In Interviews
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">{stats.inInterview}</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1">Active interviews</p>
                </div>
                <div className="h-10 w-10 rounded bg-accent flex items-center justify-center">
                  <Video className="h-5 w-5 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </HRCard>

          <HRCard className="border-l-2 border-l-emerald-500">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Offers Extended
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">{stats.offersExtended}</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1">Pending acceptance</p>
                </div>
                <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                  <Send className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </HRCard>

          <HRCard className="border-l-2 border-l-green-600">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Hired This Month
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">{stats.hired}</span>
                    <Badge className="text-[8px] px-1.5 py-0 h-4 bg-success/10 text-success border-0">
                      <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                      On Track
                    </Badge>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1">Target: 5</p>
                </div>
                <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </HRCard>

          <HRCard>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Avg. Time to Hire
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">{stats.avgTimeToHire}</span>
                    <span className="text-xs text-muted-foreground">days</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1">Industry avg: 36d</p>
                </div>
                <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </HRCard>
        </motion.div>

        {/* View Toggle & Filters */}
        <motion.div variants={hrItemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Tabs value={viewMode} onValueChange={(v: string) => setViewMode(v as 'kanban' | 'table')} className="w-fit">
            <TabsList className="h-8">
              <TabsTrigger value="kanban" className="text-[10px] h-6 px-3">
                <GripVertical className="h-3 w-3 mr-1" />
                Pipeline View
              </TabsTrigger>
              <TabsTrigger value="table" className="text-[10px] h-6 px-3">
                <FileText className="h-3 w-3 mr-1" />
                Table View
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="h-7 w-36 text-[10px]">
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
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="h-7 w-32 text-[10px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOURCES.map((source) => (
                  <SelectItem key={source.value} value={source.value} className="text-[10px]">
                    {source.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Pipeline Kanban View */}
        {viewMode === 'kanban' && (
          <motion.div variants={hrItemVariants}>
            <ScrollArea className="w-full">
              <div className="flex gap-3 pb-4 min-w-max">
                {PIPELINE_STAGES.map((stage) => (
                  <div
                    key={stage.id}
                    className="w-72 shrink-0 bg-muted/30 rounded-sm border border-border/50"
                  >
                    {/* Stage Header */}
                    <div className="p-3 border-b border-border/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn('h-2 w-2 rounded-full', stage.color)} />
                          <span className="text-[10px] font-bold uppercase tracking-wide">
                            {stage.label}
                          </span>
                        </div>
                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">
                          {stageCounts[stage.id]}
                        </Badge>
                      </div>
                    </div>

                    {/* Candidates */}
                    <ScrollArea className="h-[calc(100vh-480px)] min-h-[300px]">
                      <div className="p-2 space-y-2">
                        <AnimatePresence>
                          {getCandidatesByStage(stage.id).map((candidate: Candidate) => (
                            <motion.div
                              key={candidate.id}
                              layout
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="bg-card rounded-sm border border-border/50 p-3 cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all group"
                              onClick={() => {
                                setSelectedCandidate(candidate);
                                setShowCandidateModal(true);
                              }}
                            >
                              <div className="flex items-start gap-2">
                                <Avatar className="h-8 w-8 shrink-0">
                                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                                    {candidate.name.split(' ').map((n: string) => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] font-semibold truncate">{candidate.name}</p>
                                  <p className="text-[9px] text-muted-foreground truncate">{candidate.position}</p>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                    >
                                      <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuItem className="text-[10px]">
                                      <Eye className="h-3 w-3 mr-2" />
                                      View Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-[10px]"
                                      onClick={(e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        setSelectedCandidate(candidate);
                                        setShowScheduleModal(true);
                                      }}
                                    >
                                      <CalendarPlus className="h-3 w-3 mr-2" />
                                      Schedule Interview
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-[10px]">
                                      <ArrowRight className="h-3 w-3 mr-2" />
                                      Move to Next Stage
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-[10px] text-destructive">
                                      <ThumbsDown className="h-3 w-3 mr-2" />
                                      Reject Candidate
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>

                              <div className="mt-2 space-y-1.5">
                                <div className="flex items-center justify-between text-[9px] text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Building2 className="h-2.5 w-2.5" />
                                    {candidate.department}
                                  </span>
                                  <span>{candidate.source}</span>
                                </div>

                                {candidate.rating > 0 && renderStarRating(candidate.rating)}

                                {candidate.interviewDate && (
                                  <div className="flex items-center gap-1 text-[9px] text-accent-foreground bg-accent/50 rounded px-1.5 py-0.5 w-fit">
                                    <Calendar className="h-2.5 w-2.5" />
                                    {format(candidate.interviewDate, 'MMM d, h:mm a')}
                                  </div>
                                )}

                                <div className="text-[8px] text-muted-foreground pt-1">
                                  Applied {formatDistanceToNow(candidate.appliedDate, { addSuffix: true })}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>

                        {getCandidatesByStage(stage.id).length === 0 && (
                          <div className="py-8 text-center">
                            <p className="text-[10px] text-muted-foreground">No candidates</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </motion.div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <motion.div variants={hrItemVariants}>
            <HRCard>
              <CardContent className="p-0">
                {filteredCandidates.length === 0 ? (
                  <Empty className="py-12">
                    <EmptyHeader>
                      <EmptyTitle className="text-sm">No Candidates Found</EmptyTitle>
                      <EmptyDescription className="text-[10px]">
                        No candidates match your current filters.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3">Candidate</TableHead>
                        <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3">Position</TableHead>
                        <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3">Department</TableHead>
                        <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3">Stage</TableHead>
                        <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3">Rating</TableHead>
                        <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3">Source</TableHead>
                        <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3">Applied</TableHead>
                        <TableHead className="text-[8px] font-bold uppercase tracking-widest h-8 px-3 w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCandidates.map((candidate: Candidate, idx: number) => {
                        const stage = PIPELINE_STAGES.find((s) => s.id === candidate.stage);
                        return (
                          <TableRow
                            key={candidate.id}
                            className={cn(
                              'cursor-pointer hover:bg-muted/50 transition-colors',
                              idx % 2 === 1 && 'bg-muted/20'
                            )}
                            onClick={() => {
                              setSelectedCandidate(candidate);
                              setShowCandidateModal(true);
                            }}
                          >
                            <TableCell className="px-3 py-2">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-7 w-7">
                                  <AvatarFallback className="text-[9px] bg-primary/10 text-primary font-semibold">
                                    {candidate.name.split(' ').map((n: string) => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-[10px] font-medium">{candidate.name}</p>
                                  <p className="text-[9px] text-muted-foreground">{candidate.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-[10px] px-3 py-2">{candidate.position}</TableCell>
                            <TableCell className="text-[10px] text-muted-foreground px-3 py-2">{candidate.department}</TableCell>
                            <TableCell className="px-3 py-2">
                              <Badge
                                variant="outline"
                                className={cn(
                                  'text-[8px] px-1.5 py-0 h-4 border',
                                  stage?.color.replace('bg-', 'border-').replace('-500', '-300'),
                                  stage?.color.replace('bg-', 'text-').replace('-500', '-700')
                                )}
                              >
                                {stage?.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-3 py-2">
                              {candidate.rating > 0 ? renderStarRating(candidate.rating) : (
                                <span className="text-[9px] text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-[10px] text-muted-foreground px-3 py-2">{candidate.source}</TableCell>
                            <TableCell className="text-[10px] text-muted-foreground px-3 py-2">
                              {format(candidate.appliedDate, 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell className="px-3 py-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                  <DropdownMenuItem className="text-[10px]">
                                    <Eye className="h-3 w-3 mr-2" />
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-[10px]">
                                    <CalendarPlus className="h-3 w-3 mr-2" />
                                    Schedule Interview
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-[10px]">
                                    <ArrowRight className="h-3 w-3 mr-2" />
                                    Move to Next Stage
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
        )}
      </motion.div>

      {/* Candidate Detail Modal */}
      <Dialog open={showCandidateModal} onOpenChange={setShowCandidateModal}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          {selectedCandidate && (
            <>
              {/* Header */}
              <div className="h-16 bg-gradient-to-r from-[#003366] to-[#006a6a] relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7 text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => setShowCandidateModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="absolute top-2 left-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[8px] border-white/30 text-white/90',
                      PIPELINE_STAGES.find((s) => s.id === selectedCandidate.stage)?.color.replace('bg-', 'bg-').replace('-500', '-500/50')
                    )}
                  >
                    {PIPELINE_STAGES.find((s) => s.id === selectedCandidate.stage)?.label}
                  </Badge>
                </div>
              </div>

              {/* Avatar */}
              <div className="px-4 -mt-8 relative">
                <Avatar className="h-16 w-16 border-4 border-card shadow-lg">
                  <AvatarFallback className="text-lg bg-primary text-primary-foreground font-bold">
                    {selectedCandidate.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Content */}
              <div className="p-4 pt-2 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">{selectedCandidate.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedCandidate.position}</p>
                  {selectedCandidate.rating > 0 && (
                    <div className="mt-1">{renderStarRating(selectedCandidate.rating)}</div>
                  )}
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-sm bg-muted/50">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1">
                      <Mail className="h-3 w-3" />
                      Email
                    </div>
                    <p className="text-[11px] font-medium truncate">{selectedCandidate.email}</p>
                  </div>
                  <div className="p-3 rounded-sm bg-muted/50">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1">
                      <Phone className="h-3 w-3" />
                      Phone
                    </div>
                    <p className="text-[11px] font-medium">{selectedCandidate.phone}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5" /> Department
                    </span>
                    <span>{selectedCandidate.department}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Target className="h-3.5 w-3.5" /> Source
                    </span>
                    <span>{selectedCandidate.source}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> Applied
                    </span>
                    <span>{format(selectedCandidate.appliedDate, 'MMM d, yyyy')}</span>
                  </div>
                  {selectedCandidate.interviewDate && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Video className="h-3.5 w-3.5" /> Interview
                      </span>
                      <span className="text-accent-foreground">
                        {format(selectedCandidate.interviewDate, 'MMM d, h:mm a')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {selectedCandidate.notes && (
                  <div className="p-3 rounded-sm bg-muted/30 border border-border/50">
                    <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground mb-1">Notes</p>
                    <p className="text-[11px]">{selectedCandidate.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    className="flex-1 bg-[#003366] hover:bg-[#003366]/90"
                    onClick={() => {
                      setShowCandidateModal(false);
                      setShowScheduleModal(true);
                    }}
                  >
                    <CalendarPlus className="h-4 w-4 mr-1.5" />
                    Schedule Interview
                  </Button>
                  <Button variant="outline" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Schedule Interview Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Schedule Interview</DialogTitle>
            <DialogDescription className="text-[10px] text-muted-foreground">
              {selectedCandidate?.name} - {selectedCandidate?.position}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-medium">Interview Type *</Label>
              <Select defaultValue="video">
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video" className="text-xs">Video Call</SelectItem>
                  <SelectItem value="phone" className="text-xs">Phone Screen</SelectItem>
                  <SelectItem value="onsite" className="text-xs">On-site</SelectItem>
                  <SelectItem value="panel" className="text-xs">Panel Interview</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-medium">Date & Time *</Label>
              <Input
                type="datetime-local"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-medium">Interviewer *</Label>
              <Select>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select interviewer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tan" className="text-xs">Dr. Tan Wei Ming (R&D)</SelectItem>
                  <SelectItem value="lee" className="text-xs">Lee Mei Hua (HR)</SelectItem>
                  <SelectItem value="ahmad" className="text-xs">Ahmad Zulkifli (Operations)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-medium">Notes</Label>
              <Textarea
                placeholder="Interview agenda, topics to cover..."
                className="text-xs min-h-[80px] resize-none"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setShowScheduleModal(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-7 text-[10px] bg-[#003366] hover:bg-[#003366]/90"
              onClick={handleScheduleInterview}
            >
              <CalendarPlus className="h-3 w-3 mr-1" />
              Schedule Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HRLayout>
  );
}
