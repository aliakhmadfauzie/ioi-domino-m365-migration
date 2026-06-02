/**
 * HR Forms Index - Master Directory of All HR Forms
 * Central navigation hub for all 80+ HR forms in IOI Acidchem
 * Categories: Recruitment, Training, Performance, Leave, Benefits, Exit, Compliance
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Search,
  FileText,
  Users,
  GraduationCap,
  Calendar,
  Heart,
  Award,
  Briefcase,
  Shield,
  ClipboardCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Star,
  ExternalLink,
  Filter,
  Grid,
  List,
  Globe,
  UserPlus,
  LogOut,
  Building2,
  Folder,
  ChevronRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/use-user';

// Form Categories with Icons
const CATEGORIES = [
  { id: 'all', label: 'All Forms', icon: FileText, count: 82 },
  { id: 'recruitment', label: 'Recruitment', icon: UserPlus, count: 15 },
  { id: 'training', label: 'Training', icon: GraduationCap, count: 12 },
  { id: 'performance', label: 'Performance', icon: Award, count: 8 },
  { id: 'leave', label: 'Leave & Time', icon: Calendar, count: 10 },
  { id: 'benefits', label: 'Benefits', icon: Heart, count: 8 },
  { id: 'exit', label: 'Exit Process', icon: LogOut, count: 6 },
  { id: 'compliance', label: 'Compliance', icon: Shield, count: 10 },
  { id: 'foreign', label: 'Foreign Workers', icon: Globe, count: 8 },
  { id: 'records', label: 'Records', icon: Folder, count: 5 },
] as const;

// All HR Forms Master List
interface HRForm {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'draft' | 'deprecated';
  route?: string;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'as-needed';
  pendingCount?: number;
  isCritical?: boolean;
  isNew?: boolean;
  site: 'PRAI' | 'JHR' | 'BOTH';
}

const HR_FORMS: HRForm[] = [
  // RECRUITMENT
  { id: 'SR-001', code: 'SR', name: 'Staff Requisition Form', description: 'Request for new/replacement staff', category: 'recruitment', status: 'active', route: '/hr/sr', frequency: 'as-needed', pendingCount: 5, site: 'BOTH' },
  { id: 'JP-001', code: 'JP', name: 'Job Description & Profile', description: 'Position job scope and requirements', category: 'recruitment', status: 'active', route: '/hr/jd', site: 'BOTH' },
  { id: 'IP-001', code: 'IP', name: 'Interview Pipeline', description: 'Track candidate interview stages', category: 'recruitment', status: 'active', route: '/hr/interview-db', pendingCount: 8, site: 'BOTH', isNew: true },
  { id: 'CA-001', code: 'CA', name: 'Candidate Assessment Form', description: 'Interview evaluation form', category: 'recruitment', status: 'active', route: '/hr/interview-db', site: 'BOTH' },
  { id: 'OL-001', code: 'OL', name: 'Offer Letter Request', description: 'Generate employment offer letter', category: 'recruitment', status: 'active', site: 'BOTH' },
  { id: 'NC-001', code: 'NC', name: 'New Hire Checklist', description: 'Onboarding checklist for new staff', category: 'recruitment', status: 'active', site: 'BOTH' },
  { id: 'PR-001', code: 'PR', name: 'Probation Review', description: 'Probation period evaluation', category: 'recruitment', status: 'active', pendingCount: 3, site: 'BOTH' },
  { id: 'CF-001', code: 'CF', name: 'Confirmation Form', description: 'Employee confirmation after probation', category: 'recruitment', status: 'active', site: 'BOTH' },
  { id: 'IA-001', code: 'IA', name: 'Internal Application', description: 'Internal job transfer application', category: 'recruitment', status: 'active', site: 'BOTH' },
  { id: 'RF-001', code: 'RF', name: 'Referral Form', description: 'Employee referral submission', category: 'recruitment', status: 'active', site: 'BOTH' },
  { id: 'AG-001', code: 'AG', name: 'Agency Request', description: 'External recruitment agency request', category: 'recruitment', status: 'active', site: 'BOTH' },
  { id: 'BSD-001', code: 'BSD', name: 'Backup Staff Database', description: 'Staff backup coverage assignments', category: 'recruitment', status: 'active', route: '/hr/bsd', site: 'BOTH' },
  { id: 'HC-001', code: 'HC', name: 'Headcount Report', description: 'Monthly headcount reporting', category: 'recruitment', status: 'active', frequency: 'monthly', site: 'BOTH' },
  { id: 'OC-001', code: 'OC', name: 'Org Chart Update', description: 'Organization chart updates', category: 'recruitment', status: 'active', route: '/hr/org-chart', site: 'BOTH' },
  { id: 'RM-001', code: 'RM', name: 'Resource Matrix', description: 'Department resource planning', category: 'recruitment', status: 'active', site: 'BOTH' },

  // TRAINING
  { id: 'TE-001', code: 'TE', name: 'Training Entry', description: 'Record training attendance', category: 'training', status: 'active', route: '/hr/training', site: 'BOTH' },
  { id: 'TM-001', code: 'TM', name: 'Training Matrix', description: 'Competency requirements matrix', category: 'training', status: 'active', route: '/hr/training', site: 'BOTH' },
  { id: 'TR-001', code: 'TR', name: 'Training Records', description: 'Employee training history', category: 'training', status: 'active', route: '/hr/training', site: 'BOTH' },
  { id: 'TA-001', code: 'TA', name: 'Training Application', description: 'Apply for external training', category: 'training', status: 'active', pendingCount: 4, site: 'BOTH' },
  { id: 'OJT-001', code: 'OJT', name: 'OJT Tracking', description: 'On-the-job training progress', category: 'training', status: 'active', site: 'BOTH' },
  { id: 'TRAB-001', code: 'TRAB', name: 'Training Bond Agreement', description: 'Training bond contract management', category: 'training', status: 'active', route: '/hr/training', isCritical: true, site: 'BOTH' },
  { id: 'TNA-001', code: 'TNA', name: 'Training Needs Analysis', description: 'Annual training needs survey', category: 'training', status: 'active', frequency: 'monthly', site: 'BOTH' },
  { id: 'TP-001', code: 'TP', name: 'Training Plan', description: 'Annual training schedule', category: 'training', status: 'active', site: 'BOTH' },
  { id: 'TE-002', code: 'TE-F', name: 'Training Feedback', description: 'Post-training evaluation', category: 'training', status: 'active', site: 'BOTH' },
  { id: 'TC-001', code: 'TC', name: 'Training Certificate', description: 'Generate training certificate', category: 'training', status: 'active', site: 'BOTH' },
  { id: 'CM-001', code: 'CM', name: 'Competency Mapping', description: 'Skills competency tracking', category: 'training', status: 'active', site: 'BOTH' },
  { id: 'SD-001', code: 'SD', name: 'Skill Development Plan', description: 'Individual development plan', category: 'training', status: 'active', site: 'BOTH' },

  // PERFORMANCE
  { id: 'PA-001', code: 'PA', name: 'Performance Appraisal', description: 'Annual performance review', category: 'performance', status: 'active', route: '/hr/paf', pendingCount: 12, site: 'BOTH' },
  { id: 'KPI-001', code: 'KPI', name: 'KPI Setting Form', description: 'Set annual KPI targets', category: 'performance', status: 'active', site: 'BOTH' },
  { id: 'KPI-002', code: 'KPI-R', name: 'KPI Review', description: 'Quarterly KPI progress review', category: 'performance', status: 'active', frequency: 'monthly', site: 'BOTH' },
  { id: 'PIP-001', code: 'PIP', name: 'Performance Improvement', description: 'Performance improvement plan', category: 'performance', status: 'active', isCritical: true, site: 'BOTH' },
  { id: 'PR-002', code: 'PROM', name: 'Promotion Request', description: 'Staff promotion nomination', category: 'performance', status: 'active', pendingCount: 2, site: 'BOTH' },
  { id: 'IN-001', code: 'IN', name: 'Increment Request', description: 'Salary increment request', category: 'performance', status: 'active', site: 'BOTH' },
  { id: 'RR-001', code: 'RR', name: 'Recognition & Rewards', description: 'Employee recognition nomination', category: 'performance', status: 'active', site: 'BOTH' },
  { id: 'SP-001', code: 'SP', name: 'Succession Planning', description: 'Key position succession plans', category: 'performance', status: 'active', site: 'BOTH' },

  // LEAVE & TIME
  { id: 'LA-001', code: 'LA', name: 'Leave Application', description: 'Apply for annual/sick/other leave', category: 'leave', status: 'active', route: '/hr/lve', pendingCount: 15, site: 'BOTH' },
  { id: 'LC-001', code: 'LC', name: 'Leave Cancellation', description: 'Cancel approved leave', category: 'leave', status: 'active', route: '/hr/lve', site: 'BOTH' },
  { id: 'LB-001', code: 'LB', name: 'Leave Balance Report', description: 'Staff leave entitlement report', category: 'leave', status: 'active', route: '/hr/lve', site: 'BOTH' },
  { id: 'OT-001', code: 'OT', name: 'Overtime Request', description: 'Apply for overtime work', category: 'leave', status: 'active', pendingCount: 8, frequency: 'weekly', site: 'BOTH' },
  { id: 'OWP-001', code: 'OWP', name: 'Outstation Work Pass', description: 'Request for outstation work', category: 'leave', status: 'active', site: 'BOTH' },
  { id: 'WFH-001', code: 'WFH', name: 'Work From Home', description: 'WFH arrangement request', category: 'leave', status: 'active', site: 'BOTH' },
  { id: 'TC-002', code: 'TC-A', name: 'Time Card Adjustment', description: 'Attendance correction request', category: 'leave', status: 'active', frequency: 'weekly', site: 'BOTH' },
  { id: 'SH-001', code: 'SH', name: 'Shift Change', description: 'Request shift schedule change', category: 'leave', status: 'active', site: 'BOTH' },
  { id: 'AT-001', code: 'AT', name: 'Attendance Report', description: 'Monthly attendance summary', category: 'leave', status: 'active', frequency: 'monthly', site: 'BOTH' },
  { id: 'FP-001', code: 'FP', name: 'Flexi Pass', description: 'Flexible working hours request', category: 'leave', status: 'active', site: 'BOTH' },

  // BENEFITS
  { id: 'MC-001', code: 'MC', name: 'Medical Claim', description: 'Submit medical expenses', category: 'benefits', status: 'active', route: '/hr/mcl', pendingCount: 6, frequency: 'weekly', site: 'BOTH' },
  { id: 'IN-002', code: 'INS', name: 'Insurance Enrollment', description: 'Group insurance enrollment', category: 'benefits', status: 'active', route: '/hr/gdsn', site: 'BOTH' },
  { id: 'EP-001', code: 'EP', name: 'Education Assistance', description: 'Education subsidy application', category: 'benefits', status: 'active', site: 'BOTH' },
  { id: 'ML-001', code: 'ML', name: 'Maternity/Paternity Leave', description: 'Parental leave application', category: 'benefits', status: 'active', site: 'BOTH' },
  { id: 'LO-001', code: 'LO', name: 'Staff Loan Application', description: 'Company loan request', category: 'benefits', status: 'active', site: 'BOTH' },
  { id: 'UN-001', code: 'UN', name: 'Uniform Request', description: 'Work uniform requisition', category: 'benefits', status: 'active', site: 'BOTH' },
  { id: 'TR-002', code: 'TRAV', name: 'Travel Claim', description: 'Travel expense reimbursement', category: 'benefits', status: 'active', frequency: 'weekly', site: 'BOTH' },
  { id: 'PH-001', code: 'PH', name: 'Phone Allowance', description: 'Mobile phone subsidy request', category: 'benefits', status: 'active', site: 'BOTH' },

  // EXIT PROCESS
  { id: 'RN-001', code: 'RN', name: 'Resignation Notice', description: 'Employee resignation submission', category: 'exit', status: 'active', route: '/hr/een', pendingCount: 2, isCritical: true, site: 'BOTH' },
  { id: 'EEN-001', code: 'EEN', name: 'Exit Entry Notification', description: 'HR exit process initiation', category: 'exit', status: 'active', route: '/hr/een', site: 'BOTH' },
  { id: 'ESF-001', code: 'ESF', name: 'Exit Separation Form', description: 'Final clearance checklist', category: 'exit', status: 'active', route: '/hr/esf', site: 'BOTH' },
  { id: 'EI-001', code: 'EI', name: 'Exit Interview', description: 'Departing employee interview', category: 'exit', status: 'active', route: '/hr/een', site: 'BOTH' },
  { id: 'FC-001', code: 'FC', name: 'Final Clearance', description: 'Department clearance routing', category: 'exit', status: 'active', route: '/hr/esf', site: 'BOTH' },
  { id: 'FP-002', code: 'FP-S', name: 'Final Payment', description: 'Final salary calculation', category: 'exit', status: 'active', site: 'BOTH' },

  // COMPLIANCE
  { id: 'PD-001', code: 'PD', name: 'Personal Data Form', description: 'Employee personal info update', category: 'compliance', status: 'active', route: '/hr/employee', site: 'BOTH' },
  { id: 'NDA-001', code: 'NDA', name: 'NDA Agreement', description: 'Non-disclosure agreement', category: 'compliance', status: 'active', site: 'BOTH' },
  { id: 'COI-001', code: 'COI', name: 'Conflict of Interest', description: 'COI declaration form', category: 'compliance', status: 'active', frequency: 'monthly', site: 'BOTH' },
  { id: 'COC-001', code: 'COC', name: 'Code of Conduct', description: 'COC acknowledgment', category: 'compliance', status: 'active', site: 'BOTH' },
  { id: 'DA-001', code: 'DA', name: 'Disciplinary Action', description: 'Employee disciplinary record', category: 'compliance', status: 'active', isCritical: true, site: 'BOTH' },
  { id: 'WH-001', code: 'WH', name: 'Whistleblower Report', description: 'Anonymous reporting form', category: 'compliance', status: 'active', isCritical: true, site: 'BOTH' },
  { id: 'GV-001', code: 'GV', name: 'Grievance Form', description: 'Employee grievance submission', category: 'compliance', status: 'active', isCritical: true, site: 'BOTH' },
  { id: 'SH-002', code: 'SHA', name: 'Sexual Harassment Report', description: 'SHA complaint form', category: 'compliance', status: 'active', isCritical: true, site: 'BOTH' },
  { id: 'BC-001', code: 'BC', name: 'Background Check', description: 'Pre-employment screening', category: 'compliance', status: 'active', site: 'BOTH' },
  { id: 'VR-001', code: 'VR', name: 'Verification Request', description: 'Employment verification letter', category: 'compliance', status: 'active', site: 'BOTH' },

  // FOREIGN WORKERS
  { id: 'FWWPD-001', code: 'FWWPD', name: 'Foreign Worker Database', description: 'Foreign worker registry', category: 'foreign', status: 'active', route: '/hr/foreign-workers', site: 'BOTH' },
  { id: 'FWWPE-001', code: 'FWWPE', name: 'Work Permit Expiry', description: 'Permit expiry tracking', category: 'foreign', status: 'active', route: '/hr/foreign-workers', pendingCount: 3, isCritical: true, site: 'BOTH' },
  { id: 'WPR-001', code: 'WPR', name: 'Work Permit Renewal', description: 'Permit renewal application', category: 'foreign', status: 'active', route: '/hr/foreign-workers', site: 'BOTH' },
  { id: 'VS-001', code: 'VS', name: 'Visa Application', description: 'Visa processing form', category: 'foreign', status: 'active', site: 'BOTH' },
  { id: 'AC-001', code: 'AC', name: 'Accommodation Record', description: 'Worker housing allocation', category: 'foreign', status: 'active', site: 'BOTH' },
  { id: 'RE-001', code: 'RE', name: 'Repatriation Form', description: 'Worker repatriation process', category: 'foreign', status: 'active', site: 'BOTH' },
  { id: 'LEV-001', code: 'LEV', name: 'Levy Payment', description: 'Worker levy tracking', category: 'foreign', status: 'active', frequency: 'monthly', site: 'BOTH' },
  { id: 'FOMEMA-001', code: 'FOMEMA', name: 'FOMEMA Record', description: 'Medical examination records', category: 'foreign', status: 'active', site: 'BOTH' },

  // RECORDS
  { id: 'ER-001', code: 'ER', name: 'Employee Records', description: 'Master employee database', category: 'records', status: 'active', route: '/hr/employee', site: 'BOTH' },
  { id: 'NDF-001', code: 'NDF', name: 'Notice Database', description: 'Company notice management', category: 'records', status: 'active', route: '/hr/notice-database', site: 'BOTH' },
  { id: 'DOC-001', code: 'DOC', name: 'Document Repository', description: 'HR document storage', category: 'records', status: 'active', route: '/hr/documents', site: 'BOTH' },
  { id: 'AR-001', code: 'AR', name: 'Audit Records', description: 'HR audit trail log', category: 'records', status: 'active', site: 'BOTH' },
  { id: 'RP-001', code: 'RP', name: 'Reports Generator', description: 'Custom HR reports', category: 'records', status: 'active', site: 'BOTH' },
];

export default function FormsIndexPage() {
  const { data: user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showOnlyPending, setShowOnlyPending] = useState(false);
  const [selectedSite, setSelectedSite] = useState<'PRAI' | 'JHR' | 'BOTH'>('BOTH');

  // Filter forms
  const filteredForms = useMemo(() => {
    return HR_FORMS.filter((form: HRForm) => {
      const matchesSearch = !searchQuery ||
        form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || form.category === selectedCategory;
      const matchesPending = !showOnlyPending || (form.pendingCount && form.pendingCount > 0);
      const matchesSite = selectedSite === 'BOTH' || form.site === 'BOTH' || form.site === selectedSite;
      return matchesSearch && matchesCategory && matchesPending && matchesSite;
    });
  }, [searchQuery, selectedCategory, showOnlyPending, selectedSite]);

  // Stats
  const stats = useMemo(() => {
    const totalPending = HR_FORMS.reduce((acc: number, f: HRForm) => acc + (f.pendingCount || 0), 0);
    const criticalForms = HR_FORMS.filter((f: HRForm) => f.isCritical).length;
    const newForms = HR_FORMS.filter((f: HRForm) => f.isNew).length;
    return { totalPending, criticalForms, newForms, totalForms: HR_FORMS.length };
  }, []);

  const getCategoryIcon = (category: string) => {
    const cat = CATEGORIES.find((c) => c.id === category);
    return cat?.icon || FileText;
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
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-base font-semibold">HR Forms Directory</h1>
                  <p className="text-xs text-muted-foreground">{stats.totalForms} forms • {stats.totalPending} pending actions</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 pl-3 border-l">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Quick Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Pending Actions</p>
                  <p className="text-2xl font-bold mt-1 text-accent-foreground">{stats.totalPending}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-accent dark:bg-accent/30 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-accent-foreground dark:text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Critical Forms</p>
                  <p className="text-2xl font-bold mt-1 text-destructive">{stats.criticalForms}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-destructive/10 dark:bg-destructive/30 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-destructive dark:text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">New Forms</p>
                  <p className="text-2xl font-bold mt-1 text-primary">{stats.newForms}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-primary/30 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary dark:text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Total Forms</p>
                  <p className="text-2xl font-bold mt-1">{stats.totalForms}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search forms by name, code, or description..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showOnlyPending ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowOnlyPending(!showOnlyPending)}
            >
              <Clock className="h-4 w-4 mr-2" />
              Pending Only
            </Button>
            <div className="flex border rounded-lg">
              <Button
                variant={selectedSite === 'BOTH' ? 'secondary' : 'ghost'}
                size="sm"
                className="rounded-r-none"
                onClick={() => setSelectedSite('BOTH')}
              >
                All Sites
              </Button>
              <Button
                variant={selectedSite === 'PRAI' ? 'secondary' : 'ghost'}
                size="sm"
                className="rounded-none border-x"
                onClick={() => setSelectedSite('PRAI')}
              >
                Prai
              </Button>
              <Button
                variant={selectedSite === 'JHR' ? 'secondary' : 'ghost'}
                size="sm"
                className="rounded-l-none"
                onClick={() => setSelectedSite('JHR')}
              >
                Johor
              </Button>
            </div>
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="rounded-r-none"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                className="rounded-l-none"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <ScrollArea className="w-full">
            <TabsList className="inline-flex h-auto p-1 gap-1 flex-wrap">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const categoryForms = cat.id === 'all' 
                  ? HR_FORMS 
                  : HR_FORMS.filter((f: HRForm) => f.category === cat.id);
                const pendingInCategory = categoryForms.reduce((acc: number, f: HRForm) => acc + (f.pendingCount || 0), 0);
                return (
                  <TabsTrigger 
                    key={cat.id} 
                    value={cat.id}
                    className="flex items-center gap-2 px-3 py-2 text-xs relative"
                  >
                    <Icon className="h-4 w-4" />
                    {cat.label}
                    {pendingInCategory > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent/500 text-[10px] text-white flex items-center justify-center">
                        {pendingInCategory > 9 ? '9+' : pendingInCategory}
                      </span>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </ScrollArea>

          <TabsContent value={selectedCategory} className="mt-4">
            <AnimatePresence mode="popLayout">
              {viewMode === 'grid' ? (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {filteredForms.map((form: HRForm, index: number) => {
                    const CategoryIcon = getCategoryIcon(form.category);
                    return (
                      <motion.div
                        key={form.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.02, ease: 'easeOut' as const }}
                      >
                        <Card className={cn(
                          "hover:border-primary/50 transition-all cursor-pointer group",
                          form.isCritical && "border-destructive/20 dark:border-destructive",
                          form.isNew && "border-primary/20 dark:border-primary"
                        )}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className={cn(
                                "h-10 w-10 rounded-lg flex items-center justify-center",
                                form.isCritical ? "bg-destructive/10 dark:bg-destructive/30" : "bg-muted"
                              )}>
                                <CategoryIcon className={cn(
                                  "h-5 w-5",
                                  form.isCritical ? "text-destructive dark:text-destructive" : "text-muted-foreground"
                                )} />
                              </div>
                              <div className="flex items-center gap-2">
                                {form.isNew && (
                                  <Badge className="bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary text-[10px]">
                                    NEW
                                  </Badge>
                                )}
                                {form.isCritical && (
                                  <Badge className="bg-destructive/10 text-destructive dark:bg-destructive/30 dark:text-destructive text-[10px]">
                                    CRITICAL
                                  </Badge>
                                )}
                                {form.pendingCount && form.pendingCount > 0 && (
                                  <Badge variant="secondary" className="text-[10px]">
                                    {form.pendingCount} pending
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[10px] font-mono">
                                  {form.code}
                                </Badge>
                                <Badge variant="outline" className="text-[10px]">
                                  {form.site}
                                </Badge>
                              </div>
                              <h3 className="text-sm font-semibold mt-2 group-hover:text-primary transition-colors">
                                {form.name}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {form.description}
                              </p>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t">
                              <div className="flex items-center gap-2">
                                {form.frequency && (
                                  <span className="text-[10px] text-muted-foreground capitalize">
                                    {form.frequency}
                                  </span>
                                )}
                              </div>
                              {form.route ? (
                                <Button variant="ghost" size="sm" asChild className="h-7 text-xs">
                                  <Link to={form.route}>
                                    Open <ChevronRight className="h-3 w-3 ml-1" />
                                  </Link>
                                </Button>
                              ) : (
                                <Button variant="ghost" size="sm" className="h-7 text-xs" disabled>
                                  Coming Soon
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {filteredForms.map((form: HRForm) => {
                          const CategoryIcon = getCategoryIcon(form.category);
                          return (
                            <div
                              key={form.id}
                              className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-4">
                                <div className={cn(
                                  "h-10 w-10 rounded-lg flex items-center justify-center",
                                  form.isCritical ? "bg-destructive/10 dark:bg-destructive/30" : "bg-muted"
                                )}>
                                  <CategoryIcon className={cn(
                                    "h-5 w-5",
                                    form.isCritical ? "text-destructive dark:text-destructive" : "text-muted-foreground"
                                  )} />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-[10px] font-mono">
                                      {form.code}
                                    </Badge>
                                    <span className="text-sm font-semibold">{form.name}</span>
                                    {form.isNew && (
                                      <Badge className="bg-primary/10 text-primary text-[10px]">
                                        NEW
                                      </Badge>
                                    )}
                                    {form.isCritical && (
                                      <Badge className="bg-destructive/10 text-destructive text-[10px]">
                                        CRITICAL
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {form.description}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {form.pendingCount && form.pendingCount > 0 && (
                                  <Badge variant="secondary" className="text-[10px]">
                                    {form.pendingCount} pending
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-[10px]">
                                  {form.site}
                                </Badge>
                                {form.route ? (
                                  <Button variant="ghost" size="sm" asChild>
                                    <Link to={form.route}>
                                      Open <ExternalLink className="h-3 w-3 ml-1" />
                                    </Link>
                                  </Button>
                                ) : (
                                  <Button variant="ghost" size="sm" disabled>
                                    Coming Soon
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {filteredForms.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No forms found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
