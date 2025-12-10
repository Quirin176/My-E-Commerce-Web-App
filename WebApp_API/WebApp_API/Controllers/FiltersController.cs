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

        // Get all filters/options for a category by slug
        [HttpGet("category/{categorySlug}")]
        public async Task<IActionResult> GetFiltersByCategory(string categorySlug)
        {
            try
            {
                // Console.WriteLine($"[DEBUG] GetFiltersByCategory called with slug: {categorySlug}");

                if (string.IsNullOrWhiteSpace(categorySlug))
                    return BadRequest(new { message = "Category slug is required" });

                // Step 1: Find the category
                var category = await _db.Categories.FirstOrDefaultAsync(c => c.Slug == categorySlug);
                // Console.WriteLine($"[DEBUG] Category found: {(category != null ? category.Name : "NULL")}");
                
                if (category == null)
                {
                    // Console.WriteLine($"[DEBUG] Category with slug '{categorySlug}' not found. Returning empty list.");
                    return Ok(new List<object>());
                }

                // Console.WriteLine($"[DEBUG] Category ID: {category.Id}");

                // Step 2: Get ProductOptions for this category
                var productOptions = await _db.ProductOptions
                    .Where(o => o.CategoryId == category.Id)
                    .ToListAsync();

                // Console.WriteLine($"[DEBUG] Found {productOptions.Count} ProductOptions");

                // Step 3: For each option, get its values
                var result = new List<object>();

                foreach (var option in productOptions)
                {
                    // Console.WriteLine($"[DEBUG] Processing option: {option.Name} (ID: {option.Id})");

                    // Get option values for this specific option
                    var optionValues = await _db.ProductOptionValues
                        .Where(ov => ov.ProductOptionId == option.Id)
                        .Select(ov => new
                        {
                            optionValueId = ov.Id,
                            value = ov.Value
                        })
                        .ToListAsync();

                    // Console.WriteLine($"[DEBUG] Option {option.Name} has {optionValues.Count} values");

                    result.Add(new
                    {
                        optionId = option.Id,
                        name = option.Name,
                        optionValues = optionValues
                    });
                }

                // Console.WriteLine($"[DEBUG] Returning {result.Count} options with their values");
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] GetFiltersByCategory exception: {ex.Message}");
                Console.WriteLine($"[ERROR] Stack Trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                    Console.WriteLine($"[ERROR] Inner Exception: {ex.InnerException.Message}");
                
                return StatusCode(500, new { message = "Error loading filters", error = ex.Message });
            }
        }

        // Get options by category ID (for admin form)
        [HttpGet("category-id/{categoryId}")]
        public async Task<IActionResult> GetFiltersByCategoryId(int categoryId)
        {
            try
            {
                // Console.WriteLine($"[DEBUG] GetFiltersByCategoryId called with ID: {categoryId}");

                if (categoryId <= 0)
                    return BadRequest(new { message = "Valid category ID is required" });

                var category = await _db.Categories.FirstOrDefaultAsync(c => c.Id == categoryId);
                // Console.WriteLine($"[DEBUG] Category found: {(category != null ? category.Name : "NULL")}");
                
                if (category == null)
                    return Ok(new List<object>());

                var productOptions = await _db.ProductOptions
                    .Where(o => o.CategoryId == categoryId)
                    .ToListAsync();

                // Console.WriteLine($"[DEBUG] Found {productOptions.Count} ProductOptions");

                var result = new List<object>();

                foreach (var option in productOptions)
                {
                    var optionValues = await _db.ProductOptionValues
                        .Where(ov => ov.ProductOptionId == option.Id)
                        .Select(ov => new
                        {
                            optionValueId = ov.Id,
                            value = ov.Value
                        })
                        .ToListAsync();

                    result.Add(new
                    {
                        optionId = option.Id,
                        name = option.Name,
                        optionValues = optionValues
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] GetFiltersByCategoryId exception: {ex.Message}");
                Console.WriteLine($"[ERROR] Stack Trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                    Console.WriteLine($"[ERROR] Inner Exception: {ex.InnerException.Message}");
                
                return StatusCode(500, new { message = "Error loading filters", error = ex.Message });
            }
        }
    }
}
