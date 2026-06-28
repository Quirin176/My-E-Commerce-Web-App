using MediatR;
using WebApp_API.Modules.ProductImages.DTOs;

namespace WebApp_API.Modules.ProductImages.Queries.GetProductImageById
{
    public class GetProductImageByIdQuery : IRequest<ProductImageResponse?>
    {
        public int Id { get; set; }

        public GetProductImageByIdQuery(int id) => Id = id;
    }
}