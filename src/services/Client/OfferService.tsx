import config from "@/config";
import { createClient } from './client';

const client = createClient(config.API_OFFER_URL);

const OfferService = {

    async getOffers(params: any) {
        return await client.get('/', { params });
    },
};

export { OfferService };