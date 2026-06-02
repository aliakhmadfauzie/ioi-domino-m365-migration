import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatabaseTable, DetailModal, StatusBadge } from '@/components/database-view';
import type { ColumnDef, FieldGroup } from '@/components/database-view';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { useMainDBITExtSupportList } from '@/generated/hooks/use-main-dbitext-support';
import { MainDBITCurrentstatusKeyToLabel, type MainDBIT } from '@/generated/models/main-dbit-model';
import type { MainDBITExtSupport } from '@/generated/models/main-dbit-ext-support-model';
import { parseRemarks } from '@/lib/parse-remarks';

interface ITDR2Record {
  id: string;
  recordNo: string;
  dateCreated: Date | null;
  createdByEmail: string;
  taskTitle: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  taskStatus: string;
  priority: string;
  category: string;
  year: string;
  month: string;
  remarks: string;
  currentStatus: string;
  mainRecord?: MainDBIT;
  extSupport?: MainDBITExtSupport;
}

function statusLabel(status?: string): string {
  if (!status) return 'Draft';
  return MainDBITCurrentstatusKeyToLabel[status] || 'Draft';
}

const columns: ColumnDef<ITDR2Record>[] = [
  {
    key: 'recordNo',
    header: 'Record No',
    sortable: true,
    width: '190px',
    render: (value: unknown) => (
      <span className="font-mono font-medium" style={{ color: '#003366' }}>
        {String(value)}
      </span>
    ),
  },
  {
    key: 'taskTitle',
    header: 'Task Title',
    sortable: true,
    render: (value: unknown) => String(value || '-') || '-',
  },
  {
    key: 'assignedTo',
    header: 'Assigned To',
    sortable: true,
  },
  {
    key: 'dueDate',
    header: 'Due Date',
    sortable: true,
    width: '120px',
    render: (value: unknown) => {
      if (!value) return '-';
      try {
        return format(new Date(String(value)), 'dd MMM yyyy');
      } catch {
        return String(value);
      }
    },
  },
  {
    key: 'taskStatus',
    header: 'Task Status',
    sortable: true,
    render: (value: unknown) => (
      <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
        {String(value || '-')}
      </span>
    ),
  },
  {
    key: 'priority',
    header: 'Priority',
    sortable: true,
  },
  {
    key: 'currentStatus',
    header: 'Record Status',
    sortable: true,
    render: (value: unknown) => <StatusBadge status={String(value)} />,
  },
];

export default function ITDR2DatabaseView() {
  const [selectedRecord, setSelectedRecord] = useState<ITDR2Record | null>(null);

  const { data: mainRecords = [], isLoading: mainLoading } = useMainDBITList({
    filter: "formcode eq 'ITDR2'",
    orderBy: ['submitteddate desc'],
  });
  const { data: extSupportRecords = [], isLoading: extLoading } = useMainDBITExtSupportList({
    filter: "parentFormCode eq 'ITDR2'",
  });

  const isLoading = mainLoading || extLoading;

  const records = useMemo<ITDR2Record[]>(() => {
    const supportByParentId = new Map<string, MainDBITExtSupport>();
    const supportByParentTitle = new Map<string, MainDBITExtSupport>();

    extSupportRecords.forEach((support: MainDBITExtSupport) => {
      if (support.parentRecord?.id !== undefined && support.parentRecord?.id !== null) {
        supportByParentId.set(String(support.parentRecord.id), support);
      }
      if (support.parentRecord?.title) {
        supportByParentTitle.set(support.parentRecord.title, support);
      }
    });

    return mainRecords.map((main: MainDBIT) => {
      const parsed = parseRemarks(main.remarks);
      const extSupport =
        supportByParentId.get(String(main.id)) ?? supportByParentTitle.get(main.title || '');

      return {
        id: String(main.id),
        recordNo: main.title || `ITDR2-${main.id}`,
        dateCreated: main.submitteddate ? new Date(main.submitteddate) : null,
        createdByEmail: main.requestoremail || '',
        taskTitle: extSupport?.iTDR2Title || String(parsed.TASK_Title || main.subject || ''),
        description: extSupport?.iTDR2TaskDescription || String(parsed.TASK_Description || ''),
        assignedTo: extSupport?.iTDR2AssignedTo || String(parsed.TASK_AssignedTo || ''),
        dueDate: extSupport?.iTDR2DueDate || String(parsed.TASK_DueDate || ''),
        taskStatus: extSupport?.iTDR2TaskStatus || String(parsed.TASK_Status || ''),
        priority: extSupport?.iTDR2Priority || String(parsed.TASK_Priority || ''),
        category: extSupport?.iTDR2Category || String(parsed.TASK_Category || ''),
        year: extSupport?.iTDR2Year || String(parsed.TASK_Year || ''),
        month: extSupport?.iTDR2Month || String(parsed.TASK_Month || ''),
        remarks: extSupport?.iTDR2Remarks || String(parsed.TASK_Remarks || ''),
        currentStatus: statusLabel(main.currentStatus),
        mainRecord: main,
        extSupport,
      };
    });
  }, [mainRecords, extSupportRecords]);

  const fieldGroups = useMemo<FieldGroup[]>(() => {
    if (!selectedRecord) return [];

    return [
      {
        title: 'Task Register',
        fields: [
          { label: 'Record Number', value: selectedRecord.recordNo },
          { label: 'Created Date', value: selectedRecord.dateCreated, type: 'date' },
          { label: 'Submitted By', value: selectedRecord.createdByEmail, type: 'user' },
          { label: 'Record Status', value: selectedRecord.currentStatus, type: 'badge' },
        ],
      },
      {
        title: 'Task Details',
        fields: [
          { label: 'Task Title', value: selectedRecord.taskTitle || '-', fullWidth: true },
          { label: 'Description', value: selectedRecord.description || '-', fullWidth: true },
          { label: 'Category', value: selectedRecord.category || '-' },
          { label: 'Priority', value: selectedRecord.priority || '-' },
          { label: 'Task Status', value: selectedRecord.taskStatus || '-', type: 'badge' },
        ],
      },
      {
        title: 'Assignment',
        fields: [
          { label: 'Assigned To', value: selectedRecord.assignedTo || '-', type: 'user' },
          { label: 'Due Date', value: selectedRecord.dueDate || '-' },
          { label: 'Year', value: selectedRecord.year || '-' },
          { label: 'Month', value: selectedRecord.month || '-' },
        ],
      },
      {
        title: 'Remarks',
        fields: [
          { label: 'Remarks', value: selectedRecord.remarks || '-', fullWidth: true },
        ],
      },
    ];
  }, [selectedRecord]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div style={{ backgroundColor: '#003366' }} className="px-6 py-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-4">
            <Link to="/it">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">Outstanding Tasks Register</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm">
                ITDR2 submissions from SharePoint
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm" style={{ color: '#5C5C5C' }}>
              View outstanding IT task submissions
            </p>
            <Link to="/it/forms/itdr2/new">
              <Button style={{ backgroundColor: '#003366' }}>
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </Link>
          </div>

          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="mb-4 h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Loading ITDR2 submissions from SharePoint...</p>
              </div>
            ) : records.length === 0 ? (
              <Empty className="py-12">
                <EmptyHeader>
                  <EmptyTitle>No outstanding tasks found</EmptyTitle>
                  <EmptyDescription>
                    There are no ITDR2 submissions in the SharePoint list yet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <DatabaseTable
                data={records}
                columns={columns}
                onRowClick={(row: ITDR2Record) => setSelectedRecord(row)}
                searchPlaceholder="Search by title, assignee, category..."
                dateField="dateCreated"
                initiatorEmailField="createdByEmail"
                statusField="currentStatus"
              />
            )}
          </div>
        </motion.div>
      </div>

      <DetailModal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title={`ITDR2 - ${selectedRecord?.recordNo || ''}`}
        subtitle={selectedRecord?.taskTitle || ''}
        status={selectedRecord?.currentStatus}
        fieldGroups={fieldGroups}
      />
    </div>
  );
}
