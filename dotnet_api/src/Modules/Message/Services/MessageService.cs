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
        private readonly IChatRepository _chatRepo;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<MessageService> _logger;

        private readonly int _botUserId;

        public MessageService(
            IMessageRepository repo,
            IHubContext<ChatHub> hub,
            IChatRepository chatRepo,
            IServiceScopeFactory scopeFactory,
            ILogger<MessageService> logger,
            IConfiguration config)
        {
            _repo = repo;
            _hub = hub;
            _chatRepo = chatRepo;
            _scopeFactory = scopeFactory;
            _logger = logger;
            _botUserId = config.GetValue("Gemini:BotUserId", 1);
        }

        public async Task<Message> SendMessageAsync(int chatId, int senderId, string content)
        {
            // Persist the customer message
            var msg = new Message
            {
                ChatId = chatId,
                SenderId = senderId,
                Content = content,
            };
            await _repo.CreateAsync(msg);

            // Broadcast customer message to the SignalR group
            await _hub.Clients
                .Group($"convo-{chatId}")
                .SendAsync("ReceiveMessage", BuildMessagePayload(msg, isBot: false));

            // Trigger Gemini auto-reply only when:
            //   - sender is NOT the bot (prevent infinite loops)
            //   - chat has no human admin assigned yet
            var chat = await _chatRepo.GetByIdAsync(chatId);
            bool hasHumanAgent = chat?.AdminId != null;

            if (!hasHumanAgent && senderId != _botUserId)
            {
                // Fire-and-forget in a fresh DI scope so the DbContext is never disposed
                // underneath us when the HTTP request scope ends.
                _ = Task.Run(() => SendBotReplyAsync(chatId, content));
            }

            return msg;
        }

        private async Task SendBotReplyAsync(int chatId, string customerMessage)
        {
            try
            {
                await Task.Delay(800);

                // Create a brand-new DI scope — this gives us a fresh DbContext
                // and fresh scoped services that live until we dispose the scope.
                await using var scope = _scopeFactory.CreateAsyncScope();

                var geminiAgent = scope.ServiceProvider.GetRequiredService<IGeminiAgentService>();
                var messageRepo = scope.ServiceProvider.GetRequiredService<IMessageRepository>();
                var chatRepo = scope.ServiceProvider.GetRequiredService<IChatRepository>();

                var replyText = await geminiAgent.GetChatReplyAsync(customerMessage, chatId);

                // Verify the chat still exists (user may have deleted it)
                var chat = await chatRepo.GetByIdAsync(chatId);
                if (chat is null)
                {
                    _logger.LogWarning("[GeminiAgent] Chat {ChatId} no longer exists; skipping bot reply.", chatId);
                    return;
                }

                var botMsg = new Message
                {
                    ChatId = chatId,
                    SenderId = _botUserId,
                    Content = replyText,
                    Type = "bot",
                };

                await messageRepo.CreateAsync(botMsg);

                await _hub.Clients
                    .Group($"convo-{chatId}")
                    .SendAsync("ReceiveMessage", BuildMessagePayload(botMsg, isBot: true));

                _logger.LogInformation("[GeminiAgent] Bot replied to chatId={ChatId}", chatId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[GeminiAgent] Failed to send bot reply for chatId={ChatId}", chatId);
            }
        }

        private static object BuildMessagePayload(Message msg, bool isBot) => new
        {
            id = msg.Id,
            chatId = msg.ChatId,
            senderId = msg.SenderId,
            content = msg.Content,
            type = msg.Type,
            read = msg.Read,
            createdAt = msg.CreatedAt,
            isBot = isBot
        };
    }
}