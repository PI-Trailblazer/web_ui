import  { z } from 'zod';

const commentSchema = z.object({
    comment: z.string().min(1, { message: 'Comment is required' }).max(
        1320,
        { message: 'Comment is too long' }
    )
});

type CommentFormValues = z.infer<typeof commentSchema>;

export { commentSchema };
export type { CommentFormValues };