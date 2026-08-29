/**
 * BSD — Backup Staff List View
 * Lists all Backup Staff records (FormCode='BSD') from MainDB_HR.
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, Search, Eye, Loader2, Users } from 'lucide-react';
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

const TABS = [
  { id: 'all', label: 'All' }, { id: 'request', label: 'Draft' },
  { id: 'hod', label: 'HOD Review' }, { id: 'approved', label: 'Approved' },
];

function BSDListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const { data: raw = [], isLoading } = useMainDBHRByFormType('BSD');
  const items = useMemo(() => raw.map(asRead), [raw]);
  const filtered = useMemo(() => {
    let list = items;
    if (tab === 'request') list = list.filter(r => r.CurrentAction === 'Request');
    else if (tab === 'hod') list = list.filter(r => r.CurrentAction === 'Submitted');
    else if (tab === 'approved') list = list.filter(r => r.CurrentAction === 'Approved');
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r => r.EmployeeName?.toLowerCase().includes(q) || r.Department?.toLowerCase().includes(q));
    }
    return list;
  }, [items, tab, search]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Backup Staff' }]} />
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Backup Staff</h1><p className="text-sm text-muted-foreground mt-1">Manage backup staff assignments</p></div>
        <Button onClick={() => navigate('/hr/bsd/new')}><Plus className="mr-2 h-4 w-4" /> New Assignment</Button>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Staff Assignments</CardTitle>
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
          </div>
          <Tabs value={tab} onValueChange={setTab} className="mt-2">
            <TabsList>{TABS.map(t => <TabsTrigger key={t.id} value={t.id}>{t.label}</TabsTrigger>)}</TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
          : filtered.length === 0 ? (
            <Empty><EmptyHeader><Users className="h-8 w-8" /><EmptyTitle>No records found</EmptyTitle><EmptyDescription>Create your first backup staff assignment.</EmptyDescription></EmptyHeader></Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Name</TableHead><TableHead>Department</TableHead><TableHead>Division</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(r => (
                  <TableRow key={r.ID}>
                    <TableCell className="font-medium">{r.EmployeeName || r.Title || r.INO || `BSD-${r.ID}`}</TableCell>
                    <TableCell>{r.Department || '-'}</TableCell>
                    <TableCell>{r.Divison || '-'}</TableCell>
                    <TableCell><StatusBadge status={r.CurrentAction} /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/hr/bsd/detail/${r.ID}`)}><Eye className="mr-1 h-4 w-4" /> View</Button>
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

export default BSDListPage;
