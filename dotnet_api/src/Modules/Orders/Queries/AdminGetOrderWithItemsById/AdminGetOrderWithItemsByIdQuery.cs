using MediatR;
using WebApp_API.Modules.Orders.DTOs;

namespace WebApp_API.Modules.Orders.Queries.AdminGetOrderById
{
    public record AdminGetOrderWithItemsByIdQuery(
        int OrderId
    ) : IRequest<AdminOrderResponse?>;
}