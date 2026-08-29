import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
import { parseRemarks } from '@/lib/parse-remarks';
import { useUser } from '@/hooks/use-user';
import { normalizeEmail } from '@/lib/it-current-action-access';
import { isMySubmission, isMyAction, type ITIndexTab } from '@/lib/it-index-tabs';
import { ITFormIndexTabs } from '@/components/it/it-form-index-tabs';

interface SAPCARecord {
  id: string;
  formNo: string;
  dateSubmitted: Date | null;
  requestedBy: string;
  modules: string[];
  client: string;
  clientNumber: string;
  issueReference: string;
  purpose: string;
  changesToBeDone: string;
  status: string;
  ccFunctionalOwner: string;
  approver: string;
  mainRecord?: MainDBIT;
}

function mapStatusToLabel(status?: string): string {
  if (!status) return 'Draft';
  return MainDBITCurrentstatusKeyToLabel[status] || status;
}

function parseList(value: string | undefined): string[] {
  if (!value) return [];
  return value.split(',').map(s => s.trim()).filter(Boolean);
}

const columns: ColumnDef<SAPCARecord>[] = [
  {
    key: 'formNo',
    header: 'Form No',
    sortable: true,
    width: '160px',
    render: (value: unknown) => (
      <span className="font-mono font-medium" style={{ color: '#003366' }}>
        {String(value)}
      </span>
    ),
  },
  {
    key: 'dateSubmitted',
    header: 'Date',
    sortable: true,
    width: '100px',
    render: (value: unknown) => value ? format(value as Date, 'dd MMM yyyy') : '-',
  },
  {
    key: 'requestedBy',
    header: 'Requested By',
    sortable: true,
  },
  {
    key: 'modules',
    header: 'Modules',
    render: (value: unknown) => {
      const modules = value as string[];
      return (
        <span className="text-sm">
          {modules.slice(0, 2).join(', ')}{modules.length > 2 ? ` +${modules.length - 2}` : ''}
        </span>
      );
    },
  },
  {
    key: 'client',
    header: 'Client',
    sortable: true,
    render: (value: unknown) => (
      <span
        className="px-2 py-1 rounded text-xs font-medium"
        style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
      >
        {String(value)}
      </span>
    ),
  },
  {
    key: 'purpose',
    header: 'Purpose',
    sortable: true,
    render: (value: unknown) => {
      const text = String(value);
      return text.length > 40 ? `${text.slice(0, 40)}...` : text;
    },
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (value: unknown) => <StatusBadge status={String(value)} />,
  },
];

export default function SAPCADatabaseView() {
  const { data: currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<ITIndexTab>('all');
  const userEmail = normalizeEmail(currentUser?.userPrincipalName || currentUser?.email);

  const [selectedRecord, setSelectedRecord] = useState<SAPCARecord | null>(null);

  const { data: mainRecords = [], isLoading } = useMainDBITList({
    filter: "formcode eq 'SAPCA'",
    orderBy: ['submitteddate desc'],
  });

  const sapcaData: SAPCARecord[] = useMemo(() => {
    if (mainRecords.length === 0) return [];

    return mainRecords.map((main: MainDBIT) => {
      const parsed = parseRemarks(main.remarks);

      return {
        id: String(main.id),
        formNo: main.title || String(parsed['Request Number'] || `SAPCA-${main.id}`),
        dateSubmitted: main.submitteddate ? new Date(main.submitteddate) : null,
        requestedBy: String(parsed.Requestor || main.requestorName || main.requestoremail || ''),
        modules: parseList(String(parsed.Modules || '')),
        client: String(parsed.Client || ''),
        clientNumber: String(parsed['Client Number'] || ''),
        issueReference: String(parsed['Issue Log/SSR/PRF/SAP Notes Number'] || ''),
        purpose: String(parsed.Purpose || ''),
        changesToBeDone: String(parsed['Changes to be Done'] || ''),
        status: String(parsed['Status Label'] || mapStatusToLabel(main.currentStatus)),
        ccFunctionalOwner: String(parsed['CC Functional Owner'] || ''),
        approver: String(parsed.ITAPP || parsed.ITPIC || ''),
        mainRecord: main,
      };
    });
  }, [mainRecords]);

  const fieldGroups: FieldGroup[] = useMemo(() => {
    if (!selectedRecord) return [];
    return [
      {
        title: 'Request Information',
        fields: [
          { label: 'Form Number', value: selectedRecord.formNo },
          { label: 'Date Submitted', value: selectedRecord.dateSubmitted, type: 'date' },
          { label: 'Requested By', value: selectedRecord.requestedBy, type: 'user' },
          { label: 'Issue Reference', value: selectedRecord.issueReference },
        ],
      },
      {
        title: 'Configuration Details',
        fields: [
          { label: 'Modules', value: selectedRecord.modules, type: 'list' },
          { label: 'Client', value: selectedRecord.client, type: 'badge' },
          { label: 'Client Number', value: selectedRecord.clientNumber },
          { label: 'Purpose', value: selectedRecord.purpose, fullWidth: true },
          { label: 'Changes to be Done', value: selectedRecord.changesToBeDone, fullWidth: true },
        ],
      },
      {
        title: 'Approval',
        fields: [
          { label: 'CC Functional Owner', value: selectedRecord.ccFunctionalOwner, type: 'user' },
          { label: 'Approver', value: selectedRecord.approver, type: 'user' },
        ],
      },
    ];
  }, [selectedRecord]);

  const approvalHistory: ApprovalHistoryItem[] = useMemo(() => {
    if (!selectedRecord) return [];
    const history: ApprovalHistoryItem[] = [
      {
        action: 'Request Submitted',
        actionBy: selectedRecord.requestedBy,
        actionDate: selectedRecord.dateSubmitted ? String(selectedRecord.dateSubmitted) : '-',
        status: 'completed',
      },
    ];

    if (selectedRecord.status === 'Approved' || selectedRecord.status === 'Completed') {
      history.push({
        action: 'Configuration Access Approved',
        actionBy: selectedRecord.approver,
        actionDate: '-',
        comments: 'Access granted for configuration changes',
        status: 'approved',
      });
    } else {
      history.push({
        action: 'Pending Approval',
        actionBy: selectedRecord.approver,
        actionDate: '-',
        status: 'pending',
      });
    }

    return history;
  }, [selectedRecord]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#003366' }} />
      </div>
    );
  }


  const filteredData = useMemo(() => {
    if (activeTab === 'all') return sapcaData;
    return sapcaData.filter((r) => {
      const main = r.mainRecord;
      if (!main) return false;
      return activeTab === 'mine' ? isMySubmission(main, userEmail) : isMyAction(main, userEmail);
    });
  }, [sapcaData, activeTab, userEmail]);

  const mySubmissionsCount = useMemo(
    () => sapcaData.filter((r) => r.mainRecord && isMySubmission(r.mainRecord, userEmail)).length,
    [sapcaData, userEmail]
  );
  const myActionsCount = useMemo(
    () => sapcaData.filter((r) => r.mainRecord && isMyAction(r.mainRecord, userEmail)).length,
    [sapcaData, userEmail]
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
              <h1 className="text-xl font-bold text-white">SAP Configuration Access (SAPCA)</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm">
                Database View - All Requests from SharePoint
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
              {sapcaData.length} SAP configuration access request{sapcaData.length !== 1 ? 's' : ''} found
            </p>
            <Link to="/it/forms/sapca/new">
              <Button style={{ backgroundColor: '#003366' }}>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </Link>
          </div>

          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            {sapcaData.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No SAPCA Records</EmptyTitle>
                  <EmptyDescription>
                    No SAP Configuration Access records have been submitted yet. Click "New Request" to create one.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
          <ITFormIndexTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            mySubmissionsCount={mySubmissionsCount}
            myActionsCount={myActionsCount}
            totalCount={sapcaData.length}
          />
              <DatabaseTable
                data={filteredData}
                columns={columns}
                onRowClick={(row: SAPCARecord) => setSelectedRecord(row)}
                searchPlaceholder="Search by form number, module, client..."
              />
            )}
          </div>
        </motion.div>
      </div>

      <DetailModal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title={`SAP Configuration Access — ${selectedRecord?.formNo || ''}`}
        subtitle={`Client: ${selectedRecord?.client || ''} (${selectedRecord?.clientNumber || ''})`}
        status={selectedRecord?.status}
        fieldGroups={fieldGroups}
        approvalHistory={approvalHistory}
        canApprove={selectedRecord?.status === 'Pending Approval'}
        onApprove={(comments: string) => {
          console.log('Approved:', comments);
          setSelectedRecord(null);
        }}
        onReject={(comments: string) => {
          console.log('Rejected:', comments);
          setSelectedRecord(null);
        }}
      />
    </div>
  );
}
