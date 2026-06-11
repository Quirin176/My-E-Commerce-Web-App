using MediatR;
using WebApp_API.DTOs;
using WebApp_API.Repositories;

namespace WebApp_API.Features.Orders.Queries.GetOrdersByUserId
{
    public class GetOrdersByUserIdQueryHandler
        : IRequestHandler<
            GetOrdersByUserIdQuery,
            List<OrderDTOs.OrderResponse>>
    {
        private readonly IOrderRepository _repo;

        public GetOrdersByUserIdQueryHandler(IOrderRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<OrderDTOs.OrderResponse>> Handle(
            GetOrdersByUserIdQuery request,
            CancellationToken cancellationToken)
        {
            var orders = await _repo.GetOrdersByUserIdAsync(request.UserId);

            return orders.Select(order => new OrderDTOs.OrderResponse
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
                Items = order.OrderItems?.Select(orderItem => new OrderItemDTOs.OrderItemResponse
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