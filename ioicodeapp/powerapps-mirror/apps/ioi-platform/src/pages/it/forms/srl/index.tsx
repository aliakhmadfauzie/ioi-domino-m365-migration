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

interface SRLRecord {
  id: string;
  recordNo: string;
  dateCreated: Date | null;
  createdByEmail: string;
  site: string;
  rebootType: string;
  serverName: string;
  downDate: string;
  downTime: string;
  totalDownTime: string;
  reason: string;
  performedBy: string;
  status: string;
  mainRecord?: MainDBIT;
}

function mapStatusToLabel(status?: string): string {
  if (!status) return 'Draft';
  return MainDBITCurrentstatusKeyToLabel[status] || 'Draft';
}

const columns: ColumnDef<SRLRecord>[] = [
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
    key: 'downDate',
    header: 'Down Date',
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
    key: 'rebootType',
    header: 'Type',
    sortable: true,
    render: (value: unknown) => {
      const isEmergency = String(value) === 'Emergency';
      return (
        <span
          className="px-2 py-1 rounded text-xs font-medium"
          style={{
            backgroundColor: isEmergency ? '#FEE2E2' : '#D1FAE5',
            color: isEmergency ? '#991B1B' : '#065F46',
          }}
        >
          {String(value) || '-'}
        </span>
      );
    },
  },
  {
    key: 'totalDownTime',
    header: 'Downtime',
    sortable: true,
  },
  {
    key: 'performedBy',
    header: 'Performed By',
    sortable: true,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (value: unknown) => <StatusBadge status={String(value)} />,
  },
];

export default function SRLDatabaseView() {
  const navigate = useNavigate();
  const [selectedRecord, setSelectedRecord] = useState<SRLRecord | null>(null);

  const { data: mainRecords = [], isLoading } = useMainDBITList({
    filter: getITFormCodeFilter('SRL'),
    orderBy: ['submitteddate desc'],
  });

  const srlData: SRLRecord[] = useMemo(() => {
    if (mainRecords.length === 0) return [];

    return mainRecords.map((main: MainDBIT) => {
      const parsed = parseRemarks(main.remarks);
      const status = mapStatusToLabel(main.currentStatus);

      return {
        id: String(main.id),
        recordNo: main.title || `SVRREBOOT-${main.id}`,
        dateCreated: main.submitteddate ? new Date(main.submitteddate) : null,
        createdByEmail: main.requestoremail || '',
        site: String(parsed.RBT_Site || ''),
        rebootType: String(parsed.RBT_RebootType || ''),
        serverName: String(parsed.RBT_ServerName || ''),
        downDate: String(parsed.RBT_DownDate || ''),
        downTime: String(parsed.RBT_DownTime || ''),
        totalDownTime: String(parsed.RBT_TotalDownTime || ''),
        reason: String(parsed.RBT_Reason || ''),
        performedBy: String(parsed.RBT_PerformedBy || ''),
        status,
        mainRecord: main,
      };
    });
  }, [mainRecords]);

  const fieldGroups: FieldGroup[] = useMemo(() => {
    if (!selectedRecord) return [];
    return [
      {
        title: 'Log Information',
        fields: [
          { label: 'Record Number', value: selectedRecord.recordNo },
          { label: 'Date Created', value: selectedRecord.dateCreated, type: 'date' },
          { label: 'Submitted By', value: selectedRecord.createdByEmail, type: 'user' },
        ],
      },
      {
        title: 'Reboot Event',
        fields: [
          { label: 'Site', value: selectedRecord.site || '-' },
          { label: 'Server Name', value: selectedRecord.serverName || '-' },
          { label: 'Reboot Type', value: selectedRecord.rebootType || '-', type: 'badge' },
          { label: 'Down Date', value: selectedRecord.downDate || '-' },
          { label: 'Down Time', value: selectedRecord.downTime || '-' },
          { label: 'Total Down Time', value: selectedRecord.totalDownTime || '-' },
          { label: 'Performed By', value: selectedRecord.performedBy || '-' },
        ],
      },
      {
        title: 'Notes',
        fields: [
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
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">Server Reboot Log (SVRREBOOT)</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm">
                Database View — All Logs from SharePoint
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
              View all server reboot logs
            </p>
            <Link to="/it/forms/srl/new">
              <Button style={{ backgroundColor: '#003366' }}>
                <Plus className="h-4 w-4 mr-2" />
                New Log Entry
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
                <p className="text-muted-foreground">Loading SVRREBOOT submissions from SharePoint...</p>
              </div>
            ) : srlData.length === 0 ? (
              <Empty className="py-12">
                <EmptyHeader>
                  <EmptyTitle>No server reboot logs found</EmptyTitle>
                  <EmptyDescription>
                    There are no Server Reboot Log submissions in the SharePoint list yet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <DatabaseTable
                data={srlData}
                columns={columns}
                onRowClick={(row: SRLRecord) => setSelectedRecord(row)}
                searchPlaceholder="Search by server name, type..."
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
        title={`SVRREBOOT — ${selectedRecord?.recordNo || ''}`}
        subtitle={`Server: ${selectedRecord?.serverName || 'N/A'} · Site: ${selectedRecord?.site || 'N/A'}`}
        status={selectedRecord?.status}
        fieldGroups={fieldGroups}
      />
    </div>
  );
}
