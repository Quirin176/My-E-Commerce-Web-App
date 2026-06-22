import { apiClient } from "../apiClient";

export const adminDashboardApi = {

    // GET /api/admindashboard
    async getSummary(
        topRecentOrdersAmount: number,
        topSellingProductsAmount: number,
        topNewestProductsAmount: number) {
        try {
            const params = new URLSearchParams();
            params.append("topRecentOrdersAmount", String(topRecentOrdersAmount));
            params.append("topSellingProductsAmount", String(topSellingProductsAmount));
            params.append("topNewestProductsAmount", String(topNewestProductsAmount));

            const res = await apiClient.get(`/admindashboard?${params.toString()}`);
            return res.data;
        } catch (error) {
            console.error(`Error updating order status:`, error);
            throw error;
        }
    }
}