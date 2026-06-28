namespace WebApp_API.Modules.ProductOptions.Repositories
{
    public interface IProductOptionRepository
    {
        // ────────────────────────────── Queries ──────────────────────────────
        Task<Entities.ProductOption?> GetByIdAsync(int id);
        Task<Entities.ProductOption?> GetByNameAndCategoryAsync(string name, int categoryId);
        Task<List<Entities.ProductOption>> GetByCategoryIdAsync(int categoryId);
        Task<List<Entities.ProductOption>> GetByCategorySlugAsync(string categorySlug);
        Task<bool> CategoryExistsAsync(int categoryId);

        // ────────────────────────────── Write Operations ──────────────────────────────
        Task AddAsync(Entities.ProductOption option);
        Task DeleteAsync(Entities.ProductOption option);
        Task SaveChangesAsync();
    }
}