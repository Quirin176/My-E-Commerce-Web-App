using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.Entities;
using WebApp_API.Specifications;

namespace WebApp_API.Repositories
{
    public class ProductVariantRepository : IProductVariantRepository
    {
        private readonly AppDbContext _db;
        public ProductVariantRepository(AppDbContext db) => _db = db;

        // ────────────────────────────────────────────────── Single product lookups ──────────────────────────────────────────────────
        public async Task<ProductVariant?> GetByIdAsync(int id)
        {
            return await _db.ProductVariants.FindAsync(id);
        }

        // ────────────────────────────────────────────────── List queries ──────────────────────────────────────────────────
        public async Task<IEnumerable<ProductVariant>> GetAllAsync()
        {
            return await _db.ProductVariants.ToListAsync();
        }

        public async Task<IEnumerable<ProductVariant>> GetByProductIdAsync(int productId)
        {
            return await _db.ProductVariants
                .Where(v => v.ProductId == productId)
                .ToListAsync();
        }

        public async Task<ProductVariant> AddAsync(ProductVariant variant)
        {
            _db.ProductVariants.Add(variant);
            await _db.SaveChangesAsync();
            return variant;
        }

        public async Task<ProductVariant> UpdateAsync(ProductVariant variant)
        {
            _db.ProductVariants.Update(variant);
            await _db.SaveChangesAsync();
            return variant;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var variant = await _db.ProductVariants.FindAsync(id);
            if (variant == null) return false;

            _db.ProductVariants.Remove(variant);
            await _db.SaveChangesAsync();
            return true;
        }

        public Task SaveChangesAsync() => _db.SaveChangesAsync();
    }
}