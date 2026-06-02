/**
 * Shared RecordInfoPanel component.
 * Shows standard record metadata (FormCode, ID, Created date, etc.)
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface RecordInfoPanelProps {
  formCode?: string;
  recordId?: number | string;
  created?: string;
  modified?: string;
  /** Display name of who created the record */
  createdBy?: string;
  /** Date the record was created */
  createdDate?: Date;
  /** Date the record was last modified */
  lastModified?: Date;
  /** Requestor email address */
  requestorEmail?: string;
  className?: string;
}

export function RecordInfoPanel({
  formCode,
  recordId,
  created,
  modified,
  createdBy,
  createdDate,
  lastModified,
  requestorEmail,
  className = '',
}: RecordInfoPanelProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Record Info</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2 text-muted-foreground">
        {formCode && (
          <div className="flex justify-between">
            <span>Form Code:</span>
            <span className="font-mono">{formCode}</span>
          </div>
        )}
        {recordId != null && (
          <div className="flex justify-between">
            <span>Record ID:</span>
            <span className="font-mono">{recordId}</span>
          </div>
        )}
        {createdBy && (
          <div className="flex justify-between">
            <span>Created By:</span>
            <span>{createdBy}</span>
          </div>
        )}
        {createdDate && (
          <div className="flex justify-between">
            <span>Created Date:</span>
            <span>{format(createdDate, 'dd MMM yyyy, HH:mm')}</span>
          </div>
        )}
        {created && (
          <div className="flex justify-between">
            <span>Created:</span>
            <span>{format(new Date(created), 'dd MMM yyyy, HH:mm')}</span>
          </div>
        )}
        {lastModified && (
          <div className="flex justify-between">
            <span>Last Modified:</span>
            <span>{format(lastModified, 'dd MMM yyyy, HH:mm')}</span>
          </div>
        )}
        {modified && (
          <div className="flex justify-between">
            <span>Modified:</span>
            <span>{format(new Date(modified), 'dd MMM yyyy, HH:mm')}</span>
          </div>
        )}
        {requestorEmail && (
          <div className="flex justify-between">
            <span>Requestor Email:</span>
            <span>{requestorEmail}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
