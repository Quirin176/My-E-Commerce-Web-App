using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public interface IMessageRepository
    {
        Task<Message> CreateAsync(Message msg);
    }
}