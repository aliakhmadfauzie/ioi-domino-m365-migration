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
import { useMainDBITExtDocsList } from '@/generated/hooks/use-main-dbitext-docs';
import { MainDBITCurrentstatusKeyToLabel, type MainDBIT } from '@/generated/models/main-dbit-model';
import type { MainDBITExtDocs } from '@/generated/models/main-dbit-ext-docs-model';
import { parseRemarks } from '@/lib/parse-remarks';
import { useUser } from '@/hooks/use-user';
import { normalizeEmail } from '@/lib/it-current-action-access';
import { isMySubmission, isMyAction, type ITIndexTab } from '@/lib/it-index-tabs';
import { ITFormIndexTabs } from '@/components/it/it-form-index-tabs';

interface ITINFORecord {
  id: string;
  recordNo: string;
  dateCreated: Date | null;
  createdByEmail: string;
  infoTo: string;
  infoType: string;
  subject: string;
  isgRemarks: string;
  resend: string;
  status: string;
  mainRecord?: MainDBIT;
  extDoc?: MainDBITExtDocs;
}

function mapStatusToLabel(status?: string): string {
  if (!status) return 'Draft';
  return MainDBITCurrentstatusKeyToLabel[status] || 'Draft';
}

const columns: ColumnDef<ITINFORecord>[] = [
  {
    key: 'recordNo',
    header: 'Record No',
    sortable: true,
    width: '190px',
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
    key: 'infoType',
    header: 'Information Type',
    sortable: true,
    render: (value: unknown) => (
      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
        {String(value) || '-'}
      </span>
    ),
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
    key: 'infoTo',
    header: 'To',
    sortable: true,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (value: unknown) => <StatusBadge status={String(value)} />,
  },
];

export default function ITINFODatabaseView() {
  const { data: currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<ITIndexTab>('all');
  const userEmail = normalizeEmail(currentUser?.userPrincipalName || currentUser?.email);

  const [selectedRecord, setSelectedRecord] = useState<ITINFORecord | null>(null);

  const { data: mainRecords = [], isLoading: mainLoading } = useMainDBITList({
    filter: "formcode eq 'ITINFO'",
    orderBy: ['submitteddate desc'],
  });
  const { data: extDocs = [], isLoading: extDocsLoading } = useMainDBITExtDocsList({
    filter: "parentFormCode eq 'ITINFO'",
  });

  const isLoading = mainLoading || extDocsLoading;

  const itinfoData: ITINFORecord[] = useMemo(() => {
    if (mainRecords.length === 0) return [];

    const docsByParentId = new Map<string, MainDBITExtDocs>();
    const docsByParentTitle = new Map<string, MainDBITExtDocs>();
    extDocs.forEach((doc: MainDBITExtDocs) => {
      if (doc.parentRecord?.id !== undefined && doc.parentRecord?.id !== null) {
        docsByParentId.set(String(doc.parentRecord.id), doc);
      }
      if (doc.parentRecord?.title) {
        docsByParentTitle.set(doc.parentRecord.title, doc);
      }
    });

    return mainRecords.map((main: MainDBIT) => {
      const parsed = parseRemarks(main.remarks);
      const extDoc = docsByParentId.get(String(main.id)) ?? docsByParentTitle.get(main.title || '');
      const remarksText = typeof main.remarks === 'string' ? main.remarks : '';
      const status = mapStatusToLabel(main.currentStatus);

      return {
        id: String(main.id),
        recordNo: main.title || `ITINFO-${main.id}`,
        dateCreated: main.submitteddate ? new Date(main.submitteddate) : null,
        createdByEmail: main.requestoremail || '',
        infoTo: String(parsed.INFO_To || ''),
        infoType: extDoc?.iTIInfoType || String(parsed.INFO_InfoType || ''),
        subject: extDoc?.iTISubject || String(parsed.INFO_Subject || ''),
        isgRemarks: extDoc?.iTIRemarks || String(parsed.INFO_ISGRemarks || remarksText || ''),
        resend: String(parsed.INFO_Resend || ''),
        status,
        mainRecord: main,
        extDoc,
      };
    });
  }, [mainRecords, extDocs]);

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
        title: 'Information Details',
        fields: [
          { label: 'To (Recipient)', value: selectedRecord.infoTo || '-' },
          { label: 'Information Type', value: selectedRecord.infoType || '-', type: 'badge' },
          { label: 'Subject', value: selectedRecord.subject || '-', fullWidth: true },
          { label: 'ISG Remarks', value: selectedRecord.isgRemarks || '-', fullWidth: true },
          { label: 'Resend To', value: selectedRecord.resend || '-' },
        ],
      },
    ];
  }, [selectedRecord]);


  const filteredData = useMemo(() => {
    if (activeTab === 'all') return itinfoData;
    return itinfoData.filter((r) => {
      const main = r.mainRecord;
      if (!main) return false;
      return activeTab === 'mine' ? isMySubmission(main, userEmail) : isMyAction(main, userEmail);
    });
  }, [itinfoData, activeTab, userEmail]);

  const mySubmissionsCount = useMemo(
    () => itinfoData.filter((r) => r.mainRecord && isMySubmission(r.mainRecord, userEmail)).length,
    [itinfoData, userEmail]
  );
  const myActionsCount = useMemo(
    () => itinfoData.filter((r) => r.mainRecord && isMyAction(r.mainRecord, userEmail)).length,
    [itinfoData, userEmail]
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
              <h1 className="text-xl font-bold text-white">IT Information (ITINFO)</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm">
                Database View — All IT Information from SharePoint
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
              View all IT information records
            </p>
            <Link to="/it/forms/itinfo/new">
              <Button style={{ backgroundColor: '#003366' }}>
                <Plus className="h-4 w-4 mr-2" />
                New Information
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
                <p className="text-muted-foreground">Loading ITINFO records from SharePoint...</p>
              </div>
            ) : itinfoData.length === 0 ? (
              <Empty className="py-12">
                <EmptyHeader>
                  <EmptyTitle>No IT information records found</EmptyTitle>
                  <EmptyDescription>
                    There are no IT Information submissions in the SharePoint list yet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
          <ITFormIndexTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            mySubmissionsCount={mySubmissionsCount}
            myActionsCount={myActionsCount}
            totalCount={itinfoData.length}
          />
              <DatabaseTable
                data={filteredData}
                columns={columns}
                onRowClick={(row: ITINFORecord) => setSelectedRecord(row)}
                searchPlaceholder="Search by subject, type, recipient..."
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
        title={`IT Information — ${selectedRecord?.recordNo || ''}`}
        subtitle={`${selectedRecord?.infoType || 'N/A'} · ${selectedRecord?.subject || ''}`}
        status={selectedRecord?.status}
        fieldGroups={fieldGroups}
      />
    </div>
  );
}
