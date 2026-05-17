using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public interface IProductVariantOptionValueRepository
    {
        // ────────────────────────────────────────────────── Single product lookups ──────────────────────────────────────────────────
        Task<IEnumerable<ProductVariantOptionValue>> GetByVariantIdAsync(int variantId);
        Task<ProductVariantOptionValue?> GetAsync(int variantId, int optionValueId);

        // ────────────────────────────────────────────────── List queries ──────────────────────────────────────────────────
        Task<IEnumerable<ProductVariantOptionValue>> GetAllAsync();

        // ────────────────────────────────────────────────── Write operations ──────────────────────────────────────────────────
        Task<ProductVariantOptionValue> AddAsync(ProductVariantOptionValue entity);
        Task AddRangeAsync(int variantId, IEnumerable<int> optionValueIds);
        Task<bool> DeleteAsync(int variantId, int optionValueId);
        Task DeleteByVariantIdAsync(int variantId);
        Task SaveChangesAsync();
    }
}