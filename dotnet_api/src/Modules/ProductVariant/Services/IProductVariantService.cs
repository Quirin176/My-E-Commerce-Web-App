using WebApp_API.DTOs;
using WebApp_API.Entities;

namespace WebApp_API.Services
{
    // Business Logic
    public interface IProductVariantService
    {
        // ────────────────────────────────────────────────── Public queries ──────────────────────────────────────────────────
        Task<ProductVariant?> GetByIdAsync(int id);
        Task<IEnumerable<ProductVariant>> GetAllAsync();
        Task<IEnumerable<ProductVariant>> GetByProductIdAsync(int productId);

        // ────────────────────────────────────────────────── Write operations ──────────────────────────────────────────────────

        Task CreateAsync(ProductVariantDTOs.CreateProductVariantRequest variant);
        Task<ProductVariant> UpdateAsync(ProductVariant variant);
        Task<bool> DeleteAsync(int id);
    }
}