using MediatR;
using WebApp_API.Modules.Products.DTOs;
using WebApp_API.Modules.Products.Mappers;
using WebApp_API.Modules.Products.Repositories;
using WebApp_API.Modules.Products.Specifications;

namespace WebApp_API.Modules.Products.Queries.SearchProducts
{
    public class SearchProductsQueryHandler : IRequestHandler<SearchProductsQuery, ProductDTOs.SearchResponse>
    {
        private readonly IProductRepository _productRepo;
        private readonly ProductMapper _mapper;

        public SearchProductsQueryHandler(IProductRepository productRepo, ProductMapper mapper)
        {
            _productRepo = productRepo;
            _mapper = mapper;
        }

        public async Task<ProductDTOs.SearchResponse> Handle(SearchProductsQuery request, CancellationToken cancellationToken)
        {
            var spec = ProductSearchSpec.From(request.SearchParams);
            var (items, totalCount) = await _productRepo.SearchAsync(spec);

            return new ProductDTOs.SearchResponse
            {
                Success = true,
                Query = request.SearchParams.QueryPhrase,
                TotalCount = totalCount,
                PageNumber = spec.Page,
                PageSize = spec.PageSize,
                TotalPages = (int)Math.Ceiling((decimal)totalCount / spec.PageSize),
                HasNextPage = (spec.Page - 1) * spec.PageSize + items.Count < totalCount,
                HasPreviousPage = spec.Page > 1,
                Products = await _mapper.ToSummaryListAsync(items)
            };
        }
    }
}
