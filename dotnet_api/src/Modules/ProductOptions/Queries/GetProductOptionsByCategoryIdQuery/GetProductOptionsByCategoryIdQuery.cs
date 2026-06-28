using MediatR;
using WebApp_API.Modules.ProductOptions.DTOs;

namespace WebApp_API.Modules.ProductOptions.Queries.GetProductOptionsByCategoryId
{
    public class GetProductOptionsByCategoryIdQuery : IRequest<List<ProductOptionDTOs.ProductOptionGroupResponse>>
    {
        public int CategoryId { get; set; }

        public GetProductOptionsByCategoryIdQuery(int categoryId) => CategoryId = categoryId;
    }
}
