/**
 * RS — Reset Password / Unlock ID Detail Screen
 * Direct-to-PIC form — no approval workflow
 */
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RecordInfoPanel } from '@/components/hr/record-info-panel';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { MainDBITService } from '@/generated/services/main-dbit-service';
import { MainDBITCurrentstatusKeyToLabel } from '@/generated/models/main-dbit-model';

const asRead = (r: any) => r;

function RSDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: raw, isLoading } = useQuery({
    queryKey: ['mainDBIT', id],
    queryFn: async () => { if (!id) return null; const r = await MainDBITService.getAll({ filter: `id eq ${id}` }); return r[0] || null; },
    enabled: !!id,
  });
  const record = raw ? asRead(raw) : undefined;

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (!record) return <div className="p-6 text-center">Record not found</div>;

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/it/forms/rs')}><ArrowLeft className="h-5 w-5" /></Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{record.title || `RS-${id}`}</h1>
          <p className="text-sm text-muted-foreground mt-1">Reset Password / Unlock ID</p>
        </div>
        <Badge>{MainDBITCurrentstatusKeyToLabel[record.currentStatus as keyof typeof MainDBITCurrentstatusKeyToLabel] || record.currentStatus}</Badge>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-lg"><FileText className="h-5 w-5 inline mr-2" />Details</CardTitle></CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-muted-foreground">Title</dt><dd className="font-medium mt-0.5">{record.title || '-'}</dd></div>
            <div><dt className="text-muted-foreground">Requestor</dt><dd className="font-medium mt-0.5">{record.requestoremail || '-'}</dd></div>
            <div><dt className="text-muted-foreground">Status</dt><dd className="font-medium mt-0.5">{MainDBITCurrentstatusKeyToLabel[record.currentStatus as keyof typeof MainDBITCurrentstatusKeyToLabel] || record.currentStatus}</dd></div>
            <div><dt className="text-muted-foreground">Submitted</dt><dd className="font-medium mt-0.5">{record.submitteddate ? format(new Date(record.submitteddate), 'dd MMM yyyy') : '-'}</dd></div>
          </dl>
        </CardContent>
      </Card>
      <RecordInfoPanel createdBy={record.Author?.DisplayName || 'System'} createdDate={record.Created ? new Date(record.Created) : undefined} lastModified={record.Modified ? new Date(record.Modified) : undefined} requestorEmail={record.requestoremail || ''} />
    </div>
  );
}

export default RSDetailPage;
