import { apiClient } from "../apiClient";

export interface CreateProductRequest {
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

export interface AddImageRequest {
  imageUrl: string;
  displayOrder: number;
  isMain: boolean;
  productId: number | null;
  variantId: number | null;
}

export interface ProductVariantPayload {
  variantName: string;
  sku: string;
  price: number;
  originalPrice: number;
  stock: number;
  productId: number | string;

  optionValueIds: number[];
}

export const adminProductsApi = {

  // POST: /api/products - Create a new product
  async createProduct(data: CreateProductRequest) {
    const res = await apiClient.post("/products", data);
    return res.data;
  },

  // PUT: /api/products/{id} - Update a product by id
  async updateProductById(id: number | string, data: CreateProductRequest) {
    const res = await apiClient.put(`/products/${id}`, data);
    return res.data;
  },

  // DELETE: /api/products/soft/{id} - Soft delete a product by id
  async deleteSoftOneProduct(id: number | string) {
    const res = await apiClient.delete(`/products/soft/${id}`);
    return res.data;
  },

  // DELETE: /api/products/soft - Soft delete multiple products by ids
  async deleteSoftMultipleProducts(request: (number | string)[]) {
    const res = await apiClient.delete(`/products/soft`, { data: request });
    return res.data;
  },

  // DELETE: /api/products/hard/{id} - Hard delete a product by id
  async deleteHardOneProduct(id: number | string) {
    const res = await apiClient.delete(`/products/hard/${id}`);
    return res.data;
  },

  // POST: /api/productvariants/product/variant/{productId} - Create a new product variant for a specific product
  async createVariant(productId: number | string, data: ProductVariantPayload) {
    const res = await apiClient.post(`/productvariants/product/variant/${productId}`, {
      ...data,
      productId: Number(productId),
    });
    return res.data;
  },

  // async createVariants(productId: number | string, data: ProductVariantPayload[]) {
  //   const res = await apiClient.post(`/productvariants/product/variants/${productId}`, data);
  //   return res.data;
  // },

  // PUT: /api/productvariants/{variantId} - Update a product variant by id
  async updateVariant(variantId: number | string, data: Partial<ProductVariantPayload>) {
    const res = await apiClient.put(`/productvariants/${variantId}`, data);
    return res.data;
  },

  // async updateVariants(productId: number | string, data: ProductVariantPayload[]) {
  //   const res = await apiClient.post(`/productvariants/${productId}`, data);
  //   return res.data;
  // },

  // DELETE: /api/productvariants/{id} - Delete a product variant by id
  async deleteVariant(id: number | string) {
    const res = await apiClient.delete(`/productvariants/${id}`);
    return res.data;
  },

  // POST: /api/productimages/images - Add product images
  async addProductImages(data: AddImageRequest[]) {
    const res = await apiClient.post("/productimages/images", data);
    return res.data;
  },

};