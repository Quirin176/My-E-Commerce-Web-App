using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.Entities;

public class ChatRepository : IChatRepository
{
    private readonly AppDbContext _db;

    public ChatRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Chat> CreateAsync(int customerId)
    {
        var convo = new Chat { CustomerId = customerId };
        _db.Chats.Add(convo);
        await _db.SaveChangesAsync();
        return convo;
    }

    public Task<Chat?> GetByIdAsync(int id)
    {
        return _db.Chats
            .Include(c => c.Messages)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public Task<List<Chat>> GetForAdminAsync()
    {
        return _db.Chats
            .OrderByDescending(c => c.UpdatedAt)
            .ToListAsync();
    }

    public Task<List<Chat>> GetForCustomerAsync(int customerId)
    {
        return _db.Chats
            .Where(c => c.CustomerId == customerId)
            .OrderByDescending(c => c.UpdatedAt)
            .ToListAsync();
    }
}