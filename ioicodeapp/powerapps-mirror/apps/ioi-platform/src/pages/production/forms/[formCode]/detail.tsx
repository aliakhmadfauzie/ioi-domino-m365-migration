import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MainDBPRDService } from '@/generated/services/main-dbprd-service';
import {
  MainDBPRDSiteKeyToLabel,
  MainDBPRDStatusKeyToLabel,
  type MainDBPRD,
} from '@/generated/models/main-dbprd-model';
import { displayChoiceLabel } from '@/lib/display-labels';

type Field = {
  label: string;
  value: unknown;
};

const promotedProductionForms: Record<string, string> = {
  TPM: 'TPM Database',
  BHTADDI: 'BHT Addition Database',
  FILTCLOTREPL: 'Filter Cloth Replacement Record',
  OPRPCCPFILT: 'OPRP/CCP Filter Inspection Record',
  STOCALLOMEMO: 'Stock Allocation Memo',
  STORTANKCLEA: 'Storage Tank Cleaning Inspection',
  WEIGSCALVERI: 'Weighing Scale Verification',
  EQUIPREINSP: 'Equipment Pre-Inspection Report',
  SAPMATEMAST: 'SAP Material Master Maintenance Request',
  CCP1FILTINSP: 'CCP1 Filter Inspection Findings',
  STORTANKVERI: 'Storage Tank Verification Form',
};

function normalizeFormCode(code?: string) {
  const upper = (code ?? 'EPIR').toUpperCase();
  const aliases: Record<string, string> = {
    EPIR: 'EQUIPREINSP',
    SAPMMM: 'SAPMATEMAST',
    SAM: 'STOCALLOMEMO',
    CCP1: 'CCP1FILTINSP',
    STVF: 'STORTANKVERI',
    BHTADD: 'BHTADDI',
    OPRPCCP: 'OPRPCCPFILT',
    STCI: 'STORTANKCLEA',
    WSV: 'WEIGSCALVERI',
  };
  const canonical = aliases[upper] ?? upper;
  return promotedProductionForms[canonical] ? canonical : 'EQUIPREINSP';
}

function formatDate(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-MY');
}

function formatValue(value: unknown) {
  if (value === undefined || value === null || value === '') return '-';
  if (typeof value === 'number') return value.toLocaleString('en-MY');
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) return formatDate(value);
  return String(value);
}

function getStatusLabel(record?: MainDBPRD) {
  if (!record?.statusKey) return '-';
  return MainDBPRDStatusKeyToLabel[record.statusKey] ?? displayChoiceLabel(record.statusKey, 'statusKey');
}

function FieldGrid({ fields }: { fields: Field[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {fields.map((field) => (
        <div key={field.label} className="space-y-1">
          <p className="text-xs font-medium uppercase text-muted-foreground">{field.label}</p>
          <p className="whitespace-pre-wrap break-words text-sm text-foreground">{formatValue(field.value)}</p>
        </div>
      ))}
    </div>
  );
}

function SectionCard({ title, fields }: { title: string; fields: Field[] }) {
  const visibleFields = fields.filter((field) => formatValue(field.value) !== '-');
  if (visibleFields.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGrid fields={visibleFields} />
      </CardContent>
    </Card>
  );
}

export default function ProductionFormDetailPage() {
  const { formCode, id } = useParams<{ formCode: string; id: string }>();
  const sharePointFormCode = normalizeFormCode(formCode);
  const formName = promotedProductionForms[sharePointFormCode];
  const { data: record, isLoading, error } = useQuery({
    queryKey: ['mainDBPRD-detail', id],
    queryFn: () => MainDBPRDService.get(String(id)),
    enabled: Boolean(id),
  });

  const formCodeMatches = !record || record.formCode === sharePointFormCode;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Button variant="ghost" size="sm" asChild className="w-fit">
        <Link to={`/production/forms/${sharePointFormCode}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {formName}
        </Link>
      </Button>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to read production record</AlertTitle>
          <AlertDescription>{error instanceof Error ? error.message : 'Record read failed.'}</AlertDescription>
        </Alert>
      ) : isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : !record ? (
        <Alert>
          <AlertTitle>Record not found</AlertTitle>
          <AlertDescription>The selected production record is not available.</AlertDescription>
        </Alert>
      ) : !formCodeMatches ? (
        <Alert variant="destructive">
          <AlertTitle>Form mismatch</AlertTitle>
          <AlertDescription>This record belongs to {record.formCode}, not {sharePointFormCode}.</AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight">{record.title}</h1>
              </div>
              <p className="text-sm text-muted-foreground">{formName} detail</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{record.formCode}</Badge>
              <Badge variant="secondary">{getStatusLabel(record)}</Badge>
            </div>
          </div>

          <SectionCard
            title="Record Summary"
            fields={[
              { label: 'Title', value: record.title },
              { label: 'Form Reference ID', value: record.formReferenceID },
              { label: 'Form Code', value: record.formCode },
              { label: 'Status', value: getStatusLabel(record) },
              { label: 'Site', value: record.siteKey ? MainDBPRDSiteKeyToLabel[record.siteKey] ?? displayChoiceLabel(record.siteKey, 'siteKey') : undefined },
              { label: 'Submitted On', value: record.submittedOn },
              { label: 'Current Stage', value: record.currentStage },
              { label: 'Priority', value: record.priority },
            ]}
          />

          <SectionCard
            title="Request"
            fields={[
              { label: 'Request Title', value: record.requestTitle },
              { label: 'Requested By', value: record.requestedBy },
              { label: 'Requestor Name', value: record.requestorDisplayName },
              { label: 'Requestor Email', value: record.requestorEmail },
              { label: 'Description', value: record.description },
              { label: 'Reason for Change', value: record.reasonForChange },
              { label: 'Urgency Reason', value: record.urgencyReason },
              { label: 'Due Date', value: record.dueDate },
              { label: 'Target Date', value: record.targetDate },
            ]}
          />

          <SectionCard
            title="Production Details"
            fields={[
              { label: 'Product Code', value: record.productCode },
              { label: 'Production Batch Number', value: record.productionBatchNumber },
              { label: 'Production Date', value: record.productionDate },
              { label: 'Product To Load', value: record.productToLoad },
              { label: 'Quantity MT', value: record.quantityMT },
              { label: 'System Code', value: record.systemCode },
              { label: 'Tank No', value: record.tankNo },
              { label: 'Shift Information', value: record.shiftInformation },
              { label: 'Last Immediate Product', value: record.lastImmediateProduct },
            ]}
          />

          <SectionCard
            title="Inspection and Quality"
            fields={[
              { label: 'Inspected By', value: record.inspectedBy },
              { label: 'Inspection Date', value: record.inspectionDate },
              { label: 'Inspection Time', value: record.inspectionTime },
              { label: 'Inspection Remarks', value: record.inspectionRemarks },
              { label: 'QC Approval By', value: record.qCApprovalBy },
              { label: 'QC Approval Date', value: record.qCApprovalDate },
              { label: 'QC Approval Status', value: record.qCApprovalStatus },
              { label: 'Corrective Action Summary', value: record.correctiveActionSummary },
              { label: 'Root Cause Summary', value: record.rootCauseSummary },
            ]}
          />

          <SectionCard
            title="Workflow"
            fields={[
              { label: 'Current Approver', value: record.currentApproverDisplayName },
              { label: 'Approver Email', value: record.currentApproverEmail },
              { label: 'Approver Group', value: record.currentApproverGroup },
              { label: 'Recipient HOD Email', value: record.recipientHODEmail },
              { label: 'Workflow Action', value: record.workflowAction },
              { label: 'Approver Remarks', value: record.approverRemarks },
              { label: 'Attachment Links', value: record.attachmentLinks },
            ]}
          />
        </>
      )}
    </div>
  );
}
