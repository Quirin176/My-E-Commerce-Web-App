using MediatR;
using WebApp_API.Modules.Orders.DTOs;

namespace WebApp_API.Modules.Orders.Commands.UpdateOrder
{
    public record UpdateOrderCommand(
        int OrderId,
        UpdateOrderRequest Request) : IRequest<bool>;
}