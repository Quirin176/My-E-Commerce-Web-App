using WebApp_API.DTOs;
using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public interface IProductImageRepository
    {
        Task<ProductImage?> GetByIdAsync(int id);
        Task<List<ProductImage>> GetByProductAsync(int productId);
        Task<List<ProductImage>> GetByVariantAsync(int variantId);

        Task<List<ProductImageDTOs.ImageUrlDto>> GetImageUrlsByProductAsync(int productId);
        Task<List<ProductImageDTOs.ImageUrlDto>> GetImageUrlsByVariantAsync(int variantId);

        // ────────────────────────────────────────────────── Write operations ──────────────────────────────────────────────────
        Task AddAsync(ProductImage img);
        Task AddImagesAsync(IEnumerable<ProductImage> images);
        Task UpdateAsync(ProductImage img);
        Task DeleteAsync(ProductImage img);
        Task DeleteImagesAsync(int productId);

        Task SaveChangesAsync();
    }
}