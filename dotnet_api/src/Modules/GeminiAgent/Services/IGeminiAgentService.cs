namespace WebApp_API.Services
{
    public interface IGeminiAgentService
    {
        // Generates a context-aware reply for a customer message,
        // injecting live product catalogue data into the system prompt.
        Task<string> GetChatReplyAsync(string customerMessage, int chatId);
    }
}