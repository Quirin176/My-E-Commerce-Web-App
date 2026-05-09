using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

        [HttpPost]
        public async Task<IActionResult> Create(ProductVariant variant)
        {
            var created = await _service.CreateAsync(variant);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, ProductVariant variant)
        {
            if (id != variant.Id) return BadRequest("ID mismatch");

            var updated = await _service.UpdateAsync(variant);
            return Ok(updated);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _service.DeleteAsync(id);
            return success ? Ok() : NotFound();
        }
    }
}