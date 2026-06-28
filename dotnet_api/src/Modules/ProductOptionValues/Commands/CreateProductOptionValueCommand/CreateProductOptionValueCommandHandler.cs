using MediatR;
using WebApp_API.Modules.ProductOptionValues.Repositories;

namespace WebApp_API.Modules.ProductOptionValues.Commands.CreateProductOptionValue
{
    public class CreateProductOptionValueCommandHandler : IRequestHandler<CreateProductOptionValueCommand, Unit>
    {
        private readonly IProductOptionValueRepository _repo;

        public CreateProductOptionValueCommandHandler(IProductOptionValueRepository repo) => _repo = repo;

        public async Task<Unit> Handle(CreateProductOptionValueCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Request.Value))
                throw new InvalidOperationException("Option value is required");

            if (!await _repo.OptionExistsAsync(request.Request.OptionId))
                throw new KeyNotFoundException($"ProductOption with ID {request.Request.OptionId} not found.");

            if (await _repo.GetProductOptionValueAsync(request.Request.Value, request.Request.OptionId) != null)
                throw new InvalidOperationException($"Value '{request.Request.Value}' already exists for this option");

            var optionValue = new Entities.ProductOptionValue
            {
                Value = request.Request.Value,
                ProductOptionId = request.Request.OptionId
            };

            await _repo.CreateProductOptionValueAsync(optionValue);

            return Unit.Value;
        }
    }
}
