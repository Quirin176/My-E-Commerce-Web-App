using MediatR;
using WebApp_API.Modules.ProductVariants.DTOs;

namespace WebApp_API.Modules.ProductVariants.Commands.UpdateProductVariant
{
    public class UpdateProductVariantCommand : IRequest<ProductVariantResponse?>
    {
        public int Id { get; set; }
        public UpdateProductVariantRequest Request { get; set; }

        public UpdateProductVariantCommand(int id, UpdateProductVariantRequest request)
        {
            Id = id;
            Request = request;
        }
    }
}