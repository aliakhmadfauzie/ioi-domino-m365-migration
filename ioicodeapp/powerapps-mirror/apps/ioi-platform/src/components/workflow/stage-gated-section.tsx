import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { FormSection, WorkflowStage } from '@/lib/it-forms-config';

interface StageGatedSectionProps {
  section: FormSection;
  currentStageKey: string;
  stages: WorkflowStage[];
  completedStages: string[];
  children: React.ReactNode;
  className?: string;
}

export function StageGatedSection({
  section,
  currentStageKey,
  stages,
  completedStages,
  children,
  className,
}: StageGatedSectionProps) {
  const isVisible = section.visibleAtStages.includes(currentStageKey);
  const isLocked = section.isStageGated && !isVisible;
  
  // Find the stage that unlocks this section
  const unlockStage = stages.find((s) => 
    section.visibleAtStages.includes(s.key) && 
    !completedStages.includes(s.key) &&
    s.key !== currentStageKey
  );

  const firstVisibleStage = stages.find((s) => section.visibleAtStages.includes(s.key));
  const currentStageIndex = stages.findIndex((s) => s.key === currentStageKey);
  const firstVisibleIndex = stages.findIndex((s) => s.key === firstVisibleStage?.key);
  const isUpcoming = firstVisibleIndex > currentStageIndex;

  return (
    <AnimatePresence mode="wait">
      {isLocked ? (
        <motion.div
          key={`locked-${section.id}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className={cn('border-dashed border-[#D0D0D0] bg-[#FAFAFA]', className)}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-[#9E9E9E]" />
                  <CardTitle className="text-sm font-medium text-[#9E9E9E]">
                    {section.title}
                  </CardTitle>
                </div>
                <Badge className="bg-[#F5F5F5] text-[#757575] border-0 text-xs">
                  Stage-gated
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs text-[#9E9E9E]">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>
                  {isUpcoming
                    ? `Unlocks at: ${firstVisibleStage?.name || 'Future stage'}`
                    : `Complete current stage to unlock`
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          key={`unlocked-${section.id}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Card className={cn('border-border bg-white elevation-1', className)}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Unlock className="h-4 w-4 text-[#2E7D32]" />
                  <CardTitle className="text-sm font-semibold text-foreground">
                    {section.title}
                  </CardTitle>
                </div>
                {section.isStageGated && (
                  <Badge className="bg-[#E8F5E9] text-[#166534] border-0 text-xs">
                    Active
                  </Badge>
                )}
              </div>
              {section.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {section.description}
                </p>
              )}
            </CardHeader>
            <CardContent>{children}</CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}