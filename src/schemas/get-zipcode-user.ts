import z from "zod"

export const getZipcodeUser = z.object({
    zipcode: z.string().min(4).nonempty()
})