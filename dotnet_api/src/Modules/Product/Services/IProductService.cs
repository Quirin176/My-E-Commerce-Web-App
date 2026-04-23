using WebApp_API.DTOs;
using WebApp_API.Specifications;
using static WebApp_API.DTOs.PaginationDTOs;

namespace WebApp_API.Services
{
    // Business Logic
    public interface IProductService
    {
        // ────────────────────────────────────────────────── Public queries ──────────────────────────────────────────────────
        Task<ProductDTOs.ProductDetailResponse?> GetByIdAsync(int id);
        Task<ProductDTOs.ProductDetailResponse?> GetBySlugAsync(string slug);

        Task<List<ProductListDTOs.ProductSummaryResponse>> GetFilteredAsync(ProductListDTOs.ProductFilterParams filterParams);
        // Task<List<ProductListDTOs.ProductSummaryResponse>> GetByCategoryAsync(string categorySlug);

        Task<ProductDTOs.SearchResponse> SearchAsync(ProductListDTOs.ProductSearchParams searchParams);
        Task<List<string>> GetSuggestionsAsync(string q, int limit = 10);

        // ────────────────────────────────────────────────── Admin queries ──────────────────────────────────────────────────
        Task<PaginatedResponse<ProductDTOs.ProductAdminResponse>> GetPaginatedAsync(ProductFilterSpec spec);

        // ────────────────────────────────────────────────── Write operations ──────────────────────────────────────────────────

        // Returns the created product ID or throws on validation failure
        Task<int> CreateAsync(ProductDTOs.CreateProductRequest request);

        // Returns the updated product or null if not found
        Task<bool> UpdateAsync(int id, ProductDTOs.UpdateProductRequest request);

        // Returns false if product not found
        Task<bool> DeleteAsync(int id);
    }
}