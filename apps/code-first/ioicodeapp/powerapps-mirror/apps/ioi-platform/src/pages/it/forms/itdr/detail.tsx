/**
 * ITDR - IT Daily Report detail screen.
 * Non-approval lifecycle: daily task entry submitted by an IT user.
 */
import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Clock,
  FileText,
  ListChecks,
  Loader2,
  UserRound,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecordInfoPanel } from '@/components/hr/record-info-panel';
import { MainDBITService } from '@/generated/services/main-dbit-service';
import { MainDBITExtSupportService } from '@/generated/services/main-dbit-ext-support-service';
import { MainDBITCurrentstatusKeyToLabel } from '@/generated/models/main-dbit-model';
import type { MainDBITExtSupport } from '@/generated/models/main-dbit-ext-support-model';
import { getITFormCodeFilter } from '@/lib/it-form-routes';
import { parseRemarks } from '@/lib/parse-remarks';

const asRead = (record: unknown) => record as Record<string, any>;

function text(value: unknown, fallback = '-'): string {
  if (value === null || value === undefined) return fallback;
  const str = String(value).trim();
  return str || fallback;
}

function formatDateValue(value: unknown): string {
  const raw = text(value, '');
  if (!raw) return '-';
  try {
    return format(new Date(raw), 'dd MMM yyyy');
  } catch {
    return raw;
  }
}

function formatDateTimeValue(value: unknown): string {
  const raw = text(value, '');
  if (!raw) return '-';
  try {
    return format(new Date(raw), 'dd MMM yyyy, h:mm a');
  } catch {
    return raw;
  }
}

function timeRange(from?: unknown, to?: unknown): string {
  const start = text(from, '');
  const end = text(to, '');
  if (!start && !end) return '-';
  if (start && end) return `${start} to ${end}`;
  return start || end;
}

function InfoItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: typeof CalendarDays;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <dt className="flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </dt>
      <dd className="mt-2 text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}

function ITDRDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: raw, isLoading, error } = useQuery({
    queryKey: ['mainDBIT', id],
    queryFn: async () => {
      if (!id) return null;
      const rows = await MainDBITService.getAll({ filter: `id eq ${id}` });
      return rows[0] || null;
    },
    enabled: !!id,
  });

  const record = raw ? asRead(raw) : undefined;
  const legacy = useMemo(() => parseRemarks(record?.remarks), [record?.remarks]);

  const { data: extRaw, isLoading: extLoading } = useQuery({
    queryKey: ['mainDBITExtSupport', 'ITDR', id, record?.title],
    queryFn: async () => {
      if (!id) return null;
      const rows = await MainDBITExtSupportService.getAll({
        filter: getITFormCodeFilter('ITDR', 'parentFormCode'),
      });
      return (
        rows.find((row) => String(row.parentRecord?.id || '') === String(id)) ||
        rows.find((row) => row.parentRecord?.title && row.parentRecord.title === record?.title) ||
        null
      );
    },
    enabled: !!id && !!record,
  });

  const ext = extRaw ? (asRead(extRaw) as MainDBITExtSupport) : undefined;

  const statusKey = text(record?.currentStatus, '');
  const statusLabel =
    MainDBITCurrentstatusKeyToLabel[
      statusKey as keyof typeof MainDBITCurrentstatusKeyToLabel
    ] ||
    statusKey ||
    'Sent';

  const taskTitle = text(record?.subject || legacy.HDR_Subject || ext?.iTDRDisplayText);
  const taskType = text(ext?.iTDRActivityType || legacy.HDR_Type);
  const taskArea = text(ext?.iTDRCategory || legacy.HDR_Category);
  const workDateFrom = ext?.iTDRDateFrom || legacy.HDR_StartDate || record?.submitteddate;
  const workDateTo = ext?.iTDRDateTo || legacy.HDR_EndDate || workDateFrom;
  const workDate =
    text(workDateFrom, '') === text(workDateTo, '')
      ? formatDateValue(workDateFrom)
      : `${formatDateValue(workDateFrom)} to ${formatDateValue(workDateTo)}`;
  const owner = text(ext?.iTDRDocAuthor || record?.requestoremail || legacy.AUD_DocAuthor);
  const displayText = text(ext?.iTDRDisplayText || legacy.HDR_DisplayText, '');
  const otPurpose = text(ext?.iTDROtPurpose || legacy.OT_Purpose, '');

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !record) return <div className="p-6 text-center">Task entry not found</div>;

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-start gap-4 px-6 py-5">
          <Button variant="ghost" size="icon" onClick={() => navigate('/it/forms/itdr')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-2xl font-bold text-foreground">{taskTitle}</h1>
              <Badge className="bg-blue-100 text-blue-800">{statusLabel}</Badge>
              <Badge variant="outline">{taskType}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {record.title || `ITDR-${id}`} submitted by {owner}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ListChecks className="h-5 w-5 text-primary" />
                Daily Task Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InfoItem label="Task ID" value={text(record.title || `ITDR-${id}`)} icon={FileText} />
                <InfoItem label="Work Date" value={workDate} icon={CalendarDays} />
                <InfoItem label="Task Area" value={taskArea} icon={Building2} />
                <InfoItem label="Task Type" value={taskType} icon={ListChecks} />
                <InfoItem label="Submitted By" value={owner} icon={UserRound} />
                <InfoItem
                  label="Submitted On"
                  value={formatDateTimeValue(record.submitteddate || record.Created)}
                  icon={Clock}
                />
              </dl>
            </CardContent>
          </Card>

          {(displayText || otPurpose) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Task Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {displayText && (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                    {displayText}
                  </p>
                )}
                {otPurpose && (
                  <div className="rounded-lg bg-muted p-4">
                    <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">OT Purpose</p>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                      {otPurpose}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Work Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InfoItem label="Company" value={text(record.company || legacy.HDR_Company)} />
                <InfoItem label="Venue" value={text(ext?.iTDRVenue || legacy.MTG_Venue || legacy.TRN_Venue)} />
                <InfoItem
                  label="Time"
                  value={timeRange(
                    ext?.iTDRTimeFrom || legacy.MTG_TimeFrom || legacy.OT_TimeFrom,
                    ext?.iTDRTimeTo || legacy.MTG_TimeTo || legacy.OT_TimeTo
                  )}
                />
                <InfoItem label="OT Category" value={text(ext?.iTDROtCategory || legacy.OT_Cat)} />
                <InfoItem
                  label="Participants"
                  value={text(ext?.iTDRParticipants || legacy.MTG_Present || legacy.TRN_Participants)}
                />
                <InfoItem label="Chairman" value={text(ext?.iTDRMeetingChairman || legacy.MTG_Chairman)} />
                <InfoItem label="Trainer" value={text(ext?.iTDRTrainer || legacy.TRN_Trainer)} />
                <InfoItem
                  label="Audit Created"
                  value={formatDateTimeValue(ext?.iTDRAuditCreatedDate || legacy.AUD_CDate)}
                />
              </dl>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ListChecks className="h-5 w-5 text-blue-700" />
                Task Lifecycle
                <Badge className="ml-auto bg-blue-100 text-blue-800">{statusLabel}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This daily task entry is logged as a non-approval IT record.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {extLoading && (
            <Card>
              <CardContent className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading task details...
              </CardContent>
            </Card>
          )}
          <RecordInfoPanel
            createdBy={record.Author?.DisplayName || owner || 'System'}
            createdDate={record.Created ? new Date(record.Created) : undefined}
            lastModified={record.Modified ? new Date(record.Modified) : undefined}
            requestorEmail={record.requestoremail || ''}
          />
        </div>
      </main>
    </div>
  );
}

export default ITDRDetailPage;
