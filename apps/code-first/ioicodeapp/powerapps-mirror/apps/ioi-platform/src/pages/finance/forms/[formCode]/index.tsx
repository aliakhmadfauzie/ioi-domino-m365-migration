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
import { useMainDBFINList } from '@/generated/hooks/use-main-dbfin';
import {
  MainDBFINSiteKeyToLabel,
  MainDBFINStatusKeyToLabel,
  type MainDBFIN,
} from '@/generated/models/main-dbfin-model';
import { displayChoiceLabel } from '@/lib/display-labels';

const promotedFinanceForms: Record<string, string> = {
  CAR: 'Capital Appropriation Request',
  CMF_A: 'Credit Management Forms',
  INSUCLAI: 'Insurance Claim',
  RSES: 'Reversal Service Entry Sheet',
  VENDREGIFINA: 'Vendor Registration Form (Finance & HR)',
  EARF: 'Expenditure Appropriation Request Form',
};

function normalizeFormCode(code?: string) {
  const upper = (code ?? 'CAR').toUpperCase();
  if (upper === 'CMF_B' || upper === 'CMF_C' || upper === 'CREDITREV' || upper === 'CREDITLIMIT' || upper === 'CREDITAPP') {
    return 'CMF_A';
  }
  return promotedFinanceForms[upper] ? upper : 'CAR';
}

function formatDate(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-MY');
}

function escapeOData(value: string) {
  return value.replace(/'/g, "''");
}

export default function FinanceFormDatabaseView() {
  const { formCode } = useParams<{ formCode: string }>();
  const sharePointFormCode = normalizeFormCode(formCode);
  const formName = promotedFinanceForms[sharePointFormCode];
  const { data = [], isLoading, error } = useMainDBFINList({
    filter: `FormCode eq '${escapeOData(sharePointFormCode)}'`,
    orderBy: 'SubmittedOn desc',
    top: 100,
  });

  const rows = data.filter((record: MainDBFIN) => record.formCode === sharePointFormCode);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" asChild className="w-fit">
            <Link to="/fin/forms">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Finance Forms
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">{formName}</h1>
              <Badge variant="outline">{sharePointFormCode}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Finance submission records</p>
          </div>
        </div>
        <Button asChild>
          <Link to={`/fin/forms/${sharePointFormCode}/new`}>
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
            <p className="text-lg font-semibold">Finance</p>
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
              <AlertTitle>Unable to read finance submissions</AlertTitle>
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
              <AlertDescription>No finance submissions are available for {formName}.</AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Request</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Requestor</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono">{row.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{MainDBFINStatusKeyToLabel[row.statusKey] ?? displayChoiceLabel(row.statusKey, 'statusKey')}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[260px] truncate">{row.requestTitle || row.appName || '-'}</TableCell>
                    <TableCell>{typeof row.amount === 'number' ? `RM ${row.amount.toLocaleString('en-MY')}` : '-'}</TableCell>
                    <TableCell>{row.siteKey ? MainDBFINSiteKeyToLabel[row.siteKey] ?? displayChoiceLabel(row.siteKey, 'siteKey') : '-'}</TableCell>
                    <TableCell>{formatDate(row.submittedOn)}</TableCell>
                    <TableCell>{row.requestorDisplayName || row.requestedBy || row.requestorEmail || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/fin/forms/${sharePointFormCode}/detail/${row.id}`}>
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
