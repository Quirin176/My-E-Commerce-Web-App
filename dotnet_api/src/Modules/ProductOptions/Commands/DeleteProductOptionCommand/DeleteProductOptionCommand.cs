using MediatR;

namespace WebApp_API.Modules.ProductOptions.Commands.DeleteProductOption
{
    public class DeleteProductOptionCommand : IRequest<bool>
    {
        public int Id { get; set; }

        public DeleteProductOptionCommand(int id) => Id = id;
    }
}
