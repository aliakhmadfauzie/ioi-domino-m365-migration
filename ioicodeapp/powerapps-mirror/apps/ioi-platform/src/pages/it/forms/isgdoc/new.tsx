import { useState } from 'react';
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

const ISGDOC_TYPES = [
  'Policy', 'Procedure', 'Work Instruction', 'Form', 'Template', 'Guideline', 'Other',
] as const;

function generateRecordNo(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `ISGDOC-${year}${month}-${seq}`;
}

export default function NewISGDOCPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const { mutateAsync: createMainDBIT, isPending } = useCreateMainDBIT();
  const { mutateAsync: createExtDocs, isPending: extDocsPending } = useCreateMainDBITExtDocs();

  const [DOC_Type, setDOC_Type] = useState('');
  const [DOC_Title, setDOC_Title] = useState('');
  const [DOC_VerNo, setDOC_VerNo] = useState('');
  const [DOC_DateLast, setDOC_DateLast] = useState('');
  const [DOC_Revision, setDOC_Revision] = useState('');
  const [DOC_Owner, setDOC_Owner] = useState('');
  const [DOC_ApplicableTo, setDOC_ApplicableTo] = useState('');
  const [DOC_Comments, setDOC_Comments] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!DOC_Type) { toast.error('Document Type is required'); return; }
    if (!DOC_Title.trim()) { toast.error('Title is required'); return; }
    if (!DOC_VerNo.trim()) { toast.error('Version Number is required'); return; }
    if (!DOC_DateLast) { toast.error('Last Revised Date is required'); return; }
    if (!DOC_Revision.trim()) { toast.error('Revision is required'); return; }
    if (!DOC_Owner.trim()) { toast.error('Owner is required'); return; }
    if (!DOC_Comments.trim()) { toast.error('Comments is required'); return; }

    try {
      const recordNo = generateRecordNo();
      const created = await createMainDBIT({
        title: recordNo,
        formcode: 'ISGDOC',
        currentStatus: 'CurrentstatusKey4' as MainDBITCurrentstatusKey,
        requestoremail: user?.userPrincipalName || '',
        submitteddate: new Date().toISOString(),
        workflowstage: 1,
        remarks: JSON.stringify({
          DOC_Type, DOC_Title, DOC_VerNo, DOC_DateLast,
          DOC_Revision, DOC_Owner, DOC_ApplicableTo, DOC_Comments,
        }),
      });

      if (created?.id) {
        const extDocsData: Omit<MainDBITExtDocs, 'id'> = {
          title: `${recordNo}-docs`,
          parentFormCode: 'ISGDOC',
          parentRecord: { id: created.id, title: recordNo },
          parentSite: 'PRAI',
          iTPDocType: DOC_Type,
          iTPDocTitle: DOC_Title.trim(),
          iTPVersionNo: DOC_VerNo.trim(),
          iTPDateLastUpdated: DOC_DateLast,
          iTPRevisionNo: DOC_Revision.trim(),
          iTPApplicableTo: DOC_ApplicableTo.trim(),
          iTPComments: DOC_Comments.trim(),
        };
        await createExtDocs(extDocsData);
      }

      toast.success(`ISG Document submitted! Ref: ${recordNo}`);
      navigate('/it/forms/isgdoc');
    } catch (error: unknown) {
      toast.error(`Failed to submit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="h-16 bg-primary px-6 flex items-center">
        <div className="flex items-center gap-4">
          <Link to="/it/forms/isgdoc">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">ISG Document</h1>
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <Link to="/it" className="hover:text-white">IT</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">New ISG Document</span>
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
                <FileText className="h-5 w-5" />
                ISG Document Details
              </CardTitle>
              <CardDescription>Document identification and version control</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">

              <div className="space-y-2">
                <Label>Document Type <span className="text-destructive">*</span></Label>
                <Select value={DOC_Type} onValueChange={setDOC_Type}>
                  <SelectTrigger><SelectValue placeholder="Select document type" /></SelectTrigger>
                  <SelectContent>
                    {ISGDOC_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Title <span className="text-destructive">*</span></Label>
                <Input
                  value={DOC_Title}
                  onChange={e => setDOC_Title(e.target.value)}
                  placeholder="Document title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Version Number <span className="text-destructive">*</span></Label>
                  <Input
                    value={DOC_VerNo}
                    onChange={e => setDOC_VerNo(e.target.value)}
                    placeholder="e.g., v1.0, Rev 2"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Revision <span className="text-destructive">*</span></Label>
                  <Input
                    value={DOC_Revision}
                    onChange={e => setDOC_Revision(e.target.value)}
                    placeholder="Revision description"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Last Revised Date <span className="text-destructive">*</span></Label>
                  <Input type="date" value={DOC_DateLast} onChange={e => setDOC_DateLast(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Owner <span className="text-destructive">*</span></Label>
                  <Input
                    value={DOC_Owner}
                    onChange={e => setDOC_Owner(e.target.value)}
                    placeholder="Document owner name or email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Applicable To</Label>
                <Textarea
                  value={DOC_ApplicableTo}
                  onChange={e => setDOC_ApplicableTo(e.target.value)}
                  placeholder="Departments or roles this document applies to..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Comments <span className="text-destructive">*</span></Label>
                <Input
                  value={DOC_Comments}
                  onChange={e => setDOC_Comments(e.target.value)}
                  placeholder="Additional comments"
                />
              </div>

            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end pb-6">
            <Button type="button" variant="outline" onClick={() => navigate('/it/forms/isgdoc')}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || extDocsPending}
              className="bg-primary hover:bg-[#002244] text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              {isPending || extDocsPending ? 'Submitting...' : 'Submit Document'}
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
