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
import { getITFormCodeFilter } from '@/lib/it-form-routes';
import { useUser } from '@/hooks/use-user';
import { normalizeEmail } from '@/lib/it-current-action-access';
import { isMySubmission, isMyAction, type ITIndexTab } from '@/lib/it-index-tabs';
import { ITFormIndexTabs } from '@/components/it/it-form-index-tabs';

interface ITEVTRecord {
  id: string;
  recordNo: string;
  dateCreated: Date | null;
  createdByEmail: string;
  eventType: string;
  eventDesc: string;
  dateFrom: string;
  timeFrom: string;
  dateTo: string;
  timeTo: string;
  hardware: string;
  preparedBy: string;
  status: string;
  mainRecord?: MainDBIT;
}

function mapStatusToLabel(status?: string): string {
  if (!status) return 'Draft';
  return MainDBITCurrentstatusKeyToLabel[status] || 'Draft';
}

const columns: ColumnDef<ITEVTRecord>[] = [
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
    key: 'dateFrom',
    header: 'Event Date',
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
    key: 'eventType',
    header: 'Event Type',
    sortable: true,
    render: (value: unknown) => {
      const isIncident = String(value) === 'Incident' || String(value) === 'Emergency Maintenance';
      return (
        <span
          className="px-2 py-1 rounded text-xs font-medium"
          style={{
            backgroundColor: isIncident ? '#FEE2E2' : '#DBEAFE',
            color: isIncident ? '#991B1B' : '#1E40AF',
          }}
        >
          {String(value) || '-'}
        </span>
      );
    },
  },
  {
    key: 'eventDesc',
    header: 'Description',
    sortable: true,
    render: (value: unknown) => {
      const str = String(value || '');
      return str.length > 60 ? str.slice(0, 60) + '...' : str || '-';
    },
  },
  {
    key: 'preparedBy',
    header: 'Prepared By',
    sortable: true,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (value: unknown) => <StatusBadge status={String(value)} />,
  },
];

export default function ITEVTDatabaseView() {
  const { data: currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<ITIndexTab>('all');
  const userEmail = normalizeEmail(currentUser?.userPrincipalName || currentUser?.email);

  const [selectedRecord, setSelectedRecord] = useState<ITEVTRecord | null>(null);

  const { data: mainRecords = [], isLoading } = useMainDBITList({
    filter: getITFormCodeFilter('ITE'),
    orderBy: ['submitteddate desc'],
  });

  const itevtData: ITEVTRecord[] = useMemo(() => {
    if (mainRecords.length === 0) return [];

    return mainRecords.map((main: MainDBIT) => {
      const parsed = parseRemarks(main.remarks);
      const status = mapStatusToLabel(main.currentStatus);

      return {
        id: String(main.id),
        recordNo: main.title || `ITEVT-${main.id}`,
        dateCreated: main.submitteddate ? new Date(main.submitteddate) : null,
        createdByEmail: main.requestoremail || '',
        eventType: String(parsed.EVT_Type || ''),
        eventDesc: String(parsed.EVT_Desc || ''),
        dateFrom: String(parsed.EVT_DateFrom || ''),
        timeFrom: String(parsed.EVT_TimeFrom || ''),
        dateTo: String(parsed.EVT_DateTo || ''),
        timeTo: String(parsed.EVT_TimeTo || ''),
        hardware: String(parsed.EVT_Server || ''),
        preparedBy: String(parsed.EVT_PreparedBy || ''),
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
        title: 'Event Details',
        fields: [
          { label: 'Event Type', value: selectedRecord.eventType || '-', type: 'badge' },
          { label: 'Event Date (From)', value: selectedRecord.dateFrom || '-' },
          { label: 'Event Time (From)', value: selectedRecord.timeFrom || '-' },
          { label: 'Event Date (To)', value: selectedRecord.dateTo || '-' },
          { label: 'Event Time (To)', value: selectedRecord.timeTo || '-' },
          { label: 'Hardware Involved', value: selectedRecord.hardware || '-' },
          { label: 'Prepared By', value: selectedRecord.preparedBy || '-' },
          { label: 'Description', value: selectedRecord.eventDesc || '-', fullWidth: true },
        ],
      },
    ];
  }, [selectedRecord]);


  const filteredData = useMemo(() => {
    if (activeTab === 'all') return itevtData;
    return itevtData.filter((r) => {
      const main = r.mainRecord;
      if (!main) return false;
      return activeTab === 'mine' ? isMySubmission(main, userEmail) : isMyAction(main, userEmail);
    });
  }, [itevtData, activeTab, userEmail]);

  const mySubmissionsCount = useMemo(
    () => itevtData.filter((r) => r.mainRecord && isMySubmission(r.mainRecord, userEmail)).length,
    [itevtData, userEmail]
  );
  const myActionsCount = useMemo(
    () => itevtData.filter((r) => r.mainRecord && isMyAction(r.mainRecord, userEmail)).length,
    [itevtData, userEmail]
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
              <h1 className="text-xl font-bold text-white">IT Event Log (ITE)</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm">
                Database View — All Event Logs from SharePoint
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
              View all IT event logs
            </p>
            <Link to="/it/forms/ite/new">
              <Button style={{ backgroundColor: '#003366' }}>
                <Plus className="h-4 w-4 mr-2" />
                New Event Log
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
                <p className="text-muted-foreground">Loading ITEVT submissions from SharePoint...</p>
              </div>
            ) : itevtData.length === 0 ? (
              <Empty className="py-12">
                <EmptyHeader>
                  <EmptyTitle>No IT event logs found</EmptyTitle>
                  <EmptyDescription>
                    There are no IT Event Log submissions in the SharePoint list yet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
          <ITFormIndexTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            mySubmissionsCount={mySubmissionsCount}
            myActionsCount={myActionsCount}
            totalCount={itevtData.length}
          />
              <DatabaseTable
                data={filteredData}
                columns={columns}
                onRowClick={(row: ITEVTRecord) => setSelectedRecord(row)}
                searchPlaceholder="Search by event type, description..."
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
        title={`IT Event Log — ${selectedRecord?.recordNo || ''}`}
        subtitle={`Type: ${selectedRecord?.eventType || 'N/A'}`}
        status={selectedRecord?.status}
        fieldGroups={fieldGroups}
      />
    </div>
  );
}
