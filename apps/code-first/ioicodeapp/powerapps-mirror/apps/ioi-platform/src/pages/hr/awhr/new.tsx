/**
 * AWHR — New Rest Day & Additional Working Hours Requisition
 * HOS → HOD → HR 3-stage approval with 15-row working hours table
 * Parent: MainDB_HR (formcode: AWHR)
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Send, Plus, Trash2, User, Building2, Clock } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { EmployeePicker } from '@/components/employee-picker';
import { SharePointLookupSelect } from '@/components/sharepoint-lookup-select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useUser } from '@/hooks/use-user';
import { MainDBHRService } from '@/services/main-dbhr-service';

interface WHRow {
  id: number;
  empNo: string;
  name: string;
  category: string;
  dateFrom: string;
  dateTo: string;
  dayType: string;
  shift: string;
  addHours: string;
  totalHours: string;
}

const SHIFT_OPTIONS = ['OFC', 'OFO', 'N1', 'A1', 'A2', 'B1', 'C1', '7A1', '7A2', '7P1'] as const;
const DAY_TYPES = ['Weekday', 'Rest Day', 'Public Holiday'] as const;
const EXCEEDED_OPTIONS = [
  { id: 'e1', label: 'E1 — Exceeding 12 hrs/day' },
  { id: 'e2', label: 'E2 — Working on Rest Day' },
  { id: 'e3', label: 'E3 — Exceeding 60 hrs/week' },
  { id: 'e4', label: 'E4 — Exceeding 104 hrs/month' },
] as const;

function AWHRNewPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [submitting, setSubmitting] = useState(false);

  const [company, setCompany] = useState('');
  const [category, setCategory] = useState('');
  const [section, setSection] = useState('');
  const [dept, setDept] = useState('');
  const [hosEmail, setHosEmail] = useState('');
  const [hodEmail, setHodEmail] = useState('');
  const [ccEmail, setCcEmail] = useState('');
  const [remarks, setRemarks] = useState('');
  const [exceeded, setExceeded] = useState<string[]>([]);
  const [rows, setRows] = useState<WHRow[]>([]);

  const toggleExceeded = (id: string) => {
    setExceeded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const addRow = () => {
    setRows(prev => [...prev, {
      id: Date.now(),
      empNo: '', name: '', category: '',
      dateFrom: '', dateTo: '', dayType: '',
      shift: '', addHours: '', totalHours: '',
    }]);
  };

  const updateRow = (id: number, field: keyof WHRow, value: string) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeRow = (id: number) => {
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const handleSubmit = async () => {
    if (!hosEmail) { toast.error('HOS is required'); return; }
    if (!hodEmail) { toast.error('HOD is required'); return; }
    if (rows.length === 0) { toast.error('At least one working hours row is required'); return; }

    setSubmitting(true);
    try {
      const title = `AWHR-${format(new Date(), 'yyyyMMdd-HHmmss')}`;
      const now = new Date().toISOString();

      await MainDBHRService.create({
        title,
        formcode: 'AWHR',
        currentaction: 'Submitted',
        statusKey: 'StatusKey1',
        requestoremail: user?.email || user?.userPrincipalName || '',
        submitteddate: now,
        awhrCompany: company,
        awhrCategory: category,
        awhrSection: section,
        awhrDepartment: dept,
        awhrHOS: hosEmail,
        awhrHOD: hodEmail,
        awhrCC: ccEmail,
        awhrRemarks: remarks,
        awhrExceeded: exceeded.join('; '),
        awhrWorkingHours: JSON.stringify(rows),
        awhrSubmittedBy: user?.email || user?.userPrincipalName || '',
        awhrSubmittedDate: now,
        awhrCurrentAction: 'Submitted',
      } as any);

      toast.success('Working hours requisition submitted');
      navigate('/hr/awhr');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[
        { label: 'HR Dashboard', href: '/hr' },
        { label: 'Working Hours', href: '/hr/awhr' },
        { label: 'New Requisition' },
      ]} />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/awhr')}><ArrowLeft className="h-5 w-5" /></Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rest Day & Additional Working Hours</h1>
          <p className="text-sm text-muted-foreground mt-1">HOS → HOD → HR approval</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> Requisition Details</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2"><Label>Company</Label><SharePointLookupSelect kind="company" value={company} onChange={setCompany} placeholder="Select company" /></div>
            <div className="space-y-2"><Label>Category</Label><Input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" /></div>
            <div className="space-y-2"><Label>Section</Label><Input value={section} onChange={e => setSection(e.target.value)} placeholder="Section" /></div>
            <div className="space-y-2"><Label>Department</Label><SharePointLookupSelect kind="department" value={dept} onChange={setDept} placeholder="Select department" /></div>
            <div className="space-y-2"><Label>HOS *</Label><EmployeePicker value={hosEmail} onChange={e => setHosEmail(e)} placeholder="Select HOS..." /></div>
            <div className="space-y-2"><Label>HOD *</Label><EmployeePicker value={hodEmail} onChange={e => setHodEmail(e)} placeholder="Select HOD..." /></div>
            <div className="space-y-2"><Label>CC</Label><Input value={ccEmail} onChange={e => setCcEmail(e.target.value)} placeholder="CC email" /></div>
          </div>

          <div className="space-y-2">
            <Label>Exceeded Category Code</Label>
            <div className="grid grid-cols-2 gap-2">
              {EXCEEDED_OPTIONS.map(opt => (
                <div key={opt.id} className="flex items-center gap-2">
                  <Checkbox id={opt.id} checked={exceeded.includes(opt.id)} onCheckedChange={() => toggleExceeded(opt.id)} />
                  <Label htmlFor={opt.id} className="text-sm cursor-pointer">{opt.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2"><Label>Remarks</Label><Textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={2} /></div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Working Hours Table</Label>
              <Button variant="outline" size="sm" onClick={addRow}><Plus className="h-4 w-4 mr-1" /> Add Row</Button>
            </div>
            {rows.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center border rounded-md">Click "Add Row" to enter working hours</p>
            ) : (
              <div className="space-y-3">
                {rows.map((row, idx) => (
                  <Card key={row.id} className="border-dashed">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Row {idx + 1}</span>
                        <Button variant="ghost" size="icon" onClick={() => removeRow(row.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <Input placeholder="Emp No" value={row.empNo} onChange={e => updateRow(row.id, 'empNo', e.target.value)} size={6} />
                        <Input placeholder="Name" value={row.name} onChange={e => updateRow(row.id, 'name', e.target.value)} />
                        <Input placeholder="Category" value={row.category} onChange={e => updateRow(row.id, 'category', e.target.value)} />
                        <Input type="date" value={row.dateFrom} onChange={e => updateRow(row.id, 'dateFrom', e.target.value)} />
                        <Input type="date" value={row.dateTo} onChange={e => updateRow(row.id, 'dateTo', e.target.value)} />
                        <Select value={row.dayType} onValueChange={v => updateRow(row.id, 'dayType', v)}>
                          <SelectTrigger><SelectValue placeholder="Day type" /></SelectTrigger>
                          <SelectContent>{DAY_TYPES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select value={row.shift} onValueChange={v => updateRow(row.id, 'shift', v)}>
                          <SelectTrigger><SelectValue placeholder="Shift" /></SelectTrigger>
                          <SelectContent>{SHIFT_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                        <Input type="number" placeholder="Add Hours" value={row.addHours} onChange={e => updateRow(row.id, 'addHours', e.target.value)} />
                        <Input type="number" placeholder="Total Hours" value={row.totalHours} onChange={e => updateRow(row.id, 'totalHours', e.target.value)} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/hr/awhr')} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Submit
        </Button>
      </div>
    </motion.div>
  );
}

export default AWHRNewPage;
