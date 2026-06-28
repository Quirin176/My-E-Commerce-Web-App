using MediatR;

namespace WebApp_API.Modules.ProductImages.Commands.RemoveProductImagesByProduct
{
    public class RemoveProductImagesByProductCommand : IRequest<Unit>
    {
        public int ProductId { get; set; }

        public RemoveProductImagesByProductCommand(int productId) => ProductId = productId;
    }
}
