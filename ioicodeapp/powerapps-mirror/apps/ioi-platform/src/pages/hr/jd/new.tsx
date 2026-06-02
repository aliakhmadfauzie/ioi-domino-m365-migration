/** JD — New Job Description Form */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Clock, Send, ClipboardList } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { MainDBHRService } from '@/services/main-dbhr-service';

export default function JDNewPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [position, setPosition] = useState('');          // → vacancyTitle
  const [grade, setGrade] = useState('');                // → jobdesignation
  const [department, setDepartment] = useState('');
  const [reportsTo, setReportsTo] = useState('');        // → details
  const [purpose, setPurpose] = useState('');            // → description
  const [responsibilities, setResponsibilities] = useState(''); // → remarks
  const [requirements, setRequirements] = useState('');  // stored in profileDetails

  const handleSubmit = async (action: 'draft' | 'submit') => {
    if (action === 'submit' && !position.trim()) { toast.error('Position is required'); return; }
    setSubmitting(true);
    try {
      await MainDBHRService.create({
        title: `JD-${format(new Date(), 'yyyyMMdd-HHmmss')}`,
        formcode: 'JD',
        currentaction: action === 'draft' ? 'Draft' : 'Submitted',
        statusKey: action === 'draft' ? 'StatusKey0' : 'StatusKey1',
        vacancyTitle: position,
        jobdesignation: grade,
        department,
        details: reportsTo ? `Reports To: ${reportsTo}` : '',
        description: purpose,
        remarks: responsibilities,
        profileDetails: requirements,
      } as any);
      toast.success(action === 'draft' ? 'Draft saved' : 'Submitted for review');
      navigate('/hr/jd');
    } catch (err: any) { toast.error(err?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Job Descriptions', href: '/hr/jd' }, { label: 'New' }]} />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/jd')}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-2xl font-bold tracking-tight">New Job Description</h1>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><ClipboardList className="h-5 w-5" />Job Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Position <span className="text-destructive">*</span></Label><Input value={position} onChange={e => setPosition(e.target.value)} placeholder="Job title" /></div>
            <div className="space-y-2"><Label>Grade / Level</Label><Input value={grade} onChange={e => setGrade(e.target.value)} placeholder="e.g. E3, M2" /></div>
            <div className="space-y-2"><Label>Department</Label><Input value={department} onChange={e => setDepartment(e.target.value)} placeholder="Department" /></div>
            <div className="space-y-2"><Label>Reports To</Label><Input value={reportsTo} onChange={e => setReportsTo(e.target.value)} placeholder="Direct supervisor title" /></div>
            <div className="space-y-2 md:col-span-2"><Label>Job Purpose</Label><Textarea value={purpose} onChange={e => setPurpose(e.target.value)} rows={2} placeholder="Brief summary of the role's purpose" /></div>
            <div className="space-y-2 md:col-span-2"><Label>Key Responsibilities</Label><Textarea value={responsibilities} onChange={e => setResponsibilities(e.target.value)} rows={5} placeholder="List main duties and responsibilities..." /></div>
            <div className="space-y-2 md:col-span-2"><Label>Requirements</Label><Textarea value={requirements} onChange={e => setRequirements(e.target.value)} rows={4} placeholder="Education, experience, skills required..." /></div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/hr/jd')} disabled={submitting}>Cancel</Button>
        <Button variant="secondary" onClick={() => handleSubmit('draft')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />} Save Draft</Button>
        <Button onClick={() => handleSubmit('submit')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Submit</Button>
      </div>
    </motion.div>
  );
}
