import { Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InMemoryDataBanner } from '@/generated/components/in-memory-data-banner';
import { HAS_IN_MEMORY_TABLES } from '@/generated/hooks';
import { M5_FORMS } from '@/lib/it-forms-config';

const ISG_FORM_COLORS = ['bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-slate-600'];

export default function ISGDocumentationPage() {
  return (
    <div className="p-6 space-y-6">
      <InMemoryDataBanner
        show={HAS_IN_MEMORY_TABLES}
        message="This app uses draft tables for testing. Data entered won't be saved. Contact the app owner to enable storage."
        className="bg-accent/50 dark:bg-accent/30 border-accent dark:border-accent text-accent-foreground dark:text-accent-foreground"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/it">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Link to="/it" className="hover:text-foreground transition-colors">IT</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-foreground">M5: ISG Documentation</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-violet-500" />
              ISG Documentation
            </h1>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground">
        Manage ISG documentation, training manuals, and IT procedures. Select a form type below to create a new document.
      </p>

      {/* ISG Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {M5_FORMS.map((form, index) => {
          const Icon = form.icon;
          return (
            <Card key={form.code} className="border shadow-sm hover:shadow-md transition-all group">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-lg ${ISG_FORM_COLORS[index % ISG_FORM_COLORS.length]} flex items-center justify-center`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base font-semibold text-foreground">
                      {form.name}
                    </CardTitle>
                    <span className="text-xs font-mono text-muted-foreground">{form.code}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm text-muted-foreground mb-4">
                  {form.description}
                </CardDescription>
                <Link to={`/it/forms/${form.code.toLowerCase()}/new`}>
                  <Button className="w-full" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
