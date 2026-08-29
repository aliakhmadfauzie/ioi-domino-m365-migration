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
import { useUser } from '@/hooks/use-user';
import { normalizeEmail } from '@/lib/it-current-action-access';
import { isMySubmission, isMyAction, type ITIndexTab } from '@/lib/it-index-tabs';
import { ITFormIndexTabs } from '@/components/it/it-form-index-tabs';

interface DCALRecord {
  id: string;
  recordNo: string;
  dateCreated: Date | null;
  createdByEmail: string;
  site: string;
  serverRoom: string;
  accessDate: string;
  timeIn: string;
  visitorName: string;
  company: string;
  reason: string;
  attendedBy: string;
  status: string;
  mainRecord?: MainDBIT;
}

function mapStatusToLabel(status?: string): string {
  if (!status) return 'Draft';
  return MainDBITCurrentstatusKeyToLabel[status] || 'Draft';
}

const columns: ColumnDef<DCALRecord>[] = [
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
    key: 'accessDate',
    header: 'Date',
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
    key: 'site',
    header: 'Site',
    sortable: true,
    width: '100px',
  },
  {
    key: 'serverRoom',
    header: 'Server Room',
    sortable: true,
  },
  {
    key: 'visitorName',
    header: 'Visitor',
    sortable: true,
  },
  {
    key: 'attendedBy',
    header: 'Attended By',
    sortable: true,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (value: unknown) => <StatusBadge status={String(value)} />,
  },
];

export default function DCALDatabaseView() {
  const { data: currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<ITIndexTab>('all');
  const userEmail = normalizeEmail(currentUser?.userPrincipalName || currentUser?.email);

  const [selectedRecord, setSelectedRecord] = useState<DCALRecord | null>(null);

  const { data: mainRecords = [], isLoading } = useMainDBITList({
    filter: "formcode eq 'DCALOG' or formcode eq 'IAL2'",
    orderBy: ['submitteddate desc'],
  });

  const dcalData: DCALRecord[] = useMemo(() => {
    if (mainRecords.length === 0) return [];

    return mainRecords.map((main: MainDBIT) => {
      const parsed = parseRemarks(main.remarks);
      const status = mapStatusToLabel(main.currentStatus);

      // Support both old (DCALOG: ACC_*) and new (IAL2: rbSite/lstServerRoom/...) field names
      const site = String(parsed.ACC_Site || parsed.rbSite || '');
      const serverRoom = String(parsed.ACC_ServerRoom || parsed.lstServerRoom || '');
      const accessDate = String(parsed.ACC_Date || parsed.dtCreatedAccess || '');
      const timeIn = String(parsed.ACC_TimeIn || parsed.dtTimeIN || '');
      const visitorName = String(parsed.ACC_Visitor || parsed.nmVisitor || '');
      const company = String(parsed.ACC_Company || parsed.lstCompany || '');
      const reason = String(parsed.ACC_Reason || parsed.txtReasonAccess || '');
      const attendedBy = String(parsed.ACC_AttendedBy || parsed.nmPIC || '');
      const formcode = main.formcode || 'DCALOG';

      return {
        id: String(main.id),
        recordNo: main.title || `${formcode}-${main.id}`,
        dateCreated: main.submitteddate ? new Date(main.submitteddate) : null,
        createdByEmail: main.requestoremail || '',
        site,
        serverRoom,
        accessDate,
        timeIn,
        visitorName,
        company,
        reason,
        attendedBy,
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
        title: 'Access Details',
        fields: [
          { label: 'Site', value: selectedRecord.site || '-' },
          { label: 'Server Room', value: selectedRecord.serverRoom || '-' },
          { label: 'Date', value: selectedRecord.accessDate || '-' },
          { label: 'Time In', value: selectedRecord.timeIn || '-' },
          { label: 'Attended By (PIC)', value: selectedRecord.attendedBy || '-' },
        ],
      },
      {
        title: 'Visitor Details',
        fields: [
          { label: 'Visitor Name', value: selectedRecord.visitorName || '-' },
          { label: 'Company', value: selectedRecord.company || '-' },
          { label: 'Reason for Access', value: selectedRecord.reason || '-', fullWidth: true },
        ],
      },
    ];
  }, [selectedRecord]);


  const filteredData = useMemo(() => {
    if (activeTab === 'all') return dcalData;
    return dcalData.filter((r) => {
      const main = r.mainRecord;
      if (!main) return false;
      return activeTab === 'mine' ? isMySubmission(main, userEmail) : isMyAction(main, userEmail);
    });
  }, [dcalData, activeTab, userEmail]);

  const mySubmissionsCount = useMemo(
    () => dcalData.filter((r) => r.mainRecord && isMySubmission(r.mainRecord, userEmail)).length,
    [dcalData, userEmail]
  );
  const myActionsCount = useMemo(
    () => dcalData.filter((r) => r.mainRecord && isMyAction(r.mainRecord, userEmail)).length,
    [dcalData, userEmail]
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
              <h1 className="text-xl font-bold text-white">Data Center Access Log (DCAL)</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm">
                Database View — All Access Logs from SharePoint
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
              View all data center access logs
            </p>
            <Link to="/it/forms/dcal/new">
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
                <p className="text-muted-foreground">Loading Data Center Access Log submissions from SharePoint...</p>
              </div>
            ) : dcalData.length === 0 ? (
              <Empty className="py-12">
                <EmptyHeader>
                  <EmptyTitle>No data center access logs found</EmptyTitle>
                  <EmptyDescription>
                    There are no Data Center Access Log submissions in the SharePoint list yet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
          <ITFormIndexTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            mySubmissionsCount={mySubmissionsCount}
            myActionsCount={myActionsCount}
            totalCount={dcalData.length}
          />
              <DatabaseTable
                data={filteredData}
                columns={columns}
                onRowClick={(row: DCALRecord) => setSelectedRecord(row)}
                searchPlaceholder="Search by visitor, server room, site..."
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
        title={`Data Center Access Log — ${selectedRecord?.recordNo || ''}`}
        subtitle={`Visitor: ${selectedRecord?.visitorName || 'N/A'} · ${selectedRecord?.site || 'N/A'}`}
        status={selectedRecord?.status}
        fieldGroups={fieldGroups}
      />
    </div>
  );
}
