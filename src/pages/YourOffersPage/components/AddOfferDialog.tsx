import React from 'react';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
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
import { FormValues, addOfferSchema } from './schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OfferService } from '@/services/Client/OfferService';

interface AddOfferDialogProps {
}

export const AddOfferDialog: React.FC<AddOfferDialogProps> = ({
}) => {
    const queryClient = useQueryClient();


    const form = useForm<FormValues>({
        resolver: zodResolver(addOfferSchema),
        defaultValues: {
            name: '',
            description: '',
            street: '',
            city: '',
            postal_code: '',
            price: 0,
            max_quantity: 0,
        },
    });

    const addOffer = async (data: FormValues) => {
        const apiData = {
            ...data,
            userid: '123',
            modules: [],
            tags: [],
            n_reviews: 0,
            discount: 0,
            max_review_score: 0,
        };
        console.log(apiData);

        const response = await OfferService.addOffer(apiData);

        return response.data;
    }


    const addOfferMutation = useMutation({
        mutationFn: addOffer,
        onSuccess: (data: any) => {
            form.reset();
            console.log(data);
            queryClient.invalidateQueries('offersByUser'); // Não  sei se é necessário
        },
        onError: (error: any) => {
            console.log(error);
        },
    })

    const handleAddOffer = async (data: FormValues) => {
        addOfferMutation.mutate(data);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddOffer)} className="space-y-6">
                <FormField
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
                        control={form.control}
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
                        control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
                    <Button type="submit" disabled={addOfferMutation.isLoading}>
                        {addOfferMutation.isPending ? <Loader2 /> : 'Add Offer'}
                    </Button>
                    <DialogClose asChild>
                        <Button type="button" variant="destructive">
                        Cancel
                        </Button>
                    </DialogClose>
                    {/* TODO adicionar toast para dizer que foi adicionada com sucesso */}
                </div>
            </form>
        </Form>
    );
}