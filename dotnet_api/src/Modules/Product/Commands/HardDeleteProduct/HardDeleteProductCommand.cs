using MediatR;

namespace WebApp_API.Modules.Products.Commands.HardDeleteProduct
{
    public class HardDeleteProductCommand : IRequest<bool>
    {
        public int Id { get; set; }

        public HardDeleteProductCommand(int id) => Id = id;
    }
}
