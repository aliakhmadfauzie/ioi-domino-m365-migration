import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
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

interface PRFRecord {
  id: string;
  recordNo: string;
  dateSubmitted: Date | null;
  submittedBy: string;
  requestType: string;
  involvesSAP: string;
  sapClient: string;
  sapModule: string;
  company: string;
  department: string;
  priority: string;
  deadline: string;
  phoneExt: string;
  ccEmails: string;
  objective: string;
  justification: string;
  currentProcess: string;
  expectedOutcome: string;
  status: string;
  mainRecord?: MainDBIT;
}

function mapStatusToLabel(status?: string): string {
  if (!status) return 'Draft';
  return MainDBITCurrentstatusKeyToLabel[status] || 'Draft';
}

const columns: ColumnDef<PRFRecord>[] = [
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
    width: '110px',
    render: (value: unknown) => {
      if (!value) return '-';
      try { return format(value as Date, 'dd MMM yyyy'); } catch { return '-'; }
    },
  },
  {
    key: 'submittedBy',
    header: 'Submitted By',
    sortable: true,
  },
  {
    key: 'requestType',
    header: 'System',
    sortable: true,
    render: (value: unknown) => (
      <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: '#E0E7FF', color: '#3730A3' }}>
        {String(value) || '-'}
      </span>
    ),
  },
  {
    key: 'involvesSAP',
    header: 'SAP',
    sortable: true,
    width: '70px',
    render: (value: unknown) => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${value === 'Yes' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'}`}>
        {String(value)}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (value: unknown) => <StatusBadge status={String(value)} />,
  },
];

export default function PRFDatabaseView() {
  const [selectedRecord, setSelectedRecord] = useState<PRFRecord | null>(null);

  const { data: mainRecords = [], isLoading } = useMainDBITList({
    filter: "formcode eq 'PRF'",
    orderBy: ['submitteddate desc'],
  });

  const prfData: PRFRecord[] = useMemo(() => {
    return (mainRecords as MainDBIT[]).map((main) => ({
      id: String(main.id),
      recordNo: main.pRFRequestNo || main.title || `PRF-${main.id}`,
      dateSubmitted: main.submitteddate ? new Date(main.submitteddate) : null,
      submittedBy: main.requestorName || main.requestoremail?.split('@')[0] || 'Unknown',
      requestType: main.pRFRequestType || '',
      involvesSAP: main.pRFIsSAP || 'No',
      sapClient: main.pRFSAPClient || '',
      sapModule: main.pRFSAPModule || '',
      company: main.company || '',
      department: main.pRFDepartment || '',
      priority: main.pRFPriority || '',
      deadline: main.pRFDeadline || '',
      phoneExt: main.pRFPhoneExt || '',
      ccEmails: main.pRFCCEmails || '',
      objective: main.pRFObjective || main.remarks || '',
      justification: main.pRFJustification || '',
      currentProcess: main.pRFCurrentProcess || '',
      expectedOutcome: main.pRFExpectedOutcome || '',
      status: mapStatusToLabel(main.currentStatus),
      mainRecord: main,
    }));
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
          { label: 'Status', value: selectedRecord.status, type: 'badge' },
        ],
      },
      {
        title: 'Program Details',
        fields: [
          { label: 'System', value: selectedRecord.requestType || '-', type: 'badge' },
          { label: 'Involves SAP', value: selectedRecord.involvesSAP },
          { label: 'SAP Client', value: selectedRecord.sapClient || '-' },
          { label: 'SAP Module', value: selectedRecord.sapModule || '-' },
          { label: 'Company', value: selectedRecord.company || '-' },
          { label: 'Department', value: selectedRecord.department || '-' },
          { label: 'Priority', value: selectedRecord.priority || '-' },
          { label: 'Deadline', value: selectedRecord.deadline || '-' },
          { label: 'Phone Ext', value: selectedRecord.phoneExt || '-' },
          { label: 'CC Emails', value: selectedRecord.ccEmails || '-', fullWidth: true },
          { label: 'Objective', value: selectedRecord.objective || '-', fullWidth: true },
          { label: 'Justification', value: selectedRecord.justification || '-', fullWidth: true },
          { label: 'Current Process', value: selectedRecord.currentProcess || '-', fullWidth: true },
          { label: 'Expected Outcome', value: selectedRecord.expectedOutcome || '-', fullWidth: true },
        ],
      },
    ];
  }, [selectedRecord]);

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
              <h1 className="text-xl font-bold text-white">Program Request Form (PRF)</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm">
                Database View — All Requests
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm" style={{ color: '#5C5C5C' }}>
              {isLoading ? 'Loading requests...' : `${prfData.length} request${prfData.length !== 1 ? 's' : ''}`}
            </p>
            <Link to="/it/forms/prf/new">
              <Button style={{ backgroundColor: '#003366' }}>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#003366' }} />
            </div>
          ) : prfData.length === 0 ? (
            <Empty>
              <EmptyHeader />
              <EmptyTitle>No requests found</EmptyTitle>
              <EmptyDescription>Submit a new program request to get started.</EmptyDescription>
            </Empty>
          ) : (
            <div className="rounded-xl p-6" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <DatabaseTable
                data={prfData}
                columns={columns}
                onRowClick={(row: PRFRecord) => setSelectedRecord(row)}
                searchPlaceholder="Search by record no, system..."
              />
            </div>
          )}
        </motion.div>
      </div>

      <DetailModal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title={selectedRecord?.recordNo || ''}
        subtitle={selectedRecord?.requestType || 'Program Request'}
        status={selectedRecord?.status}
        fieldGroups={fieldGroups}
      />
    </div>
  );
}
