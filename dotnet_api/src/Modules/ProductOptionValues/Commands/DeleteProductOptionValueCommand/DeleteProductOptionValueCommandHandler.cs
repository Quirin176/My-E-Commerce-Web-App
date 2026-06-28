using MediatR;
using WebApp_API.Modules.ProductOptionValues.Repositories;

namespace WebApp_API.Modules.ProductOptionValues.Commands.DeleteProductOptionValue
{
    public class DeleteProductOptionValueCommandHandler : IRequestHandler<DeleteProductOptionValueCommand, bool>
    {
        private readonly IProductOptionValueRepository _repo;

        public DeleteProductOptionValueCommandHandler(IProductOptionValueRepository repo) => _repo = repo;

        public async Task<bool> Handle(DeleteProductOptionValueCommand request, CancellationToken cancellationToken)
        {
            var optionValue = await _repo.GetProductOptionValueByIdAsync(request.OptionValueId);
            if (optionValue is null) return false;

            await _repo.DeleteProductOptionValueByIdAsync(request.OptionValueId);
            return true;
        }
    }
}
