using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.DTOs;
using WebApp_API.Entities;
using WebApp_API.Services;

namespace WebApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductOptionValuesController : ControllerBase // API Endpoint: /api/productoptionvalues
    {
        private readonly IProductOptionValueService _service;
        public ProductOptionValuesController(IProductOptionValueService service) => _service = service;

        // POST: api/productoptionvalues/optionvalues - Add a new value to an existing ProductOption
        [HttpPost("optionvalues")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateOptionValue([FromBody] ProductOptionValueDTOs.CreateOptionValueRequest request)
        {
            if (request.OptionId <= 0)
                return BadRequest(new { message = "Valid option ID is required" });

            if (string.IsNullOrWhiteSpace(request.Value))
                return BadRequest(new { message = "Option value is required" });

            try
            {
                await _service.CreateProductOptionValueAsync(request);
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
        public async Task<IActionResult> UpdateOptionValue(int id, [FromBody] ProductOptionValueDTOs.UpdateOptionValueRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Value))
                return BadRequest(new { message = "Option value is required" });

            try
            {
                await _service.UpdateProductOptionValueAsync(id, request);
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
                await _service.DeleteProductOptionValueAsync(id);
                return Ok(new { message = "Option value deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting option value", error = ex.Message });
            }
        }
    }
}
