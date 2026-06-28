using MediatR;
using WebApp_API.Modules.ProductVariants.DTOs;

namespace WebApp_API.Modules.ProductVariants.Queries.GetProductVariantsByProductId
{
    public class GetProductVariantsByProductIdQuery : IRequest<IEnumerable<ProductVariantResponse>>
    {
        public int ProductId { get; set; }

        public GetProductVariantsByProductIdQuery(int productId) => ProductId = productId;
    }
}
