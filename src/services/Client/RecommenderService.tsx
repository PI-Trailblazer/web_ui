import config from "@/config";
import { createClient } from './client';

const client = createClient(config.API_RECOMMENDER_URL);

const RecommenderService = {
    
    async getMostRelevant(params: any) {
        return await client.get('/most_relevant', { params });
    },

    async getUserRecommendations(params: any) {
        return await client.get('/user_recommendation', { params });
    },

    async getOfferRecommendations(params: any) {
        return await client.get('/offer_recommendation', { params });
    }
};

export { RecommenderService };