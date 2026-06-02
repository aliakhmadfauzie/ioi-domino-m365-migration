/**
 * HR Surveys & Feedback Page
 * Covers: ESF (Employee Satisfaction Form), EEN (Employee Exit Notification)
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ClipboardList,
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  Star,
  Search,
  Plus,
  BarChart3,
  PieChart,
  Eye,
  Edit,
  MoreHorizontal,
  Download,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Meh,
  Frown,
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';

// Types
interface Survey {
  id: string;
  title: string;
  type: 'Satisfaction' | 'Exit' | 'Pulse' | 'Training' | 'Engagement';
  status: 'Active' | 'Draft' | 'Completed' | 'Scheduled';
  targetAudience: string;
  totalResponses: number;
  targetResponses: number;
  startDate: string;
  endDate: string;
  createdBy: string;
  averageScore?: number;
  questions: number;
}

interface FeedbackItem {
  id: string;
  surveyTitle: string;
  department: string;
  submittedDate: string;
  overallScore: number;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  keyThemes: string[];
  anonymous: boolean;
}

// Mock Data
const MOCK_SURVEYS: Survey[] = [
  { id: 'SRV001', title: 'Q1 2024 Employee Satisfaction Survey', type: 'Satisfaction', status: 'Completed', targetAudience: 'All Employees', totalResponses: 245, targetResponses: 300, startDate: '2024-01-15', endDate: '2024-02-15', createdBy: 'HR Admin', averageScore: 4.2, questions: 25 },
  { id: 'SRV002', title: 'New Hire Onboarding Feedback', type: 'Engagement', status: 'Active', targetAudience: 'New Hires (<6 months)', totalResponses: 18, targetResponses: 25, startDate: '2024-04-01', endDate: '2024-04-30', createdBy: 'HR Admin', averageScore: 4.5, questions: 15 },
  { id: 'SRV003', title: 'March 2024 Exit Interview Survey', type: 'Exit', status: 'Active', targetAudience: 'Departing Employees', totalResponses: 5, targetResponses: 8, startDate: '2024-03-01', endDate: '2024-03-31', createdBy: 'HR Manager', averageScore: 3.2, questions: 20 },
  { id: 'SRV004', title: 'Weekly Pulse Check', type: 'Pulse', status: 'Active', targetAudience: 'All Employees', totalResponses: 156, targetResponses: 300, startDate: '2024-04-15', endDate: '2024-04-21', createdBy: 'HR Admin', averageScore: 3.8, questions: 5 },
  { id: 'SRV005', title: 'Training Effectiveness Survey - Q1', type: 'Training', status: 'Completed', targetAudience: 'Training Attendees', totalResponses: 89, targetResponses: 100, startDate: '2024-03-01', endDate: '2024-03-15', createdBy: 'T&D Lead', averageScore: 4.4, questions: 12 },
  { id: 'SRV006', title: 'Q2 2024 Employee Engagement Survey', type: 'Engagement', status: 'Draft', targetAudience: 'All Employees', totalResponses: 0, targetResponses: 300, startDate: '2024-05-01', endDate: '2024-05-31', createdBy: 'HR Admin', questions: 30 },
];

const MOCK_FEEDBACK: FeedbackItem[] = [
  { id: 'FB001', surveyTitle: 'Q1 2024 Employee Satisfaction Survey', department: 'Operations', submittedDate: '2024-02-10', overallScore: 4.5, sentiment: 'Positive', keyThemes: ['Good teamwork', 'Leadership support'], anonymous: true },
  { id: 'FB002', surveyTitle: 'Q1 2024 Employee Satisfaction Survey', department: 'R&D', submittedDate: '2024-02-08', overallScore: 3.8, sentiment: 'Neutral', keyThemes: ['Need more resources', 'Career growth'], anonymous: true },
  { id: 'FB003', surveyTitle: 'Exit Interview Survey', department: 'Finance', submittedDate: '2024-03-15', overallScore: 2.5, sentiment: 'Negative', keyThemes: ['Compensation', 'Work-life balance'], anonymous: false },
  { id: 'FB004', surveyTitle: 'New Hire Onboarding Feedback', department: 'Quality', submittedDate: '2024-04-05', overallScore: 4.8, sentiment: 'Positive', keyThemes: ['Great onboarding', 'Helpful mentor'], anonymous: true },
  { id: 'FB005', surveyTitle: 'Weekly Pulse Check', department: 'Production', submittedDate: '2024-04-18', overallScore: 3.5, sentiment: 'Neutral', keyThemes: ['Workload concerns'], anonymous: true },
];

const SURVEY_TYPES = ['All', 'Satisfaction', 'Exit', 'Pulse', 'Training', 'Engagement'];
const STATUS_OPTIONS = ['All', 'Active', 'Draft', 'Completed', 'Scheduled'];

export default function SurveysPage() {
  const { data: user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNewSurveyModal, setShowNewSurveyModal] = useState(false);
  const [activeTab, setActiveTab] = useState('surveys');

  // Stats
  const stats = useMemo(() => {
    const active = MOCK_SURVEYS.filter((s: Survey) => s.status === 'Active').length;
    const completed = MOCK_SURVEYS.filter((s: Survey) => s.status === 'Completed').length;
    const totalResponses = MOCK_SURVEYS.reduce((acc: number, s: Survey) => acc + s.totalResponses, 0);
    const avgScore = MOCK_SURVEYS.filter((s: Survey) => s.averageScore).reduce((acc: number, s: Survey, _: number, arr: Survey[]) => acc + (s.averageScore || 0) / arr.length, 0);
    const responseRate = Math.round((totalResponses / MOCK_SURVEYS.reduce((acc: number, s: Survey) => acc + s.targetResponses, 0)) * 100);
    return { total: MOCK_SURVEYS.length, active, completed, totalResponses, avgScore, responseRate };
  }, []);

  // Filtered surveys
  const filteredSurveys = useMemo(() => {
    return MOCK_SURVEYS.filter((s: Survey) => {
      const matchesSearch = !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'All' || s.type === selectedType;
      const matchesStatus = selectedStatus === 'All' || s.status === selectedStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchQuery, selectedType, selectedStatus]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary';
      case 'Completed': return 'bg-secondary text-secondary-foreground dark:bg-secondary/30 dark:text-secondary-foreground';
      case 'Draft': return 'bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground';
      case 'Scheduled': return 'bg-secondary text-secondary-foreground dark:bg-violet-900/30 dark:text-violet-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Satisfaction': return 'border-primary/30 text-primary dark:border-primary dark:text-primary';
      case 'Exit': return 'border-destructive/30 text-destructive dark:border-destructive dark:text-destructive';
      case 'Pulse': return 'border-secondary text-secondary-foreground dark:border-secondary dark:text-secondary-foreground';
      case 'Training': return 'border-accent text-accent-foreground dark:border-accent dark:text-accent-foreground';
      case 'Engagement': return 'border-violet-300 text-secondary-foreground dark:border-violet-700 dark:text-violet-400';
      default: return 'border-border text-muted-foreground';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return <Smile className="h-4 w-4 text-primary" />;
      case 'Neutral': return <Meh className="h-4 w-4 text-accent-foreground" />;
      case 'Negative': return <Frown className="h-4 w-4 text-destructive" />;
      default: return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.0) return 'text-primary dark:text-primary';
    if (score >= 3.0) return 'text-accent-foreground dark:text-accent-foreground';
    return 'text-destructive dark:text-destructive';
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
                  <ClipboardList className="h-5 w-5 text-secondary-foreground dark:text-accent-foreground" />
                </div>
                <div>
                  <h1 className="text-base font-semibold">Surveys & Feedback</h1>
                  <p className="text-xs text-muted-foreground">Employee engagement & insights</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={() => setShowNewSurveyModal(true)}>
                <Plus className="h-4 w-4 mr-2" /> Create Survey
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
                  <p className="text-xs text-muted-foreground font-medium">Total Surveys</p>
                  <p className="text-2xl font-bold mt-1">{stats.total}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-secondary dark:bg-secondary/30 flex items-center justify-center">
                  <ClipboardList className="h-5 w-5 text-secondary-foreground dark:text-accent-foreground" />
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

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Total Responses</p>
                  <p className="text-2xl font-bold mt-1">{stats.totalResponses}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-secondary dark:bg-secondary/30 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-secondary-foreground dark:text-secondary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Response Rate</p>
                  <p className="text-2xl font-bold mt-1">{stats.responseRate}%</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-secondary dark:bg-violet-900/30 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-secondary-foreground dark:text-violet-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Avg. Score</p>
                  <p className={cn('text-2xl font-bold mt-1', getScoreColor(stats.avgScore))}>
                    {stats.avgScore.toFixed(1)}/5.0
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-accent dark:bg-accent/30 flex items-center justify-center">
                  <Star className="h-5 w-5 text-accent-foreground dark:text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="surveys">Surveys</TabsTrigger>
            <TabsTrigger value="feedback">Recent Feedback</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="surveys" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <CardTitle className="text-sm font-semibold">All Surveys</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        className="h-8 w-40 pl-8 text-xs"
                      />
                    </div>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="h-8 w-32 text-xs">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {SURVEY_TYPES.map((t: string) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="h-8 w-28 text-xs">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s: string) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Survey</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Responses</TableHead>
                      <TableHead className="text-xs">Score</TableHead>
                      <TableHead className="text-xs">Period</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSurveys.map((survey: Survey) => {
                      const responseRate = Math.round((survey.totalResponses / survey.targetResponses) * 100);
                      return (
                        <TableRow
                          key={survey.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => { setSelectedSurvey(survey); setShowDetailModal(true); }}
                        >
                          <TableCell>
                            <div>
                              <p className="text-sm font-medium max-w-[250px] truncate">{survey.title}</p>
                              <p className="text-xs text-muted-foreground">{survey.questions} questions</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn('text-[10px]', getTypeBadge(survey.type))}>
                              {survey.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm font-medium">{survey.totalResponses}/{survey.targetResponses}</p>
                              <Progress value={responseRate} className="h-1.5 w-16 mt-1" />
                            </div>
                          </TableCell>
                          <TableCell>
                            {survey.averageScore ? (
                              <span className={cn('text-sm font-medium', getScoreColor(survey.averageScore))}>
                                {survey.averageScore.toFixed(1)}
                              </span>
                            ) : '—'}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {format(new Date(survey.startDate), 'MMM d')} - {format(new Date(survey.endDate), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <Badge className={cn('text-[10px]', getStatusBadge(survey.status))}>
                              {survey.status}
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
                                <DropdownMenuItem onClick={() => { setSelectedSurvey(survey); setShowDetailModal(true); }}>
                                  <Eye className="h-3.5 w-3.5 mr-2" /> View Results
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-3.5 w-3.5 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Send className="h-3.5 w-3.5 mr-2" /> Send Reminder
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="h-3.5 w-3.5 mr-2" /> Export Results
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

          <TabsContent value="feedback" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Recent Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {MOCK_FEEDBACK.map((fb: FeedbackItem) => (
                    <div key={fb.id} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'h-10 w-10 rounded-lg flex items-center justify-center',
                            fb.sentiment === 'Positive' ? 'bg-primary/10 dark:bg-primary/30' :
                            fb.sentiment === 'Neutral' ? 'bg-accent dark:bg-accent/30' :
                            'bg-destructive/10 dark:bg-destructive/30'
                          )}>
                            {getSentimentIcon(fb.sentiment)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{fb.surveyTitle}</p>
                            <p className="text-xs text-muted-foreground">
                              {fb.department} • {format(new Date(fb.submittedDate), 'MMM d, yyyy')}
                              {fb.anonymous && ' • Anonymous'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn('text-lg font-bold', getScoreColor(fb.overallScore))}>
                            {fb.overallScore.toFixed(1)}
                          </p>
                          <p className="text-xs text-muted-foreground">out of 5</p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {fb.keyThemes.map((theme: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-[10px]">{theme}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="mt-4">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Sentiment Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4 text-primary" />
                        <span className="text-sm">Positive</span>
                      </div>
                      <div className="flex items-center gap-2 flex-1 mx-4">
                        <Progress value={65} className="h-2" />
                      </div>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Meh className="h-4 w-4 text-accent-foreground" />
                        <span className="text-sm">Neutral</span>
                      </div>
                      <div className="flex items-center gap-2 flex-1 mx-4">
                        <Progress value={25} className="h-2" />
                      </div>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ThumbsDown className="h-4 w-4 text-destructive" />
                        <span className="text-sm">Negative</span>
                      </div>
                      <div className="flex items-center gap-2 flex-1 mx-4">
                        <Progress value={10} className="h-2" />
                      </div>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Top Themes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { theme: 'Leadership Support', count: 45, trend: 'up' },
                      { theme: 'Work-Life Balance', count: 38, trend: 'down' },
                      { theme: 'Career Growth', count: 32, trend: 'up' },
                      { theme: 'Team Collaboration', count: 28, trend: 'neutral' },
                      { theme: 'Compensation', count: 25, trend: 'down' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                        <span className="text-sm">{item.theme}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{item.count}</span>
                          {item.trend === 'up' && <TrendingUp className="h-3.5 w-3.5 text-primary" />}
                          {item.trend === 'down' && <TrendingDown className="h-3.5 w-3.5 text-destructive" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Survey Details</DialogTitle>
          </DialogHeader>
          {selectedSurvey && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-semibold">{selectedSurvey.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedSurvey.targetAudience}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Responses</p>
                  <p className="text-lg font-bold">{selectedSurvey.totalResponses}/{selectedSurvey.targetResponses}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Average Score</p>
                  <p className={cn('text-lg font-bold', selectedSurvey.averageScore ? getScoreColor(selectedSurvey.averageScore) : '')}>
                    {selectedSurvey.averageScore ? `${selectedSurvey.averageScore.toFixed(1)}/5.0` : 'N/A'}
                  </p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Questions</p>
                  <p className="text-sm font-medium">{selectedSurvey.questions}</p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge className={cn('text-[10px] mt-1', getStatusBadge(selectedSurvey.status))}>
                    {selectedSurvey.status}
                  </Badge>
                </div>
              </div>

              <div className="p-3 rounded-lg border">
                <p className="text-xs text-muted-foreground mb-1">Response Rate</p>
                <Progress value={Math.round((selectedSurvey.totalResponses / selectedSurvey.targetResponses) * 100)} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((selectedSurvey.totalResponses / selectedSurvey.targetResponses) * 100)}% completed
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="flex-1" onClick={() => toast.success('Results exported!')}>
                  <Download className="h-4 w-4 mr-2" /> Export Results
                </Button>
                <Button variant="outline" onClick={() => { toast.success('Reminders sent!'); }}>
                  <Send className="h-4 w-4 mr-2" /> Send Reminder
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Survey Modal */}
      <Dialog open={showNewSurveyModal} onOpenChange={setShowNewSurveyModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Survey</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Survey Title</Label>
              <Input placeholder="Enter survey title" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Survey Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {SURVEY_TYPES.filter((t: string) => t !== 'All').map((t: string) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Input placeholder="e.g., All Employees" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Survey description..." />
            </div>
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={() => { setShowNewSurveyModal(false); toast.success('Survey created!'); }}>
                Create Survey
              </Button>
              <Button variant="outline" onClick={() => setShowNewSurveyModal(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
