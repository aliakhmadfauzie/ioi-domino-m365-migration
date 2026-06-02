/**
 * HR Job Descriptions Page
 * Manage job descriptions, requirements, and position details
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  FileText,
  Plus,
  Search,
  Filter,
  Building2,
  Users,
  Briefcase,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Edit,
  Eye,
  Copy,
  MoreHorizontal,
  Download,
  Trash2,
  TrendingUp,
  Star,
  Target,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';

// Types
interface JobDescription {
  id: string;
  jobCode: string;
  title: string;
  department: string;
  level: string;
  status: 'Active' | 'Draft' | 'Archived' | 'Under Review';
  headcount: number;
  filled: number;
  reportingTo: string;
  lastUpdated: string;
  createdBy: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  competencies: string[];
}

// Mock Data
const MOCK_JOB_DESCRIPTIONS: JobDescription[] = [
  {
    id: 'JD001',
    jobCode: 'OPS-001',
    title: 'Senior Plant Operator',
    department: 'Operations',
    level: 'Senior',
    status: 'Active',
    headcount: 5,
    filled: 4,
    reportingTo: 'Production Manager',
    lastUpdated: '2024-04-15',
    createdBy: 'HR Admin',
    summary: 'Responsible for operating and monitoring plant equipment, ensuring production targets are met while maintaining safety standards.',
    responsibilities: ['Operate chemical processing equipment', 'Monitor production parameters', 'Perform routine maintenance', 'Ensure compliance with safety protocols'],
    requirements: ['Diploma in Chemical Engineering', '5+ years experience', 'Valid safety certifications'],
    competencies: ['Technical aptitude', 'Problem solving', 'Safety consciousness'],
  },
  {
    id: 'JD002',
    jobCode: 'QA-002',
    title: 'Quality Assurance Analyst',
    department: 'Quality',
    level: 'Junior',
    status: 'Active',
    headcount: 3,
    filled: 3,
    reportingTo: 'QA Manager',
    lastUpdated: '2024-04-10',
    createdBy: 'HR Admin',
    summary: 'Perform quality testing and analysis to ensure products meet specifications and regulatory requirements.',
    responsibilities: ['Conduct laboratory tests', 'Document test results', 'Identify quality issues', 'Support audits'],
    requirements: ['Degree in Chemistry/Biochemistry', '2+ years experience', 'Knowledge of GMP/GLP'],
    competencies: ['Attention to detail', 'Analytical thinking', 'Documentation skills'],
  },
  {
    id: 'JD003',
    jobCode: 'RD-003',
    title: 'Research Scientist',
    department: 'R&D',
    level: 'Senior',
    status: 'Under Review',
    headcount: 2,
    filled: 1,
    reportingTo: 'R&D Director',
    lastUpdated: '2024-04-08',
    createdBy: 'R&D Manager',
    summary: 'Lead research initiatives to develop new products and improve existing formulations.',
    responsibilities: ['Design experiments', 'Analyze research data', 'Write technical reports', 'Collaborate with cross-functional teams'],
    requirements: ['PhD in Chemistry/Chemical Engineering', '3+ years R&D experience', 'Publication track record'],
    competencies: ['Innovation', 'Scientific rigor', 'Project management'],
  },
  {
    id: 'JD004',
    jobCode: 'HSE-001',
    title: 'Safety Officer',
    department: 'HSE',
    level: 'Mid',
    status: 'Active',
    headcount: 2,
    filled: 2,
    reportingTo: 'HSE Manager',
    lastUpdated: '2024-03-25',
    createdBy: 'HR Admin',
    summary: 'Implement and monitor workplace safety programs to ensure compliance with regulations.',
    responsibilities: ['Conduct safety inspections', 'Investigate incidents', 'Deliver safety training', 'Maintain safety records'],
    requirements: ['Safety qualifications (NEBOSH/OSHA)', '3+ years experience', 'Industry knowledge'],
    competencies: ['Risk assessment', 'Communication', 'Regulatory knowledge'],
  },
  {
    id: 'JD005',
    jobCode: 'FIN-002',
    title: 'Financial Analyst',
    department: 'Finance',
    level: 'Mid',
    status: 'Draft',
    headcount: 1,
    filled: 0,
    reportingTo: 'Finance Manager',
    lastUpdated: '2024-04-18',
    createdBy: 'Finance Manager',
    summary: 'Analyze financial data and prepare reports to support business decision-making.',
    responsibilities: ['Prepare financial reports', 'Conduct variance analysis', 'Support budgeting process', 'Financial modeling'],
    requirements: ['Degree in Finance/Accounting', 'CPA/ACCA preferred', 'Excel proficiency'],
    competencies: ['Analytical skills', 'Financial acumen', 'SAP knowledge'],
  },
];

const DEPARTMENTS = ['All', 'Operations', 'Quality', 'R&D', 'HSE', 'Finance', 'HR', 'IT', 'Logistics'];
const STATUS_OPTIONS = ['All', 'Active', 'Draft', 'Archived', 'Under Review'];
const LEVELS = ['All', 'Junior', 'Mid', 'Senior', 'Manager', 'Director'];

export default function JobDescriptionsPage() {
  const { data: user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedJD, setSelectedJD] = useState<JobDescription | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNewJDModal, setShowNewJDModal] = useState(false);

  // Stats
  const stats = useMemo(() => {
    const active = MOCK_JOB_DESCRIPTIONS.filter((jd: JobDescription) => jd.status === 'Active').length;
    const totalHeadcount = MOCK_JOB_DESCRIPTIONS.reduce((acc: number, jd: JobDescription) => acc + jd.headcount, 0);
    const totalFilled = MOCK_JOB_DESCRIPTIONS.reduce((acc: number, jd: JobDescription) => acc + jd.filled, 0);
    const vacancies = totalHeadcount - totalFilled;
    return { total: MOCK_JOB_DESCRIPTIONS.length, active, totalHeadcount, totalFilled, vacancies };
  }, []);

  // Filtered JDs
  const filteredJDs = useMemo(() => {
    return MOCK_JOB_DESCRIPTIONS.filter((jd: JobDescription) => {
      const matchesSearch = !searchQuery ||
        jd.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        jd.jobCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDepartment === 'All' || jd.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'All' || jd.status === selectedStatus;
      const matchesLevel = selectedLevel === 'All' || jd.level === selectedLevel;
      return matchesSearch && matchesDept && matchesStatus && matchesLevel;
    });
  }, [searchQuery, selectedDepartment, selectedStatus, selectedLevel]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary';
      case 'Draft': return 'bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground';
      case 'Archived': return 'bg-destructive/10 text-destructive dark:bg-destructive/30 dark:text-destructive';
      case 'Under Review': return 'bg-accent text-accent-foreground dark:bg-accent/30 dark:text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
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
                  <FileText className="h-5 w-5 text-secondary-foreground dark:text-secondary-foreground" />
                </div>
                <div>
                  <h1 className="text-base font-semibold">Job Descriptions</h1>
                  <p className="text-xs text-muted-foreground">Manage positions & requirements</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={() => setShowNewJDModal(true)}>
                <Plus className="h-4 w-4 mr-2" /> New Job Description
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
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Total JDs</p>
                  <p className="text-2xl font-bold mt-1">{stats.total}</p>
                  <p className="text-xs text-primary dark:text-primary flex items-center gap-1 mt-1">
                    <CheckCircle2 className="h-3 w-3" /> {stats.active} active
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-secondary dark:bg-secondary/30 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-secondary-foreground dark:text-secondary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Total Headcount</p>
                  <p className="text-2xl font-bold mt-1">{stats.totalHeadcount}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    Positions defined
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-secondary dark:bg-violet-900/30 flex items-center justify-center">
                  <Users className="h-6 w-6 text-secondary-foreground dark:text-violet-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Filled Positions</p>
                  <p className="text-2xl font-bold mt-1">{stats.totalFilled}</p>
                  <p className="text-xs text-primary dark:text-primary flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" /> {Math.round((stats.totalFilled / stats.totalHeadcount) * 100)}% fill rate
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 dark:bg-primary/30 flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary dark:text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Open Vacancies</p>
                  <p className="text-2xl font-bold mt-1">{stats.vacancies}</p>
                  <p className="text-xs text-accent-foreground dark:text-accent-foreground flex items-center gap-1 mt-1">
                    <AlertTriangle className="h-3 w-3" /> To be filled
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-accent dark:bg-accent/30 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-accent-foreground dark:text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Main Table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle className="text-sm font-semibold">Job Descriptions</CardTitle>
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
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="h-8 w-32 text-xs">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d: string) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="h-8 w-32 text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s: string) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="h-8 w-28 text-xs">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVELS.map((l: string) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Job Code</TableHead>
                  <TableHead className="text-xs">Title</TableHead>
                  <TableHead className="text-xs">Department</TableHead>
                  <TableHead className="text-xs">Level</TableHead>
                  <TableHead className="text-xs">Headcount</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Updated</TableHead>
                  <TableHead className="text-xs w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJDs.map((jd: JobDescription) => (
                  <TableRow
                    key={jd.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => { setSelectedJD(jd); setShowDetailModal(true); }}
                  >
                    <TableCell className="font-mono text-xs">{jd.jobCode}</TableCell>
                    <TableCell className="text-sm font-medium">{jd.title}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{jd.department}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">{jd.level}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">{jd.filled}</span>
                        <span className="text-xs text-muted-foreground">/ {jd.headcount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('text-[10px]', getStatusBadge(jd.status))}>
                        {jd.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {format(new Date(jd.lastUpdated), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedJD(jd); setShowDetailModal(true); }}>
                            <Eye className="h-3.5 w-3.5 mr-2" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-3.5 w-3.5 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-3.5 w-3.5 mr-2" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-3.5 w-3.5 mr-2" /> Export PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-3.5 w-3.5 mr-2" /> Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="font-mono text-sm text-muted-foreground">{selectedJD?.jobCode}</span>
              {selectedJD?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedJD && (
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Department</p>
                    <p className="text-sm font-medium">{selectedJD.department}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Level</p>
                    <p className="text-sm font-medium">{selectedJD.level}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Reports To</p>
                    <p className="text-sm font-medium">{selectedJD.reportingTo}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Summary</h4>
                  <p className="text-sm text-muted-foreground">{selectedJD.summary}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Responsibilities</h4>
                  <ul className="space-y-1">
                    {selectedJD.responsibilities.map((r: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Requirements</h4>
                  <ul className="space-y-1">
                    {selectedJD.requirements.map((r: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 text-primary mt-1" /> {r}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Competencies</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJD.competencies.map((c: string, i: number) => (
                      <Badge key={i} variant="secondary">{c}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button className="flex-1">
                    <Edit className="h-4 w-4 mr-2" /> Edit JD
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" /> Export
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* New JD Modal */}
      <Dialog open={showNewJDModal} onOpenChange={setShowNewJDModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Job Description</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Job Code</Label>
                <Input placeholder="e.g., OPS-001" />
              </div>
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input placeholder="Position title" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Department</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.filter((d: string) => d !== 'All').map((d: string) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Level</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {LEVELS.filter((l: string) => l !== 'All').map((l: string) => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Reports To</Label>
              <Input placeholder="Reporting manager/position" />
            </div>
            <div className="space-y-2">
              <Label>Headcount</Label>
              <Input type="number" placeholder="1" />
            </div>
            <div className="space-y-2">
              <Label>Job Summary</Label>
              <Textarea placeholder="Brief description of the role..." />
            </div>
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={() => { setShowNewJDModal(false); toast.success('Job description created!'); }}>
                Create JD
              </Button>
              <Button variant="outline" onClick={() => setShowNewJDModal(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
