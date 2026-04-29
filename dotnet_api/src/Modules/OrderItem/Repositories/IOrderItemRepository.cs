using WebApp_API.DTOs;
using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public interface IOrderItemRepository
    {
        Task<OrderItem?> GetOrderItemByIdAsync(int id);
        List<OrderItemDTOs.TopProductDto> GetTopSellingProducts(int top);
    }
}