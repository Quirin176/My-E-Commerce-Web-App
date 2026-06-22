using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using WebApp_API.DTOs;
using WebApp_API.Services;
using WebApp_API.Specifications;

namespace WebApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase // API URL: /api/products
    {
        private readonly IProductService _service;
        private readonly IOutputCacheStore _cacheStore;

        public ProductsController(IProductService service, IOutputCacheStore cacheStore)
        {
            _service = service;
            _cacheStore = cacheStore;
        }

        // GET /api/products/id:{id}
        [OutputCache(PolicyName = "Products")]
        [HttpGet("id/{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _service.GetByIdAsync(id);
            return product is null ? NotFound() : Ok(product);
        }

        // GET /api/products/slug/{slug}
        [OutputCache(PolicyName = "Products")]
        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var product = await _service.GetBySlugAsync(slug);
            return product is null ? NotFound() : Ok(product);
        }

        // GET /api/products/newest
        [OutputCache(PolicyName = "Products")]
        [HttpGet("newest")]
        public async Task<IActionResult> GetCategoryNewestProducts([FromQuery] int categoryId, int amount)
        {
            var products = await _service.GetCategoryNewestAsync(categoryId, amount);
            return Ok(products);
        }

        // GET /api/products/topselling
        [OutputCache(PolicyName = "Products")]
        [HttpGet("topselling")]
        public async Task<IActionResult> GetCategoryTopSellingProducts([FromQuery] int categoryId, int amount)
        {
            var products = await _service.GetTopSellingProducts(categoryId, amount);
            return Ok(products);
        }

        // GET /api/products/search
        [HttpGet("search")]
        public async Task<IActionResult> SearchProducts([FromQuery] ProductListDTOs.ProductSearchParams searchParams)
        {
            if (string.IsNullOrWhiteSpace(searchParams.QueryPhrase))
                return BadRequest(new { message = "Search query is required" });

            var result = await _service.SearchAsync(searchParams);
            return Ok(result);
        }

        // GET /api/products/search/suggestions
        [OutputCache(Duration = 30)]
        [HttpGet("search/suggestions")]
        public async Task<IActionResult> GetSearchSuggestions([FromQuery] string q, [FromQuery] int limit = 10)
        {
            var suggestions = await _service.GetSuggestionsAsync(q, limit);
            return Ok(suggestions);
        }

        // GET /api/products/paginated
        [OutputCache(PolicyName = "ProductsPaginated")]
        [HttpGet("paginated")]
        public async Task<IActionResult> GetProductsPaginated([FromQuery] ProductListDTOs.ProductFilterParams filterParams)
        {
            var spec = ProductFilterSpec.From(filterParams);
            var result = await _service.GetPaginatedAsync(spec);
            return Ok(result);
        }

        // ────────────────────────────────────────────────── Admin endpoints ──────────────────────────────────────────────────
        // POST /api/products - Create a new Product
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] ProductDTOs.CreateProductRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return BadRequest(new { message = "Product Name is required" });

            if (string.IsNullOrWhiteSpace(request.Slug))
                return BadRequest(new { message = "Product Slug is required" });

            if (request.BasePrice <= 0)
                return BadRequest(new { message = "Price must be greater than 0" });

            if (request.CategoryId <= 0)
                return BadRequest(new { message = "Category is required" });

            try
            {
                var createdId = await _service.CreateAsync(request);

                await _cacheStore.EvictByTagAsync("products", default);  // removes every cached response tagged with "products"

                return Ok(new { message = "Product Created", id = createdId });
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

        // PUT /api/products/{id} - Update an existing Product
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] ProductDTOs.UpdateProductRequest request)
        {
            try
            {
                var updated = await _service.UpdateAsync(id, request);

                await _cacheStore.EvictByTagAsync("products", default);  // removes every cached response tagged with "products"

                return updated ? Ok(new { message = "Product updated", id }) : NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating product", error = ex.Message });
            }
        }

        // DELETE /api/products/{id} - Remove an existing Product from database
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);

            if (deleted)
            {
                await _cacheStore.EvictByTagAsync("products", default);  // removes every cached response tagged with "products"
            }

            return deleted ? NoContent() : NotFound();
        }
    }
}