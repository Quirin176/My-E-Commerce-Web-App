using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApp_API.DTOs;
using WebApp_API.Services;

namespace WebApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase // API URL: /api/products
    {
        private readonly IProductService _service;
        public ProductsController(IProductService service)
        {
            _service = service;
        }

        // ────────────────────────────────────────────────── Public endpoints ──────────────────────────────────────────────────
        // GET /api/products
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] ProductListDTOs.ProductFilterParams filterParams)
        {
            var products = await _service.GetFilteredAsync(filterParams);
            return Ok(products);
        }

        // GET /api/products/id:{id}
        [HttpGet("id:{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _service.GetByIdAsync(id);
            return product is null ? NotFound() : Ok(product);
        }

        // GET /api/products/slug/{slug}
        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var product = await _service.GetBySlugAsync(slug);
            return product is null ? NotFound() : Ok(product);
        }

        // GET /api/products/categories/{categorySlug}
        [HttpGet("categories/{categorySlug}")]
        public async Task<IActionResult> GetByCategory(string categorySlug)
        {
            var products = await _service.GetByCategoryAsync(categorySlug);
            return Ok(products);
        }

        // GET /api/products/filters
        [HttpGet("filters")]
        public async Task<IActionResult> FilterProducts([FromQuery] ProductListDTOs.ProductFilterParams filterParams)
        {
            if (string.IsNullOrWhiteSpace(filterParams.Category))
                return BadRequest(new { message = "Category is required" });

            var products = await _service.GetFilteredAsync(filterParams);
            return Ok(products);
        }

        // GET /api/products/search
        [HttpGet("search")]
        public async Task<IActionResult> SearchProducts([FromQuery] ProductListDTOs.ProductSearchParams searchParams)
        {
            if (string.IsNullOrWhiteSpace(searchParams.Q))
                return BadRequest(new { message = "Search query is required" });

            var result = await _service.SearchAsync(searchParams);
            return Ok(result);
        }

        // GET /api/products/search/suggestions
        [HttpGet("search/suggestions")]
        public async Task<IActionResult> GetSearchSuggestions([FromQuery] string q, [FromQuery] int limit = 10)
        {
            var suggestions = await _service.GetSuggestionsAsync(q, limit);
            return Ok(suggestions);
        }

        // ────────────────────────────────────────────────── Admin endpoints ──────────────────────────────────────────────────
        // GET /api/products/admin/paginated
        [HttpGet("admin/paginated")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetProductsPaginated(
            [FromQuery] ProductListDTOs.AdminProductFilterParams filterParams)
        {
            var result = await _service.GetPaginatedAsync(filterParams);
            return Ok(result);
        }

        // POST /api/products
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] ProductDTOs.CreateProductRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return BadRequest(new { message = "Product Name is required" });

            if (string.IsNullOrWhiteSpace(request.Slug))
                return BadRequest(new { message = "Product Slug is required" });

            if (request.Price <= 0)
                return BadRequest(new { message = "Price must be greater than 0" });

            if (request.CategoryId <= 0)
                return BadRequest(new { message = "Category is required" });

            try
            {
                var id = await _service.CreateAsync(request);
                return CreatedAtAction(nameof(GetById), new { id }, new { id });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating product", error = ex.Message });
            }
        }

        // PUT /api/products/{id}
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] ProductDTOs.UpdateProductRequest request)
        {
            try
            {
                var updated = await _service.UpdateAsync(id, request);
                return updated ? Ok(new { message = "Product updated", id }) : NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating product", error = ex.Message });
            }
        }

        // DELETE /api/products/{id}
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}