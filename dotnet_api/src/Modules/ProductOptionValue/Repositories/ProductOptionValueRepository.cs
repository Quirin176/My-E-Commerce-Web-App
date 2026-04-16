using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public class ProductOptionValueRepository : IProductOptionValueRepository
    {
        private readonly AppDbContext _db;
        public ProductOptionValueRepository(AppDbContext db) => _db = db;

        public async Task<ProductOptionValue?> GetProductOptionValueAsync(string optionValue, int optionId)
        {
            return await _db.ProductOptionValues.
            FirstOrDefaultAsync(optVal => optVal.Value == optionValue && optVal.ProductOptionId == optionId);
        }

        public async Task<ProductOptionValue?> GetProductOptionValueByIdAsync(int optionValueId)
        {
            return await _db.ProductOptionValues.FirstOrDefaultAsync(optVal => optVal.Id == optionValueId);
        }

        public async Task CreateProductOptionValueAsync(ProductOptionValue productOptionValue)
        {
            await _db.ProductOptionValues.AddAsync(productOptionValue);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateProductOptionValueByIdAsync(int optionValueId, ProductOptionValue productOptionValue)
        {
            var existing = await _db.ProductOptionValues.FindAsync(optionValueId);
            if (existing is null) return;

            existing.Value = productOptionValue.Value;

            await _db.SaveChangesAsync();
        }

        public async Task DeleteProductOptionValueByIdAsync(int optionValueId)
        {
            var optionValue = await GetProductOptionValueByIdAsync(optionValueId);
            if (optionValue is null) return;
            
            _db.ProductOptionValues.Remove(optionValue);
            await _db.SaveChangesAsync();
        }

        public Task<bool> OptionExistsAsync(int optionId) =>
        _db.ProductOptions.AnyAsync(o => o.Id == optionId);
    }
}