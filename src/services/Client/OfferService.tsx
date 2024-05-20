import config from "@/config";
import { createClient } from './client';

const client = createClient(config.API_OFFER_URL);

const OfferService = {

    async getOffers(params: any) {
        return await client.get('/', { params });
    },

    async getOffer(id: number) {
        console.log(id);
        return await client.get(`/${id}`);
    },

    async getReviews(offer_id: number) {
        return await client.get(`/review/${offer_id}`);
    },

    async addReview(data: any) {
        return await client.post('/review/', data);
    },

    async deleteReview(id: number) {
        return await client.delete(`/review/${id}`);
    },

    async editReview(id: number, data: any) {
        return await client.put(`/review/${id}`, data);
    },

    async addOffer(data: any) {
        return await client.post('/', data);
    },

    async editOffer(id: number, data: any) {
        return await client.put(`/${id}`, data);
    },

    async getOffersByUser() {
        return await client.get('/user/');
    },

    async deleteOffer(id: number) {
        return await client.delete(`/${id}`);
    },
    
    async getImages(offer_id: number) {
        return await client.get(`/image/${offer_id}`);
    },

    async getOffersByID(params: any) {
        console.log(params);
        let url = '/list-by-ids/?';
        for (let id of params.ids) {
            url += `ids=${id}&`
        }
        return await client.get(url);
    },

    async addImage(data: any, offer_id: number) {
        return await client.post(`/image/` + offer_id, data);
    },



};

export { OfferService };