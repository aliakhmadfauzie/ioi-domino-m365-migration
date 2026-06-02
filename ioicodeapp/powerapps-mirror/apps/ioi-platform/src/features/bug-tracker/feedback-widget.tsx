// Floating Feedback Widget - Non-intrusive bug reporting for testers

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bug,
  X,
  ChevronRight,
  Send,
  AlertCircle,
  CheckCircle,
  Loader2,
  ListTodo,
  Minimize2,
  Maximize2,
  Camera,
  Trash2,
  Image,
  Paperclip,
  FileText,
  FileSpreadsheet,
  File,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useSubmitBugReport, useBugReports } from './use-bug-reports';
import { severityConfig, categoryConfig, statusConfig } from './types';
import type { BugSeverity, BugCategory, BugReport, FileAttachment } from './types';
import { format, formatDistanceToNow } from 'date-fns';
import { PeoplePicker, type PersonValue } from '@/components/ui/people-picker';

// Helper to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Helper to get file icon
const getFileIcon = (type: string) => {
  if (type.includes('pdf') || type.includes('word') || type.includes('document')) {
    return FileText;
  }
  if (type.includes('sheet') || type.includes('excel') || type.includes('csv')) {
    return FileSpreadsheet;
  }
  if (type.includes('image')) {
    return Image;
  }
  return File;
};

type WidgetView = 'collapsed' | 'form' | 'list';

export function FeedbackWidget() {
  const location = useLocation();
  const [view, setView] = useState<WidgetView>('collapsed');
  const [isMinimized, setIsMinimized] = useState(false);
  const { reports, stats } = useBugReports();
  const submitMutation = useSubmitBugReport();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<BugSeverity>('minor');
  const [category, setCategory] = useState<BugCategory>('ui');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [assignedTo, setAssignedTo] = useState<PersonValue | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  // Reset form when closing
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSeverity('minor');
    setCategory('ui');
    setStepsToReproduce('');
    setScreenshot(null);
    setAttachments([]);
    setAssignedTo(null);
  };

  // Capture screenshot using Canvas API
  const captureScreenshot = async () => {
    setIsCapturing(true);
    
    try {
      // Temporarily hide the widget during capture
      const widgetElements = document.querySelectorAll('[data-feedback-widget]');
      widgetElements.forEach((el) => (el as HTMLElement).style.visibility = 'hidden');
      
      // Small delay to ensure widget is hidden
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Use html2canvas-like approach with native Canvas API
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Canvas context not available');
      }
      
      // Get viewport dimensions
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvas.width = width;
      canvas.height = height;
      
      // Create a foreignObject SVG to render HTML
      const data = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml">
              ${document.body.innerHTML}
            </div>
          </foreignObject>
        </svg>
      `;
      
      const img = new window.Image();
      const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          URL.revokeObjectURL(url);
          resolve();
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to load image'));
        };
        img.src = url;
      });
      
      // Convert to base64
      const base64 = canvas.toDataURL('image/png', 0.8);
      setScreenshot(base64);
      
      toast.success('Screenshot captured!', {
        description: 'The current view has been attached to your report.',
      });
    } catch (error: unknown) {
      console.error('Screenshot capture failed:', error);
      toast.error('Screenshot capture failed', {
        description: 'Please try again or describe the issue in detail.',
      });
    } finally {
      // Restore widget visibility
      const widgetElements = document.querySelectorAll('[data-feedback-widget]');
      widgetElements.forEach((el) => (el as HTMLElement).style.visibility = 'visible');
      setIsCapturing(false);
    }
  };

  // Handle file attachment
  const handleFileAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const maxSize = 5 * 1024 * 1024; // 5MB limit per file
    const maxFiles = 5;

    if (attachments.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    Array.from(files).forEach((file: globalThis.File) => {
      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds 5MB limit`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          const newAttachment: FileAttachment = {
            id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            size: file.size,
            type: file.type,
            dataUrl: result,
          };
          setAttachments((prev: FileAttachment[]) => [...prev, newAttachment]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset the input
    event.target.value = '';
  };

  // Remove attachment
  const removeAttachment = (id: string) => {
    setAttachments((prev: FileAttachment[]) => prev.filter((a: FileAttachment) => a.id !== id));
  };

  // Calculate total attachment size for warning
  const getTotalAttachmentSize = () => {
    let total = 0;
    if (screenshot) total += screenshot.length;
    attachments.forEach((a: FileAttachment) => {
      total += a.dataUrl?.length || 0;
    });
    return total;
  };

  // Warning threshold (60KB in base64 chars ~ 45KB actual)
  const SIZE_WARNING_THRESHOLD = 50000;
  const showSizeWarning = getTotalAttachmentSize() > SIZE_WARNING_THRESHOLD;

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in the title and description');
      return;
    }

    // Warn user if attachments are large
    const totalSize = getTotalAttachmentSize();
    if (totalSize > 60000) {
      console.log('[BugTracker] Large attachments detected:', totalSize, 'characters');
      toast.info('Processing large attachments...', {
        description: 'Large files may be compressed or stored as references.',
      });
    }

    try {
      await submitMutation.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        severity,
        category,
        stepsToReproduce: stepsToReproduce.trim() || undefined,
        screenshot: screenshot || undefined,
        attachments: attachments.length > 0 ? attachments : undefined,
        assignedTo: assignedTo ? {
          id: assignedTo.id || '',
          displayName: assignedTo.displayName || '',
          email: assignedTo.email || '',
        } : undefined,
        currentPage: location.pathname,
      });

      toast.success('Bug report submitted successfully!', {
        description: 'Thank you for helping improve the platform.',
      });
      resetForm();
      setView('collapsed');
    } catch (error: unknown) {
      console.error('[BugTracker] Submission failed:', error);
      toast.error('Failed to submit bug report', {
        description: 'Please try again or reduce attachment size.',
      });
    }
  };

  // Don't render if minimized
  if (isMinimized) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="fixed bottom-4 right-4 z-[100] h-10 w-10 rounded-full bg-muted border border-border shadow-md flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors"
              onClick={() => setIsMinimized(false)}
            >
              <Maximize2 className="h-4 w-4" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Show bug reporter</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div data-feedback-widget>
      {/* Floating Action Button */}
      <AnimatePresence mode="wait">
        {view === 'collapsed' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-2"
          >
            {/* Stats badge - shows count of open bugs */}
            {stats && stats.new > 0 && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-800 border-amber-200 text-xs cursor-pointer hover:bg-amber-200 transition-colors"
                  onClick={() => setView('list')}
                >
                  {stats.new} open issue{stats.new !== 1 ? 's' : ''}
                </Badge>
              </motion.div>
            )}

            {/* Main FAB with menu */}
            <div className="flex items-center gap-2">
              {/* Quick actions */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center gap-1 bg-white rounded-full shadow-lg border border-border p-1"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
                        onClick={() => setView('list')}
                      >
                        <ListTodo className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>View bug reports</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full text-muted-foreground hover:text-muted-foreground"
                        onClick={() => setIsMinimized(true)}
                      >
                        <Minimize2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Minimize</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>

              {/* Main report bug button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="lg"
                      className="h-14 w-14 rounded-full shadow-lg bg-[#003366] hover:bg-[#003366]/90 text-white"
                      onClick={() => setView('form')}
                    >
                      <Bug className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Report a bug</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bug Report Form Sheet */}
      <Sheet open={view === 'form'} onOpenChange={(open) => !open && setView('collapsed')}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col h-full max-h-screen">
          <SheetHeader className="px-6 py-4 border-b border-border bg-[#003366]">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-white flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Report an Issue
              </SheetTitle>
            </div>
            <p className="text-sm text-white/70 mt-1">
              Help us improve by reporting bugs or issues you find.
            </p>
          </SheetHeader>

          <ScrollArea className="flex-1 min-h-0 px-6 py-4">
            <div className="space-y-5">
              {/* Current page indicator */}
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Reporting from:</p>
                  <p className="text-sm font-medium truncate">{location.pathname}</p>
                </div>
              </div>

              {/* Assigned To */}
              <div className="space-y-2">
                <Label className="text-foreground">
                  Assign To <span className="text-muted-foreground text-xs">(optional)</span>
                </Label>
                <PeoplePicker
                  value={assignedTo}
                  onChange={(person) => setAssignedTo(person as PersonValue | null)}
                  placeholder="Search for a person to assign..."
                  helperText="Select someone to work on this issue"
                />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="bug-title" className="text-foreground">
                  Issue Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="bug-title"
                  placeholder="Brief description of the issue"
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  className="focus-visible:ring-[#003366]"
                />
              </div>

              {/* Severity & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Severity</Label>
                  <Select value={severity} onValueChange={(val: BugSeverity) => setSeverity(val)}>
                    <SelectTrigger className="focus:ring-[#003366]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(severityConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <span className={config.color}>{config.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Category</Label>
                  <Select value={category} onValueChange={(val: BugCategory) => setCategory(val)}>
                    <SelectTrigger className="focus:ring-[#003366]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="bug-description" className="text-foreground">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="bug-description"
                  placeholder="Describe the issue in detail..."
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  rows={4}
                  className="resize-none focus-visible:ring-[#003366]"
                />
              </div>

              {/* Steps to reproduce (optional) */}
              <div className="space-y-2">
                <Label htmlFor="bug-steps" className="text-foreground">
                  Steps to Reproduce <span className="text-muted-foreground text-xs">(optional)</span>
                </Label>
                <Textarea
                  id="bug-steps"
                  placeholder="1. Go to...&#10;2. Click on...&#10;3. See error"
                  value={stepsToReproduce}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setStepsToReproduce(e.target.value)}
                  rows={3}
                  className="resize-none focus-visible:ring-[#003366]"
                />
              </div>

              {/* Screenshot capture */}
              <div className="space-y-2">
                <Label className="text-foreground">Screenshot</Label>
                {screenshot ? (
                  <div className="relative">
                    <img
                      src={screenshot}
                      alt="Captured screenshot"
                      className="w-full rounded-lg border border-border"
                    />
                    <Button
                      variant="destructive"
                      size="icon-sm"
                      className="absolute top-2 right-2 h-7 w-7"
                      onClick={() => setScreenshot(null)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 h-auto py-3"
                    onClick={captureScreenshot}
                    disabled={isCapturing}
                  >
                    {isCapturing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Capturing screen...</span>
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4" />
                        <div className="text-left">
                          <p className="font-medium">Capture Screenshot</p>
                          <p className="text-xs text-muted-foreground">
                            Automatically capture the current view
                          </p>
                        </div>
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* File Attachments */}
              <div className="space-y-2">
                <Label className="text-foreground">Attachments</Label>
                
                {/* Attached files list */}
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((file: FileAttachment) => {
                      const FileIcon = getFileIcon(file.type);
                      return (
                        <div
                          key={file.id}
                          className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg border border-border"
                        >
                          <FileIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0 text-muted-foreground hover:text-destructive"
                            onClick={() => removeAttachment(file.id)}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add attachment button */}
                {attachments.length < 5 && (
                  <div>
                    <input
                      type="file"
                      id="bug-attachment"
                      className="hidden"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.txt,.csv"
                      onChange={handleFileAttachment}
                    />
                    <label htmlFor="bug-attachment">
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 h-auto py-3 cursor-pointer"
                        asChild
                      >
                        <span>
                          <Paperclip className="h-4 w-4" />
                          <div className="text-left">
                            <p className="font-medium">Attach Files</p>
                            <p className="text-xs text-muted-foreground">
                              PDF, Word, Excel, Images (max 5MB each, up to {5 - attachments.length} more)
                            </p>
                          </div>
                        </span>
                      </Button>
                    </label>
                  </div>
                )}
              </div>

              {/* Size warning */}
              {showSizeWarning && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-medium">Large attachments detected</p>
                    <p className="text-amber-700 mt-0.5">
                      Files may be compressed or stored as references. Consider using smaller images or fewer attachments for best results.
                    </p>
                  </div>
                </div>
              )}

              {/* Browser info */}
              <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
                <p className="font-medium mb-1">Auto-captured information:</p>
                <ul className="space-y-0.5 text-muted-foreground">
                  <li>• Browser & OS details</li>
                  <li>• Current page URL</li>
                  <li>• Timestamp</li>
                  <li>• Your account info</li>
                  {screenshot && <li>• Screenshot attached</li>}
                  {attachments.length > 0 && <li>• {attachments.length} file{attachments.length !== 1 ? 's' : ''} attached</li>}
                </ul>
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => {
                resetForm();
                setView('collapsed');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending || !title.trim() || !description.trim()}
              className="bg-[#003366] hover:bg-[#003366]/90 gap-2"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Report
                </>
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Bug List Sheet */}
      <Sheet open={view === 'list'} onOpenChange={(open) => !open && setView('collapsed')}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col">
          <SheetHeader className="px-6 py-4 border-b border-border bg-[#003366]">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-white flex items-center gap-2">
                <ListTodo className="h-5 w-5" />
                Bug Reports
              </SheetTitle>
              <Button
                size="sm"
                variant="secondary"
                className="gap-1.5"
                onClick={() => setView('form')}
              >
                <Bug className="h-4 w-4" />
                New Report
              </Button>
            </div>
            {stats && (
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {stats.total} total
                </Badge>
                {stats.new > 0 && (
                  <Badge className="bg-blue-500 text-white">
                    {stats.new} new
                  </Badge>
                )}
                {stats.inProgress > 0 && (
                  <Badge className="bg-amber-500 text-white">
                    {stats.inProgress} in progress
                  </Badge>
                )}
              </div>
            )}
          </SheetHeader>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {reports.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="text-foreground font-medium">No bugs reported yet!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Everything looks good. Click "New Report" if you find an issue.
                  </p>
                </div>
              ) : (
                reports.map((report: BugReport) => (
                  <BugReportCard key={report.id} report={report} />
                ))
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function BugReportCard({ report }: { report: BugReport }) {
  const severityConf = severityConfig[report.severity];
  const statusConf = statusConfig[report.status];
  const categoryConf = categoryConfig[report.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">{report.id}</span>
            <Badge className={cn('text-[10px] px-1.5 py-0', severityConf.bgColor, severityConf.color)}>
              {severityConf.label}
            </Badge>
          </div>
          <h4 className="font-medium text-foreground truncate">{report.title}</h4>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {report.description}
          </p>
        </div>
        <Badge className={cn('shrink-0 text-xs', statusConf.bgColor, statusConf.color)}>
          {statusConf.label}
        </Badge>
      </div>

      {/* Screenshot preview if attached */}
      {report.screenshot && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <Image className="h-3.5 w-3.5" />
            <span>Screenshot attached</span>
          </div>
          <img
            src={report.screenshot}
            alt="Bug screenshot"
            className="w-full rounded border border-border"
          />
        </div>
      )}

      {/* Attachments list if any */}
      {report.attachments && report.attachments.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <Paperclip className="h-3.5 w-3.5" />
            <span>{report.attachments.length} file{report.attachments.length !== 1 ? 's' : ''} attached</span>
          </div>
          <div className="space-y-1.5">
            {report.attachments.map((file: FileAttachment) => {
              const FileIcon = getFileIcon(file.type);
              return (
                <div
                  key={file.id}
                  className="flex items-center gap-2 text-xs text-muted-foreground p-1.5 bg-muted/30 rounded"
                >
                  <FileIcon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate flex-1">{file.name}</span>
                  <span className="shrink-0">{formatFileSize(file.size)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Assigned To */}
      {report.assignedTo && (
        <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary">
            {report.assignedTo.displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-foreground truncate">Assigned to {report.assignedTo.displayName}</p>
            <p className="text-[10px] text-muted-foreground truncate">{report.assignedTo.email}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{categoryConf.label}</span>
          <span>•</span>
          <span>{formatDistanceToNow(report.reportedAt, { addSuffix: true })}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          by {report.reportedBy.split(' ')[0]}
        </span>
      </div>
    </motion.div>
  );
}