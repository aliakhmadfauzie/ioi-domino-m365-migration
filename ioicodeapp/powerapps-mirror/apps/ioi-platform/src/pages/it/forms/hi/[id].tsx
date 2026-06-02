import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { useMainDBITExtAssetsList } from '@/generated/hooks/use-main-dbitext-assets';
import { MainDBITCurrentstatusKeyToLabel, type MainDBIT } from '@/generated/models/main-dbit-model';
import type { MainDBITExtAssets } from '@/generated/models/main-dbit-ext-assets-model';

function valueOrDash(value: unknown): string {
  if (value === null || value === undefined || value === '') return '-';
  return String(value);
}

function statusLabel(main?: MainDBIT, asset?: MainDBITExtAssets): string {
  return asset?.hIStatus || main?.hIStatus || MainDBITCurrentstatusKeyToLabel[main?.currentStatus || ''] || 'Active';
}

export default function HIDetailPage() {
  const { id } = useParams();

  const { data: mainRecords = [], isLoading: mainLoading } = useMainDBITList({
    filter: id ? `id eq ${id}` : undefined,
  });
  const { data: extAssets = [], isLoading: extLoading } = useMainDBITExtAssetsList({
    filter: id ? `parentRecord/ID eq ${id}` : undefined,
  });

  const main = (mainRecords as MainDBIT[]).find((record) => String(record.id) === id);
  const asset = (extAssets as MainDBITExtAssets[]).find(
    (record) => String(record.parentRecord?.id) === id || record.parentRecord?.title === main?.title
  );
  const isLoading = mainLoading || extLoading;

  const assetTag = asset?.hITagNo || asset?.hIAssetNo || main?.hITagNo || main?.title || (id ? `HI-${id}` : 'HI');

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div style={{ backgroundColor: '#003366' }} className="px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link to="/it/forms/hi">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Hardware Inventory Detail</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm">
              {assetTag}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#003366' }} />
          </div>
        ) : !main ? (
          <Empty>
            <EmptyHeader />
            <EmptyTitle>Asset not found</EmptyTitle>
            <EmptyDescription>The requested hardware inventory record could not be loaded.</EmptyDescription>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <DetailRow label="Asset Tag" value={assetTag} />
                <DetailRow label="Asset No" value={asset?.hIAssetNo || main.hIAssetNo} />
                <DetailRow label="Type" value={asset?.hIType || main.hIType} />
                <DetailRow label="Status" value={statusLabel(main, asset)} />
                <DetailRow label="Registered By" value={main.requestoremail} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hardware Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <DetailRow label="Brand / Model" value={asset?.hIComputerName || main.hIComputerName} />
                <DetailRow label="Serial No" value={asset?.hISerialNo || main.hISerialNo} />
                <DetailRow label="Windows Version" value={asset?.hIWindowsVersion || (main as unknown as Record<string, string | undefined>).hIWindowsVersion} />
                <DetailRow label="Office Version" value={asset?.hIOfficeVersion} />
                <DetailRow label="Vendor" value={asset?.hIVendor || main.hIVendor} />
                <DetailRow label="Purchase Date" value={asset?.hIPurchaseDate || main.hIPurchaseDate} />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Assignment & Location</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <DetailRow label="Company" value={asset?.hICompany || main.hICompany || main.company} />
                <DetailRow label="Department" value={asset?.hIDepartment || main.hIDepartment} />
                <DetailRow label="Used By" value={asset?.hIUsedByEmail || main.hIUsedByEmail} />
                <DetailRow label="Location" value={asset?.hILocation || main.hILocation} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="font-medium">{valueOrDash(value)}</span>
    </div>
  );
}
