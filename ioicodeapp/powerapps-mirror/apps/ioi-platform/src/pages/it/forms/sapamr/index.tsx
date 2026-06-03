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
import { useMainDBITExtSAPList } from '@/generated/hooks/use-main-dbitext-sap';
import { MainDBITCurrentstatusKeyToLabel, type MainDBIT } from '@/generated/models/main-dbit-model';
import type { MainDBITExtSAP } from '@/generated/models/main-dbit-ext-sap-model';
import { parseRemarks } from '@/lib/parse-remarks';
import { useUser } from '@/hooks/use-user';
import { normalizeEmail } from '@/lib/it-current-action-access';
import { isMySubmission, isMyAction, type ITIndexTab } from '@/lib/it-index-tabs';
import { ITFormIndexTabs } from '@/components/it/it-form-index-tabs';

interface SAPAMRRecord {
  id: string;
  recordNo: string;
  dateCreated: Date | null;
  createdByEmail: string;
  module: string;
  plant: string;
  authType: string;
  tbv: string;
  tba: string;
  preparedBy: string;
  status: string;
  mainRecord?: MainDBIT;
}

function mapStatusToLabel(status?: string): string {
  if (!status) return 'Draft';
  return MainDBITCurrentstatusKeyToLabel[status] || 'Draft';
}

const columns: ColumnDef<SAPAMRRecord>[] = [
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
    key: 'module',
    header: 'Module',
    sortable: true,
    width: '120px',
  },
  {
    key: 'plant',
    header: 'Plant',
    sortable: true,
  },
  {
    key: 'authType',
    header: 'Auth Type',
    sortable: true,
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

export default function SAPAMRDatabaseView() {
  const { data: currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<ITIndexTab>('all');
  const userEmail = normalizeEmail(currentUser?.userPrincipalName || currentUser?.email);

  const [selectedRecord, setSelectedRecord] = useState<SAPAMRRecord | null>(null);

  const { data: mainRecords = [], isLoading: mainLoading } = useMainDBITList({
    filter: "formcode eq 'SAPAMR'",
    orderBy: ['submitteddate desc'],
  });

  const { data: extRecords = [], isLoading: extLoading } = useMainDBITExtSAPList({
    filter: "parentFormCode eq 'SAPAMR'",
  });

  const isLoading = mainLoading || extLoading;

  // Build a lookup from parent ID → ExtSAP child
  const extByParentId = useMemo(() => {
    const map = new Map<string, MainDBITExtSAP>();
    extRecords.forEach((ext: MainDBITExtSAP) => {
      const parentId = ext.parentRecord?.id;
      if (parentId) map.set(String(parentId), ext);
    });
    return map;
  }, [extRecords]);

  const sapamrData: SAPAMRRecord[] = useMemo(() => {
    if (mainRecords.length === 0) return [];

    return mainRecords.map((main: MainDBIT) => {
      const parsed = parseRemarks(main.remarks);
      const status = mapStatusToLabel(main.currentStatus);
      const ext = extByParentId.get(String(main.id));

      return {
        id: String(main.id),
        recordNo: main.title || `SAPAMR-${main.id}`,
        dateCreated: main.submitteddate ? new Date(main.submitteddate) : null,
        createdByEmail: main.requestoremail || '',
        module: String(parsed.INIT_Module || ''),
        plant: String(parsed.INIT_Plant || ''),
        authType: String(parsed.INIT_AuthType || ''),
        // Prefer ExtSAP child data; fall back to parsed remarks
        tbv: ext?.sAPAMRTBVEmail || String(parsed.INIT_TBV || ''),
        tba: ext?.sAPAMRTBAEmail || String(parsed.INIT_TBA || ''),
        preparedBy: String(parsed.PREP_PreparedBy || ''),
        status,
        mainRecord: main,
      };
    });
  }, [mainRecords, extByParentId]);

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
        title: 'Authorization Details',
        fields: [
          { label: 'Module', value: selectedRecord.module || '-', type: 'badge' },
          { label: 'Plant', value: selectedRecord.plant || '-' },
          { label: 'Authorization Type', value: selectedRecord.authType || '-' },
          // TBV/TBA read from ExtSAP child (sAPAMR* fields) with remarks fallback
          { label: 'To Be Verified By', value: selectedRecord.tbv || '-', type: 'user' },
          { label: 'To Be Approved By', value: selectedRecord.tba || '-', type: 'user' },
          // FI per-slot verifiers (TBV_1–TBV_5) — from ExtSAP if available, else remarks
          ...(selectedRecord.mainRecord && extByParentId.has(selectedRecord.id)
            ? (() => {
                const ext = extByParentId.get(selectedRecord.id);
                const tbvFields: { label: string; value: string }[] = [];
                if (ext?.sAPAMRTBV1Email) tbvFields.push({ label: 'Verifier 1', value: ext.sAPAMRTBV1Email });
                if (ext?.sAPAMRTBV2Email) tbvFields.push({ label: 'Verifier 2', value: ext.sAPAMRTBV2Email });
                if (ext?.sAPAMRTBV3Email) tbvFields.push({ label: 'Verifier 3', value: ext.sAPAMRTBV3Email });
                if (ext?.sAPAMRTBV4Email) tbvFields.push({ label: 'Verifier 4', value: ext.sAPAMRTBV4Email });
                if (ext?.sAPAMRTBV5Email) tbvFields.push({ label: 'Verifier 5', value: ext.sAPAMRTBV5Email });
                return tbvFields;
              })()
            : (parsed.INIT_TBV1 || parsed.INIT_TBV2 || parsed.INIT_TBV3 || parsed.INIT_TBV4 || parsed.INIT_TBV5
              ? [
                  { label: 'Verifier 1', value: String(parsed.INIT_TBV1 || '-') },
                  { label: 'Verifier 2', value: String(parsed.INIT_TBV2 || '-') },
                  { label: 'Verifier 3', value: String(parsed.INIT_TBV3 || '-') },
                  { label: 'Verifier 4', value: String(parsed.INIT_TBV4 || '-') },
                  { label: 'Verifier 5', value: String(parsed.INIT_TBV5 || '-') },
                ] as { label: string; value: string }[]
              : [])),
          { label: 'CC Emails', value: String(parsed.INIT_CC || '-') },
          { label: 'Remarks', value: String(parsed.INIT_Remarks || '-'), fullWidth: true },
        ],
      },
      {
        title: 'Prepared By',
        fields: [
          { label: 'Prepared By', value: selectedRecord.preparedBy || '-' },
          { label: 'Prepared Date', value: String(parsed.PREP_PreparedDate || '-') },
          { label: 'Comment', value: String(parsed.PREP_Comment || '-'), fullWidth: true },
        ],
      },
    ];
  }, [selectedRecord, extByParentId]);


  const filteredData = useMemo(() => {
    if (activeTab === 'all') return sapamrData;
    return sapamrData.filter((r) => {
      const main = r.mainRecord;
      if (!main) return false;
      return activeTab === 'mine' ? isMySubmission(main, userEmail) : isMyAction(main, userEmail);
    });
  }, [sapamrData, activeTab, userEmail]);

  const mySubmissionsCount = useMemo(
    () => sapamrData.filter((r) => r.mainRecord && isMySubmission(r.mainRecord, userEmail)).length,
    [sapamrData, userEmail]
  );
  const myActionsCount = useMemo(
    () => sapamrData.filter((r) => r.mainRecord && isMyAction(r.mainRecord, userEmail)).length,
    [sapamrData, userEmail]
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
              <h1 className="text-xl font-bold text-white">SAP Authorization Master Record (SAPAMR)</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm">
                Database View — All SAP AMR Records from SharePoint
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
              View all SAP authorization master records
            </p>
            <Link to="/it/forms/sapamr/new">
              <Button style={{ backgroundColor: '#003366' }}>
                <Plus className="h-4 w-4 mr-2" />
                New SAP AMR
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
                <p className="text-muted-foreground">Loading SAPAMR records from SharePoint...</p>
              </div>
            ) : sapamrData.length === 0 ? (
              <Empty className="py-12">
                <EmptyHeader>
                  <EmptyTitle>No SAP AMR records found</EmptyTitle>
                  <EmptyDescription>
                    There are no SAP Authorization Master Record submissions in the SharePoint list yet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
          <ITFormIndexTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            mySubmissionsCount={mySubmissionsCount}
            myActionsCount={myActionsCount}
            totalCount={sapamrData.length}
          />
              <DatabaseTable
                data={filteredData}
                columns={columns}
                onRowClick={(row: SAPAMRRecord) => setSelectedRecord(row)}
                searchPlaceholder="Search by module, plant, auth type..."
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
        title={`SAP Authorization Master Record — ${selectedRecord?.recordNo || ''}`}
        subtitle={`Module: ${selectedRecord?.module || 'N/A'} · Plant: ${selectedRecord?.plant || 'N/A'}`}
        status={selectedRecord?.status}
        fieldGroups={fieldGroups}
      />
    </div>
  );
}
