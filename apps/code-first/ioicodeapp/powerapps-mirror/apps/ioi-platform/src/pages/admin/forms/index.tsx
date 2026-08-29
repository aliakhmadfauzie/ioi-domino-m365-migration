import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, FileText, Pencil, RotateCcw, Search,
  ChevronRight, Wrench, AlertCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useFormSchemaAdmin } from '@/hooks/use-form-schema';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminFormsListPage() {
  const { registry, isModified, resetSchema, isLoading, getSpRecord } = useFormSchemaAdmin();
  const [search, setSearch] = useState('');

  const forms = Object.values(registry).sort((a, b) => a.formCode.localeCompare(b.formCode));

  const filtered = forms.filter(f =>
    f.formCode.toLowerCase().includes(search.toLowerCase()) ||
    f.title.toLowerCase().includes(search.toLowerCase())
  );

  const modifiedCount = forms.filter(f => isModified(f.formCode)).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wrench className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Form Builder</h1>
                <p className="text-sm text-muted-foreground">
                  {forms.length} schemas · {modifiedCount > 0 && (
                    <span className="text-amber-600 font-medium">{modifiedCount} modified</span>
                  )}
                  {modifiedCount === 0 && 'all at default'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading SharePoint overrides...
          </div>
        )}

        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by code or title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          {modifiedCount > 0 && (
            <Badge variant="outline" className="gap-1.5 py-1.5 text-amber-600 border-amber-300 bg-amber-50">
              <AlertCircle className="h-3.5 w-3.5" />
              {modifiedCount} overridden
            </Badge>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filtered.map(form => {
            const modified = isModified(form.formCode);
            const totalFields = form.sections.reduce((n, s) => n + s.fields.length, 0);
            return (
              <Card
                key={form.formCode}
                className={`group border transition-all hover:shadow-md ${modified ? 'border-amber-300 bg-amber-50/30' : 'border-border'}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {modified && (() => {
                        const rec = getSpRecord(form.formCode);
                        return (
                          <Badge variant="outline" className="text-xs text-amber-600 border-amber-300 bg-amber-50">
                            SP v{rec?.schemaVersion ?? '?'}
                          </Badge>
                        );
                      })()}
                      <Badge variant="secondary" className="text-xs font-mono">
                        v{form.version}
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="font-mono text-xs text-muted-foreground mb-1">{form.formCode}</p>
                    <p className="font-semibold text-sm text-foreground leading-tight">{form.title}</p>
                    {form.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{form.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    <span>{form.sections.length} sections</span>
                    <span>·</span>
                    <span>{totalFields} fields</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/admin/forms/${form.formCode}`} className="flex-1">
                      <Button size="sm" className="w-full gap-1.5 bg-primary hover:bg-primary/90">
                        <Pencil className="h-3.5 w-3.5" />
                        Edit Schema
                      </Button>
                    </Link>
                    {modified && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-amber-600 border-amber-300 hover:bg-amber-50"
                        onClick={async () => {
                          await resetSchema(form.formCode);
                          toast.success(`${form.formCode} reset to default`);
                        }}
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Link to={form.routeBase}>
                      <Button size="sm" variant="ghost">
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No schemas match "{search}"</p>
          </div>
        )}
      </main>
    </div>
  );
}
