using WebApp_API.Entities;
using WebApp_API.Specifications;

namespace WebApp_API.Repositories
{
    public interface IProductRepository
    {
        // ────────────────────────────────────────────────── Single product lookups ──────────────────────────────────────────────────
        Task<Product?> GetByIdAsync(int id);
        Task<Product?> GetBySlugAsync(string slug);

        // ────────────────────────────────────────────────── List queries ──────────────────────────────────────────────────
        Task<List<Product>> GetCategoryNewestAsync(int categoryId);
        Task<(List<Product> Items, int TotalCount)> GetPaginatedAsync(ProductFilterSpec spec, List<(int, List<int>)> optionGroups);
        Task<(List<Product> Items, int TotalCount)> SearchAsync(ProductSearchSpec spec);

        // ────────────────────────────────────────────────── Related data ──────────────────────────────────────────────────
        Task<List<(int OptionId, string OptionName, int ValueId, string Value)>> GetOptionsRawAsync(int productId);
        Task<List<int>> GetProductIdsByOptionValuesAsync(List<int> optionValueIds);

        // ────────────────────────────────────────────────── Validation helpers ──────────────────────────────────────────────────
        Task<bool> CheckProductExistsBySlugAsync(string slug);
        Task<List<int>> GetValidOptionValueIdsForCategoryAsync(int categoryId);

        // ────────────────────────────────────────────────── Write operations ──────────────────────────────────────────────────
        Task AddAsync(Product product);
        void Update(Product product);
        void Remove(Product product);

        Task SetOptionValuesAsync(int productId, IEnumerable<int> optionValueIds);

        Task SaveChangesAsync();
    }
}