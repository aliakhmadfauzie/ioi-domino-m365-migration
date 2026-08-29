// Audit Monitoring - Compliance Heatmap
import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  Search,
  Filter,
  Download,
  Plus,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  FileSearch,
  BarChart3,
  Eye,
  Mail,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
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
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { IGFooterBar } from '@/components/layout/ig-footer-bar';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
} as const;

const cellVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: [0.2, 0, 0, 1] } },
} as const;

// Audit areas for heatmap
const auditAreas = [
  {
    id: 'iso-9001',
    name: 'ISO 9001',
    category: 'Quality',
    compliance: 96,
    status: 'compliant',
    lastAudit: '2026-03-15',
    nextAudit: '2026-09-15',
    findings: { open: 2, closed: 18 },
    pic: { name: 'Ahmad Razak', email: 'ahmad.razak@ioi.com' },
  },
  {
    id: 'iso-14001',
    name: 'ISO 14001',
    category: 'Environment',
    compliance: 92,
    status: 'compliant',
    lastAudit: '2026-02-20',
    nextAudit: '2026-08-20',
    findings: { open: 4, closed: 12 },
    pic: { name: 'Raj Kumar', email: 'raj.kumar@ioi.com' },
  },
  {
    id: 'iso-45001',
    name: 'ISO 45001',
    category: 'Safety',
    compliance: 88,
    status: 'attention',
    lastAudit: '2026-04-01',
    nextAudit: '2026-10-01',
    findings: { open: 6, closed: 14 },
    pic: { name: 'Lee Ming Hao', email: 'ming.hao@ioi.com' },
  },
  {
    id: 'labor-law',
    name: 'Labor Laws',
    category: 'Legal',
    compliance: 72,
    status: 'critical',
    lastAudit: '2026-01-10',
    nextAudit: '2026-07-10',
    findings: { open: 12, closed: 8 },
    pic: { name: 'Nurul Huda', email: 'nurul.h@ioi.com' },
  },
  {
    id: 'mspo',
    name: 'MSPO',
    category: 'Sustainability',
    compliance: 94,
    status: 'compliant',
    lastAudit: '2026-02-28',
    nextAudit: '2026-08-28',
    findings: { open: 3, closed: 22 },
    pic: { name: 'Sarah Wong', email: 'sarah.wong@ioi.com' },
  },
  {
    id: 'rspo',
    name: 'RSPO',
    category: 'Sustainability',
    compliance: 91,
    status: 'compliant',
    lastAudit: '2026-03-10',
    nextAudit: '2026-09-10',
    findings: { open: 5, closed: 15 },
    pic: { name: 'Sarah Wong', email: 'sarah.wong@ioi.com' },
  },
  {
    id: 'food-safety',
    name: 'Food Safety',
    category: 'Quality',
    compliance: 97,
    status: 'compliant',
    lastAudit: '2026-04-05',
    nextAudit: '2026-10-05',
    findings: { open: 1, closed: 24 },
    pic: { name: 'Ahmad Razak', email: 'ahmad.razak@ioi.com' },
  },
  {
    id: 'data-protection',
    name: 'PDPA',
    category: 'Legal',
    compliance: 85,
    status: 'attention',
    lastAudit: '2026-01-25',
    nextAudit: '2026-07-25',
    findings: { open: 7, closed: 9 },
    pic: { name: 'Jason Lim', email: 'jason.lim@ioi.com' },
  },
  {
    id: 'fire-safety',
    name: 'Fire Safety',
    category: 'Safety',
    compliance: 98,
    status: 'compliant',
    lastAudit: '2026-03-20',
    nextAudit: '2026-09-20',
    findings: { open: 1, closed: 19 },
    pic: { name: 'Lee Ming Hao', email: 'ming.hao@ioi.com' },
  },
  {
    id: 'chemical-safety',
    name: 'Chemical Handling',
    category: 'Safety',
    compliance: 79,
    status: 'critical',
    lastAudit: '2026-02-15',
    nextAudit: '2026-08-15',
    findings: { open: 9, closed: 11 },
    pic: { name: 'Lee Ming Hao', email: 'ming.hao@ioi.com' },
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    category: 'IT',
    compliance: 89,
    status: 'attention',
    lastAudit: '2026-03-28',
    nextAudit: '2026-09-28',
    findings: { open: 5, closed: 17 },
    pic: { name: 'Jason Lim', email: 'jason.lim@ioi.com' },
  },
  {
    id: 'financial-audit',
    name: 'Financial Controls',
    category: 'Finance',
    compliance: 95,
    status: 'compliant',
    lastAudit: '2026-04-10',
    nextAudit: '2026-10-10',
    findings: { open: 2, closed: 28 },
    pic: { name: 'Tan Wei Lin', email: 'wei.lin@ioi.com' },
  },
];

type AuditArea = typeof auditAreas[0];

const categories = ['All', 'Quality', 'Environment', 'Safety', 'Legal', 'Sustainability', 'IT', 'Finance'];

function getComplianceColor(compliance: number) {
  if (compliance >= 90) return 'bg-[#006a6a]';
  if (compliance >= 80) return 'bg-[#d97706]';
  return 'bg-[#ba1a1a]';
}

function getComplianceBgColor(compliance: number) {
  if (compliance >= 90) return 'bg-[#006a6a]/10';
  if (compliance >= 80) return 'bg-[#d97706]/10';
  return 'bg-[#ba1a1a]/10';
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'compliant':
      return <Badge className="bg-[#006a6a]/10 text-[#006a6a] border-0 gap-1 ig-label-caps text-[9px]"><CheckCircle2 className="h-3 w-3" />Compliant</Badge>;
    case 'attention':
      return <Badge className="bg-[#d97706]/10 text-[#d97706] border-0 gap-1 ig-label-caps text-[9px]"><Clock className="h-3 w-3" />Needs Attention</Badge>;
    case 'critical':
      return <Badge className="bg-[#ba1a1a]/10 text-[#ba1a1a] border-0 gap-1 ig-label-caps text-[9px]"><XCircle className="h-3 w-3" />Critical</Badge>;
    default:
      return null;
  }
}

export default function AuditMonitoringPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedArea, setSelectedArea] = useState<AuditArea | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);

  const filteredAreas = useMemo(() => {
    return auditAreas.filter((area: AuditArea) => {
      const matchesSearch = area.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || area.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  const stats = useMemo(() => {
    const total = auditAreas.length;
    const compliant = auditAreas.filter((a: AuditArea) => a.status === 'compliant').length;
    const attention = auditAreas.filter((a: AuditArea) => a.status === 'attention').length;
    const critical = auditAreas.filter((a: AuditArea) => a.status === 'critical').length;
    const avgCompliance = Math.round(auditAreas.reduce((sum: number, a: AuditArea) => sum + a.compliance, 0) / total);
    const totalOpenFindings = auditAreas.reduce((sum: number, a: AuditArea) => sum + a.findings.open, 0);
    return { total, compliant, attention, critical, avgCompliance, totalOpenFindings };
  }, []);

  const handleAreaClick = (area: AuditArea) => {
    setSelectedArea(area);
    setDetailPanelOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f9f9fe] pb-10">
      {/* Page Header */}
      <div className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#003366] flex items-center justify-center">
                <FileSearch className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="ig-heading-lg text-foreground">Audit Monitoring</h1>
                <p className="ig-data-text-sm text-muted-foreground">Compliance heatmap and audit tracking</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-border"
                onClick={() => toast.success('Audit report exported successfully')}
              >
                <Download className="h-4 w-4" />
                Export Report
              </Button>
              <Button 
                size="sm" 
                className="gap-2 bg-[#003366] hover:bg-[#002244]"
                onClick={() => toast.info('New audit scheduling coming soon')}
              >
                <Plus className="h-4 w-4" />
                New Audit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-6 gap-6">
            <div className="text-center">
              <div className="ig-kpi text-2xl text-foreground">{stats.avgCompliance}%</div>
              <div className="ig-label-caps text-[9px] text-muted-foreground">Avg Compliance</div>
            </div>
            <div className="text-center">
              <div className="ig-kpi text-2xl text-foreground">{stats.total}</div>
              <div className="ig-label-caps text-[9px] text-muted-foreground">Audit Areas</div>
            </div>
            <div className="text-center">
              <div className="ig-kpi text-2xl text-[#006a6a]">{stats.compliant}</div>
              <div className="ig-label-caps text-[9px] text-muted-foreground">Compliant</div>
            </div>
            <div className="text-center">
              <div className="ig-kpi text-2xl text-[#d97706]">{stats.attention}</div>
              <div className="ig-label-caps text-[9px] text-muted-foreground">Needs Attention</div>
            </div>
            <div className="text-center">
              <div className="ig-kpi text-2xl text-[#ba1a1a]">{stats.critical}</div>
              <div className="ig-label-caps text-[9px] text-muted-foreground">Critical</div>
            </div>
            <div className="text-center">
              <div className="ig-kpi text-2xl text-foreground">{stats.totalOpenFindings}</div>
              <div className="ig-label-caps text-[9px] text-muted-foreground">Open Findings</div>
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
                  placeholder="Search audit areas..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64 h-9 bg-muted/50 border-border"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40 h-9 bg-muted/50 border-border">
                  <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-[#006a6a]" />
                <span className="ig-data-text-sm text-muted-foreground">≥90%</span>
              </div>
              <div className="flex items-center gap-1.5 ml-3">
                <div className="w-3 h-3 rounded-sm bg-[#d97706]" />
                <span className="ig-data-text-sm text-muted-foreground">80-89%</span>
              </div>
              <div className="flex items-center gap-1.5 ml-3">
                <div className="w-3 h-3 rounded-sm bg-[#ba1a1a]" />
                <span className="ig-data-text-sm text-muted-foreground">&lt;80%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Heatmap Grid */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-4 gap-4"
        >
          {filteredAreas.map((area: AuditArea) => (
            <motion.div
              key={area.id}
              variants={cellVariants}
              onClick={() => handleAreaClick(area)}
              className={cn(
                'ig-bento-card cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] group',
                selectedArea?.id === area.id && 'ring-2 ring-[#003366]'
              )}
            >
              <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="outline" className="border-border text-muted-foreground ig-data-text-sm">
                    {area.category}
                  </Badge>
                  {getStatusBadge(area.status)}
                </div>

                {/* Name & Compliance */}
                <h3 className="ig-heading-md text-foreground mb-2">{area.name}</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn('w-16 h-16 rounded-lg flex items-center justify-center', getComplianceBgColor(area.compliance))}>
                    <span className={cn('ig-kpi text-2xl', 
                      area.compliance >= 90 ? 'text-[#006a6a]' : 
                      area.compliance >= 80 ? 'text-[#d97706]' : 'text-[#ba1a1a]'
                    )}>
                      {area.compliance}%
                    </span>
                  </div>
                  <div className="flex-1">
                    <Progress 
                      value={area.compliance} 
                      className={cn(
                        'h-2 bg-muted',
                        area.compliance >= 90 ? '[&>div]:bg-[#006a6a]' : 
                        area.compliance >= 80 ? '[&>div]:bg-[#d97706]' : '[&>div]:bg-[#ba1a1a]'
                      )}
                    />
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="ig-data-text-sm text-muted-foreground">Target: 90%</span>
                      {area.compliance >= 90 ? (
                        <TrendingUp className="h-3.5 w-3.5 text-[#006a6a]" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-[#ba1a1a]" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Findings */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-[#d97706]" />
                      <span className="ig-data-text-sm text-muted-foreground">{area.findings.open} open</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-[#006a6a]" />
                      <span className="ig-data-text-sm text-muted-foreground">{area.findings.closed} closed</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-[#003366] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Detail Panel */}
      <Sheet open={detailPanelOpen} onOpenChange={setDetailPanelOpen}>
        <SheetContent className="w-[400px] sm:w-[480px] p-0 border-l-slate-200">
          {selectedArea && (
            <>
              <SheetHeader className={cn('p-6', getComplianceColor(selectedArea.compliance))}>
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className="bg-white/20 text-white border-0 ig-label-caps text-[10px] mb-2">
                      {selectedArea.category}
                    </Badge>
                    <SheetTitle className="text-white ig-heading-lg leading-snug">
                      {selectedArea.name}
                    </SheetTitle>
                  </div>
                  <div className="text-right">
                    <div className="ig-kpi text-3xl text-white">{selectedArea.compliance}%</div>
                    <div className="ig-label-caps text-[9px] text-white/70">Compliance Score</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  {getStatusBadge(selectedArea.status)}
                </div>
              </SheetHeader>

              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="p-6 space-y-6">
                  {/* Audit Schedule */}
                  <div className="ig-bento-card">
                    <div className="ig-bento-card-header">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Audit Schedule</span>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="ig-data-text-sm text-muted-foreground">Last Audit</span>
                        <span className="ig-data-text font-medium text-foreground">
                          {new Date(selectedArea.lastAudit).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="ig-data-text-sm text-muted-foreground">Next Audit</span>
                        <span className="ig-data-text font-medium text-[#003366]">
                          {new Date(selectedArea.nextAudit).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Findings Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="ig-bento-card text-center py-4">
                      <AlertTriangle className="h-5 w-5 text-[#d97706] mx-auto mb-1" />
                      <div className="ig-kpi text-xl text-foreground">{selectedArea.findings.open}</div>
                      <div className="ig-label-caps text-[8px] text-muted-foreground">Open Findings</div>
                    </div>
                    <div className="ig-bento-card text-center py-4">
                      <CheckCircle2 className="h-5 w-5 text-[#006a6a] mx-auto mb-1" />
                      <div className="ig-kpi text-xl text-foreground">{selectedArea.findings.closed}</div>
                      <div className="ig-label-caps text-[8px] text-muted-foreground">Closed Findings</div>
                    </div>
                  </div>

                  {/* PIC Info */}
                  <div className="ig-bento-card">
                    <div className="ig-bento-card-header">
                      <Users className="h-3.5 w-3.5" />
                      <span>Audit PIC</span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-border">
                          <AvatarFallback className="bg-[#003366]/10 text-[#003366] ig-label-caps">
                            {selectedArea.pic.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="ig-data-text font-semibold text-foreground">{selectedArea.pic.name}</p>
                          <a href={`mailto:${selectedArea.pic.email}`} className="ig-data-text-sm text-[#003366] hover:underline">
                            {selectedArea.pic.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-[#003366] hover:bg-[#002244] gap-2"
                      onClick={() => toast.info(`Viewing findings for ${selectedArea.name}`)}
                    >
                      <Eye className="h-4 w-4" />
                      View Findings
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-border gap-2"
                      onClick={() => toast.success(`Alert sent to ${selectedArea.pic.name}`)}
                    >
                      <Mail className="h-4 w-4" />
                      Send Alert
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Footer Bar */}
      <IGFooterBar activeAudit="ISO 45001" syncStatus="synced" lastSync="Just now" />
    </div>
  );
}