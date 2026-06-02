import { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Eye,
  MoreHorizontal,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import { isTerminalStatus } from '@/lib/it-routing-workflows';
import { isPendingStatus } from '@/config/hr-constants';
import { getStatusLabel, statusConfig, type MainDBITCurrentstatusKey } from '@/lib/status-utils';
import { getITFormDetailPath } from '@/lib/it-form-routes';

// Form code to friendly name mapping
const formCodeLabels: Record<string, string> = {
  EAF: 'External Access Form',
  NIR: 'Notes ID Request',
  RS: 'Reset Password / Unlock ID',
  SFAR: 'Share Folder Access',
  UR: 'User ID Requisition',
  ITSSR: 'IT Support Request',
  ITDR: 'IT Daily Report',
  ITDR2: 'Outstanding Tasks Register',
  HI: 'Hardware Inventory',
  ITSC: 'IT Server Checklist',
  SAPAMR: 'SAP Authorization',
  SAPCR: 'SAP Change Request',
  IOIP: 'IOI Policy',
  SAPDRP: 'SAP Disaster Recovery Plan',
};

function getStatusStyle(status: string): string {
  const cfg = statusConfig[status as MainDBITCurrentstatusKey];
  if (cfg) return `${cfg.bgColor} ${cfg.color}`;
  const s = status.toLowerCase();
  if (s === 'submitted') return 'bg-secondary text-secondary-foreground';
  if (s === 'under_review' || s === 'under review') return 'bg-accent text-accent-foreground';
  if (s === 'approved' || s === 'completed') return 'bg-primary/10 text-primary';
  if (s === 'rejected' || s === 'cancelled') return 'bg-destructive/10 text-destructive';
  if (s === 'inprogress' || s === 'in progress') return 'bg-accent text-accent-foreground';
  if (s === 'draft') return 'bg-muted text-foreground';
  return 'bg-muted text-foreground';
}

export default function FormsPage() {
  const { data: submissions = [], isLoading } = useMainDBITList();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Get unique form codes from submissions
  const uniqueFormCodes = [...new Set(submissions.map((s: MainDBIT) => s.formcode).filter(Boolean))];

  const filteredSubmissions = submissions.filter((s: MainDBIT) => {
    const matchesSearch =
      (s.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (s.formcode?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.currentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: submissions.length,
    pending: submissions.filter((s: MainDBIT) => isPendingStatus(s.currentStatus)).length,
    approved: submissions.filter((s: MainDBIT) => {
      const st = s.currentStatus?.toLowerCase() || '';
      return ['approved', 'completed', 'active', 'verified', 'sent'].includes(st);
    }).length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#1B5E20] text-white">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">IT Form Submissions</h1>
            <p className="text-muted-foreground">View and manage form submissions</p>
          </div>
        </div>
        <Button asChild className="bg-[#1B5E20] hover:bg-[#166534]">
          <Link to="/it/forms/itssr/new">
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Link>
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid gap-4 md:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' as const }}
      >
        <Card>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-accent-foreground">{stats.pending}</p>
            <p className="text-sm text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-primary">{stats.approved}</p>
            <p className="text-sm text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-56">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Submitted">Submitted</SelectItem>
            <SelectItem value="Under_Review">Under Review</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <Empty className="py-16">
          <EmptyHeader>
            <EmptyTitle>No submissions found</EmptyTitle>
            <EmptyDescription>
              {submissions.length === 0
                ? 'Submit your first request to get started.'
                : 'No submissions match your search criteria.'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-3">
          {filteredSubmissions.map((submission: MainDBIT, index: number) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.03,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-[#E8F5E9] flex items-center justify-center">
                        <FileText className="h-5 w-5 text-[#1B5E20]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {submission.formcode}
                          </Badge>
                          <h3 className="font-semibold">{submission.title}</h3>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span>{formCodeLabels[submission.formcode] || submission.formcode}</span>
                          {submission.submitteddate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(submission.submitteddate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusStyle(submission.currentStatus)}>
                        {getStatusLabel(submission.currentStatus) || 'Unknown'}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={getITFormDetailPath(submission.formcode, submission.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
