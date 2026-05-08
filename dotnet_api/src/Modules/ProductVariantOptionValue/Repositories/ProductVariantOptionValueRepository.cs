using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public class ProductVariantOptionValueRepository : IProductVariantOptionValueRepository
    {
        private readonly AppDbContext _context;

        public ProductVariantOptionValueRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProductVariantOptionValue>> GetAllAsync()
        {
            return await _context.ProductVariantOptionValues.ToListAsync();
        }

        public async Task<IEnumerable<ProductVariantOptionValue>> GetByVariantIdAsync(int variantId)
        {
            return await _context.ProductVariantOptionValues
                .Where(x => x.ProductVariantId == variantId)
                .ToListAsync();
        }

        public async Task<ProductVariantOptionValue?> GetAsync(int variantId, int optionValueId)
        {
            return await _context.ProductVariantOptionValues
                .FirstOrDefaultAsync(x =>
                    x.ProductVariantId == variantId &&
                    x.ProductOptionValueId == optionValueId);
        }

        public async Task<ProductVariantOptionValue> AddAsync(ProductVariantOptionValue entity)
        {
            _context.ProductVariantOptionValues.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<bool> DeleteAsync(int variantId, int optionValueId)
        {
            var item = await GetAsync(variantId, optionValueId);
            if (item == null) return false;

            _context.ProductVariantOptionValues.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}