import { z } from 'zod';

const accountEditSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1, { message: 'Name is required' })
        .max(50, { message: 'Name must not be longer than 50 characters' }),
    phone: z
        .string().min(1, { message: 'Phone number is required' })
        .refine(phone => (phone ? /^\+?[1-9]\d{1,14}$/.test(phone) : true), {
            message: 'Invalid phone number',
        }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

type AccountEditFormValues = z.infer<typeof accountEditSchema>;

export { accountEditSchema };
export type { AccountEditFormValues };