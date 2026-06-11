using MediatR;
using WebApp_API.DTOs;

namespace WebApp_API.Features.Orders.Queries.GetOrderStatistics
{
    public record GetOrderStatisticsQuery()
        : IRequest<OrderDTOs.OrderStatisticsResponse>;
}