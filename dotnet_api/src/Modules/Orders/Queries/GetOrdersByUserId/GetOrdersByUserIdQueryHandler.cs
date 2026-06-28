using MediatR;
using WebApp_API.Modules.Orders.DTOs;
using WebApp_API.Modules.OrderItems.DTOs;
using WebApp_API.Modules.Orders.Repositories;

namespace WebApp_API.Modules.Orders.Queries.GetOrdersByUserId
{
    public class GetOrdersByUserIdQueryHandler
        : IRequestHandler<
            GetOrdersByUserIdQuery,
            List<OrderResponse>>
    {
        private readonly IOrderRepository _repo;

        public GetOrdersByUserIdQueryHandler(IOrderRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<OrderResponse>> Handle(
            GetOrdersByUserIdQuery request,
            CancellationToken cancellationToken)
        {
            var orders = await _repo.GetOrdersByUserIdAsync(request.UserId);

            return orders.Select(order => new OrderResponse
            {
                Id = order.Id,
                CustomerName = order.CustomerName,
                CustomerEmail = order.CustomerEmail,
                CustomerPhone = order.CustomerPhone,
                ShippingAddress = order.ShippingAddress,
                City = order.City,
                TotalAmount = order.TotalAmount,
                PaymentMethod = order.PaymentMethod,
                Status = order.Status,
                OrderDate = order.OrderDate,
                Notes = order.Notes,
                ItemCount = order.OrderItems?.Count ?? 0,
                Items = order.OrderItems?.Select(orderItem => new OrderItemResponse
                {
                    ProductId = orderItem.ProductId,
                    ProductName = orderItem.ProductName,
                    Quantity = orderItem.Quantity,
                    UnitPrice = orderItem.UnitPrice,
                    TotalPrice = orderItem.TotalPrice
                }).ToList() ?? new()
            }).ToList();
        }
    }
}