using WebApp_API.Entities;

namespace WebApp_API.Services
{
    public interface IOrderItemService
    {
        Task AddOrderItemAsync(OrderItem item);
    }
}