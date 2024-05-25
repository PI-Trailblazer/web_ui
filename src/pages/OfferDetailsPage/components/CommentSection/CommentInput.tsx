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
import { CommentFormValues, commentSchema } from './schema';
import { useForm } from 'react-hook-form';
import { useUserStore } from '@/stores/useUserStore';
import { useToast } from '@/components/ui/use-toast';


//import toast

interface CommentInputProps {
    offerId: number;
}

const CommentInput: React.FC<CommentInputProps> = ({ offerId }) => {


    const { token, image } = useUserStore();
    const [showLoginError, setShowLoginError] = useState(false);

    const queryClient = useQueryClient();

    //toast
    const { toast } = useToast();

    const { register, handleSubmit, reset, watch } = useForm<CommentFormValues>({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            comment: '',
        },
    });

    const addComment = async (data: CommentFormValues) => {
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

        onError: () => {
            toast({
                variant: 'destructive',
                title: 'Review not added',
                description: 'Can only review once per offer.'
            });
        }
    });

    const handlePostComment = handleSubmit(async (data: any) => {
        if (!token) {
            setShowLoginError(true);
            return;
        }
        setShowLoginError(false);
        await addCommentMutation.mutateAsync(data);
    });

    if (!token) return null;

    return (
        <div className="my-6">
            <div className="flex items-center justify-between">
            <Avatar className="mr-2">
                <AvatarImage src={image} alt="Avatar" />
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
                <div className={`absolute bottom-0 right-0 pr-2 text-sm ${watch('comment') && watch('comment').length > 1320 ? 'text-red-500' : ''}`}>
                    {watch('comment') ? watch('comment').length : 0}/1320
                </div>
            </div>
            </div>
        </div>
      );
    };

export default CommentInput;
