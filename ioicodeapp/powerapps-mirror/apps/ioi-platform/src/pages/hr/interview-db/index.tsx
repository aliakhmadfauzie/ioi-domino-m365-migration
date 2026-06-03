/** INTERVIEWDB — Interview Pipeline List View (HRInterviewPipeline table) */
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, Eye, Loader2, Users } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { StatusBadge } from '@/components/hr/status-badge';
import { useHRInterviewPipelineList } from '@/generated/hooks/use-hrinterview-pipeline';
import { HRInterviewPipelineSiteKeyToLabel, type HRInterviewPipelineSiteKey } from '@/generated/models/hr-interview-pipeline-model';

const STAGE_TABS = [
  { id: 'all', label: 'All' },
  { id: 'Screening', label: 'Screening' },
  { id: 'Interview', label: 'Interview' },
  { id: 'Offer', label: 'Offer' },
  { id: 'Joined', label: 'Joined' },
  { id: 'Declined', label: 'Declined' },
];

export default function InterviewDBListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const { data: records = [], isLoading } = useHRInterviewPipelineList();

  const filtered = useMemo(() => {
    let list = [...records];
    if (tab !== 'all') list = list.filter(r => r.stage === tab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.candidateName?.toLowerCase().includes(q) ||
        r.position?.toLowerCase().includes(q) ||
        r.pipelineNo?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [records, tab, search]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Interview Database' }]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Interview Database</h1>
          <p className="text-sm text-muted-foreground mt-1">Track candidates through the hiring pipeline</p>
        </div>
        <Button onClick={() => navigate('/hr/interview-db/new')}><Plus className="mr-2 h-4 w-4" /> Add Interview</Button>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Records ({filtered.length})</CardTitle>
            <Input placeholder="Search candidate, position..." value={search} onChange={e => setSearch(e.target.value)} className="w-64" />
          </div>
          <Tabs value={tab} onValueChange={setTab} className="mt-2">
            <TabsList>{STAGE_TABS.map(t => <TabsTrigger key={t.id} value={t.id} className="text-xs">{t.label}</TabsTrigger>)}</TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
          : filtered.length === 0 ? (
            <Empty><EmptyHeader><Users className="h-8 w-8" /><EmptyTitle>No interview records</EmptyTitle><EmptyDescription>Add your first interview record.</EmptyDescription></EmptyHeader></Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pipeline No.</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.pipelineNo || r.title}</TableCell>
                    <TableCell>{r.candidateName || '-'}</TableCell>
                    <TableCell>{r.position || '-'}</TableCell>
                    <TableCell>{r.siteKey ? HRInterviewPipelineSiteKeyToLabel[r.siteKey as HRInterviewPipelineSiteKey] : '-'}</TableCell>
                    <TableCell><StatusBadge status={r.stage} /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/hr/interview-db/${r.id}`)}>
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
