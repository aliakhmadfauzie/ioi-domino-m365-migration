/**
 * STR Approval Screen (Screen 5 - Approval/Decision)
 * Dedicated screen for Managers and HODs to verify and sign off on requests
 */

import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertTriangle,
  User,
  Calendar,
  Building2,
  FileText,
  Package,
  MapPin,
} from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import {
  useSTRSubmission,
  useApproveSTRSubmission,
  useRejectSTRSubmission,
  useReturnSTRSubmission,
} from '@/hooks/use-str-submissions';
import { getSTRStatusInfo, getSTRFormByCode } from '@/config/str-constants';
import { format, formatDistanceToNow } from 'date-fns';

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
} as const;

export default function STRApprovePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: user } = useUser();

  const { data: submission, isLoading } = useSTRSubmission(id || '');
  
  const approveMutation = useApproveSTRSubmission();
  const rejectMutation = useRejectSTRSubmission();
  const returnMutation = useReturnSTRSubmission();

  const [comments, setComments] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);

  const statusInfo = submission ? getSTRStatusInfo(submission.CurrentStatus) : null;
  const formInfo = submission ? getSTRFormByCode(submission.FormType) : null;
  
  const canApprove = submission && 
    ['Submitted', 'PendingReview', 'PendingApproval'].includes(submission.CurrentStatus);

  const handleApprove = async () => {
    if (!submission || !user) return;
    try {
      await approveMutation.mutateAsync({
        guid: submission.guid,
        approverName: user.fullName || 'Unknown',
        approverEmail: user.userPrincipalName || '',
        comments,
      });
      navigate(`/submissions/${submission.guid}`);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleReject = async () => {
    if (!submission || !user) return;
    if (!comments.trim()) {
      toast.error('Comments are required for rejection');
      return;
    }
    try {
      await rejectMutation.mutateAsync({
        guid: submission.guid,
        rejectorName: user.fullName || 'Unknown',
        rejectorEmail: user.userPrincipalName || '',
        comments,
      });
      setShowRejectDialog(false);
      navigate('/my-submissions');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleReturn = async () => {
    if (!submission || !user) return;
    try {
      await returnMutation.mutateAsync({
        guid: submission.guid,
        returnedBy: user.fullName || 'Unknown',
        returnedByEmail: user.userPrincipalName || '',
        comments,
      });
      setShowReturnDialog(false);
      navigate('/my-submissions');
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-11 w-11 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <Skeleton className="h-48 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-20 text-center">
          <FileText className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
          <h1 className="text-2xl font-bold text-foreground">Submission Not Found</h1>
          <p className="mt-2 text-muted-foreground">The requested submission could not be found.</p>
          <Button className="mt-6" asChild>
            <Link to="/my-submissions">Back to Submissions</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!canApprove) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-20 text-center">
          <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-accent-foreground" />
          <h1 className="text-2xl font-bold text-foreground">Cannot Process</h1>
          <p className="mt-2 text-muted-foreground">
            This submission is not pending approval. Current status: {statusInfo?.label}
          </p>
          <Button className="mt-6" asChild>
            <Link to={`/submissions/${submission.guid}`}>View Details</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-11 w-11" asChild>
              <Link to={`/submissions/${submission.guid}`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="rounded-xl bg-accent p-2.5 dark:bg-accent/30">
              <FileText className="h-5 w-5 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">Approval Decision</h1>
                <Badge variant={statusInfo?.badgeVariant}>{statusInfo?.label}</Badge>
              </div>
              <p className="text-sm text-muted-foreground font-mono">{submission.INO}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Request Summary */}
          <motion.div variants={itemVariants} initial="hidden" animate="show">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{submission.Title}</CardTitle>
                    <CardDescription className="mt-1">
                      {formInfo?.name || submission.FormType}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="font-mono">
                    {submission.FormType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground text-xs">Submitted By</p>
                      <p className="font-medium">{submission.Requestor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground text-xs">Department</p>
                      <p className="font-medium">{submission.Department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground text-xs">Site</p>
                      <p className="font-medium">{submission.Site}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground text-xs">Request Date</p>
                      <p className="font-medium">
                        {format(new Date(submission.RequestDate), 'dd MMM yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground text-xs">Age</p>
                      <p className="font-medium">
                        {formatDistanceToNow(new Date(submission.RequestDate), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Critical Data Points */}
          <motion.div variants={itemVariants} initial="hidden" animate="show" transition={{ delay: 0.1 }}>
            <Card className="border-2 border-accent dark:border-accent">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-accent-foreground" />
                  Review Key Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {submission.Comments && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Requestor Comments</p>
                    <p className="text-sm whitespace-pre-wrap">{submission.Comments}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground">Document Number</p>
                    <p className="font-mono font-medium">{submission.INO}</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground">Environment</p>
                    <Badge variant="secondary">{submission.EnvironmentTag}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Approval Actions */}
          <motion.div variants={itemVariants} initial="hidden" animate="show" transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Decision</CardTitle>
                <CardDescription>
                  Comments are required for rejection. Optional for approve/return.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="comments">Comments</Label>
                  <Textarea
                    id="comments"
                    placeholder="Enter your comments or reason for decision..."
                    value={comments}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComments(e.target.value)}
                    rows={4}
                    className="mt-2"
                  />
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleApprove}
                    disabled={approveMutation.isPending}
                    className="flex-1 bg-primary hover:bg-primary gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {approveMutation.isPending ? 'Approving...' : 'Approve'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowReturnDialog(true)}
                    disabled={returnMutation.isPending}
                    className="flex-1 gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Return for Revision
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setShowRejectDialog(true)}
                    disabled={rejectMutation.isPending || !comments.trim()}
                    className="flex-1 gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                </div>
                
                {!comments.trim() && (
                  <p className="text-xs text-muted-foreground text-center">
                    ⚠️ Comments are required before you can reject this submission
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Confirm Rejection
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this submission? This action cannot be undone.
              The requestor will be notified with your comments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={rejectMutation.isPending}
              className="bg-destructive hover:bg-destructive"
            >
              {rejectMutation.isPending ? 'Rejecting...' : 'Confirm Rejection'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Return Confirmation Dialog */}
      <AlertDialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-accent-foreground">
              <RotateCcw className="h-5 w-5" />
              Return for Revision
            </AlertDialogTitle>
            <AlertDialogDescription>
              The submission will be returned to the requestor for revision.
              They will need to address your comments and resubmit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReturn}
              disabled={returnMutation.isPending}
            >
              {returnMutation.isPending ? 'Returning...' : 'Confirm Return'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
