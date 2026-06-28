using MediatR;
using WebApp_API.Modules.Products.DTOs;
using WebApp_API.Modules.Products.Repositories;
using WebApp_API.Modules.Products.Specifications;

namespace WebApp_API.Modules.Products.Queries.GetProductSuggestions
{
    public class GetProductSuggestionsQueryHandler : IRequestHandler<GetProductSuggestionsQuery, List<string>>
    {
        private readonly IProductRepository _productRepo;

        public GetProductSuggestionsQueryHandler(IProductRepository productRepo) => _productRepo = productRepo;

        public async Task<List<string>> Handle(GetProductSuggestionsQuery request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.QueryPhrase) || request.QueryPhrase.Length < 2)
                return new List<string>();

            var spec = ProductSearchSpec.From(new ProductListDTOs.ProductSearchParams
            {
                QueryPhrase = request.QueryPhrase,
                PageSize = request.Limit
            });

            var (items, _) = await _productRepo.SearchAsync(spec);
            return items.Select(p => p.Name).Distinct().Take(request.Limit).ToList();
        }
    }
}
