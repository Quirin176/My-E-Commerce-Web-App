using MediatR;

namespace WebApp_API.Modules.Products.Commands.SoftDeleteProduct
{
    public class SoftDeleteProductCommand : IRequest<bool>
    {
        public int ProductId { get; set; }

        public SoftDeleteProductCommand(int productId) => ProductId = productId;
    }
}
