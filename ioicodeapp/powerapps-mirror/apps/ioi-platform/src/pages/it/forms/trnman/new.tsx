import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, BookOpen } from 'lucide-react';
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
import type { MainDBITCurrentstatusKey } from '@/generated/models/main-dbit-model';

const TRNMAN_TYPES = [
  'Internal', 'External', 'e-Learning', 'On-the-Job', 'Seminar', 'Workshop', 'Other',
] as const;

function generateRecordNo(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `TRNMAN-${year}${month}-${seq}`;
}

export default function NewTRNMANPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const { mutateAsync: createMainDBIT, isPending } = useCreateMainDBIT();

  const [TRN_Type, setTRN_Type] = useState('');
  const [TRN_Title, setTRN_Title] = useState('');
  const [TRN_VerNo, setTRN_VerNo] = useState('');
  const [TRN_DateLast, setTRN_DateLast] = useState('');
  const [TRN_Revision, setTRN_Revision] = useState('');
  const [TRN_Owner, setTRN_Owner] = useState('');
  const [TRN_ApplicableTo, setTRN_ApplicableTo] = useState('');
  const [TRN_Comments, setTRN_Comments] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!TRN_Type) { toast.error('Training Type is required'); return; }
    if (!TRN_Title.trim()) { toast.error('Title is required'); return; }
    if (!TRN_VerNo.trim()) { toast.error('Version Number is required'); return; }
    if (!TRN_DateLast) { toast.error('Last Date is required'); return; }
    if (!TRN_Revision.trim()) { toast.error('Revision is required'); return; }
    if (!TRN_Owner.trim()) { toast.error('Owner is required'); return; }
    if (!TRN_Comments.trim()) { toast.error('Comments is required'); return; }

    try {
      const recordNo = generateRecordNo();
      await createMainDBIT({
        title: recordNo,
        formcode: 'TRNMAN',
        currentStatus: 'CurrentstatusKey1' as MainDBITCurrentstatusKey,
        requestoremail: user?.userPrincipalName || '',
        submitteddate: new Date().toISOString(),
        workflowstage: 1,
        remarks: JSON.stringify({
          TRN_Type, TRN_Title, TRN_VerNo, TRN_DateLast,
          TRN_Revision, TRN_Owner, TRN_ApplicableTo, TRN_Comments,
        }),
      });
      toast.success(`Training Manual submitted! Ref: ${recordNo}`);
      navigate('/it/forms/trnman');
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
            <h1 className="text-xl font-bold text-white">Training Manual</h1>
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <Link to="/it" className="hover:text-white">IT</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">New Training Manual</span>
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
                <BookOpen className="h-5 w-5" />
                Training Manual Details
              </CardTitle>
              <CardDescription>Document identification and version control</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">

              <div className="space-y-2">
                <Label>Training Type <span className="text-destructive">*</span></Label>
                <Select value={TRN_Type} onValueChange={setTRN_Type}>
                  <SelectTrigger><SelectValue placeholder="Select training type" /></SelectTrigger>
                  <SelectContent>
                    {TRNMAN_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Title <span className="text-destructive">*</span></Label>
                <Input
                  value={TRN_Title}
                  onChange={e => setTRN_Title(e.target.value)}
                  placeholder="Training manual title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Version Number <span className="text-destructive">*</span></Label>
                  <Input
                    value={TRN_VerNo}
                    onChange={e => setTRN_VerNo(e.target.value)}
                    placeholder="e.g., v1.0, Rev 2"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Revision <span className="text-destructive">*</span></Label>
                  <Input
                    value={TRN_Revision}
                    onChange={e => setTRN_Revision(e.target.value)}
                    placeholder="Revision description"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Last Revised Date <span className="text-destructive">*</span></Label>
                  <Input type="date" value={TRN_DateLast} onChange={e => setTRN_DateLast(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Owner <span className="text-destructive">*</span></Label>
                  <Input
                    value={TRN_Owner}
                    onChange={e => setTRN_Owner(e.target.value)}
                    placeholder="Document owner name or email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Applicable To</Label>
                <Textarea
                  value={TRN_ApplicableTo}
                  onChange={e => setTRN_ApplicableTo(e.target.value)}
                  placeholder="Who this training manual is applicable to..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Comments <span className="text-destructive">*</span></Label>
                <Input
                  value={TRN_Comments}
                  onChange={e => setTRN_Comments(e.target.value)}
                  placeholder="Additional comments"
                />
              </div>

            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end pb-6">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary hover:bg-[#002244] text-white"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              {isPending ? 'Submitting...' : 'Submit Training Manual'}
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
