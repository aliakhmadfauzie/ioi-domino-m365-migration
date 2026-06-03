// =============================================================================
// Generic Form List / Database View Page
// Auto-generated list page for screen-builder departments.
// Displays records in a sortable, searchable table with detail modal.
// =============================================================================

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Plus, Search, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DatabaseTable,
  type Column,
  type DataRecord,
} from '@/components/shared/database-table';
import {
  DetailModal,
  type FieldGroup,
} from '@/components/shared/detail-modal';
import {
  getDepartmentByCode,
  type DepartmentCode,
  type ModuleDefinition,
} from '@/config/departments';
import {
  buildScreenFormDefinition,
  getDepartmentDisplayName,
} from '@/lib/screen-builder/screen-builder-service';
import { getDepartmentModules } from '@/config/departments';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.2, 0, 0, 1] as const } },
} as const;

/**
 * Generates sample/demo data for the generic database table.
 * In production, this would be replaced with SharePoint-backed data.
 */
function generateSampleRecords(
  formCode: string,
  formName: string,
  count: number = 8
): DataRecord[] {
  const statuses = ['Draft', 'Pending Review', 'Approved', 'Rejected', 'Completed'];
  const people = ['Ahmad Razak', 'Siti Nurhaliza', 'Tan Wei Ming', 'Kumar Rajan', 'Lim Mei Ling'];
  return Array.from({ length: count }, (_, i) => ({
    id: `${formCode.toUpperCase()}-${String(i + 1).padStart(4, '0')}`,
    recordNumber: `${formCode.toUpperCase()}-${format(new Date(), 'yyyyMM')}-${String(i + 1).padStart(4, '0')}`,
    title: `${formName} Entry ${i + 1}`,
    status: statuses[i % statuses.length],
    dateSubmitted: format(new Date(Date.now() - i * 86400000 * 7), 'dd/MM/yyyy'),
    submittedBy: people[i % people.length],
    submittedByEmail: `${people[i % people.length].toLowerCase().replace(/\s/g, '.')}@ioi.com`,
    [`${formCode.toLowerCase()}-reference`]: `${formCode.toUpperCase()}-${new Date().getFullYear()}-${String(i + 1).padStart(3, '0')}`,
    [`${formCode.toLowerCase()}-title`]: `${formName} Entry ${i + 1}`,
    [`${formCode.toLowerCase()}-description`]: `Description for ${formName.toLowerCase()} entry ${i + 1}`,
    [`${formCode.toLowerCase()}-initiator`]: people[i % people.length],
    [`${formCode.toLowerCase()}-date`]: format(new Date(Date.now() - i * 86400000 * 7), 'yyyy-MM-dd'),
    [`${formCode.toLowerCase()}-priority`]: ['Low', 'Medium', 'High', 'Critical'][i % 4],
    'stage-1': 'Pending',
    'stage-2': 'Not Started',
    'stage-3': 'Not Started',
  }));
}

export default function GenericFormListPage() {
  const navigate = useNavigate();
  const { departmentCode, formCode } = useParams<{
    departmentCode: string;
    formCode: string;
  }>();
  const deptCode = (departmentCode ?? '').toUpperCase() as DepartmentCode;
  const department = getDepartmentByCode(deptCode);
  const deptPath = `/${deptCode.toLowerCase()}`;

  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<DataRecord | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Find form config from department modules
  const formDef = useMemo(() => {
    const modules = department?.modules ?? getDepartmentModules(deptCode);
    for (const mod of modules) {
      const found = mod.forms.find(
        (f) => f.formCode.toLowerCase() === (formCode ?? '').toLowerCase()
      );
      if (found) return found;
    }
    return null;
  }, [department, deptCode, formCode]);

  // Build screen form definition
  const screenDef = useMemo(() => {
    if (!formDef || !formCode) return null;
    return buildScreenFormDefinition(formDef, formCode);
  }, [formDef, formCode]);

  const sampleData = useMemo(() => {
    if (!formDef || !formCode) return [];
    return generateSampleRecords(formCode, formDef.name);
  }, [formDef, formCode]);

  // Map ScreenListColumn to DatabaseTable Column
  const columns: Column[] = useMemo(() => {
    if (!screenDef) return [];
    return screenDef.columns.map((c) => ({
      key: c.key,
      header: c.header,
      width: c.width,
      sortable: c.sortable,
    }));
  }, [screenDef]);

  // Map ScreenDetailFieldGroup to FieldGroup for DetailModal
  const fieldGroups: FieldGroup[] = useMemo(() => {
    if (!screenDef) return [];
    return screenDef.detailGroups.map((g) => ({
      title: g.title,
      fields: g.fields.map((f) => ({
        label: f.label,
        key: f.key,
        fullWidth: f.fullWidth,
      })),
    }));
  }, [screenDef]);

  const filteredData = useMemo(() => {
    if (!search.trim()) return sampleData;
    const q = search.toLowerCase();
    return sampleData.filter(
      (rec) =>
        Object.values(rec).some(
          (v) => typeof v === 'string' && v.toLowerCase().includes(q)
        )
    );
  }, [sampleData, search]);

  const handleRowClick = useCallback((record: DataRecord) => {
    setSelectedRecord(record);
    setDetailOpen(true);
  }, []);

  if (!department || !formDef || !screenDef) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-3">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <CardTitle>Form Not Found</CardTitle>
            <p className="text-sm text-muted-foreground">
              {formCode
                ? `Form "${formCode}" not found in ${departmentCode} department.`
                : 'No form code specified.'}
            </p>
            <Button variant="outline" onClick={() => navigate(deptPath)}>
              Back to {department?.name ?? 'Department'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-4 p-4 md:p-6 pb-24 max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigate(deptPath)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold tracking-tight">{screenDef.name}</h1>
            <Badge variant="outline" className="uppercase text-xs">
              {formCode}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground ml-10">
            {department.name} — {screenDef.description}
          </p>
        </div>
        <Button
          onClick={() => navigate(`${deptPath}/forms/${formCode}/new`)}
          className="gap-1.5 shrink-0"
        >
          <Plus className="h-4 w-4" />
          New {screenDef.name}
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants} className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search records..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10"
        />
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants}>
        <DatabaseTable
          columns={columns}
          data={filteredData}
          onRowClick={handleRowClick}
        />
      </motion.div>

      {/* Detail Modal */}
      <DetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={screenDef.name}
        recordNumber={String(selectedRecord?.recordNumber ?? selectedRecord?.id ?? '')}
        status={String(selectedRecord?.status ?? 'Draft')}
        fieldGroups={fieldGroups}
        data={selectedRecord ?? { id: '' }}
        approvalHistory={[]}
      />
    </motion.div>
  );
}
