using WebApp_API.DTOs;
using WebApp_API.Entities;
using WebApp_API.Repositories;

namespace WebApp_API.Services
{
    public class ProductImageService : IProductImageService
    {
        private readonly IProductImageRepository _repo;
        public ProductImageService(IProductImageRepository repo) => _repo = repo;

        public async Task AddProductImagesAsync(List<ProductImageDTOs.AddProductImageRequest> requests)
        {
            if (requests == null || requests.Count == 0) return;

            var images = requests.Select((request, index) => new ProductImage
            {
                VariantId = request.VariantId,
                ProductId = request.ProductId,
                ImageUrl = request.ImageUrl,
                DisplayOrder = request.DisplayOrder,
                IsMain = request.IsMain
            }).ToList();

            await _repo.AddRangeAsync(images);
            await _repo.SaveChangesAsync();
        }
    }
}