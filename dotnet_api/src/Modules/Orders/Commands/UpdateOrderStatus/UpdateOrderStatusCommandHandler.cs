using MediatR;
using WebApp_API.Modules.Orders.Repositories;

namespace WebApp_API.Modules.Orders.Commands.UpdateOrderStatus
{
    public class UpdateOrderStatusCommandHandler
        : IRequestHandler<UpdateOrderStatusCommand, bool>
    {
        private readonly IOrderRepository _repo;

        public UpdateOrderStatusCommandHandler(IOrderRepository repo)
        {
            _repo = repo;
        }

        public async Task<bool> Handle(
            UpdateOrderStatusCommand request,
            CancellationToken cancellationToken)
        {
            var order = await _repo.GetOrderByIdAsync(request.OrderId);

            if (order is null)
                return false;

            order.Status = request.Status;

            await _repo.UpdateOrderAsync(order);

            return true;
        }
    }
}