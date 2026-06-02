/**
 * CWR — Contract Worker Requisition List View
 * Lists all CWR records (FormCode='CWR') from MainDB_HR
 * with status filters, search, and quick actions.
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, Search, Eye, Loader2, Briefcase } from 'lucide-react';
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
  { id: 'request', label: 'Draft' },
  { id: 'hod1', label: 'HOD Review' },
  { id: 'hr', label: 'HR Review' },
  { id: 'hod2', label: 'Final HOD' },
  { id: 'completed', label: 'Completed' },
];

function getStatusBadge(action: string | undefined) {
  switch (action) {
    case 'Request': return <Badge variant="outline">Draft</Badge>;
    case 'Submitted': return <Badge variant="default" className="bg-blue-500">Submitted</Badge>;
    case 'HODApproval': return <Badge variant="default" className="bg-amber-500">HOD Review</Badge>;
    case 'HRReview': return <Badge variant="default" className="bg-purple-500">HR Review</Badge>;
    case 'VendorAssignment': return <Badge variant="default" className="bg-cyan-500">Vendor</Badge>;
    case 'HODFinalApproval': return <Badge variant="default" className="bg-amber-600">Final HOD</Badge>;
    case 'Completed': return <Badge variant="default" className="bg-green-600">Completed</Badge>;
    case 'Rejected': return <Badge variant="destructive">Rejected</Badge>;
    case 'Withdrawn': return <Badge variant="secondary">Withdrawn</Badge>;
    default: return <Badge variant="outline">{action || 'Unknown'}</Badge>;
  }
}

function CWRListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');

  const { data: raw = [], isLoading } = useMainDBHRByFormType('CWR');
  const items = useMemo(() => raw.map(asRead), [raw]);

  const filtered = useMemo(() => {
    let list = items;
    if (tab === 'request') list = list.filter((r) => r.CurrentAction === 'Request');
    else if (tab === 'hod1') list = list.filter((r) => r.CurrentAction === 'Submitted' || r.CurrentAction === 'HODApproval');
    else if (tab === 'hr') list = list.filter((r) => r.CurrentAction === 'HRReview');
    else if (tab === 'hod2') list = list.filter((r) => r.CurrentAction === 'VendorAssignment' || r.CurrentAction === 'HODFinalApproval');
    else if (tab === 'completed') list = list.filter((r) => r.CurrentAction === 'Completed');
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.Title?.toLowerCase().includes(q) || r.Requestor_DisplayName?.toLowerCase().includes(q) || r.INO?.toLowerCase().includes(q));
    }
    return list;
  }, [items, tab, search]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Contract Worker Requisitions' }]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contract Worker Requisitions</h1>
          <p className="text-sm text-muted-foreground mt-1">Request and manage contract workers</p>
        </div>
        <Button onClick={() => navigate('/hr/cwr/new')}><Plus className="mr-2 h-4 w-4" /> New Request</Button>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Requests</CardTitle>
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
          </div>
          <Tabs value={tab} onValueChange={setTab} className="mt-2">
            <TabsList>{STATUS_TABS.map((t) => <TabsTrigger key={t.id} value={t.id}>{t.label}</TabsTrigger>)}</TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <Empty><EmptyHeader><Briefcase className="h-8 w-8" /><EmptyTitle>No requests found</EmptyTitle><EmptyDescription>Create your first contract worker request.</EmptyDescription></EmptyHeader></Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No.</TableHead>
                  <TableHead>Requestor</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Workers</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.ID}>
                    <TableCell className="font-medium">{r.Title || r.INO || `CWR-${r.ID}`}</TableCell>
                    <TableCell>{r.Requestor_DisplayName || '-'}</TableCell>
                    <TableCell>{r.EntitySite?.Value || '-'}</TableCell>
                    <TableCell>{r.Description || '-'}</TableCell>
                    <TableCell>{getStatusBadge(r.CurrentAction)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/hr/cwr/detail/${r.ID}`)}>
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

export default CWRListPage;
