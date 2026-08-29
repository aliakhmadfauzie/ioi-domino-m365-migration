/** HEALTHINFO — New Health Register Form (HRHealthRegister table) */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Clock, Send, Heart } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useCreateHRHealthRegister } from '@/generated/hooks/use-hrhealth-register';
import type { HRHealthRegisterSiteKey } from '@/generated/models/hr-health-register-model';

const HEALTH_ITEMS = ['Annual Medical Check-up', 'Typhoid Vaccination', 'Audiometry Test', 'Vision Test', 'Blood Pressure Screening', 'BMI Assessment', 'Other'];

export default function HealthInfoNewPage() {
  const navigate = useNavigate();
  const createMutation = useCreateHRHealthRegister();
  const [employeeNo, setEmployeeNo] = useState('');
  const [healthItem, setHealthItem] = useState('');
  const [result, setResult] = useState('');
  const [siteKey, setSiteKey] = useState<HRHealthRegisterSiteKey>('SiteKey0');

  const handleSubmit = async (action: 'draft' | 'submit') => {
    if (action === 'submit' && !employeeNo.trim()) { toast.error('Employee number is required'); return; }
    if (action === 'submit' && !healthItem) { toast.error('Health item is required'); return; }
    try {
      const recordNo = `HI-${format(new Date(), 'yyyyMMdd-HHmmss')}`;
      await createMutation.mutateAsync({
        title: recordNo,
        recordNo,
        employeeNo,
        healthItem,
        result,
        siteKey,
        statusKey: action === 'draft' ? 'StatusKey0' : 'StatusKey1',
      });
      toast.success(action === 'draft' ? 'Draft saved' : 'Record submitted');
      navigate('/hr/healthinfo');
    } catch (err: any) { toast.error(err?.message || 'Failed'); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Health Information', href: '/hr/healthinfo' }, { label: 'New' }]} />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/healthinfo')}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-2xl font-bold tracking-tight">New Health Information Record</h1>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Heart className="h-5 w-5" />Health Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Employee No. <span className="text-destructive">*</span></Label><Input value={employeeNo} onChange={e => setEmployeeNo(e.target.value)} placeholder="e.g. EMP-001" /></div>
            <div className="space-y-2">
              <Label>Site</Label>
              <Select value={siteKey} onValueChange={v => setSiteKey(v as HRHealthRegisterSiteKey)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SiteKey0">Prai</SelectItem>
                  <SelectItem value="SiteKey1">Johor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Health Item <span className="text-destructive">*</span></Label>
              <Select value={healthItem} onValueChange={setHealthItem}>
                <SelectTrigger><SelectValue placeholder="Select health item" /></SelectTrigger>
                <SelectContent>{HEALTH_ITEMS.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Result</Label><Input value={result} onChange={e => setResult(e.target.value)} placeholder="e.g. Normal, Pass, Fail" /></div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/hr/healthinfo')} disabled={createMutation.isPending}>Cancel</Button>
        <Button variant="secondary" onClick={() => handleSubmit('draft')} disabled={createMutation.isPending}>{createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />} Save Draft</Button>
        <Button onClick={() => handleSubmit('submit')} disabled={createMutation.isPending}>{createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Submit</Button>
      </div>
    </motion.div>
  );
}
