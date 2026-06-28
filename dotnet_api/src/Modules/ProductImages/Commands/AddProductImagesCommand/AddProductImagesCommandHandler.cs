using MediatR;
using WebApp_API.Modules.ProductImages.Repositories;

namespace WebApp_API.Modules.ProductImages.Commands.AddProductImages
{
    public class AddProductImagesCommandHandler : IRequestHandler<AddProductImagesCommand, Unit>
    {
        private readonly IProductImageRepository _repo;

        public AddProductImagesCommandHandler(IProductImageRepository repo) => _repo = repo;

        public async Task<Unit> Handle(AddProductImagesCommand request, CancellationToken cancellationToken)
        {
            if (request.Requests == null || request.Requests.Count == 0)
                return Unit.Value;

            var images = request.Requests.Select((req, index) => new Entities.ProductImage
            {
                ImageUrl = req.ImageUrl,
                DisplayOrder = req.DisplayOrder,
                IsMain = req.IsMain,
                ProductId = req.ProductId == 0 ? (int?)null : req.ProductId,
                VariantId = req.VariantId == 0 ? (int?)null : req.VariantId,
            }).ToList();

            await _repo.AddRangeAsync(images);
            await _repo.SaveChangesAsync();

            return Unit.Value;
        }
    }
}
