import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Construction, ArrowLeft } from 'lucide-react';
import DynamicFormRenderer from '@/components/forms/dynamic-form-renderer';
import { getFormByCode } from '@/lib/it-forms-config';
import { getCompleteFormConfig } from '@/lib/form-sections-resolver';

interface NewITFormPageProps { formCodeOverride?: string; }

/**
 * Fallback page for IT forms that don't have a dedicated component yet.
 * Each form should have its own new.tsx in its own directory (e.g. forms/eaf/new.tsx).
 */
export default function NewITFormPage({ formCodeOverride }: NewITFormPageProps) {
  const { formCode: formCodeParam } = useParams<{ formCode: string }>();
  const formCode = (formCodeOverride || formCodeParam || '').toUpperCase();
  const baseConfig = getFormByCode(formCode);

  if (baseConfig && baseConfig.code !== 'ITSSR') {
    return <DynamicFormRenderer formConfig={getCompleteFormConfig(baseConfig)} />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardContent className="py-16 text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-muted mx-auto flex items-center justify-center">
            <Construction className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold">Form Not Available</h2>
          <p className="text-muted-foreground">
            The form <strong>{formCode}</strong> doesn't have a dedicated page yet.
          </p>
          <Link to="/it">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to IT
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
