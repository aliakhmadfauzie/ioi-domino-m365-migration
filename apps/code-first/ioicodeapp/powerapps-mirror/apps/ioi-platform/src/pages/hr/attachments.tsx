import { motion } from 'motion/react';
import { ArrowLeft, Paperclip, FileText, Upload, Database, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AttachmentTable } from '@/components/attachments';
import { useAllDepartmentAttachments } from '@/hooks/use-attachments';

export default function HRAttachmentsPage() {
  const { attachments, isLoading, refetch, deleteAttachment } = useAllDepartmentAttachments('HR');

  // Calculate stats
  const totalSize = attachments.reduce((sum, a) => sum + a.fileSizeKB, 0);
  const formCodes = [...new Set(attachments.map((a) => a.formCode))];
  const categories = [...new Set(attachments.map((a) => a.category))];
  const uploaders = [...new Set(attachments.map((a) => a.uploadedByName))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-emerald-500/5">
      <div className="container mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link to="/hr">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to HR Department
            </Button>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Paperclip className="h-6 w-6 text-emerald-600" />
                </div>
                HR Attachment Index
              </h1>
              <p className="mt-2 text-muted-foreground">
                Central repository for all HR form attachments, employee documents, and records
              </p>
            </div>
            <Badge variant="outline" className="text-sm border-emerald-500/30 text-emerald-700">
              AttachmentIndex_HR
            </Badge>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          <Card className="border-emerald-500/20">
            <CardHeader className="pb-2">
              <CardDescription>Total Attachments</CardDescription>
              <CardTitle className="text-3xl text-emerald-700">{attachments.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Files indexed</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-500/20">
            <CardHeader className="pb-2">
              <CardDescription>Total Size</CardDescription>
              <CardTitle className="text-3xl text-emerald-700">
                {totalSize > 1024 ? `${(totalSize / 1024).toFixed(1)} MB` : `${totalSize} KB`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Database className="h-4 w-4" />
                <span>Storage used</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-500/20">
            <CardHeader className="pb-2">
              <CardDescription>Form Types</CardDescription>
              <CardTitle className="text-3xl text-emerald-700">{formCodes.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {formCodes.slice(0, 3).map((code) => (
                  <Badge key={code} variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">
                    {code}
                  </Badge>
                ))}
                {formCodes.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{formCodes.length - 3}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-500/20">
            <CardHeader className="pb-2">
              <CardDescription>Contributors</CardDescription>
              <CardTitle className="text-3xl text-emerald-700">{uploaders.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Unique uploaders</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Attachment Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AttachmentTable
            attachments={attachments}
            isLoading={isLoading}
            onRefresh={refetch}
            onDelete={deleteAttachment}
            title="HR Department Attachments"
            showRecordLink={true}
          />
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <Card className="border-dashed bg-emerald-50/50 dark:bg-emerald-950/10">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-emerald-500/10 p-2">
                  <Upload className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-medium">About HR Attachment Index</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    This index tracks all attachments uploaded to HR forms including Leave Applications (LVE),
                    Training Records (TRN), Performance Reviews (PRF), Onboarding (ONB), Exit Process (EXT),
                    and other HR-related documents. Files are stored securely in SharePoint with proper access controls.
                  </p>
                  <div className="flex gap-4 mt-3">
                    <div className="text-xs">
                      <span className="text-muted-foreground">SharePoint List:</span>{' '}
                      <code className="bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded">AttachmentIndex_HR</code>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Max File Size:</span>{' '}
                      <span className="font-medium">10 MB</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Retention:</span>{' '}
                      <span className="font-medium">7 years</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
