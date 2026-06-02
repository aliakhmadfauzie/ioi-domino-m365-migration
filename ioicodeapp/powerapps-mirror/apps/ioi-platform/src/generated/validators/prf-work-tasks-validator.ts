import { z } from 'zod';

export const PRFWorkTasksSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  parentFormCode: z.string().min(1, { message: "Parent Form Code is required" }),
  parentRecord: z.object({ id: z.number(), title: z.string() }),
  taskNo: z.string().optional(),
  taskDescription: z.string().optional(),
  taskAssignedTo: z.string().optional(),
  taskDueDate: z.string().optional(),
  taskStatus: z.string().optional(),
  taskStartDate: z.string().optional(),
  taskCompletedDate: z.string().optional(),
  taskRemarks: z.string().optional(),
});

export const CreatePRFWorkTasksSchema = PRFWorkTasksSchema.omit({ id: true });
export const UpdatePRFWorkTasksSchema = PRFWorkTasksSchema;

export type PRFWorkTasksInput = z.infer<typeof PRFWorkTasksSchema>;
export type CreatePRFWorkTasksInput = z.infer<typeof CreatePRFWorkTasksSchema>;
export type UpdatePRFWorkTasksInput = z.infer<typeof UpdatePRFWorkTasksSchema>;
