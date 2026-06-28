using MediatR;
using WebApp_API.Modules.ProductOptions.DTOs;

namespace WebApp_API.Modules.ProductOptions.Queries.GetProductOptionById
{
    public class GetProductOptionByIdQuery : IRequest<ProductOptionDTOs.ProductOptionResponse?>
    {
        public int Id { get; set; }

        public GetProductOptionByIdQuery(int id) => Id = id;
    }
}
