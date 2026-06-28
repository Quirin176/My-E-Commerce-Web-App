using MediatR;
using WebApp_API.Modules.ProductOptionValues.DTOs;

namespace WebApp_API.Modules.ProductOptionValues.Commands.CreateProductOptionValue
{
    public class CreateProductOptionValueCommand : IRequest<Unit>
    {
        public CreateOptionValueRequest Request { get; set; }

        public CreateProductOptionValueCommand(CreateOptionValueRequest request) => Request = request;
    }
}
