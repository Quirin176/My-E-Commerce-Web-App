using Microsoft.AspNetCore.SignalR;

namespace WebApp_API.Hubs
{
    public class ChatHub : Hub
    {
        // Join a conversation group to receive real-time messages.
        public async Task JoinConversation(int conversationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"convo-{conversationId}");
        }

        // Leave a conversation group.
        public async Task LeaveConversation(int conversationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"convo-{conversationId}");
        }

        // Client calls this to broadcast a typing indicator.
        // The server forwards it to everyone else in the group.
        public async Task SendTypingIndicator(int conversationId, int senderId, bool isTyping)
        {
            await Clients.OthersInGroup($"convo-{conversationId}")
                .SendAsync("TypingIndicator", new { conversationId, senderId, isTyping });
        }
    }
}