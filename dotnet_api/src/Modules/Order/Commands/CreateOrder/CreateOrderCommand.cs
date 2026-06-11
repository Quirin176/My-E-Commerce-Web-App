using MediatR;
using WebApp_API.DTOs;

namespace WebApp_API.Features.Orders.Commands.CreateOrder
{
    public record CreateOrderCommand(
        OrderDTOs.CreateOrderRequest Order,
        int UserId
    ) : IRequest<OrderDTOs.OrderResponse>;
}