using MediatR;
using WebApp_API.Modules.ProductOptionValues.Repositories;

namespace WebApp_API.Modules.ProductOptionValues.Commands.UpdateProductOptionValue
{
    public class UpdateProductOptionValueCommandHandler : IRequestHandler<UpdateProductOptionValueCommand, bool>
    {
        private readonly IProductOptionValueRepository _repo;

        public UpdateProductOptionValueCommandHandler(IProductOptionValueRepository repo) => _repo = repo;

        public async Task<bool> Handle(UpdateProductOptionValueCommand request, CancellationToken cancellationToken)
        {
            var optionValue = await _repo.GetProductOptionValueByIdAsync(request.OptionValueId);
            if (optionValue is null) return false;

            optionValue.Value = request.Request.Value;

            await _repo.UpdateProductOptionValueByIdAsync(request.OptionValueId, optionValue);
            return true;
        }
    }
}
