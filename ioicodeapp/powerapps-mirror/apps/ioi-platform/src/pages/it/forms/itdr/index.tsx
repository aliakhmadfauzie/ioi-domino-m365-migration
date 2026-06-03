import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatabaseTable, StatusBadge } from '@/components/database-view';
import type { ColumnDef } from '@/components/database-view';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { useMainDBITExtSupportList } from '@/generated/hooks/use-main-dbitext-support';
import { MainDBITCurrentstatusKeyToLabel, type MainDBIT } from '@/generated/models/main-dbit-model';
import type { MainDBITExtSupport } from '@/generated/models/main-dbit-ext-support-model';
import { parseRemarks } from '@/lib/parse-remarks';
import { getITFormCodeFilter, getITFormDetailPath } from '@/lib/it-form-routes';
import { useUser } from '@/hooks/use-user';
import { normalizeEmail } from '@/lib/it-current-action-access';
import { isMySubmission, isMyAction, type ITIndexTab } from '@/lib/it-index-tabs';
import { ITFormIndexTabs } from '@/components/it/it-form-index-tabs';

interface ITDAILYRPTRecord {
  id: string;
  recordNo: string;
  dateCreated: Date | null;
  createdByEmail: string;
  subject: string;
  category: string;
  type: string;
  company: string;
  startDate: string;
  endDate: string;
  displayText: string;
  docAuthor: string;
  status: string;
  mainRecord?: MainDBIT;
  extSupport?: MainDBITExtSupport;
}

function mapStatusToLabel(status?: string): string {
  if (!status) return 'Draft';
  return MainDBITCurrentstatusKeyToLabel[status] || 'Draft';
}

const columns: ColumnDef<ITDAILYRPTRecord>[] = [
  {
    key: 'recordNo',
    header: 'Task ID',
    sortable: true,
    width: '200px',
    render: (value: unknown) => (
      <span className="font-mono font-medium" style={{ color: '#003366' }}>
        {String(value)}
      </span>
    ),
  },
  {
    key: 'startDate',
    header: 'Work Date',
    sortable: true,
    width: '110px',
    render: (value: unknown) => {
      if (!value) return '-';
      try {
        return format(new Date(String(value)), 'dd MMM yyyy');
      } catch {
        return String(value) || '-';
      }
    },
  },
  {
    key: 'subject',
    header: 'Daily Task',
    sortable: true,
    render: (value: unknown) => {
      const str = String(value || '');
      return str.length > 60 ? str.slice(0, 60) + '...' : str || '-';
    },
  },
  {
    key: 'type',
    header: 'Task Type',
    sortable: true,
    render: (value: unknown) => (
      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
        {String(value) || '-'}
      </span>
    ),
  },
  {
    key: 'category',
    header: 'Task Area',
    sortable: true,
  },
  {
    key: 'docAuthor',
    header: 'Submitted By',
    sortable: true,
  },
  {
    key: 'status',
    header: 'Log Status',
    sortable: true,
    render: (value: unknown) => <StatusBadge status={String(value)} />,
  },
];

export default function ITDAILYRPTDatabaseView() {
  const { data: currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<ITIndexTab>('all');
  const userEmail = normalizeEmail(currentUser?.userPrincipalName || currentUser?.email);

  const navigate = useNavigate();

  const { data: mainRecords = [], isLoading: mainLoading } = useMainDBITList({
    filter: getITFormCodeFilter('ITDR'),
    orderBy: ['submitteddate desc'],
  });
  const { data: extSupportRecords = [], isLoading: extSupportLoading } = useMainDBITExtSupportList({
    filter: getITFormCodeFilter('ITDR', 'parentFormCode'),
  });

  const isLoading = mainLoading || extSupportLoading;

  const itdailyrptData: ITDAILYRPTRecord[] = useMemo(() => {
    if (mainRecords.length === 0) return [];

    const supportByParentId = new Map<string, MainDBITExtSupport>();
    const supportByParentTitle = new Map<string, MainDBITExtSupport>();
    extSupportRecords.forEach((support: MainDBITExtSupport) => {
      if (support.parentRecord?.id !== undefined && support.parentRecord?.id !== null) {
        supportByParentId.set(String(support.parentRecord.id), support);
      }
      if (support.parentRecord?.title) {
        supportByParentTitle.set(support.parentRecord.title, support);
      }
    });

    return mainRecords.map((main: MainDBIT) => {
      const parsed = parseRemarks(main.remarks);
      const extSupport =
        supportByParentId.get(String(main.id)) ?? supportByParentTitle.get(main.title || '');
      const status = mapStatusToLabel(main.currentStatus);

      return {
        id: String(main.id),
        recordNo: main.title || `ITDAILYRPT-${main.id}`,
        dateCreated: main.submitteddate ? new Date(main.submitteddate) : null,
        createdByEmail: main.requestoremail || '',
        subject: main.subject || String(parsed.HDR_Subject || ''),
        category: extSupport?.iTDRCategory || String(parsed.HDR_Category || ''),
        type: extSupport?.iTDRActivityType || String(parsed.HDR_Type || ''),
        company: main.company || String(parsed.HDR_Company || ''),
        startDate: extSupport?.iTDRDateFrom || String(parsed.HDR_StartDate || ''),
        endDate: extSupport?.iTDRDateTo || String(parsed.HDR_EndDate || ''),
        displayText: extSupport?.iTDRDisplayText || String(parsed.HDR_DisplayText || ''),
        docAuthor: extSupport?.iTDRDocAuthor || main.requestoremail || String(parsed.AUD_DocAuthor || ''),
        status,
        mainRecord: main,
        extSupport,
      };
    });
  }, [mainRecords, extSupportRecords]);


  const filteredData = useMemo(() => {
    if (activeTab === 'all') return itdailyrptData;
    return itdailyrptData.filter((r) => {
      const main = r.mainRecord;
      if (!main) return false;
      return activeTab === 'mine' ? isMySubmission(main, userEmail) : isMyAction(main, userEmail);
    });
  }, [itdailyrptData, activeTab, userEmail]);

  const mySubmissionsCount = useMemo(
    () => itdailyrptData.filter((r) => r.mainRecord && isMySubmission(r.mainRecord, userEmail)).length,
    [itdailyrptData, userEmail]
  );
  const myActionsCount = useMemo(
    () => itdailyrptData.filter((r) => r.mainRecord && isMyAction(r.mainRecord, userEmail)).length,
    [itdailyrptData, userEmail]
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div style={{ backgroundColor: '#003366' }} className="px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link to="/it">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">IT Daily Task Register</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm">
                Daily tasks submitted by IT users
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm" style={{ color: '#5C5C5C' }}>
              Review submitted daily task entries, work dates, task areas, and logged status.
            </p>
            <Link to="/it/forms/itdr/new">
              <Button style={{ backgroundColor: '#003366' }}>
                <Plus className="h-4 w-4 mr-2" />
                New Daily Task
              </Button>
            </Link>
          </div>

          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Loading daily task entries from SharePoint...</p>
              </div>
            ) : itdailyrptData.length === 0 ? (
              <Empty className="py-12">
                <EmptyHeader>
                  <EmptyTitle>No daily task entries found</EmptyTitle>
                  <EmptyDescription>
                    There are no IT Daily Report task submissions in the SharePoint list yet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
          <ITFormIndexTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            mySubmissionsCount={mySubmissionsCount}
            myActionsCount={myActionsCount}
            totalCount={itdailyrptData.length}
          />
              <DatabaseTable
                data={filteredData}
                columns={columns}
                onRowClick={(row: ITDAILYRPTRecord) => navigate(getITFormDetailPath('ITDR', row.id))}
                searchPlaceholder="Search by task, task area, type, or owner..."
                dateField="dateCreated"
                initiatorEmailField="createdByEmail"
                statusField="status"
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
