using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;

namespace WebApp_API.Modules.ProductVariantOptionValues.Repositories
{
    public class ProductVariantOptionValueRepository : IProductVariantOptionValueRepository
    {
        private readonly AppDbContext _db;

        public ProductVariantOptionValueRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<Entities.ProductVariantOptionValue>> GetAllAsync()
        {
            return await _db.ProductVariantOptionValues.ToListAsync();
        }

        public async Task<IEnumerable<Entities.ProductVariantOptionValue>> GetByVariantIdAsync(int variantId)
        {
            return await _db.ProductVariantOptionValues
                .Where(x => x.ProductVariantId == variantId)
                .ToListAsync();
        }

        public async Task<Entities.ProductVariantOptionValue?> GetAsync(int variantId, int optionValueId)
        {
            return await _db.ProductVariantOptionValues
                .FirstOrDefaultAsync(x =>
                    x.ProductVariantId == variantId &&
                    x.ProductOptionValueId == optionValueId);
        }

        public async Task<Entities.ProductVariantOptionValue> AddAsync(Entities.ProductVariantOptionValue entity)
        {
            _db.ProductVariantOptionValues.Add(entity);
            return entity;
        }

        public async Task AddRangeAsync(int variantId, IEnumerable<int> optionValueIds)
        {
            var optionValueIdsList = optionValueIds.ToList();
            if (!optionValueIdsList.Any()) return;

            var optionValues = optionValueIds.Select(ovId => new Entities.ProductVariantOptionValue
            {
                ProductVariantId = variantId,
                ProductOptionValueId = ovId
            });

            await _db.ProductVariantOptionValues.AddRangeAsync(optionValues);
        }

        public async Task<bool> DeleteAsync(int variantId, int optionValueId)
        {
            var item = await GetAsync(variantId, optionValueId);
            if (item == null) return false;

            _db.ProductVariantOptionValues.Remove(item);
            return true;
        }

        public async Task DeleteByVariantIdAsync(int variantId)
        {
            var items = await _db.ProductVariantOptionValues
                .Where(x => x.ProductVariantId == variantId)
                .ToListAsync();

            if (items.Count == 0) return;

            _db.ProductVariantOptionValues.RemoveRange(items);
        }

        public Task SaveChangesAsync() => _db.SaveChangesAsync();
    }
}