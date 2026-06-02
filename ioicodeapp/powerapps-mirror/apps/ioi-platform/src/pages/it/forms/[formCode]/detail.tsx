import { useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Info,
  Layers,
  MessageSquare,
  Shield,
  Tag,
  User,
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function ITDynamicFormDetailPage() {
  const { formCode, id } = useParams<{ formCode: string; id: string }>();
  const navigate = useNavigate();
  const slug = normalizeITFormRouteSlug(formCode);
  const formCodeUpper = (formCode ?? '').toUpperCase();
  const baseConfig = getFormByCode(formCodeUpper);
  const formConfig = baseConfig ? getCompleteFormConfig(baseConfig) : undefined;

  const { data: record, isLoading, error } = useMainDBIT(id ?? '');
  const { data: approvals = [], isLoading: approvalsLoading } = useApprovalRecordsList();
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
  const essentialValues: DetailValue[] = [
    { label: 'Title', value: record.title, source: 'MainDB_IT', key: 'title' },
    { label: 'Form Code', value: record.formcode, source: 'MainDB_IT', key: 'formcode' },
    { label: 'Requestor', value: record.requestorName || record.requestoremail, source: 'MainDB_IT', key: 'requestor' },
    { label: 'Submitted', value: record.submitteddate, source: 'MainDB_IT', key: 'submitteddate' },
    { label: 'Workflow Stage', value: record.workflowstage, source: 'MainDB_IT', key: 'workflowstage' },
    { label: 'Locked', value: record.islocked ? 'Yes' : 'No', source: 'MainDB_IT', key: 'islocked' },
  ].filter((item) => isFilled(item.value));

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
