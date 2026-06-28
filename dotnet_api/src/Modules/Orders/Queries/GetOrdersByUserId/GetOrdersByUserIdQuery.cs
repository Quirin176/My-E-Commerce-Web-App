using MediatR;
using WebApp_API.Modules.Orders.DTOs;

namespace WebApp_API.Modules.Orders.Queries.GetOrdersByUserId
{
    public record GetOrdersByUserIdQuery(
        int UserId
    ) : IRequest<List<OrderResponse>>;
}