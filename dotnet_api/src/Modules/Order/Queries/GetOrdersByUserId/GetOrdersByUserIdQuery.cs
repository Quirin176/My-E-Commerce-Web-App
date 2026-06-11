using MediatR;
using WebApp_API.DTOs;

namespace WebApp_API.Features.Orders.Queries.GetOrdersByUserId
{
    public record GetOrdersByUserIdQuery(
        int UserId
    ) : IRequest<List<OrderDTOs.OrderResponse>>;
}