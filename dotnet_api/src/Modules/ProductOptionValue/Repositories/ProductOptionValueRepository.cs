using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public class ProductOptionValueRepository : IProductOptionValueRepository
    {
        private readonly AppDbContext _db;
        public ProductOptionValueRepository(AppDbContext db) => _db = db;

        public async Task<ProductOptionValue?> GetProductOptionValueAsync(string optionValue)
        {
            return await _db.ProductOptionValues.FirstOrDefaultAsync(optVal => optVal.Value == optionValue);
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
            productOptionValue.Id = optionValueId;

            _db.ProductOptionValues.Update(productOptionValue);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteProductOptionValueByIdAsync(int optionValueId)
        {
            var optionValue = await GetProductOptionValueByIdAsync(optionValueId);
            if (optionValue != null)
            {
                _db.ProductOptionValues.Remove(optionValue);
                await _db.SaveChangesAsync();
            }
        }
    }
}