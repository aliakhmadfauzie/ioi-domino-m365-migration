/**
 * EEN — New Employee Exit Notification Form
 * HOD → ED approval workflow with exit interview
 * Parent: MainDB_HR (formcode: EEN)
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Send, User, Building2, Calendar, FileText } from 'lucide-react';
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

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
} as const;

function EENNewPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [submitting, setSubmitting] = useState(false);

  // Employee Details
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState('');
  const [empType, setEmpType] = useState('');
  const [empName, setEmpName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empNo, setEmpNo] = useState('');
  const [position, setPosition] = useState('');
  const [section, setSection] = useState('');
  const [resignDate, setResignDate] = useState('');
  const [lastWorkDate, setLastWorkDate] = useState('');
  const [hodEmail, setHodEmail] = useState('');
  const [divHeadEmail, setDivHeadEmail] = useState('');
  const [remarks, setRemarks] = useState('');

  const handleSubmit = async () => {
    if (!empName) { toast.error('Employee name is required'); return; }
    if (!resignDate) { toast.error('Resignation date is required'); return; }
    if (!hodEmail) { toast.error('Superior/HOD is required'); return; }

    setSubmitting(true);
    try {
      const title = `EEN-${format(new Date(), 'yyyyMMdd-HHmmss')}`;
      const now = new Date().toISOString();

      await MainDBHRService.create({
        title,
        formcode: 'EEN',
        currentaction: 'Submitted',
        statusKey: 'StatusKey1',
        requestoremail: user?.email || user?.userPrincipalName || '',
        submitteddate: now,
        eenCompany: company,
        eenCategory: category,
        eenType: empType,
        eenEmpName: empName,
        eenEmpEmail: empEmail,
        eenEmpNo: empNo,
        eenPosition: position,
        eenSection: section,
        eenResignDate: resignDate,
        eenLastWorkDate: lastWorkDate,
        eenHOD: hodEmail,
        eenDivHead: divHeadEmail,
        eenRemarks: remarks,
        eenSubmittedBy: user?.email || user?.userPrincipalName || '',
        eenSubmittedDate: now,
        eenCurrentAction: 'Submitted',
      } as any);

      toast.success('Exit notification submitted');
      navigate('/hr/een');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 p-6">
      <HRBreadcrumb items={[
        { label: 'HR Dashboard', href: '/hr' },
        { label: 'Exit Notifications', href: '/hr/een' },
        { label: 'New Exit Notification' },
      ]} />

      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/een')}><ArrowLeft className="h-5 w-5" /></Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employee Exit Notification</h1>
          <p className="text-sm text-muted-foreground mt-1">HOD → ED approval workflow</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Employee Details</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><Label>Company</Label><Input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company" /></div>
              <div className="space-y-2"><Label>Category</Label><Input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" /></div>
              <div className="space-y-2"><Label>Type</Label><Input value={empType} onChange={e => setEmpType(e.target.value)} placeholder="Type" /></div>
              <div className="space-y-2"><Label>Employee Name *</Label><EmployeePicker value={empName} onChange={(email, emp) => { setEmpName(emp?.fullName || email); setEmpEmail(email); }} placeholder="Search employee..." /></div>
              <div className="space-y-2"><Label>Employee Email</Label><Input value={empEmail} onChange={e => setEmpEmail(e.target.value)} placeholder="Email" /></div>
              <div className="space-y-2"><Label>Employee No.</Label><Input value={empNo} onChange={e => setEmpNo(e.target.value)} placeholder="EMP-XXX" /></div>
              <div className="space-y-2"><Label>Position</Label><Input value={position} onChange={e => setPosition(e.target.value)} placeholder="Job title" /></div>
              <div className="space-y-2"><Label>Section</Label><Input value={section} onChange={e => setSection(e.target.value)} placeholder="Section" /></div>
              <div className="space-y-2"><Label>Effective Resignation Date *</Label><Input type="date" value={resignDate} onChange={e => setResignDate(e.target.value)} /></div>
              <div className="space-y-2"><Label>Last Working Date</Label><Input type="date" value={lastWorkDate} onChange={e => setLastWorkDate(e.target.value)} /></div>
              <div className="space-y-2"><Label>Superior / HOD *</Label><EmployeePicker value={hodEmail} onChange={(email) => setHodEmail(email)} placeholder="Select HOD..." /></div>
              <div className="space-y-2"><Label>Division Head</Label><EmployeePicker value={divHeadEmail} onChange={(email) => setDivHeadEmail(email)} placeholder="Select division head..." /></div>
              <div className="space-y-2 md:col-span-2"><Label>Remarks</Label><Textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={3} placeholder="Additional remarks" /></div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/hr/een')} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
          Submit
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default EENNewPage;
