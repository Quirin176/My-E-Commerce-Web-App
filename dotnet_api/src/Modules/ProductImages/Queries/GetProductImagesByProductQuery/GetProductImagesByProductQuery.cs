using MediatR;
using WebApp_API.Modules.ProductImages.DTOs;

namespace WebApp_API.Modules.ProductImages.Queries.GetProductImagesByProduct
{
    public class GetProductImagesByProductQuery : IRequest<List<ProductImageResponse>>
    {
        public int ProductId { get; set; }

        public GetProductImagesByProductQuery(int productId) => ProductId = productId;
    }
}
