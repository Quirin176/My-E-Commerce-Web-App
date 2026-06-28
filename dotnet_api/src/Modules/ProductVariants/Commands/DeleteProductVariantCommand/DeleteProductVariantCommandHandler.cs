using MediatR;
using WebApp_API.Modules.ProductVariants.Repositories;

namespace WebApp_API.Modules.ProductVariants.Commands.DeleteProductVariant
{
    public class DeleteProductVariantCommandHandler : IRequestHandler<DeleteProductVariantCommand, bool>
    {
        private readonly IProductVariantRepository _productVariantRepo;

        public DeleteProductVariantCommandHandler(IProductVariantRepository productVariantRepo) 
            => _productVariantRepo = productVariantRepo;

        public async Task<bool> Handle(DeleteProductVariantCommand request, CancellationToken cancellationToken)
        {
            var variant = await _productVariantRepo.GetByIdAsync(request.Id);
            if (variant is null) return false;

            await _productVariantRepo.DeleteAsync(request.Id);
            await _productVariantRepo.SaveChangesAsync();
            return true;
        }
    }
}
