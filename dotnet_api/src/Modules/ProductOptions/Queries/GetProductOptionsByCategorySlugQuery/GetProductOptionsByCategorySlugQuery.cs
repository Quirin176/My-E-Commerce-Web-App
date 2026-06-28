using MediatR;
using WebApp_API.Modules.ProductOptions.DTOs;

namespace WebApp_API.Modules.ProductOptions.Queries.GetProductOptionsByCategorySlug
{
    public class GetProductOptionsByCategorySlugQuery : IRequest<List<ProductOptionDTOs.ProductOptionGroupResponse>>
    {
        public string CategorySlug { get; set; }

        public GetProductOptionsByCategorySlugQuery(string categorySlug) => CategorySlug = categorySlug;
    }
}
