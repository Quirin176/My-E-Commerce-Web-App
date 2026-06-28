using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;

using MediatR;
using WebApp_API.Modules.ProductOptions.DTOs;
using WebApp_API.Modules.ProductOptions.Commands.CreateProductOption;
using WebApp_API.Modules.ProductOptions.Commands.DeleteProductOption;
using WebApp_API.Modules.ProductOptions.Queries.GetProductOptionById;
using WebApp_API.Modules.ProductOptions.Queries.GetProductOptionsByCategoryId;
using WebApp_API.Modules.ProductOptions.Queries.GetProductOptionsByCategorySlug;

namespace WebApp_API.Modules.ProductOptions.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductOptionsController : ControllerBase  // API Endpoint: /api/productoptions
    {
        private readonly IMediator _mediator;
        private readonly IOutputCacheStore _cacheStore;

        public ProductOptionsController(IMediator mediator, IOutputCacheStore cacheStore)
        {
            _mediator = mediator;
            _cacheStore = cacheStore;
        }

        private async Task EvictProductOptionCachesAsync()
        {
            await _cacheStore.EvictByTagAsync("productoption-details", default);
            await _cacheStore.EvictByTagAsync("category-filters", default);
        }

        // GET: /api/productoptions/{id}
        [OutputCache(PolicyName = "ProductOptionDetails")]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var option = await _mediator.Send(new GetProductOptionByIdQuery(id));
            return option is null ? NotFound(new { message = "Product option not found" }) : Ok(option);
        }

        // GET: /api/productoptions/category/id/{categoryId}
        [OutputCache(PolicyName = "CategoryFiltersById")]
        [HttpGet("category/id/{categoryId:int}")]
        public async Task<IActionResult> GetByCategoryId(int categoryId)
        {
            if (categoryId <= 0)
                return BadRequest(new { message = "Valid category ID is required" });

            try
            {
                var options = await _mediator.Send(new GetProductOptionsByCategoryIdQuery(categoryId));
                return Ok(options);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error loading filters", error = ex.Message });
            }
        }

        // GET: /api/productoptions/category/slug/{categorySlug}
        [OutputCache(PolicyName = "CategoryFiltersBySlug")]
        [HttpGet("category/slug/{categorySlug}")]
        public async Task<IActionResult> GetByCategorySlug(string categorySlug)
        {
            if (string.IsNullOrWhiteSpace(categorySlug))
                return BadRequest(new { message = "Category slug is required" });

            try
            {
                var options = await _mediator.Send(new GetProductOptionsByCategorySlugQuery(categorySlug));
                return Ok(options);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error loading filters", error = ex.Message });
            }
        }

        // ────────────────────────────────────────────────── Admin endpoints ──────────────────────────────────────────────────
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
                var created = await _mediator.Send(new CreateProductOptionCommand(request));

                await EvictProductOptionCachesAsync();

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
                var deleted = await _mediator.Send(new DeleteProductOptionCommand(id));

                if (!deleted) return NotFound(new { message = "Product option not found" });

                await EvictProductOptionCachesAsync();

                return Ok(new { message = "Product option deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting product option", error = ex.Message });
            }
        }
    }
}