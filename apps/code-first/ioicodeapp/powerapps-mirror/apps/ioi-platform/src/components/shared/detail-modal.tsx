import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, XCircle, Clock, Printer, FileDown } from 'lucide-react';
import { useState } from 'react';
import type { DataRecord } from './database-table';

/** Strip any HTML tags and enforce a display length cap before rendering field values. */
function sanitizeFieldValue(val: unknown): string {
  const str = String(val ?? '');
  if (!str) return '-';
  // Remove HTML tags
  const stripped = str.replace(/<[^>]*>/g, '');
  // Cap at 2000 chars to prevent layout bloat from corrupted data
  return stripped.length > 2000 ? `${stripped.slice(0, 2000)}…` : stripped;
}

export interface FieldGroup {
  title: string;
  fields: {
    label: string;
    key: string;
    type?: 'text' | 'badge' | 'date';
    fullWidth?: boolean;
  }[];
}

export interface ApprovalHistoryItem {
  step: string;
  status: 'completed' | 'current' | 'pending';
  actor: string;
  date?: string;
  comments?: string;
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  recordNumber: string;
  status: string;
  fieldGroups: FieldGroup[];
  data: DataRecord;
  approvalHistory: ApprovalHistoryItem[];
  showApprovalActions?: boolean;
  onApprove?: (comments: string) => void;
  onReject?: (comments: string) => void;
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
};

export function DetailModal({
  isOpen,
  onClose,
  title,
  recordNumber,
  status,
  fieldGroups,
  data,
  approvalHistory,
  showApprovalActions = false,
  onApprove,
  onReject,
}: DetailModalProps) {
  const [comments, setComments] = useState('');

  const handleApprove = () => {
    onApprove?.(comments);
    setComments('');
    onClose();
  };

  const handleReject = () => {
    onReject?.(comments);
    setComments('');
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Use print-to-PDF via browser; a server-side PDF renderer can replace this later.
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <div>
              <DialogTitle className="text-xl">{title}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{recordNumber}</p>
            </div>
            <Badge className={statusColors[status] || 'bg-secondary'}>
              {status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Field Groups */}
          {fieldGroups.map((group: FieldGroup, index: number) => (
            <Card key={index}>
              <CardHeader className="py-3">
                <CardTitle className="text-base">{group.title}</CardTitle>
              </CardHeader>
              <CardContent className="py-3">
                <div className="grid grid-cols-2 gap-4">
                  {group.fields.map((field) => (
                    <div 
                      key={field.key} 
                      className={field.fullWidth ? 'col-span-2' : ''}
                    >
                      <p className="text-sm text-muted-foreground mb-1">{field.label}</p>
                      {field.type === 'badge' ? (
                        <Badge variant="outline">
                          {sanitizeFieldValue(data[field.key])}
                        </Badge>
                      ) : (
                        <p className="font-medium">
                          {sanitizeFieldValue(data[field.key])}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Approval History */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base">Approval History</CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <div className="space-y-4">
                {approvalHistory.map((item: ApprovalHistoryItem, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.status === 'completed' ? 'bg-emerald-100' :
                      item.status === 'current' ? 'bg-amber-100' :
                      'bg-muted'
                    }`}>
                      {item.status === 'completed' ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : item.status === 'current' ? (
                        <Clock className="h-4 w-4 text-amber-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.step}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.actor}
                        {item.date && ` • ${item.date}`}
                      </p>
                      {item.comments && (
                        <p className="text-sm mt-1 p-2 bg-muted rounded">{item.comments}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Approval Actions */}
          {showApprovalActions && (
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Approval Action</CardTitle>
              </CardHeader>
              <CardContent className="py-3 space-y-4">
                <Textarea
                  placeholder="Enter comments (optional)..."
                  value={comments}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComments(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    className="text-destructive border-destructive hover:bg-destructive/10"
                    onClick={handleReject}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleApprove}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-between border-t pt-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <FileDown className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}