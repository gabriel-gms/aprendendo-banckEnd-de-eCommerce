import z from "zod"

export const getIdProductForCart = z.object({
    ids: z.array(z.number().int()).nonempty()
})