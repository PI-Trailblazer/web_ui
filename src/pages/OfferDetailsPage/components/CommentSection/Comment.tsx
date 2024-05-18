import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { UserService } from '@/services/Client/UserService';
import { OfferService } from '@/services/Client/OfferService';
import { Review, UserResponse } from '@/lib/types';
import { Avatar, 
    AvatarImage, 
    AvatarFallback
} from '@/components/ui/avatar';
import { useUserStore } from '@/stores/useUserStore';
import { EllipsisVertical, Flag, Trash2, Pencil } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { useState } from 'react';
import DeleteComment from './DeleteComment';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { CommentFormValues, commentSchema } from './schema';
import { useForm } from 'react-hook-form';
import EditComment from './EditComment';
  

const Comment = ({ review, userId, offerId }: { review: Review, userId: string, offerId: number }) => {

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isEditComment, setIsEditComment] = useState(false);
    
    const { register, watch } = useForm<CommentFormValues>({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            comment: review.comment,
        },
    });

    const { sub } = useUserStore();

    const fetchUser = async (userId: string) => {
        return (await UserService.getUserByUserId(userId)).data;
    };

    const { data: user, isLoading, isError } = useQuery<UserResponse>({
        queryKey: ['user', userId], 
        queryFn: () => fetchUser(userId),
    });

    if (isLoading) return <div>Loading user...</div>;
    if (isError || !user) return <div>Error loading user details.</div>;

    function handlePostComment(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        setIsEditDialogOpen(true);
    }

    return (
        <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <div className="font-semibold flex items-center text-primary">
                    <Avatar>
                        <AvatarImage src="https://randomuser.me/api/portraits/men/3.jpg" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="pl-4">
                    {user.f_name} {user.l_name}
                    </div>
                    </div>
                    <div className="text-xl pl-2 font-semibold text-secondary">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <span>
                                        {Array.from({ length: Math.ceil(review.score/20) }).map((_, index) => (
                                            <span key={index} className="text-yellow-400 drop-shadow-[0px.0px_1.10px_rgba(0,0,0,1)]                                ">★</span>
                                        ))}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent side='bottom'>
                                    Score based on the review: {review.score}%
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <EllipsisVertical size={24} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {sub !== userId && (
                            <DropdownMenuItem>
                                <Flag className="mr-2" size={16} /> Report
                            </DropdownMenuItem>
                        )}
                        {sub === userId && (
                            <>
                                <DropdownMenuItem onSelect={() => setIsEditComment(true)}>
                                    <Pencil className="mr-2" size={16} /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setIsDeleteOpen(true)}>
                                    <Trash2 className="mr-2" size={16} /> Delete
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {isEditComment ? (
                <div className="relative w-full">
                    <form className="w-full" onSubmit={handlePostComment}>
                        <Input
                            className="w-full rounded h-12 shadow-lg border-t-transparent border-x-transparent  p-2"
                            placeholder="Add a review..."
                            {...register('comment')}
                            defaultValue={review.comment} // Adicione esta linha para preencher o campo de entrada com o comentário atual
                        />
                    </form>
                    <div className={`absolute bottom-0 right-0 pr-2 text-sm ${watch('comment') && watch('comment').length > 1320 ? 'text-red-500' : ''}`}>
                        {watch('comment') ? watch('comment').length : 0}/1320
                    </div>
                </div>
            ) : (
                <p className="mt-2">{review.comment}</p>
            )}
            {isDeleteOpen && (
                <DeleteComment isOpen={isDeleteOpen} setIsOpen={setIsDeleteOpen} reviewId={review.id} offerId={offerId} />
            )}
            { isEditDialogOpen && (
                        <EditComment
                            isOpen={isEditDialogOpen}
                            setIsOpen={setIsEditDialogOpen}
                            setIsCommentEdit={setIsEditComment}
                            reviewId={review.id}
                            offerId={offerId}
                            comment={watch('comment')} // Passa o comentário para o componente EditComment
                        />
            )}
        </div>
    );
};

export default Comment;