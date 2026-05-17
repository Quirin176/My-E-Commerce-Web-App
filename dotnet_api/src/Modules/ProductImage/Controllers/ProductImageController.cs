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

        // GET → /api/productimage/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var img = await _service.GetByIdAsync(id);
            if (img == null) return NotFound();

            return Ok(img);
        }

        // GET → /api/productimage/product/{productId:int}
        [HttpGet("product/{productId:int}")]
        public async Task<IActionResult> GetByProduct(int productId)
        {
            return Ok(await _service.GetByProductAsync(productId));
        }

        // GET → /api/productimage/variant/{variantId:int}
        [HttpGet("variant/{variantId:int}")]
        public async Task<IActionResult> GetByVariant(int variantId)
        {
            return Ok(await _service.GetByVariantAsync(variantId));
        }

        // POST: api/productimages/images - Accepts a list of image payloads and persists them.
        [HttpPost("productimages/images")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddProductImages([FromBody] List<ProductImageDTOs.AddProductImageRequest> requests)
        {
            if (requests == null || requests.Count == 0)
                return BadRequest(new { message = "At least one image is required." });

            // Validate that each request targets exactly one of Product or Variant
            var invalid = requests.Where(r =>
                (r.ProductId == 0 && r.VariantId == 0) ||
                (r.ProductId != 0 && r.VariantId != 0)
            ).ToList();

            if (invalid.Count > 0)
                return BadRequest(new
                {
                    message = "Each image must target either a Product or a Variant, not both and not neither.",
                    invalidCount = invalid.Count
                });

            try
            {
                await _service.AddRangeAsync(requests);
                return Ok(new { message = $"{requests.Count} image(s) saved successfully." });
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
                return StatusCode(500, new { message = "Error saving images.", error = ex.Message });
            }
        }

        // PUT → update image
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, ProductImageDTOs.ProductImageUpdateRequest dto)
        {
            // if (string.IsNullOrWhiteSpace(dto.ImageUrl)) return BadRequest(new { message = "Image URL is required." });

            var updated = await _service.UpdateAsync(id, dto);
            if (updated == null) return NotFound();

            return Ok(updated);
        }

        // DELETE → delete one
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _service.DeleteAsync(id);
            return success ? Ok() : NotFound();
        }

        // DELETE → delete all images of a product
        [HttpDelete("product/{productId:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteByProduct(int productId)
        {
            await _service.RemoveRangeByProductAsync(productId);
            return Ok();
        }
    }
}