using MediatR;
using WebApp_API.Modules.ProductVariants.DTOs;
using WebApp_API.Modules.ProductVariants.Repositories;
using WebApp_API.Modules.ProductVariantOptionValues.Repositories;

namespace WebApp_API.Modules.ProductVariants.Commands.CreateProductVariant
{
    public class CreateProductVariantCommandHandler : IRequestHandler<CreateProductVariantCommand, ProductVariantResponse>
    {
        private readonly IProductVariantRepository _productVariantRepo;
        private readonly IProductVariantOptionValueRepository _productVariantOptionValueRepo;

        public CreateProductVariantCommandHandler(
            IProductVariantRepository productVariantRepo,
            IProductVariantOptionValueRepository productVariantOptionValueRepo)
        {
            _productVariantRepo = productVariantRepo;
            _productVariantOptionValueRepo = productVariantOptionValueRepo;
        }

        public async Task<ProductVariantResponse> Handle(CreateProductVariantCommand request, CancellationToken cancellationToken)
        {
            var variant = BuildVariant(request.Request);

            // Save variant first to get its Id
            await _productVariantRepo.AddAsync(variant);
            await _productVariantRepo.SaveChangesAsync();

            // Attach option value links
            if (request.Request.OptionValueIds != null && request.Request.OptionValueIds.Count > 0)
            {
                await _productVariantOptionValueRepo.AddRangeAsync(variant.Id, request.Request.OptionValueIds);
                await _productVariantOptionValueRepo.SaveChangesAsync();
            }

            return MapToResponse(variant);
        }

        private static Entities.ProductVariant BuildVariant(CreateProductVariantRequest request) 
            => new Entities.ProductVariant
            {
                VariantName = request.VariantName,
                SKU = request.SKU ?? string.Empty,
                Price = request.Price,
                OriginalPrice = request.OriginalPrice,
                Stock = request.Stock,
                ProductId = request.ProductId,
            };

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
