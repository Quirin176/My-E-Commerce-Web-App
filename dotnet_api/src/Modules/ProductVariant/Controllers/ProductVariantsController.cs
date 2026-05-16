using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApp_API.DTOs;
using WebApp_API.Services;

namespace WebApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductVariantsController : ControllerBase // API URL: /api/productvariants
    {
        private readonly IProductVariantService _service;
        public ProductVariantsController(IProductVariantService service) => _service = service;

        // GET /api/productvariants/id/{id}
        [HttpGet("id/{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var variant = await _service.GetByIdAsync(id);
            return variant == null ? NotFound() : Ok(variant);
        }

        // GET /api/productvariants
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        // GET /api/productvariants/product/{productId}
        [HttpGet("product/{productId:int}")]
        public async Task<IActionResult> GetByProduct(int productId)
        {
            return Ok(await _service.GetByProductIdAsync(productId));
        }

        // POST /api/productvariants/product/variant/${productId} — create a single variant
        [HttpPost("/product/variant/{productId:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] ProductVariantDTOs.CreateProductVariantRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.VariantName))
                return BadRequest(new { message = "Variant name is required" });

            if (request.Price <= 0)
                return BadRequest(new { message = "Price must be greater than 0" });

            if (request.ProductId <= 0)
                return BadRequest(new { message = "Valid product ID is required" });

            try
            {
                await _service.CreateAsync(request);
                return Ok(new { message = "Product Variant Created" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating variant", error = ex.Message });
            }
        }

        // POST /api/productvariants/product/{productId} — create multiple variants at once
        // [HttpPost("product/{productId:int}")]
        // [Authorize(Roles = "Admin")]
        // public async Task<IActionResult> CreateVariants(
        //     int productId,
        //     [FromBody] IEnumerable<ProductVariantDTOs.CreateProductVariantRequest> requests)
        // {
        //     if (requests == null || !requests.Any())
        //         return BadRequest(new { message = "At least one variant is required" });

        //     // Stamp the productId from the route onto every request item
        //     var stamped = requests.Select(r =>
        //     {
        //         r.ProductId = productId;
        //         return r;
        //     }).ToList();

        //     // Basic validation across all variants before touching the DB
        //     foreach (var r in stamped)
        //     {
        //         if (string.IsNullOrWhiteSpace(r.VariantName))
        //             return BadRequest(new { message = $"Variant name is required for every variant" });

        //         if (r.Price <= 0)
        //             return BadRequest(new { message = $"Price must be > 0 for variant \"{r.VariantName}\"" });
        //     }

        //     try
        //     {
        //         await _service.CreateVariantsAsync(stamped);
        //         return Ok(new { message = $"{stamped.Count} variant(s) created successfully" });
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new { message = "Error creating variants", error = ex.Message });
        //     }
        // }

        // PUT /api/productvariants/{id} — update a single variant
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] ProductVariantDTOs.UpdateProductVariantRequest request)
        {
            try
            {
                var updated = await _service.UpdateAsync(id, request);
                return updated is null ? NotFound() : Ok(updated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating variant", error = ex.Message });
            }
        }

        // DELETE /api/productvariants/{id}
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _service.DeleteAsync(id);
            return success ? NoContent() : NotFound();
        }
    }
}