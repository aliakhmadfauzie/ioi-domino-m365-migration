import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatabaseTable, StatusBadge } from '@/components/database-view';
import type { ColumnDef } from '@/components/database-view';
import { DetailModal } from '@/components/database-view';
import type { FieldGroup } from '@/components/database-view';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { MainDBITCurrentstatusKeyToLabel, type MainDBIT } from '@/generated/models/main-dbit-model';
import { parseRemarks } from '@/lib/parse-remarks';
import { useUser } from '@/hooks/use-user';
import { normalizeEmail } from '@/lib/it-current-action-access';
import { isMySubmission, isMyAction, type ITIndexTab } from '@/lib/it-index-tabs';
import { ITFormIndexTabs } from '@/components/it/it-form-index-tabs';

interface TRNMANRecord {
  id: string;
  recordNo: string;
  dateCreated: Date | null;
  createdByEmail: string;
  trnType: string;
  title: string;
  verNo: string;
  dateLast: string;
  revision: string;
  owner: string;
  comments: string;
  status: string;
  mainRecord?: MainDBIT;
}

function mapStatusToLabel(status?: string): string {
  if (!status) return 'Draft';
  return MainDBITCurrentstatusKeyToLabel[status] || 'Draft';
}

const columns: ColumnDef<TRNMANRecord>[] = [
  {
    key: 'recordNo',
    header: 'Record No',
    sortable: true,
    width: '190px',
    render: (value: unknown) => (
      <span className="font-mono font-medium" style={{ color: '#003366' }}>
        {String(value)}
      </span>
    ),
  },
  {
    key: 'dateLast',
    header: 'Last Revised',
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
    key: 'title',
    header: 'Title',
    sortable: true,
    render: (value: unknown) => {
      const str = String(value || '');
      return str.length > 60 ? str.slice(0, 60) + '...' : str || '-';
    },
  },
  {
    key: 'trnType',
    header: 'Type',
    sortable: true,
  },
  {
    key: 'verNo',
    header: 'Version',
    sortable: true,
    width: '90px',
  },
  {
    key: 'owner',
    header: 'Owner',
    sortable: true,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (value: unknown) => <StatusBadge status={String(value)} />,
  },
];

export default function TRNMANDatabaseView() {
  const { data: currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<ITIndexTab>('all');
  const userEmail = normalizeEmail(currentUser?.userPrincipalName || currentUser?.email);

  const navigate = useNavigate();
  const [selectedRecord, setSelectedRecord] = useState<TRNMANRecord | null>(null);

  const { data: mainRecords = [], isLoading } = useMainDBITList({
    filter: "formcode eq 'TRNMAN'",
    orderBy: ['submitteddate desc'],
  });

  const trnmanData: TRNMANRecord[] = useMemo(() => {
    if (mainRecords.length === 0) return [];

    return mainRecords.map((main: MainDBIT) => {
      const parsed = parseRemarks(main.remarks);
      const status = mapStatusToLabel(main.currentStatus);

      return {
        id: String(main.id),
        recordNo: main.title || `TRNMAN-${main.id}`,
        dateCreated: main.submitteddate ? new Date(main.submitteddate) : null,
        createdByEmail: main.requestoremail || '',
        trnType: String(parsed.TRN_Type || ''),
        title: String(parsed.TRN_Title || ''),
        verNo: String(parsed.TRN_VerNo || ''),
        dateLast: String(parsed.TRN_DateLast || ''),
        revision: String(parsed.TRN_Revision || ''),
        owner: String(parsed.TRN_Owner || ''),
        comments: String(parsed.TRN_Comments || ''),
        status,
        mainRecord: main,
      };
    });
  }, [mainRecords]);

  const fieldGroups: FieldGroup[] = useMemo(() => {
    if (!selectedRecord) return [];
    const parsed = selectedRecord.mainRecord ? parseRemarks(selectedRecord.mainRecord.remarks) : {};
    return [
      {
        title: 'Record Information',
        fields: [
          { label: 'Record Number', value: selectedRecord.recordNo },
          { label: 'Date Created', value: selectedRecord.dateCreated, type: 'date' },
          { label: 'Submitted By', value: selectedRecord.createdByEmail, type: 'user' },
        ],
      },
      {
        title: 'Training Manual Details',
        fields: [
          { label: 'Type', value: selectedRecord.trnType || '-', type: 'badge' },
          { label: 'Title', value: selectedRecord.title || '-', fullWidth: true },
          { label: 'Version Number', value: selectedRecord.verNo || '-' },
          { label: 'Revision', value: selectedRecord.revision || '-' },
          { label: 'Last Revised Date', value: selectedRecord.dateLast || '-' },
          { label: 'Owner', value: selectedRecord.owner || '-' },
          { label: 'Applicable To', value: String(parsed.TRN_ApplicableTo || '-'), fullWidth: true },
          { label: 'Comments', value: selectedRecord.comments || '-', fullWidth: true },
        ],
      },
    ];
  }, [selectedRecord]);


  const filteredData = useMemo(() => {
    if (activeTab === 'all') return trnmanData;
    return trnmanData.filter((r) => {
      const main = r.mainRecord;
      if (!main) return false;
      return activeTab === 'mine' ? isMySubmission(main, userEmail) : isMyAction(main, userEmail);
    });
  }, [trnmanData, activeTab, userEmail]);

  const mySubmissionsCount = useMemo(
    () => trnmanData.filter((r) => r.mainRecord && isMySubmission(r.mainRecord, userEmail)).length,
    [trnmanData, userEmail]
  );
  const myActionsCount = useMemo(
    () => trnmanData.filter((r) => r.mainRecord && isMyAction(r.mainRecord, userEmail)).length,
    [trnmanData, userEmail]
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div style={{ backgroundColor: '#003366' }} className="px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">Training Manual (TRNMAN)</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm">
                Database View — All Training Manuals from SharePoint
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
              View all training manual records
            </p>
            <Link to="/it/forms/trnman/new">
              <Button style={{ backgroundColor: '#003366' }}>
                <Plus className="h-4 w-4 mr-2" />
                New Training Manual
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
                <p className="text-muted-foreground">Loading TRNMAN records from SharePoint...</p>
              </div>
            ) : trnmanData.length === 0 ? (
              <Empty className="py-12">
                <EmptyHeader>
                  <EmptyTitle>No training manual records found</EmptyTitle>
                  <EmptyDescription>
                    There are no Training Manual submissions in the SharePoint list yet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
          <ITFormIndexTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            mySubmissionsCount={mySubmissionsCount}
            myActionsCount={myActionsCount}
            totalCount={trnmanData.length}
          />
              <DatabaseTable
                data={filteredData}
                columns={columns}
                onRowClick={(row: TRNMANRecord) => setSelectedRecord(row)}
                searchPlaceholder="Search by title, type, owner..."
                dateField="dateCreated"
                initiatorEmailField="createdByEmail"
                statusField="status"
              />
            )}
          </div>
        </motion.div>
      </div>

      <DetailModal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title={`Training Manual — ${selectedRecord?.recordNo || ''}`}
        subtitle={`${selectedRecord?.trnType || 'N/A'} · ${selectedRecord?.title || ''}`}
        status={selectedRecord?.status}
        fieldGroups={fieldGroups}
      />
    </div>
  );
}
