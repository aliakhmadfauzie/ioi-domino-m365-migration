/**
 * RS — Reset Password / Unlock ID — Dedicated Form Page
 * DynamicFormRenderer provides the full IOI-branded form layout with blue header, sections, and sidebar
 */
import { RS } from '@/lib/it-forms-config';
import DynamicFormRenderer from '@/components/forms/dynamic-form-renderer';

export default function RSNewFormPage() {
  return <DynamicFormRenderer formConfig={RS} />;
}
