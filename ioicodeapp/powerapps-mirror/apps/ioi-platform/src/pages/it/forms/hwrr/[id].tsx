import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Check,
  X,
  HardDrive,
  User as UserIcon,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Package,
  Settings,
  RefreshCw,
  Trash2,
  Loader2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useUser } from '@/hooks/use-user';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import { recordITApprovalAction } from '@/lib/it-approval-actions';
import {
  WORKFLOW_STAGES,
  STATUS_COLORS,
  REQUEST_TYPE_LABELS,
  HARDWARE_TYPE_LABELS,
  PRIORITY_LABELS,
} from './data';

// =============================================================================
// COMPONENT
// =============================================================================

export default function HWRRDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user } = useUser();
  const queryClient = useQueryClient();

  // Fetch request data
  const { data: allRequests, isLoading } = useMainDBITList();

  // State
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [comments, setComments] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Find the specific request
  const request = allRequests?.find((r: MainDBIT) => r.title === id);

  // Parse remarks JSON
  const requestData = request?.remarks ? (() => {
    try {
      return JSON.parse(request.remarks);
    } catch {
      return {};
    }
  })() : {};

  // Get current workflow stage. Legacy records may still have old remarks JSON.
  const currentStage = request?.workflowstage || requestData.workflowStage || 1;
  const currentAction = request?.currentAction || requestData.currentAction || 'SUBMITTED';

  // Get status display
  const getStatusDisplay = () => {
    if (currentAction === 'REJECTED') return { status: 'REJECTED', label: 'Rejected' };
    if (currentStage >= 6) return { status: 'COMPLETED', label: 'Completed' };
    if (currentStage === 4) return { status: 'PROCUREMENT', label: 'Procurement' };
    if (currentStage > 1) return { status: 'IN_PROGRESS', label: WORKFLOW_STAGES[currentStage - 1]?.label || 'In Progress' };
    return { status: 'SUBMITTED', label: 'Submitted' };
  };

  const statusDisplay = getStatusDisplay();
  const statusStyle = STATUS_COLORS[statusDisplay.status] || STATUS_COLORS.PENDING;

  // Check if current user can approve
  const canApprove = () => {
    if (!user || !request) return false;

    // HOD approval stage
    if (currentStage === 2) {
      const hodEmail = requestData.departmentHeadEmail;
      return hodEmail && user.userPrincipalName?.toLowerCase() === hodEmail.toLowerCase();
    }

    // IT Review stage - IT department users
    if (currentStage === 3) {
      return requestData.department === 'Information Technology' ||
             user.userPrincipalName?.includes('it@');
    }

    return false;
  };

  // Handle approval
  const handleApprove = async () => {
    if (!request) return;
    setIsProcessing(true);

    try {
      const nextStage = currentStage + 1;
      const nextAction = WORKFLOW_STAGES[nextStage - 1]?.key || 'COMPLETED';

      await recordITApprovalAction({
        id: String(request.id),
        record: request,
        user,
        nextStatus: nextStage >= 6 ? 'CurrentstatusKey3' : 'CurrentstatusKey2',
        stageName: WORKFLOW_STAGES[currentStage - 1]?.label || 'HWRR Approval',
        actionType: nextStage >= 6 ? 'completed' : 'approved',
        comment: comments,
        mainPatch: {
          workflowstage: nextStage,
          currentAction: nextAction,
          hODApproverRemarks: comments
            ? `${request.hODApproverRemarks || ''}\n[${new Date().toISOString()}] ${user?.fullName}: ${comments}`
            : request.hODApproverRemarks,
        },
      });
      await queryClient.invalidateQueries({ queryKey: ['mainDBIT-list'] });
      await queryClient.invalidateQueries({ queryKey: ['mainDBIT', String(request.id)] });

      toast.success('Request approved successfully!');
      setShowApproveDialog(false);
      setComments('');
    } catch (error: unknown) {
      console.error('Approval error:', error);
      toast.error('Failed to approve request');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle rejection
  const handleReject = async () => {
    if (!request || !comments.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    setIsProcessing(true);

    try {
      await recordITApprovalAction({
        id: String(request.id),
        record: request,
        user,
        nextStatus: 'CurrentstatusKey4',
        stageName: WORKFLOW_STAGES[currentStage - 1]?.label || 'HWRR Rejection',
        actionType: 'rejected',
        comment: comments,
        mainPatch: {
          currentAction: 'REJECTED',
          hODApproverRemarks: `${request.hODApproverRemarks || ''}\n[${new Date().toISOString()}] ${user?.fullName}: ${comments}`,
        },
      });
      await queryClient.invalidateQueries({ queryKey: ['mainDBIT-list'] });
      await queryClient.invalidateQueries({ queryKey: ['mainDBIT', String(request.id)] });

      toast.success('Request rejected');
      setShowRejectDialog(false);
      setComments('');
    } catch (error: unknown) {
      console.error('Rejection error:', error);
      toast.error('Failed to reject request');
    } finally {
      setIsProcessing(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#f59e0b' }} />
          <span style={{ color: '#5C5C5C' }}>Loading request...</span>
        </div>
      </div>
    );
  }

  // Not found state
  if (!request) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
        <Card className="max-w-md" style={{ borderRadius: '12px' }}>
          <CardContent className="pt-8 pb-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#DC2626' }} />
            <h2 className="text-lg font-semibold mb-2" style={{ color: '#1C1C1C' }}>Request Not Found</h2>
            <p className="text-sm mb-6" style={{ color: '#5C5C5C' }}>The hardware request you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/it/forms')} style={{ backgroundColor: '#f59e0b' }}>Back to Forms</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] p-6" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/my-submissions')}
            className="mb-4 -ml-2"
            style={{ color: '#5C5C5C' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Submissions
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}
              >
                <HardDrive className="w-6 h-6" style={{ color: '#f59e0b' }} />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: '#1C1C1C', fontFamily: 'Segoe UI' }}>
                  {request.title}
                </h1>
                <p className="text-sm" style={{ color: '#5C5C5C' }}>
                  Hardware Request • Submitted {request.submitteddate ? new Date(request.submitteddate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            <Badge
              className="px-3 py-1"
              style={{
                backgroundColor: statusStyle.bg,
                color: statusStyle.text,
                border: `1px solid ${statusStyle.border}`,
              }}
            >
              {statusDisplay.label}
            </Badge>
          </div>
        </div>

        {/* Workflow Progress */}
        <Card className="mb-6" style={{ borderRadius: '12px' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {WORKFLOW_STAGES.map((stage, index) => {
                const isCompleted = currentStage > stage.id;
                const isCurrent = currentStage === stage.id;
                const isRejected = currentAction === 'REJECTED' && currentStage === stage.id;

                return (
                  <div key={stage.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                        style={{
                          backgroundColor: isRejected
                            ? '#DC2626'
                            : isCompleted
                              ? '#166534'
                              : isCurrent
                                ? '#f59e0b'
                                : '#E0E0E0',
                          color: (isRejected || isCompleted || isCurrent) ? '#FFFFFF' : '#5C5C5C',
                        }}
                      >
                        {isRejected ? (
                          <X className="w-5 h-5" />
                        ) : isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <span className="text-sm font-semibold">{stage.id}</span>
                        )}
                      </div>
                      <span
                        className="text-xs mt-2 font-medium text-center max-w-[70px]"
                        style={{
                          color: (isCompleted || isCurrent) ? '#1C1C1C' : '#5C5C5C',
                          fontFamily: 'Segoe UI',
                        }}
                      >
                        {stage.label}
                      </span>
                    </div>

                    {index < WORKFLOW_STAGES.length - 1 && (
                      <div
                        className="w-8 h-0.5 mx-1"
                        style={{
                          backgroundColor: isCompleted ? '#166534' : '#D0D0D0',
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Requestor Information */}
            <Card style={{ borderRadius: '12px' }}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base" style={{ color: '#1C1C1C' }}>
                  <UserIcon className="w-4 h-4" style={{ color: '#f59e0b' }} />
                  Requestor Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span style={{ color: '#5C5C5C' }}>Name:</span>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>{requestData.requestor || 'N/A'}</p>
                  </div>
                  <div>
                    <span style={{ color: '#5C5C5C' }}>Company:</span>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>{requestData.company || 'N/A'}</p>
                  </div>
                  <div>
                    <span style={{ color: '#5C5C5C' }}>Site:</span>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>{requestData.site || 'N/A'}</p>
                  </div>
                  <div>
                    <span style={{ color: '#5C5C5C' }}>Department:</span>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>{requestData.department || 'N/A'}</p>
                  </div>
                  <div>
                    <span style={{ color: '#5C5C5C' }}>Phone Extension:</span>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>{requestData.phoneExt || 'N/A'}</p>
                  </div>
                  <div>
                    <span style={{ color: '#5C5C5C' }}>Email:</span>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>{requestData.emailAddress || request.requestoremail || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hardware Details */}
            <Card style={{ borderRadius: '12px' }}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base" style={{ color: '#1C1C1C' }}>
                  <Package className="w-4 h-4" style={{ color: '#f59e0b' }} />
                  Hardware Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span style={{ color: '#5C5C5C' }}>Request Type:</span>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>
                      {REQUEST_TYPE_LABELS[requestData.requestType] || requestData.requestType || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span style={{ color: '#5C5C5C' }}>Hardware Type:</span>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>
                      {HARDWARE_TYPE_LABELS[requestData.hardwareType] || requestData.hardwareType || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span style={{ color: '#5C5C5C' }}>Quantity:</span>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>{requestData.quantity || 1}</p>
                  </div>
                  <div>
                    <span style={{ color: '#5C5C5C' }}>For User:</span>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>{requestData.forUser || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <span style={{ color: '#5C5C5C' }}>Location:</span>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>{requestData.location || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <span style={{ color: '#5C5C5C' }}>Specifications:</span>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>{requestData.specifications || 'N/A'}</p>
                  </div>
                </div>

                {/* Conditional: Replacement Details */}
                {requestData.requestType === 'REPLACEMENT' && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex items-center gap-2 mb-3">
                      <RefreshCw className="w-4 h-4" style={{ color: '#f59e0b' }} />
                      <span className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>Replacement Details</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span style={{ color: '#5C5C5C' }}>Old Asset Tag:</span>
                        <p className="font-medium" style={{ color: '#1C1C1C' }}>{requestData.oldAssetTag || 'N/A'}</p>
                      </div>
                      <div>
                        <span style={{ color: '#5C5C5C' }}>Old Serial Number:</span>
                        <p className="font-medium" style={{ color: '#1C1C1C' }}>{requestData.oldSerialNumber || 'N/A'}</p>
                      </div>
                      <div className="col-span-2">
                        <span style={{ color: '#5C5C5C' }}>Reason:</span>
                        <p className="font-medium" style={{ color: '#1C1C1C' }}>{requestData.replacementReason || 'N/A'}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Conditional: Upgrade Details */}
                {requestData.requestType === 'UPGRADE' && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex items-center gap-2 mb-3">
                      <Settings className="w-4 h-4" style={{ color: '#f59e0b' }} />
                      <span className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>Upgrade Details</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="col-span-2">
                        <span style={{ color: '#5C5C5C' }}>Current Asset Tag:</span>
                        <p className="font-medium" style={{ color: '#1C1C1C' }}>{requestData.currentAssetTag || 'N/A'}</p>
                      </div>
                      <div className="col-span-2">
                        <span style={{ color: '#5C5C5C' }}>Current Specifications:</span>
                        <p className="font-medium" style={{ color: '#1C1C1C' }}>{requestData.currentSpecs || 'N/A'}</p>
                      </div>
                      <div className="col-span-2">
                        <span style={{ color: '#5C5C5C' }}>Desired Specifications:</span>
                        <p className="font-medium" style={{ color: '#1C1C1C' }}>{requestData.desiredSpecs || 'N/A'}</p>
                      </div>
                      <div className="col-span-2">
                        <span style={{ color: '#5C5C5C' }}>Reason:</span>
                        <p className="font-medium" style={{ color: '#1C1C1C' }}>{requestData.upgradeReason || 'N/A'}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Conditional: Disposal Details */}
                {requestData.requestType === 'DISPOSAL' && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex items-center gap-2 mb-3">
                      <Trash2 className="w-4 h-4" style={{ color: '#DC2626' }} />
                      <span className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>Disposal Details</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span style={{ color: '#5C5C5C' }}>Asset Tag:</span>
                        <p className="font-medium" style={{ color: '#1C1C1C' }}>{requestData.disposalAssetTag || 'N/A'}</p>
                      </div>
                      <div>
                        <span style={{ color: '#5C5C5C' }}>Serial Number:</span>
                        <p className="font-medium" style={{ color: '#1C1C1C' }}>{requestData.disposalSerialNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <span style={{ color: '#5C5C5C' }}>Reason:</span>
                        <p className="font-medium" style={{ color: '#1C1C1C' }}>{requestData.disposalReason || 'N/A'}</p>
                      </div>
                      <div>
                        <span style={{ color: '#5C5C5C' }}>Data Wipe Confirmed:</span>
                        <p className="font-medium" style={{ color: requestData.dataWipeConfirm ? '#16A34A' : '#DC2626' }}>
                          {requestData.dataWipeConfirm ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Justification */}
            <Card style={{ borderRadius: '12px' }}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base" style={{ color: '#1C1C1C' }}>
                  <FileText className="w-4 h-4" style={{ color: '#f59e0b' }} />
                  Justification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span style={{ color: '#5C5C5C' }}>Priority:</span>
                    <p
                      className="font-medium"
                      style={{ color: PRIORITY_LABELS[requestData.priority]?.color || '#5C5C5C' }}
                    >
                      {PRIORITY_LABELS[requestData.priority]?.label || requestData.priority || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span style={{ color: '#5C5C5C' }}>Required By:</span>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>
                      {requestData.requiredDate ? new Date(requestData.requiredDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
                <div>
                  <span className="text-sm" style={{ color: '#5C5C5C' }}>Business Justification:</span>
                  <p className="text-sm mt-1" style={{ color: '#1C1C1C' }}>
                    {requestData.businessJustification || 'No justification provided'}
                  </p>
                </div>
                {requestData.remarks && (
                  <div className="mt-4">
                    <span className="text-sm" style={{ color: '#5C5C5C' }}>Additional Remarks:</span>
                    <p className="text-sm mt-1" style={{ color: '#1C1C1C' }}>{requestData.remarks}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            {canApprove() && currentAction !== 'REJECTED' && (
              <Card style={{ borderRadius: '12px' }}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base" style={{ color: '#1C1C1C' }}>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={() => setShowApproveDialog(true)}
                    style={{ backgroundColor: '#166534' }}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setShowRejectDialog(true)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Approval Info */}
            <Card style={{ borderRadius: '12px' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base" style={{ color: '#1C1C1C' }}>Approval Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <span style={{ color: '#5C5C5C' }}>Department Head:</span>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>{requestData.departmentHead || 'N/A'}</p>
                  </div>
                  {requestData.ccRecipients && (
                    <div>
                      <span style={{ color: '#5C5C5C' }}>CC Recipients:</span>
                      <p className="font-medium" style={{ color: '#1C1C1C' }}>{requestData.ccRecipients}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Approval History */}
            {requestData.approvalHistory && requestData.approvalHistory.length > 0 && (
              <Card style={{ borderRadius: '12px' }}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base" style={{ color: '#1C1C1C' }}>
                    <Clock className="w-4 h-4" style={{ color: '#f59e0b' }} />
                    Approval History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {requestData.approvalHistory.map((history: {
                      stage: number;
                      action: string;
                      by: string;
                      email: string;
                      date: string;
                      comments?: string;
                    }, index: number) => (
                      <div key={index} className="flex gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: history.action === 'APPROVED'
                              ? 'rgba(22, 163, 74, 0.1)'
                              : 'rgba(220, 38, 38, 0.1)',
                          }}
                        >
                          {history.action === 'APPROVED' ? (
                            <CheckCircle2 className="w-4 h-4" style={{ color: '#16A34A' }} />
                          ) : (
                            <XCircle className="w-4 h-4" style={{ color: '#DC2626' }} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium" style={{ color: '#1C1C1C' }}>
                            {history.action === 'APPROVED' ? 'Approved' : 'Rejected'} by {history.by}
                          </p>
                          <p className="text-xs" style={{ color: '#5C5C5C' }}>
                            {WORKFLOW_STAGES[history.stage - 1]?.label} • {new Date(history.date).toLocaleString()}
                          </p>
                          {history.comments && (
                            <p className="text-xs mt-1 p-2 rounded" style={{ backgroundColor: '#FAFAFA', color: '#1C1C1C' }}>
                              "{history.comments}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
            <DialogDescription>
              You are about to approve this hardware request. Add optional comments below.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label>Comments (Optional)</Label>
            <Textarea
              value={comments}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComments(e.target.value)}
              placeholder="Add any comments or notes..."
              className="mt-2"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={isProcessing} style={{ backgroundColor: '#166534' }}>
              {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this hardware request.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label>Reason for Rejection <span style={{ color: '#DC2626' }}>*</span></Label>
            <Textarea
              value={comments}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComments(e.target.value)}
              placeholder="Enter the reason for rejection..."
              className="mt-2"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isProcessing || !comments.trim()}>
              {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <X className="w-4 h-4 mr-2" />}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
