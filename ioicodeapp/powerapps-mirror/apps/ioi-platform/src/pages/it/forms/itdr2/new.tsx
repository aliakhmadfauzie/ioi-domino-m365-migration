/**
 * ITDR2 - Outstanding Tasks Register
 * 
 * Tracks outstanding IT tasks with assignment, due dates, and status.
 * Data stored in MainDB_IT_Ext_Support (via parent record link to MainDB_IT)
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, ClipboardCheck, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import { useCreateMainDBIT } from '@/generated/hooks/use-main-dbit';
import { useCreateMainDBITExtSupport } from '@/generated/hooks/use-main-dbitext-support';
import type { MainDBITCurrentstatusKey } from '@/generated/models/main-dbit-model';

function generateRecordNo(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `ITDR2-${year}${month}-${seq}`;
}

const TASK_STATUSES = ['Open', 'In Progress', 'Completed', 'Closed', 'On Hold', 'Cancelled'] as const;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] as const;
const PRIORITIES = ['Low', 'Normal', 'High', 'Critical'] as const;

export default function ITDR2NewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const { mutateAsync: createMainDBIT, isPending } = useCreateMainDBIT();
  const { mutateAsync: createExtSupport, isPending: childPending } = useCreateMainDBITExtSupport();

  // Form fields
  const [TASK_Title, setTASK_Title] = useState('');
  const [TASK_Description, setTASK_Description] = useState('');
  const [TASK_AssignedTo, setTASK_AssignedTo] = useState('');
  const [TASK_DueDate, setTASK_DueDate] = useState('');
  const [TASK_Status, setTASK_Status] = useState('Open');
  const [TASK_Priority, setTASK_Priority] = useState('Normal');
  const [TASK_Year, setTASK_Year] = useState(String(new Date().getFullYear()));
  const [TASK_Month, setTASK_Month] = useState(MONTHS[new Date().getMonth()]);
  const [TASK_Remarks, setTASK_Remarks] = useState('');
  const [TASK_Category, setTASK_Category] = useState('');

  // Auto-fill year
  useEffect(() => {
    setTASK_Year(String(new Date().getFullYear()));
    setTASK_Month(MONTHS[new Date().getMonth()]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!TASK_Title.trim()) { toast.error('Task title is required'); return; }
    if (!TASK_AssignedTo.trim()) { toast.error('Assigned To is required'); return; }
    if (!TASK_DueDate) { toast.error('Due date is required'); return; }

    try {
      const recordNo = generateRecordNo();

      const parentRecord = await createMainDBIT({
        title: recordNo,
        formcode: 'ITDR2',
        currentStatus: 'CurrentstatusKey4' as MainDBITCurrentstatusKey,
        subject: TASK_Title.trim(),
        requestoremail: user?.userPrincipalName || '',
        submitteddate: new Date().toISOString(),
        workflowstage: 1,
        islocked: false,
      });

      await createExtSupport({
        title: `${recordNo}-task`,
        parentFormCode: 'ITDR2',
        parentRecord: { id: parentRecord.id, title: recordNo },
        parentSite: 'PRAI',
        iTDR2AssignedTo: TASK_AssignedTo.trim(),
        iTDR2DueDate: TASK_DueDate,
        iTDR2TaskDescription: TASK_Description.trim(),
        iTDR2TaskStatus: TASK_Status,
        iTDR2Year: TASK_Year,
        iTDR2Month: TASK_Month,
        iTDR2Title: TASK_Title.trim(),
        iTDR2Category: TASK_Category.trim(),
        iTDR2Priority: TASK_Priority,
        iTDR2Remarks: TASK_Remarks.trim(),
      });

      toast.success(`Outstanding Task submitted! Ref: ${recordNo}`);
      navigate('/it/forms/itdr2');
    } catch (error: unknown) {
      toast.error(`Failed to submit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="h-16 bg-primary px-6 flex items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => navigate('/it/forms/itdr2')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">Outstanding Tasks Register</h1>
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <span className="hover:text-white cursor-pointer" onClick={() => navigate('/it')}>IT</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">New Task</span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-3xl mx-auto">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] as const }}
          className="space-y-6"
        >
          {/* Task Details */}
          <Card className="border-border">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="flex items-center gap-2 text-[#003366]">
                <ClipboardCheck className="h-5 w-5" />
                Task Details
              </CardTitle>
              <CardDescription>Task identification and description</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-2">
                <Label>Task Title <span className="text-destructive">*</span></Label>
                <Input
                  value={TASK_Title}
                  onChange={e => setTASK_Title(e.target.value)}
                  placeholder="Brief title of the outstanding task"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={TASK_Description}
                  onChange={e => setTASK_Description(e.target.value)}
                  rows={4}
                  placeholder="Detailed description of the task"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    value={TASK_Category}
                    onChange={e => setTASK_Category(e.target.value)}
                    placeholder="e.g. Maintenance, Project, Support"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={TASK_Priority} onValueChange={setTASK_Priority}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignment */}
          <Card className="border-border">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="flex items-center gap-2 text-[#003366]">
                <User className="h-5 w-5" />
                Assignment & Timeline
              </CardTitle>
              <CardDescription>Task assignment and due dates</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-2">
                <Label>Assigned To <span className="text-destructive">*</span></Label>
                <Input
                  value={TASK_AssignedTo}
                  onChange={e => setTASK_AssignedTo(e.target.value)}
                  placeholder="Name or email of the assigned person"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Due Date <span className="text-destructive">*</span></Label>
                  <Input type="date" value={TASK_DueDate} onChange={e => setTASK_DueDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={TASK_Status} onValueChange={setTASK_Status}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TASK_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input value={TASK_Year} onChange={e => setTASK_Year(e.target.value)} placeholder="e.g. 2026" />
                </div>
                <div className="space-y-2">
                  <Label>Month</Label>
                  <Select value={TASK_Month} onValueChange={(value) => setTASK_Month(value as typeof MONTHS[number])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MONTHS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Remarks */}
          <Card className="border-border">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="flex items-center gap-2 text-[#003366]">
                <FileText className="h-5 w-5" />
                Remarks
              </CardTitle>
              <CardDescription>Additional notes or comments</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-2">
                <Label>Remarks</Label>
                <Textarea
                  value={TASK_Remarks}
                  onChange={e => setTASK_Remarks(e.target.value)}
                  rows={4}
                  placeholder="Additional notes, progress updates, or comments"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate('/it/forms/itdr2')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || childPending} className="bg-primary hover:bg-primary/90 text-white">
              {isPending || childPending ? 'Submitting...' : 'Submit Task'}
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
