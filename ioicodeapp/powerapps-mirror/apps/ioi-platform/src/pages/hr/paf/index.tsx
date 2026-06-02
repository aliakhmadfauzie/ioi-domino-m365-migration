/** PAF — Performance Appraisal List View (HRAppraisalRecords table) */
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, Eye, Loader2, Award } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { StatusBadge } from '@/components/hr/status-badge';
import { useHRAppraisalRecordsList } from '@/generated/hooks/use-hrappraisal-records';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'StatusKey0', label: 'Draft' },
  { id: 'StatusKey1', label: 'Submitted' },
  { id: 'StatusKey2', label: 'Under Review' },
  { id: 'StatusKey3', label: 'Approved' },
];

export default function PAFListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const { data: records = [], isLoading } = useHRAppraisalRecordsList();

  const filtered = useMemo(() => {
    let list = [...records];
    if (tab !== 'all') list = list.filter(r => r.statusKey === tab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.title?.toLowerCase().includes(q) ||
        r.employeeNo?.toLowerCase().includes(q) ||
        r.cycleYear?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [records, tab, search]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Performance Appraisals' }]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Performance Appraisals</h1>
          <p className="text-sm text-muted-foreground mt-1">Annual and periodic performance reviews</p>
        </div>
        <Button onClick={() => navigate('/hr/paf/new')}><Plus className="mr-2 h-4 w-4" /> New Appraisal</Button>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Records ({filtered.length})</CardTitle>
            <Input placeholder="Search employee no, year..." value={search} onChange={e => setSearch(e.target.value)} className="w-64" />
          </div>
          <Tabs value={tab} onValueChange={setTab} className="mt-2">
            <TabsList>{TABS.map(t => <TabsTrigger key={t.id} value={t.id}>{t.label}</TabsTrigger>)}</TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
          : filtered.length === 0 ? (
            <Empty><EmptyHeader><Award className="h-8 w-8" /><EmptyTitle>No appraisals found</EmptyTitle><EmptyDescription>Create your first performance appraisal.</EmptyDescription></EmptyHeader></Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Appraisal No.</TableHead>
                  <TableHead>Employee No.</TableHead>
                  <TableHead>Cycle Year</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.appraisalNo || r.title}</TableCell>
                    <TableCell>{r.employeeNo || '-'}</TableCell>
                    <TableCell>{r.cycleYear || '-'}</TableCell>
                    <TableCell>{r.rating || '-'}</TableCell>
                    <TableCell>{r.reviewerEmail || '-'}</TableCell>
                    <TableCell><StatusBadge status={r.statusKey} /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/hr/paf/${r.id}`)}>
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
