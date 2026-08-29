/**
 * DCAL — Data Center Access Log Detail Screen
 * Fields: Site, Server Room, Visitor, Company, Reason, PIC
 */
import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, FileText, Database, Building2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RecordInfoPanel } from '@/components/hr/record-info-panel';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { MainDBITService } from '@/generated/services/main-dbit-service';
import { MainDBITCurrentstatusKeyToLabel } from '@/generated/models/main-dbit-model';

const asRead = (r: any) => r;
function parseRemarks(remarks?: string): Record<string, any> {
  if (!remarks) return {};
  try { return JSON.parse(remarks); } catch { return {}; }
}

export default function DCALDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: raw, isLoading, error } = useQuery({
    queryKey: ['mainDBIT', id], queryFn: async () => { if (!id) return null; const r = await MainDBITService.getAll({ filter: `id eq ${id}` }); return r[0] || null; }, enabled: !!id,
  });
  const record = raw ? asRead(raw) : undefined;
  const statusKey = String(record?.currentStatus || '');
  const statusLabel = MainDBITCurrentstatusKeyToLabel[statusKey as keyof typeof MainDBITCurrentstatusKeyToLabel] || statusKey;
  const r = useMemo(() => parseRemarks(record?.remarks), [record?.remarks]);
  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error || !record) return <div className="p-6 text-center">Record not found</div>;
  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/it/forms/dcal')}><ArrowLeft className="h-5 w-5" /></Button>
        <div className="flex-1"><div className="flex items-center gap-3"><h1 className="text-2xl font-bold">{record.title || `DCAL-${id}`}</h1><Badge className="bg-blue-100 text-blue-800">{statusLabel}</Badge></div><p className="text-sm text-muted-foreground mt-1">{record.requestoremail || ''}</p></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card><CardHeader><CardTitle className="text-lg"><Database className="h-5 w-5 inline mr-2" />Data Center Access Log</CardTitle></CardHeader><CardContent><dl className="grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-muted-foreground">Title</dt><dd className="font-medium mt-0.5">{record.title || '-'}</dd></div>
            <div><dt className="text-muted-foreground">Status</dt><dd className="font-medium mt-0.5">{statusLabel}</dd></div>
            <div><dt className="text-muted-foreground">Site</dt><dd className="font-medium mt-0.5">{r.site || r.rbSite || r.Site || '-'}</dd></div>
            <div><dt className="text-muted-foreground">Server Room</dt><dd className="font-medium mt-0.5">{r.serverRoom || r.lstServerRoom || '-'}</dd></div>
            <div><dt className="text-muted-foreground">Visitor</dt><dd className="font-medium mt-0.5">{r.visitor || r.nmVisitor || r.VisitorName || '-'}</dd></div>
            <div><dt className="text-muted-foreground">Company</dt><dd className="font-medium mt-0.5">{record.company || r.company || r.lstCompany || '-'}</dd></div>
            <div><dt className="text-muted-foreground">PIC</dt><dd className="font-medium mt-0.5">{r.pic || r.nmPIC || r.AttendedBy || '-'}</dd></div>
            <div><dt className="text-muted-foreground">Requestor</dt><dd className="font-medium mt-0.5">{record.requestoremail || '-'}</dd></div>
            <div><dt className="text-muted-foreground">Submitted</dt><dd className="font-medium mt-0.5">{record.submitteddate ? format(new Date(record.submitteddate), 'dd MMM yyyy') : '-'}</dd></div>
          </dl></CardContent></Card>
          {r.reasonAccess || r.txtReasonAccess ? (
            <Card><CardHeader><CardTitle className="text-lg">Reason for Access</CardTitle></CardHeader><CardContent><p className="text-sm whitespace-pre-wrap">{r.reasonAccess || r.txtReasonAccess || ''}</p></CardContent></Card>
          ) : null}
        </div>
        <div className="space-y-6"><RecordInfoPanel createdBy={record.Author?.DisplayName || 'System'} createdDate={record.Created ? new Date(record.Created) : undefined} lastModified={record.Modified ? new Date(record.Modified) : undefined} requestorEmail={record.requestoremail || ''} /></div>
      </div>
    </div>
  );
}
