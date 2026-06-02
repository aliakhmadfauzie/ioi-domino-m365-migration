import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { DatabaseTable, StatusBadge } from '@/components/database-view';
import type { ColumnDef } from '@/components/database-view';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import { format } from 'date-fns';

export default function assetsubmissionListPage() {
  const navigate = useNavigate();
  const { data: records = [], isLoading } = useMainDBITList({
    filter: "formcode eq 'ASSETSUBMISSION'",
    orderBy: ['submitteddate desc'],
  });

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/it')}><ArrowLeft className="h-5 w-5" /></Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Asset Submission</h1>
          <p className="text-sm text-muted-foreground">All submissions from SharePoint</p>
        </div>
        <Link to="/it/forms/asset-submission/new"><Button><Plus className="mr-2 h-4 w-4" />New</Button></Link>
      </div>
      <DatabaseTable
        data={records as any}
        columns={[
          { key: 'title', header: 'Title', sortable: true },
          { key: 'currentStatus', header: 'Status', sortable: true, render: (v:unknown) => <StatusBadge status={String(v??'Draft')} /> },
          { key: 'submitteddate', header: 'Date', sortable: true, render: (v:unknown) => v ? format(new Date(v as string), 'dd MMM yyyy') : '-' },
        ] as any}
        onRowClick={(r: any) => navigate(`/it/forms/asset-submission/detail/${r.id}`)}
      />
    </div>
  );
}
