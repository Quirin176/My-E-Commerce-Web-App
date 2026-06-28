using MediatR;
using WebApp_API.Modules.Orders.DTOs;
using WebApp_API.Modules.Orders.Repositories;

namespace WebApp_API.Modules.Orders.Queries.GetOrderById
{
    public class GetOrderByIdQueryHandler
        : IRequestHandler<GetOrderByIdQuery, OrderResponse?>
    {
        private readonly IOrderRepository _repo;

        public GetOrderByIdQueryHandler(IOrderRepository repo)
        {
            _repo = repo;
        }

        public async Task<OrderResponse?> Handle(
            GetOrderByIdQuery request,
            CancellationToken cancellationToken)
        {
            var order = await _repo.GetOrderByIdAsync(request.OrderId);

            if (order is null)
                return null;

            if (request.UserId.HasValue &&
                order.UserId != request.UserId.Value)
                return null;

            return new OrderResponse
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
                Notes = order.Notes
            };
        }
    }
}