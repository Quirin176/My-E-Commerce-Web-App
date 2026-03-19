using WebApp_API.DTOs;
using WebApp_API.Entities;

namespace WebApp_API.Services
{
    public interface IOrderService
    {
        Task<OrderDTOs.OrderResponse> GetOrderByIdAsync(int id);
        Task<OrderDTOs.OrderResponse> CreateOrderAsync(OrderDTOs.CreateOrderRequest orderRequest);
    }
}