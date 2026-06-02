import { motion } from 'motion/react';
import { ArrowLeft, Paperclip, FileText, Upload, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AttachmentTable } from '@/components/attachments';
import { useAllDepartmentAttachments } from '@/hooks/use-attachments';

export default function ITAttachmentsPage() {
  const { attachments, isLoading, refetch, deleteAttachment } = useAllDepartmentAttachments('IT');

  // Calculate stats
  const totalSize = attachments.reduce((sum, a) => sum + a.fileSizeKB, 0);
  const formCodes = [...new Set(attachments.map((a) => a.formCode))];
  const categories = [...new Set(attachments.map((a) => a.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link to="/it">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to IT Department
            </Button>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Paperclip className="h-6 w-6 text-primary" />
                </div>
                IT Attachment Index
              </h1>
              <p className="mt-2 text-muted-foreground">
                Central repository for all IT form attachments and supporting documents
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              AttachmentIndex_IT
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
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Attachments</CardDescription>
              <CardTitle className="text-3xl">{attachments.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Files indexed</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Size</CardDescription>
              <CardTitle className="text-3xl">
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

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Form Types</CardDescription>
              <CardTitle className="text-3xl">{formCodes.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {formCodes.slice(0, 3).map((code) => (
                  <Badge key={code} variant="secondary" className="text-xs">
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

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Categories</CardDescription>
              <CardTitle className="text-3xl">{categories.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {categories.slice(0, 2).map((cat) => (
                  <Badge key={cat} variant="secondary" className="text-xs">
                    {cat}
                  </Badge>
                ))}
                {categories.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{categories.length - 2}
                  </Badge>
                )}
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
            title="IT Department Attachments"
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
          <Card className="border-dashed bg-muted/30">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">About IT Attachment Index</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    This index tracks all attachments uploaded to IT forms including EAF, NIR, RS, SFAR, UR,
                    SAPAMR, SAPTR, SAPCA, SAPCR, and other IT-related forms. Files are stored in SharePoint
                    and linked to their respective form submissions.
                  </p>
                  <div className="flex gap-4 mt-3">
                    <div className="text-xs">
                      <span className="text-muted-foreground">SharePoint List:</span>{' '}
                      <code className="bg-muted px-1.5 py-0.5 rounded">AttachmentIndex_IT</code>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Max File Size:</span>{' '}
                      <span className="font-medium">10 MB</span>
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