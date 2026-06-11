using MediatR;
using WebApp_API.Enums;
using WebApp_API.Entities;
using WebApp_API.DTOs;
using WebApp_API.Repositories;

namespace WebApp_API.Features.Orders.Commands.CreateOrder
{
    public class CreateOrderCommandHandler
        : IRequestHandler<CreateOrderCommand, OrderDTOs.OrderResponse>
    {
        private readonly IOrderRepository _repo;

        public CreateOrderCommandHandler(IOrderRepository repo)
        {
            _repo = repo;
        }

        public async Task<OrderDTOs.OrderResponse> Handle(
            CreateOrderCommand request,
            CancellationToken cancellationToken)
        {
            var order = new Order
            {
                UserId = request.UserId,
                CustomerName = request.Order.CustomerName,
                CustomerEmail = request.Order.CustomerEmail,
                CustomerPhone = request.Order.CustomerPhone,
                ShippingAddress = request.Order.ShippingAddress,
                City = request.Order.City,
                TotalAmount = request.Order.TotalAmount,
                PaymentMethod = request.Order.PaymentMethod,
                Status = OrderStatus.Pending,
                Notes = request.Order.Notes,
                CreatedAt = DateTime.UtcNow,
                OrderDate = DateTime.UtcNow
            };

            var items = request.Order.OrderItems
                .Select(i => new OrderItem
                {
                    ProductId = i.ProductId,
                    ProductName = i.ProductName,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    TotalPrice = i.TotalPrice
                })
                .ToList();

            var created = await _repo.CreateOrderAsync(order, items);

            return new OrderDTOs.OrderResponse
            {
                Id = created.Id,
                CustomerName = created.CustomerName,
                CustomerEmail = created.CustomerEmail,
                CustomerPhone = created.CustomerPhone,
                ShippingAddress = created.ShippingAddress,
                City = created.City,
                TotalAmount = created.TotalAmount,
                PaymentMethod = created.PaymentMethod,
                Status = created.Status,
                OrderDate = created.OrderDate,
                Notes = created.Notes
            };
        }
    }
}