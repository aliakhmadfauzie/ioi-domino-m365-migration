/**
 * DCAL (Data Center Access Log) / IAL2 — Dedicated Form Page
 */
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { IAL2 } from '@/lib/it-forms-config';
import DynamicFormRenderer from '@/components/forms/dynamic-form-renderer';

export default function DCALNewFormPage() {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/it/forms/dcal')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Data Center Access Log</h1>
          <p className="text-sm text-muted-foreground mt-1">Record data center access events (IAL2)</p>
        </div>
      </div>
      <DynamicFormRenderer formConfig={IAL2} />
    </motion.div>
  );
}
