/**
 * DRD — New Duty Roster Database entry.
 * Writes confirmed DRD parent-list fields to MainDB_HR with FormCode = DRD.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Building2, CalendarDays, Loader2, Send, Users } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { EmployeePicker } from '@/components/employee-picker';
import { SharePointLookupSelect } from '@/components/sharepoint-lookup-select';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/hooks/use-user';
import { MainDBHRService } from '@/services/main-dbhr-service';
import {
  DRD_CATEGORIES,
  DRD_COMPANIES,
  DRD_FORM_CODE,
  DRD_SHIFT_CODES,
  logDRDWorkflowAction,
} from './drd-utils';

const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const CURRENT_YEAR = new Date().getFullYear();

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
} as const;

function DRDNewPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [submitting, setSubmitting] = useState(false);

  const [company, setCompany] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [section, setSection] = useState('');
  const [hosEmail, setHosEmail] = useState('');
  const [hodEmail, setHodEmail] = useState('');
  const [ccEmail, setCcEmail] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState(String(CURRENT_YEAR));
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [changes, setChanges] = useState('');

  const currentUserEmail = user?.email || user?.userPrincipalName || '';
  const currentUserName = user?.fullName || currentUserEmail || 'System';

  const handleSubmit = async () => {
    if (!currentUserEmail) { toast.error('User not authenticated'); return; }
    if (!company) { toast.error('Company is required'); return; }
    if (!category) { toast.error('Category is required'); return; }
    if (!department.trim()) { toast.error('Department is required'); return; }
    if (!section.trim()) { toast.error('Section is required'); return; }
    if (!employeeEmail) { toast.error('Employee name is required'); return; }
    if (!month) { toast.error('Month is required'); return; }
    if (!year || Number(year) < CURRENT_YEAR - 1) { toast.error('Enter a valid year'); return; }
    if (!hosEmail) { toast.error('Section Head is required'); return; }
    if (!hodEmail) { toast.error('Department Head is required'); return; }

    setSubmitting(true);
    try {
      const now = new Date().toISOString();
      const title = `DRD-${format(new Date(), 'yyyyMMdd-HHmmss')}`;
      const record = await MainDBHRService.create({
        title,
        formcode: DRD_FORM_CODE,
        requesttitle: title,
        requestedby: currentUserEmail,
        submittedon: now,
        statusKey: 'StatusKey1',
        currentstage: 'HOS Approval',
        currentaction: 'Submitted',
        department: 'HR',
        drdCompany: company,
        drdCategory: category,
        drdDepartment: department.trim(),
        drdSection: section.trim(),
        drdHOS: hosEmail,
        drdHOD: hodEmail,
        drdCC: ccEmail.trim(),
        drdMonth: Number(month),
        drdYear: Number(year),
        drdChanges: changes.trim(),
        drdEmpName: employeeEmail,
        drdSubmittedBy: currentUserEmail,
        drdSubmittedDate: now,
        drdHOSApp: false,
        drdHODApp: false,
        drdHRApp: false,
        drdCurrentAction: 'Submitted',
      } as any);

      await logDRDWorkflowAction({
        record: { ...(record as any), Title: title },
        actorName: currentUserName,
        actorEmail: currentUserEmail,
        stage: 'Submit',
        action: 'Submitted',
        newState: 'Submitted',
        comments: 'Duty roster submitted for HOS approval',
      });

      toast.success('Duty roster submitted');
      navigate('/hr/drd');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to submit duty roster');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 p-6">
      <HRBreadcrumb
        items={[
          { label: 'HR Dashboard', href: '/hr' },
          { label: 'Duty Roster', href: '/hr/drd' },
          { label: 'New' },
        ]}
      />

      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/drd')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Duty Roster</h1>
          <p className="text-sm text-muted-foreground mt-1">Monthly roster routed to HOS, HOD, then HR</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5" /> Section Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Company *</Label>
                <SharePointLookupSelect
                  kind="company"
                  value={company}
                  onChange={setCompany}
                  placeholder="Select company"
                  fallbackOptions={DRD_COMPANIES}
                />
              </div>

              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {DRD_CATEGORIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Department *</Label>
                <SharePointLookupSelect kind="department" value={department} onChange={setDepartment} placeholder="Select department" />
              </div>

              <div className="space-y-2">
                <Label>Section *</Label>
                <Input value={section} onChange={(e) => setSection(e.target.value)} placeholder="Section" />
              </div>

              <div className="space-y-2">
                <Label>Section Head *</Label>
                <EmployeePicker value={hosEmail} onChange={setHosEmail} placeholder="Select HOS..." showEmail />
              </div>

              <div className="space-y-2">
                <Label>Department Head *</Label>
                <EmployeePicker value={hodEmail} onChange={setHodEmail} placeholder="Select HOD..." showEmail />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>CC</Label>
                <Input value={ccEmail} onChange={(e) => setCcEmail(e.target.value)} placeholder="Email or distribution list" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="h-5 w-5" /> Roster Period
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Month *</Label>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger><SelectValue placeholder="Select month" /></SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((item) => (
                      <SelectItem key={item} value={item}>
                        {format(new Date(CURRENT_YEAR, Number(item) - 1, 1), 'MMMM')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Year *</Label>
                <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Employee Name *</Label>
                <EmployeePicker value={employeeEmail} onChange={setEmployeeEmail} placeholder="Search employee..." showEmail />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Changes Against Last Month</Label>
                <Textarea value={changes} onChange={(e) => setChanges(e.target.value)} rows={3} />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" /> Shift Code Reference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {DRD_SHIFT_CODES.map((shift) => (
                <div key={shift.code} className="rounded-md border px-3 py-2">
                  <div className="text-sm font-semibold">{shift.code}</div>
                  <div className="text-xs text-muted-foreground">{shift.hours}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/hr/drd')} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
          Submit
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default DRDNewPage;
