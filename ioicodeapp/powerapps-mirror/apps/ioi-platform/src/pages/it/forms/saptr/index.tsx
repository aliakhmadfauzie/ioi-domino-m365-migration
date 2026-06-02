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

interface SAPTRRecord {
  id: string;
  recordNo: string;
  dateSubmitted: Date | null;
  submittedBy: string;
  modules: string[];
  trCategory: string;
  developmentType: string;
  phases: string[];
  client: string;
  issueNumber: string;
  transportNumber: string;
  dependencies: string;
  sapTcode: string;
  reportName: string;
  changesDone: string;
  status: string;
  approver: string;
  mainRecord?: MainDBIT;
}

function mapStatusToLabel(status?: string): string {
  if (!status) return 'Draft';
  return MainDBITCurrentstatusKeyToLabel[status] || 'Draft';
}

function parseList(value: string | undefined): string[] {
  if (!value) return [];
  return value.split(',').map(s => s.trim()).filter(Boolean);
}

const columns: ColumnDef<SAPTRRecord>[] = [
  {
    key: 'recordNo',
    header: 'Record No',
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
    render: (value: unknown) => format(value as Date, 'dd MMM yyyy'),
  },
  {
    key: 'submittedBy',
    header: 'Submitted By',
    sortable: true,
  },
  {
    key: 'trCategory',
    header: 'Category',
    sortable: true,
    render: (value: unknown) => (
      <span
        className="px-2 py-1 rounded text-xs font-medium"
        style={{ backgroundColor: '#E0E7FF', color: '#3730A3' }}
      >
        {String(value)}
      </span>
    ),
  },
  {
    key: 'transportNumber',
    header: 'TR Number',
    sortable: true,
    render: (value: unknown) => (
      <span className="font-mono text-sm">{String(value)}</span>
    ),
  },
  {
    key: 'client',
    header: 'Client',
    sortable: true,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (value: unknown) => <StatusBadge status={String(value)} />,
  },
];

export default function SAPTRDatabaseView() {
  const [selectedRecord, setSelectedRecord] = useState<SAPTRRecord | null>(null);

  const { data: mainRecords = [], isLoading } = useMainDBITList({
    filter: "formcode eq 'SAPTR'",
    orderBy: ['submitteddate desc'],
  });

  const saptrData: SAPTRRecord[] = useMemo(() => {
    if (mainRecords.length === 0) return [];

    return mainRecords.map((main: MainDBIT) => {
      const parsed = parseRemarks(main.remarks);
      const status = mapStatusToLabel(main.currentStatus);

      return {
        id: String(main.id),
        recordNo: main.title || `SAPTR-${main.id}`,
        dateSubmitted: main.submitteddate ? new Date(main.submitteddate) : null,
        submittedBy: String(parsed.Requestor || main.requestoremail || ''),
        modules: parseList(String(parsed.Modules || '')),
        trCategory: String(parsed['TR Category'] || ''),
        developmentType: String(parsed['Development Type'] || ''),
        phases: parseList(String(parsed.Phases || '')),
        client: String(parsed.Client || ''),
        issueNumber: String(parsed['Issue Number'] || ''),
        transportNumber: String(parsed['Transport Number/Package'] || ''),
        dependencies: String(parsed.Dependencies || ''),
        sapTcode: String(parsed['SAP Tcode'] || ''),
        reportName: String(parsed['Report/Program/Fiori Apps'] || ''),
        changesDone: String(parsed['Changes Done'] || ''),
        status,
        approver: String(parsed['Technical Lead'] || parsed['Basis Team Lead'] || ''),
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
          { label: 'Record Number', value: selectedRecord.recordNo },
          { label: 'Date Submitted', value: selectedRecord.dateSubmitted, type: 'date' },
          { label: 'Submitted By', value: selectedRecord.submittedBy, type: 'user' },
          { label: 'Issue Number', value: selectedRecord.issueNumber },
        ],
      },
      {
        title: 'Transport Details',
        fields: [
          { label: 'Modules', value: selectedRecord.modules, type: 'list' },
          { label: 'TR Category', value: selectedRecord.trCategory, type: 'badge' },
          { label: 'Development Type', value: selectedRecord.developmentType },
          { label: 'Phases', value: selectedRecord.phases, type: 'list' },
          { label: 'Client', value: selectedRecord.client },
          { label: 'Transport Number', value: selectedRecord.transportNumber },
          { label: 'Dependencies', value: selectedRecord.dependencies || 'None' },
        ],
      },
      {
        title: 'Technical Details',
        fields: [
          { label: 'SAP T-Code', value: selectedRecord.sapTcode || 'N/A' },
          { label: 'Report/Program Name', value: selectedRecord.reportName || 'N/A' },
          { label: 'Changes Done', value: selectedRecord.changesDone, fullWidth: true },
        ],
      },
      {
        title: 'Approval',
        fields: [
          { label: 'Approver', value: selectedRecord.approver, type: 'user' },
        ],
      },
    ];
  }, [selectedRecord]);

  const approvalHistory: ApprovalHistoryItem[] = useMemo(() => {
    if (!selectedRecord) return [];
    const history: ApprovalHistoryItem[] = [
      {
        action: 'TR Submitted',
        actionBy: selectedRecord.submittedBy,
        actionDate: selectedRecord.dateSubmitted ? String(selectedRecord.dateSubmitted) : '-',
        status: 'completed',
      },
    ];

    if (selectedRecord.status === 'Approved' || selectedRecord.status === 'Completed') {
      history.push({
        action: 'Approved for Transport',
        actionBy: selectedRecord.approver,
        actionDate: '-',
        comments: 'Transport approved for release',
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
              <h1 className="text-xl font-bold text-white">SAP Transport Request (SAPTR)</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm">
                Database View — All Requests from SharePoint
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
              {saptrData.length} SAP transport request{saptrData.length !== 1 ? 's' : ''} found
            </p>
            <Link to="/it/forms/saptr/new">
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
            {saptrData.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No SAPTR Records</EmptyTitle>
                  <EmptyDescription>
                    No SAP Transport Request records have been submitted yet. Click "New Request" to create one.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <DatabaseTable
                data={saptrData}
                columns={columns}
                onRowClick={(row: SAPTRRecord) => setSelectedRecord(row)}
                searchPlaceholder="Search by TR number, category, module..."
              />
            )}
          </div>
        </motion.div>
      </div>

      <DetailModal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title={`SAPTR - ${selectedRecord?.recordNo || ''}`}
        subtitle={`TR: ${selectedRecord?.transportNumber || ''}`}
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
