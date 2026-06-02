import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Calendar,
  FileText,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Mail,
  Building2,
  Briefcase,
  ChevronRight,
  Search,
  Filter,
  Plus,
  Download,
  MessageSquare,
  Shield,
  Laptop,
  CreditCard,
  Key,
  FileCheck,
  Users,
  Send,
} from 'lucide-react';
import { IGLayout } from '@/components/layout/ig-layout';
import { IGPageHeader } from '@/components/layout/ig-page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

// Types (preserving existing data schema)
interface ExitRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  department: string;
  position: string;
  site: 'PRAI' | 'JHR';
  resignationDate: string;
  lastWorkingDay: string;
  exitReason: 'voluntary' | 'termination' | 'retirement' | 'contract-end';
  status: 'pending' | 'in-progress' | 'completed' | 'on-hold';
  clearanceProgress: number;
  manager: string;
  hrPic: string;
  avatar?: string;
}

interface ClearanceItem {
  id: string;
  department: string;
  icon: React.ElementType;
  status: 'pending' | 'approved' | 'rejected' | 'in-review';
  approver: string;
  approverEmail: string;
  notes?: string;
  dueDate: string;
  completedDate?: string;
}

interface ExitInterview {
  conducted: boolean;
  date?: string;
  interviewer?: string;
  feedback?: string;
  rating?: number;
  wouldRecommend?: boolean;
}

// Sample data
const exitRecords: ExitRecord[] = [
  {
    id: 'EXIT001',
    employeeId: 'IOI-345',
    employeeName: 'Arun Prakash',
    employeeEmail: 'arun.p@ioiacidchem.com',
    department: 'Technology',
    position: 'IT Manager',
    site: 'PRAI',
    resignationDate: '2026-04-15',
    lastWorkingDay: '2026-05-15',
    exitReason: 'voluntary',
    status: 'in-progress',
    clearanceProgress: 65,
    manager: 'Raj Kumar',
    hrPic: 'Siti Aminah',
  },
  {
    id: 'EXIT002',
    employeeId: 'IOI-412',
    employeeName: 'Nurul Huda',
    employeeEmail: 'nurul.h@ioiacidchem.com',
    department: 'Human Resources',
    position: 'HR Executive',
    site: 'PRAI',
    resignationDate: '2026-04-20',
    lastWorkingDay: '2026-05-20',
    exitReason: 'voluntary',
    status: 'pending',
    clearanceProgress: 15,
    manager: 'Siti Aminah',
    hrPic: 'Mohd Faizal',
  },
  {
    id: 'EXIT003',
    employeeId: 'IOI-089',
    employeeName: 'Lim Chee Wei',
    employeeEmail: 'lim.cw@ioiacidchem.com',
    department: 'Operations',
    position: 'Production Supervisor',
    site: 'JHR',
    resignationDate: '2026-03-28',
    lastWorkingDay: '2026-04-28',
    exitReason: 'retirement',
    status: 'completed',
    clearanceProgress: 100,
    manager: 'Tan Wei Ming',
    hrPic: 'Mohd Faizal',
  },
];

const clearanceItems: ClearanceItem[] = [
  {
    id: 'CLR001',
    department: 'IT Department',
    icon: Laptop,
    status: 'approved',
    approver: 'Raj Kumar',
    approverEmail: 'raj.k@ioiacidchem.com',
    notes: 'All IT assets returned. Laptop wiped and reformatted.',
    dueDate: '2026-05-10',
    completedDate: '2026-05-08',
  },
  {
    id: 'CLR002',
    department: 'Security',
    icon: Shield,
    status: 'approved',
    approver: 'Ahmad Zaki',
    approverEmail: 'ahmad.z@ioiacidchem.com',
    notes: 'Access card collected. Building access revoked.',
    dueDate: '2026-05-10',
    completedDate: '2026-05-09',
  },
  {
    id: 'CLR003',
    department: 'Finance',
    icon: CreditCard,
    status: 'in-review',
    approver: 'Wong Chee Keong',
    approverEmail: 'wong.ck@ioiacidchem.com',
    notes: 'Pending final expense report review.',
    dueDate: '2026-05-12',
  },
  {
    id: 'CLR004',
    department: 'Administration',
    icon: Key,
    status: 'pending',
    approver: 'Siti Mariam',
    approverEmail: 'siti.m@ioiacidchem.com',
    dueDate: '2026-05-13',
  },
  {
    id: 'CLR005',
    department: 'Legal & Compliance',
    icon: FileCheck,
    status: 'pending',
    approver: 'Dr. Lee Wei',
    approverEmail: 'lee.w@ioiacidchem.com',
    dueDate: '2026-05-14',
  },
  {
    id: 'CLR006',
    department: 'HR Final Sign-off',
    icon: Users,
    status: 'pending',
    approver: 'Siti Aminah',
    approverEmail: 'siti.a@ioiacidchem.com',
    dueDate: '2026-05-15',
  },
];

const sampleInterview: ExitInterview = {
  conducted: true,
  date: '2026-05-01',
  interviewer: 'Siti Aminah',
  feedback: 'Positive overall experience. Leaving for better career advancement opportunities. Recommends improving internal mobility programs.',
  rating: 4,
  wouldRecommend: true,
};

// Status styling
const statusStyles = {
  pending: { bg: 'bg-muted', text: 'text-foreground', icon: Circle },
  'in-progress': { bg: 'bg-accent/50', text: 'text-accent-foreground', icon: Clock },
  completed: { bg: 'bg-primary/5', text: 'text-primary', icon: CheckCircle2 },
  'on-hold': { bg: 'bg-destructive/5', text: 'text-destructive', icon: AlertCircle },
};

const clearanceStatusStyles = {
  pending: { bg: 'bg-muted', text: 'text-muted-foreground', icon: Circle, label: 'Pending' },
  'in-review': { bg: 'bg-accent/50', text: 'text-accent-foreground', icon: Clock, label: 'In Review' },
  approved: { bg: 'bg-primary/5', text: 'text-primary', icon: CheckCircle2, label: 'Approved' },
  rejected: { bg: 'bg-destructive/5', text: 'text-destructive', icon: AlertCircle, label: 'Rejected' },
};

const exitReasonStyles = {
  voluntary: { bg: 'bg-secondary/50', text: 'text-secondary-foreground', label: 'Voluntary' },
  termination: { bg: 'bg-destructive/5', text: 'text-destructive', label: 'Termination' },
  retirement: { bg: 'bg-secondary/50', text: 'text-secondary-foreground', label: 'Retirement' },
  'contract-end': { bg: 'bg-accent/50', text: 'text-accent-foreground', label: 'Contract End' },
};

// Employee Card Component
interface ExitRecordCardProps {
  record: ExitRecord;
  isSelected: boolean;
  onClick: () => void;
}

function ExitRecordCard({ record, isSelected, onClick }: ExitRecordCardProps) {
  const status = statusStyles[record.status];
  const reason = exitReasonStyles[record.exitReason];
  const StatusIcon = status.icon;

  const daysRemaining = Math.ceil(
    (new Date(record.lastWorkingDay).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' as const }}
      onClick={onClick}
      className={cn(
        'p-4 bg-white border border-[#cbd5e1] rounded cursor-pointer ig-interactive',
        isSelected && 'ring-2 ring-[#003366] border-[#003366]'
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 border border-border">
          <AvatarImage src={record.avatar} />
          <AvatarFallback className="bg-[#003366]/10 text-[#003366] text-sm font-semibold">
            {record.employeeName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="ig-heading-md text-foreground truncate">{record.employeeName}</h4>
            <Badge variant="outline" className={cn('ig-label-caps-sm px-1.5 py-0 h-4', reason.bg, reason.text, 'border-0')}>
              {reason.label}
            </Badge>
          </div>
          <p className="ig-data-text-sm text-muted-foreground truncate">{record.position} • {record.department}</p>

          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1">
              <StatusIcon className={cn('h-3.5 w-3.5', status.text)} />
              <span className={cn('ig-label-caps-sm', status.text)}>
                {record.status.replace('-', ' ')}
              </span>
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="ig-data-text-sm text-muted-foreground">
              {daysRemaining > 0 ? `${daysRemaining} days left` : 'Completed'}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="ig-label-caps-sm text-muted-foreground">Clearance Progress</span>
              <span className="ig-data-text-sm font-semibold text-foreground">{record.clearanceProgress}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-[#006a6a] rounded-full transition-all duration-300"
                style={{ width: `${record.clearanceProgress}%` }}
              />
            </div>
          </div>
        </div>

        <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
      </div>
    </motion.div>
  );
}

// Clearance Item Component
function ClearanceItemRow({ item }: { item: ClearanceItem }) {
  const status = clearanceStatusStyles[item.status];
  const StatusIcon = status.icon;
  const DeptIcon = item.icon;

  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-[#cbd5e1] rounded ig-interactive">
      <div className="flex items-center justify-center w-9 h-9 bg-muted/50 rounded border border-border">
        <DeptIcon className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="ig-heading-sm text-foreground">{item.department}</span>
          <span className={cn('ig-pill-sm', status.bg, status.text)}>
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </span>
        </div>
        <div className="ig-data-text-sm text-muted-foreground mt-0.5">
          <span className="font-medium">{item.approver}</span>
          {item.notes && <span className="mx-1">•</span>}
          {item.notes && <span className="truncate">{item.notes}</span>}
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <div className="ig-label-caps-sm text-muted-foreground">
          {item.completedDate ? 'Completed' : 'Due'}
        </div>
        <div className="ig-data-text-sm text-muted-foreground">
          {new Date(item.completedDate || item.dueDate).toLocaleDateString('en-MY', { month: 'short', day: 'numeric' })}
        </div>
      </div>

      {item.status === 'pending' && (
        <Button size="icon-sm" variant="ghost" className="flex-shrink-0">
          <Send className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}

// Main Page Component
export default function ExitTrackingPage() {
  const [selectedRecord, setSelectedRecord] = useState<ExitRecord | null>(exitRecords[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredRecords = useMemo(() => {
    let records = exitRecords;
    if (activeTab !== 'all') {
      records = records.filter((r: ExitRecord) => r.status === activeTab);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      records = records.filter(
        (r: ExitRecord) =>
          r.employeeName.toLowerCase().includes(query) ||
          r.department.toLowerCase().includes(query) ||
          r.employeeId.toLowerCase().includes(query)
      );
    }
    return records;
  }, [activeTab, searchQuery]);

  const statusCounts = useMemo(() => ({
    all: exitRecords.length,
    pending: exitRecords.filter((r: ExitRecord) => r.status === 'pending').length,
    'in-progress': exitRecords.filter((r: ExitRecord) => r.status === 'in-progress').length,
    completed: exitRecords.filter((r: ExitRecord) => r.status === 'completed').length,
  }), []);

  return (
    <IGLayout>
      <div className="flex flex-col h-[calc(100vh-48px)]">
        {/* Page Header */}
        <IGPageHeader
          title="Exit Tracking"
          subtitle="Employee lifecycle management and clearance routing"
          actions={
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="h-8 ig-data-text">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Export
              </Button>
              <Button size="sm" className="h-8 bg-[#003366] hover:bg-[#002244] ig-data-text">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                New Exit Request
              </Button>
            </div>
          }
        />

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Exit Records List */}
          <div className="w-96 flex-shrink-0 border-r border-[#cbd5e1] bg-muted/50 flex flex-col">
            {/* Search & Filter */}
            <div className="p-4 border-b border-[#cbd5e1] bg-white">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    className="h-8 pl-8 ig-data-text"
                  />
                </div>
                <Button variant="outline" size="icon-sm" className="h-8 w-8">
                  <Filter className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Status Tabs */}
            <div className="px-4 pt-3 pb-2 bg-white border-b border-[#cbd5e1]">
              <div className="flex gap-1">
                {(['all', 'pending', 'in-progress', 'completed'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'px-3 py-1.5 rounded ig-label-caps-sm transition-colors',
                      activeTab === tab
                        ? 'bg-[#003366] text-white'
                        : 'text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {tab === 'all' ? 'All' : tab === 'in-progress' ? 'Active' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    <span className="ml-1.5 opacity-70">{statusCounts[tab]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Records List */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {filteredRecords.map((record: ExitRecord) => (
                  <ExitRecordCard
                    key={record.id}
                    record={record}
                    isSelected={selectedRecord?.id === record.id}
                    onClick={() => setSelectedRecord(record)}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Details (Bento Layout) */}
          {selectedRecord && (
            <div className="flex-1 overflow-auto p-6">
              <div className="grid grid-cols-2 gap-4 max-w-5xl">
                {/* Resignation Details Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' as const }}
                  className="ig-bento-card"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-4 w-4 text-[#003366]" />
                    <h3 className="ig-label-caps text-[#003366]">Resignation Details</h3>
                  </div>

                  <div className="flex items-center gap-4 mb-5">
                    <Avatar className="h-14 w-14 border-2 border-border">
                      <AvatarFallback className="bg-[#003366] text-white text-lg font-bold">
                        {selectedRecord.employeeName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="ig-heading-lg text-foreground">{selectedRecord.employeeName}</h4>
                      <p className="ig-data-text text-muted-foreground">{selectedRecord.position}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="ig-label-caps-sm px-1.5 py-0 h-4 border-border">
                          {selectedRecord.employeeId}
                        </Badge>
                        <Badge variant="outline" className="ig-label-caps-sm px-1.5 py-0 h-4 border-border">
                          {selectedRecord.site}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="ig-label-caps-sm text-muted-foreground block">Department</span>
                        <span className="ig-data-text text-foreground">{selectedRecord.department}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="ig-label-caps-sm text-muted-foreground block">Reporting Manager</span>
                        <span className="ig-data-text text-foreground">{selectedRecord.manager}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="ig-label-caps-sm text-muted-foreground block">HR PIC</span>
                        <span className="ig-data-text text-foreground">{selectedRecord.hrPic}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="ig-label-caps-sm text-muted-foreground block">Email</span>
                        <span className="ig-data-text text-foreground">{selectedRecord.employeeEmail}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#cbd5e1] grid grid-cols-2 gap-4">
                    <div>
                      <span className="ig-label-caps text-muted-foreground block mb-1">Resignation Date</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="ig-data-text font-semibold text-foreground">
                          {new Date(selectedRecord.resignationDate).toLocaleDateString('en-MY', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="ig-label-caps text-muted-foreground block mb-1">Last Working Day</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-[#ba1a1a]" />
                        <span className="ig-data-text font-semibold text-[#ba1a1a]">
                          {new Date(selectedRecord.lastWorkingDay).toLocaleDateString('en-MY', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Exit Interview Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.05, ease: 'easeOut' as const }}
                  className="ig-bento-card"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-[#006a6a]" />
                      <h3 className="ig-label-caps text-[#006a6a]">Exit Interview</h3>
                    </div>
                    {sampleInterview.conducted && (
                      <span className="ig-pill-sm bg-primary/5 text-primary">
                        <CheckCircle2 className="h-3 w-3" />
                        Completed
                      </span>
                    )}
                  </div>

                  {sampleInterview.conducted ? (
                    <>
                      <div className="space-y-3 mb-4">
                        <div>
                          <span className="ig-label-caps-sm text-muted-foreground block">Conducted By</span>
                          <span className="ig-data-text text-foreground">{sampleInterview.interviewer}</span>
                        </div>
                        <div>
                          <span className="ig-label-caps-sm text-muted-foreground block">Date</span>
                          <span className="ig-data-text text-foreground">
                            {sampleInterview.date && new Date(sampleInterview.date).toLocaleDateString('en-MY', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div>
                          <span className="ig-label-caps-sm text-muted-foreground block">Overall Rating</span>
                          <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star: number) => (
                              <div
                                key={star}
                                className={cn(
                                  'w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold',
                                  star <= (sampleInterview.rating || 0)
                                    ? 'bg-[#006a6a] text-white'
                                    : 'bg-muted text-muted-foreground'
                                )}
                              >
                                {star}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="ig-label-caps-sm text-muted-foreground block">Would Recommend IOI?</span>
                          <span className={cn(
                            'ig-pill-sm mt-1',
                            sampleInterview.wouldRecommend ? 'bg-primary/5 text-primary' : 'bg-destructive/5 text-destructive'
                          )}>
                            {sampleInterview.wouldRecommend ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="ig-label-caps-sm text-muted-foreground block mb-2">Feedback Summary</span>
                        <div className="p-3 bg-muted/50 rounded border border-border">
                          <p className="ig-data-text-sm text-muted-foreground leading-relaxed">
                            {sampleInterview.feedback}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <MessageSquare className="h-10 w-10 text-muted-foreground mb-3" />
                      <p className="ig-data-text text-muted-foreground mb-4">Exit interview not yet conducted</p>
                      <Button size="sm" className="bg-[#006a6a] hover:bg-[#005858] ig-data-text">
                        Schedule Interview
                      </Button>
                    </div>
                  )}
                </motion.div>

                {/* Clearance Routing Card - Full Width */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.1, ease: 'easeOut' as const }}
                  className="ig-bento-card col-span-2"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#003366]" />
                      <h3 className="ig-label-caps text-[#003366]">Clearance Routing</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="ig-data-text-sm text-muted-foreground">
                        <span className="font-semibold text-[#006a6a]">
                          {clearanceItems.filter((c: ClearanceItem) => c.status === 'approved').length}
                        </span>
                        <span className="mx-1">/</span>
                        <span>{clearanceItems.length} Approved</span>
                      </div>
                      <Button variant="outline" size="sm" className="h-7 ig-data-text-sm">
                        <Send className="h-3 w-3 mr-1" />
                        Send All Reminders
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {clearanceItems.map((item: ClearanceItem) => (
                      <ClearanceItemRow key={item.id} item={item} />
                    ))}
                  </div>

                  {/* Final Actions */}
                  <div className="mt-5 pt-4 border-t border-[#cbd5e1] flex items-center justify-between">
                    <div className="ig-data-text-sm text-muted-foreground">
                      All clearances must be approved before final sign-off
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 ig-data-text">
                        <Mail className="h-3.5 w-3.5 mr-1.5" />
                        Email Summary
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 bg-[#003366] hover:bg-[#002244] ig-data-text"
                        disabled={clearanceItems.some((c: ClearanceItem) => c.status !== 'approved')}
                      >
                        <FileCheck className="h-3.5 w-3.5 mr-1.5" />
                        Final Sign-off
                      </Button>
                    </div>
                  </div>
                </motion.div>

                {/* Notes/Comments Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.15, ease: 'easeOut' as const }}
                  className="ig-bento-card col-span-2"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <h3 className="ig-label-caps text-muted-foreground">Internal Notes</h3>
                  </div>
                  <Textarea
                    placeholder="Add notes about this exit process..."
                    className="min-h-[80px] ig-data-text resize-none"
                  />
                  <div className="mt-3 flex justify-end">
                    <Button size="sm" variant="outline" className="h-7 ig-data-text-sm">
                      Save Note
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>
    </IGLayout>
  );
}
