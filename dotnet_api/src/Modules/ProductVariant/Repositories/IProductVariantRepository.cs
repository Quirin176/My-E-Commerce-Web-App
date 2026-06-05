using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public interface IProductVariantRepository
    {
        // ────────────────────────────────────────────────── Single product lookups ──────────────────────────────────────────────────
        Task<ProductVariant?> GetByIdAsync(int id);

        // ────────────────────────────────────────────────── List queries ──────────────────────────────────────────────────
        Task<IEnumerable<ProductVariant>> GetByProductIdAsync(int productId);
        Task<IEnumerable<ProductVariant>> GetByProductSlugAsync(string productSlug);

        // ────────────────────────────────────────────────── Write operations ──────────────────────────────────────────────────
        Task AddAsync(ProductVariant variant);
        // Task AddRangeAsync(IEnumerable<ProductVariant> variant);
        Task UpdateAsync(ProductVariant variant);
        Task<bool> DeleteAsync(int id);
        Task DeleteByProductIdAsync(int productId);

        Task SaveChangesAsync();
    }
}