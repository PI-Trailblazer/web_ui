import { z } from 'zod';

const accountChangeSchema = z.object({
  name: z.string()
    .min(1, { message: 'Name is required' })
    .max(50, { message: 'Name must not be longer than 50 characters' })
    .refine((data) => data.trim().split(/\s+/).length === 2, { message: 'Name must consist of exactly two words' }),
  phone: z
    .string()
    .optional()
    .refine(phone => (phone ? /^\+?[1-9]\d{1,14}$/.test(phone) : true), {
        message: 'Invalid phone number',
    }),
  email: z.string().email(),
  currentPassword: z.string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  tags: z.array(z.string())
    .optional(),
  image: z.string().optional(),
});

type AccountChangeFormValues = z.infer<typeof accountChangeSchema>;

export { accountChangeSchema };
export type { AccountChangeFormValues };
