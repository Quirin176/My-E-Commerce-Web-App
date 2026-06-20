using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using MediatR;
using WebApp_API.DTOs;
using WebApp_API.Features.Categories.Queries.GetCategoryById;
using WebApp_API.Features.Categories.Queries.GetCategoryBySlug;
using WebApp_API.Features.Categories.Queries.GetAllCategories;
using WebApp_API.Features.Categories.Commands.AddCategory;
using WebApp_API.Features.Categories.Commands.UpdateCategory;

namespace WebApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase  // API endpoint: /api/categories
    {
        private readonly IMediator _mediator;

        public CategoriesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // ──────────────────── Category Queries ────────────────────
        [OutputCache(PolicyName = "Categories")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _mediator.Send(new GetAllCategoriesQuery());
            return Ok(list);
        }

        [HttpGet("id/{id:int}")]
        public async Task<IActionResult> GetCategoryByIdAsync(int id)
        {
            var category = await _mediator.Send(new GetCategoryByIdQuery(id));
            return category is null ? NotFound() : Ok(category);
        }

        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetCategoryBySlugAsync(string slug)
        {
            var category = await _mediator.Send(new GetCategoryBySlugQuery(slug));
            return category is null ? NotFound() : Ok(category);
        }

        // ──────────────────── Write Oparation ────────────────────
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CategoryDTOs.CreateCategoryRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return BadRequest(new { message = "Name is required" });

            if (string.IsNullOrWhiteSpace(request.Slug))
                return BadRequest(new { message = "Slug is required" });

            try
            {
                await _mediator.Send(new AddCategoryCommand(request));
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
        public async Task<IActionResult> Update([FromBody] CategoryDTOs.UpdateCategoryRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return BadRequest(new { message = "Name is required" });

            if (string.IsNullOrWhiteSpace(request.Slug))
                return BadRequest(new { message = "Slug is required" });

            try
            {
                var updated = await _mediator.Send(new UpdateCategoryCommand(request));
                return updated ? Ok(new { message = "Category updated" }) : NotFound();
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
