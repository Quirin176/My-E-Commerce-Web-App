using MediatR;
using WebApp_API.Modules.Orders.DTOs;

namespace WebApp_API.Modules.Orders.Queries.GetOrderStatistics
{
    public record GetOrderStatisticsQuery()
        : IRequest<OrderStatisticsResponse>;
}