using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApp_API.DTOs;
using WebApp_API.Entities;
using WebApp_API.Services;
using WebApp_API.Specifications;

namespace WebApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductVariantsController : ControllerBase // API URL: /api/products
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

        // GET /api/productvariants/product/productId:{productId}
        [HttpGet("product/{productId:int}")]
        public async Task<IActionResult> GetByProduct(int productId)
        {
            return Ok(await _service.GetByProductIdAsync(productId));
        }

        // POST /api/productvariants
        [HttpPost]
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
                return Ok(new { message = "Product Variants Created" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating variant", error = ex.Message });
            }
        }

        [HttpPut("{id:int}")]
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

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _service.DeleteAsync(id);
            return success ? NoContent() : NotFound();
        }
    }
}