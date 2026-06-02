using WebApp_API.DTOs;
using WebApp_API.Specifications;
using static WebApp_API.DTOs.PaginationDTOs;

namespace WebApp_API.Services
{
    public interface IProductService
    {
        // ────────────────────────────────────────────────── Public queries ──────────────────────────────────────────────────
        Task<ProductDTOs.ProductDetailResponse?> GetByIdAsync(int id);
        Task<ProductDTOs.ProductDetailResponse?> GetBySlugAsync(string slug);

        Task<List<ProductListDTOs.ProductSummaryResponse>> GetCategoryNewestAsync(int categoryId, int amount);

        Task<ProductDTOs.SearchResponse> SearchAsync(ProductListDTOs.ProductSearchParams searchParams);
        Task<List<string>> GetSuggestionsAsync(string q, int limit = 10);

        // ────────────────────────────────────────────────── Admin queries ──────────────────────────────────────────────────
        Task<PaginatedResponse<ProductListDTOs.ProductSummaryResponse>> GetPaginatedAsync(ProductFilterSpec spec);

        // ────────────────────────────────────────────────── Write operations ──────────────────────────────────────────────────
        Task<int> CreateAsync(ProductDTOs.CreateProductRequest request);
        Task<bool> UpdateAsync(int id, ProductDTOs.UpdateProductRequest request);
        Task<bool> DeleteAsync(int id);
    }
}