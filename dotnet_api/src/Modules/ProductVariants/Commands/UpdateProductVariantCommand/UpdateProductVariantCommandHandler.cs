using MediatR;
using WebApp_API.Modules.ProductVariants.DTOs;
using WebApp_API.Modules.ProductVariants.Repositories;
using WebApp_API.Modules.ProductVariantOptionValues.Repositories;

namespace WebApp_API.Modules.ProductVariants.Commands.UpdateProductVariant
{
    public class UpdateProductVariantCommandHandler : IRequestHandler<UpdateProductVariantCommand, ProductVariantResponse?>
    {
        private readonly IProductVariantRepository _productVariantRepo;
        private readonly IProductVariantOptionValueRepository _productVariantOptionValueRepo;

        public UpdateProductVariantCommandHandler(
            IProductVariantRepository productVariantRepo,
            IProductVariantOptionValueRepository productVariantOptionValueRepo)
        {
            _productVariantRepo = productVariantRepo;
            _productVariantOptionValueRepo = productVariantOptionValueRepo;
        }

        public async Task<ProductVariantResponse?> Handle(UpdateProductVariantCommand request, CancellationToken cancellationToken)
        {
            var variant = await _productVariantRepo.GetByIdAsync(request.Id);
            if (variant is null) return null;

            if (request.Request.VariantName is not null) variant.VariantName = request.Request.VariantName;
            if (request.Request.SKU is not null) variant.SKU = request.Request.SKU;
            if (request.Request.Price.HasValue) variant.Price = request.Request.Price.Value;
            if (request.Request.OriginalPrice.HasValue) variant.OriginalPrice = request.Request.OriginalPrice.Value;
            if (request.Request.Stock.HasValue) variant.Stock = request.Request.Stock.Value;

            await _productVariantRepo.UpdateAsync(variant);

            // Replace option value links if a new list was provided
            if (request.Request.OptionValueIds is not null)
            {
                await _productVariantOptionValueRepo.DeleteByVariantIdAsync(request.Id);
                await _productVariantOptionValueRepo.SaveChangesAsync();

                await _productVariantOptionValueRepo.AddRangeAsync(request.Id, request.Request.OptionValueIds);
                await _productVariantOptionValueRepo.SaveChangesAsync();
            }

            var updated = await _productVariantRepo.GetByIdAsync(request.Id);
            await _productVariantRepo.SaveChangesAsync();

            return MapToResponse(updated!);
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
