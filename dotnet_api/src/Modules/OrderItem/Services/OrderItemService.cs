using WebApp_API.Entities;
using WebApp_API.Repositories;

namespace WebApp_API.Services
{
    public class OrderItemService : IOrderItemService
    {
        private readonly IOrderItemRepository _repo;
        public OrderItemService(IOrderItemRepository repo) => _repo = repo;

        public async Task<OrderItem?> GetOrderItemByIdAsync(int id) =>
            await _repo.GetOrderItemByIdAsync(id);
    }
}