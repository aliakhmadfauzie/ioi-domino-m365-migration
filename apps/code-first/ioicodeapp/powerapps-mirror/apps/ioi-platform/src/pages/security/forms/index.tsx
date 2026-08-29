import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Eye,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type StatusType = 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Completed' | 'Cancelled';

const STATUS_COLORS: Record<StatusType, string> = {
  Draft: 'bg-gray-100 text-gray-800',
  'Pending Approval': 'bg-amber-100 text-amber-800',
  Approved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
  Completed: 'bg-blue-100 text-blue-800',
  Cancelled: 'bg-gray-100 text-gray-500 line-through',
};

const MOCK_DATA = [
  {
    id: '1',
    recordNumber: '2026-05-0001',
    dateSubmitted: new Date('2026-05-15'),
    submittedBy: 'Ahmad Razak',
    formType: 'VR',
    visitorName: 'John Smith',
    company: 'ABC Corp',
    purpose: 'Meeting',
    status: 'Approved' as StatusType,
  },
  {
    id: '2',
    recordNumber: '2026-05-0002',
    dateSubmitted: new Date('2026-05-16'),
    submittedBy: 'Sarah Lee',
    formType: 'VE',
    vehicleNumber: 'WXY 1234',
    driverName: 'Tan Wei Ming',
    purpose: 'Delivery',
    status: 'Pending Approval' as StatusType,
  },
  {
    id: '3',
    recordNumber: '2026-05-0003',
    dateSubmitted: new Date('2026-05-17'),
    submittedBy: 'Raj Kumar',
    formType: 'KI',
    keyType: 'Office Key',
    issuedTo: 'New Employee',
    purpose: 'New Hire',
    status: 'Completed' as StatusType,
  },
];

export default function SecurityFormsIndexPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const filter = searchParams.get('filter');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('dateSubmitted');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<typeof MOCK_DATA[0] | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filteredData = useMemo(() => {
    let data = [...MOCK_DATA];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(
        (item) =>
          item.recordNumber.toLowerCase().includes(term) ||
          item.submittedBy.toLowerCase().includes(term) ||
          item.formType.toLowerCase().includes(term)
      );
    }
    
    if (statusFilter !== 'all') {
      data = data.filter((item) => item.status === statusFilter);
    }
    
    data.sort((a, b) => {
      const aVal = a[sortField as keyof typeof a];
      const bVal = b[sortField as keyof typeof b];
      if (aVal instanceof Date && bVal instanceof Date) {
        return sortOrder === 'asc' ? aVal.getTime() - bVal.getTime() : bVal.getTime() - aVal.getTime();
      }
      return sortOrder === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    
    return data;
  }, [searchTerm, statusFilter, sortField, sortOrder]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? (
      <ChevronUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline ml-1" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Security Forms Database</h1>
          <p className="text-muted-foreground">
            {filter === 'my-submissions'
              ? 'Showing your submissions'
              : filter === 'my-pending-tasks'
              ? 'Showing your pending tasks'
              : 'All security form submissions'}
          </p>
        </div>
        <Button onClick={() => navigate('/security/forms/vr/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('recordNumber')}
                >
                  Record No <SortIcon field="recordNumber" />
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('dateSubmitted')}
                >
                  Date <SortIcon field="dateSubmitted" />
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('submittedBy')}
                >
                  Submitted By <SortIcon field="submittedBy" />
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('formType')}
                >
                  Form Type <SortIcon field="formType" />
                </TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  Status <SortIcon field="status" />
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((record) => (
                <TableRow
                  key={record.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    setSelectedRecord(record);
                    setDetailOpen(true);
                  }}
                >
                  <TableCell className="font-mono">{record.recordNumber}</TableCell>
                  <TableCell>{format(record.dateSubmitted, 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{record.submittedBy}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{record.formType}</Badge>
                  </TableCell>
                  <TableCell>{record.purpose}</TableCell>
                  <TableCell>
                    <Badge className={STATUS_COLORS[record.status]}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(val: string) => setPageSize(Number(val))}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * pageSize + 1} to{' '}
          {Math.min(currentPage * pageSize, filteredData.length)} of{' '}
          {filteredData.length} records
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Record Details</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Record Number</p>
                  <p className="font-medium">{selectedRecord.recordNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date Submitted</p>
                  <p className="font-medium">
                    {format(selectedRecord.dateSubmitted, 'dd/MM/yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted By</p>
                  <p className="font-medium">{selectedRecord.submittedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={STATUS_COLORS[selectedRecord.status]}>
                    {selectedRecord.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}