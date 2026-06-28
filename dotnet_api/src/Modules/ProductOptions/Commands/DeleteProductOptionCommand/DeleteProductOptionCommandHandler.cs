using MediatR;
using WebApp_API.Modules.ProductOptions.Repositories;

namespace WebApp_API.Modules.ProductOptions.Commands.DeleteProductOption
{
    public class DeleteProductOptionCommandHandler : IRequestHandler<DeleteProductOptionCommand, bool>
    {
        private readonly IProductOptionRepository _repo;

        public DeleteProductOptionCommandHandler(IProductOptionRepository repo) => _repo = repo;

        public async Task<bool> Handle(DeleteProductOptionCommand request, CancellationToken cancellationToken)
        {
            var option = await _repo.GetByIdAsync(request.Id);
            if (option is null) return false;

            await _repo.DeleteAsync(option);
            await _repo.SaveChangesAsync();
            return true;
        }
    }
}
