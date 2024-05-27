import config from "@/config";
import { createClient } from './client';

const client = createClient(config.API_PAYMENT_URL);

const PaymentService = {
    async getPayments() {
        return await client.get('/');
    },

    async getPayment(id: number) {
        return await client.get(`/${id}`);
    },

    async addPayment(data: any) {
        return await client.post('/', data);
    },

    async getTransactionsByUser() {
        return await client.get('/user/');
    }
};

export { PaymentService };