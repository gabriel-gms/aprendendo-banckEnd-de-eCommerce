import z from "zod";

export const getRelatedProductQuerySchema = z.object({
    limit: z.string().regex(/^\d+$/).optional()
})