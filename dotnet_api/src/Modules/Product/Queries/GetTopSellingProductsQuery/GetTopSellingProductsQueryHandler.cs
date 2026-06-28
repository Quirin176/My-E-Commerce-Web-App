using MediatR;
using WebApp_API.Modules.Products.DTOs;
using WebApp_API.Modules.Products.Mappers;
using WebApp_API.Modules.Products.Repositories;

namespace WebApp_API.Modules.Products.Queries.GetTopSellingProducts
{
    public class GetTopSellingProductsQueryHandler : IRequestHandler<GetTopSellingProductsQuery, List<ProductListDTOs.ProductSummaryResponse>>
    {
        private readonly IProductRepository _productRepo;
        private readonly ProductMapper _mapper;

        public GetTopSellingProductsQueryHandler(IProductRepository productRepo, ProductMapper mapper)
        {
            _productRepo = productRepo;
            _mapper = mapper;
        }

        public async Task<List<ProductListDTOs.ProductSummaryResponse>> Handle(GetTopSellingProductsQuery request, CancellationToken cancellationToken)
        {
            var products = await _productRepo.GetTopSellingProducts(request.CategoryId, request.Amount);
            var data = await _mapper.ToSummaryListAsync(products);
            return data;
        }
    }
}
