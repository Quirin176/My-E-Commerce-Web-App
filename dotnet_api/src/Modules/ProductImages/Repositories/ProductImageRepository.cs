using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;

namespace WebApp_API.Modules.ProductImages.Repositories
{
    public class ProductImageRepository : IProductImageRepository
    {
        private readonly AppDbContext _db;

        public ProductImageRepository(AppDbContext db) => _db = db;

        public Task<Entities.ProductImage?> GetByIdAsync(int id)
        {
            return _db.ProductImages.FirstOrDefaultAsync(x => x.Id == id);
        }

        public Task<List<Entities.ProductImage>> GetByProductAsync(int productId)
        {
            return _db.ProductImages
             .Where(x => x.ProductId == productId)
             .OrderBy(x => x.DisplayOrder)
             .ToListAsync();
        }

        public Task<List<Entities.ProductImage>> GetByVariantAsync(int variantId)
        {
            return _db.ProductImages
             .Where(x => x.VariantId == variantId)
             .OrderBy(x => x.DisplayOrder)
             .ToListAsync();
        }

        // ────────────────────────────────────────────────── Write operations ──────────────────────────────────────────────────
        public async Task AddAsync(Entities.ProductImage img)
        {
            await _db.ProductImages.AddAsync(img);
        }

        public async Task AddRangeAsync(List<Entities.ProductImage> images)
        {
            await _db.ProductImages.AddRangeAsync(images);
        }

        public Task Update(Entities.ProductImage img)
        {
            _db.ProductImages.Update(img);
            return Task.CompletedTask;
        }

        public Task Remove(Entities.ProductImage img)
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