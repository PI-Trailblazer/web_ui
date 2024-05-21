import config from "@/config";
import { createClient } from './client';
import qs from 'qs';

const client = createClient(config.API_RECOMMENDER_URL);

const RecommenderService = {
    
    async getMostRelevant(size: number) {
        return await client.get('/most_relevant', { params: { size } });
    },

    async getUserRecommendations(size: number) {
        return await client.get('/user_recommendation', { params: { size } });
    },

    async getOfferRecommendations(params: any) {
        const query = qs.stringify(params, { arrayFormat: 'repeat' });
        return await client.get('/offer_recommendation?' + query);
    }
};

export { RecommenderService };