using MediatR;
using WebApp_API.Modules.Orders.DTOs;
using WebApp_API.Modules.Orders.Specifications;
using static WebApp_API.Models.PaginationDTOs;

namespace WebApp_API.Modules.Orders.Queries.GetPaginatedOrders
{
    public record GetPaginatedOrdersQuery(
        OrderFiltersParameters Filters
    ) : IRequest<PaginatedResponse<OrderResponse>>;
}