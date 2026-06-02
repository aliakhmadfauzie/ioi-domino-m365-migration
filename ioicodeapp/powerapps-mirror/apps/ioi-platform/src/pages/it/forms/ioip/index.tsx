/**
 * IOIP — IOI Policy Database View
 *
 * Displays policies filtered by FinalStatus lifecycle:
 *   Draft (0) → Pending Approval (1) → Distributed (4) → Archived (6)
 */

import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Search, FileText, BookOpen, Clock, CheckCircle2, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { useMainDBITExtPolicyList } from '@/generated/hooks/use-main-dbitext-policy';
import { PageLoading } from '@/components/page-loading';
import {
  MainDBITCurrentstatusKeyToLabel,
  type MainDBIT,
  type MainDBITCurrentstatusKey,
} from '@/generated/models/main-dbit-model';
import type { MainDBITExtPolicy } from '@/generated/models/main-dbit-ext-policy-model';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { statusConfig } from '@/lib/status-utils';
import { getITFormDetailPath } from '@/lib/it-form-routes';

// =============================================================================
// Status tabs matching Domino FinalStatus values
// =============================================================================

const STATUS_TABS = [
  { value: 'all', label: 'All Policies' },
  { value: '0', label: 'Draft' },
  { value: '1', label: 'Pending Approval' },
  { value: '4', label: 'Distributed' },
  { value: '6', label: 'Archived' },
];

const STATUS_LABELS: Record<string, string> = {
  '0': 'Draft',
  '1': 'Pending Approval',
  '4': 'Distributed',
  '6': 'Archived',
};

const STATUS_COLORS: Record<string, string> = {
  '0': '#6B7280',
  '1': '#F59E0B',
  '4': '#059669',
  '6': '#6366F1',
};

const STATUS_BG: Record<string, string> = {
  '0': '#F3F4F6',
  '1': '#FEF3C7',
  '4': '#D1FAE5',
  '6': '#EEF2FF',
};

// =============================================================================
// Component
// =============================================================================

export default function IOIPDatabaseView() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch MainDB_IT records filtered by IOIP formcode
  const { data: mainRecords = [], isLoading: mainLoading } = useMainDBITList({
    filter: "formcode eq 'IOIP'",
    orderBy: ['submitteddate desc'],
  });

  // Fetch extension records
  const { data: extRecords = [], isLoading: extLoading } = useMainDBITExtPolicyList({
    filter: "parentFormCode eq 'IOIP'",
  });

  const isLoading = mainLoading || extLoading;

  // Build IOIP records combining parent + ext data
  const ioipRecords = useMemo(() => {
    if (mainRecords.length === 0) return [];

    const extMap = new Map<number, MainDBITExtPolicy>();
    extRecords.forEach((ext: MainDBITExtPolicy) => {
      if (ext.parentRecord?.id) {
        extMap.set(ext.parentRecord.id, ext);
      }
    });

    return mainRecords.map((main: MainDBIT) => {
      const ext = extMap.get(main.id);
      const finalStatus = ext?.iOIPFinalStatus || '0';

      return {
        id: String(main.id),
        title: main.title || `IOIP-${main.id}`,
        policyNo: ext?.iOIPPolicyNo || '',
        subject: ext?.iOIPSubject || '',
        revision: ext?.iOIPReviNum || '',
        effectiveDate: ext?.iOIPDateIssue || '',
        finalStatus,
        statusLabel: STATUS_LABELS[finalStatus] || 'Draft',
        submittedDate: main.submitteddate ? new Date(main.submitteddate) : null,
        submittedBy: main.requestorName || main.requestoremail || '',
        approver1: ext?.iOIPApp1_1 || '',
        approver2: ext?.iOIPApp2_1 || '',
        approver3: ext?.iOIPApp3_1 || '',
        mainRecord: main,
        extRecord: ext,
      };
    });
  }, [mainRecords, extRecords]);

  // Filter by status tab
  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return ioipRecords.filter((r) => {
      // Tab filter
      if (activeTab !== 'all' && r.finalStatus !== activeTab) return false;
      // Search filter
      if (q) {
        return (
          r.policyNo.toLowerCase().includes(q) ||
          r.subject.toLowerCase().includes(q) ||
          r.revision.toLowerCase().includes(q) ||
          r.submittedBy.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [ioipRecords, activeTab, searchTerm]);

  if (isLoading) return <PageLoading message="Loading IOI Policy records..." />;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Header */}
      <header className="h-16 px-6 flex items-center justify-between" style={{ backgroundColor: '#059669' }}>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">IOI Policy</h1>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Company policy management — Draft → Approval → Distribution → Archive
            </p>
          </div>
        </div>
        <Link to="/it/forms/ioip/new">
          <Button className="bg-white text-[#059669] hover:bg-white/90">
            <Plus className="h-4 w-4 mr-2" />
            New Policy
          </Button>
        </Link>
      </header>

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Status Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-4 gap-3"
        >
          {['0', '1', '4', '6'].map((status) => {
            const count = ioipRecords.filter((r) => r.finalStatus === status).length;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setActiveTab(status)}
                className={`rounded-xl p-4 text-left border transition-all hover:shadow-md ${
                  activeTab === status ? 'ring-2 ring-offset-1' : ''
                }`}
                style={{
                  backgroundColor: STATUS_BG[status],
                  borderColor: activeTab === status ? STATUS_COLORS[status] : 'transparent',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  {status === '0' && <FileText className="h-4 w-4" style={{ color: STATUS_COLORS[status] }} />}
                  {status === '1' && <Clock className="h-4 w-4" style={{ color: STATUS_COLORS[status] }} />}
                  {status === '4' && <CheckCircle2 className="h-4 w-4" style={{ color: STATUS_COLORS[status] }} />}
                  {status === '6' && <Archive className="h-4 w-4" style={{ color: STATUS_COLORS[status] }} />}
                  <span className="text-xs font-semibold" style={{ color: STATUS_COLORS[status] }}>
                    {STATUS_LABELS[status]}
                  </span>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#1C1C1C' }}>{count}</p>
              </button>
            );
          })}
        </motion.div>

        {/* Search & List */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="border-[#D0D0D0]">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-lg">
                  {activeTab === 'all'
                    ? `All Policies (${filtered.length})`
                    : `${STATUS_LABELS[activeTab] || 'Policies'} (${filtered.length})`}
                </CardTitle>
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by policy no, subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-white h-9 text-sm"
                  />
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
                <TabsList className="h-9">
                  {STATUS_TABS.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value} className="text-xs h-7 px-3">
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="pt-0">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p>No policies found.</p>
                  <Link to="/it/forms/ioip/new">
                    <Button variant="link" className="mt-2">Create first policy</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map((record) => {
                    const statusColor = STATUS_COLORS[record.finalStatus] || '#6B7280';
                    const statusBg = STATUS_BG[record.finalStatus] || '#F3F4F6';
                    return (
                      <Link
                        key={record.id}
                        to={getITFormDetailPath('IOIP', record.id)}
                        className="flex items-center gap-4 p-3 rounded-lg bg-card hover:bg-muted transition-standard border border-transparent hover:border-border"
                      >
                        <div
                          className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${statusColor}15` }}
                        >
                          <BookOpen className="h-5 w-5" style={{ color: statusColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{record.policyNo || record.title}</span>
                            <Badge
                              variant="outline"
                              className="text-xs font-mono shrink-0"
                              style={{
                                color: statusColor,
                                borderColor: statusColor,
                                backgroundColor: statusBg,
                              }}
                            >
                              {record.statusLabel}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs mt-1" style={{ color: '#5C5C5C' }}>
                            <span className="font-medium">{record.subject || 'Untitled'}</span>
                            {record.revision && <><span>•</span><span>Rev {record.revision}</span></>}
                            {record.submittedDate && (
                              <><span>•</span><span>{formatDistanceToNow(record.submittedDate, { addSuffix: true })}</span></>
                            )}
                          </div>
                        </div>
                        <Badge
                          className="shrink-0"
                          style={{
                            backgroundColor: statusBg,
                            color: statusColor,
                            borderColor: statusColor,
                          }}
                          variant="outline"
                        >
                          {record.statusLabel}
                        </Badge>
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
