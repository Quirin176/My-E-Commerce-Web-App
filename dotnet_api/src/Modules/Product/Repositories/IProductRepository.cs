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
        // Public product listing with optional category/price/option filters
        Task<List<Product>> GetFilteredAsync(ProductFilterSpec spec, int? resolvedCategoryId);

        // Admin paginated listing; returns data + total count for pagination
        Task<(List<Product> Items, int TotalCount)> GetPaginatedAsync(
            ProductFilterSpec spec,
            int? resolvedCategoryId,
            string? search,
            int page,
            int pageSize);

        // Full-text search across name, descriptions and category name
        Task<(List<Product> Items, int TotalCount)> SearchAsync(ProductSearchSpec spec);

        // All products in a category (unfiltered, for category page)
        Task<List<Product>> GetByCategoryAsync(int categoryId);

        // ────────────────────────────────────────────────── Related data ──────────────────────────────────────────────────
        Task<List<string>> GetImageUrlsAsync(int productId);

        // Returns flat option pairs (optionName + value) for a product
        Task<List<(int OptionId, string OptionName, int ValueId, string Value)>> GetOptionsRawAsync(int productId);

        // Returns all option-value IDs mapped to their ProductOption for a category
        Task<List<(int OptionId, List<int> ValueIds)>> GetOptionGroupsForValuesAsync(List<int> valueIds);

        // Product IDs that carry any of the given option-value IDs
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