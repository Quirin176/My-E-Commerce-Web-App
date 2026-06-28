using MediatR;
using WebApp_API.Modules.Products.DTOs;

namespace WebApp_API.Modules.Products.Queries.GetTopSellingProducts
{
    public class GetTopSellingProductsQuery : IRequest<List<ProductListDTOs.ProductSummaryResponse>>
    {
        public int CategoryId { get; set; }
        public int Amount { get; set; }

        public GetTopSellingProductsQuery(int categoryId, int amount)
        {
            CategoryId = categoryId;
            Amount = amount;
        }
    }
}
