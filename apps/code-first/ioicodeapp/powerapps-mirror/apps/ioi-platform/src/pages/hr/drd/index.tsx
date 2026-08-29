/**
 * DRD — Duty Roster Database list view.
 * Reads only MainDB_HR records where FormCode = DRD.
 */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CalendarDays, Eye, Loader2, Plus, Search } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { StatusBadge } from '@/components/hr/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMainDBHRByFormType } from '@/hooks/use-main-dbhr';
import { DRD_FORM_CODE, type DRDRecord, fieldValue, monthLabel, recordId, recordTitle } from './drd-utils';

const STATUS_TABS = [
  { id: 'all', label: 'All' },
  { id: 'Submitted', label: 'HOS' },
  { id: 'HOSApproved', label: 'HOD' },
  { id: 'HODApproved', label: 'HR' },
  { id: 'Completed', label: 'Completed' },
];

function DRDListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const { data: rawRecords = [], isLoading, error } = useMainDBHRByFormType(DRD_FORM_CODE);

  const records = useMemo(() => rawRecords as DRDRecord[], [rawRecords]);
  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    return records.filter((record) => {
      const state = fieldValue(record.drdCurrentAction || record.currentaction || 'Submitted');
      const matchesTab = tab === 'all' || state === tab;
      if (!matchesTab) return false;
      if (!query) return true;
      return [
        recordTitle(record),
        record.drdCompany,
        record.drdCategory,
        record.drdDepartment,
        record.drdSection,
        record.drdEmpName,
        record.drdHOS,
        record.drdHOD,
      ].some((value) => fieldValue(value).toLowerCase().includes(query));
    });
  }, [records, search, tab]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Duty Roster' }]} />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Duty Roster Database</h1>
          <p className="text-sm text-muted-foreground mt-1">Monthly rosters routed through HOS, HOD, and HR</p>
        </div>
        <Button onClick={() => navigate('/hr/drd/new')}>
          <Plus className="mr-2 h-4 w-4" /> New Roster
        </Button>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-lg">Roster Records</CardTitle>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search rosters..."
                className="pl-8"
              />
            </div>
          </div>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="flex h-auto flex-wrap justify-start">
              {STATUS_TABS.map((item) => <TabsTrigger key={item.id} value={item.id}>{item.label}</TabsTrigger>)}
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <Empty>
              <EmptyHeader>
                <CalendarDays className="h-8 w-8" />
                <EmptyTitle>Duty rosters could not be loaded</EmptyTitle>
                <EmptyDescription>Refresh the page or try again later.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : filteredRecords.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <CalendarDays className="h-8 w-8" />
                <EmptyTitle>No duty rosters found</EmptyTitle>
                <EmptyDescription>Create a monthly roster to start the approval flow.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roster</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>HOS</TableHead>
                  <TableHead>HOD</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => {
                  const id = recordId(record);
                  const state = fieldValue(record.drdCurrentAction || record.currentaction || 'Submitted');
                  return (
                    <TableRow key={id || recordTitle(record)}>
                      <TableCell className="font-medium">{recordTitle(record)}</TableCell>
                      <TableCell>{fieldValue(record.drdEmpName) || '-'}</TableCell>
                      <TableCell>
                        <div>{fieldValue(record.drdDepartment) || '-'}</div>
                        <div className="text-xs text-muted-foreground">{fieldValue(record.drdSection) || '-'}</div>
                      </TableCell>
                      <TableCell>{monthLabel(record.drdMonth)} {fieldValue(record.drdYear) || ''}</TableCell>
                      <TableCell>{fieldValue(record.drdHOS) || '-'}</TableCell>
                      <TableCell>{fieldValue(record.drdHOD) || '-'}</TableCell>
                      <TableCell><StatusBadge status={state} /></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/hr/drd/detail/${id}`)} disabled={!id}>
                          <Eye className="mr-1 h-4 w-4" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default DRDListPage;
