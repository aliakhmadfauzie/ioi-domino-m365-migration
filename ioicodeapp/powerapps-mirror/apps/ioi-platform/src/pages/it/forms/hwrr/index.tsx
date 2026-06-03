import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { DatabaseTable, StatusBadge } from '@/components/database-view';
import type { ColumnDef } from '@/components/database-view';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import { format } from 'date-fns';
import { useUser } from '@/hooks/use-user';
import { normalizeEmail } from '@/lib/it-current-action-access';
import { isMySubmission, isMyAction, type ITIndexTab } from '@/lib/it-index-tabs';
import { ITFormIndexTabs } from '@/components/it/it-form-index-tabs';

export default function hwrrListPage() {
  const { data: currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<ITIndexTab>('all');
  const userEmail = normalizeEmail(currentUser?.userPrincipalName || currentUser?.email);

  const navigate = useNavigate();
  const { data: records = [], isLoading } = useMainDBITList({
    filter: "formcode eq 'HWRR'",
    orderBy: ['submitteddate desc'],
  });

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;


  const filteredRecords = useMemo(() => {
    if (activeTab === 'all') return records;
    return (records as any[]).filter((r) =>
      activeTab === 'mine' ? isMySubmission(r, userEmail) : isMyAction(r, userEmail)
    );
  }, [records, activeTab, userEmail]);

  const mySubmissionsCount = useMemo(
    () => (records as any[]).filter((r) => isMySubmission(r, userEmail)).length,
    [records, userEmail]
  );
  const myActionsCount = useMemo(
    () => (records as any[]).filter((r) => isMyAction(r, userEmail)).length,
    [records, userEmail]
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/it')}><ArrowLeft className="h-5 w-5" /></Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Hardware Request / Repair (HWRR)</h1>
          <p className="text-sm text-muted-foreground">All submissions from SharePoint</p>
        </div>
        <Link to="/it/forms/hwrr/new"><Button><Plus className="mr-2 h-4 w-4" />New</Button></Link>
      </div>
      <ITFormIndexTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        mySubmissionsCount={mySubmissionsCount}
        myActionsCount={myActionsCount}
        totalCount={records.length}
      />
      <DatabaseTable
        data={filteredRecords as any}
        columns={[
          { key: 'title', header: 'Title', sortable: true },
          { key: 'currentStatus', header: 'Status', sortable: true, render: (v:unknown) => <StatusBadge status={String(v??'Draft')} /> },
          { key: 'submitteddate', header: 'Date', sortable: true, render: (v:unknown) => v ? format(new Date(v as string), 'dd MMM yyyy') : '-' },
        ] as any}
        onRowClick={(r: any) => navigate(`/it/forms/hwrr/${r.id}`)}
      />
    </div>
  );
}
