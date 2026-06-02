import { z } from 'zod';

/**
 * Zod schema for LineItemsSTR validation
 */
export const LineItemsSTRSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  appName: z.string().optional(),
  headerID: z.string().optional(),
  itemDescription: z.string().optional(),
  lineItemID: z.string().optional(),
  quantity: z.string().optional(),
  remarks: z.string().optional(),
  siteKey: z.enum(['SiteKey0', 'SiteKey1']).optional(),
  totalCost: z.string().optional(),
  unitCost: z.string().optional(),
});

/**
 * Schema for creating a new LineItemsSTR (omits system-generated ID)
 */
export const CreateLineItemsSTRSchema = LineItemsSTRSchema.omit({ id: true });

/**
 * Schema for updating an existing LineItemsSTR
 */
export const UpdateLineItemsSTRSchema = LineItemsSTRSchema;

export type LineItemsSTRInput = z.infer<typeof LineItemsSTRSchema>;
export type CreateLineItemsSTRInput = z.infer<typeof CreateLineItemsSTRSchema>;
export type UpdateLineItemsSTRInput = z.infer<typeof UpdateLineItemsSTRSchema>;