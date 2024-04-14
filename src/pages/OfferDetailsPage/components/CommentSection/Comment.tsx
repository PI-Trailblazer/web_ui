import { useQuery } from '@tanstack/react-query';
import { UserService } from '@/services/Client/UserService';
import { Review, UserResponse } from '@/lib/types';

const Comment = ({ review, userId }: { review: Review, userId: string }) => {

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
                <div className="font-semibold text-primary">{user.f_name} {user.l_name}</div>
                <div className="text-sm font-semibold text-secondary">Rating:
                    <span>
                        {Array.from({ length: review.score }).map((_, index) => (
                            <span key={index} className="text-yellow-400">★</span>
                        ))}
                    </span>
                </div>
            </div>
            <p className="mt-2">{review.comment}</p>
        </div>
    );
};

export default Comment;
