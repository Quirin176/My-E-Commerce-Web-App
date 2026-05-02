using Microsoft.AspNetCore.SignalR;

namespace WebApp_API.Hubs
{
    public class ChatHub : Hub
    {
        public async Task JoinConversation(int conversationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"convo-{conversationId}");
        }

        // public async Task SendMessage(int conversationId, string senderId, string content)
        // {
        //     await Clients.Group($"convo-{conversationId}")
        //         .SendAsync("ReceiveMessage", new
        //         {
        //             conversationId,
        //             senderId,
        //             content,
        //             createdAt = DateTime.UtcNow
        //         });
        // }
    }
}