/** HEALTHINFO — Health Register List View (HRHealthRegister table) */
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, Eye, Loader2, Heart } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { StatusBadge } from '@/components/hr/status-badge';
import { useHRHealthRegisterList } from '@/generated/hooks/use-hrhealth-register';
import { HRHealthRegisterSiteKeyToLabel, type HRHealthRegisterSiteKey } from '@/generated/models/hr-health-register-model';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'StatusKey0', label: 'Draft' },
  { id: 'StatusKey1', label: 'Submitted' },
  { id: 'StatusKey3', label: 'Approved' },
  { id: 'StatusKey5', label: 'Closed' },
];

export default function HealthInfoListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const { data: records = [], isLoading } = useHRHealthRegisterList();

  const filtered = useMemo(() => {
    let list = [...records];
    if (tab !== 'all') list = list.filter(r => r.statusKey === tab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.title?.toLowerCase().includes(q) ||
        r.employeeNo?.toLowerCase().includes(q) ||
        r.healthItem?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [records, tab, search]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Health Information' }]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Health Information</h1>
          <p className="text-sm text-muted-foreground mt-1">Staff health declarations and records</p>
        </div>
        <Button onClick={() => navigate('/hr/healthinfo/new')}><Plus className="mr-2 h-4 w-4" /> New Record</Button>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Records ({filtered.length})</CardTitle>
            <Input placeholder="Search employee no, health item..." value={search} onChange={e => setSearch(e.target.value)} className="w-64" />
          </div>
          <Tabs value={tab} onValueChange={setTab} className="mt-2">
            <TabsList>{TABS.map(t => <TabsTrigger key={t.id} value={t.id}>{t.label}</TabsTrigger>)}</TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
          : filtered.length === 0 ? (
            <Empty><EmptyHeader><Heart className="h-8 w-8" /><EmptyTitle>No records</EmptyTitle><EmptyDescription>No health information records found.</EmptyDescription></EmptyHeader></Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Record No.</TableHead>
                  <TableHead>Employee No.</TableHead>
                  <TableHead>Health Item</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.recordNo || r.title}</TableCell>
                    <TableCell>{r.employeeNo || '-'}</TableCell>
                    <TableCell>{r.healthItem || '-'}</TableCell>
                    <TableCell>{r.result || '-'}</TableCell>
                    <TableCell>{r.siteKey ? HRHealthRegisterSiteKeyToLabel[r.siteKey as HRHealthRegisterSiteKey] : '-'}</TableCell>
                    <TableCell><StatusBadge status={r.statusKey} /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/hr/healthinfo/${r.id}`)}>
                        <Eye className="mr-1 h-4 w-4" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
