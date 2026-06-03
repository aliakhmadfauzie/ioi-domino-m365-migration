import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, FileText, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MainDBMTNService } from '@/generated/services/main-dbmtn-service';
import {
  MainDBMTNDepartmentKeyToLabel,
  MainDBMTNSiteKeyToLabel,
  MainDBMTNStatusKeyToLabel,
  type MainDBMTN,
} from '@/generated/models/main-dbmtn-model';
import { displayChoiceLabel } from '@/lib/display-labels';

type Field = {
  label: string;
  value: unknown;
};

const routeFormMetadata: Record<string, { sharePointCode: string; title: string }> = {
  FAR: { sharePointCode: 'FAILANALREPO', title: 'Failure Analysis Report' },
  MTP: { sharePointCode: 'MAINPLAN', title: 'Maintenance Plan' },
  PMD: { sharePointCode: 'PLANMAINDOCU', title: 'Plant Maintenance Documentation' },
  MECP: { sharePointCode: 'MTNEMERCHAN', title: 'MTN Emergency Change Procedure' },
  EPI: { sharePointCode: 'EQUIPREINSP', title: 'Equipment Pre-Inspection' },
  FAILANALREPO: { sharePointCode: 'FAILANALREPO', title: 'Failure Analysis Report' },
  MAINPLAN: { sharePointCode: 'MAINPLAN', title: 'Maintenance Plan' },
  PLANMAINDOCU: { sharePointCode: 'PLANMAINDOCU', title: 'Plant Maintenance Documentation' },
  MTNEMERCHAN: { sharePointCode: 'MTNEMERCHAN', title: 'MTN Emergency Change Procedure' },
  EQUIPREINSP: { sharePointCode: 'EQUIPREINSP', title: 'Equipment Pre-Inspection' },
};

function normalizeRouteFormCode(code?: string) {
  const upper = (code ?? 'FAR').toUpperCase();
  return routeFormMetadata[upper] ? upper : 'FAR';
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

function getStatusLabel(record?: MainDBMTN) {
  if (!record?.currentStatus) return '-';
  return MainDBMTNStatusKeyToLabel[record.currentStatus as keyof typeof MainDBMTNStatusKeyToLabel] ?? displayChoiceLabel(record.currentStatus, 'currentStatus');
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

function MissingSourceMappingCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">MISSING_INFO: Source Sections Not Yet Mapped</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          The Penang and Johor Failure Analysis source artifacts identify request, entity detail,
          Maintenance reply, Production reply, verification/follow-up, withdrawn, and hidden/routing
          sections. The generated MTN model currently exposes only the parent MainDB_MTN fields shown
          above.
        </p>
        <p>
          Child row storage is expected under MainDB_MTN_Ext_FAILANALREPO_Rows, but the extension list
          model/service is not registered in this app source yet.
        </p>
      </CardContent>
    </Card>
  );
}

function ApprovalGuardrailCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldAlert className="h-5 w-5 text-amber-600" />
          Workflow Actions Pending Confirmation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          Source-analysis registers flag approval signals for Failure Analysis Report, but the
          actual CurrentAction values, approver roles, transition states, and authorized action rules
          are still marked Needs Human Confirmation.
        </p>
        <p>
          Approve, reject, verify, and withdraw buttons are intentionally not rendered on this page
          until those rules are confirmed against source evidence.
        </p>
      </CardContent>
    </Card>
  );
}

function getFormFields(record: MainDBMTN): Field[] {
  switch (record.formCode) {
    case 'FAILANALREPO':
      return [
        { label: 'FAR Equipment ID', value: record.fAREquipmentID },
        { label: 'Failure Date', value: record.fARFailureDate },
        { label: 'Failure Mode', value: record.fARFailureMode },
        { label: 'FAR Category', value: record.fARCategory },
        { label: 'Symptoms', value: record.fARSymptoms },
        { label: 'Root Cause', value: record.fARRootCause },
        { label: 'Impact', value: record.fARImpact },
        { label: 'Impact Description', value: record.fARImpactDescription },
        { label: 'Corrective Action', value: record.fARCorrectiveAction },
        { label: 'Preventive Action', value: record.fARPreventiveAction },
        { label: 'Downtime Hours', value: record.fARDownTimeHours },
        { label: 'Reported By', value: record.fARReportedBy },
        { label: 'Approved By', value: record.fARApprovedBy },
        { label: 'Closure Date', value: record.fARClosureDate },
      ];
    case 'MAINPLAN':
      return [
        { label: 'Plan No', value: record.mPPlanNo },
        { label: 'Equipment ID', value: record.mPEquipmentID },
        { label: 'Equipment Name', value: record.mPEquipmentName },
        { label: 'Interval Type', value: record.mPIntervalType },
        { label: 'Interval Value', value: record.mPIntervalValue },
        { label: 'Last Maintenance Date', value: record.mPLastDate },
        { label: 'Next Due Date', value: record.mPNextDueDate },
        { label: 'Work Type', value: record.mPWorkType },
        { label: 'Task Description', value: record.mPTaskDescription },
        { label: 'Assigned To', value: record.mPAssignedTo },
        { label: 'Estimated Hours', value: record.mPEstimatedHours },
        { label: 'Plan Status', value: record.mPStatus },
      ];
    case 'PLANMAINDOCU':
      return [
        { label: 'Document No', value: record.pMDocumentNo },
        { label: 'Document Title', value: record.pMTitle },
        { label: 'Document Type', value: record.pMType },
        { label: 'Related Equipment', value: record.pMEquipmentID },
        { label: 'Revision No', value: record.pMRevisionNo },
        { label: 'Effective Date', value: record.pMEffectiveDate },
        { label: 'Attachment', value: record.pMAttachment },
      ];
    case 'MTNEMERCHAN':
      return [
        { label: 'Emergency Change No', value: record.mECChangeNo },
        { label: 'Request Date', value: record.mECDate },
        { label: 'Affected Equipment', value: record.mECEquipmentID },
        { label: 'Change Description', value: record.mECChangeDescription },
        { label: 'Emergency Reason', value: record.mECReason },
        { label: 'Risk Assessment', value: record.mECRiskAssessment },
        { label: 'Authorized By', value: record.mECAuthorizedBy },
        { label: 'Completion Date', value: record.mECCompletionDate },
        { label: 'Closure Notes', value: record.mECClosureNotes },
      ];
    case 'EQUIPREINSP':
      return [
        { label: 'Equipment ID', value: record.ePIEquipmentID },
        { label: 'Equipment Name', value: record.ePIEquipmentName },
        { label: 'Inspection Date', value: record.ePIInspectionDate },
        { label: 'Inspector', value: record.ePIInspector },
        { label: 'Inspection Item', value: record.ePIItem },
        { label: 'Result', value: record.ePIResult },
        { label: 'Comment', value: record.ePIComment },
        { label: 'Next Inspection Date', value: record.ePINextInspectionDate },
        { label: 'Approved By', value: record.ePIApprovedBy },
      ];
    default:
      return [];
  }
}

export default function MTRFormDetailPage() {
  const { formCode, id } = useParams<{ formCode: string; id: string }>();
  const routeFormCode = normalizeRouteFormCode(formCode);
  const formMeta = routeFormMetadata[routeFormCode];
  const recordId = Number(id);
  const hasValidRecordId = Number.isInteger(recordId) && recordId > 0;
  const { data: records = [], isLoading, error } = useQuery({
    queryKey: ['mainDBMTN-detail', recordId],
    queryFn: () =>
      MainDBMTNService.getAll({
        filter: `ID eq ${recordId}`,
        top: 1,
      }),
    enabled: hasValidRecordId,
  });
  const record = records.find((item) => item.id === recordId);

  const formCodeMatches = !record || record.formCode === formMeta.sharePointCode;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Button variant="ghost" size="sm" asChild className="w-fit">
        <Link to={`/mtr/forms/${routeFormCode.toLowerCase()}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {formMeta.title}
        </Link>
      </Button>

      {!hasValidRecordId ? (
        <Alert variant="destructive">
          <AlertTitle>Invalid maintenance record</AlertTitle>
          <AlertDescription>The selected maintenance record ID is not a valid SharePoint item ID.</AlertDescription>
        </Alert>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to read maintenance record</AlertTitle>
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
          <AlertDescription>The selected maintenance record is not available.</AlertDescription>
        </Alert>
      ) : !formCodeMatches ? (
        <Alert variant="destructive">
          <AlertTitle>Form mismatch</AlertTitle>
          <AlertDescription>This record belongs to {record.formCode}, not {formMeta.sharePointCode}.</AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight">{record.title}</h1>
              </div>
              <p className="text-sm text-muted-foreground">{formMeta.title} detail</p>
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
              { label: 'Form Code', value: record.formCode },
              { label: 'Status', value: getStatusLabel(record) },
              { label: 'Site', value: record.siteKey ? MainDBMTNSiteKeyToLabel[record.siteKey] ?? displayChoiceLabel(record.siteKey, 'siteKey') : undefined },
              { label: 'Department', value: record.departmentKey ? MainDBMTNDepartmentKeyToLabel[record.departmentKey] ?? displayChoiceLabel(record.departmentKey, 'departmentKey') : undefined },
              { label: 'Submitted By', value: record.submittedBy },
              { label: 'Submitted Date', value: record.submittedDate },
              { label: 'Workflow Stage', value: record.workflflowStage },
              { label: 'Supervisor', value: record.supervisor },
            ]}
          />

          <SectionCard
            title="Equipment"
            fields={[
              { label: 'Equipment ID', value: record.equipmentID },
              { label: 'Equipment Name', value: record.equipmentName },
              { label: 'Location', value: record.location },
            ]}
          />

          <SectionCard title="Form Details" fields={getFormFields(record)} />

          <SectionCard title="Notes" fields={[{ label: 'Remarks', value: record.remarks }]} />

          {record.formCode === 'FAILANALREPO' ? (
            <>
              <MissingSourceMappingCard />
              <ApprovalGuardrailCard />
            </>
          ) : null}
        </>
      )}
    </div>
  );
}
