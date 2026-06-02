/** HSE — New Health & Safety Report Form */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Clock, Send, Shield } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeePicker } from '@/components/employee-picker';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useUser } from '@/hooks/use-user';
import { MainDBHRService } from '@/services/main-dbhr-service';

const INCIDENT_TYPES = ['Near Miss', 'First Aid', 'Medical Treatment', 'Lost Time Injury', 'Property Damage', 'Environmental', 'Other'];

export default function HSENewPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [empName, setEmpName] = useState(user?.fullName || ''); // → employeename
  const [incidentDate, setIncidentDate] = useState(format(new Date(), 'yyyy-MM-dd')); // → effectivedate
  const [incidentType, setIncidentType] = useState('');  // → details
  const [location, setLocation] = useState('');          // → section
  const [descriptionText, setDescriptionText] = useState('');  // → description
  const [immediateAction, setImmediateAction] = useState('');   // → remarks

  const handleSubmit = async (action: 'draft' | 'submit') => {
    if (action === 'submit' && !incidentType) { toast.error('Incident type is required'); return; }
    if (action === 'submit' && !descriptionText.trim()) { toast.error('Description is required'); return; }
    setSubmitting(true);
    try {
      await MainDBHRService.create({
        title: `HSE-${format(new Date(), 'yyyyMMdd-HHmmss')}`,
        formcode: 'HSE',
        currentaction: action === 'draft' ? 'Request' : 'Submitted',
        statusKey: action === 'draft' ? 'StatusKey0' : 'StatusKey1',
        employeename: empName,
        effectivedate: incidentDate,
        details: incidentType,
        section: location,
        description: descriptionText,
        remarks: immediateAction,
        requestoremail: user?.userPrincipalName || '',
      } as any);
      toast.success(action === 'draft' ? 'Draft saved' : 'HSE report submitted');
      navigate('/hr/hse');
    } catch (err: any) { toast.error(err?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Health & Safety', href: '/hr/hse' }, { label: 'New' }]} />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/hse')}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-2xl font-bold tracking-tight">New Health & Safety Report</h1>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Shield className="h-5 w-5" />Incident Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Reporting Employee</Label><EmployeePicker value={empName} onChange={(_, emp) => setEmpName(emp?.fullName || empName)} placeholder="Search employee..." /></div>
            <div className="space-y-2"><Label>Incident Type <span className="text-destructive">*</span></Label>
              <Select value={incidentType} onValueChange={setIncidentType}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>{INCIDENT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Incident Date</Label><Input type="date" value={incidentDate} onChange={e => setIncidentDate(e.target.value)} /></div>
            <div className="space-y-2"><Label>Location</Label><Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Where did it occur?" /></div>
            <div className="space-y-2 md:col-span-2"><Label>Description <span className="text-destructive">*</span></Label><Textarea value={descriptionText} onChange={e => setDescriptionText(e.target.value)} rows={4} placeholder="Describe what happened in detail..." /></div>
            <div className="space-y-2 md:col-span-2"><Label>Immediate Action Taken</Label><Textarea value={immediateAction} onChange={e => setImmediateAction(e.target.value)} rows={2} placeholder="What immediate steps were taken?" /></div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/hr/hse')} disabled={submitting}>Cancel</Button>
        <Button variant="secondary" onClick={() => handleSubmit('draft')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />} Save Draft</Button>
        <Button onClick={() => handleSubmit('submit')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Submit Report</Button>
      </div>
    </motion.div>
  );
}
