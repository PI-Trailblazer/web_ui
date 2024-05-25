import NoOffers from './NoOffers';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OfferDetailsProps } from "@/lib/types";
import { OfferService } from '@/services/Client/OfferService';
import OfferCard from '@/components/OfferCard/OfferCard';
import OfferCardSkeleton from '@/components/OfferCard/OfferCardSkeleton';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';


interface OffersListProps {
}

const OffersList: React.FC<OffersListProps> = () => {

    const { toast } = useToast();

    const queryClient = useQueryClient();

    const getOffersByUser = async () => {
        const response = await OfferService.getOffersByUser();
        return response.data;
    }

    const { data: offers, isLoading, isSuccess } = useQuery<OfferDetailsProps[], Error>({
        queryKey: ['offersByUser'],
        queryFn: getOffersByUser,
    });

    useEffect(() => {
        console.log(offers);
    }, [offers])

    const deleteOffer = async (id: number) => {
        const response = await OfferService.deleteOffer(id);
        return response.data;
    }    

    const deleteMutation = useMutation({
        mutationFn: deleteOffer,
        onSuccess: (data: any) => {
            queryClient.invalidateQueries('offersByUser');
        },
        onError: (error: any) => {
            console.log(error);
        },
    })

    const handleDeleteOffer = async (id: number) => {
        console.log('Deletar oferta com id:', id);
        deleteMutation.mutate(id);
        toast({
            variant: 'destructive',
            title: 'Offer deleted',
            description: 'Your offer has been deleted successfully',
        });
    }
    
    return (
        <div className="flex flex-1 border mt-4 border-dashed border-primary rounded-lg justify-center items-center h-screen-2/6">
            {isLoading && (
                <div className="flex flex-col py-10 gap-4">
                    <OfferCardSkeleton />
                    <OfferCardSkeleton />
                    <OfferCardSkeleton />
                </div>
            )}
            {!isLoading && (!offers || offers.length === 0) && <NoOffers />}
            {isSuccess && offers && offers.length > 0 && (
                <div className={`grid p-4 gap-4 grid-cols-1 ${offers.length > 1 ? '2xl:grid-cols-2' : 'lg:w-3/4'}`}>
                    {offers.map((offer : Partial<OfferDetailsProps>, index: any) => (
                        <OfferCard key={index} 
                            name={offer.name}
                            description={offer.description}
                            price={offer.price}
                            tags={offer.tags}
                            max_review_score={offer.max_review_score}
                            n_reviews={offer.n_reviews}
                            id={offer.id}
                            showDelete={true} // Passa true para exibir o botão de exclusão
                            onDelete={() => handleDeleteOffer(offer.id)} // Passa a função que exclui a oferta
                            loading={deleteMutation.isPending}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default OffersList;