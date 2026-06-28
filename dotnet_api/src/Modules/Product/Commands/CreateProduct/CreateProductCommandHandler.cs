using MediatR;
using WebApp_API.Modules.Products.Repositories;
using WebApp_API.Modules.Products.Validators;

namespace WebApp_API.Modules.Products.Commands.CreateProduct
{
    public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, int>
    {
        private readonly IProductRepository _productRepo;
        private readonly ProductValidator _validator;

        public CreateProductCommandHandler(IProductRepository productRepo, ProductValidator validator)
        {
            _productRepo = productRepo;
            _validator = validator;
        }

        public async Task<int> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            await _validator.ValidateCreateAsync(request.Request);

            var product = new Entities.Product
            {
                Name = request.Request.Name,
                Slug = request.Request.Slug,
                ShortDescription = request.Request.ShortDescription,
                Description = request.Request.Description,
                BasePrice = request.Request.BasePrice,
                ThumbnailUrl = request.Request.ThumbnailUrl,
                CategoryId = request.Request.CategoryId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _productRepo.AddAsync(product);

            if (request.Request.SelectedOptionValueIds.Count > 0)
                await _productRepo.SetOptionValuesAsync(product, request.Request.SelectedOptionValueIds);

            await _productRepo.SaveChangesAsync();

            return product.Id;
        }
    }
}
