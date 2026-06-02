import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  FileText,
  Image,
  FileSpreadsheet,
  File,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  RefreshCw,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { Attachment } from './attachment-manager';

interface AttachmentTableProps {
  attachments: Attachment[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onDelete?: (id: string) => Promise<void>;
  onDownload?: (attachment: Attachment) => void;
  title?: string;
  showRecordLink?: boolean;
}

type SortField = 'fileName' | 'fileType' | 'fileSizeKB' | 'uploadedOn' | 'category' | 'formCode';
type SortDirection = 'asc' | 'desc';

const getFileIcon = (fileType: string) => {
  const type = fileType.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(type)) {
    return <Image className="h-4 w-4 text-primary" />;
  }
  if (['xls', 'xlsx', 'csv'].includes(type)) {
    return <FileSpreadsheet className="h-4 w-4 text-primary" />;
  }
  if (['doc', 'docx', 'pdf', 'txt'].includes(type)) {
    return <FileText className="h-4 w-4 text-primary" />;
  }
  return <File className="h-4 w-4 text-muted-foreground" />;
};

const formatFileSize = (sizeKB: number): string => {
  if (sizeKB < 1024) {
    return `${sizeKB.toFixed(1)} KB`;
  }
  return `${(sizeKB / 1024).toFixed(2)} MB`;
};

export function AttachmentTable({
  attachments,
  isLoading,
  onRefresh,
  onDelete,
  onDownload,
  title = 'Attachment Index',
  showRecordLink = true,
}: AttachmentTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [formCodeFilter, setFormCodeFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('uploadedOn');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique categories and form codes for filters
  const categories = useMemo(
    () => ['all', ...new Set(attachments.map((a: Attachment) => a.category))],
    [attachments]
  );

  const formCodes = useMemo(
    () => ['all', ...new Set(attachments.map((a: Attachment) => a.formCode))],
    [attachments]
  );

  // Filter and sort
  const filteredAttachments = useMemo(() => {
    let result = attachments;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a: Attachment) =>
          (a.fileName ?? '').toLowerCase().includes(query) ||
          (a.uploadedByName ?? '').toLowerCase().includes(query) ||
          (a.recordID ?? '').toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter((a: Attachment) => a.category === categoryFilter);
    }

    // Form code filter
    if (formCodeFilter !== 'all') {
      result = result.filter((a: Attachment) => a.formCode === formCodeFilter);
    }

    // Sort
    result = [...result].sort((a: Attachment, b: Attachment) => {
      let aVal: string | number = a[sortField];
      let bVal: string | number = b[sortField];

      if (sortField === 'uploadedOn') {
        aVal = new Date(a.uploadedOn).getTime();
        bVal = new Date(b.uploadedOn).getTime();
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    return result;
  }, [attachments, searchQuery, categoryFilter, formCodeFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAttachments.length / pageSize);
  const paginatedAttachments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAttachments.slice(start, start + pageSize);
  }, [filteredAttachments, currentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const handleDownload = (attachment: Attachment) => {
    if (onDownload) {
      onDownload(attachment);
    } else {
      window.open(attachment.fileURL, '_blank');
    }
  };

  const isPreviewable = (fileType: string): boolean => {
    return ['jpg', 'jpeg', 'png', 'gif', 'pdf'].includes(fileType.toLowerCase());
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{filteredAttachments.length} files</Badge>
            {onRefresh && (
              <Button variant="outline" size="icon-sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat: string) => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={formCodeFilter} onValueChange={setFormCodeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Form" />
            </SelectTrigger>
            <SelectContent>
              {formCodes.map((code: string) => (
                <SelectItem key={code} value={code}>
                  {code === 'all' ? 'All Forms' : code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={pageSize.toString()} onValueChange={(v: string) => setPageSize(Number(v))}>
            <SelectTrigger className="w-[100px]">
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

        {/* Table */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Type</TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('fileName')}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    File Name {getSortIcon('fileName')}
                  </button>
                </TableHead>
                {showRecordLink && <TableHead>Record ID</TableHead>}
                <TableHead>
                  <button
                    onClick={() => handleSort('formCode')}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Form {getSortIcon('formCode')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('category')}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Category {getSortIcon('category')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('fileSizeKB')}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Size {getSortIcon('fileSizeKB')}
                  </button>
                </TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('uploadedOn')}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Date {getSortIcon('uploadedOn')}
                  </button>
                </TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i: number) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-6 w-6" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    {showRecordLink && (
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                    )}
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-6" />
                    </TableCell>
                  </TableRow>
                ))
              ) : paginatedAttachments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={showRecordLink ? 9 : 8} className="h-32 text-center">
                    <div className="flex flex-col items-center text-muted-foreground">
                      <File className="h-8 w-8 mb-2" />
                      <p>No attachments found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedAttachments.map((attachment: Attachment) => (
                  <TableRow key={attachment.id} className="group">
                    <TableCell>{getFileIcon(attachment.fileType)}</TableCell>
                    <TableCell>
                      <span className="font-medium truncate max-w-[200px] block">
                        {attachment.fileName}
                      </span>
                    </TableCell>
                    {showRecordLink && (
                      <TableCell>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                          {attachment.recordID}
                        </code>
                      </TableCell>
                    )}
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {attachment.formCode}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {attachment.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatFileSize(attachment.fileSizeKB)}
                    </TableCell>
                    <TableCell className="text-sm">{attachment.uploadedByName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(attachment.uploadedOn), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="opacity-0 group-hover:opacity-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {isPreviewable(attachment.fileType) && (
                            <DropdownMenuItem onClick={() => setPreviewAttachment(attachment)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleDownload(attachment)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          {onDelete && (
                            <DropdownMenuItem
                              onClick={() => onDelete(attachment.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredAttachments.length)} of{' '}
              {filteredAttachments.length} files
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Preview Dialog */}
        <Dialog open={!!previewAttachment} onOpenChange={() => setPreviewAttachment(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {previewAttachment && getFileIcon(previewAttachment.fileType)}
                {previewAttachment?.fileName}
              </DialogTitle>
            </DialogHeader>
            {previewAttachment && (
              <div className="flex-1 overflow-auto">
                {['jpg', 'jpeg', 'png', 'gif'].includes(
                  previewAttachment.fileType.toLowerCase()
                ) ? (
                  <img
                    src={previewAttachment.fileURL}
                    alt={previewAttachment.fileName}
                    className="max-w-full rounded-lg"
                  />
                ) : previewAttachment.fileType.toLowerCase() === 'pdf' ? (
                  <iframe
                    src={previewAttachment.fileURL}
                    className="h-[70vh] w-full rounded-lg"
                    title={previewAttachment.fileName}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <File className="h-16 w-16 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Preview not available</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => handleDownload(previewAttachment)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download to view
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}