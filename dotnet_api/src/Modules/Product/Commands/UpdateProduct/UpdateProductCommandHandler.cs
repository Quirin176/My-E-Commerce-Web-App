using MediatR;
using WebApp_API.Modules.Products.Repositories;
using WebApp_API.Modules.Products.Validators;

namespace WebApp_API.Modules.Products.Commands.UpdateProduct
{
    public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, bool>
    {
        private readonly IProductRepository _productRepo;
        private readonly ProductValidator _validator;

        public UpdateProductCommandHandler(IProductRepository productRepo, ProductValidator validator)
        {
            _productRepo = productRepo;
            _validator = validator;
        }

        public async Task<bool> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
        {
            var product = await _productRepo.GetByIdAsync(request.Id);
            if (product is null) return false;

            await _validator.ValidateUpdateAsync(product, request.Request);

            if (!string.IsNullOrWhiteSpace(request.Request.Name)) product.Name = request.Request.Name;
            if (!string.IsNullOrWhiteSpace(request.Request.Slug)) product.Slug = request.Request.Slug;
            if (!string.IsNullOrWhiteSpace(request.Request.ShortDescription)) product.ShortDescription = request.Request.ShortDescription;
            if (!string.IsNullOrWhiteSpace(request.Request.Description)) product.Description = request.Request.Description;
            if (request.Request.BasePrice.HasValue && request.Request.BasePrice > 0) product.BasePrice = request.Request.BasePrice.Value;
            if (!string.IsNullOrWhiteSpace(request.Request.ThumbnailUrl)) product.ThumbnailUrl = request.Request.ThumbnailUrl;
            if (request.Request.CategoryId.HasValue) product.CategoryId = request.Request.CategoryId.Value;
            product.UpdatedAt = DateTime.UtcNow;

            _productRepo.Update(product);

            if (request.Request.SelectedOptionValueIds is not null)
                await _productRepo.SetOptionValuesAsync(product, request.Request.SelectedOptionValueIds);

            await _productRepo.SaveChangesAsync();

            return true;
        }
    }
}
