using MediatR;
using WebApp_API.Modules.Products.DTOs;

namespace WebApp_API.Modules.Products.Commands.CreateProduct
{
    public class CreateProductCommand : IRequest<int>
    {
        public ProductDTOs.CreateProductRequest Request { get; set; }

        public CreateProductCommand(ProductDTOs.CreateProductRequest request) => Request = request;
    }
}
