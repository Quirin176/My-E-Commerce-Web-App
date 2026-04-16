using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApp_API.DTOs;
using WebApp_API.Services;

namespace WebApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductOptionsController : ControllerBase  // API Endpoint: /api/productoptions
    {
        private readonly IProductOptionService _service;

        public ProductOptionsController(IProductOptionService service) => _service = service;

        // GET: /api/productoptions/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var option = await _service.GetByIdAsync(id);
            return option is null ? NotFound(new { message = "Product option not found" }) : Ok(option);
        }

        // GET: /api/productoptions/category/id/{categoryId}
        [HttpGet("category/id/{categoryId:int}")]
        public async Task<IActionResult> GetByCategoryId(int categoryId)
        {
            if (categoryId <= 0)
                return BadRequest(new { message = "Valid category ID is required" });

            try
            {
                var options = await _service.GetByCategoryIdAsync(categoryId);
                return Ok(options);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error loading filters", error = ex.Message });
            }
        }

        // GET: /api/productoptions/category/slug/{categorySlug}
        [HttpGet("category/slug/{categorySlug}")]
        public async Task<IActionResult> GetByCategorySlug(string categorySlug)
        {
            if (string.IsNullOrWhiteSpace(categorySlug))
                return BadRequest(new { message = "Category slug is required" });

            try
            {
                var options = await _service.GetByCategorySlugAsync(categorySlug);
                return Ok(options);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error loading filters", error = ex.Message });
            }
        }

        // POST: /api/productoptions
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] ProductOptionDTOs.CreateProductOptionRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return BadRequest(new { message = "Option name is required" });

            if (!request.CategoryId.HasValue || request.CategoryId <= 0)
                return BadRequest(new { message = "Category ID is required" });

            try
            {
                var created = await _service.CreateAsync(request);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating product option", error = ex.Message });
            }
        }

        // DELETE: /api/productoptions/{id}
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var deleted = await _service.DeleteAsync(id);
                return deleted
                    ? Ok(new { message = "Product option deleted successfully" })
                    : NotFound(new { message = "Product option not found" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting product option", error = ex.Message });
            }
        }
    }
}