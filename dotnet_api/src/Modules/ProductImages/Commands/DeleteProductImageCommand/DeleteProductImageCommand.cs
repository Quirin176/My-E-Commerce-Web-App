using MediatR;

namespace WebApp_API.Modules.ProductImages.Commands.DeleteProductImage
{
    public class DeleteProductImageCommand : IRequest<bool>
    {
        public int Id { get; set; }

        public DeleteProductImageCommand(int id) => Id = id;
    }
}
