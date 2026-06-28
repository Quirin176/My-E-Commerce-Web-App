using MediatR;
using WebApp_API.Modules.ProductImages.DTOs;

namespace WebApp_API.Modules.ProductImages.Queries.GetProductImagesByVariant
{
    public class GetProductImagesByVariantQuery : IRequest<List<ProductImageResponse>>
    {
        public int VariantId { get; set; }

        public GetProductImagesByVariantQuery(int variantId) => VariantId = variantId;
    }
}
