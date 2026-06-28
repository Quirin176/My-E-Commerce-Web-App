using MediatR;
using WebApp_API.Modules.ProductImages.Repositories;

namespace WebApp_API.Modules.ProductImages.Commands.RemoveProductImagesByProduct
{
    public class RemoveProductImagesByProductCommandHandler : IRequestHandler<RemoveProductImagesByProductCommand, Unit>
    {
        private readonly IProductImageRepository _repo;

        public RemoveProductImagesByProductCommandHandler(IProductImageRepository repo) => _repo = repo;

        public async Task<Unit> Handle(RemoveProductImagesByProductCommand request, CancellationToken cancellationToken)
        {
            await _repo.RemoveRange(request.ProductId);
            await _repo.SaveChangesAsync();
            return Unit.Value;
        }
    }
}
