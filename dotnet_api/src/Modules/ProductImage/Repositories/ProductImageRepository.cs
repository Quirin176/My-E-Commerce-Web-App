using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public class ProductImageRepository : IProductImageRepository
    {
        private readonly AppDbContext _db;

        public ProductImageRepository(AppDbContext db) => _db = db;

        public Task<ProductImage?> GetByIdAsync(int id)
        {
            return _db.ProductImages.FirstOrDefaultAsync(x => x.Id == id);
        }

        public Task<List<ProductImage>> GetByProductAsync(int productId)
        {
            return _db.ProductImages
             .Where(x => x.ProductId == productId)
             .OrderBy(x => x.DisplayOrder)
             .ToListAsync();
        }

        public Task<List<ProductImage>> GetByVariantAsync(int variantId)
        {
            return _db.ProductImages
             .Where(x => x.VariantId == variantId)
             .OrderBy(x => x.DisplayOrder)
             .ToListAsync();
        }

        // ────────────────────────────────────────────────── Write operations ──────────────────────────────────────────────────
        public async Task AddAsync(ProductImage img)
        {
            await _db.ProductImages.AddAsync(img);
        }

        public async Task AddRangeAsync(List<ProductImage> images)
        {
            await _db.ProductImages.AddRangeAsync(images);
        }

        public Task Update(ProductImage img)
        {
            _db.ProductImages.Update(img);
            return Task.CompletedTask;
        }

        public Task Remove(ProductImage img)
        {
            _db.ProductImages.Remove(img);
            return Task.CompletedTask;
        }

        public async Task RemoveRange(int productId)
        {
            var existing = await _db.ProductImages.Where(pi => pi.ProductId == productId).ToListAsync();
            _db.ProductImages.RemoveRange(existing);
        }

        public Task SaveChangesAsync() => _db.SaveChangesAsync();
    }
}