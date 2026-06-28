using WebApp_API.Modules.Products.Specifications;

namespace WebApp_API.Modules.Products.Repositories
{
    public interface IProductRepository
    {
        // ────────────────────────────────────────────────── Single Queries ──────────────────────────────────────────────────
        Task<Entities.Product?> GetByIdAsync(int id);
        Task<Entities.Product?> GetBySlugAsync(string slug);

        // ────────────────────────────────────────────────── List Queries ──────────────────────────────────────────────────
        Task<List<Entities.Product>> GetByIdsAsync(IEnumerable<int> productIds);
        Task<List<Entities.Product>> GetCategoryNewestAsync(int categoryId, int amount);
        Task<List<Entities.Product>> GetTopSellingProducts(int categoryId, int amount);
        Task<(List<Entities.Product> Items, int TotalCount)> GetPaginatedAsync(ProductFilterSpec spec);
        Task<(List<Entities.Product> Items, int TotalCount)> GetSoftDeletedPaginatedAsync(ProductFilterSpec spec);
        Task<(List<Entities.Product> Items, int TotalCount)> SearchAsync(ProductSearchSpec spec);

        // ────────────────────────────────────────────────── Validation helpers ──────────────────────────────────────────────────
        Task<bool> CheckProductExistsBySlugAsync(string slug);

        // ────────────────────────────────────────────────── Write Commands ──────────────────────────────────────────────────
        Task<Entities.Product> AddAsync(Entities.Product product);
        void Update(Entities.Product product);
        void Remove(Entities.Product product);

        // ────────────────────────────────────────────────── Related data ──────────────────────────────────────────────────
        Task<List<(int OptionId, string OptionName, int ValueId, string Value)>> GetOptionsRawAsync(int productId);
        Task<List<(int ProductId, int OptionId, string OptionName, int ValueId, string Value)>> GetOptionsRawForProductsAsync(IEnumerable<int> productIds);
        Task SetOptionValuesAsync(Entities.Product product, IEnumerable<int> optionValueIds);

        Task SaveChangesAsync();
    }
}