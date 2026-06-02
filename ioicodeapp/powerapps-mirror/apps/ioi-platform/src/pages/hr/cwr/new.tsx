/**
 * CWR — New Contract Worker Requisition Form
 * Supports both Form (standard) and Form2 (enhanced with Div Head) workflows.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Clock, Send, Building2, Users, Calendar, User, FileText } from 'lucide-react';
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
import { MainDB_HR_Ext_CWRService } from '@/generated/services/main-dbhr-ext-cwr-service';

function CWRNewPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [useForm2, setUseForm2] = useState(false);

  // Form state
  const [category, setCategory] = useState('');
  const [reqType, setReqType] = useState('');
  const [requestorName, setRequestorName] = useState('');
  const [site, setSite] = useState('');
  const [noWorkers, setNoWorkers] = useState('');
  const [workstation, setWorkstation] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [justification, setJustification] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [period1From, setPeriod1From] = useState('');
  const [period1To, setPeriod1To] = useState('');

  // Form2 fields
  const [divHead, setDivHead] = useState('');

  const handleSubmit = async (action: 'draft' | 'submit') => {
    if (!user?.email) { toast.error('Not authenticated'); return; }
    if (action === 'submit' && !site) { toast.error('Please select a Site'); return; }

    setSubmitting(true);
    try {
      const now = new Date().toISOString();
      const title = `CWR-${format(new Date(), 'yyyyMMdd-HHmmss')}`;

      const parent = await MainDBHRService.create({
        title,
        formcode: 'CWR',
        formType: useForm2 ? 'CWR-F2' : 'CWR',
        requesttitle: `Contract Worker Request - ${site}`,
        entitysiteKey: site === 'Prai' ? ('SiteKey0' as any) : ('SiteKey1' as any),
        currentaction: action === 'draft' ? 'Request' : 'Submitted',
        statusKey: action === 'draft' ? ('StatusKey0' as any) : ('StatusKey1' as any),
        requestoremail: user.email,
        requestordisplayname: requestorName || (user as any)?.displayName || (user as any)?.DisplayName || user.email,
        description: justification,
      } as any);

      const parentId = (parent as any)?.id || (parent as any)?.ID;
      if (!parentId) throw new Error('Failed to create parent');

      await MainDB_HR_Ext_CWRService.create({
        Title: title,
        ParentRecord: String(parentId),
        cWRFormType: useForm2 ? 'Form2' : 'Form',
        cWRCategory: category,
        cWRType: reqType,
        cWRNoWorkers: noWorkers ? Number(noWorkers) : undefined,
        cWRWorkstation: workstation,
        cWRJobDescription: jobDesc,
        cWREffectiveDate: effectiveDate,
        cWRPeriod1From: period1From,
        cWRPeriod1To: period1To,
        cWRDivHead: useForm2 ? divHead : undefined,
        cWREditor1: user.email,
      } as any);

      toast.success(action === 'draft' ? 'Draft saved' : 'Request submitted');
      navigate('/hr/cwr');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'CWR', href: '/hr/cwr' }, { label: 'New Request' }]} />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/cwr')}><ArrowLeft className="h-5 w-5" /></Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Contract Worker Request</h1>
          <p className="text-sm text-muted-foreground mt-1">Submit a requisition for contract workers</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><Building2 className="h-5 w-5" /> Request Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground">Form version:</Label>
            <Button type="button" variant={!useForm2 ? 'default' : 'outline'} size="sm" onClick={() => setUseForm2(false)}>Standard</Button>
            <Button type="button" variant={useForm2 ? 'default' : 'outline'} size="sm" onClick={() => setUseForm2(true)}>Enhanced (w/ Div Head)</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Renewal">Renewal</SelectItem>
                  <SelectItem value="Extension">Extension</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Request Type *</Label>
              <Select value={reqType} onValueChange={setReqType}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Renewal">Renewal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Requestor Name</Label>
              <EmployeePicker value={requestorName} onChange={(email, emp) => setRequestorName(emp?.fullName || email)} placeholder="Search your name..." showEmail />
            </div>
            <div className="space-y-2">
              <Label>Site *</Label>
              <Select value={site} onValueChange={setSite}>
                <SelectTrigger><SelectValue placeholder="Select site" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Prai">Prai</SelectItem>
                  <SelectItem value="Johor">Johor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>No. of Workers</Label>
              <Input type="number" value={noWorkers} onChange={(e) => setNoWorkers(e.target.value)} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>Workstation</Label>
              <Input value={workstation} onChange={(e) => setWorkstation(e.target.value)} placeholder="Workstation location" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Job Description</Label>
              <Textarea value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} rows={3} placeholder="Describe the position..." />
            </div>
            <div className="space-y-2">
              <Label>Period From</Label>
              <Input type="date" value={period1From} onChange={(e) => setPeriod1From(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Period To</Label>
              <Input type="date" value={period1To} onChange={(e) => setPeriod1To(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Effective Date</Label>
              <Input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
            </div>
            {useForm2 && (
              <div className="space-y-2">
                <Label>Division Head</Label>
                <EmployeePicker value={divHead} onChange={(email) => setDivHead(email)} placeholder="Search Division Head..." showEmail showTitle />
              </div>
            )}
            <div className="space-y-2 md:col-span-2">
              <Label>Justification</Label>
              <Textarea value={justification} onChange={(e) => setJustification(e.target.value)} rows={3} placeholder="Why are these workers needed?" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3 justify-end">
        <Button variant="outline" onClick={() => navigate('/hr/cwr')} disabled={submitting}>Cancel</Button>
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

export default CWRNewPage;
