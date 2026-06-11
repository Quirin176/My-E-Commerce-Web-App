using MediatR;
using WebApp_API.DTOs;

namespace WebApp_API.Features.Orders.Queries.AdminGetOrderById
{
    public record AdminGetOrderWithItemsByIdQuery(
        int OrderId
    ) : IRequest<OrderDTOs.AdminOrderResponse?>;
}