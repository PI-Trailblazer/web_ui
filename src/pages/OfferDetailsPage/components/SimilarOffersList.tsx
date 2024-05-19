import { OfferDetailsProps } from "@/lib/types";
import { OfferService } from '@/services/Client/OfferService'
import { RecommenderService } from '@/services/Client/RecommenderService'
import { useQuery } from '@tanstack/react-query'
import { SimilarOffersCard } from './SimilarOffersCard'

interface SimilarOffersListProps {
    offerTags : string[]
}

export function SimilarOffersList({offerTags}: SimilarOffersListProps) {

    const fetchSimilarOffersIds = async (offerTags: string[]) => {

        const getInfo = {
            user_tags: offerTags,
            size: 3
        }

        return (await RecommenderService.getUserRecommendations(getInfo)).data

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

    if(isLoadingSimilarOffersIds || isLoadingSimilarOffers){
        return <div>Loading...</div>
    }


    return (
        <div className="grid grid-cols-1 gap-4">
            {similarOffers.map((offer: OfferDetailsProps) => (
                <SimilarOffersCard key={offer.id} offer={offer} />
            ))}
        </div>
    )
}
