import {
    Dialog,
    DialogHeader,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { OfferService } from '@/services/Client/OfferService';
import { useToast } from '@/components/ui/use-toast';

interface EditCommentProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    reviewId: number;
    offerId: number;
    comment: string;
    setIsCommentEdit: (isEditComment: boolean) => void;
}

export default function EditComment({
    isOpen,
    setIsOpen,
    reviewId,
    offerId,
    comment,
    setIsCommentEdit,
}: EditCommentProps) {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const editComment = async (data: any) => {
        const apiData = {
            ...data,
            score: 0,
        };

        console.log(apiData);

        return (await OfferService.editReview(reviewId, apiData)).data;
    };

    const editCommentMutation = useMutation({
        mutationFn: editComment,
        onSuccess: (data: any) => {
            queryClient.invalidateQueries(['reviews', offerId]);
            toast({
                variant: 'success',
                title: 'Review updated',
                description: 'Your review has been updated successfully',
            });
            setIsOpen(false);
            setIsCommentEdit(false);
        },
    });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Review</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Are you sure you want to edit this review?
                </DialogDescription>
                <div className="flex justify-end gap-4 mt-4">
                    <Button onClick={() => setIsOpen(false)} variant={'outline'}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => editCommentMutation.mutate({ comment })}
                    >
                        Edit
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}