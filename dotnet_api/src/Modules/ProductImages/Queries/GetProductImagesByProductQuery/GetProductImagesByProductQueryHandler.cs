using MediatR;
using WebApp_API.Modules.ProductImages.DTOs;
using WebApp_API.Modules.ProductImages.Repositories;

namespace WebApp_API.Modules.ProductImages.Queries.GetProductImagesByProduct
{
    public class GetProductImagesByProductQueryHandler : IRequestHandler<GetProductImagesByProductQuery, List<ProductImageResponse>>
    {
        private readonly IProductImageRepository _repo;

        public GetProductImagesByProductQueryHandler(IProductImageRepository repo) => _repo = repo;

        public async Task<List<ProductImageResponse>> Handle(GetProductImagesByProductQuery request, CancellationToken cancellationToken)
        {
            var images = await _repo.GetByProductAsync(request.ProductId);
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
