import { apiClient } from "../apiClient";

export const productoptionvalueApi = {

    // Create an option value
    async createOptionValue(optionId: number, value: string) {
        const res = await apiClient.post(`/productoptionvalues/optionvalues`, {
            optionId,
            value
        });
        return res.data;
    },

    // Update an option value
    async updateOptionValue(optionValueId: number, value: string) {
        const res = await apiClient.put(`/productoptionvalues/optionvalues/${optionValueId}`, {
            value
        });
        return res.data;
    },

    // Delete an option value
    async deleteOptionValue(optionValueId: number) {
        const res = await apiClient.delete(`/productoptionvalues/optionvalues/${optionValueId}`);
        return res.data;
    },
}
