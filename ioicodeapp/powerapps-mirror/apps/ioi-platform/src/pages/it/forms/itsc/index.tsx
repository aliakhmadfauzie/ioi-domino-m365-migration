/**
 * ITSC - IT Service Continuity Checklist Database View
 */

import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Search, Server, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { useMainDBITExtAssetsList } from '@/generated/hooks/use-main-dbitext-assets';
import { PageLoading } from '@/components/page-loading';
import {
  MainDBITCurrentstatusKeyToLabel,
  type MainDBIT,
  type MainDBITCurrentstatusKey,
} from '@/generated/models/main-dbit-model';
import type { MainDBITExtAssets } from '@/generated/models/main-dbit-ext-assets-model';
import { format } from 'date-fns';
import { statusConfig } from '@/lib/status-utils';

type ITSCRemarks = Record<string, string | undefined>;

interface ITSCRecordRow {
  record: MainDBIT;
  asset?: MainDBITExtAssets;
  remarks: ITSCRemarks;
}

function parseITSCRemarks(value?: string | null): ITSCRemarks {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export default function ITSCDatabaseView() {
  const navigate = useNavigate();
  const { data: allRecords = [], isLoading } = useMainDBITList({
    filter: "formcode eq 'ITSC'",
    orderBy: ['submitteddate desc'],
  });
  const { data: extAssets = [], isLoading: extLoading } = useMainDBITExtAssetsList({
    filter: "parentFormCode eq 'ITSC'",
  });
  const [searchTerm, setSearchTerm] = useState('');

  const records = useMemo<ITSCRecordRow[]>(() => {
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

    return (allRecords as MainDBIT[]).map((record) => ({
      record,
      asset: assetsByParentId.get(String(record.id)) || assetsByParentTitle.get(record.title || ''),
      remarks: parseITSCRemarks(record.remarks),
    }));
  }, [allRecords, extAssets]);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    if (!q) return records;
    return records.filter(({ record, asset, remarks }) => {
      const searchable = [
        record.title,
        record.requestorName,
        record.requestoremail,
        record.remarks,
        asset?.iTSCServerName,
        asset?.iTSCReviewedBy,
        asset?.iTSCReviewedDate,
        asset?.iTSCCPUUsage,
        asset?.iTSCMemoryUsed,
        asset?.iTSCRemarks,
        remarks.HDR_Server,
        remarks.HDR_SvrName,
        remarks.PER_CreatedBy,
      ].join(' ');
      return searchable.toLowerCase().includes(q);
    });
  }, [records, searchTerm]);

  if (isLoading || extLoading) return <PageLoading message="Loading ITSC records..." />;

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <header className="h-16 bg-[#003366] px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">IT Service Continuity Checklist</h1>
        </div>
        <Link to="/it/forms/itsc/new">
          <Button className="bg-white text-[#003366] hover:bg-white/90">
            <Plus className="h-4 w-4 mr-2" />
            New Checklist
          </Button>
        </Link>
      </header>

      <div className="p-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] as const }}
          className="space-y-4"
        >
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search records..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>

          <Card className="border-[#D0D0D0]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">All ITSC Records ({filtered.length})</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <Server className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p>No ITSC records found.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map(({ record, asset, remarks }) => {
                    const statusLabel = MainDBITCurrentstatusKeyToLabel[record.currentStatus as MainDBITCurrentstatusKey] || record.currentStatus;
                    const statusCfg = statusConfig[record.currentStatus as MainDBITCurrentstatusKey];
                    const serverName = asset?.iTSCServerName || remarks.HDR_SvrName || remarks.HDR_Server;
                    const reviewedBy = asset?.iTSCReviewedBy || remarks.PER_CreatedBy || record.requestorName || record.requestoremail || 'Unknown';
                    return (
                      <Link
                        key={record.id}
                        to={`/it/forms/itsc/${record.id}`}
                        className="flex items-center gap-4 p-3 rounded-lg bg-card hover:bg-muted transition-standard border border-transparent hover:border-border"
                      >
                        <div className="h-10 w-10 rounded-full bg-[#003366]/10 flex items-center justify-center shrink-0">
                          <Server className="h-5 w-5 text-[#003366]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">{record.title}</span>
                            <Badge className={`${statusCfg?.bgColor || 'bg-muted'} ${statusCfg?.color || 'text-muted-foreground'} border-0 text-xs`}>
                              {statusLabel}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {serverName ? `${serverName} • ` : ''}
                            {reviewedBy}
                            {record.submitteddate && ` • ${format(new Date(record.submitteddate), 'dd MMM yyyy')}`}
                          </p>
                        </div>
                        <Eye className="h-4 w-4 text-muted-foreground shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
