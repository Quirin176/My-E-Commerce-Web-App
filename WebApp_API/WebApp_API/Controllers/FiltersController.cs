using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;

namespace WebApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FiltersController : ControllerBase
    {
        private readonly AppDbContext _db;
        public FiltersController(AppDbContext db) => _db = db;

        // Get all filters/options for a category
        [HttpGet("category/{categorySlug}")]
        public async Task<IActionResult> GetFiltersByCategory(string categorySlug)
        {
            var category = await _db.Categories.FirstOrDefaultAsync(c => c.Slug == categorySlug);
            if (category == null)
                return Ok(new List<object>());

            var options = await _db.ProductOptions
                .Where(o => o.CategoryId == category.Id)
                .Include(o => o.ProductOptionValues)
                .Select(o => new
                {
                    categoryId = category.Id,
                    name = o.Name,
                    optionId = o.Id,
                    optionValues = o.ProductOptionValues.Select(ov => new
                    {
                        optionValueId = ov.Id,
                        value = ov.Value
                    }).ToList()
                })
                .ToListAsync();

            return Ok(options);
        }

        // NEW: Get options by category ID (for admin form)
        [HttpGet("category-id/{categoryId}")]
        public async Task<IActionResult> GetFiltersByCategoryId(int categoryId)
        {
            var category = await _db.Categories.FirstOrDefaultAsync(c => c.Id == categoryId);
            if (category == null)
                return Ok(new List<object>());

            var options = await _db.ProductOptions
                .Where(o => o.CategoryId == categoryId)
                .Include(o => o.ProductOptionValues)
                .Select(o => new
                {
                    categoryId = category.Id,
                    name = o.Name,
                    optionId = o.Id,
                    optionValues = o.ProductOptionValues.Select(ov => new
                    {
                        optionValueId = ov.Id,
                        value = ov.Value
                    }).ToList()
                })
                .ToListAsync();

            return Ok(options);
        }
    }
}