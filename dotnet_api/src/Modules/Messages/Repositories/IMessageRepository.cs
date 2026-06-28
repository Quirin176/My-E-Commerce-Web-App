using WebApp_API.Entities;

namespace WebApp_API.Modules.Messages.Repositories
{
    public interface IMessageRepository
    {
        Task<Message> CreateAsync(Message msg);
    }
}