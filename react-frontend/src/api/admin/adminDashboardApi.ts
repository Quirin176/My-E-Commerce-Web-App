import { apiClient } from "../apiClient";

export const adminDashboardApi = {
    async getSummary() {
        try {
            const res = await apiClient.get("/admindashboard");
            return res.data;
        } catch (error) {
            console.error(`Error updating order status:`, error);
            throw error;
        }
    }
}