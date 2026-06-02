import { useState } from 'react';
import { ITSSRNewScreen } from '@/features/itssr/itssr-app';
import { FormSubmissionLayout, type FormConfig } from '@/components/forms/form-submission-layout';
import type { FormStep } from '@/components/multi-step-form';

const FORM_CONFIG: FormConfig = {
  code: 'ITSSR',
  name: 'IT Support & Service Request',
  basePath: '/it/forms/itssr',
  initialStatus: 'CurrentstatusKey30',
  initialStage: 1,
};

const FORM_STEPS: FormStep[] = [
  { id: '0', name: 'Request', description: 'Your request details' },
];

export default function ITSSRNewFormPage() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <FormSubmissionLayout
      formConfig={FORM_CONFIG}
      steps={FORM_STEPS}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      formData={{}}
      onFieldChange={() => {}}
      fields={[]}
      isSubmitting={false}
      onSubmit={async () => {}}
      submissionResult={null}
      notificationSent={false}
    >
      <ITSSRNewScreen />
    </FormSubmissionLayout>
  );
}
