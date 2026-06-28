using MediatR;
using WebApp_API.Modules.Orders.Repositories;

namespace WebApp_API.Modules.Orders.Commands.UpdateOrder
{
    public class UpdateOrderCommandHandler
        : IRequestHandler<UpdateOrderCommand, bool>
    {
        private readonly IOrderRepository _repo;

        public UpdateOrderCommandHandler(IOrderRepository repo)
        {
            _repo = repo;
        }

        public async Task<bool> Handle(
            UpdateOrderCommand request,
            CancellationToken cancellationToken)
        {
            var order = await _repo.GetOrderByIdAsync(request.OrderId);

            if (order is null)
                return false;

            if (!string.IsNullOrWhiteSpace(request.Request.CustomerName))
                order.CustomerName = request.Request.CustomerName;

            if (!string.IsNullOrWhiteSpace(request.Request.CustomerEmail))
                order.CustomerEmail = request.Request.CustomerEmail;

            if (!string.IsNullOrWhiteSpace(request.Request.CustomerPhone))
                order.CustomerPhone = request.Request.CustomerPhone;

            if (!string.IsNullOrWhiteSpace(request.Request.ShippingAddress))
                order.ShippingAddress = request.Request.ShippingAddress;

            if (!string.IsNullOrWhiteSpace(request.Request.City))
                order.City = request.Request.City;

            if (!string.IsNullOrWhiteSpace(request.Request.Notes))
                order.Notes = request.Request.Notes;

            order.Status = request.Request.Status;

            await _repo.UpdateOrderAsync(order);

            return true;
        }
    }
}