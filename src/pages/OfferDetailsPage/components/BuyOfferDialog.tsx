import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useUserStore } from "@/stores/useUserStore";
import { PaymentService } from "@/services/Client/PaymentService";
import { OfferService } from "@/services/Client/OfferService";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { addOfferSchema, addOfferFormValues } from "./AddOfferSchema";
import { OfferDetailsProps } from "@/lib/types";
import { useEffect, useState } from "react";
import { SelectGroup } from "@radix-ui/react-select";


interface AddOfferDialogProps {
    toggleOpenBuyOfferDialog: () => void;
    isOpenBuyOfferDialog: boolean;
    offerId: number;
    quantitySelected: number;
}

interface Country {
    label: string;
    value: string;
}

export const BuyOfferDialog: React.FC<AddOfferDialogProps> = ({ toggleOpenBuyOfferDialog, isOpenBuyOfferDialog, offerId, quantitySelected }) => {

    const [averageScore, setAverageScore] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [countries, setCountries] = useState<Country[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    
    //user store
    const user = useUserStore();

    const { toast } = useToast();

    const fetchCountries = async () => {
        return (await axios.get("https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code")).data;
    };

    const { data: countriesFetched, isSuccess } = useQuery({
        queryKey: ['countries'],
        queryFn: fetchCountries,
    });

    useEffect(() => {
        if (isSuccess && countriesFetched) {
            setCountries(countriesFetched.countries);
            setSelectedCountry(countriesFetched.userSelectValue?.value || '');
        }
    }, [isSuccess, countriesFetched]);

    const buyOfferForm = useForm<addOfferFormValues>({
        resolver: zodResolver(addOfferSchema),
    });

    const fetchOffer = async (offerId: number) => {
        return (await OfferService.getOffer(offerId)).data;
    };

    const { data: offer, isLoading, isError } = useQuery<OfferDetailsProps>({
        queryKey: ['offer', offerId],
        queryFn: () => fetchOffer(offerId),
    });

    useEffect(() => {
        if (offer) {
            setAverageScore(offer.n_reviews !== 0 ? ((offer.max_review_score / offer.n_reviews) * 5) / 100 : 0);
            setTotalPrice(offer.price ? offer.price * quantitySelected : 0);
        }
    }, [offer, quantitySelected]);

    if (isLoading) return <div>Loading...</div>;
    if (isError || !offer) return <div>Error or no data available.</div>;

    //post request to buy offer

    const buyOffer = async (data: addOfferFormValues) => {
        const apiData = {
            ...data,
            offer_id: offerId,
            quantity: quantitySelected,
            status: "pending",
            amount: totalPrice,
            userid: user.sub
        }

        console.log(apiData);

        const response = await PaymentService.addPayment(apiData);

        return response.data;
    }

    const buyOfferMutation = useMutation({
        mutationFn: buyOffer,
        onSuccess: (data: any) => {
            buyOfferForm.reset();
            toggleOpenBuyOfferDialog();
            toast({
                variant: 'success',
                title: 'Offer bought',
                description: 'Your offer has been bought successfully',
            });
        },
        onError: (error: any) => {
            console.log(error);
            toast({
                variant: 'destructive',
                title: 'Error buying offer',
                description: 'An error occurred while buying the offer',
            });
        },
    });

    const handleBuyOffer = async (data: addOfferFormValues) => {
        buyOfferMutation.mutateAsync(data);
    };

    return (
        <Dialog open={isOpenBuyOfferDialog} onOpenChange={toggleOpenBuyOfferDialog}>
            <DialogContent>
                <div>
                    <div className="space-y-3 rounded-lg p-4">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold">Offer Details</h2>
                            <div className="space-y-1">
                                <div className="flex items-center">
                                    <p className="font-semibold">City:</p>
                                    <p className="ml-2">{offer.city}</p>
                                </div>
                                <div className="flex items-center">
                                    <p className="font-semibold">Postal Code:</p>
                                    <p className="ml-2">{offer.postal_code}</p>
                                </div>
                                <div className="flex items-center">
                                    <p className="font-semibold">Street:</p>
                                    <p className="ml-2">{offer.street}</p>
                                </div>
                                <div className="flex items-center">
                                    <p className="font-semibold">Average Rating:</p>
                                    <p className="ml-2">{averageScore}/5</p>
                                    <div className="flex ml-2">
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <span key={i} className={`inline-block ${i < Math.round(averageScore) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-semibold">Price</h2>
                                <span className="text-2xl font-semibold text-primary">{`$${offer.price}`}</span>
                            </div>
                        </div>
                    </div>
                    <Separator />
                    <div className="p-4">
                        <Form {...buyOfferForm}>
                            <form onSubmit={buyOfferForm.handleSubmit(handleBuyOffer)}>
                                <div className="flex justify-between">
                                    <div className="flex space-y-3 flex-col ">
                                        <p className="font-semibold text-sm">Total Price:</p>
                                        <p className="ml-2">
                                            {totalPrice} €
                                        </p>
                                    </div>
                                    <FormField control={buyOfferForm.control} name="nationality" render={({ field }) => (
                                        <FormItem className="w-1/2">
                                            <FormLabel className="font-semibold">Nationality</FormLabel>
                                            <FormControl>
                                                <Select value={field.value} onValueChange={(value) => { field.onChange(value); setSelectedCountry(value); }}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select country">{selectedCountry ? countries.find(c => c.value === selectedCountry)?.label : "Select country"}</SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {countries.map((country: any, index: number) => (
                                                                <SelectItem key={index} value={country.value}>{country.label}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )} />
                                </div>
                                <div className="flex justify-center mt-4 w-full">
                                    <Button type="submit">Buy Offer</Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
