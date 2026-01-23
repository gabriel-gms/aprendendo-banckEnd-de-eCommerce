import z from 'zod'

export const registerAddres = z.object({
    zipcode: z.string().nonempty(),
    street: z.string().nonempty(),
    number: z.string().nonempty(),
    city: z.string().nonempty(),
    state: z.string().nonempty(),
    country: z.string().nonempty(),
    complement: z.string().optional()
})