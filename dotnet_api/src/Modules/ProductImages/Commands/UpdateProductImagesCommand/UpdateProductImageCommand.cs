using MediatR;
using WebApp_API.Modules.ProductImages.DTOs;

namespace WebApp_API.Modules.ProductImages.Commands.UpdateProductImage
{
    public class UpdateProductImageCommand : IRequest<Entities.ProductImage?>
    {
        public int Id { get; set; }
        public ProductImageUpdateRequest Request { get; set; }

        public UpdateProductImageCommand(int id, ProductImageUpdateRequest request)
        {
            Id = id;
            Request = request;
        }
    }
}
