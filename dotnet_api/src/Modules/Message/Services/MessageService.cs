using Microsoft.AspNetCore.SignalR;
using WebApp_API.Entities;
using WebApp_API.Hubs;
using WebApp_API.Repositories;

namespace WebApp_API.Services
{
    public class MessageService
    {
        private readonly IMessageRepository _repo;
        private readonly IHubContext<ChatHub> _hub;

        public MessageService(IMessageRepository repo, IHubContext<ChatHub> hub)
        {
            _repo = repo;
            _hub = hub;
        }

        public async Task<Message> SendMessageAsync(int chatId, int senderId, string content)
        {
            var msg = new Message
            {
                ChatId = chatId,
                SenderId = senderId,
                Content = content,
            };

            await _repo.CreateAsync(msg);

            await _hub.Clients.Group($"convo-{chatId}")
                .SendAsync("ReceiveMessage", msg);

            return msg;
        }
    }
}