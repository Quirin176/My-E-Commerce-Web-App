using WebApp_API.DTOs;
using WebApp_API.Entities;

namespace WebApp_API.Services
{
    public interface IProductVariantService
    {
        // ────────────────────────────────────────────────── Public queries ──────────────────────────────────────────────────
        Task<ProductVariantDTOs.ProductVariantResponse?> GetByIdAsync(int id);
        Task<IEnumerable<ProductVariantDTOs.ProductVariantResponse>> GetByProductIdAsync(int productId);
        Task<IEnumerable<ProductVariantDTOs.ProductVariantResponse>> GetByProductSlugAsync(int productId);

        // ────────────────────────────────────────────────── Write operations ──────────────────────────────────────────────────
        Task<ProductVariantDTOs.ProductVariantResponse> CreateAsync(ProductVariantDTOs.CreateProductVariantRequest variant);
        // Task CreateVariantsAsync(IEnumerable<ProductVariantDTOs.CreateProductVariantRequest> variants);
        Task<ProductVariantDTOs.ProductVariantResponse?> UpdateAsync(int id, ProductVariantDTOs.UpdateProductVariantRequest request);
        Task<bool> DeleteAsync(int id);
    }
}