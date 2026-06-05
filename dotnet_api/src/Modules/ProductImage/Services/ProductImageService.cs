using WebApp_API.DTOs;
using WebApp_API.Entities;
using WebApp_API.Repositories;

namespace WebApp_API.Services
{
    public class ProductImageService : IProductImageService
    {
        private readonly IProductImageRepository _repo;
        public ProductImageService(IProductImageRepository repo) => _repo = repo;

        // ────────────────────────────────────────────────── Responses ──────────────────────────────────────────────────
        public async Task<ProductImageDTOs.ProductImageResponse?> GetByIdAsync(int id)
        {
            var image = await _repo.GetByIdAsync(id);
            if (image is null) return null;
            return await MapToDetailAsync(image);
        }

        public async Task<List<ProductImageDTOs.ProductImageResponse>> GetByProductAsync(int productId)
        {
            var images = await _repo.GetByProductAsync(productId);
            return await MapToDetailAsyncList(images);
        }

        public async Task<List<ProductImageDTOs.ProductImageResponse>> GetByVariantAsync(int variantId)
        {
            var images = await _repo.GetByVariantAsync(variantId);
            return await MapToDetailAsyncList(images);
        }

        // ────────────────────────────────────────────────── Requests ──────────────────────────────────────────────────
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

        // ────────────────────────────────────────────────── Mapping helpers ──────────────────────────────────────────────────
        private async Task<ProductImageDTOs.ProductImageResponse> MapToDetailAsync(ProductImage productImage)
        {
            return new ProductImageDTOs.ProductImageResponse
            {
                Id = productImage.Id,
                ImageUrl = productImage.ImageUrl,
                DisplayOrder = productImage.DisplayOrder,
                IsMain = productImage.IsMain,
                ProductId = productImage.ProductId,
                VariantId = productImage.VariantId
            };
        }

        private async Task<List<ProductImageDTOs.ProductImageResponse>> MapToDetailAsyncList(List<ProductImage> productImages)
        {
            var result = new List<ProductImageDTOs.ProductImageResponse>(productImages.Count);
            foreach (var image in productImages)
            {

                result.Add(new ProductImageDTOs.ProductImageResponse
                {
                    Id = image.Id,
                    ImageUrl = image.ImageUrl,
                    DisplayOrder = image.DisplayOrder,
                    IsMain = image.IsMain,
                    ProductId = image.ProductId,
                    VariantId = image.VariantId
                });
            }

            return result;
        }
    }
}