using MediatR;
using WebApp_API.DTOs;

namespace WebApp_API.Features.Orders.Commands.UpdateOrder
{
    public record UpdateOrderCommand(
        int OrderId,
        OrderDTOs.UpdateOrderRequest Request
    ) : IRequest<bool>;
}