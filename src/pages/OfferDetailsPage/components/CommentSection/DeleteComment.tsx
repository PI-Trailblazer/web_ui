import { Dialog, DialogHeader, DialogContent,DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { OfferService } from '@/services/Client/OfferService';
import { useToast } from '@/components/ui/use-toast';

interface DeleteCommentProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    reviewId: number;
    offerId: number;
}

export default function DeleteComment( { isOpen, setIsOpen, reviewId, offerId}: DeleteCommentProps ) {

    const { toast } = useToast();
    const queryClient = useQueryClient();

    const deleteComment = async (reviewId: number) => {
        return (await OfferService.deleteReview(reviewId)).data;
    }

    const deleteCommentMutation = useMutation({
        mutationFn: deleteComment,
        onSuccess: (data: any) => {
            queryClient.invalidateQueries(['reviews', offerId]);
            toast({
                variant: 'destructive',
                title: 'Review deleted',
                description: 'Your review has been deleted successfully',
            })          
            setIsOpen(false);      

        },
    });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Review</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Are you sure you want to delete this review?
                </DialogDescription>
                <div className="flex justify-end gap-4 mt-4">
                    <Button onClick={() => setIsOpen(false)} variant={'outline'}>Cancel</Button>
                    <Button onClick={ () => deleteCommentMutation.mutate(reviewId)} variant="destructive">
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}