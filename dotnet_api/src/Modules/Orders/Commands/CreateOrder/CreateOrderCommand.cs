using MediatR;
using WebApp_API.Modules.Orders.DTOs;

namespace WebApp_API.Modules.Orders.Commands.CreateOrder
{
    public record CreateOrderCommand(CreateOrderRequest Order, int UserId)
    : IRequest<OrderResponse>;
}