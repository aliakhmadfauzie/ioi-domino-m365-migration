import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { X, Printer, FileDown, CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { StatusBadge } from './database-table';

export interface FieldGroup {
  title: string;
  fields: FieldDef[];
}

export interface FieldDef {
  label: string;
  value: unknown;
  type?: 'text' | 'date' | 'status' | 'badge' | 'list' | 'user' | 'link';
  fullWidth?: boolean;
}

export interface ApprovalHistoryItem {
  action: string;
  actionBy: string;
  actionDate: Date | string;
  comments?: string;
  status: 'approved' | 'rejected' | 'pending' | 'completed';
}

export interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  status?: string;
  fieldGroups: FieldGroup[];
  approvalHistory?: ApprovalHistoryItem[];
  canApprove?: boolean;
  onApprove?: (comments: string) => void;
  onReject?: (comments: string) => void;
  isSubmitting?: boolean;
}

export function DetailModal({
  isOpen,
  onClose,
  title,
  subtitle,
  status,
  fieldGroups,
  approvalHistory = [],
  canApprove = false,
  onApprove,
  onReject,
  isSubmitting = false,
}: DetailModalProps) {
  const [approvalComments, setApprovalComments] = useState('');

  const renderFieldValue = (field: FieldDef) => {
    const { value, type } = field;

    if (value === null || value === undefined || value === '') {
      return <span style={{ color: '#888888' }}>-</span>;
    }

    switch (type) {
      case 'date':
        return (
          <span style={{ color: '#1C1C1C' }}>
            {value instanceof Date ? format(value, 'PPP') : String(value)}
          </span>
        );
      case 'status':
        return <StatusBadge status={String(value)} />;
      case 'badge':
        return (
          <Badge variant="secondary" style={{ backgroundColor: '#E0E7FF', color: '#3730A3' }}>
            {String(value)}
          </Badge>
        );
      case 'list':
        if (Array.isArray(value)) {
          return (
            <div className="flex flex-wrap gap-1">
              {value.map((item: unknown, i: number) => (
                <Badge key={i} variant="outline" style={{ fontSize: '12px' }}>
                  {String(item)}
                </Badge>
              ))}
            </div>
          );
        }
        return <span style={{ color: '#1C1C1C' }}>{String(value)}</span>;
      case 'user':
        return (
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#003366' }}
            >
              <User className="h-3 w-3 text-white" />
            </div>
            <span style={{ color: '#1C1C1C' }}>{String(value)}</span>
          </div>
        );
      case 'link':
        return (
          <a
            href={String(value)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline"
            style={{ color: '#003366' }}
          >
            {String(value)}
          </a>
        );
      default:
        return <span style={{ color: '#1C1C1C' }}>{String(value)}</span>;
    }
  };

  const getStatusIcon = (itemStatus: string) => {
    switch (itemStatus) {
      case 'approved':
      case 'completed':
        return <CheckCircle className="h-4 w-4" style={{ color: '#065F46' }} />;
      case 'rejected':
        return <XCircle className="h-4 w-4" style={{ color: '#991B1B' }} />;
      default:
        return <Clock className="h-4 w-4" style={{ color: '#92400E' }} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' as const }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[90%] md:max-w-4xl md:max-h-[85vh] z-50 rounded-xl shadow-2xl overflow-hidden flex flex-col"
            style={{ backgroundColor: '#FFFFFF' }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ backgroundColor: '#003366', borderBottom: '1px solid #002244' }}
            >
              <div>
                <h2 className="text-lg font-bold text-white">{title}</h2>
                {subtitle && (
                  <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {subtitle}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {status && <StatusBadge status={status} />}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {fieldGroups.map((group: FieldGroup, groupIndex: number) => (
                  <div key={groupIndex}>
                    <h3
                      className="text-sm font-semibold mb-3 pb-2"
                      style={{ color: '#003366', borderBottom: '2px solid #E8E8E8' }}
                    >
                      {group.title}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {group.fields.map((field: FieldDef, fieldIndex: number) => (
                        <div
                          key={fieldIndex}
                          className={field.fullWidth ? 'col-span-2' : ''}
                        >
                          <p
                            className="text-xs font-medium mb-1"
                            style={{ color: '#5C5C5C' }}
                          >
                            {field.label}
                          </p>
                          <div className="text-sm">{renderFieldValue(field)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Approval History */}
                {approvalHistory.length > 0 && (
                  <div>
                    <h3
                      className="text-sm font-semibold mb-3 pb-2"
                      style={{ color: '#003366', borderBottom: '2px solid #E8E8E8' }}
                    >
                      Approval History
                    </h3>
                    <div className="space-y-3">
                      {approvalHistory.map((item: ApprovalHistoryItem, i: number) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-lg"
                          style={{ backgroundColor: '#FAFAFA' }}
                        >
                          {getStatusIcon(item.status)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium" style={{ color: '#1C1C1C' }}>
                                {item.action}
                              </p>
                              <p className="text-xs" style={{ color: '#888888' }}>
                                {item.actionDate instanceof Date
                                  ? format(item.actionDate, 'PPp')
                                  : item.actionDate}
                              </p>
                            </div>
                            <p className="text-sm" style={{ color: '#5C5C5C' }}>
                              by {item.actionBy}
                            </p>
                            {item.comments && (
                              <p
                                className="text-sm mt-1 italic"
                                style={{ color: '#5C5C5C' }}
                              >
                                "{item.comments}"
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Approval Section */}
                {canApprove && (
                  <div>
                    <Separator className="my-4" />
                    <h3
                      className="text-sm font-semibold mb-3"
                      style={{ color: '#003366' }}
                    >
                      Approval Action
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm" style={{ color: '#1C1C1C' }}>
                          Comments
                        </Label>
                        <Textarea
                          value={approvalComments}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            setApprovalComments(e.target.value)
                          }
                          placeholder="Enter approval/rejection comments..."
                          rows={3}
                          className="mt-2"
                          style={{ backgroundColor: '#FAFAFA' }}
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => onApprove?.(approvalComments)}
                          disabled={isSubmitting}
                          className="flex-1"
                          style={{ backgroundColor: '#065F46' }}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => onReject?.(approvalComments)}
                          disabled={isSubmitting}
                          className="flex-1"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div
              className="px-6 py-4 flex justify-between"
              style={{ backgroundColor: '#FAFAFA', borderTop: '1px solid #E8E8E8' }}
            >
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm">
                  <FileDown className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}