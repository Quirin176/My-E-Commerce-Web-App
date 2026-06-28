using MediatR;
using WebApp_API.Modules.Products.DTOs;

namespace WebApp_API.Modules.Products.Commands.UpdateProduct
{
    public class UpdateProductCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public ProductDTOs.UpdateProductRequest Request { get; set; }

        public UpdateProductCommand(int id, ProductDTOs.UpdateProductRequest request)
        {
            Id = id;
            Request = request;
        }
    }
}