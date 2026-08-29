// M3: Hardware & Infrastructure Module Home
// Uses the shared IT form configuration as the source of truth.

import { HardDrive, Server } from 'lucide-react';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { DataReadyGuard } from '@/components/data-ready-guard';
import { ModuleHomeLayout, type ModuleQuickAction } from '@/components/it/module-home-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { M3_FORMS, type ITFormConfig } from '@/lib/it-forms-config';

const M3_FORM_CODES = M3_FORMS.map((form) => form.code);
const M3_FREQUENT_FORMS = new Set(['HI', 'SRVR']);

function toQuickAction(form: ITFormConfig): ModuleQuickAction {
  const path = `/it/forms/${form.code.toLowerCase()}`;
  return {
    code: form.code,
    name: form.name,
    icon: form.icon,
    path,
    newPath: `${path}/new`,
    colorClass: form.code === 'HI' || form.code === 'SRVR' ? 'bg-accent' : 'bg-secondary',
    isFrequent: M3_FREQUENT_FORMS.has(form.code),
  };
}

const M3_QUICK_ACTIONS: ModuleQuickAction[] = M3_FORMS.map(toQuickAction);

function HardwareModuleHomeContent() {
  const { data: submissions = [], isLoading, refetch } = useMainDBITList({
    orderBy: ['submitteddate desc'],
  });

  return (
    <ModuleHomeLayout
      moduleCode="M3"
      moduleName="Hardware & Infrastructure"
      moduleDescription="Manage IT assets, hardware inventory, and infrastructure audits"
      moduleIcon={HardDrive}
      colorClass="bg-accent"
      borderClass="border-l-accent"
      formCodes={M3_FORM_CODES}
      quickActions={M3_QUICK_ACTIONS}
      submissions={submissions}
      isLoading={isLoading}
      onRefresh={refetch}
    >
      {/* Hardware-specific analytics section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Hardware Tools</CardTitle>
          <CardDescription>Quick access to hardware management dashboards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/it/hardware-dashboard">
              <div className="p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                      <HardDrive className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Hardware Dashboard</p>
                      <p className="text-sm text-muted-foreground">View asset inventory & status</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </Link>
            <Link to="/it/disaster">
              <div className="p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-destructive flex items-center justify-center">
                      <Server className="h-5 w-5 text-destructive-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Disaster Recovery</p>
                      <p className="text-sm text-muted-foreground">DR procedures & checklists</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </ModuleHomeLayout>
  );
}

export default function HardwareModuleHomePage() {
  return (
    <DataReadyGuard loadingMessage="Loading Hardware dashboard...">
      <HardwareModuleHomeContent />
    </DataReadyGuard>
  );
}
