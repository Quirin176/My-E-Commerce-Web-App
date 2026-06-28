using MediatR;
using WebApp_API.Modules.ProductImages.Repositories;

namespace WebApp_API.Modules.ProductImages.Commands.UpdateProductImage
{
    public class UpdateProductImageCommandHandler : IRequestHandler<UpdateProductImageCommand, Entities.ProductImage?>
    {
        private readonly IProductImageRepository _repo;

        public UpdateProductImageCommandHandler(IProductImageRepository repo) => _repo = repo;

        public async Task<Entities.ProductImage?> Handle(UpdateProductImageCommand request, CancellationToken cancellationToken)
        {
            var existing = await _repo.GetByIdAsync(request.Id);
            if (existing == null) return null;

            existing.ImageUrl = request.Request.ImageUrl;
            existing.DisplayOrder = request.Request.DisplayOrder;

            await _repo.Update(existing);
            await _repo.SaveChangesAsync();

            return existing;
        }
    }
}
