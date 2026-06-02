// M4: SAP & Enterprise Systems Module Home
// Uses the shared IT form configuration as the source of truth.

import { Server } from 'lucide-react';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { DataReadyGuard } from '@/components/data-ready-guard';
import { ModuleHomeLayout, type ModuleQuickAction } from '@/components/it/module-home-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { M4_FORMS, type ITFormConfig } from '@/lib/it-forms-config';

const M4_FORM_CODES = M4_FORMS.map((form) => form.code);
const M4_FREQUENT_FORMS = new Set(['SAPAMR', 'SAPTR', 'SAPSOF2']);

function toQuickAction(form: ITFormConfig): ModuleQuickAction {
  const path = `/it/forms/${form.code.toLowerCase()}`;
  return {
    code: form.code,
    name: form.name,
    icon: form.icon,
    path,
    newPath: `${path}/new`,
    colorClass: form.code === 'SAPDRP' || form.code === 'SAPSLCF' ? 'bg-accent' : form.code === 'SAPCA' || form.code === 'SAPCR' ? 'bg-secondary' : 'bg-primary',
    isFrequent: M4_FREQUENT_FORMS.has(form.code),
  };
}

const M4_QUICK_ACTIONS: ModuleQuickAction[] = M4_FORMS.map(toQuickAction);

function SAPModuleHomeContent() {
  const { data: submissions = [], isLoading, refetch } = useMainDBITList({
    orderBy: ['submitteddate desc'],
  });

  return (
    <ModuleHomeLayout
      moduleCode="M4"
      moduleName="SAP & Enterprise Systems"
      moduleDescription="SAP access control, transport requests, and configuration management"
      moduleIcon={Server}
      colorClass="bg-primary"
      borderClass="border-l-primary"
      formCodes={M4_FORM_CODES}
      quickActions={M4_QUICK_ACTIONS}
      submissions={submissions}
      isLoading={isLoading}
      onRefresh={refetch}
    >
      {/* SAP-specific info section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">SAP Environment Info</CardTitle>
          <CardDescription>Active SAP clients and access levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-primary text-primary-foreground">IEP</Badge>
                <span className="font-medium">Production</span>
              </div>
              <p className="text-sm text-muted-foreground">SAP Production Client - Live data</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-secondary text-secondary-foreground">IEQ</Badge>
                <span className="font-medium">Quality</span>
              </div>
              <p className="text-sm text-muted-foreground">SAP QA Client - Testing & UAT</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-accent text-accent-foreground">IED</Badge>
                <span className="font-medium">Development</span>
              </div>
              <p className="text-sm text-muted-foreground">SAP Dev Client - Configuration</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </ModuleHomeLayout>
  );
}

export default function SAPModuleHomePage() {
  return (
    <DataReadyGuard loadingMessage="Loading SAP dashboard...">
      <SAPModuleHomeContent />
    </DataReadyGuard>
  );
}
