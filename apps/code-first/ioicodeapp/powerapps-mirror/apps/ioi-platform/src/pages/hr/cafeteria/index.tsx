/**
 * CIR — Cafeteria Inspection List View
 * Lists Cafeteria Inspection parent records from MainDB_HR
 * and displays inspection details from MainDB_HR_Ext_Cafeteria.
 * with status filters, search, and quick actions.
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import {
  Plus,
  Search,
  Eye,
  Loader2,
  ClipboardList,
} from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty';
import { format } from 'date-fns';
import { useMainDBHRByFormType } from '@/hooks/use-main-dbhr';
import { MainDBHRExtCafeteriaService } from '@/services/main-dbhr-ext-cafeteria-service';


// Cast helper: the hook returns MainDBHR (camelCase) but the API response has PascalCase fields
const asRead = (r: any): Record<string, any> => r;

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
} as const;

const STATUS_TABS = [
  { id: 'all', label: 'All Inspections' },
  { id: 'submitted', label: 'Submitted' },
  { id: 'accepted', label: 'Accepted' },
];

type CafeteriaRecord = Record<string, any> & {
  parentId: string;
  extensionId?: string;
  parent: Record<string, any>;
  extension?: Record<string, any>;
};

function fieldValue(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(fieldValue).filter(Boolean).join('; ');
  if (typeof value === 'object') {
    const person = value as { DisplayName?: string; Email?: string; Title?: string; Value?: string };
    return person.DisplayName || person.Email || person.Title || person.Value || '';
  }
  return String(value);
}

function getStatusBadge(currentAction: string | undefined) {
  switch (currentAction) {
    case 'Submitted':
      return <Badge className="bg-amber-100 text-amber-800 border-none">Pending Review</Badge>;
    case 'Accepted':
      return <Badge className="bg-emerald-100 text-emerald-800 border-none">Accepted</Badge>;
    default:
      return <Badge variant="outline">{currentAction || 'Unknown'}</Badge>;
  }
}

function getSiteIcon(site: string | undefined) {
  return site?.includes('ACM') ? '🍽️' : '🏢';
}

function CafeteriaListPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const { data: rawInspections = [], isLoading, error } = useMainDBHRByFormType('CIR');
  const { data: rawExtensions = [], isLoading: isLoadingExtensions, error: extensionError } = useQuery({
    queryKey: ['main-dbhr-ext-cafeteria', 'all'],
    queryFn: () => MainDBHRExtCafeteriaService.getAll({ filter: "ParentFormCode eq 'CIR'" }),
    staleTime: 5 * 60 * 1000,
  });

  const inspections = useMemo<CafeteriaRecord[]>(() => {
    const extensionsByParent = new Map<string, Record<string, any>>();
    rawExtensions.map(asRead).forEach((extension) => {
      const parentId = fieldValue(extension.ParentRecord);
      if (parentId) extensionsByParent.set(parentId, extension);
    });

    return rawInspections.map(asRead).map((parent) => {
      const parentId = fieldValue(parent.ID || parent.id);
      const extension = extensionsByParent.get(parentId);
      return {
        ...parent,
        ...extension,
        parent,
        extension,
        parentId,
        extensionId: fieldValue(extension?.ID || extension?.id),
      };
    });
  }, [rawExtensions, rawInspections]);

  const filtered = useMemo(() => {
    let list = inspections;

    // Filter by status tab
    if (activeTab === 'submitted') list = list.filter((r) => fieldValue(r.cirCurrentAction) === 'Submitted');
    else if (activeTab === 'accepted') list = list.filter((r) => fieldValue(r.cirCurrentAction) === 'Accepted');

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          fieldValue(r.Title || r.title).toLowerCase().includes(q) ||
          fieldValue(r.cirINO).toLowerCase().includes(q) ||
          fieldValue(r.cirInspector).toLowerCase().includes(q) ||
          fieldValue(r.cirSite).toLowerCase().includes(q)
      );
    }

    return list;
  }, [inspections, activeTab, searchQuery]);

  const combinedError = error || extensionError;
  const combinedLoading = isLoading || isLoadingExtensions;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Cafeteria Inspections' }]} />

      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cafeteria Inspections</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage ACM & ECM cafeteria inspection records
          </p>
        </div>
        <Button onClick={() => navigate('/hr/cafeteria/new')}>
          <Plus className="mr-2 h-4 w-4" /> New Inspection
        </Button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Inspections</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inspections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
              <TabsList>
                {STATUS_TABS.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {combinedLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : combinedError ? (
              <Empty>
                <EmptyHeader>
                  <ClipboardList className="h-8 w-8" />
                  <EmptyTitle>Unable to load inspections</EmptyTitle>
                  <EmptyDescription>
                    {combinedError instanceof Error ? combinedError.message : 'The cafeteria inspection records could not be loaded.'}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : filtered.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <ClipboardList className="h-8 w-8" />
                  <EmptyTitle>No inspections found</EmptyTitle>
                  <EmptyDescription>
                    {searchQuery
                      ? 'Try a different search term.'
                      : 'Create your first cafeteria inspection to get started.'}
                  </EmptyDescription>
                </EmptyHeader>
                {!searchQuery && (
                  <Button onClick={() => navigate('/hr/cafeteria/new')} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" /> New Inspection
                  </Button>
                )}
              </Empty>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>Inspector</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((record) => {
                    const recordId = record.parentId;
                    const recordTitle = fieldValue(record.Title || record.title || record.cirINO || `CIR-${recordId}`);
                    const site = fieldValue(record.cirSite);
                    const inspector = fieldValue(record.cirInspector);
                    const currentAction = fieldValue(record.cirCurrentAction);

                    return (
                    <TableRow key={recordId}>
                      <TableCell className="font-medium">{recordTitle}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1">
                          {getSiteIcon(site)} {site || '-'}
                        </span>
                      </TableCell>
                      <TableCell>{inspector || '-'}</TableCell>
                      <TableCell>
                        {record.cirInsDate
                          ? format(new Date(record.cirInsDate), 'dd MMM yyyy')
                          : '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(currentAction)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/hr/cafeteria/detail/${recordId}`)}
                        >
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
    </motion.div>
  );
}

export default CafeteriaListPage;
