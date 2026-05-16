using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApp_API.DTOs;
using WebApp_API.Services;

namespace WebApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductImagesController : ControllerBase // API Endpoint: /api/productimages
    {
        private readonly IProductImageService _service;
        public ProductImagesController(IProductImageService service) => _service = service;

        // POST: api/productimages/images
        [HttpPost("productimages/images")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateOptionValue([FromBody] List<ProductImageDTOs.AddProductImageRequest> requests)
        {
            try
            {
                await _service.AddProductImagesAsync(requests);
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

        // PUT: api/productimages/optionvalues/{id} - Update an existing option value
        // [HttpPut("optionvalues/{id}")]
        // [Authorize(Roles = "Admin")]
        // public async Task<IActionResult> UpdateOptionValue(int id, [FromBody] ProductOptionValueDTOs.UpdateOptionValueRequest request)
        // {
        //     if (string.IsNullOrWhiteSpace(request.Value))
        //         return BadRequest(new { message = "Option value is required" });

        //     try
        //     {
        //         await _service.UpdateProductOptionValueAsync(id, request);
        //         return Ok(new { message = "Option value updated successfully" });
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new { message = "Error updating option value", error = ex.Message });
        //     }
        // }

        // DELETE: api/productimages/optionvalues/{id} - Delete a ProductOptionValue
        // [HttpDelete("optionvalues/{id}")]
        // [Authorize(Roles = "Admin")]
        // public async Task<IActionResult> DeleteOptionValue(int id)
        // {
        //     try
        //     {
        //         await _service.DeleteProductOptionValueAsync(id);
        //         return Ok(new { message = "Option value deleted successfully" });
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new { message = "Error deleting option value", error = ex.Message });
        //     }
        // }
    }
}
