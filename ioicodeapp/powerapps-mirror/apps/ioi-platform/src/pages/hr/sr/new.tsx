/** SR — New Staff Requisition Form */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Clock, Send, Briefcase } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { MainDBHRService } from '@/services/main-dbhr-service';

export default function SRNewPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [position, setPosition] = useState('');       // → vacancyTitle
  const [grade, setGrade] = useState('');             // → jobdesignation
  const [department, setDepartment] = useState('');
  const [headcount, setHeadcount] = useState('1');    // → details
  const [replacementFor, setReplacementFor] = useState(''); // → remarks
  const [dateRequired, setDateRequired] = useState('');     // → duedate
  const [reason, setReason] = useState('');           // → description
  const [priority, setPriority] = useState('Medium');

  const handleSubmit = async (action: 'draft' | 'submit') => {
    if (action === 'submit' && !position.trim()) { toast.error('Position is required'); return; }
    if (action === 'submit' && !department.trim()) { toast.error('Department is required'); return; }
    setSubmitting(true);
    try {
      await MainDBHRService.create({
        title: `SR-${format(new Date(), 'yyyyMMdd-HHmmss')}`,
        formcode: 'SR',
        currentaction: action === 'draft' ? 'Request' : 'Submitted',
        statusKey: action === 'draft' ? 'StatusKey0' : 'StatusKey1',
        vacancyTitle: position,
        jobdesignation: grade,
        department,
        details: `Headcount: ${headcount}`,
        remarks: replacementFor ? `Replacement for: ${replacementFor}` : '',
        duedate: dateRequired,
        description: reason,
        priority,
      } as any);
      toast.success(action === 'draft' ? 'Draft saved' : 'Submitted for HOD approval');
      navigate('/hr/sr');
    } catch (err: any) { toast.error(err?.message || 'Failed to submit'); }
    finally { setSubmitting(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Staff Requisitions', href: '/hr/sr' }, { label: 'New' }]} />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/sr')}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-2xl font-bold tracking-tight">New Staff Requisition</h1>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Briefcase className="h-5 w-5" />Position Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Position <span className="text-destructive">*</span></Label><Input value={position} onChange={e => setPosition(e.target.value)} placeholder="e.g. Senior Process Engineer" /></div>
            <div className="space-y-2"><Label>Grade / Level</Label><Input value={grade} onChange={e => setGrade(e.target.value)} placeholder="e.g. E3, M2" /></div>
            <div className="space-y-2"><Label>Department <span className="text-destructive">*</span></Label><Input value={department} onChange={e => setDepartment(e.target.value)} placeholder="Department name" /></div>
            <div className="space-y-2"><Label>Headcount</Label><Input type="number" min={1} value={headcount} onChange={e => setHeadcount(e.target.value)} /></div>
            <div className="space-y-2"><Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Low">Low</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="High">High</SelectItem><SelectItem value="Urgent">Urgent</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Date Required By</Label><Input type="date" value={dateRequired} onChange={e => setDateRequired(e.target.value)} /></div>
            <div className="space-y-2"><Label>Replacement For (if applicable)</Label><Input value={replacementFor} onChange={e => setReplacementFor(e.target.value)} placeholder="Name of departing employee" /></div>
            <div className="space-y-2 md:col-span-2"><Label>Reason / Justification <span className="text-destructive">*</span></Label><Textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} placeholder="Explain why this position is needed" /></div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/hr/sr')} disabled={submitting}>Cancel</Button>
        <Button variant="secondary" onClick={() => handleSubmit('draft')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />} Save Draft</Button>
        <Button onClick={() => handleSubmit('submit')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Submit</Button>
      </div>
    </motion.div>
  );
}
