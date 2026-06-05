using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public interface IProductImageRepository
    {
        Task<ProductImage?> GetByIdAsync(int id);
        Task<List<ProductImage>> GetByProductAsync(int productId);
        Task<List<ProductImage>> GetByVariantAsync(int variantId);

        // ────────────────────────────────────────────────── Write operations ──────────────────────────────────────────────────
        Task AddAsync(ProductImage img);
        Task AddRangeAsync(List<ProductImage> images);

        Task Update(ProductImage img);
        Task Remove(ProductImage img);
        Task RemoveRange(int productId);

        Task SaveChangesAsync();
    }
}