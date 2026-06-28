using MediatR;
using WebApp_API.Modules.ProductOptions.DTOs;
using WebApp_API.Modules.ProductOptions.Repositories;

namespace WebApp_API.Modules.ProductOptions.Commands.CreateProductOption
{
    public class CreateProductOptionCommandHandler : IRequestHandler<CreateProductOptionCommand, ProductOptionDTOs.ProductOptionResponse>
    {
        private readonly IProductOptionRepository _repo;

        public CreateProductOptionCommandHandler(IProductOptionRepository repo) => _repo = repo;

        public async Task<ProductOptionDTOs.ProductOptionResponse> Handle(CreateProductOptionCommand request, CancellationToken cancellationToken)
        {
            if (!await _repo.CategoryExistsAsync(request.Request.CategoryId!.Value))
                throw new ArgumentException($"Category with ID {request.Request.CategoryId} does not exist.");

            if (await _repo.GetByNameAndCategoryAsync(request.Request.Name, request.Request.CategoryId.Value) is not null)
                throw new InvalidOperationException(
                    $"Option '{request.Request.Name}' already exists for this category.");

            var option = new Entities.ProductOption
            {
                Name = request.Request.Name,
                CategoryId = request.Request.CategoryId.Value
            };

            await _repo.AddAsync(option);
            await _repo.SaveChangesAsync();

            return new ProductOptionDTOs.ProductOptionResponse
            {
                Id = option.Id,
                Name = option.Name,
                CategoryId = option.CategoryId,
                OptionValues = new()
            };
        }
    }
}
