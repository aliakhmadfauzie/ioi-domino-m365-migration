/**
 * CIR — Cafeteria Inspection Detail / Review Screen
 * Parent metadata is read from MainDB_HR.
 * Inspection details and review status are read/written through MainDB_HR_Ext_Cafeteria.
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Building2, FileText, CheckCircle2 } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { StatusBadge } from '@/components/hr/status-badge';
import { RecordInfoPanel } from '@/components/hr/record-info-panel';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useMainDBHRById } from '@/hooks/use-main-dbhr';
import { useUser } from '@/hooks/use-user';
import { MainDBHRExtCafeteriaService } from '@/services/main-dbhr-ext-cafeteria-service';

const asRead = (r: any): Record<string, any> => r;

function fieldValue(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(fieldValue).filter(Boolean).join('; ');
  if (typeof value === 'object') {
    const person = value as { DisplayName?: string; Email?: string; Title?: string; Value?: string };
    return person.DisplayName || person.Email || person.Title || person.Value || '';
  }
  return String(value);
}

function CafeteriaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user } = useUser();

  const { data: rawRecord, isLoading, error, refetch } = useMainDBHRById(id!);
  const parentRecord = rawRecord ? asRead(rawRecord) : undefined;
  const recordId = fieldValue(parentRecord?.ID || parentRecord?.id);
  const {
    data: rawExtension,
    isLoading: isLoadingExtension,
    error: extensionError,
    refetch: refetchExtension,
  } = useQuery({
    queryKey: ['main-dbhr-ext-cafeteria', 'parent', recordId],
    queryFn: () => MainDBHRExtCafeteriaService.getByParentRecord(recordId),
    staleTime: 5 * 60 * 1000,
    enabled: !!recordId,
  });
  const extension = rawExtension ? asRead(rawExtension) : undefined;
  const record = parentRecord ? { ...parentRecord, ...extension } : undefined;
  const extensionId = fieldValue(extension?.ID || extension?.id);
  const recordTitle = fieldValue(record?.Title || record?.title || record?.cirINO || recordId);
  const currentAction = fieldValue(record?.cirCurrentAction) || 'Submitted';
  const isAccepted = currentAction === 'Accepted';

  const handleAccept = async () => {
    if (!recordId) {
      toast.error('Inspection record ID is missing');
      return;
    }

    try {
      const reviewer = user?.email || user?.fullName || 'System';
      if (extensionId) {
        await MainDBHRExtCafeteriaService.update(extensionId, {
          cirReviewedBy: reviewer,
          cirReviewedDate: new Date().toISOString(),
          cirCurrentAction: 'Accepted',
        } as any);
      } else {
        await MainDBHRExtCafeteriaService.create({
          Title: recordTitle || `CIR-${recordId}`,
          ParentRecord: recordId,
          ParentFormCode: 'CIR',
          cirReviewedBy: reviewer,
          cirReviewedDate: new Date().toISOString(),
          cirCurrentAction: 'Accepted',
        } as any);
      }
      toast.success('Inspection accepted');
      await Promise.all([refetch(), refetchExtension()]);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to accept inspection');
    }
  };

  if (isLoading || isLoadingExtension) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  if (error || extensionError || !record) {
    return (
      <div className="p-6">
        <Empty>
          <EmptyHeader><FileText className="h-8 w-8" /><EmptyTitle>Inspection not found</EmptyTitle>
          <EmptyDescription>The requested inspection record could not be loaded.</EmptyDescription></EmptyHeader>
          <Button onClick={() => navigate('/hr/cafeteria')} className="mt-4">Back to Inspections</Button>
        </Empty>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Cafeteria Inspections', href: '/hr/cafeteria' }, { label: `#${recordTitle}` }]} />

      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/cafeteria')}><ArrowLeft className="h-5 w-5" /></Button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Inspection #{recordTitle}</h1>
            <StatusBadge status={currentAction} size="lg" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {fieldValue(record.cirSite) || 'N/A'} &middot; Created {record.Created ? format(new Date(record.Created), 'dd MMM yyyy, HH:mm') : 'N/A'}
          </p>
        </div>
        {!isAccepted && (
          <Button onClick={handleAccept} className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Accept Inspection
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Building2 className="h-5 w-5" /> Inspection Details</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-muted-foreground">Site</dt><dd className="font-medium mt-0.5">{fieldValue(record.cirSite) || 'N/A'}</dd></div>
                <div><dt className="text-muted-foreground">Inspector</dt><dd className="font-medium mt-0.5">{fieldValue(record.cirInspector) || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Inspection Date</dt><dd className="font-medium mt-0.5">{record.cirInsDate ? format(new Date(record.cirInsDate), 'dd MMM yyyy') : '-'}</dd></div>
                <div><dt className="text-muted-foreground">Inspection Time</dt><dd className="font-medium mt-0.5">{fieldValue(record.cirInsTime) || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Team Members</dt><dd className="font-medium mt-0.5">{fieldValue(record.cirTeamMembers2) || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Submitted By</dt><dd className="font-medium mt-0.5">{fieldValue(record.cirSubmittedBy) || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Submitted Date</dt><dd className="font-medium mt-0.5">{record.cirSubmittedDate ? format(new Date(record.cirSubmittedDate), 'dd MMM yyyy, HH:mm') : '-'}</dd></div>
                <div><dt className="text-muted-foreground">Reviewed By</dt><dd className="font-medium mt-0.5">{fieldValue(record.cirReviewedBy) || '-'}</dd></div>
                <div><dt className="text-muted-foreground">Reviewed Date</dt><dd className="font-medium mt-0.5">{record.cirReviewedDate ? format(new Date(record.cirReviewedDate), 'dd MMM yyyy, HH:mm') : '-'}</dd></div>
                <div className="col-span-2"><dt className="text-muted-foreground">Created By</dt><dd className="font-medium mt-0.5">{record.Author?.DisplayName || record.Author?.Email || 'System'}</dd></div>
                <div className="col-span-2"><dt className="text-muted-foreground">Remarks</dt><dd className="font-medium mt-0.5 whitespace-pre-wrap">{fieldValue(record.cirRemarks) || '-'}</dd></div>
              </dl>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <RecordInfoPanel formCode="CIR" recordId={recordId} created={record.Created} modified={record.Modified} />
        </div>
      </div>
    </motion.div>
  );
}

export default CafeteriaDetailPage;
