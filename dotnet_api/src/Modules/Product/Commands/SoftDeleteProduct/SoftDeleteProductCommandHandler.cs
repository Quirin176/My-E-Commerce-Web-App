using MediatR;
using WebApp_API.Enums;
using WebApp_API.Modules.Products.Repositories;

namespace WebApp_API.Modules.Products.Commands.SoftDeleteProduct
{
    public class SoftDeleteProductCommandHandler : IRequestHandler<SoftDeleteProductCommand, bool>
    {
        private readonly IProductRepository _productRepo;

        public SoftDeleteProductCommandHandler(IProductRepository productRepo) => _productRepo = productRepo;

        public async Task<bool> Handle(SoftDeleteProductCommand request, CancellationToken cancellationToken)
        {
            var product = await _productRepo.GetByIdAsync(request.ProductId);
            if (product is null) return false;

            SoftDelete(product);

            await _productRepo.SaveChangesAsync();

            return true;
        }

        private static void SoftDelete(Entities.Product product)
        {
            product.IsDeleted = true;
            product.DeletedAt = DateTime.UtcNow;
            product.Status = ProductStatus.Archived;
        }
    }
}
