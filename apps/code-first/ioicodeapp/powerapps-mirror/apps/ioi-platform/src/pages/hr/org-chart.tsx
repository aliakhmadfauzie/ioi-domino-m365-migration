/**
 * HR Organizational Chart
 * Interactive visual hierarchy grouped by department
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  X,
  Users,
  Building2,
  MapPin,
  Mail,
  ArrowLeft,
  Network,
  Minus,
  Plus,
  Loader2,
  RefreshCw,
  MessageSquare,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import { useAllOrganizationUsers, type User } from '@/hooks/use-office365-users';

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
} as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
} as const;

const nodeVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] } },
} as const;

// Department gradient colors
const DEPT_COLORS: Record<string, string> = {
  'Engineering': 'from-blue-500 to-cyan-500',
  'Operations': 'from-primary/50 to-teal-500',
  'Finance': 'from-amber-500 to-orange-500',
  'HR': 'from-pink-500 to-rose-500',
  'Human Resources': 'from-pink-500 to-rose-500',
  'Sales': 'from-violet-500 to-purple-500',
  'Marketing': 'from-fuchsia-500 to-pink-500',
  'IT': 'from-cyan-500 to-blue-500',
  'Information Technology': 'from-cyan-500 to-blue-500',
  'Technology': 'from-cyan-500 to-blue-500',
  'R&D': 'from-indigo-500 to-violet-500',
  'Research': 'from-indigo-500 to-violet-500',
  'Quality': 'from-teal-500 to-emerald-500',
  'Production': 'from-orange-500 to-red-500',
  'Legal': 'from-slate-500 to-zinc-600',
  'Executive': 'from-amber-500 to-yellow-500',
  'default': 'from-zinc-500 to-zinc-600',
};

// Site colors
const SITE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  PRAI: { bg: 'bg-primary/50/10', text: 'text-primary', border: 'border-primary/30' },
  JHR: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30' },
  HQ: { bg: 'bg-accent/500/10', text: 'text-accent-foreground', border: 'border-accent/30' },
  default: { bg: 'bg-muted/10', text: 'text-muted-foreground', border: 'border-border/30' },
};

interface DepartmentGroup {
  name: string;
  users: User[];
  isExpanded: boolean;
}

function getSiteFromOffice(office: string | undefined): string {
  if (!office) return 'Other';
  const upper = office.toUpperCase();
  if (upper.includes('PRAI') || upper.includes('PENANG')) return 'PRAI';
  if (upper.includes('JHR') || upper.includes('JOHOR') || upper.includes('PASIR')) return 'JHR';
  if (upper.includes('HQ') || upper.includes('HEADQUARTER')) return 'HQ';
  return 'Other';
}

function getInitials(name: string | undefined): string {
  if (!name) return '?';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getDeptColor(dept: string | undefined): string {
  if (!dept) return DEPT_COLORS.default;
  for (const [key, value] of Object.entries(DEPT_COLORS)) {
    if (dept.toLowerCase().includes(key.toLowerCase())) return value;
  }
  return DEPT_COLORS.default;
}

// Department Card Component
function DepartmentCard({
  group,
  onToggle,
  onSelectUser,
  selectedUserId,
  searchQuery,
}: {
  group: DepartmentGroup;
  onToggle: (name: string) => void;
  onSelectUser: (user: User) => void;
  selectedUserId: string | null;
  searchQuery: string;
}) {
  // Filter users by search
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return group.users;
    const query = searchQuery.toLowerCase();
    return group.users.filter((user: User) =>
      user.DisplayName?.toLowerCase().includes(query) ||
      user.JobTitle?.toLowerCase().includes(query) ||
      user.Mail?.toLowerCase().includes(query)
    );
  }, [group.users, searchQuery]);

  if (filteredUsers.length === 0) return null;

  const deptColor = getDeptColor(group.name);

  return (
    <motion.div variants={nodeVariant}>
      <Card className="border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
        {/* Department Header */}
        <button
          onClick={() => onToggle(group.name)}
          className="w-full flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors"
        >
          <div className={cn(
            'h-12 w-12 rounded-xl flex items-center justify-center bg-gradient-to-br shrink-0',
            deptColor
          )}>
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-base font-bold text-white">{group.name || 'Unassigned'}</h3>
            <p className="text-xs text-muted-foreground">{filteredUsers.length} employees</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-white/5 text-muted-foreground border-white/10">
              {filteredUsers.length}
            </Badge>
            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
              {group.isExpanded ? (
                <Minus className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Plus className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </button>

        {/* Users List */}
        <AnimatePresence>
          {group.isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] as const }}
              className="border-t border-white/5"
            >
              <div className="p-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredUsers.map((user: User) => {
                  const site = getSiteFromOffice(user.OfficeLocation);
                  const siteColors = SITE_COLORS[site] || SITE_COLORS.default;
                  const isSelected = user.Id === selectedUserId;

                  return (
                    <button
                      key={user.Id}
                      onClick={() => onSelectUser(user)}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg text-left transition-all',
                        'bg-card/50 border hover:bg-muted/50 hover:border-primary/30',
                        isSelected ? 'border-primary ring-1 ring-teal-500/20' : 'border-border',
                        'group'
                      )}
                    >
                      <Avatar className="h-10 w-10 border-2 border-border shrink-0">
                        <AvatarImage src={undefined} />
                        <AvatarFallback className={cn('bg-gradient-to-br text-white text-xs font-bold', deptColor)}>
                          {getInitials(user.DisplayName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">
                          {user.DisplayName || 'Unknown'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.JobTitle || 'No title'}
                        </p>
                        <Badge className={cn('mt-1 text-[10px] px-1.5 py-0 border', siteColors.bg, siteColors.text, siteColors.border)}>
                          {site}
                        </Badge>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

export default function OrgChartPage() {
  const { data: orgUsers, isLoading, refetch } = useAllOrganizationUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [siteFilter, setSiteFilter] = useState('all');
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const safeUsers = orgUsers || [];

  // Filter by site
  const filteredUsers = useMemo(() => {
    if (siteFilter === 'all') return safeUsers;
    return safeUsers.filter((user: User) => getSiteFromOffice(user.OfficeLocation) === siteFilter);
  }, [safeUsers, siteFilter]);

  // Group users by department
  const departmentGroups = useMemo(() => {
    const groups: Record<string, User[]> = {};
    filteredUsers.forEach((user: User) => {
      const dept = user.Department || 'Unassigned';
      if (!groups[dept]) groups[dept] = [];
      groups[dept].push(user);
    });

    // Sort departments by size and then by name
    return Object.entries(groups)
      .sort((a, b) => b[1].length - a[1].length)
      .map(([name, users]): DepartmentGroup => ({
        name,
        users: users.sort((a: User, b: User) => (a.DisplayName || '').localeCompare(b.DisplayName || '')),
        isExpanded: expandedDepts.has(name),
      }));
  }, [filteredUsers, expandedDepts]);

  // Extract unique sites
  const sites = useMemo(() => {
    const siteSet = new Set<string>();
    safeUsers.forEach((user: User) => {
      siteSet.add(getSiteFromOffice(user.OfficeLocation));
    });
    return Array.from(siteSet).sort();
  }, [safeUsers]);

  // Auto-expand first department on load
  useEffect(() => {
    if (departmentGroups.length > 0 && expandedDepts.size === 0) {
      setExpandedDepts(new Set([departmentGroups[0].name]));
    }
  }, [departmentGroups.length]);

  // Handlers
  const handleToggleDept = useCallback((name: string) => {
    setExpandedDepts((prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const handleSelectUser = useCallback((user: User) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  }, []);

  const handleExpandAll = () => {
    setExpandedDepts(new Set(departmentGroups.map((g: DepartmentGroup) => g.name)));
  };

  const handleCollapseAll = () => {
    setExpandedDepts(new Set());
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSiteFilter('all');
  };

  const isFiltering = Boolean(searchQuery) || siteFilter !== 'all';

  // Stats
  const stats = useMemo(() => {
    return {
      total: safeUsers.length,
      departments: departmentGroups.length,
      filtered: filteredUsers.length,
    };
  }, [safeUsers, departmentGroups, filteredUsers]);

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-white hover:bg-white/5"
                asChild
              >
                <Link to="/hr">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                    <Network className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">Organization Chart</h1>
                    <p className="text-xs text-muted-foreground">Browse by department</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-primary/20 text-primary border-primary/30 px-3 py-1">
                {stats.total.toLocaleString()} employees
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="h-9 bg-transparent border-border text-muted-foreground hover:text-white hover:bg-muted"
                onClick={() => refetch()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer}
          className="max-w-7xl mx-auto space-y-6"
        >
          {/* Stats Cards */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-white/5 bg-white/[0.02] backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/5 bg-white/[0.02] backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary/500/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.departments}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Departments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/5 bg-white/[0.02] backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/500/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{sites.length}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Sites</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/5 bg-white/[0.02] backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{expandedDepts.size}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Expanded</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Toolbar */}
          <motion.div variants={fadeUp}>
            <Card className="border-white/5 bg-white/[0.02] backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, title, or email..."
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                      className="h-10 pl-10 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary/50"
                    />
                  </div>

                  {/* Site Filter */}
                  <Select value={siteFilter} onValueChange={setSiteFilter}>
                    <SelectTrigger className="h-10 w-40 bg-white/5 border-white/10 text-white">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Site" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="all" className="text-muted-foreground">All Sites</SelectItem>
                      {sites.map((site: string) => (
                        <SelectItem key={site} value={site} className="text-muted-foreground">{site}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Expand/Collapse */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 bg-transparent border-border text-muted-foreground hover:text-white hover:bg-muted"
                      onClick={handleExpandAll}
                    >
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Expand All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 bg-transparent border-border text-muted-foreground hover:text-white hover:bg-muted"
                      onClick={handleCollapseAll}
                    >
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Collapse
                    </Button>
                  </div>

                  {/* Clear Filters */}
                  {isFiltering && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 text-muted-foreground hover:text-white"
                      onClick={clearFilters}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>

                {/* Active filters */}
                {isFiltering && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                    <span className="text-xs text-muted-foreground">Showing {stats.filtered} employees</span>
                    {siteFilter !== 'all' && (
                      <Badge className={cn(
                        'text-[10px] border',
                        SITE_COLORS[siteFilter]?.bg || SITE_COLORS.default.bg,
                        SITE_COLORS[siteFilter]?.text || SITE_COLORS.default.text,
                        SITE_COLORS[siteFilter]?.border || SITE_COLORS.default.border
                      )}>
                        {siteFilter}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Department Groups */}
          <motion.div variants={fadeUp}>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : departmentGroups.length === 0 ? (
              <Card className="border-white/5 bg-white/[0.02] backdrop-blur-sm">
                <CardContent className="py-16 text-center">
                  <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Network className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium text-muted-foreground">No organization data found</p>
                  <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
                  {isFiltering && (
                    <Button
                      variant="outline"
                      className="mt-4 bg-transparent border-border text-muted-foreground hover:text-white"
                      onClick={clearFilters}
                    >
                      Clear all filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <ScrollArea className="h-[600px]">
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  className="space-y-4"
                >
                  {departmentGroups.map((group: DepartmentGroup) => (
                    <DepartmentCard
                      key={group.name}
                      group={group}
                      onToggle={handleToggleDept}
                      onSelectUser={handleSelectUser}
                      selectedUserId={selectedUser?.Id || null}
                      searchQuery={searchQuery}
                    />
                  ))}
                </motion.div>
              </ScrollArea>
            )}
          </motion.div>
        </motion.div>
      </main>

      {/* Employee Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="max-w-lg bg-card border-border p-0 overflow-hidden">
          {selectedUser && (
            <>
              {/* Header */}
              <div className={cn('relative h-24 bg-gradient-to-br', getDeptColor(selectedUser.Department))}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-4 right-4">
                  <Badge className={cn(
                    'text-[10px] px-2 py-0.5 border backdrop-blur-sm',
                    SITE_COLORS[getSiteFromOffice(selectedUser.OfficeLocation)]?.bg || SITE_COLORS.default.bg,
                    SITE_COLORS[getSiteFromOffice(selectedUser.OfficeLocation)]?.text || SITE_COLORS.default.text,
                    SITE_COLORS[getSiteFromOffice(selectedUser.OfficeLocation)]?.border || SITE_COLORS.default.border
                  )}>
                    {getSiteFromOffice(selectedUser.OfficeLocation)}
                  </Badge>
                </div>
              </div>

              {/* Avatar */}
              <div className="relative px-6">
                <div className="absolute -top-10">
                  <Avatar className="h-20 w-20 border-4 border-border shadow-xl">
                    <AvatarImage src={undefined} />
                    <AvatarFallback className={cn('bg-gradient-to-br text-white text-2xl font-bold', getDeptColor(selectedUser.Department))}>
                      {getInitials(selectedUser.DisplayName)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pt-12 pb-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-white">
                    {selectedUser.DisplayName || 'Unknown'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.JobTitle || 'No title'}
                  </p>
                </div>

                {/* Info Grid */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Department</p>
                      <p className="text-sm text-white">{selectedUser.Department || 'Not assigned'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Email</p>
                      <p className="text-sm text-white truncate">{selectedUser.Mail || 'No email'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Office</p>
                      <p className="text-sm text-white">{selectedUser.OfficeLocation || 'Not specified'}</p>
                    </div>
                  </div>
                  {selectedUser.mobilePhone && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Mobile</p>
                        <p className="text-sm text-white">{selectedUser.mobilePhone}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Button
                    className="flex-1 h-10 bg-primary text-white hover:bg-primary"
                    onClick={() => {
                      if (selectedUser.Mail) {
                        window.location.href = `mailto:${selectedUser.Mail}`;
                      } else {
                        toast.error('No email address available');
                      }
                    }}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 px-4 bg-transparent border-border text-muted-foreground hover:text-white hover:bg-muted"
                    onClick={() => {
                      toast.success('Chat feature coming soon');
                    }}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
