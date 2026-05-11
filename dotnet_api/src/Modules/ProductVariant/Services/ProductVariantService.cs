using WebApp_API.DTOs;
using WebApp_API.Entities;
using WebApp_API.Repositories;

namespace WebApp_API.Services
{
    public class ProductVariantService : IProductVariantService
    {
        private readonly IProductVariantRepository _productVariantRepo;
        private readonly IProductImageRepository _productImageRepo;

        public ProductVariantService(IProductVariantRepository productVariantRepo, IProductImageRepository productImageRepo)
        {
            _productVariantRepo = productVariantRepo;
            _productImageRepo = productImageRepo;
        }

        // ──────────────────── Public queries ────────────────────

        public Task<IEnumerable<ProductVariant>> GetAllAsync()
            => _productVariantRepo.GetAllAsync();

        public Task<ProductVariant?> GetByIdAsync(int id)
            => _productVariantRepo.GetByIdAsync(id);

        public Task<IEnumerable<ProductVariant>> GetByProductIdAsync(int productId)
            => _productVariantRepo.GetByProductIdAsync(productId);

        // ──────────────────── Write operations ────────────────────

        public async Task CreateAsync(ProductVariantDTOs.CreateProductVariantRequest request)
        {
            var variant = new ProductVariant
            {
                VariantName = request.VariantName,
                SKU = request.SKU,
                Price = request.Price,
                OriginalPrice = request.OriginalPrice,
                Stock = request.Stock,
                ProductId = request.ProductId,
            };

            await _productVariantRepo.AddAsync(variant);
            await _productVariantRepo.SaveChangesAsync();
        }
        
        public Task<ProductVariant> UpdateAsync(ProductVariant variant)
            => _productVariantRepo.UpdateAsync(variant);

        public Task<bool> DeleteAsync(int id)
            => _productVariantRepo.DeleteAsync(id);
    }
}
