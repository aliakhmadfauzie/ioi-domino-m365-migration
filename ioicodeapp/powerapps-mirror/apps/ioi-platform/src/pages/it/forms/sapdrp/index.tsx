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

interface SAPDRPRecord {
  id: string;
  recordNo: string;
  dateCreated: Date | null;
  createdByEmail: string;
  title: string;
  category: string;
  effectDate: string;
  revision: string;
  dept: string;
  team: string;
  selection1: string;
  appBy: string;
  status: string;
  mainRecord?: MainDBIT;
}

function mapStatusToLabel(status?: string): string {
  if (!status) return 'Draft';
  return MainDBITCurrentstatusKeyToLabel[status] || 'Draft';
}

const columns: ColumnDef<SAPDRPRecord>[] = [
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
    key: 'effectDate',
    header: 'Effective Date',
    sortable: true,
    width: '120px',
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
    key: 'title',
    header: 'Title',
    sortable: true,
    render: (value: unknown) => {
      const str = String(value || '');
      return str.length > 55 ? str.slice(0, 55) + '...' : str || '-';
    },
  },
  {
    key: 'category',
    header: 'Category',
    sortable: true,
  },
  {
    key: 'dept',
    header: 'Dept',
    sortable: true,
  },
  {
    key: 'selection1',
    header: 'Status',
    sortable: true,
    render: (value: unknown) => (
      <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
        {String(value) || '-'}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Workflow',
    sortable: true,
    render: (value: unknown) => <StatusBadge status={String(value)} />,
  },
];

export default function SAPDRPDatabaseView() {
  const [selectedRecord, setSelectedRecord] = useState<SAPDRPRecord | null>(null);

  const { data: mainRecords = [], isLoading } = useMainDBITList({
    filter: "formcode eq 'SAPDRP'",
    orderBy: ['submitteddate desc'],
  });

  const sapdrpData: SAPDRPRecord[] = useMemo(() => {
    if (mainRecords.length === 0) return [];

    return mainRecords.map((main: MainDBIT) => {
      const parsed = parseRemarks(main.remarks);
      const status = mapStatusToLabel(main.currentStatus);

      return {
        id: String(main.id),
        recordNo: main.title || `SAPDRP-${main.id}`,
        dateCreated: main.submitteddate ? new Date(main.submitteddate) : null,
        createdByEmail: main.requestoremail || '',
        title: String(parsed.HDR_Title || ''),
        category: String(parsed.HDR_Category || ''),
        effectDate: String(parsed.HDR_EffectDate || ''),
        revision: String(parsed.HDR_Revision || ''),
        dept: String(parsed.HDR_Dept || ''),
        team: String(parsed.HDR_Team || ''),
        selection1: String(parsed.HDR_Selection1 || ''),
        appBy: String(parsed.HDR_AppBy || ''),
        status,
        mainRecord: main,
      };
    });
  }, [mainRecords]);

  const fieldGroups: FieldGroup[] = useMemo(() => {
    if (!selectedRecord) return [];
    const parsed = selectedRecord.mainRecord ? parseRemarks(selectedRecord.mainRecord.remarks) : {};
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
        title: 'Document Header',
        fields: [
          { label: 'Title', value: selectedRecord.title || '-', fullWidth: true },
          { label: 'Category', value: selectedRecord.category || '-' },
          { label: 'Effective Date', value: selectedRecord.effectDate || '-' },
          { label: 'Revision', value: selectedRecord.revision || '-' },
          { label: 'Department', value: selectedRecord.dept || '-' },
          { label: 'Team', value: selectedRecord.team || '-' },
          { label: 'Selection/Status', value: selectedRecord.selection1 || '-', type: 'badge' },
          { label: 'Approved By', value: selectedRecord.appBy || '-' },
          { label: 'Distributed Date', value: String(parsed.HDR_Distributed || '-') },
        ],
      },
      {
        title: 'Document Body',
        fields: [
          { label: 'Body', value: String(parsed.BODY_Body || '-'), fullWidth: true },
          { label: 'Comments', value: String(parsed.BODY_Comments || '-'), fullWidth: true },
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
              <h1 className="text-xl font-bold text-white">SAP DRP Procedure (SAPDRP)</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm">
                Database View — All SAP DRP Records from SharePoint
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
              View all SAP DRP procedure records
            </p>
            <Link to="/it/forms/sapdrp/new">
              <Button style={{ backgroundColor: '#003366' }}>
                <Plus className="h-4 w-4 mr-2" />
                New SAP DRP
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
                <p className="text-muted-foreground">Loading SAPDRP records from SharePoint...</p>
              </div>
            ) : sapdrpData.length === 0 ? (
              <Empty className="py-12">
                <EmptyHeader>
                  <EmptyTitle>No SAP DRP records found</EmptyTitle>
                  <EmptyDescription>
                    There are no SAP DRP Procedure submissions in the SharePoint list yet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <DatabaseTable
                data={sapdrpData}
                columns={columns}
                onRowClick={(row: SAPDRPRecord) => setSelectedRecord(row)}
                searchPlaceholder="Search by title, category, dept..."
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
        title={`SAPDRP — ${selectedRecord?.recordNo || ''}`}
        subtitle={`${selectedRecord?.category || 'N/A'} · ${selectedRecord?.title || ''}`}
        status={selectedRecord?.status}
        fieldGroups={fieldGroups}
      />
    </div>
  );
}
