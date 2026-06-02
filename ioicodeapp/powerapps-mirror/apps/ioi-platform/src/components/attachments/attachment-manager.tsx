import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  FileText,
  Image,
  FileSpreadsheet,
  File,
  Trash2,
  Download,
  Eye,
  X,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';

export interface Attachment {
  id: string;
  fileName: string;
  fileURL: string;
  fileType: string;
  fileSizeKB: number;
  category: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedOn: string;
  recordID: string;
  formCode: string;
}

interface AttachmentManagerProps {
  recordId: string;
  formCode: string;
  department: 'IT' | 'HR' | 'STR' | 'QA' | 'FIN' | 'PRD' | 'SHE';
  attachments: Attachment[];
  onUpload?: (files: File[], category: string) => Promise<void>;
  onDelete?: (attachmentId: string) => Promise<void>;
  onDownload?: (attachment: Attachment) => void;
  isReadOnly?: boolean;
  categories?: string[];
  maxFileSizeMB?: number;
  allowedFileTypes?: string[];
}

const DEFAULT_CATEGORIES = [
  'Supporting Document',
  'Evidence',
  'Screenshot',
  'Approval Letter',
  'Reference',
  'Other',
];

const DEFAULT_ALLOWED_TYPES = [
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'png',
  'jpg',
  'jpeg',
  'gif',
  'txt',
  'csv',
  'zip',
];

const getFileIcon = (fileType: string) => {
  const type = fileType.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(type)) {
    return <Image className="h-5 w-5 text-primary" />;
  }
  if (['xls', 'xlsx', 'csv'].includes(type)) {
    return <FileSpreadsheet className="h-5 w-5 text-primary" />;
  }
  if (['doc', 'docx', 'pdf', 'txt'].includes(type)) {
    return <FileText className="h-5 w-5 text-primary" />;
  }
  return <File className="h-5 w-5 text-muted-foreground" />;
};

const formatFileSize = (sizeKB: number): string => {
  if (sizeKB < 1024) {
    return `${sizeKB.toFixed(1)} KB`;
  }
  return `${(sizeKB / 1024).toFixed(2)} MB`;
};

export function AttachmentManager({
  recordId,
  formCode,
  department,
  attachments,
  onUpload,
  onDelete,
  onDownload,
  isReadOnly = false,
  categories = DEFAULT_CATEGORIES,
  maxFileSizeMB = 10,
  allowedFileTypes = DEFAULT_ALLOWED_TYPES,
}: AttachmentManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [dragActive, setDragActive] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFiles = useCallback(
    (files: File[]): File[] => {
      const validFiles: File[] = [];
      const maxSizeBytes = maxFileSizeMB * 1024 * 1024;

      for (const file of files) {
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        
        if (!allowedFileTypes.includes(ext)) {
          toast.error(`File type .${ext} is not allowed`);
          continue;
        }
        
        if (file.size > maxSizeBytes) {
          toast.error(`${file.name} exceeds ${maxFileSizeMB}MB limit`);
          continue;
        }
        
        validFiles.push(file);
      }

      return validFiles;
    },
    [allowedFileTypes, maxFileSizeMB]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (isReadOnly || !onUpload) return;

      const files = Array.from(e.dataTransfer.files);
      const validFiles = validateFiles(files);

      if (validFiles.length > 0) {
        setIsUploading(true);
        try {
          await onUpload(validFiles, selectedCategory);
          toast.success(`${validFiles.length} file(s) uploaded successfully`);
        } catch (error: unknown) {
          toast.error(error instanceof Error ? error.message : 'Upload failed');
        } finally {
          setIsUploading(false);
        }
      }
    },
    [isReadOnly, onUpload, selectedCategory, validateFiles]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isReadOnly || !onUpload || !e.target.files) return;

      const files = Array.from(e.target.files);
      const validFiles = validateFiles(files);

      if (validFiles.length > 0) {
        setIsUploading(true);
        try {
          await onUpload(validFiles, selectedCategory);
          toast.success(`${validFiles.length} file(s) uploaded successfully`);
        } catch (error: unknown) {
          toast.error(error instanceof Error ? error.message : 'Upload failed');
        } finally {
          setIsUploading(false);
          e.target.value = '';
        }
      }
    },
    [isReadOnly, onUpload, selectedCategory, validateFiles]
  );

  const handleDelete = useCallback(
    async (attachmentId: string) => {
      if (!onDelete) return;

      try {
        await onDelete(attachmentId);
        toast.success('Attachment deleted');
        setDeleteConfirm(null);
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : 'Delete failed');
      }
    },
    [onDelete]
  );

  const handleDownload = useCallback(
    (attachment: Attachment) => {
      if (onDownload) {
        onDownload(attachment);
      } else {
        // Default download behavior
        window.open(attachment.fileURL, '_blank');
      }
    },
    [onDownload]
  );

  const isPreviewable = (fileType: string): boolean => {
    return ['jpg', 'jpeg', 'png', 'gif', 'pdf'].includes(fileType.toLowerCase());
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Paperclip className="h-5 w-5" />
            Attachments
            {attachments.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {attachments.length}
              </Badge>
            )}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {department} • {formCode}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Zone */}
        {!isReadOnly && onUpload && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Label className="text-sm text-muted-foreground">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: string) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={cn(
                'relative rounded-lg border-2 border-dashed p-6 transition-all duration-200',
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50',
                isUploading && 'pointer-events-none opacity-50'
              )}
            >
              <input
                type="file"
                multiple
                onChange={handleFileInput}
                className="absolute inset-0 cursor-pointer opacity-0"
                accept={allowedFileTypes.map((t: string) => `.${t}`).join(',')}
                disabled={isUploading}
              />
              <div className="flex flex-col items-center justify-center text-center">
                {isUploading ? (
                  <>
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-2 text-sm text-muted-foreground">Uploading...</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm font-medium">
                      Drag & drop files here or click to browse
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Max {maxFileSizeMB}MB per file • {allowedFileTypes.join(', ')}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Attachments List */}
        <AnimatePresence mode="popLayout">
          {attachments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <Paperclip className="h-12 w-12 text-muted-foreground/60" />
              <p className="mt-2 text-sm text-muted-foreground">No attachments</p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {attachments.map((attachment: Attachment, index: number) => (
                <motion.div
                  key={attachment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05, ease: 'easeOut' as const }}
                  className="group flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    {getFileIcon(attachment.fileType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {attachment.fileName}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{formatFileSize(attachment.fileSizeKB)}</span>
                      <span>•</span>
                      <Badge variant="outline" className="text-sm py-0">
                        {attachment.category}
                      </Badge>
                      <span>•</span>
                      <span>{attachment.uploadedByName}</span>
                      <span>•</span>
                      <span>
                        {format(new Date(attachment.uploadedOn), 'dd MMM yyyy')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    {isPreviewable(attachment.fileType) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setPreviewAttachment(attachment)}
                        title="Preview"
                        className="h-10 w-10"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(attachment)}
                      title="Download"
                      className="h-10 w-10"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {!isReadOnly && onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteConfirm(attachment.id)}
                        className="text-destructive hover:text-destructive h-10 w-10"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

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

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Delete Attachment
              </DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground">
              Are you sure you want to delete this attachment? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}