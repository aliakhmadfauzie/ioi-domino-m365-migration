/**
 * Employee Directory Page
 * Searchable directory with filtering, department grouping, and employee cards
 */

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Search,
  Users,
  Building2,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  ArrowLeft,
  Grid3X3,
  List,
  Loader2,
  RefreshCw,
  X,
  MessageSquare,
  Home,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { cn } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { toast } from 'sonner';

import { useAllOrganizationUsers, type User } from '@/hooks/use-office365-users';
import { useUser } from '@/hooks/use-user';

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
} as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
} as const;

const cardVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
} as const;

// Site colors
const SITE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  PRAI: { bg: 'bg-primary/50/10', text: 'text-primary', border: 'border-primary/30' },
  JHR: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30' },
  HQ: { bg: 'bg-accent/500/10', text: 'text-accent-foreground', border: 'border-accent/30' },
  default: { bg: 'bg-muted/10', text: 'text-muted-foreground', border: 'border-border/30' },
};

// Department colors
const DEPT_COLORS: Record<string, string> = {
  'Engineering': 'from-blue-500 to-cyan-500',
  'Operations': 'from-primary/50 to-teal-500',
  'Finance': 'from-amber-500 to-orange-500',
  'HR': 'from-pink-500 to-rose-500',
  'Sales': 'from-violet-500 to-purple-500',
  'Marketing': 'from-fuchsia-500 to-pink-500',
  'IT': 'from-cyan-500 to-blue-500',
  'R&D': 'from-indigo-500 to-violet-500',
  'Quality': 'from-teal-500 to-emerald-500',
  'default': 'from-zinc-500 to-zinc-600',
};

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

export default function EmployeeDirectoryPage() {
  const { data: orgUsers, isLoading, refetch } = useAllOrganizationUsers();
  const { data: currentUser } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedSite, setSelectedSite] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const safeUsers = orgUsers || [];

  // Extract unique departments and sites
  const { departments, sites } = useMemo(() => {
    const deptSet = new Set<string>();
    const siteSet = new Set<string>();
    safeUsers.forEach((user: User) => {
      if (user.Department) deptSet.add(user.Department);
      const site = getSiteFromOffice(user.OfficeLocation);
      siteSet.add(site);
    });
    return {
      departments: Array.from(deptSet).sort(),
      sites: Array.from(siteSet).sort(),
    };
  }, [safeUsers]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return safeUsers.filter((user: User) => {
      const matchesSearch =
        !searchQuery ||
        user.DisplayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.Mail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.JobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.Department?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept =
        selectedDepartment === 'all' || user.Department === selectedDepartment;

      const matchesSite =
        selectedSite === 'all' || getSiteFromOffice(user.OfficeLocation) === selectedSite;

      return matchesSearch && matchesDept && matchesSite;
    });
  }, [safeUsers, searchQuery, selectedDepartment, selectedSite]);

  // Group by department for list view
  const groupedByDept = useMemo(() => {
    const groups: Record<string, User[]> = {};
    filteredUsers.forEach((user: User) => {
      const dept = user.Department || 'Unassigned';
      if (!groups[dept]) groups[dept] = [];
      groups[dept].push(user);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredUsers]);

  const stats = useMemo(() => {
    const byDept: Record<string, number> = {};
    const bySite: Record<string, number> = {};
    safeUsers.forEach((user: User) => {
      const dept = user.Department || 'Unassigned';
      byDept[dept] = (byDept[dept] || 0) + 1;
      const site = getSiteFromOffice(user.OfficeLocation);
      bySite[site] = (bySite[site] || 0) + 1;
    });
    return { total: safeUsers.length, byDept, bySite };
  }, [safeUsers]);

  const handleViewProfile = (user: User) => {
    setSelectedEmployee(user);
    setShowProfileModal(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('all');
    setSelectedSite('all');
  };

  const hasActiveFilters = searchQuery || selectedDepartment !== 'all' || selectedSite !== 'all';

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="px-6 py-4">
          {/* Breadcrumb Navigation */}
          <Breadcrumb className="mb-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                    <Home className="h-3.5 w-3.5" />
                    <span className="text-sm">Home</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-3.5 w-3.5" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/hr" className="text-sm text-muted-foreground hover:text-foreground">
                    Human Resources
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-3.5 w-3.5" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm font-medium text-foreground">
                  Employee Directory
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

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
                <h1 className="text-xl font-bold text-white">Employee Directory</h1>
                <p className="text-xs text-muted-foreground">Browse and search organization members</p>
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
                    <p className="text-2xl font-bold text-white">{departments.length}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Departments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/5 bg-white/[0.02] backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/50/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.bySite['PRAI'] || 0}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Prai Site</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/5 bg-white/[0.02] backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.bySite['JHR'] || 0}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Johor Site</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Search and Filters */}
          <motion.div variants={fadeUp}>
            <Card className="border-white/5 bg-white/[0.02] backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, job title, or department..."
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                      className="h-10 pl-10 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary/50"
                    />
                  </div>

                  {/* Department Filter */}
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="h-10 w-48 bg-white/5 border-white/10 text-white">
                      <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="all" className="text-muted-foreground">All Departments</SelectItem>
                      {departments.map((dept: string) => (
                        <SelectItem key={dept} value={dept} className="text-muted-foreground">{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Site Filter */}
                  <Select value={selectedSite} onValueChange={setSelectedSite}>
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

                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'h-8 w-8',
                        viewMode === 'grid' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-white'
                      )}
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'h-8 w-8',
                        viewMode === 'list' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-white'
                      )}
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Clear Filters */}
                  {hasActiveFilters && (
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

                {/* Active filters display */}
                {hasActiveFilters && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                    <span className="text-xs text-muted-foreground">Showing {filteredUsers.length} of {stats.total} employees</span>
                    {selectedDepartment !== 'all' && (
                      <Badge className="bg-secondary/500/20 text-violet-400 border-violet-500/30">
                        {selectedDepartment}
                      </Badge>
                    )}
                    {selectedSite !== 'all' && (
                      <Badge className={cn('border', SITE_COLORS[selectedSite]?.bg || SITE_COLORS.default.bg, SITE_COLORS[selectedSite]?.text || SITE_COLORS.default.text, SITE_COLORS[selectedSite]?.border || SITE_COLORS.default.border)}>
                        {selectedSite}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Employee Grid/List */}
          <motion.div variants={fadeUp}>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <Card className="border-white/5 bg-white/[0.02] backdrop-blur-sm">
                <CardContent className="py-16 text-center">
                  <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium text-muted-foreground">No employees found</p>
                  <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
                  {hasActiveFilters && (
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
            ) : viewMode === 'grid' ? (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {filteredUsers.map((user: User) => (
                  <motion.div key={user.Id} variants={cardVariant}>
                    <Card
                      className="border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] hover:border-primary/20 transition-all cursor-pointer group"
                      onClick={() => handleViewProfile(user)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12 border-2 border-white/10">
                            <AvatarImage src={undefined} />
                            <AvatarFallback className={cn('bg-gradient-to-br text-white font-semibold', getDeptColor(user.Department))}>
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
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className="bg-white/5 text-muted-foreground border-white/10 text-[10px] px-1.5 py-0">
                                {user.Department || 'No dept'}
                              </Badge>
                              <Badge className={cn('text-[10px] px-1.5 py-0 border', SITE_COLORS[getSiteFromOffice(user.OfficeLocation)]?.bg || SITE_COLORS.default.bg, SITE_COLORS[getSiteFromOffice(user.OfficeLocation)]?.text || SITE_COLORS.default.text, SITE_COLORS[getSiteFromOffice(user.OfficeLocation)]?.border || SITE_COLORS.default.border)}>
                                {getSiteFromOffice(user.OfficeLocation)}
                              </Badge>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="space-y-6">
                {groupedByDept.map(([dept, users]) => (
                  <Card key={dept} className="border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
                    <CardHeader className="p-4 border-b border-white/5 bg-white/[0.02]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center bg-gradient-to-br', getDeptColor(dept))}>
                            <Building2 className="h-4 w-4 text-white" />
                          </div>
                          <CardTitle className="text-sm font-semibold text-white">{dept}</CardTitle>
                        </div>
                        <Badge className="bg-white/5 text-muted-foreground border-white/10">
                          {users.length} {users.length === 1 ? 'employee' : 'employees'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-white/5">
                        {users.map((user: User) => (
                          <div
                            key={user.Id}
                            className="flex items-center gap-4 p-4 hover:bg-white/[0.02] cursor-pointer transition-colors group"
                            onClick={() => handleViewProfile(user)}
                          >
                            <Avatar className="h-10 w-10 border border-white/10">
                              <AvatarImage src={undefined} />
                              <AvatarFallback className={cn('bg-gradient-to-br text-white text-sm font-medium', getDeptColor(user.Department))}>
                                {getInitials(user.DisplayName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                                {user.DisplayName || 'Unknown'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {user.JobTitle || 'No title'}
                              </p>
                            </div>
                            <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
                              {user.Mail && (
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3.5 w-3.5" />
                                  <span className="truncate max-w-[180px]">{user.Mail}</span>
                                </span>
                              )}
                              <Badge className={cn('text-[10px] px-1.5 py-0 border', SITE_COLORS[getSiteFromOffice(user.OfficeLocation)]?.bg || SITE_COLORS.default.bg, SITE_COLORS[getSiteFromOffice(user.OfficeLocation)]?.text || SITE_COLORS.default.text, SITE_COLORS[getSiteFromOffice(user.OfficeLocation)]?.border || SITE_COLORS.default.border)}>
                                {getSiteFromOffice(user.OfficeLocation)}
                              </Badge>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>

      {/* Employee Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="max-w-lg bg-card border-border p-0 overflow-hidden">
          {selectedEmployee && (
            <>
              {/* Header */}
              <div className={cn('relative h-24 bg-gradient-to-br', getDeptColor(selectedEmployee.Department))}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-4 right-4">
                  <Badge className={cn('text-[10px] px-2 py-0.5 border backdrop-blur-sm', SITE_COLORS[getSiteFromOffice(selectedEmployee.OfficeLocation)]?.bg || SITE_COLORS.default.bg, SITE_COLORS[getSiteFromOffice(selectedEmployee.OfficeLocation)]?.text || SITE_COLORS.default.text, SITE_COLORS[getSiteFromOffice(selectedEmployee.OfficeLocation)]?.border || SITE_COLORS.default.border)}>
                    {getSiteFromOffice(selectedEmployee.OfficeLocation)}
                  </Badge>
                </div>
              </div>

              {/* Avatar */}
              <div className="relative px-6">
                <div className="absolute -top-10">
                  <Avatar className="h-20 w-20 border-4 border-border shadow-xl">
                    <AvatarImage src={undefined} />
                    <AvatarFallback className={cn('bg-gradient-to-br text-white text-2xl font-bold', getDeptColor(selectedEmployee.Department))}>
                      {getInitials(selectedEmployee.DisplayName)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pt-12 pb-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-white">
                    {selectedEmployee.DisplayName || 'Unknown'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedEmployee.JobTitle || 'No title'}
                  </p>
                </div>

                {/* Info Grid */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Department</p>
                      <p className="text-sm text-white">{selectedEmployee.Department || 'Not assigned'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Email</p>
                      <p className="text-sm text-white truncate">{selectedEmployee.Mail || 'No email'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Office</p>
                      <p className="text-sm text-white">{selectedEmployee.OfficeLocation || 'Not specified'}</p>
                    </div>
                  </div>
                  {selectedEmployee.mobilePhone && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Mobile</p>
                        <p className="text-sm text-white">{selectedEmployee.mobilePhone}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Button
                    className="flex-1 h-10 bg-primary text-white hover:bg-primary"
                    onClick={() => {
                      if (selectedEmployee.Mail) {
                        window.location.href = `mailto:${selectedEmployee.Mail}`;
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
