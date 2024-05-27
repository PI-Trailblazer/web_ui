import {z} from 'zod';

const addOfferSchema = z.object({
    nationality: z.string()
        .min(1, {message: 'Nationality is required'}),
});

type addOfferFormValues = z.infer<typeof addOfferSchema>;

export {addOfferSchema};

export type {addOfferFormValues};