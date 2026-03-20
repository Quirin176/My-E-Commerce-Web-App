using WebApp_API.DTOs;
using WebApp_API.Entities;
using WebApp_API.Specifications;

namespace WebApp_API.Services
{
    public interface IOrderService
    {
        // ────────────────────────────── Single Order Lookups ──────────────────────────────
        Task<OrderDTOs.OrderResponse?> GetOrderByIdAsync(int id);
        Task<List<OrderDTOs.OrderResponse>> GetOrdersByUserIdAsync(int userId);
        Task<OrderDTOs.OrderResponse> CreateOrderAsync(OrderDTOs.CreateOrderRequest request, int userId);
        
        // ────────────────────────────── List of Orders Lookups ──────────────────────────────
        Task<OrderDTOs.AdminOrderResponse?> GetAdminOrderByIdAsync(int id);
        Task<List<OrderDTOs.OrderResponse>> GetFilteredOrdersAsync(OrderFilterParameters filterParams);
        
        // ────────────────────────────── Write Operations ──────────────────────────────
        Task<bool> UpdateOrderStatusAsync(int id, string status);
        Task<bool> UpdateOrderAsync(int id, OrderDTOs.UpdateOrderRequest request);
        Task<bool> DeleteOrderAsync(int id);
        Task<OrderDTOs.OrderStatsResponse> GetOrderStatsAsync();
        Task<byte[]> ExportOrdersCsvAsync(OrderFilterParameters filterParams);

    }
}