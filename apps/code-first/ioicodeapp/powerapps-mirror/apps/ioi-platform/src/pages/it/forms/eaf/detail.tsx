/**
 * EAF - External Access Form Detail / Approval Screen
 * 5-stage workflow: Requestor -> HOD -> Division Director / COO -> IT Manager -> IT Provisioning
 */
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  Info,
  Loader2,
  Mail,
  MessageSquare,
  Monitor,
  Shield,
  Tag,
  User,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RecordInfoPanel } from '@/components/hr/record-info-panel';
import { ApprovalRecordsActionKeyToLabel, type ApprovalRecords, type ApprovalRecordsActionKey } from '@/generated/models/approval-records-model';
import { MainDBITCurrentstatusKeyToLabel, type MainDBIT } from '@/generated/models/main-dbit-model';
import type { MainDBITExtAccess } from '@/generated/models/main-dbit-ext-access-model';
import { ApprovalRecordsService } from '@/generated/services/approval-records-service';
import { MainDBITExtAccessService } from '@/generated/services/main-dbit-ext-access-service';
import { MainDBITService } from '@/generated/services/main-dbit-service';
import { useDynamicRoleAccess } from '@/hooks/use-dynamic-role-access';
import { useUser } from '@/hooks/use-user';
import { getITCurrentActionAccess } from '@/lib/it-current-action-access';

type StageName = 'HOD' | 'Div Director' | 'IT Manager' | 'IT Provisioning';

interface StageAction {
  action: string;
  label: string;
  variant: 'approve' | 'reject';
  stage: StageName;
}

interface DetailField {
  label: string;
  value?: unknown;
  icon?: typeof FileText;
}

interface InfoCardProps {
  title: string;
  icon: typeof FileText;
  fields: DetailField[];
  showEmptyFields?: boolean;
}

interface SharePointAuditMetadata {
  Author?: { DisplayName?: string | null } | null;
  Created?: string | Date | null;
  Modified?: string | Date | null;
}

const STAGE_ACTIONS: Record<string, StageAction[]> = {
  CurrentstatusKey27: [
    { action: 'CurrentstatusKey11', label: 'Approve as HOD', variant: 'approve', stage: 'HOD' },
    { action: 'CurrentstatusKey6', label: 'Reject', variant: 'reject', stage: 'HOD' },
  ],
  CurrentstatusKey11: [
    { action: 'CurrentstatusKey12', label: 'Approve as Div Director', variant: 'approve', stage: 'Div Director' },
    { action: 'CurrentstatusKey6', label: 'Reject', variant: 'reject', stage: 'Div Director' },
  ],
  CurrentstatusKey12: [
    { action: 'CurrentstatusKey1', label: 'Approve as IT Manager', variant: 'approve', stage: 'IT Manager' },
    { action: 'CurrentstatusKey6', label: 'Reject', variant: 'reject', stage: 'IT Manager' },
  ],
  CurrentstatusKey1: [
    { action: 'CurrentstatusKey5', label: 'Mark Provisioning Complete', variant: 'approve', stage: 'IT Provisioning' },
  ],
};

const WORKFLOW_STAGES = [
  { key: 'CurrentstatusKey27', title: 'HOD Approval' },
  { key: 'CurrentstatusKey11', title: 'Division Director / COO' },
  { key: 'CurrentstatusKey12', title: 'IT Manager' },
  { key: 'CurrentstatusKey1', title: 'IT Provisioning / Approved' },
] as const;

function isFilled(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

function formatValue(value: unknown): string {
  if (!isFilled(value)) return '-';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime()) && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      return format(parsed, 'dd MMM yyyy h:mm a');
    }
    return value;
  }
  return String(value);
}

function approvalLabel(actionKey?: ApprovalRecordsActionKey): string {
  return actionKey ? ApprovalRecordsActionKeyToLabel[actionKey] ?? actionKey : 'Action';
}

function parentId(ext: MainDBITExtAccess): string {
  return ext.parentRecord?.id === undefined ? '' : String(ext.parentRecord.id);
}

function parentTitle(ext: MainDBITExtAccess): string {
  return ext.parentRecord?.title ?? '';
}

function InfoCard({ title, icon: Icon, fields, showEmptyFields = false }: InfoCardProps) {
  const visibleFields = showEmptyFields ? fields : fields.filter((field) => isFilled(field.value));
  if (visibleFields.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {visibleFields.map((field) => {
            const FieldIcon = field.icon;
            return (
              <div key={field.label} className="min-w-0">
                <dt className="text-muted-foreground flex items-center gap-1.5">
                  {FieldIcon && <FieldIcon className="h-3.5 w-3.5" />}
                  {field.label}
                </dt>
                <dd className="font-medium mt-1 break-words whitespace-pre-wrap">{formatValue(field.value)}</dd>
              </div>
            );
          })}
        </dl>
      </CardContent>
    </Card>
  );
}

function StageCard({
  title,
  active,
  completed,
  fields,
}: {
  title: string;
  active: boolean;
  completed: boolean;
  fields: DetailField[];
}) {
  return (
    <Card className={active ? 'border-amber-300' : completed ? 'border-emerald-200' : ''}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {title}
          {completed && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {completed ? 'Completed' : active ? 'Awaiting approval' : 'Pending'}
        </p>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {fields.filter((field) => isFilled(field.value)).map((field) => (
            <div key={field.label}>
              <dt className="text-muted-foreground">{field.label}</dt>
              <dd className="font-medium mt-1 break-words whitespace-pre-wrap">{formatValue(field.value)}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

function nextWorkflowStage(action: string): number {
  if (action === 'CurrentstatusKey6') return 0;
  if (action === 'CurrentstatusKey11') return 3;
  if (action === 'CurrentstatusKey12') return 4;
  if (action === 'CurrentstatusKey1') return 5;
  if (action === 'CurrentstatusKey5') return 6;
  return 2;
}

function actionText(stage: StageName, action: string): string {
  return action === 'CurrentstatusKey6' ? `${stage} Rejected` : `${stage} Approved`;
}

function formatApprovalComment({
  stage,
  action,
  actorName,
  actorId,
  comment,
  submittedAt,
}: {
  stage: StageName;
  action: string;
  actorName: string;
  actorId: string;
  comment: string;
  submittedAt: string;
}): string {
  const actionLabel = actionText(stage, action);
  const actor = actorName === actorId ? actorName : `${actorName} (${actorId})`;
  const commentText = comment.trim() || 'No comment provided.';
  return `${actionLabel} by ${actor} on ${format(new Date(submittedAt), 'dd MMM yyyy h:mm a')}\n${commentText}`;
}

function appendApprovalComment(existing: string | undefined, entry: string): string {
  return [existing?.trim(), entry.trim()].filter(Boolean).join('\n\n');
}

function stageUpdate(stage: StageName, action: string, comment: string, actor: string): Partial<Omit<MainDBITExtAccess, 'id'>> {
  const now = new Date().toISOString();
  const decision = action === 'CurrentstatusKey6' ? 'Rejected' : 'Approved';

  if (stage === 'HOD') {
    return {
      eAFDeptHeadStatus: decision,
      eAFDeptHeadDate: now,
      eAFDeptHeadComment: comment,
    };
  }
  if (stage === 'Div Director') {
    return {
      eAFDDAppApprovedBy: actor,
      eAFDDAppStatus: decision,
      eAFDDAppDate: now,
      eAFDDAppComment: comment,
    };
  }
  if (stage === 'IT Manager') {
    return {
      eAFITManagerApprovedBy: actor,
      eAFITManagerStatus: decision,
      eAFITManagerDate: now,
      eAFITManagerComment: comment,
    };
  }
  // IT Provisioning
  return {
    eAFITCompletedBy: actor,
    eAFITCompletedDate: now,
    eAFITCompletionStatus: 'Completed',
    eAFITComment: comment,
  };
}

export default function EAFDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user } = useUser();
  const roleAccess = useDynamicRoleAccess({ moduleScope: 'IT' });
  const [loading, setLoading] = useState(false);
  const [remark, setRemark] = useState('');

  const {
    data: record,
    isLoading: recordLoading,
    error: recordError,
    refetch: refetchRecord,
  } = useQuery({
    queryKey: ['mainDBIT', 'EAF', id],
    queryFn: async () => {
      if (!id) return null;
      const records = await MainDBITService.getAll({ filter: `id eq ${id}` });
      return (records[0] ?? null) as MainDBIT | null;
    },
    enabled: !!id,
  });

  const {
    data: extRecords = [],
    isLoading: extLoading,
    refetch: refetchExt,
  } = useQuery({
    queryKey: ['mainDBITExtAccess', 'EAF', id, record?.title],
    queryFn: async () => MainDBITExtAccessService.getAll({ filter: "parentFormCode eq 'EAF'" }),
    enabled: !!id,
  });

  const {
    data: approvalRecords = [],
    isLoading: approvalsLoading,
    refetch: refetchApprovals,
  } = useQuery({
    queryKey: ['approvalRecords', 'EAF', id],
    queryFn: async () => ApprovalRecordsService.getAll({ filter: `formcode eq 'EAF'` }),
    enabled: !!id,
  });

  const extRecord = useMemo(() => {
    if (!record || !id) return undefined;
    return extRecords.find((ext) => parentId(ext) === String(id) || (!!record.title && parentTitle(ext) === record.title));
  }, [extRecords, id, record]);

  const relatedApprovals = useMemo(
    () => approvalRecords
      .filter((approval) => approval.formid === String(id))
      .sort((a, b) => (a.stagenumber ?? 0) - (b.stagenumber ?? 0)),
    [approvalRecords, id],
  );

  const statusKey = String(record?.currentStatus || '');
  const statusLabel = MainDBITCurrentstatusKeyToLabel[statusKey as keyof typeof MainDBITCurrentstatusKeyToLabel] || statusKey || 'Unknown';
  const availableActions = STAGE_ACTIONS[statusKey] || [];
  const actionAccess = record
    ? getITCurrentActionAccess({
        record,
        user,
        roleAccess,
        statusLabel,
        currentStageName: availableActions[0]?.stage,
        sources: extRecord ? [extRecord as unknown as Record<string, unknown>] : [],
        blockInitiator: true,
      })
    : undefined;

  const handleAction = async (action: string, stage: StageName) => {
    if (!id || !record) return;
    if (!actionAccess?.canAct) {
      toast.error(actionAccess?.reason || 'You are not assigned to this action.');
      return;
    }
    setLoading(true);
    try {
      const actorName = user?.fullName || user?.userPrincipalName || 'Approver';
      const actorId = user?.userPrincipalName || actorName;
      const comment = remark.trim();
      const actionKey: ApprovalRecordsActionKey = action === 'CurrentstatusKey6' ? 'ActionKey1' : 'ActionKey0';
      const submittedAt = new Date().toISOString();
      const statusLabelAfterAction = MainDBITCurrentstatusKeyToLabel[action as keyof typeof MainDBITCurrentstatusKeyToLabel] || action;
      const currentAction = `${actionText(stage, action)} by ${actorName}`;
      const approvalComment = formatApprovalComment({ stage, action, actorName, actorId, comment, submittedAt });

      await MainDBITService.update(id, {
        currentStatus: action,
        workflowstage: nextWorkflowStage(action),
        currentAction,
        approvedByEmail: actorId,
        approvedByName: actorName,
        hODApproverRemarks: appendApprovalComment(record.hODApproverRemarks, approvalComment),
      });

      if (extRecord?.id) {
        await MainDBITExtAccessService.update(String(extRecord.id), stageUpdate(stage, action, approvalComment, actorName));
      }

      try {
        await ApprovalRecordsService.create({
          stagename: stage,
          formid: String(id),
          formcode: 'EAF',
          stagenumber: nextWorkflowStage(action),
          actionbyid: actorId,
          actionbyname: actorName,
          actiondate: submittedAt,
          actionKey,
          comments: approvalComment,
          nextstage: statusLabelAfterAction,
        });
      } catch (historyError) {
        console.warn('[EAF] Status updated but approval history write failed:', historyError);
      }

      toast.success('Status updated');
      setRemark('');
      await Promise.all([refetchRecord(), refetchExt(), refetchApprovals()]);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update EAF');
    } finally {
      setLoading(false);
    }
  };

  if (recordLoading || extLoading || approvalsLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  if (recordError || !record) return <div className="p-6 text-center">Record not found</div>;

  const currentStageIndex = WORKFLOW_STAGES.findIndex((stage) => stage.key === statusKey);
  const isApproved = statusKey === 'CurrentstatusKey1';
  const isVerified = statusKey === 'CurrentstatusKey5';
  const isTerminal = isApproved || isVerified || statusKey === 'CurrentstatusKey6';
  const auditMetadata = record as MainDBIT & SharePointAuditMetadata;

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/it/forms/eaf')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold break-words">{record.title || `EAF-${id}`}</h1>
            <Badge className="bg-blue-100 text-blue-800">{statusLabel}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {record.requestoremail || 'No requestor email'} &middot; Submitted {record.submitteddate ? format(new Date(record.submitteddate), 'dd MMM yyyy') : 'N/A'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <InfoCard
            title="Essential Information"
            icon={Info}
            fields={[
              { label: 'Title', value: record.title, icon: FileText },
              { label: 'Form Code', value: record.formcode, icon: Tag },
              { label: 'Status', value: statusLabel, icon: CheckCircle2 },
              { label: 'Workflow Stage', value: record.workflowstage, icon: Shield },
              { label: 'Current Action', value: record.currentAction, icon: CheckCircle2 },
              { label: 'Action By Email', value: record.approvedByEmail, icon: Mail },
              { label: 'Action By Name', value: record.approvedByName, icon: User },
              { label: 'Requestor Name', value: record.requestorName, icon: User },
              { label: 'Requestor Email', value: record.requestoremail, icon: Mail },
              { label: 'Submitted Date', value: record.submitteddate, icon: Calendar },
              { label: 'Company', value: record.company, icon: Building2 },
            ]}
          />

          <InfoCard
            title="Request Information"
            icon={Shield}
            showEmptyFields
            fields={[
              { label: 'Description', value: record.remarks || extRecord?.eAFJustification, icon: FileText },
              { label: 'Target User Email', value: extRecord?.eAFTargetUserEmail, icon: User },
              { label: 'Client ID', value: extRecord?.eAFClientID, icon: Tag },
              { label: 'User Group', value: extRecord?.eAFUserGroup, icon: User },
              { label: 'Application Name', value: extRecord?.eAFApplication, icon: Monitor },
              { label: 'System', value: extRecord?.eAFSystemName, icon: Monitor },
              { label: 'Business Justification', value: extRecord?.eAFJustification || record.remarks, icon: FileText },
              { label: 'CC Recipients', value: extRecord?.eAFCC || extRecord?.eAFReminderTo, icon: Mail },
              { label: 'Approver', value: extRecord?.eAFDeptHeadEmail, icon: User },
              { label: 'Higher Approver', value: extRecord?.eAFHigherApproverEmail, icon: User },
              { label: 'PanCen Route', value: extRecord?.eAFIsPCN === '1' ? 'Yes' : extRecord?.eAFIsPCN === '0' ? 'No' : undefined, icon: Building2 },
            ]}
          />

          <InfoCard
            title="IT Configuration"
            icon={Monitor}
            fields={[
              { label: 'IT Completed By', value: extRecord?.eAFITCompletedBy, icon: User },
              { label: 'IT Completed Date', value: extRecord?.eAFITCompletedDate, icon: Calendar },
              { label: 'IT Completion Status', value: extRecord?.eAFITCompletionStatus, icon: CheckCircle2 },
              { label: 'IT Comment', value: extRecord?.eAFITComment, icon: MessageSquare },
              { label: 'IT Config Status', value: extRecord?.eAFITConfigStatus, icon: CheckCircle2 },
              { label: 'IT Config Remarks', value: extRecord?.eAFITConfigRemarks, icon: MessageSquare },
              { label: 'Attachment', value: extRecord?.eAFAttachment, icon: FileText },
            ]}
          />

          {WORKFLOW_STAGES.map((stage, index) => {
            const active = statusKey === stage.key;
            const completed = isTerminal || (isApproved && index < 3) || (isVerified && index < 4) || (currentStageIndex > index) || (currentStageIndex === -1 && record.workflowstage ? record.workflowstage > index + 2 : false);
            const stageFields =
              index === 0
                ? [
                    { label: 'Approver', value: extRecord?.eAFDeptHeadEmail },
                    { label: 'Status', value: extRecord?.eAFDeptHeadStatus },
                    { label: 'Date', value: extRecord?.eAFDeptHeadDate },
                    { label: 'Comment', value: extRecord?.eAFDeptHeadComment },
                  ]
                : index === 1
                  ? [
                      { label: 'Approver', value: extRecord?.eAFDDAppApprovedBy || extRecord?.eAFHigherApproverEmail },
                      { label: 'Status', value: extRecord?.eAFDDAppStatus },
                      { label: 'Date', value: extRecord?.eAFDDAppDate },
                      { label: 'Comment', value: extRecord?.eAFDDAppComment },
                    ]
                : index === 2
                  ? [
                      { label: 'Approver', value: extRecord?.eAFITManagerApprovedBy },
                      { label: 'Status', value: extRecord?.eAFITManagerStatus },
                      { label: 'Date', value: extRecord?.eAFITManagerDate },
                      { label: 'Comment', value: extRecord?.eAFITManagerComment },
                    ]
                  : [
                      { label: 'Completed By', value: extRecord?.eAFITCompletedBy },
                      { label: 'Status', value: extRecord?.eAFITCompletionStatus },
                      { label: 'Date', value: extRecord?.eAFITCompletedDate },
                      { label: 'Comment', value: extRecord?.eAFITComment || extRecord?.eAFITConfigRemarks },
                      { label: 'Config Status', value: extRecord?.eAFITConfigStatus },
                    ];
            return <StageCard key={stage.key} title={stage.title} active={active} completed={completed} fields={stageFields} />;
          })}
        </div>

        <div className="space-y-6">
          <RecordInfoPanel
            createdBy={auditMetadata.Author?.DisplayName || 'System'}
            createdDate={auditMetadata.Created ? new Date(auditMetadata.Created) : undefined}
            lastModified={auditMetadata.Modified ? new Date(auditMetadata.Modified) : undefined}
            requestorEmail={record.requestoremail || ''}
          />

          {availableActions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!actionAccess?.canAct && actionAccess?.reason && (
                  <p className="text-xs text-muted-foreground">{actionAccess.reason}</p>
                )}
                <div className="space-y-2">
                  <Label>Comment</Label>
                  <Textarea
                    value={remark}
                    onChange={(event) => setRemark(event.target.value)}
                    placeholder="Add approver comment..."
                    rows={4}
                    disabled={!actionAccess?.canAct || loading}
                  />
                </div>
                {availableActions.map((action) => (
                  <Button
                    key={action.action}
                    className="w-full"
                    variant={action.variant === 'approve' ? 'default' : 'destructive'}
                    onClick={() => handleAction(action.action, action.stage)}
                    disabled={loading || !actionAccess?.canAct}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {action.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                Approval Comments & History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {record.hODApproverRemarks && (
                <div className="text-sm">
                  <p className="text-muted-foreground">HOD / Approver Remarks</p>
                  <p className="font-medium whitespace-pre-wrap break-words mt-1">{record.hODApproverRemarks}</p>
                </div>
              )}
              {relatedApprovals.length === 0 ? (
                <p className="text-sm text-muted-foreground">No approval history yet.</p>
              ) : (
                <div className="space-y-3">
                  {relatedApprovals.map((approval: ApprovalRecords) => (
                    <div key={approval.id} className="border-l-2 border-primary/30 pl-4 text-sm">
                      <p className="font-semibold">{approval.stagename || approvalLabel(approval.actionKey)}</p>
                      <p className="text-muted-foreground">
                        {approval.actionbyname || approval.actionbyid || 'System'}
                        {approval.actiondate ? ` • ${formatValue(approval.actiondate)}` : ''}
                      </p>
                      {approval.comments && <p className="mt-2 whitespace-pre-wrap break-words">{approval.comments}</p>}
                      {approval.nextstage && <p className="mt-1 text-xs text-muted-foreground">Next: {approval.nextstage}</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
