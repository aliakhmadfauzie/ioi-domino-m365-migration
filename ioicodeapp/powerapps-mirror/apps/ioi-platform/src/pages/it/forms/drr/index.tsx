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
import { parseRemarks } from '@/lib/parse-remarks';

interface DATARESTRecord {
  id: string;
  recordNo: string;
  dateCreated: Date | null;
  createdByEmail: string;
  ino: string;
  site: string;
  requestedBy: string;
  dept: string;
  serverName: string;
  fileName: string;
  filePath: string;
  reason: string;
  workflowstage: number;
  status: string;
  mainRecord?: MainDBIT;
}

function mapStatusToLabel(status?: string): string {
  if (!status) return 'Draft';
  return MainDBITCurrentstatusKeyToLabel[status] || 'Draft';
}

const columns: ColumnDef<DATARESTRecord>[] = [
  {
    key: 'recordNo',
    header: 'Record No',
    sortable: true,
    width: '180px',
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
    key: 'ino',
    header: 'Network Order No',
    sortable: true,
    width: '150px',
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
    key: 'fileName',
    header: 'File Name',
    sortable: true,
  },
  {
    key: 'requestedBy',
    header: 'Requested By',
    sortable: true,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (value: unknown) => <StatusBadge status={String(value)} />,
  },
];

export default function DATARESTDatabaseView() {
  const [selectedRecord, setSelectedRecord] = useState<DATARESTRecord | null>(null);

  const { data: mainRecords = [], isLoading } = useMainDBITList({
    filter: "formcode eq 'DATAREST'",
    orderBy: ['submitteddate desc'],
  });

  const datarestData: DATARESTRecord[] = useMemo(() => {
    if (mainRecords.length === 0) return [];

    return mainRecords.map((main: MainDBIT) => {
      const parsed = parseRemarks(main.remarks);
      const status = mapStatusToLabel(main.currentStatus);

      return {
        id: String(main.id),
        recordNo: main.title || `DATAREST-${main.id}`,
        dateCreated: main.submitteddate ? new Date(main.submitteddate) : null,
        createdByEmail: main.requestoremail || '',
        ino: String(parsed.REQ_INO || ''),
        site: String(parsed.REQ_Site || ''),
        requestedBy: String(parsed.REQ_RequestedBy || ''),
        dept: String(parsed.REQ_Dept || ''),
        serverName: String(parsed.REQ_ServerName || ''),
        fileName: String(parsed.REQ_FileName || ''),
        filePath: String(parsed.REQ_FilePath || ''),
        reason: String(parsed.REQ_Reason || ''),
        workflowstage: main.workflowstage || 0,
        status,
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
          { label: 'Assigned To', value: '-', type: 'user' },
          { label: 'Date Created', value: selectedRecord.dateCreated, type: 'date' },
          { label: 'Submitted By', value: selectedRecord.createdByEmail, type: 'user' },
          { label: 'Network Order No', value: selectedRecord.ino || '-' },
          { label: 'Status', value: selectedRecord.status, type: 'badge' },
          { label: 'Server Name', value: selectedRecord.serverName || '-' },
          { label: 'File Path', value: selectedRecord.filePath || '-' },
          { label: 'File Name', value: selectedRecord.fileName || '-' },
          { label: 'Media Backup Date', value: '-', type: 'date' },
          { label: 'CC', value: '-' },
          { label: 'Reason', value: selectedRecord.reason || '-', fullWidth: true },
          { label: 'Approval Stage', value: String(selectedRecord.workflowstage) || '-' },
        ],
      },
      {
        title: 'Requestor Details',
        fields: [
          { label: 'Site', value: selectedRecord.site || '-' }, 
          {label: 'Requester', value: '-' },
          { label: 'Requested By', value: selectedRecord.requestedBy || '-' },
          { label: 'Department', value: selectedRecord.dept || '-' },
          { label: 'Reason', value: selectedRecord.reason || '-', fullWidth: true },
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
              <h1 className="text-xl font-bold text-white">Data Restoration Request (DATAREST)</h1>
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
              View all data restoration requests
            </p>
            <Link to="/it/forms/drr/new">
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
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Loading DATAREST submissions from SharePoint...</p>
              </div>
            ) : datarestData.length === 0 ? (
              <Empty className="py-12">
                <EmptyHeader>
                  <EmptyTitle>No data restoration requests found</EmptyTitle>
                  <EmptyDescription>
                    There are no Data Restoration Request submissions in the SharePoint list yet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <DatabaseTable
                data={datarestData}
                columns={columns}
                onRowClick={(row: DATARESTRecord) => setSelectedRecord(row)}
                searchPlaceholder="Search by server, file name, INO..."
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
        title={`DATAREST — ${selectedRecord?.recordNo || ''}`}
        subtitle={`Server: ${selectedRecord?.serverName || 'N/A'} · File: ${selectedRecord?.fileName || 'N/A'}`}
        status={selectedRecord?.status}
        fieldGroups={fieldGroups}
      />
    </div>
  );
}
