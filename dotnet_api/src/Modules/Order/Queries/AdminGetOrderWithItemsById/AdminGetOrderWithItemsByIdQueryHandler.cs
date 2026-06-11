using MediatR;
using WebApp_API.DTOs;
using WebApp_API.Repositories;

namespace WebApp_API.Features.Orders.Queries.AdminGetOrderById
{
    public class AdminGetOrderWithItemsByIdQueryHandler
        : IRequestHandler<AdminGetOrderWithItemsByIdQuery, OrderDTOs.AdminOrderResponse?>
    {
        private readonly IOrderRepository _repo;

        public AdminGetOrderWithItemsByIdQueryHandler(IOrderRepository repo)
        {
            _repo = repo;
        }

        public async Task<OrderDTOs.AdminOrderResponse?> Handle(
            AdminGetOrderWithItemsByIdQuery request,
            CancellationToken cancellationToken)
        {
            var order = await _repo.GetOrderWithItemsByIdAsync(request.OrderId);

            if (order is null)
                return null;

            return new OrderDTOs.AdminOrderResponse
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
                UserId = order.User?.Id,
                UserName = order.User?.Username,
                Items = order.OrderItems.Select(x => new OrderItemDTOs.OrderItemResponse
                {
                    ProductId = x.ProductId,
                    ProductName = x.ProductName,
                    Quantity = x.Quantity,
                    UnitPrice = x.UnitPrice,
                    TotalPrice = x.TotalPrice
                }).ToList()
            };
        }
    }
}