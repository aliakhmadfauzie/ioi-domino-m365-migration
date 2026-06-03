import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatabaseTable, StatusBadge } from '@/components/database-view';
import type { ColumnDef } from '@/components/database-view';
import { DetailModal } from '@/components/database-view';
import type { FieldGroup, ApprovalHistoryItem } from '@/components/database-view';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { MainDBITCurrentstatusKeyToLabel, type MainDBIT } from '@/generated/models/main-dbit-model';
import { useUser } from '@/hooks/use-user';
import { normalizeEmail } from '@/lib/it-current-action-access';
import { isMySubmission, isMyAction, type ITIndexTab } from '@/lib/it-index-tabs';
import { ITFormIndexTabs } from '@/components/it/it-form-index-tabs';

interface SRRRecord {
  id: string;
  recordNo: string;
  dateCreated: Date | null;
  createdBy: string;
  createdByEmail: string;
  serverName: string;
  incidentDate: Date | null;
  summary: string;
  background: string;
  analysis: string;
  rootCause: string;
  correctiveActions: string;
  preventiveActions: string;
  status: string;
  reviewer: string;
  mainRecord?: MainDBIT;
}

function mapStatusToLabel(status?: string): string {
  if (!status) return 'Draft';
  return MainDBITCurrentstatusKeyToLabel[status] || 'Draft';
}

const columns: ColumnDef<SRRRecord>[] = [
  {
    key: 'recordNo',
    header: 'Record No',
    sortable: true,
    width: '140px',
    render: (value: unknown) => (
      <span className="font-mono font-medium" style={{ color: '#003366' }}>
        {String(value)}
      </span>
    ),
  },
  {
    key: 'dateCreated',
    header: 'Date',
    sortable: true,
    width: '100px',
    render: (value: unknown) => {
      if (!value) return '-';
      try {
        return format(value as Date, 'dd MMM yyyy');
      } catch {
        return '-';
      }
    },
  },
  {
    key: 'serverName',
    header: 'Server',
    sortable: true,
    render: (value: unknown) => (
      <span className="font-mono text-sm">{String(value) || '-'}</span>
    ),
  },
  {
    key: 'summary',
    header: 'Summary',
    sortable: true,
  },
  {
    key: 'incidentDate',
    header: 'Incident Date',
    sortable: true,
    render: (value: unknown) => {
      if (!value) return '-';
      try {
        return format(value as Date, 'dd MMM yyyy');
      } catch {
        return '-';
      }
    },
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (value: unknown) => <StatusBadge status={String(value)} />,
  },
];

export default function SRRDatabaseView() {
  const { data: currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<ITIndexTab>('all');
  const userEmail = normalizeEmail(currentUser?.userPrincipalName || currentUser?.email);

  const navigate = useNavigate();
  const [selectedRecord, setSelectedRecord] = useState<SRRRecord | null>(null);

  // Fetch main IT records filtered by formcode = 'SRR'
  const { data: mainRecords = [], isLoading } = useMainDBITList({
    filter: "formcode eq 'SRR'",
    orderBy: ['submitteddate desc'],
  });

  // Map SharePoint data to SRR record format
  const srrData: SRRRecord[] = useMemo(() => {
    if (mainRecords.length === 0) return [];

    return mainRecords.map((main: MainDBIT) => {
      const status = mapStatusToLabel(main.currentStatus);

      return {
        id: String(main.id),
        recordNo: main.title || `SRR-${main.id}`,
        dateCreated: main.submitteddate ? new Date(main.submitteddate) : null,
        createdBy: main.requestoremail?.split('@')[0] || 'Unknown',
        createdByEmail: main.requestoremail || '',
        serverName: '',
        incidentDate: null,
        summary: main.remarks || '',
        background: '',
        analysis: '',
        rootCause: '',
        correctiveActions: '',
        preventiveActions: '',
        status,
        reviewer: '',
        mainRecord: main,
      };
    });
  }, [mainRecords]);

  const fieldGroups: FieldGroup[] = useMemo(() => {
    if (!selectedRecord) return [];
    return [
      {
        title: 'Record Information',
        fields: [
          { label: 'Record Number', value: selectedRecord.recordNo },
          { label: 'Date Created', value: selectedRecord.dateCreated, type: 'date' },
          { label: 'Created By', value: selectedRecord.createdBy, type: 'user' },
          { label: 'Server Name', value: selectedRecord.serverName || '-' },
          { label: 'Incident Date', value: selectedRecord.incidentDate, type: 'date' },
        ],
      },
      {
        title: 'Incident Details',
        fields: [
          { label: 'Summary', value: selectedRecord.summary || '-', fullWidth: true },
          { label: 'Background', value: selectedRecord.background || '-', fullWidth: true },
          { label: 'Analysis', value: selectedRecord.analysis || '-', fullWidth: true },
          { label: 'Root Cause', value: selectedRecord.rootCause || '-', fullWidth: true },
        ],
      },
      {
        title: 'Actions',
        fields: [
          { label: 'Corrective Actions', value: selectedRecord.correctiveActions || '-', fullWidth: true },
          { label: 'Preventive Actions', value: selectedRecord.preventiveActions || '-', fullWidth: true },
        ],
      },
      {
        title: 'Review',
        fields: [
          { label: 'Reviewer', value: selectedRecord.reviewer || '-', type: 'user' },
        ],
      },
    ];
  }, [selectedRecord]);

  const approvalHistory: ApprovalHistoryItem[] = useMemo(() => {
    if (!selectedRecord) return [];
    const history: ApprovalHistoryItem[] = [
      {
        action: 'Record Created',
        actionBy: selectedRecord.createdBy,
        actionDate: selectedRecord.dateCreated || new Date(),
        status: 'completed',
      },
    ];

    if (selectedRecord.status === 'Completed') {
      history.push({
        action: 'Reviewed',
        actionBy: selectedRecord.reviewer || 'Reviewer',
        actionDate: new Date(),
        comments: 'Record reviewed and closed',
        status: 'approved',
      });
    } else {
      history.push({
        action: 'Pending Review',
        actionBy: selectedRecord.reviewer || 'Reviewer',
        actionDate: '-',
        status: 'pending',
      });
    }

    return history;
  }, [selectedRecord]);


  const filteredData = useMemo(() => {
    if (activeTab === 'all') return srrData;
    return srrData.filter((r) => {
      const main = r.mainRecord;
      if (!main) return false;
      return activeTab === 'mine' ? isMySubmission(main, userEmail) : isMyAction(main, userEmail);
    });
  }, [srrData, activeTab, userEmail]);

  const mySubmissionsCount = useMemo(
    () => srrData.filter((r) => r.mainRecord && isMySubmission(r.mainRecord, userEmail)).length,
    [srrData, userEmail]
  );
  const myActionsCount = useMemo(
    () => srrData.filter((r) => r.mainRecord && isMyAction(r.mainRecord, userEmail)).length,
    [srrData, userEmail]
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
              <h1 className="text-xl font-bold text-white">Server Records (SRR)</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm">
                Database View - All Records from SharePoint
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
              View all server incident records
            </p>
            <Link to="/it/forms/srr/new">
              <Button style={{ backgroundColor: '#003366' }}>
                <Plus className="h-4 w-4 mr-2" />
                New Record
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
                <p className="text-muted-foreground">Loading SRR submissions from SharePoint...</p>
              </div>
            ) : srrData.length === 0 ? (
              <Empty className="py-12">
                <EmptyHeader>
                  <EmptyTitle>No SRR submissions found</EmptyTitle>
                  <EmptyDescription>
                    There are no Server Record submissions in the SharePoint list yet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
          <ITFormIndexTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            mySubmissionsCount={mySubmissionsCount}
            myActionsCount={myActionsCount}
            totalCount={srrData.length}
          />
              <DatabaseTable
                data={filteredData}
                columns={columns}
                onRowClick={(row: SRRRecord) => setSelectedRecord(row)}
                searchPlaceholder="Search by server, summary..."
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
        title={`Server Records — ${selectedRecord?.recordNo || ''}`}
        subtitle={`Server: ${selectedRecord?.serverName || 'N/A'}`}
        status={selectedRecord?.status}
        fieldGroups={fieldGroups}
        approvalHistory={approvalHistory}
        canApprove={selectedRecord?.status === 'Submitted'}
        onApprove={(comments: string) => {
          console.log('Reviewed:', comments);
          setSelectedRecord(null);
        }}
        onReject={(comments: string) => {
          console.log('Needs revision:', comments);
          setSelectedRecord(null);
        }}
      />
    </div>
  );
}