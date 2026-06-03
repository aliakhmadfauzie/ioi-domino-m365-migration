import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Info,
  Layers,
  Loader2,
  MessageSquare,
  Shield,
  Tag,
  User,
  XCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageLoading } from '@/components/page-loading';
import { StatusBadge } from '@/components/database-view';
import { useApprovalRecordsList } from '@/generated/hooks/use-approval-records';
import { useMainDBIT } from '@/generated/hooks/use-main-dbit';
import { useMainDBITExtAccessList } from '@/generated/hooks/use-main-dbitext-access';
import { useMainDBITExtSupportList } from '@/generated/hooks/use-main-dbitext-support';
import { ApprovalRecordsActionKeyToLabel, type ApprovalRecords } from '@/generated/models/approval-records-model';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import { getCompleteFormConfig } from '@/lib/form-sections-resolver';
import { getFormByCode, type FormField, type FormSection } from '@/lib/it-forms-config';
import { normalizeITFormRouteSlug } from '@/lib/it-form-routes';
import { parseRemarks } from '@/lib/parse-remarks';
import { getStatusLabel } from '@/lib/status-utils';
import { useDynamicRoleAccess } from '@/hooks/use-dynamic-role-access';
import { useUser } from '@/hooks/use-user';
import { getITCurrentActionAccess, isITStatusActionable } from '@/lib/it-current-action-access';
import { recordITApprovalAction, statusActionType } from '@/lib/it-approval-actions';
import { RecordViewSelector } from '@/components/workflow/record-view-selector';

type DataSource = Record<string, unknown>;

interface DetailValue {
  label: string;
  value: unknown;
  source: string;
  key: string;
}

function isFilled(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function formatDate(value: string): string | undefined {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return format(parsed, 'dd MMM yyyy h:mm a');
}

function formatValue(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return formatDate(value) ?? value;
  if (Array.isArray(value)) return value.map(formatValue).join(', ');
  if (typeof value === 'object' && value !== null) {
    const record = value as Record<string, unknown>;
    return String(record.title ?? record.displayName ?? record.email ?? record.id ?? JSON.stringify(record));
  }
  return String(value);
}

function modelPrefix(formCode: string): string {
  const upper = formCode.toUpperCase();
  if (upper === 'ITSSR') return 'iTSSR';
  if (upper === 'SAPAMR') return 'sAPAMR';
  if (upper === 'SAPSOF2') return 'sAPSOF2';
  if (upper.length <= 3) return upper.charAt(0).toLowerCase() + upper.slice(1);
  return upper.charAt(0).toLowerCase() + upper.slice(1);
}

function fieldCandidates(field: FormField, formCode: string): string[] {
  const prefix = modelPrefix(formCode);
  const id = field.id;
  const compactId = id.replace(/[^a-zA-Z0-9]/g, '');
  const pascalId = compactId.charAt(0).toUpperCase() + compactId.slice(1);
  return [
    id,
    field.label,
    compactId,
    `${prefix}${pascalId}`,
    `${prefix}_${compactId}`,
    `${formCode}_${compactId}`,
  ];
}

function getValueFromSources(
  candidates: string[],
  sources: { name: string; data: DataSource }[],
): { value: unknown; source: string; key: string } | undefined {
  const normalizedCandidates = candidates.map(normalizeKey);

  for (const candidate of candidates) {
    for (const source of sources) {
      if (Object.prototype.hasOwnProperty.call(source.data, candidate) && isFilled(source.data[candidate])) {
        return { value: source.data[candidate], source: source.name, key: candidate };
      }
    }
  }

  for (const source of sources) {
    for (const [key, value] of Object.entries(source.data)) {
      if (!isFilled(value)) continue;
      if (normalizedCandidates.includes(normalizeKey(key))) {
        return { value, source: source.name, key };
      }
    }
  }

  return undefined;
}

function parentId(record: { parentRecord?: { id?: unknown } | null }): string | undefined {
  const parent = record.parentRecord;
  return parent?.id === undefined ? undefined : String(parent.id);
}

function parentTitle(record: { parentRecord?: { title?: unknown } | null }): string | undefined {
  const parent = record.parentRecord;
  return parent?.title === undefined ? undefined : String(parent.title);
}

function extractSectionValues(
  section: FormSection,
  formCode: string,
  sources: { name: string; data: DataSource }[],
  shownKeys: Set<string>,
): DetailValue[] {
  return (section.fields ?? [])
    .map((field) => {
      const match = getValueFromSources(fieldCandidates(field, formCode), sources);
      if (!match) return undefined;
      shownKeys.add(`${match.source}:${match.key}`);
      return {
        label: field.label,
        value: match.value,
        source: match.source,
        key: match.key,
      };
    })
    .filter((item): item is DetailValue => Boolean(item));
}

function InfoCard({ title, icon: Icon, values }: { title: string; icon: typeof FileText; values: DetailValue[] }) {
  if (!values.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
          {values.map((item) => (
            <div key={`${item.source}-${item.key}-${item.label}`} className="min-w-0">
              <dt className="text-muted-foreground">{item.label}</dt>
              <dd className="mt-1 font-medium whitespace-pre-wrap break-words">{formatValue(item.value)}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

function ApprovalHistoryCard({ approvals, record }: { approvals: ApprovalRecords[]; record: MainDBIT }) {
  const mainRemarkValues: DetailValue[] = [
    { label: 'HOD / Approver Remarks', value: record.hODApproverRemarks, source: 'MainDB_IT', key: 'hODApproverRemarks' },
  ].filter((item) => isFilled(item.value));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="h-4 w-4 text-primary" />
          Approval Comments & History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mainRemarkValues.length > 0 && (
          <dl className="grid grid-cols-1 gap-4 text-sm">
            {mainRemarkValues.map((item) => (
              <div key={item.key}>
                <dt className="text-muted-foreground">{item.label}</dt>
                <dd className="mt-1 font-medium whitespace-pre-wrap break-words">{formatValue(item.value)}</dd>
              </div>
            ))}
          </dl>
        )}

        {approvals.length === 0 && mainRemarkValues.length === 0 ? (
          <p className="text-sm text-muted-foreground">No approval comments recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {approvals.map((approval) => (
              <div key={approval.id} className="border-l-2 border-primary/30 pl-4 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{approval.stagename || 'Workflow action'}</p>
                  {approval.actionKey && (
                    <span className="text-xs text-muted-foreground">
                      {ApprovalRecordsActionKeyToLabel[approval.actionKey] ?? approval.actionKey}
                    </span>
                  )}
                </div>
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
  );
}

function appendActionComment(existing: string | undefined, entry: string): string {
  return [existing?.trim(), entry.trim()].filter(Boolean).join('\n\n');
}

export default function ITDynamicFormDetailPage() {
  const { formCode, id } = useParams<{ formCode: string; id: string }>();
  const navigate = useNavigate();
  const { data: user } = useUser();
  const roleAccess = useDynamicRoleAccess({ moduleScope: 'IT' });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionComment, setActionComment] = useState('');
  const [selectedView, setSelectedView] = useState<'initiator' | 'actioner' | null>(null);
  // Reset view choice whenever the user navigates to a different record
  useEffect(() => { setSelectedView(null); }, [id]);
  const slug = normalizeITFormRouteSlug(formCode);
  const formCodeUpper = (formCode ?? '').toUpperCase();
  const baseConfig = getFormByCode(formCodeUpper);
  const formConfig = baseConfig ? getCompleteFormConfig(baseConfig) : undefined;

  const { data: record, isLoading, error, refetch: refetchRecord } = useMainDBIT(id ?? '');
  const { data: approvals = [], isLoading: approvalsLoading, refetch: refetchApprovals } = useApprovalRecordsList();
  const { data: extAccessRecords = [], isLoading: extAccessLoading } = useMainDBITExtAccessList();
  const { data: extSupportRecords = [], isLoading: extSupportLoading } = useMainDBITExtSupportList();

  const isRelatedApproval = (approval: ApprovalRecords) =>
    approval.formid === String(id) || (approval.formcode?.toUpperCase() === formCodeUpper && approval.formid === String(record?.id));

  const relatedApprovals = useMemo(
    () => approvals.filter(isRelatedApproval).sort((a, b) => (a.stagenumber ?? 0) - (b.stagenumber ?? 0)),
    [approvals, formCodeUpper, id, record?.id],
  );

  const relatedExtAccess = useMemo(
    () => extAccessRecords.filter((item) => parentId(item) === String(id) || (!!record?.title && parentTitle(item) === record.title)),
    [extAccessRecords, id, record?.title],
  );

  const relatedExtSupport = useMemo(
    () => extSupportRecords.filter((item) => parentId(item) === String(id) || (!!record?.title && parentTitle(item) === record.title)),
    [extSupportRecords, id, record?.title],
  );

  const parsedRemarks = useMemo(() => parseRemarks(record?.remarks), [record?.remarks]);

  const detailContent = useMemo(() => {
    if (!record) return { sectionCards: [] };

    const shownKeys = new Set<string>();
    const sources = [
      { name: 'Remarks', data: parsedRemarks as DataSource },
      { name: 'MainDB_IT', data: record as unknown as DataSource },
      ...relatedExtAccess.map((item, index) => ({ name: `Ext_Access ${index + 1}`, data: item as unknown as DataSource })),
      ...relatedExtSupport.map((item, index) => ({ name: `Ext_Support ${index + 1}`, data: item as unknown as DataSource })),
    ];

    const sections = formConfig?.sections ?? [];
    const sectionCards = sections
      .map((section) => ({
        section,
        values: extractSectionValues(section, formCodeUpper, sources, shownKeys),
      }))
      .filter((item) => item.values.length > 0);

    return { sectionCards };
  }, [formCodeUpper, formConfig?.sections, parsedRemarks, record, relatedExtAccess, relatedExtSupport]);

  if (!slug || !id) return <Navigate to="/it/forms" replace />;
  if (isLoading || approvalsLoading || extAccessLoading || extSupportLoading) {
    return <PageLoading message="Loading request detail..." />;
  }
  if (error) return <div className="p-6 text-center text-sm text-destructive">Failed to load request detail.</div>;
  if (!record) return <div className="p-6 text-center text-sm text-muted-foreground">Record not found.</div>;

  const statusLabel = getStatusLabel(record.currentStatus);
  const actionSources = [
    ...relatedExtAccess.map((item) => item as unknown as Record<string, unknown>),
    ...relatedExtSupport.map((item) => item as unknown as Record<string, unknown>),
    parsedRemarks as Record<string, unknown>,
  ];
  const currentStageName = statusLabel || record.currentAction || 'Current Action';
  const hasCurrentAction = isITStatusActionable(record.currentStatus, statusLabel, record.currentAction);
  const actionAccess = getITCurrentActionAccess({
    record,
    user,
    roleAccess,
    statusLabel,
    currentStageName,
    sources: actionSources,
    blockInitiator: !/initiator|requestor|req\.?\s*acceptance/i.test(`${statusLabel} ${record.currentAction || ''}`),
  });

  // Determine if this user is an actioner for the current stage (independent of blockInitiator)
  const isActioner =
    !!actionAccess.currentUserEmail &&
    (actionAccess.expectedActorEmails.includes(actionAccess.currentUserEmail) ||
      (!actionAccess.hasExplicitActor && !!roleAccess.canApprove));
  const hasBothRoles = actionAccess.isInitiator && isActioner;
  // Auto-derive view; null selectedView + hasBothRoles triggers the selector screen
  const activeView =
    hasBothRoles && selectedView === null
      ? 'selecting'
      : selectedView ?? (actionAccess.isInitiator ? 'initiator' : isActioner ? 'actioner' : 'readonly');

  const handleWorkflowAction = async (variant: 'approve' | 'reject') => {
    if (!id || !record) return;
    if (!actionAccess.canAct) {
      toast.error(actionAccess.reason || 'You are not assigned to this action.');
      return;
    }

    const nextStatus = variant === 'reject' ? 'CurrentstatusKey6' : 'CurrentstatusKey1';
    const actionName = variant === 'reject' ? 'Rejected' : 'Approved / Completed';
    const actor = user?.fullName || user?.userPrincipalName || user?.email || 'Approver';
    const now = new Date().toISOString();
    const comment = actionComment.trim();
    const commentEntry = `${actionName} by ${actor} on ${format(new Date(now), 'dd MMM yyyy h:mm a')}${comment ? `\n${comment}` : ''}`;

    setActionLoading(true);
    try {
      await recordITApprovalAction({
        id,
        record,
        user,
        nextStatus,
        stageName: currentStageName,
        actionType: statusActionType(nextStatus, variant),
        comment: commentEntry,
        workflowstage: variant === 'reject' ? 0 : record.workflowstage,
        mainPatch: {
          hODApproverRemarks: appendActionComment(record.hODApproverRemarks, commentEntry),
        },
      });
      toast.success(`${actionName} recorded`);
      setActionComment('');
      await Promise.all([refetchRecord(), refetchApprovals()]);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to record action');
    } finally {
      setActionLoading(false);
    }
  };
  const essentialValues: DetailValue[] = [
    { label: 'Title', value: record.title, source: 'MainDB_IT', key: 'title' },
    { label: 'Form Code', value: record.formcode, source: 'MainDB_IT', key: 'formcode' },
    { label: 'Requestor', value: record.requestorName || record.requestoremail, source: 'MainDB_IT', key: 'requestor' },
    { label: 'Submitted', value: record.submitteddate, source: 'MainDB_IT', key: 'submitteddate' },
    { label: 'Workflow Stage', value: record.workflowstage, source: 'MainDB_IT', key: 'workflowstage' },
    { label: 'Locked', value: record.islocked ? 'Yes' : 'No', source: 'MainDB_IT', key: 'islocked' },
  ].filter((item) => isFilled(item.value));

  if (activeView === 'selecting') {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/it/forms/${slug}`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        <RecordViewSelector
          formTitle={formConfig?.name ?? formCodeUpper}
          recordTitle={record.title || `${formCodeUpper}-${id}`}
          stageName={currentStageName}
          onSelect={setSelectedView}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/it/forms/${slug}`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold break-words">{record.title || `${formCodeUpper}-${id}`}</h1>
            <StatusBadge status={statusLabel} />
            {activeView === 'initiator' && (
              <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 text-xs">
                <Eye className="h-3 w-3 mr-1" />
                Requestor View
              </Badge>
            )}
            {activeView === 'actioner' && (
              <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Actioner View
              </Badge>
            )}
            {hasBothRoles && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs px-2 text-muted-foreground"
                onClick={() => setSelectedView(activeView === 'initiator' ? 'actioner' : 'initiator')}
              >
                Switch to {activeView === 'initiator' ? 'actioner' : 'requestor'} view
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {formConfig?.name ?? formCodeUpper} • {record.requestoremail || 'No requestor email'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <InfoCard title="Essential Information" icon={Info} values={essentialValues} />

          {detailContent.sectionCards.map(({ section, values }, index) => (
            <InfoCard
              key={section.id || index}
              title={section.title || `Section ${index + 1}`}
              icon={section.isStageGated ? Shield : FileText}
              values={values}
            />
          ))}

          {detailContent.sectionCards.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No user-filled form fields were found for this record.
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Layers className="h-4 w-4 text-primary" />
                Workflow Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="font-medium">{statusLabel}</span>
              </div>
              <div className="flex items-center gap-3">
                <Tag className="h-4 w-4 text-primary" />
                <span>Stage {record.workflowstage ?? '-'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{record.submitteddate ? formatValue(record.submitteddate) : 'No submitted date'}</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-primary" />
                <span className="break-all">{record.requestoremail || '-'}</span>
              </div>
            </CardContent>
          </Card>

          {hasCurrentAction && activeView === 'initiator' && (
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Pending With
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium">{currentStageName}</p>
                <p className="text-muted-foreground">
                  Waiting for {actionAccess.expectedActorLabel}.
                </p>
              </CardContent>
            </Card>
          )}

          {hasCurrentAction && activeView !== 'initiator' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="h-4 w-4 text-primary" />
                  Current Action
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{currentStageName}</p>
                  <p className="text-muted-foreground">
                    Assigned to {actionAccess.expectedActorLabel}.
                  </p>
                  {!actionAccess.canAct && actionAccess.reason && (
                    <p className="text-xs text-muted-foreground">{actionAccess.reason}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Comment</Label>
                  <Textarea
                    value={actionComment}
                    onChange={(event) => setActionComment(event.target.value)}
                    placeholder="Add action comment..."
                    rows={4}
                    disabled={!actionAccess.canAct || actionLoading}
                  />
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    className="w-full"
                    onClick={() => handleWorkflowAction('approve')}
                    disabled={!actionAccess.canAct || actionLoading}
                  >
                    {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                    Approve / Complete
                  </Button>
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={() => handleWorkflowAction('reject')}
                    disabled={!actionAccess.canAct || actionLoading}
                  >
                    {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-primary" />
                Data Coverage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>{detailContent.sectionCards.length} populated form section(s)</p>
              <p>{relatedApprovals.length} approval history item(s)</p>
              <p>{relatedExtAccess.length + relatedExtSupport.length} extension record(s)</p>
            </CardContent>
          </Card>

          <ApprovalHistoryCard approvals={relatedApprovals} record={record} />
        </div>
      </div>
    </div>
  );
}
