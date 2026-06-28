using MediatR;
using WebApp_API.Modules.ProductImages.DTOs;
using WebApp_API.Modules.ProductImages.Repositories;

namespace WebApp_API.Modules.ProductImages.Queries.GetProductImageById
{
    public class GetProductImageByIdQueryHandler : IRequestHandler<GetProductImageByIdQuery, ProductImageResponse?>
    {
        private readonly IProductImageRepository _repo;

        public GetProductImageByIdQueryHandler(IProductImageRepository repo) => _repo = repo;

        public async Task<ProductImageResponse?> Handle(GetProductImageByIdQuery request, CancellationToken cancellationToken)
        {
            var image = await _repo.GetByIdAsync(request.Id);
            if (image is null) return null;
            return MapToResponse(image);
        }

        private static ProductImageResponse MapToResponse(Entities.ProductImage image)
        {
            return new ProductImageResponse
            {
                Id = image.Id,
                ImageUrl = image.ImageUrl,
                DisplayOrder = image.DisplayOrder,
                IsMain = image.IsMain,
                ProductId = image.ProductId,
                VariantId = image.VariantId
            };
        }
    }
}