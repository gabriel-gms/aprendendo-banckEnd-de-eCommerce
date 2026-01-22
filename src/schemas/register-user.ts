import z, { email } from "zod"

export const registerUser = z.object({
    name: z.string().nonempty(),
    email: z.email().nonempty(),
    password: z.string().nonempty()
})