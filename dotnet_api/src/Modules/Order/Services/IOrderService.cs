using WebApp_API.DTOs;
using WebApp_API.Specifications;

namespace WebApp_API.Services
{
    public interface IOrderService
    {
        // ────────────────────────────── Single Order Lookups ──────────────────────────────
        Task<OrderDTOs.OrderResponse?> GetOrderByIdAsync(int id, int? userId = null);
        Task<OrderDTOs.OrderResponse?> GetOrderWithItemsByIdAsync(int id, int? userId = null);
        Task<OrderDTOs.AdminOrderResponse?> AdminGetOrderWithItemsByIdAsync(int id);

        Task<OrderDTOs.OrderStatisticsResponse?> GetOrderStatisticsAsync();
        Task<List<OrderDTOs.OrderResponse>> GetOrdersByUserIdAsync(int userId);

        // ────────────────────────────── List of Orders Lookups ──────────────────────────────
        Task<List<OrderDTOs.OrderResponse>> GetFilteredOrdersAsync(OrderFiltersParameters filterParams);

        // ────────────────────────────── Write Operations ──────────────────────────────
        Task<OrderDTOs.OrderResponse> CreateOrderAsync(OrderDTOs.CreateOrderRequest request, int userId);
        Task<bool> UpdateOrderAsync(int id, OrderDTOs.UpdateOrderRequest request);
        Task<bool> UpdateOrderStatusAsync(int id, string status);
        Task<bool> DeleteOrderAsync(int id);
        Task<byte[]> ExportOrdersCsvAsync(OrderFiltersParameters filterParams);

    }
}