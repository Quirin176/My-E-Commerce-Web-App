using MediatR;
using WebApp_API.Modules.Products.DTOs;

namespace WebApp_API.Modules.Products.Queries.GetProductBySlug
{
    public class GetProductBySlugQuery : IRequest<ProductDTOs.ProductDetailResponse?>
    {
        public string Slug { get; set; }

        public GetProductBySlugQuery(string slug) => Slug = slug;
    }
}
