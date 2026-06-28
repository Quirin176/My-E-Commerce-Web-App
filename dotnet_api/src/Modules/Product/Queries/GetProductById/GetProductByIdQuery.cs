using MediatR;
using WebApp_API.Modules.Products.DTOs;

namespace WebApp_API.Modules.Products.Queries.GetProductById
{
    public class GetProductByIdQuery : IRequest<ProductDTOs.ProductDetailResponse?>
    {
        public int Id { get; set; }

        public GetProductByIdQuery(int id) => Id = id;
    }
}
