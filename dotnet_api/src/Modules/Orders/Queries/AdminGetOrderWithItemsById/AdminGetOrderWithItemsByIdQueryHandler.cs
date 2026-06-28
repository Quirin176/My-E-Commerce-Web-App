using MediatR;
using WebApp_API.Modules.Orders.DTOs;
using WebApp_API.Modules.OrderItems.DTOs;
using WebApp_API.Modules.Orders.Repositories;

namespace WebApp_API.Modules.Orders.Queries.AdminGetOrderById
{
    public class AdminGetOrderWithItemsByIdQueryHandler
        : IRequestHandler<AdminGetOrderWithItemsByIdQuery, AdminOrderResponse?>
    {
        private readonly IOrderRepository _repo;

        public AdminGetOrderWithItemsByIdQueryHandler(IOrderRepository repo)
        {
            _repo = repo;
        }

        public async Task<AdminOrderResponse?> Handle(
            AdminGetOrderWithItemsByIdQuery request,
            CancellationToken cancellationToken)
        {
            var order = await _repo.GetOrderWithItemsByIdAsync(request.OrderId);

            if (order is null)
                return null;

            return new AdminOrderResponse
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
                Items = order.OrderItems.Select(x => new OrderItemResponse
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