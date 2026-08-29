import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Database, Eye, Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMainDBPRDList } from '@/generated/hooks/use-main-dbprd';
import {
  MainDBPRDSiteKeyToLabel,
  MainDBPRDStatusKeyToLabel,
  type MainDBPRD,
} from '@/generated/models/main-dbprd-model';
import { displayChoiceLabel } from '@/lib/display-labels';

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

function escapeOData(value: string) {
  return value.replace(/'/g, "''");
}

export default function ProductionFormDatabaseView() {
  const { formCode } = useParams<{ formCode: string }>();
  const sharePointFormCode = normalizeFormCode(formCode);
  const formName = promotedProductionForms[sharePointFormCode];
  const { data = [], isLoading, error } = useMainDBPRDList({
    filter: `FormCode eq '${escapeOData(sharePointFormCode)}'`,
    orderBy: 'SubmittedOn desc',
    top: 100,
  });

  const rows = data.filter((record: MainDBPRD) => record.formCode === sharePointFormCode);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" asChild className="w-fit">
            <Link to="/production/forms">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Production Forms
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">{formName}</h1>
              <Badge variant="outline">{sharePointFormCode}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Production submission records</p>
          </div>
        </div>
        <Button asChild>
          <Link to={`/production/forms/${sharePointFormCode}/new`}>
            <Plus className="mr-2 h-4 w-4" />
            New Submission
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Rows</p>
            <p className="text-2xl font-bold">{isLoading ? '-' : rows.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Submitted</p>
            <p className="text-2xl font-bold">
              {isLoading ? '-' : rows.filter((row) => row.statusKey === 'StatusKey1').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-2xl font-bold">
              {isLoading ? '-' : rows.filter((row) => row.statusKey === 'StatusKey3').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Register</p>
            <p className="text-lg font-semibold">Production</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Submission Records</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Unable to read production submissions</AlertTitle>
              <AlertDescription>{error instanceof Error ? error.message : 'Submission read failed.'}</AlertDescription>
            </Alert>
          ) : isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : rows.length === 0 ? (
            <Alert>
              <AlertTitle>No submissions found</AlertTitle>
              <AlertDescription>No production submissions are available for {formName}.</AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Form Reference</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Request</TableHead>
                  <TableHead>Product/System</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono">{row.title}</TableCell>
                    <TableCell className="font-mono">{row.formReferenceID}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{MainDBPRDStatusKeyToLabel[row.statusKey] ?? displayChoiceLabel(row.statusKey, 'statusKey')}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[260px] truncate">{row.requestTitle || row.appName || '-'}</TableCell>
                    <TableCell>{row.productCode || row.systemCode || row.tankNo || '-'}</TableCell>
                    <TableCell>{row.quantityMT || '-'}</TableCell>
                    <TableCell>{row.siteKey ? MainDBPRDSiteKeyToLabel[row.siteKey] ?? displayChoiceLabel(row.siteKey, 'siteKey') : '-'}</TableCell>
                    <TableCell>{formatDate(row.submittedOn || row.productionDate || row.inspectionDate)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/production/forms/${sharePointFormCode}/detail/${row.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
