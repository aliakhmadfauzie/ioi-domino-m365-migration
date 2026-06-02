/**
 * File Upload Component
 * Drag-and-drop file upload with preview support
 */

import * as React from 'react';
import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  X,
  File,
  FileText,
  Image,
  FileSpreadsheet,
  FileArchive,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  file?: File;
  uploadProgress?: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  errorMessage?: string;
}

interface FileUploadProps {
  value: FileItem[];
  onChange: (files: FileItem[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  description?: string;
}

const FILE_ICONS: Record<string, typeof File> = {
  image: Image,
  pdf: FileText,
  spreadsheet: FileSpreadsheet,
  archive: FileArchive,
  default: File,
};

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return FILE_ICONS.image;
  if (type === 'application/pdf') return FILE_ICONS.pdf;
  if (type.includes('spreadsheet') || type.includes('excel') || type === 'text/csv')
    return FILE_ICONS.spreadsheet;
  if (type.includes('zip') || type.includes('archive') || type.includes('compressed'))
    return FILE_ICONS.archive;
  return FILE_ICONS.default;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function FileUpload({
  value = [],
  onChange,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB default
  accept = '*/*',
  disabled = false,
  className,
  placeholder = 'Drag and drop files here, or click to browse',
  description = 'Supports images, documents, and archives',
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || disabled) return;

      const newFiles: FileItem[] = [];
      const remainingSlots = maxFiles - value.length;

      for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
        const file = files[i];
        
        // Validate file size
        if (file.size > maxSize) {
          newFiles.push({
            id: generateId(),
            name: file.name,
            size: file.size,
            type: file.type,
            file,
            status: 'error',
            errorMessage: `File exceeds ${formatFileSize(maxSize)} limit`,
          });
          continue;
        }

        newFiles.push({
          id: generateId(),
          name: file.name,
          size: file.size,
          type: file.type,
          file,
          status: 'complete', // In a real app, this would be 'pending' until uploaded
        });
      }

      if (newFiles.length > 0) {
        onChange([...value, ...newFiles]);
      }
    },
    [value, onChange, maxFiles, maxSize, disabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleClick = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      // Reset input so the same file can be selected again
      if (inputRef.current) inputRef.current.value = '';
    },
    [handleFiles]
  );

  const removeFile = useCallback(
    (id: string) => {
      onChange(value.filter((f: FileItem) => f.id !== id));
    },
    [value, onChange]
  );

  const canAddMore = value.length < maxFiles && !disabled;

  return (
    <div className={cn('space-y-3', className)}>
      {/* Drop Zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer',
          'flex flex-col items-center justify-center gap-2 min-h-[120px]',
          isDragging && 'border-primary bg-primary/5 scale-[1.02]',
          !isDragging && !disabled && 'border-border hover:border-primary/50 hover:bg-muted/30',
          disabled && 'opacity-50 cursor-not-allowed bg-muted/30',
          !canAddMore && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled || !canAddMore}
        />

        <motion.div
          animate={isDragging ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Upload
            className={cn(
              'h-8 w-8',
              isDragging ? 'text-primary' : 'text-muted-foreground'
            )}
          />
        </motion.div>

        <div className="text-center">
          <p
            className={cn(
              'text-sm font-medium',
              isDragging ? 'text-primary' : 'text-foreground'
            )}
          >
            {isDragging ? 'Drop files here' : placeholder}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
          {!canAddMore && value.length >= maxFiles && (
            <p className="text-xs text-amber-600 mt-1">
              Maximum {maxFiles} files reached
            </p>
          )}
        </div>
      </div>

      {/* File List */}
      <AnimatePresence mode="popLayout">
        {value.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {value.map((file: FileItem) => {
              const Icon = getFileIcon(file.type);
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  layout
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border bg-card',
                    file.status === 'error' && 'border-destructive/50 bg-destructive/5'
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      'p-2 rounded-md',
                      file.status === 'error'
                        ? 'bg-destructive/10'
                        : 'bg-primary/10'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4',
                        file.status === 'error'
                          ? 'text-destructive'
                          : 'text-primary'
                      )}
                    />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-foreground">
                      {file.name}
                    </p>
                    <p
                      className={cn(
                        'text-xs',
                        file.status === 'error'
                          ? 'text-destructive'
                          : 'text-muted-foreground'
                      )}
                    >
                      {file.status === 'error'
                        ? file.errorMessage
                        : formatFileSize(file.size)}
                    </p>
                  </div>

                  {/* Status / Actions */}
                  {file.status === 'uploading' && (
                    <Loader2 className="h-4 w-4 text-primary animate-spin" />
                  )}

                  {!disabled && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Count */}
      {value.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {value.length} of {maxFiles} files
        </p>
      )}
    </div>
  );
}

export { type FileUploadProps };