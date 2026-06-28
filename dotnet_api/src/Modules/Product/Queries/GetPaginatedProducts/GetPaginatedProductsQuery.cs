using MediatR;
using WebApp_API.Modules.Products.DTOs;
using WebApp_API.Modules.Products.Specifications;
using static WebApp_API.Models.PaginationDTOs;

namespace WebApp_API.Modules.Products.Queries.GetPaginatedProducts
{
    public class GetPaginatedProductsQuery : IRequest<PaginatedResponse<ProductListDTOs.ProductSummaryResponse>>
    {
        public ProductFilterSpec Spec { get; set; }

        public GetPaginatedProductsQuery(ProductFilterSpec spec) => Spec = spec;
    }
}
