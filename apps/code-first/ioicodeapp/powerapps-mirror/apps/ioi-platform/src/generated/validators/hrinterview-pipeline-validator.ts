import { z } from 'zod';

/**
 * Zod schema for HRInterviewPipeline validation
 */
export const HRInterviewPipelineSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  candidateName: z.string().optional(),
  ownerEmail: z.string().optional(),
  pipelineNo: z.string().optional(),
  position: z.string().optional(),
  site1Key: z.enum(['Site1Key0', 'Site1Key1']).optional(),
  siteKey: z.enum(['SiteKey0', 'SiteKey1']).optional(),
  stage: z.string().optional(),
});

/**
 * Schema for creating a new HRInterviewPipeline (omits system-generated ID)
 */
export const CreateHRInterviewPipelineSchema = HRInterviewPipelineSchema.omit({ id: true });

/**
 * Schema for updating an existing HRInterviewPipeline
 */
export const UpdateHRInterviewPipelineSchema = HRInterviewPipelineSchema;

export type HRInterviewPipelineInput = z.infer<typeof HRInterviewPipelineSchema>;
export type CreateHRInterviewPipelineInput = z.infer<typeof CreateHRInterviewPipelineSchema>;
export type UpdateHRInterviewPipelineInput = z.infer<typeof UpdateHRInterviewPipelineSchema>;