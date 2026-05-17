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
            return await _db.ProductVariants
                .Include(v => v.Images)
                .Include(v => v.ProductVariantOptionValues)
                    .ThenInclude(pvov => pvov.ProductOptionValue)
                        .ThenInclude(pov => pov.ProductOption)
                .FirstOrDefaultAsync(v => v.Id == id);
        }

        // ────────────────────────────────────────────────── List queries ──────────────────────────────────────────────────
        public async Task<IEnumerable<ProductVariant>> GetAllAsync()
        {
            return await _db.ProductVariants
                .Include(v => v.Images)
                .Include(v => v.ProductVariantOptionValues)
                    .ThenInclude(pvov => pvov.ProductOptionValue)
                        .ThenInclude(pov => pov.ProductOption)
                .ToListAsync();
        }

        public async Task<IEnumerable<ProductVariant>> GetByProductIdAsync(int productId)
        {
            return await _db.ProductVariants
                .Where(v => v.ProductId == productId)
                .Include(v => v.Images)
                .Include(v => v.ProductVariantOptionValues)
                    .ThenInclude(pvov => pvov.ProductOptionValue)
                        .ThenInclude(pov => pov.ProductOption)
                .ToListAsync();
        }

        // ────────────────────────────────────────────────── Write operations ──────────────────────────────────────────────────
        public async Task AddAsync(ProductVariant variant)
        {
            _db.ProductVariants.Add(variant);
        }

        // public async Task AddRangeAsync(IEnumerable<ProductVariant> variants)
        // {
        //     _db.ProductVariants.AddRange(variants);
        // }

        public async Task UpdateAsync(ProductVariant variant)
        {
            _db.ProductVariants.Update(variant);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var variant = await _db.ProductVariants.FindAsync(id);
            if (variant == null) return false;

            _db.ProductVariants.Remove(variant);
            return true;
        }

        public async Task DeleteByProductIdAsync(int productId)
        {
            var variants = await _db.ProductVariants
                .Where(v => v.ProductId == productId)
                .ToListAsync();

            if (variants.Count == 0) return;

            _db.ProductVariants.RemoveRange(variants);
        }

        public Task SaveChangesAsync() => _db.SaveChangesAsync();
    }
}