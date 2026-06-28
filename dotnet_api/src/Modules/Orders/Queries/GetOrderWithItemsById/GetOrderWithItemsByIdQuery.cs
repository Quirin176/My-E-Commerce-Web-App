using MediatR;
using WebApp_API.Modules.Orders.DTOs;

namespace WebApp_API.Modules.Orders.Queries.GetOrderWithItemsById
{
    public record GetOrderWithItemsByIdQuery(
        int OrderId,
        int? UserId = null
    ) : IRequest<OrderResponse?>;
}