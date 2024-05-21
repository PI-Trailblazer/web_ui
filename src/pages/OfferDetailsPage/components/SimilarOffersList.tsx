import { OfferDetailsProps } from "@/lib/types";
import { OfferService } from '@/services/Client/OfferService'
import { RecommenderService } from '@/services/Client/RecommenderService'
import { useQuery } from '@tanstack/react-query'
import { SimilarOffersCard } from './SimilarOffersCard'
import { useEffect } from "react";

interface SimilarOffersListProps {
    offerTags : string[]
    offerId: number 
}

export function SimilarOffersList({offerTags, offerId}: SimilarOffersListProps) {

    const fetchSimilarOffersIds = async ({ queryKey }: { queryKey: [string, string[]] }) => {
        
        const tags = queryKey[1];

        const getInfo = {
            size: 4,
            offer_tags: tags // Certifique-se de que 'tags' é um array de strings
        };
    

        console.log(getInfo)

        return (await RecommenderService.getOfferRecommendations(getInfo)).data;
    }

    const { data: similarOffersIds, isLoading: isLoadingSimilarOffersIds} = useQuery({
        queryKey: ['similar_offersIds', offerTags],
        queryFn: fetchSimilarOffersIds,
        enabled: offerTags.length > 0
    })

    const fetchSimilarOffers = async (similarOffersIds: number[]) => {
        let ids = similarOffersIds.queryKey[1].data
        return (await OfferService.getOffersByID({ids: ids})).data
    }

    const { data: similarOffers, isLoading: isLoadingSimilarOffers} = useQuery({
        queryKey: ['similar_offers', similarOffersIds],
        queryFn: fetchSimilarOffers,
    })

    console.log(similarOffers)

    if(isLoadingSimilarOffersIds || isLoadingSimilarOffers){
        return <div>Loading...</div>
    }

    //remover a oferta atual da lista de ofertas similares
    const filteredOffers = similarOffers.filter((offer: OfferDetailsProps) => offer.id !== offerId)

    //se nao tiver ofertas similares
    if(!similarOffers || similarOffers.length === 0){
        return <div>No similar offers found</div>
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {filteredOffers.map((offer: OfferDetailsProps) => (
                <SimilarOffersCard key={offer.id} offer={offer} />
            ))}
        </div>
    )
}
