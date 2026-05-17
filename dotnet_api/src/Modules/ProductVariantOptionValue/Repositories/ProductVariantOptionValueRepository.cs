using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public class ProductVariantOptionValueRepository : IProductVariantOptionValueRepository
    {
        private readonly AppDbContext _db;

        public ProductVariantOptionValueRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<ProductVariantOptionValue>> GetAllAsync()
        {
            return await _db.ProductVariantOptionValues.ToListAsync();
        }

        public async Task<IEnumerable<ProductVariantOptionValue>> GetByVariantIdAsync(int variantId)
        {
            return await _db.ProductVariantOptionValues
                .Where(x => x.ProductVariantId == variantId)
                .ToListAsync();
        }

        public async Task<ProductVariantOptionValue?> GetAsync(int variantId, int optionValueId)
        {
            return await _db.ProductVariantOptionValues
                .FirstOrDefaultAsync(x =>
                    x.ProductVariantId == variantId &&
                    x.ProductOptionValueId == optionValueId);
        }

        public async Task<ProductVariantOptionValue> AddAsync(ProductVariantOptionValue entity)
        {
            _db.ProductVariantOptionValues.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task AddRangeAsync(int variantId, IEnumerable<int> optionValueIds)
        {

            var optionValues = optionValueIds.Select(ovId => new ProductVariantOptionValue
            {
                ProductVariantId = variantId,
                ProductOptionValueId = ovId
            });

            await _db.ProductVariantOptionValues.AddRangeAsync(optionValues);
            await _db.SaveChangesAsync();
        }

        public async Task<bool> DeleteAsync(int variantId, int optionValueId)
        {
            var item = await GetAsync(variantId, optionValueId);
            if (item == null) return false;

            _db.ProductVariantOptionValues.Remove(item);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task DeleteByVariantIdAsync(int variantId)
        {
            var items = await _db.ProductVariantOptionValues
                .Where(x => x.ProductVariantId == variantId)
                .ToListAsync();

            if (items.Count == 0) return;

            _db.ProductVariantOptionValues.RemoveRange(items);
            await _db.SaveChangesAsync();
        }

        public Task SaveChangesAsync() => _db.SaveChangesAsync();
    }
}