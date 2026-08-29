/**
 * IT Activity Log — Consolidated Database View for IAL1-5
 *
 * Hierarchy: Dept (IT) → Module (M2: IT Support & Services) → Database (IT Activity Log) → IAL1-5 forms
 *
 * Displays records from all five IT Activity Log forms:
 *   IAL1 (SRL) — Server Reboot Log
 *   IAL2 (DCAL) — Data Center Access Log
 *   IAL3 (ITE)  — IT Event
 *   IAL4 (SVRREC) — Server Records
 *   IAL5 (DRR)  — Data Restoration Request
 */

import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Plus,
  Search,
  Server,
  Database,
  Calendar,
  HardDrive,
  RotateCcw,
  FileText,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { PageLoading } from '@/components/page-loading';
import {
  MainDBITCurrentstatusKeyToLabel,
  type MainDBIT,
  type MainDBITCurrentstatusKey,
} from '@/generated/models/main-dbit-model';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { statusConfig } from '@/lib/status-utils';
import { getITFormDetailPath } from '@/lib/it-form-routes';

// =============================================================================
// IAL Form Definitions
// =============================================================================

interface IALFormDef {
  code: string;
  name: string;
  icon: typeof Server;
  path: string;
  newPath: string;
  color: string;
  bgColor: string;
}

const IAL_FORMS: IALFormDef[] = [
  { code: 'IAL1', name: 'Server Reboot Log', icon: Server, path: '/it/forms/srl', newPath: '/it/forms/srl/new', color: '#ef4444', bgColor: '#FEF2F2' },
  { code: 'IAL2', name: 'Data Center Access Log', icon: Database, path: '/it/forms/dcal', newPath: '/it/forms/dcal/new', color: '#6366f1', bgColor: '#EEF2FF' },
  { code: 'IAL3', name: 'IT Event', icon: Calendar, path: '/it/forms/ite', newPath: '/it/forms/ite/new', color: '#14b8a6', bgColor: '#F0FDFA' },
  { code: 'IAL4', name: 'Server Records', icon: HardDrive, path: '/it/forms/srvr', newPath: '/it/forms/srvr/new', color: '#78716c', bgColor: '#FAFAF9' },
  { code: 'IAL5', name: 'Data Restoration Request', icon: RotateCcw, path: '/it/forms/drr', newPath: '/it/forms/drr/new', color: '#f97316', bgColor: '#FFF7ED' },
];

const IAL_FORM_CODES = IAL_FORMS.map((f) => f.code);
const IAL_CODE_TO_FORM = Object.fromEntries(IAL_FORMS.map((f) => [f.code, f]));

// =============================================================================
// Filters
// =============================================================================

const FILTER_OPTIONS = [
  { value: 'all', label: 'All IAL Records' },
  ...IAL_FORMS.map((f) => ({ value: f.code, label: `${f.code} — ${f.name}` })),
];

// =============================================================================
// Component
// =============================================================================

export default function ITActivityLogPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all MainDB_IT records with IAL formcodes
  const filterQuery = useMemo(() => {
    const codes = activeTab === 'all' ? IAL_FORM_CODES : [activeTab];
    return codes.map((c) => `formcode eq '${c}'`).join(' or ');
  }, [activeTab]);

  const { data: allRecords = [], isLoading } = useMainDBITList({
    filter: filterQuery,
    orderBy: ['submitteddate desc'],
  });

  // Search filtering
  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return allRecords.filter((r: MainDBIT) =>
      String(r.title || '').toLowerCase().includes(q) ||
      String(r.formcode || '').toLowerCase().includes(q) ||
      String(r.requestorName || '').toLowerCase().includes(q) ||
      String(r.requestoremail || '').toLowerCase().includes(q) ||
      String(r.remarks || '').toLowerCase().includes(q)
    );
  }, [allRecords, searchTerm]);

  // Stats per form type
  const formStats = useMemo(() => {
    const stats: Record<string, { total: number; pending: number }> = {};
    for (const form of IAL_FORMS) {
      stats[form.code] = { total: 0, pending: 0 };
    }
    for (const r of allRecords) {
      const code = r.formcode?.toUpperCase() || '';
      if (stats[code]) {
        stats[code].total++;
        const st = r.currentStatus?.toLowerCase() || '';
        if (st === 'submitted' || st === 'pending' || st === 'under review' || st === 'draft') {
          stats[code].pending++;
        }
      }
    }
    return stats;
  }, [allRecords]);

  if (isLoading) return <PageLoading message="Loading IT Activity Log records..." />;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Header */}
      <header className="h-16 px-6 flex items-center justify-between" style={{ backgroundColor: '#003366' }}>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">IT Activity Log</h1>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Consolidated database — Server Reboot, Data Center Access, IT Events, Server Records, Data Restoration
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activeTab !== 'all' && IAL_CODE_TO_FORM[activeTab] && (
            <Link to={IAL_CODE_TO_FORM[activeTab].newPath}>
              <Button className="bg-white text-[#003366] hover:bg-white/90">
                <Plus className="h-4 w-4 mr-2" />
                New {IAL_CODE_TO_FORM[activeTab].name}
              </Button>
            </Link>
          )}
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Form Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-3"
        >
          {IAL_FORMS.map((form) => {
            const stats = formStats[form.code] || { total: 0, pending: 0 };
            return (
              <button
                key={form.code}
                type="button"
                onClick={() => setActiveTab(form.code)}
                className={`rounded-xl p-4 text-left border transition-all hover:shadow-md ${
                  activeTab === form.code ? 'ring-2 ring-offset-1' : ''
                }`}
                style={{
                  backgroundColor: form.bgColor,
                  borderColor: activeTab === form.code ? form.color : 'transparent',
                  boxShadow: activeTab === form.code ? `0 0 0 2px ${form.color}` : undefined,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <form.icon className="h-5 w-5" style={{ color: form.color }} />
                  <span className="text-xs font-semibold" style={{ color: form.color }}>{form.code}</span>
                </div>
                <p className="text-sm font-medium text-foreground truncate">{form.name}</p>
                <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: '#5C5C5C' }}>
                  <span>{stats.total} total</span>
                  {stats.pending > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {stats.pending} pending
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </motion.div>

        {/* Search & Tab Filter */}
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
                    ? `All IT Activity Log Records (${filtered.length})`
                    : `${IAL_CODE_TO_FORM[activeTab]?.name || activeTab} Records (${filtered.length})`}
                </CardTitle>
                <div className="flex items-center gap-3">
                  <div className="relative max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 bg-white h-9 text-sm"
                    />
                  </div>
                  {activeTab !== 'all' && IAL_CODE_TO_FORM[activeTab] && (
                    <Link to={IAL_CODE_TO_FORM[activeTab].newPath}>
                      <Button size="sm" className="h-9" style={{ backgroundColor: IAL_CODE_TO_FORM[activeTab].color }}>
                        <Plus className="h-4 w-4 mr-1" />
                        New
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Tab bar for form code filtering */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
                <TabsList className="h-9">
                  {FILTER_OPTIONS.map((opt) => (
                    <TabsTrigger key={opt.value} value={opt.value} className="text-xs h-7 px-3">
                      {opt.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="pt-0">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <FileText className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p>No records found.</p>
                  {activeTab !== 'all' && IAL_CODE_TO_FORM[activeTab] && (
                    <Link to={IAL_CODE_TO_FORM[activeTab].newPath}>
                      <Button variant="link" className="mt-2">
                        Create first {IAL_CODE_TO_FORM[activeTab].name} record
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map((record: MainDBIT) => {
                    const formCode = record.formcode?.toUpperCase() || '';
                    const formDef = IAL_CODE_TO_FORM[formCode];
                    const statusLabel = MainDBITCurrentstatusKeyToLabel[record.currentStatus as MainDBITCurrentstatusKey] || record.currentStatus || 'Draft';
                    const statusCfg = statusConfig[record.currentStatus as MainDBITCurrentstatusKey];
                    const Icon = formDef?.icon || FileText;
                    const formColor = formDef?.color || '#6B7280';

                    return (
                      <Link
                        key={record.id}
                        to={getITFormDetailPath(record.formcode, record.id)}
                        className="flex items-center gap-4 p-3 rounded-lg bg-card hover:bg-muted transition-standard border border-transparent hover:border-border"
                      >
                        <div
                          className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${formColor}15` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: formColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{record.title || `IAL-${record.id}`}</span>
                            <Badge
                              variant="outline"
                              className="text-xs font-mono shrink-0"
                              style={{
                                color: formColor,
                                borderColor: formColor,
                                backgroundColor: `${formColor}10`,
                              }}
                            >
                              {formCode || 'N/A'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs mt-1" style={{ color: '#5C5C5C' }}>
                            {record.requestorName && <span>{record.requestorName}</span>}
                            {record.submitteddate && (
                              <>
                                <span>•</span>
                                <span>{formatDistanceToNow(parseISO(record.submitteddate), { addSuffix: true })}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="shrink-0"
                          style={{
                            backgroundColor: statusCfg?.bgColor || '#F3F4F6',
                            color: statusCfg?.color || '#374151',
                            borderColor: statusCfg?.color || 'transparent',
                          }}
                        >
                          {statusLabel}
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
