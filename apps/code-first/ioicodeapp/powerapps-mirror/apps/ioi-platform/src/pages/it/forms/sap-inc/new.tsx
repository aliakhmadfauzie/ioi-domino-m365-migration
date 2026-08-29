/**
 * SAP-INC — SAP Incident Report — Dedicated Form Page
 */
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { SAP_INC } from '@/lib/it-forms-config';
import DynamicFormRenderer from '@/components/forms/dynamic-form-renderer';

export default function SAPINCNewFormPage() {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/it/forms/sap-inc')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">SAP Incident Report</h1>
          <p className="text-sm text-muted-foreground mt-1">Report SAP system incidents and issues</p>
        </div>
      </div>
      <DynamicFormRenderer formConfig={SAP_INC} />
    </motion.div>
  );
}
