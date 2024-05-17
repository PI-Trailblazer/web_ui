import { z } from 'zod';

const addOfferSchema = z
    .object({
        name: z.string().min(1, { message: "Offer's Name is required" }),
        description: z.string().min(1, { message: 'Description is required' }).min(64, { message: 'Description must be at least 64 characters long' }),
        street: z.string().min(1, { message: 'Street is required' }),
        city: z.string().min(1, { message: 'City is required' }),
        postal_code: z.string().min(1, { message: 'Postal Code is required' }),
        price: z.number().min(1, { message: 'Price is required' })
                        .gte(0, { message: 'Price must be greater than or equal to 0' }),
        max_quantity: z.number().min(1, { message: 'Max quantity is required' })
                              .gte(0, { message: 'Max quantity must be greater than or equal to 0' }),
    });

type FormValues = z.infer<typeof addOfferSchema>;

export { addOfferSchema };
export type { FormValues };