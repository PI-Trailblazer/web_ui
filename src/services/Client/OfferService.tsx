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
    },

    async addOffer(data: any) {
        return await client.post('/', data);
    },

    async getOffersByUser() {
        return await client.get('/user/');
    },

    async deleteOffer(id: number) {
        return await client.delete(`/${id}`);
    }


};

export { OfferService };