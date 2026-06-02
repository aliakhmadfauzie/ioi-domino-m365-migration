/**
 * AWHR — Rest Day & Additional Working Hours List View
 */

import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, Search, Eye, Loader2, Clock } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { format } from 'date-fns';
import { useMainDBHRByFormType } from '@/hooks/use-main-dbhr';

const asRead = (r: any) => r;

const STATUS_TABS = [
  { id: 'all', label: 'All' }, { id: 'Submitted', label: 'Pending HOS' },
  { id: 'HOSApproved', label: 'Pending HOD' }, { id: 'HODApproved', label: 'Pending HR' },
  { id: 'Completed', label: 'Completed' },
];

function getBadge(action?: string) {
  switch (action) {
    case 'Submitted': return <Badge className="bg-amber-100 text-amber-800">Pending HOS</Badge>;
    case 'HOSApproved': return <Badge className="bg-blue-100 text-blue-800">Pending HOD</Badge>;
    case 'HODApproved': return <Badge className="bg-purple-100 text-purple-800">Pending HR</Badge>;
    case 'Completed': return <Badge className="bg-emerald-100 text-emerald-800">Completed</Badge>;
    default: return <Badge variant="outline">{action || 'Unknown'}</Badge>;
  }
}

function AWHRListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const { data: raw = [], isLoading } = useMainDBHRByFormType('AWHR');
  const items = useMemo(() => raw.map(asRead), [raw]);
  const filtered = useMemo(() => {
    let list = items;
    if (tab !== 'all') list = list.filter(r => r.awhrCurrentAction === tab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r => r.awhrSection?.toLowerCase().includes(q) || r.awhrDepartment?.toLowerCase().includes(q));
    }
    return list;
  }, [items, tab, search]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Working Hours' }]} />
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Working Hours Requisitions</h1>
        <p className="text-sm text-muted-foreground mt-1">HOS → HOD → HR approval</p></div>
        <Link to="/hr/awhr/new"><Button><Plus className="h-4 w-4 mr-2" />New Requisition</Button></Link>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Records ({filtered.length})</CardTitle>
            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-64" />
          </div>
          <Tabs value={tab} onValueChange={setTab} className="mt-2">
            <TabsList>{STATUS_TABS.map(t => <TabsTrigger key={t.id} value={t.id} className="text-xs">{t.label}</TabsTrigger>)}</TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
          : filtered.length === 0 ? (
            <Empty><EmptyHeader><Clock className="h-8 w-8" /><EmptyTitle>No records</EmptyTitle><EmptyDescription>Create your first working hours requisition.</EmptyDescription></EmptyHeader></Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Section</TableHead><TableHead>Dept</TableHead><TableHead>Rows</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(r => (
                  <TableRow key={r.ID || r.id}>
                    <TableCell className="font-medium">{r.awhrSection || '-'}</TableCell>
                    <TableCell>{r.awhrDepartment || '-'}</TableCell>
                    <TableCell className="text-sm">{(() => { try { return JSON.parse(r.awhrWorkingHours || '[]').length; } catch { return 0; }})()}</TableCell>
                    <TableCell>{getBadge(r.awhrCurrentAction)}</TableCell>
                    <TableCell className="text-sm">{r.submitteddate ? format(new Date(r.submitteddate), 'dd MMM') : '-'}</TableCell>
                    <TableCell><Button variant="ghost" size="icon" onClick={() => navigate(`/hr/awhr/${r.ID || r.id}`)}><Eye className="h-4 w-4" /></Button></TableCell>
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

export default AWHRListPage;
