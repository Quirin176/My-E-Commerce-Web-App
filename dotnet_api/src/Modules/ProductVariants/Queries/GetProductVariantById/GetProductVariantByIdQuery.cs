using MediatR;
using WebApp_API.Modules.ProductVariants.DTOs;

namespace WebApp_API.Modules.ProductVariants.Queries.GetProductVariantById
{
    public class GetProductVariantByIdQuery : IRequest<ProductVariantResponse?>
    {
        public int Id { get; set; }

        public GetProductVariantByIdQuery(int id) => Id = id;
    }
}
