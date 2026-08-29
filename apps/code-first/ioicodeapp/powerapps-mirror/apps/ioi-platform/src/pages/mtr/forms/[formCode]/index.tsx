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
import { useMainDBMTNList } from '@/generated/hooks/use-main-dbmtn';
import {
  MainDBMTNSiteKeyToLabel,
  MainDBMTNStatusKeyToLabel,
  type MainDBMTN,
} from '@/generated/models/main-dbmtn-model';
import { displayChoiceLabel } from '@/lib/display-labels';

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

function escapeOData(value: string) {
  return value.replace(/'/g, "''");
}

function getStatusLabel(row: MainDBMTN) {
  return MainDBMTNStatusKeyToLabel[row.currentStatus as keyof typeof MainDBMTNStatusKeyToLabel] ?? displayChoiceLabel(row.currentStatus, 'currentStatus');
}

function getEquipmentLabel(row: MainDBMTN) {
  return (
    row.equipmentID ||
    row.fAREquipmentID ||
    row.mPEquipmentID ||
    row.mECEquipmentID ||
    row.ePIEquipmentID ||
    row.pMEquipmentID ||
    '-'
  );
}

function getSummary(row: MainDBMTN) {
  return (
    row.equipmentName ||
    row.mPEquipmentName ||
    row.ePIEquipmentName ||
    row.pMTitle ||
    row.enMSTitle ||
    row.mECChangeDescription ||
    row.fARSymptoms ||
    row.remarks ||
    '-'
  );
}

export default function MTRFormDatabaseView() {
  const { formCode } = useParams<{ formCode: string }>();
  const routeFormCode = normalizeRouteFormCode(formCode);
  const formMeta = routeFormMetadata[routeFormCode];
  const { data = [], isLoading, error } = useMainDBMTNList({
    filter: `FormCode eq '${escapeOData(formMeta.sharePointCode)}'`,
    orderBy: 'SubmittedOn desc',
    top: 100,
  });

  const rows = data.filter((record: MainDBMTN) => record.formCode === formMeta.sharePointCode);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" asChild className="w-fit">
            <Link to="/mtr/forms">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Maintenance Forms
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">{formMeta.title}</h1>
              <Badge variant="outline">{formMeta.sharePointCode}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Maintenance submission records</p>
          </div>
        </div>
        <Button asChild>
          <Link to={`/mtr/forms/${routeFormCode.toLowerCase()}/new`}>
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
              {isLoading ? '-' : rows.filter((row) => getStatusLabel(row) === 'Submitted').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-2xl font-bold">
              {isLoading ? '-' : rows.filter((row) => getStatusLabel(row) === 'In Progress').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Register</p>
            <p className="text-lg font-semibold">Maintenance</p>
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
              <AlertTitle>Unable to read maintenance submissions</AlertTitle>
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
              <AlertDescription>No maintenance submissions are available for {formMeta.title}.</AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono">{row.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getStatusLabel(row)}</Badge>
                    </TableCell>
                    <TableCell>{getEquipmentLabel(row)}</TableCell>
                    <TableCell className="max-w-[320px] truncate">{getSummary(row)}</TableCell>
                    <TableCell>{row.siteKey ? MainDBMTNSiteKeyToLabel[row.siteKey] ?? displayChoiceLabel(row.siteKey, 'siteKey') : '-'}</TableCell>
                    <TableCell>{formatDate(row.submittedDate)}</TableCell>
                    <TableCell>{row.submittedBy || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/mtr/forms/${routeFormCode.toLowerCase()}/detail/${row.id}`}>
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
