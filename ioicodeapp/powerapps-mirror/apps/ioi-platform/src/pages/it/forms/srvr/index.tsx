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
import { getITFormCodeFilter } from '@/lib/it-form-routes';

interface SVRRECRecord {
  id: string;
  recordNo: string;
  dateCreated: Date | null;
  createdByEmail: string;
  site: string;
  serverName: string;
  recType: string;
  mode: string;
  dateFrom: string;
  dateTo: string;
  summary: string;
  rbtRequired: string;
  performedBy: string;
  status: string;
  mainRecord?: MainDBIT;
}

function mapStatusToLabel(status?: string): string {
  if (!status) return 'Draft';
  return MainDBITCurrentstatusKeyToLabel[status] || 'Draft';
}

const columns: ColumnDef<SVRRECRecord>[] = [
  {
    key: 'recordNo',
    header: 'Record No',
    sortable: true,
    width: '170px',
    render: (value: unknown) => (
      <span className="font-mono font-medium" style={{ color: '#003366' }}>
        {String(value)}
      </span>
    ),
  },
  {
    key: 'dateFrom',
    header: 'Date From',
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
    key: 'serverName',
    header: 'Server',
    sortable: true,
    render: (value: unknown) => (
      <span className="font-mono text-sm">{String(value) || '-'}</span>
    ),
  },
  {
    key: 'recType',
    header: 'Type',
    sortable: true,
  },
  {
    key: 'summary',
    header: 'Summary',
    sortable: true,
    render: (value: unknown) => {
      const str = String(value || '');
      return str.length > 60 ? str.slice(0, 60) + '...' : str || '-';
    },
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (value: unknown) => <StatusBadge status={String(value)} />,
  },
];

export default function SVRRECDatabaseView() {
  const navigate = useNavigate();
  const [selectedRecord, setSelectedRecord] = useState<SVRRECRecord | null>(null);

  const { data: mainRecords = [], isLoading } = useMainDBITList({
    filter: getITFormCodeFilter('SRVR'),
    orderBy: ['submitteddate desc'],
  });

  const svrrecData: SVRRECRecord[] = useMemo(() => {
    if (mainRecords.length === 0) return [];

    return mainRecords.map((main: MainDBIT) => {
      const parsed = parseRemarks(main.remarks);
      const status = mapStatusToLabel(main.currentStatus);

      return {
        id: String(main.id),
        recordNo: main.title || `SVRREC-${main.id}`,
        dateCreated: main.submitteddate ? new Date(main.submitteddate) : null,
        createdByEmail: main.requestoremail || '',
        site: String(parsed.HDR_Site || ''),
        serverName: String(parsed.HDR_ServerName || ''),
        recType: String(parsed.HDR_RecType || ''),
        mode: String(parsed.HDR_Mode || ''),
        dateFrom: String(parsed.HDR_DateFrom || ''),
        dateTo: String(parsed.HDR_DateTo || ''),
        summary: String(parsed.BODY_Summary || ''),
        rbtRequired: String(parsed.RBT_Required || ''),
        performedBy: String(parsed.PER_PerformedBy || ''),
        status,
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
          { label: 'Submitted By', value: selectedRecord.createdByEmail, type: 'user' },
        ],
      },
      {
        title: 'Record Header',
        fields: [
          { label: 'Site', value: selectedRecord.site || '-' },
          { label: 'Server Name', value: selectedRecord.serverName || '-' },
          { label: 'Record Type', value: selectedRecord.recType || '-', type: 'badge' },
          { label: 'Mode', value: selectedRecord.mode || '-' },
          { label: 'Date From', value: selectedRecord.dateFrom || '-' },
          { label: 'Date To', value: selectedRecord.dateTo || '-' },
        ],
      },
      {
        title: 'Analysis',
        fields: [
          { label: 'Summary', value: selectedRecord.summary || '-', fullWidth: true },
          { label: 'Reboot Required', value: selectedRecord.rbtRequired || '-' },
          { label: 'Performed By', value: selectedRecord.performedBy || '-' },
        ],
      },
    ];
  }, [selectedRecord]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div style={{ backgroundColor: '#003366' }} className="px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">Server Record Analysis (SVRREC)</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm">
                Database View — All Server Records from SharePoint
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
              View all server record analyses
            </p>
            <Link to="/it/forms/srvr/new">
              <Button style={{ backgroundColor: '#003366' }}>
                <Plus className="h-4 w-4 mr-2" />
                New Server Record
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
                <p className="text-muted-foreground">Loading SVRREC submissions from SharePoint...</p>
              </div>
            ) : svrrecData.length === 0 ? (
              <Empty className="py-12">
                <EmptyHeader>
                  <EmptyTitle>No server records found</EmptyTitle>
                  <EmptyDescription>
                    There are no Server Record Analysis submissions in the SharePoint list yet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <DatabaseTable
                data={svrrecData}
                columns={columns}
                onRowClick={(row: SVRRECRecord) => setSelectedRecord(row)}
                searchPlaceholder="Search by server, type, summary..."
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
        title={`SVRREC — ${selectedRecord?.recordNo || ''}`}
        subtitle={`Server: ${selectedRecord?.serverName || 'N/A'} · ${selectedRecord?.recType || 'N/A'}`}
        status={selectedRecord?.status}
        fieldGroups={fieldGroups}
      />
    </div>
  );
}
