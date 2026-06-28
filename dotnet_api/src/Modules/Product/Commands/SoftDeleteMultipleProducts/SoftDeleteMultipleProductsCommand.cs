using MediatR;
using WebApp_API.Modules.Products.DTOs;

namespace WebApp_API.Modules.Products.Commands.SoftDeleteMultipleProducts
{
    public class SoftDeleteMultipleProductsCommand : IRequest<ProductDTOs.BulkDeleteProductsResponse>
    {
        public ProductDTOs.BulkDeleteProductsRequest Request { get; set; }

        public SoftDeleteMultipleProductsCommand(ProductDTOs.BulkDeleteProductsRequest request) => Request = request;
    }
}
