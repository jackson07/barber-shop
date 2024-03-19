import { z } from "zod";

export const FormSchema = z.object({
    serviceName: z.string().min(2, {
        message: "O nome do serviço deve ter pelo menos 2 caracteres.",
    }),
    description: z.string().min(2, {
        message: "A descrição deve ter pelo menos 2 caracteres.",
    }),
    price: z.union([
        z.string(),
        z.number(),
    ])
        .refine((value) => !isNaN(Number(value)), {
            message: "O preço deve ser um número válido.",
        })
        .transform((value) => typeof value === 'string' ? parseFloat(value) : value),
})