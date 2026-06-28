using MediatR;

namespace WebApp_API.Modules.ProductVariants.Commands.DeleteProductVariant
{
    public class DeleteProductVariantCommand : IRequest<bool>
    {
        public int Id { get; set; }

        public DeleteProductVariantCommand(int id) => Id = id;
    }
}
