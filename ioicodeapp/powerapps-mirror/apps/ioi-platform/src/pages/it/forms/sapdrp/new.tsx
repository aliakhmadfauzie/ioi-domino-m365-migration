import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, FileText } from 'lucide-react';
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
import { useCreateMainDBITExtDocs } from '@/generated/hooks/use-main-dbitext-docs';
import type { MainDBITCurrentstatusKey } from '@/generated/models/main-dbit-model';
import type { MainDBITExtDocs } from '@/generated/models/main-dbit-ext-docs-model';
import { EmployeePicker } from '@/components/employee-picker';
import { SharePointLookupSelect } from '@/components/sharepoint-lookup-select';

const SAPDRP_SELECTION1 = ['Draft', 'For Review', 'Approved', 'Superseded', 'Obsolete'] as const;

function generateRecordNo(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `SAPDRP-${year}${month}-${seq}`;
}

export default function SAPDRPNewFormPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const { mutateAsync: createMainDBIT, isPending } = useCreateMainDBIT();
  const { mutateAsync: createExtDocs, isPending: extDocsPending } = useCreateMainDBITExtDocs();

  // Section A: Header
  const [HDR_TimeCreated, setHDR_TimeCreated] = useState('');
  const [HDR_Title, setHDR_Title] = useState('');
  const [HDR_Category, setHDR_Category] = useState('');
  const [HDR_EffectDate, setHDR_EffectDate] = useState('');
  const [HDR_Revision, setHDR_Revision] = useState('');
  const [HDR_Dept, setHDR_Dept] = useState('');
  const [HDR_Team, setHDR_Team] = useState('');
  const [HDR_Selection1, setHDR_Selection1] = useState('');
  const [HDR_AppBy, setHDR_AppBy] = useState('');
  const [HDR_Distributed, setHDR_Distributed] = useState('');

  // Section B: Body
  const [BODY_Body, setBODY_Body] = useState('');
  const [BODY_Comments, setBODY_Comments] = useState('');

  useEffect(() => {
    setHDR_TimeCreated(new Date().toISOString());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!HDR_Title.trim()) { toast.error('Title is required'); return; }
    if (!HDR_Category.trim()) { toast.error('Category is required'); return; }
    if (!HDR_EffectDate) { toast.error('Effective Date is required'); return; }
    if (!HDR_Revision.trim()) { toast.error('Revision is required'); return; }
    if (!HDR_Dept.trim()) { toast.error('Department is required'); return; }
    if (!HDR_Team.trim()) { toast.error('Team is required'); return; }
    if (!HDR_Selection1) { toast.error('Selection/Status is required'); return; }
    if (!HDR_AppBy.trim()) { toast.error('Approved By is required'); return; }
    if (!BODY_Body.trim()) { toast.error('Document body is required'); return; }

    try {
      const recordNo = generateRecordNo();
      const created = await createMainDBIT({
        title: recordNo,
        formcode: 'SAPDRP',
        currentStatus: 'sent',
        requestoremail: user?.userPrincipalName || '',
        submitteddate: new Date().toISOString(),
        workflowstage: 1,
        currentAction: HDR_Selection1,
        subject: HDR_Title.trim(),
        requestorName: HDR_AppBy,
        company: HDR_Dept,
      });

      if (created?.id) {
        const extDocsData: Omit<MainDBITExtDocs, 'id'> = {
          title: `${recordNo}-docs`,
          parentFormCode: 'SAPDRP',
          parentRecord: { id: created.id, title: recordNo },
          parentSite: 'PRAI',
          iTPDocType: HDR_Category.trim(),
          iTPDocTitle: HDR_Title.trim(),
          iTPDateLastUpdated: HDR_EffectDate,
          iTPRevisionNo: HDR_Revision.trim(),
          iTPApplicableTo: [HDR_Dept, HDR_Team].filter(Boolean).join(' / '),
          iTPComments: [
            `Created: ${HDR_TimeCreated}`,
            `Status: ${HDR_Selection1}`,
            `Approved By: ${HDR_AppBy}`,
            HDR_Distributed ? `Distributed: ${HDR_Distributed}` : '',
            BODY_Body,
            BODY_Comments,
          ].filter(Boolean).join('\n'),
        };
        await createExtDocs(extDocsData);
      }
      toast.success(`SAP DRP Procedure submitted! Ref: ${recordNo}`);
      navigate('/it/forms/sapdrp');
    } catch (error: unknown) {
      toast.error(`Failed to submit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="h-16 bg-primary px-6 flex items-center">
        <div className="flex items-center gap-4">
          <Link to="/it/forms/sapdrp">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">SAP DRP Procedure</h1>
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <Link to="/it" className="hover:text-white">IT</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">New SAP DRP</span>
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
          {/* Section A: Header */}
          <Card className="border-border">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="flex items-center gap-2 text-[#003366]">
                <FileText className="h-5 w-5" />
                Section A — Document Header
              </CardTitle>
              <CardDescription>Document identification and classification</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">

              <div className="space-y-2">
                <Label>Created Date</Label>
                <Input
                  value={HDR_TimeCreated ? new Date(HDR_TimeCreated).toLocaleString() : ''}
                  readOnly
                  className="bg-muted/50 text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground">Auto-populated</p>
              </div>

              <div className="space-y-2">
                <Label>Title <span className="text-destructive">*</span></Label>
                <Input
                  value={HDR_Title}
                  onChange={e => setHDR_Title(e.target.value)}
                  placeholder="Document title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category <span className="text-destructive">*</span></Label>
                  <Input
                    value={HDR_Category}
                    onChange={e => setHDR_Category(e.target.value)}
                    placeholder="Document category"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Effective Date <span className="text-destructive">*</span></Label>
                  <Input type="date" value={HDR_EffectDate} onChange={e => setHDR_EffectDate(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Revision <span className="text-destructive">*</span></Label>
                  <Input
                    value={HDR_Revision}
                    onChange={e => setHDR_Revision(e.target.value)}
                    placeholder="e.g., Rev 1.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Selection / Status <span className="text-destructive">*</span></Label>
                  <Select value={HDR_Selection1} onValueChange={setHDR_Selection1}>
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      {SAPDRP_SELECTION1.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Department <span className="text-destructive">*</span></Label>
                  <SharePointLookupSelect
                    kind="department"
                    value={HDR_Dept}
                    onChange={setHDR_Dept}
                    placeholder="Owning department"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Team <span className="text-destructive">*</span></Label>
                  <Input
                    value={HDR_Team}
                    onChange={e => setHDR_Team(e.target.value)}
                    placeholder="Responsible team"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Approved By <span className="text-destructive">*</span></Label>
                  <EmployeePicker
                    value={HDR_AppBy}
                    onChange={(email) => setHDR_AppBy(email)}
                    placeholder="Approver name or email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Distributed Date (optional)</Label>
                  <Input type="date" value={HDR_Distributed} onChange={e => setHDR_Distributed(e.target.value)} />
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Section B: Body */}
          <Card className="border-border">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="text-[#003366]">Section B — Document Body</CardTitle>
              <CardDescription>Procedure content and comments</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">

              <div className="space-y-2">
                <Label>Body <span className="text-destructive">*</span></Label>
                <Textarea
                  value={BODY_Body}
                  onChange={e => setBODY_Body(e.target.value)}
                  placeholder="Document body / procedure content..."
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label>Comments (optional)</Label>
                <Textarea
                  value={BODY_Comments}
                  onChange={e => setBODY_Comments(e.target.value)}
                  placeholder="Additional comments..."
                  rows={3}
                />
              </div>

            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end pb-6">
            <Button type="button" variant="outline" onClick={() => navigate('/it/forms/sapdrp')}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || extDocsPending}
              className="bg-primary hover:bg-[#002244] text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              {isPending || extDocsPending ? 'Submitting...' : 'Submit SAP DRP'}
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
