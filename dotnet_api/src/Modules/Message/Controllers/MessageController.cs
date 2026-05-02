using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApp_API.DTOs;
using WebApp_API.Services;

namespace WebApp_API.Controllers
{
    [ApiController]
    [Route("api/messages")]
    public class MessageController : ControllerBase
    {
        private readonly MessageService _service;

        public MessageController(MessageService service)
        {
            _service = service;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Send(MessageDto dto)
        {
            var userIdClaim = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized(new { message = "Missing id claim in token" });

            var senderId = int.Parse(userIdClaim);  // Read Sender Id from the JWT

            try
            {
                var msg = await _service.SendMessageAsync(dto.ChatId, senderId, dto.Content);
                return Ok(new MessageResponseDto
                {
                    Id = msg.Id,
                    ChatId = msg.ChatId,
                    SenderId = msg.SenderId,
                    Content = msg.Content,
                    Type = msg.Type,
                    Read = msg.Read,
                    CreatedAt = msg.CreatedAt
                });
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error sending message", error = ex.Message });
            }
        }
    }
}