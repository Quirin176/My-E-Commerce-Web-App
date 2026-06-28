namespace WebApp_API.Modules.ProductImages.Repositories
{
    public interface IProductImageRepository
    {
        Task<Entities.ProductImage?> GetByIdAsync(int id);
        Task<List<Entities.ProductImage>> GetByProductAsync(int productId);
        Task<List<Entities.ProductImage>> GetByVariantAsync(int variantId);

        // ────────────────────────────────────────────────── Write operations ──────────────────────────────────────────────────
        Task AddAsync(Entities.ProductImage img);
        Task AddRangeAsync(List<Entities.ProductImage> images);

        Task Update(Entities.ProductImage img);
        Task Remove(Entities.ProductImage img);
        Task RemoveRange(int productId);

        Task SaveChangesAsync();
    }
}