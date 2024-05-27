import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"  
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Form, FormControl, FormField, FormItem, FormMessage} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useUserStore } from "@/stores/useUserStore";
import { COUNTRIES } from "@/data/countries"
import { PaymentService } from "@/services/Client/PaymentService"
import { OfferService } from "@/services/Client/OfferService"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import { addOfferSchema, addOfferFormValues } from "./AddOfferSchema"
import { OfferDetailsProps} from "@/lib/types";
import { useEffect, useState } from "react"


interface AddOfferDialogProps {
    toggleOpenBuyOfferDialog: () => void;
    isOpenBuyOfferDialog: boolean;
    offerId: number;
    quantitySelected: number;
}

export const BuyOfferDialog: React.FC<AddOfferDialogProps> = ({ toggleOpenBuyOfferDialog, isOpenBuyOfferDialog, offerId, quantitySelected }) => {

    const [averageScore, setAverageScore] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    const { toast } = useToast();

    //"https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
    
    const { data: countries } = useQuery({
        queryKey: ['countries'],
        queryFn: () => axios.get("https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code").then(res => res.data)
    });
    
    const buyOfferForm = useForm<addOfferFormValues>({
        resolver: zodResolver(addOfferSchema),
    });

    //get offer by id
    const fetchOffer = async (offerId: number) => {
        return (await OfferService.getOffer(offerId)).data
    }

    const { data: offer, isLoading, isError } = useQuery<OfferDetailsProps>({
        queryKey: ['offer', offerId],
        queryFn: () => fetchOffer(offerId)
    });

    useEffect(() => {
        if (offer) {
            setAverageScore(offer.n_reviews !== 0 ? ((offer.max_review_score / offer.n_reviews) * 5) / 100 : 0);
            setTotalPrice(offer.price ? offer.price * quantitySelected : 0);
        }
    }, [offer]);
    
    if (isLoading) return <div>Loading...</div>;
    if (isError || !offer) return <div>Error or no data available.</div>;

    // {userCountryCode: 'PT', countries: Array(250), userSelectValue: {…}}

    const handleBuyOffer = async (data: addOfferFormValues) => {
        console.log(data);
    }

    return (
        <Dialog open={isOpenBuyOfferDialog} onOpenChange={toggleOpenBuyOfferDialog}>
            <DialogContent>
                <div>
                    <div className="space-y-3 rounded-lg p-4">
                        <div className="space-y-2">
                            {/* Offer Details */}
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
                    <div className="flex flex-row justify-between items-center p-4">
                        <Form {...buyOfferForm}>
                            <form onSubmit={buyOfferForm.handleSubmit(handleBuyOffer)} className="space-y-6">
                                <div className="flex items-center">
                                    <p className="font-semibold">Total:</p>
                                    <p className="ml-2">
                                        {totalPrice} €
                                    </p>
                                    
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
};