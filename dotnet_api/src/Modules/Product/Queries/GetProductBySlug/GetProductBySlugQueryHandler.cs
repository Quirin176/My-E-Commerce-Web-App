using MediatR;
using WebApp_API.Modules.Products.DTOs;
using WebApp_API.Modules.Products.Mappers;
using WebApp_API.Modules.Products.Repositories;

namespace WebApp_API.Modules.Products.Queries.GetProductBySlug
{
    public class GetProductBySlugQueryHandler : IRequestHandler<GetProductBySlugQuery, ProductDTOs.ProductDetailResponse?>
    {
        private readonly IProductRepository _productRepo;
        private readonly ProductMapper _mapper;

        public GetProductBySlugQueryHandler(IProductRepository productRepo, ProductMapper mapper)
        {
            _productRepo = productRepo;
            _mapper = mapper;
        }

        public async Task<ProductDTOs.ProductDetailResponse?> Handle(GetProductBySlugQuery request, CancellationToken cancellationToken)
        {
            var product = await _productRepo.GetBySlugAsync(request.Slug);
            if (product is null) return null;
            
            var data = await _mapper.ToDetailAsync(product);
            return data;
        }
    }
}
