using MediatR;
using WebApp_API.Modules.ProductImages.DTOs;
using WebApp_API.Modules.ProductImages.Repositories;

namespace WebApp_API.Modules.ProductImages.Queries.GetProductImagesByVariant
{
    public class GetProductImagesByVariantQueryHandler : IRequestHandler<GetProductImagesByVariantQuery, List<ProductImageResponse>>
    {
        private readonly IProductImageRepository _repo;

        public GetProductImagesByVariantQueryHandler(IProductImageRepository repo) => _repo = repo;

        public async Task<List<ProductImageResponse>> Handle(GetProductImagesByVariantQuery request, CancellationToken cancellationToken)
        {
            var images = await _repo.GetByVariantAsync(request.VariantId);
            return images.Select(MapToResponse).ToList();
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
