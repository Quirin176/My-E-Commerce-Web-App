import { apiClient } from "../apiClient";

export const productimageApi = {

    // GET: /api/productimages/{id} - 
    async GetById(id: number | string) {
        const res = await apiClient.get(`/productimages/id/${id}`);
        return res.data;
    },

    // GET: /api/productimages/${id} - Get all product images by ProductId
    async GetByProduct(id: number | string) {
        const res = await apiClient.get(`/productimages/product/${id}`);
        return res.data;
    },

    // GET: /api/productimages/${id} - Get all variant images by VariantId
    async GetByVariant(id: number | string) {
        const res = await apiClient.get(`/productimages/variant/${id}`);
        return res.data;
    },
};
