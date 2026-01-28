import z from "zod";

export const getOrderSessionIdSchema = z.object({
    session_id: z.string()
})