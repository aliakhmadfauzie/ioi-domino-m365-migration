/**
 * Context-Aware My Submissions View
 * 
 * This component displays submissions filtered by context:
 * - Department level: Shows all submissions within that department (all modules/forms)
 * - Module level: Shows all submissions for forms within that module
 * - Form level: Shows only submissions for that specific form
 * 
 * The scope is determined by the props passed to the component.
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Eye,
  Calendar,
  Building2,
  Edit3,
  Layers,
  FolderOpen,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
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
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { useUser } from '@/hooks/use-user';
import {
  type MainDBIT,
} from '@/generated/models/main-dbit-model';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { EditRequestIndicator } from '@/components/workflow/edit-request-indicator';
import {
  hasActiveEditRequest,
  isSubmissionEditable,
} from '@/hooks/use-edit-request';
import { cn } from '@/lib/utils';
import { getITFormDetailPath } from '@/lib/it-form-routes';

// Scope types for filtering
export type SubmissionScope = 
  | { type: 'department'; departmentCode: string; departmentName: string }
  | { type: 'module'; departmentCode: string; moduleCode: string; moduleName: string; formCodes: string[] }
  | { type: 'form'; departmentCode: string; formCode: string; formName: string };

interface MySubmissionsViewProps {
  scope: SubmissionScope;
  basePath?: string; // Base path for navigation (e.g., '/it' or '/hr')
  showHeader?: boolean;
  compact?: boolean;
  maxItems?: number; // Limit items shown (for embedded views)
  className?: string;
  backPath?: string; // Custom back navigation path
  backLabel?: string; // Custom back navigation label
}

const getStatusClass = (statusKey: string): string => {
  switch (statusKey) {
    case 'CurrentstatusKey0': return 'bg-muted text-muted-foreground';
    case 'CurrentstatusKey1': return 'bg-secondary text-secondary-foreground';
    case 'CurrentstatusKey2': return 'bg-secondary text-secondary-foreground';
    case 'CurrentstatusKey3': return 'bg-primary text-primary-foreground';
    case 'CurrentstatusKey4': return 'bg-destructive text-destructive-foreground';
    case 'CurrentstatusKey5': return 'bg-accent text-accent-foreground';
    case 'CurrentstatusKey6': return 'bg-muted text-muted-foreground';
    case 'CurrentstatusKey7': return 'bg-primary text-primary-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getStatusIcon = (statusKey: string) => {
  switch (statusKey) {
    case 'CurrentstatusKey0':
    case 'CurrentstatusKey1':
    case 'CurrentstatusKey2':
      return <Clock className="h-4 w-4" />;
    case 'CurrentstatusKey3':
    case 'CurrentstatusKey7':
      return <CheckCircle className="h-4 w-4" />;
    case 'CurrentstatusKey4':
    case 'CurrentstatusKey6':
      return <XCircle className="h-4 w-4" />;
    case 'CurrentstatusKey5':
      return <Clock className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getScopeTitle = (scope: SubmissionScope): string => {
  switch (scope.type) {
    case 'department':
      return `${scope.departmentName} Submissions`;
    case 'module':
      return `${scope.moduleName} Submissions`;
    case 'form':
      return `${scope.formName} Submissions`;
  }
};

const getScopeDescription = (scope: SubmissionScope): string => {
  switch (scope.type) {
    case 'department':
      return `All your submissions within ${scope.departmentName} department`;
    case 'module':
      return `Your submissions in the ${scope.moduleName} module`;
    case 'form':
      return `Your submissions for ${scope.formName}`;
  }
};

const getScopeIcon = (scope: SubmissionScope) => {
  switch (scope.type) {
    case 'department':
      return <Building2 className="h-5 w-5" />;
    case 'module':
      return <Layers className="h-5 w-5" />;
    case 'form':
      return <FolderOpen className="h-5 w-5" />;
  }
};

export function MySubmissionsView({
  scope,
  basePath = '',
  showHeader = true,
  compact = false,
  maxItems,
  className,
  backPath,
  backLabel,
}: MySubmissionsViewProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user, isLoading: userLoading } = useUser();
  const { data: allSubmissions = [], isLoading: submissionsLoading } = useMainDBITList();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Determine back navigation based on scope and props
  const getBackNavigation = () => {
    if (backPath && backLabel) {
      return { path: backPath, label: backLabel };
    }
    
    switch (scope.type) {
      case 'form':
        // Form-level: go back to module or department
        return { path: `${basePath}/forms`, label: 'Back to Forms' };
      case 'module':
        // Module-level: go back to module home
        if (scope.moduleCode === 'M1') return { path: `${basePath}/access`, label: 'Back to User & Access' };
        if (scope.moduleCode === 'M2') return { path: `${basePath}/support`, label: 'Back to IT Support' };
        if (scope.moduleCode === 'M3') return { path: `${basePath}/hardware`, label: 'Back to Hardware' };
        if (scope.moduleCode === 'M4') return { path: `${basePath}/sap`, label: 'Back to SAP' };
        return { path: basePath || '/', label: 'Back' };
      case 'department':
        // Department-level: go back to department home
        return { path: basePath || '/', label: `Back to ${scope.departmentCode} Home` };
    }
  };

  const backNav = getBackNavigation();
  const isLoading = userLoading || submissionsLoading;

  // Filter submissions based on scope and user
  const scopedSubmissions = useMemo(() => {
    const userEmail = user?.userPrincipalName?.toLowerCase()?.trim();
    const userNamePart = userEmail?.split('@')[0] || '';

    if (!userEmail) {
      return [];
    }

    // First filter by user
    const userSubmissions = allSubmissions.filter((s: MainDBIT) => {
      const requestorEmail = s.requestoremail?.toLowerCase()?.trim() || '';
      const requestorNamePart = requestorEmail.split('@')[0];
      const exactMatch = requestorEmail === userEmail;
      const usernameMatch = requestorNamePart && userNamePart && requestorNamePart === userNamePart;
      return exactMatch || usernameMatch;
    });

    // Then filter by scope
    switch (scope.type) {
      case 'department':
        // For IT department, all submissions in MainDB_IT are IT submissions
        // In future, filter by department code if submissions have that field
        return userSubmissions;
        
      case 'module':
        // Filter by form codes that belong to this module
        return userSubmissions.filter((s: MainDBIT) => {
          const formCode = s.formcode?.toUpperCase() || '';
          return scope.formCodes.map((fc: string) => fc.toUpperCase()).includes(formCode);
        });
        
      case 'form':
        // Filter by specific form code
        return userSubmissions.filter((s: MainDBIT) => {
          const formCode = s.formcode?.toUpperCase() || '';
          return formCode === scope.formCode.toUpperCase();
        });
    }
  }, [allSubmissions, user, scope]);

  // Apply search and status filters
  const filteredSubmissions = useMemo(() => {
    const query = searchTerm.toLowerCase();

    let filtered = scopedSubmissions.filter((s: MainDBIT) => {
      const matchesSearch = 
        String(s.title || '').toLowerCase().includes(query) ||
        String(s.formcode || '').toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' || s.currentStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Apply max items limit if specified
    if (maxItems && filtered.length > maxItems) {
      filtered = filtered.slice(0, maxItems);
    }

    return filtered;
  }, [scopedSubmissions, searchTerm, statusFilter, maxItems]);

  // Calculate stats
  const stats = useMemo(() => {
    const pending = scopedSubmissions.filter(
      (s: MainDBIT) => s.currentStatus === 'CurrentstatusKey1' || s.currentStatus === 'CurrentstatusKey2'
    ).length;
    const approved = scopedSubmissions.filter(
      (s: MainDBIT) => s.currentStatus === 'CurrentstatusKey3'
    ).length;
    const completed = scopedSubmissions.filter(
      (s: MainDBIT) => s.currentStatus === 'CurrentstatusKey7'
    ).length;
    const rejected = scopedSubmissions.filter(
      (s: MainDBIT) => s.currentStatus === 'CurrentstatusKey4'
    ).length;

    return { pending, approved, completed, rejected, total: scopedSubmissions.length };
  }, [scopedSubmissions]);

  // Get unique form codes for module/department scope filters
  const uniqueFormCodes = useMemo(() => {
    if (scope.type === 'form') return [];
    const codes = new Set<string>();
    scopedSubmissions.forEach((s: MainDBIT) => {
      if (s.formcode) codes.add(s.formcode.toUpperCase());
    });
    return Array.from(codes).sort();
  }, [scopedSubmissions, scope.type]);

  const getDetailPath = (submission: MainDBIT) => {
    return getITFormDetailPath(submission.formcode, submission.id);
  };

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {showHeader && (
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i: number) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i: number) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      {showHeader && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] as const }}
          className="space-y-3"
        >
          {/* Back Navigation */}
          <button
            type="button"
            onClick={() => navigate(backNav.path)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            {backNav.label}
          </button>

          {/* Header Card */}
          <div className="bg-gradient-to-br from-primary via-primary/95 to-blue-800 rounded-xl p-5 elevation-1">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
                {getScopeIcon(scope)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white">
                    {getScopeTitle(scope)}
                  </h1>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    {scope.type === 'department' ? 'All' : scope.type === 'module' ? 'Module' : 'Form'}
                  </Badge>
                </div>
                <p className="text-white/70 text-sm mt-1">
                  {getScopeDescription(scope)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      {!compact && (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.2, 0, 0, 1] as const }}
        >
          <Card className="bg-card border-border">
            <CardContent className="pt-3 pb-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-3 pb-3">
              <p className="text-xs text-primary uppercase tracking-wider">Pending</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{stats.pending}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-3 pb-3">
              <p className="text-xs text-primary uppercase tracking-wider">Approved</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{stats.approved}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-3 pb-3">
              <p className="text-xs text-primary uppercase tracking-wider">Completed</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{stats.completed}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border col-span-2 md:col-span-1">
            <CardContent className="pt-3 pb-3">
              <p className="text-xs text-destructive uppercase tracking-wider">Rejected</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{stats.rejected}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filters */}
      {!compact && (
        <Card className="bg-card border-border">
          <CardContent className="p-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[180px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search submissions..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-muted border-border h-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-muted border-border h-9">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="CurrentstatusKey0">Draft</SelectItem>
                  <SelectItem value="CurrentstatusKey1">Submitted</SelectItem>
                  <SelectItem value="CurrentstatusKey2">Under Review</SelectItem>
                  <SelectItem value="CurrentstatusKey3">Approved</SelectItem>
                  <SelectItem value="CurrentstatusKey4">Rejected</SelectItem>
                  <SelectItem value="CurrentstatusKey5">Revision Requested</SelectItem>
                  <SelectItem value="CurrentstatusKey7">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submissions List */}
      <Card className="bg-card border-border">
        {!compact && (
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Submissions</CardTitle>
              <Badge variant="outline" className="text-xs">
                {filteredSubmissions.length} of {scopedSubmissions.length}
              </Badge>
            </div>
          </CardHeader>
        )}
        <CardContent className={compact ? 'pt-4' : 'pt-0'}>
          <AnimatePresence mode="popLayout">
            {filteredSubmissions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Empty className="py-8">
                  <EmptyHeader>
                    <EmptyTitle>No submissions found</EmptyTitle>
                    <EmptyDescription>
                      {scopedSubmissions.length === 0
                        ? `You haven't made any submissions in this ${scope.type} yet.`
                        : 'No submissions match your current filters.'}
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </motion.div>
            ) : (
              <div className="space-y-2">
                {filteredSubmissions.map((submission: MainDBIT, index: number) => (
                  <motion.div
                    key={submission.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.03, ease: [0.2, 0, 0, 1] as const }}
                  >
                    <div 
                      className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-muted transition-colors border border-transparent hover:border-border cursor-pointer"
                      onClick={() => navigate(getDetailPath(submission))}
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={cn(
                          'p-2 rounded-lg',
                          getStatusClass(submission.currentStatus).replace('text-', 'bg-').split(' ')[0]
          )}>
                {getStatusIcon(submission.currentStatus)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {submission.title || 'Untitled'}
                  </h3>
                  <Badge className={cn('text-xs', getStatusClass(submission.currentStatus))}>
                    {submission.currentStatus || 'Unknown Status'}
                  </Badge>
                  <EditRequestIndicator
                    remarks={submission.remarks}
                    variant="badge"
                  />
                </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-medium">{submission.formcode || 'N/A'}</span>
                            {submission.submitteddate && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDistanceToNow(parseISO(submission.submitteddate), { addSuffix: true })}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isSubmissionEditable(submission.remarks) && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-7 text-xs"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              navigate(`${getDetailPath(submission)}?edit=true`);
                            }}
                          >
                            <Edit3 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        )}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Show "View All" if there are more items than displayed */}
          {maxItems && scopedSubmissions.length > maxItems && (
            <div className="mt-4 pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate(`${basePath}/submissions`)}
              >
                View All {scopedSubmissions.length} Submissions
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default MySubmissionsView;
