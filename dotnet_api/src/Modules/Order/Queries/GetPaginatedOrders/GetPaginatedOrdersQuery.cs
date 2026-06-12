using MediatR;
using WebApp_API.DTOs;
using WebApp_API.Specifications;
using static WebApp_API.Models.PaginationDTOs;

namespace WebApp_API.Features.Orders.Queries.GetPaginatedOrders
{
    public record GetPaginatedOrdersQuery(
        OrderFiltersParameters Filters
    ) : IRequest<PaginatedResponse<OrderDTOs.OrderResponse>>;
}