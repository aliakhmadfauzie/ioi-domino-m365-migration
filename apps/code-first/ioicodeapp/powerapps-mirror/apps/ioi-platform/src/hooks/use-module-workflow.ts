/**
 * useModuleWorkflow — Connects module-specific workflow configs
 * to the existing useWorkflowEngine infrastructure.
 *
 * Provides:
 *  - Module-specific stage definitions (from module-workflows.ts)
 *  - Transition validation
 *  - Email routing resolution
 *  - Reminder scheduling
 */

import { useMemo, useCallback } from 'react';
import { getModuleWorkflow, getTransition, isTerminalState } from '@/config/module-workflows';
import type { ModuleWorkflowConfig, StageTransition } from '@/config/module-workflows';
import { useWorkflowEngine, type WorkflowStage, type ApprovalAction } from '@/hooks/use-workflow-engine';
import { useMainDBIT } from '@/generated/hooks/use-main-dbit';
import type { MainDBIT } from '@/generated/models/main-dbit-model';

interface UseModuleWorkflowOptions {
  formCode: string;
  recordId?: string;
  record?: MainDBIT;
  currentStateKey?: string;
  siteScope?: string;
}

interface UseModuleWorkflowResult {
  workflow: ModuleWorkflowConfig | undefined;
  currentStateIndex: number;
  nextStates: StageTransition[];
  canTransition: (action: string) => boolean;
  isTerminal: boolean;
  isDraft: boolean;
  stages: WorkflowStage[];
  engine: ReturnType<typeof useWorkflowEngine>;
}

export function useModuleWorkflow({
  formCode,
  recordId,
  record,
  currentStateKey,
  siteScope,
}: UseModuleWorkflowOptions): UseModuleWorkflowResult {
  const workflow = useMemo(() => getModuleWorkflow(formCode), [formCode]);

  // Use the existing workflow engine
  const engine = useWorkflowEngine({
    formCode,
    formId: recordId,
    siteScope,
  });

  // Determine current state from record or explicit key
  const stateKey = useMemo(() => {
    if (currentStateKey) return currentStateKey;
    if (record) {
      // Map from currentStatus field to the state key
      const status = record.currentStatus;
      if (workflow) {
        // Try to match status to a stage key
        const matched = workflow.stages.find(
          (s) => s.key.toLowerCase() === status?.toLowerCase()
        );
        return matched?.key || workflow.initialStageKey;
      }
    }
    return workflow?.initialStageKey || 'Request';
  }, [currentStateKey, record, workflow]);

  // Find current state index
  const currentStateIndex = useMemo(() => {
    if (!workflow) return 0;
    return workflow.stages.findIndex((s) => s.key === stateKey);
  }, [workflow, stateKey]);

  // Get valid next transitions
  const nextStates = useMemo((): StageTransition[] => {
    if (!workflow) return [];
    return workflow.transitions.filter((t) => t.from === stateKey);
  }, [workflow, stateKey]);

  // Check if a specific action is allowed
  const canTransition = useCallback(
    (action: string): boolean => {
      return nextStates.some((t) => t.action === action);
    },
    [nextStates]
  );

  const isTerminal = workflow ? isTerminalState(workflow, stateKey) : false;
  const isDraft = stateKey === workflow?.initialStageKey;

  // Map module stages to WorkflowStage type
  const stages: WorkflowStage[] = useMemo(() => {
    if (!workflow) return [];
    return workflow.stages.map((s) => ({
      key: s.key,
      name: s.name,
      order: s.order,
      actor: s.actor,
      approverRole: s.approverRole as 'Approver' | 'HoD' | 'Manager',
      escalationDays: s.escalationDays,
      isActive: s.isActive,
      description: s.description,
      isConditional: s.isConditional,
    }));
  }, [workflow]);

  return {
    workflow,
    currentStateIndex,
    nextStates,
    canTransition,
    isTerminal,
    isDraft,
    stages,
    engine,
  };
}

/**
 * Get email recipients for a given transition.
 */
export function getEmailRecipients(
  workflow: ModuleWorkflowConfig,
  transition: StageTransition,
  record: MainDBIT
): { to: string[]; cc: string[]; bcc: string[] } {
  const routing = workflow.emailRouting?.[transition.action];
  if (!routing) return { to: [], cc: [], bcc: [] };

  const resolveField = (fieldRef: string): string[] => {
    const val = (record as unknown as Record<string, unknown>)[fieldRef];
    if (!val) return [];
    if (typeof val === 'string') return val.split(';').map((s) => s.trim());
    return [String(val)];
  };

  return {
    to: routing.to.flatMap(resolveField),
    cc: (routing.cc ?? []).flatMap(resolveField),
    bcc: (routing.bcc ?? []).flatMap(resolveField),
  };
}
