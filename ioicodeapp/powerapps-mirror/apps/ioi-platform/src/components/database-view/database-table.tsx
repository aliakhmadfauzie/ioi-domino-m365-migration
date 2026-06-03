import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { format, isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
import { useUser } from '@/hooks/use-user';
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  Download,
  Eye,
  RefreshCw,
  Calendar,
  X,
  FileSpreadsheet,
  FileText,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { getStatusStyle } from '@/lib/color-tokens';
import { displayChoiceLabel } from '@/lib/display-labels';
import type { DateRange } from 'react-day-picker';

export interface ColumnDef<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface DatabaseTableProps<T extends { id: string }> {
  data: T[];
  columns: ColumnDef<T>[];
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  searchPlaceholder?: string;
  title?: string;
  description?: string;
  onRefresh?: () => void;
  dateField?: keyof T;
  moduleField?: keyof T;
  modules?: string[];
  // For filtering by initiator/approver
  initiatorEmailField?: keyof T;
  approverEmailField?: keyof T;
  statusField?: keyof T;
}

type SortDirection = 'asc' | 'desc' | null;

export function StatusBadge({ status }: { status: string }) {
  const label = displayChoiceLabel(status, 'status');
  const style = getStatusStyle(label);
  const isCancelled = label.toLowerCase().replace(/[\s_-]+/g, '-') === 'cancelled';
  return (
    <Badge
      variant={style.badgeVariant}
      className={`${style.text} ${style.bg} ${style.border} font-medium${isCancelled ? ' line-through' : ''}`}
    >
      {label}
    </Badge>
  );
}

export function DatabaseTable<T extends { id: string }>(props: DatabaseTableProps<T>) {
  const {
    data,
    columns,
    onRowClick,
    isLoading = false,
    searchPlaceholder = 'Search records...',
    title,
    description,
    onRefresh,
    dateField,
    moduleField,
    modules = [],
    initiatorEmailField = 'requestedByEmail' as keyof T,
    approverEmailField = 'approverEmail' as keyof T,
    statusField = 'status' as keyof T,
  } = props;

  const { data: user } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [viewFilter, setViewFilter] = useState<'all' | 'my-submissions' | 'my-pending-tasks'>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle URL filter parameter
  useEffect(() => {
    const filter = searchParams.get('filter');
    if (filter === 'my-submissions' || filter === 'my-pending-tasks') {
      setViewFilter(filter);
    } else {
      setViewFilter('all');
    }
  }, [searchParams]);

  // Update URL when view filter changes
  const handleViewFilterChange = useCallback((value: 'all' | 'my-submissions' | 'my-pending-tasks') => {
    setViewFilter(value);
    if (value === 'all') {
      searchParams.delete('filter');
    } else {
      searchParams.set('filter', value);
    }
    setSearchParams(searchParams);
    setCurrentPage(1);
  }, [searchParams, setSearchParams]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setTimeout(() => setIsRefreshing(false), 500);
    }
  }, [onRefresh]);



  // Filter data
  const filteredData = useMemo(() => {
    let result = [...data];
    const userEmail = user?.userPrincipalName?.toLowerCase();

    // View filter (my submissions / my pending tasks)
    if (viewFilter === 'my-submissions' && userEmail && initiatorEmailField) {
      result = result.filter((row: T) => {
        const rowEmail = String((row as Record<string, unknown>)[initiatorEmailField as string] || '').toLowerCase();
        return rowEmail === userEmail || rowEmail.includes(userEmail.split('@')[0]);
      });
    } else if (viewFilter === 'my-pending-tasks' && userEmail && approverEmailField && statusField) {
      result = result.filter((row: T) => {
        const rowApprover = String((row as Record<string, unknown>)[approverEmailField as string] || '').toLowerCase();
        const rowStatus = String((row as Record<string, unknown>)[statusField as string] || '').toLowerCase();
        const isPending = rowStatus.includes('pending') || rowStatus.includes('review');
        const isApprover = rowApprover.includes(userEmail) || rowApprover.includes(userEmail.split('@')[0]);
        // Also check if not the initiator
        const initiatorEmail = String((row as Record<string, unknown>)[initiatorEmailField as string] || '').toLowerCase();
        const isNotInitiator = initiatorEmail !== userEmail;
        return isPending && isApprover && isNotInitiator;
      });
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((row: T) =>
        Object.values(row).some(
          (val: unknown) =>
            val !== null &&
            val !== undefined &&
            String(val).toLowerCase().includes(query)
        )
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(
        (row: T) => (row as Record<string, unknown>)['status'] === statusFilter
      );
    }

    // Module filter
    if (moduleFilter !== 'all' && moduleField) {
      result = result.filter(
        (row: T) => (row as Record<string, unknown>)[moduleField as string] === moduleFilter
      );
    }

    // Date range filter
    if (dateRange?.from && dateField) {
      result = result.filter((row: T) => {
        const rowDate = (row as Record<string, unknown>)[dateField as string];
        if (!rowDate) return false;
        const date = rowDate instanceof Date ? rowDate : parseISO(String(rowDate));
        const from = startOfDay(dateRange.from!);
        const to = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from!);
        return isWithinInterval(date, { start: from, end: to });
      });
    }

    return result;
  }, [data, searchQuery, statusFilter, moduleFilter, moduleField, dateRange, dateField, viewFilter, user?.userPrincipalName, initiatorEmailField, approverEmailField, statusField]);

  // Export to CSV
  const exportToCSV = useCallback(() => {
    const headers = columns.map((col: ColumnDef<T>) => col.header).join(',');
    const rows = filteredData.map((row: T) =>
      columns
        .map((col: ColumnDef<T>) => {
          const value = (row as Record<string, unknown>)[col.key as string];
          const strValue = value instanceof Date ? format(value, 'yyyy-MM-dd') : String(value ?? '');
          const displayValue = displayChoiceLabel(strValue, String(col.key));
          return `"${displayValue.replace(/"/g, '""')}"`;
        })
        .join(',')
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title || 'export'}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  }, [columns, filteredData, title]);

  // Export to Excel (TSV format)
  const exportToExcel = useCallback(() => {
    const headers = columns.map((col: ColumnDef<T>) => col.header).join('\t');
    const rows = filteredData.map((row: T) =>
      columns
        .map((col: ColumnDef<T>) => {
          const value = (row as Record<string, unknown>)[col.key as string];
          return value instanceof Date ? format(value, 'yyyy-MM-dd') : displayChoiceLabel(value, String(col.key));
        })
        .join('\t')
    );
    const tsv = [headers, ...rows].join('\n');
    const blob = new Blob([tsv], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title || 'export'}-${format(new Date(), 'yyyy-MM-dd')}.xls`;
    link.click();
  }, [columns, filteredData, title]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return filteredData;

    return [...filteredData].sort((a: T, b: T) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      let comparison = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else if (aVal instanceof Date && bVal instanceof Date) {
        comparison = aVal.getTime() - bVal.getTime();
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [filteredData, sortKey, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const getValue = (row: T, key: string): unknown => {
    if (key.includes('.')) {
      const keys = key.split('.');
      let value: unknown = row;
      for (const k of keys) {
        value = (value as Record<string, unknown>)?.[k];
      }
      return value;
    }
    return (row as Record<string, unknown>)[key];
  };

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set<string>();
    data.forEach((row: T) => {
      const status = (row as Record<string, unknown>)['status'];
      if (status && typeof status === 'string') {
        statuses.add(status);
      }
    });
    return Array.from(statuses);
  }, [data]);

  return (
    <div className="space-y-4">
      {/* Header */}
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-xl font-bold" style={{ color: '#1C1C1C' }}>
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm mt-1" style={{ color: '#5C5C5C' }}>
              {description}
            </p>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-3 flex-1">
          {/* View Filter (My Submissions / My Pending Tasks) */}
          <Select
            value={viewFilter}
            onValueChange={(v: string) => handleViewFilterChange(v as 'all' | 'my-submissions' | 'my-pending-tasks')}
          >
            <SelectTrigger className="w-[180px]" style={{ backgroundColor: viewFilter !== 'all' ? '#E0F2FE' : '#FAFAFA', borderColor: viewFilter !== 'all' ? '#0284C7' : '#D0D0D0' }}>
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Records</SelectItem>
              <SelectItem value="my-submissions">My Submissions</SelectItem>
              <SelectItem value="my-pending-tasks">My Pending Tasks</SelectItem>
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
              style={{ color: '#888888' }}
            />
            <Input
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="pl-10"
              style={{ backgroundColor: '#FAFAFA', borderColor: '#D0D0D0' }}
            />
          </div>

          {/* Status Filter */}
          {uniqueStatuses.length > 0 && (
            <Select
              value={statusFilter}
              onValueChange={(v: string) => {
                setStatusFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[160px]" style={{ backgroundColor: '#FAFAFA' }}>
                <Filter className="h-4 w-4 mr-2" style={{ color: '#5C5C5C' }} />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {uniqueStatuses.map((status: string) => (
                  <SelectItem key={status} value={status}>
                    {displayChoiceLabel(status, String(statusField))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Module Filter */}
          {modules.length > 0 && (
            <Select
              value={moduleFilter}
              onValueChange={(v: string) => {
                setModuleFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[160px]" style={{ backgroundColor: '#FAFAFA' }}>
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                {modules.map((mod: string) => (
                  <SelectItem key={mod} value={mod}>
                    {mod}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Date Range Filter */}
          {dateField && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-auto justify-start text-left font-normal"
                  style={{ backgroundColor: '#FAFAFA' }}
                >
                  <Calendar className="h-4 w-4 mr-2" style={{ color: '#5C5C5C' }} />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'MMM d')} - {format(dateRange.to, 'MMM d, yyyy')}
                      </>
                    ) : (
                      format(dateRange.from, 'MMM d, yyyy')
                    )
                  ) : (
                    <span style={{ color: '#888888' }}>Date range</span>
                  )}
                  {dateRange?.from && (
                    <X
                      className="h-3 w-3 ml-2 hover:text-destructive"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        setDateRange(undefined);
                        setCurrentPage(1);
                      }}
                    />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={(range: DateRange | undefined) => {
                    setDateRange(range);
                    setCurrentPage(1);
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Refresh Button */}
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

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportToExcel}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export to Excel (.xls)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToCSV}>
                <FileText className="h-4 w-4 mr-2" />
                Export to CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-lg border overflow-hidden"
        style={{ borderColor: '#D0D0D0', backgroundColor: '#FFFFFF' }}
      >
        <Table>
          <TableHeader>
            <TableRow style={{ backgroundColor: '#F5F5F5' }}>
              {columns.map((col: ColumnDef<T>) => (
                <TableHead
                  key={String(col.key)}
                  className={col.sortable ? 'cursor-pointer select-none' : ''}
                  style={{ width: col.width, color: '#1C1C1C', fontWeight: 600 }}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <div className="flex items-center gap-2">
                    {col.header}
                    {col.sortable && (
                      <span className="inline-flex flex-col">
                        <ChevronUp
                          className="h-3 w-3 -mb-1"
                          style={{
                            color:
                              sortKey === col.key && sortDirection === 'asc'
                                ? '#003366'
                                : '#CCCCCC',
                          }}
                        />
                        <ChevronDown
                          className="h-3 w-3"
                          style={{
                            color:
                              sortKey === col.key && sortDirection === 'desc'
                                ? '#003366'
                                : '#CCCCCC',
                          }}
                        />
                      </span>
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
                  {columns.map((col: ColumnDef<T>, j: number) => (
                    <TableCell key={j}>
                      <div
                        className="h-4 rounded animate-pulse"
                        style={{ backgroundColor: '#E8E8E8', width: '80%' }}
                        aria-hidden="true"
                      />
                    </TableCell>
                  ))}
                  <TableCell />
                </TableRow>
              ))
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1}>
                  <Empty className="py-12">
                    <EmptyHeader>
                      <EmptyTitle>No records found</EmptyTitle>
                      <EmptyDescription>
                        {searchQuery
                          ? 'Try adjusting your search criteria'
                          : 'No submissions yet'}
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence mode="popLayout">
                {paginatedData.map((row: T, index: number) => (
                  <motion.tr
                    key={(row as Record<string, unknown>)['id'] as string || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    className="group cursor-pointer hover:bg-[#FAFAFA] transition-colors"
                    onClick={() => onRowClick?.(row)}
                    style={{ borderBottom: '1px solid #E8E8E8' }}
                  >
                    {columns.map((col: ColumnDef<T>) => {
                      const value = getValue(row, String(col.key));
                      return (
                        <TableCell key={String(col.key)} style={{ color: '#1C1C1C' }}>
                          {col.render
                            ? col.render(value, row)
                            : value instanceof Date
                              ? format(value, 'PP')
                              : displayChoiceLabel(value, String(col.key))}
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      <Eye
                        className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: '#003366' }}
                      />
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm" style={{ color: '#5C5C5C' }}>
          <span>Showing</span>
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
          <span>
            of {sortedData.length} record{sortedData.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
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

          <span
            className="px-3 py-1 text-sm font-medium"
            style={{ color: '#1C1C1C' }}
          >
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
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage >= totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
