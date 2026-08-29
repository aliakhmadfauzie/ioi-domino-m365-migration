import { Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, FileText, Download, ExternalLink, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InMemoryDataBanner } from '@/generated/components/in-memory-data-banner';
import { HAS_IN_MEMORY_TABLES } from '@/generated/hooks';

export default function DocumentationPage() {
  // Mock documentation
  const documents = [
    {
      title: 'IT Security Policy',
      category: 'Security',
      updated: 'Apr 15, 2026',
      version: '3.2',
    },
    {
      title: 'Password Guidelines',
      category: 'Security',
      updated: 'Mar 20, 2026',
      version: '2.1',
    },
    {
      title: 'Remote Work Policy',
      category: 'Operations',
      updated: 'Feb 10, 2026',
      version: '1.5',
    },
    {
      title: 'Email Usage Guidelines',
      category: 'Communications',
      updated: 'Jan 5, 2026',
      version: '2.0',
    },
    {
      title: 'Software Installation Policy',
      category: 'Operations',
      updated: 'Dec 12, 2025',
      version: '1.3',
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Security':
        return 'bg-destructive/10 text-destructive dark:bg-destructive/30 dark:text-destructive';
      case 'Operations':
        return 'bg-secondary text-secondary-foreground dark:bg-secondary/30 dark:text-secondary-foreground';
      case 'Communications':
        return 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary';
      default:
        return 'bg-muted text-foreground dark:bg-muted dark:text-muted-foreground';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <InMemoryDataBanner
        show={HAS_IN_MEMORY_TABLES}
        message="This app uses draft tables for testing. Data entered won't be saved. Contact the app owner to enable storage."
        className="bg-accent/50 dark:bg-accent/30 border-accent dark:border-accent text-accent-foreground dark:text-accent-foreground"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
              <span className="text-foreground">Documentation & Policies</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Documentation & Policies</h1>
          </div>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link to="/it/forms/ioip/new">
            <Plus className="h-4 w-4 mr-2" />
            New Submission
          </Link>
        </Button>
      </div>

      {/* Documents Grid */}
      <div className="space-y-3">
        {documents.map((doc) => (
          <Card key={doc.title} className="border-0 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-secondary dark:bg-violet-900/30 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{doc.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Updated {doc.updated} • Version {doc.version}
                  </p>
                </div>
                <Badge variant="secondary" className={getCategoryColor(doc.category)}>
                  {doc.category}
                </Badge>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
