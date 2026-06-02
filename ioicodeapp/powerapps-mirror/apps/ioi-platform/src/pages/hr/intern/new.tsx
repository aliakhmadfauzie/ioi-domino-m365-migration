/** INTERN — New Internship Application Form */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Clock, Send, GraduationCap } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { MainDBHRService } from '@/services/main-dbhr-service';

export default function InternNewPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');          // → employeename
  const [ic, setIc] = useState('');              // → employeeid
  const [university, setUniversity] = useState(''); // → company
  const [course, setCourse] = useState('');      // → appliedPosition
  const [gpa, setGpa] = useState('');            // → remarks
  const [department, setDepartment] = useState('');
  const [supervisor, setSupervisor] = useState(''); // → backupPIC
  const [startDate, setStartDate] = useState('');  // → effectivedate
  const [endDate, setEndDate] = useState('');      // → duedate

  const handleSubmit = async (action: 'draft' | 'submit') => {
    if (action === 'submit' && !name.trim()) { toast.error('Name is required'); return; }
    if (action === 'submit' && !university.trim()) { toast.error('University is required'); return; }
    setSubmitting(true);
    try {
      await MainDBHRService.create({
        title: `INTERN-${format(new Date(), 'yyyyMMdd-HHmmss')}`,
        formcode: 'INTERN',
        currentaction: action === 'draft' ? 'Request' : 'Submitted',
        statusKey: action === 'draft' ? 'StatusKey0' : 'StatusKey1',
        employeename: name,
        employeeid: ic,
        company: university,
        appliedPosition: course,
        remarks: gpa ? `GPA: ${gpa}` : '',
        department,
        backupPIC: supervisor,
        effectivedate: startDate,
        duedate: endDate,
      } as any);
      toast.success(action === 'draft' ? 'Draft saved' : 'Application submitted');
      navigate('/hr/intern');
    } catch (err: any) { toast.error(err?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Internship Applications', href: '/hr/intern' }, { label: 'New' }]} />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/intern')}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-2xl font-bold tracking-tight">New Internship Application</h1>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><GraduationCap className="h-5 w-5" />Intern Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Full Name <span className="text-destructive">*</span></Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Full name as per IC" /></div>
            <div className="space-y-2"><Label>IC / Passport No.</Label><Input value={ic} onChange={e => setIc(e.target.value)} placeholder="e.g. 000101-14-1234" /></div>
            <div className="space-y-2"><Label>University <span className="text-destructive">*</span></Label><Input value={university} onChange={e => setUniversity(e.target.value)} placeholder="University name" /></div>
            <div className="space-y-2"><Label>Course / Programme</Label><Input value={course} onChange={e => setCourse(e.target.value)} placeholder="e.g. B.Eng Chemical Engineering" /></div>
            <div className="space-y-2"><Label>GPA / CGPA</Label><Input value={gpa} onChange={e => setGpa(e.target.value)} placeholder="e.g. 3.75" /></div>
            <div className="space-y-2"><Label>Department</Label><Input value={department} onChange={e => setDepartment(e.target.value)} placeholder="Host department" /></div>
            <div className="space-y-2"><Label>Supervisor</Label><Input value={supervisor} onChange={e => setSupervisor(e.target.value)} placeholder="Supervisor name" /></div>
            <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
            <div className="space-y-2"><Label>End Date</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/hr/intern')} disabled={submitting}>Cancel</Button>
        <Button variant="secondary" onClick={() => handleSubmit('draft')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />} Save Draft</Button>
        <Button onClick={() => handleSubmit('submit')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Submit</Button>
      </div>
    </motion.div>
  );
}
