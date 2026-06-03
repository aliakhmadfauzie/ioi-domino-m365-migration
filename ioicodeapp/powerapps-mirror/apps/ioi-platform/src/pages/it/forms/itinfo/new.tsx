import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, Info } from 'lucide-react';
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
import type { MainDBITExtDocs } from '@/generated/models/main-dbit-ext-docs-model';
import type { MainDBITCurrentstatusKey } from '@/generated/models/main-dbit-model';

const ITINFO_INFO_TYPES = [
  'System Alert', 'Security Notice', 'Maintenance Notice',
  'Policy Update', 'Advisory', 'Other',
] as const;

function generateRecordNo(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `ITINFO-${year}${month}-${seq}`;
}

export default function NewITINFOPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const { mutateAsync: createMainDBIT, isPending } = useCreateMainDBIT();
  const { mutateAsync: createExtDocs, isPending: extDocsPending } = useCreateMainDBITExtDocs();

  const [INFO_To, setINFO_To] = useState('');
  const [INFO_InfoType, setINFO_InfoType] = useState('');
  const [INFO_Subject, setINFO_Subject] = useState('');
  const [INFO_ISGRemarks, setINFO_ISGRemarks] = useState('');
  const [INFO_Resend, setINFO_Resend] = useState('');

  useEffect(() => {
    if (user?.userPrincipalName) {
      // INFO_To can be pre-filled or left blank for the user to fill
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!INFO_To.trim()) { toast.error('To (recipient) is required'); return; }
    if (!INFO_InfoType) { toast.error('Info Type is required'); return; }
    if (!INFO_Subject.trim()) { toast.error('Subject is required'); return; }
    if (!INFO_ISGRemarks.trim()) { toast.error('ISG Remarks is required'); return; }

    try {
      const recordNo = generateRecordNo();
      const created = await createMainDBIT({
        title: recordNo,
        formcode: 'ITINFO',
        currentStatus: 'sent',
        requestoremail: user?.userPrincipalName || '',
        submitteddate: new Date().toISOString(),
        workflowstage: 1,
        subject: INFO_Subject.trim(),
        currentAction: INFO_Resend.trim() ? 'Resend requested' : 'Submitted',
      });
      // Also create ExtDocs record for ITI fields
      if (created?.id) {
        const extData: Omit<MainDBITExtDocs, 'id'> = {
          title: `${recordNo}-docs`,
          parentFormCode: 'ITINFO',
          parentRecord: { id: created.id, title: recordNo },
          parentSite: 'PRAI',
          iTIInfoType: INFO_InfoType || '',
          iTISubject: INFO_Subject.trim(),
          iTIRemarks: INFO_ISGRemarks.trim(),
        };
        await createExtDocs(extData);
      }
      toast.success(`IT Information submitted! Ref: ${recordNo}`);
      navigate('/it/forms/itinfo');
    } catch (error: unknown) {
      toast.error(`Failed to submit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="h-16 bg-primary px-6 flex items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">IT Information</h1>
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <Link to="/it" className="hover:text-white">IT</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">New IT Information</span>
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
          <Card className="border-border">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="flex items-center gap-2 text-[#003366]">
                <Info className="h-5 w-5" />
                IT Information Details
              </CardTitle>
              <CardDescription>All required fields must be filled</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">

              <div className="space-y-2">
                <Label>To (Recipient) <span className="text-destructive">*</span></Label>
                <Input
                  value={INFO_To}
                  onChange={e => setINFO_To(e.target.value)}
                  placeholder="Recipient name or email"
                />
              </div>

              <div className="space-y-2">
                <Label>Info Type <span className="text-destructive">*</span></Label>
                <Select value={INFO_InfoType} onValueChange={setINFO_InfoType}>
                  <SelectTrigger><SelectValue placeholder="Select info type" /></SelectTrigger>
                  <SelectContent>
                    {ITINFO_INFO_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Subject <span className="text-destructive">*</span></Label>
                <Input
                  value={INFO_Subject}
                  onChange={e => setINFO_Subject(e.target.value)}
                  placeholder="Subject of this information"
                />
              </div>

              <div className="space-y-2">
                <Label>ISG Remarks <span className="text-destructive">*</span></Label>
                <Textarea
                  value={INFO_ISGRemarks}
                  onChange={e => setINFO_ISGRemarks(e.target.value)}
                  placeholder="Detailed remarks or information content..."
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label>Resend To (optional)</Label>
                <Input
                  value={INFO_Resend}
                  onChange={e => setINFO_Resend(e.target.value)}
                  placeholder="Additional recipients for resend"
                />
              </div>

            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end pb-6">
            <Button type="button" variant="outline" onClick={() => navigate('/it/forms/itinfo')}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || extDocsPending}
              className="bg-primary hover:bg-[#002244] text-white"
            >
              <Info className="h-4 w-4 mr-2" />
              {isPending || extDocsPending ? 'Submitting...' : 'Submit Information'}
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
