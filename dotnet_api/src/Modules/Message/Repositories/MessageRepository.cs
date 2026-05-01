using WebApp_API.Data;
using WebApp_API.Entities;

namespace WebApp_API.Repositories
{
    public class MessageRepository : IMessageRepository
    {
        private readonly AppDbContext _db;

        public MessageRepository(AppDbContext db) => _db = db;

        public async Task<Message> CreateAsync(Message msg)
        {
            _db.Messages.Add(msg);

            var convo = await _db.Chats.FindAsync(msg.ChatId);
            convo.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return msg;
        }
    }
}