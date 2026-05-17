using WebApp_API.Entities;
using WebApp_API.Repositories;

namespace WebApp_API.Services
{
    public class ProductVariantOptionValueService : IProductVariantOptionValueService
    {
        private readonly IProductVariantOptionValueRepository _repo;

        public ProductVariantOptionValueService(IProductVariantOptionValueRepository repo)
        {
            _repo = repo;
        }

        public Task<IEnumerable<ProductVariantOptionValue>> GetAllAsync()
            => _repo.GetAllAsync();

        public Task<IEnumerable<ProductVariantOptionValue>> GetByVariantIdAsync(int variantId)
            => _repo.GetByVariantIdAsync(variantId);

        public Task<ProductVariantOptionValue?> GetAsync(int variantId, int optionValueId)
            => _repo.GetAsync(variantId, optionValueId);

        public async Task CreateAsync(ProductVariantOptionValue entity)
        {
            await _repo.AddAsync(entity);
            await _repo.SaveChangesAsync();
        }

        public Task<bool> DeleteAsync(int variantId, int optionValueId)
            => _repo.DeleteAsync(variantId, optionValueId);
    }
}