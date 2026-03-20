using WebApp_API.Entities;

namespace WebApp_API.Services
{
    public interface IOrderItemService
    {
        Task<OrderItem?> GetOrderItemByIdAsync(int id);
    }
}