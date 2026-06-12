using MediatR;
using WebApp_API.DTOs;
using WebApp_API.Repositories;

namespace WebApp_API.Features.Orders.Queries.GetOrderById
{
    public class GetOrderByIdQueryHandler
        : IRequestHandler<GetOrderByIdQuery, OrderDTOs.OrderResponse?>
    {
        private readonly IOrderRepository _repo;

        public GetOrderByIdQueryHandler(IOrderRepository repo)
        {
            _repo = repo;
        }

        public async Task<OrderDTOs.OrderResponse?> Handle(
            GetOrderByIdQuery request,
            CancellationToken cancellationToken)
        {
            var order = await _repo.GetOrderByIdAsync(request.OrderId);

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
                Notes = order.Notes
            };
        }
    }
}