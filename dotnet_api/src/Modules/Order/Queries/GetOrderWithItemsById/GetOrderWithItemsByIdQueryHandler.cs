using MediatR;
using WebApp_API.DTOs;
using WebApp_API.Repositories;

namespace WebApp_API.Features.Orders.Queries.GetOrderWithItemsById
{
    public class GetOrderWithItemsByIdQueryHandler
        : IRequestHandler<GetOrderWithItemsByIdQuery, OrderDTOs.OrderResponse?>
    {
        private readonly IOrderRepository _repo;

        public GetOrderWithItemsByIdQueryHandler(IOrderRepository repo)
        {
            _repo = repo;
        }

        public async Task<OrderDTOs.OrderResponse?> Handle(
            GetOrderWithItemsByIdQuery request,
            CancellationToken cancellationToken)
        {
            var order = await _repo.GetOrderWithItemsByIdAsync(request.OrderId);

            if (order is null)
                return null;

            if (request.UserId.HasValue &&
                order.UserId != request.UserId.Value)
                return null;

            return new OrderDTOs.OrderResponse
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