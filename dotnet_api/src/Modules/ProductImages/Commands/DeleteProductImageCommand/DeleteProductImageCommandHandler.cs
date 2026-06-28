using MediatR;
using WebApp_API.Modules.ProductImages.Repositories;

namespace WebApp_API.Modules.ProductImages.Commands.DeleteProductImage
{
    public class DeleteProductImageCommandHandler : IRequestHandler<DeleteProductImageCommand, bool>
    {
        private readonly IProductImageRepository _repo;

        public DeleteProductImageCommandHandler(IProductImageRepository repo) => _repo = repo;

        public async Task<bool> Handle(DeleteProductImageCommand request, CancellationToken cancellationToken)
        {
            var img = await _repo.GetByIdAsync(request.Id);
            if (img == null) return false;

            await _repo.Remove(img);
            await _repo.SaveChangesAsync();
            return true;
        }
    }
}
