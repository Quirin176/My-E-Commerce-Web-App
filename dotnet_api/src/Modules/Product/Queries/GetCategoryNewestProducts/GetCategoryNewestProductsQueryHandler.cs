using MediatR;
using WebApp_API.Modules.Products.DTOs;
using WebApp_API.Modules.Products.Mappers;
using WebApp_API.Modules.Products.Repositories;

namespace WebApp_API.Modules.Products.Queries.GetCategoryNewestProducts
{
    public class GetCategoryNewestProductsQueryHandler : IRequestHandler<GetCategoryNewestProductsQuery, List<ProductListDTOs.ProductSummaryResponse>>
    {
        private readonly IProductRepository _productRepo;
        private readonly ProductMapper _mapper;

        public GetCategoryNewestProductsQueryHandler(IProductRepository productRepo, ProductMapper mapper)
        {
            _productRepo = productRepo;
            _mapper = mapper;
        }

        public async Task<List<ProductListDTOs.ProductSummaryResponse>> Handle(GetCategoryNewestProductsQuery request, CancellationToken cancellationToken)
        {
            var products = await _productRepo.GetCategoryNewestAsync(request.CategoryId, request.Amount);
            var data = await _mapper.ToSummaryListAsync(products);
            return data;
        }
    }
}
