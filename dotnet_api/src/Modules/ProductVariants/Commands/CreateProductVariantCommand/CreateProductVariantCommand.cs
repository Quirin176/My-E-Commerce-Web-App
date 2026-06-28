using MediatR;
using WebApp_API.Modules.ProductVariants.DTOs;

namespace WebApp_API.Modules.ProductVariants.Commands.CreateProductVariant
{
    public class CreateProductVariantCommand : IRequest<ProductVariantResponse>
    {
        public CreateProductVariantRequest Request { get; set; }

        public CreateProductVariantCommand(CreateProductVariantRequest request) => Request = request;
    }
}
