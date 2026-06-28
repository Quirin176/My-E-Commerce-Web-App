using MediatR;
using WebApp_API.Modules.Products.DTOs;
using WebApp_API.Modules.Products.Mappers;
using WebApp_API.Modules.Products.Repositories;

namespace WebApp_API.Modules.Products.Queries.GetProductById
{
    public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDTOs.ProductDetailResponse?>
    {
        private readonly IProductRepository _productRepo;
        private readonly ProductMapper _mapper;

        public GetProductByIdQueryHandler(IProductRepository productRepo, ProductMapper mapper)
        {
            _productRepo = productRepo;
            _mapper = mapper;
        }

        public async Task<ProductDTOs.ProductDetailResponse?> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
        {
            var product = await _productRepo.GetByIdAsync(request.Id);
            if (product is null) return null;
            
            var data = await _mapper.ToDetailAsync(product);
            return data;
        }
    }
}
