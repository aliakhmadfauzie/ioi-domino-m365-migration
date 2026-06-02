/**
 * HR Foreign Workers Database Page
 * Covers: FWWPD (Foreign Worker Work Permit Database), FWWPE (Foreign Worker Work Permit Expiry)
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Globe,
  Users,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Plus,
  FileText,
  Upload,
  Download,
  Eye,
  Edit,
  MoreHorizontal,
  Flag,
  CreditCard,
  Building2,
  Bell,
  RefreshCw,
  TrendingUp,
  Plane,
  Mail,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format, differenceInDays, addDays } from 'date-fns';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';

// Types
interface ForeignWorker {
  id: string;
  employeeId: string;
  name: string;
  nationality: string;
  passportNo: string;
  passportExpiry: string;
  workPermitNo: string;
  workPermitExpiry: string;
  visaType: string;
  department: string;
  position: string;
  dateOfJoining: string;
  status: 'Active' | 'Expiring Soon' | 'Expired' | 'Renewal In Progress' | 'Terminated';
  site: string;
  accommodation: string;
  emergencyContact: string;
  remarks?: string;
}

// Mock Data
const MOCK_WORKERS: ForeignWorker[] = [
  { id: 'FW001', employeeId: 'E101', name: 'Md. Rahman Khan', nationality: 'Bangladesh', passportNo: 'AB1234567', passportExpiry: '2025-08-15', workPermitNo: 'WP-2024-001', workPermitExpiry: '2024-06-30', visaType: 'Employment Pass', department: 'Production', position: 'Machine Operator', dateOfJoining: '2022-03-15', status: 'Expiring Soon', site: 'PRAI', accommodation: 'Hostel A', emergencyContact: '+60123456789' },
  { id: 'FW002', employeeId: 'E102', name: 'Nguyen Van Minh', nationality: 'Vietnam', passportNo: 'C98765432', passportExpiry: '2026-12-20', workPermitNo: 'WP-2024-002', workPermitExpiry: '2025-01-15', visaType: 'Employment Pass', department: 'Operations', position: 'Plant Operator', dateOfJoining: '2021-06-10', status: 'Active', site: 'PRAI', accommodation: 'Hostel B', emergencyContact: '+60198765432' },
  { id: 'FW003', employeeId: 'E103', name: 'Sunil Kumar', nationality: 'Nepal', passportNo: 'NP5678901', passportExpiry: '2025-04-10', workPermitNo: 'WP-2024-003', workPermitExpiry: '2024-05-20', visaType: 'Employment Pass', department: 'Maintenance', position: 'Technician', dateOfJoining: '2023-01-05', status: 'Expiring Soon', site: 'JHR', accommodation: 'Hostel C', emergencyContact: '+60111222333' },
  { id: 'FW004', employeeId: 'E104', name: 'Arjun Das', nationality: 'India', passportNo: 'IN2345678', passportExpiry: '2027-02-28', workPermitNo: 'WP-2024-004', workPermitExpiry: '2025-06-30', visaType: 'Professional Visit Pass', department: 'R&D', position: 'Research Assistant', dateOfJoining: '2023-08-20', status: 'Active', site: 'PRAI', accommodation: 'External', emergencyContact: '+60144556677' },
  { id: 'FW005', employeeId: 'E105', name: 'Than Htay', nationality: 'Myanmar', passportNo: 'MM8901234', passportExpiry: '2025-11-05', workPermitNo: 'WP-2024-005', workPermitExpiry: '2024-04-30', visaType: 'Employment Pass', department: 'Logistics', position: 'Warehouse Assistant', dateOfJoining: '2022-09-12', status: 'Renewal In Progress', site: 'JHR', accommodation: 'Hostel A', emergencyContact: '+60177889900' },
  { id: 'FW006', employeeId: 'E106', name: 'Sompong Chai', nationality: 'Thailand', passportNo: 'TH6789012', passportExpiry: '2026-07-18', workPermitNo: 'WP-2024-006', workPermitExpiry: '2025-03-10', visaType: 'Employment Pass', department: 'Quality', position: 'QC Inspector', dateOfJoining: '2021-11-30', status: 'Active', site: 'PRAI', accommodation: 'Hostel B', emergencyContact: '+60166778899' },
];

const NATIONALITIES = ['All', 'Bangladesh', 'Vietnam', 'Nepal', 'India', 'Myanmar', 'Thailand', 'Indonesia', 'Philippines'];
const STATUS_OPTIONS = ['All', 'Active', 'Expiring Soon', 'Expired', 'Renewal In Progress', 'Terminated'];
const SITES = ['All', 'PRAI', 'JHR', 'HQ'];

export default function ForeignWorkersPage() {
  const { data: user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNationality, setSelectedNationality] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSite, setSelectedSite] = useState('All');
  const [selectedWorker, setSelectedWorker] = useState<ForeignWorker | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNewWorkerModal, setShowNewWorkerModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Stats
  const stats = useMemo(() => {
    const today = new Date();
    const active = MOCK_WORKERS.filter((w: ForeignWorker) => w.status === 'Active').length;
    const expiringSoon = MOCK_WORKERS.filter((w: ForeignWorker) => {
      const daysUntilExpiry = differenceInDays(new Date(w.workPermitExpiry), today);
      return daysUntilExpiry > 0 && daysUntilExpiry <= 60;
    }).length;
    const expired = MOCK_WORKERS.filter((w: ForeignWorker) => differenceInDays(new Date(w.workPermitExpiry), today) < 0).length;
    const renewalInProgress = MOCK_WORKERS.filter((w: ForeignWorker) => w.status === 'Renewal In Progress').length;
    
    const byNationality: Record<string, number> = {};
    MOCK_WORKERS.forEach((w: ForeignWorker) => {
      byNationality[w.nationality] = (byNationality[w.nationality] || 0) + 1;
    });
    
    return { total: MOCK_WORKERS.length, active, expiringSoon, expired, renewalInProgress, byNationality };
  }, []);

  // Filtered workers
  const filteredWorkers = useMemo(() => {
    return MOCK_WORKERS.filter((w: ForeignWorker) => {
      const matchesSearch = !searchQuery ||
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.passportNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.workPermitNo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesNationality = selectedNationality === 'All' || w.nationality === selectedNationality;
      const matchesStatus = selectedStatus === 'All' || w.status === selectedStatus;
      const matchesSite = selectedSite === 'All' || w.site === selectedSite;
      
      if (activeTab === 'expiring') {
        const daysUntilExpiry = differenceInDays(new Date(w.workPermitExpiry), new Date());
        return matchesSearch && matchesNationality && matchesSite && daysUntilExpiry > 0 && daysUntilExpiry <= 60;
      }
      
      return matchesSearch && matchesNationality && matchesStatus && matchesSite;
    });
  }, [searchQuery, selectedNationality, selectedStatus, selectedSite, activeTab]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary';
      case 'Expiring Soon': return 'bg-accent text-accent-foreground dark:bg-accent/30 dark:text-accent-foreground';
      case 'Expired': return 'bg-destructive/10 text-destructive dark:bg-destructive/30 dark:text-destructive';
      case 'Renewal In Progress': return 'bg-secondary text-secondary-foreground dark:bg-secondary/30 dark:text-secondary-foreground';
      case 'Terminated': return 'bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const days = differenceInDays(new Date(expiryDate), new Date());
    if (days < 0) return { text: `${Math.abs(days)} days overdue`, color: 'text-destructive dark:text-destructive' };
    if (days <= 30) return { text: `${days} days left`, color: 'text-destructive dark:text-destructive' };
    if (days <= 60) return { text: `${days} days left`, color: 'text-accent-foreground dark:text-accent-foreground' };
    return { text: `${days} days left`, color: 'text-primary dark:text-primary' };
  };

  const getNationalityFlag = (nationality: string) => {
    const flags: Record<string, string> = {
      'Bangladesh': '🇧🇩',
      'Vietnam': '🇻🇳',
      'Nepal': '🇳🇵',
      'India': '🇮🇳',
      'Myanmar': '🇲🇲',
      'Thailand': '🇹🇭',
      'Indonesia': '🇮🇩',
      'Philippines': '🇵🇭',
    };
    return flags[nationality] || '🏳️';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/hr" className="p-2 rounded-lg hover:bg-muted transition-colors">
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-secondary dark:bg-secondary/30 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-secondary-foreground dark:text-primary" />
                </div>
                <div>
                  <h1 className="text-base font-semibold">Foreign Workers Database</h1>
                  <p className="text-xs text-muted-foreground">Work permits & compliance tracking</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => toast.success('Reminder emails sent!')}>
                <Bell className="h-4 w-4 mr-2" /> Send Reminders
              </Button>
              <Button onClick={() => setShowNewWorkerModal(true)}>
                <Plus className="h-4 w-4 mr-2" /> Add Worker
              </Button>
              <div className="flex items-center gap-2 pl-3 border-l">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* KPI Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Total Workers</p>
                  <p className="text-2xl font-bold mt-1">{stats.total}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-secondary dark:bg-secondary/30 flex items-center justify-center">
                  <Users className="h-5 w-5 text-secondary-foreground dark:text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Active</p>
                  <p className="text-2xl font-bold mt-1 text-primary dark:text-primary">{stats.active}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-primary/30 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-primary dark:text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent dark:border-accent">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Expiring Soon</p>
                  <p className="text-2xl font-bold mt-1 text-accent-foreground dark:text-accent-foreground">{stats.expiringSoon}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-accent dark:bg-accent/30 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-accent-foreground dark:text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-secondary dark:border-secondary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">In Renewal</p>
                  <p className="text-2xl font-bold mt-1 text-secondary-foreground dark:text-secondary-foreground">{stats.renewalInProgress}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-secondary dark:bg-secondary/30 flex items-center justify-center">
                  <RefreshCw className="h-5 w-5 text-secondary-foreground dark:text-secondary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 dark:border-destructive">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Expired</p>
                  <p className="text-2xl font-bold mt-1 text-destructive dark:text-destructive">{stats.expired}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-destructive/10 dark:bg-destructive/30 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-destructive dark:text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Nationality Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Workers by Nationality</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-3">
              {Object.entries(stats.byNationality).map(([nationality, count]) => (
                <div key={nationality} className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-muted/50 transition-colors">
                  <span className="text-xl">{getNationalityFlag(nationality)}</span>
                  <div>
                    <p className="text-sm font-medium">{nationality}</p>
                    <p className="text-xs text-muted-foreground">{count} workers</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Workers</TabsTrigger>
            <TabsTrigger value="expiring" className="relative">
              Expiring Soon
              {stats.expiringSoon > 0 && (
                <span className="ml-2 h-5 w-5 rounded-full bg-accent/500 text-white text-[10px] flex items-center justify-center">
                  {stats.expiringSoon}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <CardTitle className="text-sm font-semibold">Foreign Workers Registry</CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        className="h-8 w-40 pl-8 text-xs"
                      />
                    </div>
                    <Select value={selectedNationality} onValueChange={setSelectedNationality}>
                      <SelectTrigger className="h-8 w-32 text-xs">
                        <SelectValue placeholder="Nationality" />
                      </SelectTrigger>
                      <SelectContent>
                        {NATIONALITIES.map((n: string) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="h-8 w-36 text-xs">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s: string) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={selectedSite} onValueChange={setSelectedSite}>
                      <SelectTrigger className="h-8 w-24 text-xs">
                        <SelectValue placeholder="Site" />
                      </SelectTrigger>
                      <SelectContent>
                        {SITES.map((s: string) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Employee</TableHead>
                      <TableHead className="text-xs">Nationality</TableHead>
                      <TableHead className="text-xs">Passport</TableHead>
                      <TableHead className="text-xs">Work Permit</TableHead>
                      <TableHead className="text-xs">Expiry</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWorkers.map((worker: ForeignWorker) => {
                      const expiryInfo = getDaysUntilExpiry(worker.workPermitExpiry);
                      return (
                        <TableRow
                          key={worker.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => { setSelectedWorker(worker); setShowDetailModal(true); }}
                        >
                          <TableCell>
                            <div>
                              <p className="text-sm font-medium">{worker.name}</p>
                              <p className="text-xs text-muted-foreground">{worker.department} • {worker.position}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getNationalityFlag(worker.nationality)}</span>
                              <span className="text-xs">{worker.nationality}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{worker.passportNo}</TableCell>
                          <TableCell className="font-mono text-xs">{worker.workPermitNo}</TableCell>
                          <TableCell>
                            <div>
                              <p className="text-xs">{format(new Date(worker.workPermitExpiry), 'MMM d, yyyy')}</p>
                              <p className={cn('text-[10px]', expiryInfo.color)}>{expiryInfo.text}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn('text-[10px]', getStatusBadge(worker.status))}>
                              {worker.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => { setSelectedWorker(worker); setShowDetailModal(true); }}>
                                  <Eye className="h-3.5 w-3.5 mr-2" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-3.5 w-3.5 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <RefreshCw className="h-3.5 w-3.5 mr-2" /> Initiate Renewal
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="h-3.5 w-3.5 mr-2" /> Download Documents
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
            </Card>
          </TabsContent>

          <TabsContent value="expiring" className="mt-4">
            <Card className="border-accent dark:border-accent">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-accent-foreground dark:text-accent-foreground" />
                  <CardTitle className="text-sm font-semibold">Work Permits Expiring Within 60 Days</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {filteredWorkers.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-12 w-12 mx-auto text-primary mb-3" />
                    <p className="text-sm text-muted-foreground">No work permits expiring soon!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredWorkers.map((worker: ForeignWorker) => {
                      const expiryInfo = getDaysUntilExpiry(worker.workPermitExpiry);
                      const daysLeft = differenceInDays(new Date(worker.workPermitExpiry), new Date());
                      return (
                        <div key={worker.id} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-lg bg-accent dark:bg-accent/30 flex items-center justify-center">
                                <span className="text-2xl">{getNationalityFlag(worker.nationality)}</span>
                              </div>
                              <div>
                                <p className="font-medium">{worker.name}</p>
                                <p className="text-xs text-muted-foreground">{worker.department} • {worker.workPermitNo}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm">Expires: {format(new Date(worker.workPermitExpiry), 'MMM d, yyyy')}</p>
                              <p className={cn('text-sm font-medium', expiryInfo.color)}>{daysLeft} days remaining</p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => toast.success('Renewal initiated!')}>
                                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Renew
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => toast.success('Reminder sent!')}>
                                <Mail className="h-3.5 w-3.5 mr-1" /> Notify
                              </Button>
                            </div>
                          </div>
                          <div className="mt-3">
                            <Progress value={Math.max(0, 100 - (daysLeft / 60) * 100)} className="h-2" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Worker Details</DialogTitle>
          </DialogHeader>
          {selectedWorker && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <div className="h-14 w-14 rounded-xl bg-card border flex items-center justify-center">
                  <span className="text-3xl">{getNationalityFlag(selectedWorker.nationality)}</span>
                </div>
                <div>
                  <h3 className="font-semibold">{selectedWorker.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedWorker.position} • {selectedWorker.department}</p>
                  <Badge className={cn('text-[10px] mt-1', getStatusBadge(selectedWorker.status))}>
                    {selectedWorker.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Employee ID</p>
                  <p className="text-sm font-medium font-mono">{selectedWorker.employeeId}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Nationality</p>
                  <p className="text-sm font-medium">{selectedWorker.nationality}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Passport No.</p>
                  <p className="text-sm font-medium font-mono">{selectedWorker.passportNo}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Passport Expiry</p>
                  <p className="text-sm font-medium">{format(new Date(selectedWorker.passportExpiry), 'MMM d, yyyy')}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Work Permit No.</p>
                  <p className="text-sm font-medium font-mono">{selectedWorker.workPermitNo}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Work Permit Expiry</p>
                  <p className="text-sm font-medium">{format(new Date(selectedWorker.workPermitExpiry), 'MMM d, yyyy')}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Visa Type</p>
                  <p className="text-sm font-medium">{selectedWorker.visaType}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Site</p>
                  <p className="text-sm font-medium">{selectedWorker.site}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Accommodation</p>
                  <p className="text-sm font-medium">{selectedWorker.accommodation}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Date of Joining</p>
                  <p className="text-sm font-medium">{format(new Date(selectedWorker.dateOfJoining), 'MMM d, yyyy')}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="flex-1" onClick={() => { toast.success('Renewal process initiated!'); setShowDetailModal(false); }}>
                  <RefreshCw className="h-4 w-4 mr-2" /> Initiate Renewal
                </Button>
                <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Worker Modal */}
      <Dialog open={showNewWorkerModal} onOpenChange={setShowNewWorkerModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Foreign Worker</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="Full name as per passport" />
              </div>
              <div className="space-y-2">
                <Label>Nationality</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {NATIONALITIES.filter((n: string) => n !== 'All').map((n: string) => (
                      <SelectItem key={n} value={n}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Passport Number</Label>
                <Input placeholder="Passport no." />
              </div>
              <div className="space-y-2">
                <Label>Passport Expiry</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Work Permit No.</Label>
                <Input placeholder="Work permit no." />
              </div>
              <div className="space-y-2">
                <Label>Work Permit Expiry</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Department</Label>
                <Input placeholder="Department" />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input placeholder="Job title" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Site</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select site" /></SelectTrigger>
                <SelectContent>
                  {SITES.filter((s: string) => s !== 'All').map((s: string) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={() => { setShowNewWorkerModal(false); toast.success('Worker added successfully!'); }}>
                Add Worker
              </Button>
              <Button variant="outline" onClick={() => setShowNewWorkerModal(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
