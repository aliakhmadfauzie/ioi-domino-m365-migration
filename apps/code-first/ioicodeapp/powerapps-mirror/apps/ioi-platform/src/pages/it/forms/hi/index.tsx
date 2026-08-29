import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatabaseTable, StatusBadge } from '@/components/database-view';
import type { ColumnDef } from '@/components/database-view';
import { DetailModal } from '@/components/database-view';
import type { FieldGroup } from '@/components/database-view';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { useMainDBITExtAssetsList } from '@/generated/hooks/use-main-dbitext-assets';
import { MainDBITCurrentstatusKeyToLabel, type MainDBIT } from '@/generated/models/main-dbit-model';
import type { MainDBITExtAssets } from '@/generated/models/main-dbit-ext-assets-model';
import { useUser } from '@/hooks/use-user';
import { normalizeEmail } from '@/lib/it-current-action-access';
import { isMySubmission, isMyAction, type ITIndexTab } from '@/lib/it-index-tabs';
import { ITFormIndexTabs } from '@/components/it/it-form-index-tabs';

interface HIRecord {
  id: string;
  assetTag: string;
  dateCreated: Date | null;
  createdBy: string;
  assetType: string;
  computerName: string;
  company: string;
  assignedToEmail: string;
  location: string;
  department: string;
  serialNo: string;
  purchaseDate: string;
  vendor: string;
  poNumber: string;
  warrantyExpiry: string;
  condition: string;
  specifications: string;
  purchasePrice?: number;
  status: string;
  mainRecord?: MainDBIT;
  extAsset?: MainDBITExtAssets;
  windowsVersion?: string;
  officeVersion?: string;
}

function mapStatusToLabel(status?: string): string {
  if (!status) return 'Active';
  return MainDBITCurrentstatusKeyToLabel[status] || 'Active';
}

const columns: ColumnDef<HIRecord>[] = [
  {
    key: 'assetTag',
    header: 'Asset Tag',
    sortable: true,
    width: '160px',
    render: (value: unknown) => (
      <span className="font-mono font-medium" style={{ color: '#003366' }}>
        {String(value)}
      </span>
    ),
  },
  {
    key: 'assetType',
    header: 'Type',
    sortable: true,
    render: (value: unknown) => (
      <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: '#E0E7FF', color: '#3730A3' }}>
        {String(value) || '-'}
      </span>
    ),
  },
  {
    key: 'computerName',
    header: 'Brand / Model',
    sortable: true,
  },
  {
    key: 'serialNo',
    header: 'Serial No',
    sortable: true,
  },
  {
    key: 'assignedToEmail',
    header: 'Assigned To',
    sortable: true,
    render: (value: unknown) => {
      const email = String(value || '');
      return <span>{email ? email.split('@')[0] : '-'}</span>;
    },
  },
  {
    key: 'location',
    header: 'Location',
    sortable: true,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (value: unknown) => <StatusBadge status={String(value)} />,
  },
];

export default function HIDatabaseView() {
  const { data: currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<ITIndexTab>('all');
  const userEmail = normalizeEmail(currentUser?.userPrincipalName || currentUser?.email);

  const [selectedRecord, setSelectedRecord] = useState<HIRecord | null>(null);

  const { data: mainRecords = [], isLoading } = useMainDBITList({
    filter: "formcode eq 'HI'",
    orderBy: ['submitteddate desc'],
  });
  const { data: extAssets = [], isLoading: extAssetsLoading } = useMainDBITExtAssetsList({
    filter: "parentFormCode eq 'HI'",
  });

  const hiData: HIRecord[] = useMemo(() => {
    const assetsByParentId = new Map<string, MainDBITExtAssets>();
    const assetsByParentTitle = new Map<string, MainDBITExtAssets>();

    (extAssets as MainDBITExtAssets[]).forEach((asset) => {
      if (asset.parentRecord?.id !== undefined && asset.parentRecord?.id !== null) {
        assetsByParentId.set(String(asset.parentRecord.id), asset);
      }
      if (asset.parentRecord?.title) {
        assetsByParentTitle.set(asset.parentRecord.title, asset);
      }
    });

    return (mainRecords as MainDBIT[]).map((main) => {
      const asset = assetsByParentId.get(String(main.id)) || assetsByParentTitle.get(main.title || '');
      return {
      id: String(main.id),
      assetTag: asset?.hITagNo || asset?.hIAssetNo || main.hITagNo || main.title || `HI-${main.id}`,
      dateCreated: main.submitteddate ? new Date(main.submitteddate) : null,
      createdBy: main.requestoremail?.split('@')[0] || 'Unknown',
      assetType: asset?.hIType || main.hIType || '',
      computerName: asset?.hIComputerName || main.hIComputerName || '',
      company: asset?.hICompany || main.hICompany || main.company || '',
      assignedToEmail: asset?.hIUsedByEmail || main.hIUsedByEmail || '',
      location: asset?.hILocation || main.hILocation || '',
      department: asset?.hIDepartment || main.hIDepartment || '',
      serialNo: asset?.hISerialNo || main.hISerialNo || '',
      purchaseDate: asset?.hIPurchaseDate || main.hIPurchaseDate || '',
      vendor: asset?.hIVendor || main.hIVendor || '',
      poNumber: main.hIPONumber || '',
      warrantyExpiry: main.hIWarrantyExpiry || '',
      condition: main.hICondition || '',
      specifications: main.hISpecifications || '',
      purchasePrice: main.hIPurchasePrice,
      status: asset?.hIStatus || main.hIStatus || mapStatusToLabel(main.currentStatus),
      windowsVersion: asset?.hIWindowsVersion,
      officeVersion: asset?.hIOfficeVersion,
      mainRecord: main,
      extAsset: asset,
      };
    });
  }, [mainRecords, extAssets]);

  const fieldGroups: FieldGroup[] = useMemo(() => {
    if (!selectedRecord) return [];
    return [
      {
        title: 'Asset Information',
        fields: [
          { label: 'Asset Tag', value: selectedRecord.assetTag },
          { label: 'Date Registered', value: selectedRecord.dateCreated, type: 'date' },
          { label: 'Registered By', value: selectedRecord.createdBy, type: 'user' },
          { label: 'Asset Type', value: selectedRecord.assetType || '-', type: 'badge' },
          { label: 'Status', value: selectedRecord.status, type: 'badge' },
        ],
      },
      {
        title: 'Hardware Details',
        fields: [
          { label: 'Brand / Model', value: selectedRecord.computerName || '-' },
          { label: 'Serial Number', value: selectedRecord.serialNo || '-' },
          { label: 'Vendor', value: selectedRecord.vendor || '-' },
          { label: 'PO Number', value: selectedRecord.poNumber || '-' },
          { label: 'Purchase Date', value: selectedRecord.purchaseDate || '-' },
          { label: 'Purchase Price', value: selectedRecord.purchasePrice ?? '-' },
          { label: 'Warranty Expiry', value: selectedRecord.warrantyExpiry || '-' },
          { label: 'Condition', value: selectedRecord.condition || '-' },
          { label: 'Windows Version', value: selectedRecord.windowsVersion || '-' },
          { label: 'Office Version', value: selectedRecord.officeVersion || '-' },
          { label: 'Specifications', value: selectedRecord.specifications || '-', fullWidth: true },
        ],
      },
      {
        title: 'Assignment & Location',
        fields: [
          { label: 'Assigned To', value: selectedRecord.assignedToEmail || '-', type: 'user' },
          { label: 'Company', value: selectedRecord.company || '-' },
          { label: 'Department', value: selectedRecord.department || '-' },
          { label: 'Location', value: selectedRecord.location || '-' },
        ],
      },
    ];
  }, [selectedRecord]);


  const filteredData = useMemo(() => {
    if (activeTab === 'all') return hiData;
    return hiData.filter((r) => {
      const main = r.mainRecord;
      if (!main) return false;
      return activeTab === 'mine' ? isMySubmission(main, userEmail) : isMyAction(main, userEmail);
    });
  }, [hiData, activeTab, userEmail]);

  const mySubmissionsCount = useMemo(
    () => hiData.filter((r) => r.mainRecord && isMySubmission(r.mainRecord, userEmail)).length,
    [hiData, userEmail]
  );
  const myActionsCount = useMemo(
    () => hiData.filter((r) => r.mainRecord && isMyAction(r.mainRecord, userEmail)).length,
    [hiData, userEmail]
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
              <h1 className="text-xl font-bold text-white">Hardware Inventory (HI)</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm">
                Database View — All Assets
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm" style={{ color: '#5C5C5C' }}>
              {isLoading || extAssetsLoading ? 'Loading assets...' : `${hiData.length} asset${hiData.length !== 1 ? 's' : ''} registered`}
            </p>
            <Link to="/it/forms/hi/new">
              <Button style={{ backgroundColor: '#003366' }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Asset
              </Button>
            </Link>
          </div>

          {isLoading || extAssetsLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#003366' }} />
            </div>
          ) : hiData.length === 0 ? (
            <Empty>
              <EmptyHeader />
              <EmptyTitle>No assets registered</EmptyTitle>
              <EmptyDescription>Add your first hardware asset to get started.</EmptyDescription>
            </Empty>
          ) : (
            <div className="rounded-xl p-6" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <ITFormIndexTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            mySubmissionsCount={mySubmissionsCount}
            myActionsCount={myActionsCount}
            totalCount={hiData.length}
          />
              <DatabaseTable
                data={filteredData}
                columns={columns}
                onRowClick={(row: HIRecord) => setSelectedRecord(row)}
                searchPlaceholder="Search by asset tag, type, serial number..."
              />
            </div>
          )}
        </motion.div>
      </div>

      <DetailModal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title={selectedRecord?.assetTag || ''}
        subtitle={`${selectedRecord?.assetType || ''} — ${selectedRecord?.computerName || ''}`}
        status={selectedRecord?.status}
        fieldGroups={fieldGroups}
      />
    </div>
  );
}
