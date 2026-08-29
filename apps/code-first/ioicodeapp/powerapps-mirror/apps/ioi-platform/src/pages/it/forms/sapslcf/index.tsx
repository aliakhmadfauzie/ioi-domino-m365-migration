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

interface SAPSLCFRecord {
  id: string;
  recordNo: string;
  dateCreated: Date | null;
  createdByEmail: string;
  reqBy: string;
  designation: string;
  dept: string;
  plantCode: string;
  storageLocCode: string;
  storageLocDesc: string;
  status: string;
  mainRecord?: MainDBIT;
}

function mapStatusToLabel(status?: string): string {
  if (!status) return 'Draft';
  return MainDBITCurrentstatusKeyToLabel[status] || 'Draft';
}

const columns: ColumnDef<SAPSLCFRecord>[] = [
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
    key: 'plantCode',
    header: 'Plant',
    sortable: true,
    width: '120px',
  },
  {
    key: 'storageLocCode',
    header: 'Loc Code',
    sortable: true,
    width: '100px',
  },
  {
    key: 'storageLocDesc',
    header: 'Description',
    sortable: true,
  },
  {
    key: 'reqBy',
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

export default function SAPSLCFDatabaseView() {
  const { data: currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<ITIndexTab>('all');
  const userEmail = normalizeEmail(currentUser?.userPrincipalName || currentUser?.email);

  const [selectedRecord, setSelectedRecord] = useState<SAPSLCFRecord | null>(null);

  const { data: mainRecords = [], isLoading } = useMainDBITList({
    filter: "formcode eq 'SAPSLCF'",
    orderBy: ['submitteddate desc'],
  });

  const sapslcfData: SAPSLCFRecord[] = useMemo(() => {
    if (mainRecords.length === 0) return [];

    return mainRecords.map((main: MainDBIT) => {
      const parsed = parseRemarks(main.remarks);
      const status = mapStatusToLabel(main.currentStatus);

      return {
        id: String(main.id),
        recordNo: main.title || `SAPSLCF-${main.id}`,
        dateCreated: main.submitteddate ? new Date(main.submitteddate) : null,
        createdByEmail: main.requestoremail || '',
        reqBy: String(parsed.REQ_By || ''),
        designation: String(parsed.REQ_Designation || ''),
        dept: String(parsed.REQ_Dept || ''),
        plantCode: String(parsed.REQ_PlantCode || ''),
        storageLocCode: String(parsed.REQ_StorageLocCode || ''),
        storageLocDesc: String(parsed.REQ_StorageLocDesc || ''),
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
          { label: 'Request No', value: selectedRecord.recordNo },
          { label: 'Date Created', value: selectedRecord.dateCreated, type: 'date' },
          { label: 'Submitted By', value: selectedRecord.createdByEmail, type: 'user' },
        ],
      },
      {
        title: 'Requestor Details',
        fields: [
          { label: 'Requested By', value: selectedRecord.reqBy || '-' },
          { label: 'Desk Of', value: String(parsed.REQ_DeskOf || '-') },
          { label: 'Designation', value: selectedRecord.designation || '-' },
          { label: 'Department', value: selectedRecord.dept || '-' },
          { label: 'Phone No', value: String(parsed.REQ_PhoneNo || '-') },
          { label: 'Head of Department', value: String(parsed.REQ_HOD || '-') },
        ],
      },
      {
        title: 'Storage Location Details',
        fields: [
          { label: 'Plant Code', value: selectedRecord.plantCode || '-' },
          { label: 'Storage Location Code', value: selectedRecord.storageLocCode || '-' },
          { label: 'Storage Location Description', value: selectedRecord.storageLocDesc || '-', fullWidth: true },
          { label: 'Material Extend To', value: String(parsed.REQ_MatExtend || '-') },
          { label: 'Tank for Ullage', value: String(parsed.REQ_Ullage || '-') },
          { label: 'Remarks', value: String(parsed.REQ_Remarks || '-'), fullWidth: true },
        ],
      },
    ];
  }, [selectedRecord]);


  const filteredData = useMemo(() => {
    if (activeTab === 'all') return sapslcfData;
    return sapslcfData.filter((r) => {
      const main = r.mainRecord;
      if (!main) return false;
      return activeTab === 'mine' ? isMySubmission(main, userEmail) : isMyAction(main, userEmail);
    });
  }, [sapslcfData, activeTab, userEmail]);

  const mySubmissionsCount = useMemo(
    () => sapslcfData.filter((r) => r.mainRecord && isMySubmission(r.mainRecord, userEmail)).length,
    [sapslcfData, userEmail]
  );
  const myActionsCount = useMemo(
    () => sapslcfData.filter((r) => r.mainRecord && isMyAction(r.mainRecord, userEmail)).length,
    [sapslcfData, userEmail]
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
              <h1 className="text-xl font-bold text-white">SAP Storage Location Creation (SAPSLCF)</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm">
                Database View — All Storage Location Requests from SharePoint
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
              View all storage location creation requests
            </p>
            <Link to="/it/forms/sapslcf/new">
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
                <p className="text-muted-foreground">Loading SAPSLCF records from SharePoint...</p>
              </div>
            ) : sapslcfData.length === 0 ? (
              <Empty className="py-12">
                <EmptyHeader>
                  <EmptyTitle>No storage location requests found</EmptyTitle>
                  <EmptyDescription>
                    There are no SAP Storage Location Creation submissions in the SharePoint list yet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
          <ITFormIndexTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            mySubmissionsCount={mySubmissionsCount}
            myActionsCount={myActionsCount}
            totalCount={sapslcfData.length}
          />
              <DatabaseTable
                data={filteredData}
                columns={columns}
                onRowClick={(row: SAPSLCFRecord) => setSelectedRecord(row)}
                searchPlaceholder="Search by plant, location code, requestor..."
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
        title={`SAP Storage Location Creation — ${selectedRecord?.recordNo || ''}`}
        subtitle={`Plant: ${selectedRecord?.plantCode || 'N/A'} · Loc: ${selectedRecord?.storageLocCode || 'N/A'}`}
        status={selectedRecord?.status}
        fieldGroups={fieldGroups}
      />
    </div>
  );
}
