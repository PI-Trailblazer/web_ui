import config from "@/config";
import { createClient } from './client';

const client = createClient(config.API_MONITOR_URL);

const dmoMonitorService = {
    async getPayments() {
        return await client.get('/dmo/payments');
    },

    async getNumberOfPaymentsByNationality() {
        return await client.get('/dmo/number_of_payments_by_nationality');
    },

    async getProfitThisMonth() {
        return await client.get('/dmo/profit_this_month');
    },

    async getProfitComparisonWithPreviousMonth() {
        return await client.get('/dmo/profit_comparison_with_previous_month');
    },

    async getNumberOfSalesThisMonth() {
        return await client.get('/dmo/number_of_sales_this_month');
    },

    async getNumberOfSalesComparisonWithPreviousMonth() {
        return await client.get('/dmo/number_of_sales_comparison_with_previous_month');
    },

    async getMostConsumedTags() {
        return await client.get('/dmo/most_consumed_tags');
    },

    async getLastPayments() {
        return await client.get('/dmo/last_payments');
    },

    async getOffers() {
        return await client.get('/dmo/offers');
    },

    async getTotalNumberOfOffers() {
        return await client.get('/dmo/total_number_of_offers');
    },

    async getNewOffersThisMonth() {
        return await client.get('/dmo/new_offers_this_month');
    },

    async getNumberOfOffersByTag() {
        return await client.get('/dmo/number_of_offers_by_tag');
    },

    async getAnalysis(x: string, y: string) {
        return await client.get('/dmo/analysis', { params: { x, y } });
    },

    async getPrediction(x: string, y: string) {
        return await client.get('/dmo/prediction', { params: { x, y } });
    },
};

const providerMonitorService = {
    async getPayments() {
        return await client.get('/provider/payments');
    },

    async getNumberOfPaymentsByNationality() {
        return await client.get('/provider/number_of_payments_by_nationality');
    },

    async getProfitThisMonth() {
        return await client.get('/provider/profit_this_month');
    },

    async getProfitComparisonWithPreviousMonth() {
        return await client.get('/provider/profit_comparison_with_previous_month');
    },

    async getNumberOfSalesThisMonth() {
        return await client.get('/provider/number_of_sales_this_month');
    },

    async getNumberOfSalesComparisonWithPreviousMonth() {
        return await client.get('/provider/number_of_sales_comparison_with_previous_month');
    },

    async getMostConsumedTags() {
        return await client.get('/provider/most_consumed_tags');
    },

    async getLastPayments() {
        return await client.get('/provider/last_payments');
    },

    async getNumberOfOffers() {
        return await client.get('/provider/number_of_offers');
    },

    async getAnalysis(x: string, y: string) {
        return await client.get('/provider/analysis', { params: { x, y } });
    },

    async getPrediction(x: string, y: string) {
        return await client.get('/provider/prediction', { params: { x, y } });
    },
};

export { dmoMonitorService, providerMonitorService };
