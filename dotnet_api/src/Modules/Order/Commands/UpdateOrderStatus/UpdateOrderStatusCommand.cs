using MediatR;
using WebApp_API.Enums;

namespace WebApp_API.Features.Orders.Commands.UpdateOrderStatus
{
    public record UpdateOrderStatusCommand(
        int OrderId,
        OrderStatus Status
    ) : IRequest<bool>;
}