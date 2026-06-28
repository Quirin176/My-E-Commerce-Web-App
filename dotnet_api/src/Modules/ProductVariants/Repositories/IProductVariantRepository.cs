namespace WebApp_API.Modules.ProductVariants.Repositories
{
    public interface IProductVariantRepository
    {
        // ────────────────────────────────────────────────── Single product lookups ──────────────────────────────────────────────────
        Task<Entities.ProductVariant?> GetByIdAsync(int id);

        // ────────────────────────────────────────────────── List queries ──────────────────────────────────────────────────
        Task<IEnumerable<Entities.ProductVariant>> GetByProductIdAsync(int productId);
        Task<IEnumerable<Entities.ProductVariant>> GetByProductSlugAsync(string productSlug);

        // ────────────────────────────────────────────────── Write operations ──────────────────────────────────────────────────
        Task AddAsync(Entities.ProductVariant variant);
        // Task AddRangeAsync(IEnumerable<ProductVariant> variant);
        Task UpdateAsync(Entities.ProductVariant variant);
        Task<bool> DeleteAsync(int id);
        Task DeleteByProductIdAsync(int productId);

        Task SaveChangesAsync();
    }
}