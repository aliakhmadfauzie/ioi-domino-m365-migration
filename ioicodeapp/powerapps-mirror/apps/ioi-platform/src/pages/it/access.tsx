// M1: User & Access Management Module Home
// Uses the shared IT form configuration as the source of truth.

import { Key } from 'lucide-react';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import { DataReadyGuard } from '@/components/data-ready-guard';
import { ModuleHomeLayout, type ModuleQuickAction } from '@/components/it/module-home-layout';
import { M1_FORMS, type ITFormConfig } from '@/lib/it-forms-config';

const M1_FORM_CODES = M1_FORMS.map((form) => form.code);
const M1_FREQUENT_FORMS = new Set(['EAF', 'NIR', 'RS']);

function toQuickAction(form: ITFormConfig): ModuleQuickAction {
  const path = `/it/forms/${form.code.toLowerCase()}`;
  return {
    code: form.code,
    name: form.name,
    icon: form.icon,
    path,
    newPath: `${path}/new`,
    colorClass: form.code === 'RS' ? 'bg-accent' : form.code === 'SFAR' || form.code === 'UR' ? 'bg-secondary' : 'bg-primary',
    isFrequent: M1_FREQUENT_FORMS.has(form.code),
  };
}

const M1_QUICK_ACTIONS: ModuleQuickAction[] = M1_FORMS.map(toQuickAction);

function UserAccessModuleHomeContent() {
  const { data: submissions = [], isLoading, refetch } = useMainDBITList({
    orderBy: ['submitteddate desc'],
  });

  return (
    <ModuleHomeLayout
      moduleCode="M1"
      moduleName="User & Access Management"
      moduleDescription="Manage user accounts, VPN access, password resets, and folder permissions"
      moduleIcon={Key}
      colorClass="bg-primary"
      borderClass="border-l-primary"
      formCodes={M1_FORM_CODES}
      quickActions={M1_QUICK_ACTIONS}
      submissions={submissions}
      isLoading={isLoading}
      onRefresh={refetch}
    />
  );
}

export default function UserAccessModuleHomePage() {
  return (
    <DataReadyGuard loadingMessage="Loading User & Access dashboard...">
      <UserAccessModuleHomeContent />
    </DataReadyGuard>
  );
}
