using MediatR;
using WebApp_API.Modules.Products.DTOs;
using WebApp_API.Modules.Products.Mappers;
using WebApp_API.Modules.Products.Repositories;
using static WebApp_API.Models.PaginationDTOs;

namespace WebApp_API.Modules.Products.Queries.GetSoftDeletedPaginatedProducts
{
    public class GetSoftDeletedPaginatedProductsQueryHandler : IRequestHandler<GetSoftDeletedPaginatedProductsQuery, PaginatedResponse<ProductListDTOs.ProductSummaryResponse>>
    {
        private readonly IProductRepository _productRepo;
        private readonly ProductMapper _mapper;

        public GetSoftDeletedPaginatedProductsQueryHandler(IProductRepository productRepo, ProductMapper mapper)
        {
            _productRepo = productRepo;
            _mapper = mapper;
        }

        public async Task<PaginatedResponse<ProductListDTOs.ProductSummaryResponse>> Handle(GetSoftDeletedPaginatedProductsQuery request, CancellationToken cancellationToken)
        {
            var (items, totalCount) = await _productRepo.GetSoftDeletedPaginatedAsync(request.Spec);

            var data = await _mapper.ToSummaryListAsync(items);
            var response = new PaginatedResponse<ProductListDTOs.ProductSummaryResponse>
            {
                Success = true,
                Data = data,
                Pagination = PaginationMeta.From(request.Spec.Page, request.Spec.PageSize, totalCount)
            };

            return response;
        }
    }
}
