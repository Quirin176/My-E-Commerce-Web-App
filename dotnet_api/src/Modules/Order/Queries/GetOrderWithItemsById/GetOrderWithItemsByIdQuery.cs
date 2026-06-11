using MediatR;
using WebApp_API.DTOs;

namespace WebApp_API.Features.Orders.Queries.GetOrderWithItemsById
{
    public record GetOrderWithItemsByIdQuery(
        int OrderId,
        int? UserId = null
    ) : IRequest<OrderDTOs.OrderResponse?>;
}