import config from "@/config";
import { createClient } from './client';
import qs from 'qs';

const client = createClient(config.API_RECOMMENDER_URL);

const RecommenderService = {
    
    async getMostRelevant(params: any) {
        return await client.get('/most_relevant', { params });
    },

    async getUserRecommendations(params: any) {
        return await client.get('/user_recommendation', { params });
    },

    async getOfferRecommendations(params: any) {
        const query = qs.stringify(params, { arrayFormat: 'repeat' });
        return await client.get('/offer_recommendation?' + query);
    }
};

export { RecommenderService };