using WebApp_API.DTOs;
using WebApp_API.Entities;
using WebApp_API.Repositories;

namespace WebApp_API.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _repo;
        public OrderService (IOrderRepository repo) => _repo = repo;
        public async Task<OrderDTOs.OrderResponse> GetOrderByIdAsync(int id)
        {
            await _repo.GetOrderByIdAsync(id);
        }
        
        public async Task<OrderDTOs.OrderResponse> CreateOrderAsync(OrderDTOs.CreateOrderRequest orderRequest)
        {
            await _repo.CreateOrderAsync()
        }
    }
}