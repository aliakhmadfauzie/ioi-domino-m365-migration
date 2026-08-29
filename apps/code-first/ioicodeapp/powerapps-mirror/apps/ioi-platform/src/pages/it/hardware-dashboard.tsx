import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Plus,
  Search,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  HardDrive,
  Server,
  Laptop,
  Monitor,
  Printer,
  Download,
  Filter,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Eye,
  MoreHorizontal,
  RefreshCcw,
  FileText,
  HelpCircle,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty';
import { InMemoryDataBanner } from '@/generated/components/in-memory-data-banner';
import { HAS_IN_MEMORY_TABLES } from '@/generated/hooks';
import { useMainDBITExtAssetsList } from '@/generated/hooks/use-main-dbitext-assets';
import type { MainDBITExtAssets } from '@/generated/models/main-dbit-ext-assets-model';
import { M3_FORMS, type ITFormConfig } from '@/lib/it-forms-config';
import { format } from 'date-fns';
import { useUser } from '@/hooks/use-user';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 10;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.2, 0, 0, 1] as const } },
} as const;

// Equipment type icons mapping
const equipmentIcons: Record<string, LucideIcon> = {
  laptop: Laptop,
  desktop: Monitor,
  server: Server,
  printer: Printer,
  network: RefreshCcw,
  other: Package,
};

function normalizeType(hiType?: string): string {
  const t = (hiType || '').toLowerCase();
  if (t.includes('laptop') || t.includes('notebook')) return 'laptop';
  if (t.includes('desktop') || t.includes('pc') || t.includes('workstation')) return 'desktop';
  if (t.includes('server')) return 'server';
  if (t.includes('printer')) return 'printer';
  if (t.includes('network') || t.includes('switch') || t.includes('router')) return 'network';
  return 'other';
}

function normalizeStatus(hiStatus?: string): string {
  const s = (hiStatus || '').toLowerCase();
  if (s === 'active' || s.includes('in use') || s.includes('good')) return 'active';
  if (s.includes('maintenance') || s.includes('repair')) return 'maintenance';
  if (s.includes('inactive') || s.includes('retired') || s.includes('spare')) return 'inactive';
  if (s.includes('dispos') || s.includes('scrap')) return 'disposed';
  return 'active';
}

function normalizeCondition(hiStatus?: string): string {
  const s = (hiStatus || '').toLowerCase();
  if (s.includes('new')) return 'new';
  if (s.includes('good') || s === 'active') return 'good';
  if (s.includes('fair') || s.includes('maintenance')) return 'fair';
  if (s.includes('poor') || s.includes('inactive')) return 'poor';
  return 'good';
}

export default function HardwareDashboardPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSite, setSelectedSite] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showFormPicker, setShowFormPicker] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'inventory' | 'servers'>('inventory');

  const { data: assetsRaw, isLoading, isError } = useMainDBITExtAssetsList();

  const inventory = useMemo(() => {
    return (assetsRaw || []).map((a: MainDBITExtAssets) => ({
      id: String(a.id),
      assetTag: a.hITagNo || a.hIAssetNo || `HW-${a.id}`,
      type: normalizeType(a.hIType),
      name: a.hIComputerName || a.title,
      serial: a.hISerialNo || '-',
      site: a.parentSite || '-',
      status: normalizeStatus(a.hIStatus),
      condition: normalizeCondition(a.hIStatus),
      assignedTo: a.hIUsedByEmail || a.hILocation || 'Unassigned',
      department: a.hIDepartment || '-',
      lastAudit: a.hILastAuditedDate ? new Date(a.hILastAuditedDate) : null,
    }));
  }, [assetsRaw]);

  const servers = useMemo(() => {
    return (assetsRaw || [])
      .filter((a: MainDBITExtAssets) => !!a.iTSCServerName)
      .map((a: MainDBITExtAssets) => ({
        id: String(a.id),
        name: a.iTSCServerName!,
        checklistYear: a.iTSCChecklistYear || '-',
        reviewedBy: a.iTSCReviewedBy || '-',
        reviewedDate: a.iTSCReviewedDate ? new Date(a.iTSCReviewedDate) : null,
        site: a.parentSite || '-',
      }));
  }, [assetsRaw]);

  // Filter inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !item.assetTag.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !item.serial.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedSite !== 'all' && item.site !== selectedSite) return false;
      if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
      if (selectedType !== 'all' && item.type !== selectedType) return false;
      return true;
    });
  }, [searchQuery, selectedSite, selectedStatus, selectedType]);

  // Pagination
  const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE);
  const paginatedInventory = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredInventory.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredInventory, currentPage]);

  // Stats
  const totalEquipment = inventory.length;
  const activeCount = inventory.filter((i) => i.status === 'active').length;
  const maintenanceCount = inventory.filter((i) => i.status === 'maintenance').length;
  const inactiveCount = inventory.filter((i) => i.status === 'inactive').length;
  const auditedCount = inventory.filter((i) => i.lastAudit !== null).length;
  const complianceRate = totalEquipment > 0 ? Math.round((auditedCount / totalEquipment) * 100) : 0;

  const handleSelectForm = (formCode: string) => {
    setShowFormPicker(false);
    navigate(`/it/forms/${formCode.toLowerCase()}/new`);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-[#003366]/10 text-[#166534] border-0 text-[10px]">Active</Badge>;
      case 'maintenance':
        return <Badge className="bg-[#FFF3E0] text-[#7B3E00] border-0 text-[10px]">Maintenance</Badge>;
      case 'inactive':
        return <Badge className="bg-[#E0E0E0] text-[#424242] border-0 text-[10px]">Inactive</Badge>;
      case 'disposed':
        return <Badge className="bg-[#FDEDEA] text-[#9B2F23] border-0 text-[10px]">Disposed</Badge>;
      default:
        return <Badge className="bg-[#F5F5F5] text-[#5C5C5C] border-0 text-[10px]">{status}</Badge>;
    }
  };

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'new':
        return <Badge className="bg-[#EAF0FB] text-[#1752A8] border-0 text-[10px]">New</Badge>;
      case 'good':
        return <Badge className="bg-[#003366]/10 text-[#166534] border-0 text-[10px]">Good</Badge>;
      case 'fair':
        return <Badge className="bg-[#FFF8E1] text-[#5A4A00] border-0 text-[10px]">Fair</Badge>;
      case 'poor':
        return <Badge className="bg-[#FDEDEA] text-[#9B2F23] border-0 text-[10px]">Poor</Badge>;
      default:
        return <Badge className="bg-[#F5F5F5] text-[#5C5C5C] border-0 text-[10px]">{condition}</Badge>;
    }
  };

  const getServerStatus = (status: string) => {
    switch (status) {
      case 'healthy':
        return { color: '#166534', bg: '#E8F5E9', label: 'Healthy' };
      case 'warning':
        return { color: '#5A4A00', bg: '#FFF8E1', label: 'Warning' };
      case 'critical':
        return { color: '#9B2F23', bg: '#FDEDEA', label: 'Critical' };
      default:
        return { color: '#5C5C5C', bg: '#F5F5F5', label: status };
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-[#F5F5F5]"
    >
      {/* App Header - IOI Green */}
      <header className="app-header bg-[#003366] h-16 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/it">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-white/80 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-screen-title text-white">Hardware & Infrastructure</h1>
            <p className="text-body-sm text-white/70">M3 - Hardware Inventory Management</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-white/70 hover:text-white hover:bg-white/10"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
          <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-sm">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
        </div>
      </header>

      {/* Screen Body */}
      <div className="p-6 space-y-6">
        <InMemoryDataBanner
          show={HAS_IN_MEMORY_TABLES}
          message="This app uses draft tables for testing. Data entered won't be saved."
          className="bg-accent/50 border-accent text-accent-foreground"
        />
        {isError && (
          <div className="rounded-lg bg-[#FDEDEA] border border-[#9B2F23]/20 px-4 py-3 text-sm text-[#9B2F23]">
            Failed to load hardware data. Please refresh and try again.
          </div>
        )}
        {isLoading && (
          <div className="rounded-lg bg-[#EAF0FB] border border-[#1752A8]/20 px-4 py-3 text-sm text-[#1752A8]">
            Loading hardware inventory from SharePoint...
          </div>
        )}

        {/* 2-Column Layout: 70/30 split */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Left Column - Main Content Area */}
          <div className="space-y-6">
            {/* Quick Actions Panel */}
            <motion.div variants={itemVariants}>
              <Card className="card-default elevation-2 border-[#D0D0D0] rounded-xl">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Button
                      onClick={() => setShowFormPicker(true)}
                      className="btn-primary h-11 gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Inventory
                    </Button>
                    <Button
                      variant="outline"
                      className="btn-secondary h-11 gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export List
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-11 gap-2 text-[#003366] hover:bg-[#003366]/10 hover:text-[#003366]"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Sync Data
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-11 gap-2 text-[#003366] hover:bg-[#003366]/10 hover:text-[#003366]"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Support
                      <span className="ml-auto h-2 w-2 rounded-full bg-[#166534]"></span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Status Cards Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Equipment */}
              <Card className="card-default elevation-1 border-[#D0D0D0] rounded-xl border-t-4 border-t-[#003366]">
                <CardContent className="pt-4 pb-4 px-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="h-4 w-4 text-[#5C5C5C]" />
                    <span className="text-label-md text-[#5C5C5C]">Total Equipment</span>
                  </div>
                  <p className="text-screen-title text-[#003366]">{totalEquipment}</p>
                  <p className="text-body-sm text-[#5C5C5C]">Registered items</p>
                  <p className="text-meta text-[#166534] mt-2">+3 this month</p>
                </CardContent>
              </Card>

              {/* Active */}
              <Card className="card-default elevation-1 border-[#D0D0D0] rounded-xl border-t-4 border-t-[#166534]">
                <CardContent className="pt-4 pb-4 px-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-4 w-4 text-[#5C5C5C]" />
                    <span className="text-label-md text-[#5C5C5C]">Active</span>
                  </div>
                  <p className="text-screen-title text-[#003366]">{activeCount}</p>
                  <p className="text-body-sm text-[#5C5C5C]">In use</p>
                  <p className="text-meta text-[#166534] mt-2">{Math.round((activeCount / totalEquipment) * 100)}% utilization</p>
                </CardContent>
              </Card>

              {/* Under Maintenance */}
              <Card className="card-default elevation-1 border-[#D0D0D0] rounded-xl border-t-4 border-t-[#7B3E00]">
                <CardContent className="pt-4 pb-4 px-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-[#5C5C5C]" />
                    <span className="text-label-md text-[#5C5C5C]">Maintenance</span>
                  </div>
                  <p className="text-screen-title text-[#003366]">{maintenanceCount}</p>
                  <p className="text-body-sm text-[#5C5C5C]">Under repair</p>
                  <p className="text-meta text-[#7B3E00] mt-2">Avg 3 days</p>
                </CardContent>
              </Card>

              {/* Compliance Rate */}
              <Card className="card-default elevation-1 border-[#D0D0D0] rounded-xl border-t-4 border-t-[#1752A8]">
                <CardContent className="pt-4 pb-4 px-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-[#5C5C5C]" />
                    <span className="text-label-md text-[#5C5C5C]">Compliance</span>
                  </div>
                  <p className="text-screen-title text-[#003366]">{complianceRate}%</p>
                  <p className="text-body-sm text-[#5C5C5C]">Audit compliance</p>
                  <p className="text-meta text-[#166534] mt-2">Above target</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tab Switcher */}
            <motion.div variants={itemVariants} className="flex gap-2">
              <Button
                variant={activeTab === 'inventory' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('inventory')}
                className={activeTab === 'inventory' ? 'bg-[#003366] hover:bg-[#002244]' : 'border-[#D0D0D0]'}
              >
                <HardDrive className="h-4 w-4 mr-2" />
                Hardware Inventory
              </Button>
              <Button
                variant={activeTab === 'servers' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('servers')}
                className={activeTab === 'servers' ? 'bg-[#003366] hover:bg-[#002244]' : 'border-[#D0D0D0]'}
              >
                <Server className="h-4 w-4 mr-2" />
                Server Monitoring
              </Button>
            </motion.div>

            {/* Inventory Table */}
            {activeTab === 'inventory' && (
              <motion.div variants={itemVariants}>
                <Card className="card-default elevation-2 border-[#D0D0D0] rounded-xl overflow-hidden">
                  {/* Table Header with Search & Filters */}
                  <div className="bg-[#003366]/10 px-4 py-3 border-b border-[#003366]/20">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <h2 className="text-section-heading text-[#003366]">Hardware Inventory</h2>
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C5C5C]" />
                          <Input
                            placeholder="Search equipment..."
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                            className="pl-9 h-9 w-48 bg-white border-[#D0D0D0] focus:border-[#003366]"
                          />
                        </div>
                        <Select value={selectedSite} onValueChange={setSelectedSite}>
                          <SelectTrigger className="w-32 h-9 bg-white border-[#D0D0D0]">
                            <SelectValue placeholder="Site" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Sites</SelectItem>
                            <SelectItem value="MY-PR">MY-PR (Prai)</SelectItem>
                            <SelectItem value="MY-JH">MY-JH (Johor)</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={selectedType} onValueChange={setSelectedType}>
                          <SelectTrigger className="w-32 h-9 bg-white border-[#D0D0D0]">
                            <Filter className="h-3.5 w-3.5 mr-2" />
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="laptop">Laptop</SelectItem>
                            <SelectItem value="desktop">Desktop</SelectItem>
                            <SelectItem value="server">Server</SelectItem>
                            <SelectItem value="printer">Printer</SelectItem>
                            <SelectItem value="network">Network</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                          <SelectTrigger className="w-32 h-9 bg-white border-[#D0D0D0]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  {filteredInventory.length === 0 ? (
                    <div className="p-8">
                      <Empty className="py-12">
                        <EmptyHeader>
                          <EmptyTitle>No Equipment Found</EmptyTitle>
                          <EmptyDescription>
                            No hardware matches your current filters. Try adjusting your search.
                          </EmptyDescription>
                        </EmptyHeader>
                      </Empty>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#003366]/10 hover:bg-[#003366]/10">
                          <TableHead className="text-label-md text-[#003366] h-12 px-4">Asset Tag</TableHead>
                          <TableHead className="text-label-md text-[#003366]">Equipment</TableHead>
                          <TableHead className="text-label-md text-[#003366]">Type</TableHead>
                          <TableHead className="text-label-md text-[#003366]">Site</TableHead>
                          <TableHead className="text-label-md text-[#003366]">Status</TableHead>
                          <TableHead className="text-label-md text-[#003366]">Condition</TableHead>
                          <TableHead className="text-label-md text-[#003366]">Assigned To</TableHead>
                          <TableHead className="text-label-md text-[#003366] text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedInventory.map((item, index: number) => {
                          const TypeIcon = equipmentIcons[item.type] || Package;
                          return (
                            <TableRow 
                              key={item.id} 
                              className={cn(
                                "h-[52px] border-b border-[#EEEEEE] transition-standard cursor-pointer",
                                index % 2 === 1 && "bg-[#FAFAFA]",
                                "hover:bg-[#003366]/10"
                              )}
                            >
                              <TableCell className="px-4">
                                <span className="text-body-md font-semibold text-[#003366]">
                                  {item.assetTag}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <TypeIcon className="h-4 w-4 text-[#5C5C5C]" />
                                  <span className="text-body-md text-[#1C1C1C]">{item.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-body-md text-[#5C5C5C] capitalize">{item.type}</span>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-[#F5F5F5] text-[#424242] border-0 text-[10px]">
                                  {item.site}
                                </Badge>
                              </TableCell>
                              <TableCell>{getStatusBadge(item.status)}</TableCell>
                              <TableCell>{getConditionBadge(item.condition)}</TableCell>
                              <TableCell>
                                <span className="text-body-md text-[#1C1C1C]">{item.assignedTo}</span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-[#5C5C5C] hover:text-[#003366]"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-[#5C5C5C] hover:text-[#003366]"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                      <DropdownMenuItem>Transfer</DropdownMenuItem>
                                      <DropdownMenuItem>Schedule Audit</DropdownMenuItem>
                                      <DropdownMenuItem className="text-destructive">Retire</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}

                  {/* Pagination */}
                  {filteredInventory.length > ITEMS_PER_PAGE && (
                    <div className="flex items-center justify-center gap-2 py-4 border-t border-[#EEEEEE]">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={cn(
                          "h-8 px-3 text-body-sm border-[#D0D0D0]",
                          currentPage === 1 && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_: unknown, i: number) => (
                          <Button
                            key={i + 1}
                            variant={currentPage === i + 1 ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handlePageChange(i + 1)}
                            className={cn(
                              "h-8 w-8 text-body-sm",
                              currentPage === i + 1
                                ? "bg-[#003366] hover:bg-[#002244] text-white"
                                : "border-[#D0D0D0] hover:bg-[#F5F5F5]"
                            )}
                          >
                            {i + 1}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={cn(
                          "h-8 px-3 text-body-sm border-[#D0D0D0]",
                          currentPage === totalPages && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {/* Server Monitoring Table */}
            {activeTab === 'servers' && (
              <motion.div variants={itemVariants}>
                <Card className="card-default elevation-2 border-[#D0D0D0] rounded-xl overflow-hidden">
                  <div className="bg-[#003366]/10 px-4 py-3 border-b border-[#003366]/20">
                    <div className="flex items-center justify-between">
                      <h2 className="text-section-heading text-[#003366]">Server Status Dashboard</h2>
                      <Button size="sm" className="btn-primary h-8 gap-2">
                        <RefreshCcw className="h-3.5 w-3.5" />
                        Refresh
                      </Button>
                    </div>
                  </div>

                  {servers.length === 0 ? (
                    <div className="p-8">
                      <Empty className="py-12">
                        <EmptyHeader>
                          <EmptyTitle>No Server Checklist Records</EmptyTitle>
                          <EmptyDescription>
                            Server checklist entries will appear here once submitted via SRVR form.
                          </EmptyDescription>
                        </EmptyHeader>
                      </Empty>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                      {servers.map((server) => {
                        const hasReview = server.reviewedDate !== null;
                        return (
                          <Card key={server.id} className="border-[#D0D0D0] hover:shadow-md transition-standard">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="text-body-md font-semibold text-[#1C1C1C]">{server.name}</h3>
                                  <p className="text-meta text-[#5C5C5C]">{server.site}</p>
                                </div>
                                <Badge
                                  className="text-[10px] border-0"
                                  style={{ backgroundColor: hasReview ? '#E8F5E9' : '#FFF8E1', color: hasReview ? '#166534' : '#5A4A00' }}
                                >
                                  {hasReview ? 'Reviewed' : 'Pending'}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-meta">
                                <div>
                                  <p className="text-[#5C5C5C]">Checklist Year</p>
                                  <p className="text-body-sm font-medium text-[#1C1C1C]">{server.checklistYear}</p>
                                </div>
                                <div>
                                  <p className="text-[#5C5C5C]">Reviewed By</p>
                                  <p className="text-body-sm font-medium text-[#1C1C1C] truncate">{server.reviewedBy}</p>
                                </div>
                              </div>
                              {server.reviewedDate && (
                                <p className="text-meta text-[#5C5C5C] mt-3">
                                  Last reviewed: {format(server.reviewedDate, 'dd MMM yyyy')}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {/* Available Forms */}
            <motion.div variants={itemVariants}>
              <h2 className="text-section-heading text-[#1C1C1C] mb-4">Available Forms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {M3_FORMS.map((form: ITFormConfig) => {
                  const FormIcon: LucideIcon = form.icon;
                  return (
                    <Card
                      key={form.code}
                      className="card-interactive cursor-pointer border-[#D0D0D0] bg-white rounded-xl"
                      onClick={() => navigate(`/it/forms/${form.code.toLowerCase()}/new`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className="p-2.5 rounded-lg flex-shrink-0"
                            style={{ backgroundColor: `${form.color}15` }}
                          >
                            <FormIcon className="h-5 w-5" style={{ color: form.color }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <Badge className="bg-[#003366]/10 text-[#166534] border-0 text-[10px] font-semibold">
                                {form.code}
                              </Badge>
                              {form.hasConditionalSections && (
                                <Badge className="bg-[#EAF0FB] text-[#1752A8] border-0 text-[10px]">
                                  Stage-gated
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-body-md font-medium text-[#1C1C1C] line-clamp-1">
                              {form.name}
                            </h3>
                            <p className="text-meta text-[#5C5C5C] mt-1">
                              {form.stages.length} stages • {form.sections.length} sections
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-[#5C5C5C] flex-shrink-0 mt-1" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Equipment by Type Widget */}
            <motion.div variants={itemVariants}>
              <Card className="card-default elevation-1 border-[#D0D0D0] rounded-xl">
                <CardHeader className="pb-3 border-b border-[#EEEEEE]">
                  <CardTitle className="text-label-lg text-[#1C1C1C]">Equipment by Type</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {[
                      { type: 'laptop', label: 'Laptops', color: '#4f46e5' },
                      { type: 'desktop', label: 'Desktops', color: '#0ea5e9' },
                      { type: 'server', label: 'Servers', color: '#ef4444' },
                      { type: 'printer', label: 'Printers', color: '#f59e0b' },
                      { type: 'network', label: 'Network', color: '#10b981' },
                      { type: 'other', label: 'Other', color: '#8b5cf6' },
                    ].map((item) => {
                      const count = inventory.filter(i => i.type === item.type).length;
                      if (count === 0) return null;
                      const Icon = equipmentIcons[item.type] || Package;
                      return (
                        <div key={item.type} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="h-8 w-8 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${item.color}15` }}
                            >
                              <Icon className="h-4 w-4" style={{ color: item.color }} />
                            </div>
                            <span className="text-body-sm text-[#1C1C1C]">{item.label}</span>
                          </div>
                          <Badge className="bg-[#F5F5F5] text-[#424242] border-0 text-[11px]">
                            {count}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity Widget */}
            <motion.div variants={itemVariants}>
              <Card className="card-default elevation-1 border-[#D0D0D0] rounded-xl">
                <CardHeader className="pb-3 border-b border-[#EEEEEE]">
                  <CardTitle className="text-label-lg text-[#1C1C1C]">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {inventory.length === 0 ? (
                      <p className="text-body-sm text-[#5C5C5C]">No recent activity.</p>
                    ) : (
                      [...inventory]
                        .filter(i => i.lastAudit !== null)
                        .sort((a, b) => (b.lastAudit?.getTime() ?? 0) - (a.lastAudit?.getTime() ?? 0))
                        .slice(0, 5)
                        .map((item) => {
                          const TypeIcon = equipmentIcons[item.type] || Package;
                          return (
                            <div key={item.id} className="flex items-start gap-3">
                              <div className="h-8 w-8 rounded-full bg-[#003366]/10 flex items-center justify-center flex-shrink-0">
                                <TypeIcon className="h-4 w-4 text-[#003366]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-body-sm text-[#1C1C1C] truncate">{item.name}</p>
                                <p className="text-meta text-[#5C5C5C]">
                                  {item.assetTag} • {item.lastAudit ? format(item.lastAudit, 'dd MMM yyyy') : '-'}
                                </p>
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Alerts Widget */}
            <motion.div variants={itemVariants}>
              <Card className="card-default elevation-1 border-[#D0D0D0] rounded-xl border-l-4 border-l-[#5A4A00]">
                <CardHeader className="pb-3 border-b border-[#EEEEEE]">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-[#5A4A00]" />
                    <CardTitle className="text-label-lg text-[#1C1C1C]">Attention Required</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {(() => {
                      const unaudited = inventory.filter(i => i.lastAudit === null).length;
                      const maintenance = inventory.filter(i => i.status === 'maintenance').length;
                      const inactive = inventory.filter(i => i.status === 'inactive').length;
                      const alerts = [
                        unaudited > 0 && { label: `${unaudited} item${unaudited > 1 ? 's' : ''} never audited`, sub: 'No audit record found', bg: '#FFF8E1', color: '#5A4A00' },
                        maintenance > 0 && { label: `${maintenance} item${maintenance > 1 ? 's' : ''} under maintenance`, sub: 'Pending repair or return', bg: '#FFF3E0', color: '#7B3E00' },
                        inactive > 0 && { label: `${inactive} inactive item${inactive > 1 ? 's' : ''}`, sub: 'Consider disposal or reallocation', bg: '#FDEDEA', color: '#9B2F23' },
                      ].filter(Boolean) as { label: string; sub: string; bg: string; color: string }[];
                      if (alerts.length === 0) {
                        return <p className="text-body-sm text-[#166534]">All items are in good standing.</p>;
                      }
                      return alerts.map((alert, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-2 rounded-lg" style={{ backgroundColor: alert.bg }}>
                          <div className="flex-1">
                            <p className="text-body-sm font-medium text-[#1C1C1C]">{alert.label}</p>
                            <p className="text-meta" style={{ color: alert.color }}>{alert.sub}</p>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Help Card */}
            <motion.div variants={itemVariants}>
              <Card className="approval-panel bg-[#003366]/10 border-[#003366]/20 rounded-xl">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[#003366]/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-[#003366]" />
                    </div>
                    <div>
                      <h3 className="text-label-md text-[#003366] mb-1">Inventory Audit</h3>
                      <p className="text-body-sm text-[#003366]/80">
                        Export audit certificate for compliance reporting.
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-8 text-[#003366] hover:bg-[#003366]/10 px-0"
                      >
                        Generate Report →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Form Picker Dialog */}
      <Dialog open={showFormPicker} onOpenChange={setShowFormPicker}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-screen-title">Add Inventory</DialogTitle>
            <DialogDescription className="text-body-md text-[#5C5C5C]">
              Select the type of inventory to register
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            {M3_FORMS.map((form: ITFormConfig) => {
              const FormIcon: LucideIcon = form.icon;
              return (
                <Card
                  key={form.code}
                  className="cursor-pointer hover:bg-[#FAFAFA] transition-standard border-[#D0D0D0]"
                  onClick={() => handleSelectForm(form.code)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: `${form.color}15` }}
                      >
                        <FormIcon className="h-4 w-4" style={{ color: form.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <Badge className="bg-[#003366] text-white border-0 text-[10px]">
                            {form.code}
                          </Badge>
                          <span className="text-meta text-[#5C5C5C]">
                            {form.database}
                          </span>
                        </div>
                        <h4 className="text-body-md font-medium text-[#1C1C1C]">{form.name}</h4>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#5C5C5C] flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}