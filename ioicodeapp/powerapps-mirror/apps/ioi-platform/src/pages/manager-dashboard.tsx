import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Search,
  AlertTriangle,
  RotateCcw,
  Users,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Building2,
  FileText,
  TrendingUp,
  Calendar,
  MoreVertical,
  Send,
  AlertCircle,
  RefreshCw,
  Bell,
  History,
  Briefcase,
  UserCheck,
  ClipboardCheck,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useMainDBITList, useUpdateMainDBIT } from '@/generated/hooks/use-main-dbit';
import { useCurrentRole } from '@/hooks/use-current-role';
import { useUser } from '@/hooks/use-user';
import {
  MainDBITCurrentstatusKeyToLabel,
  MainDBITSiteKeyToLabel,
  type MainDBITCurrentstatusKey,
  type MainDBIT,
} from '@/generated/models/main-dbit-model';

// Form code to friendly name mapping
const formCodeLabels: Record<string, string> = {
  // M1 - User & Access Management
  EAF: 'External Access Form',
  NIR: 'Notes ID Request',
  RS: 'Reset Password / Unlock ID',
  SFAR: 'Share Folder Access',
  UR: 'User ID Requisition',
  // M2 - IT Support
  IAL1: 'Server Reboot Log',
  IAL2: 'Data Center Access Log',
  IAL3: 'IT Event',
  IAL4: 'Server Records',
  IAL5: 'Data Restoration Request',
  ITDR: 'IT Daily Report',
  ITDR2: 'Outstanding Tasks Register',
  ITSSR: 'IT Support Request',
  PRF: 'Program Request Form',
  // M3 - Hardware
  HI: 'Hardware Inventory',
  '1_HWInv_NewInv': 'New Hardware Inventory',
  ITSC: 'IT Server Checklist',
  HI_JHR: 'PanCen Hardware Inventory',
  // M4 - SAP
  SAPAMR: 'SAP Authorization',
  SAPCA: 'SAP Configuration Access',
  SAPCR: 'SAP Change Request',
  SAPSLCF: 'SAP Storage Location',
  SAPSOF: 'SAP UAT Sign-Off',
  SAPSOF2: 'SAP UAT Sign-Off 2',
  SAPTR: 'SAP Transport Request',
  SLCF: 'Storage Location (JHR)',
  // M5 - Documentation
  IOIP: 'IOI Policy',
  ITI: 'IT Instruction',
  ITP: 'IT Procedure',
  ITP2: 'IT Policy Document',
  // M6 - Disaster Recovery
  SAPDRP: 'SAP Disaster Recovery Plan',
};

// Status color mapping for MainDBIT
function getMainDBITStatusStyle(status: string): string {
  switch (status) {
    case 'CurrentstatusKey0': return 'bg-[#E0E0E0] text-[#424242]'; // Draft
    case 'CurrentstatusKey1': return 'bg-[#EAF0FB] text-[#1752A8]'; // Submitted
    case 'CurrentstatusKey2': return 'bg-[#FFF8E1] text-[#5A4A00]'; // Under Review
    case 'CurrentstatusKey3': return 'bg-[#E8F5E9] text-[#166534]'; // Approved
    case 'CurrentstatusKey4': return 'bg-[#FDEDEA] text-[#9B2F23]'; // Rejected
    case 'CurrentstatusKey5': return 'bg-[#FFF3E0] text-[#7B3E00]'; // Revision Requested
    case 'CurrentstatusKey6': return 'bg-[#F5F5F5] text-[#5C5C5C]'; // Cancelled
    case 'CurrentstatusKey7': return 'bg-[#E8F5E9] text-[#166534]'; // Completed
    default: return 'bg-[#E0E0E0] text-[#424242]';
  }
}

// Priority badge styles
function getPriorityStyle(priority: string): string {
  switch (priority?.toLowerCase()) {
    case 'critical': return 'bg-[#9B2F23] text-white';
    case 'high': return 'bg-[#7B3E00] text-white';
    case 'normal':
    case 'medium': return 'bg-[#7A4F00] text-white';
    case 'low': return 'bg-[#424242] text-white';
    default: return 'bg-[#E0E0E0] text-[#424242]';
  }
}

// Unified submission type
interface UnifiedSubmission {
  id: string;
  title: string;
  formCode: string;
  formName: string;
  status: string;
  statusKey: string;
  statusStyle: string;
  submittedBy: string;
  submittedDate: string;
  department: string;
  site: string;
  currentStage: string;
  currentAction: string;
  priority?: string;
  justification?: string;
  comments?: string;
  originalData: MainDBIT;
}

export default function ManagerDashboardPage() {
  const { data: user } = useUser();
  const { data: roleData } = useCurrentRole();
  const { data: mainDBIT = [], isLoading } = useMainDBITList();
  const updateMainDBIT = useUpdateMainDBIT();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [formCodeFilter, setFormCodeFilter] = useState<string>('all');
  const [siteFilter, setSiteFilter] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<UnifiedSubmission | null>(null);
  const [approvalComments, setApprovalComments] = useState('');
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('pending');

  // Convert MainDBIT records to unified submissions
  const unifiedSubmissions = useMemo((): UnifiedSubmission[] => {
    return mainDBIT.map((record: MainDBIT): UnifiedSubmission => {
      const siteLabel = record.siteKey ? MainDBITSiteKeyToLabel[record.siteKey] : 'All Sites';
      return {
        id: `maindb-${record.id}`,
        title: record.title,
        formCode: record.formcode,
        formName: formCodeLabels[record.formcode] || record.formcode,
        status: MainDBITCurrentstatusKeyToLabel[record.currentStatus],
        statusKey: record.currentStatus,
        statusStyle: getMainDBITStatusStyle(record.currentStatus),
        submittedBy: record.requestoremail?.split('@')[0] || 'Unknown',
        submittedDate: record.submitteddate || '',
        department: 'IT',
        site: siteLabel,
        currentStage: `Stage ${record.workflowstage || 1}`,
        currentAction: record.islocked ? 'Locked' : 'Pending Review',
        comments: record.remarks,
        originalData: record,
      };
    }).sort((a: UnifiedSubmission, b: UnifiedSubmission) => {
      const dateA = new Date(a.submittedDate || 0).getTime();
      const dateB = new Date(b.submittedDate || 0).getTime();
      return dateB - dateA;
    });
  }, [mainDBIT]);

  // Get unique form codes for filter
  const uniqueFormCodes = useMemo(() => {
    const codes = new Set<string>();
    unifiedSubmissions.forEach((s: UnifiedSubmission) => codes.add(s.formCode));
    return Array.from(codes).sort();
  }, [unifiedSubmissions]);

  // Filter submissions
  const filteredSubmissions = useMemo(() => {
    const query = searchTerm.toLowerCase();

    return unifiedSubmissions.filter((s: UnifiedSubmission) => {
      const matchesSearch = 
        String(s.title || '').toLowerCase().includes(query) ||
        String(s.formCode || '').toLowerCase().includes(query) ||
        String(s.submittedBy || '').toLowerCase().includes(query);
      
      const matchesFormCode = formCodeFilter === 'all' || s.formCode === formCodeFilter;
      const matchesSite = siteFilter === 'all' || s.site === siteFilter;
      
      // Status filter
      if (statusFilter === 'pending') {
        const isPending = 
          s.statusKey === 'CurrentstatusKey1' || s.statusKey === 'CurrentstatusKey2';
        return matchesSearch && matchesFormCode && matchesSite && isPending;
      }
      if (statusFilter === 'approved') {
        const isApproved = 
          s.statusKey === 'CurrentstatusKey3' || s.statusKey === 'CurrentstatusKey7';
        return matchesSearch && matchesFormCode && matchesSite && isApproved;
      }
      if (statusFilter === 'rejected') {
        const isRejected = s.statusKey === 'CurrentstatusKey4';
        return matchesSearch && matchesFormCode && matchesSite && isRejected;
      }
      if (statusFilter === 'returned') {
        const isReturned = s.statusKey === 'CurrentstatusKey5';
        return matchesSearch && matchesFormCode && matchesSite && isReturned;
      }
      return matchesSearch && matchesFormCode && matchesSite;
    });
  }, [unifiedSubmissions, searchTerm, statusFilter, formCodeFilter, siteFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const pending = unifiedSubmissions.filter((s: UnifiedSubmission) => 
      s.statusKey === 'CurrentstatusKey1' || s.statusKey === 'CurrentstatusKey2'
    ).length;
    const approved = unifiedSubmissions.filter((s: UnifiedSubmission) => 
      s.statusKey === 'CurrentstatusKey3' || s.statusKey === 'CurrentstatusKey7'
    ).length;
    const rejected = unifiedSubmissions.filter((s: UnifiedSubmission) => 
      s.statusKey === 'CurrentstatusKey4'
    ).length;
    const returned = unifiedSubmissions.filter((s: UnifiedSubmission) => 
      s.statusKey === 'CurrentstatusKey5'
    ).length;
    const total = unifiedSubmissions.length;
    return { pending, approved, rejected, returned, total };
  }, [unifiedSubmissions]);

  // Handle approval action
  const handleApprovalAction = async (action: 'approve' | 'reject' | 'return') => {
    if (!selectedSubmission) return;

    try {
      const originalRecord = selectedSubmission.originalData;
      let newStatusKey: MainDBITCurrentstatusKey;
      
      switch (action) {
        case 'approve':
          newStatusKey = 'CurrentstatusKey3'; // Approved
          break;
        case 'reject':
          newStatusKey = 'CurrentstatusKey4'; // Rejected
          break;
        case 'return':
          newStatusKey = 'CurrentstatusKey5'; // Revision Requested
          break;
      }

      await updateMainDBIT.mutateAsync({
        id: String(originalRecord.id),
        changedFields: {
          currentStatus: newStatusKey,
          remarks: approvalComments 
            ? `${originalRecord.remarks || ''}\n[${new Date().toISOString()}] ${user?.fullName}: ${approvalComments}`
            : originalRecord.remarks,
        },
      });

      const actionLabels = { approve: 'approved', reject: 'rejected', return: 'returned' };
      toast.success(`Submission ${actionLabels[action]} successfully`);
      setSelectedSubmission(null);
      setApprovalComments('');
    } catch (error) {
      toast.error('Failed to process approval action');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* IOI Green Header */}
      <div className="bg-[#1B5E20] text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-white/10">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Manager Approval Dashboard</h1>
              <p className="text-sm text-white/80">IT Department Forms & Requests</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.fullName || 'Manager'}</p>
                <p className="text-xs text-white/70">{roleData?.departmentName || 'IT Department'}</p>
              </div>
              <Avatar className="h-9 w-9 border-2 border-white/20">
                <AvatarFallback className="bg-white/10 text-white">
                  {user?.fullName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'MG'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <motion.div
          className="grid gap-4 md:grid-cols-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] as const }}
        >
          <Card className="bg-white border-t-4 border-t-[#5A4A00] elevation-1">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#FFF8E1]">
                  <Clock className="h-5 w-5 text-[#5A4A00]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1C1C1C]">{stats.pending}</p>
                  <p className="text-xs text-[#5C5C5C]">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-t-4 border-t-[#166534] elevation-1">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#E8F5E9]">
                  <CheckCircle className="h-5 w-5 text-[#166534]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1C1C1C]">{stats.approved}</p>
                  <p className="text-xs text-[#5C5C5C]">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-t-4 border-t-[#9B2F23] elevation-1">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#FDEDEA]">
                  <XCircle className="h-5 w-5 text-[#9B2F23]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1C1C1C]">{stats.rejected}</p>
                  <p className="text-xs text-[#5C5C5C]">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-t-4 border-t-[#7B3E00] elevation-1">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#FFF3E0]">
                  <RotateCcw className="h-5 w-5 text-[#7B3E00]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1C1C1C]">{stats.returned}</p>
                  <p className="text-xs text-[#5C5C5C]">Returned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-t-4 border-t-[#1752A8] elevation-1">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#EAF0FB]">
                  <FileText className="h-5 w-5 text-[#1752A8]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1C1C1C]">{stats.total}</p>
                  <p className="text-xs text-[#5C5C5C]">Total Submissions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <Card className="bg-white">
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C5C5C]" />
                <Input
                  placeholder="Search by title, form code, or requestor..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-10 border-[#E0E0E0]"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] border-[#E0E0E0]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>

              <Select value={formCodeFilter} onValueChange={setFormCodeFilter}>
                <SelectTrigger className="w-[180px] border-[#E0E0E0]">
                  <SelectValue placeholder="Form Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Forms</SelectItem>
                  {uniqueFormCodes.filter((code: string) => code).map((code: string) => (
                    <SelectItem key={code} value={code}>
                      {formCodeLabels[code] || code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={siteFilter} onValueChange={setSiteFilter}>
                <SelectTrigger className="w-[140px] border-[#E0E0E0]">
                  <SelectValue placeholder="Site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sites</SelectItem>
                  <SelectItem value="Johor">Johor</SelectItem>
                  <SelectItem value="Prai">Prai</SelectItem>
                  <SelectItem value="Penang">Penang</SelectItem>
                  <SelectItem value="KL">KL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Submissions List */}
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-[#1C1C1C] flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-[#1B5E20]" />
                Submissions ({filteredSubmissions.length})
              </CardTitle>
              <Badge variant="outline" className="text-[#5C5C5C]">
                {statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#1B5E20] border-t-transparent" />
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-[#9E9E9E] mx-auto mb-3" />
                <p className="text-[#5C5C5C]">No submissions found</p>
                <p className="text-sm text-[#9E9E9E]">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filteredSubmissions.map((submission: UnifiedSubmission, index: number) => (
                    <motion.div
                      key={submission.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                      <div
                        className={`border border-[#E0E0E0] rounded-lg transition-all hover:border-[#1B5E20]/30 hover:shadow-sm ${
                          expandedSubmission === submission.id ? 'ring-2 ring-[#1B5E20]/20' : ''
                        }`}
                      >
                        <div
                          className="p-4 cursor-pointer"
                          onClick={() => setExpandedSubmission(
                            expandedSubmission === submission.id ? null : submission.id
                          )}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge className={`${submission.statusStyle} text-xs`}>
                                  {submission.status}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {submission.formCode}
                                </Badge>
                                <span className="text-xs text-[#9E9E9E]">
                                  {submission.site}
                                </span>
                              </div>
                              <h4 className="font-medium text-[#1C1C1C] truncate">
                                {submission.title}
                              </h4>
                              <p className="text-sm text-[#5C5C5C] mt-1">
                                {submission.formName}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-[#9E9E9E]">
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {submission.submittedBy}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {submission.submittedDate ? new Date(submission.submittedDate).toLocaleDateString() : 'N/A'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  setSelectedSubmission(submission);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                              {expandedSubmission === submission.id ? (
                                <ChevronUp className="h-4 w-4 text-[#9E9E9E]" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-[#9E9E9E]" />
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <AnimatePresence>
                          {expandedSubmission === submission.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <Separator />
                              <div className="p-4 bg-[#FAFAFA]">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <p className="text-[#9E9E9E] text-xs">Stage</p>
                                    <p className="font-medium text-[#1C1C1C]">{submission.currentStage}</p>
                                  </div>
                                  <div>
                                    <p className="text-[#9E9E9E] text-xs">Action</p>
                                    <p className="font-medium text-[#1C1C1C]">{submission.currentAction}</p>
                                  </div>
                                  <div>
                                    <p className="text-[#9E9E9E] text-xs">Department</p>
                                    <p className="font-medium text-[#1C1C1C]">{submission.department}</p>
                                  </div>
                                  <div>
                                    <p className="text-[#9E9E9E] text-xs">Site</p>
                                    <p className="font-medium text-[#1C1C1C]">{submission.site}</p>
                                  </div>
                                </div>
                                {submission.comments && (
                                  <div className="mt-4">
                                    <p className="text-[#9E9E9E] text-xs mb-1">Comments</p>
                                    <p className="text-sm text-[#1C1C1C] bg-white p-3 rounded border border-[#E0E0E0]">
                                      {submission.comments}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Approval Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-[#1B5E20]" />
              Review Submission
            </DialogTitle>
            <DialogDescription>
              Review and take action on this submission
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="bg-[#FAFAFA] p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className={selectedSubmission.statusStyle}>
                    {selectedSubmission.status}
                  </Badge>
                  <Badge variant="outline">{selectedSubmission.formCode}</Badge>
                </div>
                <h3 className="font-semibold text-[#1C1C1C] mb-2">
                  {selectedSubmission.title}
                </h3>
                <p className="text-sm text-[#5C5C5C]">
                  {selectedSubmission.formName}
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <p className="text-[#9E9E9E] text-xs">Submitted By</p>
                    <p className="font-medium">{selectedSubmission.submittedBy}</p>
                  </div>
                  <div>
                    <p className="text-[#9E9E9E] text-xs">Submitted Date</p>
                    <p className="font-medium">
                      {selectedSubmission.submittedDate 
                        ? new Date(selectedSubmission.submittedDate).toLocaleDateString() 
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#9E9E9E] text-xs">Site</p>
                    <p className="font-medium">{selectedSubmission.site}</p>
                  </div>
                  <div>
                    <p className="text-[#9E9E9E] text-xs">Stage</p>
                    <p className="font-medium">{selectedSubmission.currentStage}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[#1C1C1C] block mb-2">
                  Comments (Optional)
                </label>
                <Textarea
                  placeholder="Add comments for the requestor..."
                  value={approvalComments}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setApprovalComments(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setSelectedSubmission(null)}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              className="text-[#7B3E00] border-[#7B3E00] hover:bg-[#FFF3E0]"
              onClick={() => handleApprovalAction('return')}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Return
            </Button>
            <Button
              variant="outline"
              className="text-[#9B2F23] border-[#9B2F23] hover:bg-[#FDEDEA]"
              onClick={() => handleApprovalAction('reject')}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
            <Button
              className="bg-[#1B5E20] hover:bg-[#166534] text-white"
              onClick={() => handleApprovalAction('approve')}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
