using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using WebApp_API.Modules.ProductOptionValues.Commands.CreateProductOptionValue;
using WebApp_API.Modules.ProductOptionValues.Commands.DeleteProductOptionValue;
using WebApp_API.Modules.ProductOptionValues.Commands.UpdateProductOptionValue;
using WebApp_API.Modules.ProductOptionValues.DTOs;

namespace WebApp_API.Modules.ProductOptionValues.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductOptionValuesController : ControllerBase // API Endpoint: /api/productoptionvalues
    {
        private readonly IMediator _mediator;
        public ProductOptionValuesController(IMediator mediator) => _mediator = mediator;

        // POST: api/productoptionvalues/optionvalues - Add a new value to an existing ProductOption
        [HttpPost("optionvalues")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateOptionValue([FromBody] CreateOptionValueRequest request)
        {
            if (request.OptionId <= 0)
                return BadRequest(new { message = "Valid option ID is required" });

            if (string.IsNullOrWhiteSpace(request.Value))
                return BadRequest(new { message = "Option value is required" });

            try
            {
                await _mediator.Send(new CreateProductOptionValueCommand(request));
                return Ok(new { message = "Option Value created" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating option value", error = ex.Message });
            }
        }

        // PUT: api/productoptionvalues/optionvalues/{id} - Update an existing option value
        [HttpPut("optionvalues/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateOptionValue(int id, [FromBody] UpdateOptionValueRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Value))
                return BadRequest(new { message = "Option value is required" });

            try
            {
                await _mediator.Send(new UpdateProductOptionValueCommand(id, request));
                return Ok(new { message = "Option value updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating option value", error = ex.Message });
            }
        }

        // DELETE: api/productoptionvalues/optionvalues/{id} - Delete a ProductOptionValue
        [HttpDelete("optionvalues/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteOptionValue(int id)
        {
            try
            {
                await _mediator.Send(new DeleteProductOptionValueCommand(id));
                return Ok(new { message = "Option value deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting option value", error = ex.Message });
            }
        }
    }
}
