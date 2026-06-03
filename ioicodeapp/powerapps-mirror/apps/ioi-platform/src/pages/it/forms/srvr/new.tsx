/**
 * SRVR (Server Records) / IAL4 — Dedicated Form Page
 */
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { IAL4 } from '@/lib/it-forms-config';
import { getCompleteFormConfig } from '@/lib/form-sections-resolver';
import DynamicFormRenderer from '@/components/forms/dynamic-form-renderer';

export default function SRVRNewFormPage() {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/it/forms/srvr')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Server Record Analysis</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage server inventory and records (IAL4)</p>
        </div>
      </div>
      <DynamicFormRenderer formConfig={getCompleteFormConfig(IAL4)} />
    </motion.div>
  );
}
