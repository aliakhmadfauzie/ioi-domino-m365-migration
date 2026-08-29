import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Card, CardContent } from '@/components/ui/card';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { Skeleton } from '@/components/ui/skeleton';
import { displayChoiceLabel } from '@/lib/display-labels';

export interface Column {
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: (value: unknown, row: DataRecord) => React.ReactNode;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: { label: string; value: string }[];
}

export interface DataRecord {
  id: string;
  [key: string]: unknown;
}

interface DatabaseTableProps {
  data: DataRecord[];
  columns: Column[];
  filters?: FilterConfig[];
  onRowClick?: (record: DataRecord) => void;
  isLoading?: boolean;
  searchPlaceholder?: string;
  onRefresh?: () => void;
  dateField?: string;
  statusField?: string;
  initiatorEmailField?: string;
  approverEmailField?: string;
}

const statusColors: Record<string, string> = {
  'Draft': 'bg-secondary text-secondary-foreground',
  'Pending Approval': 'bg-amber-500 text-white',
  'Approved': 'bg-emerald-500 text-white',
  'Rejected': 'bg-destructive text-destructive-foreground',
  'Completed': 'bg-blue-500 text-white',
  'In Progress': 'bg-purple-500 text-white',
  'Active': 'bg-emerald-500 text-white',
  'Confirmed': 'bg-blue-500 text-white',
  'Cancelled': 'bg-secondary text-secondary-foreground line-through',
  'Issued': 'bg-blue-500 text-white',
  'Returned': 'bg-secondary text-secondary-foreground',
  'Installed': 'bg-emerald-500 text-white',
};

export function DatabaseTable({
  data,
  columns,
  filters = [],
  onRowClick,
  isLoading = false,
  searchPlaceholder = 'Search records...',
  onRefresh,
  statusField = 'status',
}: DatabaseTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter and search
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((row: DataRecord) =>
        Object.values(row).some(
          (val: unknown) =>
            val !== null &&
            val !== undefined &&
            String(val).toLowerCase().includes(query)
        )
      );
    }

    // Apply filters
    for (const [key, value] of Object.entries(filterValues)) {
      if (value) {
        result = result.filter((row: DataRecord) => row[key] === value);
      }
    }

    return result;
  }, [data, searchQuery, filterValues]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a: DataRecord, b: DataRecord) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const comparison = String(aVal).localeCompare(String(bVal));
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key: string) => {
    if (sortColumn === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setTimeout(() => setIsRefreshing(false), 500);
    }
  }, [onRefresh]);

  const handleExport = (type: 'csv' | 'excel') => {
    const headers = columns.map((col: Column) => col.header);
    const rows = sortedData.map((row: DataRecord) =>
      columns.map((col: Column) => {
        const val = row[col.key];
        return val instanceof Date ? format(val, 'yyyy-MM-dd') : displayChoiceLabel(val, col.key);
      })
    );

    const separator = type === 'csv' ? ',' : '\t';
    const content = [headers, ...rows].map((r: string[]) => r.join(separator)).join('\n');
    const blob = new Blob([content], { type: type === 'csv' ? 'text/csv' : 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `export-${format(new Date(), 'yyyyMMdd')}.${type === 'csv' ? 'csv' : 'xls'}`;
    link.click();
  };

  const renderCellValue = (col: Column, row: DataRecord) => {
    const value = row[col.key];

    if (col.render) {
      return col.render(value, row);
    }

    if (col.key === statusField && typeof value === 'string') {
      const label = displayChoiceLabel(value, col.key);
      return (
        <Badge className={statusColors[label] || 'bg-secondary'}>
          {label}
        </Badge>
      );
    }

    if (value instanceof Date) {
      return format(value, 'dd/MM/yyyy');
    }

    return displayChoiceLabel(value, col.key);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                className="pl-9"
              />
            </div>

            {/* Filters */}
            {filters.map((filter: FilterConfig) => (
              <Select
                key={filter.key}
                value={filterValues[filter.key] || ''}
                onValueChange={(v: string) => {
                  setFilterValues((prev: Record<string, string>) => ({ ...prev, [filter.key]: v }));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((opt: { label: string; value: string }) => (
                    <SelectItem key={opt.value || 'all'} value={opt.value || 'all'}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}

            {/* Actions */}
            <div className="flex gap-2 ml-auto">
              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col: Column) => (
                  <TableHead
                    key={col.key}
                    style={{ width: col.width }}
                    className={col.sortable ? 'cursor-pointer select-none hover:bg-muted/50' : ''}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-2">
                      {col.header}
                      {col.sortable && sortColumn === col.key && (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      )}
                    </div>
                  </TableHead>
                ))}
                <TableHead style={{ width: '60px' }} />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_: unknown, i: number) => (
                  <TableRow key={i}>
                    {columns.map((col: Column) => (
                      <TableCell key={col.key}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                    <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                  </TableRow>
                ))
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1}>
                    <Empty className="py-8">
                      <EmptyHeader>
                        <EmptyTitle>No records found</EmptyTitle>
                        <EmptyDescription>
                          {searchQuery ? 'Try adjusting your search criteria' : 'No submissions yet'}
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              ) : (
                <AnimatePresence mode="popLayout">
                  {paginatedData.map((row: DataRecord, index: number) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15, delay: index * 0.02 }}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => onRowClick?.(row)}
                    >
                      {columns.map((col: Column) => (
                        <TableCell key={col.key}>
                          {renderCellValue(col, row)}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Show</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v: string) => {
              setPageSize(Number(v));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span>of {sortedData.length} records</span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            First
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage((p: number) => p - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-3 text-sm">
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage((p: number) => p + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage >= totalPages}
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  );
}
