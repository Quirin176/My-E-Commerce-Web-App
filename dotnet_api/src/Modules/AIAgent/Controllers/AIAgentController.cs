// using Microsoft.AspNetCore.Mvc;
// using WebApp_API.Services;

// namespace WebApp_API.Controllers
// {
//     [ApiController]
//     [Route("api/agent")]
//     public class AIAgentController : ControllerBase
//     {
//         private readonly GeminiClient _gemini;

//         public AIAgentController(GeminiClient gemini)
//         {
//             _gemini = gemini;
//         }

//         [HttpPost("run")]
//         public async Task<IActionResult> Run([FromBody] AgentRequest req)
//         {
//             var result = await _gemini.GenerateAsync(req.Input);
//             return Ok(new { answer = result });
//         }
//     }

//     public class AgentRequest
//     {
//         public string Input { get; set; }
//     }
// }