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
        private readonly IGeminiAgentService _geminiAgent;
        private readonly IChatRepository _chatRepo;
        private readonly IUserRepository _userRepo;
        private readonly ILogger<MessageService> _logger;

        // Synthetic sender ID used for all AI-generated messages.
        // Store a real User row with Id=1 and Role="Bot" so the FK is valid,
        // OR adjust the DB schema to allow NULL SenderId for bot messages.
        private const int BotSenderId = 1; // ← change to your actual bot user ID

        public MessageService(
            IMessageRepository repo,
            IHubContext<ChatHub> hub,
            IGeminiAgentService geminiAgent,
            IChatRepository chatRepo,
            IUserRepository userRepo,
            ILogger<MessageService> logger)
        {
            _repo = repo;
            _hub = hub;
            _geminiAgent = geminiAgent;
            _chatRepo = chatRepo;
            _userRepo = userRepo;
            _logger = logger;
        }

        public async Task<Message> SendMessageAsync(int chatId, int senderId, string content)
        {
            // Persist the customer message
            var msg = new Message
            {
                ChatId   = chatId,
                SenderId = senderId,
                Content  = content,
            };
            await _repo.CreateAsync(msg);

            // Broadcast customer message to the SignalR group
            await _hub.Clients
                .Group($"convo-{chatId}")
                .SendAsync("ReceiveMessage", BuildMessagePayload(msg, isBot: false));

            // Trigger Gemini auto-reply only when:
            //    - the sender is NOT the bot itself  (prevent infinite loops)
            //    - the chat has no admin assigned yet  (human agent not present)
            var chat = await _chatRepo.GetByIdAsync(chatId);
            bool hasHumanAgent = chat?.AdminId != null;

            if (!hasHumanAgent && senderId != BotSenderId)
            {
                // Fire-and-forget so the HTTP response is not delayed
                _ = Task.Run(() => SendBotReplyAsync(chatId, content));
            }

            return msg;
        }

        // Generates and broadcasts the Gemini reply
        private async Task SendBotReplyAsync(int chatId, string customerMessage)
        {
            try
            {
                // Small delay so the customer sees their own message first
                await Task.Delay(800);

                // Get AI reply
                var replyText = await _geminiAgent.GetChatReplyAsync(customerMessage, chatId);

                var botMsg = new Message
                {
                    ChatId   = chatId,
                    SenderId = BotSenderId,
                    Content  = replyText,
                    Type     = "bot",
                };

                await _repo.CreateAsync(botMsg);

                // Broadcast AI reply to the group
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

        // Helper: anonymous object sent over SignalR
        private static object BuildMessagePayload(Message msg, bool isBot) => new
        {
            id        = msg.Id,
            chatId    = msg.ChatId,
            senderId  = msg.SenderId,
            content   = msg.Content,
            type      = msg.Type,
            read      = msg.Read,
            createdAt = msg.CreatedAt,
            isBot     = isBot
        };
    }
}