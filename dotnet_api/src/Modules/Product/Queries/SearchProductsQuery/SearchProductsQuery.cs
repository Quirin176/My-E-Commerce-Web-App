using MediatR;
using WebApp_API.Modules.Products.DTOs;

namespace WebApp_API.Modules.Products.Queries.SearchProducts
{
    public class SearchProductsQuery : IRequest<ProductDTOs.SearchResponse>
    {
        public ProductListDTOs.ProductSearchParams SearchParams { get; set; }

        public SearchProductsQuery(ProductListDTOs.ProductSearchParams searchParams) 
            => SearchParams = searchParams;
    }
}
