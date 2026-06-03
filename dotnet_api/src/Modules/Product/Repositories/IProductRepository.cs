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
        Task<List<Product>> GetCategoryNewestAsync(int categoryId, int amount);
        Task<(List<Product> Items, int TotalCount)> GetPaginatedAsync(ProductFilterSpec spec);
        Task<(List<Product> Items, int TotalCount)> SearchAsync(ProductSearchSpec spec);

        // ────────────────────────────────────────────────── Validation helpers ──────────────────────────────────────────────────
        Task<bool> CheckProductExistsBySlugAsync(string slug);

        // ────────────────────────────────────────────────── Write operations ──────────────────────────────────────────────────
        Task<Product> AddAsync(Product product);
        void Update(Product product);
        void Remove(Product product);

        // ────────────────────────────────────────────────── Related data ──────────────────────────────────────────────────
        Task<List<(int OptionId, string OptionName, int ValueId, string Value)>> GetOptionsRawAsync(int productId);
        Task<List<(int OptionId, List<int> OptionValueIds)>> GetOptionGroupsForValuesAsync(List<int> optionValueIds);
        Task<List<int>> GetProductIdsByOptionValuesAsync(List<int> optionValueIds);
        Task SetOptionValuesAsync(int productId, IEnumerable<int> optionValueIds);

        Task SaveChangesAsync();
    }
}