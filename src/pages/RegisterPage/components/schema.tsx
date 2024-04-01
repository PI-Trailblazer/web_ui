import { z } from 'zod';

const regiterSchema = z
    .object({
        firstName: z.string().min(1, { message: 'First Name is required' }),
        lastName: z.string().min(1, { message: 'Second Name is required' }),
        email: z.string().email(),
        phone: z
            .string()
            .optional()
            .refine(phone => (phone ? /^\+?[1-9]\d{1,14}$/.test(phone) : true), {
                message: 'Invalid phone number',
            }),
        password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
        verifyPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
        additionalInfo: z.string().optional(), // linha de teste
    })
    .refine(data => data.password === data.verifyPassword, {
        message: 'Passwords do not match',
        path: ['verifyPassword'],
    });

type FormValues = z.infer<typeof regiterSchema>;

export { regiterSchema };
export type { FormValues };
