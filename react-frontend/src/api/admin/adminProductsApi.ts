import { apiClient } from "../apiClient";

export interface ProductPayload {
  name?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  basePrice?: number;
  thumbnailUrl?: string;
  categoryId?: number;

  selectedOptionValueIds?: number[];

  hasVariants: boolean;
};

export interface VariantImagePayload {
  imageUrl: string;
  displayOrder: number;
  isMain: boolean;
}

export interface ProductVariantPayload {
  variantName: string;
  sku: string;
  price: number;
  originalPrice: number;
  stock: number;
  productId: number | string;

  imageUrls: VariantImagePayload[];

  optionValueIds: number[];
}

export const adminProductsApi = {

  async createProduct(data: ProductPayload) {
    const res = await apiClient.post("/products", data);
    return res.data;
  },

  async updateProductById(id: number | string, data: ProductPayload) {
    const res = await apiClient.put(`/products/${id}`, data);
    return res.data;
  },

  async deleteProduct(id: number | string) {
    const res = await apiClient.delete(`/products/${id}`);
    return res.data;
  },

  async createVariant(data: ProductVariantPayload) {
    const res = await apiClient.post("/productvariants", data);
    return res.data;
  },

  async createVariants(productId: number | string, data: ProductVariantPayload[]) {
    const res = await apiClient.post(`/productvariants/product/${productId}`, data);
    return res.data;
  },

  async updateVariant(variantId: number | string, data: Partial<ProductVariantPayload>) {
    const res = await apiClient.put(`/productvariants/${variantId}`, data);
    return res.data;
  },

  // async updateVariants(productId: number | string, data: ProductVariantPayload[]) {
  //   const res = await apiClient.post(`/productvariants/${productId}`, data);
  //   return res.data;
  // },

  async delete(id: number | string) {
    const res = await apiClient.delete(`/productvariants/${id}`);
    return res.data;
  },
};
