using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApp_API.Entities;
using WebApp_API.Services;

namespace WebApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase  // API endpoint: /api/categories
    {
        // private readonly AppDbContext _db;
        // public CategoriesController(AppDbContext db) => _db = db;

        // // GET: api/categories - get all categories information (id, name, slug)
        // [HttpGet]
        // public async Task<IActionResult> GetAll()
        // {
        //     var categories = await _db.Categories.ToListAsync();
        //     return Ok(categories);
        // }

        // // GET: api/categories/id/{id} - get information from a category (id, name, slug) by id
        // [HttpGet("id/{id:int}")]
        // public async Task<IActionResult> Get(int id)
        // {
        //     var category = await _db.Categories.FirstOrDefaultAsync(c => c.Id == id);
        //     if (category == null) return NotFound();
        //     return Ok(category);
        // }

        // // GET: api/categories/slug/{slug} - get information from a category (id, name, slug) by slug
        // [HttpGet("slug/{slug}")]
        // public async Task<IActionResult> GetBySlug(string slug)
        // {
        //     var category = await _db.Categories.FirstOrDefaultAsync(c => c.Slug == slug);
        //     if (category == null) return NotFound();
        //     return Ok(category);
        // }

        // // POST api/categories - create a new category
        // [HttpPost]
        // public async Task<IActionResult> Create([FromBody] CategoryDTOs.CreateCategoryRequest request)
        // {
        //     if (string.IsNullOrWhiteSpace(request.Name))
        //         return BadRequest(new { message = "Product Name is required" });

        //     if (string.IsNullOrWhiteSpace(request.Slug))
        //         return BadRequest(new { message = "Product Slug is required" });

        //     try
        //     {
        //         var newCategory = new Category
        //         {
        //             Name = request.Name,
        //             Slug = request.Slug
        //         };

        //         _db.Categories.Add(newCategory);
        //         await _db.SaveChangesAsync();

        //         return Ok(new
        //         {
        //             newCategory.Id,
        //             newCategory.Name,
        //             newCategory.Slug
        //         });
        //     }
        //     catch (ArgumentException ex)
        //     {
        //         return BadRequest(new { message = ex.Message });
        //     }
        //     catch (InvalidOperationException ex)
        //     {
        //         return BadRequest(new { message = ex.Message });
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new { message = "Error creating product", error = ex.Message });
        //     }
        // }
        private readonly ICategoryService _service;
        public CategoriesController(ICategoryService service) => _service = service;

        // ──────────────────── Category Queries ────────────────────
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.GetAllCategoriesAsync();
            return Ok(list);
        }

        [HttpGet("id/{id:int}")]
        public async Task<IActionResult> GetCategoryByIdAsync(int id)
        {
            var category = await _service.GetCategoryByIdAsync(id);
            return category is null ? NotFound() : Ok(category);
        }

        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetCategoryBySlugAsync(string slug)
        {
            var category = await _service.GetCategoryBySlugAsync(slug);
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
                await _service.AddCategoryAsync(request);
                return Ok(new { message = "Category created" });
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
        public async Task<IActionResult> Update(int id, [FromBody] CategoryDTOs.CreateCategoryRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return BadRequest(new { message = "Name is required" });

            if (string.IsNullOrWhiteSpace(request.Slug))
                return BadRequest(new { message = "Slug is required" });

            try
            {
                var updated = await _service.UpdateAsync(id, request);
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
