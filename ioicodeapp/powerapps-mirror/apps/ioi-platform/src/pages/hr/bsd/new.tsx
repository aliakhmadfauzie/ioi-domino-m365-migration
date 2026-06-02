/**
 * BSD — New Backup Staff Assignment Form
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Clock, Send, Users } from 'lucide-react';
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
import { MainDBHRService } from '@/services/main-dbhr-service';

function BSDNewPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [empNo, setEmpNo] = useState('');
  const [position, setPosition] = useState('');
  const [division, setDivision] = useState('');
  const [dept, setDept] = useState('');
  const [section, setSection] = useState('');
  const [responsibility, setResponsibility] = useState('');
  const [remark, setRemark] = useState('');

  const handleSubmit = async (action: 'draft' | 'submit') => {
    setSubmitting(true);
    try {
      const title = `BSD-${format(new Date(), 'yyyyMMdd-HHmmss')}`;
      await MainDBHRService.create({
        title, formcode: 'BSD',
        currentaction: action === 'draft' ? 'Request' : 'Submitted',
        statusKey: action === 'draft' ? 'StatusKey0' : 'StatusKey1',
        employeename: staffName, employeeid: empNo,
        designation: position, divisons: division,
        department: dept, section,
        description: remark,
      } as any);
      toast.success(action === 'draft' ? 'Draft saved' : 'Submitted');
      navigate('/hr/bsd');
    } catch (err: any) { toast.error(err?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'Backup Staff', href: '/hr/bsd' }, { label: 'New' }]} />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/bsd')}><ArrowLeft className="h-5 w-5" /></Button>
        <div><h1 className="text-2xl font-bold tracking-tight">New Backup Staff Assignment</h1></div>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Users className="h-5 w-5" /> Staff Details</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2"><Label>Staff Name *</Label><EmployeePicker value={staffName} onChange={(email, emp) => setStaffName(emp?.fullName || email)} placeholder="Search staff..." /></div>
            <div className="space-y-2"><Label>Employee No.</Label><Input value={empNo} onChange={e => setEmpNo(e.target.value)} placeholder="e.g. EMP-001" /></div>
            <div className="space-y-2"><Label>Position</Label><Input value={position} onChange={e => setPosition(e.target.value)} placeholder="Position title" /></div>
            <div className="space-y-2"><Label>Division</Label><Select value={division} onValueChange={setDivision}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="Oleo">Oleo</SelectItem><SelectItem value="Acidchem">Acidchem</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Department</Label><Input value={dept} onChange={e => setDept(e.target.value)} placeholder="Department" /></div>
            <div className="space-y-2"><Label>Section</Label><Input value={section} onChange={e => setSection(e.target.value)} placeholder="Section" /></div>
            <div className="space-y-2 md:col-span-2"><Label>Responsibility</Label><Textarea value={responsibility} onChange={e => setResponsibility(e.target.value)} rows={2} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Remark</Label><Textarea value={remark} onChange={e => setRemark(e.target.value)} rows={2} /></div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/hr/bsd')} disabled={submitting}>Cancel</Button>
        <Button variant="secondary" onClick={() => handleSubmit('draft')} disabled={submitting}>
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />} Save Draft
        </Button>
        <Button onClick={() => handleSubmit('submit')} disabled={submitting}>
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Submit
        </Button>
      </div>
    </motion.div>
  );
}

export default BSDNewPage;
