import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Database,
  ExternalLink,
  FileCode2,
  Filter,
  KeyRound,
  ListChecks,
  MapPinned,
  Search,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HRLayout } from '@/components/hr/hr-layout';
import {
  HR_MIGRATION_APPS,
  HR_MIGRATION_BUILD_SEQUENCE,
  HR_MIGRATION_COMPLETION_RULES,
  getHRMigrationStats,
  type HRMigrationPriority,
  type HRMigrationSite,
} from '@/config/hr-migration-catalog';
import { cn } from '@/lib/utils';

const priorityStyles: Record<HRMigrationPriority, string> = {
  P1: 'border-destructive/30 bg-destructive/10 text-destructive',
  P2: 'border-amber-500/30 bg-amber-500/10 text-amber-700',
  P3: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700',
};

function MigrationStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: typeof Database;
}) {
  return (
    <Card className="rounded-lg">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function HRMigrationWorkbenchPage() {
  const [siteFilter, setSiteFilter] = useState<'all' | HRMigrationSite>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | HRMigrationPriority>('all');
  const [query, setQuery] = useState('');

  const filteredApps = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return HR_MIGRATION_APPS.filter((app) => {
      if (siteFilter !== 'all' && app.site !== siteFilter) return false;
      if (priorityFilter !== 'all' && app.priority !== priorityFilter) return false;
      if (!normalizedQuery) return true;
      return [app.database, app.nsfPath, app.area, app.riskNote, app.targetRoute]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedQuery));
    });
  }, [priorityFilter, query, siteFilter]);

  const stats = useMemo(() => getHRMigrationStats(HR_MIGRATION_APPS), []);
  const filteredStats = useMemo(() => getHRMigrationStats(filteredApps), [filteredApps]);
  const p1Apps = filteredApps.filter((app) => app.priority === 'P1');
  const gapApps = filteredApps.filter(
    (app) =>
      app.disabledAgents > 0 ||
      app.riskNote.toLowerCase().includes('missing') ||
      app.riskNote.toLowerCase().includes('template') ||
      app.riskNote.toLowerCase().includes('disposition'),
  );

  return (
    <HRLayout
      title="HR Migration Workbench"
      subtitle="Johor and Penang Notes-to-platform implementation control list"
      breadcrumbs={[
        { label: 'HR', href: '/hr' },
        { label: 'Migration Workbench' },
      ]}
      dataSource="XML_HR_Johor + XML_HR_Penang"
      recordCount={filteredApps.length}
    >
      <div className="space-y-6">
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <MigrationStat label="Source NSF" value={stats.total} icon={Database} />
          <MigrationStat label="P1 build items" value={stats.byPriority.P1} icon={AlertTriangle} />
          <MigrationStat label="DXL fields" value={stats.fields.toLocaleString()} icon={FileCode2} />
          <MigrationStat label="Enabled agents" value={stats.enabledAgents} icon={Workflow} />
          <MigrationStat label="Disabled agents" value={stats.disabledAgents} icon={KeyRound} />
        </section>

        <section className="rounded-lg border bg-card p-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                <h2 className="text-lg font-semibold">Implementation Queue</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {filteredStats.total} databases shown, {filteredStats.byPriority.P1} P1, {filteredStats.disabledAgents} disabled agents to review.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative min-w-[260px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search database, route, risk..."
                  className="pl-9"
                />
              </div>
              <Tabs value={siteFilter} onValueChange={(value) => setSiteFilter(value as 'all' | HRMigrationSite)}>
                <TabsList>
                  <TabsTrigger value="all">All sites</TabsTrigger>
                  <TabsTrigger value="Johor">Johor</TabsTrigger>
                  <TabsTrigger value="Penang">Penang</TabsTrigger>
                </TabsList>
              </Tabs>
              <Tabs
                value={priorityFilter}
                onValueChange={(value) => setPriorityFilter(value as 'all' | HRMigrationPriority)}
              >
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="P1">P1</TabsTrigger>
                  <TabsTrigger value="P2">P2</TabsTrigger>
                  <TabsTrigger value="P3">P3</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border">
            <div className="grid grid-cols-[0.7fr_0.7fr_2.4fr_1.2fr_0.8fr_0.9fr_2.8fr_0.8fr] bg-muted/60 px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              <span>Site</span>
              <span>Pri</span>
              <span>Database</span>
              <span>Area</span>
              <span>Fields</span>
              <span>Agents</span>
              <span>Accuracy note</span>
              <span>Route</span>
            </div>
            <div className="divide-y">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="grid grid-cols-[0.7fr_0.7fr_2.4fr_1.2fr_0.8fr_0.9fr_2.8fr_0.8fr] items-start gap-2 px-4 py-3 text-sm"
                >
                  <span className="font-medium">{app.site}</span>
                  <Badge variant="outline" className={cn('w-fit', priorityStyles[app.priority])}>
                    {app.priority}
                  </Badge>
                  <div>
                    <p className="font-semibold leading-snug">{app.database}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{app.nsfPath}</p>
                  </div>
                  <span className="text-muted-foreground">{app.area}</span>
                  <span className="tabular-nums">{app.fields.toLocaleString()}</span>
                  <span className="tabular-nums">
                    {app.enabledAgents}
                    {app.disabledAgents > 0 && <span className="text-destructive"> / {app.disabledAgents}</span>}
                  </span>
                  <span className="text-muted-foreground">{app.riskNote}</span>
                  {app.targetRoute ? (
                    <Button variant="ghost" size="sm" asChild className="h-8 justify-start px-2">
                      <Link to={app.targetRoute}>
                        Open
                        <ExternalLink className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  ) : (
                    <Badge variant="secondary" className="w-fit">TBD</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ListChecks className="h-5 w-5 text-primary" />
                Completion Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {HR_MIGRATION_COMPLETION_RULES.map((rule) => (
                <div key={rule} className="flex gap-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p>{rule}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPinned className="h-5 w-5 text-primary" />
                Build Sequence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {HR_MIGRATION_BUILD_SEQUENCE.map((step, index) => (
                <div key={step} className="flex gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <p>{step}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="h-5 w-5 text-primary" />
                First Build Targets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {p1Apps.slice(0, 8).map((app) => (
                <div key={app.id} className="flex items-center justify-between gap-3 rounded-md border p-3">
                  <div>
                    <p className="text-sm font-semibold">{app.database}</p>
                    <p className="text-xs text-muted-foreground">{app.site} · {app.area}</p>
                  </div>
                  {app.targetRoute && (
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={app.targetRoute} aria-label={`Open ${app.database}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Decisions Needed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {gapApps.slice(0, 10).map((app) => (
                <div key={app.id} className="rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={priorityStyles[app.priority]}>
                      {app.priority}
                    </Badge>
                    <p className="text-sm font-semibold">{app.database}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{app.riskNote}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </HRLayout>
  );
}
