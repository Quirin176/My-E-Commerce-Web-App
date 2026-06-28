using MediatR;
using WebApp_API.Modules.Products.DTOs;
using WebApp_API.Enums;
using WebApp_API.Exceptions;
using WebApp_API.Modules.Products.Repositories;

namespace WebApp_API.Modules.Products.Commands.SoftDeleteMultipleProducts
{
    public class SoftDeleteMultipleProductsCommandHandler : IRequestHandler<SoftDeleteMultipleProductsCommand, ProductDTOs.BulkDeleteProductsResponse>
    {
        private readonly IProductRepository _productRepo;

        public SoftDeleteMultipleProductsCommandHandler(IProductRepository productRepo) => _productRepo = productRepo;

        public async Task<ProductDTOs.BulkDeleteProductsResponse> Handle(SoftDeleteMultipleProductsCommand request, CancellationToken cancellationToken)
        {
            if (request.Request.ProductIds is null || request.Request.ProductIds.Count == 0)
            {
                throw new BadRequestException("At least one product ID is required.");
            }

            var ids = request.Request.ProductIds.Where(id => id > 0)
                                        .Distinct()
                                        .ToList();

            if (ids.Count == 0) throw new BadRequestException("No valid product IDs were provided.");

            var products = await _productRepo.GetByIdsAsync(ids);

            foreach (var product in products)
            {
                SoftDelete(product);
            }

            await _productRepo.SaveChangesAsync();

            var foundIds = products.Select(product => product.Id).ToHashSet();

            return new ProductDTOs.BulkDeleteProductsResponse
            {
                RequestedCount = ids.Count,
                DeletedCount = products.Count,
                NotFoundIds = ids.Where(id => !foundIds.Contains(id)).ToList()
            };
        }

        private static void SoftDelete(Entities.Product product)
        {
            product.IsDeleted = true;
            product.DeletedAt = DateTime.UtcNow;
            product.Status = ProductStatus.Archived;
        }
    }
}
