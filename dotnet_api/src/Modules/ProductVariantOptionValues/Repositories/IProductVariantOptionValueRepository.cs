namespace WebApp_API.Modules.ProductVariantOptionValues.Repositories
{
    public interface IProductVariantOptionValueRepository
    {
        // ────────────────────────────────────────────────── Single product lookups ──────────────────────────────────────────────────
        Task<IEnumerable<Entities.ProductVariantOptionValue>> GetByVariantIdAsync(int variantId);
        Task<Entities.ProductVariantOptionValue?> GetAsync(int variantId, int optionValueId);

        // ────────────────────────────────────────────────── List queries ──────────────────────────────────────────────────
        Task<IEnumerable<Entities.ProductVariantOptionValue>> GetAllAsync();

        // ────────────────────────────────────────────────── Write operations ──────────────────────────────────────────────────
        Task<Entities.ProductVariantOptionValue> AddAsync(Entities.ProductVariantOptionValue entity);
        Task AddRangeAsync(int variantId, IEnumerable<int> optionValueIds);
        Task<bool> DeleteAsync(int variantId, int optionValueId);
        Task DeleteByVariantIdAsync(int variantId);
        Task SaveChangesAsync();
    }
}