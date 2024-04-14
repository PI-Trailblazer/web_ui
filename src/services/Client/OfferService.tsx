import config from "@/config";
import { createClient } from './client';

const client = createClient(config.API_OFFER_URL);

const OfferService = {

    async getOffers(params: any) {
        return await client.get('/', { params });
    },

    async getOffer(id: number) {
        return await client.get(`/${id}`);
    },

    async getReviews(offer_id: number) {
        return await client.get(`/review/${offer_id}`);
    }
};

export { OfferService };