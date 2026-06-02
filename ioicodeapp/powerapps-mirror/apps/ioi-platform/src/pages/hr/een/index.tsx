/**
 * EEN — Employee Exit Notification List View
 * Lists EEN records from MainDB_HR filtered by FormCode = EEN
 */

import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, Search, Eye, Loader2, UserX } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { format } from 'date-fns';
import { useMainDBHRByFormType } from '@/hooks/use-main-dbhr';

const asRead = (r: any): Record<string, any> => r;

const STATUS_TABS = [
  { id: 'all', label: 'All' },
  { id: 'Submitted', label: 'Pending HOD' },
  { id: 'HODApproved', label: 'Pending ED' },
  { id: 'EDApproved', label: 'Approved' },
  { id: 'Completed', label: 'Completed' },
];

function getStatusBadge(action: string | undefined) {
  switch (action) {
    case 'Submitted': return <Badge className="bg-amber-100 text-amber-800 border-none">Pending HOD</Badge>;
    case 'HODApproved': return <Badge className="bg-blue-100 text-blue-800 border-none">Pending ED</Badge>;
    case 'EDApproved': return <Badge className="bg-purple-100 text-purple-800 border-none">Approved</Badge>;
    case 'Completed': return <Badge className="bg-emerald-100 text-emerald-800 border-none">Completed</Badge>;
    case 'Rejected': return <Badge variant="destructive">Rejected</Badge>;
    default: return <Badge variant="outline">{action || 'Unknown'}</Badge>;
  }
}

function EENListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');

  const { data: raw = [], isLoading } = useMainDBHRByFormType('EEN');
  const items = useMemo(() => raw.map(asRead), [raw]);

  const filtered = useMemo(() => {
    let list = items;
    if (tab !== 'all') list = list.filter((r) => r.eenCurrentAction === tab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) =>
        r.eenEmpName?.toLowerCase().includes(q) || r.eenSection?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, tab, search]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Exit Notifications' }]} />
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Exit Notifications</h1><p className="text-sm text-muted-foreground mt-1">HOD → ED approval workflow</p></div>
        <Link to="/hr/een/new"><Button><Plus className="h-4 w-4 mr-2" />New Exit Notification</Button></Link>
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
            <Empty><EmptyHeader><UserX className="h-8 w-8" /><EmptyTitle>No records</EmptyTitle><EmptyDescription>Create your first exit notification.</EmptyDescription></EmptyHeader></Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead><TableHead>Section</TableHead><TableHead>Resign Date</TableHead><TableHead>Status</TableHead><TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.ID || r.id}>
                    <TableCell className="font-medium">{r.eenEmpName || r.Title || '-'}</TableCell>
                    <TableCell>{r.eenSection || '-'}</TableCell>
                    <TableCell className="text-sm">{r.eenResignDate ? format(new Date(r.eenResignDate), 'dd MMM yyyy') : '-'}</TableCell>
                    <TableCell>{getStatusBadge(r.eenCurrentAction)}</TableCell>
                    <TableCell><Button variant="ghost" size="icon" onClick={() => navigate(`/hr/een/${r.ID || r.id}`)}><Eye className="h-4 w-4" /></Button></TableCell>
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

export default EENListPage;
