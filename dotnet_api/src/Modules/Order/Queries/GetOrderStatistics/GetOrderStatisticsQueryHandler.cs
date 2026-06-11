using MediatR;
using WebApp_API.DTOs;
using WebApp_API.Repositories;

namespace WebApp_API.Features.Orders.Queries.GetOrderStatistics
{
    public class GetOrderStatisticsQueryHandler
        : IRequestHandler<
            GetOrderStatisticsQuery,
            OrderDTOs.OrderStatisticsResponse>
    {
        private readonly IOrderRepository _repo;

        public GetOrderStatisticsQueryHandler(IOrderRepository repo)
        {
            _repo = repo;
        }

        public async Task<OrderDTOs.OrderStatisticsResponse> Handle(
            GetOrderStatisticsQuery request,
            CancellationToken cancellationToken)
        {
            var orders = await _repo.GetAllOrdersWithItemsAsync();

            return new OrderDTOs.OrderStatisticsResponse
            {
                TotalOrders = orders.Count,
                TotalRevenue = orders.Sum(x => x.TotalAmount),
                TotalItems = orders.Sum(x => x.OrderItems.Count),
                AverageOrderValue = orders.Any()
                    ? orders.Average(x => x.TotalAmount)
                    : 0,

                Last30DaysRevenue = orders
                    .Where(x => x.OrderDate >= DateTime.UtcNow.AddDays(-30))
                    .Sum(x => x.TotalAmount),

                Last30DaysOrders = orders
                    .Count(x => x.OrderDate >= DateTime.UtcNow.AddDays(-30)),

                ByStatus = orders
                    .GroupBy(x => x.Status)
                    .Select(g => new OrderDTOs.OrderStatusCountDto
                    {
                        Status = g.Key,
                        Count = g.Count()
                    })
                    .ToList(),

                ByPaymentMethod = orders
                    .GroupBy(x => x.PaymentMethod)
                    .Select(g => new OrderDTOs.OrderPaymentMethodCountDto
                    {
                        Method = g.Key,
                        Count = g.Count()
                    })
                    .ToList()
            };
        }
    }
}