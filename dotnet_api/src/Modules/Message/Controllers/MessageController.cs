using Microsoft.AspNetCore.Mvc;
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
        public async Task<IActionResult> Send(MessageDto dto)
        {
            var msg = await _service.SendMessageAsync(dto.ConversationId, dto.SenderId, dto.Content);
            return Ok(msg);
        }
    }
}