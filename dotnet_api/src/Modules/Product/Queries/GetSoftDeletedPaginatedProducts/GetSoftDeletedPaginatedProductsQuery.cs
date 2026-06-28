using MediatR;
using WebApp_API.Modules.Products.DTOs;
using WebApp_API.Modules.Products.Specifications;
using static WebApp_API.Models.PaginationDTOs;

namespace WebApp_API.Modules.Products.Queries.GetSoftDeletedPaginatedProducts
{
    public class GetSoftDeletedPaginatedProductsQuery : IRequest<PaginatedResponse<ProductListDTOs.ProductSummaryResponse>>
    {
        public ProductFilterSpec Spec { get; set; }

        public GetSoftDeletedPaginatedProductsQuery(ProductFilterSpec spec) => Spec = spec;
    }
}
