import { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageLoading } from '@/components/page-loading';
import {
  DatabaseTable,
  StatusBadge,
} from '@/components/database-view';
import type { ColumnDef } from '@/components/database-view';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { ALL_IT_FORMS } from '@/lib/it-forms-config';
import { getITFormCodeFilter, getITFormDetailPath } from '@/lib/it-form-routes';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import { format } from 'date-fns';
import { useUser } from '@/hooks/use-user';
import { normalizeEmail } from '@/lib/it-current-action-access';
import { isMySubmission, isMyAction, type ITIndexTab } from '@/lib/it-index-tabs';
import { ITFormIndexTabs } from '@/components/it/it-form-index-tabs';

export default function ITFormDatabaseView() {
  const { data: currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<ITIndexTab>('all');
  const userEmail = normalizeEmail(currentUser?.userPrincipalName || currentUser?.email);

  const { formCode } = useParams<{ formCode: string }>();
  const navigate = useNavigate();
  const formCodeUpper = formCode?.toUpperCase() ?? '';
  const { data: submissions = [], isLoading, refetch } = useMainDBITList({
    filter: getITFormCodeFilter(formCodeUpper),
    orderBy: ['submitteddate desc'],
  });
  const formConfig = ALL_IT_FORMS.find((f) => f.code === formCodeUpper);

  const columns: ColumnDef<MainDBIT>[] = useMemo(() => [
    { key: 'title', header: 'Title', sortable: true },
    { key: 'formcode', header: 'Form Code', sortable: true },
    {
      key: 'currentStatus',
      header: 'Status',
      sortable: true,
      render: (value: unknown) => <StatusBadge status={String(value ?? 'Draft')} />,
    },
    {
      key: 'submitteddate',
      header: 'Submitted',
      sortable: true,
      render: (value: unknown) => {
        if (!value) return '—';
        try { return format(new Date(String(value)), 'dd MMM yyyy'); } catch { return String(value); }
      },
    },
    { key: 'requestoremail', header: 'Submitted By', sortable: true },
  ], []);


  const filteredSubmissions = useMemo(() => {
    if (activeTab === 'all') return submissions;
    return (submissions as any[]).filter((r) =>
      activeTab === 'mine' ? isMySubmission(r, userEmail) : isMyAction(r, userEmail)
    );
  }, [submissions, activeTab, userEmail]);

  const mySubmissionsCount = useMemo(
    () => (submissions as any[]).filter((r) => isMySubmission(r, userEmail)).length,
    [submissions, userEmail]
  );
  const myActionsCount = useMemo(
    () => (submissions as any[]).filter((r) => isMyAction(r, userEmail)).length,
    [submissions, userEmail]
  );

  if (isLoading) return <PageLoading message="Loading records..." />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{formConfig?.name || formCodeUpper} Records</h1>
            <p className="text-sm text-muted-foreground">{submissions.length} submission(s)</p>
          </div>
        </div>
        <Button asChild>
          <Link to={`/it/forms/${formCode?.toLowerCase() ?? ''}/new`}>
            <Plus className="h-4 w-4 mr-2" />New Request
          </Link>
        </Button>
      </div>
      <ITFormIndexTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        mySubmissionsCount={mySubmissionsCount}
        myActionsCount={myActionsCount}
        totalCount={submissions.length}
      />
      <DatabaseTable
        data={filteredSubmissions as any}
        columns={columns as any}
        onRowClick={(row: any) => navigate(getITFormDetailPath(formCodeUpper, row.id))}
        isLoading={isLoading}
        onRefresh={refetch}
        title={formConfig?.name ?? formCodeUpper}
        searchPlaceholder="Search records..."
      />
    </div>
  );
}
