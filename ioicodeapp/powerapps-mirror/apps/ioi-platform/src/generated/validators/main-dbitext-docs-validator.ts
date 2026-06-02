import { z } from 'zod';

export const MainDBITExtDocsSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  parentFormCode: z.string().min(1, { message: "Parent Form Code is required" }),
  parentRecord: z.object({ id: z.number(), title: z.string() }),
  parentSite: z.string().optional(),
  // ITP
  iTPDocType: z.string().optional(),
  iTPDocTitle: z.string().optional(),
  iTPVersionNo: z.string().optional(),
  iTPDateLastUpdated: z.string().optional(),
  iTPRevisionNo: z.string().optional(),
  iTPApplicableTo: z.string().optional(),
  iTPComments: z.string().optional(),
  // ITP2
  iTP2TrainingType: z.string().optional(),
  iTP2Title: z.string().optional(),
  iTP2VersionNo: z.string().optional(),
  iTP2DateLastUpdated: z.string().optional(),
  iTP2RevisionNo: z.string().optional(),
  iTP2ApplicableTo: z.string().optional(),
  iTP2Comments: z.string().optional(),
  // IOIP
  iOIPCategory: z.string().optional(),
  iOIPTitle: z.string().optional(),
  iOIPVersionNo: z.string().optional(),
  iOIPEffectiveDate: z.string().optional(),
  iOIPExpiryDate: z.string().optional(),
  iOIPScope: z.string().optional(),
  iOIPDescription: z.string().optional(),
  iOIPObjective: z.string().optional(),
  // ITI
  iTIInfoType: z.string().optional(),
  iTISubject: z.string().optional(),
  iTIRemarks: z.string().optional(),
});

export const CreateMainDBITExtDocsSchema = MainDBITExtDocsSchema.omit({ id: true });
export const UpdateMainDBITExtDocsSchema = MainDBITExtDocsSchema;

export type MainDBITExtDocsInput = z.infer<typeof MainDBITExtDocsSchema>;
export type CreateMainDBITExtDocsInput = z.infer<typeof CreateMainDBITExtDocsSchema>;
export type UpdateMainDBITExtDocsInput = z.infer<typeof UpdateMainDBITExtDocsSchema>;
