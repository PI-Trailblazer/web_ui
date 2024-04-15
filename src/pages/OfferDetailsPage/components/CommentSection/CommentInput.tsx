import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OfferService } from '@/services/Client/OfferService';
import {
    Avatar,
    AvatarFallback,
    AvatarImage
    } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormValues, commentSchema } from './schema';
import { useForm } from 'react-hook-form';
import { useUserStore } from '@/stores/useUserStore';

interface CommentInputProps {
    offerId: number;
}

const CommentInput: React.FC<CommentInputProps> = ({ offerId }) => {

    const { token } = useUserStore();
    const [showLoginError, setShowLoginError] = useState(false);

    const queryClient = useQueryClient();

    const { register, handleSubmit, reset, watch } = useForm<FormValues>({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            comment: '',
        },
    });

    const addComment = async (data: FormValues) => {
        const apiData = {
            ...data,
            offerid: offerId,
            userid: '123',
            score: 0,
        };
        console.log(apiData);

        const response = await OfferService.addReview(apiData);

        return response.data;
    }

    const addCommentMutation = useMutation({
        mutationFn: addComment,
        onSuccess: (data: any) => {
            reset();
            queryClient.invalidateQueries(['reviews', offerId]);
        },
        enabled: !!token,
    });

    const handlePostComment = handleSubmit(async (data: any) => {
        if (!token) {
            setShowLoginError(true);
            return;
        }
        setShowLoginError(false);
        await addCommentMutation.mutateAsync(data);
    });

    return (
        <div className="my-6">
            <div className="flex items-center justify-between">
            <Avatar className="mr-2">
                <AvatarImage src="https://randomuser.me/api/portraits/men/3.jpg" alt="Avatar" />
                <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="relative w-full">
                <form className="w-full" onSubmit={handlePostComment}>
                    <Input
                        className="w-full rounded h-12 shadow-lg border-t-transparent border-x-transparent  p-2"
                        placeholder="Add a review..."
                        {...register('comment')}
                    />
                </form>
                {showLoginError && <div className="text-red-500">Login before post a comment</div>}
                <div className={`absolute bottom-0 right-0 text-sm ${watch('comment') && watch('comment').length > 1320 ? 'text-red-500' : ''}`}>
                    {watch('comment') ? watch('comment').length : 0}/1320
                </div>
            </div>
            </div>
        </div>
      );
    };

export default CommentInput;