using MediatR;
using WebApp_API.Modules.Orders.DTOs;

namespace WebApp_API.Modules.Orders.Queries.GetOrderById
{
    public record GetOrderByIdQuery(
        int OrderId,
        int? UserId = null
    ) : IRequest<OrderResponse?>;
}