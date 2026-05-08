using WebApp_API.DTOs;
using WebApp_API.Entities;
using WebApp_API.Repositories;
using WebApp_API.Specifications;
using static WebApp_API.DTOs.PaginationDTOs;

namespace WebApp_API.Services
{
    public class ProductVariantService : IProductVariantService
    {
        private readonly IProductVariantRepository _repo;

        public ProductVariantService(IProductVariantRepository repo) => _repo = repo;

        // ──────────────────── Public queries ────────────────────

        public Task<IEnumerable<ProductVariant>> GetAllAsync()
            => _repo.GetAllAsync();

        public Task<ProductVariant?> GetByIdAsync(int id)
            => _repo.GetByIdAsync(id);

        public Task<IEnumerable<ProductVariant>> GetByProductIdAsync(int productId)
            => _repo.GetByProductIdAsync(productId);

        // ──────────────────── Write operations ────────────────────

        public Task<ProductVariant> CreateAsync(ProductVariant variant)
            => _repo.AddAsync(variant);

        public Task<ProductVariant> UpdateAsync(ProductVariant variant)
            => _repo.UpdateAsync(variant);

        public Task<bool> DeleteAsync(int id)
            => _repo.DeleteAsync(id);
    }
}
