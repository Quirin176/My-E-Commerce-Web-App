using MediatR;
using WebApp_API.Modules.Products.Repositories;

namespace WebApp_API.Modules.Products.Commands.HardDeleteProduct
{
    public class HardDeleteProductCommandHandler : IRequestHandler<HardDeleteProductCommand, bool>
    {
        private readonly IProductRepository _productRepo;

        public HardDeleteProductCommandHandler(IProductRepository productRepo) => _productRepo = productRepo;

        public async Task<bool> Handle(HardDeleteProductCommand request, CancellationToken cancellationToken)
        {
            var product = await _productRepo.GetByIdAsync(request.Id);
            if (product is null) return false;

            _productRepo.Remove(product);
            await _productRepo.SaveChangesAsync();

            return true;
        }
    }
}
