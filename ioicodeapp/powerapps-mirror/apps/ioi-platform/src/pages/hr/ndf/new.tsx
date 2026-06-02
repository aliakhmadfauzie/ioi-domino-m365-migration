/** NDF — New Document Form */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Clock, Send, FileText } from 'lucide-react';
import { HRBreadcrumb } from '@/components/hr/hr-breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useUser } from '@/hooks/use-user';
import { MainDBHRService } from '@/services/main-dbhr-service';

const DOC_CATEGORIES = ['Form', 'Policy', 'SOP', 'Template', 'Manual', 'Report', 'Other'];
const REVIEW_CYCLES = ['6 months', '1 year', '2 years', '3 years', 'As Needed'];

export default function NDFNewPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [docNo, setDocNo] = useState('');            // → documentno
  const [docTitle, setDocTitle] = useState('');      // → vacancyTitle
  const [category, setCategory] = useState('');      // → documenttype
  const [version, setVersion] = useState('1.0');     // → formversion
  const [revisionNo, setRevisionNo] = useState('1'); // → revisionno
  const [effectiveDate, setEffectiveDate] = useState(''); // → effectivedate
  const [reviewCycle, setReviewCycle] = useState('1 year'); // → duedate label in details
  const [summary, setSummary] = useState('');        // → description

  const handleSubmit = async (action: 'draft' | 'submit') => {
    if (action === 'submit' && !docTitle.trim()) { toast.error('Document title is required'); return; }
    if (action === 'submit' && !category) { toast.error('Category is required'); return; }
    setSubmitting(true);
    try {
      await MainDBHRService.create({
        title: docNo || `NDF-${format(new Date(), 'yyyyMMdd-HHmmss')}`,
        formcode: 'NDF',
        currentaction: action === 'draft' ? 'Draft' : 'HODApproval',
        statusKey: action === 'draft' ? 'StatusKey0' : 'StatusKey1',
        documentno: docNo,
        vacancyTitle: docTitle,
        documenttype: category,
        formversion: version,
        revisionno: revisionNo,
        effectivedate: effectiveDate,
        details: `Review cycle: ${reviewCycle}`,
        description: summary,
        requestoremail: user?.userPrincipalName || '',
      } as any);
      toast.success(action === 'draft' ? 'Draft saved' : 'Document submitted for approval');
      navigate('/hr/ndf');
    } catch (err: any) { toast.error(err?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <HRBreadcrumb items={[{ label: 'HR Dashboard', href: '/hr' }, { label: 'New Document Forms', href: '/hr/ndf' }, { label: 'New' }]} />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hr/ndf')}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-2xl font-bold tracking-tight">New Document Form</h1>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><FileText className="h-5 w-5" />Document Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Document No.</Label><Input value={docNo} onChange={e => setDocNo(e.target.value)} placeholder="e.g. HR-SOP-001" /></div>
            <div className="space-y-2"><Label>Title <span className="text-destructive">*</span></Label><Input value={docTitle} onChange={e => setDocTitle(e.target.value)} placeholder="Document title" /></div>
            <div className="space-y-2"><Label>Category <span className="text-destructive">*</span></Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{DOC_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Version</Label><Input value={version} onChange={e => setVersion(e.target.value)} /></div>
            <div className="space-y-2"><Label>Revision No.</Label><Input value={revisionNo} onChange={e => setRevisionNo(e.target.value)} /></div>
            <div className="space-y-2"><Label>Effective Date</Label><Input type="date" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Review Cycle</Label>
              <Select value={reviewCycle} onValueChange={setReviewCycle}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{REVIEW_CYCLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2"><Label>Content Summary</Label><Textarea value={summary} onChange={e => setSummary(e.target.value)} rows={5} placeholder="Brief summary of the document content..." /></div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/hr/ndf')} disabled={submitting}>Cancel</Button>
        <Button variant="secondary" onClick={() => handleSubmit('draft')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />} Save Draft</Button>
        <Button onClick={() => handleSubmit('submit')} disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Submit</Button>
      </div>
    </motion.div>
  );
}
