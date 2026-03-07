using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.Models;

namespace WebApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
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

        // GET: api/categories/{id} - get information from a category (id, name, slug) by id
        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var category = await _db.Categories.FirstOrDefaultAsync(c => c.Id == id);
            if (category == null) return NotFound();
            return Ok(category);
        }

        // GET: api/categories/{slug} - get information from a category (id, name, slug) by slug
        [HttpGet("{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var category = await _db.Categories.FirstOrDefaultAsync(c => c.Slug == slug);
            if (category == null) return NotFound();
            return Ok(category);
        }

        // POST api/categories - create a new category
        // [HttpPost]
        // public async Task<IActionResult> Create([FromBody] Category category)
        // {
        //     if (!ModelState.IsValid) return BadRequest(ModelState);

        //     await _db.Categories.AddAsync(category);
        //     await _db.SaveChangesAsync();
        //     return CreatedAtAction(nameof(Get), new { id = category.Id }, category);
        // }
    }
}
