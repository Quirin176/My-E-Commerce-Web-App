using WebApp_API.Entities;

namespace WebApp_API.Modules.Messages.Services
{
    public interface IMessageService
    {
        public Task<Message> SendMessageAsync(int chatId, int senderId, string content);
    }
}