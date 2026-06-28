using MediatR;
using WebApp_API.Modules.ProductOptions.DTOs;

namespace WebApp_API.Modules.ProductOptions.Commands.CreateProductOption
{
    public class CreateProductOptionCommand : IRequest<ProductOptionDTOs.ProductOptionResponse>
    {
        public ProductOptionDTOs.CreateProductOptionRequest Request { get; set; }

        public CreateProductOptionCommand(ProductOptionDTOs.CreateProductOptionRequest request) => Request = request;
    }
}
