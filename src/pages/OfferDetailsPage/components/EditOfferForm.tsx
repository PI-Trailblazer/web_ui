import React from 'react';
import { DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormValues, addOfferSchema } from '@/pages/YourOffersPage/components/schema'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OfferService } from '@/services/Client/OfferService';
import { useToast } from '@/components/ui/use-toast';
import { OfferDetailsProps } from '@/lib/types';

interface AddOfferDialogProps {
    toggleEditDetails: () => void;
    offer: OfferDetailsProps;
}

export const EditOfferForm: React.FC<AddOfferDialogProps> = ({ toggleEditDetails, offer 
}) => {
    const queryClient = useQueryClient();
    const { toast } = useToast();


    const editOfferForm = useForm<FormValues>({
        resolver: zodResolver(addOfferSchema),
        defaultValues: {
            name: offer?.name,
            description: offer?.description,
            street: offer?.street,
            city: offer?.city,
            postal_code: offer?.postal_code,
            price: offer?.price,
            max_quantity: offer?.max_quantity,
        },
    });

    const editOffer = async (data: FormValues) => {
        const apiData = {
            ...data,
            userid: offer?.userid,
            modules: offer?.modules,
            tags: offer?.tags,
            n_reviews: offer?.n_reviews,
            discount: offer?.discount,
            max_review_score: offer?.max_review_score,
        };
        console.log(apiData);

        const response = await OfferService.editOffer(offer.id, apiData);

        return response.data;
    }


    const editOfferMutation = useMutation({
        mutationFn: editOffer,
        onSuccess: (data: any) => {
            editOfferForm.reset();
            toggleEditDetails();
            toast({
                variant: 'success',
                title: 'Offer edited',
                description: 'Your offer has been edited successfully',
            });
            queryClient.invalidateQueries(['offer', offer.id]);
        },
        onError: (error: any) => {
            console.log(error);
        },
    })


    const handleEditOffer = async (data: FormValues) => {
        editOfferMutation.mutate(data);
    }

    return (
        <Form {...editOfferForm}>
            <form onSubmit={editOfferForm.handleSubmit(handleEditOffer)} className="space-y-6">
                <FormField
                    control={editOfferForm.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="mb-6">
                            <FormLabel>Offer's Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Example: Estádio do Benfi..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={editOfferForm.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="mb-6">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={editOfferForm.control}
                    name="street"
                    render={({ field }) => (
                        <FormItem className="mb-6">
                            <FormLabel>Street</FormLabel>
                            <FormControl>
                                <Input placeholder="Street" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex space-x-4">
                    <FormField
                        control={editOfferForm.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem className="mb-6">
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input placeholder="City" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={editOfferForm.control}
                        name="postal_code"
                        render={({ field }) => (
                            <FormItem className="mb-6">
                                <FormLabel>Postal Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="Postal Code" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex space-x-4">
                <FormField
                    control={editOfferForm.control}
                    name="price"
                    render={({ field }) => (
                    <FormItem className="mb-6 flex-1">
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="€€€" {...field} onChange={(e: { target: { valueAsNumber: any; }; }) => field.onChange(e.target.valueAsNumber)}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={editOfferForm.control}
                    name="max_quantity"
                    render={({ field }) => (
                    <FormItem className="mb-6 flex-1">
                        <FormLabel>Max Quantity</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="Max Quantity" {...field} onChange={(e: { target: { valueAsNumber: any; }; }) => field.onChange(e.target.valueAsNumber)}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
                <div className="flex justify-center space-x-10">
                    <Button type="submit" disabled={editOfferMutation.isPending}>
                        {editOfferMutation.isPending ? <Loader2 /> : 'Add Offer'}
                    </Button>
                    <DialogClose asChild>
                        <Button type="button" variant="destructive">
                        Cancel
                        </Button>
                    </DialogClose>
                </div>
            </form>
        </Form>
    );
}