using WebApp_API.DTOs;
using WebApp_API.Entities;
using WebApp_API.Repositories;

namespace WebApp_API.Services
{
    public class ProductImageService : IProductImageService
    {
        private readonly IProductImageRepository _repo;
        public ProductImageService(IProductImageRepository repo) => _repo = repo;

        public Task<ProductImage?> GetByIdAsync(int id) => _repo.GetByIdAsync(id);

        public Task<List<ProductImage>> GetByProductAsync(int productId)
            => _repo.GetByProductAsync(productId);

        public Task<List<ProductImage>> GetByVariantAsync(int variantId)
            => _repo.GetByVariantAsync(variantId);

        public async Task AddRangeAsync(List<ProductImageDTOs.AddProductImageRequest> requests)
        {
            if (requests == null || requests.Count == 0) return;

            var images = requests.Select((request, index) => new ProductImage
            {
                ImageUrl = request.ImageUrl,
                DisplayOrder = request.DisplayOrder,
                IsMain = request.IsMain,
                ProductId = request.ProductId == 0 ? (int?)null : request.ProductId,
                VariantId = request.VariantId == 0 ? (int?)null : request.VariantId,
            }).ToList();

            await _repo.AddRangeAsync(images);
            await _repo.SaveChangesAsync();
        }

        public async Task<ProductImage?> UpdateAsync(int id, ProductImageDTOs.ProductImageUpdateRequest dto)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return null;

            existing.ImageUrl = dto.ImageUrl;
            existing.DisplayOrder = dto.DisplayOrder;

            await _repo.Update(existing);
            await _repo.SaveChangesAsync();

            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var img = await _repo.GetByIdAsync(id);
            if (img == null) return false;

            await _repo.Remove(img);
            await _repo.SaveChangesAsync();
            return true;
        }

        public async Task RemoveRangeByProductAsync(int productId)
        {
            await _repo.RemoveRange(productId);
            await _repo.SaveChangesAsync();
        }
    }
}