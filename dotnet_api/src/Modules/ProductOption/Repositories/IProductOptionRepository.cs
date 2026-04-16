using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public interface IProductOptionRepository
    {
        // ────────────────────────────── Queries ──────────────────────────────
        Task<ProductOption?> GetByIdAsync(int id);
        Task<ProductOption?> GetByNameAndCategoryAsync(string name, int categoryId);
        Task<List<ProductOption>> GetByCategoryIdAsync(int categoryId);
        Task<List<ProductOption>> GetByCategorySlugAsync(string categorySlug);
        Task<bool> CategoryExistsAsync(int categoryId);

        // ────────────────────────────── Write Operations ──────────────────────────────
        Task AddAsync(ProductOption option);
        Task DeleteAsync(ProductOption option);
        Task SaveChangesAsync();
    }
}