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
        Task<List<Product>> GetFilteredAsync(ProductFilterSpec spec, int? resolvedCategoryId);
        Task<(List<Product> Items, int TotalCount)> GetPaginatedAsync(ProductFilterSpec spec, int? resolvedCategoryId, string? search, int page, int pageSize);
        Task<(List<Product> Items, int TotalCount)> SearchAsync(ProductSearchSpec spec);
        Task<List<Product>> GetByCategoryAsync(int categoryId);

        // ────────────────────────────────────────────────── Related data ──────────────────────────────────────────────────
        Task<List<string>> GetImageUrlsAsync(int productId);
        Task<List<(int OptionId, string OptionName, int ValueId, string Value)>> GetOptionsRawAsync(int productId);
        Task<List<(int OptionId, List<int> ValueIds)>> GetOptionGroupsForValuesAsync(List<int> valueIds);
        Task<List<int>> GetProductIdsByOptionValuesAsync(List<int> optionValueIds);

        // ────────────────────────────────────────────────── Category resolution ──────────────────────────────────────────────────
        Task<int?> ResolveCategoryIdAsync(string slug);
        Task<bool> CategoryExistsAsync(int id);

        // ────────────────────────────────────────────────── Validation helpers ──────────────────────────────────────────────────
        Task<bool> SlugExistsAsync(string slug);
        Task<List<int>> GetValidOptionValueIdsForCategoryAsync(int categoryId);

        // ────────────────────────────────────────────────── Write operations ──────────────────────────────────────────────────
        Task AddAsync(Product product);
        void Update(Product product);
        void Remove(Product product);

        Task AddImagesAsync(IEnumerable<ProductImage> images);
        Task RemoveImagesAsync(int productId);

        Task SetOptionValuesAsync(int productId, IEnumerable<int> optionValueIds);

        Task SaveChangesAsync();
    }
}