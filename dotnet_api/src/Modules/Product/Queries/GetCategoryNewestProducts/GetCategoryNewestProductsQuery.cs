using MediatR;
using WebApp_API.Modules.Products.DTOs;

namespace WebApp_API.Modules.Products.Queries.GetCategoryNewestProducts
{
    public class GetCategoryNewestProductsQuery : IRequest<List<ProductListDTOs.ProductSummaryResponse>>
    {
        public int CategoryId { get; set; }
        public int Amount { get; set; }

        public GetCategoryNewestProductsQuery(int categoryId, int amount)
        {
            CategoryId = categoryId;
            Amount = amount;
        }
    }
}
