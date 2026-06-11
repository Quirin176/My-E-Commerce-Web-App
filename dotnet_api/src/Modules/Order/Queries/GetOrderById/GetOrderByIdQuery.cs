using MediatR;
using WebApp_API.DTOs;

namespace WebApp_API.Features.Orders.Queries.GetOrderById
{
    public record GetOrderByIdQuery(
        int OrderId,
        int? UserId = null
    ) : IRequest<OrderDTOs.OrderResponse?>;
}