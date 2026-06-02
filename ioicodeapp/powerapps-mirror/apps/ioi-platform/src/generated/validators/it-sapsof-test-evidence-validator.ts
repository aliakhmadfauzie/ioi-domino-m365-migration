import { z } from 'zod';

export const ITSAPSOFTestEvidenceSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  parentFormCode: z.string().min(1, { message: "Parent Form Code is required" }),
  parentRecord: z.object({ id: z.number(), title: z.string() }),
  evidenceTestNo: z.string().optional(),
  evidenceDescription: z.string().optional(),
  evidenceExpectedResult: z.string().optional(),
  evidenceActualResult: z.string().optional(),
  evidenceStatus: z.string().optional(),
  evidenceTestedBy: z.string().optional(),
  evidenceTestedDate: z.string().optional(),
  evidenceRemarks: z.string().optional(),
});

export const CreateITSAPSOFTestEvidenceSchema = ITSAPSOFTestEvidenceSchema.omit({ id: true });
export const UpdateITSAPSOFTestEvidenceSchema = ITSAPSOFTestEvidenceSchema;

export type ITSAPSOFTestEvidenceInput = z.infer<typeof ITSAPSOFTestEvidenceSchema>;
export type CreateITSAPSOFTestEvidenceInput = z.infer<typeof CreateITSAPSOFTestEvidenceSchema>;
export type UpdateITSAPSOFTestEvidenceInput = z.infer<typeof UpdateITSAPSOFTestEvidenceSchema>;
