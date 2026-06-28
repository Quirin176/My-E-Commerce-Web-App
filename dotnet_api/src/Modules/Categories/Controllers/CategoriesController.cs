using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;

using MediatR;
using WebApp_API.Modules.Categories.DTOs;
using WebApp_API.Modules.Categories.Commands.AddCategory;
using WebApp_API.Modules.Categories.Commands.UpdateCategory;
using WebApp_API.Modules.Categories.Queries.GetCategoryById;
using WebApp_API.Modules.Categories.Queries.GetCategoryBySlug;
using WebApp_API.Modules.Categories.Queries.GetAllCategories;
using WebApp_API.Infrastructure.OutputCache;

namespace WebApp_API.Modules.Categories.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase  // API endpoint: /api/categories
    {
        private readonly IMediator _mediator;
        private readonly IOutputCacheStore _cacheStore;

        public CategoriesController(IMediator mediator, IOutputCacheStore cacheStore)
        {
            _mediator = mediator;
            _cacheStore = cacheStore;
        }

        private async Task EvictCategoryCachesAsync()
        {
            var cancellationToken = HttpContext.RequestAborted;

            await _cacheStore.EvictByTagAsync(CategoryCachePolicies.CategoriesListTag, cancellationToken);
            await _cacheStore.EvictByTagAsync(CategoryCachePolicies.CategoryDetailsTag, cancellationToken);
        }

        // ──────────────────── Category Queries ────────────────────
        [OutputCache(PolicyName = CategoryCachePolicies.CategoriesList)]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _mediator.Send(new GetAllCategoriesQuery());
            return Ok(list);
        }

        [OutputCache(PolicyName = CategoryCachePolicies.CategoryDetailsById)]
        [HttpGet("id/{id:int}")]
        public async Task<IActionResult> GetCategoryByIdAsync(int id)
        {
            var category = await _mediator.Send(new GetCategoryByIdQuery(id));
            return category is null ? NotFound() : Ok(category);
        }

        [OutputCache(PolicyName = CategoryCachePolicies.CategoryDetailsBySlug)]
        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetCategoryBySlugAsync(string slug)
        {
            var category = await _mediator.Send(new GetCategoryBySlugQuery(slug));
            return category is null ? NotFound() : Ok(category);
        }

        // ──────────────────── Write Oparation ────────────────────
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateCategoryRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return BadRequest(new { message = "Name is required" });

            if (string.IsNullOrWhiteSpace(request.Slug))
                return BadRequest(new { message = "Slug is required" });

            try
            {
                await _mediator.Send(new AddCategoryCommand(request));

                await EvictCategoryCachesAsync();

                return Ok(new { message = "Category Created" });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating category", error = ex.Message });
            }
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCategoryRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return BadRequest(new { message = "Name is required" });

            if (string.IsNullOrWhiteSpace(request.Slug))
                return BadRequest(new { message = "Slug is required" });

            try
            {
                var updated = await _mediator.Send(new UpdateCategoryCommand(id, request));

                if (!updated) return NotFound();

                await EvictCategoryCachesAsync();

                return Ok(new { message = "Category updated" });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating category", error = ex.Message });
            }
        }
    }
}
