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

const Comment = ({ review, userId, offerId }: { review: Review, userId: string, offerId: number }) => {

    const queryClient = useQueryClient();
    
    const { sub } = useUserStore();

    console.log(sub);

    const deleteComment = async (reviewId: number) => {
        return (await OfferService.deleteReview(reviewId)).data;
    }

    const deleteCommentMutation = useMutation({
        mutationFn: deleteComment,
        onSuccess: (data: any) => {
            queryClient.invalidateQueries(['reviews', offerId]);

        },
    });

    const fetchUser = async (userId: string) => {
        return (await UserService.getUserByUserId(userId)).data;
    };

    const { data: user, isLoading, isError } = useQuery<UserResponse>({
        queryKey: ['user', userId], 
        queryFn: () => fetchUser(userId),
    });

    if (isLoading) return <div>Loading user...</div>;
    if (isError || !user) return <div>Error loading user details.</div>;

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
                                <DropdownMenuItem>
                                    <Pencil className="mr-2" size={16} /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => deleteCommentMutation.mutate(review.id)}>
                                    <Trash2 className="mr-2" size={16} /> Delete
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <p className="mt-2">{review.comment}</p>
        </div>
    );
};

export default Comment;