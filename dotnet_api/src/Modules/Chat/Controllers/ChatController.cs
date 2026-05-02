using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApp_API.DTOs;

namespace WebApp_API.Controllers
{
    [ApiController]
    [Route("api/chats")]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly IChatRepository _repo;
        public ChatController(IChatRepository repo) => _repo = repo;

        // POST: api/chats - Create a new chat
        [HttpPost]
        public async Task<IActionResult> Create()
        {
            var userId = int.Parse(User.FindFirst("id")!.Value);
            var chat = await _repo.CreateAsync(userId);
            return Ok(new { chat.Id, chat.CustomerId, chat.Status, chat.CreatedAt });
        }

        // GET: api/chats/{id:int} - Get a chat by chat Id
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var chat = await _repo.GetByIdAsync(id);
            if (chat is null) return NotFound();
            return Ok(new ChatResponseDto
            {
                Id = chat.Id,
                CustomerId = chat.CustomerId,
                AdminId = chat.AdminId,
                Status = chat.Status,
                CreatedAt = chat.CreatedAt,
                UpdatedAt = chat.UpdatedAt,
                Messages = chat.Messages.Select(m => new MessageResponseDto
                {
                    Id = m.Id,
                    ChatId = m.ChatId,
                    SenderId = m.SenderId,
                    Content = m.Content,
                    Type = m.Type,
                    Read = m.Read,
                    CreatedAt = m.CreatedAt
                }).ToList()
            });
        }

        // GET: api/chats/mine - User get their chat
        [HttpGet("mine")]
        public async Task<IActionResult> GetMine()
        {
            var userId = int.Parse(User.FindFirst("id")!.Value);
            var chats = await _repo.GetForCustomerAsync(userId);
            return Ok(chats);
        }

        // GET: api/chats - Admin get all chats
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var chats = await _repo.GetForAdminAsync();
            return Ok(chats);
        }
    }
}