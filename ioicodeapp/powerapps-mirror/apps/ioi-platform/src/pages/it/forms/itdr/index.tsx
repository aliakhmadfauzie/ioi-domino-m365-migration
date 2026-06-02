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
import { useMainDBITExtSupportList } from '@/generated/hooks/use-main-dbitext-support';
import { MainDBITCurrentstatusKeyToLabel, type MainDBIT } from '@/generated/models/main-dbit-model';
import type { MainDBITExtSupport } from '@/generated/models/main-dbit-ext-support-model';
import { parseRemarks } from '@/lib/parse-remarks';
import { getITFormCodeFilter } from '@/lib/it-form-routes';

interface ITDAILYRPTRecord {
  id: string;
  recordNo: string;
  dateCreated: Date | null;
  createdByEmail: string;
  subject: string;
  category: string;
  type: string;
  company: string;
  startDate: string;
  endDate: string;
  docAuthor: string;
  status: string;
  mainRecord?: MainDBIT;
  extSupport?: MainDBITExtSupport;
}

function mapStatusToLabel(status?: string): string {
  if (!status) return 'Draft';
  return MainDBITCurrentstatusKeyToLabel[status] || 'Draft';
}

const columns: ColumnDef<ITDAILYRPTRecord>[] = [
  {
    key: 'recordNo',
    header: 'Record No',
    sortable: true,
    width: '200px',
    render: (value: unknown) => (
      <span className="font-mono font-medium" style={{ color: '#003366' }}>
        {String(value)}
      </span>
    ),
  },
  {
    key: 'startDate',
    header: 'Start Date',
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
    key: 'subject',
    header: 'Subject',
    sortable: true,
    render: (value: unknown) => {
      const str = String(value || '');
      return str.length > 60 ? str.slice(0, 60) + '...' : str || '-';
    },
  },
  {
    key: 'category',
    header: 'Category',
    sortable: true,
    render: (value: unknown) => (
      <span className="px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
        {String(value) || '-'}
      </span>
    ),
  },
  {
    key: 'type',
    header: 'Type',
    sortable: true,
  },
  {
    key: 'docAuthor',
    header: 'Author',
    sortable: true,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (value: unknown) => <StatusBadge status={String(value)} />,
  },
];

export default function ITDAILYRPTDatabaseView() {
  const [selectedRecord, setSelectedRecord] = useState<ITDAILYRPTRecord | null>(null);

  const { data: mainRecords = [], isLoading: mainLoading } = useMainDBITList({
    filter: getITFormCodeFilter('ITDR'),
    orderBy: ['submitteddate desc'],
  });
  const { data: extSupportRecords = [], isLoading: extSupportLoading } = useMainDBITExtSupportList({
    filter: getITFormCodeFilter('ITDR', 'parentFormCode'),
  });

  const isLoading = mainLoading || extSupportLoading;

  const itdailyrptData: ITDAILYRPTRecord[] = useMemo(() => {
    if (mainRecords.length === 0) return [];

    const supportByParentId = new Map<string, MainDBITExtSupport>();
    const supportByParentTitle = new Map<string, MainDBITExtSupport>();
    extSupportRecords.forEach((support: MainDBITExtSupport) => {
      if (support.parentRecord?.id !== undefined && support.parentRecord?.id !== null) {
        supportByParentId.set(String(support.parentRecord.id), support);
      }
      if (support.parentRecord?.title) {
        supportByParentTitle.set(support.parentRecord.title, support);
      }
    });

    return mainRecords.map((main: MainDBIT) => {
      const parsed = parseRemarks(main.remarks);
      const extSupport =
        supportByParentId.get(String(main.id)) ?? supportByParentTitle.get(main.title || '');
      const status = mapStatusToLabel(main.currentStatus);

      return {
        id: String(main.id),
        recordNo: main.title || `ITDAILYRPT-${main.id}`,
        dateCreated: main.submitteddate ? new Date(main.submitteddate) : null,
        createdByEmail: main.requestoremail || '',
        subject: main.subject || String(parsed.HDR_Subject || ''),
        category: extSupport?.iTDRCategory || String(parsed.HDR_Category || ''),
        type: extSupport?.iTDRActivityType || String(parsed.HDR_Type || ''),
        company: main.company || String(parsed.HDR_Company || ''),
        startDate: extSupport?.iTDRDateFrom || String(parsed.HDR_StartDate || ''),
        endDate: extSupport?.iTDRDateTo || String(parsed.HDR_EndDate || ''),
        docAuthor: main.requestoremail || String(parsed.AUD_DocAuthor || ''),
        status,
        mainRecord: main,
        extSupport,
      };
    });
  }, [mainRecords, extSupportRecords]);

  const fieldGroups: FieldGroup[] = useMemo(() => {
    if (!selectedRecord) return [];
    const parsed = selectedRecord.mainRecord ? parseRemarks(selectedRecord.mainRecord.remarks) : {};
    const extSupport = selectedRecord.extSupport;
    const type = selectedRecord.type;

    const groups: FieldGroup[] = [
      {
        title: 'Report Information',
        fields: [
          { label: 'Record Number', value: selectedRecord.recordNo },
          { label: 'Date Created', value: selectedRecord.dateCreated, type: 'date' },
          { label: 'Submitted By', value: selectedRecord.createdByEmail, type: 'user' },
        ],
      },
      {
        title: 'Report Header',
        fields: [
          { label: 'Subject', value: selectedRecord.subject || '-', fullWidth: true },
          { label: 'Category', value: selectedRecord.category || '-', type: 'badge' },
          { label: 'Type', value: selectedRecord.type || '-' },
          { label: 'Start Date', value: selectedRecord.startDate || '-' },
          { label: 'End Date', value: selectedRecord.endDate || '-' },
          { label: 'Company', value: selectedRecord.company || '-' },
          { label: 'Display Text', value: extSupport?.iTDRDisplayText || String(parsed.HDR_DisplayText || '-') },
        ],
      },
    ];

    if (type === 'Meeting') {
      groups.push({
        title: 'Meeting Details',
        fields: [
          { label: 'Chairman', value: extSupport?.iTDRMeetingChairman || String(parsed.MTG_Chairman || '-') },
          { label: 'Venue', value: extSupport?.iTDRVenue || String(parsed.MTG_Venue || '-') },
          { label: 'Date', value: extSupport?.iTDRDateFrom || String(parsed.MTG_Date || '-') },
          { label: 'Time From', value: extSupport?.iTDRTimeFrom || String(parsed.MTG_TimeFrom || '-') },
          { label: 'Time To', value: extSupport?.iTDRTimeTo || String(parsed.MTG_TimeTo || '-') },
          { label: 'Attendees', value: extSupport?.iTDRParticipants || String(parsed.MTG_Present || '-'), fullWidth: true },
        ],
      });
    }

    if (type === 'Seminar/Training') {
      groups.push({
        title: 'Training Details',
        fields: [
          { label: 'Venue', value: extSupport?.iTDRVenue || String(parsed.TRN_Venue || '-') },
          { label: 'Trainer', value: extSupport?.iTDRTrainer || String(parsed.TRN_Trainer || '-') },
          { label: 'Date Start', value: extSupport?.iTDRDateFrom || String(parsed.TRN_DateStart || '-') },
          { label: 'Date End', value: extSupport?.iTDRDateTo || String(parsed.TRN_DateEnd || '-') },
          { label: 'Participants', value: extSupport?.iTDRParticipants || String(parsed.TRN_Participants || '-'), fullWidth: true },
        ],
      });
    }

    if (type === 'OT') {
      groups.push({
        title: 'Overtime Details',
        fields: [
          { label: 'Time From', value: extSupport?.iTDRTimeFrom || String(parsed.OT_TimeFrom || '-') },
          { label: 'Time To', value: extSupport?.iTDRTimeTo || String(parsed.OT_TimeTo || '-') },
          { label: 'OT Category', value: extSupport?.iTDROtCategory || String(parsed.OT_Cat || '-') },
          { label: 'Purpose', value: extSupport?.iTDROtPurpose || String(parsed.OT_Purpose || '-'), fullWidth: true },
        ],
      });
    }

    groups.push({
      title: 'Document History',
      fields: [
        { label: 'Doc Author', value: extSupport?.iTDRDocAuthor || selectedRecord.docAuthor || '-' },
        { label: 'Created Date', value: extSupport?.iTDRAuditCreatedDate || String(parsed.AUD_CDate || '-') },
      ],
    });

    return groups;
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
              <h1 className="text-xl font-bold text-white">IT Daily Report (ITDAILYRPT)</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm">
                Database View — All Reports from SharePoint
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
              View all IT daily activity reports
            </p>
            <Link to="/it/forms/itdr/new">
              <Button style={{ backgroundColor: '#003366' }}>
                <Plus className="h-4 w-4 mr-2" />
                New Report
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
                <p className="text-muted-foreground">Loading ITDAILYRPT submissions from SharePoint...</p>
              </div>
            ) : itdailyrptData.length === 0 ? (
              <Empty className="py-12">
                <EmptyHeader>
                  <EmptyTitle>No IT daily reports found</EmptyTitle>
                  <EmptyDescription>
                    There are no IT Daily Report submissions in the SharePoint list yet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <DatabaseTable
                data={itdailyrptData}
                columns={columns}
                onRowClick={(row: ITDAILYRPTRecord) => setSelectedRecord(row)}
                searchPlaceholder="Search by subject, category, type..."
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
        title={`ITDAILYRPT — ${selectedRecord?.recordNo || ''}`}
        subtitle={`${selectedRecord?.type || 'N/A'} · ${selectedRecord?.subject || ''}`}
        status={selectedRecord?.status}
        fieldGroups={fieldGroups}
      />
    </div>
  );
}
