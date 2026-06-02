/**
 * ITDR — IT Daily Report Detail Screen
 * Non-approval lifecycle: Sent
 * Fields: Subject, Company, Category, Date Range, Activities
 */
import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle2, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RecordInfoPanel } from '@/components/hr/record-info-panel';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { MainDBITService } from '@/generated/services/main-dbit-service';
import { MainDBITExtSupportService } from '@/generated/services/main-dbit-ext-support-service';
import { MainDBITCurrentstatusKeyToLabel } from '@/generated/models/main-dbit-model';
import type { MainDBITExtSupport } from '@/generated/models/main-dbit-ext-support-model';

const asRead = (r: any) => r;
function parseRemarks(remarks?: string): Record<string, any> {
  if (!remarks) return {};
  try { return JSON.parse(remarks); } catch { return {}; }
}

function ITDRDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: raw, isLoading, error } = useQuery({
    queryKey: ['mainDBIT', id],
    queryFn: async () => { if (!id) return null; const r = await MainDBITService.getAll({ filter: `id eq ${id}` }); return r[0] || null; },
    enabled: !!id,
  });
  const record = raw ? asRead(raw) : undefined;
  const statusKey = String(record?.currentStatus || '');
  const statusLabel = MainDBITCurrentstatusKeyToLabel[statusKey as keyof typeof MainDBITCurrentstatusKeyToLabel] || statusKey;
  const legacy = useMemo(() => parseRemarks(record?.remarks), [record?.remarks]);
  const { data: extRaw } = useQuery({
    queryKey: ['mainDBITExtSupport', 'ITDR', id],
    queryFn: async () => {
      if (!id) return null;
      const rows = await MainDBITExtSupportService.getAll({ filter: `parentRecord/id eq ${id}` });
      return rows?.[0] || null;
    },
    enabled: !!id,
  });
  const ext = extRaw ? asRead(extRaw) as MainDBITExtSupport : undefined;

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error || !record) return <div className="p-6 text-center">Record not found</div>;

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/it/forms/itdr')}><ArrowLeft className="h-5 w-5" /></Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{record.title || `ITDR-${id}`}</h1>
            <Badge className="bg-blue-100 text-blue-800">{statusLabel}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{record.requestoremail || ''}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card><CardHeader><CardTitle className="text-lg"><ClipboardList className="h-5 w-5 inline mr-2" />Daily Report Details</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-muted-foreground">Title</dt><dd className="font-medium mt-0.5">{record.title || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Status</dt><dd className="font-medium mt-0.5">{statusLabel}</dd></div>
                <div><dt className="text-muted-foreground">Subject</dt><dd className="font-medium mt-0.5">{record.subject || legacy.HDR_Subject || legacy.subject || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Company</dt><dd className="font-medium mt-0.5">{record.company || legacy.HDR_Company || legacy.company || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Category</dt><dd className="font-medium mt-0.5">{ext?.iTDRCategory || legacy.HDR_Category || legacy.category || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Activity Type</dt><dd className="font-medium mt-0.5">{ext?.iTDRActivityType || legacy.HDR_Type || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Date Range</dt><dd className="font-medium mt-0.5">{ext?.iTDRDateFrom ? `${ext.iTDRDateFrom} → ${ext.iTDRDateTo || '-'}` : legacy.HDR_StartDate ? `${legacy.HDR_StartDate} → ${legacy.HDR_EndDate || '-'}` : '-'}</dd></div>
                <div><dt className="text-muted-foreground">Venue</dt><dd className="font-medium mt-0.5">{ext?.iTDRVenue || legacy.MTG_Venue || legacy.TRN_Venue || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Participants</dt><dd className="font-medium mt-0.5">{ext?.iTDRParticipants || legacy.MTG_Present || legacy.TRN_Participants || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Chairman</dt><dd className="font-medium mt-0.5">{ext?.iTDRMeetingChairman || legacy.MTG_Chairman || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Trainer</dt><dd className="font-medium mt-0.5">{ext?.iTDRTrainer || legacy.TRN_Trainer || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Time</dt><dd className="font-medium mt-0.5">{ext?.iTDRTimeFrom ? `${ext.iTDRTimeFrom} → ${ext.iTDRTimeTo || '-'}` : legacy.MTG_TimeFrom ? `${legacy.MTG_TimeFrom} → ${legacy.MTG_TimeTo || '-'}` : legacy.OT_TimeFrom ? `${legacy.OT_TimeFrom} → ${legacy.OT_TimeTo || '-'}` : '-'}</dd></div>
                <div><dt className="text-muted-foreground">OT Category</dt><dd className="font-medium mt-0.5">{ext?.iTDROtCategory || legacy.OT_Cat || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Requestor</dt><dd className="font-medium mt-0.5">{record.requestoremail || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Submitted</dt><dd className="font-medium mt-0.5">{record.submitteddate ? format(new Date(record.submitteddate), 'dd MMM yyyy') : '-'}</dd></div>
                <div><dt className="text-muted-foreground">Document Author</dt><dd className="font-medium mt-0.5">{ext?.iTDRDocAuthor || legacy.AUD_DocAuthor || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Display Text</dt><dd className="font-medium mt-0.5">{ext?.iTDRDisplayText || legacy.HDR_DisplayText || '-'}</dd></div>
              </dl>
            </CardContent>
          </Card>
          {(ext?.iTDROtPurpose || legacy.OT_Purpose) && (
            <Card><CardHeader><CardTitle className="text-lg">OT Purpose</CardTitle></CardHeader><CardContent><p className="text-sm whitespace-pre-wrap">{ext?.iTDROtPurpose || legacy.OT_Purpose}</p></CardContent></Card>
          )}
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                Lifecycle Status
                <Badge className="ml-auto bg-emerald-100 text-emerald-800">{statusLabel || 'Sent'}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                IT Daily Report is a non-approval record. It does not require manager review or approval actions.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <RecordInfoPanel createdBy={record.Author?.DisplayName || 'System'} createdDate={record.Created ? new Date(record.Created) : undefined} lastModified={record.Modified ? new Date(record.Modified) : undefined} requestorEmail={record.requestoremail || ''} />
        </div>
      </div>
    </div>
  );
}

export default ITDRDetailPage;
