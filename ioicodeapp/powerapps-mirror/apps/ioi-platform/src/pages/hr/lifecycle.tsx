import { Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InMemoryDataBanner } from '@/generated/components/in-memory-data-banner';
import { HAS_IN_MEMORY_TABLES } from '@/generated/hooks';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty';

export default function EmployeeLifecyclePage() {
  return (
    <div className="p-6 space-y-6">
      <InMemoryDataBanner
        show={HAS_IN_MEMORY_TABLES}
        message="This app uses draft tables for testing. Data entered won't be saved. Contact the app owner to enable storage."
        className="bg-accent/50 dark:bg-accent/30 border-accent dark:border-accent text-accent-foreground dark:text-accent-foreground"
      />

      <div className="flex items-center gap-3">
        <Link to="/hr">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link to="/hr" className="hover:text-foreground transition-colors">HR</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">Employee Lifecycle</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Employee Lifecycle</h1>
        </div>
      </div>

      <Empty className="py-20">
        <EmptyHeader>
          <LogOut className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <EmptyTitle>Coming Soon</EmptyTitle>
          <EmptyDescription>
            Employee lifecycle features are being migrated. Exit notifications and clearance tracking will be available soon.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
