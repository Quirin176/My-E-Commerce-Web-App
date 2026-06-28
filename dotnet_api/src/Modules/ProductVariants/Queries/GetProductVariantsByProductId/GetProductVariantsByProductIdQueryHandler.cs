using MediatR;
using WebApp_API.Modules.ProductVariants.DTOs;
using WebApp_API.Modules.ProductVariants.Repositories;

namespace WebApp_API.Modules.ProductVariants.Queries.GetProductVariantsByProductId
{
    public class GetProductVariantsByProductIdQueryHandler : IRequestHandler<GetProductVariantsByProductIdQuery, IEnumerable<ProductVariantResponse>>
    {
        private readonly IProductVariantRepository _productVariantRepo;

        public GetProductVariantsByProductIdQueryHandler(IProductVariantRepository productVariantRepo) 
            => _productVariantRepo = productVariantRepo;

        public async Task<IEnumerable<ProductVariantResponse>> Handle(GetProductVariantsByProductIdQuery request, CancellationToken cancellationToken)
        {
            var variants = await _productVariantRepo.GetByProductIdAsync(request.ProductId);
            return variants.Select(MapToResponse);
        }

        private static ProductVariantResponse MapToResponse(Entities.ProductVariant v) 
            => new ProductVariantResponse
            {
                Id = v.Id,
                VariantName = v.VariantName,
                SKU = v.SKU,
                Price = v.Price,
                OriginalPrice = v.OriginalPrice,
                Stock = v.Stock,
                ProductId = v.ProductId,
                Images = v.Images
                    .OrderBy(img => img.DisplayOrder)
                    .Select(img => new VariantImageDto
                    {
                        Id = img.Id,
                        ImageUrl = img.ImageUrl,
                        DisplayOrder = img.DisplayOrder,
                        IsMain = img.IsMain
                    })
                    .ToList(),
                OptionValues = v.ProductVariantOptionValues
                    .Select(pvov => new VariantOptionValueDto
                    {
                        OptionValueId = pvov.ProductOptionValueId,
                        OptionName = pvov.ProductOptionValue?.ProductOption?.Name ?? "",
                        Value = pvov.ProductOptionValue?.Value ?? ""
                    })
                    .ToList()
            };
    }
}
