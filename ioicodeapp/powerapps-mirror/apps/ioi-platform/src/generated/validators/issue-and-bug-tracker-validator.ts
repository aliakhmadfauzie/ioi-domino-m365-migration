import { z } from 'zod';

/**
 * Zod schema for IssueAndBugTracker validation
 */
export const IssueAndBugTrackerSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  comment: z.string().optional(),
  department: z.string().optional(),
  formCode: z.string().optional(),
  issueDescription: z.string().optional(),
  priorityKey: z.enum(['PriorityKey0', 'PriorityKey1', 'PriorityKey2', 'PriorityKey3']).optional(),
  relatedIssue: z.object({ id: z.string().uuid(), title: z.string() }).optional(),
  statusKey: z.enum(['StatusKey0', 'StatusKey1', 'StatusKey2', 'StatusKey3', 'StatusKey4', 'StatusKey5', 'StatusKey6']).optional(),
});

/**
 * Schema for creating a new IssueAndBugTracker (omits system-generated ID)
 */
export const CreateIssueAndBugTrackerSchema = IssueAndBugTrackerSchema.omit({ id: true });

/**
 * Schema for updating an existing IssueAndBugTracker
 */
export const UpdateIssueAndBugTrackerSchema = IssueAndBugTrackerSchema;

export type IssueAndBugTrackerInput = z.infer<typeof IssueAndBugTrackerSchema>;
export type CreateIssueAndBugTrackerInput = z.infer<typeof CreateIssueAndBugTrackerSchema>;
export type UpdateIssueAndBugTrackerInput = z.infer<typeof UpdateIssueAndBugTrackerSchema>;