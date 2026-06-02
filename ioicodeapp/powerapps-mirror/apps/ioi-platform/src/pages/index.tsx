import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Server,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  Briefcase,
  Heart,
  Monitor,
  Key,
  Calendar,
  TrendingUp,
  Bell,
  Network,
  Mail,
  Undo2,
  Check,
  X,
  MessageSquare,
  Send,
  Loader2,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { useUser } from '@/hooks/use-user';
import { useRoleAccess } from '@/hooks/use-platform';
import { useSendEmail } from '@/hooks/use-send-email';
import { MainDBITCurrentstatusKeyToLabel, type MainDBITCurrentstatusKey, type MainDBIT } from '@/generated/models/main-dbit-model';
import { format, formatDistanceToNow } from 'date-fns';
import { DataReadyGuard } from '@/components/data-ready-guard';
import { toast } from 'sonner';
import { getITFormDetailPath } from '@/lib/it-form-routes';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.2, 0, 0, 1] } },
} as const;

interface QuickAction {
  icon: LucideIcon;
  label: string;
  description: string;
  path: string;
  color: string;
  bgColor: string;
  department: 'HR' | 'IT';
}

const quickActions: QuickAction[] = [
  {
    icon: Briefcase,
    label: 'Staff Requisition',
    description: 'Request new headcount',
    path: '/hr/recruitment',
    color: 'text-primary-foreground',
    bgColor: 'bg-primary',
    department: 'HR',
  },
  {
    icon: Calendar,
    label: 'Leave Application',
    description: 'Apply for time off',
    path: '/hr/leave',
    color: 'text-primary-foreground',
    bgColor: 'bg-primary',
    department: 'HR',
  },
  {
    icon: Monitor,
    label: 'IT Support',
    description: 'Create support ticket',
    path: '/it/support',
    color: 'text-primary-foreground',
    bgColor: 'bg-primary',
    department: 'IT',
  },
  {
    icon: Key,
    label: 'Access Request',
    description: 'Request system access',
    path: '/it/access',
    color: 'text-primary-foreground',
    bgColor: 'bg-primary',
    department: 'IT',
  },
  {
    icon: Heart,
    label: 'Health Declaration',
    description: 'Submit wellness form',
    path: '/hr/health',
    color: 'text-primary-foreground',
    bgColor: 'bg-primary',
    department: 'HR',
  },
  {
    icon: Network,
    label: 'Org Chart',
    description: 'View reporting structure',
    path: '/hr/org-chart',
    color: 'text-primary-foreground',
    bgColor: 'bg-primary',
    department: 'HR',
  },
];

function getStatusConfig(statusKey: string): { color: string; bgColor: string; borderColor: string } {
  switch (statusKey) {
    case 'CurrentstatusKey1': // Submitted
      return { color: 'text-secondary-foreground', bgColor: 'bg-secondary', borderColor: 'border-secondary' };
    case 'CurrentstatusKey2': // Under Review
      return { color: 'text-accent-foreground', bgColor: 'bg-accent', borderColor: 'border-accent' };
    case 'CurrentstatusKey3': // Approved
      return { color: 'text-primary-foreground', bgColor: 'bg-primary', borderColor: 'border-primary' };
    case 'CurrentstatusKey4': // Rejected
      return { color: 'text-destructive-foreground', bgColor: 'bg-destructive', borderColor: 'border-destructive' };
    case 'CurrentstatusKey5': // Revision Requested
      return { color: 'text-accent-foreground', bgColor: 'bg-accent', borderColor: 'border-accent' };
    case 'CurrentstatusKey6': // Cancelled
      return { color: 'text-muted-foreground', bgColor: 'bg-muted', borderColor: 'border-border' };
    case 'CurrentstatusKey7': // Completed
      return { color: 'text-primary-foreground', bgColor: 'bg-primary', borderColor: 'border-primary' };
    default: // Draft
      return { color: 'text-muted-foreground', bgColor: 'bg-muted', borderColor: 'border-border' };
  }
}

// Loading skeleton for stats
function StatsSkeleton() {
  return (
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i: number) => (
        <Card key={i} className="border-border">
          <CardContent className="p-4">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Loading skeleton for activity
function ActivitySkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i: number) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="h-4 w-48 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function HomePageContent() {
  const navigate = useNavigate();
  const { data: user, isLoading: userLoading } = useUser();
  const { data: itForms = [], isLoading: formsLoading } = useMainDBITList();
  const { canApprove, role } = useRoleAccess();
  const sendEmail = useSendEmail();
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);

  // Test email function
  const handleSendTestEmail = async () => {
    setIsSendingTestEmail(true);
    console.log('[Test Email] Starting test email send to alimigration@ioioi.onmicrosoft.com');
    
    try {
      const emailPayload = {
        to: 'alimigration@ioioi.onmicrosoft.com',
        subject: `[TEST] IOI Platform Email Test - ${format(new Date(), 'PPpp')}`,
        body: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%); padding: 24px; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 20px;">✅ Test Email Successful</h1>
            </div>
            
            <div style="background: #ffffff; padding: 24px; border: 1px solid #E0E0E0; border-top: none; border-radius: 0 0 8px 8px;">
              <p style="color: #1C1C1C; margin-bottom: 16px;">Hello,</p>
              
              <p style="color: #5C5C5C;">This is a test email from the IOI Acidchem Enterprise Platform to verify email notifications are working correctly.</p>
              
              <div style="background: #F5F5F5; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #5C5C5C; width: 140px;">Sent By:</td>
                    <td style="padding: 8px 0; color: #1C1C1C; font-weight: 600;">${user?.fullName || 'System'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #5C5C5C;">Email:</td>
                    <td style="padding: 8px 0; color: #1C1C1C;">${user?.userPrincipalName || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #5C5C5C;">Timestamp:</td>
                    <td style="padding: 8px 0; color: #1C1C1C;">${format(new Date(), 'PPpp')}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background: #E8F5E9; border-left: 4px solid #1B5E20; padding: 16px; border-radius: 4px; margin: 20px 0;">
                <p style="color: #1B5E20; font-weight: 600; margin: 0 0 8px 0;">Email System Status:</p>
                <p style="color: #5C5C5C; margin: 0;">✓ Office 365 connector is working<br/>✓ Email notifications are enabled<br/>✓ Edit request emails will be delivered</p>
              </div>
              
              <hr style="border: none; border-top: 1px solid #E0E0E0; margin: 24px 0;" />
              
              <p style="color: #9E9E9E; font-size: 12px; text-align: center;">
                This is an automated test from IOI Acidchem Enterprise Platform.
              </p>
            </div>
          </div>
        `,
        importance: 'Normal' as const,
        isHtml: true,
      };
      
      console.log('[Test Email] Payload prepared:', {
        to: emailPayload.to,
        subject: emailPayload.subject,
        importance: emailPayload.importance,
      });
      
      const result = await sendEmail.mutateAsync(emailPayload);
      
      console.log('[Test Email] Result:', result);
      
      if (result.success) {
        toast.success('Test email sent successfully! Check inbox (and spam) for alimigration@ioioi.onmicrosoft.com');
        console.log('[Test Email] SUCCESS - Email sent');
      } else {
        toast.error(`Failed to send email: ${result.error || 'Unknown error'}`);
        console.error('[Test Email] FAILED - Result error:', result.error);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[Test Email] EXCEPTION:', error);
      toast.error(`Email error: ${errorMessage}`);
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  // Compute real stats from data
  const stats = useMemo(() => {
    const userEmail = user?.userPrincipalName?.toLowerCase();

    // DEBUG: Log user email and sample data to diagnose filtering
    console.log('[Dashboard Stats] User email:', userEmail);
    console.log('[Dashboard Stats] Total forms loaded:', itForms.length);
    if (itForms.length > 0) {
      console.log('[Dashboard Stats] Sample requestor emails:', itForms.slice(0, 3).map((f: MainDBIT) => f.requestoremail));
    }

    // My submissions (created by current user) - case-insensitive match
    const mySubmissions = itForms.filter((form: MainDBIT) => {
      const requestorEmail = form.requestoremail?.toLowerCase()?.trim();
      const matches = requestorEmail === userEmail || 
                      requestorEmail?.includes(userEmail?.split('@')[0] || '') ||
                      !userEmail; // If no user email, show all for debugging
      return matches;
    });

    console.log('[Dashboard Stats] My submissions count:', mySubmissions.length);

    // Pending submissions (status = submitted or under review, created by me)
    const myPending = mySubmissions.filter((s: MainDBIT) => 
      s.currentStatus === 'CurrentstatusKey1' || s.currentStatus === 'CurrentstatusKey2'
    );

    // Approvals needed (pending items where I might be approver - for now show all pending)
    const pendingApprovals = itForms.filter((s: MainDBIT) => 
      s.currentStatus === 'CurrentstatusKey1' || s.currentStatus === 'CurrentstatusKey2'
    );

    // In progress (my submissions that are not draft or completed)
    const inProgress = mySubmissions.filter(
      (s: MainDBIT) => s.currentStatus === 'CurrentstatusKey1' || 
                       s.currentStatus === 'CurrentstatusKey2' || 
                       s.currentStatus === 'CurrentstatusKey5'
    );

    // Completed this month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const completedThisMonth = mySubmissions.filter((s: MainDBIT) => {
      if (s.currentStatus !== 'CurrentstatusKey3' && s.currentStatus !== 'CurrentstatusKey7') return false;
      const submitDate = s.submitteddate ? new Date(s.submitteddate) : null;
      return submitDate && submitDate >= monthStart;
    });

    return {
      myPending: myPending.length,
      needsApproval: pendingApprovals.length,
      inProgress: inProgress.length,
      completedThisMonth: completedThisMonth.length,
      totalSubmissions: mySubmissions.length,
    };
  }, [itForms, user]);

  // Recent activity - real data, sorted by date
  const recentActivity = useMemo(() => {
    return [...itForms]
      .sort((a: MainDBIT, b: MainDBIT) => {
        const dateA = a.submitteddate ? new Date(a.submitteddate).getTime() : 0;
        const dateB = b.submitteddate ? new Date(b.submitteddate).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 6);
  }, [itForms]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.fullName?.split(' ')[0] || 'there';

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Compact Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] as const }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-foreground">
            {userLoading ? <Skeleton className="h-7 w-48" /> : `${getGreeting()}, ${firstName}`}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">IOI Acidchem Enterprise Platform</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/my-submissions')}
            className="gap-1.5"
          >
            <FileText className="h-4 w-4" />
            My Submissions
          </Button>
          <Button
            size="sm"
            onClick={() => navigate('/approvals')}
            className="gap-1.5 bg-primary hover:bg-primary/90"
          >
            <ClipboardList className="h-4 w-4" />
            Approvals
            {stats.needsApproval > 0 && (
              <Badge variant="secondary" className="ml-1 bg-white/20 text-white text-xs px-1.5">
                {stats.needsApproval}
              </Badge>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics - Real Data */}
      {formsLoading ? (
        <StatsSkeleton />
      ) : (
        <motion.div
          className="grid gap-3 grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants}>
            <Card
              className="border-secondary bg-secondary cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/my-submissions')}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-secondary-foreground uppercase tracking-wide">Pending</p>
                    <p className="text-2xl font-bold text-secondary-foreground mt-1">{stats.myPending}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-secondary-foreground/10">
                    <Clock className="h-5 w-5 text-secondary-foreground" />
                  </div>
                </div>
                {stats.myPending > 0 && (
                  <p className="text-xs text-secondary-foreground mt-2 flex items-center gap-1">
                    <Bell className="h-3 w-3" />
                    Awaiting action
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card
              className="border-accent bg-accent cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/approvals')}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-accent-foreground uppercase tracking-wide">Needs Approval</p>
                    <p className="text-2xl font-bold text-accent-foreground mt-1">{stats.needsApproval}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-accent-foreground/10">
                    <AlertTriangle className="h-5 w-5 text-accent-foreground" />
                  </div>
                </div>
                {stats.needsApproval > 0 && (
                  <p className="text-xs text-accent-foreground mt-2 font-medium">Action required</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card
              className="border-primary bg-primary cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/my-submissions')}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-primary-foreground uppercase tracking-wide">In Progress</p>
                    <p className="text-2xl font-bold text-primary-foreground mt-1">{stats.inProgress}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-primary-foreground/10">
                    <TrendingUp className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-primary bg-primary">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-primary-foreground uppercase tracking-wide">Completed</p>
                    <p className="text-2xl font-bold text-primary-foreground mt-1">{stats.completedThisMonth}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-primary-foreground/10">
                    <CheckCircle className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>
                <p className="text-xs text-primary-foreground mt-2">This month</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Quick Actions - Takes prominence */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease: [0.2, 0, 0, 1] as const }}
        >
          <Card className="h-full border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pb-4">
              {/* Standard Quick Actions */}
              {quickActions.slice(0, 3).map((action: QuickAction) => {
                const Icon = action.icon;
                return (
                  <Link key={action.path} to={action.path}>
                    <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors group">
                      <div className={`p-2 rounded-lg ${action.bgColor}`}>
                        <Icon className={`h-4 w-4 ${action.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {action.label}
                        </p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0"
                      >
                        {action.department}
                      </Badge>
                    </div>
                  </Link>
                );
              })}

              {/* Divider */}
              <div className="border-t border-border my-2" />

              {/* Contact IT Support */}
              <Button
                variant="outline"
                className="w-full justify-start bg-background border-border text-foreground hover:bg-muted/50"
                onClick={() => navigate('/it/support')}
              >
                <Mail className="h-4 w-4 mr-2 text-primary" />
                Contact IT Support
              </Button>

              {/* Withdraw Submission - for users with pending submissions */}
              <Button
                variant="outline"
                className="w-full justify-start bg-background border-accent text-accent-foreground hover:bg-accent/10"
                onClick={() => navigate('/my-submissions')}
              >
                <Undo2 className="h-4 w-4 mr-2" />
                Withdraw Submission
              </Button>

              {/* Approver Actions - Only shown to users with approver role */}
              {canApprove && stats.needsApproval > 0 && (
                <>
                  <div className="border-t border-border my-2" />
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
                    Approver Actions
                  </p>
                  <Button
                    className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => navigate('/approvals')}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve Pending ({stats.needsApproval})
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-background border-destructive text-destructive hover:bg-destructive/10"
                    onClick={() => navigate('/approvals')}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject / Request Revision
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-background border-border text-foreground hover:bg-muted/50"
                    onClick={() => navigate('/approvals')}
                  >
                    <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                    Add Comments
                  </Button>
                </>
              )}

              {/* Test Email Button - Developer Tool */}
              <div className="border-t border-border my-2" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
                Developer Tools
              </p>
              <Button
                variant="outline"
                className="w-full justify-start bg-background border-primary text-primary hover:bg-primary/10"
                onClick={handleSendTestEmail}
                disabled={isSendingTestEmail}
              >
                {isSendingTestEmail ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Test Email
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity - Real Data */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15, ease: [0.2, 0, 0, 1] as const }}
        >
          <Card className="h-full border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Recent Activity
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/my-submissions')}
                className="text-xs text-muted-foreground hover:text-foreground gap-1 h-7"
              >
                View all
                <ArrowRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="pb-4">
              {formsLoading ? (
                <ActivitySkeleton />
              ) : recentActivity.length === 0 ? (
                <div className="text-center py-10">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No recent submissions</p>
                  <p className="text-xs text-muted-foreground mt-1">Create your first submission to get started</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {recentActivity.map((submission: MainDBIT) => {
                    const statusConfig = getStatusConfig(submission.currentStatus);
                    const submittedDate = submission.submitteddate ? new Date(submission.submitteddate) : null;

                    return (
                      <Link
                        key={submission.id}
                        to={getITFormDetailPath(submission.formcode, submission.id)}
                        className="block"
                      >
                        <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors group">
                          <div className={`p-2 rounded-lg ${statusConfig.bgColor}`}>
                            <FileText className={`h-4 w-4 ${statusConfig.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                              {submission.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{submission.formcode || 'IT'}</span>
                              {submittedDate && (
                                <>
                                  <span>•</span>
                                  <span title={format(submittedDate, 'PPpp')}>
                                    {formatDistanceToNow(submittedDate, { addSuffix: true })}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <Badge
                            className={`text-[10px] px-2 py-0.5 ${statusConfig.bgColor} ${statusConfig.color} border ${statusConfig.borderColor}`}
                          >
                            {MainDBITCurrentstatusKeyToLabel[submission.currentStatus]}
                          </Badge>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Department Cards */}
      <motion.div
        className="grid gap-4 md:grid-cols-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2, ease: [0.2, 0, 0, 1] as const }}
      >
        <Link to="/hr">
          <Card className="h-full border-border hover:border-primary/40 hover:shadow-md transition-all group cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-muted group-hover:bg-primary transition-colors">
                  <Users className="h-6 w-6 text-muted-foreground group-hover:text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    Human Resources
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Recruitment, leave management, health compliance, and employee lifecycle
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline" className="text-xs border-border">
                      8 Modules
                    </Badge>
                    <Badge className="text-xs bg-primary text-primary-foreground">
                      Active
                    </Badge>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/it">
          <Card className="h-full border-border hover:border-primary/40 hover:shadow-md transition-all group cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-muted group-hover:bg-primary transition-colors">
                  <Server className="h-6 w-6 text-muted-foreground group-hover:text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    Information Technology
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    User access, IT support, hardware inventory, and disaster recovery
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline" className="text-xs border-border">
                      6 Modules
                    </Badge>
                    <Badge className="text-xs bg-primary text-primary-foreground">
                      Active
                    </Badge>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    </div>
  );
}

// Main export - wraps the content with DataReadyGuard
export default function HomePage() {
  return (
    <DataReadyGuard loadingMessage="Loading dashboard...">
      <HomePageContent />
    </DataReadyGuard>
  );
}
