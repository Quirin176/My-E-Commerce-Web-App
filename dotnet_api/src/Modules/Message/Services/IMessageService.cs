using WebApp_API.Entities;

namespace WebApp_API.Services
{
    public interface IMessageService
    {
        public Task<Message> SendMessageAsync(int chatId, int senderId, string content);
    }
}