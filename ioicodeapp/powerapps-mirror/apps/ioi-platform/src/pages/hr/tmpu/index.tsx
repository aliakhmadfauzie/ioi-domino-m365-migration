/** TMPU — Training & Development List View */
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, Eye, Loader2, GraduationCap } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { StatusBadge } from '@/components/hr/status-badge';
import { format } from 'date-fns';
import { useMainDBHRByFormType } from '@/hooks/use-main-dbhr';

const asRead = (r: any): Record<string, any> => r;
const TABS = [{ id: 'all', label: 'All' }, { id: 'Request', label: 'Draft' }, { id: 'Submitted', label: 'Pending HOD' }, { id: 'HODApproval', label: 'Pending HR' }, { id: 'Approved', label: 'Approved' }, { id: 'Rejected', label: 'Rejected' }];

export default function TMPUListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const { data: raw = [], isLoading } = useMainDBHRByFormType('TMPU');
  const items = useMemo(() => raw.map(asRead), [raw]);
  const filtered = useMemo(() => {
    let list = items;
    if (tab !== 'all') list = list.filter(r => (r.CurrentAction || r.currentaction) === tab);
    if (search) { const q = search.toLowerCase(); list = list.filter(r => r.EmployeeName?.toLowerCase().includes(q) || r.VacancyTitle?.toLowerCase().includes(q) || r.Title?.toLowerCase().includes(q)); }
    return list;
  }, [items, tab, search]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Training & Development' }]} />
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Training & Development</h1><p className="text-sm text-muted-foreground mt-1">Plan and track employee training programmes</p></div>
        <Button onClick={() => navigate('/hr/tmpu/new')}><Plus className="mr-2 h-4 w-4" /> New Training</Button>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Records ({filtered.length})</CardTitle>
            <Input placeholder="Search employee, program..." value={search} onChange={e => setSearch(e.target.value)} className="w-64" />
          </div>
          <Tabs value={tab} onValueChange={setTab} className="mt-2"><TabsList>{TABS.map(t => <TabsTrigger key={t.id} value={t.id}>{t.label}</TabsTrigger>)}</TabsList></Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
          : filtered.length === 0 ? <Empty><EmptyHeader><GraduationCap className="h-8 w-8" /><EmptyTitle>No training records</EmptyTitle><EmptyDescription>Submit your first training request.</EmptyDescription></EmptyHeader></Empty>
          : <Table><TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Programme</TableHead><TableHead>Provider</TableHead><TableHead>Date</TableHead><TableHead>Cost</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>{filtered.map(r => (
              <TableRow key={r.ID || r.id}>
                <TableCell className="font-medium">{r.EmployeeName || r.employeename || r.Title || '-'}</TableCell>
                <TableCell>{r.VacancyTitle || r.vacancyTitle || '-'}</TableCell>
                <TableCell>{r.Company || r.company || '-'}</TableCell>
                <TableCell className="text-sm">{r.EffectiveDate ? format(new Date(r.EffectiveDate), 'dd MMM yyyy') : '-'}</TableCell>
                <TableCell>{r.Remarks || r.remarks || '-'}</TableCell>
                <TableCell><StatusBadge status={r.CurrentAction || r.currentaction} /></TableCell>
                <TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => navigate(`/hr/tmpu/${r.ID || r.id}`)}><Eye className="mr-1 h-4 w-4" /> View</Button></TableCell>
              </TableRow>
            ))}</TableBody></Table>}
        </CardContent>
      </Card>
    </motion.div>
  );
}
