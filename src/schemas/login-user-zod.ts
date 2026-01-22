import z from "zod"

export const loginUserZod = z.object({
    email: z.email(),
    password: z.string()
})