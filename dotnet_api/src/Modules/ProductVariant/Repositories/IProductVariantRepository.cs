using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public interface IProductVariantRepository
    {
        // ────────────────────────────────────────────────── Single product lookups ──────────────────────────────────────────────────
        Task<ProductVariant?> GetByIdAsync(int id);

        // ────────────────────────────────────────────────── List queries ──────────────────────────────────────────────────
        Task<IEnumerable<ProductVariant>> GetAllAsync();
        Task<IEnumerable<ProductVariant>> GetByProductIdAsync(int productId);

        // ────────────────────────────────────────────────── Write operations ──────────────────────────────────────────────────
        Task<ProductVariant> AddAsync(ProductVariant variant);
        Task AddRangeAsync(IEnumerable<ProductVariant> variant);
        Task<ProductVariant> UpdateAsync(ProductVariant variant);
        Task<bool> DeleteAsync(int id);
    }
}