using WebApp_API.Entities;

public interface IChatRepository
{
    Task<Chat> CreateAsync(int customerId);
    Task<Chat?> GetByIdAsync(int id);
    Task<List<Chat>> GetForAdminAsync();
    Task<List<Chat>> GetForCustomerAsync(int customerId);
}