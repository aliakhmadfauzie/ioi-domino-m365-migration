// Shared Form Navigation Dialog - Shown when user clicks on a form card
// Provides options: View Database, My Submissions, My Pending Tasks, Create New

import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Database,
  FileText,
  ClipboardList,
  Plus,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FormNavigationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formCode: string;
  formName: string;
  basePath: string;
  databaseCount?: number;
  mySubmissionsCount?: number;
  myPendingCount?: number;
}

export function FormNavigationDialog({
  open,
  onOpenChange,
  formCode,
  formName,
  basePath,
  databaseCount = 0,
  mySubmissionsCount = 0,
  myPendingCount = 0,
}: FormNavigationDialogProps) {
  const navigate = useNavigate();
  
  const databasePath = `${basePath}/${formCode.toLowerCase()}`;
  const newPath = `${basePath}/${formCode.toLowerCase()}/new`;

  const handleNavigation = (path: string, filter?: string) => {
    const url = filter ? `${path}?filter=${filter}` : path;
    navigate(url);
    onOpenChange(false);
  };

  const navigationOptions = [
    {
      id: 'database',
      icon: Database,
      label: 'View All Records',
      description: 'Browse all submissions for this form',
      path: databasePath,
      filter: undefined,
      badge: databaseCount > 0 ? databaseCount : undefined,
      variant: 'outline' as const,
    },
    {
      id: 'my-submissions',
      icon: FileText,
      label: 'My Submissions',
      description: 'View records you have submitted',
      path: databasePath,
      filter: 'my-submissions',
      badge: mySubmissionsCount > 0 ? mySubmissionsCount : undefined,
      variant: 'outline' as const,
    },
    {
      id: 'my-pending-tasks',
      icon: ClipboardList,
      label: 'My Pending Tasks',
      description: 'View items waiting for your approval',
      path: databasePath,
      filter: 'my-pending-tasks',
      badge: myPendingCount > 0 ? myPendingCount : undefined,
      badgeColor: myPendingCount > 0 ? 'destructive' : undefined,
      variant: 'outline' as const,
    },
    {
      id: 'new',
      icon: Plus,
      label: 'Create New Request',
      description: 'Submit a new form request',
      path: newPath,
      filter: undefined,
      badge: undefined,
      variant: 'default' as const,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-primary">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-lg">{formCode}</DialogTitle>
              <DialogDescription className="text-sm">
                {formName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-3 mt-4">
          {navigationOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
            >
              <Button
                variant={option.variant}
                className="w-full justify-start h-auto py-3 px-4"
                onClick={() => handleNavigation(option.path, option.filter)}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`h-9 w-9 rounded-md flex items-center justify-center ${
                    option.variant === 'default' 
                      ? 'bg-primary-foreground/20' 
                      : 'bg-muted'
                  }`}>
                    <option.icon className={`h-4 w-4 ${
                      option.variant === 'default'
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{option.label}</span>
                      {option.badge !== undefined && (
                        <Badge 
                          variant={option.badgeColor === 'destructive' ? 'destructive' : 'secondary'}
                          className="text-xs px-1.5 py-0"
                        >
                          {option.badge}
                        </Badge>
                      )}
                    </div>
                    <p className={`text-xs ${
                      option.variant === 'default'
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground'
                    }`}>
                      {option.description}
                    </p>
                  </div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}