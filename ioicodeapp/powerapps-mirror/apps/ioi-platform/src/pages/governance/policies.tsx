// Policy Management with Document Control
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Search,
  Filter,
  Download,
  Plus,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  History,
  Mail,
  Phone,
  Building2,
  Calendar,
  Tag,
  Users,
  ExternalLink,
  Bookmark,
  MoreVertical,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import { IGFooterBar } from '@/components/layout/ig-footer-bar';
import { toast } from 'sonner';
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.08 },
  },
} as const;

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.25, ease: [0.2, 0, 0, 1] } },
} as const;

// Policy categories
const categories = [
  { id: 'all', label: 'All Policies', count: 156 },
  { id: 'hr', label: 'Human Resources', count: 42 },
  { id: 'hse', label: 'Health & Safety', count: 35 },
  { id: 'finance', label: 'Finance', count: 28 },
  { id: 'it', label: 'Information Technology', count: 24 },
  { id: 'quality', label: 'Quality Assurance', count: 18 },
  { id: 'sustainability', label: 'Sustainability', count: 9 },
];

// Policies data
const policies = [
  {
    id: 'POL-001',
    title: 'Employee Code of Conduct',
    category: 'hr',
    version: '4.2',
    status: 'active',
    effectiveDate: '2026-01-15',
    reviewDate: '2027-01-15',
    lastModified: '2026-01-10',
    author: { name: 'Fatimah Abdullah', email: 'fatimah.a@ioi.com', phone: '+60 12-678-9012', department: 'HR' },
    approver: 'Ahmad Razak',
    views: 1245,
    bookmarks: 89,
    versionHistory: [
      { version: '4.2', date: '2026-01-10', changes: 'Updated remote work guidelines' },
      { version: '4.1', date: '2025-07-15', changes: 'Added social media policy section' },
      { version: '4.0', date: '2025-01-20', changes: 'Major revision - annual update' },
    ],
  },
  {
    id: 'POL-002',
    title: 'Workplace Safety Procedures',
    category: 'hse',
    version: '3.1',
    status: 'active',
    effectiveDate: '2026-02-01',
    reviewDate: '2026-08-01',
    lastModified: '2026-01-28',
    author: { name: 'Lee Ming Hao', email: 'ming.hao@ioi.com', phone: '+60 12-567-8901', department: 'HSE' },
    approver: 'Sarah Wong',
    views: 892,
    bookmarks: 156,
    versionHistory: [
      { version: '3.1', date: '2026-01-28', changes: 'Updated emergency evacuation routes' },
      { version: '3.0', date: '2025-08-15', changes: 'Added COVID-19 protocols' },
    ],
  },
  {
    id: 'POL-003',
    title: 'Data Protection & Privacy Policy',
    category: 'it',
    version: '2.5',
    status: 'under-review',
    effectiveDate: '2025-06-01',
    reviewDate: '2026-06-01',
    lastModified: '2026-04-20',
    author: { name: 'Nurul Huda', email: 'nurul.h@ioi.com', phone: '+60 12-012-3456', department: 'Legal' },
    approver: 'Jason Lim',
    views: 567,
    bookmarks: 78,
    versionHistory: [
      { version: '2.5', date: '2026-04-20', changes: 'PDPA compliance updates - pending review' },
      { version: '2.4', date: '2025-12-10', changes: 'Added data breach notification procedure' },
    ],
  },
  {
    id: 'POL-004',
    title: 'Travel & Expense Policy',
    category: 'finance',
    version: '5.0',
    status: 'active',
    effectiveDate: '2026-03-01',
    reviewDate: '2027-03-01',
    lastModified: '2026-02-25',
    author: { name: 'Tan Wei Lin', email: 'wei.lin@ioi.com', phone: '+60 12-890-1234', department: 'Finance' },
    approver: 'Ahmad Razak',
    views: 2134,
    bookmarks: 312,
    versionHistory: [
      { version: '5.0', date: '2026-02-25', changes: 'New mileage rates and per diem allowances' },
      { version: '4.3', date: '2025-09-01', changes: 'Updated hotel booking guidelines' },
    ],
  },
  {
    id: 'POL-005',
    title: 'Environmental Management System',
    category: 'sustainability',
    version: '2.1',
    status: 'active',
    effectiveDate: '2026-01-01',
    reviewDate: '2026-12-31',
    lastModified: '2025-12-20',
    author: { name: 'Raj Kumar', email: 'raj.kumar@ioi.com', phone: '+60 12-789-0123', department: 'Sustainability' },
    approver: 'Sarah Wong',
    views: 445,
    bookmarks: 67,
    versionHistory: [
      { version: '2.1', date: '2025-12-20', changes: 'Updated waste management procedures' },
      { version: '2.0', date: '2025-06-15', changes: 'ISO 14001 alignment' },
    ],
  },
  {
    id: 'POL-006',
    title: 'Quality Control Standards',
    category: 'quality',
    version: '3.3',
    status: 'expiring',
    effectiveDate: '2025-05-01',
    reviewDate: '2026-05-01',
    lastModified: '2025-04-25',
    author: { name: 'Ahmad Razak', email: 'ahmad.razak@ioi.com', phone: '+60 12-345-6789', department: 'QA' },
    approver: 'Lee Ming Hao',
    views: 678,
    bookmarks: 92,
    versionHistory: [
      { version: '3.3', date: '2025-04-25', changes: 'Updated inspection checklists' },
      { version: '3.2', date: '2024-11-10', changes: 'Added new product testing procedures' },
    ],
  },
  {
    id: 'POL-007',
    title: 'IT Security & Access Control',
    category: 'it',
    version: '4.0',
    status: 'active',
    effectiveDate: '2026-04-01',
    reviewDate: '2026-10-01',
    lastModified: '2026-03-28',
    author: { name: 'Jason Lim', email: 'jason.lim@ioi.com', phone: '+60 12-901-2345', department: 'IT Security' },
    approver: 'Nurul Huda',
    views: 1023,
    bookmarks: 145,
    versionHistory: [
      { version: '4.0', date: '2026-03-28', changes: 'Zero Trust architecture implementation' },
      { version: '3.5', date: '2025-10-15', changes: 'MFA requirements update' },
    ],
  },
  {
    id: 'POL-008',
    title: 'Leave & Attendance Policy',
    category: 'hr',
    version: '6.1',
    status: 'active',
    effectiveDate: '2026-01-01',
    reviewDate: '2027-01-01',
    lastModified: '2025-12-15',
    author: { name: 'Fatimah Abdullah', email: 'fatimah.a@ioi.com', phone: '+60 12-678-9012', department: 'HR' },
    approver: 'Ahmad Razak',
    views: 3456,
    bookmarks: 567,
    versionHistory: [
      { version: '6.1', date: '2025-12-15', changes: 'Updated public holiday calendar' },
      { version: '6.0', date: '2025-06-01', changes: 'Added flexible work arrangements' },
    ],
  },
];

type Policy = typeof policies[0];

function getStatusBadge(status: string) {
  switch (status) {
    case 'active':
      return <Badge className="bg-[#006a6a]/10 text-[#006a6a] border-0 gap-1 ig-label-caps text-[9px]"><CheckCircle2 className="h-3 w-3" />Active</Badge>;
    case 'under-review':
      return <Badge className="bg-[#d97706]/10 text-[#d97706] border-0 gap-1 ig-label-caps text-[9px]"><Clock className="h-3 w-3" />Under Review</Badge>;
    case 'expiring':
      return <Badge className="bg-[#ba1a1a]/10 text-[#ba1a1a] border-0 gap-1 ig-label-caps text-[9px]"><AlertCircle className="h-3 w-3" />Expiring Soon</Badge>;
    case 'draft':
      return <Badge className="bg-muted text-muted-foreground border-0 gap-1 ig-label-caps text-[9px]"><Edit2 className="h-3 w-3" />Draft</Badge>;
    default:
      return null;
  }
}

function getCategoryBadge(categoryId: string) {
  const category = categories.find((c) => c.id === categoryId);
  return category ? category.label : categoryId;
}

export default function PolicyManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);

  const filteredPolicies = useMemo(() => {
    return policies.filter((policy: Policy) => {
      const matchesSearch = 
        policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || policy.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || policy.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchQuery, categoryFilter, statusFilter]);

  const handlePolicyClick = (policy: Policy) => {
    setSelectedPolicy(policy);
    setDetailPanelOpen(true);
  };

  return (
    <>
    <div className="min-h-screen bg-[#f9f9fe] pb-10">
      {/* Page Header */}
      <div className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#003366] flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="ig-heading-lg text-foreground">Policy Management</h1>
                <p className="ig-data-text-sm text-muted-foreground">Document control and version management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-border"
                onClick={() => toast.success('Policy list exported successfully')}
              >
                <Download className="h-4 w-4" />
                Export List
              </Button>
              <Button 
                size="sm" 
                className="gap-2 bg-[#003366] hover:bg-[#002244]"
                onClick={() => toast.info('Policy creation wizard coming soon')}
              >
                <Plus className="h-4 w-4" />
                New Policy
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border-b border-border px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search policies..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-9 w-72 h-9 bg-muted/50 border-border"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-44 h-9 bg-muted/50 border-border">
                  <Tag className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label} ({cat.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36 h-9 bg-muted/50 border-border">
                  <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="expiring">Expiring Soon</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="ig-data-text-sm text-muted-foreground">
              Showing {filteredPolicies.length} of {policies.length} policies
            </div>
          </div>
        </div>
      </div>

      {/* Policy Table */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Card className="bg-white border-border shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="ig-zebra-header">
            <div className="w-24">Policy ID</div>
            <div className="flex-1">Title</div>
            <div className="w-36">Category</div>
            <div className="w-20 text-center">Version</div>
            <div className="w-28">Status</div>
            <div className="w-28">Review Date</div>
            <div className="w-20 text-center">Views</div>
            <div className="w-10" />
          </div>

          {/* Table Rows */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {filteredPolicies.map((policy: Policy, index: number) => (
              <motion.div
                key={policy.id}
                variants={rowVariants}
                className={cn(
                  'ig-zebra-row cursor-pointer',
                  index % 2 === 0 ? 'bg-white' : 'bg-muted/50/50',
                  selectedPolicy?.id === policy.id && 'bg-[#003366]/5 border-l-2 border-l-[#003366]'
                )}
                onClick={() => handlePolicyClick(policy)}
              >
                <div className="w-24">
                  <span className="ig-asset-tag text-[10px] px-2 py-0.5">{policy.id}</span>
                </div>
                <div className="flex-1">
                  <p className="ig-data-text font-medium text-foreground truncate">{policy.title}</p>
                  <p className="ig-data-text-sm text-muted-foreground truncate">by {policy.author.name}</p>
                </div>
                <div className="w-36">
                  <Badge variant="outline" className="border-border text-muted-foreground ig-data-text-sm">
                    {getCategoryBadge(policy.category)}
                  </Badge>
                </div>
                <div className="w-20 text-center">
                  <span className="ig-mono font-semibold text-foreground">v{policy.version}</span>
                </div>
                <div className="w-28">
                  {getStatusBadge(policy.status)}
                </div>
                <div className="w-28">
                  <span className="ig-data-text-sm text-muted-foreground">
                    {new Date(policy.reviewDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="w-20 text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span className="ig-data-text-sm">{policy.views.toLocaleString()}</span>
                  </div>
                </div>
                <div className="w-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Policy
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <History className="h-4 w-4 mr-2" />
                        Version History
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-[#ba1a1a]">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Card>
      </div>

      {/* Detail Panel (Sheet) */}
      <Sheet open={detailPanelOpen} onOpenChange={setDetailPanelOpen}>
        <SheetContent className="w-[400px] sm:w-[480px] p-0 border-l-slate-200">
          {selectedPolicy && (
            <>
              <SheetHeader className="bg-[#003366] text-white p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className="bg-white/20 text-white border-0 ig-label-caps text-[10px] mb-2">
                      {selectedPolicy.id}
                    </Badge>
                    <SheetTitle className="text-white ig-heading-lg leading-snug">
                      {selectedPolicy.title}
                    </SheetTitle>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <Badge className="bg-white/20 text-white border-0 text-xs">
                    v{selectedPolicy.version}
                  </Badge>
                  {getStatusBadge(selectedPolicy.status)}
                </div>
              </SheetHeader>

              <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="p-6 space-y-6">
                  {/* Policy Metadata */}
                  <div className="ig-bento-card">
                    <div className="ig-bento-card-header">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Policy Details</span>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="ig-data-text-sm text-muted-foreground">Category</span>
                        <Badge variant="outline" className="border-border text-muted-foreground">
                          {getCategoryBadge(selectedPolicy.category)}
                        </Badge>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="ig-data-text-sm text-muted-foreground">Effective Date</span>
                        <span className="ig-data-text font-medium text-foreground">
                          {new Date(selectedPolicy.effectiveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="ig-data-text-sm text-muted-foreground">Review Date</span>
                        <span className="ig-data-text font-medium text-[#003366]">
                          {new Date(selectedPolicy.reviewDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="ig-data-text-sm text-muted-foreground">Last Modified</span>
                        <span className="ig-data-text text-muted-foreground">
                          {new Date(selectedPolicy.lastModified).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="ig-data-text-sm text-muted-foreground">Approved By</span>
                        <span className="ig-data-text font-medium text-foreground">{selectedPolicy.approver}</span>
                      </div>
                    </div>
                  </div>

                  {/* Engagement Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="ig-bento-card text-center py-4">
                      <Eye className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                      <div className="ig-kpi text-xl text-foreground">{selectedPolicy.views.toLocaleString()}</div>
                      <div className="ig-label-caps text-[8px] text-muted-foreground">Total Views</div>
                    </div>
                    <div className="ig-bento-card text-center py-4">
                      <Bookmark className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                      <div className="ig-kpi text-xl text-foreground">{selectedPolicy.bookmarks}</div>
                      <div className="ig-label-caps text-[8px] text-muted-foreground">Bookmarked</div>
                    </div>
                  </div>

                  {/* Policy Author/PIC */}
                  <div className="ig-bento-card">
                    <div className="ig-bento-card-header">
                      <Users className="h-3.5 w-3.5" />
                      <span>Policy Author</span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12 border-2 border-border">
                          <AvatarFallback className="bg-[#003366]/10 text-[#003366] ig-label-caps">
                            {selectedPolicy.author.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="ig-data-text font-semibold text-foreground">{selectedPolicy.author.name}</p>
                          <p className="ig-data-text-sm text-muted-foreground">{selectedPolicy.author.department}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <a href={`mailto:${selectedPolicy.author.email}`} className="flex items-center gap-1 text-[#003366] hover:underline ig-data-text-sm">
                              <Mail className="h-3 w-3" />
                              Email
                            </a>
                            <a href={`tel:${selectedPolicy.author.phone}`} className="flex items-center gap-1 text-[#003366] hover:underline ig-data-text-sm">
                              <Phone className="h-3 w-3" />
                              Call
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Version History */}
                  <div className="ig-bento-card">
                    <div className="ig-bento-card-header">
                      <History className="h-3.5 w-3.5" />
                      <span>Version History</span>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        {selectedPolicy.versionHistory.map((version, idx: number) => (
                          <div key={version.version} className="relative pl-4">
                            {idx < selectedPolicy.versionHistory.length - 1 && (
                              <div className="absolute left-[5px] top-5 bottom-0 w-px bg-muted" />
                            )}
                            <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-[#003366] ring-2 ring-white" />
                            <div className="pb-3">
                              <div className="flex items-center gap-2">
                                <span className="ig-mono font-semibold text-foreground">v{version.version}</span>
                                <span className="ig-data-text-sm text-muted-foreground">
                                  {new Date(version.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                              <p className="ig-data-text-sm text-muted-foreground mt-0.5">{version.changes}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-[#003366] hover:bg-[#002244] gap-2"
                      onClick={() => toast.info(`Opening document: ${selectedPolicy.title}`)}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open Document
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-border gap-2"
                      onClick={() => toast.success(`Review request sent to ${selectedPolicy.approver}`)}
                    >
                      <Mail className="h-4 w-4" />
                      Request Review
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>

    {/* Footer Bar */}
    <IGFooterBar activeAudit="Policy Management" syncStatus="synced" lastSync="Just now" />
    </>
  );
}