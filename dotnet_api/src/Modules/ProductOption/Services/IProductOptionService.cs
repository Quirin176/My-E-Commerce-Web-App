using WebApp_API.DTOs;

namespace WebApp_API.Services
{
    public interface IProductOptionService
    {
        // ────────────────────────────── Queries ──────────────────────────────
        Task<ProductOptionDTOs.ProductOptionResponse?> GetByIdAsync(int id);
        Task<List<ProductOptionDTOs.ProductOptionGroupResponse>> GetByCategoryIdAsync(int categoryId);
        Task<List<ProductOptionDTOs.ProductOptionGroupResponse>> GetByCategorySlugAsync(string categorySlug);

        // ────────────────────────────── Write Operations ──────────────────────────────

        /// <summary>Returns the newly created option. Throws <see cref="ArgumentException"/> when the
        /// category does not exist, and <see cref="InvalidOperationException"/> when a duplicate name
        /// exists for the same category.</summary>
        Task<ProductOptionDTOs.ProductOptionResponse> CreateAsync(ProductOptionDTOs.CreateProductOptionRequest request);

        /// <summary>Returns false when the option is not found.</summary>
        Task<bool> DeleteAsync(int id);
    }
}