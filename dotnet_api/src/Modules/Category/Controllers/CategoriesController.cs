using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.Entities;

namespace WebApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase  // API endpoint: /api/categories
    {
        private readonly AppDbContext _db;
        public CategoriesController(AppDbContext db) => _db = db;

        // GET: api/categories - get all categories information (id, name, slug)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _db.Categories.ToListAsync();
            return Ok(categories);
        }

        // GET: api/categories/id/{id} - get information from a category (id, name, slug) by id
        [HttpGet("id/{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var category = await _db.Categories.FirstOrDefaultAsync(c => c.Id == id);
            if (category == null) return NotFound();
            return Ok(category);
        }

        // GET: api/categories/slug/{slug} - get information from a category (id, name, slug) by slug
        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var category = await _db.Categories.FirstOrDefaultAsync(c => c.Slug == slug);
            if (category == null) return NotFound();
            return Ok(category);
        }

        // POST api/categories - create a new category
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CategoryDTOs.CreateCategoryRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return BadRequest(new { message = "Product Name is required" });

            if (string.IsNullOrWhiteSpace(request.Slug))
                return BadRequest(new { message = "Product Slug is required" });

            try
            {
                var newCategory = new Category
                {
                    Name = request.Name,
                    Slug = request.Slug
                };

                _db.Categories.Add(newCategory);
                await _db.SaveChangesAsync();

                return Ok(new
                {
                    newCategory.Id,
                    newCategory.Name,
                    newCategory.Slug
                });
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
    }
}
